# S2T1: 인증 API 테스트

Task ID: S2T1
작성일: 2025-12-14
목적: 인증 관련 API 테스트 코드 작성

## 📁 디렉토리 구조

```
S2_개발-1차/Testing/
├── __tests__/                    # 테스트 파일
│   ├── auth-middleware.test.js   # 인증 미들웨어 테스트
│   ├── google-auth.test.js       # Google OAuth 테스트
│   ├── subscription.test.js      # 구독 API 테스트
│   └── email.test.js             # 이메일 API 테스트
├── __mocks__/                    # Mock 파일
│   ├── supabase.js               # Supabase 클라이언트 Mock
│   └── resend.js                 # Resend 클라이언트 Mock
├── jest.config.js                # Jest 설정
├── setup.js                      # 테스트 환경 초기화
├── package.json                  # 의존성 및 스크립트
└── README.md                     # 이 파일
```

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
cd S2_개발-1차/Testing
npm install
```

### 2. 전체 테스트 실행

```bash
npm test
```

### 3. 개별 테스트 실행

```bash
# 인증 미들웨어 테스트
npm run test:auth

# Google OAuth 테스트
npm run test:google

# 구독 API 테스트
npm run test:subscription

# 이메일 API 테스트
npm run test:email
```

### 4. 커버리지 리포트

```bash
npm run test:coverage
```

### 5. Watch 모드 (개발 중)

```bash
npm run test:watch
```

## 📝 테스트 항목

### 1. auth-middleware.test.js

**테스트 대상:** `S2_개발-1차/Security/api/lib/auth/middleware.js`

- ✅ Bearer 토큰 없을 때 AUTH_001 에러
- ✅ 잘못된 토큰 AUTH_002 에러
- ✅ 만료된 토큰 AUTH_003 에러
- ✅ 유효한 토큰 성공
- ✅ 에러 처리 (AUTH_500)
- ✅ Edge cases (빈 문자열, 대소문자)

**총 테스트 케이스:** 10개

### 2. google-auth.test.js

**테스트 대상:**
- `S2_개발-1차/Backend_APIs/api/auth/google.js`
- `S2_개발-1차/Backend_APIs/api/auth/logout.js`

**Google OAuth 시작 (`/api/auth/google`):**
- ✅ GET 요청 시 Google OAuth URL로 리다이렉트
- ✅ OPTIONS 요청 시 200 응답 (CORS Preflight)
- ✅ POST 요청 시 405 Method Not Allowed
- ✅ Supabase OAuth 에러 시 400 응답
- ✅ OAuth URL 없으면 500 응답

**로그아웃 (`/api/auth/logout`):**
- ✅ POST 요청 시 로그아웃 성공
- ✅ OPTIONS 요청 시 200 응답
- ✅ GET 요청 시 405 Method Not Allowed
- ✅ 쿠키 없이도 로그아웃 성공
- ✅ Supabase 에러 발생해도 쿠키 삭제

**총 테스트 케이스:** 10개

### 3. subscription.test.js

**테스트 대상:**
- `S2_개발-1차/Backend_APIs/api/subscription/status.js`
- `S2_개발-1차/Backend_APIs/api/subscription/create.js`
- `S2_개발-1차/Backend_APIs/api/subscription/cancel.js`

**구독 상태 조회 (`/api/subscription/status`):**
- ✅ 인증 없이 접근 시 401 에러 (AUTH_001)
- ✅ 잘못된 토큰 401 에러 (AUTH_002)
- ✅ 유효한 토큰으로 구독 정보 조회 성공
- ✅ 구독 없는 사용자는 null 반환
- ✅ POST 요청 시 405 Method Not Allowed

**구독 생성 (`/api/subscription/create`):**
- ✅ 인증 없이 접근 시 401 에러
- ✅ plan_id 없이 요청 시 400 에러
- ✅ 유효한 요청으로 구독 생성 성공
- ✅ 이미 활성 구독 있으면 409 에러
- ✅ 존재하지 않는 plan_id로 요청 시 404 에러

**총 테스트 케이스:** 11개

### 4. email.test.js

**테스트 대상:**
- `S2_개발-1차/Backend_APIs/api/email/send.js`
- `S2_개발-1차/Backend_APIs/api/email/welcome.js`
- `S2_개발-1차/Backend_APIs/api/email/password-reset.js`

**일반 이메일 발송 (`/api/email/send`):**
- ✅ 인증 없이 접근 시 401 에러
- ✅ 필수 필드 누락 시 400 에러
- ✅ 잘못된 이메일 형식 시 400 에러
- ✅ 유효한 요청으로 이메일 발송 성공
- ✅ GET 요청 시 405 Method Not Allowed

**환영 이메일 (`/api/email/welcome`):**
- ✅ 인증 없이 접근 시 401 에러
- ✅ 유효한 요청으로 환영 이메일 발송

**비밀번호 재설정 (`/api/email/password-reset`):**
- ✅ 인증 없이 접근 시 401 에러
- ✅ 유효한 요청으로 비밀번호 재설정 이메일 발송

**이메일 유효성 검사:**
- ✅ 다양한 이메일 형식 검증

**에러 처리:**
- ✅ 이메일 발송 실패 시 500 에러

**총 테스트 케이스:** 11개

## 📊 전체 통계

- **총 테스트 파일:** 4개
- **총 테스트 케이스:** 42개
- **커버리지 목표:** 80% 이상
- **테스트 프레임워크:** Jest 29.7.0

## 🔧 Mock 구조

### Supabase Mock

**Mock 기능:**
- `auth.getUser()` - 토큰 검증
- `auth.signOut()` - 로그아웃
- `auth.signInWithOAuth()` - OAuth 시작
- `from()` - 데이터베이스 쿼리 빌더

**Mock 토큰:**
- `valid-token` → 성공
- `invalid-token` → AUTH_002 에러
- `expired-token` → AUTH_003 에러
- (없음) → AUTH_001 에러

### Resend Mock

**Mock 기능:**
- `emails.send()` - 이메일 발송

**Mock 응답:**
- 성공: `{ data: { id: 'mock-email-id-...' } }`
- 실패: `throw new Error('...')`

## ✅ 테스트 실행 결과 예시

```bash
$ npm test

PASS  __tests__/auth-middleware.test.js
  Auth Middleware - verifyAuth()
    ✓ Bearer 토큰 없을 때 AUTH_001 에러 (5ms)
    ✓ 잘못된 토큰 AUTH_002 에러 (3ms)
    ✓ 만료된 토큰 AUTH_003 에러 (2ms)
    ✓ 유효한 토큰 성공 (4ms)
    ...

PASS  __tests__/google-auth.test.js
  Google OAuth API
    ✓ GET 요청 시 Google OAuth URL로 리다이렉트 (8ms)
    ✓ POST 요청 시 405 Method Not Allowed (3ms)
    ...

PASS  __tests__/subscription.test.js
  Subscription API
    ✓ 인증 없이 접근 시 401 에러 (4ms)
    ✓ 유효한 토큰으로 구독 정보 조회 성공 (6ms)
    ...

PASS  __tests__/email.test.js
  Email API
    ✓ 인증 없이 접근 시 401 에러 (3ms)
    ✓ 유효한 요청으로 이메일 발송 성공 (5ms)
    ...

Test Suites: 4 passed, 4 total
Tests:       42 passed, 42 total
Snapshots:   0 total
Time:        2.345 s
```

## 🔍 커버리지 리포트 예시

```bash
$ npm run test:coverage

------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|-------------------
All files               |   85.23 |    78.45 |   89.12 |   86.34 |
 auth/middleware.js     |   92.00 |    85.00 |   95.00 |   93.50 | 67-69
 auth/google.js         |   88.50 |    75.00 |   90.00 |   89.00 | 72-74
 subscription/status.js |   84.00 |    80.00 |   88.00 |   85.50 | 95-98
 email/send.js          |   82.00 |    72.00 |   85.00 |   83.00 | 105-110
------------------------|---------|----------|---------|---------|-------------------
```

## 📚 참고 자료

- [Jest 공식 문서](https://jestjs.io/)
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Resend API 문서](https://resend.com/docs)

## 🎯 다음 단계

1. ✅ 테스트 코드 작성 완료
2. ⏳ 실제 API와 통합 테스트
3. ⏳ E2E 테스트 추가
4. ⏳ CI/CD 파이프라인 통합

---

**작성자:** Claude Code
**날짜:** 2025-12-14
**버전:** 1.0.0
