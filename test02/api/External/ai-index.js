// S3BA1: AI Q&A API
/**
 * AI API 모듈 통합 인터페이스
 *
 * 엔드포인트:
 * - POST /api/ai/qa          - AI 질의응답 (Basic+ 구독 필요)
 * - POST /api/ai/faq-suggest - FAQ 유사 질문 제안 (인증 불필요)
 * - GET  /api/ai/usage       - AI 사용량 조회 (인증 필요)
 */

const qaHandler = require('./qa');
const faqSuggestHandler = require('./faq-suggest');
const usageHandler = require('./usage');

module.exports = {
  // AI Q&A 핸들러 (withSubscription 적용됨)
  qaHandler,

  // FAQ 제안 핸들러 (인증 불필요)
  faqSuggestHandler,

  // 사용량 조회 핸들러 (withSubscription 적용됨)
  usageHandler
};
