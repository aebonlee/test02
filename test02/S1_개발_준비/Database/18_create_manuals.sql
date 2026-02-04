-- ================================================
-- 매뉴얼 테이블 생성
-- ================================================
-- 작성일: 2025-12-11
-- 목적: 플랫폼 사용 매뉴얼 저장
-- 관련 기획: 0_프로젝트_기획/1-8_Content_System/매뉴얼_제공_시스템.md
-- ================================================

-- 기존 테이블이 있으면 삭제
DROP TABLE IF EXISTS manuals CASCADE;

-- 매뉴얼 테이블 생성
CREATE TABLE manuals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 분류 체계
    category VARCHAR(100) NOT NULL,     -- 대분류 (예: "시작하기", "프로젝트 관리")
    subcategory VARCHAR(100),           -- 소분류 (예: "기본 설정")

    -- 매뉴얼 정보
    title VARCHAR(255) NOT NULL,        -- 제목
    description TEXT,                   -- 설명
    url VARCHAR(500) NOT NULL,          -- GitHub Pages URL

    -- 정렬 및 관리
    display_order INT DEFAULT 0,        -- 표시 순서
    is_active BOOLEAN DEFAULT true,     -- 활성화 여부

    -- 원본 파일 추적
    source_path VARCHAR(500),           -- MD 파일 경로
    content_hash VARCHAR(64),           -- MD 파일 해시 (변경 감지용)

    -- 메타데이터
    keywords TEXT[],                    -- 검색용 키워드 배열
    version VARCHAR(20),                -- 매뉴얼 버전

    -- 타임스탬프
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_manuals_category ON manuals(category);
CREATE INDEX idx_manuals_category_subcategory ON manuals(category, subcategory);
CREATE INDEX idx_manuals_display_order ON manuals(display_order);
CREATE INDEX idx_manuals_is_active ON manuals(is_active);
CREATE INDEX idx_manuals_source_path ON manuals(source_path);

-- 키워드 검색 인덱스 (GIN)
CREATE INDEX idx_manuals_keywords ON manuals USING GIN(keywords);

-- 전체 텍스트 검색 인덱스
CREATE INDEX idx_manuals_search ON manuals
    USING gin(to_tsvector('simple',
        coalesce(category, '') || ' ' ||
        coalesce(subcategory, '') || ' ' ||
        coalesce(title, '') || ' ' ||
        coalesce(description, '')
    ));

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_manuals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_update_manuals_updated_at
    BEFORE UPDATE ON manuals
    FOR EACH ROW
    EXECUTE FUNCTION update_manuals_updated_at();

-- ================================================
-- 테이블 구조
-- ================================================
-- manuals
--   id              UUID (PK)
--   category        VARCHAR(100) NOT NULL   -- 대분류
--   subcategory     VARCHAR(100)            -- 소분류
--   title           VARCHAR(255) NOT NULL   -- 제목
--   description     TEXT                    -- 설명
--   url             VARCHAR(500) NOT NULL   -- GitHub Pages URL
--   display_order   INT DEFAULT 0           -- 표시 순서
--   is_active       BOOLEAN DEFAULT true    -- 활성화 여부
--   source_path     VARCHAR(500)            -- MD 파일 경로
--   content_hash    VARCHAR(64)             -- 파일 해시
--   keywords        TEXT[]                  -- 검색 키워드
--   version         VARCHAR(20)             -- 매뉴얼 버전
--   created_at      TIMESTAMP
--   updated_at      TIMESTAMP
-- ================================================

-- ================================================
-- 완료!
-- ================================================
-- 실행 방법: Supabase SQL Editor에서 이 파일 내용 실행
-- 다음 단계: 19_manuals_rls_dev.sql (개발용 RLS 정책)
-- ================================================
