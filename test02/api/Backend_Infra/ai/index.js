/**
 * @task S3BI1
 * @description AI API 클라이언트 통합 - Gemini, ChatGPT, Perplexity
 */

const { sendGeminiMessage } = require('./gemini-client');
const { sendChatGPTMessage } = require('./chatgpt-client');
const { sendPerplexityMessage } = require('./perplexity-client');
const { UsageLimiter, DAILY_LIMITS } = require('./usage-limiter');
const { AIError, RateLimitError, SubscriptionRequiredError, APIKeyError } = require('./errors');

/**
 * 통합 메시지 전송 함수
 * @param {string} provider - AI 제공자 (gemini, chatgpt, perplexity)
 * @param {string} message - 사용자 메시지
 * @param {Object} options - 옵션
 * @returns {Promise<Object>} 응답 객체
 */
async function sendMessage(provider, message, options = {}) {
  switch (provider) {
    case 'gemini':
      return sendGeminiMessage(message, options);
    case 'chatgpt':
      return sendChatGPTMessage(message, options);
    case 'perplexity':
      return sendPerplexityMessage(message, options);
    default:
      return {
        success: false,
        error: `Unknown provider: ${provider}. Valid providers: gemini, chatgpt, perplexity`
      };
  }
}

// 유효한 프로바이더 목록
const VALID_PROVIDERS = ['gemini', 'chatgpt', 'perplexity'];

module.exports = {
  // 통합 인터페이스
  sendMessage,
  VALID_PROVIDERS,

  // 개별 클라이언트
  sendGeminiMessage,
  sendChatGPTMessage,
  sendPerplexityMessage,

  // 사용량 제한
  UsageLimiter,
  DAILY_LIMITS,

  // 에러
  AIError,
  RateLimitError,
  SubscriptionRequiredError,
  APIKeyError
};
