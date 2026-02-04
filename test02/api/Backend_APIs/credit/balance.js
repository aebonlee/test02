/**
 * @task S4BA4
 * @description 크레딧 잔액 조회 API
 *
 * GET /api/credit/balance
 *
 * Headers:
 * - Authorization: Bearer {token}
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "balance": number,
 *     "userId": "string"
 *   }
 * }
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
    // GET 메서드만 허용
    if (req.method !== 'GET') {
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

        // 2. 크레딧 잔액 조회
        const { data, error } = await supabase
            .from('users')
            .select('credit_balance')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Balance query failed:', error);
            return res.status(500).json({
                success: false,
                error: '잔액 조회에 실패했습니다'
            });
        }

        // 3. 성공 응답
        return res.status(200).json({
            success: true,
            data: {
                balance: data.credit_balance || 0,
                userId: user.id
            }
        });

    } catch (error) {
        console.error('Balance check error:', error);
        return res.status(500).json({
            success: false,
            error: '잔액 조회 중 오류가 발생했습니다',
            details: error.message
        });
    }
};
