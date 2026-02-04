// ================================================================
// S2T1: Jest 설정 파일
// ================================================================
// Task ID: S2T1
// 작성일: 2025-12-14
// 목적: Jest 테스트 프레임워크 설정
// ================================================================

module.exports = {
  // 테스트 환경
  testEnvironment: 'node',

  // 커버리지 수집 대상
  collectCoverageFrom: [
    '../**/*.js',
    '!../**/node_modules/**',
    '!../**/__tests__/**',
    '!../**/__mocks__/**',
    '!**/jest.config.js',
    '!**/setup.js'
  ],

  // 커버리지 리포트 디렉토리
  coverageDirectory: './coverage',

  // 커버리지 리포터
  coverageReporters: ['text', 'lcov', 'html'],

  // 커버리지 임계값
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // 테스트 파일 패턴
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],

  // 모듈 경로 매핑
  moduleNameMapper: {
    '^@supabase/supabase-js$': '<rootDir>/__mocks__/supabase.js',
    '^resend$': '<rootDir>/__mocks__/resend.js'
  },

  // 셋업 파일
  setupFilesAfterEnv: ['<rootDir>/setup.js'],

  // 테스트 타임아웃 (10초)
  testTimeout: 10000,

  // 상세 출력
  verbose: true,

  // 캐시 사용
  cache: true,

  // 병렬 실행
  maxWorkers: '50%',

  // ES6 모듈 변환 (Babel)
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // 변환 무시 패턴 (node_modules 제외)
  transformIgnorePatterns: [
    '/node_modules/'
  ]
};
