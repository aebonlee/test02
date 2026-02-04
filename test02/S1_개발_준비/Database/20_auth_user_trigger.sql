-- =====================================================
-- auth.users → public.users 자동 생성 트리거
-- =====================================================
-- 작성일: 2025-12-21
-- 목적: 사용자가 로그인/회원가입 시 public.users에 자동으로 레코드 생성
-- 실행 순서: 20번째 (12_extend_users_table.sql 이후)
-- =====================================================

-- =====================================================
-- 1. 고유한 user_id 생성 함수 (중복 체크 포함)
-- =====================================================
CREATE OR REPLACE FUNCTION generate_unique_user_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
    attempts INTEGER := 0;
    max_attempts INTEGER := 10;
BEGIN
    WHILE attempts < max_attempts LOOP
        result := '';
        FOR i IN 1..8 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;

        -- 중복 체크
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE user_id = result) THEN
            RETURN result;
        END IF;

        attempts := attempts + 1;
    END LOOP;

    -- 10번 시도 후에도 실패하면 UUID 기반 생성
    RETURN upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. auth.users INSERT 시 public.users에 자동 생성하는 함수
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        name,
        nickname,
        real_name,
        user_id,
        avatar_url,
        phone,
        marketing_agreed,
        role,
        subscription_status,
        credit_balance,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'nickname',
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        NEW.raw_user_meta_data->>'nickname',
        COALESCE(
            NEW.raw_user_meta_data->>'real_name',
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name'
        ),
        generate_unique_user_id(),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'phone',
        COALESCE((NEW.raw_user_meta_data->>'marketing_agreed')::boolean, false),
        'user',
        'free',
        0,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        phone = COALESCE(EXCLUDED.phone, public.users.phone),
        marketing_agreed = COALESCE(EXCLUDED.marketing_agreed, public.users.marketing_agreed),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. 트리거 생성 (auth.users에 INSERT 시 실행)
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. 기존 auth.users 중 public.users에 없는 사용자 동기화
-- =====================================================
INSERT INTO public.users (
    id,
    email,
    name,
    nickname,
    real_name,
    user_id,
    avatar_url,
    role,
    subscription_status,
    credit_balance,
    created_at,
    updated_at
)
SELECT
    au.id,
    au.email,
    COALESCE(
        au.raw_user_meta_data->>'nickname',
        au.raw_user_meta_data->>'full_name',
        au.raw_user_meta_data->>'name',
        split_part(au.email, '@', 1)
    ),
    au.raw_user_meta_data->>'nickname',
    COALESCE(
        au.raw_user_meta_data->>'real_name',
        au.raw_user_meta_data->>'full_name',
        au.raw_user_meta_data->>'name'
    ),
    generate_unique_user_id(),
    au.raw_user_meta_data->>'avatar_url',
    'user',
    'free',
    0,
    COALESCE(au.created_at, NOW()),
    NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- =====================================================
-- 5. 완료 확인
-- =====================================================
SELECT
    'auth → public.users 트리거 설정 완료!' as status,
    (SELECT COUNT(*) FROM auth.users) as auth_users_count,
    (SELECT COUNT(*) FROM public.users) as public_users_count;
