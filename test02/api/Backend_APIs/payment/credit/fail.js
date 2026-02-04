/**
 * @task S4BA3
 * @description 크레딧 충전 실패 콜백 API
 * @route GET /api/payment/credit/fail
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, message, orderId } = req.query;

    // 에러 정보 로깅
    console.error('Payment failed:', {
      code,
      message,
      orderId,
      timestamp: new Date().toISOString()
    });

    // 실패 페이지로 리다이렉트
    const errorMessage = message || 'Payment failed';
    return res.redirect(`${process.env.SITE_URL}/payment/fail?message=${encodeURIComponent(errorMessage)}&orderId=${orderId || ''}`);

  } catch (error) {
    console.error('Payment fail handler error:', error);
    return res.redirect(`${process.env.SITE_URL}/payment/fail?message=${encodeURIComponent('An unexpected error occurred')}`);
  }
}
