# 모바일 페이지 버그 수정 리포트

**작성일:** 2025-12-30
**상태:** ✅ 해결됨

---

## 요약

| 항목 | 내용 |
|------|------|
| 발견된 버그 | 2건 |
| 영향 범위 | 모바일 사용자 |
| 수정된 파일 | 5개 |
| 커밋 수 | 2개 |

---

## 버그 1: Mypage 모바일 접근 불가

### 증상
- 모바일에서 My Page 메뉴 클릭 시 페이지가 열리지 않음
- 빈 화면 또는 404 에러 발생

### 원인
비로그인 상태에서 mypage 접근 시 로그인 페이지로 redirect하는 코드에서 상대 경로 오류

```javascript
// 잘못된 코드 (pages/mypage/*.html에서)
window.location.href = 'login.html';
// → 해석: pages/mypage/login.html (존재하지 않음)

// 수정된 코드
window.location.href = '../auth/login.html';
// → 해석: pages/auth/login.html (정상)
```

### 수정된 파일
| # | 파일 경로 | 수정 내용 |
|---|----------|----------|
| 1 | `pages/mypage/index.html` | `login.html` → `../auth/login.html` |
| 2 | `pages/mypage/profile.html` | `login.html` → `../auth/login.html` |
| 3 | `pages/mypage/security.html` | `login.html` → `../auth/login.html` |
| 4 | `pages/mypage/subscription.html` | `login.html` → `../auth/login.html` |

### 커밋
- **Hash:** `488abd5`
- **Message:** `fix: mypage 로그인 redirect 경로 수정`

---

## 버그 2: Admin Dashboard 로그아웃 redirect 오류

### 증상
- Admin Dashboard에서 로그아웃 버튼 클릭 시 잘못된 페이지로 이동
- 404 에러 또는 빈 화면 발생

### 원인
logout() 함수에서 상대 경로 사용으로 인한 경로 오류

```javascript
// 잘못된 코드 (pages/admin-dashboard.html에서)
window.location.href = 'index.html';
// → 해석: pages/index.html (존재하지 않음)

// 수정된 코드
window.location.href = '/index.html';
// → 해석: /index.html (루트, 정상)
```

### 수정된 파일
| # | 파일 경로 | 수정 내용 |
|---|----------|----------|
| 1 | `pages/admin-dashboard.html` | `index.html` → `/index.html` |

### 커밋
- **Hash:** `464edf3`
- **Message:** `fix: admin-dashboard.html 로그아웃 redirect 경로 수정`

---

## 근본 원인 분석

### 문제 패턴
```
pages/ 하위 폴더에서 상대 경로 사용 시 의도치 않은 경로 해석 발생

예시 1:
  위치: pages/mypage/index.html
  코드: window.location.href = 'login.html'
  해석: pages/mypage/login.html ❌
  의도: pages/auth/login.html ✅

예시 2:
  위치: pages/admin-dashboard.html
  코드: window.location.href = 'index.html'
  해석: pages/index.html ❌
  의도: /index.html (루트) ✅
```

### 예방책

1. **절대 경로 사용 권장**
   - 루트로 이동: `/index.html`
   - 특정 폴더: `/pages/auth/login.html`

2. **상대 경로 사용 시 정확한 경로 지정**
   - 상위 폴더: `../auth/login.html`
   - 현재 폴더: `./file.html`

3. **새 페이지 생성 시 redirect 경로 검증 필수**
   - 개발자 도구 Network 탭에서 경로 확인
   - 모바일/PC 모두 테스트

---

## 테스트 결과

| 테스트 항목 | PC | 모바일 |
|------------|:--:|:------:|
| Mypage 접근 (비로그인) | ✅ | ✅ |
| Mypage 접근 (로그인) | ✅ | ✅ |
| Admin Dashboard 로그아웃 | ✅ | ✅ |

---

## 관련 파일

- 작업 로그: `.claude/work_logs/current.md`
- 수정된 파일: `pages/mypage/*.html`, `pages/admin-dashboard.html`
