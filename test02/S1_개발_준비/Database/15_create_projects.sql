-- =====================================================
-- Agenda #5: projects 테이블 생성
-- =====================================================
-- 작성일: 2025-12-11
-- 목적: 사용자 프로젝트 관리
-- 실행 순서: 15번째
-- =====================================================

-- =====================================================
-- 1. projects 테이블 생성
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 사용자 연결 (user_id는 users 테이블의 user_id 컬럼 참조)
    user_id VARCHAR(8) NOT NULL,

    -- 프로젝트 정보
    project_id VARCHAR(20) UNIQUE NOT NULL,     -- A3B5C7D9-P001 형식
    project_name VARCHAR(100) NOT NULL,
    description TEXT,

    -- 상태
    status VARCHAR(20) DEFAULT 'in_progress',   -- in_progress / completed / archived
    progress INTEGER DEFAULT 0,                  -- 0-100
    current_stage INTEGER DEFAULT 0,             -- 0-5
    total_stages INTEGER DEFAULT 5,

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- =====================================================
-- 2. 인덱스 생성
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_project_id ON projects(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- =====================================================
-- 3. 한 사용자당 진행 중인 프로젝트 1개만 허용
-- =====================================================
-- 이미 존재하면 삭제 후 재생성
DROP INDEX IF EXISTS idx_one_in_progress_per_user;
CREATE UNIQUE INDEX idx_one_in_progress_per_user
ON projects(user_id)
WHERE status = 'in_progress';

-- =====================================================
-- 4. updated_at 자동 업데이트 트리거
-- =====================================================
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON projects;
CREATE TRIGGER trigger_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_projects_updated_at();

-- =====================================================
-- 5. project_id 자동 생성 함수
-- =====================================================
CREATE OR REPLACE FUNCTION generate_project_id(p_user_id VARCHAR)
RETURNS TEXT AS $$
DECLARE
    project_count INTEGER;
BEGIN
    SELECT COUNT(*) + 1 INTO project_count
    FROM projects
    WHERE user_id = p_user_id;

    RETURN p_user_id || '-P' || LPAD(project_count::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. RLS 활성화
-- =====================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 완료 확인
-- =====================================================
SELECT 'projects 테이블 생성 완료!' as status;
