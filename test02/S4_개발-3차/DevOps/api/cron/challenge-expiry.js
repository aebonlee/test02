/**
 * @task S4O1
 * 매월 1일 09:00 UTC 실행 - 챌린지 만료 알림
 * 만료 예정 챌린지 알림 발송
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
        // 이번 달 말일 계산
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const lastDayStr = lastDayOfMonth.toISOString().split('T')[0];

        // 이번 달 말에 만료되는 챌린지 조회
        const { data: expiringChallenges } = await supabase
            .from('user_challenges')
            .select('id, user_id, challenge_name, end_date')
            .eq('status', 'active')
            .lte('end_date', lastDayStr);

        let processed = 0;

        if (expiringChallenges?.length) {
            for (const challenge of expiringChallenges) {
                await sendEmail(challenge.user_id, 'challenge-expiry', {
                    challenge_name: challenge.challenge_name,
                    end_date: challenge.end_date
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
        console.error('Challenge expiry cron error:', error);
        res.status(500).json({ error: 'Cron job failed' });
    }
};
