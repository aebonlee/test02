-- =====================================================
-- FAQ 테이블 RLS (개발 환경용)
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 개발/테스트 환경에서 Admin Dashboard 작동을 위해 임시로 anon 접근 허용
-- ⚠️ 주의: 프로덕션 배포 시 10_faqs_rls.sql로 변경 필요
-- =====================================================

-- RLS 활성화
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "faqs_select_all" ON faqs;
DROP POLICY IF EXISTS "faqs_insert_authenticated" ON faqs;
DROP POLICY IF EXISTS "faqs_update_authenticated" ON faqs;
DROP POLICY IF EXISTS "faqs_delete_authenticated" ON faqs;

-- ================================================
-- 개발 환경용 정책: 모든 작업 허용
-- ================================================

-- SELECT: 모든 사용자 가능
CREATE POLICY "faqs_select_all" ON faqs
    FOR SELECT
    USING (true);

-- INSERT: anon 포함 모든 사용자 가능 (개발 환경용)
CREATE POLICY "faqs_insert_all_dev" ON faqs
    FOR INSERT
    WITH CHECK (true);

-- UPDATE: anon 포함 모든 사용자 가능 (개발 환경용)
CREATE POLICY "faqs_update_all_dev" ON faqs
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- DELETE: anon 포함 모든 사용자 가능 (개발 환경용)
CREATE POLICY "faqs_delete_all_dev" ON faqs
    FOR DELETE
    USING (true);

-- =====================================================
-- 완료!
-- =====================================================
-- ⚠️ 경고: 이 정책은 개발/테스트용입니다!
-- 프로덕션 배포 전에 10_faqs_rls.sql로 교체하세요!
-- =====================================================
