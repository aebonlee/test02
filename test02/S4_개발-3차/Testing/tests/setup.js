/**
 * @task S4T2
 * @description Jest 테스트 설정 및 환경 구성
 */

// 환경 변수 로드
require('dotenv').config({ path: '.env.test' });

// 전역 테스트 헬퍼
global.testHelpers = {
  /**
   * 유효한 JWT 토큰 생성 (테스트용)
   */
  generateTestToken: () => {
    return 'test-jwt-token-' + Date.now();
  },

  /**
   * 유효한 사용자 ID 생성 (테스트용)
   */
  generateTestUserId: () => {
    return 'test-user-' + Date.now();
  },

  /**
   * API 응답 검증 헬퍼
   */
  expectSuccessResponse: (response) => {
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  },

  expectErrorResponse: (response, expectedStatus = 400) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body.error).toBeDefined();
  },

  /**
   * 날짜 형식 검증
   */
  expectValidDate: (dateString) => {
    expect(dateString).toBeDefined();
    expect(new Date(dateString).toString()).not.toBe('Invalid Date');
  },

  /**
   * UUID 형식 검증
   */
  expectValidUUID: (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  },

  /**
   * API 모킹 헬퍼
   */
  mockSupabaseClient: () => {
    return {
      auth: {
        getUser: jest.fn(),
        signInWithOAuth: jest.fn(),
        signOut: jest.fn()
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis()
      }))
    };
  }
};

// 콘솔 에러 억제 (테스트 로그 정리)
global.console = {
  ...console,
  error: jest.fn(), // 에러 로그 모킹
  warn: jest.fn()   // 경고 로그 모킹
};

// 테스트 시작/종료 훅
beforeAll(() => {
  console.log('\n🧪 Starting Jest Integration Tests...\n');
});

afterAll(() => {
  console.log('\n✅ All tests completed.\n');
});

beforeEach(() => {
  // 각 테스트 전 초기화
  jest.clearAllMocks();
});
