-- =====================================================
-- users 테이블에 builder_id 컬럼 추가
-- =====================================================
-- Task: S4D2
-- 작성일: 2025-12-23
-- 목적: 개설비 납부 완료 시 빌더 계정 ID 부여
-- =====================================================

-- =====================================================
-- 1. builder_id 컬럼 추가
-- =====================================================
-- 형식: YYMMNNNNNNXX (12자리)
-- YY: 연도 (2자리)
-- MM: 월 (2자리)
-- NNNNNN: 일련번호 (6자리, 월별 초기화)
-- XX: 금액 코드 (TH=300만, FO=400만, FI=500만, SI=600만, SE=700만, EI=800만, NI=900만)

ALTER TABLE users ADD COLUMN IF NOT EXISTS builder_id VARCHAR(12) UNIQUE;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_builder_id ON users(builder_id);

-- =====================================================
-- 2. 빌더 ID 일련번호 관리 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS builder_id_sequence (
    year_month VARCHAR(4) PRIMARY KEY,  -- 'YYMM' 형식
    last_sequence INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 설정 (관리자만 접근)
ALTER TABLE builder_id_sequence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage builder_id_sequence" ON builder_id_sequence;
CREATE POLICY "Admin can manage builder_id_sequence" ON builder_id_sequence
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Service Role은 항상 접근 가능
DROP POLICY IF EXISTS "Service role full access to builder_id_sequence" ON builder_id_sequence;
CREATE POLICY "Service role full access to builder_id_sequence" ON builder_id_sequence
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 3. 빌더 ID 생성 함수
-- =====================================================
CREATE OR REPLACE FUNCTION generate_builder_id(amount INTEGER)
RETURNS TEXT AS $$
DECLARE
    year_month TEXT;
    next_seq INTEGER;
    amount_code TEXT;
    builder_id TEXT;
BEGIN
    -- 현재 연월 (YYMM)
    year_month := TO_CHAR(NOW(), 'YYMM');

    -- 일련번호 증가
    INSERT INTO builder_id_sequence (year_month, last_sequence, updated_at)
    VALUES (year_month, 1, NOW())
    ON CONFLICT (year_month)
    DO UPDATE SET
        last_sequence = builder_id_sequence.last_sequence + 1,
        updated_at = NOW()
    RETURNING last_sequence INTO next_seq;

    -- 금액 코드 결정
    CASE
        WHEN amount = 3000000 THEN amount_code := 'TH';
        WHEN amount = 4000000 THEN amount_code := 'FO';
        WHEN amount = 5000000 THEN amount_code := 'FI';
        WHEN amount = 6000000 THEN amount_code := 'SI';
        WHEN amount = 7000000 THEN amount_code := 'SE';
        WHEN amount = 8000000 THEN amount_code := 'EI';
        WHEN amount = 9000000 THEN amount_code := 'NI';
        ELSE amount_code := 'XX';  -- 기타 금액
    END CASE;

    -- 빌더 ID 조합: YYMM + 6자리 일련번호 + 금액코드
    builder_id := year_month || LPAD(next_seq::TEXT, 6, '0') || amount_code;

    RETURN builder_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 완료 확인
-- =====================================================
SELECT
    'builder_id 컬럼 추가 완료!' as status,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'builder_id';
