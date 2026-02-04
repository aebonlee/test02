// ================================================================
// S3S1: 구독 권한 체크 - Permission Checker
// ================================================================
/** @task S3S1 */
// 작성일: 2025-12-18
// 목적: AI 기능 접근을 위한 구독 등급별 권한 체크
// ================================================================

const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 (Service Role Key 사용)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * 기능별 필요한 구독 플랜 정의
 *
 * @constant {Object} FEATURE_REQUIREMENTS
 * @property {string[]} ai-qa - AI Q&A 기본 기능 (basic, premium)
 * @property {string[]} ai-advanced - AI 고급 기능 (premium only)
 * @property {string[]} premium-content - 프리미엄 콘텐츠 접근 (basic, premium)
 * @property {string[]} unlimited-api - 무제한 API 호출 (premium only)
 */
const FEATURE_REQUIREMENTS = {
  'ai-qa': ['basic', 'premium'],
  'ai-advanced': ['premium'],
  'premium-content': ['basic', 'premium'],
  'unlimited-api': ['premium']
};

/**
 * 구독 권한 체크
 *
 * @async
 * @param {string} userId - 사용자 UUID
 * @param {string} feature - 기능 이름 (예: 'ai-qa', 'ai-advanced')
 * @returns {Promise<Object>} 권한 체크 결과
 *
 * @example
 * const result = await checkSubscriptionPermission(userId, 'ai-qa');
 * if (result.hasAccess) {
 *   // 기능 허용
 * } else {
 *   // 403 에러 반환
 * }
 */
async function checkSubscriptionPermission(userId, feature) {
  // ================================================================
  // 1. 기능 유효성 검증
  // ================================================================
  if (!FEATURE_REQUIREMENTS[feature]) {
    return {
      hasAccess: false,
      error: {
        code: 'INVALID_FEATURE',
        message: `Unknown feature: ${feature}`
      }
    };
  }

  try {
    // ================================================================
    // 2. 사용자 구독 정보 조회
    // ================================================================
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    // 구독이 없는 경우
    if (subError) {
      if (subError.code === 'PGRST116') {
        return {
          hasAccess: false,
          error: {
            code: 'NO_SUBSCRIPTION',
            message: 'No active subscription found',
            requiredPlans: FEATURE_REQUIREMENTS[feature]
          }
        };
      }

      // 기타 데이터베이스 오류
      console.error('Subscription query error:', subError);
      return {
        hasAccess: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to fetch subscription data'
        }
      };
    }

    // ================================================================
    // 3. 구독 플랜 권한 체크
    // ================================================================
    const userPlan = subscription.subscription_plans?.name?.toLowerCase();
    const requiredPlans = FEATURE_REQUIREMENTS[feature];

    if (!userPlan || !requiredPlans.includes(userPlan)) {
      return {
        hasAccess: false,
        error: {
          code: 'INSUFFICIENT_PLAN',
          message: `Your plan (${userPlan || 'none'}) does not have access to this feature`,
          currentPlan: userPlan || 'none',
          requiredPlans: requiredPlans
        }
      };
    }

    // ================================================================
    // 4. 권한 승인
    // ================================================================
    return {
      hasAccess: true,
      subscription: {
        id: subscription.id,
        plan: userPlan,
        status: subscription.status,
        start_date: subscription.start_date,
        end_date: subscription.end_date
      }
    };

  } catch (error) {
    console.error('Permission check error:', error);
    return {
      hasAccess: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred during permission check'
      }
    };
  }
}

/**
 * 모든 기능에 대한 사용자 권한 조회
 *
 * @async
 * @param {string} userId - 사용자 UUID
 * @returns {Promise<Object>} 기능별 권한 맵
 *
 * @example
 * const permissions = await getUserPermissions(userId);
 * // {
 * //   'ai-qa': true,
 * //   'ai-advanced': false,
 * //   'premium-content': true,
 * //   'unlimited-api': false,
 * //   plan: 'basic'
 * // }
 */
async function getUserPermissions(userId) {
  try {
    // 사용자 구독 정보 조회
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    // 구독이 없는 경우
    if (error) {
      return {
        plan: 'none',
        ...Object.keys(FEATURE_REQUIREMENTS).reduce((acc, feature) => {
          acc[feature] = false;
          return acc;
        }, {})
      };
    }

    const userPlan = subscription.subscription_plans?.name?.toLowerCase() || 'none';

    // 각 기능별 권한 체크
    const permissions = Object.keys(FEATURE_REQUIREMENTS).reduce((acc, feature) => {
      const requiredPlans = FEATURE_REQUIREMENTS[feature];
      acc[feature] = requiredPlans.includes(userPlan);
      return acc;
    }, {});

    return {
      plan: userPlan,
      subscription_id: subscription.id,
      status: subscription.status,
      ...permissions
    };

  } catch (error) {
    console.error('Get user permissions error:', error);
    return {
      plan: 'none',
      error: 'Failed to fetch permissions',
      ...Object.keys(FEATURE_REQUIREMENTS).reduce((acc, feature) => {
        acc[feature] = false;
        return acc;
      }, {})
    };
  }
}

module.exports = {
  checkSubscriptionPermission,
  getUserPermissions,
  FEATURE_REQUIREMENTS
};
