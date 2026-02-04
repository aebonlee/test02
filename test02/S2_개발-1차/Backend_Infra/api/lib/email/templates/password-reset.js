// S2BI1: 비밀번호 재설정 이메일 템플릿
// 파일 위치: S2_개발-1차/Backend_Infra/api/lib/email/templates/password-reset.js
// 목적: 비밀번호 재설정 요청 시 발송되는 이메일 HTML 템플릿

/**
 * 비밀번호 재설정 이메일 템플릿
 * @param {Object} data - 템플릿 데이터
 * @param {string} data.name - 사용자 이름
 * @param {string} data.resetUrl - 비밀번호 재설정 URL (토큰 포함)
 * @param {number} [data.expiryMinutes=30] - 링크 유효 시간 (분)
 * @returns {string} HTML 이메일 본문
 */
function passwordResetEmailTemplate({ name, resetUrl, expiryMinutes = 30 }) {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>비밀번호 재설정</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #333;
      margin-top: 0;
    }
    .warning-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning-box strong {
      color: #856404;
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid #f5576c;
      padding: 15px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 35px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
      font-size: 16px;
    }
    .security-tips {
      background-color: #e7f3ff;
      border-left: 4px solid #2196f3;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
    }
    .security-tips ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer a {
      color: #f5576c;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 비밀번호 재설정</h1>
    </div>

    <div class="content">
      <h2>안녕하세요, ${name}님</h2>

      <p>
        비밀번호 재설정 요청을 받았습니다.<br>
        아래 버튼을 클릭하여 새로운 비밀번호를 설정해 주세요.
      </p>

      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">비밀번호 재설정하기</a>
      </div>

      <div class="info-box">
        <strong>⏱️ 중요 안내</strong><br>
        이 링크는 <strong>${expiryMinutes}분</strong> 동안만 유효합니다.<br>
        시간이 지나면 새로운 재설정 요청을 해주셔야 합니다.
      </div>

      <div class="warning-box">
        <strong>⚠️ 본인이 요청하지 않았다면?</strong><br>
        이 이메일을 무시하셔도 됩니다. 비밀번호는 변경되지 않습니다.<br>
        계정 보안이 걱정되신다면 즉시 고객센터로 문의해 주세요.
      </div>

      <div class="security-tips">
        <strong>🛡️ 안전한 비밀번호 만들기 팁</strong>
        <ul>
          <li>8자 이상의 길이 사용</li>
          <li>대문자, 소문자, 숫자, 특수문자 조합</li>
          <li>개인정보(이름, 생년월일 등) 사용 금지</li>
          <li>다른 사이트와 동일한 비밀번호 사용 금지</li>
          <li>주기적인 비밀번호 변경 권장</li>
        </ul>
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        버튼이 작동하지 않는 경우, 아래 링크를 복사하여 브라우저 주소창에 붙여넣으세요:
      </p>
      <p style="font-size: 12px; color: #999; word-break: break-all;">
        ${resetUrl}
      </p>
    </div>

    <div class="footer">
      <p>
        본 이메일은 비밀번호 재설정 요청에 따라 자동으로 발송되었습니다.<br>
        문의사항이 있으시면 <a href="#">고객센터</a>로 연락해 주세요.
      </p>
      <p style="margin-top: 10px; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

module.exports = passwordResetEmailTemplate;
