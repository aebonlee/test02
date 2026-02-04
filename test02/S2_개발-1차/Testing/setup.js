// ================================================================
// S2T1: Jest 셋업 파일
// ================================================================
// Task ID: S2T1
// 작성일: 2025-12-14
// 목적: 테스트 환경 초기화 및 전역 설정
// ================================================================

// 환경 변수 설정 (테스트용)
process.env.SUPABASE_URL = 'https://test-project.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.RESEND_API_KEY = 'test-resend-api-key';
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';

// 전역 타임아웃 설정
jest.setTimeout(10000);

// 콘솔 에러/경고 무시 (테스트 중 예상된 에러)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: console.log,
  info: console.info,
  debug: console.debug,
};

// 테스트 전 초기화
beforeEach(() => {
  // Mock 함수 초기화
  jest.clearAllMocks();
});

// 테스트 후 정리
afterEach(() => {
  // 추가 정리 작업
});
