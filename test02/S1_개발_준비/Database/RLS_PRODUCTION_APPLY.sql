-- =====================================================
-- RLS 프로덕션 적용 스크립트
-- =====================================================
-- 실행일: 2026-01-03
-- 목적: 개발용 RLS → 프로덕션용 RLS 교체
-- 실행 위치: Supabase Dashboard > SQL Editor
-- =====================================================

-- =====================================================
-- 1. learning_contents 테이블 RLS 교체
-- =====================================================

-- 개발용 정책 삭제
DROP POLICY IF EXISTS "Anyone can insert learning contents (DEV)" ON learning_contents;
DROP POLICY IF EXISTS "Anyone can update learning contents (DEV)" ON learning_contents;
DROP POLICY IF EXISTS "Anyone can delete learning contents (DEV)" ON learning_contents;

-- 프로덕션 정책 생성 (authenticated 사용자만 CUD 가능)
CREATE POLICY "Only admins can insert learning contents" ON learning_contents
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update learning contents" ON learning_contents
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete learning contents" ON learning_contents
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- =====================================================
-- 2. faqs 테이블 RLS 교체
-- =====================================================

-- 개발용 정책 삭제
DROP POLICY IF EXISTS "faqs_insert_all_dev" ON faqs;
DROP POLICY IF EXISTS "faqs_update_all_dev" ON faqs;
DROP POLICY IF EXISTS "faqs_delete_all_dev" ON faqs;

-- 프로덕션 정책 생성 (authenticated 사용자만 CUD 가능)
CREATE POLICY "faqs_insert_authenticated" ON faqs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "faqs_update_authenticated" ON faqs
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "faqs_delete_authenticated" ON faqs
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================================================
-- 완료!
-- =====================================================
-- 적용 후 확인:
-- 1. 비로그인 사용자: SELECT만 가능
-- 2. 로그인 사용자: SELECT/INSERT/UPDATE/DELETE 가능
-- =====================================================
