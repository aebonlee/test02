-- =====================================================
-- Payment Methods 테이블 생성
-- =====================================================
-- 작성일: 2025-12-11
-- Agenda: #6 플랫폼 이용료 & 결제 관리
-- 목적: 사용자 결제 수단 정보 관리 (카드/계좌)
-- =====================================================

-- 기존 테이블 삭제 (개발 환경용)
DROP TABLE IF EXISTS public.payment_methods CASCADE;

-- 테이블 생성
CREATE TABLE public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 사용자 연결
    user_id VARCHAR(8) NOT NULL,

    -- 결제 수단 유형
    payment_type VARCHAR(10) NOT NULL CHECK (payment_type IN ('card', 'bank')),

    -- 카드 정보 (payment_type = 'card' 일 때)
    card_last4 VARCHAR(4),
    card_company VARCHAR(50),

    -- 계좌 정보 (payment_type = 'bank' 일 때)
    bank_name VARCHAR(50),
    account_last4 VARCHAR(4),

    -- 기본 결제 수단 여부
    is_default BOOLEAN DEFAULT true,

    -- 토스페이먼츠 빌링키 (자동결제용)
    toss_billing_key TEXT,

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- 외래키 제약
    CONSTRAINT fk_payment_methods_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX idx_payment_methods_is_default ON public.payment_methods(is_default) WHERE is_default = true;

-- 자동 updated_at 업데이트 트리거
CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_payment_methods_updated_at ON public.payment_methods;
CREATE TRIGGER trigger_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION update_payment_methods_updated_at();

-- 테이블 설명 추가
COMMENT ON TABLE public.payment_methods IS '사용자 결제 수단 정보';
COMMENT ON COLUMN public.payment_methods.user_id IS '사용자 ID (users.user_id 참조)';
COMMENT ON COLUMN public.payment_methods.payment_type IS '결제 수단 유형: card(카드), bank(계좌)';
COMMENT ON COLUMN public.payment_methods.card_last4 IS '카드번호 마지막 4자리';
COMMENT ON COLUMN public.payment_methods.card_company IS '카드사명';
COMMENT ON COLUMN public.payment_methods.bank_name IS '은행명';
COMMENT ON COLUMN public.payment_methods.account_last4 IS '계좌번호 마지막 4자리';
COMMENT ON COLUMN public.payment_methods.is_default IS '기본 결제 수단 여부';
COMMENT ON COLUMN public.payment_methods.toss_billing_key IS '토스페이먼츠 빌링키 (자동결제용)';

-- 완료 확인
SELECT 'payment_methods 테이블 생성 완료' as status;
