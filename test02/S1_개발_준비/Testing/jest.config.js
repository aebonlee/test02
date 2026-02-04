/**
 * SSALWorks v1.0 - Jest Configuration
 * 작성일: 2025-12-13
 */

module.exports = {
    // 테스트 환경
    testEnvironment: 'jsdom',

    // 테스트 파일 패턴
    testMatch: [
        '**/tests/unit/**/*.test.js',
        '**/tests/**/*.spec.js'
    ],

    // 모듈 경로 별칭
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/js/$1',
        '^@components/(.*)$': '<rootDir>/js/components/$1',
        '^@utils/(.*)$': '<rootDir>/js/utils/$1',
        '^@constants/(.*)$': '<rootDir>/js/constants/$1'
    },

    // 커버리지 설정
    collectCoverageFrom: [
        'js/**/*.js',
        'api/**/*.js',
        '!js/vendor/**',
        '!**/node_modules/**'
    ],

    // 커버리지 임계값
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },

    // 커버리지 리포터
    coverageReporters: ['text', 'lcov', 'html'],

    // 커버리지 출력 디렉토리
    coverageDirectory: 'coverage',

    // 설정 파일
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

    // 변환 무시
    transformIgnorePatterns: [
        '/node_modules/',
        '\\.css$'
    ],

    // 상세 출력
    verbose: true,

    // 타임아웃
    testTimeout: 10000,

    // 글로벌 설정
    globals: {
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_ANON_KEY: 'test-anon-key'
    }
};
