-- Hybrid Search Migration: pg_trgm + Vector Search
-- 목적: 벡터 검색 + 키워드 매칭 결합으로 짧은 쿼리 검색 향상

-- 1. pg_trgm 확장 활성화
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. search_text GENERATED 컬럼 추가 (title + content 결합)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'content_embeddings' AND column_name = 'search_text'
    ) THEN
        ALTER TABLE content_embeddings
        ADD COLUMN search_text TEXT
        GENERATED ALWAYS AS (COALESCE(title::text, '') || ' ' || COALESCE(content, '')) STORED;
    END IF;
END $$;

-- 3. GIN 트라이그램 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_content_embeddings_search_trgm
ON content_embeddings USING gin (search_text gin_trgm_ops);

-- 4. hybrid_search_content() RPC 함수 생성
CREATE OR REPLACE FUNCTION hybrid_search_content(
    query_embedding vector(768),
    query_text text DEFAULT '',
    match_threshold float DEFAULT 0.3,
    match_count int DEFAULT 10,
    vector_weight float DEFAULT 0.7,
    keyword_weight float DEFAULT 0.3
)
RETURNS TABLE (
    id UUID,
    content_type VARCHAR,
    content_id VARCHAR,
    title VARCHAR,
    content TEXT,
    similarity float,
    keyword_similarity float,
    combined_score float
)
LANGUAGE plpgsql
AS $func$
DECLARE
    trimmed_query text;
    query_len int;
BEGIN
    trimmed_query := TRIM(query_text);
    query_len := LENGTH(trimmed_query);

    -- 쿼리 텍스트가 비어있으면 벡터 검색만 수행
    IF query_len = 0 THEN
        RETURN QUERY
        SELECT
            ce.id,
            ce.content_type,
            ce.content_id,
            ce.title,
            ce.content,
            (1 - (ce.embedding <=> query_embedding))::float AS similarity,
            0.0::float AS keyword_similarity,
            (1 - (ce.embedding <=> query_embedding))::float AS combined_score
        FROM content_embeddings ce
        WHERE 1 - (ce.embedding <=> query_embedding) > match_threshold
        ORDER BY ce.embedding <=> query_embedding
        LIMIT match_count;
        RETURN;
    END IF;

    -- 짧은 쿼리 (<4자): ILIKE 폴백 + 벡터 결합
    IF query_len < 4 THEN
        RETURN QUERY
        SELECT
            ce.id,
            ce.content_type,
            ce.content_id,
            ce.title,
            ce.content,
            (1 - (ce.embedding <=> query_embedding))::float AS similarity,
            CASE
                WHEN ce.search_text ILIKE '%' || trimmed_query || '%' THEN 1.0
                ELSE 0.0
            END::float AS keyword_similarity,
            (
                vector_weight * (1 - (ce.embedding <=> query_embedding)) +
                keyword_weight * CASE
                    WHEN ce.search_text ILIKE '%' || trimmed_query || '%' THEN 1.0
                    ELSE 0.0
                END
            )::float AS combined_score
        FROM content_embeddings ce
        WHERE
            (1 - (ce.embedding <=> query_embedding) > match_threshold)
            OR (ce.search_text ILIKE '%' || trimmed_query || '%')
        ORDER BY combined_score DESC
        LIMIT match_count;
        RETURN;
    END IF;

    -- 일반 쿼리 (>=4자): pg_trgm similarity + 벡터 결합
    RETURN QUERY
    SELECT
        ce.id,
        ce.content_type,
        ce.content_id,
        ce.title,
        ce.content,
        (1 - (ce.embedding <=> query_embedding))::float AS similarity,
        COALESCE(similarity(ce.search_text, trimmed_query), 0.0)::float AS keyword_similarity,
        (
            vector_weight * (1 - (ce.embedding <=> query_embedding)) +
            keyword_weight * COALESCE(similarity(ce.search_text, trimmed_query), 0.0)
        )::float AS combined_score
    FROM content_embeddings ce
    WHERE
        (1 - (ce.embedding <=> query_embedding) > match_threshold)
        OR (similarity(ce.search_text, trimmed_query) > 0.05)
    ORDER BY combined_score DESC
    LIMIT match_count;
END;
$func$;
