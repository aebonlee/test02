/**
 * @task S4BA
 * @description 빌더 계정 개설 완료 이메일 발송 API
 *
 * POST /api/Backend_APIs/builder-welcome
 * Body: { email, name, builderId, welcomeCredit }
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // CORS
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
        const { email, name, builderId, welcomeCredit = 50000 } = req.body;

        if (!email || !builderId) {
            return res.status(400).json({ error: 'email and builderId are required' });
        }

        const userName = name || email.split('@')[0];

        const html = `
            <div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6B5CC4; margin: 0;">🎉 빌더 계정 개설 완료!</h1>
                </div>

                <div style="background: linear-gradient(135deg, #6B5CC4 0%, #8B7DD4 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 16px;">안녕하세요, <strong>${userName}</strong>님!</p>
                    <p style="margin: 0; font-size: 18px;">SSAL Works 빌더 계정이 개설되었습니다.</p>
                </div>

                <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #333; margin: 0 0 20px 0; border-bottom: 2px solid #6B5CC4; padding-bottom: 10px;">📋 계정 정보</h3>

                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">빌더 계정 ID</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">
                                <strong style="color: #6B5CC4; font-size: 18px; font-family: monospace;">${builderId}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">웰컴 크레딧</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">
                                <strong style="color: #28a745; font-size: 18px;">₩${welcomeCredit.toLocaleString()}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; color: #666;">개설일</td>
                            <td style="padding: 12px 0; text-align: right;">
                                <strong>${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                    <h4 style="margin: 0 0 10px 0; color: #856404;">💡 이용 안내</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #856404;">
                        <li style="margin-bottom: 8px;">웰컴 크레딧은 AI 서비스 이용에 사용됩니다.</li>
                        <li style="margin-bottom: 8px;">빌더 전용 기능이 활성화되었습니다.</li>
                        <li>개설비 입금 후 3개월간 플랫폼 이용료가 면제됩니다.</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://www.ssalworks.ai.kr"
                       style="display: inline-block; background: #6B5CC4; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                        SSAL Works 시작하기
                    </a>
                </div>

                <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0 0 5px 0;">본 메일은 발신 전용이며 회신되지 않습니다.</p>
                    <p style="margin: 0;">문의사항은 대시보드 내 'Sunny에게 질문하기'를 이용해주세요.</p>
                    <p style="margin: 10px 0 0 0; color: #6B5CC4;">© 2025 SSAL Works. All rights reserved.</p>
                </div>
            </div>
        `;

        // 이메일 발송
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'SSAL Works <noreply@ssalworks.ai.kr>',
            to: email,
            subject: `🎉 [SSAL Works] 빌더 계정 개설 완료 - ${builderId}`,
            html: html
        });

        if (emailError) {
            console.error('Builder welcome email error:', emailError);
            return res.status(500).json({ error: 'Failed to send email', details: emailError });
        }

        return res.status(200).json({
            success: true,
            emailId: emailData?.id,
            to: email,
            builderId: builderId
        });

    } catch (error) {
        console.error('Builder welcome email error:', error);
        return res.status(500).json({ error: error.message });
    }
}
