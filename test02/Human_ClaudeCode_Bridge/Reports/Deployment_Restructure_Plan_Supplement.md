# Vercel 배포 구조 개편 계획서 - 보완 사항

> 작성일: 2025-12-26
> 원본: Deployment_Restructure_Plan.md
> 검토 기반 보완

---

## 보완 항목 요약

| # | 항목 | 우선순위 | 상태 |
|---|------|:--------:|:----:|
| 1 | vercel.json 수정 계획 | 🔴 높음 | 분석 완료 |
| 2 | 이동 파일 내부 경로 수정 목록 | 🔴 높음 | 작성 필요 |
| 3 | JS 동적 경로 파일 목록 | 🟡 중간 | 작성 필요 |
| 4 | CLAUDE.md/규칙 파일 업데이트 | 🟡 중간 | 작성 필요 |
| 5 | 폴더 구조 통일 | 🟡 중간 | 수정 필요 |
| 6 | 빌드 스크립트 영향도 분석 | 🟡 중간 | 분석 완료 |
| 7 | 로컬 테스트 방법 | 🟢 낮음 | 작성 필요 |
| 8 | shared.css 참조 파일 목록 | 🟢 낮음 | 작성 필요 |

---

## 1. vercel.json 수정 계획 🔴

### 1.1 현황 분석

**vercel.json 파일 위치:**
- `루트/vercel.json` - buildCommand: null
- `Production/vercel.json` - buildCommand: "node build-all.js"
- `S1_개발_준비/Frontend/vercel.json` - 참고용

**차이점:**
| 항목 | 루트 | Production |
|------|------|------------|
| buildCommand | `null` | `"node build-all.js"` |
| 기타 설정 | 동일 | 동일 |

### 1.2 핵심 문제: rewrites 경로

**현재 설정 (31개 rewrites):**
```json
{
  "source": "/api/auth/signup",
  "destination": "/api/Backend_APIs/auth/signup"
}
```

**루트 배포 시 문제:**
- API 파일 위치: `Production/api/Backend_APIs/auth/signup.js`
- 현재 destination: `/api/Backend_APIs/auth/signup` ❌
- 필요한 destination: `/Production/api/Backend_APIs/auth/signup` ✅

### 1.3 수정 계획

**Option A: rewrites 경로 수정 (31개)**
```json
{
  "source": "/api/auth/signup",
  "destination": "/Production/api/Backend_APIs/auth/signup"
}
```

**Option B: API 폴더를 루트로 이동** (비추천)
- api/ 폴더를 Production 밖으로 이동
- 다른 파일들과의 일관성 깨짐

**권장: Option A**

### 1.4 수정 대상 목록 (31개 rewrites)

| # | source | destination 변경 |
|---|--------|-----------------|
| 1 | /api/auth/signup | /Production/api/Backend_APIs/auth/signup |
| 2 | /api/auth/verify-email | /Production/api/Backend_APIs/auth/verify-email |
| 3 | /api/ai/pricing | /Production/api/Backend_APIs/ai/pricing |
| 4 | /api/projects/create | /Production/api/Backend_APIs/projects/create |
| 5 | /api/projects/list | /Production/api/Backend_APIs/projects/list |
| 6 | /api/projects/update | /Production/api/Backend_APIs/projects/update |
| 7 | /api/projects/complete | /Production/api/Backend_APIs/projects/complete |
| 8 | /api/email/send | /Production/api/Backend_APIs/email-send |
| 9 | /api/email/welcome | /Production/api/Backend_APIs/email-welcome |
| 10 | /api/email/password-reset | /Production/api/Backend_APIs/email-password-reset |
| 11 | /api/subscription/status | /Production/api/Backend_APIs/subscription-status |
| 12 | /api/subscription/create | /Production/api/Backend_APIs/subscription-create |
| 13 | /api/subscription/cancel | /Production/api/Backend_APIs/subscription-cancel |
| 14 | /api/auth/google | /Production/api/Security/google-login |
| 15 | /api/auth/google/callback | /Production/api/Security/google/callback |
| 16 | /api/auth/logout | /Production/api/Security/logout |
| 17 | /api/subscription/check | /Production/api/Security/subscription/check |
| 18 | /api/ai/qa | /Production/api/External/ai-qa |
| 19 | /api/ai/usage | /Production/api/External/ai-usage |
| 20 | /api/ai/faq-suggest | /Production/api/External/ai-faq-suggest |
| 21 | /api/ai/test | /Production/api/External/ai-test |
| 22 | /api/ai/health | /Production/api/External/ai-health |
| 23 | /api/payment/installation-request | /Production/api/Backend_APIs/payment/installation-request |
| 24 | /api/payment/installation/:action | /Production/api/Backend_APIs/payment/installation/:action |
| 25 | /api/admin/confirm-installation | /Production/api/Backend_APIs/admin/confirm-installation |
| 26 | /api/admin/installation-list | /Production/api/Backend_APIs/admin/installation-list |
| 27 | /api/admin/installation/:action | /Production/api/Backend_APIs/api/admin/installation/:action |
| 28 | /api/credit/:action | /Production/api/Backend_APIs/credit/:action |
| 29 | /api/payment/billing/:action | /Production/api/Backend_APIs/payment/billing/:action |
| 30 | /api/payment/credit/:action | /Production/api/Backend_APIs/payment/credit/:action |
| 31 | /api/webhook/toss | /Production/api/Backend_APIs/webhook/toss |

**추가 수정:**
```json
{
  "source": "/api/:path*",
  "destination": "/Production/api/:path*"
}
```

### 1.5 functions 설정 수정

**현재:**
```json
"functions": {
  "api/**/*.js": { ... }
}
```

**수정 필요:**
```json
"functions": {
  "Production/api/**/*.js": { ... }
}
```

### 1.6 buildCommand 설정

**루트 vercel.json에 추가:**
```json
"buildCommand": "node Production/build-all.js"
```

---

## 2. 이동 파일 내부 경로 수정 목록 🔴

### 2.1 admin-dashboard.html

**현재 위치:** `Production/admin-dashboard.html`
**이동 후:** `Production/pages/admin/admin-dashboard.html`

**내부 경로 수정 필요:**
| 현재 | 수정 후 |
|------|--------|
| `href="admin.css"` | `href="../../admin.css"` 또는 `href="admin.css"` (함께 이동) |
| `src="admin-dashboard.js"` | `src="admin-dashboard.js"` (함께 이동) |
| `href="index.html"` | `href="../../../index.html"` 또는 `href="/index.html"` |

### 2.2 books-viewer.html

**현재 위치:** `Production/books-viewer.html`
**이동 후:** `부수적_고유기능/콘텐츠/학습용_Books_New/books-viewer.html`

**내부 경로 수정 필요:**
| 현재 | 수정 후 |
|------|--------|
| Book 콘텐츠 경로 | `1권_Claude.../`, `2권_풀스택.../` (같은 폴더) |
| 공용 CSS | 절대 경로로 변경 필요 |

### 2.3 viewer_*.html (4개)

**현재 위치:** `Production/viewer_*.html`
**이동 후:** `S0_Project-SAL-Grid_생성/viewer_*.html`

**⚠️ 문제:** S0_ 폴더는 .vercelignore로 제외됨!

**해결 방안:**
1. viewer_*.html은 Production/에 유지
2. 또는 .vercelignore에서 S0_ 중 viewer만 포함

### 2.4 credit-purchase.*, payment-methods.*

**현재 위치:** `Production/credit-purchase.*`, `Production/payment-methods.*`
**이동 후:** `Production/pages/payment/`

**내부 경로 수정:**
- API 호출 경로: `/api/...` (변경 없음, vercel rewrites 처리)
- CSS/JS 상호 참조: 상대 경로 수정

---

## 3. JS 동적 경로 파일 목록 🟡

### 3.1 검토 필요 파일

| 파일 | 동적 경로 생성 | 확인 항목 |
|------|---------------|----------|
| `Production/index.html` | 사이드바 링크 | `${url}` 변수 |
| `Production/Frontend/guides.js` | 안내문 경로 | 빌드 결과물 |
| `Production/Frontend/ordersheets.js` | Order Sheet 경로 | 빌드 결과물 |
| `Production/Frontend/service-guides.js` | 서비스 안내 경로 | 빌드 결과물 |
| `Production/admin-dashboard.js` | 관리자 기능 | API 호출 경로 |

### 3.2 index.html 내 동적 경로

**사이드바 링크 생성 코드 (예상):**
```javascript
// 11085행 근처
<a href="${url}" target="_blank">...</a>
```

**확인 필요:**
- `url` 변수가 어떻게 생성되는지
- 상대 경로인지 절대 경로인지

---

## 4. CLAUDE.md/규칙 파일 업데이트 🟡

### 4.1 업데이트 필요 파일

| 파일 | 수정 내용 |
|------|----------|
| `.claude/CLAUDE.md` | 절대 규칙 4 (이중 저장) 수정 또는 제거 |
| `.claude/rules/02_save-location.md` | Production 폴더 경로 변경 반영 |
| `.claude/rules/03_area-stage.md` | 폴더 경로 예시 수정 |

### 4.2 절대 규칙 4 수정 방향

**현재:** "Production 코드는 이중 저장"
**변경:** "Production 폴더에만 저장" (중복 제거)

```
수정 전:
1. Stage 폴더에 저장 (작업 이력용)
2. Production 폴더에 복사 (배포용)

수정 후:
1. Production 폴더에만 저장 (배포용)
2. Stage 폴더는 참고/이력용 (복사 불필요)
```

---

## 5. 폴더 구조 통일 🟡

### 5.1 원본 계획서 불일치

**섹션 5.3 (Production에 남는 것):**
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

**섹션 6.5 (요약 다이어그램):**
```
Production/
├── pages/      ← 포함
├── assets/     ← 포함
└── api/
```

### 5.2 통일된 최종 구조

```
Production/
├── 📁 pages/           ← Frontend 페이지
│   ├── admin/
│   ├── auth/
│   ├── legal/
│   ├── manual/
│   ├── mypage/
│   ├── payment/
│   ├── projects/
│   └── subscription/
│
├── 📁 assets/          ← 정적 자산
│   ├── css/
│   ├── js/
│   └── images/
│
├── 📁 Frontend/        ← 빌드 결과물 (guides.js 등)
│
├── 📁 api/             ← Backend APIs
│   ├── Backend_APIs/
│   ├── Security/
│   ├── External/
│   ├── Backend_Infra/
│   └── cron/
│
├── 📁 Config/          ← 설정 파일
│
├── 📁 data/            ← 빌드 데이터
│
├── 📄 build-all.js
├── 📄 build-web-assets.js
├── 📄 vercel.json
├── 📄 package.json
└── 📄 package-lock.json
```

---

## 6. 빌드 스크립트 영향도 분석 🟡

### 6.1 build-web-assets.js 분석

**출력 경로 설정:**
```javascript
const PATHS = {
    // 출력 경로
    ordersheetsOutput: path.join(PROJECT_ROOT, 'Production/Frontend/ordersheets.js'),
    guidesOutput: path.join(PROJECT_ROOT, 'Production/Frontend/guides.js'),
    serviceGuidesOutput: path.join(PROJECT_ROOT, 'Production/Frontend/service-guides.js'),

    // 복사 대상
    copyTargets: {
        ordersheets: [
            path.join(PROJECT_ROOT, 'Production/ordersheets.js'),       // ← 삭제 예정
            path.join(PROJECT_ROOT, 'P3_프로토타입_제작/...')
        ],
        guides: [
            path.join(PROJECT_ROOT, 'Production/guides.js'),            // ← 삭제 예정
            ...
        ],
        serviceGuides: [
            path.join(PROJECT_ROOT, 'Production/service-guides.js'),    // ← 삭제 예정
            ...
        ]
    }
};
```

### 6.2 수정 필요 사항

**copyTargets 수정:**
- `Production/ordersheets.js` → 삭제 (Frontend/에만 유지)
- `Production/guides.js` → 삭제
- `Production/service-guides.js` → 삭제

**또는 index.html 참조 경로 수정:**
- `src="guides.js"` → `src="Frontend/guides.js"` 또는 `src="Briefings_OrderSheets/guides.js"`

### 6.3 영향도 요약

| 스크립트 | 수정 필요 | 내용 |
|----------|:--------:|------|
| build-web-assets.js | ⚠️ | copyTargets에서 루트 복사 제거 |
| build-all.js | ✅ | 수정 불필요 |
| package.json | ✅ | 수정 불필요 |

---

## 7. 로컬 테스트 방법 🟢

### 7.1 Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 로컬 개발 서버 실행
vercel dev

# 또는 Production 설정으로 테스트
vercel dev --listen 3000
```

### 7.2 간단한 정적 서버

```bash
# npx serve 사용
npx serve .

# 또는 Python
python -m http.server 8000

# 또는 Node.js
npx http-server .
```

### 7.3 테스트 체크리스트

- [ ] index.html 로딩
- [ ] 사이드바 링크 동작
- [ ] API 호출 (/api/...) 정상
- [ ] 정적 파일 로딩 (CSS, JS)
- [ ] 콘텐츠 표시 (Books, Guides)

---

## 8. shared.css 참조 파일 목록 🟢

### 8.1 현재 위치

`Production/shared.css`

### 8.2 참조하는 파일 (확인 필요)

```bash
grep -r "shared.css" Production/
```

**예상 참조 파일:**
- index.html
- admin-dashboard.html
- 기타 HTML 페이지

### 8.3 수정 계획

**이동 후 위치:** `Production/assets/css/shared.css`

**참조 경로 수정:**
| 파일 위치 | 현재 | 수정 후 |
|----------|------|--------|
| Production/index.html | `href="shared.css"` | `href="assets/css/shared.css"` |
| Production/pages/admin/*.html | 상대 경로 | `href="../../assets/css/shared.css"` |

---

## 수정된 실행 순서

### Phase 0: 사전 검토 (신규)
1. [ ] vercel.json 현재 내용 확인 ✅
2. [ ] 빌드 스크립트 출력 경로 확인 ✅
3. [ ] 이동 파일 내부 경로 분석
4. [ ] shared.css 참조 파일 목록 작성

### Phase 1: 준비
5. [ ] 현재 상태 백업 (이미 완료)
6. [ ] .vercelignore 파일 생성

### Phase 2: vercel.json 수정 (신규)
7. [ ] 루트 vercel.json에 buildCommand 추가
8. [ ] rewrites destination 수정 (31개)
9. [ ] functions 경로 수정

### Phase 3: 파일 이동
10. [ ] index.html → 루트로 복사
11. [ ] 404.html → 루트로 복사
12. [ ] Production 내 파일들 → 해당 폴더로 이동
13. [ ] 이동 파일 내부 경로 수정
14. [ ] Production 중복 파일 삭제

### Phase 4: 빌드 스크립트 수정 (신규)
15. [ ] build-web-assets.js copyTargets 수정
16. [ ] 빌드 테스트

### Phase 5: 경로 수정
17. [ ] 루트/index.html 경로 수정 (13개)
18. [ ] shared.css 참조 경로 수정
19. [ ] 동적 경로 확인 및 수정 (필요 시)

### Phase 6: 규칙 문서 업데이트 (신규)
20. [ ] CLAUDE.md 절대 규칙 4 수정
21. [ ] rules/02_save-location.md 수정
22. [ ] rules/03_area-stage.md 수정

### Phase 7: 설정 변경
23. [ ] Vercel Dashboard → Root Directory 비움

### Phase 8: 검증
24. [ ] 로컬 테스트 (vercel dev)
25. [ ] Vercel 배포 테스트
26. [ ] 모든 링크 동작 확인
27. [ ] API 호출 테스트

---

## 수정된 예상 소요 시간

| 작업 | 시간 |
|------|------|
| Phase 0: 사전 검토 | 30분 |
| Phase 1: 준비 | 10분 |
| Phase 2: vercel.json 수정 | 20분 |
| Phase 3: 파일 이동 | 30분 |
| Phase 4: 빌드 스크립트 수정 | 15분 |
| Phase 5: 경로 수정 | 30분 |
| Phase 6: 규칙 문서 업데이트 | 20분 |
| Phase 7: 설정 변경 | 5분 |
| Phase 8: 검증 | 30분 |
| **총계** | **~3시간** |

---

## 결론

원본 계획서의 70%는 유효하나, **vercel.json rewrites 수정 (31개)**이 가장 큰 추가 작업입니다.

검토 결과 반영 후 성공 확률: **85% → 95%**

---

*보완 계획서 작성일: 2025-12-26*
