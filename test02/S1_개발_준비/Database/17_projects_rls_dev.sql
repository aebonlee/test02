-- =====================================================
-- Agenda #5: projects & installation_payment_requests RLS 정책 (개발용)
-- =====================================================
-- 작성일: 2025-12-11
-- 목적: 개발 환경에서 Admin Dashboard가 anon key로 CRUD 가능하도록 설정
-- 실행 순서: 17번째
-- ⚠️ 프로덕션 배포 전 반드시 원래 RLS 정책으로 교체 필요!
-- =====================================================

-- =====================================================
-- 1. projects 테이블 RLS 정책 (개발용)
-- =====================================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Anyone can view projects" ON projects;
DROP POLICY IF EXISTS "Anyone can insert projects" ON projects;
DROP POLICY IF EXISTS "Anyone can update projects" ON projects;
DROP POLICY IF EXISTS "Anyone can delete projects" ON projects;

-- 개발용: 모든 사용자가 모든 작업 가능
CREATE POLICY "Anyone can view projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert projects" ON projects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update projects" ON projects
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete projects" ON projects
    FOR DELETE USING (true);

-- =====================================================
-- 2. installation_payment_requests 테이블 RLS 정책 (개발용)
-- =====================================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Anyone can view payment_requests" ON installation_payment_requests;
DROP POLICY IF EXISTS "Anyone can insert payment_requests" ON installation_payment_requests;
DROP POLICY IF EXISTS "Anyone can update payment_requests" ON installation_payment_requests;
DROP POLICY IF EXISTS "Anyone can delete payment_requests" ON installation_payment_requests;

-- 개발용: 모든 사용자가 모든 작업 가능
CREATE POLICY "Anyone can view payment_requests" ON installation_payment_requests
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert payment_requests" ON installation_payment_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update payment_requests" ON installation_payment_requests
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete payment_requests" ON installation_payment_requests
    FOR DELETE USING (true);

-- =====================================================
-- 완료 확인
-- =====================================================
SELECT 'projects & installation_payment_requests 개발용 RLS 정책 적용 완료!' as status;

-- =====================================================
-- ⚠️ 프로덕션 배포 전 필수 작업
-- =====================================================
-- 이 개발용 RLS 정책은 프로덕션 배포 전에 반드시 교체해야 합니다!
--
-- 프로덕션용 정책 예시:
--
-- projects 테이블:
-- - SELECT: 본인 프로젝트만 조회 가능 (WHERE user_id = auth.uid())
-- - INSERT: 본인 프로젝트만 생성 가능
-- - UPDATE: 본인 프로젝트만 수정 가능
-- - DELETE: Admin만 가능
--
-- installation_payment_requests 테이블:
-- - SELECT: 본인 요청만 조회 / Admin은 모두 조회
-- - INSERT: 본인 요청만 생성 가능
-- - UPDATE: Admin만 가능
-- - DELETE: Admin만 가능
-- =====================================================
