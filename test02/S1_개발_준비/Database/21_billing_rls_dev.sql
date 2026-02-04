-- =====================================================
-- Billing 관련 RLS 정책 (개발 환경용)
-- =====================================================
-- 작성일: 2025-12-11
-- Agenda: #6 플랫폼 이용료 & 결제 관리
-- 목적: 개발 중 anon 키로 테스트 가능하도록
-- =====================================================
--
-- ⚠️  경고: 이 파일은 개발 환경 전용입니다!
-- ⚠️  프로덕션 배포 전 반드시 21_billing_rls.sql로 교체하세요!
--
-- =====================================================

-- ===========================================
-- payment_methods 테이블 RLS
-- ===========================================

-- RLS 활성화
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "payment_methods_select_dev" ON public.payment_methods;
DROP POLICY IF EXISTS "payment_methods_insert_dev" ON public.payment_methods;
DROP POLICY IF EXISTS "payment_methods_update_dev" ON public.payment_methods;
DROP POLICY IF EXISTS "payment_methods_delete_dev" ON public.payment_methods;

-- 개발용 정책: 모든 작업 허용
CREATE POLICY "payment_methods_select_dev" ON public.payment_methods
    FOR SELECT TO public USING (true);

CREATE POLICY "payment_methods_insert_dev" ON public.payment_methods
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "payment_methods_update_dev" ON public.payment_methods
    FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "payment_methods_delete_dev" ON public.payment_methods
    FOR DELETE TO public USING (true);

-- ===========================================
-- billing_history 테이블 RLS
-- ===========================================

-- RLS 활성화
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "billing_history_select_dev" ON public.billing_history;
DROP POLICY IF EXISTS "billing_history_insert_dev" ON public.billing_history;
DROP POLICY IF EXISTS "billing_history_update_dev" ON public.billing_history;
DROP POLICY IF EXISTS "billing_history_delete_dev" ON public.billing_history;

-- 개발용 정책: 모든 작업 허용
CREATE POLICY "billing_history_select_dev" ON public.billing_history
    FOR SELECT TO public USING (true);

CREATE POLICY "billing_history_insert_dev" ON public.billing_history
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "billing_history_update_dev" ON public.billing_history
    FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "billing_history_delete_dev" ON public.billing_history
    FOR DELETE TO public USING (true);

-- ===========================================
-- 완료 확인
-- ===========================================
SELECT 'billing 관련 개발용 RLS 정책 적용 완료' as status,
       '프로덕션 배포 전 원래 정책으로 되돌려야 합니다!' as warning;
