// Task ID: S2BA2
// ================================================================
// S2BA2: 비밀번호 재설정 이메일 발송 API
// ================================================================
// 작성일: 2025-12-14
// 목적: 비밀번호 재설정 이메일 발송
// ================================================================

const { sendPasswordResetEmail } = require('../Backend_Infra/email');

/**
 * 비밀번호 재설정 이메일 발송 API
 * @method POST
 * @auth 인증 불필요 (비밀번호 분실 사용자용)
 * @body {string} to - 수신자 이메일
 * @body {string} name - 사용자 이름
 * @body {string} resetToken - 재설정 토큰
 * @body {number} [expiryMinutes=30] - 토큰 유효 시간 (분)
 * @returns {Object} { success, data: { id } }
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
  // 비밀번호 재설정 요청은 인증 없이 허용 (사용자가 로그인 못한 상태)
  // Rate limiting은 Vercel Edge에서 처리
  const { to, name, resetToken, expiryMinutes = 30 } = req.body;

  // 필수 필드 검증
  if (!to || !name || !resetToken) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: to, name, resetToken'
      }
    });
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid email format'
      }
    });
  }

  // 토큰 검증 (최소 길이 확인)
  if (resetToken.length < 20) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid reset token format'
      }
    });
  }

  // ================================================================
  // 3. 비밀번호 재설정 이메일 발송
  // ================================================================
  try {
    // 재설정 URL 생성
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ssal-works.vercel.app';
    const resetUrl = `${baseUrl}/pages/auth/reset-password.html?token=${resetToken}`;

    const result = await sendPasswordResetEmail(to, {
      name,
      resetUrl,
      expiryMinutes
    });

    // 발송 성공
    if (result.success) {
      return res.status(200).json({
        success: true,
        data: {
          id: result.data.id,
          to,
          name,
          expiresIn: `${expiryMinutes} minutes`
        },
        message: 'Password reset email sent successfully'
      });
    }

    // 발송 실패
    return res.status(500).json({
      error: {
        code: 'EMAIL_SEND_ERROR',
        message: result.error || 'Failed to send password reset email'
      }
    });

  } catch (error) {
    console.error('Password reset email send error:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while sending password reset email'
      }
    });
  }
};
