# 03. 로그인 에러 대처요령

> 로그인 관련 오류 발생 시 확인 및 해결 방법

---

## 1. 증상별 대처 방법

### 증상 1: 로그인 화면이 금방 사라짐

**원인:** 이미 로그인된 상태에서 로그인 페이지 접근 시 자동 리다이렉트

**확인 방법:**
1. 브라우저 개발자 도구 열기 (F12)
2. Console 탭 확인
3. `✅ 이미 로그인됨: xxx@gmail.com` 메시지 확인

**대처:**
- 이미 로그인된 상태이므로 메인 페이지에서 로그인 상태 확인
- 로그아웃 후 다시 로그인 시도

---

### 증상 2: Google 로그인 후 UI가 업데이트되지 않음

**원인:** OAuth 콜백 토큰 처리 타이밍 문제

**확인 방법:**
1. Console에서 `🔔 Auth 상태 변경: SIGNED_IN` 메시지 확인
2. URL에 `#access_token=...` 포함 여부 확인

**대처:**
1. 페이지 새로고침 (F5)
2. 그래도 안 되면 브라우저 캐시 삭제 후 재시도

---

### 증상 3: `ADMIN_EMAIL is not defined` 오류

**원인:** index.html에서 ADMIN_EMAIL 변수 미정의

**확인 방법:**
Console에서 `ReferenceError: ADMIN_EMAIL is not defined` 오류 확인

**대처:**
- index.html에 `const ADMIN_EMAIL = 'wksun999@gmail.com';` 추가
- 커밋 c948935에서 수정됨

---

### 증상 4: 로그인이 됐다 안됐다 반복

**원인:** OAuth redirectTo URL 불일치

**확인 방법:**
1. google-login.html의 redirectTo 확인
2. Supabase Dashboard의 Redirect URL 설정 확인

**대처:**
1. 두 파일의 redirectTo를 동일하게 설정
2. Supabase Dashboard에서 Redirect URL 일치 확인:
   - `https://www.ssalworks.ai.kr/index.html`
   - `http://localhost:3000/index.html` (개발용)

---

## 2. 근본 원인 (3가지)

### 원인 1: OAuth 콜백 이중 구현

| 파일 | redirectTo 설정 | 충돌 |
|------|----------------|------|
| `google-login.html` | `/index.html` | ⚠️ |
| `google-login.js` | `/api/auth/google/callback` | ⚠️ |

**두 방식이 충돌하면서 때로는 작동, 때로는 실패**

### 원인 2: 토큰 처리 방식 불일치

```
google-login.html: URL 해시에서 토큰 추출 (#access_token=...)
callback.js: 쿼리 파라미터에서 코드 추출 (?code=...)
```

→ redirectTo가 `/index.html`이면 해시가 전달되지 않아 토큰 미감지

### 원인 3: DB 오류 무시

```javascript
// callback.js
} catch (dbError) {
    console.error('DB 업데이트 오류:', dbError);
    // 에러 무시하고 계속 진행 ← 문제!
}
```

---

## 3. 해결 방법

### 즉시 수정 1: redirectTo 통일

**google-login.html 수정:**
```javascript
// 변경 전
redirectTo: window.location.origin + '/index.html'

// 변경 후
redirectTo: window.location.origin + '/api/Security/google/callback'
```

### 즉시 수정 2: OAuth 콜백 토큰 처리 (index.html)

```javascript
// OAuth 콜백 처리 - URL 해시에 토큰이 있으면 세션 설정 대기
const hash = window.location.hash;
if (hash && hash.includes('access_token')) {
    console.log('🔄 OAuth 콜백 토큰 감지, 세션 설정 대기...');
    setTimeout(async () => {
        await checkAuthStatus();
        // URL 해시 정리 (토큰 노출 방지)
        if (window.history.replaceState) {
            window.history.replaceState(null, null, window.location.pathname);
        }
    }, 500);
}
```

### 즉시 수정 3: onAuthStateChange 리스너 (index.html)

```javascript
// Auth 상태 변경 리스너 등록
window.supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log('🔔 Auth 상태 변경:', event);
    if (event === 'SIGNED_IN' && session) {
        checkAuthStatus(); // UI 업데이트
    } else if (event === 'SIGNED_OUT') {
        showLoggedOutUI();
    }
});
```

---

## 4. 점검 체크리스트

### Google Cloud Console 확인
- [ ] 인증 리다이렉트 URI 등록 확인
  - `https://www.ssalworks.ai.kr/api/Security/google/callback`
  - `http://localhost:3000/api/Security/google/callback` (개발용)

### Supabase 설정 확인
- [ ] Google Provider 활성화 상태
- [ ] Client ID / Client Secret 유효성
- [ ] Redirect URL 설정

---

## 5. 로그인 관련 파일 위치

| 파일 | 경로 | 역할 |
|------|------|------|
| 메인 페이지 | `index.html` | 로그인 상태 표시, OAuth 콜백 처리 |
| 이메일 로그인 | `pages/auth/login.html` | 이메일/비밀번호 로그인 |
| Google 로그인 | `pages/auth/google-login.html` | Google OAuth 로그인 |
| 회원가입 | `pages/auth/signup.html` | 신규 회원가입 |
| OAuth 콜백 | `api/Security/google/callback.js` | Google OAuth 콜백 처리 |

---

## 6. 디버깅 체크리스트

- [ ] 브라우저 Console에서 오류 메시지 확인
- [ ] `✅ 로그인 상태:` 메시지 확인
- [ ] `🔔 Auth 상태 변경:` 메시지 확인
- [ ] URL에 에러 파라미터 있는지 확인 (`?error=...`)
- [ ] 네트워크 탭에서 Supabase API 요청 확인

---

## 7. 수정 우선순위

| 순위 | 수정 항목 | 예상 효과 |
|------|----------|----------|
| 1 | redirectTo URL 통일 | 80% 문제 해결 |
| 2 | callback.js 오류 처리 | 데이터 일관성 확보 |
| 3 | 세션 재확인 로직 | 네트워크 지연 대응 |

---

## 8. 긴급 연락처

문제 지속 시:
- 관리자 이메일: wksun999@gmail.com
