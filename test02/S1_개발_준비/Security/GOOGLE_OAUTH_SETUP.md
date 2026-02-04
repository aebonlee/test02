# SSALWorks v1.0 Google OAuth Setup Guide

## Overview

SSALWorks v1.0 **Google OAuth** 설정 가이드입니다.
Supabase Authentication과 Google OAuth Provider 설정을 다룹니다.

**Task ID**: S1S1
**Area**: Security (S)
**Stage**: S1 (개발 준비)
**상태**: ✅ 설정 완료 및 테스트 성공 (2025-12-15)

---

## 1. Supabase Authentication 구조

### 1.1 프로젝트 정보

| 항목 | 값 |
|------|-----|
| **Supabase Project ID** | `zwjmfewyshhwpgwdtrus` |
| **Supabase URL** | `https://zwjmfewyshhwpgwdtrus.supabase.co` |
| **Callback URL** | `https://zwjmfewyshhwpgwdtrus.supabase.co/auth/v1/callback` |

### 1.2 인증 흐름

```
사용자 → Google OAuth → Supabase Auth → SSALWorks 앱
                ↓
        Google Cloud Console
        (OAuth 2.0 Client)
```

### 1.3 지원 인증 방식

| 방식 | 상태 | 설명 |
|------|------|------|
| Google OAuth | ✅ 활성화 | 주요 인증 방식 |
| Email/Password | ❌ 비활성화 | 사용 안 함 |
| Magic Link | ❌ 비활성화 | 사용 안 함 |

---

## 2. Google OAuth Provider 설정 (실제 구현)

### 2.1 Google Cloud Console 설정

**프로젝트**: ssalworks

**Step 1: OAuth 동의 화면 구성** ✅ 완료
```
APIs & Services → OAuth consent screen

- User Type: External
- App name: SSAL Works
- Scopes: email, profile, openid
```

**Step 2: OAuth 2.0 클라이언트 생성** ✅ 완료
```
APIs & Services → Credentials → Create Credentials → OAuth client ID

⚠️ 중요: Application type은 반드시 "Web application" 선택!
("Desktop" 선택 시 Redirect URI 설정 불가)

- Application type: Web application
- Name: SSALWorks Web
- Authorized redirect URIs:
  - https://zwjmfewyshhwpgwdtrus.supabase.co/auth/v1/callback
```

**Step 3: 발급된 클라이언트 정보** ✅ 완료
```
Client ID: [GOOGLE_CLIENT_ID - Supabase Dashboard에서 확인]
Client Secret: [GOOGLE_CLIENT_SECRET - Supabase Dashboard에서 확인]
```

### 2.2 Supabase Dashboard 설정 ✅ 완료

**Step 1: Auth Provider 활성화**
```
Supabase Dashboard → Authentication → Providers → Google

- Enable Google provider: ON
- Client ID: [GOOGLE_CLIENT_ID - Google Cloud Console에서 발급]
- Client Secret: [GOOGLE_CLIENT_SECRET - Google Cloud Console에서 발급]
```

**Step 2: Redirect URL 확인**
```
Callback URL (read-only):
https://zwjmfewyshhwpgwdtrus.supabase.co/auth/v1/callback
```

---

## 3. Redirect URL 설정 (실제 구현)

### 3.1 개발 환경

| 설정 위치 | URL |
|-----------|-----|
| 로컬 서버 | `http://localhost:8888` |
| 테스트 페이지 | `http://localhost:8888/pages/auth/google-login.html` |
| Google OAuth Redirect | `https://zwjmfewyshhwpgwdtrus.supabase.co/auth/v1/callback` |

### 3.2 프로덕션 환경 (예정)

| 설정 위치 | URL |
|-----------|-----|
| Site URL | https://ssalworks.com |
| Redirect URLs | https://ssalworks.com/** |
| Google OAuth Redirect | `https://zwjmfewyshhwpgwdtrus.supabase.co/auth/v1/callback` |

### 3.3 Redirect URL 체크리스트

- [x] Google Cloud Console에 Supabase callback URL 등록
- [x] Supabase Dashboard에 Google Provider 활성화
- [x] Client ID / Client Secret 입력
- [x] 로컬 환경에서 테스트 성공

---

## 4. 클라이언트 구현 (실제 코드)

### 4.1 Supabase Client 초기화

**파일**: `Production/Frontend/pages/auth/google-login.html`

```javascript
const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 4.2 Google OAuth 로그인

```javascript
async function handleGoogleLogin() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/index.html',
            queryParams: {
                access_type: 'offline',
                prompt: 'consent'
            }
        }
    });

    if (error) {
        console.error('로그인 오류:', error.message);
        showError(error.message);
        return;
    }
}
```

### 4.3 세션 확인

```javascript
async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        // 로그인된 상태
        console.log('User:', session.user.email);
    }
}
```

### 4.4 로그아웃

```javascript
async function handleLogout() {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        window.location.href = '/pages/auth/google-login.html';
    }
}
```

---

## 5. 테스트 결과 (2025-12-15)

### 5.1 테스트 환경

```bash
# 로컬 서버 실행
cd Production/Frontend
npx serve . -l 8888

# 테스트 URL
http://localhost:8888/pages/auth/google-login.html
```

### 5.2 테스트 결과

| 테스트 항목 | 결과 |
|-------------|------|
| Google 로그인 버튼 표시 | ✅ 성공 |
| Google OAuth 화면 리다이렉트 | ✅ 성공 |
| 앱 이름 "SSAL Works" 표시 | ✅ 성공 |
| Google 계정 선택 후 로그인 | ✅ 성공 |
| 원래 페이지로 리다이렉트 | ✅ 성공 |

---

## 6. 트러블슈팅 (실제 경험)

### 6.1 발생했던 오류

| 오류 | 원인 | 해결 |
|------|------|------|
| `Unsupported provider: provider is not enabled` | Supabase Google Provider 미활성화 | Dashboard에서 Google 활성화 |
| Redirect URI 설정 불가 | OAuth client type이 "Desktop"이었음 | "Web application"으로 새로 생성 |
| `페이지를 찾을 수 없음` | file:// 프로토콜로 열어서 | localhost 서버에서 테스트 |

### 6.2 주의사항

1. **OAuth Client Type**: 반드시 "Web application" 선택
   - "Desktop" 선택 시 Redirect URI 설정 불가

2. **로컬 테스트**: `file://` 프로토콜 사용 불가
   - 반드시 `http://localhost:xxxx`로 테스트

3. **Redirect URI**: 정확히 일치해야 함
   - `https://zwjmfewyshhwpgwdtrus.supabase.co/auth/v1/callback`

---

## 7. 관련 파일

| 파일 경로 | 용도 |
|-----------|------|
| `Production/Frontend/pages/auth/google-login.html` | Google 로그인 UI |
| `S2_개발-1차/Backend_API/api/auth/google.js` | OAuth API (Serverless) |
| `S2_개발-1차/Backend_API/api/auth/google/callback.js` | Callback 처리 |

---

## 8. 관련 Task

| Task ID | 설명 | 상태 |
|---------|------|------|
| S1S1 | Supabase Auth Provider 설정 | ✅ 완료 (2025-12-15) |
| S1BI1 | 환경변수 설정 | ✅ 완료 |
| S2BA1 | Google OAuth Serverless API | ✅ 완료 |
| S2F1 | Google 로그인 UI | ✅ 완료 |

---

## 9. 참고 문서

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated**: 2025-12-15
**Version**: 2.0
**Status**: ✅ 설정 완료 및 테스트 성공
