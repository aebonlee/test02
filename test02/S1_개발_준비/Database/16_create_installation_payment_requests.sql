-- =====================================================
-- Agenda #5: installation_payment_requests 테이블 생성
-- =====================================================
-- 작성일: 2025-12-11
-- 목적: 설치비 입금 요청 관리
-- 실행 순서: 16번째
-- =====================================================

-- =====================================================
-- 1. installation_payment_requests 테이블 생성
-- =====================================================
CREATE TABLE IF NOT EXISTS installation_payment_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 사용자 연결
    user_id VARCHAR(8) NOT NULL,

    -- 입금 정보
    depositor_name VARCHAR(50) NOT NULL,        -- 입금자명
    amount INTEGER DEFAULT 3000000,              -- 금액 (원)

    -- 상태
    status VARCHAR(20) DEFAULT 'pending',        -- pending / approved / rejected

    -- 처리 정보
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    processed_by UUID,                           -- 처리한 관리자 ID
    reject_reason TEXT,                          -- 거부 사유

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. 인덱스 생성
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON installation_payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON installation_payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_requested_at ON installation_payment_requests(requested_at);

-- =====================================================
-- 3. updated_at 자동 업데이트 트리거
-- =====================================================
CREATE OR REPLACE FUNCTION update_payment_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_payment_requests_updated_at ON installation_payment_requests;
CREATE TRIGGER trigger_payment_requests_updated_at
BEFORE UPDATE ON installation_payment_requests
FOR EACH ROW
EXECUTE FUNCTION update_payment_requests_updated_at();

-- =====================================================
-- 4. RLS 활성화
-- =====================================================
ALTER TABLE installation_payment_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 완료 확인
-- =====================================================
SELECT 'installation_payment_requests 테이블 생성 완료!' as status;
