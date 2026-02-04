// ================================================================
// S2BA3: 구독 상태 조회 API
// ================================================================
// Task ID: S2BA3
// 작성일: 2025-12-14
// 목적: 사용자의 구독 상태 및 정보 조회
// ================================================================

const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 (Service Role Key 사용)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * 구독 상태 조회 API
 * @method GET
 * @auth Bearer Token (Required)
 * @returns {Object} subscription - 구독 정보 (없으면 null)
 */
module.exports = async (req, res) => {
  // ================================================================
  // 1. HTTP 메서드 검증
  // ================================================================
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET method is allowed'
      }
    });
  }

  // ================================================================
  // 2. 인증 토큰 검증
  // ================================================================
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'AUTH_001',
        message: 'No token provided'
      }
    });
  }

  const token = authHeader.replace('Bearer ', '');

  // Supabase에서 토큰 검증
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({
      error: {
        code: 'AUTH_002',
        message: 'Invalid or expired token'
      }
    });
  }

  // ================================================================
  // 3. 구독 정보 조회
  // ================================================================
  try {
    const { data: subscription, error: queryError } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', user.id)
      .single();

    // 구독이 없는 경우 (에러가 아님)
    if (queryError) {
      if (queryError.code === 'PGRST116') {
        // No rows returned
        return res.status(200).json({
          subscription: null,
          status: 'none',
          message: 'No active subscription found'
        });
      }

      // 기타 데이터베이스 오류
      console.error('Database query error:', queryError);
      return res.status(500).json({
        error: {
          code: 'DB_ERROR',
          message: 'Failed to fetch subscription data'
        }
      });
    }

    // ================================================================
    // 4. 구독 정보 반환
    // ================================================================
    res.status(200).json({
      subscription: {
        id: subscription.id,
        user_id: subscription.user_id,
        plan_id: subscription.plan_id,
        status: subscription.status, // pending, active, cancelled, expired
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        cancelled_at: subscription.cancelled_at,
        created_at: subscription.created_at,
        updated_at: subscription.updated_at,
        plan: subscription.subscription_plans
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};
