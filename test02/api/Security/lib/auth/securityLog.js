/**
 * Security Event Logging Utility
 * OWASP A09: Security Logging and Monitoring 대응
 *
 * 보안 이벤트를 Supabase security_logs 테이블에 기록
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 (서비스 역할 키 사용)
let supabase = null;

function getSupabase() {
    if (!supabase) {
        supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
    }
    return supabase;
}

/**
 * 보안 이벤트 타입
 */
const SECURITY_EVENTS = {
    // 인증 관련
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGOUT: 'LOGOUT',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    MFA_ENABLED: 'MFA_ENABLED',
    MFA_DISABLED: 'MFA_DISABLED',
    MFA_FAILED: 'MFA_FAILED',

    // 권한 관련
    ACCESS_DENIED: 'ACCESS_DENIED',
    ADMIN_ACTION: 'ADMIN_ACTION',
    ROLE_CHANGE_ATTEMPT: 'ROLE_CHANGE_ATTEMPT',

    // Rate Limit 관련
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

    // 의심스러운 활동
    SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
    MULTIPLE_LOGIN_FAILURES: 'MULTIPLE_LOGIN_FAILURES'
};

/**
 * 보안 이벤트 로깅
 * @param {string} eventType - SECURITY_EVENTS 중 하나
 * @param {Object} details - 이벤트 상세 정보
 * @param {string} details.userId - 사용자 ID (옵션)
 * @param {string} details.email - 이메일 (옵션)
 * @param {string} details.ip - IP 주소
 * @param {string} details.userAgent - User Agent
 * @param {string} details.endpoint - 요청 엔드포인트
 * @param {Object} details.metadata - 추가 정보
 */
async function logSecurityEvent(eventType, details = {}) {
    try {
        const db = getSupabase();

        const logEntry = {
            event_type: eventType,
            user_id: details.userId || null,
            email: details.email || null,
            ip_address: details.ip || 'unknown',
            user_agent: details.userAgent || null,
            endpoint: details.endpoint || null,
            severity: getSeverity(eventType),
            metadata: details.metadata || {},
            created_at: new Date().toISOString()
        };

        // security_logs 테이블에 INSERT
        const { error } = await db
            .from('security_logs')
            .insert(logEntry);

        if (error) {
            // 테이블이 없는 경우 콘솔에만 기록
            console.error('[SecurityLog] DB Error:', error.message);
            console.log('[SecurityLog]', eventType, JSON.stringify(details));
        }

    } catch (err) {
        // 로깅 실패가 메인 로직에 영향을 주면 안 됨
        console.error('[SecurityLog] Error:', err.message);
        console.log('[SecurityLog]', eventType, JSON.stringify(details));
    }
}

/**
 * 이벤트 심각도 결정
 */
function getSeverity(eventType) {
    const severityMap = {
        // Critical
        [SECURITY_EVENTS.ROLE_CHANGE_ATTEMPT]: 'critical',
        [SECURITY_EVENTS.SUSPICIOUS_ACTIVITY]: 'critical',

        // High
        [SECURITY_EVENTS.MULTIPLE_LOGIN_FAILURES]: 'high',
        [SECURITY_EVENTS.ACCESS_DENIED]: 'high',
        [SECURITY_EVENTS.MFA_FAILED]: 'high',

        // Medium
        [SECURITY_EVENTS.LOGIN_FAILED]: 'medium',
        [SECURITY_EVENTS.TOKEN_INVALID]: 'medium',
        [SECURITY_EVENTS.RATE_LIMIT_EXCEEDED]: 'medium',

        // Low
        [SECURITY_EVENTS.LOGIN_SUCCESS]: 'low',
        [SECURITY_EVENTS.LOGOUT]: 'low',
        [SECURITY_EVENTS.TOKEN_EXPIRED]: 'low',
        [SECURITY_EVENTS.MFA_ENABLED]: 'low',
        [SECURITY_EVENTS.MFA_DISABLED]: 'low',
        [SECURITY_EVENTS.ADMIN_ACTION]: 'low'
    };

    return severityMap[eventType] || 'low';
}

/**
 * 요청에서 IP 주소 추출
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.headers['x-real-ip']
        || req.connection?.remoteAddress
        || 'unknown';
}

/**
 * 요청에서 User Agent 추출
 */
function getUserAgent(req) {
    return req.headers['user-agent'] || 'unknown';
}

/**
 * 인증 실패 로깅 헬퍼
 */
async function logAuthFailure(req, email, reason) {
    await logSecurityEvent(SECURITY_EVENTS.LOGIN_FAILED, {
        email,
        ip: getClientIP(req),
        userAgent: getUserAgent(req),
        endpoint: req.url,
        metadata: { reason }
    });
}

/**
 * Rate Limit 초과 로깅 헬퍼
 */
async function logRateLimitExceeded(req, userId, endpoint) {
    await logSecurityEvent(SECURITY_EVENTS.RATE_LIMIT_EXCEEDED, {
        userId,
        ip: getClientIP(req),
        userAgent: getUserAgent(req),
        endpoint,
        metadata: { timestamp: Date.now() }
    });
}

/**
 * 접근 거부 로깅 헬퍼
 */
async function logAccessDenied(req, userId, resource, reason) {
    await logSecurityEvent(SECURITY_EVENTS.ACCESS_DENIED, {
        userId,
        ip: getClientIP(req),
        userAgent: getUserAgent(req),
        endpoint: req.url,
        metadata: { resource, reason }
    });
}

module.exports = {
    SECURITY_EVENTS,
    logSecurityEvent,
    logAuthFailure,
    logRateLimitExceeded,
    logAccessDenied,
    getClientIP,
    getUserAgent
};
