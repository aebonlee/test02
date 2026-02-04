/**
 * @task S4BA3
 * @description 토스페이먼츠 웹훅 수신 API
 * @route POST /api/webhook/toss
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 웹훅 서명 검증
function verifyWebhookSignature(body, signature) {
  const hash = crypto
    .createHmac('sha256', process.env.TOSS_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('base64');

  return hash === signature;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 서명 검증
    const signature = req.headers['toss-signature'];
    if (!signature || !verifyWebhookSignature(req.body, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { eventType, data, createdAt } = req.body;

    // webhook_logs에 저장
    const { error: logError } = await supabase
      .from('webhook_logs')
      .insert({
        provider: 'toss',
        event_type: eventType,
        payload: data,
        received_at: createdAt
      });

    if (logError) {
      console.error('Webhook log error:', logError);
    }

    // 이벤트 타입별 처리
    switch (eventType) {
      case 'PAYMENT_STATUS_CHANGED':
        await handlePaymentStatusChanged(data);
        break;

      case 'BILLING_STATUS_CHANGED':
        await handleBillingStatusChanged(data);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// 결제 상태 변경 처리
async function handlePaymentStatusChanged(data) {
  const { paymentKey, orderId, status } = data;

  console.log(`Payment status changed: ${orderId} -> ${status}`);

  if (status === 'CANCELED' || status === 'PARTIAL_CANCELED') {
    // 크레딧 충전 주문인 경우
    if (orderId.startsWith('credit_')) {
      const userId = orderId.split('_')[1];

      // 환불 처리 로직
      const { data: history, error: historyError } = await supabase
        .from('credit_history')
        .select('amount')
        .eq('transaction_id', paymentKey)
        .eq('type', 'charge')
        .single();

      if (!historyError && history) {
        // 크레딧 차감
        const { data: userData } = await supabase
          .from('users')
          .select('credits')
          .eq('id', userId)
          .single();

        if (userData) {
          const newCredits = Math.max(0, userData.credits - history.amount);

          await supabase
            .from('users')
            .update({ credits: newCredits })
            .eq('id', userId);

          // 환불 기록
          await supabase
            .from('credit_history')
            .insert({
              user_id: userId,
              amount: -history.amount,
              type: 'refund',
              description: '결제 취소 - 크레딧 환불',
              balance_after: newCredits,
              payment_method: 'toss',
              transaction_id: paymentKey
            });
        }
      }
    }
  }
}

// 빌링 상태 변경 처리
async function handleBillingStatusChanged(data) {
  const { billingKey, status } = data;

  console.log(`Billing status changed: ${billingKey} -> ${status}`);

  if (status === 'DELETED' || status === 'EXPIRED') {
    // payment_methods 상태 업데이트
    await supabase
      .from('payment_methods')
      .update({ status: 'inactive' })
      .eq('billing_key', billingKey);

    // 해당 빌링키를 사용하는 구독 찾기
    const { data: paymentMethod } = await supabase
      .from('payment_methods')
      .select('user_id')
      .eq('billing_key', billingKey)
      .single();

    if (paymentMethod) {
      // 구독 상태를 payment_method_expired로 변경
      await supabase
        .from('subscriptions')
        .update({ status: 'payment_method_expired' })
        .eq('user_id', paymentMethod.user_id)
        .eq('status', 'active');
    }
  }
}
