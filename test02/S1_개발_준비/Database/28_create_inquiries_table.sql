-- =====================================================
-- Agenda #9: 고객 문의 관리 - inquiries 테이블 생성
-- 생성일: 2025-12-12
-- 작성자: Claude Code
-- =====================================================

-- =====================================================
-- 1. inquiries 테이블 생성
-- =====================================================
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('general', 'technical', 'payment', 'account', 'partnership', 'other')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'answered', 'closed')),
    answer TEXT,
    answered_at TIMESTAMPTZ,
    answered_by TEXT,  -- 관리자 ID
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. 인덱스 생성
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_type ON inquiries(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_priority ON inquiries(priority);

-- =====================================================
-- 3. 코멘트 추가
-- =====================================================
COMMENT ON TABLE inquiries IS '고객 문의 테이블 - Agenda #9';
COMMENT ON COLUMN inquiries.inquiry_type IS '문의 유형: general(일반), technical(기술지원), payment(결제/환불), account(계정), partnership(제휴), other(기타)';
COMMENT ON COLUMN inquiries.status IS '상태: pending(대기), in_progress(처리중), answered(답변완료), closed(종료)';
COMMENT ON COLUMN inquiries.priority IS '우선순위: low(낮음), normal(보통), high(높음), urgent(긴급)';

-- =====================================================
-- 4. updated_at 자동 업데이트 트리거
-- =====================================================
CREATE OR REPLACE FUNCTION update_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_inquiries_updated_at ON inquiries;
CREATE TRIGGER trigger_inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_inquiries_updated_at();

-- =====================================================
-- 완료 메시지
-- =====================================================
-- inquiries 테이블 생성 완료
-- 다음 단계: 29_inquiries_rls_dev.sql 실행
