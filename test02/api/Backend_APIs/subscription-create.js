// ================================================================
// S2BA3: 구독 신청 API
// ================================================================
// Task ID: S2BA3
// 작성일: 2025-12-14
// 목적: 새로운 구독 신청 처리
// ================================================================

const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 (Service Role Key 사용)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * 구독 신청 API
 * @method POST
 * @auth Bearer Token (Required)
 * @body {string} plan_id - 구독 플랜 ID
 * @returns {Object} subscription - 생성된 구독 정보
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
  // 3. 요청 데이터 검증
  // ================================================================
  const { plan_id } = req.body;

  if (!plan_id) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'plan_id is required'
      }
    });
  }

  // ================================================================
  // 4. 기존 구독 확인
  // ================================================================
  try {
    const { data: existingSubscription, error: checkError } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .in('status', ['pending', 'active'])
      .single();

    // 이미 활성 구독이 있는 경우
    if (existingSubscription && !checkError) {
      return res.status(409).json({
        error: {
          code: 'SUBSCRIPTION_EXISTS',
          message: 'User already has an active or pending subscription'
        }
      });
    }

    // ================================================================
    // 5. 구독 플랜 확인
    // ================================================================
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', plan_id)
      .single();

    if (planError || !plan) {
      return res.status(404).json({
        error: {
          code: 'PLAN_NOT_FOUND',
          message: 'Subscription plan not found'
        }
      });
    }

    // ================================================================
    // 6. 구독 생성
    // ================================================================
    const now = new Date().toISOString();
    const { data: subscription, error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_id: plan_id,
        status: 'pending', // 결제 완료 후 active로 변경
        start_date: now,
        end_date: null, // 월 구독의 경우 null (무기한)
        created_at: now,
        updated_at: now
      })
      .select('*, subscription_plans(*)')
      .single();

    if (insertError) {
      console.error('Subscription creation error:', insertError);
      return res.status(500).json({
        error: {
          code: 'DB_ERROR',
          message: 'Failed to create subscription'
        }
      });
    }

    // ================================================================
    // 7. 사용자 구독 상태 업데이트
    // ================================================================
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        subscription_status: 'pending',
        updated_at: now
      })
      .eq('id', user.id);

    if (userUpdateError) {
      console.error('User update error:', userUpdateError);
      // 구독은 생성되었으므로 경고만 로깅
    }

    // ================================================================
    // 8. 성공 응답
    // ================================================================
    res.status(201).json({
      subscription: {
        id: subscription.id,
        user_id: subscription.user_id,
        plan_id: subscription.plan_id,
        status: subscription.status,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        created_at: subscription.created_at,
        plan: subscription.subscription_plans
      },
      message: 'Subscription created successfully'
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
