/**
 * @task S1BI2
 *
 * Sentry Server-Side Error Tracking
 * 서버사이드 에러 핸들링 (Vercel Serverless Functions용)
 */

const Sentry = require('@sentry/node');

/**
 * Sentry 서버 초기화
 * @param {string} dsn - Sentry DSN
 */
function initSentry(dsn) {
  if (!dsn) {
    console.warn('[Sentry Server] DSN not provided, Sentry will not be initialized');
    return;
  }

  try {
    Sentry.init({
      dsn,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',

      // 트래이싱 샘플레이트
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // 서버사이드 통합
      integrations: [
        // HTTP 요청 추적
        new Sentry.Integrations.Http({ tracing: true }),
      ],

      // 에러 필터링
      beforeSend(event, hint) {
        // 개발 환경에서는 콘솔에도 출력
        if (process.env.NODE_ENV !== 'production') {
          console.error('[Sentry Server Event]', event);
        }

        return event;
      },
    });

    console.log(`[Sentry Server] Initialized successfully (${process.env.NODE_ENV || 'development'})`);
  } catch (error) {
    console.error('[Sentry Server] Initialization failed:', error);
  }
}

/**
 * API 에러 캡처 (요청 정보 포함)
 * @param {Error} error - 에러 객체
 * @param {Object} req - HTTP 요청 객체
 * @param {Object} additionalContext - 추가 컨텍스트
 */
function captureApiError(error, req = {}, additionalContext = {}) {
  try {
    Sentry.withScope((scope) => {
      // 요청 정보 설정
      if (req) {
        scope.setContext('request', {
          method: req.method,
          url: req.url,
          headers: sanitizeHeaders(req.headers),
          query: req.query,
          body: sanitizeBody(req.body),
        });

        // 사용자 정보 (있을 경우)
        if (req.user) {
          scope.setUser({
            id: req.user.id,
            email: req.user.email,
            username: req.user.username,
          });
        }

        // IP 주소
        const ip = req.headers?.['x-forwarded-for'] ||
                   req.headers?.['x-real-ip'] ||
                   req.connection?.remoteAddress;
        if (ip) {
          scope.setTag('ip', ip);
        }
      }

      // 추가 컨텍스트
      if (Object.keys(additionalContext).length > 0) {
        scope.setContext('additional', additionalContext);
      }

      // 에러 캡처
      Sentry.captureException(error);
    });
  } catch (e) {
    console.error('[Sentry Server] Failed to capture API error:', e);
  }
}

/**
 * 헤더 정보 정리 (민감한 정보 제거)
 * @param {Object} headers - HTTP 헤더
 * @returns {Object} 정리된 헤더
 */
function sanitizeHeaders(headers = {}) {
  const sanitized = { ...headers };

  // 민감한 헤더 제거
  const sensitiveHeaders = [
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token',
  ];

  sensitiveHeaders.forEach(header => {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  });

  return sanitized;
}

/**
 * Body 정보 정리 (민감한 정보 제거)
 * @param {Object} body - HTTP body
 * @returns {Object} 정리된 body
 */
function sanitizeBody(body = {}) {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };

  // 민감한 필드 제거
  const sensitiveFields = [
    'password',
    'password_confirmation',
    'current_password',
    'new_password',
    'api_key',
    'secret',
    'token',
    'access_token',
    'refresh_token',
    'credit_card',
    'card_number',
    'cvv',
    'ssn',
  ];

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });

  return sanitized;
}

/**
 * API 핸들러 래퍼 (try-catch + Sentry)
 * @param {Function} handler - API 핸들러 함수
 * @returns {Function} 래핑된 핸들러
 */
function wrapApiHandler(handler) {
  return async (req, res) => {
    try {
      // 핸들러 실행
      return await handler(req, res);
    } catch (error) {
      // 에러 캡처
      captureApiError(error, req);

      // 에러 응답
      const statusCode = error.statusCode || error.status || 500;
      const message = process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : error.message;

      res.status(statusCode).json({
        success: false,
        error: {
          message,
          code: error.code || 'INTERNAL_ERROR',
        },
      });
    }
  };
}

/**
 * 메시지 캡처
 * @param {string} message - 메시지
 * @param {string} level - 'fatal' | 'error' | 'warning' | 'info' | 'debug'
 * @param {Object} context - 추가 컨텍스트
 */
function captureMessage(message, level = 'info', context = {}) {
  try {
    Sentry.withScope((scope) => {
      if (Object.keys(context).length > 0) {
        scope.setContext('additional', context);
      }

      Sentry.captureMessage(message, level);
    });
  } catch (e) {
    console.error('[Sentry Server] Failed to capture message:', e);
  }
}

/**
 * 사용자 정보 설정
 * @param {Object} user - 사용자 정보
 */
function setUser(user) {
  try {
    Sentry.setUser(user ? {
      id: user.id,
      email: user.email,
      username: user.username,
    } : null);
  } catch (e) {
    console.error('[Sentry Server] Failed to set user:', e);
  }
}

/**
 * 태그 설정
 * @param {Object} tags - 태그 객체
 */
function setTags(tags) {
  try {
    Sentry.setTags(tags);
  } catch (e) {
    console.error('[Sentry Server] Failed to set tags:', e);
  }
}

/**
 * 컨텍스트 설정
 * @param {string} name - 컨텍스트 이름
 * @param {Object} context - 컨텍스트 데이터
 */
function setContext(name, context) {
  try {
    Sentry.setContext(name, context);
  } catch (e) {
    console.error('[Sentry Server] Failed to set context:', e);
  }
}

// 환경변수에서 DSN 읽어서 자동 초기화
if (process.env.SENTRY_DSN) {
  initSentry(process.env.SENTRY_DSN);
}

module.exports = {
  initSentry,
  captureApiError,
  captureMessage,
  wrapApiHandler,
  setUser,
  setTags,
  setContext,
  Sentry, // 원본 Sentry 객체도 export (고급 기능 사용 시)
};
