# Vercel 배포 구조 개편 계획서

> 작성일: 2025-12-26
> 목적: Production 폴더 중복 문제 해결 및 배포 구조 단순화

---

## 1. 현재 문제점

### 1.1 파일 중복 이슈
- Production 폴더에 파일 복사 필요 → 원본과 동기화 문제 발생
- Books 폴더: 원본 34개 vs Production 31개 (버전 불일치)
- AI가 저장 위치 혼동 (Stage vs Production)

### 1.2 관리 복잡성
- 동일 파일이 2곳에 존재
- 수정 시 양쪽 업데이트 필요
- 누락 시 배포 버전과 개발 버전 불일치

---

## 2. 해결 방안: 전체 프로젝트 배포

### 2.1 핵심 변경
- Vercel Root Directory: `Production/` → **비움 (루트 배포)**
- `.vercelignore`로 개발 폴더 제외
- `index.html`, `404.html`만 루트로 이동
- 나머지 파일들은 해당 기능 폴더로 분산

### 2.2 장점
- 파일 중복 제거
- 원본 폴더에서 직접 서빙
- 관리 포인트 단일화
- 플랫폼 독립적 (Vercel 외 다른 플랫폼도 동일 구조)

---

## 3. index.html 경로 수정 계획

### 3.1 수정 대상 (13개)

| # | 현재 경로 | 수정 후 경로 | 비고 |
|---|----------|-------------|------|
| 1 | `pages/auth/login.html` | `Production/pages/auth/login.html` | 로그인 |
| 2 | `pages/auth/signup.html` | `Production/pages/auth/signup.html` | 회원가입 |
| 3 | `pages/mypage/credit.html` | `Production/pages/mypage/credit.html` | 크레딧 |
| 4 | `pages/mypage/profile.html` | `Production/pages/mypage/profile.html` | 프로필 |
| 5 | `pages/mypage/security.html` | `Production/pages/mypage/security.html` | 보안 |
| 6 | `pages/mypage/subscription.html` | `Production/pages/mypage/subscription.html` | 구독 |
| 7 | `pages/legal/terms.html` | `Production/pages/legal/terms.html` | 이용약관 |
| 8 | `pages/legal/privacy.html` | `Production/pages/legal/privacy.html` | 개인정보 |
| 9 | `pages/legal/customer_service.html` | `Production/pages/legal/customer_service.html` | 고객센터 |
| 10 | `admin-dashboard.html` | `Production/pages/admin/admin-dashboard.html` | 관리자 |
| 11 | `guides.js` | `Briefings_OrderSheets/guides.js` | 안내문 |
| 12 | `ordersheets.js` | `Briefings_OrderSheets/ordersheets.js` | Order Sheet |
| 13 | `service-guides.js` | `Briefings_OrderSheets/service-guides.js` | 서비스 안내 |

### 3.2 수정 난이도: **낮음**
- 단순 경로 접두사 추가
- 정규식 일괄 치환 가능
- 예상 소요: 10분

### 3.3 수정 방법
```bash
# sed 명령어로 일괄 치환
sed -i 's|href="pages/|href="Production/pages/|g' index.html
sed -i 's|href="admin-dashboard.html"|href="Production/pages/admin/admin-dashboard.html"|g' index.html
sed -i 's|src="guides.js"|src="Briefings_OrderSheets/guides.js"|g' index.html
sed -i 's|src="ordersheets.js"|src="Briefings_OrderSheets/ordersheets.js"|g' index.html
sed -i 's|src="service-guides.js"|src="Briefings_OrderSheets/service-guides.js"|g' index.html
```

### 3.4 동적 경로 (JavaScript 내)
- `${url}` 변수로 생성되는 경로
- 사이드바 링크 등 동적 생성
- **별도 검토 필요**: JS 코드 내 경로 생성 로직 확인

---

## 4. .vercelignore 생성 계획

### 4.1 제외 대상 폴더 (개발/내부용)

```
# 개발 환경
.claude/
.git/
.github/
node_modules/

# Stage 폴더 (개발 이력)
S0_Project-SAL-Grid_생성/
S1_개발_준비/
S2_개발-1차/
S3_개발-2차/
S4_개발-3차/
S5_개발_마무리/

# Phase 폴더 (기획/문서)
P0_작업_디렉토리_구조_생성/
P1_사업계획/
P2_프로젝트_기획/
P3_프로토타입_제작/

# 내부 도구
Human_ClaudeCode_Bridge/
Development_Process_Monitor/

# 참고자료
참고자료/
공개_전환_업무/

# 캐시/임시
.vercel/
data/
```

### 4.2 배포 포함 폴더

```
# 루트 파일
index.html
404.html
vercel.json

# Production (API, 설정)
Production/

# 콘텐츠 (직접 서빙)
부수적_고유기능/
Briefings_OrderSheets/
```

### 4.3 파일 내용

```gitignore
# ===== Vercel Deployment Ignore =====
# 개발/내부용 폴더 제외, 배포 필요 폴더만 포함

# 개발 환경
.claude/
.git/
.github/
node_modules/

# Stage 폴더 (개발 이력) - 배포 불필요
S0_Project-SAL-Grid_생성/
S1_개발_준비/
S2_개발-1차/
S3_개발-2차/
S4_개발-3차/
S5_개발_마무리/

# Phase 폴더 (기획/문서) - 배포 불필요
P0_작업_디렉토리_구조_생성/
P1_사업계획/
P2_프로젝트_기획/
P3_프로토타입_제작/

# 내부 도구 - 배포 불필요
Human_ClaudeCode_Bridge/
Development_Process_Monitor/
data/

# 참고자료 - 배포 불필요
참고자료/
공개_전환_업무/

# 캐시/임시
.vercel/
*.log
*.backup

# 테스트
tests/
test-results/
playwright-report/
jest.config.js
playwright.config.js
```

---

## 5. Production 폴더 정리 계획

### 5.1 삭제 대상 (15개+)

| 항목 | 유형 | 이유 |
|------|------|------|
| 1권_Claude_ClaudeCode_사용법/ | 폴더 | 원본: 부수적_고유기능/ |
| 2권_풀스택_웹사이트_개발_기초지식/ | 폴더 | 원본: 부수적_고유기능/ |
| 3권_프로젝트_관리_방법/ | 폴더 | 원본: 부수적_고유기능/ |
| .vercel/ | 폴더 | 캐시 |
| _archive/ | 폴더 | 아카이브 |
| node_modules/ | 폴더 | 재생성 가능 |
| playwright-report/ | 폴더 | 테스트 결과 |
| test-results/ | 폴더 | 테스트 결과 |
| tests/ | 폴더 | 테스트 코드 |
| Database/ | 폴더 | 원본: S1-S5 |
| Documentation/ | 폴더 | 원본: S1-S5 |
| supabase/ | 폴더 | 원본: S0 |
| index.html.backup | 파일 | 백업 |
| screenshot_*.png | 파일 | 임시 |
| jest.config.js | 파일 | 테스트 |
| playwright.config.js | 파일 | 테스트 |
| mobile_test.js | 파일 | 테스트 |
| test_viewer_mobile.js | 파일 | 테스트 |
| PROJECT_SAL_GRID_MANUAL.md | 파일 | 원본: S0 |

### 5.2 이동 대상 (24개)

| 파일 | 목적지 |
|------|--------|
| admin-dashboard.html | pages/admin/ |
| admin-*.js | pages/admin/ |
| admin.css | pages/admin/ |
| books-viewer.html | 부수적_고유기능/콘텐츠/학습용_Books_New/ |
| learning-viewer.html | 부수적_고유기능/콘텐츠/ |
| tips-viewer.html | 부수적_고유기능/콘텐츠/Tips/ |
| manual*.html | pages/manual/ |
| viewer_*.html (4개) | S0_Project-SAL-Grid_생성/ |
| guides.js | Briefings_OrderSheets/ |
| ordersheets.js | Briefings_OrderSheets/ |
| service-guides.js | Briefings_OrderSheets/ |
| credit-purchase.* | pages/payment/ |
| payment-methods.* | pages/payment/ |
| shared.css | assets/css/ |

### 5.3 Production에 남는 것 (8개)

```
Production/
├── build-all.js
├── build-web-assets.js
├── vercel.json
├── package.json
├── package-lock.json
├── api/
├── Config/
└── data/
```

---

## 6. Production 폴더 필수 파일 유형 정의

> **원칙**: Production 폴더에는 **배포에 필수적인 파일만** 존재해야 함

### 6.1 Frontend (페이지, 스타일, 클라이언트 JS)

| 유형 | 설명 | 예시 | 위치 |
|------|------|------|------|
| **페이지 HTML** | 사용자가 접근하는 페이지 | login.html, signup.html | `pages/` |
| **페이지 CSS** | 페이지별 스타일 | admin.css, credit-purchase.css | `pages/` 또는 `assets/css/` |
| **공용 CSS** | 전역 스타일 | shared.css, responsive.css | `assets/css/` |
| **클라이언트 JS** | 브라우저에서 실행되는 JS | admin-dashboard.js, payment-methods.js | `pages/` 또는 `assets/js/` |
| **정적 자산** | 이미지, 폰트 | logo.png, icons/ | `assets/` |

**특징:**
- 브라우저에서 직접 로딩
- 사용자 인터페이스 담당
- URL로 직접 접근 가능

---

### 6.2 Backend API (서버리스 함수)

| 유형 | 설명 | 예시 | 위치 |
|------|------|------|------|
| **인증 API** | 로그인, 회원가입, OAuth | auth/signup.js, google-login.js | `api/Backend_APIs/auth/` |
| **결제 API** | 결제, 크레딧, 구독 | subscription-create.js, credit-purchase.js | `api/Backend_APIs/` |
| **프로젝트 API** | CRUD 작업 | projects/create.js, projects/list.js | `api/Backend_APIs/projects/` |
| **이메일 API** | 이메일 발송 | email-send.js, email-welcome.js | `api/Backend_APIs/` |
| **관리자 API** | 관리자 기능 | admin/installation-list.js | `api/Backend_APIs/admin/` |
| **외부 연동 API** | AI, 외부 서비스 | ai-qa.js, ai-health.js | `api/External/` |
| **보안 API** | 인증/인가 | google/callback.js, logout.js | `api/Security/` |
| **Webhook** | 외부 서비스 콜백 | webhook/toss.js | `api/Backend_APIs/webhook/` |
| **Cron** | 스케줄 작업 | cron/subscription-expiry.js | `api/cron/` |

**특징:**
- Vercel Serverless Functions
- `/api/*` 경로로 호출
- vercel.json의 rewrites로 라우팅

---

### 6.3 Backend Infra (공용 라이브러리)

| 유형 | 설명 | 예시 | 위치 |
|------|------|------|------|
| **DB 클라이언트** | Supabase 연결 | supabase-client.js | `api/Backend_Infra/` |
| **이메일 클라이언트** | Resend 연결 | email/resend.js | `api/Backend_Infra/email/` |
| **AI 클라이언트** | OpenAI, Gemini 등 | ai/chatgpt-client.js | `api/Backend_Infra/ai/` |
| **에러 핸들러** | 공용 에러 처리 | error-handler.js | `api/Backend_Infra/` |
| **이메일 템플릿** | 이메일 HTML 템플릿 | templates/welcome.js | `api/Backend_Infra/email/templates/` |
| **유틸리티** | 공용 함수 | usage-limiter.js | `api/Backend_Infra/` |

**특징:**
- 여러 API에서 import하여 사용
- 직접 호출되지 않음
- 코드 재사용을 위한 모듈

---

### 6.4 설정 파일

| 유형 | 설명 | 예시 | 위치 |
|------|------|------|------|
| **Vercel 설정** | 배포 설정 | vercel.json | Production/ |
| **패키지 설정** | 의존성 정의 | package.json | Production/ |
| **빌드 스크립트** | 빌드 자동화 | build-all.js | Production/ |
| **환경 설정** | 앱 설정 | Config/ | Production/Config/ |

---

### 6.5 요약 다이어그램

```
Production/
│
├── 📁 Frontend (사용자 UI)
│   ├── pages/          ← HTML, CSS, JS 페이지
│   └── assets/         ← 정적 자산
│
├── 📁 Backend API (서버리스)
│   └── api/
│       ├── Backend_APIs/   ← 비즈니스 로직 API
│       ├── Security/       ← 인증/보안 API
│       └── External/       ← 외부 연동 API
│
├── 📁 Backend Infra (공용 모듈)
│   └── api/Backend_Infra/
│       ├── ai/            ← AI 클라이언트
│       └── email/         ← 이메일 클라이언트
│
└── 📄 설정 파일
    ├── vercel.json
    ├── package.json
    └── build-all.js
```

---

### 6.6 파일 저장 규칙

| 그룹 | 저장 위치 | 규칙 |
|------|----------|------|
| **Frontend** | `Production/pages/`, `Production/assets/` | 사용자가 접근하는 모든 UI |
| **Backend API** | `Production/api/Backend_APIs/`, `Production/api/Security/`, `Production/api/External/` | `/api/*` 호출되는 함수 |
| **Backend Infra** | `Production/api/Backend_Infra/` | API에서 import하는 모듈 |
| **설정** | `Production/` 루트 | 배포/빌드 관련 설정 |

---

## 7. 실행 순서

### Phase 1: 준비
1. [ ] 현재 상태 백업 (이미 완료)
2. [ ] .vercelignore 파일 생성

### Phase 2: 파일 이동
3. [ ] index.html → 루트로 복사
4. [ ] 404.html → 루트로 복사
5. [ ] Production 내 파일들 → 해당 폴더로 이동
6. [ ] Production 중복 파일 삭제

### Phase 3: 경로 수정
7. [ ] 루트/index.html 경로 수정 (13개)
8. [ ] 동적 경로 확인 및 수정 (필요 시)

### Phase 4: 설정 변경
9. [ ] Vercel Dashboard → Root Directory 비움
10. [ ] 빌드 명령어 확인/수정

### Phase 5: 검증
11. [ ] 로컬 테스트
12. [ ] Vercel 배포 테스트
13. [ ] 모든 링크 동작 확인

---

## 8. 롤백 계획

문제 발생 시:
1. Vercel Root Directory를 `Production/`으로 복원
2. 백업에서 파일 복원
3. Git revert로 변경 취소

---

## 9. 예상 소요 시간

| 작업 | 시간 |
|------|------|
| .vercelignore 생성 | 5분 |
| 파일 이동 | 15분 |
| 경로 수정 | 10분 |
| Vercel 설정 변경 | 5분 |
| 테스트 및 검증 | 15분 |
| **총계** | **~50분** |

---

## 10. 체크리스트

### 사전 확인
- [x] Production 폴더 분석 완료
- [x] 삭제/이동 대상 파일 목록화
- [x] index.html 경로 분석 완료
- [x] .vercelignore 내용 정의

### 실행 전 확인
- [ ] 백업 확인
- [ ] 현재 배포 상태 스크린샷

### 실행 후 확인
- [ ] 모든 페이지 접근 가능
- [ ] API 정상 작동
- [ ] 정적 파일 로딩 정상
- [ ] 콘텐츠 표시 정상

---

*이 계획서는 Human_ClaudeCode_Bridge/Reports/에 저장됨*
