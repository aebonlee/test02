-- ================================================
-- 학습용 콘텐츠 RLS (개발 환경용)
-- ================================================
-- 작성일: 2025-12-03
-- 목적: 개발/테스트 환경에서 Admin Dashboard 작동을 위해 임시로 anon 접근 허용
-- ⚠️ 주의: 프로덕션 배포 시 원래 RLS 정책으로 변경 필요
-- ================================================

-- RLS 활성화
ALTER TABLE learning_contents ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Anyone can view learning contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can insert learning contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can update learning contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can delete learning contents" ON learning_contents;

-- ================================================
-- 개발 환경용 정책: 모든 작업 허용
-- ================================================

-- SELECT: 모든 사용자 가능
CREATE POLICY "Anyone can view learning contents" ON learning_contents
    FOR SELECT
    USING (true);

-- INSERT: anon 포함 모든 사용자 가능 (개발 환경용)
CREATE POLICY "Anyone can insert learning contents (DEV)" ON learning_contents
    FOR INSERT
    WITH CHECK (true);

-- UPDATE: anon 포함 모든 사용자 가능 (개발 환경용)
CREATE POLICY "Anyone can update learning contents (DEV)" ON learning_contents
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- DELETE: anon 포함 모든 사용자 가능 (개발 환경용)
CREATE POLICY "Anyone can delete learning contents (DEV)" ON learning_contents
    FOR DELETE
    USING (true);

-- ================================================
-- 완료!
-- ================================================
-- ⚠️ 경고: 이 정책은 개발/테스트용입니다!
-- 프로덕션 배포 전에 07_learning_contents_rls.sql로 교체하세요!
-- ================================================
