/**
 * @task S5S2
 * @description API Rate Limiting 모듈
 * 메모리 기반 Rate Limiter (Vercel Serverless 호환)
 * 구현일: 2025-12-30
 */

// 메모리 내 요청 기록 저장소
// 주의: Vercel Serverless에서는 콜드 스타트 시 초기화됨
// 더 안정적인 Rate Limiting을 위해서는 Upstash Redis 사용 권장
const requestStore = new Map();

// 오래된 기록 정리 주기 (5분)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

/**
 * 오래된 요청 기록 정리
 */
function cleanupOldRecords(windowMs) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  const cutoff = now - windowMs * 2;
  for (const [key, records] of requestStore.entries()) {
    const filtered = records.filter(time => time > cutoff);
    if (filtered.length === 0) {
      requestStore.delete(key);
    } else {
      requestStore.set(key, filtered);
    }
  }
  lastCleanup = now;
}

/**
 * Rate Limiter 생성
 * @param {Object} options - 설정
 * @param {number} options.limit - 윈도우 내 최대 요청 수
 * @param {number} options.windowMs - 시간 윈도우 (밀리초)
 * @param {function} options.keyGenerator - 식별자 생성 함수
 */
function createRateLimiter(options = {}) {
  const {
    limit = 60,
    windowMs = 60 * 1000,
    keyGenerator = (req) => getClientIP(req)
  } = options;

  return {
    /**
     * 요청 제한 확인
     * @param {Object} req - HTTP 요청 객체
     * @returns {Object} { success, limit, remaining, reset, retryAfter }
     */
    check: (req) => {
      cleanupOldRecords(windowMs);

      const key = keyGenerator(req);
      const now = Date.now();
      const windowStart = now - windowMs;

      // 현재 윈도우 내 요청 기록 가져오기
      let records = requestStore.get(key) || [];
      records = records.filter(time => time > windowStart);

      const remaining = Math.max(0, limit - records.length);
      const reset = Math.ceil((windowStart + windowMs) / 1000);
      const retryAfter = remaining === 0 ? Math.ceil((records[0] + windowMs - now) / 1000) : 0;

      if (remaining === 0) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset,
          retryAfter
        };
      }

      // 요청 기록 추가
      records.push(now);
      requestStore.set(key, records);

      return {
        success: true,
        limit,
        remaining: remaining - 1,
        reset,
        retryAfter: 0
      };
    },

    /**
     * Rate Limit 헤더 설정
     * @param {Object} res - HTTP 응답 객체
     * @param {Object} result - check() 결과
     */
    setHeaders: (res, result) => {
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.reset);
      if (result.retryAfter > 0) {
        res.setHeader('Retry-After', result.retryAfter);
      }
    }
  };
}

/**
 * 클라이언트 IP 추출
 * Vercel/Cloudflare 프록시 헤더 지원
 */
function getClientIP(req) {
  // Vercel
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  // Cloudflare
  const cfConnectingIP = req.headers['cf-connecting-ip'];
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // 기본
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

/**
 * 사용자 기반 키 생성 (IP + User ID)
 */
function createUserKeyGenerator(userIdExtractor) {
  return (req) => {
    const ip = getClientIP(req);
    const userId = userIdExtractor(req);
    return userId ? `user:${userId}` : `ip:${ip}`;
  };
}

// 미리 정의된 Rate Limiters
const rateLimiters = {
  // AI Q&A API: 30회/분
  aiQA: createRateLimiter({
    limit: 30,
    windowMs: 60 * 1000
  }),

  // 인증 API: 10회/분
  auth: createRateLimiter({
    limit: 10,
    windowMs: 60 * 1000
  }),

  // 일반 API: 100회/분
  general: createRateLimiter({
    limit: 100,
    windowMs: 60 * 1000
  }),

  // 엄격한 제한 (로그인 시도 등): 5회/분
  strict: createRateLimiter({
    limit: 5,
    windowMs: 60 * 1000
  })
};

/**
 * Rate Limit 미들웨어 (Vercel API Routes용)
 * @param {string} type - 'aiQA', 'auth', 'general', 'strict'
 */
function withRateLimit(handler, type = 'general') {
  const limiter = rateLimiters[type] || rateLimiters.general;

  return async (req, res) => {
    const result = limiter.check(req);
    limiter.setHeaders(res, result);

    if (!result.success) {
      return res.status(429).json({
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        retryAfter: result.retryAfter,
        message: `요청 한도를 초과했습니다. ${result.retryAfter}초 후에 다시 시도해주세요.`
      });
    }

    return handler(req, res);
  };
}

/**
 * Rate Limit 체크 함수 (직접 사용)
 * @param {Object} req - HTTP 요청 객체
 * @param {Object} res - HTTP 응답 객체
 * @param {string} type - 'aiQA', 'auth', 'general', 'strict'
 * @returns {Object|null} - 제한 초과 시 에러 객체, 통과 시 null
 */
function checkRateLimit(req, res, type = 'general') {
  const limiter = rateLimiters[type] || rateLimiters.general;
  const result = limiter.check(req);
  limiter.setHeaders(res, result);

  if (!result.success) {
    return {
      status: 429,
      body: {
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        retryAfter: result.retryAfter,
        message: `요청 한도를 초과했습니다. ${result.retryAfter}초 후에 다시 시도해주세요.`
      }
    };
  }

  return null;
}

module.exports = {
  createRateLimiter,
  withRateLimit,
  checkRateLimit,
  getClientIP,
  createUserKeyGenerator,
  rateLimiters
};
