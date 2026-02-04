/**
 * @task S4BA3
 * @description 월 이용료 자동결제 API (Cron 전용)
 * @route POST /api/payment/billing/charge
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MONTHLY_FEE = 9900; // 월 이용료

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // CRON_SECRET 인증
    const cronSecret = req.headers['x-cron-secret'];
    if (cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 결제 대상 사용자 조회 (활성 구독 + 빌링키 있는 사용자)
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        users!inner(*),
        payment_methods!inner(*)
      `)
      .eq('status', 'active')
      .eq('payment_methods.status', 'active')
      .eq('payment_methods.is_default', true);

    if (subError) {
      console.error('Subscription lookup error:', subError);
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No subscriptions to charge',
        charged: 0,
        failed: 0
      });
    }

    const results = {
      charged: 0,
      failed: 0,
      details: []
    };

    // 각 사용자에 대해 자동결제 실행
    for (const subscription of subscriptions) {
      try {
        const userId = subscription.user_id;
        const billingKey = subscription.payment_methods.billing_key;
        const customerKey = subscription.payment_methods.customer_key;

        // 토스 자동결제 API 호출
        const response = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerKey,
            amount: MONTHLY_FEE,
            orderId: `monthly_${userId}_${Date.now()}`,
            orderName: '월 이용료',
            customerEmail: subscription.users.email,
            customerName: subscription.users.email.split('@')[0]
          })
        });

        const paymentData = await response.json();

        if (!response.ok) {
          // 결제 실패
          console.error(`Billing charge failed for user ${userId}:`, paymentData);

          results.failed++;
          results.details.push({
            userId,
            status: 'failed',
            error: paymentData.message || 'Payment failed'
          });

          // 구독 상태를 payment_failed로 변경
          await supabase
            .from('subscriptions')
            .update({ status: 'payment_failed' })
            .eq('id', subscription.id);

          continue;
        }

        // 결제 성공
        results.charged++;
        results.details.push({
          userId,
          status: 'success',
          amount: MONTHLY_FEE,
          transactionId: paymentData.paymentKey
        });

        // payment_history 기록
        await supabase
          .from('payment_history')
          .insert({
            user_id: userId,
            subscription_id: subscription.id,
            amount: MONTHLY_FEE,
            status: 'completed',
            payment_method: 'toss_billing',
            transaction_id: paymentData.paymentKey,
            description: '월 이용료 자동결제'
          });

        // next_billing_date 갱신 (다음 달)
        const nextBillingDate = new Date(subscription.next_billing_date);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

        await supabase
          .from('subscriptions')
          .update({
            next_billing_date: nextBillingDate.toISOString().split('T')[0],
            status: 'active'
          })
          .eq('id', subscription.id);

      } catch (error) {
        console.error(`Error charging user ${subscription.user_id}:`, error);
        results.failed++;
        results.details.push({
          userId: subscription.user_id,
          status: 'error',
          error: error.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      charged: results.charged,
      failed: results.failed,
      total: subscriptions.length,
      details: results.details
    });

  } catch (error) {
    console.error('Billing charge error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
