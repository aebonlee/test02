# SSALWorks v1.0 테스트 전략

**Task ID**: S1T1
**Area**: Testing (T)
**Stage**: S1 (개발 준비)
**Version**: 1.0
**Last Updated**: 2025-12-13

---

## 1. 테스트 전략 개요

### 1.1 테스트 목표

SSALWorks v1.0 프로토타입의 품질 보증을 위한 체계적인 테스트 전략을 수립합니다.

| 목표 | 설명 |
|------|------|
| 기능 검증 | 모든 핵심 기능이 요구사항대로 동작하는지 확인 |
| 회귀 방지 | 코드 변경 시 기존 기능이 정상 작동하는지 확인 |
| 품질 보증 | 프로덕션 배포 전 안정성 확보 |
| 사용자 경험 | 다양한 환경에서 일관된 UX 제공 |

### 1.2 테스트 피라미드

```
        /‾‾‾‾‾‾‾‾‾‾‾\
       /   E2E (10%)  \        ← 전체 사용자 시나리오
      /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
     /  Integration (20%)  \   ← API, DB 연동 검증
    /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
   /      Unit Tests (70%)     \   ← 개별 함수/컴포넌트
  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
```

---

## 2. 테스트 유형별 전략

### 2.1 단위 테스트 (Unit Tests)

**목적**: 개별 함수, 유틸리티, 컴포넌트의 독립적 동작 검증

**도구**: Jest (jsdom 환경)

**테스트 대상**:
- 유틸리티 함수 (`formatCurrency`, `formatDate`, `validateEmail`, `truncateText`)
- 데이터 변환 로직
- 상태 관리 로직
- DOM 조작 함수

**커버리지 목표**: 70% 이상

**테스트 파일 위치**: `S1_개발_준비/Testing/tests/unit/`

**명명 규칙**: `*.test.js`

**예시**:
```javascript
describe('formatCurrency', () => {
    it('should format number with comma separators', () => {
        expect(formatCurrency(1000)).toBe('1,000원');
    });

    it('should handle zero', () => {
        expect(formatCurrency(0)).toBe('0원');
    });
});
```

### 2.2 통합 테스트 (Integration Tests)

**목적**: 여러 모듈 간의 상호작용 검증

**도구**: Jest + Mock Supabase Client

**테스트 대상**:
- API 호출 및 응답 처리
- Supabase 데이터 CRUD
- 인증 플로우
- 결제 프로세스 (Mock)

**테스트 파일 위치**: `S1_개발_준비/Testing/tests/integration/`

**명명 규칙**: `*.integration.test.js`

**Mock 전략**:
```javascript
// Supabase Mock (tests/setup.js에 정의)
const mockSupabase = createMockSupabase({
    users: [mockUser],
    notices: [mockNotice]
});
```

### 2.3 E2E 테스트 (End-to-End)

**목적**: 실제 사용자 시나리오 전체 흐름 검증

**도구**: Playwright

**테스트 대상**:
- 홈페이지 로드 및 네비게이션
- 로그인/로그아웃 플로우
- 구독 신청 프로세스
- 결제 플로우 (테스트 환경)
- My Page 기능
- 반응형 레이아웃
- 접근성

**브라우저 지원**:
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit (Desktop)
- Mobile Chrome (Android)
- Mobile Safari (iOS)

**테스트 파일 위치**: `S1_개발_준비/Testing/tests/e2e/`

**명명 규칙**: `*.spec.js`

**예시**:
```javascript
test('홈페이지 로드 및 네비게이션', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SSALWorks/);
    await page.click('nav a[href="#features"]');
    await expect(page.locator('#features')).toBeVisible();
});
```

### 2.4 성능 테스트

**목적**: 페이지 로딩 속도 및 런타임 성능 검증

**도구**: Playwright + Lighthouse

**테스트 항목**:
- First Contentful Paint (FCP) < 2s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- JavaScript 번들 크기

**테스트 파일 위치**: E2E 테스트에 포함 (`homepage.spec.js`)

---

## 3. 테스트 도구 및 환경

### 3.1 Jest 설정

**설정 파일**: `S1_개발_준비/Testing/jest.config.js`

| 설정 | 값 | 설명 |
|------|-----|------|
| testEnvironment | jsdom | 브라우저 환경 시뮬레이션 |
| coverageThreshold | 70% | 최소 커버리지 요구사항 |
| setupFilesAfterEnv | tests/setup.js | 테스트 전 초기화 |
| moduleNameMapper | @/ aliases | 모듈 별칭 지원 |

### 3.2 Playwright 설정

**설정 파일**: `S1_개발_준비/Testing/playwright.config.js`

| 설정 | 값 | 설명 |
|------|-----|------|
| testDir | ./tests/e2e | E2E 테스트 디렉토리 |
| baseURL | http://localhost:3000 | 테스트 서버 URL |
| timeout | 30000ms | 테스트 타임아웃 |
| retries | 2 (CI) | 실패 시 재시도 |
| reporter | html, list | 리포트 형식 |

### 3.3 테스트 환경 요구사항

**Node.js**: >= 18.0.0

**필수 패키지**:
```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/jest-dom
npm install --save-dev @playwright/test
npx playwright install
```

---

## 4. 커버리지 목표

### 4.1 단위 테스트 커버리지

| 메트릭 | 목표 | 최소 |
|--------|------|------|
| Branches | 80% | 70% |
| Functions | 80% | 70% |
| Lines | 80% | 70% |
| Statements | 80% | 70% |

### 4.2 핵심 기능 E2E 커버리지

| 기능 | 테스트 케이스 | 우선순위 |
|------|--------------|----------|
| 홈페이지 로드 | 3 | P1 |
| 네비게이션 | 2 | P1 |
| 로그인/로그아웃 | 4 | P1 |
| 구독 신청 | 3 | P1 |
| 결제 플로우 | 2 | P1 |
| My Page | 5 | P2 |
| 반응형 | 3 | P2 |
| 접근성 | 2 | P2 |

---

## 5. CI/CD 연동 계획

### 5.1 자동 테스트 트리거

| 이벤트 | 실행 테스트 |
|--------|-------------|
| PR 생성 | Unit + Integration |
| PR 업데이트 | Unit + Integration |
| main 브랜치 머지 | Unit + Integration + E2E |
| 배포 전 | Full Test Suite |

### 5.2 GitHub Actions 워크플로우

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage

  e2e-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

### 5.3 Vercel Preview 테스트

- PR마다 Preview URL 생성
- Preview URL에 대해 E2E 테스트 실행 (선택적)

---

## 6. 테스트 실패 처리 정책

### 6.1 실패 분류

| 등급 | 설명 | 조치 |
|------|------|------|
| Critical | 핵심 기능 실패 | PR 블록, 즉시 수정 |
| Major | 중요 기능 실패 | PR 블록, 24시간 내 수정 |
| Minor | 부가 기능 실패 | PR 허용, 다음 스프린트에서 수정 |

### 6.2 Flaky Test 처리

1. 3회 연속 실패 시 Flaky로 분류
2. Flaky 테스트는 `skip` 또는 `retry` 처리
3. 1주일 내 근본 원인 해결

### 6.3 실패 알림

- Slack 연동 (선택적)
- GitHub PR Comment로 테스트 결과 표시

---

## 7. 테스트 작성 가이드라인

### 7.1 테스트 명명 규칙

```javascript
// Good
describe('formatCurrency', () => {
    it('should format positive number with comma separators', () => {});
    it('should return "0원" for zero value', () => {});
    it('should handle negative numbers', () => {});
});

// Bad
describe('test1', () => {
    it('works', () => {});
});
```

### 7.2 AAA 패턴

```javascript
it('should add item to cart', () => {
    // Arrange
    const cart = new Cart();
    const item = { id: 1, name: 'Product', price: 1000 };

    // Act
    cart.addItem(item);

    // Assert
    expect(cart.items).toContainEqual(item);
    expect(cart.total).toBe(1000);
});
```

### 7.3 Mock 사용 원칙

- 외부 서비스 (API, DB)는 항상 Mock
- 내부 모듈은 가능하면 실제 구현 사용
- Mock은 `tests/setup.js`에 중앙 관리

---

## 8. 관련 파일

| 파일 | 설명 |
|------|------|
| `jest.config.js` | Jest 설정 |
| `playwright.config.js` | Playwright 설정 |
| `tests/setup.js` | 테스트 초기화 및 Mock |
| `tests/unit/*.test.js` | 단위 테스트 |
| `tests/e2e/*.spec.js` | E2E 테스트 |

---

## 9. 참고 자료

- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [Playwright 공식 문서](https://playwright.dev/docs/intro)
- [Testing Library](https://testing-library.com/docs/)
- [Google Testing Blog](https://testing.googleblog.com/)

---

**Last Updated**: 2025-12-13
**Version**: 1.0
**Maintained by**: S1T1 Task Owner
