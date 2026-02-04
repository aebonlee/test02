-- ================================================
-- 아젠다 #1: 공지사항 테이블 생성
-- ================================================
-- 작성일: 2025-12-01
-- 실행 순서: 1번째
-- ================================================

-- ================================================
-- 1. notices (공지사항)
-- ================================================
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 공지사항 내용
    title TEXT NOT NULL,
    content TEXT NOT NULL,

    -- 중요도
    important BOOLEAN DEFAULT false,

    -- 작성자 (관리자)
    created_by UUID REFERENCES users(id),

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_notices_important ON notices(important);
CREATE INDEX IF NOT EXISTS idx_notices_created ON notices(created_at DESC);

-- RLS 활성화
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- RLS 정책 삭제 (이미 있으면)
DROP POLICY IF EXISTS "Anyone can view notices" ON notices;
DROP POLICY IF EXISTS "Only admin can manage notices" ON notices;
DROP POLICY IF EXISTS "Only admin can update notices" ON notices;
DROP POLICY IF EXISTS "Only admin can delete notices" ON notices;

-- RLS 정책 생성
-- 모든 사용자가 공지사항 조회 가능
CREATE POLICY "Anyone can view notices" ON notices
    FOR SELECT USING (true);

-- Admin만 생성 가능
CREATE POLICY "Only admin can insert notices" ON notices
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Admin만 수정 가능
CREATE POLICY "Only admin can update notices" ON notices
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Admin만 삭제 가능
CREATE POLICY "Only admin can delete notices" ON notices
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );


-- ================================================
-- 2. notice_reads (공지사항 읽음 기록)
-- ================================================
CREATE TABLE IF NOT EXISTS notice_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    notice_id UUID REFERENCES notices(id) ON DELETE CASCADE NOT NULL,
    read_at TIMESTAMPTZ DEFAULT NOW(),

    -- 한 사용자가 같은 공지를 중복으로 기록 못하게
    CONSTRAINT unique_user_notice UNIQUE(user_id, notice_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_notice_reads_user ON notice_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_notice_reads_notice ON notice_reads(notice_id);
CREATE INDEX IF NOT EXISTS idx_notice_reads_user_notice ON notice_reads(user_id, notice_id);

-- RLS 활성화
ALTER TABLE notice_reads ENABLE ROW LEVEL SECURITY;

-- RLS 정책 삭제 (이미 있으면)
DROP POLICY IF EXISTS "Users can view own read records" ON notice_reads;
DROP POLICY IF EXISTS "Users can create own read records" ON notice_reads;

-- RLS 정책 생성
-- 사용자는 자신의 읽음 기록만 조회 가능
CREATE POLICY "Users can view own read records" ON notice_reads
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 읽음 기록만 생성 가능
CREATE POLICY "Users can create own read records" ON notice_reads
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ================================================
-- Mock 데이터 삽입
-- ================================================
-- 기존 데이터 삭제 (개발 중에만 사용)
-- DELETE FROM notice_reads;
-- DELETE FROM notices;

-- 공지사항 3개 삽입
INSERT INTO notices (title, content, important, created_at) VALUES
('시스템 점검 안내',
 '2025년 12월 1일 오전 2시~4시 시스템 점검이 진행됩니다. 서비스 이용에 참고 부탁드립니다.',
 true,
 NOW() - INTERVAL '2 days'),

('11월 업데이트 소식',
 '새로운 기능이 추가되었습니다:

• AI 모델 선택 기능 추가
• 크레딧 충전 UI 개선
• 학습용 콘텐츠 섹션 추가

앞으로도 더 나은 서비스로 찾아뵙겠습니다!',
 false,
 NOW() - INTERVAL '5 days'),

('크레딧 정책 변경 안내',
 '크레딧 정책이 다음과 같이 변경됩니다:

1. 기본 제공 크레딧: ₩10,000 → ₩15,000
2. 최소 충전 금액: ₩5,000 → ₩3,000
3. 유효 기간: 무제한

감사합니다.',
 false,
 NOW() - INTERVAL '10 days')
ON CONFLICT DO NOTHING;


-- ================================================
-- 완료!
-- ================================================
-- 다음 단계:
-- 1. Supabase Dashboard에서 이 SQL 실행
-- 2. notices 테이블 확인 (3개 레코드)
-- 3. notice_reads 테이블 확인 (비어있음)
-- 4. Admin Dashboard CRUD 구현 시작
-- ================================================
