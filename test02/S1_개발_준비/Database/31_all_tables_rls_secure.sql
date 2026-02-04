-- =====================================================
-- 전체 테이블 보안 RLS 정책 (프로덕션용)
-- =====================================================
-- 작성일: 2026-01-18
-- 목적: 모든 테이블에 보안 RLS 정책 적용
-- 배경: 개발용 RLS가 적용되어 있어 보안 침해 발생
-- =====================================================

-- =====================================================
-- 1. projects 테이블
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view projects" ON projects;
DROP POLICY IF EXISTS "Anyone can insert projects" ON projects;
DROP POLICY IF EXISTS "Anyone can update projects" ON projects;
DROP POLICY IF EXISTS "Anyone can delete projects" ON projects;

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- SELECT: 본인 프로젝트 또는 Admin
CREATE POLICY "projects_select_own" ON projects
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- INSERT: 본인 프로젝트만
CREATE POLICY "projects_insert_own" ON projects
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- UPDATE: 본인 프로젝트 또는 Admin
CREATE POLICY "projects_update_own" ON projects
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- DELETE: Admin만
CREATE POLICY "projects_delete_admin" ON projects
    FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- 2. installation_payment_requests 테이블
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view payment_requests" ON installation_payment_requests;
DROP POLICY IF EXISTS "Anyone can insert payment_requests" ON installation_payment_requests;
DROP POLICY IF EXISTS "Anyone can update payment_requests" ON installation_payment_requests;
DROP POLICY IF EXISTS "Anyone can delete payment_requests" ON installation_payment_requests;

ALTER TABLE installation_payment_requests ENABLE ROW LEVEL SECURITY;

-- SELECT: 본인 요청 또는 Admin
CREATE POLICY "payment_requests_select_own" ON installation_payment_requests
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- INSERT: 본인 요청만
CREATE POLICY "payment_requests_insert_own" ON installation_payment_requests
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- UPDATE: Admin만 (결제 승인 등)
CREATE POLICY "payment_requests_update_admin" ON installation_payment_requests
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- DELETE: Admin만
CREATE POLICY "payment_requests_delete_admin" ON installation_payment_requests
    FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- 3. payment_methods 테이블
-- =====================================================
DROP POLICY IF EXISTS "payment_methods_select_dev" ON payment_methods;
DROP POLICY IF EXISTS "payment_methods_insert_dev" ON payment_methods;
DROP POLICY IF EXISTS "payment_methods_update_dev" ON payment_methods;
DROP POLICY IF EXISTS "payment_methods_delete_dev" ON payment_methods;

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- SELECT: 본인 결제수단 또는 Admin
CREATE POLICY "payment_methods_select_own" ON payment_methods
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- INSERT: 본인 결제수단만
CREATE POLICY "payment_methods_insert_own" ON payment_methods
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- UPDATE: 본인 결제수단만
CREATE POLICY "payment_methods_update_own" ON payment_methods
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid());

-- DELETE: 본인 결제수단만
CREATE POLICY "payment_methods_delete_own" ON payment_methods
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- =====================================================
-- 4. billing_history 테이블
-- =====================================================
DROP POLICY IF EXISTS "billing_history_select_dev" ON billing_history;
DROP POLICY IF EXISTS "billing_history_insert_dev" ON billing_history;
DROP POLICY IF EXISTS "billing_history_update_dev" ON billing_history;
DROP POLICY IF EXISTS "billing_history_delete_dev" ON billing_history;

ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- SELECT: 본인 내역 또는 Admin
CREATE POLICY "billing_history_select_own" ON billing_history
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- INSERT: 시스템만 (서비스 역할)
CREATE POLICY "billing_history_insert_system" ON billing_history
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- UPDATE: Admin만
CREATE POLICY "billing_history_update_admin" ON billing_history
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- DELETE: 불가
-- (정책 없음 = 삭제 불가)

-- =====================================================
-- 5. ai_service_pricing 테이블 (가격표 - 읽기 전용)
-- =====================================================
DROP POLICY IF EXISTS "ai_pricing_select_dev" ON ai_service_pricing;
DROP POLICY IF EXISTS "ai_pricing_insert_dev" ON ai_service_pricing;
DROP POLICY IF EXISTS "ai_pricing_update_dev" ON ai_service_pricing;
DROP POLICY IF EXISTS "ai_pricing_delete_dev" ON ai_service_pricing;

ALTER TABLE ai_service_pricing ENABLE ROW LEVEL SECURITY;

-- SELECT: 모든 인증 사용자
CREATE POLICY "ai_pricing_select_all" ON ai_service_pricing
    FOR SELECT TO authenticated
    USING (true);

-- INSERT/UPDATE/DELETE: Admin만
CREATE POLICY "ai_pricing_modify_admin" ON ai_service_pricing
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- 6. credit_transactions 테이블
-- =====================================================
DROP POLICY IF EXISTS "credit_trans_select_dev" ON credit_transactions;
DROP POLICY IF EXISTS "credit_trans_insert_dev" ON credit_transactions;
DROP POLICY IF EXISTS "credit_trans_update_dev" ON credit_transactions;
DROP POLICY IF EXISTS "credit_trans_delete_dev" ON credit_transactions;

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- SELECT: 본인 거래내역 또는 Admin
CREATE POLICY "credit_trans_select_own" ON credit_transactions
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- INSERT: Admin만 (크레딧 충전은 시스템에서만)
CREATE POLICY "credit_trans_insert_admin" ON credit_transactions
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- UPDATE/DELETE: 불가 (거래 기록은 변경 불가)
-- (정책 없음 = 변경/삭제 불가)

-- =====================================================
-- 7. ai_usage_log 테이블
-- =====================================================
DROP POLICY IF EXISTS "ai_usage_select_dev" ON ai_usage_log;
DROP POLICY IF EXISTS "ai_usage_insert_dev" ON ai_usage_log;
DROP POLICY IF EXISTS "ai_usage_update_dev" ON ai_usage_log;
DROP POLICY IF EXISTS "ai_usage_delete_dev" ON ai_usage_log;

ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;

-- SELECT: 본인 사용내역 또는 Admin
CREATE POLICY "ai_usage_select_own" ON ai_usage_log
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- INSERT: 인증된 사용자 (AI 사용 시 로그 기록)
CREATE POLICY "ai_usage_insert_own" ON ai_usage_log
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- UPDATE/DELETE: 불가 (로그는 변경 불가)
-- (정책 없음 = 변경/삭제 불가)

-- =====================================================
-- 8. manuals 테이블
-- =====================================================
DROP POLICY IF EXISTS "manuals_select_policy" ON manuals;
DROP POLICY IF EXISTS "manuals_insert_policy" ON manuals;
DROP POLICY IF EXISTS "manuals_update_policy" ON manuals;
DROP POLICY IF EXISTS "manuals_delete_policy" ON manuals;

ALTER TABLE manuals ENABLE ROW LEVEL SECURITY;

-- SELECT: 모든 인증 사용자
CREATE POLICY "manuals_select_all" ON manuals
    FOR SELECT TO authenticated
    USING (true);

-- INSERT/UPDATE/DELETE: Admin만
CREATE POLICY "manuals_insert_admin" ON manuals
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "manuals_update_admin" ON manuals
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "manuals_delete_admin" ON manuals
    FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- 9. inquiries 테이블
-- =====================================================
DROP POLICY IF EXISTS "inquiries_select_dev" ON inquiries;
DROP POLICY IF EXISTS "inquiries_insert_dev" ON inquiries;
DROP POLICY IF EXISTS "inquiries_update_dev" ON inquiries;
DROP POLICY IF EXISTS "inquiries_delete_dev" ON inquiries;

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- SELECT: 본인 문의 또는 Admin
CREATE POLICY "inquiries_select_own" ON inquiries
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- INSERT: 인증된 사용자 (문의 등록)
CREATE POLICY "inquiries_insert_auth" ON inquiries
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- UPDATE: Admin만 (답변 등록)
CREATE POLICY "inquiries_update_admin" ON inquiries
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- DELETE: Admin만
CREATE POLICY "inquiries_delete_admin" ON inquiries
    FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- 완료 확인
-- =====================================================
SELECT '모든 테이블 보안 RLS 정책 적용 완료!' as status;
