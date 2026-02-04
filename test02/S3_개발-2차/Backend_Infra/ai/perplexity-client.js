/**
 * @task S3BI1
 * @description Perplexity AI 클라이언트
 */

/**
 * Perplexity에 메시지 전송
 * @param {string} message - 사용자 메시지
 * @param {Object} options - 옵션
 * @param {string} options.model - 모델명 (기본: llama-3.1-sonar-small-128k-online)
 * @param {string} options.systemPrompt - 시스템 프롬프트
 * @param {number} options.maxTokens - 최대 토큰 수 (기본: 1024)
 * @returns {Promise<Object>} 응답 객체
 */
async function sendPerplexityMessage(message, options = {}) {
  try {
    if (!process.env.PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY environment variable is not set');
    }

    const messages = [];

    // 시스템 프롬프트가 있으면 추가
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }

    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'sonar',
        messages: messages,
        max_tokens: options.maxTokens || 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Perplexity API error');
    }

    const data = await response.json();

    return {
      success: true,
      content: data.choices[0].message.content,
      provider: 'perplexity',
      model: options.model || 'sonar',
      usage: {
        prompt_tokens: data.usage?.prompt_tokens,
        completion_tokens: data.usage?.completion_tokens,
        total_tokens: data.usage?.total_tokens
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      provider: 'perplexity'
    };
  }
}

module.exports = { sendPerplexityMessage };
