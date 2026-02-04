-- =====================================================
-- FAQ 테이블 RLS (Row Level Security) 정책 설정
-- =====================================================
-- 작성일: 2025-12-02
-- 목적: FAQ 테이블 접근 권한 관리 (학습용 콘텐츠와 동일)
-- 아젠다: #3 FAQ 시스템

-- RLS 활성화
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 정책 1: 누구나 조회 가능 (공개)
-- =====================================================
CREATE POLICY "faqs_select_all"
    ON faqs
    FOR SELECT
    USING (true);

-- =====================================================
-- 정책 2: 인증된 사용자만 추가 가능
-- =====================================================
CREATE POLICY "faqs_insert_authenticated"
    ON faqs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- =====================================================
-- 정책 3: 인증된 사용자만 수정 가능
-- =====================================================
CREATE POLICY "faqs_update_authenticated"
    ON faqs
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- 정책 4: 인증된 사용자만 삭제 가능
-- =====================================================
CREATE POLICY "faqs_delete_authenticated"
    ON faqs
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================================================
-- RLS 정책 요약
-- =====================================================
-- [SELECT]
--   - 모든 사용자(anon, authenticated): 조회 가능
--
-- [INSERT/UPDATE/DELETE]
--   - 일반 사용자(anon): 불가능
--   - 인증 사용자(authenticated): 모든 작업 가능
--
-- 실전 환경:
--   - Admin Dashboard는 authenticated 역할로 접근
--   - Frontend는 anon 역할로 접근 (조회만 가능)
