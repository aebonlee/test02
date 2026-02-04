/**
 * Environment Variable Validator
 * OWASP A02 대응: 환경변수 검증 및 보안 강화
 *
 * 서버 시작 시 필수 환경변수 존재 여부 및 형식 검증
 */

/**
 * 필수 환경변수 목록 (서버 측에서만 사용)
 */
const REQUIRED_ENV_VARS = {
    // Supabase
    SUPABASE_URL: {
        pattern: /^https:\/\/[a-z0-9]+\.supabase\.co$/,
        description: 'Supabase 프로젝트 URL',
        example: 'https://xxxxxxxxxxxx.supabase.co'
    },
    SUPABASE_ANON_KEY: {
        pattern: /^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
        description: 'Supabase Anonymous Key (JWT 형식)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    SUPABASE_SERVICE_ROLE_KEY: {
        pattern: /^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
        description: 'Supabase Service Role Key (JWT 형식) - 서버에서만 사용!',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        sensitive: true
    }
};

/**
 * 선택적 환경변수 목록
 */
const OPTIONAL_ENV_VARS = {
    // AI 서비스
    GEMINI_API_KEY: {
        pattern: /^AIza[A-Za-z0-9-_]{35}$/,
        description: 'Google Gemini API Key'
    },
    PERPLEXITY_API_KEY: {
        pattern: /^pplx-[a-f0-9]{48}$/,
        description: 'Perplexity API Key'
    },
    OPENAI_API_KEY: {
        pattern: /^sk-[A-Za-z0-9-_]+$/,
        description: 'OpenAI API Key'
    },

    // 결제
    TOSS_CLIENT_KEY: {
        pattern: /^test_ck_|live_ck_/,
        description: 'Toss Payments Client Key'
    },
    TOSS_SECRET_KEY: {
        pattern: /^test_sk_|live_sk_/,
        description: 'Toss Payments Secret Key',
        sensitive: true
    },
    TOSS_WEBHOOK_SECRET: {
        pattern: /.+/,
        description: 'Toss Payments Webhook Secret',
        sensitive: true
    },

    // 이메일
    RESEND_API_KEY: {
        pattern: /^re_[A-Za-z0-9]+$/,
        description: 'Resend API Key'
    },

    // 모니터링
    SENTRY_DSN: {
        pattern: /^https:\/\/[a-f0-9]+@[a-z0-9]+\.ingest\.sentry\.io\/[0-9]+$/,
        description: 'Sentry DSN'
    },

    // 크론
    CRON_SECRET: {
        pattern: /.{16,}/,
        description: 'Cron Job Secret (최소 16자)',
        sensitive: true
    }
};

/**
 * 환경변수 검증 결과
 */
class ValidationResult {
    constructor() {
        this.valid = true;
        this.errors = [];
        this.warnings = [];
    }

    addError(varName, message) {
        this.valid = false;
        this.errors.push({ varName, message });
    }

    addWarning(varName, message) {
        this.warnings.push({ varName, message });
    }

    toJSON() {
        return {
            valid: this.valid,
            errorCount: this.errors.length,
            warningCount: this.warnings.length,
            errors: this.errors,
            warnings: this.warnings
        };
    }
}

/**
 * 환경변수 검증
 * @param {Object} options - 검증 옵션
 * @param {boolean} options.strict - true면 선택적 변수도 필수로 검증
 * @param {boolean} options.throwOnError - true면 에러 시 예외 발생
 * @returns {ValidationResult}
 */
function validateEnv(options = {}) {
    const { strict = false, throwOnError = false } = options;
    const result = new ValidationResult();

    // 필수 환경변수 검증
    for (const [varName, config] of Object.entries(REQUIRED_ENV_VARS)) {
        const value = process.env[varName];

        if (!value) {
            result.addError(varName, `필수 환경변수 누락: ${config.description}`);
            continue;
        }

        if (config.pattern && !config.pattern.test(value)) {
            result.addError(varName, `형식 불일치: ${config.description}. 예시: ${config.example || 'N/A'}`);
        }
    }

    // 선택적 환경변수 검증
    for (const [varName, config] of Object.entries(OPTIONAL_ENV_VARS)) {
        const value = process.env[varName];

        if (!value) {
            if (strict) {
                result.addError(varName, `환경변수 누락: ${config.description}`);
            } else {
                result.addWarning(varName, `선택적 환경변수 미설정: ${config.description}`);
            }
            continue;
        }

        if (config.pattern && !config.pattern.test(value)) {
            result.addWarning(varName, `형식 확인 필요: ${config.description}`);
        }
    }

    // NODE_ENV 확인
    if (!process.env.NODE_ENV) {
        result.addWarning('NODE_ENV', 'NODE_ENV 미설정. production 또는 development 권장');
    }

    // 프로덕션 환경 추가 검증
    if (process.env.NODE_ENV === 'production') {
        // Service Role Key가 클라이언트에 노출되지 않는지 확인 (런타임에서는 확인 불가, 문서화 목적)
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            // 경고만 출력 (실제 노출 여부는 코드 리뷰에서 확인)
            console.log('[EnvValidator] SERVICE_ROLE_KEY 설정됨 - 서버 측에서만 사용되는지 확인 필요');
        }
    }

    if (throwOnError && !result.valid) {
        const errorMessages = result.errors.map(e => `${e.varName}: ${e.message}`).join('\n');
        throw new Error(`환경변수 검증 실패:\n${errorMessages}`);
    }

    return result;
}

/**
 * 환경변수 검증 및 로깅
 * 서버 시작 시 호출 권장
 */
function validateAndLogEnv() {
    const result = validateEnv();

    if (!result.valid) {
        console.error('❌ 환경변수 검증 실패:');
        result.errors.forEach(e => {
            console.error(`  - ${e.varName}: ${e.message}`);
        });
    }

    if (result.warnings.length > 0) {
        console.warn('⚠️ 환경변수 경고:');
        result.warnings.forEach(w => {
            console.warn(`  - ${w.varName}: ${w.message}`);
        });
    }

    if (result.valid && result.warnings.length === 0) {
        console.log('✅ 환경변수 검증 완료');
    }

    return result;
}

/**
 * 특정 환경변수 안전하게 가져오기
 * @param {string} varName - 환경변수 이름
 * @param {string} defaultValue - 기본값
 * @returns {string}
 */
function getEnvSafe(varName, defaultValue = '') {
    const value = process.env[varName];

    if (!value) {
        if (REQUIRED_ENV_VARS[varName]) {
            console.error(`[EnvValidator] 필수 환경변수 누락: ${varName}`);
        }
        return defaultValue;
    }

    return value;
}

/**
 * 민감한 환경변수인지 확인
 * @param {string} varName - 환경변수 이름
 * @returns {boolean}
 */
function isSensitiveEnv(varName) {
    const config = REQUIRED_ENV_VARS[varName] || OPTIONAL_ENV_VARS[varName];
    return config?.sensitive === true;
}

/**
 * 환경변수 마스킹 (로깅용)
 * @param {string} varName - 환경변수 이름
 * @param {string} value - 값
 * @returns {string}
 */
function maskEnvValue(varName, value) {
    if (!value) return '(not set)';

    if (isSensitiveEnv(varName)) {
        // 처음 4자와 마지막 4자만 표시
        if (value.length > 12) {
            return `${value.slice(0, 4)}...${value.slice(-4)}`;
        }
        return '****';
    }

    return value;
}

module.exports = {
    validateEnv,
    validateAndLogEnv,
    getEnvSafe,
    isSensitiveEnv,
    maskEnvValue,
    REQUIRED_ENV_VARS,
    OPTIONAL_ENV_VARS
};
