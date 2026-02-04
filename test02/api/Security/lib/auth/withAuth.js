// ================================================================
// S2S1: 인증 필수 API 래퍼
// ================================================================
// Task ID: S2S1
// 작성일: 2025-12-14
// 목적: 인증이 필요한 API 엔드포인트를 위한 래퍼 함수
// OWASP A05 대응: CORS 도메인 제한 적용 (2026-01-18)
// ================================================================

const { verifyAuth, getUserProfile } = require('./middleware');
const { setCorsHeaders } = require('../../../Backend_APIs/lib/cors');

/**
 * 인증 필수 API 래퍼
 * 인증된 사용자만 접근 가능한 API 엔드포인트에 사용
 *
 * @param {Function} handler - API 핸들러 함수
 * @param {Object} options - 옵션
 * @param {boolean} options.includeProfile - 사용자 프로필 포함 여부
 * @returns {Function} 래퍼된 핸들러
 *
 * @example
 * module.exports = withAuth(async (req, res) => {
 *   const { user } = req;
 *   res.json({ message: `Hello, ${user.email}` });
 * });
 */
function withAuth(handler, options = {}) {
  return async (req, res) => {
    // CORS 처리 (OWASP A05 대응: 도메인 제한)
    if (setCorsHeaders(req, res)) {
      return; // Preflight 요청 처리 완료
    }

    // 인증 검증
    const { user, error } = await verifyAuth(req);

    if (error) {
      return res.status(401).json({
        success: false,
        error
      });
    }

    // 사용자 정보를 req에 추가
    req.user = user;

    // 프로필 정보 포함 옵션
    if (options.includeProfile) {
      const profile = await getUserProfile(user.id);
      req.userProfile = profile;
    }

    // 원래 핸들러 실행
    try {
      return await handler(req, res);
    } catch (err) {
      console.error('Handler error:', err);
      return res.status(500).json({
        success: false,
        error: { code: 'SERVER_500', message: 'Internal server error' }
      });
    }
  };
}

/**
 * 선택적 인증 래퍼
 * 인증이 있으면 사용자 정보를 제공하고, 없어도 계속 진행
 *
 * @param {Function} handler - API 핸들러 함수
 * @returns {Function} 래퍼된 핸들러
 */
function withOptionalAuth(handler) {
  return async (req, res) => {
    // CORS 처리 (OWASP A05 대응: 도메인 제한)
    if (setCorsHeaders(req, res)) {
      return; // Preflight 요청 처리 완료
    }

    // 인증 시도 (실패해도 계속 진행)
    const { user } = await verifyAuth(req);
    req.user = user; // null일 수 있음

    try {
      return await handler(req, res);
    } catch (err) {
      console.error('Handler error:', err);
      return res.status(500).json({
        success: false,
        error: { code: 'SERVER_500', message: 'Internal server error' }
      });
    }
  };
}

module.exports = { withAuth, withOptionalAuth };
