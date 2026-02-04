# 로그인 오류 대처 방법

**작성일:** 2025-12-30
**대상:** SSAL Works 로그인 간헐적 오류

---

## 증상별 대처 방법

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
- 이미 수정됨 (커밋 c948935)
- 최신 버전으로 업데이트 필요

---

### 증상 4: 로그인이 됐다 안됐다 반복

**원인:** OAuth redirectTo URL 불일치

**확인 방법:**
1. google-login.html의 redirectTo 확인
2. Supabase Dashboard의 Redirect URL 설정 확인

**대처:**
1. 두 파일의 redirectTo를 동일하게 설정
2. Supabase Dashboard에서 Redirect URL 일치 확인:
   - `https://ssalworks.vercel.app/index.html`
   - `http://localhost:3000/index.html` (개발용)

---

## 로그인 관련 파일 위치

| 파일 | 경로 | 역할 |
|------|------|------|
| 메인 페이지 | `index.html` | 로그인 상태 표시, OAuth 콜백 처리 |
| 이메일 로그인 | `pages/auth/login.html` | 이메일/비밀번호 로그인 |
| Google 로그인 | `pages/auth/google-login.html` | Google OAuth 로그인 |
| 회원가입 | `pages/auth/signup.html` | 신규 회원가입 |

---

## 디버깅 체크리스트

- [ ] 브라우저 Console에서 오류 메시지 확인
- [ ] `✅ 로그인 상태:` 메시지 확인
- [ ] `🔔 Auth 상태 변경:` 메시지 확인
- [ ] URL에 에러 파라미터 있는지 확인 (`?error=...`)
- [ ] 네트워크 탭에서 Supabase API 요청 확인

---

## 수정 이력

| 날짜 | 내용 | 커밋 |
|------|------|------|
| 2025-12-30 | ADMIN_EMAIL 변수 정의 추가 | c948935 |
| 2025-12-30 | OAuth 콜백 토큰 처리 추가 | (현재 작업) |
| 2025-12-30 | onAuthStateChange 리스너 추가 | (현재 작업) |

---

## 긴급 연락처

문제 지속 시:
- GitHub Issues: https://github.com/anthropics/claude-code/issues
- 관리자 이메일: wkfsahsn99@gmail.com
