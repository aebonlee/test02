-- ================================================
-- 학습용 콘텐츠 RLS (Row Level Security) 정책
-- ================================================
-- 작성일: 2025-12-02
-- 목적:
--   - 모든 사용자(익명 포함): SELECT 가능
--   - 관리자만: INSERT, UPDATE, DELETE 가능
-- ================================================

-- RLS 활성화
ALTER TABLE learning_contents ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Anyone can view learning contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can insert learning contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can update learning contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can delete learning contents" ON learning_contents;

-- ================================================
-- SELECT 정책: 모든 사용자(익명 포함) 조회 가능
-- ================================================
CREATE POLICY "Anyone can view learning contents" ON learning_contents
    FOR SELECT
    USING (true);

-- ================================================
-- INSERT 정책: 관리자만 추가 가능
-- ================================================
-- 참고: 실제 관리자 인증은 Admin Dashboard에서 처리
-- 여기서는 authenticated 사용자만 허용 (추후 role 추가 가능)
CREATE POLICY "Only admins can insert learning contents" ON learning_contents
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- ================================================
-- UPDATE 정책: 관리자만 수정 가능
-- ================================================
CREATE POLICY "Only admins can update learning contents" ON learning_contents
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ================================================
-- DELETE 정책: 관리자만 삭제 가능
-- ================================================
CREATE POLICY "Only admins can delete learning contents" ON learning_contents
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- ================================================
-- 완료!
-- ================================================
-- Frontend에서 익명 사용자도 학습 콘텐츠 조회 가능
-- Admin Dashboard에서만 CUD(생성/수정/삭제) 가능
-- ================================================
