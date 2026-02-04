/**
 * @task S4BA3
 * @description 빌링키 발급 API
 * @route POST /api/payment/billing/register
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

    const { authKey, customerKey } = req.body;

    if (!authKey || !customerKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // customerKey가 user_id와 일치하는지 검증
    if (customerKey !== user.id) {
      return res.status(400).json({ error: 'Invalid customer key' });
    }

    // 토스 빌링키 발급 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authKey,
        customerKey
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Billing key issue failed:', errorData);
      return res.status(response.status).json({
        error: 'Billing key issue failed',
        details: errorData
      });
    }

    const billingData = await response.json();

    // payment_methods 테이블에 저장
    const { data: paymentMethod, error: dbError } = await supabase
      .from('payment_methods')
      .insert({
        user_id: user.id,
        provider: 'toss',
        billing_key: billingData.billingKey,
        card_company: billingData.card?.company,
        card_number: billingData.card?.number,
        customer_key: customerKey,
        is_default: true,
        status: 'active'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Payment method save error:', dbError);
      throw dbError;
    }

    // 기존 default 해제
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .neq('id', paymentMethod.id);

    return res.status(200).json({
      success: true,
      billingKey: billingData.billingKey,
      card: {
        company: billingData.card?.company,
        number: billingData.card?.number
      }
    });

  } catch (error) {
    console.error('Billing register error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
