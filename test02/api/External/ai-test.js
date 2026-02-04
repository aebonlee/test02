/**
 * @task S3BA1 Debug
 * @description AI 테스트 API - 인증 없이 직접 호출
 */

const { sendMessage, VALID_PROVIDERS } = require('../Backend_Infra/ai');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, provider } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!provider || !VALID_PROVIDERS.includes(provider)) {
    return res.status(400).json({
      error: 'Invalid provider',
      validProviders: VALID_PROVIDERS
    });
  }

  try {
    const result = await sendMessage(provider, question, { maxTokens: 1024 });

    if (!result.success) {
      return res.status(500).json({ error: 'AI service error', details: result.error });
    }

    return res.status(200).json({
      success: true,
      answer: result.content,
      provider: result.provider,
      model: result.model
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
