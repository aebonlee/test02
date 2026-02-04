// ================================================================
// S2BA3: 구독 해지 API
// ================================================================
// Task ID: S2BA3
// 작성일: 2025-12-14
// 목적: 사용자의 구독 해지 처리
// ================================================================

const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 (Service Role Key 사용)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * 구독 해지 API
 * @method POST
 * @auth Bearer Token (Required)
 * @returns {Object} subscription - 해지된 구독 정보
 */
module.exports = async (req, res) => {
  // ================================================================
  // 1. HTTP 메서드 검증
  // ================================================================
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method is allowed'
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
  // 3. 활성 구독 확인
  // ================================================================
  try {
    const { data: existingSubscription, error: checkError } = await supabase
      .from('subscriptions')
      .select('id, status, plan_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    // 활성 구독이 없는 경우
    if (checkError || !existingSubscription) {
      return res.status(404).json({
        error: {
          code: 'NO_ACTIVE_SUBSCRIPTION',
          message: 'No active subscription found to cancel'
        }
      });
    }

    // ================================================================
    // 4. 구독 해지 처리
    // ================================================================
    const now = new Date().toISOString();
    const { data: subscription, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: now,
        updated_at: now
      })
      .eq('user_id', user.id)
      .eq('status', 'active')
      .select('*, subscription_plans(*)')
      .single();

    if (updateError) {
      console.error('Subscription cancellation error:', updateError);
      return res.status(500).json({
        error: {
          code: 'DB_ERROR',
          message: 'Failed to cancel subscription'
        }
      });
    }

    // ================================================================
    // 5. 사용자 구독 상태 업데이트
    // ================================================================
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled',
        updated_at: now
      })
      .eq('id', user.id);

    if (userUpdateError) {
      console.error('User update error:', userUpdateError);
      // 구독은 해지되었으므로 경고만 로깅
    }

    // ================================================================
    // 6. 성공 응답
    // ================================================================
    res.status(200).json({
      subscription: {
        id: subscription.id,
        user_id: subscription.user_id,
        plan_id: subscription.plan_id,
        status: subscription.status,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        cancelled_at: subscription.cancelled_at,
        updated_at: subscription.updated_at,
        plan: subscription.subscription_plans
      },
      message: 'Subscription cancelled successfully'
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
