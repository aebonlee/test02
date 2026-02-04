-- =====================================================
-- users 테이블 샘플 데이터 (Agenda #4)
-- =====================================================
-- 작성일: 2025-12-10
-- 목적: 테스트용 회원 데이터 (확장된 컬럼 포함)
-- 실행 순서: 14번째 (13_users_rls_dev.sql 이후)
-- =====================================================

-- =====================================================
-- 1. 기존 샘플 데이터 업데이트 (확장 컬럼 채우기)
-- =====================================================

-- 관리자
UPDATE users
SET
    user_id = 'ADMIN001',
    nickname = '관리자',
    real_name = '김관리',
    installation_fee_paid = true,
    installation_date = NOW() - INTERVAL '180 days',
    platform_fee_start_date = NOW() - INTERVAL '150 days',
    credit_balance = 100000,
    marketing_agreed = true
WHERE email = 'admin@ssalworks.com';

-- 일반 사용자 1
UPDATE users
SET
    user_id = 'A1B2C3D4',
    nickname = '철수씨',
    real_name = '김철수',
    installation_fee_paid = true,
    installation_date = NOW() - INTERVAL '90 days',
    platform_fee_start_date = NOW() - INTERVAL '60 days',
    credit_balance = 15000,
    marketing_agreed = true
WHERE email = 'user1@example.com';

-- 일반 사용자 2
UPDATE users
SET
    user_id = 'E5F6G7H8',
    nickname = '영희님',
    real_name = '이영희',
    installation_fee_paid = false,
    credit_balance = 0,
    marketing_agreed = false
WHERE email = 'user2@example.com';

-- =====================================================
-- 2. 추가 샘플 데이터 (10명)
-- =====================================================

INSERT INTO users (
    id, email, name, user_id, nickname, real_name,
    subscription_status, installation_fee_paid, installation_date,
    platform_fee_start_date, credit_balance, role, marketing_agreed, created_at
) VALUES
-- 유료 활성 회원들
(
    uuid_generate_v4(),
    'sunny@example.com',
    '써니',
    'SUN12345',
    '써니',
    '박써니',
    'active',
    true,
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '15 days',
    25000,
    'user',
    true,
    NOW() - INTERVAL '50 days'
),
(
    uuid_generate_v4(),
    'moonlight@example.com',
    '달빛',
    'MOON6789',
    '달빛',
    '최달빛',
    'active',
    true,
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '30 days',
    18000,
    'user',
    true,
    NOW() - INTERVAL '65 days'
),
(
    uuid_generate_v4(),
    'star@example.com',
    '별하늘',
    'STAR1234',
    '별하늘',
    '정별하',
    'active',
    true,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '1 day',
    32000,
    'user',
    false,
    NOW() - INTERVAL '35 days'
),

-- 무료 회원들 (설치비 미납)
(
    uuid_generate_v4(),
    'wind@example.com',
    '바람',
    'WIND5678',
    '바람이',
    '강바람',
    'free',
    false,
    NULL,
    NULL,
    0,
    'user',
    true,
    NOW() - INTERVAL '20 days'
),
(
    uuid_generate_v4(),
    'cloud@example.com',
    '구름',
    'CLOU9012',
    '구름씨',
    '한구름',
    'free',
    false,
    NULL,
    NULL,
    5000,
    'user',
    false,
    NOW() - INTERVAL '15 days'
),
(
    uuid_generate_v4(),
    'river@example.com',
    '강물',
    'RIVE3456',
    '강물님',
    '윤강물',
    'free',
    false,
    NULL,
    NULL,
    0,
    'user',
    true,
    NOW() - INTERVAL '10 days'
),

-- 일시정지 회원
(
    uuid_generate_v4(),
    'pause@example.com',
    '쉬는중',
    'PAUS7890',
    '쉬는중',
    '임휴식',
    'paused',
    true,
    NOW() - INTERVAL '120 days',
    NOW() - INTERVAL '90 days',
    8000,
    'user',
    true,
    NOW() - INTERVAL '125 days'
),

-- 정지된 회원
(
    uuid_generate_v4(),
    'suspended@example.com',
    '정지됨',
    'SUSP1234',
    '정지됨',
    '조정지',
    'suspended',
    true,
    NOW() - INTERVAL '150 days',
    NOW() - INTERVAL '120 days',
    0,
    'user',
    false,
    NOW() - INTERVAL '155 days'
),

-- 오늘 가입한 회원들
(
    uuid_generate_v4(),
    'newuser1@example.com',
    '신규1',
    'NEW11111',
    '새싹1',
    '김새싹',
    'free',
    false,
    NULL,
    NULL,
    0,
    'user',
    true,
    NOW()
),
(
    uuid_generate_v4(),
    'newuser2@example.com',
    '신규2',
    'NEW22222',
    '새싹2',
    '이새싹',
    'free',
    false,
    NULL,
    NULL,
    0,
    'user',
    false,
    NOW()
)

ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 3. 결과 확인
-- =====================================================
SELECT
    '샘플 데이터 삽입 완료!' as status,
    COUNT(*) as total_users,
    SUM(CASE WHEN subscription_status = 'free' THEN 1 ELSE 0 END) as free_users,
    SUM(CASE WHEN subscription_status = 'active' THEN 1 ELSE 0 END) as active_users,
    SUM(CASE WHEN installation_fee_paid THEN 1 ELSE 0 END) as paid_users,
    SUM(credit_balance) as total_credits
FROM users;
