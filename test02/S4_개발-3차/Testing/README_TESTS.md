# API Integration Tests - S4T2

**Task ID:** S4T2
**작성일:** 2025-12-20
**목적:** 모든 Serverless API 엔드포인트 통합 테스트

---

## 📋 개요

이 테스트 슈트는 SSALWorks 프로젝트의 모든 API 엔드포인트에 대한 통합 테스트를 제공합니다.

### 테스트 대상 API

1. **인증 (Authentication)** - `auth.test.js`
   - Google OAuth 로그인
   - 로그아웃
   - 토큰 검증

2. **구독 (Subscription)** - `subscription.test.js`
   - 구독 상태 조회
   - 구독 생성
   - 구독 취소
   - 권한 확인

3. **AI 서비스** - `ai.test.js`
   - AI 헬스체크
   - FAQ 제안
   - 사용량 조회
   - Q&A 처리

4. **결제 (Payment)** - `payment.test.js`
   - 크레딧 충전
   - 할부 결제
   - 빌링키 관리
   - 웹훅 처리

5. **프로젝트 관리** - `projects.test.js`
   - 프로젝트 CRUD
   - 협업자 관리
   - 설정 관리

6. **헬스체크** - `health.test.js`
   - API 헬스체크
   - DB 연결 상태
   - 외부 서비스 모니터링

---

## 🚀 실행 방법

### 1. 환경 설정

```bash
# 루트 디렉토리로 이동
cd C:/!SSAL_Works_Private

# 환경 변수 파일 복사
cp S4_개발-3차/Testing/.env.test .env.test

# .env.test 파일의 실제 값 설정
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - TOSS_CLIENT_KEY, TOSS_SECRET_KEY
# - RESEND_API_KEY
# - AI API Keys (GEMINI, OPENAI, PERPLEXITY)
```

### 2. 테스트 실행

```bash
# 전체 테스트 실행
npm test

# 특정 테스트 파일만 실행
npm test -- auth.test.js
npm test -- subscription.test.js
npm test -- ai.test.js

# 커버리지 포함 실행
npm run test:coverage

# Watch 모드 (개발 시)
npm run test:watch
```

### 3. 테스트 결과 확인

```bash
# 커버리지 리포트 열기
open coverage/lcov-report/index.html

# 또는 텍스트로 확인
cat coverage/coverage-summary.json
```

---

## 📁 파일 구조

```
S4_개발-3차/Testing/
├── jest.config.js                      # Jest 설정
├── .env.test                            # 테스트 환경 변수
├── README_TESTS.md                      # 이 문서
├── tests/
│   ├── setup.js                         # 테스트 전역 설정
│   └── integration/
│       ├── auth.test.js                 # 인증 API 테스트
│       ├── subscription.test.js         # 구독 API 테스트
│       ├── ai.test.js                   # AI API 테스트
│       ├── payment.test.js              # 결제 API 테스트
│       ├── projects.test.js             # 프로젝트 API 테스트
│       └── health.test.js               # 헬스체크 테스트
└── coverage/                            # 커버리지 리포트 (자동 생성)
```

---

## ✅ 테스트 체크리스트

### 인증 API (auth.test.js)

- [x] Google OAuth 플로우 시작
- [x] 비 GET 요청 거부
- [x] OAuth 초기화 에러 처리
- [x] 로그아웃 처리
- [x] 토큰 없는 요청 거부
- [x] OAuth 콜백 처리
- [x] JWT 토큰 검증
- [x] 만료된 토큰 거부

### 구독 API (subscription.test.js)

- [x] 활성 구독 조회
- [x] 구독 없는 사용자 처리
- [x] 토큰 없는 요청 거부
- [x] 유효하지 않은 토큰 거부
- [x] 새 구독 생성
- [x] 중복 구독 방지
- [x] 구독 취소
- [x] 이미 취소된 구독 처리
- [x] 구독 권한 확인
- [x] 만료된 구독 거부
- [x] 구독 상태 전환

### AI API (ai.test.js)

- [x] 모든 AI 프로바이더 헬스체크
- [x] 프로바이더 실패 감지
- [x] 비 GET 요청 거부
- [x] FAQ 제안 생성
- [x] 구독 없는 요청 거부
- [x] AI 프로바이더 검증
- [x] 사용량 통계 조회
- [x] 총 사용량 계산
- [x] Q&A 처리
- [x] Rate limiting
- [x] AI 응답 검증
- [x] XSS 방지

### 결제 API (payment.test.js)

- [x] 크레딧 충전 요청
- [x] 유효하지 않은 금액 거부
- [x] 사용자 인증 검증
- [x] 결제 성공 콜백
- [x] 토스 API 검증
- [x] 결제 실패 콜백
- [x] 실패 로그 기록
- [x] 할부 결제 요청
- [x] 유효하지 않은 할부 기간 거부
- [x] 빌링키 등록
- [x] 중복 빌링키 방지
- [x] 빌링키로 결제
- [x] 비활성 빌링키 거부
- [x] 웹훅 처리
- [x] 웹훅 서명 검증
- [x] 웹훅 중복 처리 방지
- [x] 크레딧 잔액 조회
- [x] 크레딧 거래 내역

### 프로젝트 API (projects.test.js)

- [x] 새 프로젝트 생성
- [x] 프로젝트명 길이 검증
- [x] 사용자당 프로젝트 제한
- [x] 프로젝트 목록 조회
- [x] 상태별 필터링
- [x] 생성일 정렬
- [x] 프로젝트 상세 조회
- [x] 존재하지 않는 프로젝트 처리
- [x] 타인 프로젝트 접근 차단
- [x] 프로젝트 수정
- [x] 수정 페이로드 검증
- [x] 프로젝트 삭제 (Soft Delete)
- [x] 타인 프로젝트 삭제 차단
- [x] 관련 데이터 연쇄 삭제
- [x] 프로젝트 상태 관리
- [x] 설정 검증
- [x] 협업자 관리

### 헬스체크 API (health.test.js)

- [x] 정상 상태 응답
- [x] 데이터베이스 연결 확인
- [x] DB 연결 실패 감지
- [x] 서비스 다운 시 degraded 상태
- [x] Supabase 연결 테스트
- [x] 쿼리 지연시간 측정
- [x] 높은 지연시간 경고
- [x] 외부 서비스 상태 확인
- [x] 타임아웃 처리
- [x] 실패 시 재시도
- [x] 시스템 메트릭 조회
- [x] 높은 CPU 사용량 감지
- [x] 높은 메모리 사용량 감지
- [x] Uptime 계산
- [x] Readiness 체크
- [x] Liveness 체크
- [x] Circuit Breaker 패턴
- [x] Rate limiting

---

## 🎯 커버리지 목표

| 항목 | 목표 | 현재 |
|------|------|------|
| Branches | 70% | - |
| Functions | 70% | - |
| Lines | 70% | - |
| Statements | 70% | - |

---

## 🔧 테스트 설정

### Jest 설정 (jest.config.js)

- **환경**: Node.js
- **타임아웃**: 30초
- **커버리지**: 자동 수집
- **모킹**: Supabase, AI 서비스

### 환경 변수 (.env.test)

테스트 실행 전 `.env.test` 파일의 실제 값을 설정해야 합니다:

```bash
# 필수 설정
SUPABASE_URL=your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 선택적 (해당 기능 테스트 시)
TOSS_CLIENT_KEY=test_ck_...
GEMINI_API_KEY=...
OPENAI_API_KEY=...
```

---

## 🐛 디버깅

### 테스트 실패 시

```bash
# 상세 로그 출력
DEBUG=* npm test

# 특정 테스트만 실행
npm test -- --testNamePattern="should create new project"

# 실패한 테스트만 재실행
npm test -- --onlyFailures
```

### 모킹 문제

테스트에서 Supabase, AI 서비스 등은 모킹됩니다:

```javascript
// tests/setup.js에서 글로벌 헬퍼 제공
global.testHelpers.mockSupabaseClient()
```

실제 API 호출이 필요한 경우:
```bash
ENABLE_API_MOCKING=false npm test
```

---

## 📊 CI/CD 통합

### GitHub Actions 예시

```yaml
- name: Run Tests
  run: npm test
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

### Vercel Integration

```bash
# vercel.json에 테스트 추가
{
  "buildCommand": "npm run build && npm test"
}
```

---

## 📝 테스트 작성 가이드

### 새 테스트 추가

```javascript
/**
 * @task S4T2
 * @description 새로운 API 테스트
 */

describe('New API Tests', () => {
  it('should do something', async () => {
    // Arrange
    const req = { method: 'GET' };

    // Act
    const result = await handler(req);

    // Assert
    expect(result.status).toBe(200);
  });
});
```

### 베스트 프랙티스

1. **AAA 패턴** (Arrange, Act, Assert)
2. **명확한 테스트명** ("should ...")
3. **독립적인 테스트** (다른 테스트에 의존 X)
4. **모킹 활용** (외부 서비스)
5. **에지 케이스 테스트**

---

## 🚨 주의사항

### 운영 환경 격리

- **절대** 운영 DB로 테스트하지 마세요
- 테스트용 Supabase 프로젝트 사용
- `.env.test` 파일에 테스트 전용 키 사용

### API 키 보안

- `.env.test`를 **절대** Git에 커밋하지 마세요
- `.gitignore`에 `.env.test` 추가 확인
- CI/CD에서는 Secret 사용

### Rate Limiting

- 테스트 시 Rate Limit 비활성화
- `RATE_LIMIT_ENABLED=false` 설정

---

## 📞 문제 해결

### 자주 발생하는 오류

1. **"Cannot find module '@supabase/supabase-js'"**
   - 해결: `npm install` 실행

2. **"SUPABASE_URL is not defined"**
   - 해결: `.env.test` 파일 설정 확인

3. **"Timeout of 30000ms exceeded"**
   - 해결: `jest.config.js`의 `testTimeout` 증가

4. **"Mock function not called"**
   - 해결: `beforeEach`에서 `jest.clearAllMocks()` 확인

---

## 📚 참고 자료

- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
- [Testing Best Practices](https://testingjavascript.com/)

---

**작성자:** Claude Code (AI Agent)
**최종 수정:** 2025-12-20
**버전:** 1.0.0
