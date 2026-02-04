-- @task S4D1
-- S4D1: 크레딧 이력 테이블

-- 기존 테이블 삭제 후 재생성
DROP TABLE IF EXISTS credit_history CASCADE;

CREATE TABLE credit_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- purchase, usage, refund, bonus
    amount INTEGER NOT NULL, -- 양수: 충전, 음수: 차감
    base_credits INTEGER, -- 구매 시 기본 크레딧
    bonus_credits INTEGER, -- 보너스 크레딧
    balance_after INTEGER NOT NULL, -- 변경 후 잔액
    payment_amount INTEGER, -- 결제 금액 (원)
    payment_key TEXT,
    order_id TEXT,
    package_id VARCHAR(50),
    ai_model VARCHAR(50), -- 사용 시 AI 모델명
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_credit_history_user_id ON credit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_history_type ON credit_history(type);
CREATE INDEX IF NOT EXISTS idx_credit_history_created_at ON credit_history(created_at);

-- RLS
ALTER TABLE credit_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own credit history" ON credit_history;
CREATE POLICY "Users can view own credit history"
    ON credit_history FOR SELECT
    USING (auth.uid() = user_id);
