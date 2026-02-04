/**
 * CORS Configuration Utility
 * OWASP A05: Security Misconfiguration 대응
 *
 * 허용된 도메인만 CORS 허용
 */

// 허용된 도메인 목록
const ALLOWED_ORIGINS = [
    'https://ssalworks.com',
    'https://www.ssalworks.com',
    'https://ssalworks.ai.kr',
    'https://www.ssalworks.ai.kr',
    'https://ssal-works.vercel.app',
    // 개발 환경
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500'
];

/**
 * CORS 헤더 설정
 * @param {Object} req - Request 객체
 * @param {Object} res - Response 객체
 * @returns {boolean} - Preflight 요청인 경우 true
 */
function setCorsHeaders(req, res) {
    const origin = req.headers.origin;

    // 허용된 origin인지 확인
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (process.env.NODE_ENV === 'development') {
        // 개발 환경에서는 모든 origin 허용
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    // 허용되지 않은 origin은 CORS 헤더를 설정하지 않음

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24시간 캐시

    // Preflight 요청 처리
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }

    return false;
}

/**
 * CORS 미들웨어 (간단한 버전)
 * @param {Object} res - Response 객체
 * @param {string} origin - 요청 origin
 */
function setSimpleCors(res, origin) {
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (process.env.NODE_ENV === 'development') {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// CommonJS export
module.exports = {
    setCorsHeaders,
    setSimpleCors,
    ALLOWED_ORIGINS
};

// ESM named exports (for import { setCorsHeaders } from ...)
module.exports.setCorsHeaders = setCorsHeaders;
module.exports.setSimpleCors = setSimpleCors;
module.exports.ALLOWED_ORIGINS = ALLOWED_ORIGINS;
