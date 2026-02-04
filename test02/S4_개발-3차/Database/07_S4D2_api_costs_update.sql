-- api_costs 테이블 수정: 비기본 모델 비활성화 + 마진율 20%로 변경
-- Supabase Dashboard > SQL Editor에서 실행

-- 1. 기본 3개 외 모델 비활성화 (is_default = false인 모델)
UPDATE api_costs
SET is_active = false,
    updated_at = now()
WHERE is_default = false;

-- 2. 마진율 30% → 20%로 변경 (모든 모델)
UPDATE api_costs
SET margin_percent = 20.00,
    updated_at = now()
WHERE margin_percent != 20.00;

-- 결과 확인
SELECT
    provider,
    model_name,
    is_default,
    is_active,
    margin_percent
FROM api_costs
ORDER BY is_default DESC, provider, model_name;
