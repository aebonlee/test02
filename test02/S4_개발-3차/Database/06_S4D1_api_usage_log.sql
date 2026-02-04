-- @task S4D1
-- S4D1: API 사용 로그 테이블

-- 기존 테이블 삭제 후 재생성
DROP TABLE IF EXISTS api_usage_log CASCADE;

CREATE TABLE api_usage_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    ai_model VARCHAR(50),
    input_tokens INTEGER,
    output_tokens INTEGER,
    cost_credits INTEGER,
    response_time_ms INTEGER,
    status_code INTEGER,
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_api_usage_log_user_id ON api_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_log_endpoint ON api_usage_log(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_log_created_at ON api_usage_log(created_at);

-- RLS (관리자만 조회)
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all usage logs" ON api_usage_log;
CREATE POLICY "Admins can view all usage logs"
    ON api_usage_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
