// Task ID: S2BA2
// ================================================================
// S2BA2: 환영 이메일 발송 API
// ================================================================
// 작성일: 2025-12-14
// 목적: 신규 가입자에게 환영 이메일 발송
// ================================================================

const { verifyAuth } = require('../Security/lib/auth/middleware');
const { sendWelcomeEmail } = require('../Backend_Infrastructure/email');

/**
 * 환영 이메일 발송 API
 * @method POST
 * @auth Bearer Token (Required)
 * @body {string} to - 수신자 이메일
 * @body {string} name - 사용자 이름
 * @body {string} [dashboardUrl] - 대시보드 URL (선택)
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
  // 2. 인증 토큰 검증
  // ================================================================
  const { user, error: authError } = await verifyAuth(req);

  if (authError) {
    return res.status(401).json({
      error: authError
    });
  }

  // ================================================================
  // 3. 요청 데이터 검증
  // ================================================================
  const { to, name, dashboardUrl } = req.body;

  // 필수 필드 검증
  if (!to || !name) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: to, name'
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

  // ================================================================
  // 4. 환영 이메일 발송
  // ================================================================
  try {
    const result = await sendWelcomeEmail(to, {
      name,
      email: to,
      dashboardUrl: dashboardUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
    });

    // 발송 성공
    if (result.success) {
      return res.status(200).json({
        success: true,
        data: {
          id: result.data.id,
          to,
          name
        },
        message: 'Welcome email sent successfully'
      });
    }

    // 발송 실패
    return res.status(500).json({
      error: {
        code: 'EMAIL_SEND_ERROR',
        message: result.error || 'Failed to send welcome email'
      }
    });

  } catch (error) {
    console.error('Welcome email send error:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while sending welcome email'
      }
    });
  }
};
