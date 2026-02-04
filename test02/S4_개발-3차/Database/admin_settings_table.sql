-- admin_settings 테이블 생성
CREATE TABLE IF NOT EXISTS admin_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    platform_name TEXT DEFAULT 'SSAL Works',
    admin_email TEXT,
    timezone TEXT DEFAULT 'Asia/Seoul',
    notify_inquiry BOOLEAN DEFAULT true,
    notify_payment BOOLEAN DEFAULT true,
    notify_signup BOOLEAN DEFAULT false,
    install_fee INTEGER DEFAULT 3000000,
    monthly_fee INTEGER DEFAULT 50000,
    credit_price INTEGER DEFAULT 10,
    last_backup TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- RLS 정책 (anon 접근 허용 - 개발용)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read admin_settings" ON admin_settings
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert admin_settings" ON admin_settings
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon update admin_settings" ON admin_settings
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 초기 데이터 삽입
INSERT INTO admin_settings (id, platform_name, admin_email, timezone)
VALUES (1, 'SSAL Works', 'admin@ssal.works', 'Asia/Seoul')
ON CONFLICT (id) DO NOTHING;
