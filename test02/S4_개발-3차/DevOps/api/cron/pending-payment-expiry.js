/**
 * @task S4O1
 * 매일 00:00 UTC 실행 - 입금 대기 만료 처리
 * 7일 이상 미입금 요청 자동 취소
 */

const { createClient } = require('@supabase/supabase-js');
const { sendEmail } = require('../utils/email');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const cutoffDate = sevenDaysAgo.toISOString();

        // 7일 이상 된 pending 상태 결제 요청 조회
        const { data: expiredPayments } = await supabase
            .from('payments')
            .select('id, user_id, amount, payment_type')
            .eq('status', 'pending')
            .lt('created_at', cutoffDate);

        let processed = 0;

        if (expiredPayments?.length) {
            for (const payment of expiredPayments) {
                // 상태를 expired로 변경
                await supabase
                    .from('payments')
                    .update({
                        status: 'expired',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', payment.id);

                // 만료 알림 이메일 발송
                await sendEmail(payment.user_id, 'payment-expired', {
                    amount: payment.amount,
                    payment_type: payment.payment_type
                });

                processed++;
            }
        }

        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            processed
        });

    } catch (error) {
        console.error('Pending payment expiry cron error:', error);
        res.status(500).json({ error: 'Cron job failed' });
    }
};
