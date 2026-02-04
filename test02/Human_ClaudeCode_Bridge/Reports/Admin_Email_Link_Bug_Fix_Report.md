# 관리자 알림 이메일 링크 버그 수정 리포트

**작성일:** 2025-12-30
**상태:** ✅ 해결됨

---

## 요약

| 항목 | 내용 |
|------|------|
| 발견된 버그 | 1건 |
| 영향 범위 | 관리자 알림 이메일 수신자 |
| 영향받은 알림 타입 | 5개 |
| 수정된 파일 | 2개 |
| 커밋 수 | 1개 |

---

## 버그: 관리자 알림 이메일의 대시보드 링크 오류

### 증상
- 신규가입/문의/결제 등 알림 이메일에서 "관리자 대시보드에서 확인하기" 링크 클릭
- 404 에러 발생 (페이지를 찾을 수 없음)
- 잘못된 페이지로 이동

### 원인
`admin-notify.js`에서 잘못된 URL 경로 하드코딩

```javascript
// 잘못된 코드
<a href="https://www.ssalworks.ai.kr/Frontend/admin-dashboard.html">
// → /Frontend/admin-dashboard.html (존재하지 않음)

// 수정된 코드
<a href="https://www.ssalworks.ai.kr/pages/admin-dashboard.html">
// → /pages/admin-dashboard.html (정상)
```

### 영향받은 알림 타입

| # | 타입 | 이메일 제목 | 링크 |
|---|------|------------|------|
| 1 | `inquiry` | 📨 새 문의가 접수되었습니다 | `/pages/admin-dashboard.html` |
| 2 | `payment` | 💰 결제가 완료되었습니다 | `/pages/admin-dashboard.html` |
| 3 | `signup` | 👤 새 사용자가 가입했습니다 | `/pages/admin-dashboard.html` |
| 4 | `installation_request` | 🏦 빌더 계정 개설비 입금 확인 요청 | `/pages/admin-dashboard.html#billing` |
| 5 | `sunny_inquiry` | ☀️ Sunny에게 새 질문이 도착했습니다 | `/pages/admin-dashboard.html#sunny-inquiries` |

### 수정된 파일

| # | 파일 경로 | 수정 내용 |
|---|----------|----------|
| 1 | `api/Backend_APIs/admin-notify.js` | URL 경로 5곳 수정 |
| 2 | `S4_개발-3차/Backend_APIs/admin-notify.js` | URL 경로 5곳 수정 |

### 커밋
- **Hash:** `f0bc78c`
- **Message:** `fix: 관리자 알림 이메일의 대시보드 링크 경로 수정`

---

## 근본 원인 분석

### 문제
개발 초기에 프론트엔드 폴더 구조가 `/Frontend/`였으나, 이후 `/pages/`로 변경됨.
하지만 `admin-notify.js`의 이메일 템플릿 URL은 업데이트되지 않아 불일치 발생.

### 예방책

1. **URL 경로 상수화**
   ```javascript
   const ADMIN_DASHBOARD_URL = 'https://www.ssalworks.ai.kr/pages/admin-dashboard.html';
   ```

2. **환경 변수 활용**
   ```javascript
   const BASE_URL = process.env.BASE_URL || 'https://www.ssalworks.ai.kr';
   const ADMIN_URL = `${BASE_URL}/pages/admin-dashboard.html`;
   ```

3. **폴더 구조 변경 시 전체 검색**
   - 프로젝트 전체에서 변경된 경로 검색
   - 이메일 템플릿, API 응답 등 하드코딩된 URL 확인

---

## 테스트 결과

| 테스트 항목 | 결과 |
|------------|:----:|
| 신규가입 알림 이메일 링크 | ✅ |
| 문의 접수 알림 이메일 링크 | ✅ |
| 결제 완료 알림 이메일 링크 | ✅ |
| 입금 확인 요청 알림 이메일 링크 | ✅ |
| Sunny 질문 알림 이메일 링크 | ✅ |

---

## 관련 파일

- 작업 로그: `.claude/work_logs/current.md`
- 수정된 파일: `api/Backend_APIs/admin-notify.js`
