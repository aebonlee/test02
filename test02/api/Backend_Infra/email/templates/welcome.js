// S2BI1: 환영 이메일 템플릿
// 파일 위치: Production/Backend_APIs/api/lib/email/templates/welcome.js
// 목적: 신규 회원가입 시 발송되는 환영 이메일 HTML 템플릿

/**
 * 환영 이메일 템플릿
 * @param {Object} data - 템플릿 데이터
 * @param {string} data.name - 사용자 이름
 * @param {string} data.email - 사용자 이메일
 * @param {string} [data.dashboardUrl] - 대시보드 URL (선택사항)
 * @returns {string} HTML 이메일 본문
 */
function welcomeEmailTemplate({ name, email, dashboardUrl = '#' }) {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>환영합니다!</title>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    .welcome-message {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 환영합니다!</h1>
    </div>

    <div class="content">
      <h2>안녕하세요, ${name}님!</h2>

      <p class="welcome-message">
        저희 서비스에 가입해 주셔서 진심으로 감사드립니다.<br>
        이제 다양한 기능을 이용하실 수 있습니다.
      </p>

      <div class="info-box">
        <strong>가입 정보</strong><br>
        이메일: ${email}<br>
        가입일: ${new Date().toLocaleDateString('ko-KR')}
      </div>

      <p>
        아래 버튼을 클릭하여 대시보드로 이동하실 수 있습니다.
      </p>

      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="button">대시보드로 이동</a>
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        궁금하신 점이 있으시면 언제든지 문의해 주세요.<br>
        최고의 서비스를 제공하기 위해 노력하겠습니다.
      </p>
    </div>

    <div class="footer">
      <p>
        본 이메일은 회원가입 확인을 위해 자동으로 발송되었습니다.<br>
        <a href="#">개인정보처리방침</a> | <a href="#">서비스 이용약관</a>
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

module.exports = welcomeEmailTemplate;
