-- sunny_inquiries 테이블 생성
-- 써니에게 묻기 문의 전용 테이블

CREATE TABLE IF NOT EXISTS sunny_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    user_name TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'answered', 'closed')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    admin_answer TEXT,
    answered_at TIMESTAMPTZ,
    answered_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sunny_inquiries_user_id ON sunny_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_sunny_inquiries_status ON sunny_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_sunny_inquiries_created_at ON sunny_inquiries(created_at DESC);

-- RLS 정책
ALTER TABLE sunny_inquiries ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 문의만 조회/생성 가능
CREATE POLICY "Users can view own sunny inquiries"
    ON sunny_inquiries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sunny inquiries"
    ON sunny_inquiries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 서비스 역할은 모든 작업 가능 (관리자용)
CREATE POLICY "Service role has full access to sunny inquiries"
    ON sunny_inquiries FOR ALL
    USING (auth.role() = 'service_role');

-- [개발용] anon 역할 전체 접근 허용 (프로덕션 배포 전 삭제 필요!)
CREATE POLICY "Allow anon full access to sunny inquiries (DEV)"
    ON sunny_inquiries FOR ALL
    USING (true)
    WITH CHECK (true);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_sunny_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sunny_inquiries_updated_at
    BEFORE UPDATE ON sunny_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_sunny_inquiries_updated_at();

-- 코멘트
COMMENT ON TABLE sunny_inquiries IS '써니에게 묻기 문의 테이블';
COMMENT ON COLUMN sunny_inquiries.status IS 'pending: 대기, in_progress: 처리중, answered: 답변완료, closed: 종료';
