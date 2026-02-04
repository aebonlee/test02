-- =====================================================
-- RLS 정책 확인
-- =====================================================
-- 현재 어떤 정책들이 적용되어 있는지 확인

-- learning_contents 정책 확인
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'learning_contents';

-- faqs 정책 확인
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'faqs';
