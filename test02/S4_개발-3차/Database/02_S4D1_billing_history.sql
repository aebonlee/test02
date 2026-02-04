-- @task S4D1
-- S4D1: 결제 이력 테이블

-- 기존 테이블 삭제 후 재생성
DROP TABLE IF EXISTS billing_history CASCADE;

CREATE TABLE billing_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_key TEXT NOT NULL,
    order_id TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'KRW',
    status VARCHAR(20) NOT NULL, -- DONE, CANCELED, FAILED
    method VARCHAR(50), -- CARD, VIRTUAL_ACCOUNT, etc.
    card_company VARCHAR(50),
    card_number VARCHAR(20),
    subscription_id UUID, -- subscriptions 테이블은 별도 생성 필요 (S2D1)
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_order_id ON billing_history(order_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_created_at ON billing_history(created_at);

-- RLS
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own billing history" ON billing_history;
CREATE POLICY "Users can view own billing history"
    ON billing_history FOR SELECT
    USING (auth.uid() = user_id);
