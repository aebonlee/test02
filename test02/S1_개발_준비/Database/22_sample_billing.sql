-- =====================================================
-- Billing 샘플 데이터
-- =====================================================
-- 작성일: 2025-12-11
-- Agenda: #6 플랫폼 이용료 & 결제 관리
-- 목적: 테스트용 샘플 결제 수단 및 결제 내역
-- =====================================================

-- 기존 샘플 데이터 삭제 (테스트 환경용)
DELETE FROM public.billing_history WHERE user_id IN ('TEST0001', 'TEST0002');
DELETE FROM public.payment_methods WHERE user_id IN ('TEST0001', 'TEST0002');

-- ===========================================
-- 샘플 결제 수단
-- ===========================================

-- TEST0001 사용자: 신한카드
INSERT INTO public.payment_methods (
    user_id,
    payment_type,
    card_last4,
    card_company,
    is_default,
    toss_billing_key
) VALUES (
    'TEST0001',
    'card',
    '1234',
    '신한카드',
    true,
    'test_billing_key_001'
);

-- TEST0001 사용자: 하나은행 계좌 (비기본)
INSERT INTO public.payment_methods (
    user_id,
    payment_type,
    bank_name,
    account_last4,
    is_default,
    toss_billing_key
) VALUES (
    'TEST0001',
    'bank',
    '하나은행',
    '5678',
    false,
    NULL
);

-- TEST0002 사용자: 삼성카드
INSERT INTO public.payment_methods (
    user_id,
    payment_type,
    card_last4,
    card_company,
    is_default,
    toss_billing_key
) VALUES (
    'TEST0002',
    'card',
    '9012',
    '삼성카드',
    true,
    'test_billing_key_002'
);

-- ===========================================
-- 샘플 결제 내역
-- ===========================================

-- TEST0001: 3개월 전 플랫폼 이용료 결제 성공
INSERT INTO public.billing_history (
    user_id,
    billing_type,
    amount,
    status,
    billing_date,
    payment_method,
    receipt_url
) VALUES (
    'TEST0001',
    'platform_fee',
    50000,
    'paid',
    NOW() - INTERVAL '3 months',
    '신한카드 ****-1234',
    'https://receipt.example.com/sample001'
);

-- TEST0001: 2개월 전 플랫폼 이용료 결제 성공
INSERT INTO public.billing_history (
    user_id,
    billing_type,
    amount,
    status,
    billing_date,
    payment_method,
    receipt_url
) VALUES (
    'TEST0001',
    'platform_fee',
    50000,
    'paid',
    NOW() - INTERVAL '2 months',
    '신한카드 ****-1234',
    'https://receipt.example.com/sample002'
);

-- TEST0001: 1개월 전 플랫폼 이용료 결제 성공
INSERT INTO public.billing_history (
    user_id,
    billing_type,
    amount,
    status,
    billing_date,
    payment_method,
    receipt_url
) VALUES (
    'TEST0001',
    'platform_fee',
    50000,
    'paid',
    NOW() - INTERVAL '1 month',
    '신한카드 ****-1234',
    'https://receipt.example.com/sample003'
);

-- TEST0001: 이번 달 플랫폼 이용료 결제 실패
INSERT INTO public.billing_history (
    user_id,
    billing_type,
    amount,
    status,
    billing_date,
    payment_method,
    failure_reason,
    retry_count
) VALUES (
    'TEST0001',
    'platform_fee',
    50000,
    'failed',
    NOW() - INTERVAL '3 days',
    '신한카드 ****-1234',
    '잔액 부족',
    2
);

-- TEST0001: 크레딧 충전 내역
INSERT INTO public.billing_history (
    user_id,
    billing_type,
    amount,
    status,
    billing_date,
    payment_method,
    receipt_url
) VALUES (
    'TEST0001',
    'credit_purchase',
    10000,
    'paid',
    NOW() - INTERVAL '15 days',
    '신한카드 ****-1234',
    'https://receipt.example.com/credit001'
);

-- TEST0002: 2개월 전 플랫폼 이용료 결제 성공
INSERT INTO public.billing_history (
    user_id,
    billing_type,
    amount,
    status,
    billing_date,
    payment_method,
    receipt_url
) VALUES (
    'TEST0002',
    'platform_fee',
    50000,
    'paid',
    NOW() - INTERVAL '2 months',
    '삼성카드 ****-9012',
    'https://receipt.example.com/sample004'
);

-- TEST0002: 1개월 전 플랫폼 이용료 환불
INSERT INTO public.billing_history (
    user_id,
    billing_type,
    amount,
    status,
    billing_date,
    payment_method,
    refund_amount,
    refund_date,
    refund_reason
) VALUES (
    'TEST0002',
    'platform_fee',
    50000,
    'refunded',
    NOW() - INTERVAL '1 month',
    '삼성카드 ****-9012',
    50000,
    NOW() - INTERVAL '20 days',
    '서비스 불만족'
);

-- ===========================================
-- 완료 확인
-- ===========================================
SELECT 'billing 샘플 데이터 생성 완료' as status;

-- 생성된 데이터 확인
SELECT '=== 결제 수단 ===' as section;
SELECT user_id, payment_type,
       COALESCE(card_company || ' ****-' || card_last4, bank_name || ' ****-' || account_last4) as payment_info,
       is_default
FROM public.payment_methods
WHERE user_id IN ('TEST0001', 'TEST0002')
ORDER BY user_id, created_at;

SELECT '=== 결제 내역 ===' as section;
SELECT user_id, billing_type, amount, status, billing_date::date as billing_date,
       CASE WHEN failure_reason IS NOT NULL THEN failure_reason
            WHEN refund_reason IS NOT NULL THEN '환불: ' || refund_reason
            ELSE '-' END as note
FROM public.billing_history
WHERE user_id IN ('TEST0001', 'TEST0002')
ORDER BY billing_date DESC;
