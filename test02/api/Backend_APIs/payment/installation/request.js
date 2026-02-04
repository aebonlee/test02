/**
 * @task S4BA1
 * @description 빌더 계정 개설비 무통장 입금 요청 API
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BANK_INFO = {
  bank_name: process.env.BANK_NAME,
  account_number: process.env.BANK_ACCOUNT,
  account_holder: process.env.BANK_HOLDER
};

const INSTALLATION_FEE = 3000000;
const INITIAL_CREDIT = 50000;

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    try {
        // 기존 결제 확인
        const { data: existingPayment } = await supabase
            .from('payments')
            .select('id, status')
            .eq('user_id', user.id)
            .eq('payment_type', 'installation_fee')
            .in('status', ['pending', 'confirmed'])
            .single();

        if (existingPayment) {
            if (existingPayment.status === 'confirmed') {
                return res.status(400).json({ error: '이미 빌더 계정 개설비를 결제하셨습니다.' });
            }
            if (existingPayment.status === 'pending') {
                return res.status(400).json({ error: '대기 중인 입금 요청이 있습니다.' });
            }
        }

        const deposit_code = generateDepositCode();

        const { data: payment, error: insertError } = await supabase
            .from('payments')
            .insert({
                user_id: user.id,
                payment_type: 'installation_fee',
                payment_method: 'bank_transfer',
                amount: INSTALLATION_FEE,
                deposit_code,
                status: 'pending',
                created_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            })
            .select()
            .single();

        if (insertError) {
            return res.status(500).json({ error: 'Failed to create payment request' });
        }

        res.status(201).json({
            success: true,
            payment: {
                id: payment.id,
                amount: INSTALLATION_FEE,
                deposit_code,
                status: 'pending',
                expires_at: payment.expires_at
            },
            bank_info: BANK_INFO,
            benefits: {
                initial_credit: INITIAL_CREDIT,
                free_months: 3,
                monthly_fee_after: 50000
            }
        });
    } catch (error) {
        console.error('Payment request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

function generateDepositCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
