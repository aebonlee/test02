-- Storage attachments 버킷 RLS 정책
-- 실행 위치: Supabase Dashboard > SQL Editor

-- 모든 사용자(익명 포함)가 attachments 버킷에 파일 업로드 가능
CREATE POLICY "Allow all uploads to attachments"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'attachments');

-- 모든 사용자가 attachments 버킷 파일 읽기 가능
CREATE POLICY "Allow all reads from attachments"
ON storage.objects
FOR SELECT
USING (bucket_id = 'attachments');

-- 서비스 역할은 모든 작업 가능
CREATE POLICY "Service role has full access to attachments"
ON storage.objects
FOR ALL
USING (auth.role() = 'service_role');
