/**
 * @task S4BA6
 * 이메일 발송 API (내부용)
 * POST /api/email/send
 */

const { sendEmail } = require('../../lib/email-service');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 내부 호출만 허용 (CRON_SECRET 또는 SERVICE_ROLE_KEY)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
        authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { template_id, to, data } = req.body;

    if (!template_id || !to || !data) {
        return res.status(400).json({
            error: 'template_id, to, and data are required'
        });
    }

    try {
        const result = await sendEmail(template_id, to, data);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};
