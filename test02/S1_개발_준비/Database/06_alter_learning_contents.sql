-- ================================================
-- 학습용 콘텐츠 테이블 스키마 수정
-- ================================================
-- 작성일: 2025-12-11
-- 목적: 자동화 스크립트 지원을 위한 필드 추가
-- 변경사항:
--   - title 필드 추가 (콘텐츠 제목)
--   - source_path 필드 추가 (MD 파일 경로)
--   - content_hash 필드 추가 (변경 감지용 해시)
--   - is_active 필드 추가 (활성화 여부)
-- ================================================

-- 1. title 필드 추가 (콘텐츠 제목)
ALTER TABLE learning_contents
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- 기존 데이터가 있는 경우 depth3 또는 depth2 값으로 채움
UPDATE learning_contents
SET title = COALESCE(depth3, depth2, depth1)
WHERE title IS NULL;

-- title을 NOT NULL로 변경 (새 데이터는 필수)
-- 주의: 기존 데이터가 있으면 먼저 위 UPDATE 실행 필요
-- ALTER TABLE learning_contents ALTER COLUMN title SET NOT NULL;

-- 2. source_path 필드 추가 (MD 파일 경로 추적)
ALTER TABLE learning_contents
ADD COLUMN IF NOT EXISTS source_path VARCHAR(500);

-- 3. content_hash 필드 추가 (MD 파일 변경 감지용)
ALTER TABLE learning_contents
ADD COLUMN IF NOT EXISTS content_hash VARCHAR(64);

-- 4. is_active 필드 추가 (활성화/비활성화)
ALTER TABLE learning_contents
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 5. 검색 인덱스 업데이트 (title 포함)
DROP INDEX IF EXISTS idx_learning_contents_search;
CREATE INDEX idx_learning_contents_search ON learning_contents
    USING gin(to_tsvector('simple',
        coalesce(depth1, '') || ' ' ||
        coalesce(depth2, '') || ' ' ||
        coalesce(depth3, '') || ' ' ||
        coalesce(title, '') || ' ' ||
        coalesce(description, '')
    ));

-- 6. source_path 인덱스 (중복 방지 및 빠른 조회)
CREATE INDEX IF NOT EXISTS idx_learning_contents_source_path
    ON learning_contents(source_path);

-- 7. is_active 인덱스 (활성 콘텐츠만 조회 시 사용)
CREATE INDEX IF NOT EXISTS idx_learning_contents_is_active
    ON learning_contents(is_active);

-- ================================================
-- 변경 후 테이블 구조
-- ================================================
-- learning_contents
--   id              UUID (PK)
--   depth1          VARCHAR(100) NOT NULL   -- 대분류
--   depth2          VARCHAR(100)            -- 중분류
--   depth3          VARCHAR(100)            -- 소분류
--   title           VARCHAR(255)            -- 콘텐츠 제목 ★ 신규
--   url             VARCHAR(500)            -- GitHub Pages URL
--   description     TEXT                    -- 설명
--   display_order   INT DEFAULT 0           -- 표시 순서
--   source_path     VARCHAR(500)            -- MD 파일 경로 ★ 신규
--   content_hash    VARCHAR(64)             -- 파일 해시 ★ 신규
--   is_active       BOOLEAN DEFAULT true    -- 활성화 여부 ★ 신규
--   created_at      TIMESTAMP
--   updated_at      TIMESTAMP
-- ================================================

-- ================================================
-- 완료!
-- ================================================
-- 실행 방법: Supabase SQL Editor에서 이 파일 내용 실행
-- 다음 단계: 18_create_manuals.sql (매뉴얼 테이블 생성)
-- ================================================
