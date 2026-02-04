-- =====================================================
-- user_notifications 테이블: 인앱 알림 시스템
-- 생성일: 2024-12-22
-- =====================================================

-- 테이블 생성
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,

    -- 추가 메타데이터 (예: 관련 링크, 금액 등)
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(is_read);

-- RLS 정책
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 알림만 조회 가능
CREATE POLICY "Users can view own notifications"
    ON user_notifications FOR SELECT
    USING (auth.uid() = user_id);

-- 사용자는 자신의 알림 읽음 처리 가능
CREATE POLICY "Users can update own notifications"
    ON user_notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- 서비스 역할은 모든 알림 생성 가능 (관리자/시스템용)
CREATE POLICY "Service role can insert notifications"
    ON user_notifications FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- notification_type 값 설명:
-- =====================================================
-- credit_low         : 크레딧 잔액 부족 (1,000원 미만)
-- credit_charged     : 크레딧 충전 완료
-- deposit_confirmed  : 입금 확인 완료
-- free_period_ending : 무료 기간 종료 예정 (D-7, D-3, D-1)
-- payment_failed     : 자동 결제 실패
-- system             : 시스템 공지/안내
-- =====================================================

-- 코멘트
COMMENT ON TABLE user_notifications IS '사용자 인앱 알림';
COMMENT ON COLUMN user_notifications.notification_type IS '알림 유형: credit_low, credit_charged, deposit_confirmed, free_period_ending, payment_failed, system';
COMMENT ON COLUMN user_notifications.metadata IS '추가 데이터 (금액, 링크 등)';
