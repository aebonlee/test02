// S3S1: 구독 권한 체크 (Subscription Permission Check)

const { checkPermission, FEATURE_PERMISSIONS } = require('../lib/subscription/check-permission');

/**
 * 구독 권한 확인 API 엔드포인트
 * Vercel Edge Function으로 배포 가능
 *
 * POST /api/subscription/check
 * Body: { feature: string, userTier: string }
 * Response: { feature, userTier, allowed, reason?, availableFeatures }
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  const { feature, userTier } = req.body;

  if (!feature || !userTier) {
    return res.status(400).json({
      error: 'Missing feature or userTier'
    });
  }

  const result = checkPermission(feature, userTier);

  return res.status(200).json({
    feature,
    userTier,
    ...result,
    availableFeatures: Object.keys(FEATURE_PERMISSIONS).filter(
      f => FEATURE_PERMISSIONS[f].includes(userTier)
    )
  });
};
