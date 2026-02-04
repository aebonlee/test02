// S3BA1: AI Q&A API - 사용량 조회
const { UsageLimiter, DAILY_LIMITS } = require('../Backend_Infrastructure/ai/usage-limiter');
const { withSubscription } = require('../Security/lib/subscription');

const usageLimiter = new UsageLimiter();

/**
 * AI 사용량 조회 API Handler
 * 현재 사용자의 AI 사용량 조회
 *
 * GET /api/ai/usage
 * Headers: Authorization: Bearer <token>
 *
 * Response: {
 *   success: boolean,
 *   tier: string,
 *   limit: number,
 *   used: number,
 *   remaining: number,
 *   resetsAt: string
 * }
 */
async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.user.id;
  const userTier = req.userTier;

  try {
    const limitCheck = await usageLimiter.checkLimit(userId, userTier);

    // 다음 날 00:00:00 시간 계산
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return res.status(200).json({
      success: true,
      tier: userTier,
      tierDisplayName: getTierDisplayName(userTier),
      limit: DAILY_LIMITS[userTier] || 0,
      used: limitCheck.usedToday || 0,
      remaining: limitCheck.remaining,
      canUseAI: limitCheck.allowed,
      resetsAt: tomorrow.toISOString(),
      upgradeInfo: getUpgradeInfo(userTier)
    });

  } catch (error) {
    console.error('Usage check error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * 구독 등급 한글 표시명
 */
function getTierDisplayName(tier) {
  const names = {
    free: '무료',
    basic: 'Basic',
    premium: 'Premium'
  };
  return names[tier] || tier;
}

/**
 * 업그레이드 안내 정보
 */
function getUpgradeInfo(currentTier) {
  if (currentTier === 'premium') {
    return null; // 최고 등급
  }

  if (currentTier === 'basic') {
    return {
      nextTier: 'premium',
      nextTierName: 'Premium',
      nextTierLimit: DAILY_LIMITS.premium,
      benefit: `일일 AI 사용량이 ${DAILY_LIMITS.premium}회로 증가합니다.`
    };
  }

  // free 등급
  return {
    nextTier: 'basic',
    nextTierName: 'Basic',
    nextTierLimit: DAILY_LIMITS.basic,
    benefit: `AI Q&A 기능을 사용할 수 있습니다. (일일 ${DAILY_LIMITS.basic}회)`
  };
}

// 인증된 사용자만 접근 (무료 등급도 조회 가능)
module.exports = withSubscription('learning-contents.read')(handler);
