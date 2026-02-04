-- ================================================
-- 학습용 콘텐츠 테이블 생성
-- ================================================
-- 작성일: 2025-12-02
-- 목적: 학습용 콘텐츠 3단계 계층 구조 (depth1, depth2, depth3) 저장
-- ================================================

-- 기존 테이블이 있으면 삭제
DROP TABLE IF EXISTS learning_contents CASCADE;

-- 학습용 콘텐츠 테이블 생성
CREATE TABLE learning_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 3단계 계층 구조
    depth1 VARCHAR(100) NOT NULL,  -- 대분류 (예: "웹개발 기초")
    depth2 VARCHAR(100),            -- 중분류 (예: "HTML/CSS")
    depth3 VARCHAR(100),            -- 소분류 (예: "HTML 태그")

    -- 콘텐츠 정보
    url VARCHAR(500),               -- 학습 자료 링크 (YouTube, 문서 등)
    description TEXT,               -- 설명

    -- 표시 순서
    display_order INT DEFAULT 0,    -- 각 depth 내에서의 표시 순서

    -- 메타 정보
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX idx_learning_contents_depth1 ON learning_contents(depth1);
CREATE INDEX idx_learning_contents_depth2 ON learning_contents(depth1, depth2);
CREATE INDEX idx_learning_contents_depth3 ON learning_contents(depth1, depth2, depth3);
CREATE INDEX idx_learning_contents_display_order ON learning_contents(display_order);

-- 검색 인덱스 (전체 텍스트 검색용)
CREATE INDEX idx_learning_contents_search ON learning_contents
    USING gin(to_tsvector('simple', coalesce(depth1, '') || ' ' ||
                                     coalesce(depth2, '') || ' ' ||
                                     coalesce(depth3, '')));

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_learning_contents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_update_learning_contents_updated_at
    BEFORE UPDATE ON learning_contents
    FOR EACH ROW
    EXECUTE FUNCTION update_learning_contents_updated_at();

-- ================================================
-- 완료!
-- ================================================
-- 다음 단계: RLS 정책 설정 (07_learning_contents_rls.sql)
-- ================================================
