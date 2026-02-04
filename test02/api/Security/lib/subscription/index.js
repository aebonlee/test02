// S3S1: 구독 권한 체크 (Subscription Permission Check)

const { checkPermission, FEATURE_PERMISSIONS } = require('./check-permission');
const { withSubscription } = require('./withSubscription');

/**
 * 구독 권한 체크 모듈
 *
 * 주요 기능:
 * - checkPermission: 기능별 구독 등급 확인
 * - withSubscription: Express/Next.js API 미들웨어
 * - FEATURE_PERMISSIONS: 기능별 권한 매핑 테이블
 */
module.exports = {
  checkPermission,
  withSubscription,
  FEATURE_PERMISSIONS
};
