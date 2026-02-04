/**
 * @task S3BI1
 * @description ChatGPT (OpenAI) 클라이언트
 */

const OpenAI = require('openai');

let openai = null;

function getOpenAI() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

/**
 * ChatGPT에 메시지 전송
 * @param {string} message - 사용자 메시지
 * @param {Object} options - 옵션
 * @param {string} options.model - 모델명 (기본: gpt-3.5-turbo)
 * @param {string} options.systemPrompt - 시스템 프롬프트
 * @param {number} options.maxTokens - 최대 토큰 수 (기본: 1024)
 * @returns {Promise<Object>} 응답 객체
 */
async function sendChatGPTMessage(message, options = {}) {
  try {
    const client = getOpenAI();

    const messages = [];

    // 시스템 프롬프트가 있으면 추가
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }

    messages.push({ role: 'user', content: message });

    const response = await client.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: options.maxTokens || 1024
    });

    return {
      success: true,
      content: response.choices[0].message.content,
      provider: 'chatgpt',
      model: options.model || 'gpt-3.5-turbo',
      usage: {
        prompt_tokens: response.usage?.prompt_tokens,
        completion_tokens: response.usage?.completion_tokens,
        total_tokens: response.usage?.total_tokens
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      provider: 'chatgpt'
    };
  }
}

module.exports = { sendChatGPTMessage, getOpenAI };
