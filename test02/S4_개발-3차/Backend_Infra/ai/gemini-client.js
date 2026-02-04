/**
 * @task S3BI1
 * @description Gemini AI 클라이언트
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getDefaultModel } = require('./model-config');

let genAI = null;

function getGenAI() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Gemini에 메시지 전송
 * @param {string} message - 사용자 메시지
 * @param {Object} options - 옵션
 * @param {string} options.model - 모델명 (미지정시 DB에서 기본 모델 조회)
 * @param {string} options.systemPrompt - 시스템 프롬프트
 * @param {number} options.maxTokens - 최대 토큰 수
 * @returns {Promise<Object>} 응답 객체
 */
async function sendGeminiMessage(message, options = {}) {
  try {
    const ai = getGenAI();

    // 모델 결정: options.model > DB 기본 모델
    const modelName = options.model || await getDefaultModel('google');

    const model = ai.getGenerativeModel({ model: modelName });

    // 시스템 프롬프트가 있으면 메시지에 포함
    const fullMessage = options.systemPrompt
      ? `${options.systemPrompt}\n\n사용자: ${message}`
      : message;

    const result = await model.generateContent(fullMessage);
    const response = await result.response;

    // Gemini usageMetadata에서 토큰 정보 추출
    const usageMetadata = response.usageMetadata || {};

    return {
      success: true,
      content: response.text(),
      provider: 'google',
      model: modelName,
      usage: {
        prompt_tokens: usageMetadata.promptTokenCount,
        completion_tokens: usageMetadata.candidatesTokenCount,
        total_tokens: usageMetadata.totalTokenCount
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      provider: 'google'
    };
  }
}

module.exports = { sendGeminiMessage, getGenAI };
