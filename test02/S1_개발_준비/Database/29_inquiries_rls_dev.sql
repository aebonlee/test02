-- =====================================================
-- Agenda #9: 고객 문의 관리 - 개발용 RLS 정책
-- 생성일: 2025-12-12
-- 작성자: Claude Code
-- ⚠️ 경고: 이 정책은 개발/테스트용입니다!
-- ⚠️ 프로덕션 배포 전 반드시 원래 RLS 정책으로 교체하세요!
-- =====================================================

-- =====================================================
-- 1. RLS 활성화
-- =====================================================
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. 기존 정책 삭제 (있다면)
-- =====================================================
DROP POLICY IF EXISTS "inquiries_select_dev" ON inquiries;
DROP POLICY IF EXISTS "inquiries_insert_dev" ON inquiries;
DROP POLICY IF EXISTS "inquiries_update_dev" ON inquiries;
DROP POLICY IF EXISTS "inquiries_delete_dev" ON inquiries;

-- =====================================================
-- 3. 개발용 정책 생성 (anon 역할 허용)
-- ⚠️ 경고: 프로덕션에서는 사용하지 마세요!
-- =====================================================

-- SELECT: 모든 사용자 조회 가능
CREATE POLICY "inquiries_select_dev" ON inquiries
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- INSERT: 모든 사용자 삽입 가능 (문의 접수)
CREATE POLICY "inquiries_insert_dev" ON inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- UPDATE: 모든 사용자 수정 가능 (개발용 - Admin 답변)
CREATE POLICY "inquiries_update_dev" ON inquiries
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- DELETE: 모든 사용자 삭제 가능 (개발용)
CREATE POLICY "inquiries_delete_dev" ON inquiries
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- =====================================================
-- 완료 메시지
-- =====================================================
-- ⚠️ 개발용 RLS 정책 적용 완료
-- ⚠️ 프로덕션 배포 전 반드시 원래 RLS 정책으로 교체!
-- 다음 단계: 30_sample_inquiries_data.sql 실행
