-- ================================================
-- Agenda #10: 매뉴얼 데이터
-- ================================================
-- 작성일: 2025-12-12
-- 작성자: Claude Code
-- ================================================

-- ================================================
-- 매뉴얼 데이터 삽입
-- ================================================

-- PROJECT SAL GRID 매뉴얼
INSERT INTO manuals (
    category,
    subcategory,
    title,
    description,
    url,
    display_order,
    is_active,
    source_path,
    keywords,
    version
) VALUES (
    '시작하기',
    'PROJECT SAL GRID',
    'PROJECT SAL GRID 매뉴얼',
    'AI 협업 개발 가이드 - 프로젝트 진행 방법, 단계별 프로세스, 최적의 협업 방법',
    'https://raw.githubusercontent.com/SUNWOONGKYU/SSALWorks/main/Project-SSAL-Grid/manual/PROJECT_SSAL_GRID_MANUAL.html',
    1,
    true,
    'Project-SSAL-Grid/manual/PROJECT_SSAL_GRID_MANUAL.md',
    ARRAY['PROJECT SAL GRID', '매뉴얼', '가이드', 'AI 협업', '프로젝트 관리', '개발 가이드'],
    'v3.2'
);

-- ================================================
-- 기존 데이터 URL 업데이트 (이미 데이터가 있는 경우 사용)
-- ================================================
-- UPDATE manuals
-- SET url = 'https://raw.githubusercontent.com/SUNWOONGKYU/SSALWorks/main/Project-SSAL-Grid/manual/PROJECT_SSAL_GRID_MANUAL.html',
--     source_path = 'Project-SSAL-Grid/manual/PROJECT_SSAL_GRID_MANUAL.md',
--     version = 'v3.2',
--     updated_at = NOW()
-- WHERE title = 'PROJECT SAL GRID 매뉴얼';

-- ================================================
-- 완료 메시지
-- ================================================
-- 매뉴얼 데이터 1건 삽입 완료
-- - PROJECT SAL GRID 매뉴얼 (활성)
-- URL: GitHub raw URL (push 후 GitHub Actions가 HTML 생성)
-- ================================================
