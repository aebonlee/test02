# MOAI-ADK 스킬 레퍼런스

> 출처: https://github.com/modu-ai/moai-adk
> 작성일: 2025-01-15
> 용도: 향후 스킬 추가 시 참고용

---

## 개요

MOAI-ADK는 Claude Code용 엔터프라이즈급 스킬 모음으로, 총 **48개 스킬**을 7개 카테고리로 제공합니다.

---

## 1. Foundation (기반) - 5개

| 스킬 ID | 이름 | 설명 |
|---------|------|------|
| `moai-foundation-claude` | Claude AI 통합 | 오케스트레이션 패턴, 플러그인, 샌드박싱, 헤드리스 모드 |
| `moai-foundation-context` | 컨텍스트 관리 | 대화 컨텍스트, 상태 관리 |
| `moai-foundation-core` | 핵심 시스템 | SPEC-First TDD, TRUST 5 검증, 토큰 최적화 (200K 관리) |
| `moai-foundation-philosopher` | 개념적 설계 | 아키텍처 설계, 철학적 접근 |
| `moai-foundation-quality` | 품질 보증 | TRUST 5 검증, 자동 문제 감지, Best Practices 엔진 |

### Foundation 상세 - moai-foundation-core

```
TRUST 5 프레임워크:
├── T - Testable (테스트 가능성)
├── R - Readable (가독성)
├── U - Unified (통일성)
├── S - Secured (보안)
└── T - Trackable (추적 가능)

SPEC-First TDD 3단계:
├── Plan (30K 토큰) - EARS 형식 요구사항
├── Run (180K 토큰) - RED-GREEN-REFACTOR
└── Sync (40K 토큰) - 문서화
```

### Foundation 상세 - moai-foundation-quality

```
주요 컴포넌트:
├── QualityOrchestrator - 전체 품질 오케스트레이션
├── TRUST5Validator - 5개 축 품질 검증
├── ProactiveQualityScanner - 자동 이슈 탐지
├── BestPracticesEngine - 표준 규정 준수 검증
└── QualityMetricsCollector - 종합 지표 수집
```

---

## 2. Languages (언어) - 16개

| 스킬 ID | 언어 | 주요 특징 |
|---------|------|----------|
| `moai-lang-python` | Python | 3.13+, FastAPI, Pydantic |
| `moai-lang-javascript` | JavaScript | ES2024+, Node.js 22, Vitest |
| `moai-lang-typescript` | TypeScript | 5.5+, 타입 안전성 |
| `moai-lang-java` | Java | Spring Boot, JVM |
| `moai-lang-kotlin` | Kotlin | Android, 코루틴 |
| `moai-lang-go` | Go | 1.23+, 고루틴, 채널 |
| `moai-lang-rust` | Rust | 메모리 안전, 시스템 프로그래밍 |
| `moai-lang-cpp` | C++ | 성능 최적화 |
| `moai-lang-csharp` | C# | .NET, Unity |
| `moai-lang-php` | PHP | Laravel, WordPress |
| `moai-lang-ruby` | Ruby | Rails |
| `moai-lang-elixir` | Elixir | Phoenix, 함수형 |
| `moai-lang-scala` | Scala | JVM, 함수형 |
| `moai-lang-swift` | Swift | iOS, macOS |
| `moai-lang-flutter` | Flutter/Dart | 크로스플랫폼 모바일 |
| `moai-lang-r` | R | 통계, 데이터 분석 |

### Languages 상세 - moai-lang-javascript

```
런타임:
├── Node.js 22 LTS - 내장 WebSocket, TypeScript 실험적 지원
├── Deno 2.x - 네이티브 TypeScript
└── Bun 1.x - 고성능 런타임

ES2024+ 기능:
├── Set 메서드 (intersection, union, difference)
├── Object.groupBy
├── Promise.withResolvers
└── 불변 배열 메서드

도구:
├── 테스팅: Vitest, Jest, Node.js 내장
├── 린팅: ESLint 9 flat config, Biome
├── 번들링: Vite, esbuild, Rollup
└── 프레임워크: Express, Fastify, Hono, Koa
```

---

## 3. Domain (도메인) - 4개

| 스킬 ID | 도메인 | 설명 |
|---------|--------|------|
| `moai-domain-frontend` | 프론트엔드 | React 19, Next.js 16, Vue 3.5, 상태 관리 |
| `moai-domain-backend` | 백엔드 | REST, GraphQL, gRPC, 마이크로서비스 |
| `moai-domain-database` | 데이터베이스 | PostgreSQL, MongoDB, Redis, 쿼리 최적화 |
| `moai-domain-uiux` | UI/UX | 디자인 시스템, 접근성, 사용자 경험 |

### Domain 상세 - moai-domain-frontend

```
프레임워크:
├── React 19 - 서버 컴포넌트, 동시성, cache() API
├── Next.js 16 - App Router, 서버 액션, ISR
└── Vue 3.5 - Composition API, Pinia

기술 스택:
├── TypeScript 5.9+
├── Tailwind CSS 3.4+
├── shadcn/ui
├── Vitest
└── Testing Library
```

### Domain 상세 - moai-domain-backend

```
API 설계:
├── REST - FastAPI, Pydantic
├── GraphQL - Strawberry
└── gRPC - Protocol Buffers

아키텍처:
├── 마이크로서비스 - Consul 서비스 디스커버리
├── 이벤트 기반 - aio_pika
├── 캐싱 - Redis
└── 보안 - JWT, bcrypt
```

### Domain 상세 - moai-domain-database

```
관계형:
├── PostgreSQL 14+ - 고급 패턴, 최적화
└── ORM - SQLAlchemy, Alembic

NoSQL:
├── MongoDB 6.0+ - 문서 모델링, 집계
└── ODM - Mongoose

캐시:
└── Redis 7.0+ - 캐싱 전략, 실시간 분석
```

---

## 4. Platform (플랫폼) - 7개

| 스킬 ID | 플랫폼 | 설명 |
|---------|--------|------|
| `moai-platform-supabase` | Supabase | PostgreSQL, RLS, Auth, Edge Functions, 실시간 |
| `moai-platform-vercel` | Vercel | Edge 배포, ISR, Preview, KV 스토리지 |
| `moai-platform-firebase` | Firebase | Firestore, Auth, Functions, Hosting |
| `moai-platform-railway` | Railway | 컨테이너 배포, PostgreSQL |
| `moai-platform-neon` | Neon | 서버리스 PostgreSQL |
| `moai-platform-auth0` | Auth0 | 엔터프라이즈 인증 |
| `moai-platform-clerk` | Clerk | 사용자 관리, 인증 |

### Platform 상세 - moai-platform-supabase ⭐

```
핵심 기능:
├── PostgreSQL 16 기반
├── pgvector - AI 임베딩 (1536차원, HNSW/IVFFlat)
├── RLS - 행 수준 보안, 멀티테넌트
├── 실시간 - Postgres Changes, Presence
├── Edge Functions - Deno 기반 서버리스
├── 스토리지 - 파일 저장, 이미지 변환, CDN
└── Auth - JWT 기반 인증

사용 사례:
├── 멀티테넌트 SaaS
├── AI/ML 벡터 검색
├── 실시간 협업
└── PostgreSQL 고급 기능
```

### Platform 상세 - moai-platform-vercel ⭐

```
핵심 기능:
├── Edge Functions - 30+ 지역, <50ms 콜드 스타트
├── Next.js 최적화 - Server Components, 스트리밍 SSR
├── Preview 배포 - PR별 자동 미리보기
├── ISR/캐싱 - 온디맨드 재검증, stale-while-revalidate
└── 스토리지 - KV (Redis), Blob, Postgres

모듈:
├── 엣지 함수 & 미들웨어
├── ISR & 캐싱 전략
├── 배포 구성
├── 분석 & 성능 인사이트
└── 스토리지 솔루션
```

---

## 5. Library (라이브러리) - 3개

| 스킬 ID | 라이브러리 | 설명 |
|---------|-----------|------|
| `moai-library-shadcn` | shadcn/ui | Radix UI + Tailwind CSS 컴포넌트 |
| `moai-library-mermaid` | Mermaid | 21종 다이어그램 생성 |
| `moai-library-tailwind` | Tailwind CSS | 유틸리티 우선 CSS |

### Library 상세 - moai-library-mermaid ⭐

```
지원 다이어그램 (21종):

구조 (6종):
├── Flowchart - 프로세스 흐름, 의사결정
├── Sequence - 상호작용, 메시지 흐름
├── Class - 객체지향 관계
├── ER - 엔티티-관계
├── Block - 블록 구조
└── State - 상태 머신

시간 (3종):
├── Timeline - 시간 순서
├── Gantt - 프로젝트 일정
└── Gitgraph - Git 브랜치

아키텍처 (3종):
├── C4 - 시스템 아키텍처
├── Architecture - 구조 다이어그램
└── Requirement - 요구사항 추적

데이터 (4종):
├── Pie - 파이 차트
├── XY - XY 차트
├── Sankey - 흐름 차트
└── Radar - 레이더 차트

프로세스 (5종):
├── Mindmap - 마인드맵
├── Journey - 사용자 여정
├── Kanban - 칸반 보드
├── Packet - 패킷 구조
└── Requirement - 요구사항
```

### Library 상세 - moai-library-shadcn

```
컴포넌트 분류:

폼:
├── Input, Select, Checkbox
├── Radio, Textarea, Switch
└── Form, Label

디스플레이:
├── Card, Dialog, Sheet
├── Drawer, Popover, Tooltip
└── Alert, Badge, Avatar

네비게이션:
├── Navigation Menu
├── Breadcrumb, Tabs
└── Pagination, Sidebar

데이터:
├── Table, Data Table
├── Calendar, DatePicker
└── Charts

기반 기술:
├── React 19
├── TypeScript 5.5
├── Tailwind CSS 3.4
└── Radix UI
```

---

## 6. Workflow (워크플로우) - 7개

| 스킬 ID | 워크플로우 | 설명 |
|---------|-----------|------|
| `moai-workflow-documentation` | 문서화 | API 문서, 아키텍처 문서 |
| `moai-workflow-testing` | 테스팅 | 단위/통합/E2E 테스트 |
| `moai-workflow-project` | 프로젝트 관리 | 일정, 리소스, 이슈 |
| `moai-workflow-template` | 템플릿 | 프로젝트 템플릿 생성 |
| `moai-workflow-review` | 코드 리뷰 | PR 리뷰, 코드 품질 |
| `moai-workflow-deploy` | 배포 | CI/CD, 릴리스 |
| `moai-workflow-debug` | 디버깅 | 문제 해결, 로그 분석 |

---

## 7. Tool (도구) - 6개

| 스킬 ID | 도구 | 설명 |
|---------|------|------|
| `moai-tool-ast-grep` | AST Grep | AST 기반 코드 분석/검색 |
| `moai-tool-git` | Git | 버전 관리, 브랜치 전략 |
| `moai-tool-docker` | Docker | 컨테이너화, 이미지 관리 |
| `moai-tool-ci-cd` | CI/CD | 파이프라인, GitHub Actions |
| `moai-tool-monitoring` | 모니터링 | 로깅, 메트릭, 알림 |
| `moai-tool-security` | 보안 | 취약점 스캔, 보안 감사 |

---

## SSAL Works 프로젝트 적용 추천

### 최우선 추천 (현재 인프라와 직결)

| 순위 | 스킬 | 이유 |
|:----:|------|------|
| 1 | `moai-platform-supabase` | 현재 Supabase 사용 중 |
| 2 | `moai-platform-vercel` | 현재 Vercel 배포 중 |
| 3 | `moai-library-mermaid` | 문서화 다이어그램 |
| 4 | `moai-foundation-quality` | 품질 관리 체계화 |
| 5 | `moai-domain-database` | PostgreSQL 최적화 |

### 추가 고려

| 스킬 | 이유 |
|------|------|
| `moai-lang-javascript` | ES2024+ 최신 문법 |
| `moai-foundation-core` | SPEC-First TDD |
| `moai-workflow-testing` | 테스트 자동화 |

---

## 참고 링크

- **MOAI-ADK GitHub**: https://github.com/modu-ai/moai-adk
- **스킬 폴더**: `src/moai_adk/templates/.claude/skills/`
- **Anthropic 공식 Skills**: https://github.com/anthropics/skills

---

## 적용 방법 (나중에 참고)

```bash
# 1. MOAI-ADK 저장소에서 스킬 폴더 다운로드
# 2. .claude/skills/ 폴더에 복사
# 3. 필요 시 프로젝트에 맞게 수정
```

---

*이 문서는 향후 스킬 추가 시 참고용으로 작성되었습니다.*
