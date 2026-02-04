/**
 * @task S4BA6
 * 이메일 미리보기 API (개발용)
 * GET /api/email/preview?template=receipt
 */

const { templates } = require('../../lib/email-service');

// 테스트 데이터
const testData = {
    userName: '홍길동',
    amount: 50000,
    bonusAmount: 10000,
    paymentType: 'credit',
    paidAt: '2024-12-19 15:30',
    plan: 'Standard',
    nextBillingDate: '2025-01-19',
    currentBalance: 500,
    creditBalance: 15000,
    depositCode: 'ABC123',
    challengeName: '12월 AI 챌린지',
    progress: 75,
    expiryDate: '2024-12-31',
    rejectionReason: '입금자명이 일치하지 않습니다',
    failureReason: '카드 잔액 부족',
    retryCount: 2,
    verificationUrl: 'https://ssalworks.com/verify?token=xxx',
    bankInfo: '국민은행 ***-**-1234',
    expectedDate: '2024-12-23'
};

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 개발 환경에서만 허용
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not available in production' });
    }

    const { template } = req.query;

    if (!template) {
        return res.status(200).json({
            available_templates: Object.keys(templates),
            usage: '/api/email/preview?template=receipt'
        });
    }

    const templateFn = templates[template];
    if (!templateFn) {
        return res.status(404).json({
            error: 'Template not found',
            available: Object.keys(templates)
        });
    }

    const { html, subject, text } = templateFn(testData);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
};
