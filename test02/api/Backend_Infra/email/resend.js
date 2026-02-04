// S2BI1: Resend 이메일 서비스 클라이언트
// 파일 위치: Production/Backend_APIs/api/lib/email/resend.js
// 목적: Resend API를 사용한 이메일 발송 기능 구현

const { Resend } = require('resend');

// Resend 클라이언트 초기화
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 이메일 발송 함수
 * @param {Object} emailData - 이메일 데이터
 * @param {string} emailData.to - 수신자 이메일 주소
 * @param {string} emailData.subject - 이메일 제목
 * @param {string} emailData.html - HTML 본문
 * @param {string} [emailData.from] - 발신자 이메일 (기본값: onboarding@resend.dev)
 * @returns {Promise<Object>} Resend API 응답
 */
async function sendEmail({ to, subject, html, from = 'noreply@ssalworks.ai.kr' }) {
  try {
    // 환경 변수 검증
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set in environment variables');
    }

    // 이메일 발송
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    // Resend v2 에러 체크
    if (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Resend API error',
      };
    }

    console.log('Email sent successfully:', data);
    return {
      success: true,
      data: data,  // { id: "..." }
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 템플릿 기반 이메일 발송 함수
 * @param {Object} emailData - 이메일 데이터
 * @param {string} emailData.to - 수신자 이메일 주소
 * @param {string} emailData.subject - 이메일 제목
 * @param {Function} emailData.template - 템플릿 함수
 * @param {Object} emailData.data - 템플릿에 전달할 데이터
 * @param {string} [emailData.from] - 발신자 이메일
 * @returns {Promise<Object>} Resend API 응답
 */
async function sendTemplateEmail({ to, subject, template, data, from = 'noreply@ssalworks.ai.kr' }) {
  try {
    // 템플릿 렌더링
    const html = template(data);

    // 이메일 발송
    return await sendEmail({ to, subject, html, from });
  } catch (error) {
    console.error('Failed to send template email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 이메일 발송 상태 확인
 * @param {string} emailId - Resend 이메일 ID
 * @returns {Promise<Object>} 이메일 상태 정보
 */
async function getEmailStatus(emailId) {
  try {
    const response = await resend.emails.get(emailId);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Failed to get email status:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  resend,
  sendEmail,
  sendTemplateEmail,
  getEmailStatus,
};
