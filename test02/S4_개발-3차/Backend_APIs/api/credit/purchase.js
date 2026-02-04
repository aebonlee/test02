/**
 * @task S4BA4
 * @description 크레딧 충전(구매) API
 *
 * POST /api/credit/purchase
 *
 * Request Body:
 * {
 *   "packageId": "basic" | "standard" | "premium",
 *   "paymentKey": "string",
 *   "orderId": "string",
 *   "amount": number
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "orderId": "string",
 *     "credits": number,
 *     "bonus": number,
 *     "totalCredits": number,
 *     "newBalance": number
 *   }
 * }
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
const TOSS_API_URL = 'https://api.tosspayments.com/v1';

const CREDIT_PACKAGES = {
    basic: { credits: 1000, price: 10000, bonus: 0 },
    standard: { credits: 5000, price: 45000, bonus: 500 },
    premium: { credits: 10000, price: 80000, bonus: 2000 }
};

module.exports = async (req, res) => {
    // POST 메서드만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // 1. 사용자 인증 확인
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: '인증이 필요합니다'
            });
        }

        const token = authHeader.substring(7);
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({
                success: false,
                error: '유효하지 않은 인증 토큰입니다'
            });
        }

        // 2. 요청 데이터 검증
        const { packageId, paymentKey, orderId, amount } = req.body;

        if (!packageId || !paymentKey || !orderId || !amount) {
            return res.status(400).json({
                success: false,
                error: '필수 파라미터가 누락되었습니다'
            });
        }

        // 3. 패키지 정보 확인
        const packageInfo = CREDIT_PACKAGES[packageId];
        if (!packageInfo) {
            return res.status(400).json({
                success: false,
                error: '유효하지 않은 패키지입니다'
            });
        }

        // 4. 금액 검증
        if (amount !== packageInfo.price) {
            return res.status(400).json({
                success: false,
                error: '결제 금액이 일치하지 않습니다'
            });
        }

        // 5. 토스페이먼츠 결제 승인
        const tossResponse = await fetch(`${TOSS_API_URL}/payments/confirm`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount
            })
        });

        const tossData = await tossResponse.json();

        if (!tossResponse.ok) {
            console.error('Toss payment confirmation failed:', tossData);
            return res.status(400).json({
                success: false,
                error: '결제 승인에 실패했습니다',
                details: tossData
            });
        }

        // 6. 크레딧 충전 금액 계산
        const creditsToAdd = packageInfo.credits + packageInfo.bonus;

        // 7. 트랜잭션으로 크레딧 충전 및 기록
        // 7-1. 현재 잔액 조회
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('credit_balance')
            .eq('id', user.id)
            .single();

        if (userError) {
            console.error('User query failed:', userError);
            return res.status(500).json({
                success: false,
                error: '사용자 정보 조회에 실패했습니다'
            });
        }

        const currentBalance = userData.credit_balance || 0;
        const newBalance = currentBalance + creditsToAdd;

        // 7-2. 크레딧 잔액 업데이트
        const { error: updateError } = await supabase
            .from('users')
            .update({ credit_balance: newBalance })
            .eq('id', user.id);

        if (updateError) {
            console.error('Credit update failed:', updateError);
            return res.status(500).json({
                success: false,
                error: '크레딧 충전에 실패했습니다'
            });
        }

        // 7-3. 크레딧 충전 기록 저장
        const { error: historyError } = await supabase
            .from('credit_history')
            .insert({
                user_id: user.id,
                type: 'purchase',
                amount: creditsToAdd,
                balance_after: newBalance,
                description: `${packageId} 패키지 구매 (기본: ${packageInfo.credits}, 보너스: ${packageInfo.bonus})`,
                metadata: {
                    packageId,
                    orderId,
                    paymentKey,
                    price: amount,
                    baseCredits: packageInfo.credits,
                    bonusCredits: packageInfo.bonus,
                    tossPaymentId: tossData.paymentKey
                }
            });

        if (historyError) {
            console.error('History insert failed:', historyError);
            // 기록 실패는 크레딧 충전에 영향 없음 (로그만 남김)
        }

        // 8. 성공 응답
        return res.status(200).json({
            success: true,
            data: {
                orderId,
                credits: packageInfo.credits,
                bonus: packageInfo.bonus,
                totalCredits: creditsToAdd,
                newBalance,
                payment: {
                    method: tossData.method,
                    approvedAt: tossData.approvedAt
                }
            }
        });

    } catch (error) {
        console.error('Credit purchase error:', error);
        return res.status(500).json({
            success: false,
            error: '크레딧 충전 중 오류가 발생했습니다',
            details: error.message
        });
    }
};
