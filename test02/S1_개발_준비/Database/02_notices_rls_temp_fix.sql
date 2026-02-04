-- ================================================
-- 공지사항 RLS 임시 수정
-- ================================================
-- 작성일: 2025-12-01
-- 목적: Admin Dashboard 테스트를 위해 임시로 모든 사용자가 CRUD 가능하도록 설정
-- 주의: 실제 운영 시에는 admin 권한 체크 필요
-- ================================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Temporary: Anyone can insert notices" ON notices;
DROP POLICY IF EXISTS "Temporary: Anyone can update notices" ON notices;
DROP POLICY IF EXISTS "Temporary: Anyone can delete notices" ON notices;

-- 임시 정책: 모든 사용자가 생성 가능 (테스트용)
CREATE POLICY "Temporary: Anyone can insert notices" ON notices
    FOR INSERT WITH CHECK (true);

-- 임시 정책: 모든 사용자가 수정 가능 (테스트용)
CREATE POLICY "Temporary: Anyone can update notices" ON notices
    FOR UPDATE USING (true);

-- 임시 정책: 모든 사용자가 삭제 가능 (테스트용)
CREATE POLICY "Temporary: Anyone can delete notices" ON notices
    FOR DELETE USING (true);

-- ================================================
-- 완료!
-- ================================================
-- 테스트 완료 후 01_notices_tables.sql의 원래 정책으로 되돌리세요:
-- - Admin만 INSERT/UPDATE/DELETE 가능
-- - 모든 사용자는 SELECT만 가능
-- ================================================
