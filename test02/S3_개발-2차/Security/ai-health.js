/**
 * @task S3S1
 * @description AI 서비스 구독 상태 헬스체크
 * PO의 AI 서비스(Gemini, ChatGPT, Perplexity)가 사용 가능한지 확인
 */

const { sendMessage, VALID_PROVIDERS } = require('../Backend_Infrastructure/ai');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results = {};
  const testMessage = 'Health check. Reply with OK only.';

  // 모든 AI 프로바이더 병렬 테스트
  const checks = VALID_PROVIDERS.map(async (provider) => {
    try {
      const startTime = Date.now();
      const result = await sendMessage(provider, testMessage, { maxTokens: 10 });
      const latency = Date.now() - startTime;

      results[provider] = {
        status: result.success ? 'active' : 'error',
        usable: result.success,
        latency: `${latency}ms`,
        model: result.model,
        error: result.error || null
      };
    } catch (error) {
      results[provider] = {
        status: 'error',
        usable: false,
        error: error.message
      };
    }
  });

  await Promise.all(checks);

  // 전체 상태 요약
  const allActive = Object.values(results).every(r => r.usable);
  const activeCount = Object.values(results).filter(r => r.usable).length;

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    overall: allActive ? 'healthy' : 'degraded',
    summary: `${activeCount}/${VALID_PROVIDERS.length} services active`,
    services: results
  });
};
