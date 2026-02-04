-- =====================================================
-- AI 크레딧 시스템 테이블 생성
-- =====================================================
-- 작성일: 2025-12-12
-- Agenda: #7 AI 크레딧 충전 & 사용
-- 목적: 크레딧 잔액, 거래 내역, AI 가격, 사용 로그 관리
-- =====================================================

-- 기존 테이블 삭제 (개발 환경용)
DROP TABLE IF EXISTS public.ai_usage_log CASCADE;
DROP TABLE IF EXISTS public.credit_transactions CASCADE;
DROP TABLE IF EXISTS public.ai_service_pricing CASCADE;

-- =====================================================
-- 1. AI 서비스 가격 테이블
-- =====================================================
CREATE TABLE public.ai_service_pricing (
    service_name VARCHAR(20) PRIMARY KEY CHECK (service_name IN ('ChatGPT', 'Gemini', 'Perplexity')),
    price_per_use INTEGER NOT NULL CHECK (price_per_use > 0),
    api_cost INTEGER CHECK (api_cost > 0),
    margin_percent INTEGER DEFAULT 20 CHECK (margin_percent >= 0 AND margin_percent <= 100),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by VARCHAR(8)
);

-- 초기 가격 데이터
INSERT INTO public.ai_service_pricing (service_name, price_per_use, api_cost, margin_percent, description) VALUES
('ChatGPT', 100, 80, 25, 'GPT-4 기반 - 코드 작성, 기술 문서'),
('Gemini', 80, 65, 23, 'Gemini 2.5 Pro - 코드 리뷰, 아키텍처'),
('Perplexity', 50, 40, 25, '실시간 검색 - 최신 정보 조회')
ON CONFLICT (service_name) DO NOTHING;

-- 인덱스
CREATE INDEX idx_ai_pricing_active ON public.ai_service_pricing(is_active);

-- 테이블 설명
COMMENT ON TABLE public.ai_service_pricing IS 'AI 서비스별 가격 정보';
COMMENT ON COLUMN public.ai_service_pricing.price_per_use IS '사용자 결제 가격 (원)';
COMMENT ON COLUMN public.ai_service_pricing.api_cost IS 'API 원가 (원)';
COMMENT ON COLUMN public.ai_service_pricing.margin_percent IS '마진율 (%)';

-- =====================================================
-- 2. 크레딧 거래 내역 테이블
-- =====================================================
CREATE TABLE public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(8) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('charge', 'spend', 'refund', 'bonus', 'expire')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
    description TEXT,
    related_service VARCHAR(20) CHECK (related_service IN ('ChatGPT', 'Gemini', 'Perplexity') OR related_service IS NULL),
    payment_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_credit_trans_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE
);

-- 인덱스
CREATE INDEX idx_credit_trans_user ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_trans_type ON public.credit_transactions(type);
CREATE INDEX idx_credit_trans_created ON public.credit_transactions(created_at DESC);
CREATE INDEX idx_credit_trans_service ON public.credit_transactions(related_service);

-- 테이블 설명
COMMENT ON TABLE public.credit_transactions IS '크레딧 충전/사용/환불 내역';
COMMENT ON COLUMN public.credit_transactions.type IS 'charge(충전), spend(사용), refund(환불), bonus(보너스), expire(만료)';
COMMENT ON COLUMN public.credit_transactions.amount IS '금액 (양수: 충전, 음수: 사용)';
COMMENT ON COLUMN public.credit_transactions.balance_after IS '거래 후 잔액';

-- =====================================================
-- 3. AI 사용 로그 테이블
-- =====================================================
CREATE TABLE public.ai_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(8) NOT NULL,
    service_name VARCHAR(20) NOT NULL CHECK (service_name IN ('ChatGPT', 'Gemini', 'Perplexity')),
    prompt TEXT NOT NULL,
    response TEXT,
    tokens_used INTEGER,
    cost INTEGER NOT NULL CHECK (cost > 0),
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_ai_usage_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE
);

-- 인덱스
CREATE INDEX idx_ai_usage_user ON public.ai_usage_log(user_id);
CREATE INDEX idx_ai_usage_service ON public.ai_usage_log(service_name);
CREATE INDEX idx_ai_usage_created ON public.ai_usage_log(created_at DESC);

-- 테이블 설명
COMMENT ON TABLE public.ai_usage_log IS 'AI 서비스 사용 상세 로그';
COMMENT ON COLUMN public.ai_usage_log.tokens_used IS 'API 토큰 사용량';
COMMENT ON COLUMN public.ai_usage_log.response_time_ms IS '응답 시간 (밀리초)';

-- =====================================================
-- 완료 확인
-- =====================================================
SELECT 'AI 크레딧 시스템 테이블 생성 완료' as status;

-- 생성된 테이블 확인
SELECT table_name,
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('ai_service_pricing', 'credit_transactions', 'ai_usage_log')
ORDER BY table_name;

-- AI 가격 확인
SELECT '=== AI 서비스 가격 ===' as section;
SELECT service_name, price_per_use, api_cost, margin_percent, description
FROM public.ai_service_pricing
ORDER BY price_per_use DESC;
