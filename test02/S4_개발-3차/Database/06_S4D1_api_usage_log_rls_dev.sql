-- api_usage_log RLS 정책 추가 (개발용 - anon 접근 허용)
-- Supabase Dashboard > SQL Editor에서 실행

-- 기존 정책 유지하면서 anon 조회 허용 추가
DROP POLICY IF EXISTS "Anon can view usage logs" ON api_usage_log;
CREATE POLICY "Anon can view usage logs"
    ON api_usage_log FOR SELECT
    USING (true);

-- INSERT도 허용 (service_role_key 없이도 로깅 가능)
DROP POLICY IF EXISTS "Allow insert for all" ON api_usage_log;
CREATE POLICY "Allow insert for all"
    ON api_usage_log FOR INSERT
    WITH CHECK (true);
