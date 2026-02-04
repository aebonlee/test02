/**
 * @task S4BA-Agreement
 * @description 서약서 이메일 발송 API
 *
 * 서약 완료 시 사용자에게 서약서 사본을 이메일로 발송
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // CORS 헤더
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, userName, builderId, date } = req.body;

        if (!email) {
            return res.status(400).json({ error: '이메일 주소가 필요합니다.' });
        }

        const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; line-height: 1.8; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a3a5c 0%, #0d2137 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 24px; border: 1px solid #dee2e6; }
        .agreement-box { background: white; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #dee2e6; }
        .info-box { border-top: 2px solid #1a3a5c; padding-top: 16px; margin-top: 20px; }
        .footer { background: #1a3a5c; color: white; padding: 16px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">📋 SSAL Works 서약서</h2>
        </div>
        <div class="content">
            <p>안녕하세요, ${userName}님.</p>
            <p>SSAL Works 예시 프로젝트 열람에 대한 서약서 사본입니다.</p>

            <p style="margin: 20px 0;">본인은 SSAL Works 예시 프로젝트의 문서 및 소스 코드 파일을 제공받음에 있어서 아래의 사항을 준수하기로 서약합니다.</p>

            <div class="agreement-box">
                <p><strong>1.</strong> 제공받은 파일은 본인의 프로젝트 개발을 위한 참고자료로만 활용할 것이며, 타인(배우자 및 직계존비속 포함)에게는 제공하지 않을 것입니다. 다만 부득이하게 타인에게 제공을 해야 하는 사유가 발생할 경우에는 사전에 SSAL Works 관리자의 승인을 받을 것입니다.</p>

                <p><strong>2.</strong> 제공받은 파일은 SSAL Works 프로젝트와 유사한 프로젝트를 개발하는데 사용하지 않을 것이며, 부득이하게 그렇게 해야 하는 사유가 발생하는 경우에는 SSAL Works 관리자와 사전 협의를 하여 진행할 것입니다.</p>

                <p style="margin-bottom: 0;"><strong>3.</strong> 제공받은 파일은 Sunny가 500시간 이상의 시간을 투입하여 만든 것으로서, 이것을 활용하여 세상에 도움이 되는 서비스를 효율적으로 신속하게 만들어서 사업화 할 것입니다.</p>
            </div>

            <div class="info-box">
                <p><strong>일자:</strong> ${formattedDate}</p>
                <p><strong>서약자:</strong> ${userName}</p>
                <p><strong>빌더 계정 ID:</strong> ${builderId}</p>
                <p><strong>이메일:</strong> ${email}</p>
            </div>
        </div>
        <div class="footer">
            <p style="margin: 0;">© 2025 SSAL Works. All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>
        `;

        const { data, error } = await resend.emails.send({
            from: 'SSAL Works <noreply@ssalworks.ai.kr>',
            to: email,
            subject: '[SSAL Works] 예시 프로젝트 서약서 사본',
            html: emailHtml,
        });

        if (error) {
            console.error('이메일 발송 오류:', error);
            return res.status(500).json({ error: '이메일 발송 실패', details: error.message });
        }

        return res.status(200).json({ success: true, messageId: data?.id });

    } catch (err) {
        console.error('서버 오류:', err);
        return res.status(500).json({ error: '서버 오류', details: err.message });
    }
}
