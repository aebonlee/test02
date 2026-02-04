-- @task S3BA2
-- AI 가격 정보 테이블 및 시스템 설정
-- 2024-12-20 기준 실제 API 가격

-- ============================================
-- 1. AI 가격 정보 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS ai_pricing (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(50) NOT NULL UNIQUE,  -- 'gemini', 'chatgpt', 'perplexity'
    display_name VARCHAR(100) NOT NULL,

    -- 토큰 가격 (USD per 1M tokens)
    input_price_usd DECIMAL(10, 4) NOT NULL,
    output_price_usd DECIMAL(10, 4) NOT NULL,
    request_fee_usd DECIMAL(10, 4) DEFAULT 0,  -- 요청당 비용 (Perplexity 등)

    -- 표시 정보
    description TEXT,
    features JSONB DEFAULT '[]',
    icon VARCHAR(10) DEFAULT '🤖',
    color VARCHAR(20) DEFAULT '#718096',

    -- 상태
    is_active BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,

    -- 출처 (관리자 참고용)
    source_url TEXT,
    price_updated_at TIMESTAMP DEFAULT NOW(),  -- API 가격 업데이트일

    -- 메타
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. 초기 데이터 삽입 (2024-12-20 기준)
-- ============================================
INSERT INTO ai_pricing (service_name, display_name, input_price_usd, output_price_usd, request_fee_usd, description, features, icon, color, source_url)
VALUES
    (
        'gemini',
        'Gemini 2.5 Pro',
        1.25,   -- $1.25 / 1M input tokens
        10.00,  -- $10.00 / 1M output tokens
        0,
        'Google의 최신 AI 모델',
        '["빠른 응답", "한국어 최적화", "멀티모달"]',
        '🌟',
        '#4285F4',
        'https://ai.google.dev/gemini-api/docs/pricing'
    ),
    (
        'chatgpt',
        'GPT-4o',
        2.50,   -- $2.50 / 1M input tokens (2024-12 기준)
        10.00,  -- $10.00 / 1M output tokens
        0,
        'OpenAI의 고급 AI 모델',
        '["높은 정확도", "코드 작성", "창의적 글쓰기"]',
        '🤖',
        '#10A37F',
        'https://openai.com/api/pricing/'
    ),
    (
        'perplexity',
        'Perplexity Sonar Pro',
        3.00,   -- $3.00 / 1M input tokens
        15.00,  -- $15.00 / 1M output tokens
        0.005,  -- $0.005 per request
        '실시간 검색 기반 AI',
        '["최신 정보", "출처 제공", "팩트 체크"]',
        '🔍',
        '#1FB8CD',
        'https://docs.perplexity.ai/getting-started/pricing'
    )
ON CONFLICT (service_name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    input_price_usd = EXCLUDED.input_price_usd,
    output_price_usd = EXCLUDED.output_price_usd,
    request_fee_usd = EXCLUDED.request_fee_usd,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    source_url = EXCLUDED.source_url,
    price_updated_at = NOW(),
    updated_at = NOW();

-- ============================================
-- 3. 시스템 설정 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. 시스템 설정 초기값
-- ============================================
INSERT INTO system_config (key, value, description)
VALUES
    ('USD_TO_KRW', '1400', '환율 (USD → KRW)'),
    ('AI_MARGIN_RATE', '1.2', 'AI 서비스 마진율 (1.2 = 20%)'),
    ('AVG_INPUT_TOKENS', '300', '평균 입력 토큰 수 (한글 ~150자)'),
    ('AVG_OUTPUT_TOKENS', '800', '평균 출력 토큰 수 (한글 ~400자)'),
    ('MIN_CHARGE', '10', '최소 과금 금액 (원)')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- ============================================
-- 5. 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_ai_pricing_active ON ai_pricing(is_active);
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(key);

-- ============================================
-- 6. 가격 업데이트 트리거
-- ============================================
CREATE OR REPLACE FUNCTION update_ai_pricing_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ai_pricing_updated ON ai_pricing;
CREATE TRIGGER trigger_ai_pricing_updated
    BEFORE UPDATE ON ai_pricing
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_pricing_timestamp();

-- ============================================
-- 7. 예상 가격 계산 함수 (SQL에서 직접 조회용)
-- ============================================
CREATE OR REPLACE FUNCTION calculate_query_cost(
    p_model VARCHAR,
    p_input_tokens INT DEFAULT 300,
    p_output_tokens INT DEFAULT 800
)
RETURNS INTEGER AS $$
DECLARE
    v_input_price DECIMAL;
    v_output_price DECIMAL;
    v_request_fee DECIMAL;
    v_exchange_rate DECIMAL;
    v_margin_rate DECIMAL;
    v_min_charge INTEGER;
    v_cost_usd DECIMAL;
    v_cost_krw INTEGER;
BEGIN
    -- AI 가격 조회
    SELECT input_price_usd, output_price_usd, COALESCE(request_fee_usd, 0)
    INTO v_input_price, v_output_price, v_request_fee
    FROM ai_pricing
    WHERE service_name = p_model AND is_active = true;

    IF NOT FOUND THEN
        RETURN 10; -- 기본값
    END IF;

    -- 시스템 설정 조회
    SELECT COALESCE((SELECT value::DECIMAL FROM system_config WHERE key = 'USD_TO_KRW'), 1400) INTO v_exchange_rate;
    SELECT COALESCE((SELECT value::DECIMAL FROM system_config WHERE key = 'AI_MARGIN_RATE'), 1.2) INTO v_margin_rate;
    SELECT COALESCE((SELECT value::INTEGER FROM system_config WHERE key = 'MIN_CHARGE'), 10) INTO v_min_charge;

    -- 비용 계산
    v_cost_usd := (p_input_tokens::DECIMAL / 1000000) * v_input_price
                + (p_output_tokens::DECIMAL / 1000000) * v_output_price
                + v_request_fee;

    v_cost_usd := v_cost_usd * v_margin_rate;
    v_cost_krw := CEIL(v_cost_usd * v_exchange_rate);

    RETURN GREATEST(v_min_charge, v_cost_krw);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. 사용 예시
-- ============================================
-- SELECT calculate_query_cost('gemini');        -- Gemini 기본 가격
-- SELECT calculate_query_cost('chatgpt');       -- ChatGPT 기본 가격
-- SELECT calculate_query_cost('perplexity');    -- Perplexity 기본 가격
-- SELECT calculate_query_cost('gemini', 500, 1000);  -- 커스텀 토큰 수

-- 전체 가격 조회
-- SELECT service_name, display_name, calculate_query_cost(service_name) as estimated_krw
-- FROM ai_pricing WHERE is_active = true;
