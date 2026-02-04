-- deposit_notifications 테이블 생성
-- 무통장 입금 완료 알림 저장

CREATE TABLE IF NOT EXISTS deposit_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    deposit_type TEXT NOT NULL CHECK (deposit_type IN ('install_fee', 'credit')),
    amount INTEGER NOT NULL,
    depositor_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    admin_note TEXT,
    confirmed_at TIMESTAMPTZ,
    confirmed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_deposit_notifications_user_id ON deposit_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_notifications_status ON deposit_notifications(status);
CREATE INDEX IF NOT EXISTS idx_deposit_notifications_created_at ON deposit_notifications(created_at DESC);

-- RLS 활성화
ALTER TABLE deposit_notifications ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (개발용 - 모든 접근 허용)
DROP POLICY IF EXISTS "deposit_notifications_select_dev" ON deposit_notifications;
DROP POLICY IF EXISTS "deposit_notifications_insert_dev" ON deposit_notifications;
DROP POLICY IF EXISTS "deposit_notifications_update_dev" ON deposit_notifications;

CREATE POLICY "deposit_notifications_select_dev" ON deposit_notifications
    FOR SELECT USING (true);

CREATE POLICY "deposit_notifications_insert_dev" ON deposit_notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "deposit_notifications_update_dev" ON deposit_notifications
    FOR UPDATE USING (true);

-- 코멘트
COMMENT ON TABLE deposit_notifications IS '무통장 입금 완료 알림';
COMMENT ON COLUMN deposit_notifications.deposit_type IS 'install_fee: 빌더 계정 개설비, credit: 크레딧 충전';
COMMENT ON COLUMN deposit_notifications.status IS 'pending: 대기, confirmed: 확인완료, rejected: 거절';
