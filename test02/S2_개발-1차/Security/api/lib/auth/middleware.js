// ================================================================
// S2S1: 인증 미들웨어
// ================================================================
// Task ID: S2S1
// 작성일: 2025-12-14
// 목적: Serverless API용 인증 미들웨어 및 토큰 검증
// ================================================================

const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 (Service Role Key 사용 - 서버에서만!)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * 인증 토큰 검증
 * @param {Object} req - Request 객체
 * @returns {Object} { user, error }
 */
async function verifyAuth(req) {
  const authHeader = req.headers.authorization;

  // Authorization 헤더 확인
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      user: null,
      error: { code: 'AUTH_001', message: 'No token provided' }
    };
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Supabase에서 토큰 검증 및 사용자 정보 조회
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      // 토큰 만료 체크
      if (error.message.includes('expired')) {
        return {
          user: null,
          error: { code: 'AUTH_003', message: 'Token expired' }
        };
      }
      return {
        user: null,
        error: { code: 'AUTH_002', message: 'Invalid token' }
      };
    }

    if (!user) {
      return {
        user: null,
        error: { code: 'AUTH_002', message: 'Invalid token' }
      };
    }

    // 사용자 정보 반환
    return { user, error: null };

  } catch (err) {
    console.error('Auth verification error:', err);
    return {
      user: null,
      error: { code: 'AUTH_500', message: 'Authentication service error' }
    };
  }
}

/**
 * 사용자 프로필 조회 (추가 정보)
 * @param {string} userId - 사용자 UUID
 * @returns {Object} 사용자 프로필
 */
async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Get user profile error:', error);
    return null;
  }

  return data;
}

module.exports = { verifyAuth, getUserProfile, supabase };
