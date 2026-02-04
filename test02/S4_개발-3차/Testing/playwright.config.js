/**
 * @task S4T1
 * @description Playwright E2E 테스트 설정
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',

  // 테스트 타임아웃 설정
  timeout: 60000,
  expect: {
    timeout: 10000
  },

  // 순차 실행 (데이터베이스 상태 일관성 유지)
  workers: 1,

  // 실패 시 재시도
  retries: process.env.CI ? 2 : 0,

  // 리포터 설정
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],

  use: {
    // 베이스 URL
    baseURL: process.env.TEST_URL || 'http://localhost:3000',

    // 스크린샷 및 비디오 설정
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // 브라우저 옵션
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // 액션 타임아웃
    actionTimeout: 15000,
    navigationTimeout: 30000
  },

  // 프로젝트별 설정
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-web-security']
        }
      }
    },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true
      }
    }
  ],

  // 개발 서버 설정 (옵션)
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    timeout: 120000,
    reuseExistingServer: !process.env.CI
  }
});
