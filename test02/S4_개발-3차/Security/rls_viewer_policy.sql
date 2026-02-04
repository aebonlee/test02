-- =============================================================================
-- S4S2: Viewer 접근 보안 RLS 정책
--
-- 목적: SAL Grid Viewer에 대한 접근 보안 구현
-- 작성일: 2025-12-25
-- 적용일: 2025-12-25
-- =============================================================================

-- =============================================================================
-- 1. projects 테이블 RLS 정책
-- =============================================================================

-- RLS 활성화
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있으면)
DROP POLICY IF EXISTS "projects_select_own" ON projects;
DROP POLICY IF EXISTS "projects_select_admin" ON projects;
DROP POLICY IF EXISTS "projects_insert_own" ON projects;
DROP POLICY IF EXISTS "projects_update_own" ON projects;
DROP POLICY IF EXISTS "projects_delete_own" ON projects;

-- SELECT: 자신의 프로젝트 또는 관리자는 전체 조회 가능
CREATE POLICY "projects_select_own" ON projects
    FOR SELECT
    USING (
        auth.uid()::text = user_id::text
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id::text = auth.uid()::text
            AND users.role = 'admin'
        )
    );

-- INSERT: 자신의 프로젝트만 생성 가능
CREATE POLICY "projects_insert_own" ON projects
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

-- UPDATE: 자신의 프로젝트만 수정 가능
CREATE POLICY "projects_update_own" ON projects
    FOR UPDATE
    USING (auth.uid()::text = user_id::text)
    WITH CHECK (auth.uid()::text = user_id::text);

-- DELETE: 자신의 프로젝트만 삭제 가능
CREATE POLICY "projects_delete_own" ON projects
    FOR DELETE
    USING (auth.uid()::text = user_id::text);

-- =============================================================================
-- 2. project_sal_grid 테이블
-- =============================================================================
-- 현재 project_id 컬럼이 없어 RLS 미적용
-- 모든 데이터는 SSALWORKS 예시 프로젝트로 공개 상태
--
-- 추후 멀티테넌트 지원 시:
-- 1. project_id 컬럼 추가
-- 2. 아래 RLS 정책 적용
--
-- ALTER TABLE project_sal_grid ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "sal_grid_select_public" ON project_sal_grid FOR SELECT
--     USING (project_id IS NULL OR project_id = 'SSALWORKS');
-- CREATE POLICY "sal_grid_select_own" ON project_sal_grid FOR SELECT
--     USING (EXISTS (SELECT 1 FROM projects WHERE projects.id::text = project_id AND projects.user_id::text = auth.uid()::text));

-- =============================================================================
-- 3. 접근 제어 정책 요약
-- =============================================================================
--
-- | 사용자 유형     | projects 테이블        | project_sal_grid 테이블 |
-- |----------------|------------------------|------------------------|
-- | 비로그인        | 접근 불가              | 전체 공개 (예시)        |
-- | 로그인 (일반)   | 자신의 프로젝트만       | 전체 공개 (예시)        |
-- | 로그인 (관리자) | 모든 프로젝트           | 전체 공개 (예시)        |
--
-- =============================================================================
