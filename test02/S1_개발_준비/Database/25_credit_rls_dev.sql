-- =====================================================
-- AI 크레딧 관련 RLS 정책 (개발 환경용)
-- =====================================================
-- 작성일: 2025-12-12
-- Agenda: #7 AI 크레딧 충전 & 사용
-- 목적: 개발 중 anon 키로 테스트 가능하도록
-- =====================================================
--
-- ⚠️  경고: 이 파일은 개발 환경 전용입니다!
-- ⚠️  프로덕션 배포 전 반드시 인증 기반 정책으로 교체하세요!
--
-- =====================================================

-- ===========================================
-- ai_service_pricing 테이블 RLS
-- ===========================================
ALTER TABLE public.ai_service_pricing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_pricing_select_dev" ON public.ai_service_pricing;
DROP POLICY IF EXISTS "ai_pricing_insert_dev" ON public.ai_service_pricing;
DROP POLICY IF EXISTS "ai_pricing_update_dev" ON public.ai_service_pricing;
DROP POLICY IF EXISTS "ai_pricing_delete_dev" ON public.ai_service_pricing;

CREATE POLICY "ai_pricing_select_dev" ON public.ai_service_pricing
    FOR SELECT TO public USING (true);

CREATE POLICY "ai_pricing_insert_dev" ON public.ai_service_pricing
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "ai_pricing_update_dev" ON public.ai_service_pricing
    FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "ai_pricing_delete_dev" ON public.ai_service_pricing
    FOR DELETE TO public USING (true);

-- ===========================================
-- credit_transactions 테이블 RLS
-- ===========================================
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "credit_trans_select_dev" ON public.credit_transactions;
DROP POLICY IF EXISTS "credit_trans_insert_dev" ON public.credit_transactions;
DROP POLICY IF EXISTS "credit_trans_update_dev" ON public.credit_transactions;
DROP POLICY IF EXISTS "credit_trans_delete_dev" ON public.credit_transactions;

CREATE POLICY "credit_trans_select_dev" ON public.credit_transactions
    FOR SELECT TO public USING (true);

CREATE POLICY "credit_trans_insert_dev" ON public.credit_transactions
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "credit_trans_update_dev" ON public.credit_transactions
    FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "credit_trans_delete_dev" ON public.credit_transactions
    FOR DELETE TO public USING (true);

-- ===========================================
-- ai_usage_log 테이블 RLS
-- ===========================================
ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_usage_select_dev" ON public.ai_usage_log;
DROP POLICY IF EXISTS "ai_usage_insert_dev" ON public.ai_usage_log;
DROP POLICY IF EXISTS "ai_usage_update_dev" ON public.ai_usage_log;
DROP POLICY IF EXISTS "ai_usage_delete_dev" ON public.ai_usage_log;

CREATE POLICY "ai_usage_select_dev" ON public.ai_usage_log
    FOR SELECT TO public USING (true);

CREATE POLICY "ai_usage_insert_dev" ON public.ai_usage_log
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "ai_usage_update_dev" ON public.ai_usage_log
    FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "ai_usage_delete_dev" ON public.ai_usage_log
    FOR DELETE TO public USING (true);

-- ===========================================
-- 완료 확인
-- ===========================================
SELECT 'AI 크레딧 관련 개발용 RLS 정책 적용 완료' as status,
       '프로덕션 배포 전 원래 정책으로 되돌려야 합니다!' as warning;
