// ================================================================
// S3S1: 구독 권한 체크 API
// ================================================================
/** @task S3S1 */
// 작성일: 2025-12-18
// 목적: 프론트엔드에서 사용자의 기능별 접근 권한 확인
// ================================================================

const { verifyAuth } = require('../../S2_개발-1차/Security/api/lib/auth/middleware');
const { checkSubscriptionPermission, getUserPermissions } = require('../lib/subscription/check-permission');

/**
 * 구독 권한 체크 API
 *
 * @method GET
 * @auth Bearer Token (Required)
 * @query {string} feature - 체크할 기능 (옵션: 없으면 전체 권한 반환)
 *
 * @example
 * // 특정 기능 체크
 * GET /api/subscription/check?feature=ai-qa
 * Response: { hasAccess: true, subscription: {...} }
 *
 * @example
 * // 전체 권한 조회
 * GET /api/subscription/check
 * Response: { plan: 'basic', 'ai-qa': true, 'ai-advanced': false, ... }
 */
module.exports = async (req, res) => {
  // ================================================================
  // 1. HTTP 메서드 검증
  // ================================================================
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET method is allowed'
      }
    });
  }

  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // ================================================================
  // 2. 인증 토큰 검증
  // ================================================================
  const { user, error: authError } = await verifyAuth(req);

  if (authError) {
    return res.status(401).json({
      success: false,
      error: authError
    });
  }

  // ================================================================
  // 3. 쿼리 파라미터 파싱
  // ================================================================
  const { feature } = req.query;

  try {
    // ================================================================
    // 4-A. 특정 기능 권한 체크
    // ================================================================
    if (feature) {
      const result = await checkSubscriptionPermission(user.id, feature);

      if (!result.hasAccess) {
        return res.status(403).json({
          success: false,
          hasAccess: false,
          feature: feature,
          error: result.error
        });
      }

      return res.status(200).json({
        success: true,
        hasAccess: true,
        feature: feature,
        subscription: result.subscription
      });
    }

    // ================================================================
    // 4-B. 전체 권한 조회
    // ================================================================
    const permissions = await getUserPermissions(user.id);

    return res.status(200).json({
      success: true,
      user_id: user.id,
      permissions: permissions
    });

  } catch (error) {
    console.error('Subscription check API error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};
