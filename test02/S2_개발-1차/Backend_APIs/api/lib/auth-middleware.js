/**
 * @task S2BA5
 * 인증 미들웨어 - JWT 토큰 검증
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Authorization 헤더에서 Bearer 토큰을 추출하고 검증
 * @param {Object} req - HTTP 요청 객체
 * @returns {Object|null} 검증된 사용자 정보 또는 null
 */
export async function verifyToken(req) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.substring(7); // 'Bearer ' 이후의 토큰

        // Supabase로 토큰 검증
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('Token verification failed:', error?.message);
            return null;
        }

        return user;
    } catch (error) {
        console.error('Auth middleware error:', error);
        return null;
    }
}

/**
 * 선택적 인증 - 토큰이 있으면 검증, 없으면 null 반환
 * @param {Object} req - HTTP 요청 객체
 * @returns {Object|null} 검증된 사용자 정보 또는 null
 */
export async function optionalAuth(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return null;
    }

    return verifyToken(req);
}

/**
 * 사용자 ID 검증 - 요청된 리소스의 소유자인지 확인
 * @param {string} ownerId - 리소스 소유자 ID
 * @param {string} userId - 현재 사용자 ID
 * @returns {boolean} 소유권 일치 여부
 */
export function verifyOwnership(ownerId, userId) {
    return ownerId === userId;
}
