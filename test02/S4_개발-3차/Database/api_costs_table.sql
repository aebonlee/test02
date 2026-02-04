-- ================================================
-- API 원가 테이블 (api_costs)
-- 목적: AI API 사용 원가를 관리하여 수익성 분석에 활용
-- 작성일: 2025-12-22
-- ================================================

-- 테이블 생성
CREATE TABLE IF NOT EXISTS api_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_display_name VARCHAR(100),
    input_cost_per_1m DECIMAL(10, 4) NOT NULL,
    output_cost_per_1m DECIMAL(10, 4) NOT NULL,
    usd_to_krw_rate DECIMAL(10, 2) DEFAULT 1450.00,
    margin_percent DECIMAL(5, 2) DEFAULT 30.00,
    is_active BOOLEAN DEFAULT true,
    effective_from TIMESTAMPTZ DEFAULT NOW(),
    effective_to TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_api_costs_provider ON api_costs(provider);
CREATE INDEX IF NOT EXISTS idx_api_costs_model ON api_costs(model_name);
CREATE INDEX IF NOT EXISTS idx_api_costs_active ON api_costs(is_active) WHERE is_active = true;

-- RLS 정책
ALTER TABLE api_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can read api_costs" ON api_costs
    FOR SELECT USING (true);

CREATE POLICY "Anon can insert api_costs" ON api_costs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon can update api_costs" ON api_costs
    FOR UPDATE USING (true);

CREATE POLICY "Anon can delete api_costs" ON api_costs
    FOR DELETE USING (true);

-- 초기 데이터: OpenAI
INSERT INTO api_costs (provider, model_name, model_display_name, input_cost_per_1m, output_cost_per_1m, notes) VALUES
('openai', 'gpt-4o', 'GPT-4o', 2.50, 10.00, '2024-05 출시, 멀티모달'),
('openai', 'gpt-4o-mini', 'GPT-4o Mini', 0.15, 0.60, '경량 모델'),
('openai', 'gpt-4-turbo', 'GPT-4 Turbo', 10.00, 30.00, '128K 컨텍스트'),
('openai', 'gpt-3.5-turbo', 'GPT-3.5 Turbo', 0.50, 1.50, '레거시 모델'),
('openai', 'o1', 'o1', 15.00, 60.00, '추론 모델'),
('openai', 'o1-mini', 'o1 Mini', 3.00, 12.00, '경량 추론 모델');

-- 초기 데이터: Anthropic
INSERT INTO api_costs (provider, model_name, model_display_name, input_cost_per_1m, output_cost_per_1m, notes) VALUES
('anthropic', 'claude-3-opus', 'Claude 3 Opus', 15.00, 75.00, '최고 성능'),
('anthropic', 'claude-3.5-sonnet', 'Claude 3.5 Sonnet', 3.00, 15.00, '균형 모델'),
('anthropic', 'claude-3.5-haiku', 'Claude 3.5 Haiku', 0.25, 1.25, '빠른 응답'),
('anthropic', 'claude-opus-4', 'Claude Opus 4', 15.00, 75.00, '2025-03 출시'),
('anthropic', 'claude-sonnet-4', 'Claude Sonnet 4', 3.00, 15.00, '2025-05 출시');

-- 초기 데이터: Google
INSERT INTO api_costs (provider, model_name, model_display_name, input_cost_per_1m, output_cost_per_1m, notes) VALUES
('google', 'gemini-1.5-pro', 'Gemini 1.5 Pro', 1.25, 5.00, '1M 컨텍스트'),
('google', 'gemini-1.5-flash', 'Gemini 1.5 Flash', 0.075, 0.30, '빠른 응답'),
('google', 'gemini-2.0-flash', 'Gemini 2.0 Flash', 0.10, 0.40, '2024-12 출시');
