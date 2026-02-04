/**
 * @task S4BA1
 * @description 빌더 계정 개설비 결제 상태 조회 API
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
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
        const { data: payment, error: selectError } = await supabase
            .from('payments')
            .select('id, payment_type, payment_method, amount, deposit_code, status, created_at, expires_at, confirmed_at')
            .eq('user_id', user.id)
            .eq('payment_type', 'installation_fee')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (selectError || !payment) {
            return res.status(404).json({
                success: false,
                message: '빌더 계정 개설비 결제 요청 내역이 없습니다.'
            });
        }

        const response = {
            success: true,
            payment: {
                id: payment.id,
                amount: payment.amount,
                deposit_code: payment.deposit_code,
                status: payment.status,
                created_at: payment.created_at,
                expires_at: payment.expires_at,
                confirmed_at: payment.confirmed_at
            }
        };

        // 상태별 추가 정보
        if (payment.status === 'pending') {
            const expiresAt = new Date(payment.expires_at);
            const now = new Date();
            const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

            response.message = '입금 대기 중입니다.';
            response.days_left = daysLeft;

            if (daysLeft <= 0) {
                response.warning = '입금 기한이 만료되었습니다. 새로 요청해주세요.';
            }
        } else if (payment.status === 'confirmed') {
            response.message = '빌더 계정 개설비 결제가 완료되었습니다.';
            response.benefits = {
                initial_credit: 50000,
                free_months: 3,
                monthly_fee_after: 50000
            };
        } else if (payment.status === 'cancelled') {
            response.message = '입금 요청이 취소되었습니다.';
        } else if (payment.status === 'expired') {
            response.message = '입금 기한이 만료되었습니다. 새로 요청해주세요.';
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Payment status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
