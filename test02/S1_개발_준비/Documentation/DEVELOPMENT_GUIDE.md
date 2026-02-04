# SSALWorks v1.0 Development Guide

## Overview

SSALWorks v1.0 프로덕션 개발을 위한 코딩 컨벤션, 파일 명명 규칙, Serverless API 구조 가이드입니다.

---

## 1. 기술 스택

### Frontend
- HTML5
- CSS3 (CSS Variables 사용)
- Vanilla JavaScript (ES6+)

### Backend
- Vercel Serverless Functions
- Node.js Runtime

### Database & Auth
- Supabase (PostgreSQL)
- Supabase Auth (Google OAuth)

### External Services
- Toss Payments (결제)
- Resend (이메일)
- OpenAI / Google AI / Perplexity (AI APIs)

---

## 2. 코딩 컨벤션

### 2.1 JavaScript 스타일 가이드

```javascript
// 변수 선언
const MAX_RETRY_COUNT = 3;        // 상수: UPPER_SNAKE_CASE
let currentUser = null;           // 변수: camelCase
const userData = {};              // 객체: camelCase

// 함수 선언
function calculateTotal(items) {  // 함수: camelCase
    return items.reduce((sum, item) => sum + item.price, 0);
}

// 클래스/컴포넌트
class UserProfile {               // 클래스: PascalCase
    constructor(name) {
        this.name = name;
    }
}

// async/await 사용
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}
```

### 2.2 네이밍 규칙 요약

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수 | camelCase | `userName`, `isLoggedIn` |
| 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS`, `API_URL` |
| 함수 | camelCase | `getUserProfile()`, `handleClick()` |
| 클래스 | PascalCase | `UserProfile`, `PaymentService` |
| 파일 (컴포넌트) | PascalCase | `ProfileCard.js`, `ModalPopup.js` |
| 파일 (유틸리티) | camelCase | `formatDate.js`, `validateEmail.js` |
| 파일 (상수) | UPPER_SNAKE_CASE | `API_ENDPOINTS.js`, `CONFIG.js` |
| API 라우트 | kebab-case | `/api/auth/google-callback` |
| CSS 클래스 | kebab-case | `.user-profile`, `.btn-primary` |
| 환경변수 | UPPER_SNAKE_CASE | `SUPABASE_URL`, `GOOGLE_CLIENT_ID` |

### 2.3 주석 작성 규칙

```javascript
// 한 줄 주석: 간단한 설명

/*
 * 여러 줄 주석:
 * 복잡한 로직이나 중요한 비즈니스 규칙 설명
 */

/**
 * JSDoc 스타일 함수 문서화
 * @param {string} userId - 사용자 ID
 * @param {Object} options - 옵션 객체
 * @returns {Promise<Object>} 사용자 데이터
 */
async function getUser(userId, options) {
    // ...
}

// TODO: 추후 구현 필요한 기능
// FIXME: 버그 수정 필요
// HACK: 임시 해결책 (추후 리팩토링 필요)
// NOTE: 중요한 참고사항
```

---

## 3. 파일 명명 규칙

### 3.1 프론트엔드 파일

```
P3_프로토타입_제작/Frontend/Prototype/
├── pages/
│   ├── subscription/
│   │   ├── plans.html           # 페이지: kebab-case
│   │   └── payment-method.html
│   └── admin/
│       └── dashboard.html
├── js/
│   ├── components/
│   │   └── ModalPopup.js        # 컴포넌트: PascalCase
│   ├── utils/
│   │   ├── formatDate.js        # 유틸리티: camelCase
│   │   └── validateEmail.js
│   └── constants/
│       └── API_ENDPOINTS.js     # 상수: UPPER_SNAKE_CASE
├── css/
│   └── styles.css
└── assets/
    └── images/
```

### 3.2 API 라우트 파일

```
api/
├── auth/
│   ├── google.js                # 단일 기능: camelCase
│   ├── google-callback.js       # 복합어: kebab-case
│   └── logout.js
├── subscription/
│   ├── create.js
│   ├── status.js
│   ├── cancel.js
│   └── pause.js
├── payment/
│   ├── request.js
│   ├── webhook.js
│   └── billing-key.js           # 복합어: kebab-case
├── ai/
│   ├── query.js
│   └── credit-check.js
└── lib/
    ├── supabase.js              # 공통 라이브러리
    ├── auth.js
    └── errorHandler.js
```

---

## 4. Serverless API 구조

### 4.1 기본 API 핸들러 패턴

```javascript
// api/auth/google.js
export default async function handler(req, res) {
    // 1. HTTP 메서드 검증
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 2. 비즈니스 로직
        const result = await processGoogleAuth(req);

        // 3. 성공 응답
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        // 4. 에러 처리
        console.error('Google Auth Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
```

### 4.2 API 응답 형식

```javascript
// 성공 응답
{
    "success": true,
    "data": { ... },
    "message": "Operation completed successfully"
}

// 에러 응답
{
    "success": false,
    "error": "Error message",
    "code": "ERROR_CODE"
}

// 목록 응답 (페이지네이션)
{
    "success": true,
    "data": [...],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100,
        "totalPages": 10
    }
}
```

### 4.3 공통 미들웨어 패턴

```javascript
// api/lib/auth.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function verifyAuth(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No authorization token');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        throw new Error('Invalid token');
    }

    return user;
}
```

---

## 5. 디렉토리 구조

### 5.1 전체 프로젝트 구조

```
SSALWorks/
├── P1_사업계획/                    # 사업계획 문서
├── P2_프로젝트_기획/               # 프로젝트 기획 문서
│   ├── Requirements/
│   ├── Design_System/
│   └── User_Flows/
├── P3_프로토타입_제작/             # 프로토타입 (프론트엔드)
│   ├── Frontend/
│   │   └── Prototype/
│   │       ├── index.html
│   │       ├── pages/
│   │       ├── js/
│   │       ├── css/
│   │       └── api/               # Vercel Serverless Functions
│   ├── Database/
│   │   └── *.sql                  # Supabase SQL 파일
│   └── Documentation/
├── S1_개발_준비/                   # 개발 환경 준비
│   ├── Backend_Infra/
│   ├── Database/
│   ├── Documentation/
│   └── Security/
├── Project-SSAL-Grid/             # 프로젝트 관리 Grid
├── Web_ClaudeCode_Bridge/         # AI 통신 브릿지
└── .env.example                   # 환경변수 템플릿
```

### 5.2 API 디렉토리 상세

```
api/
├── auth/
│   ├── google.js              # GET: Google OAuth 시작
│   ├── google-callback.js     # GET: OAuth 콜백 처리
│   ├── logout.js              # POST: 로그아웃
│   └── session.js             # GET: 세션 확인
│
├── subscription/
│   ├── plans.js               # GET: 구독 플랜 목록
│   ├── create.js              # POST: 구독 생성
│   ├── status.js              # GET: 구독 상태 조회
│   ├── cancel.js              # POST: 구독 해지
│   ├── pause.js               # POST: 구독 일시정지
│   └── resume.js              # POST: 구독 재개
│
├── payment/
│   ├── request.js             # POST: 결제 요청
│   ├── webhook.js             # POST: 토스 웹훅
│   ├── billing-key.js         # POST: 빌링키 발급
│   └── history.js             # GET: 결제 내역
│
├── ai/
│   ├── query.js               # POST: AI 질의
│   ├── credit-check.js        # GET: 크레딧 확인
│   └── usage-log.js           # GET: 사용 로그
│
├── admin/
│   ├── users.js               # GET: 사용자 목록
│   ├── stats.js               # GET: 통계
│   └── contents.js            # CRUD: 콘텐츠 관리
│
├── health.js                  # GET: 헬스체크
│
└── lib/
    ├── supabase.js            # Supabase 클라이언트
    ├── auth.js                # 인증 미들웨어
    ├── cors.js                # CORS 설정
    ├── errorHandler.js        # 에러 핸들링
    └── validators.js          # 입력 검증
```

---

## 6. 환경변수 규칙

### 6.1 네이밍 규칙

```env
# 서비스명_용도
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=

# 카테고리별 그룹화
# -- AI APIs --
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=
PERPLEXITY_API_KEY=

# -- App Config --
APP_URL=
NODE_ENV=
```

### 6.2 환경별 구분

| 환경 | 용도 | 파일 |
|------|------|------|
| Development | 로컬 개발 | `.env.local` |
| Preview | PR/브랜치 미리보기 | Vercel Dashboard |
| Production | 프로덕션 배포 | Vercel Dashboard |

### 6.3 필수 환경변수 목록

- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `TOSS_CLIENT_KEY`
- [ ] `TOSS_SECRET_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `OPENAI_API_KEY` (또는 다른 AI API)
- [ ] `APP_URL`
- [ ] `CRON_SECRET`

---

## 7. ESLint / Prettier 설정

### 7.1 ESLint (.eslintrc.json)

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 4],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

### 7.2 Prettier (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 4,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 8. Git 규칙

### 8.1 브랜치 전략

```
master          # 프로덕션 배포
├── develop     # 개발 통합
│   ├── feature/auth-google      # 기능 개발
│   ├── feature/payment-toss     # 기능 개발
│   └── bugfix/login-error       # 버그 수정
└── hotfix/critical-fix          # 긴급 수정
```

### 8.2 커밋 메시지 규칙

```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드, 설정 파일 변경

예시:
feat: Google OAuth 로그인 구현
fix: 결제 웹훅 응답 오류 수정
docs: API 문서 업데이트
```

---

## 9. 참고 자료

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Supabase Documentation](https://supabase.com/docs)
- [Toss Payments API](https://docs.tosspayments.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Last Updated**: 2025-12-13
**Version**: 1.0
