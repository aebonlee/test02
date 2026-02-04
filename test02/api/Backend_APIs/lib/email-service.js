/**
 * @task S4BA6
 * 이메일 서비스 (Resend API 사용)
 */

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'SSALWorks <noreply@ssalworks.com>';
const SUPPORT_EMAIL = 'support@ssalworks.com';

// 기본 템플릿 레이아웃
function baseLayout(content, previewText = '') {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSALWorks</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Pretendard', Arial, sans-serif;">
    ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ''}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 40px; border-bottom: 1px solid #eee;">
                            <img src="https://ssalworks.com/logo.png" alt="SSALWorks" height="32" style="display: block;">
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8f9fa; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                            <p style="margin: 0 0 8px 0;">© 2024 SSALWorks. All rights reserved.</p>
                            <p style="margin: 0;">문의사항이 있으시면 <a href="mailto:${SUPPORT_EMAIL}" style="color: #007bff;">고객센터</a>로 연락해주세요.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// 버튼 컴포넌트
function buttonComponent(text, url, color = '#007bff') {
    return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
    <tr>
        <td style="border-radius: 4px; background-color: ${color};">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: 600;">
                ${text}
            </a>
        </td>
    </tr>
</table>`;
}

// 이메일 템플릿 객체
const templates = {
    // 결제 영수증
    receipt: (data) => ({
        subject: '[SSALWorks] 결제 영수증',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #333;">결제가 완료되었습니다</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                안녕하세요, ${data.userName}님.<br>
                SSALWorks 결제가 정상적으로 완료되었습니다.
            </p>

            <table role="presentation" width="100%" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <tr>
                    <td style="padding: 8px 0; color: #666;">결제 유형</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.paymentType === 'installation_fee' ? '빌더 계정 개설비' : 'AI 크레딧 충전'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;">결제 금액</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.amount.toLocaleString()}원</td>
                </tr>
                ${data.bonusAmount ? `
                <tr>
                    <td style="padding: 8px 0; color: #666;">보너스 크레딧</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #28a745;">+${data.bonusAmount.toLocaleString()}C</td>
                </tr>
                ` : ''}
                <tr>
                    <td style="padding: 8px 0; color: #666;">결제일시</td>
                    <td style="padding: 8px 0; text-align: right;">${data.paidAt}</td>
                </tr>
            </table>

            ${buttonComponent('서비스 이용하기', 'https://ssalworks.com/dashboard')}

            <p style="margin: 0; font-size: 12px; color: #999;">
                결제 내역에 문제가 있으시면 고객센터로 연락해주세요.
            </p>
        `, `결제가 완료되었습니다. 금액: ${data.amount.toLocaleString()}원`),
        text: `[SSALWorks] 결제 영수증\n\n${data.userName}님, 결제가 완료되었습니다.\n결제유형: ${data.paymentType}\n금액: ${data.amount.toLocaleString()}원\n결제일시: ${data.paidAt}`
    }),

    // 월 구독료 결제 완료
    'billing-success': (data) => ({
        subject: '[SSALWorks] 월 구독료 결제 완료',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #333;">구독료 결제가 완료되었습니다</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, 이번 달 구독료가 정상 결제되었습니다.
            </p>

            <table role="presentation" width="100%" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
                <tr>
                    <td style="padding: 8px 0; color: #666;">구독 플랜</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.plan}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;">결제 금액</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.amount.toLocaleString()}원</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;">다음 결제일</td>
                    <td style="padding: 8px 0; text-align: right;">${data.nextBillingDate}</td>
                </tr>
            </table>
        `, `구독료 ${data.amount.toLocaleString()}원이 결제되었습니다.`),
        text: `[SSALWorks] 월 구독료 결제 완료\n\n${data.userName}님, 구독료 ${data.amount.toLocaleString()}원이 결제되었습니다.\n다음 결제일: ${data.nextBillingDate}`
    }),

    // 결제 실패
    'payment-failure': (data) => ({
        subject: '[SSALWorks] 결제 실패 안내',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #dc3545;">결제에 실패했습니다</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, 결제 처리 중 문제가 발생했습니다.
            </p>

            <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #856404;">
                    <strong>실패 사유:</strong> ${data.failureReason || '카드 정보를 확인해주세요'}
                </p>
            </div>

            <p style="color: #666; line-height: 1.6;">
                결제 수단을 확인하시고 다시 시도해주세요.<br>
                ${data.retryCount >= 2 ? '<strong style="color: #dc3545;">3회 연속 실패 시 구독이 정지됩니다.</strong>' : ''}
            </p>

            ${buttonComponent('결제 수단 변경', 'https://ssalworks.com/settings/payment', '#dc3545')}
        `, `결제에 실패했습니다. 결제 수단을 확인해주세요.`),
        text: `[SSALWorks] 결제 실패 안내\n\n${data.userName}님, 결제에 실패했습니다.\n사유: ${data.failureReason}\n\n결제 수단을 확인해주세요.`
    }),

    // 입금 확인 불가 (거부)
    'payment-rejected': (data) => ({
        subject: '[SSALWorks] 입금 확인 불가 안내',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #dc3545;">입금을 확인할 수 없습니다</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, 입금 요청을 확인하지 못했습니다.
            </p>

            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #721c24;">
                    <strong>사유:</strong> ${data.rejectionReason}
                </p>
            </div>

            <table role="presentation" width="100%" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
                <tr>
                    <td style="padding: 8px 0; color: #666;">요청 금액</td>
                    <td style="padding: 8px 0; text-align: right;">${data.amount.toLocaleString()}원</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;">입금 코드</td>
                    <td style="padding: 8px 0; text-align: right;">${data.depositCode}</td>
                </tr>
            </table>

            <p style="margin-top: 24px; color: #666;">
                입금하셨다면 고객센터로 연락해주세요.
            </p>

            ${buttonComponent('고객센터 문의', 'mailto:support@ssalworks.com')}
        `),
        text: `[SSALWorks] 입금 확인 불가\n\n${data.userName}님, 입금을 확인할 수 없습니다.\n사유: ${data.rejectionReason}\n\n문의: support@ssalworks.com`
    }),

    // 환불 완료
    'refund-complete': (data) => ({
        subject: '[SSALWorks] 환불이 완료되었습니다',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #333;">환불이 완료되었습니다</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, 요청하신 환불이 처리되었습니다.
            </p>

            <table role="presentation" width="100%" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
                <tr>
                    <td style="padding: 8px 0; color: #666;">환불 금액</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.amount.toLocaleString()}원</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;">환불 계좌</td>
                    <td style="padding: 8px 0; text-align: right;">${data.bankInfo}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;">예상 입금일</td>
                    <td style="padding: 8px 0; text-align: right;">${data.expectedDate}</td>
                </tr>
            </table>
        `),
        text: `[SSALWorks] 환불 완료\n\n환불금액: ${data.amount.toLocaleString()}원\n예상 입금일: ${data.expectedDate}`
    }),

    // 크레딧 부족
    'low-credit': (data) => ({
        subject: '크레딧이 부족합니다',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #ff9800;">크레딧이 부족합니다</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, 현재 크레딧 잔액이 ${data.currentBalance.toLocaleString()}C입니다.<br>
                AI 기능을 원활하게 사용하시려면 크레딧을 충전해주세요.
            </p>

            <div style="background-color: #fff3e0; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #e65100;">현재 잔액</p>
                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #e65100;">${data.currentBalance.toLocaleString()}C</p>
            </div>

            ${buttonComponent('크레딧 충전하기', 'https://ssalworks.com/credit/purchase', '#ff9800')}
        `, `크레딧 잔액이 ${data.currentBalance.toLocaleString()}C입니다. 충전해주세요.`),
        text: `크레딧 부족 안내\n\n현재 잔액: ${data.currentBalance.toLocaleString()}C\n충전: https://ssalworks.com/credit/purchase`
    }),

    // 새 기능 소개 (7일 미로그인, 잔액 충분)
    'feature-intro': (data) => ({
        subject: '새로운 AI 기능을 사용해보세요',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #333;">새로운 AI 기능이 기다리고 있어요!</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, 오랜만이에요! 👋<br>
                SSALWorks에 새로운 AI 기능이 추가되었습니다.
            </p>

            <div style="background-color: #e3f2fd; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; color: #1565c0;">🚀 새로운 기능</h3>
                <ul style="margin: 0; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 8px;">AI 자동 분석 리포트</li>
                    <li style="margin-bottom: 8px;">음성으로 질문하기</li>
                    <li>더 빠른 응답 속도</li>
                </ul>
            </div>

            <p style="color: #666;">
                현재 <strong>${data.creditBalance.toLocaleString()}C</strong>의 크레딧이 있습니다.
            </p>

            ${buttonComponent('지금 사용해보기', 'https://ssalworks.com/ai-qa')}
        `),
        text: `새로운 AI 기능이 추가되었습니다!\n\n${data.userName}님, SSALWorks에 새 기능이 있어요.\n지금 확인해보세요: https://ssalworks.com/ai-qa`
    }),

    // 크레딧 충전 유도 (7일 미로그인, 잔액 부족)
    'recharge': (data) => ({
        subject: '크레딧을 충전하고 AI 기능을 이용하세요',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #333;">AI 기능이 기다리고 있어요!</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, 크레딧을 충전하고<br>
                SSALWorks AI 기능을 마음껏 사용해보세요.
            </p>

            <div style="background-color: #e8f5e9; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #2e7d32;">💰 지금 충전하면</p>
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #2e7d32;">최대 25% 보너스!</p>
            </div>

            <table role="presentation" width="100%" style="margin-bottom: 24px;">
                <tr>
                    <td style="padding: 8px; text-align: center; background: #f5f5f5; border-radius: 4px;">1만원<br><small>+10%</small></td>
                    <td style="padding: 8px; text-align: center; background: #f5f5f5; border-radius: 4px;">3만원<br><small>+15%</small></td>
                    <td style="padding: 8px; text-align: center; background: #f5f5f5; border-radius: 4px;">5만원<br><small>+20%</small></td>
                    <td style="padding: 8px; text-align: center; background: #4caf50; color: white; border-radius: 4px; font-weight: bold;">10만원<br><small>+25%</small></td>
                </tr>
            </table>

            ${buttonComponent('크레딧 충전하기', 'https://ssalworks.com/credit/purchase', '#4caf50')}
        `),
        text: `크레딧 충전 안내\n\n${data.userName}님, 크레딧을 충전하고 AI 기능을 이용해보세요.\n최대 25% 보너스!\n\n충전: https://ssalworks.com/credit/purchase`
    }),

    // 구독 정지
    'subscription-suspended': (data) => ({
        subject: '[SSALWorks] 구독이 정지되었습니다',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #dc3545;">구독이 정지되었습니다</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, 결제 실패가 3회 연속되어<br>
                구독 서비스가 정지되었습니다.
            </p>

            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #721c24;">
                    서비스를 계속 이용하시려면 결제 수단을 업데이트해주세요.
                </p>
            </div>

            <p style="color: #666; line-height: 1.6;">
                정지일로부터 30일 이내에 결제 수단을 업데이트하시면<br>
                서비스가 자동으로 재개됩니다.
            </p>

            ${buttonComponent('결제 수단 업데이트', 'https://ssalworks.com/settings/payment', '#dc3545')}
        `),
        text: `[SSALWorks] 구독 정지\n\n결제 실패로 구독이 정지되었습니다.\n결제 수단을 업데이트해주세요.\n\nhttps://ssalworks.com/settings/payment`
    }),

    // 이메일 인증 리마인더
    'verify-email-reminder': (data) => ({
        subject: '이메일 인증을 완료해주세요',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #333;">이메일 인증이 필요합니다</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, SSALWorks 가입을 환영합니다! 🎉<br>
                서비스를 정상적으로 이용하시려면 이메일 인증이 필요합니다.
            </p>

            <div style="background-color: #fff3cd; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #856404;">
                    ⚠️ 24시간 내에 인증하지 않으면 일부 기능이 제한됩니다.
                </p>
            </div>

            ${buttonComponent('이메일 인증하기', data.verificationUrl)}
        `),
        text: `이메일 인증 필요\n\n${data.userName}님, 이메일 인증을 완료해주세요.\n인증 링크: ${data.verificationUrl}`
    }),

    // 프로젝트 등록 리마인더
    'project-registration-reminder': (data) => ({
        subject: '첫 프로젝트를 등록해보세요',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #333;">첫 프로젝트를 시작해보세요!</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, SSALWorks에서 첫 프로젝트를 만들어보세요.<br>
                AI가 프로젝트 관리를 도와드릴게요.
            </p>

            <div style="background-color: #e3f2fd; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; color: #1565c0;">✨ 프로젝트를 만들면</h3>
                <ul style="margin: 0; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 8px;">AI가 업무를 자동 분류</li>
                    <li style="margin-bottom: 8px;">진행 상황 자동 리포트</li>
                    <li>팀원과 쉽게 협업</li>
                </ul>
            </div>

            ${buttonComponent('프로젝트 만들기', 'https://ssalworks.com/projects/new')}
        `),
        text: `첫 프로젝트를 시작해보세요!\n\n${data.userName}님, SSALWorks에서 프로젝트를 만들어보세요.\n\nhttps://ssalworks.com/projects/new`
    }),

    // 7일차 리마인더
    'day7-reminder': (data) => ({
        subject: '3개월 무료는 지금이 기회!',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #333;">SSALWorks 7일차! 🎊</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, SSALWorks와 함께한 지 일주일이 되었어요!<br>
                지금 설치비를 납부하시면 3개월 무료 혜택을 받으실 수 있습니다.
            </p>

            <div style="background-color: #fce4ec; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #c2185b;">🎁 특별 혜택</p>
                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #c2185b;">3개월 무료!</p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">+ ₩50,000 웰컴 크레딧</p>
            </div>

            ${buttonComponent('설치비 납부하기', 'https://ssalworks.com/payment/installation', '#c2185b')}
        `),
        text: `SSALWorks 7일차!\n\n${data.userName}님, 지금 설치비를 납부하시면 3개월 무료 + ₩50,000 웰컴 크레딧!\n\nhttps://ssalworks.com/payment/installation`
    }),

    // 챌린지 만료 안내
    'challenge-expiry': (data) => ({
        subject: '[SSALWorks] 챌린지 만료 안내',
        html: baseLayout(`
            <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #ff9800;">챌린지가 만료됩니다</h1>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">
                ${data.userName}님, 참여 중인 챌린지가 이번 달 말에 만료됩니다.
            </p>

            <table role="presentation" width="100%" style="background-color: #fff3e0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <tr>
                    <td style="padding: 8px 0; color: #e65100; font-weight: 600;">챌린지명</td>
                    <td style="padding: 8px 0; text-align: right;">${data.challengeName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #e65100; font-weight: 600;">현재 진행률</td>
                    <td style="padding: 8px 0; text-align: right;">${data.progress}%</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #e65100; font-weight: 600;">만료일</td>
                    <td style="padding: 8px 0; text-align: right;">${data.expiryDate}</td>
                </tr>
            </table>

            ${buttonComponent('챌린지 확인하기', 'https://ssalworks.com/challenges', '#ff9800')}
        `),
        text: `챌린지 만료 안내\n\n${data.challengeName} 챌린지가 ${data.expiryDate}에 만료됩니다.\n현재 진행률: ${data.progress}%`
    })
};

// 이메일 발송 함수
async function sendEmail(templateId, to, data) {
    const template = templates[templateId];
    if (!template) {
        throw new Error(`Unknown template: ${templateId}`);
    }

    const { subject, html, text } = template(data);

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
            text
        });

        console.log(`Email sent: ${templateId} to ${to}`);
        return result;
    } catch (error) {
        console.error(`Email send error: ${templateId}`, error);
        throw error;
    }
}

module.exports = {
    sendEmail,
    templates,
    baseLayout,
    buttonComponent
};
