# 페이지 이동 체크리스트

> Production/Frontend/pages/ → /pages/ 이동 시 수정 필요 목록
> 작성일: 2025-12-26

---

## 1. 이동 대상 파일 (23개 HTML)

### auth/ (5개)
- [ ] forgot-password.html
- [ ] google-login.html
- [ ] login.html
- [ ] reset-password.html
- [ ] signup.html

### legal/ (3개)
- [ ] customer_service.html
- [ ] privacy.html
- [ ] terms.html

### manual/ (1개)
- [ ] index.html

### mypage/ (7개)
- [ ] credit.html
- [ ] index.html
- [ ] manual.html
- [ ] payment-methods.html
- [ ] profile.html
- [ ] security.html
- [ ] subscription.html

### payment/ (1개)
- [ ] installation.html

### projects/ (2개)
- [ ] index.html
- [ ] new.html

### subscription/ (4개)
- [ ] billing-history.html
- [ ] credit-purchase.html
- [ ] credit-success.html
- [ ] payment-method.html

### 루트 레벨 (1개)
- [ ] admin-dashboard.html → /pages/admin-dashboard.html

---

## 2. 경로 변경 규칙

### 깊이 변화
| 위치 | 현재 | 새 경로 | 깊이 변화 |
|------|------|--------|----------|
| pages/auth/*.html | Production/Frontend/pages/auth/ | /pages/auth/ | 4→2 |
| pages/legal/*.html | Production/Frontend/pages/legal/ | /pages/legal/ | 4→2 |
| pages/manual/*.html | Production/Frontend/pages/manual/ | /pages/manual/ | 4→2 |
| pages/mypage/*.html | Production/Frontend/pages/mypage/ | /pages/mypage/ | 4→2 |
| admin-dashboard.html | Production/Frontend/ | /pages/ | 2→1 |

### 상대경로 변환 (23개 HTML 파일 공통)
```
현재: ../../../assets/     → 새: ../../assets/
현재: ../../../../index.html → 새: ../../index.html
```

### 절대경로 변환
```
현재: /Production/Frontend/pages/  → 새: /pages/
현재: /Production/assets/          → 새: /assets/
```

---

## 3. 수정 필요 파일 목록

### A. index.html (메인 대시보드)
**수정 개소: 약 15개**

| 현재 경로 | 새 경로 |
|----------|--------|
| `Production/Frontend/pages/auth/login.html` | `pages/auth/login.html` |
| `Production/Frontend/pages/auth/signup.html` | `pages/auth/signup.html` |
| `Production/Frontend/pages/mypage/profile.html` | `pages/mypage/profile.html` |
| `Production/Frontend/pages/mypage/index.html` | `pages/mypage/index.html` |
| `Production/Frontend/pages/mypage/subscription.html` | `pages/mypage/subscription.html` |
| `Production/Frontend/pages/mypage/credit.html` | `pages/mypage/credit.html` |
| `Production/Frontend/pages/mypage/security.html` | `pages/mypage/security.html` |
| `Production/Frontend/pages/legal/terms.html` | `pages/legal/terms.html` |
| `Production/Frontend/pages/legal/privacy.html` | `pages/legal/privacy.html` |
| `Production/Frontend/pages/legal/customer_service.html` | `pages/legal/customer_service.html` |
| `/Production/Frontend/pages/auth/reset-password.html` | `/pages/auth/reset-password.html` |
| `/Production/Frontend/pages/auth/login.html` | `/pages/auth/login.html` |

**sed 명령어:**
```bash
sed -i 's|Production/Frontend/pages/|pages/|g' index.html
sed -i 's|/Production/Frontend/pages/|/pages/|g' index.html
```

### B. admin-dashboard.html
**수정 개소: 약 3개**

| 현재 경로 | 새 경로 |
|----------|--------|
| `/Production/Frontend/pages/legal/terms.html` | `/pages/legal/terms.html` |
| `/Production/Frontend/pages/legal/privacy.html` | `/pages/legal/privacy.html` |
| `/Production/assets/css/responsive.css` | `/assets/css/responsive.css` |

**sed 명령어:**
```bash
sed -i 's|/Production/Frontend/pages/|/pages/|g' pages/admin-dashboard.html
sed -i 's|/Production/assets/|/assets/|g' pages/admin-dashboard.html
```

### C. 23개 HTML 페이지 (상대경로 수정)
**각 파일 수정 개소: 2~5개**

| 현재 | 새 |
|------|-----|
| `../../../assets/css/` | `../../assets/css/` |
| `../../../../index.html` | `../../index.html` |

**일괄 sed 명령어:**
```bash
for f in pages/*/*.html; do
  sed -i 's|\.\./\.\./\.\./assets/|../../assets/|g' "$f"
  sed -i 's|\.\./\.\./\.\./\.\./index\.html|../../index.html|g' "$f"
done
```

### D. vercel.json
**수정 개소: 1개**

```json
// 현재
"buildCommand": "node Production/build-all.js"

// 새 경로
"buildCommand": "node scripts/build-all.js"
```

### E. scripts/build-web-assets.js
빌드 스크립트 내 Production 경로 참조 확인 필요

### F. scripts/add-mobile-responsive.js
Production 경로 참조 수정 필요

---

## 4. 실행 순서

```
1. git mv Production/Frontend/pages pages
2. git mv Production/Frontend/admin-dashboard.html pages/
3. 23개 HTML 파일 상대경로 수정 (sed)
4. index.html 경로 수정 (sed)
5. admin-dashboard.html 경로 수정 (sed)
6. vercel.json buildCommand 수정
7. scripts/*.js 내 경로 수정
8. assets 폴더 이동/병합
9. Production 폴더 삭제
10. 로컬 테스트 (npx serve . -l 8888)
11. git commit & push
12. Vercel 배포 확인
```

---

## 5. 롤백 계획

문제 발생 시:
```bash
git reset --hard HEAD~1
git push -f
```

---

## 6. 예상 소요 시간

- 파일 이동: 5분
- 경로 수정: 15분
- 테스트: 10분
- 커밋/배포: 5분
- **총: 약 35분**

---

## 7. 주의사항

1. **api/ 폴더는 절대 이름 변경 불가** (Vercel 서버리스 함수 인식)
2. 이동 전 반드시 `git status`로 변경사항 없는지 확인
3. 로컬 테스트 필수 (배포 전)
4. 빌드 스크립트 경로도 함께 수정 필요

---

작성자: Claude Code
작성일: 2025-12-26
