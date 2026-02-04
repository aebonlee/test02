-- =====================================================
-- Billing History 테이블 생성
-- =====================================================
-- 작성일: 2025-12-11
-- Agenda: #6 플랫폼 이용료 & 결제 관리
-- 목적: 플랫폼 이용료 결제 내역 관리
-- =====================================================

-- 기존 테이블 삭제 (개발 환경용)
DROP TABLE IF EXISTS public.billing_history CASCADE;

-- 테이블 생성
CREATE TABLE public.billing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 사용자 연결
    user_id VARCHAR(8) NOT NULL,

    -- 결제 유형
    billing_type VARCHAR(20) NOT NULL CHECK (billing_type IN ('platform_fee', 'credit_purchase', 'installation_fee')),

    -- 금액
    amount INTEGER NOT NULL CHECK (amount > 0),

    -- 결제 상태
    status VARCHAR(20) NOT NULL CHECK (status IN ('paid', 'failed', 'refunded', 'pending')),

    -- 결제일
    billing_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- 결제 수단 정보
    payment_method VARCHAR(100),
    payment_method_id UUID,

    -- 영수증 URL
    receipt_url TEXT,

    -- 실패 정보
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,

    -- 환불 정보
    refund_amount INTEGER,
    refund_date TIMESTAMPTZ,
    refund_reason TEXT,

    -- 토스페이먼츠 결제 키
    toss_payment_key TEXT,

    -- 메모
    notes TEXT,

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- 외래키 제약
    CONSTRAINT fk_billing_history_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_billing_history_payment_method
        FOREIGN KEY (payment_method_id)
        REFERENCES public.payment_methods(id)
        ON DELETE SET NULL
);

-- 인덱스 생성
CREATE INDEX idx_billing_history_user_id ON public.billing_history(user_id);
CREATE INDEX idx_billing_history_billing_date ON public.billing_history(billing_date DESC);
CREATE INDEX idx_billing_history_status ON public.billing_history(status);
CREATE INDEX idx_billing_history_billing_type ON public.billing_history(billing_type);
CREATE INDEX idx_billing_history_created_at ON public.billing_history(created_at DESC);

-- 복합 인덱스: 사용자별 월별 결제 내역 조회용
CREATE INDEX idx_billing_history_user_date ON public.billing_history(user_id, billing_date DESC);

-- 테이블 설명 추가
COMMENT ON TABLE public.billing_history IS '결제 내역 (플랫폼 이용료, 크레딧 충전 등)';
COMMENT ON COLUMN public.billing_history.user_id IS '사용자 ID';
COMMENT ON COLUMN public.billing_history.billing_type IS '결제 유형: platform_fee(월 이용료), credit_purchase(크레딧 충전), installation_fee(설치비)';
COMMENT ON COLUMN public.billing_history.amount IS '결제 금액 (원)';
COMMENT ON COLUMN public.billing_history.status IS '결제 상태: paid(완료), failed(실패), refunded(환불), pending(대기)';
COMMENT ON COLUMN public.billing_history.billing_date IS '결제일시';
COMMENT ON COLUMN public.billing_history.payment_method IS '결제 수단 표시명 (예: 신한카드 ****-1234)';
COMMENT ON COLUMN public.billing_history.receipt_url IS '영수증 URL';
COMMENT ON COLUMN public.billing_history.failure_reason IS '결제 실패 사유';
COMMENT ON COLUMN public.billing_history.retry_count IS '결제 재시도 횟수';
COMMENT ON COLUMN public.billing_history.refund_amount IS '환불 금액';
COMMENT ON COLUMN public.billing_history.refund_date IS '환불일시';
COMMENT ON COLUMN public.billing_history.refund_reason IS '환불 사유';
COMMENT ON COLUMN public.billing_history.toss_payment_key IS '토스페이먼츠 결제 키';

-- 완료 확인
SELECT 'billing_history 테이블 생성 완료' as status;
