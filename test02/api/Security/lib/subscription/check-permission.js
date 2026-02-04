// S3S1: 구독 권한 체크 (Subscription Permission Check)

/**
 * 기능별 구독 등급 요구사항
 * 각 기능이 필요로 하는 최소 구독 등급을 정의
 */
const FEATURE_PERMISSIONS = {
  // 무료 사용 가능
  'learning-contents.read': ['free', 'basic', 'premium'],
  'faqs.read': ['free', 'basic', 'premium'],

  // Basic 이상
  'ai-qa.use': ['basic', 'premium'],
  'progress.save': ['basic', 'premium'],

  // Premium 전용
  'ai-qa.unlimited': ['premium'],
  'analytics.view': ['premium']
};

/**
 * 기능 접근 권한 확인
 * @param {string} feature - 확인할 기능 (예: 'ai-qa.use')
 * @param {string} userTier - 사용자의 현재 구독 등급 ('free', 'basic', 'premium')
 * @returns {{allowed: boolean, reason?: string}} - 권한 확인 결과
 */
function checkPermission(feature, userTier) {
  const allowed = FEATURE_PERMISSIONS[feature];

  if (!allowed) {
    return {
      allowed: false,
      reason: 'Unknown feature'
    };
  }

  if (!allowed.includes(userTier)) {
    return {
      allowed: false,
      reason: `Requires ${allowed[0]} or higher`
    };
  }

  return { allowed: true };
}

module.exports = {
  checkPermission,
  FEATURE_PERMISSIONS
};
