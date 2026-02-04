# SSALWorks 기술 스택 명세서

> **작성일**: 2025-12-01
> **최종 수정**: 2025-12-01
> **버전**: v1.0
> **용도**: 프로젝트의 모든 기술 스택 및 버전 정의

---

## 📋 목차

1. [프론트엔드](#1-프론트엔드)
2. [백엔드](#2-백엔드)
3. [AI 연동](#3-ai-연동)
4. [데이터베이스](#4-데이터베이스)
5. [인증 & 보안](#5-인증--보안)
6. [배포 & 인프라](#6-배포--인프라)
7. [개발 도구](#7-개발-도구)
8. [학습 콘텐츠 제공](#8-학습-콘텐츠-제공)
9. [버전 정책](#9-버전-정책)
10. [의존성 관리](#10-의존성-관리)
11. [환경 변수](#11-환경-변수)

---

## 1. 프론트엔드

### 1.1 프레임워크 & 라이브러리

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **Next.js** | 14.x | React 프레임워크 | SSR, API Routes, 파일 기반 라우팅 |
| **React** | 18.x | UI 라이브러리 | 컴포넌트 기반 개발, 대규모 생태계 |
| **TypeScript** | 5.x | 타입 시스템 | 타입 안정성, 코드 품질 향상 |
| **Tailwind CSS** | 3.x | CSS 프레임워크 | 유틸리티 클래스, 빠른 스타일링 |
| **Three.js** | 0.160+ | 3D 시각화 | SAL Grid 3D 렌더링 (2D 카드 뷰 우선) |

### 1.2 상태 관리

- **Context API** (React 내장) - 간단한 전역 상태
- **Zustand** (선택) - 복잡한 상태 관리 필요 시

### 1.3 폼 & 검증

- **React Hook Form** - 폼 상태 관리
- **Zod** - 스키마 검증 및 타입 추론

### 1.4 UI 컴포넌트

- **Custom Components** - 자체 제작 (DESIGN_SYSTEM_V2.md 기준)
- **Headless UI** (선택) - 접근성 보장된 기본 컴포넌트
- **Font Awesome** - 아이콘 (CDN)

### 1.5 마크다운 렌더링

- **next-mdx-remote** 또는 **remark** - Books 콘텐츠 렌더링
- **Prism.js** 또는 **highlight.js** - 코드 하이라이팅

---

## 2. 백엔드

### 2.1 인프라

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **Supabase** | Latest | BaaS (Backend as a Service) | DB + Auth + Storage + Realtime 올인원 |
| **PostgreSQL** | 15.x | 데이터베이스 | Supabase 내장, 안정적, 확장 가능 |
| **Node.js** | 20.x | JavaScript 런타임 | inbox_server.js 실행 |

### 2.2 API

- **Next.js API Routes** - 서버리스 API 엔드포인트
- **Supabase Auto-generated REST API** - DB 직접 접근 (RLS로 보호)
- **RESTful API** 설계 원칙

### 2.3 실시간 통신

| 기술 | 버전 | 용도 | 구현 완료 |
|------|------|------|-----------|
| **Socket.io** | 4.7.2 | Order Sheet 알림 | ✅ 2025-12-01 |
| **Socket.io Client** | 4.7.2 | 클라이언트 연결 | ✅ 2025-12-01 |
| **Supabase Realtime** | Latest | DB 변경 실시간 동기화 | 📅 Phase 2 |

**Socket.io 서버 (inbox_server.js):**
- Port: 3030
- File Watcher: chokidar
- Event: `new-order-alert`

### 2.4 파일 감시

- **chokidar** - orders 폴더 모니터링 (inbox_server.js)

---

## 3. AI 연동

### 3.1 AI API

| 서비스 | 용도 | 상태 |
|--------|------|------|
| **Perplexity API** | AI Q&A (즉시 답변) | 계획됨 |
| **OpenAI API** | 예정 (GPT-4 연동) | 예정 |

### 3.2 CLI 도구

- **Claude Code** - 개발 자동화, AI 에이전트
- **ChatGPT** - 코드 작성, 기술 문서 생성
- **Gemini** - 코드 리뷰, 아키텍처 설계

### 3.3 연동 방식

- **Orders/Outbox 시스템** (Human_ClaudeCode_Bridge/Orders, Web_ClaudeCode_Bridge/Outbox)
- **Socket.io 실시간 알림** (Order Sheet)

---

## 4. 데이터베이스

### 4.1 DBMS

- **PostgreSQL 15.x** (Supabase 호스팅)

### 4.2 클라이언트 라이브러리

- **@supabase/supabase-js** (JavaScript Client)

### 4.3 스키마 관리

- **Supabase Migration Tools** - SQL 마이그레이션
- **SQL Scripts** - `Project-SSAL-Grid/supabase/` 폴더

### 4.4 주요 테이블

- `users` - 사용자 정보
- `subscriptions` - 구독 관리
- `projects` - 프로젝트
- `project_grid_tasks` - Task 카드
- `books_content` - Books 콘텐츠
- `ai_query_logs` - AI Q&A 로그
- `support_requests` - 써니에게 묻기

---

## 5. 인증 & 보안

### 5.1 인증

- **Supabase Auth** - JWT 기반 인증
- **이메일/비밀번호** 인증 (기본)
- **이메일 인증** - 회원가입 시 필수

### 5.2 보안

| 기술/방법 | 용도 |
|----------|------|
| **Row Level Security (RLS)** | 데이터 접근 제어 |
| **HTTPS** | Vercel 자동 제공 |
| **환경 변수** | API 키 보호 (.env) |
| **bcrypt** | 비밀번호 해싱 (Supabase 자동) |
| **CSRF 방지** | Next.js 내장 |
| **Content Security Policy** | XSS 방어 |

---

## 6. 배포 & 인프라

### 6.1 호스팅

| 서비스 | 용도 | URL |
|--------|------|-----|
| **Vercel** | 프론트엔드 + API Routes | ssalworks.world |
| **Supabase** | 데이터베이스 + Auth | 자동 제공 |

### 6.2 도메인

- **ssalworks.world** (메인 도메인)

### 6.3 CI/CD

- **Vercel Git Integration** - Git push → 자동 배포 (30초 이내)
- **프리뷰 배포** - PR 생성 시 자동 프리뷰 URL 생성

### 6.4 CDN

- **Vercel Edge Network** - 글로벌 CDN (자동 제공)

### 6.5 정적 파일

- **GitHub Repository** - Books 콘텐츠 저장
- **Vercel Static Hosting** - 마크다운 → HTML 렌더링

---

## 7. 개발 도구

### 7.1 버전 관리

- **Git** - 버전 관리
- **GitHub** - 원격 저장소

### 7.2 코드 품질

- **ESLint** - JavaScript/TypeScript 린팅
- **Prettier** - 코드 포맷팅
- **TypeScript Compiler** - 타입 체크

### 7.3 테스트

| 도구 | 용도 |
|------|------|
| **Jest** | Unit 테스트 |
| **React Testing Library** | 컴포넌트 테스트 |
| **Playwright** | E2E 테스트 |

### 7.4 IDE

- **VS Code** (권장)
- **Claude Code** 확장

### 7.5 패키지 관리자

- **npm** (기본) 또는 **yarn**

---

## 8. 학습 콘텐츠 제공

### 8.1 제공 방식

**선택:** GitHub + Vercel 정적 파일 배포

### 8.2 구조

```
Next.js 프로젝트/
├── public/guides/
│   ├── claude/          (Claude 사용법 가이드)
│   └── web-dev/         (웹개발 지식)
└── app/guides/
    └── [category]/[slug]/page.tsx  (마크다운 → HTML 렌더링)
```

### 8.3 선택 이유

- ✅ 무료 (GitHub + Vercel)
- ✅ 빠름 (CDN 캐싱)
- ✅ 안정적 (99.9% 업타임)
- ✅ 버전 관리 자동 (Git)
- ✅ 배포 자동 (git push → 30초 배포)
- ✅ SEO 최적화
- ✅ 마크다운 → 예쁜 HTML 자동 변환

### 8.4 대안 (제외됨)

- ❌ Google Drive API (느림, 복잡)
- ❌ Notion Database (비용, API 제한)
- ❌ DB 저장 (불필요한 복잡도)

**참고 문서:** `학습용_Books/2_웹개발_지식/웹개발 기초지식/학습_콘텐츠_제공_방법_비교.md`

---

## 9. 버전 정책

### 9.1 Node.js

- **최소 버전:** 20.x
- **권장 버전:** 20.10+
- **확인 방법:** `node --version`

### 9.2 패키지 관리자

- **npm:** 10.x+
- **yarn:** 1.22+ (선택)

### 9.3 브라우저 지원

| 브라우저 | 최소 버전 |
|---------|-----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### 9.4 디바이스 지원

- **데스크톱:** 1920×1080 이상 (권장)
- **태블릿:** 768px 이상
- **모바일:** 375px 이상

---

## 10. 의존성 관리

### 10.1 package.json 주요 의존성

```json
{
  "name": "ssalworks",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "socket.io": "^4.7.2",
    "socket.io-client": "^4.7.2",
    "@supabase/supabase-js": "^2.38.0",
    "three": "^0.160.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "next-mdx-remote": "^4.4.0",
    "chokidar": "^3.5.3"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/three": "^0.160.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### 10.2 의존성 업데이트

- **매월 1회** 의존성 업데이트 확인
- **보안 패치** 즉시 적용
- **메이저 버전** 업그레이드는 신중히 검토

---

## 11. 환경 변수

### 11.1 필수 환경 변수 (.env)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Perplexity AI
PERPLEXITY_API_KEY=your-perplexity-api-key

# Socket.io (inbox_server.js)
SOCKET_PORT=3030
ORDERS_PATH=./Human_ClaudeCode_Bridge/Orders

# Next.js
NEXT_PUBLIC_APP_URL=https://ssalworks.world

# Email (선택)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

### 11.2 환경 변수 예시 (.env.example)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Perplexity AI
PERPLEXITY_API_KEY=

# Socket.io
SOCKET_PORT=3030
ORDERS_PATH=./Human_ClaudeCode_Bridge/Orders

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 11.3 환경 변수 보안

- ✅ `.env` 파일은 `.gitignore`에 추가
- ✅ `.env.example` 파일은 Git에 커밋
- ✅ Vercel에서 환경 변수 별도 설정
- ❌ 절대 공개 저장소에 노출 금지

---

## 12. 참고 문서

### 12.1 기획 문서

- **프로젝트 계획:** `1-1_Project_Plan/PROJECT_PLAN.md`
- **기능 요구사항:** `1-2_Requirements/functional_requirements.md`
- **사용자 플로우:** `1-3_User_Flows/`
- **워크플로우:** `1-4_Workflows/`
- **디자인 시스템:** `1-5_Design_System/DESIGN_SYSTEM_V2.md`
- **UI/UX 목업:** `1-6_UI_UX_Mockup/`

### 12.2 프로젝트 구조

- **디렉토리 구조:** `PROJECT_DIRECTORY_STRUCTURE.md` (루트)
- **프로젝트 상태:** `PROJECT_STATUS.md` (루트)

### 12.3 개발 가이드

- **Claude Code 사용법:** `.claude/CLAUDE.md`
- **Git 워크플로우:** (작성 예정)

---

## 13. 기술 스택 결정 히스토리

### 13.1 주요 결정 사항

| 날짜 | 결정 | 이유 |
|------|------|------|
| 2025-11-14 | Next.js 14 선택 | SSR, API Routes, App Router |
| 2025-11-20 | Supabase 선택 | DB + Auth + Realtime 올인원, 무료 티어 |
| 2025-12-01 | Socket.io 도입 | Order Sheet 실시간 알림 (Supabase Realtime 전까지) |
| 2025-12-01 | GitHub + Vercel 정적 배포 | Books 콘텐츠 제공 (무료, 빠름, 안정적) |

### 13.2 향후 검토 사항

- **Supabase Realtime** 본격 도입 (Phase 2)
- **3D 시각화** Three.js 구현 (Phase 3)
- **모바일 앱** React Native 검토 (Phase 4)

---

## 14. 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| v1.0 | 2025-12-01 | 초안 작성 (Socket.io 실시간 알림 포함) |

---

**Document Complete**

이 기술 스택 명세서는 SSALWorks 프로젝트의 모든 기술적 결정을 문서화합니다.
추가 기술 도입 시 이 문서를 업데이트하고 버전을 올려주세요.
