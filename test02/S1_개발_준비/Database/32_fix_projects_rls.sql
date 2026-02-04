-- =====================================================
-- projects 테이블 RLS 정책 수정
-- =====================================================
-- 작성일: 2026-01-30
-- 목적: projects.user_id (커스텀 ID)와 auth.uid() (UUID) 불일치 해결
-- 증상: 사이드바에서 "진행중인 프로젝트 없음"으로 표시되지만
--       프로젝트 등록 시 "이미 진행 중인 프로젝트가 있습니다" 에러 발생
-- 원인: RLS에서 user_id = auth.uid() 비교 → 타입 불일치
--       projects.user_id = '251103TH' (커스텀 8자리)
--       auth.uid() = 'aa47041d-...' (UUID)
-- 해결: users 테이블 조인으로 auth UUID → 커스텀 user_id 변환
-- =====================================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "projects_select_own" ON projects;
DROP POLICY IF EXISTS "projects_insert_own" ON projects;
DROP POLICY IF EXISTS "projects_update_own" ON projects;
DROP POLICY IF EXISTS "projects_delete_admin" ON projects;

-- SELECT: 본인 프로젝트 또는 Admin
CREATE POLICY "projects_select_own" ON projects
    FOR SELECT TO authenticated
    USING (
        user_id IN (SELECT user_id FROM users WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- INSERT: 본인 프로젝트만
CREATE POLICY "projects_insert_own" ON projects
    FOR INSERT TO authenticated
    WITH CHECK (
        user_id IN (SELECT user_id FROM users WHERE id = auth.uid())
    );

-- UPDATE: 본인 프로젝트 또는 Admin
CREATE POLICY "projects_update_own" ON projects
    FOR UPDATE TO authenticated
    USING (
        user_id IN (SELECT user_id FROM users WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- DELETE: Admin만
CREATE POLICY "projects_delete_admin" ON projects
    FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- 적용 확인
-- =====================================================
SELECT 'projects 테이블 RLS 정책 수정 완료!' as status,
       '커스텀 user_id ↔ auth.uid() 매핑 적용됨' as detail;
