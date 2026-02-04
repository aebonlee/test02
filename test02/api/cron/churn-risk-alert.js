/**
 * @task S4O1
 * 매일 09:00 UTC 실행 - 이탈 위험 사용자 알림
 * 7일 이상 미로그인 구독 사용자에게 재참여 이메일 발송
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

        // 7일 이상 미로그인 + 활성 구독 사용자 조회
        const { data: churnRiskUsers } = await supabase
            .from('users')
            .select(`
                id,
                email,
                credit_balance,
                subscriptions!inner(status)
            `)
            .eq('subscriptions.status', 'active')
            .lt('last_login_at', cutoffDate);

        let processed = { feature_intro: 0, recharge: 0 };

        if (churnRiskUsers?.length) {
            for (const user of churnRiskUsers) {
                // 잔액에 따라 다른 이메일 발송
                if (user.credit_balance >= 1000) {
                    // 잔액 충분 → 새로운 기능 안내
                    await sendEmail(user.id, 'feature-intro');
                    processed.feature_intro++;
                } else {
                    // 잔액 부족 → 충전 안내
                    await sendEmail(user.id, 'recharge');
                    processed.recharge++;
                }
            }
        }

        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            processed
        });

    } catch (error) {
        console.error('Churn risk alert cron error:', error);
        res.status(500).json({ error: 'Cron job failed' });
    }
};
