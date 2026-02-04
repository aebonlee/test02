-- users 테이블 RLS 정책 수정
-- 문제: 사용자가 자신의 정보를 조회할 수 없음
-- 날짜: 2025-12-31

-- 1. RLS가 활성화되어 있는지 확인
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'users';

-- 2. 기존 정책 확인
-- SELECT * FROM pg_policies WHERE tablename = 'users';

-- 3. 사용자가 자신의 데이터를 읽을 수 있는 정책 추가
DROP POLICY IF EXISTS "Users can read own data" ON public.users;

CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- 4. 확인
SELECT 'RLS 정책 추가 완료' as result;
