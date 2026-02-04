/**
 * @task S4O1
 * 매일 01:00 UTC 실행 - 일일 통계 집계
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    try {
        // 1. 사용자 통계
        const { count: newUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', `${dateStr}T00:00:00`)
            .lt('created_at', `${dateStr}T23:59:59`);

        // 2. 구독 통계
        const { count: newSubscriptions } = await supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', `${dateStr}T00:00:00`)
            .lt('created_at', `${dateStr}T23:59:59`);

        // 3. 결제 통계 (confirmed 상태만)
        const { data: payments } = await supabase
            .from('payments')
            .select('amount')
            .eq('status', 'confirmed')
            .gte('confirmed_at', `${dateStr}T00:00:00`)
            .lt('confirmed_at', `${dateStr}T23:59:59`);

        const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

        // 4. AI 사용량 통계
        const { count: aiUsage } = await supabase
            .from('api_usage_log')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', `${dateStr}T00:00:00`)
            .lt('created_at', `${dateStr}T23:59:59`);

        // 5. 통계 저장
        await supabase.from('daily_stats').upsert({
            date: dateStr,
            new_users: newUsers || 0,
            new_subscriptions: newSubscriptions || 0,
            total_revenue: totalRevenue,
            ai_usage_count: aiUsage || 0
        }, { onConflict: 'date' });

        res.status(200).json({
            success: true,
            date: dateStr,
            stats: { newUsers, newSubscriptions, totalRevenue, aiUsage }
        });

    } catch (error) {
        console.error('Stats aggregate cron error:', error);
        res.status(500).json({ error: 'Cron job failed' });
    }
};
