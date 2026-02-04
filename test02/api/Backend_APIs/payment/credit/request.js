/**
 * @task S4BA3
 * @description 크레딧 충전 요청 API
 * @route POST /api/payment/credit/request
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CREDIT_OPTIONS = [10000, 20000, 30000, 50000];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 사용자 인증 확인
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { amount } = req.body;

    // 충전 금액 검증
    if (!amount || !CREDIT_OPTIONS.includes(amount)) {
      return res.status(400).json({
        error: 'Invalid amount',
        validOptions: CREDIT_OPTIONS
      });
    }

    // 주문 ID 생성
    const orderId = `credit_${user.id}_${Date.now()}`;
    const orderName = `크레딧 ${amount.toLocaleString()}원 충전`;

    // 토스 결제 정보 반환
    const paymentData = {
      amount,
      orderId,
      orderName,
      customerEmail: user.email,
      customerName: user.user_metadata?.full_name || user.email.split('@')[0],
      successUrl: `${process.env.SITE_URL}/api/payment/credit/success`,
      failUrl: `${process.env.SITE_URL}/api/payment/credit/fail`,
    };

    return res.status(200).json({
      success: true,
      payment: paymentData,
      clientKey: process.env.TOSS_CLIENT_KEY
    });

  } catch (error) {
    console.error('Credit request error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
