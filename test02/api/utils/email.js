/**
 * @task S4O1
 * 이메일 발송 유틸리티
 * S4BA6 이메일 템플릿과 연동
 */

const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 사용자에게 이메일 발송
 * @param {string} userId - 사용자 ID
 * @param {string} templateId - 이메일 템플릿 ID
 * @param {object} data - 템플릿에 전달할 데이터
 * @returns {Promise<boolean>} - 성공 여부
 */
async function sendEmail(userId, templateId, data = {}) {
    try {
        // 사용자 정보 조회
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('email, name')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            console.error('User not found:', userId);
            return false;
        }

        // 이메일 템플릿별 제목 및 내용 설정
        const templates = {
            'subscription-expired': {
                subject: '구독이 만료되었습니다',
                html: `
                    <h2>안녕하세요, ${user.name}님</h2>
                    <p>구독이 만료되었습니다. 계속 이용하시려면 구독을 갱신해주세요.</p>
                    <a href="${process.env.SITE_URL}/subscription">구독 갱신하기</a>
                `
            },
            'subscription-expiry-warning': {
                subject: `구독 만료 ${data.days}일 전 알림`,
                html: `
                    <h2>안녕하세요, ${user.name}님</h2>
                    <p>${data.days}일 후 구독이 만료됩니다. 계속 이용하시려면 구독을 갱신해주세요.</p>
                    <a href="${process.env.SITE_URL}/subscription">구독 관리하기</a>
                `
            },
            'payment-expired': {
                subject: '입금 대기 기간이 만료되었습니다',
                html: `
                    <h2>안녕하세요, ${user.name}님</h2>
                    <p>${data.payment_type} 결제 요청(${data.amount}원)이 7일 경과로 인해 만료되었습니다.</p>
                    <p>다시 결제를 진행하시려면 웹사이트를 방문해주세요.</p>
                    <a href="${process.env.SITE_URL}/payment">결제하기</a>
                `
            },
            'feature-intro': {
                subject: '새로운 기능을 확인해보세요',
                html: `
                    <h2>안녕하세요, ${user.name}님</h2>
                    <p>오랜만입니다! 새로운 기능들이 추가되었습니다.</p>
                    <ul>
                        <li>AI 대화 기능 향상</li>
                        <li>새로운 학습 콘텐츠</li>
                        <li>챌린지 시스템</li>
                    </ul>
                    <a href="${process.env.SITE_URL}">지금 확인하기</a>
                `
            },
            'recharge': {
                subject: '크레딧을 충전해보세요',
                html: `
                    <h2>안녕하세요, ${user.name}님</h2>
                    <p>크레딧 잔액이 부족합니다. 충전하고 계속 이용하세요!</p>
                    <a href="${process.env.SITE_URL}/payment">충전하기</a>
                `
            },
            'challenge-expiry': {
                subject: '챌린지 만료 알림',
                html: `
                    <h2>안녕하세요, ${user.name}님</h2>
                    <p>"${data.challenge_name}" 챌린지가 ${data.end_date}에 만료됩니다.</p>
                    <p>지금 완료하고 보상을 받으세요!</p>
                    <a href="${process.env.SITE_URL}/challenges">챌린지 보기</a>
                `
            }
        };

        const template = templates[templateId];
        if (!template) {
            console.error('Template not found:', templateId);
            return false;
        }

        // Resend를 통해 이메일 발송
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'SSAL Works <noreply@ssalworks.com>',
            to: [user.email],
            subject: template.subject,
            html: template.html
        });

        if (emailError) {
            console.error('Email send error:', emailError);
            return false;
        }

        console.log('Email sent successfully:', emailData);
        return true;

    } catch (error) {
        console.error('sendEmail error:', error);
        return false;
    }
}

module.exports = { sendEmail };
