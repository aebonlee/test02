-- =====================================================
-- 테스트 사용자 샘플 데이터
-- =====================================================
-- 작성일: 2025-12-11
-- 목적: Billing 테스트를 위한 테스트 사용자 생성
-- 실행 순서: 이 파일을 먼저 실행한 후 19~22번 파일 실행
-- =====================================================

-- 기존 테스트 사용자 삭제 (있으면)
DELETE FROM public.users WHERE user_id IN ('TEST0001', 'TEST0002');

-- ===========================================
-- 테스트 사용자 생성
-- ===========================================

-- TEST0001: 일반 테스트 사용자
INSERT INTO public.users (
    user_id,
    email,
    name,
    phone,
    company_name,
    company_type,
    employee_count,
    industry,
    created_at
) VALUES (
    'TEST0001',
    'test001@example.com',
    '테스트사용자1',
    '010-1234-5678',
    '테스트회사1',
    'corporation',
    '10-50',
    'IT/소프트웨어',
    NOW() - INTERVAL '6 months'
);

-- TEST0002: 두 번째 테스트 사용자
INSERT INTO public.users (
    user_id,
    email,
    name,
    phone,
    company_name,
    company_type,
    employee_count,
    industry,
    created_at
) VALUES (
    'TEST0002',
    'test002@example.com',
    '테스트사용자2',
    '010-9876-5432',
    '테스트회사2',
    'startup',
    '1-10',
    '제조업',
    NOW() - INTERVAL '3 months'
);

-- ===========================================
-- 완료 확인
-- ===========================================
SELECT '테스트 사용자 생성 완료' as status;

-- 생성된 사용자 확인
SELECT user_id, email, name, company_name, created_at::date
FROM public.users
WHERE user_id IN ('TEST0001', 'TEST0002')
ORDER BY user_id;
