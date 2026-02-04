-- =====================================================
-- 개발 환경용 RLS 정책 적용 (최종)
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 기존 정책 완전 삭제 후 개발용 정책 적용
-- =====================================================

-- =====================================================
-- 1단계: learning_contents 정책 처리
-- =====================================================

-- 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Anyone can view learning contents" ON public.learning_contents;
DROP POLICY IF EXISTS "Only admins can insert learning contents" ON public.learning_contents;
DROP POLICY IF EXISTS "Only admins can update learning contents" ON public.learning_contents;
DROP POLICY IF EXISTS "Only admins can delete learning contents" ON public.learning_contents;
DROP POLICY IF EXISTS "Anyone can insert learning contents (DEV)" ON public.learning_contents;
DROP POLICY IF EXISTS "Anyone can update learning contents (DEV)" ON public.learning_contents;
DROP POLICY IF EXISTS "Anyone can delete learning contents (DEV)" ON public.learning_contents;

-- RLS 활성화
ALTER TABLE public.learning_contents ENABLE ROW LEVEL SECURITY;

-- 개발 환경용 정책 생성
CREATE POLICY "learning_select_all_dev" ON public.learning_contents
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "learning_insert_all_dev" ON public.learning_contents
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "learning_update_all_dev" ON public.learning_contents
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "learning_delete_all_dev" ON public.learning_contents
    FOR DELETE
    TO public
    USING (true);

-- =====================================================
-- 2단계: faqs 정책 처리
-- =====================================================

-- 기존 정책 모두 삭제
DROP POLICY IF EXISTS "faqs_select_all" ON public.faqs;
DROP POLICY IF EXISTS "faqs_insert_authenticated" ON public.faqs;
DROP POLICY IF EXISTS "faqs_update_authenticated" ON public.faqs;
DROP POLICY IF EXISTS "faqs_delete_authenticated" ON public.faqs;
DROP POLICY IF EXISTS "faqs_insert_all_dev" ON public.faqs;
DROP POLICY IF EXISTS "faqs_update_all_dev" ON public.faqs;
DROP POLICY IF EXISTS "faqs_delete_all_dev" ON public.faqs;

-- RLS 활성화
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 개발 환경용 정책 생성
CREATE POLICY "faqs_select_all_dev" ON public.faqs
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "faqs_insert_all_dev" ON public.faqs
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "faqs_update_all_dev" ON public.faqs
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "faqs_delete_all_dev" ON public.faqs
    FOR DELETE
    TO public
    USING (true);

-- =====================================================
-- 완료!
-- =====================================================
SELECT
    '✅ 개발용 RLS 정책 적용 완료!' as status,
    '⚠️  프로덕션 배포 전 원래 정책으로 되돌려야 합니다!' as warning;
