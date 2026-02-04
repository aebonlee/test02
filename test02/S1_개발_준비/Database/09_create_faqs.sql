-- =====================================================
-- FAQ 테이블 생성 (3단계 계층 구조)
-- =====================================================
-- 작성일: 2025-12-02
-- 목적: 자주 묻는 질문 관리 (학습용 콘텐츠와 동일한 구조)
-- 아젠다: #3 FAQ 시스템

-- 기존 테이블이 있으면 삭제 (개발 환경에서만 사용)
DROP TABLE IF EXISTS faqs CASCADE;

-- FAQ 테이블 생성
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 3단계 계층 구조 (학습용 콘텐츠와 동일)
    depth1 TEXT NOT NULL CHECK (char_length(depth1) > 0),  -- 대분류 (예: 로그인/회원가입)
    depth2 TEXT NOT NULL CHECK (char_length(depth2) > 0),  -- 중분류 (예: 계정 관리)
    depth3 TEXT NOT NULL CHECK (char_length(depth3) > 0),  -- 소분류 (예: 비밀번호 재설정)

    -- 답변 내용 (학습용 콘텐츠의 url 대신 answer 사용)
    answer TEXT NOT NULL CHECK (char_length(answer) > 0),  -- 답변 내용 (HTML 가능)

    -- 추가 정보 (선택)
    description TEXT,  -- 간단한 설명

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 인덱스 생성
-- 1. depth1별 조회 최적화
CREATE INDEX idx_faqs_depth1 ON faqs(depth1);

-- 2. depth1 + depth2 조합 조회 최적화
CREATE INDEX idx_faqs_depth1_depth2 ON faqs(depth1, depth2);

-- 3. 전체 텍스트 검색 (depth1 + depth2 + depth3)
CREATE INDEX idx_faqs_search ON faqs USING GIN (
    to_tsvector('english', depth1 || ' ' || depth2 || ' ' || depth3)
);

-- 4. 생성일 기준 정렬 최적화
CREATE INDEX idx_faqs_created_at ON faqs(created_at DESC);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER trigger_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_faqs_updated_at();

-- 테이블 코멘트
COMMENT ON TABLE faqs IS 'FAQ (자주 묻는 질문) 테이블 - 3단계 계층 구조';
COMMENT ON COLUMN faqs.depth1 IS '대분류 (예: 로그인/회원가입, Order 작성, AI 기능)';
COMMENT ON COLUMN faqs.depth2 IS '중분류 (예: 계정 관리, 회원가입, 보안 설정)';
COMMENT ON COLUMN faqs.depth3 IS '소분류 (예: 비밀번호 재설정, 이메일 인증 오류) - 실제 질문';
COMMENT ON COLUMN faqs.answer IS '답변 내용 (HTML 가능, DOMPurify로 정화 필요)';
COMMENT ON COLUMN faqs.description IS '추가 설명 (선택 사항)';
