-- @task S4D1
-- S4D1: 설치비 결제 테이블

-- 기존 테이블 삭제 후 재생성
DROP TABLE IF EXISTS installation_payments CASCADE;

CREATE TABLE installation_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- 설치비 금액
    depositor_name VARCHAR(100) NOT NULL, -- 입금자명
    bank_name VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, confirmed, rejected
    admin_memo TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_installation_payments_user_id ON installation_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_installation_payments_project_id ON installation_payments(project_id);
CREATE INDEX IF NOT EXISTS idx_installation_payments_status ON installation_payments(status);

-- RLS
ALTER TABLE installation_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own installation payments" ON installation_payments;
CREATE POLICY "Users can view own installation payments"
    ON installation_payments FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own installation payments" ON installation_payments;
CREATE POLICY "Users can insert own installation payments"
    ON installation_payments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all installation payments" ON installation_payments;
CREATE POLICY "Admins can view all installation payments"
    ON installation_payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can update installation payments" ON installation_payments;
CREATE POLICY "Admins can update installation payments"
    ON installation_payments FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
