/**
 * @task S2BA4
 */
// ================================================================
// S2BA4: 이메일 확인 API
// ================================================================
// 작성일: 2025-12-20
// 목적: 회원가입 후 이메일 인증 토큰 처리
// ================================================================

const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 (Service Role Key 사용)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * 이메일 확인 API
 * @method POST
 * @auth None (Public - uses token)
 * @body {string} token - 이메일 확인 토큰 (Supabase Auth에서 발급)
 * @body {string} type - 'signup' | 'recovery' | 'invite' | 'email_change'
 * @returns {Object} { success, message }
 */
module.exports = async (req, res) => {
  // ================================================================
  // 1. HTTP 메서드 검증
  // ================================================================
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method is allowed'
      }
    });
  }

  // ================================================================
  // 2. 요청 데이터 검증
  // ================================================================
  const { token, type } = req.body;

  if (!token) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required field: token'
      }
    });
  }

  // type 기본값: signup
  const verifyType = type || 'signup';

  // 허용된 type 검증
  const allowedTypes = ['signup', 'recovery', 'invite', 'email_change'];
  if (!allowedTypes.includes(verifyType)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_TYPE',
        message: `Invalid type. Allowed values: ${allowedTypes.join(', ')}`
      }
    });
  }

  // ================================================================
  // 3. Supabase Auth 토큰 검증
  // ================================================================
  try {
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: verifyType
    });

    if (verifyError) {
      console.error('Email verification error:', verifyError);

      // 토큰 만료 체크
      if (verifyError.message.includes('expired')) {
        return res.status(400).json({
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Verification link has expired. Please request a new one.'
          }
        });
      }

      // 잘못된 토큰
      if (verifyError.message.includes('invalid')) {
        return res.status(400).json({
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid verification link. Please check your email for the correct link.'
          }
        });
      }

      // 기타 에러
      return res.status(400).json({
        error: {
          code: 'VERIFICATION_ERROR',
          message: 'Email verification failed',
          details: verifyError.message
        }
      });
    }

    // 검증 성공했지만 데이터가 없는 경우
    if (!data || !data.user) {
      return res.status(400).json({
        error: {
          code: 'VERIFICATION_ERROR',
          message: 'Email verification failed - no user data returned'
        }
      });
    }

    const userId = data.user.id;
    const userEmail = data.user.email;

    // ================================================================
    // 4. users 테이블 업데이트 (이메일 인증 완료 표시)
    // ================================================================
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('users')
      .update({
        updated_at: now
        // email_verified는 Supabase Auth에서 자동 관리
      })
      .eq('id', userId);

    if (updateError) {
      console.error('User profile update error:', updateError);
      // 업데이트 실패해도 인증은 완료된 상태이므로 경고만 로깅
    }

    // ================================================================
    // 5. 성공 응답
    // ================================================================
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: userId,
        email: userEmail,
        email_verified: true
      }
    });

  } catch (error) {
    console.error('Unexpected email verification error:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred during email verification'
      }
    });
  }
};
