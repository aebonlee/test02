/**
 * @task S4BA1
 * @description 빌더 계정 개설비 입금 요청 취소 API
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
        // 현재 대기 중인 결제 찾기
        const { data: payment, error: selectError } = await supabase
            .from('payments')
            .select('id, status')
            .eq('user_id', user.id)
            .eq('payment_type', 'installation_fee')
            .eq('status', 'pending')
            .single();

        if (selectError || !payment) {
            return res.status(404).json({
                success: false,
                error: '취소할 수 있는 입금 요청이 없습니다.'
            });
        }

        // 상태를 cancelled로 변경
        const { data: updatedPayment, error: updateError } = await supabase
            .from('payments')
            .update({
                status: 'cancelled',
                updated_at: new Date().toISOString()
            })
            .eq('id', payment.id)
            .select()
            .single();

        if (updateError) {
            return res.status(500).json({ error: 'Failed to cancel payment request' });
        }

        res.status(200).json({
            success: true,
            message: '입금 요청이 취소되었습니다.',
            payment: {
                id: updatedPayment.id,
                status: updatedPayment.status
            }
        });
    } catch (error) {
        console.error('Payment cancel error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
