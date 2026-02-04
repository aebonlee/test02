-- ================================================
-- users 테이블 RLS 무한 재귀 수정
-- ================================================
-- 작성일: 2025-12-01
-- 문제: Admin 정책이 users 테이블을 참조하면서 무한 재귀 발생
-- 해결: RLS 정책 간소화
-- ================================================

-- 기존 정책 전부 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;

-- 새 정책: 모든 사용자가 자신의 프로필 조회 가능
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- 새 정책: 모든 사용자가 자신의 프로필 수정 가능
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- ================================================
-- 완료!
-- ================================================
-- Admin 정책 제거로 무한 재귀 해결
-- 나중에 Admin 기능이 필요하면 다른 방식으로 구현
-- ================================================
