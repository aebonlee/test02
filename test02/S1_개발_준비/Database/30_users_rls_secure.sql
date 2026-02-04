-- =====================================================
-- users 테이블 보안 RLS 정책 (프로덕션용)
-- =====================================================
-- 작성일: 2026-01-18
-- 목적: 권한 상승 공격 방지를 위한 보안 RLS 정책
-- 배경: 공격자가 role, credit_balance를 수정한 보안 침해 발생
-- =====================================================

-- =====================================================
-- 1. 기존 개발용 RLS 정책 삭제
-- =====================================================
DROP POLICY IF EXISTS "users_dev_select_all" ON users;
DROP POLICY IF EXISTS "users_dev_insert_all" ON users;
DROP POLICY IF EXISTS "users_dev_update_all" ON users;
DROP POLICY IF EXISTS "users_dev_delete_all" ON users;

-- 기존 정책도 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_insert_signup" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_update_own_safe" ON users;
DROP POLICY IF EXISTS "users_select_admin" ON users;

-- =====================================================
-- 2. RLS 활성화 확인
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. 보안 RLS 정책 적용
-- =====================================================

-- -------------------------------------------------
-- SELECT: 본인 정보 조회 가능, Admin은 전체 조회
-- -------------------------------------------------
CREATE POLICY "users_select_own"
    ON users
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = id
        OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 익명 사용자는 조회 불가
CREATE POLICY "users_select_anon_none"
    ON users
    FOR SELECT
    TO anon
    USING (false);

-- -------------------------------------------------
-- INSERT: 회원가입 시 본인 레코드만 생성 가능
-- 민감한 필드는 기본값으로만 설정
-- -------------------------------------------------
CREATE POLICY "users_insert_signup"
    ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = id
        AND role = 'user'  -- 무조건 일반 사용자로만 가입
        AND credit_balance = 0  -- 크레딧 0으로만 가입
        AND (builder_id IS NULL)  -- 빌더 ID 없이 가입
        AND (installation_fee_paid = false OR installation_fee_paid IS NULL)  -- 설치비 미납으로 가입
    );

-- -------------------------------------------------
-- UPDATE: 본인 정보만 수정, 민감 필드 수정 불가
-- -------------------------------------------------
CREATE POLICY "users_update_own_safe"
    ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- 민감 필드는 기존 값 유지 강제
        AND role = (SELECT role FROM users WHERE id = auth.uid())
        AND credit_balance = (SELECT credit_balance FROM users WHERE id = auth.uid())
        AND builder_id IS NOT DISTINCT FROM (SELECT builder_id FROM users WHERE id = auth.uid())
        AND installation_fee_paid = (SELECT installation_fee_paid FROM users WHERE id = auth.uid())
    );

-- -------------------------------------------------
-- Admin 전용 UPDATE: 모든 필드 수정 가능
-- -------------------------------------------------
CREATE POLICY "users_update_admin"
    ON users
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (true);

-- -------------------------------------------------
-- DELETE: 삭제 불가 (회원 탈퇴는 status 변경으로 처리)
-- -------------------------------------------------
-- DELETE 정책 없음 = 삭제 불가

-- =====================================================
-- 4. 적용 확인
-- =====================================================
SELECT
    'users 테이블 보안 RLS 정책 적용 완료!' as status,
    '✅ role, credit_balance, builder_id, installation_fee_paid 보호됨' as protection;

-- =====================================================
-- 보호되는 필드 목록:
-- =====================================================
-- 1. role - 사용자가 변경 불가 (admin 권한 상승 방지)
-- 2. credit_balance - 사용자가 변경 불가 (크레딧 조작 방지)
-- 3. builder_id - 사용자가 변경 불가 (빌더 ID 조작 방지)
-- 4. installation_fee_paid - 사용자가 변경 불가 (결제 상태 조작 방지)
--
-- 사용자가 수정 가능한 필드:
-- - name, nickname, avatar_url, phone, marketing_agreed 등
-- =====================================================
