# 02. Save Location Rules

> Stage 폴더에 먼저 저장 → Pre-commit Hook으로 루트에 자동 복사

---

## 1. 저장 순서 (핵심)

```
1. Stage 폴더에 저장 (원본, 프로세스 관리용)
      ↓
2. git commit 시 Pre-commit Hook 자동 실행
      ↓
3. 루트 폴더로 자동 복사 (배포용)
```

**핵심:** Stage가 원본, 루트는 자동 복사본

---

## 2. 배포 구조 (루트 디렉토리)

```
Root/
├── api/                    ← 백엔드 인터페이스 (배포)
├── pages/                  ← 화면/페이지 (배포)
├── assets/                 ← 정적 자원 (배포)
├── scripts/                ← 자동화 도구 (개발용)
├── index.html              ← 메인 페이지
└── 404.html                ← 에러 페이지
```

**Key:** 4 folders + 2 HTML files

---

## 3. Stage → Root 매핑 (자동 복사 대상)

| Area | Stage 폴더 | Root 폴더 (자동 복사) |
|------|-----------|----------------------|
| **F** | `S?_*/Frontend/` | `pages/` |
| **BA** | `S?_*/Backend_APIs/` | `api/Backend_APIs/` |
| **S** | `S?_*/Security/` | `api/Security/` |
| **BI** | `S?_*/Backend_Infra/` | `api/Backend_Infra/` |
| **E** | `S?_*/External/` | `api/External/` |

---

## 4. 저장 예시

### Frontend (F Area)
```
Task: S2F1
File: google-login.html

1. 저장: S2_Dev-Phase1/Frontend/pages/auth/google-login.html  ← 원본
2. 자동복사: pages/auth/google-login.html                     ← 배포
```

### Backend APIs (BA Area)
```
Task: S2BA1
File: subscription-cancel.js

1. 저장: S2_Dev-Phase1/Backend_APIs/subscription-cancel.js    ← 원본
2. 자동복사: api/Backend_APIs/subscription-cancel.js          ← 배포
```

### Security (S Area)
```
Task: S2S1
File: google-callback.js

1. 저장: S2_Dev-Phase1/Security/google-callback.js            ← 원본
2. 자동복사: api/Security/google-callback.js                  ← 배포
```

---

## 5. 자동 복사 안 하는 Area (6개)

| # | Area | Description | Reason |
|---|------|-------------|--------|
| 1 | M | Documentation | Docs - no deploy needed |
| 2 | U | Design | Design files - no deploy needed |
| 3 | D | Database | SQL - execute directly in database |
| 4 | T | Testing | Test code - no deploy needed |
| 5 | O | DevOps | Config/scripts - scripts/ folder |
| 6 | C | Content | Content - stored in database |

---

## 6. Pre-commit Hook 설정

**스크립트 위치:** `scripts/sync-to-root.js`

**Hook 설정:** `.git/hooks/pre-commit`
```bash
#!/bin/sh
echo "🔄 Stage → Root 동기화 중..."

node scripts/sync-to-root.js

if [ $? -ne 0 ]; then
    echo "❌ 동기화 실패! 커밋을 중단합니다."
    exit 1
fi

echo "✅ 동기화 완료! 커밋을 진행합니다."
```

**동작:**
1. `git commit` 실행
2. Pre-commit hook이 `sync-to-root.js` 자동 실행
3. Stage 폴더 → 루트 폴더 복사
4. 복사 성공 시 커밋 진행

---

## 7. Script Storage Principle

```
1. Single-target scripts → Save in respective folder
   Example: generate-ordersheets-js.js → OrderSheet_Templates/

2. Multi-target scripts → Save in root scripts/
   Example: sync-to-root.js → scripts/
            build-web-assets.js → scripts/
```

---

## 8. 폴더 구조 상세

### api/ (Backend Interface)

```
api/
├── Backend_APIs/           ← Core APIs
├── Security/               ← Auth/Authorization
├── Backend_Infra/          ← Infrastructure/Libraries
└── External/               ← External integrations
```

**WARNING: Do not rename folder!** Vercel recognizes the `api` name

### pages/ (Pages/Screens)

```
pages/
├── auth/                   ← Auth related
├── subscription/           ← Subscription related
└── mypage/                 ← My page
```

### assets/ (Static Resources)

```
assets/
├── css/                    ← Stylesheets
├── js/                     ← JavaScript
├── images/                 ← Images
└── fonts/                  ← Fonts
```

---

## Checklist

- [ ] Stage 폴더에 저장했는가? (원본)
- [ ] 올바른 Stage/Area 폴더인가?
- [ ] git commit 시 자동 복사 확인했는가?
- [ ] 루트 폴더에 복사되었는가? (배포용)

---

## Reference: React/Next.js Migration

> Currently using Vanilla, but apply this structure when migrating to React

```
Root/
├── app/                    ← Pages + API + layouts combined
├── components/             ← Reusable UI pieces
├── public/                 ← Static resources (Vanilla's assets)
└── lib/                    ← Utilities, client config
```

**Vanilla → React Mapping:**
| Vanilla | React |
|---------|-------|
| pages/ | app/ |
| api/ | app/api/ |
| assets/ | public/ |
| index.html | app/page.tsx |
| 404.html | app/not-found.tsx |
