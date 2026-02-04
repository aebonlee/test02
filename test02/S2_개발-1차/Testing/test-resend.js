// S2BI1 Resend Email Test Script
// 사용법: RESEND_API_KEY=re_xxx node test-resend.js
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('❌ RESEND_API_KEY 환경변수가 설정되지 않았습니다.');
  console.error('사용법: RESEND_API_KEY=re_xxx node test-resend.js');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function testEmail() {
  console.log('=== Resend Email Test ===');
  console.log('Sending test email...\n');

  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'wksun999@hanmail.net', // Resend 계정 등록 이메일
      subject: 'SSALWorks v1.0 - Resend Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">SSALWorks v1.0</h1>
          <h2>Resend Email Service Test</h2>
          <p>This is a test email to verify Resend integration.</p>
          <hr style="border: 1px solid #eee;">
          <p><strong>Task ID:</strong> S2BI1</p>
          <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Status:</strong> If you received this email, Resend is working correctly!</p>
          <hr style="border: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">Sent via Resend API</p>
        </div>
      `,
    });

    console.log('SUCCESS!');
    console.log('Response:', JSON.stringify(response, null, 2));
    return { success: true, data: response };
  } catch (error) {
    console.log('FAILED!');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

testEmail();
