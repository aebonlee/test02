-- =====================================================
-- 모든 RLS 정책 삭제 (클린 스타트용)
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 기존 정책을 모두 삭제하고 개발용 정책을 새로 적용하기 위함
-- =====================================================

-- learning_contents 정책 모두 삭제
DROP POLICY IF EXISTS "Anyone can view learning contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can insert learning contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can update learning contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can delete learning contents" ON learning_contents;
DROP POLICY IF EXISTS "Anyone can insert learning contents (DEV)" ON learning_contents;
DROP POLICY IF EXISTS "Anyone can update learning contents (DEV)" ON learning_contents;
DROP POLICY IF EXISTS "Anyone can delete learning contents (DEV)" ON learning_contents;

-- faqs 정책 모두 삭제
DROP POLICY IF EXISTS "faqs_select_all" ON faqs;
DROP POLICY IF EXISTS "faqs_insert_authenticated" ON faqs;
DROP POLICY IF EXISTS "faqs_update_authenticated" ON faqs;
DROP POLICY IF EXISTS "faqs_delete_authenticated" ON faqs;
DROP POLICY IF EXISTS "faqs_insert_all_dev" ON faqs;
DROP POLICY IF EXISTS "faqs_update_all_dev" ON faqs;
DROP POLICY IF EXISTS "faqs_delete_all_dev" ON faqs;

-- 완료
SELECT 'All policies dropped successfully!' as status;
