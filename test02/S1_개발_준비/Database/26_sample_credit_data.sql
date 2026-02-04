-- =====================================================
-- AI 크레딧 샘플 데이터
-- =====================================================
-- 작성일: 2025-12-12
-- Agenda: #7 AI 크레딧 충전 & 사용
-- 목적: 테스트용 샘플 크레딧 거래 및 사용 내역
-- =====================================================

-- 기존 샘플 데이터 삭제 (테스트 환경용)
DELETE FROM public.ai_usage_log WHERE user_id IN ('TEST0001', 'TEST0002');
DELETE FROM public.credit_transactions WHERE user_id IN ('TEST0001', 'TEST0002');

-- ===========================================
-- 샘플 크레딧 거래 내역
-- ===========================================

-- TEST0001: 초기 크레딧 충전
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, created_at
) VALUES (
    'TEST0001', 'charge', 50000, 50000, '첫 충전 - 카드 결제',
    NOW() - INTERVAL '30 days'
);

-- TEST0001: ChatGPT 사용
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, related_service, created_at
) VALUES (
    'TEST0001', 'spend', -100, 49900, 'ChatGPT 사용', 'ChatGPT',
    NOW() - INTERVAL '25 days'
);

-- TEST0001: Gemini 사용
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, related_service, created_at
) VALUES (
    'TEST0001', 'spend', -80, 49820, 'Gemini 사용', 'Gemini',
    NOW() - INTERVAL '20 days'
);

-- TEST0001: 추가 충전
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, created_at
) VALUES (
    'TEST0001', 'charge', 10000, 59820, '추가 충전 - 카드 결제',
    NOW() - INTERVAL '15 days'
);

-- TEST0001: 보너스 지급
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, created_at
) VALUES (
    'TEST0001', 'bonus', 5000, 64820, '관리자 지급: 이벤트 당첨',
    NOW() - INTERVAL '10 days'
);

-- TEST0001: Perplexity 여러번 사용
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, related_service, created_at
) VALUES
    ('TEST0001', 'spend', -50, 64770, 'Perplexity 사용', 'Perplexity', NOW() - INTERVAL '7 days'),
    ('TEST0001', 'spend', -50, 64720, 'Perplexity 사용', 'Perplexity', NOW() - INTERVAL '5 days'),
    ('TEST0001', 'spend', -100, 64620, 'ChatGPT 사용', 'ChatGPT', NOW() - INTERVAL '3 days'),
    ('TEST0001', 'spend', -80, 64540, 'Gemini 사용', 'Gemini', NOW() - INTERVAL '1 day');

-- TEST0002: 초기 크레딧 충전
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, created_at
) VALUES (
    'TEST0002', 'charge', 30000, 30000, '첫 충전 - 카드 결제',
    NOW() - INTERVAL '20 days'
);

-- TEST0002: AI 사용
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, related_service, created_at
) VALUES
    ('TEST0002', 'spend', -100, 29900, 'ChatGPT 사용', 'ChatGPT', NOW() - INTERVAL '18 days'),
    ('TEST0002', 'spend', -100, 29800, 'ChatGPT 사용', 'ChatGPT', NOW() - INTERVAL '15 days'),
    ('TEST0002', 'spend', -50, 29750, 'Perplexity 사용', 'Perplexity', NOW() - INTERVAL '10 days');

-- TEST0002: 환불
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, created_at
) VALUES (
    'TEST0002', 'refund', 5000, 34750, 'API 오류로 인한 환불',
    NOW() - INTERVAL '8 days'
);

-- ===========================================
-- 샘플 AI 사용 로그
-- ===========================================

-- TEST0001 AI 사용 로그
INSERT INTO public.ai_usage_log (
    user_id, service_name, prompt, response, tokens_used, cost, response_time_ms, created_at
) VALUES
    ('TEST0001', 'ChatGPT', 'React 컴포넌트 작성 방법 알려줘',
     'React 컴포넌트는 함수형과 클래스형으로 작성할 수 있습니다...',
     500, 100, 2500, NOW() - INTERVAL '25 days'),
    ('TEST0001', 'Gemini', '이 코드 리뷰해줘: function sum(a,b){return a+b}',
     '코드 리뷰 결과: 1. 화살표 함수로 변경 권장...',
     300, 80, 1800, NOW() - INTERVAL '20 days'),
    ('TEST0001', 'Perplexity', '2025년 최신 JavaScript 트렌드',
     '2025년 JavaScript 트렌드: 1. Server Components...',
     200, 50, 3000, NOW() - INTERVAL '7 days'),
    ('TEST0001', 'Perplexity', 'Next.js 15 새로운 기능',
     'Next.js 15의 새로운 기능: 1. Turbopack 안정화...',
     250, 50, 2800, NOW() - INTERVAL '5 days'),
    ('TEST0001', 'ChatGPT', 'TypeScript 제네릭 설명해줘',
     '제네릭(Generics)은 타입을 매개변수화하는 기능입니다...',
     450, 100, 2200, NOW() - INTERVAL '3 days'),
    ('TEST0001', 'Gemini', 'Supabase RLS 정책 작성 방법',
     'Supabase RLS 정책은 CREATE POLICY 문으로 작성합니다...',
     350, 80, 1900, NOW() - INTERVAL '1 day');

-- TEST0002 AI 사용 로그
INSERT INTO public.ai_usage_log (
    user_id, service_name, prompt, response, tokens_used, cost, response_time_ms, created_at
) VALUES
    ('TEST0002', 'ChatGPT', 'Python 리스트 컴프리헨션 예제',
     '리스트 컴프리헨션은 [표현식 for 항목 in 반복가능객체]...',
     400, 100, 2300, NOW() - INTERVAL '18 days'),
    ('TEST0002', 'ChatGPT', 'Django ORM 쿼리 최적화',
     'Django ORM 최적화: 1. select_related 사용...',
     550, 100, 2600, NOW() - INTERVAL '15 days'),
    ('TEST0002', 'Perplexity', 'AWS Lambda 비용 계산',
     'AWS Lambda 비용 계산: 요청 수 * 요청당 비용 + 컴퓨팅 시간...',
     180, 50, 2900, NOW() - INTERVAL '10 days');

-- ===========================================
-- users 테이블의 credit_balance 업데이트
-- ===========================================
UPDATE public.users
SET credit_balance = 64540
WHERE user_id = 'TEST0001';

UPDATE public.users
SET credit_balance = 34750
WHERE user_id = 'TEST0002';

-- ===========================================
-- 완료 확인
-- ===========================================
SELECT 'AI 크레딧 샘플 데이터 생성 완료' as status;

-- 생성된 데이터 확인
SELECT '=== 크레딧 거래 내역 ===' as section;
SELECT user_id, type, amount, balance_after, description, created_at::date
FROM public.credit_transactions
WHERE user_id IN ('TEST0001', 'TEST0002')
ORDER BY user_id, created_at DESC
LIMIT 10;

SELECT '=== AI 사용 로그 ===' as section;
SELECT user_id, service_name, cost,
       LEFT(prompt, 30) || '...' as prompt_preview,
       response_time_ms, created_at::date
FROM public.ai_usage_log
WHERE user_id IN ('TEST0001', 'TEST0002')
ORDER BY created_at DESC
LIMIT 10;

SELECT '=== 사용자별 크레딧 잔액 ===' as section;
SELECT user_id, name, credit_balance
FROM public.users
WHERE user_id IN ('TEST0001', 'TEST0002');
