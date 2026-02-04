-- ================================================================
-- OWASP A09: Security Logging and Monitoring 대응
-- 보안 이벤트 로깅 테이블
-- ================================================================

-- security_logs 테이블 생성
CREATE TABLE IF NOT EXISTS security_logs (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    endpoint VARCHAR(255),
    severity VARCHAR(20) DEFAULT 'low',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip ON security_logs(ip_address);

-- 코멘트 추가
COMMENT ON TABLE security_logs IS 'OWASP A09 대응: 보안 이벤트 로깅 테이블';
COMMENT ON COLUMN security_logs.event_type IS '이벤트 타입 (LOGIN_FAILED, RATE_LIMIT_EXCEEDED 등)';
COMMENT ON COLUMN security_logs.severity IS '심각도 (critical, high, medium, low)';
COMMENT ON COLUMN security_logs.metadata IS '추가 정보 (JSON)';

-- RLS 활성화
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 읽기는 Admin만 가능
CREATE POLICY "security_logs_admin_select" ON security_logs
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- RLS 정책: 쓰기는 service_role만 가능 (API 서버)
-- anon 및 authenticated 사용자는 직접 INSERT 불가
-- 서버 측에서 service_role 키로 INSERT

-- 30일 이상 된 로그 자동 삭제 함수 (선택적)
CREATE OR REPLACE FUNCTION cleanup_old_security_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM security_logs
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 사용 예: SELECT cleanup_old_security_logs();
-- 또는 pg_cron으로 주기적 실행 설정

-- ================================================================
-- 유용한 조회 쿼리 예시
-- ================================================================

-- 최근 24시간 인증 실패 목록
-- SELECT * FROM security_logs
-- WHERE event_type = 'LOGIN_FAILED'
-- AND created_at > NOW() - INTERVAL '24 hours'
-- ORDER BY created_at DESC;

-- IP별 인증 실패 횟수 (의심스러운 IP 탐지)
-- SELECT ip_address, COUNT(*) as failure_count
-- FROM security_logs
-- WHERE event_type = 'LOGIN_FAILED'
-- AND created_at > NOW() - INTERVAL '1 hour'
-- GROUP BY ip_address
-- HAVING COUNT(*) > 5
-- ORDER BY failure_count DESC;

-- 심각도별 이벤트 통계
-- SELECT severity, COUNT(*) as count
-- FROM security_logs
-- WHERE created_at > NOW() - INTERVAL '24 hours'
-- GROUP BY severity
-- ORDER BY CASE severity
--     WHEN 'critical' THEN 1
--     WHEN 'high' THEN 2
--     WHEN 'medium' THEN 3
--     WHEN 'low' THEN 4
-- END;
