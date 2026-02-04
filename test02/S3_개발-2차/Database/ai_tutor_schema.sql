-- AI Tutor Database Schema
-- Task: S3D1
-- Date: 2026-01-04
-- Description: RAG 기반 AI 튜터 시스템을 위한 데이터베이스 스키마

-- ============================================
-- 1. pgvector 확장 활성화
-- ============================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 2. content_embeddings 테이블 (학습 콘텐츠 임베딩)
-- ============================================
-- 225개 MD 파일 → ~675 청크 저장
CREATE TABLE IF NOT EXISTS content_embeddings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL,  -- 'tip', 'book', 'guide', 'briefing'
    content_id VARCHAR(100) NOT NULL,   -- 원본 파일 식별자
    chunk_index INTEGER NOT NULL,       -- 청크 순서
    title VARCHAR(500),                 -- 콘텐츠 제목
    content TEXT NOT NULL,              -- 청크 텍스트
    embedding vector(768) NOT NULL,     -- Gemini 임베딩 (768차원)
    metadata JSONB,                     -- 카테고리, 태그 등
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 벡터 검색용 인덱스 (IVFFlat)
CREATE INDEX IF NOT EXISTS idx_content_embeddings_vector
ON content_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 콘텐츠 타입별 인덱스
CREATE INDEX IF NOT EXISTS idx_content_embeddings_type ON content_embeddings(content_type);

-- 콘텐츠 ID별 인덱스
CREATE INDEX IF NOT EXISTS idx_content_embeddings_content_id ON content_embeddings(content_id);

-- ============================================
-- 3. tutor_conversations 테이블 (대화 세션)
-- ============================================
CREATE TABLE IF NOT EXISTS tutor_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200),                 -- 자동 생성 또는 사용자 지정
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자별 대화 목록 조회용 인덱스
CREATE INDEX IF NOT EXISTS idx_tutor_conversations_user ON tutor_conversations(user_id, updated_at DESC);

-- RLS 활성화
ALTER TABLE tutor_conversations ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 본인 대화만 조회
DROP POLICY IF EXISTS "Users can view own conversations" ON tutor_conversations;
CREATE POLICY "Users can view own conversations" ON tutor_conversations
    FOR SELECT USING (auth.uid() = user_id);

-- RLS 정책: 본인 대화 생성
DROP POLICY IF EXISTS "Users can insert own conversations" ON tutor_conversations;
CREATE POLICY "Users can insert own conversations" ON tutor_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS 정책: 본인 대화 수정
DROP POLICY IF EXISTS "Users can update own conversations" ON tutor_conversations;
CREATE POLICY "Users can update own conversations" ON tutor_conversations
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS 정책: 본인 대화 삭제
DROP POLICY IF EXISTS "Users can delete own conversations" ON tutor_conversations;
CREATE POLICY "Users can delete own conversations" ON tutor_conversations
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. tutor_messages 테이블 (개별 메시지)
-- ============================================
CREATE TABLE IF NOT EXISTS tutor_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES tutor_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,          -- 'user' 또는 'assistant'
    content TEXT NOT NULL,
    sources JSONB,                      -- 참조된 문서 정보 [{content_id, title, similarity}]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 대화별 메시지 조회용 인덱스
CREATE INDEX IF NOT EXISTS idx_tutor_messages_conversation ON tutor_messages(conversation_id, created_at ASC);

-- RLS 활성화
ALTER TABLE tutor_messages ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 본인 대화의 메시지만 조회
DROP POLICY IF EXISTS "Users can view messages of own conversations" ON tutor_messages;
CREATE POLICY "Users can view messages of own conversations" ON tutor_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tutor_conversations
            WHERE id = tutor_messages.conversation_id
            AND user_id = auth.uid()
        )
    );

-- RLS 정책: 본인 대화에 메시지 추가
DROP POLICY IF EXISTS "Users can insert messages to own conversations" ON tutor_messages;
CREATE POLICY "Users can insert messages to own conversations" ON tutor_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM tutor_conversations
            WHERE id = tutor_messages.conversation_id
            AND user_id = auth.uid()
        )
    );

-- ============================================
-- 5. 벡터 유사도 검색 함수
-- ============================================
CREATE OR REPLACE FUNCTION search_content(
    query_embedding vector(768),
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    content_type VARCHAR,
    content_id VARCHAR,
    title VARCHAR,
    content TEXT,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ce.id,
        ce.content_type,
        ce.content_id,
        ce.title,
        ce.content,
        1 - (ce.embedding <=> query_embedding) AS similarity
    FROM content_embeddings ce
    WHERE 1 - (ce.embedding <=> query_embedding) > match_threshold
    ORDER BY ce.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ============================================
-- 6. content_embeddings RLS (서비스 역할 전용 쓰기)
-- ============================================
ALTER TABLE content_embeddings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 읽기 허용
DROP POLICY IF EXISTS "Anyone can read content embeddings" ON content_embeddings;
CREATE POLICY "Anyone can read content embeddings" ON content_embeddings
    FOR SELECT USING (true);

-- 서비스 역할만 쓰기 가능 (임베딩 생성 스크립트용)
-- 참고: service_role은 RLS를 우회하므로 별도 정책 불필요

-- ============================================
-- 완료 확인용 쿼리
-- ============================================
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('content_embeddings', 'tutor_conversations', 'tutor_messages');
-- SELECT proname FROM pg_proc WHERE proname = 'search_content';
