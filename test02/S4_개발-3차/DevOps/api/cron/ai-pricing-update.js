/**
 * @task S4O1
 * 매일 00:00 UTC 실행 - AI 모델 가격 업데이트
 * OpenAI, Anthropic, Google AI 가격 변동 확인 및 업데이트
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

    try {
        // AI 가격 정보 업데이트 (수동 설정 또는 API 조회)
        const pricingUpdates = [
            { provider: 'openai', model: 'gpt-4o', input_per_1k: 0.0025, output_per_1k: 0.01 },
            { provider: 'anthropic', model: 'claude-3-5-sonnet', input_per_1k: 0.003, output_per_1k: 0.015 },
            { provider: 'google', model: 'gemini-1.5-flash', input_per_1k: 0.000075, output_per_1k: 0.0003 }
        ];

        for (const pricing of pricingUpdates) {
            await supabase
                .from('ai_pricing')
                .upsert({
                    provider: pricing.provider,
                    model: pricing.model,
                    input_per_1k_tokens: pricing.input_per_1k,
                    output_per_1k_tokens: pricing.output_per_1k,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'provider,model' });
        }

        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            updated: pricingUpdates.length
        });

    } catch (error) {
        console.error('AI pricing update cron error:', error);
        res.status(500).json({ error: 'Cron job failed' });
    }
};
