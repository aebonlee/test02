/**
 * @task S4BA4
 * @description 크레딧 이용 내역 조회 API
 *
 * GET /api/credit/history?page=1&limit=10&type=all
 *
 * Query Parameters:
 * - page: 페이지 번호 (기본값: 1)
 * - limit: 페이지당 항목 수 (기본값: 10, 최대: 100)
 * - type: 내역 유형 (all | purchase | usage | refund)
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "items": [
 *       {
 *         "id": "string",
 *         "type": "purchase" | "usage" | "refund",
 *         "amount": number,
 *         "balance_after": number,
 *         "description": "string",
 *         "created_at": "timestamp",
 *         "metadata": {}
 *       }
 *     ],
 *     "pagination": {
 *       "page": number,
 *       "limit": number,
 *       "total": number,
 *       "totalPages": number
 *     }
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

        // 2. 쿼리 파라미터 파싱
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        const type = req.query.type || 'all';

        // 3. 오프셋 계산
        const offset = (page - 1) * limit;

        // 4. 쿼리 빌더 생성
        let query = supabase
            .from('credit_history')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id);

        // 5. 타입 필터 적용
        if (type !== 'all') {
            if (!['purchase', 'usage', 'refund'].includes(type)) {
                return res.status(400).json({
                    success: false,
                    error: '유효하지 않은 타입입니다. (all, purchase, usage, refund 중 선택)'
                });
            }
            query = query.eq('type', type);
        }

        // 6. 정렬 및 페이지네이션
        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // 7. 데이터 조회
        const { data, error, count } = await query;

        if (error) {
            console.error('History query failed:', error);
            return res.status(500).json({
                success: false,
                error: '이용 내역 조회에 실패했습니다'
            });
        }

        // 8. 총 페이지 수 계산
        const totalPages = Math.ceil((count || 0) / limit);

        // 9. 성공 응답
        return res.status(200).json({
            success: true,
            data: {
                items: data.map(item => ({
                    id: item.id,
                    type: item.type,
                    amount: item.amount,
                    balance_after: item.balance_after,
                    description: item.description,
                    created_at: item.created_at,
                    metadata: item.metadata || {}
                })),
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages
                }
            }
        });

    } catch (error) {
        console.error('History check error:', error);
        return res.status(500).json({
            success: false,
            error: '이용 내역 조회 중 오류가 발생했습니다',
            details: error.message
        });
    }
};
