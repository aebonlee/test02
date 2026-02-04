-- =====================================================
-- 빌더 계정 아이디 생성 시 50,000 크레딧 자동 지급 트리거
-- =====================================================
-- 작성일: 2025-12-30
-- 목적: user_id(빌더 계정 아이디)가 처음 생성될 때 초기 크레딧 50,000 자동 지급
-- 실행 순서: 29번째
-- =====================================================

-- =====================================================
-- 1. 빌더 계정 아이디 생성 시 크레딧 지급 함수
-- =====================================================
CREATE OR REPLACE FUNCTION grant_builder_initial_credit()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- user_id가 NULL에서 값이 생성될 때 (빌더 계정 아이디 최초 부여)
    IF (OLD.user_id IS NULL AND NEW.user_id IS NOT NULL) THEN
        -- 50,000 크레딧 지급
        NEW.credit_balance := COALESCE(OLD.credit_balance, 0) + 50000;

        -- credit_history에 기록
        INSERT INTO credit_history (
            user_id,
            amount,
            balance_after,
            type,
            description,
            created_at
        ) VALUES (
            NEW.id,
            50000,
            NEW.credit_balance,
            'grant',
            '빌더 계정 아이디 생성 - 초기 크레딧 지급',
            NOW()
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. 트리거 생성 (users UPDATE 시 실행)
-- =====================================================
DROP TRIGGER IF EXISTS trigger_builder_initial_credit ON users;

CREATE TRIGGER trigger_builder_initial_credit
BEFORE UPDATE ON users
FOR EACH ROW
WHEN (OLD.user_id IS NULL AND NEW.user_id IS NOT NULL)
EXECUTE FUNCTION grant_builder_initial_credit();

-- =====================================================
-- 3. 완료 확인
-- =====================================================
SELECT '빌더 계정 아이디 생성 시 크레딧 자동 지급 트리거 설정 완료!' as status;

-- =====================================================
-- 동작 방식:
-- 1. Admin이 users 테이블에서 user_id를 NULL → '12345678' 등으로 설정
-- 2. 자동으로 credit_balance에 50,000 추가됨
-- 3. credit_history에 '빌더 계정 아이디 생성 - 초기 크레딧 지급' 기록
-- =====================================================
