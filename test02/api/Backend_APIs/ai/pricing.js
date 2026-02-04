/**
 * @task S3BA2
 * AI 서비스 가격 조회 API - DB 기반 실시간 가격
 * GET /api/ai/pricing
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// 폴백용 기본 가격 (DB 조회 실패 시)
// 2024-12-20 기준 실제 API 가격
// ============================================
const FALLBACK_PRICING = {
    gemini: {
        display_name: 'Gemini 2.5 Pro',
        input_price_usd: 1.25,    // $1.25 / 1M tokens
        output_price_usd: 10.00,  // $10.00 / 1M tokens
        request_fee_usd: 0,
        description: 'Google의 최신 AI 모델',
        features: ['빠른 응답', '한국어 최적화', '멀티모달'],
        icon: '🌟',
        color: '#4285F4',
        source_url: 'https://ai.google.dev/gemini-api/docs/pricing'
    },
    chatgpt: {
        display_name: 'GPT-4o',
        input_price_usd: 2.50,    // $2.50 / 1M tokens (2024-12 기준)
        output_price_usd: 10.00,  // $10.00 / 1M tokens
        request_fee_usd: 0,
        description: 'OpenAI의 고급 AI 모델',
        features: ['높은 정확도', '코드 작성', '창의적 글쓰기'],
        icon: '🤖',
        color: '#10A37F',
        source_url: 'https://openai.com/api/pricing/'
    },
    perplexity: {
        display_name: 'Perplexity Sonar Pro',
        input_price_usd: 3.00,    // $3.00 / 1M tokens
        output_price_usd: 15.00,  // $15.00 / 1M tokens
        request_fee_usd: 0.005,   // $0.005 per request
        description: '실시간 검색 기반 AI',
        features: ['최신 정보', '출처 제공', '팩트 체크'],
        icon: '🔍',
        color: '#1FB8CD',
        source_url: 'https://docs.perplexity.ai/getting-started/pricing'
    }
};

// 시스템 설정 기본값
const DEFAULT_CONFIG = {
    usd_to_krw: 1400,
    margin_rate: 1.2,
    avg_input_tokens: 300,
    avg_output_tokens: 800,
    min_charge: 10
};

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 캐시 헤더 (5분)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    try {
        // 1. 시스템 설정 조회 (환율, 마진 등)
        const config = await getSystemConfig();

        // 2. AI 가격 정보 조회 (DB 우선, 폴백 사용)
        const pricingData = await getAIPricing();

        // 3. 질문당 예상 가격 계산
        const pricing = {};
        for (const [model, data] of Object.entries(pricingData)) {
            const estimatedCost = calculateCostPerQuery(data, config);

            pricing[model] = {
                service_id: model,
                name: data.display_name,
                price: estimatedCost,
                description: data.description,
                features: data.features,
                icon: data.icon,
                color: data.color,
                is_available: data.is_available !== false,
                pricing_details: {
                    input_usd_per_1m: data.input_price_usd,
                    output_usd_per_1m: data.output_price_usd,
                    request_fee_usd: data.request_fee_usd || 0,
                    source: data.source_url
                }
            };
        }

        return res.status(200).json({
            success: true,
            pricing,
            currency: 'KRW',
            currency_symbol: '₩',
            config: {
                exchange_rate: config.usd_to_krw,
                margin_rate: config.margin_rate,
                avg_input_tokens: config.avg_input_tokens,
                avg_output_tokens: config.avg_output_tokens
            },
            updated_at: new Date().toISOString(),
            meta: {
                total_models: Object.keys(pricing).length,
                price_source: 'database',
                note: '가격은 평균 질문/답변 길이 기준 예상치입니다'
            }
        });

    } catch (error) {
        console.error('Pricing API error:', error);

        // 폴백: 기본값으로 응답
        return res.status(200).json({
            success: true,
            pricing: buildFallbackPricing(),
            currency: 'KRW',
            currency_symbol: '₩',
            updated_at: new Date().toISOString(),
            _fallback: true,
            _error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * 시스템 설정 조회
 */
async function getSystemConfig() {
    try {
        const { data, error } = await supabase
            .from('system_config')
            .select('key, value')
            .in('key', ['USD_TO_KRW', 'AI_MARGIN_RATE', 'AVG_INPUT_TOKENS', 'AVG_OUTPUT_TOKENS', 'MIN_CHARGE']);

        if (error || !data || data.length === 0) {
            return DEFAULT_CONFIG;
        }

        const config = { ...DEFAULT_CONFIG };
        for (const row of data) {
            switch (row.key) {
                case 'USD_TO_KRW':
                    config.usd_to_krw = parseFloat(row.value) || DEFAULT_CONFIG.usd_to_krw;
                    break;
                case 'AI_MARGIN_RATE':
                    config.margin_rate = parseFloat(row.value) || DEFAULT_CONFIG.margin_rate;
                    break;
                case 'AVG_INPUT_TOKENS':
                    config.avg_input_tokens = parseInt(row.value) || DEFAULT_CONFIG.avg_input_tokens;
                    break;
                case 'AVG_OUTPUT_TOKENS':
                    config.avg_output_tokens = parseInt(row.value) || DEFAULT_CONFIG.avg_output_tokens;
                    break;
                case 'MIN_CHARGE':
                    config.min_charge = parseInt(row.value) || DEFAULT_CONFIG.min_charge;
                    break;
            }
        }

        return config;
    } catch (error) {
        console.error('Config fetch error:', error);
        return DEFAULT_CONFIG;
    }
}

/**
 * AI 가격 정보 조회 (DB → 폴백)
 */
async function getAIPricing() {
    try {
        const { data, error } = await supabase
            .from('ai_pricing')
            .select('*')
            .eq('is_active', true);

        if (error || !data || data.length === 0) {
            console.log('Using fallback pricing (no DB data)');
            return FALLBACK_PRICING;
        }

        // DB 데이터를 객체로 변환
        const pricing = {};
        for (const row of data) {
            pricing[row.service_name] = {
                display_name: row.display_name,
                input_price_usd: row.input_price_usd,
                output_price_usd: row.output_price_usd,
                request_fee_usd: row.request_fee_usd || 0,
                description: row.description,
                features: row.features || [],
                icon: row.icon || '🤖',
                color: row.color || '#718096',
                is_available: row.is_available,
                source_url: row.source_url,
                updated_at: row.updated_at
            };
        }

        // 누락된 모델은 폴백으로 채우기
        for (const [model, fallback] of Object.entries(FALLBACK_PRICING)) {
            if (!pricing[model]) {
                pricing[model] = fallback;
            }
        }

        return pricing;
    } catch (error) {
        console.error('AI pricing fetch error:', error);
        return FALLBACK_PRICING;
    }
}

/**
 * 질문당 예상 비용 계산
 */
function calculateCostPerQuery(pricingData, config) {
    // USD 비용 계산
    let costUSD = (config.avg_input_tokens / 1_000_000) * pricingData.input_price_usd
                + (config.avg_output_tokens / 1_000_000) * pricingData.output_price_usd;

    // 요청 비용 추가 (Perplexity 등)
    if (pricingData.request_fee_usd) {
        costUSD += pricingData.request_fee_usd;
    }

    // 마진 적용
    costUSD *= config.margin_rate;

    // KRW 변환
    const costKRW = costUSD * config.usd_to_krw;

    // 최소 과금 적용 및 올림
    return Math.max(config.min_charge, Math.ceil(costKRW));
}

/**
 * 폴백 가격 생성
 */
function buildFallbackPricing() {
    const config = DEFAULT_CONFIG;
    const pricing = {};

    for (const [model, data] of Object.entries(FALLBACK_PRICING)) {
        const estimatedCost = calculateCostPerQuery(data, config);
        pricing[model] = {
            service_id: model,
            name: data.display_name,
            price: estimatedCost,
            description: data.description,
            features: data.features,
            icon: data.icon,
            color: data.color,
            is_available: true
        };
    }

    return pricing;
}
