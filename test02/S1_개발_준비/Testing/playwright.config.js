/**
 * SSALWorks v1.0 - Playwright Configuration
 * 작성일: 2025-12-13
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    // 테스트 디렉토리
    testDir: './tests/e2e',

    // 병렬 실행
    fullyParallel: true,

    // CI 환경에서 재시도 없음
    forbidOnly: !!process.env.CI,

    // 재시도 횟수
    retries: process.env.CI ? 2 : 0,

    // 워커 수
    workers: process.env.CI ? 1 : undefined,

    // 리포터
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list']
    ],

    // 공통 설정
    use: {
        // 기본 URL
        baseURL: process.env.BASE_URL || 'http://localhost:3000',

        // 트레이스 설정
        trace: 'on-first-retry',

        // 스크린샷
        screenshot: 'only-on-failure',

        // 비디오
        video: 'on-first-retry',

        // 뷰포트
        viewport: { width: 1280, height: 720 },

        // 타임아웃
        actionTimeout: 15000,
        navigationTimeout: 30000,
    },

    // 프로젝트 (브라우저별)
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        // 모바일 테스트
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    // 로컬 개발 서버 (BASE_URL이 설정되면 건너뜀)
    webServer: process.env.BASE_URL ? undefined : {
        command: 'npx vercel dev --listen 3000',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },

    // 타임아웃
    timeout: 60000,

    // Expect 설정
    expect: {
        timeout: 10000,
    },
});
