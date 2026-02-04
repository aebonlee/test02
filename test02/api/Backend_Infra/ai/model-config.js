/**
 * @task S4BI
 * @description AI 모델 설정 - api_costs 테이블에서 기본 모델 조회
 */

// 기본 모델 캐시 (5분)
let modelCache = {};
let cacheExpiry = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5분

// Provider 매핑 (api_costs 테이블의 provider 값)
const PROVIDER_MAP = {
  chatgpt: 'openai',
  openai: 'openai',
  gemini: 'google',
  google: 'google',
  perplexity: 'perplexity'
};

// 하드코딩된 폴백 모델 (DB 연결 실패 시)
const FALLBACK_MODELS = {
  openai: 'gpt-4o-mini',
  google: 'gemini-2.5-flash',
  perplexity: 'sonar'
};

/**
 * Provider별 기본 모델 조회
 * @param {string} provider - chatgpt, gemini, perplexity
 * @returns {Promise<string>} 모델명
 */
async function getDefaultModel(provider) {
  const dbProvider = PROVIDER_MAP[provider] || provider;

  // 캐시 확인
  if (Date.now() < cacheExpiry && modelCache[dbProvider]) {
    return modelCache[dbProvider];
  }

  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.warn('[model-config] Supabase 환경변수 없음, 폴백 모델 사용');
      return FALLBACK_MODELS[dbProvider] || FALLBACK_MODELS.openai;
    }

    const url = `${SUPABASE_URL}/rest/v1/api_costs?provider=eq.${dbProvider}&is_default=eq.true&select=model_name&limit=1`;

    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const model = data[0].model_name;
      // 캐시 업데이트
      modelCache[dbProvider] = model;
      cacheExpiry = Date.now() + CACHE_TTL;
      console.log(`[model-config] ${dbProvider} 기본 모델: ${model}`);
      return model;
    }
  } catch (error) {
    console.error(`[model-config] 기본 모델 조회 실패:`, error.message);
  }

  // 폴백
  return FALLBACK_MODELS[dbProvider] || FALLBACK_MODELS.openai;
}

/**
 * 캐시 초기화 (테스트용)
 */
function clearCache() {
  modelCache = {};
  cacheExpiry = 0;
}

module.exports = { getDefaultModel, clearCache, FALLBACK_MODELS };
