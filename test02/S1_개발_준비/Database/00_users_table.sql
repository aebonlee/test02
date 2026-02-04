-- ================================================
-- 기본 테이블: users (사용자)
-- ================================================
-- 작성일: 2025-12-01
-- 실행 순서: 0번째 (notices 테이블보다 먼저 실행)
-- 목적: notices 테이블이 users를 참조하므로 먼저 생성 필요
-- ================================================

-- UUID 확장 활성화 (이미 있으면 무시됨)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- users 테이블 생성
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,

    -- 온보딩 정보
    onboarding_start_date DATE,
    onboarding_end_date DATE,
    subscription_status VARCHAR(20) DEFAULT 'inactive',  -- 'onboarding', 'active', 'inactive'
    is_onboarding_completed BOOLEAN DEFAULT false,

    -- 권한
    role VARCHAR(20) DEFAULT 'user',  -- 'admin', 'user'

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS 정책 삭제 (이미 있으면)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;

-- RLS 정책 생성
-- 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admin은 모든 사용자 조회 가능
CREATE POLICY "Admin can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );


-- ================================================
-- Mock 데이터 삽입
-- ================================================
-- Admin 사용자 1명 + 일반 사용자 2명

-- 기존 Mock 데이터 삭제 (개발 중에만 사용)
-- DELETE FROM users WHERE email LIKE '%@example.com';

INSERT INTO users (id, email, name, role, subscription_status, is_onboarding_completed, created_at) VALUES
-- Admin 사용자
('00000000-0000-0000-0000-000000000001',
 'admin@ssalworks.com',
 '관리자',
 'admin',
 'active',
 true,
 NOW() - INTERVAL '180 days'),

-- 일반 사용자 1 (온보딩 완료)
('00000000-0000-0000-0000-000000000002',
 'user1@example.com',
 '김철수',
 'user',
 'active',
 true,
 NOW() - INTERVAL '90 days'),

-- 일반 사용자 2 (온보딩 중)
('00000000-0000-0000-0000-000000000003',
 'user2@example.com',
 '이영희',
 'user',
 'onboarding',
 false,
 NOW() - INTERVAL '30 days')

ON CONFLICT (email) DO NOTHING;


-- ================================================
-- 완료!
-- ================================================
-- 다음 단계:
-- 1. Supabase Dashboard에서 이 SQL 실행
-- 2. users 테이블 확인 (3개 레코드)
-- 3. 01_notices_tables.sql 실행
-- ================================================
