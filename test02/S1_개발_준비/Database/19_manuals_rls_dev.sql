-- ================================================
-- 매뉴얼 테이블 RLS 정책 (개발용)
-- ================================================
-- 작성일: 2025-12-11
-- 목적: 개발 환경에서 Admin Dashboard가 anon key로 CRUD 가능하도록 설정
-- 경고: 프로덕션 배포 전 반드시 보안 정책으로 교체 필요!
-- ================================================

-- RLS 활성화
ALTER TABLE manuals ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있으면)
DROP POLICY IF EXISTS "manuals_select_policy" ON manuals;
DROP POLICY IF EXISTS "manuals_insert_policy" ON manuals;
DROP POLICY IF EXISTS "manuals_update_policy" ON manuals;
DROP POLICY IF EXISTS "manuals_delete_policy" ON manuals;

-- ================================================
-- 개발용 정책 (모든 역할 허용)
-- ================================================

-- SELECT: 모든 사용자 허용
CREATE POLICY "manuals_select_policy" ON manuals
    FOR SELECT
    USING (true);

-- INSERT: 개발 환경에서 anon 포함 모든 역할 허용
CREATE POLICY "manuals_insert_policy" ON manuals
    FOR INSERT
    WITH CHECK (true);

-- UPDATE: 개발 환경에서 anon 포함 모든 역할 허용
CREATE POLICY "manuals_update_policy" ON manuals
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- DELETE: 개발 환경에서 anon 포함 모든 역할 허용
CREATE POLICY "manuals_delete_policy" ON manuals
    FOR DELETE
    USING (true);

-- ================================================
-- ⚠️ 프로덕션 배포 전 필수 작업
-- ================================================
-- 이 개발용 정책을 아래와 같은 보안 정책으로 교체해야 함:
--
-- -- SELECT: 모든 사용자 가능
-- CREATE POLICY "manuals_select_policy" ON manuals
--     FOR SELECT USING (true);
--
-- -- INSERT: authenticated 사용자만 가능
-- CREATE POLICY "manuals_insert_policy" ON manuals
--     FOR INSERT
--     WITH CHECK (auth.role() = 'authenticated');
--
-- -- UPDATE: authenticated 사용자만 가능
-- CREATE POLICY "manuals_update_policy" ON manuals
--     FOR UPDATE
--     USING (auth.role() = 'authenticated')
--     WITH CHECK (auth.role() = 'authenticated');
--
-- -- DELETE: authenticated 사용자만 가능
-- CREATE POLICY "manuals_delete_policy" ON manuals
--     FOR DELETE
--     USING (auth.role() = 'authenticated');
-- ================================================

-- ================================================
-- 완료!
-- ================================================
-- 실행 방법: Supabase SQL Editor에서 이 파일 내용 실행
-- ================================================
