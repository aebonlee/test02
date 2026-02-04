/**
 * AI 사용량 제한 모듈
 * 구독 등급별 일일 AI 사용 횟수 제한
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 구독 등급별 일일 사용 한도
const DAILY_LIMITS = {
    free: 0,       // 무료 회원: AI 사용 불가
    basic: 20,     // Basic: 일 20회
    premium: 100   // Premium: 일 100회
};

/**
 * 사용량 제한 관리자
 */
class UsageLimiter {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 60000; // 1분 캐시
    }

    /**
     * 사용량 한도 체크
     * @param {string} userId - 사용자 ID
     * @param {string} tier - 구독 등급 (free, basic, premium)
     * @returns {Promise<{allowed: boolean, remaining: number, usedToday: number}>}
     */
    async checkLimit(userId, tier) {
        const limit = DAILY_LIMITS[tier] || 0;

        if (limit === 0) {
            return {
                allowed: false,
                remaining: 0,
                usedToday: 0,
                reason: 'AI 기능은 Basic 이상 구독자만 사용할 수 있습니다.'
            };
        }

        // 캐시 확인
        const cacheKey = `usage_${userId}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            const remaining = Math.max(0, limit - cached.usedToday);
            return {
                allowed: remaining > 0,
                remaining,
                usedToday: cached.usedToday
            };
        }

        // DB에서 오늘 사용량 조회
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        try {
            const { count, error } = await supabase
                .from('ai_usage_log')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .gte('created_at', today.toISOString());

            if (error) {
                console.error('Usage check error:', error);
                // 에러 시 허용 (fail-open)
                return { allowed: true, remaining: limit, usedToday: 0 };
            }

            const usedToday = count || 0;
            const remaining = Math.max(0, limit - usedToday);

            // 캐시 저장
            this.cache.set(cacheKey, {
                usedToday,
                timestamp: Date.now()
            });

            return {
                allowed: remaining > 0,
                remaining,
                usedToday
            };

        } catch (error) {
            console.error('Usage limiter error:', error);
            return { allowed: true, remaining: limit, usedToday: 0 };
        }
    }

    /**
     * 사용량 기록
     * @param {string} userId - 사용자 ID
     * @param {string} serviceName - AI 서비스명 (ChatGPT, Gemini, Perplexity)
     * @param {Object} details - 상세 정보
     */
    async recordUsage(userId, serviceName, details = {}) {
        try {
            const { error } = await supabase
                .from('ai_usage_log')
                .insert({
                    user_id: userId,
                    service_name: serviceName,
                    prompt: details.prompt || '',
                    response: details.response || '',
                    tokens_used: details.tokensUsed || 0,
                    cost: details.cost || 0,
                    response_time_ms: details.responseTimeMs || 0
                });

            if (error) {
                console.error('Record usage error:', error);
            }

            // 캐시 무효화
            this.cache.delete(`usage_${userId}`);

        } catch (error) {
            console.error('Record usage error:', error);
        }
    }

    /**
     * 캐시 클리어
     */
    clearCache(userId) {
        if (userId) {
            this.cache.delete(`usage_${userId}`);
        } else {
            this.cache.clear();
        }
    }
}

module.exports = {
    UsageLimiter,
    DAILY_LIMITS
};
