/**
 * @task S4BA3
 * @description 크레딧 충전 옵션 조회 API
 * @route GET /api/payment/credit/options
 * @updated admin_settings에서 credit_price 조회
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 기본 크레딧 단가 (원/크레딧)
const DEFAULT_CREDIT_PRICE = 1;

// 충전 옵션 기본 금액 (원)
const CHARGE_AMOUNTS = [10000, 20000, 30000, 50000];

// 보너스율 (%)
const BONUS_RATES = {
  10000: 0,
  20000: 5,
  30000: 7,
  50000: 10
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // admin_settings에서 credit_price 조회
    let creditPrice = DEFAULT_CREDIT_PRICE;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('credit_price')
        .eq('id', 1)
        .single();

      if (settings && settings.credit_price) {
        creditPrice = settings.credit_price;
      }
    }

    // 충전 옵션 동적 생성
    const options = CHARGE_AMOUNTS.map((amount, index) => {
      const baseCredits = Math.floor(amount / creditPrice);
      const bonusRate = BONUS_RATES[amount] || 0;
      const bonusCredits = Math.floor(baseCredits * bonusRate / 100);
      return {
        amount,
        label: `${amount.toLocaleString()}원`,
        credits: baseCredits,
        bonus: bonusCredits,
        total: baseCredits + bonusCredits,
        recommended: amount === 30000
      };
    });

    return res.status(200).json({
      success: true,
      credit_price: creditPrice,
      credit_price_label: `1크레딧 = ${creditPrice}원`,
      options
    });

  } catch (error) {
    console.error('Credit options error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
