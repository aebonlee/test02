-- =====================================================
-- builder_id 컬럼 길이 수정
-- =====================================================
-- 작성일: 2025-12-29
-- 목적: BLDR-YYMM-NNN 형식 (13자) 지원을 위해 VARCHAR(12) → VARCHAR(20) 변경
-- =====================================================

-- builder_id 컬럼 길이 확장
ALTER TABLE users ALTER COLUMN builder_id TYPE VARCHAR(20);

-- 확인
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'builder_id';
