/**
 * @task S4BA1
 * @description 빌더 계정 개설비 정보 조회 API (인증 불필요)
 * @updated admin_settings 테이블에서 동적으로 금액 조회
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BANK_INFO = {
  bank_name: process.env.BANK_NAME || '국민은행',
  account_number: process.env.BANK_ACCOUNT || '123-456-789012',
  account_holder: process.env.BANK_HOLDER || '주식회사 SSAL'
};

// 기본값 (admin_settings 조회 실패 시)
const DEFAULT_INSTALL_FEE = 3000000;
const DEFAULT_MONTHLY_FEE = 50000;
const INITIAL_CREDIT = 50000;
const FREE_MONTHS = 3;

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // admin_settings에서 설정값 조회
        let installFee = DEFAULT_INSTALL_FEE;
        let monthlyFee = DEFAULT_MONTHLY_FEE;

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data: settings } = await supabase
                .from('admin_settings')
                .select('install_fee, monthly_fee')
                .eq('id', 1)
                .single();

            if (settings) {
                installFee = settings.install_fee || DEFAULT_INSTALL_FEE;
                monthlyFee = settings.monthly_fee || DEFAULT_MONTHLY_FEE;
            }
        }

        res.status(200).json({
            success: true,
            installation_fee: {
                amount: installFee,
                description: '빌더 계정 개설비 (1회)',
                payment_methods: ['bank_transfer']
            },
            bank_info: BANK_INFO,
            benefits: {
                initial_credit: INITIAL_CREDIT,
                initial_credit_description: '즉시 크레딧 지급',
                free_months: FREE_MONTHS,
                free_months_description: '3개월 무료 사용',
                monthly_fee_after: monthlyFee,
                monthly_fee_description: '이후 월 이용료'
            },
            payment_process: [
                '1. 빌더 계정 개설비 입금 요청',
                '2. 계좌 정보 및 입금자명 확인',
                '3. 7일 이내 입금',
                '4. 관리자 확인 후 즉시 크레딧 지급',
                '5. 3개월 무료 기간 시작'
            ],
            notes: [
                '입금자명에 표시된 코드를 반드시 포함해주세요.',
                '입금 후 관리자 확인까지 영업일 기준 1-2일 소요됩니다.',
                '입금 기한은 요청일로부터 7일입니다.'
            ]
        });
    } catch (error) {
        console.error('Installation info error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
