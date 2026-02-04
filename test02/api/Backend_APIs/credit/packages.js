/**
 * @task S4BA4
 * @description 크레딧 패키지 목록 조회 API
 *
 * GET /api/credit/packages
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "packages": [
 *       {
 *         "id": "basic",
 *         "name": "베이직",
 *         "credits": 1000,
 *         "bonus": 0,
 *         "price": 10000,
 *         "totalCredits": 1000,
 *         "pricePerCredit": 10
 *       },
 *       ...
 *     ]
 *   }
 * }
 */

const CREDIT_PACKAGES = {
    basic: {
        id: 'basic',
        name: '베이직',
        credits: 1000,
        bonus: 0,
        price: 10000,
        description: '기본 크레딧 패키지',
        features: [
            '1,000 크레딧',
            '보너스 없음'
        ]
    },
    standard: {
        id: 'standard',
        name: '스탠다드',
        credits: 5000,
        bonus: 500,
        price: 45000,
        description: '인기 크레딧 패키지',
        features: [
            '5,000 크레딧',
            '500 보너스 크레딧',
            '10% 할인 적용'
        ],
        badge: 'POPULAR'
    },
    premium: {
        id: 'premium',
        name: '프리미엄',
        credits: 10000,
        bonus: 2000,
        price: 80000,
        description: '최고 가치 크레딧 패키지',
        features: [
            '10,000 크레딧',
            '2,000 보너스 크레딧',
            '20% 할인 적용'
        ],
        badge: 'BEST VALUE'
    }
};

module.exports = async (req, res) => {
    // GET 메서드만 허용
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // 패키지 데이터 가공
        const packages = Object.values(CREDIT_PACKAGES).map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            credits: pkg.credits,
            bonus: pkg.bonus,
            price: pkg.price,
            totalCredits: pkg.credits + pkg.bonus,
            pricePerCredit: Math.round(pkg.price / (pkg.credits + pkg.bonus)),
            description: pkg.description,
            features: pkg.features,
            badge: pkg.badge || null
        }));

        return res.status(200).json({
            success: true,
            data: {
                packages
            }
        });

    } catch (error) {
        console.error('Packages query error:', error);
        return res.status(500).json({
            success: false,
            error: '패키지 목록 조회 중 오류가 발생했습니다',
            details: error.message
        });
    }
};
