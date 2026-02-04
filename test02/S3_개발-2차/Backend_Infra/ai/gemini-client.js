/**
 * @task S3BI1
 * @description Gemini AI 클라이언트
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

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
 * @param {string} options.model - 모델명 (기본: gemini-pro)
 * @param {string} options.systemPrompt - 시스템 프롬프트
 * @param {number} options.maxTokens - 최대 토큰 수
 * @returns {Promise<Object>} 응답 객체
 */
async function sendGeminiMessage(message, options = {}) {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({
      model: options.model || 'gemini-2.5-flash'
    });

    // 시스템 프롬프트가 있으면 메시지에 포함
    const fullMessage = options.systemPrompt
      ? `${options.systemPrompt}\n\n사용자: ${message}`
      : message;

    const result = await model.generateContent(fullMessage);
    const response = await result.response;

    return {
      success: true,
      content: response.text(),
      provider: 'gemini',
      model: options.model || 'gemini-2.5-flash',
      usage: {
        // Gemini API는 토큰 수를 직접 제공하지 않음
        estimated: true
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      provider: 'gemini'
    };
  }
}

/**
 * Gemini 스트리밍 메시지 전송
 * @param {string} systemPrompt - 시스템 프롬프트
 * @param {string} userMessage - 사용자 메시지
 * @param {Object} options - 옵션
 * @returns {Promise<AsyncGenerator>} 스트리밍 결과
 */
async function sendGeminiMessageStream(systemPrompt, userMessage, options = {}) {
  const ai = getGenAI();
  const modelName = options.model || 'gemini-2.0-flash-exp';

  const model = ai.getGenerativeModel({
    model: modelName,
    generationConfig: {
      maxOutputTokens: options.maxTokens || 2048,
      temperature: options.temperature || 0.7
    }
  });

  const fullPrompt = systemPrompt
    ? `${systemPrompt}\n\n사용자: ${userMessage}`
    : userMessage;

  const result = await model.generateContentStream(fullPrompt);
  return result.stream;
}

module.exports = { sendGeminiMessage, sendGeminiMessageStream, getGenAI };
