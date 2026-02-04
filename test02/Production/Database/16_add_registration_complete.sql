-- =====================================================
-- projects 테이블에 registration_complete 컬럼 추가
-- =====================================================
-- 작성일: 2025-12-31
-- 목적: Dev Package 다운로드 완료 여부 추적
-- 실행 순서: 16번째
-- =====================================================

-- =====================================================
-- 1. registration_complete 컬럼 추가
-- =====================================================
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS registration_complete BOOLEAN DEFAULT false;

-- 컬럼 설명 추가
COMMENT ON COLUMN projects.registration_complete IS 'Dev Package 다운로드 완료 여부. true면 등록 완료, false면 등록 진행 중';

-- =====================================================
-- 2. 기존 데이터 업데이트 (이미 존재하는 프로젝트는 완료로 간주)
-- =====================================================
-- 이미 등록된 프로젝트는 모두 registration_complete = true로 설정
-- 단, wksun999@naver.com (user_id: OX7EHFOS)의 프로젝트는 false로 유지 (미완료)
UPDATE projects
SET registration_complete = true
WHERE registration_complete IS NULL OR registration_complete = false;

-- wksun999@naver.com 계정의 프로젝트는 false로 설정 (등록 미완료)
UPDATE projects
SET registration_complete = false
WHERE user_id = 'OX7EHFOS';

-- =====================================================
-- 완료 확인
-- =====================================================
SELECT 'registration_complete 컬럼 추가 완료!' as status;
SELECT project_id, project_name, user_id, registration_complete FROM projects;
