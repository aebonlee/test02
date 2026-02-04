-- @task S4D1
-- S4D1: AI 가격 테이블

-- 기존 테이블 삭제 후 재생성
DROP TABLE IF EXISTS ai_pricing CASCADE;

CREATE TABLE ai_pricing (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(50) NOT NULL UNIQUE, -- gemini, chatgpt, perplexity
    display_name VARCHAR(100) NOT NULL,
    price_per_query INTEGER NOT NULL, -- 원 단위
    description TEXT,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO ai_pricing (service_name, display_name, price_per_query, description, features)
VALUES
    ('gemini', 'Gemini Pro', 100, 'Google의 최신 AI 모델', '["빠른 응답", "한국어 최적화", "다중 턴 대화"]'),
    ('chatgpt', 'ChatGPT-4', 150, 'OpenAI의 고급 AI 모델', '["높은 정확도", "코드 작성", "창의적 글쓰기"]'),
    ('perplexity', 'Perplexity', 120, '실시간 검색 기반 AI', '["최신 정보", "출처 제공", "팩트 체크"]')
ON CONFLICT (service_name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    price_per_query = EXCLUDED.price_per_query,
    updated_at = NOW();

-- RLS (공개 조회 가능)
ALTER TABLE ai_pricing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view ai pricing" ON ai_pricing;
CREATE POLICY "Anyone can view ai pricing"
    ON ai_pricing FOR SELECT
    USING (true);
