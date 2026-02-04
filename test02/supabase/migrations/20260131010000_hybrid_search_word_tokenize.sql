-- Hybrid Search v3: 단어별 토큰화 + Title 부스트
-- "콘솔이 뭐야?" → "콘솔이", "뭐야?" 각각 title ILIKE 체크
-- + title trigram similarity 추가

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
    title_boost float := 0.15;
    words text[];
    w text;
    title_ilike_clause text := '';
BEGIN
    trimmed_query := TRIM(query_text);
    query_len := LENGTH(trimmed_query);

    -- 쿼리 텍스트가 비어있으면 벡터 검색만 수행
    IF query_len = 0 THEN
        RETURN QUERY
        SELECT
            ce.id, ce.content_type, ce.content_id, ce.title, ce.content,
            (1 - (ce.embedding <=> query_embedding))::float AS similarity,
            0.0::float AS keyword_similarity,
            (1 - (ce.embedding <=> query_embedding))::float AS combined_score
        FROM content_embeddings ce
        WHERE 1 - (ce.embedding <=> query_embedding) > match_threshold
        ORDER BY ce.embedding <=> query_embedding
        LIMIT match_count;
        RETURN;
    END IF;

    -- 짧은 쿼리 (<4자): ILIKE 폴백 + 벡터 + title 부스트
    IF query_len < 4 THEN
        RETURN QUERY
        SELECT
            ce.id, ce.content_type, ce.content_id, ce.title, ce.content,
            (1 - (ce.embedding <=> query_embedding))::float AS similarity,
            (
                CASE WHEN ce.search_text ILIKE '%' || trimmed_query || '%' THEN 1.0 ELSE 0.0 END
                + CASE WHEN ce.title::text ILIKE '%' || trimmed_query || '%' THEN title_boost / keyword_weight ELSE 0.0 END
            )::float AS keyword_similarity,
            (
                vector_weight * (1 - (ce.embedding <=> query_embedding))
                + keyword_weight * CASE WHEN ce.search_text ILIKE '%' || trimmed_query || '%' THEN 1.0 ELSE 0.0 END
                + CASE WHEN ce.title::text ILIKE '%' || trimmed_query || '%' THEN title_boost ELSE 0.0 END
            )::float AS combined_score
        FROM content_embeddings ce
        WHERE
            (1 - (ce.embedding <=> query_embedding) > match_threshold)
            OR (ce.search_text ILIKE '%' || trimmed_query || '%')
        ORDER BY combined_score DESC
        LIMIT match_count;
        RETURN;
    END IF;

    -- 일반 쿼리 (>=4자): pg_trgm + 벡터 + title trigram + 단어별 title ILIKE
    -- title_sim: title 필드에 대한 trigram 유사도 (search_text보다 훨씬 효과적)
    -- word_title_match: 쿼리의 각 단어(2자 이상)가 title에 포함되는지 체크
    RETURN QUERY
    SELECT
        ce.id, ce.content_type, ce.content_id, ce.title, ce.content,
        (1 - (ce.embedding <=> query_embedding))::float AS similarity,
        (
            COALESCE(similarity(ce.search_text, trimmed_query), 0.0)
            + COALESCE(similarity(ce.title::text, trimmed_query), 0.0) * (title_boost / keyword_weight)
            + (
                SELECT COUNT(*)::float * 0.3
                FROM unnest(string_to_array(
                    regexp_replace(trimmed_query, '[?!.,;:~\s]+', ' ', 'g'),
                    ' '
                )) AS word
                WHERE length(word) >= 2
                AND ce.title::text ILIKE '%' || word || '%'
            )
        )::float AS keyword_similarity,
        (
            vector_weight * (1 - (ce.embedding <=> query_embedding))
            + keyword_weight * COALESCE(similarity(ce.search_text, trimmed_query), 0.0)
            + title_boost * COALESCE(similarity(ce.title::text, trimmed_query), 0.0)
            + (
                SELECT COUNT(*)::float * 0.1
                FROM unnest(string_to_array(
                    regexp_replace(trimmed_query, '[?!.,;:~\s]+', ' ', 'g'),
                    ' '
                )) AS word
                WHERE length(word) >= 2
                AND ce.title::text ILIKE '%' || word || '%'
            )
        )::float AS combined_score
    FROM content_embeddings ce
    WHERE
        (1 - (ce.embedding <=> query_embedding) > match_threshold)
        OR (similarity(ce.search_text, trimmed_query) > 0.05)
        OR (similarity(ce.title::text, trimmed_query) > 0.05)
        OR (ce.title::text ILIKE '%' || trimmed_query || '%')
    ORDER BY combined_score DESC
    LIMIT match_count;
END;
$func$;
