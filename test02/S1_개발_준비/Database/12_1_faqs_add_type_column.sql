-- =====================================================
-- FAQ 테이블에 type 컬럼 추가 (FAQ/Tip 구분)
-- =====================================================
-- 작성일: 2025-12-12
-- 목적: FAQ와 Tip을 같은 테이블에서 관리
-- 아젠다: #3 FAQ & Tip 시스템

-- type 컬럼 추가 (기본값: 'faq')
ALTER TABLE faqs
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'faq'
CHECK (type IN ('faq', 'tip'));

-- 인덱스 추가 (type별 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_faqs_type ON faqs(type);

-- 컬럼 코멘트
COMMENT ON COLUMN faqs.type IS '콘텐츠 타입: faq(자주 묻는 질문) 또는 tip(유용한 팁)';

-- =====================================================
-- 사용 예시
-- =====================================================
-- FAQ 추가:
-- INSERT INTO faqs (depth1, depth2, depth3, answer, type)
-- VALUES ('로그인/회원가입', '계정 관리', '비밀번호 재설정 방법', '답변 내용...', 'faq');

-- Tip 추가:
-- INSERT INTO faqs (depth1, depth2, depth3, answer, type)
-- VALUES ('AI 활용', '프롬프트', '효과적인 프롬프트 작성법', '팁 내용...', 'tip');

-- FAQ만 조회:
-- SELECT * FROM faqs WHERE type = 'faq';

-- Tip만 조회:
-- SELECT * FROM faqs WHERE type = 'tip';
