/**
 * @task S4BA3
 * @description 크레딧 충전 옵션 조회 API
 * @route GET /api/payment/credit/options
 */

const CREDIT_OPTIONS = [
  {
    amount: 10000,
    label: '10,000원',
    bonus: 0,
    total: 10000
  },
  {
    amount: 20000,
    label: '20,000원',
    bonus: 1000,
    total: 21000,
    recommended: false
  },
  {
    amount: 30000,
    label: '30,000원',
    bonus: 2000,
    total: 32000,
    recommended: true
  },
  {
    amount: 50000,
    label: '50,000원',
    bonus: 5000,
    total: 55000,
    recommended: false
  }
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    return res.status(200).json({
      success: true,
      options: CREDIT_OPTIONS
    });

  } catch (error) {
    console.error('Credit options error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
