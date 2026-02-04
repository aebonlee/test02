-- =====================================================
-- download_agreements 테이블
-- SSAL Works 예시 프로젝트 다운로드 서약 기록
-- =====================================================

CREATE TABLE IF NOT EXISTS download_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT,
    builder_account_id TEXT,
    resource_type TEXT NOT NULL DEFAULT 'ssalworks_example',
    agreed_at TIMESTAMPTZ DEFAULT NOW(),
    agreement_version TEXT DEFAULT 'v1',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_download_agreements_user_id ON download_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_download_agreements_resource_type ON download_agreements(resource_type);

-- RLS 활성화
ALTER TABLE download_agreements ENABLE ROW LEVEL SECURITY;

-- 정책: 본인 기록만 조회 가능
CREATE POLICY "Users can view own agreements"
    ON download_agreements
    FOR SELECT
    USING (auth.uid() = user_id);

-- 정책: 로그인한 사용자만 삽입 가능
CREATE POLICY "Authenticated users can insert agreements"
    ON download_agreements
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 코멘트
COMMENT ON TABLE download_agreements IS 'SSAL Works 예시 프로젝트 다운로드 서약 기록';
COMMENT ON COLUMN download_agreements.resource_type IS '다운로드 리소스 유형 (ssalworks_example 등)';
COMMENT ON COLUMN download_agreements.agreement_version IS '서약서 버전';
