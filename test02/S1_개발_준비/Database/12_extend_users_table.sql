-- =====================================================
-- users 테이블 확장 (Agenda #4: 회원가입 & 인증 시스템)
-- =====================================================
-- 작성일: 2025-12-10
-- 목적: 기존 users 테이블에 회원가입/인증에 필요한 컬럼 추가
-- 실행 순서: 12번째 (00_users_table.sql 이후)
-- =====================================================

-- =====================================================
-- 1. 새 컬럼 추가
-- =====================================================

-- user_id: 8자리 영숫자 (사용자에게 표시되는 ID)
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_id VARCHAR(8) UNIQUE;

-- nickname: 닉네임 (2-20자)
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(20) UNIQUE;

-- real_name: 실명 (입금자명 확인용)
ALTER TABLE users ADD COLUMN IF NOT EXISTS real_name VARCHAR(50);

-- 설치비 관련
ALTER TABLE users ADD COLUMN IF NOT EXISTS installation_fee_paid BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS installation_date TIMESTAMPTZ;

-- 플랫폼 이용료 관련
ALTER TABLE users ADD COLUMN IF NOT EXISTS platform_fee_start_date TIMESTAMPTZ;

-- 크레딧 잔액
ALTER TABLE users ADD COLUMN IF NOT EXISTS credit_balance INTEGER DEFAULT 0;

-- phone: 연락처 (선택)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- marketing_agreed: 마케팅 동의 여부
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_agreed BOOLEAN DEFAULT false;

-- =====================================================
-- 2. subscription_status 값 변경
-- =====================================================
-- 기존: 'onboarding', 'active', 'inactive'
-- 변경: 'free', 'active', 'paused', 'suspended', 'cancelled'

-- 기존 값 마이그레이션
UPDATE users SET subscription_status = 'free' WHERE subscription_status = 'inactive';
UPDATE users SET subscription_status = 'active' WHERE subscription_status = 'onboarding';

-- =====================================================
-- 3. 인덱스 추가
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_installation_fee_paid ON users(installation_fee_paid);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- =====================================================
-- 4. user_id 자동 생성 함수
-- =====================================================
CREATE OR REPLACE FUNCTION generate_user_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. 기존 데이터에 user_id 할당 (없는 경우)
-- =====================================================
UPDATE users
SET user_id = generate_user_id()
WHERE user_id IS NULL;

-- =====================================================
-- 6. updated_at 자동 업데이트 트리거 (없으면 생성)
-- =====================================================
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- =====================================================
-- 완료 확인
-- =====================================================
SELECT
    'users 테이블 확장 완료!' as status,
    COUNT(*) as total_users,
    COUNT(user_id) as users_with_id,
    COUNT(CASE WHEN installation_fee_paid THEN 1 END) as paid_users
FROM users;
