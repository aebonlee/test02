# SSAL Works 로그인 간헐적 오류 분석 보고서

**작성일:** 2025-12-30
**상태:** 수정 완료 (2차 수정)

---

## 1. 문제 현상

- 로그인이 됐다 안됐다 반복
- Google OAuth 로그인 간헐적 실패

---

## 2. 근본 원인 (3가지)

### 원인 1: OAuth 콜백 이중 구현 (가장 심각)

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
// callback.js 라인 149-151
} catch (dbError) {
    console.error('DB 업데이트 오류:', dbError);
    // 에러 무시하고 계속 진행 ← 문제!
}
```

---

## 3. 문제 파일 위치

| 파일 | 경로 | 문제점 |
|------|------|--------|
| Google 로그인 페이지 | `pages/auth/google-login.html` | redirectTo 불일치 |
| 로그인 API | `api/Security/google-login.js` | redirectTo 다름 |
| OAuth 콜백 | `api/Security/google/callback.js` | DB 오류 무시 |

---

## 4. 해결 방법

### 즉시 수정 1: redirectTo 통일

**google-login.html 수정:**
```javascript
// 변경 전
redirectTo: window.location.origin + '/index.html'

// 변경 후
redirectTo: window.location.origin + '/api/Security/google/callback'
```

### 즉시 수정 2: callback.js 오류 처리 강화

```javascript
// 변경 전
} catch (dbError) {
    console.error('DB 업데이트 오류:', dbError);
}

// 변경 후
} catch (dbError) {
    console.error('DB 업데이트 오류:', dbError);
    // 오류 발생 시 사용자에게 알림
    return res.redirect(302, `${baseUrl}/?error=db_sync_failed`);
}
```

### 즉시 수정 3: 세션 재확인 로직 추가

```javascript
// index.html에 추가
async function checkLoginStatus() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error('세션 확인 오류:', error);
        // 쿠키에서 직접 확인
        const accessToken = getCookie('sb-access-token');
        if (accessToken) {
            await supabase.auth.setSession({ access_token: accessToken });
        }
    }
}
```

---

## 5. 점검 체크리스트

### Google Cloud Console 확인
- [ ] 인증 리다이렉트 URI 등록 확인
  - `https://ssalworks.vercel.app/api/Security/google/callback`
  - `http://localhost:3000/api/Security/google/callback` (개발용)

### Supabase 설정 확인
- [ ] Google Provider 활성화 상태
- [ ] Client ID / Client Secret 유효성
- [ ] Redirect URL 설정

### 환경 변수 확인
- [ ] `NEXT_PUBLIC_SITE_URL` 값
- [ ] `VERCEL_URL` 자동 설정 여부

---

## 6. 수정 우선순위

| 순위 | 수정 항목 | 예상 효과 |
|------|----------|----------|
| 1 | redirectTo URL 통일 | 80% 문제 해결 |
| 2 | callback.js 오류 처리 | 데이터 일관성 확보 |
| 3 | 세션 재확인 로직 | 네트워크 지연 대응 |

---

## 7. 관련 커밋 이력

- `30189df` - refactor: api 폴더를 Production/api로 통합, 루트 api 삭제
- 이 커밋 이후 경로 변경으로 인한 불일치 가능성

---

## 8. 결론

**로그인 간헐적 오류의 핵심 원인:**
1. OAuth redirectTo URL 이중 설정으로 인한 콜백 충돌
2. 토큰 처리 방식(해시 vs 쿼리) 불일치
3. DB 오류 무시로 인한 세션 불완전 저장

**권장 조치:**
redirectTo를 `/api/Security/google/callback`으로 통일하면 대부분의 문제가 해결될 것으로 예상됩니다.

---

## 9. 적용된 수정 사항 (2025-12-30)

### 수정 1: ADMIN_EMAIL 변수 정의 추가

**파일:** `index.html`

```javascript
// 관리자 이메일 정의
const ADMIN_EMAIL = 'wkfsahsn99@gmail.com';
```

**문제:** `showLoggedInUI()` 함수에서 ADMIN_EMAIL 참조 시 `ReferenceError` 발생
**커밋:** `c948935`

### 수정 2: OAuth 콜백 토큰 처리 추가

**파일:** `index.html` (initSupabase 함수)

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

**문제:** Google OAuth 후 index.html로 돌아왔을 때 세션이 즉시 인식되지 않음

### 수정 3: onAuthStateChange 리스너 추가

**파일:** `index.html`

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

**문제:** 로그인/로그아웃 상태 변경 시 UI가 자동 업데이트되지 않음

---

## 10. "로그인 화면이 금방 사라짐" 현상 설명

**원인:** 로그인 페이지(login.html, google-login.html)에는 이미 로그인된 사용자를 감지하면 즉시 메인 페이지로 리다이렉트하는 로직이 있음

```javascript
// login.html (662-669행)
const { data: { session } } = await supabaseClient.auth.getSession();
if (session) {
    window.location.href = '../../index.html';  // 즉시 리다이렉트
}
```

**이것은 정상 동작임:** 이미 로그인된 상태에서 로그인 페이지 접근 시 메인으로 이동

**실제 문제는:** index.html에서 로그인 상태가 UI에 반영되지 않아, 사용자가 로그인되지 않았다고 오해하고 다시 로그인 페이지로 갔다가 즉시 리다이렉트됨

→ 위 수정 2, 3으로 해결됨
