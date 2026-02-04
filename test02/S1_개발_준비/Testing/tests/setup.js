/**
 * SSALWorks v1.0 - Jest Test Setup
 * 작성일: 2025-12-13
 */

// DOM 환경 설정
beforeAll(() => {
    // Local Storage Mock
    const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Session Storage Mock
    const sessionStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

    // Fetch Mock
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        })
    );

    // Console 경고 억제 (필요시)
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// 각 테스트 후 정리
afterEach(() => {
    jest.clearAllMocks();
});

// 모든 테스트 완료 후
afterAll(() => {
    jest.restoreAllMocks();
});

// 전역 테스트 유틸리티
global.testUtils = {
    /**
     * Mock Supabase 클라이언트 생성
     */
    createMockSupabase: () => ({
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
        auth: {
            getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
            signInWithOAuth: jest.fn(),
            signOut: jest.fn(),
        },
    }),

    /**
     * 비동기 딜레이
     */
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    /**
     * Mock 사용자 데이터 생성
     */
    createMockUser: (overrides = {}) => ({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'test@example.com',
        name: '테스트 사용자',
        user_id: 'TEST1234',
        role: 'user',
        subscription_status: 'free',
        credit_balance: 10000,
        created_at: new Date().toISOString(),
        ...overrides,
    }),
};
