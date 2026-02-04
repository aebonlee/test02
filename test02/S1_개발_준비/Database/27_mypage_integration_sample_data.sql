-- =====================================================
-- My Page 통합 테스트용 샘플 데이터
-- =====================================================
-- 작성일: 2025-12-12
-- Agenda: #8 My Page 통합 완성
-- 목적: 실제 users 테이블 사용자들을 위한 통합 샘플 데이터
-- 실행 순서: 27번째 (26_sample_credit_data.sql 이후)
-- =====================================================

-- =====================================================
-- 1. ADMIN001 (관리자) 샘플 데이터
-- =====================================================

-- 결제 수단
INSERT INTO public.payment_methods (
    user_id, payment_type, card_last4, card_company, is_default, toss_billing_key
) VALUES (
    'ADMIN001', 'card', '5678', 'KB국민카드', true, 'admin_billing_key_001'
) ON CONFLICT DO NOTHING;

-- 결제 내역 (플랫폼 이용료 3개월 + 크레딧 충전)
INSERT INTO public.billing_history (
    user_id, billing_type, amount, status, billing_date, payment_method, receipt_url
) VALUES
    ('ADMIN001', 'platform_fee', 50000, 'paid', NOW() - INTERVAL '5 months', 'KB국민카드 ****-5678', 'https://receipt.example.com/admin001'),
    ('ADMIN001', 'platform_fee', 50000, 'paid', NOW() - INTERVAL '4 months', 'KB국민카드 ****-5678', 'https://receipt.example.com/admin002'),
    ('ADMIN001', 'platform_fee', 50000, 'paid', NOW() - INTERVAL '3 months', 'KB국민카드 ****-5678', 'https://receipt.example.com/admin003'),
    ('ADMIN001', 'platform_fee', 50000, 'paid', NOW() - INTERVAL '2 months', 'KB국민카드 ****-5678', 'https://receipt.example.com/admin004'),
    ('ADMIN001', 'platform_fee', 50000, 'paid', NOW() - INTERVAL '1 month', 'KB국민카드 ****-5678', 'https://receipt.example.com/admin005'),
    ('ADMIN001', 'credit_purchase', 50000, 'paid', NOW() - INTERVAL '180 days', 'KB국민카드 ****-5678', 'https://receipt.example.com/admin_credit001'),
    ('ADMIN001', 'credit_purchase', 30000, 'paid', NOW() - INTERVAL '90 days', 'KB국민카드 ****-5678', 'https://receipt.example.com/admin_credit002'),
    ('ADMIN001', 'credit_purchase', 20000, 'paid', NOW() - INTERVAL '30 days', 'KB국민카드 ****-5678', 'https://receipt.example.com/admin_credit003')
ON CONFLICT DO NOTHING;

-- 크레딧 거래 내역
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, related_service, created_at
) VALUES
    ('ADMIN001', 'charge', 50000, 50000, '초기 크레딧 충전', NULL, NOW() - INTERVAL '180 days'),
    ('ADMIN001', 'spend', -100, 49900, 'ChatGPT 사용', 'ChatGPT', NOW() - INTERVAL '170 days'),
    ('ADMIN001', 'spend', -80, 49820, 'Gemini 코드 리뷰', 'Gemini', NOW() - INTERVAL '160 days'),
    ('ADMIN001', 'charge', 30000, 79820, '추가 충전', NULL, NOW() - INTERVAL '90 days'),
    ('ADMIN001', 'spend', -50, 79770, 'Perplexity 검색', 'Perplexity', NOW() - INTERVAL '80 days'),
    ('ADMIN001', 'spend', -100, 79670, 'ChatGPT 사용', 'ChatGPT', NOW() - INTERVAL '70 days'),
    ('ADMIN001', 'bonus', 10000, 89670, '관리자 특별 보너스', NULL, NOW() - INTERVAL '60 days'),
    ('ADMIN001', 'charge', 20000, 109670, '크레딧 충전', NULL, NOW() - INTERVAL '30 days'),
    ('ADMIN001', 'spend', -80, 109590, 'Gemini 아키텍처 설계', 'Gemini', NOW() - INTERVAL '20 days'),
    ('ADMIN001', 'spend', -100, 109490, 'ChatGPT 문서 작성', 'ChatGPT', NOW() - INTERVAL '10 days'),
    ('ADMIN001', 'spend', -50, 109440, 'Perplexity 최신 트렌드', 'Perplexity', NOW() - INTERVAL '5 days'),
    ('ADMIN001', 'spend', -100, 109340, 'ChatGPT 코드 생성', 'ChatGPT', NOW() - INTERVAL '2 days'),
    ('ADMIN001', 'spend', -80, 109260, 'Gemini 코드 최적화', 'Gemini', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- users 테이블의 credit_balance 업데이트
UPDATE public.users SET credit_balance = 109260 WHERE user_id = 'ADMIN001';

-- AI 사용 로그
INSERT INTO public.ai_usage_log (
    user_id, service_name, prompt, response, tokens_used, cost, response_time_ms, created_at
) VALUES
    ('ADMIN001', 'ChatGPT', 'React 컴포넌트 최적화 방법', 'React.memo와 useMemo를 활용한 최적화...', 600, 100, 2400, NOW() - INTERVAL '170 days'),
    ('ADMIN001', 'Gemini', '이 코드 리뷰 부탁: const sum = (a,b) => a+b', '코드 리뷰 결과: 1. 타입 안전성...', 350, 80, 1900, NOW() - INTERVAL '160 days'),
    ('ADMIN001', 'Perplexity', '2025년 웹 개발 트렌드', '2025년 주요 트렌드: Server Components, Edge Computing...', 280, 50, 3200, NOW() - INTERVAL '80 days'),
    ('ADMIN001', 'ChatGPT', 'TypeScript 제네릭 고급 사용법', '제네릭의 고급 활용: 조건부 타입, 맵드 타입...', 520, 100, 2600, NOW() - INTERVAL '70 days'),
    ('ADMIN001', 'Gemini', 'Supabase RLS 정책 설계', 'RLS 정책 설계 시 고려사항: 1. 성능...', 400, 80, 2100, NOW() - INTERVAL '20 days'),
    ('ADMIN001', 'ChatGPT', 'Next.js App Router 마이그레이션', 'Pages Router에서 App Router로 마이그레이션...', 700, 100, 2800, NOW() - INTERVAL '10 days'),
    ('ADMIN001', 'Perplexity', 'Supabase vs Firebase 비교', '2025년 기준 비교: Supabase 장점...', 220, 50, 2900, NOW() - INTERVAL '5 days'),
    ('ADMIN001', 'ChatGPT', 'REST API 보안 베스트 프랙티스', 'API 보안 체크리스트: 1. 인증/인가...', 650, 100, 2500, NOW() - INTERVAL '2 days'),
    ('ADMIN001', 'Gemini', '이 SQL 쿼리 최적화해줘: SELECT * FROM users', '쿼리 최적화: 1. SELECT * 지양...', 380, 80, 2000, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- 프로젝트
INSERT INTO public.projects (
    user_id, project_id, project_name, description, status, progress, current_stage, total_stages, created_at
) VALUES
    ('ADMIN001', 'ADMIN001-P001', 'SSAL Works 관리 대시보드', '전체 시스템 관리 및 모니터링', 'in_progress', 75, 4, 5, NOW() - INTERVAL '180 days'),
    ('ADMIN001', 'ADMIN001-P002', 'AI 통합 프로젝트', 'ChatGPT, Gemini, Perplexity 통합', 'completed', 100, 5, 5, NOW() - INTERVAL '90 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. A1B2C3D4 (활성 유료 회원) 샘플 데이터
-- =====================================================

-- 결제 수단
INSERT INTO public.payment_methods (
    user_id, payment_type, card_last4, card_company, is_default, toss_billing_key
) VALUES (
    'A1B2C3D4', 'card', '1234', '신한카드', true, 'user_billing_key_001'
) ON CONFLICT DO NOTHING;

-- 결제 내역
INSERT INTO public.billing_history (
    user_id, billing_type, amount, status, billing_date, payment_method, receipt_url
) VALUES
    ('A1B2C3D4', 'platform_fee', 50000, 'paid', NOW() - INTERVAL '2 months', '신한카드 ****-1234', 'https://receipt.example.com/user001'),
    ('A1B2C3D4', 'platform_fee', 50000, 'paid', NOW() - INTERVAL '1 month', '신한카드 ****-1234', 'https://receipt.example.com/user002'),
    ('A1B2C3D4', 'credit_purchase', 10000, 'paid', NOW() - INTERVAL '45 days', '신한카드 ****-1234', 'https://receipt.example.com/user_credit001'),
    ('A1B2C3D4', 'credit_purchase', 5000, 'paid', NOW() - INTERVAL '15 days', '신한카드 ****-1234', 'https://receipt.example.com/user_credit002')
ON CONFLICT DO NOTHING;

-- 크레딧 거래 내역
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, related_service, created_at
) VALUES
    ('A1B2C3D4', 'charge', 10000, 10000, '첫 충전', NULL, NOW() - INTERVAL '45 days'),
    ('A1B2C3D4', 'spend', -100, 9900, 'ChatGPT 질문', 'ChatGPT', NOW() - INTERVAL '40 days'),
    ('A1B2C3D4', 'spend', -50, 9850, 'Perplexity 검색', 'Perplexity', NOW() - INTERVAL '35 days'),
    ('A1B2C3D4', 'charge', 5000, 14850, '추가 충전', NULL, NOW() - INTERVAL '15 days'),
    ('A1B2C3D4', 'spend', -80, 14770, 'Gemini 리뷰', 'Gemini', NOW() - INTERVAL '10 days'),
    ('A1B2C3D4', 'spend', -100, 14670, 'ChatGPT 사용', 'ChatGPT', NOW() - INTERVAL '5 days'),
    ('A1B2C3D4', 'spend', -50, 14620, 'Perplexity 조사', 'Perplexity', NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

UPDATE public.users SET credit_balance = 14620 WHERE user_id = 'A1B2C3D4';

-- AI 사용 로그
INSERT INTO public.ai_usage_log (
    user_id, service_name, prompt, response, tokens_used, cost, response_time_ms, created_at
) VALUES
    ('A1B2C3D4', 'ChatGPT', 'Python 리스트 정렬 방법', 'Python 리스트 정렬: sorted(), sort()...', 400, 100, 2200, NOW() - INTERVAL '40 days'),
    ('A1B2C3D4', 'Perplexity', 'Vue.js 3.0 새로운 기능', 'Vue 3의 주요 기능: Composition API...', 250, 50, 2700, NOW() - INTERVAL '35 days'),
    ('A1B2C3D4', 'Gemini', 'JavaScript 배열 메서드 설명', 'map, filter, reduce 메서드 사용법...', 320, 80, 1850, NOW() - INTERVAL '10 days'),
    ('A1B2C3D4', 'ChatGPT', '비동기 처리 async/await', 'async/await 패턴: Promise 기반...', 450, 100, 2400, NOW() - INTERVAL '5 days'),
    ('A1B2C3D4', 'Perplexity', 'Docker 컨테이너 최적화', 'Docker 이미지 경량화 방법...', 200, 50, 3100, NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- 프로젝트
INSERT INTO public.projects (
    user_id, project_id, project_name, description, status, progress, current_stage, total_stages, created_at
) VALUES
    ('A1B2C3D4', 'A1B2C3D4-P001', '전자상거래 플랫폼', 'Next.js 기반 쇼핑몰 구축', 'in_progress', 45, 2, 5, NOW() - INTERVAL '60 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. E5F6G7H8 (무료 회원) 샘플 데이터
-- =====================================================

-- 무료 회원은 설치비 미납 상태이므로 payment_methods, billing_history 없음
-- 크레딧 거래도 없음 (credit_balance = 0)
-- 프로젝트도 등록 불가

-- =====================================================
-- 4. SUN12345 (활성 유료 회원) 샘플 데이터
-- =====================================================

-- 결제 수단
INSERT INTO public.payment_methods (
    user_id, payment_type, card_last4, card_company, is_default, toss_billing_key
) VALUES (
    'SUN12345', 'card', '9876', '삼성카드', true, 'sun_billing_key_001'
) ON CONFLICT DO NOTHING;

-- 결제 내역
INSERT INTO public.billing_history (
    user_id, billing_type, amount, status, billing_date, payment_method, receipt_url
) VALUES
    ('SUN12345', 'platform_fee', 50000, 'paid', NOW() - INTERVAL '1 month', '삼성카드 ****-9876', 'https://receipt.example.com/sun001'),
    ('SUN12345', 'credit_purchase', 30000, 'paid', NOW() - INTERVAL '20 days', '삼성카드 ****-9876', 'https://receipt.example.com/sun_credit001')
ON CONFLICT DO NOTHING;

-- 크레딧 거래 내역
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, related_service, created_at
) VALUES
    ('SUN12345', 'charge', 30000, 30000, '크레딧 충전', NULL, NOW() - INTERVAL '20 days'),
    ('SUN12345', 'spend', -100, 29900, 'ChatGPT 질문', 'ChatGPT', NOW() - INTERVAL '18 days'),
    ('SUN12345', 'spend', -80, 29820, 'Gemini 리뷰', 'Gemini', NOW() - INTERVAL '15 days'),
    ('SUN12345', 'spend', -50, 29770, 'Perplexity 검색', 'Perplexity', NOW() - INTERVAL '12 days'),
    ('SUN12345', 'spend', -100, 29670, 'ChatGPT 코드 생성', 'ChatGPT', NOW() - INTERVAL '8 days'),
    ('SUN12345', 'bonus', 5000, 34670, '신규 회원 보너스', NULL, NOW() - INTERVAL '5 days'),
    ('SUN12345', 'spend', -80, 34590, 'Gemini 최적화', 'Gemini', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

UPDATE public.users SET credit_balance = 34590 WHERE user_id = 'SUN12345';

-- AI 사용 로그
INSERT INTO public.ai_usage_log (
    user_id, service_name, prompt, response, tokens_used, cost, response_time_ms, created_at
) VALUES
    ('SUN12345', 'ChatGPT', 'CSS Grid 레이아웃 예제', 'Grid 레이아웃 활용: display: grid...', 380, 100, 2100, NOW() - INTERVAL '18 days'),
    ('SUN12345', 'Gemini', '이 함수 개선해줘: function calc(x,y){return x+y}', '함수 개선 제안: 1. 화살표 함수...', 290, 80, 1750, NOW() - INTERVAL '15 days'),
    ('SUN12345', 'Perplexity', 'Tailwind CSS 최신 기능', 'Tailwind CSS 3.4 새 기능...', 210, 50, 2800, NOW() - INTERVAL '12 days'),
    ('SUN12345', 'ChatGPT', 'React Hook 사용 예제', 'useState, useEffect 실전 예제...', 480, 100, 2300, NOW() - INTERVAL '8 days'),
    ('SUN12345', 'Gemini', 'SQL 인덱스 최적화', '인덱스 전략: 1. 복합 인덱스...', 340, 80, 1950, NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- 프로젝트
INSERT INTO public.projects (
    user_id, project_id, project_name, description, status, progress, current_stage, total_stages, created_at
) VALUES
    ('SUN12345', 'SUN12345-P001', '블로그 플랫폼', 'Next.js + Supabase 블로그', 'in_progress', 30, 2, 5, NOW() - INTERVAL '30 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. MOON6789 (활성 유료 회원) 샘플 데이터
-- =====================================================

-- 결제 수단
INSERT INTO public.payment_methods (
    user_id, payment_type, bank_name, account_last4, is_default
) VALUES (
    'MOON6789', 'bank', '우리은행', '4321', true
) ON CONFLICT DO NOTHING;

-- 결제 내역
INSERT INTO public.billing_history (
    user_id, billing_type, amount, status, billing_date, payment_method
) VALUES
    ('MOON6789', 'platform_fee', 50000, 'paid', NOW() - INTERVAL '1 month', '우리은행 ****-4321'),
    ('MOON6789', 'credit_purchase', 20000, 'paid', NOW() - INTERVAL '25 days', '우리은행 ****-4321')
ON CONFLICT DO NOTHING;

-- 크레딧 거래 내역
INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, description, related_service, created_at
) VALUES
    ('MOON6789', 'charge', 20000, 20000, '크레딧 충전', NULL, NOW() - INTERVAL '25 days'),
    ('MOON6789', 'spend', -100, 19900, 'ChatGPT 사용', 'ChatGPT', NOW() - INTERVAL '22 days'),
    ('MOON6789', 'spend', -50, 19850, 'Perplexity 조사', 'Perplexity', NOW() - INTERVAL '18 days'),
    ('MOON6789', 'spend', -80, 19770, 'Gemini 분석', 'Gemini', NOW() - INTERVAL '14 days'),
    ('MOON6789', 'spend', -100, 19670, 'ChatGPT 코딩', 'ChatGPT', NOW() - INTERVAL '10 days')
ON CONFLICT DO NOTHING;

UPDATE public.users SET credit_balance = 19670 WHERE user_id = 'MOON6789';

-- AI 사용 로그
INSERT INTO public.ai_usage_log (
    user_id, service_name, prompt, response, tokens_used, cost, response_time_ms, created_at
) VALUES
    ('MOON6789', 'ChatGPT', 'Node.js Express 보안', 'Express 보안 설정: helmet, cors...', 420, 100, 2250, NOW() - INTERVAL '22 days'),
    ('MOON6789', 'Perplexity', 'GraphQL vs REST API', '2025년 기준 비교: GraphQL 장점...', 240, 50, 2950, NOW() - INTERVAL '18 days'),
    ('MOON6789', 'Gemini', 'PostgreSQL 쿼리 튜닝', '쿼리 성능 개선: EXPLAIN ANALYZE...', 360, 80, 2050, NOW() - INTERVAL '14 days'),
    ('MOON6789', 'ChatGPT', 'JWT 토큰 인증 구현', 'JWT 인증 플로우: 토큰 생성 및 검증...', 500, 100, 2400, NOW() - INTERVAL '10 days')
ON CONFLICT DO NOTHING;

-- 프로젝트
INSERT INTO public.projects (
    user_id, project_id, project_name, description, status, progress, current_stage, total_stages, created_at
) VALUES
    ('MOON6789', 'MOON6789-P001', 'API 게이트웨이', 'MSA 기반 API 관리 시스템', 'in_progress', 55, 3, 5, NOW() - INTERVAL '50 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 완료 확인
-- =====================================================
SELECT 'My Page 통합 테스트 샘플 데이터 생성 완료!' as status;

-- 생성된 데이터 확인
SELECT '=== 결제 수단 ===' as section;
SELECT user_id,
       COALESCE(card_company || ' ****-' || card_last4, bank_name || ' ****-' || account_last4) as payment_info,
       is_default
FROM public.payment_methods
WHERE user_id IN ('ADMIN001', 'A1B2C3D4', 'SUN12345', 'MOON6789')
ORDER BY user_id;

SELECT '=== 결제 내역 건수 ===' as section;
SELECT user_id, COUNT(*) as billing_count
FROM public.billing_history
WHERE user_id IN ('ADMIN001', 'A1B2C3D4', 'SUN12345', 'MOON6789')
GROUP BY user_id
ORDER BY user_id;

SELECT '=== 크레딧 거래 건수 ===' as section;
SELECT user_id, COUNT(*) as transaction_count, MAX(balance_after) as final_balance
FROM public.credit_transactions
WHERE user_id IN ('ADMIN001', 'A1B2C3D4', 'SUN12345', 'MOON6789')
GROUP BY user_id
ORDER BY user_id;

SELECT '=== AI 사용 로그 건수 ===' as section;
SELECT user_id, COUNT(*) as usage_count, SUM(cost) as total_cost
FROM public.ai_usage_log
WHERE user_id IN ('ADMIN001', 'A1B2C3D4', 'SUN12345', 'MOON6789')
GROUP BY user_id
ORDER BY user_id;

SELECT '=== 프로젝트 ===' as section;
SELECT user_id, project_id, project_name, status, progress
FROM public.projects
WHERE user_id IN ('ADMIN001', 'A1B2C3D4', 'SUN12345', 'MOON6789')
ORDER BY user_id;

SELECT '=== 사용자별 크레딧 잔액 (users 테이블) ===' as section;
SELECT user_id, name, credit_balance, subscription_status, installation_fee_paid
FROM public.users
WHERE user_id IN ('ADMIN001', 'A1B2C3D4', 'E5F6G7H8', 'SUN12345', 'MOON6789')
ORDER BY user_id;
