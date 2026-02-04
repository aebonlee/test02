/**
 * @task S4BA
 * @description 관리자 알림 이메일 API
 *
 * POST /api/Backend_APIs/admin-notify
 * Body: { type: 'inquiry' | 'payment' | 'signup' | 'installation_request', data: {...} }
 */

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://zwjmfewyshhwpgwdtrus.supabase.co',
    process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzE1NTEsImV4cCI6MjA3OTE0NzU1MX0.AJy34h5VR8QS6WFEcUcBeJJu8I3bBQ6UCk1I84Wb7y4'
);

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
        const { type, data } = req.body;

        if (!type) {
            return res.status(400).json({ error: 'type is required' });
        }

        // 설정에서 알림 여부 및 관리자 이메일 확인
        const { data: settings, error: settingsError } = await supabase
            .from('admin_settings')
            .select('*')
            .single();

        if (settingsError || !settings) {
            return res.status(500).json({ error: 'Failed to load settings' });
        }

        const adminEmail = settings.admin_email;
        if (!adminEmail) {
            return res.status(400).json({ error: 'Admin email not configured' });
        }

        // 알림 타입별 처리
        let shouldSend = false;
        let subject = '';
        let html = '';

        switch (type) {
            case 'inquiry':
                shouldSend = settings.notify_inquiry;
                subject = '[SSAL Works] 새 문의가 접수되었습니다';
                html = `
                    <div style="font-family: 'Pretendard', sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #6B5CC4;">📨 새 문의 접수</h2>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>작성자:</strong> ${data.email || '-'}</p>
                            <p><strong>카테고리:</strong> ${data.category || '-'}</p>
                            <p><strong>제목:</strong> ${data.title || '-'}</p>
                            <p><strong>내용:</strong></p>
                            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 8px;">
                                ${data.content || '-'}
                            </div>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            <a href="https://www.ssalworks.ai.kr/pages/admin-dashboard.html" style="color: #6B5CC4;">관리자 대시보드에서 확인하기</a>
                        </p>
                    </div>
                `;
                break;

            case 'payment':
                shouldSend = settings.notify_payment;
                subject = '[SSAL Works] 결제가 완료되었습니다';
                html = `
                    <div style="font-family: 'Pretendard', sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #28a745;">💰 결제 완료</h2>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>사용자:</strong> ${data.email || '-'}</p>
                            <p><strong>결제 유형:</strong> ${data.type || '-'}</p>
                            <p><strong>금액:</strong> ₩${(data.amount || 0).toLocaleString()}</p>
                            <p><strong>결제 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            <a href="https://www.ssalworks.ai.kr/pages/admin-dashboard.html" style="color: #6B5CC4;">관리자 대시보드에서 확인하기</a>
                        </p>
                    </div>
                `;
                break;

            case 'signup':
                shouldSend = settings.notify_signup;
                subject = '[SSAL Works] 새 사용자가 가입했습니다';
                html = `
                    <div style="font-family: 'Pretendard', sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #6B5CC4;">👤 신규 가입</h2>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>이메일:</strong> ${data.email || '-'}</p>
                            <p><strong>닉네임:</strong> ${data.nickname || '-'}</p>
                            <p><strong>실명:</strong> ${data.real_name || '-'}</p>
                            <p><strong>가입 방법:</strong> ${data.provider || 'Email'}</p>
                            <p><strong>가입 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            <a href="https://www.ssalworks.ai.kr/pages/admin-dashboard.html" style="color: #6B5CC4;">관리자 대시보드에서 확인하기</a>
                        </p>
                    </div>
                `;
                break;

            case 'installation_request':
                shouldSend = settings.notify_installation_request ?? true;
                subject = '[SSAL Works] 빌더 계정 개설비 입금 확인 요청';
                html = `
                    <div style="font-family: 'Pretendard', sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #ff6b35;">🏦 입금 확인 요청</h2>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>사용자:</strong> ${data.email || '-'}</p>
                            <p><strong>입금자명:</strong> ${data.depositor_name || '-'}</p>
                            <p><strong>입금 금액:</strong> ₩${(data.amount || 0).toLocaleString()}</p>
                            <p><strong>요청 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            <a href="https://www.ssalworks.ai.kr/pages/admin-dashboard.html#billing" style="color: #6B5CC4;">관리자 대시보드에서 입금 확인하기</a>
                        </p>
                    </div>
                `;
                break;

            case 'sunny_inquiry':
                shouldSend = settings.notify_sunny_inquiry ?? true;
                subject = '[SSAL Works] ☀️ Sunny에게 새 질문이 도착했습니다';
                html = `
                    <div style="font-family: 'Pretendard', sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #F59E0B;">☀️ Sunny에게 질문하기</h2>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>작성자:</strong> ${data.user_name || '-'} (${data.user_email || '-'})</p>
                            <p><strong>제목:</strong> ${data.title || '-'}</p>
                            <p><strong>내용:</strong></p>
                            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 8px;">
                                ${data.content || '-'}
                            </div>
                            <p><strong>질문 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            <a href="https://www.ssalworks.ai.kr/pages/admin-dashboard.html#sunny-inquiries" style="color: #6B5CC4;">관리자 대시보드에서 답변하기</a>
                        </p>
                    </div>
                `;
                break;

            default:
                return res.status(400).json({ error: 'Invalid notification type' });
        }

        // 알림 설정이 꺼져있으면 전송하지 않음
        if (!shouldSend) {
            return res.status(200).json({
                success: true,
                sent: false,
                reason: 'Notification disabled in settings'
            });
        }

        // 이메일 발송
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'SSAL Works <noreply@ssalworks.ai.kr>',
            to: adminEmail,
            subject: subject,
            html: html
        });

        if (emailError) {
            console.error('Email send error:', emailError);
            return res.status(500).json({ error: 'Failed to send email', details: emailError });
        }

        return res.status(200).json({
            success: true,
            sent: true,
            emailId: emailData?.id
        });

    } catch (error) {
        console.error('Admin notify error:', error);
        return res.status(500).json({ error: error.message });
    }
}
