# 폴더 구조 비교: Vanilla vs Next.js

> 작성일: 2025-12-26
> 용도: 프로토타입 완료 후 Next.js 전환 여부 결정 시 참고

---

## 1. Vanilla HTML/JS (현재 프로토타입)

| # | 항목 | 유형 | 용도 |
|:-:|------|:----:|------|
| 1 | `/api/` | 폴더 | Vercel 서버리스 API |
| 2 | `/pages/` | 폴더 | HTML 페이지 |
| 3 | `/assets/` | 폴더 | CSS, JS, 이미지, 폰트 |
| 4 | `/scripts/` | 폴더 | 빌드 스크립트 |
| 5 | `index.html` | 파일 | 메인 페이지 |
| 6 | `404.html` | 파일 | 에러 페이지 |

**총 6개** (폴더 4 + 파일 2)

```
/
├── api/
│   ├── Backend_APIs/
│   ├── Security/
│   ├── External/
│   └── cron/
├── pages/
│   ├── auth/
│   ├── legal/
│   ├── mypage/
│   └── ...
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── scripts/
│   ├── build-all.js
│   └── build-web-assets.js
├── index.html
└── 404.html
```

---

## 2. Next.js (향후 전환 시)

| # | 항목 | 유형 | 용도 |
|:-:|------|:----:|------|
| 1 | `/app/` | 폴더 | React 페이지 + API + 라우팅 |
| 2 | `/components/` | 폴더 | 재사용 컴포넌트 |
| 3 | `/public/` | 폴더 | 정적 파일 (이미지, 폰트) |
| 4 | `/lib/` | 폴더 | 유틸리티, 클라이언트 |

**총 4개** (폴더 4)

```
/
├── app/
│   ├── page.tsx           # index.html 대체
│   ├── not-found.tsx      # 404.html 대체
│   ├── layout.tsx         # 공통 레이아웃
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── api/               # /api/ 통합
│       ├── ai-qa/route.ts
│       └── ...
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Modal.tsx
├── public/
│   ├── images/
│   └── fonts/
├── lib/
│   ├── supabase.ts
│   ├── ai/
│   └── auth/
└── package.json
```

---

## 3. 비교 요약

| 항목 | Vanilla | Next.js |
|------|:-------:|:-------:|
| 루트 폴더 | 4개 | 4개 |
| 루트 파일 | 2개 | 0개 |
| **총** | **6개** | **4개** |

---

## 4. 전환 매핑

| Vanilla | → | Next.js | 비고 |
|---------|:-:|---------|------|
| `/api/` | → | `/app/api/` | 폴더 안으로 이동 |
| `/pages/` | → | `/app/` | React 컴포넌트로 변환 |
| `/assets/` | → | `/public/` | 이름 변경 |
| `/scripts/` | → | 삭제 | Next.js 자체 빌드 |
| `index.html` | → | `/app/page.tsx` | 폴더 안으로 |
| `404.html` | → | `/app/not-found.tsx` | 폴더 안으로 |
| - | → | `/components/` | 신규 생성 |
| - | → | `/lib/` | 신규 생성 |

---

## 5. 각 폴더 역할

### Vanilla

| 폴더 | 역할 |
|------|------|
| `/api/` | Vercel 서버리스 함수 (HTTP 엔드포인트) |
| `/pages/` | HTML 페이지 파일 |
| `/assets/` | CSS, JS, 이미지, 폰트 |
| `/scripts/` | 빌드 스크립트 (MD→JS 등) |

### Next.js

| 폴더 | 역할 |
|------|------|
| `/app/` | 페이지 + API + 라우팅 (모두 통합) |
| `/components/` | 재사용 React 컴포넌트 |
| `/public/` | 정적 파일 (이미지, 폰트) |
| `/lib/` | 유틸리티, 클라이언트 (import용) |

---

## 6. 결정 시점

- **현재**: Vanilla 구조로 프로토타입 완성
- **이후**: 프로토타입 완료 후 Next.js 전환 여부 결정
- **전환 시**: 이 문서의 매핑 참고

---

## 7. 주의사항

### Vercel 필수 규칙
- `/api/` 폴더명 변경 불가 (Vercel이 인식 못함)
- `01_api/`, `1-api/`, `API/` 등 사용 불가

### Next.js 전환 시
- `/api/` → `/app/api/`로 이동 (폴더 구조 변경)
- 모든 HTML → React 컴포넌트로 변환 필요
- `/scripts/` 삭제 (Next.js 자체 빌드 시스템 사용)

---

작성자: Claude Code
작성일: 2025-12-26
