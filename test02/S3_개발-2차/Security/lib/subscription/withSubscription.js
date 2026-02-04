// ================================================================
// S3S1: 구독 권한 체크 - API Wrapper
// ================================================================
/** @task S3S1 */
// 작성일: 2025-12-18
// 목적: 구독 권한이 필요한 API 엔드포인트를 위한 래퍼 함수
// ================================================================

const { verifyAuth } = require('../../../S2_개발-1차/Security/api/lib/auth/middleware');
const { checkSubscriptionPermission } = require('./check-permission');

/**
 * 구독 권한 필수 API 래퍼
 * 특정 기능에 대한 구독 권한이 있는 사용자만 접근 가능
 *
 * @param {string} feature - 필요한 기능 이름 (예: 'ai-qa', 'ai-advanced')
 * @returns {Function} 래퍼된 핸들러
 *
 * @example
 * // AI Q&A API에 적용
 * module.exports = withSubscription('ai-qa')(async (req, res) => {
 *   const { user, subscription } = req;
 *   // AI Q&A 로직 실행
 *   res.json({ message: 'AI Q&A response' });
 * });
 *
 * @example
 * // AI 고급 기능 API에 적용
 * module.exports = withSubscription('ai-advanced')(async (req, res) => {
 *   const { user, subscription } = req;
 *   // AI 고급 기능 로직 실행
 *   res.json({ message: 'Advanced AI feature response' });
 * });
 */
function withSubscription(feature) {
  return function(handler) {
    return async (req, res) => {
      // ================================================================
      // CORS 프리플라이트 처리
      // ================================================================
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).end();
      }

      // ================================================================
      // 1단계: 인증 확인
      // ================================================================
      const { user, error: authError } = await verifyAuth(req);

      if (authError) {
        return res.status(401).json({
          success: false,
          error: authError
        });
      }

      // ================================================================
      // 2단계: 구독 권한 체크
      // ================================================================
      const permissionResult = await checkSubscriptionPermission(user.id, feature);

      if (!permissionResult.hasAccess) {
        return res.status(403).json({
          success: false,
          error: {
            code: permissionResult.error.code,
            message: permissionResult.error.message,
            feature: feature,
            currentPlan: permissionResult.error.currentPlan,
            requiredPlans: permissionResult.error.requiredPlans
          }
        });
      }

      // ================================================================
      // 3단계: req에 인증 및 구독 정보 추가
      // ================================================================
      req.user = user;
      req.subscription = permissionResult.subscription;

      // ================================================================
      // 4단계: 원래 핸들러 실행
      // ================================================================
      try {
        return await handler(req, res);
      } catch (err) {
        console.error('Handler error:', err);
        return res.status(500).json({
          success: false,
          error: {
            code: 'SERVER_500',
            message: 'Internal server error'
          }
        });
      }
    };
  };
}

/**
 * 구독 권한 선택적 체크 래퍼
 * 권한이 있으면 구독 정보를 제공하고, 없어도 계속 진행
 * (무료 사용자에게도 제한적 기능 제공 시 사용)
 *
 * @param {string} feature - 체크할 기능 이름
 * @returns {Function} 래퍼된 핸들러
 *
 * @example
 * // 무료 사용자는 제한적 접근, 유료 사용자는 전체 접근
 * module.exports = withOptionalSubscription('ai-qa')(async (req, res) => {
 *   const { user, subscription } = req;
 *
 *   if (subscription) {
 *     // 유료 사용자: 무제한 사용
 *     return res.json({ unlimited: true, data: fullData });
 *   } else {
 *     // 무료 사용자: 제한적 사용
 *     return res.json({ unlimited: false, data: limitedData });
 *   }
 * });
 */
function withOptionalSubscription(feature) {
  return function(handler) {
    return async (req, res) => {
      // CORS 프리플라이트 처리
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).end();
      }

      // 1. 인증 시도 (실패해도 계속)
      const { user } = await verifyAuth(req);
      req.user = user; // null일 수 있음

      // 2. 구독 권한 체크 (실패해도 계속)
      if (user) {
        const permissionResult = await checkSubscriptionPermission(user.id, feature);
        if (permissionResult.hasAccess) {
          req.subscription = permissionResult.subscription;
        } else {
          req.subscription = null;
        }
      } else {
        req.subscription = null;
      }

      // 3. 핸들러 실행
      try {
        return await handler(req, res);
      } catch (err) {
        console.error('Handler error:', err);
        return res.status(500).json({
          success: false,
          error: {
            code: 'SERVER_500',
            message: 'Internal server error'
          }
        });
      }
    };
  };
}

module.exports = {
  withSubscription,
  withOptionalSubscription
};
