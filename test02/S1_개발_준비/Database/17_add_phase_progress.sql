-- ================================================
-- users 테이블에 phase_progress 컬럼 추가
-- ================================================
-- 작성일: 2025-12-31
-- 목적: 사용자별 진행률을 DB에 저장하여 웹사이트에서 표시
-- ================================================

-- phase_progress 컬럼 추가 (JSONB 타입)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phase_progress JSONB DEFAULT '{
    "P0": {"name": "작업 디렉토리 구조 생성", "progress": 0, "completed": 0, "total": 2},
    "P1": {"name": "사업계획", "progress": 0, "completed": 0, "total": 5},
    "P2": {"name": "프로젝트 기획", "progress": 0, "completed": 0, "total": 8},
    "P3": {"name": "프로토타입 제작", "progress": 0, "completed": 0, "total": 3},
    "S0": {"name": "Project SAL Grid 생성", "progress": 0, "completed": 0, "total": 4},
    "S1": {"name": "개발 준비", "progress": 0, "completed": 0, "total": 9},
    "S2": {"name": "개발 1차", "progress": 0, "completed": 0, "total": 16},
    "S3": {"name": "개발 2차", "progress": 0, "completed": 0, "total": 6},
    "S4": {"name": "개발 3차", "progress": 0, "completed": 0, "total": 21},
    "S5": {"name": "개발 마무리", "progress": 0, "completed": 0, "total": 9}
}'::JSONB;

-- 인덱스 추가 (선택사항 - 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_users_phase_progress ON users USING GIN (phase_progress);

-- RLS 정책 (기존 정책이 phase_progress 포함하도록 자동 적용됨)
-- 추가 정책 필요 없음 - 기존 SELECT/UPDATE 정책이 모든 컬럼에 적용

-- ================================================
-- 확인
-- ================================================
-- SELECT id, email, phase_progress FROM users LIMIT 5;

-- ================================================
-- 완료!
-- ================================================
-- 다음 단계:
-- 1. Supabase Dashboard에서 이 SQL 실행
-- 2. users 테이블에 phase_progress 컬럼 확인
-- 3. scripts/upload-progress.js 생성
-- ================================================
