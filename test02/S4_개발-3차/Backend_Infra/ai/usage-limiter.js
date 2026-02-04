// S3BI1: AI API 클라이언트 통합 - 사용량 제한
const { createClient } = require('@supabase/supabase-js');

// 구독 등급별 일일 사용량 제한
const DAILY_LIMITS = {
  free: 0,      // AI 기능 사용 불가
  basic: 20,    // 하루 20회
  premium: 100  // 하루 100회
};

class UsageLimiter {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  async checkLimit(userId, tier) {
    const limit = DAILY_LIMITS[tier] || 0;

    if (limit === 0) {
      return {
        allowed: false,
        reason: 'AI features require Basic or Premium subscription',
        remaining: 0,
        limit: 0
      };
    }

    // 오늘 날짜의 사용량 조회
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from('ai_usage_logs')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`);

    const usedToday = data?.length || 0;
    const remaining = Math.max(0, limit - usedToday);

    return {
      allowed: remaining > 0,
      reason: remaining > 0 ? null : 'Daily limit reached',
      remaining,
      limit,
      usedToday
    };
  }

  async logUsage(userId, tokens, model) {
    const { error } = await this.supabase
      .from('ai_usage_logs')
      .insert({
        user_id: userId,
        tokens_used: tokens,
        model: model,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to log AI usage:', error);
    }
  }
}

module.exports = { UsageLimiter, DAILY_LIMITS };
