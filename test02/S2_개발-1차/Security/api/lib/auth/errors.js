// ================================================================
// S2S1: 인증 에러 코드 정의
// ================================================================
// Task ID: S2S1
// 작성일: 2025-12-14
// 목적: 인증 관련 에러 응답 표준화
// ================================================================

/**
 * 인증 관련 에러 코드
 */
const AUTH_ERRORS = {
  // 토큰 관련 에러
  NO_TOKEN: {
    code: 'AUTH_001',
    message: 'No token provided',
    httpStatus: 401
  },
  INVALID_TOKEN: {
    code: 'AUTH_002',
    message: 'Invalid token',
    httpStatus: 401
  },
  TOKEN_EXPIRED: {
    code: 'AUTH_003',
    message: 'Token expired',
    httpStatus: 401
  },

  // 권한 관련 에러
  FORBIDDEN: {
    code: 'AUTH_004',
    message: 'Access forbidden',
    httpStatus: 403
  },
  ADMIN_REQUIRED: {
    code: 'AUTH_005',
    message: 'Admin access required',
    httpStatus: 403
  },

  // 사용자 관련 에러
  USER_NOT_FOUND: {
    code: 'AUTH_006',
    message: 'User not found',
    httpStatus: 404
  },
  USER_SUSPENDED: {
    code: 'AUTH_007',
    message: 'User account suspended',
    httpStatus: 403
  },

  // 서비스 에러
  SERVICE_ERROR: {
    code: 'AUTH_500',
    message: 'Authentication service error',
    httpStatus: 500
  }
};

/**
 * API 공통 에러 코드
 */
const API_ERRORS = {
  // 요청 에러
  BAD_REQUEST: {
    code: 'API_400',
    message: 'Bad request',
    httpStatus: 400
  },
  VALIDATION_ERROR: {
    code: 'API_401',
    message: 'Validation error',
    httpStatus: 400
  },
  NOT_FOUND: {
    code: 'API_404',
    message: 'Resource not found',
    httpStatus: 404
  },
  METHOD_NOT_ALLOWED: {
    code: 'API_405',
    message: 'Method not allowed',
    httpStatus: 405
  },

  // 서버 에러
  INTERNAL_ERROR: {
    code: 'API_500',
    message: 'Internal server error',
    httpStatus: 500
  },
  DATABASE_ERROR: {
    code: 'API_501',
    message: 'Database error',
    httpStatus: 500
  },
  EXTERNAL_SERVICE_ERROR: {
    code: 'API_502',
    message: 'External service error',
    httpStatus: 502
  }
};

/**
 * 에러 응답 생성 헬퍼
 * @param {Object} res - Response 객체
 * @param {Object} errorType - AUTH_ERRORS 또는 API_ERRORS의 에러 객체
 * @param {string} details - 추가 세부 정보 (선택)
 */
function sendError(res, errorType, details = null) {
  const response = {
    success: false,
    error: {
      code: errorType.code,
      message: errorType.message
    }
  };

  if (details) {
    response.error.details = details;
  }

  return res.status(errorType.httpStatus).json(response);
}

/**
 * 성공 응답 생성 헬퍼
 * @param {Object} res - Response 객체
 * @param {Object} data - 응답 데이터
 * @param {number} status - HTTP 상태 코드 (기본: 200)
 */
function sendSuccess(res, data, status = 200) {
  return res.status(status).json({
    success: true,
    data
  });
}

module.exports = {
  AUTH_ERRORS,
  API_ERRORS,
  sendError,
  sendSuccess
};
