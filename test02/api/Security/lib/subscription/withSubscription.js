// S3S1: 구독 권한 체크 (Subscription Permission Check)

const { createClient } = require('@supabase/supabase-js');
const { checkPermission } = require('./check-permission');

/**
 * 구독 권한 확인 HOC (Vercel Serverless 호환)
 * API 라우트에서 특정 기능의 구독 등급을 검증합니다
 *
 * @param {string} feature - 확인할 기능 (예: 'ai-qa.use')
 * @returns {Function} Handler wrapper 함수
 */
function withSubscription(feature) {
  return (handler) => {
    return async (req, res) => {
      // 1. 사용자 인증 확인
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          error: 'Not authenticated'
        });
      }

      // 2. Supabase에서 사용자 정보 조회
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      const { data: user, error } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      if (error || !user) {
        return res.status(401).json({
          error: 'Invalid token'
        });
      }

      // 3. 사용자 구독 등급 조회
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.user.id)
        .single();

      const tier = profile?.subscription_tier || 'free';

      // 4. 권한 확인
      const result = checkPermission(feature, tier);
      if (!result.allowed) {
        return res.status(403).json({
          error: 'Subscription required',
          reason: result.reason,
          currentTier: tier
        });
      }

      // 5. 사용자 정보를 req에 추가하고 handler 호출
      req.user = user.user;
      req.subscription = { plan: tier };
      return handler(req, res);
    };
  };
}

module.exports = { withSubscription };
