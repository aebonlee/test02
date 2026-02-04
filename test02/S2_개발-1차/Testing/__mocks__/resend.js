// ================================================================
// S2T1: Resend Mock
// ================================================================
// Task ID: S2T1
// 작성일: 2025-12-14
// 목적: Resend 이메일 클라이언트 모킹
// ================================================================

class MockResend {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.emails = {
      send: jest.fn(async (emailData) => {
        // 이메일 필드 검증
        if (!emailData.to || !emailData.from || !emailData.subject || !emailData.html) {
          throw new Error('Missing required email fields');
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailData.to)) {
          throw new Error('Invalid email format');
        }

        // 성공 응답
        return {
          data: {
            id: `mock-email-id-${Date.now()}`,
            from: emailData.from,
            to: emailData.to,
            created_at: new Date().toISOString()
          },
          error: null
        };
      })
    };
  }
}

// Resend 생성자 모킹
const Resend = jest.fn((apiKey) => {
  return new MockResend(apiKey);
});

module.exports = { Resend };
