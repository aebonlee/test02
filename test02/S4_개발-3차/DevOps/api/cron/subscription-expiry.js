/**
 * @task S4O1
 * 매일 00:00 UTC 실행 - 구독 만료 처리
 * 만료된 구독 상태 변경, 3일 전 알림 발송
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

    const today = new Date().toISOString().split('T')[0];
    let processed = { expired: 0, warned_3day: 0 };

    try {
        // 1. 만료된 구독 처리
        const { data: expiredSubs } = await supabase
            .from('subscriptions')
            .select('id, user_id')
            .eq('status', 'active')
            .lt('end_date', today);

        if (expiredSubs?.length) {
            for (const sub of expiredSubs) {
                await supabase
                    .from('subscriptions')
                    .update({ status: 'expired' })
                    .eq('id', sub.id);

                // 만료 알림 이메일 발송 (S4BA6 이메일 템플릿 사용)
                await sendEmail(sub.user_id, 'subscription-expired');
                processed.expired++;
            }
        }

        // 2. 만료 3일 전 알림
        const warn3Date = new Date();
        warn3Date.setDate(warn3Date.getDate() + 3);
        const warn3DateStr = warn3Date.toISOString().split('T')[0];

        const { data: warningSubs } = await supabase
            .from('subscriptions')
            .select('id, user_id')
            .eq('status', 'active')
            .eq('end_date', warn3DateStr);

        if (warningSubs?.length) {
            for (const sub of warningSubs) {
                await sendEmail(sub.user_id, 'subscription-expiry-warning', { days: 3 });
                processed.warned_3day++;
            }
        }

        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            processed
        });

    } catch (error) {
        console.error('Subscription expiry cron error:', error);
        res.status(500).json({ error: 'Cron job failed' });
    }
};
