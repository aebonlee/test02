<!-- Task ID: S2M1 -->
# SSALWorks API Documentation v1.0

> **작성일**: 2025-12-14
> **버전**: 1.0.0
> **대상**: 인증/구독/이메일 Serverless API

---

## 📑 목차

1. [개요](#개요)
2. [Base URL & 인증](#base-url--인증)
3. [Auth API](#auth-api)
4. [Email API](#email-api)
5. [Subscription API](#subscription-api)
6. [에러 코드](#에러-코드)
7. [사용 예시](#사용-예시)

---

## 개요

SSALWorks의 Serverless API는 Vercel Functions와 Supabase를 기반으로 구현되었습니다.

### 기술 스택
- **Runtime**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (JWT)
- **Email**: Resend API

### API 카테고리
- **Auth API**: Google OAuth 인증, 로그아웃
- **Email API**: 일반 이메일, 환영 이메일, 비밀번호 재설정
- **Subscription API**: 구독 신청, 상태 조회, 해지

---

## Base URL & 인증

### Base URL

**Development:**
```
http://localhost:3000
```

**Production:**
```
https://yourdomain.com
```

### 인증 방식

대부분의 API는 **Bearer Token** 인증을 요구합니다.

**요청 헤더:**
```http
Authorization: Bearer {access_token}
```

**토큰 획득 방법:**
1. Google OAuth 로그인 후 쿠키(`sb-access-token`)에서 자동 획득
2. 또는 클라이언트에서 `supabase.auth.getSession()` 사용

**토큰 유효기간:**
- Access Token: 7일
- Refresh Token으로 자동 갱신 (Supabase SDK 처리)

---

## Auth API

### 1. Google OAuth 로그인 시작

Google OAuth 인증 프로세스를 시작합니다.

**Endpoint:**
```
GET /api/auth/google
```

**인증:** 불필요

**요청 예시:**
```bash
curl -X GET https://yourdomain.com/api/auth/google
```

**응답:**
- **302 Redirect**: Google OAuth URL로 리다이렉트
- Google 로그인 페이지로 이동

**에러 응답 (400):**
```json
{
  "error": "Google OAuth 시작 실패",
  "details": "Error message"
}
```

**에러 응답 (500):**
```json
{
  "error": "OAuth URL 생성 실패"
}
```

---

### 2. Google OAuth 콜백

Google 인증 후 콜백을 처리하고 세션을 설정합니다.

**Endpoint:**
```
GET /api/auth/google/callback
```

**인증:** 불필요 (Google이 처리)

**Query Parameters:**
- `code` (string): OAuth 인증 코드 (Google이 자동 전달)
- `error` (string, optional): OAuth 에러 코드
- `error_description` (string, optional): 에러 설명

**성공 응답:**
- **302 Redirect**: 메인 페이지(`/`)로 리다이렉트
- HttpOnly 쿠키 설정:
  - `sb-access-token`: 액세스 토큰 (7일 유효)
  - `sb-refresh-token`: 리프레시 토큰 (7일 유효)

**세션 쿠키:**
```
Set-Cookie: sb-access-token=xxx; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
Set-Cookie: sb-refresh-token=xxx; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

**에러 응답:**
- **302 Redirect**: 로그인 페이지로 리다이렉트 (에러 파라미터 포함)

**에러 리다이렉트 예시:**
```
/auth/login?error=exchange_failed&error_description=Invalid+code
```

**사용자 정보 자동 저장:**
- `users` 테이블에 자동 upsert:
  - `user_id`: Supabase Auth User ID
  - `email`: 사용자 이메일
  - `name`: 사용자 이름
  - `profile_image`: 프로필 이미지 URL

---

### 3. 로그아웃

현재 세션을 종료하고 쿠키를 삭제합니다.

**Endpoint:**
```
POST /api/auth/logout
```

**인증:** 불필요 (쿠키 기반)

**요청 예시:**
```bash
curl -X POST https://yourdomain.com/api/auth/logout \
  -H "Cookie: sb-access-token=xxx"
```

**성공 응답 (200):**
```json
{
  "success": true,
  "message": "로그아웃 성공"
}
```

**쿠키 삭제:**
```
Set-Cookie: sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0
Set-Cookie: sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0
```

**에러 응답 (500):**
```json
{
  "error": "Internal server error",
  "details": "Error message"
}
```

**참고:**
- 에러가 발생해도 쿠키는 삭제됨
- Supabase 세션도 함께 종료

---

## Email API

### 1. 일반 이메일 발송

사용자 정의 HTML 이메일을 발송합니다.

**Endpoint:**
```
POST /api/email/send
```

**인증:** Bearer Token (필수)

**요청 헤더:**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 Body:**
```json
{
  "to": "user@example.com",
  "subject": "제목",
  "html": "<h1>내용</h1><p>본문...</p>"
}
```

**필수 필드:**
- `to` (string): 수신자 이메일 (이메일 형식 검증)
- `subject` (string): 이메일 제목
- `html` (string): HTML 이메일 본문

**성공 응답 (200):**
```json
{
  "success": true,
  "data": {
    "id": "resend_id_abc123",
    "to": "user@example.com",
    "subject": "제목"
  }
}
```

**에러 응답 (400 - 검증 실패):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format"
  }
}
```

**에러 응답 (401 - 인증 실패):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "No token provided"
  }
}
```

**에러 응답 (500 - 발송 실패):**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_SEND_ERROR",
    "message": "Failed to send email",
    "details": "Resend API error"
  }
}
```

**curl 예시:**
```bash
curl -X POST https://yourdomain.com/api/email/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "테스트 이메일",
    "html": "<h1>안녕하세요</h1><p>테스트 메시지입니다.</p>"
  }'
```

---

### 2. 환영 이메일 발송

신규 가입자에게 환영 이메일을 발송합니다.

**Endpoint:**
```
POST /api/email/welcome
```

**인증:** Bearer Token (필수)

**요청 헤더:**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 Body:**
```json
{
  "to": "newuser@example.com",
  "name": "홍길동",
  "dashboardUrl": "https://yourdomain.com/dashboard"
}
```

**필수 필드:**
- `to` (string): 수신자 이메일
- `name` (string): 사용자 이름
- `dashboardUrl` (string, optional): 대시보드 URL (기본값: `NEXT_PUBLIC_SITE_URL/dashboard`)

**성공 응답 (200):**
```json
{
  "success": true,
  "data": {
    "id": "resend_id_def456",
    "to": "newuser@example.com",
    "name": "홍길동"
  }
}
```

**에러 응답:**
- 400: 검증 실패 (`VALIDATION_ERROR`)
- 401: 인증 실패 (`AUTH_001`, `AUTH_002`, `AUTH_003`)
- 500: 발송 실패 (`EMAIL_SEND_ERROR`)

**이메일 템플릿:**
- 제목: "SSALWorks에 오신 것을 환영합니다!"
- 본문: 사용자 이름, 환영 메시지, 대시보드 링크 포함
- 템플릿 파일: `S2_개발-1차/Backend_Infra/api/lib/email/templates/welcome.js`

**curl 예시:**
```bash
curl -X POST https://yourdomain.com/api/email/welcome \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "newuser@example.com",
    "name": "홍길동"
  }'
```

---

### 3. 비밀번호 재설정 이메일

비밀번호 재설정 링크가 포함된 이메일을 발송합니다.

**Endpoint:**
```
POST /api/email/password-reset
```

**인증:** Bearer Token 또는 내부 호출

**요청 헤더 (Bearer Token):**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 헤더 (내부 호출):**
```http
X-Internal-Call: {INTERNAL_API_SECRET}
Content-Type: application/json
```

**요청 Body:**
```json
{
  "to": "user@example.com",
  "name": "홍길동",
  "resetToken": "secure_token_12345678901234567890",
  "expiryMinutes": 30
}
```

**필수 필드:**
- `to` (string): 수신자 이메일
- `name` (string): 사용자 이름
- `resetToken` (string): 비밀번호 재설정 토큰 (최소 20자)
- `expiryMinutes` (number, optional): 만료 시간 (기본값: 30분)

**성공 응답 (200):**
```json
{
  "success": true,
  "data": {
    "id": "resend_id_ghi789",
    "to": "user@example.com",
    "name": "홍길동",
    "expiresIn": "30 minutes"
  }
}
```

**에러 응답 (400 - 토큰 짧음):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Reset token must be at least 20 characters"
  }
}
```

**에러 응답:**
- 400: 검증 실패 (`VALIDATION_ERROR`)
- 401: 인증 실패 (`AUTH_001`, `AUTH_002`, `AUTH_003`)
- 500: 발송 실패 (`EMAIL_SEND_ERROR`)

**리셋 URL 생성:**
```
{NEXT_PUBLIC_SITE_URL}/auth/reset-password?token={resetToken}
```

**이메일 템플릿:**
- 제목: "SSALWorks 비밀번호 재설정"
- 본문: 사용자 이름, 리셋 링크, 만료 시간 포함
- 템플릿 파일: `S2_개발-1차/Backend_Infra/api/lib/email/templates/password-reset.js`

**curl 예시:**
```bash
curl -X POST https://yourdomain.com/api/email/password-reset \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "name": "홍길동",
    "resetToken": "abc123def456ghi789jkl012mno345pqr678",
    "expiryMinutes": 30
  }'
```

**내부 호출 예시:**
```bash
curl -X POST https://yourdomain.com/api/email/password-reset \
  -H "X-Internal-Call: YOUR_INTERNAL_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "name": "홍길동",
    "resetToken": "abc123def456ghi789jkl012mno345pqr678"
  }'
```

---

## Subscription API

### 1. 구독 상태 조회

현재 사용자의 구독 정보를 조회합니다.

**Endpoint:**
```
GET /api/subscription/status
```

**인증:** Bearer Token (필수)

**요청 헤더:**
```http
Authorization: Bearer {access_token}
```

**성공 응답 (200 - 구독 있음):**
```json
{
  "subscription": {
    "id": "sub_abc123",
    "user_id": "user_456",
    "plan_id": "plan_789",
    "status": "active",
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": null,
    "cancelled_at": null,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z",
    "plan": {
      "id": "plan_789",
      "name": "Pro Plan",
      "price": 29000,
      "interval": "month",
      "description": "프로 플랜"
    }
  }
}
```

**성공 응답 (200 - 구독 없음):**
```json
{
  "subscription": null,
  "status": "none",
  "message": "No active subscription found"
}
```

**에러 응답 (401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "No token provided"
  }
}
```

**에러 응답 (500):**
```json
{
  "success": false,
  "error": {
    "code": "DB_ERROR",
    "message": "Failed to fetch subscription"
  }
}
```

**curl 예시:**
```bash
curl -X GET https://yourdomain.com/api/subscription/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. 구독 신청

새로운 구독을 신청합니다.

**Endpoint:**
```
POST /api/subscription/create
```

**인증:** Bearer Token (필수)

**요청 헤더:**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 Body:**
```json
{
  "plan_id": "plan_789"
}
```

**필수 필드:**
- `plan_id` (string): 구독 플랜 ID

**성공 응답 (201 Created):**
```json
{
  "subscription": {
    "id": "sub_new123",
    "user_id": "user_456",
    "plan_id": "plan_789",
    "status": "pending",
    "start_date": "2025-12-14T10:00:00Z",
    "end_date": null,
    "cancelled_at": null,
    "created_at": "2025-12-14T10:00:00Z",
    "updated_at": "2025-12-14T10:00:00Z",
    "plan": {
      "id": "plan_789",
      "name": "Pro Plan",
      "price": 29000,
      "interval": "month"
    }
  },
  "message": "Subscription created successfully"
}
```

**에러 응답 (400 - plan_id 없음):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "plan_id is required"
  }
}
```

**에러 응답 (404 - 플랜 없음):**
```json
{
  "success": false,
  "error": {
    "code": "PLAN_NOT_FOUND",
    "message": "Subscription plan not found"
  }
}
```

**에러 응답 (409 - 중복 구독):**
```json
{
  "success": false,
  "error": {
    "code": "SUBSCRIPTION_EXISTS",
    "message": "You already have an active or pending subscription"
  }
}
```

**비즈니스 로직:**
1. `plan_id` 검증
2. 기존 구독 체크 (`pending` 또는 `active` 상태)
3. 플랜 존재 확인
4. 구독 생성 (초기 상태: `pending`)
5. `users` 테이블 `subscription_status` 자동 업데이트

**상태 전환:**
- `pending` → `active`: 결제 완료 시 (S4BA1 결제 API에서 처리)

**curl 예시:**
```bash
curl -X POST https://yourdomain.com/api/subscription/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "plan_789"
  }'
```

---

### 3. 구독 해지

활성 구독을 해지합니다.

**Endpoint:**
```
POST /api/subscription/cancel
```

**인증:** Bearer Token (필수)

**요청 헤더:**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**요청 Body:**
```json
{}
```
(Body 없음 - Bearer Token에서 사용자 식별)

**성공 응답 (200):**
```json
{
  "subscription": {
    "id": "sub_abc123",
    "user_id": "user_456",
    "plan_id": "plan_789",
    "status": "cancelled",
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": null,
    "cancelled_at": "2025-12-14T10:30:00Z",
    "updated_at": "2025-12-14T10:30:00Z",
    "plan": {
      "id": "plan_789",
      "name": "Pro Plan",
      "price": 29000,
      "interval": "month"
    }
  },
  "message": "Subscription cancelled successfully"
}
```

**에러 응답 (404 - 활성 구독 없음):**
```json
{
  "success": false,
  "error": {
    "code": "NO_ACTIVE_SUBSCRIPTION",
    "message": "No active subscription to cancel"
  }
}
```

**에러 응답 (401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "No token provided"
  }
}
```

**비즈니스 로직:**
1. 사용자의 `active` 상태 구독 조회
2. 구독 상태를 `cancelled`로 변경
3. `cancelled_at` 타임스탬프 기록
4. `users` 테이블 `subscription_status` 자동 업데이트

**curl 예시:**
```bash
curl -X POST https://yourdomain.com/api/subscription/cancel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 에러 코드

### 인증 에러 (AUTH_xxx)

| 코드 | HTTP | 설명 |
|------|------|------|
| `AUTH_001` | 401 | No token provided |
| `AUTH_002` | 401 | Invalid token |
| `AUTH_003` | 401 | Token expired |
| `AUTH_004` | 403 | Access forbidden |
| `AUTH_005` | 403 | Admin access required |
| `AUTH_006` | 404 | User not found |
| `AUTH_007` | 403 | User account suspended |
| `AUTH_500` | 500 | Authentication service error |

### API 공통 에러 (API_xxx)

| 코드 | HTTP | 설명 |
|------|------|------|
| `API_400` | 400 | Bad request |
| `API_401` | 400 | Validation error |
| `API_404` | 404 | Resource not found |
| `API_405` | 405 | Method not allowed |
| `API_500` | 500 | Internal server error |
| `API_501` | 500 | Database error |
| `API_502` | 502 | External service error |

### 이메일 에러

| 코드 | HTTP | 설명 |
|------|------|------|
| `VALIDATION_ERROR` | 400 | 필수 필드 누락 또는 형식 오류 |
| `EMAIL_SEND_ERROR` | 500 | 이메일 발송 실패 (Resend API 오류) |
| `INTERNAL_ERROR` | 500 | 예상치 못한 서버 오류 |

### 구독 에러

| 코드 | HTTP | 설명 |
|------|------|------|
| `SUBSCRIPTION_EXISTS` | 409 | 이미 활성/대기 중인 구독 존재 |
| `PLAN_NOT_FOUND` | 404 | 구독 플랜을 찾을 수 없음 |
| `NO_ACTIVE_SUBSCRIPTION` | 404 | 해지할 활성 구독이 없음 |
| `DB_ERROR` | 500 | 데이터베이스 오류 |

### 에러 응답 형식

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": "Additional details (optional)"
  }
}
```

---

## 사용 예시

### JavaScript/TypeScript (Frontend)

#### 1. Google 로그인

```javascript
// Google OAuth 로그인 시작
function loginWithGoogle() {
  window.location.href = '/api/auth/google';
}
```

#### 2. 로그아웃

```javascript
async function logout() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include' // 쿠키 포함
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = '/auth/login';
    }
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}
```

#### 3. 구독 상태 조회

```javascript
async function getSubscriptionStatus() {
  try {
    const token = getCookie('sb-access-token');

    const response = await fetch('/api/subscription/status', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.subscription) {
      console.log('구독 상태:', data.subscription.status);
      console.log('플랜:', data.subscription.plan.name);
    } else {
      console.log('구독 없음');
    }
  } catch (error) {
    console.error('조회 실패:', error);
  }
}
```

#### 4. 구독 신청

```javascript
async function createSubscription(planId) {
  try {
    const token = getCookie('sb-access-token');

    const response = await fetch('/api/subscription/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ plan_id: planId })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('구독 신청 완료:', data.subscription);
      alert('구독 신청이 완료되었습니다!');
    } else {
      console.error('구독 신청 실패:', data.error);
      alert(`오류: ${data.error.message}`);
    }
  } catch (error) {
    console.error('구독 신청 오류:', error);
  }
}
```

#### 5. 환영 이메일 발송

```javascript
async function sendWelcomeEmail(userEmail, userName) {
  try {
    const token = getCookie('sb-access-token');

    const response = await fetch('/api/email/welcome', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: userEmail,
        name: userName
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('환영 이메일 발송 완료:', data.data);
    }
  } catch (error) {
    console.error('이메일 발송 실패:', error);
  }
}
```

#### 6. 비밀번호 재설정 이메일

```javascript
async function sendPasswordResetEmail(userEmail, userName, resetToken) {
  try {
    const token = getCookie('sb-access-token');

    const response = await fetch('/api/email/password-reset', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: userEmail,
        name: userName,
        resetToken: resetToken,
        expiryMinutes: 30
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('비밀번호 재설정 이메일 발송 완료');
    }
  } catch (error) {
    console.error('이메일 발송 실패:', error);
  }
}
```

### React/Next.js 사용 예시

```typescript
import { useState, useEffect } from 'react';

function SubscriptionDashboard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  async function fetchSubscription() {
    const token = getCookie('sb-access-token');

    const response = await fetch('/api/subscription/status', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    setSubscription(data.subscription);
    setLoading(false);
  }

  async function handleCancel() {
    if (!confirm('구독을 해지하시겠습니까?')) return;

    const token = getCookie('sb-access-token');

    const response = await fetch('/api/subscription/cancel', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      alert('구독이 해지되었습니다.');
      fetchSubscription(); // 새로고침
    }
  }

  if (loading) return <div>로딩 중...</div>;

  if (!subscription) {
    return <div>구독 정보가 없습니다.</div>;
  }

  return (
    <div>
      <h2>내 구독</h2>
      <p>플랜: {subscription.plan.name}</p>
      <p>상태: {subscription.status}</p>
      <p>가격: {subscription.plan.price.toLocaleString()}원</p>
      {subscription.status === 'active' && (
        <button onClick={handleCancel}>구독 해지</button>
      )}
    </div>
  );
}
```

### 쿠키 헬퍼 함수

```javascript
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
```

---

## 환경 변수

다음 환경 변수가 Vercel에 설정되어 있어야 합니다:

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Internal API Secret (password-reset용)
INTERNAL_API_SECRET=your-secret-key
```

---

## CORS 설정

모든 API는 CORS를 지원합니다:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, ...
Access-Control-Allow-Credentials: true
```

**프로덕션 권장사항:**
- `Access-Control-Allow-Origin`을 특정 도메인으로 제한
- Vercel 환경 변수에 `ALLOWED_ORIGINS` 설정

---

## Rate Limiting

**현재 상태:** 미구현

**프로덕션 권장사항:**
- Vercel Edge Config로 Rate Limiting 구현
- IP 기반 또는 사용자 기반 제한
- 권장 제한: 100 req/min per user

---

## 보안 고려사항

1. **Bearer Token 보호**
   - HttpOnly 쿠키 사용 (JavaScript 접근 불가)
   - Secure 플래그 (HTTPS only)
   - SameSite=Lax (CSRF 방지)

2. **Service Role Key 보호**
   - 절대 클라이언트에 노출 금지
   - 서버 측 API에서만 사용

3. **입력 검증**
   - 이메일 형식 검증
   - 필수 필드 검증
   - SQL Injection 방지 (Supabase가 처리)

4. **에러 메시지**
   - 민감한 정보 노출 방지
   - 표준화된 에러 코드 사용

---

## 테스트 방법

### Postman Collection

**환경 변수 설정:**
- `base_url`: `http://localhost:3000` 또는 `https://yourdomain.com`
- `token`: Bearer Token

**테스트 순서:**
1. Google OAuth 로그인 (브라우저에서)
2. 쿠키에서 `sb-access-token` 복사
3. Postman 환경 변수 `token`에 저장
4. 각 API 테스트 실행

### curl 테스트

```bash
# 1. Google 로그인 (브라우저에서)
# http://localhost:3000/api/auth/google

# 2. 쿠키에서 토큰 추출
TOKEN="YOUR_TOKEN_HERE"

# 3. 구독 상태 조회
curl -X GET http://localhost:3000/api/subscription/status \
  -H "Authorization: Bearer $TOKEN"

# 4. 구독 신청
curl -X POST http://localhost:3000/api/subscription/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan_id":"plan_123"}'

# 5. 환영 이메일
curl -X POST http://localhost:3000/api/email/welcome \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","name":"홍길동"}'

# 6. 로그아웃
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: sb-access-token=$TOKEN"
```

---

## 관련 Task

| Task ID | Task Name | 관계 |
|---------|-----------|------|
| S2BA1 | Google OAuth API | Auth API 구현 |
| S2BA2 | Email APIs | Email API 구현 |
| S2BA3 | Subscription APIs | Subscription API 구현 |
| S2S1 | 인증 미들웨어 | 인증 시스템 |
| S2BI1 | Email 모듈 | 이메일 템플릿 |

---

## Changelog

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2025-12-14 | 초기 문서 작성 (Auth, Email, Subscription API) |

---

**작성자:** Claude Code (documentation-specialist)
**Task ID:** S2M1
**최종 수정:** 2025-12-14
