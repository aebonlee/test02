-- ================================================
-- Admin 사용자 정보 업데이트
-- ================================================
-- 작성일: 2025-12-01
-- 목적: Supabase Auth에서 생성한 사용자를 Admin으로 설정
-- ================================================

-- 1단계: Supabase Dashboard → Authentication → Users에서 먼저 사용자 생성
--   Email: wksun999@hanmail.net
--   Password: na5215900
--   Auto Confirm: ✅ 체크

-- 2단계: 생성된 사용자의 UUID를 아래 WHERE 절에 입력 후 실행

-- 기존 Mock Admin 삭제 (선택사항)
DELETE FROM users WHERE email = 'admin@ssalworks.com';

-- Auth에서 생성한 사용자를 users 테이블에 추가 또는 업데이트
INSERT INTO users (
    id,  -- Supabase Auth의 user.id (UUID)
    email,
    name,
    role,
    subscription_status,
    is_onboarding_completed,
    created_at
) VALUES (
    'AUTH에서-생성된-UUID를-여기에-붙여넣기',  -- 🔴 반드시 수정!
    'wksun999@hanmail.net',
    '선웅규',
    'admin',
    'active',
    true,
    NOW()
)
ON CONFLICT (id)
DO UPDATE SET
    email = 'wksun999@hanmail.net',
    name = '선웅규',
    role = 'admin',
    subscription_status = 'active',
    is_onboarding_completed = true;

-- ================================================
-- 완료 확인
-- ================================================
SELECT id, email, name, role, subscription_status
FROM users
WHERE email = 'wksun999@hanmail.net';
