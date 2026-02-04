-- =====================================================
-- users 테이블 RLS 정책 (개발용)
-- =====================================================
-- 작성일: 2025-12-10
-- 목적: Admin Dashboard 개발/테스트용 RLS 정책
-- 실행 순서: 13번째 (12_extend_users_table.sql 이후)
-- ⚠️ 중요: 프로덕션 배포 전 13_users_rls.sql로 교체 필수!
-- =====================================================

-- =====================================================
-- 1. 기존 RLS 정책 삭제
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_insert_signup" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_select_admin" ON users;
DROP POLICY IF EXISTS "users_dev_select_all" ON users;
DROP POLICY IF EXISTS "users_dev_insert_all" ON users;
DROP POLICY IF EXISTS "users_dev_update_all" ON users;
DROP POLICY IF EXISTS "users_dev_delete_all" ON users;

-- =====================================================
-- 2. RLS 활성화 확인
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. 개발용 RLS 정책 (anon 역할 허용)
-- =====================================================

-- SELECT: 모든 사용자 조회 가능
CREATE POLICY "users_dev_select_all"
    ON users
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- INSERT: 회원가입 허용
CREATE POLICY "users_dev_insert_all"
    ON users
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- UPDATE: 모든 수정 허용
CREATE POLICY "users_dev_update_all"
    ON users
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- DELETE: 삭제 불가 (회원 탈퇴는 status 변경으로 처리)
-- DELETE 정책 없음 = 삭제 불가

-- =====================================================
-- ⚠️ 프로덕션 배포 전 필수 작업
-- =====================================================
-- 1. 이 파일의 정책 삭제:
--    DROP POLICY IF EXISTS "users_dev_select_all" ON users;
--    DROP POLICY IF EXISTS "users_dev_insert_all" ON users;
--    DROP POLICY IF EXISTS "users_dev_update_all" ON users;
--
-- 2. 프로덕션 정책 적용 (13_users_rls.sql):
--    - SELECT: 본인 정보만 / Admin은 전체
--    - INSERT: 회원가입 시 허용
--    - UPDATE: 본인 정보만 수정
--    - DELETE: 불가
-- =====================================================

-- 완료 확인
SELECT
    'users 테이블 개발용 RLS 정책 적용 완료!' as status,
    '⚠️ 프로덕션 배포 전 교체 필수!' as warning;
