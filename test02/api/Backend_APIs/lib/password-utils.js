/**
 * @task S2BA4
 * 비밀번호 검증 유틸리티
 */

/**
 * 비밀번호 강도 검증
 * @param {string} password - 검증할 비밀번호
 * @returns {Object} { isValid: boolean, errors: string[], strength: string }
 */
function validatePassword(password) {
  const errors = [];

  // 1. 길이 검증 (최소 8자)
  if (!password || password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다');
  }

  // 2. 최대 길이 (72자 - bcrypt 제한)
  if (password && password.length > 72) {
    errors.push('비밀번호는 최대 72자까지 가능합니다');
  }

  // 3. 영문 포함 검증
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('영문자를 최소 1개 포함해야 합니다');
  }

  // 4. 숫자 포함 검증
  if (!/\d/.test(password)) {
    errors.push('숫자를 최소 1개 포함해야 합니다');
  }

  // 5. 특수문자 포함 검증
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('특수문자를 최소 1개 포함해야 합니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: getPasswordStrength(password)
  };
}

/**
 * 비밀번호 강도 계산
 * @param {string} password - 검증할 비밀번호
 * @returns {string} 'weak' | 'medium' | 'strong'
 */
function getPasswordStrength(password) {
  if (!password) return 'weak';

  let score = 0;

  // 길이 점수 (8자 이상 +1, 12자 이상 +1, 16자 이상 +1)
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // 문자 종류 점수
  if (/[a-z]/.test(password)) score += 1;  // 소문자
  if (/[A-Z]/.test(password)) score += 1;  // 대문자
  if (/\d/.test(password)) score += 1;     // 숫자
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;  // 특수문자

  // 연속 문자 체크 (점수 감점)
  if (/(.)\1{2,}/.test(password)) score -= 1;  // 동일 문자 3회 이상 연속
  if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
    score -= 1;  // 연속된 알파벳
  }
  if (/012|123|234|345|456|567|678|789/.test(password)) {
    score -= 1;  // 연속된 숫자
  }

  // 강도 판정
  if (score >= 6) return 'strong';
  if (score >= 4) return 'medium';
  return 'weak';
}

/**
 * 일반적인 약한 비밀번호 체크
 * @param {string} password - 검증할 비밀번호
 * @returns {boolean} true if password is common/weak
 */
function isCommonPassword(password) {
  const commonPasswords = [
    'password', 'password123', '12345678', '123456789', '1234567890',
    'qwerty', 'qwerty123', 'abc123', 'password1', 'admin123',
    'welcome', 'welcome123', 'monkey', 'dragon', 'master',
    'sunshine', 'princess', 'football', 'baseball', 'superman'
  ];

  return commonPasswords.includes(password.toLowerCase());
}

/**
 * 비밀번호 복잡도 검증 (통합 함수)
 * @param {string} password - 검증할 비밀번호
 * @returns {Object} { isValid: boolean, message: string, strength: string }
 */
function checkPasswordComplexity(password) {
  // 1. 기본 검증
  const validation = validatePassword(password);

  if (!validation.isValid) {
    return {
      isValid: false,
      message: validation.errors.join(', '),
      strength: validation.strength
    };
  }

  // 2. 일반적인 약한 비밀번호 체크
  if (isCommonPassword(password)) {
    return {
      isValid: false,
      message: '너무 흔한 비밀번호입니다. 다른 비밀번호를 사용해주세요',
      strength: 'weak'
    };
  }

  // 3. 강도 체크
  const strength = getPasswordStrength(password);
  if (strength === 'weak') {
    return {
      isValid: false,
      message: '비밀번호가 너무 약합니다. 더 복잡한 비밀번호를 사용해주세요',
      strength
    };
  }

  return {
    isValid: true,
    message: '안전한 비밀번호입니다',
    strength
  };
}

module.exports = {
  validatePassword,
  getPasswordStrength,
  isCommonPassword,
  checkPasswordComplexity
};
