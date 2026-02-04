/**
 * @task S3BA2
 * AI 가격 계산 유틸리티 - 실제 API 가격 기반
 */

// ============================================
// 실제 API 토큰 가격 (2024-2025 기준)
// 단위: USD per 1M tokens
// ============================================
const TOKEN_PRICING_USD = {
    // OpenAI GPT-4o (https://openai.com/api/pricing/)
    chatgpt: {
        input: 2.50,      // $2.50 / 1M tokens (2024-12 기준)
        output: 10.00,    // $10.00 / 1M tokens
        model: 'gpt-4o'
    },
    // Google Gemini 2.5 Pro (https://ai.google.dev/gemini-api/docs/pricing)
    gemini: {
        input: 1.25,      // $1.25 / 1M tokens (≤200K)
        output: 10.00,    // $10.00 / 1M tokens
        model: 'gemini-2.5-pro'
    },
    // Perplexity Sonar Pro (https://docs.perplexity.ai/getting-started/pricing)
    perplexity: {
        input: 3.00,      // $3.00 / 1M tokens
        output: 15.00,    // $15.00 / 1M tokens
        request_fee: 5.00, // ~$0.005 per request (medium context) = $5/1000 requests
        model: 'sonar-pro'
    }
};

// ============================================
// 시스템 설정
// ============================================
const CONFIG = {
    USD_TO_KRW: 1400,       // 환율 (여유있게 설정)
    MARGIN_RATE: 1.2,       // 마진 20%
    MIN_CHARGE: 10,         // 최소 과금 (원)

    // 평균 토큰 추정 (한글 기준)
    AVG_INPUT_TOKENS: 300,   // 질문 평균 300 토큰 (한글 ~150자)
    AVG_OUTPUT_TOKENS: 800,  // 답변 평균 800 토큰 (한글 ~400자)
};

/**
 * 모델별 질문당 예상 비용 계산 (원)
 * @param {string} model - AI 모델명
 * @param {number} inputTokens - 입력 토큰 수 (없으면 평균값 사용)
 * @param {number} outputTokens - 출력 토큰 수 (없으면 평균값 사용)
 * @returns {number} 예상 비용 (원, 올림)
 */
export function calculateCost(model, inputTokens = null, outputTokens = null) {
    const pricing = TOKEN_PRICING_USD[model];
    if (!pricing) return CONFIG.MIN_CHARGE;

    const inTokens = inputTokens || CONFIG.AVG_INPUT_TOKENS;
    const outTokens = outputTokens || CONFIG.AVG_OUTPUT_TOKENS;

    // USD 비용 계산 (토큰 / 1M * 가격)
    let costUSD = (inTokens / 1_000_000) * pricing.input
                + (outTokens / 1_000_000) * pricing.output;

    // Perplexity 요청 비용 추가
    if (pricing.request_fee) {
        costUSD += pricing.request_fee / 1000; // per request
    }

    // 마진 적용
    costUSD *= CONFIG.MARGIN_RATE;

    // KRW 변환
    const costKRW = costUSD * CONFIG.USD_TO_KRW;

    // 최소 과금 적용 및 올림
    return Math.max(CONFIG.MIN_CHARGE, Math.ceil(costKRW));
}

/**
 * 모든 모델의 예상 가격 조회
 * @returns {Object} 모델별 예상 가격 (원)
 */
export function getAllPrices() {
    const prices = {};
    for (const model of Object.keys(TOKEN_PRICING_USD)) {
        prices[model] = calculateCost(model);
    }
    return prices;
}

/**
 * 실제 사용량 기반 비용 계산
 * @param {string} model - AI 모델명
 * @param {string} inputText - 입력 텍스트
 * @param {string} outputText - 출력 텍스트
 * @returns {number} 실제 비용 (원)
 */
export function calculateActualCost(model, inputText, outputText) {
    // 토큰 추정 (한글: 1자 ≈ 2토큰, 영어: 1단어 ≈ 1.3토큰)
    const inputTokens = estimateTokens(inputText);
    const outputTokens = estimateTokens(outputText);

    return calculateCost(model, inputTokens, outputTokens);
}

/**
 * 텍스트의 토큰 수 추정
 * @param {string} text - 텍스트
 * @returns {number} 추정 토큰 수
 */
export function estimateTokens(text) {
    if (!text) return 0;

    // 한글 비율 체크
    const koreanChars = (text.match(/[가-힣]/g) || []).length;
    const totalChars = text.length;
    const koreanRatio = totalChars > 0 ? koreanChars / totalChars : 0;

    // 한글은 문자당 ~2토큰, 영어는 단어당 ~1.3토큰
    if (koreanRatio > 0.3) {
        // 주로 한글
        return Math.ceil(totalChars * 2);
    } else {
        // 주로 영어
        const words = text.split(/\s+/).length;
        return Math.ceil(words * 1.3);
    }
}

/**
 * 크레딧 충분 여부 확인
 * @param {number} userCredit - 사용자 보유 크레딧
 * @param {string} model - 사용할 AI 모델
 * @returns {boolean} 크레딧 충분 여부
 */
export function hasEnoughCredit(userCredit, model) {
    const requiredCredit = calculateCost(model);
    return userCredit >= requiredCredit;
}

/**
 * 사용 가능한 모델 필터링 (크레딧 기반)
 * @param {number} userCredit - 사용자 보유 크레딧
 * @returns {Object[]} 사용 가능한 모델 목록
 */
export function getAvailableModels(userCredit) {
    const prices = getAllPrices();
    return Object.entries(prices)
        .filter(([_, price]) => userCredit >= price)
        .map(([model, price]) => ({ model, price }));
}

/**
 * 크레딧 부족량 계산
 * @param {number} userCredit - 사용자 보유 크레딧
 * @param {string} model - 사용할 AI 모델
 * @returns {number} 부족한 크레딧 (0이면 충분)
 */
export function getCreditShortfall(userCredit, model) {
    const required = calculateCost(model);
    return Math.max(0, required - userCredit);
}

/**
 * 가격 정보 상세 조회 (디버깅/표시용)
 * @param {string} model - AI 모델명
 * @returns {Object} 상세 가격 정보
 */
export function getPricingDetails(model) {
    const pricing = TOKEN_PRICING_USD[model];
    if (!pricing) return null;

    const estimatedCost = calculateCost(model);

    return {
        model: pricing.model,
        token_pricing_usd: {
            input_per_1m: pricing.input,
            output_per_1m: pricing.output,
            request_fee: pricing.request_fee || 0
        },
        calculation: {
            avg_input_tokens: CONFIG.AVG_INPUT_TOKENS,
            avg_output_tokens: CONFIG.AVG_OUTPUT_TOKENS,
            margin_rate: CONFIG.MARGIN_RATE,
            exchange_rate: CONFIG.USD_TO_KRW
        },
        estimated_cost_krw: estimatedCost
    };
}

/**
 * 시스템 설정 조회
 * @returns {Object} 현재 설정값
 */
export function getConfig() {
    return { ...CONFIG };
}

/**
 * 환율 업데이트 (관리자용)
 * @param {number} newRate - 새 환율
 */
export function updateExchangeRate(newRate) {
    if (newRate > 0) {
        CONFIG.USD_TO_KRW = newRate;
    }
}
