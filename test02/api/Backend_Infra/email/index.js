// S2BI1: 이메일 서비스 메인 진입점
// 파일 위치: Production/Backend_APIs/api/lib/email/index.js
// 목적: 이메일 관련 모든 기능을 통합하여 내보내기

const { sendEmail, sendTemplateEmail, getEmailStatus, resend } = require('./resend');
const welcomeEmailTemplate = require('./templates/welcome');
const passwordResetEmailTemplate = require('./templates/password-reset');

/**
 * 환영 이메일 발송
 * @param {string} to - 수신자 이메일
 * @param {Object} data - 템플릿 데이터
 * @param {string} data.name - 사용자 이름
 * @param {string} data.email - 사용자 이메일
 * @param {string} [data.dashboardUrl] - 대시보드 URL
 * @returns {Promise<Object>} 발송 결과
 */
async function sendWelcomeEmail(to, data) {
  return sendTemplateEmail({
    to,
    subject: '환영합니다! 가입을 축하드립니다.',
    template: welcomeEmailTemplate,
    data,
  });
}

/**
 * 비밀번호 재설정 이메일 발송
 * @param {string} to - 수신자 이메일
 * @param {Object} data - 템플릿 데이터
 * @param {string} data.name - 사용자 이름
 * @param {string} data.resetUrl - 재설정 URL
 * @param {number} [data.expiryMinutes=30] - 유효 시간
 * @returns {Promise<Object>} 발송 결과
 */
async function sendPasswordResetEmail(to, data) {
  return sendTemplateEmail({
    to,
    subject: '비밀번호 재설정 요청',
    template: passwordResetEmailTemplate,
    data,
  });
}

module.exports = {
  // 기본 함수
  sendEmail,
  sendTemplateEmail,
  getEmailStatus,
  resend,

  // 템플릿
  welcomeEmailTemplate,
  passwordResetEmailTemplate,

  // 헬퍼 함수
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
