/**
 * @task S4BA3
 * @description 크레딧 충전 성공 콜백 API
 * @route GET /api/payment/credit/success
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentKey, orderId, amount } = req.query;

    if (!paymentKey || !orderId || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // orderId에서 user_id 추출
    const userId = orderId.split('_')[1];

    // 토스 결제 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: parseInt(amount)
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Toss payment confirm failed:', errorData);
      return res.redirect(`${process.env.SITE_URL}/payment/fail?message=${encodeURIComponent(errorData.message || 'Payment confirmation failed')}`);
    }

    const paymentData = await response.json();

    // 크레딧 충전
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('User lookup error:', userError);
      throw userError;
    }

    const newCredits = (userData.credits || 0) + parseInt(amount);

    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (updateError) {
      console.error('Credit update error:', updateError);
      throw updateError;
    }

    // credit_history 기록
    const { error: historyError } = await supabase
      .from('credit_history')
      .insert({
        user_id: userId,
        amount: parseInt(amount),
        type: 'charge',
        description: '크레딧 충전',
        balance_after: newCredits,
        payment_method: 'toss',
        transaction_id: paymentData.paymentKey
      });

    if (historyError) {
      console.error('History insert error:', historyError);
      // 히스토리 기록 실패는 크리티컬하지 않으므로 계속 진행
    }

    // 성공 페이지로 리다이렉트
    return res.redirect(`${process.env.SITE_URL}/payment/success?amount=${amount}&orderId=${orderId}`);

  } catch (error) {
    console.error('Payment success handler error:', error);
    return res.redirect(`${process.env.SITE_URL}/payment/fail?message=${encodeURIComponent('An error occurred during payment processing')}`);
  }
}
