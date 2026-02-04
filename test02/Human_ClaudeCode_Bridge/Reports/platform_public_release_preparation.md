# SSALWorks 플랫폼 공개 준비사항

> **최종 업데이트**: 2025-12-22
> **목적**: 외부 사용자 대상 플랫폼 공개(Platform Public Release) 준비사항 종합

---

## 핵심 과제 3가지

### 1. Order Sheet 양식 일반화

**Part A + Part B 구조:**

```
┌─────────────────────────────────────────────────────────────┐
│  PART A: 일반론 (모든 프로젝트 공통)                         │
├─────────────────────────────────────────────────────────────┤
│  • order_id, created_at, stage, version                     │
│  • 6대 작업 규칙 (.claude/rules/)                           │
│  • 상태 전이 규칙 (Pending → In Progress → Executed → ...)  │
│  • 실행 단계 (Grid 확인 → Task 실행 → 검증 → 저장)          │
│  • Grid 필수 체크리스트 (16-22번 필드)                       │
└─────────────────────────────────────────────────────────────┘
                              +
┌─────────────────────────────────────────────────────────────┐
│  PART B: 추가 사항 (프로젝트별 커스터마이징)                  │
├─────────────────────────────────────────────────────────────┤
│  • project_name: "사용자 프로젝트명"                         │
│  • project_specific_rules: [프로젝트 특수 규칙]              │
│  • custom_agents: [프로젝트에서 사용하는 Agent]              │
│  • custom_references: [프로젝트별 참조 문서]                 │
│  • supabase_config: {프로젝트별 DB 설정}                     │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. 사용자 관점 대비

| 항목 | 현재 (PO) | 일반 사용자 | 대비 필요 |
|------|----------|------------|----------|
| Supabase | 직접 관리 | 멀티테넌트 | user_id 필드 추가 |
| .claude/rules/ | 직접 수정 | 템플릿 제공 | 템플릿화 |
| CLAUDE.md | 프로젝트 전용 | 일반화 버전 | 일반화 |
| Grid 데이터 | 1개 프로젝트 | 사용자별 분리 | RLS 정책 |

---

### 3. 문서/파일 공유 방법

| 방법 | 용도 |
|------|------|
| 웹사이트 | 매뉴얼, 가이드, 온보딩 |
| GitHub Public Repo | 템플릿 코드, 버전 관리 |
| Google Drive | 대용량 파일, 빠른 공유 |

---

## 주요 작업 항목

### 1. GitHub → Private 변경

- Settings → Danger Zone → Change repository visibility → Private

### 2. 보안 정보 처리

| 파일 | 처리 방법 |
|------|----------|
| `.env` | `.env.example`로 대체 (값 없이) |
| `viewer.html` | Supabase 키 → 플레이스홀더로 교체 |
| `index.html` | Supabase 키 → 플레이스홀더로 교체 |

**`.env.example` 예시:**
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI APIs
OPENAI_API_KEY=your-openai-key
GOOGLE_API_KEY=your-google-ai-key
PERPLEXITY_API_KEY=your-perplexity-key

# Payment
TOSS_CLIENT_KEY=your-toss-client-key
TOSS_SECRET_KEY=your-toss-secret-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

---

### 3. 배포 패키지 구성

```
SSALWorks_예제_프로젝트/
├── .claude/              (CLAUDE.md, rules, commands, skills)
├── S0_SAL-Grid/          (매뉴얼, Task Instructions, DB 스키마)
├── Production/           (배포용 코드 예제)
├── S1~S5_*, P0~P3_*/     (Stage별 작업 예제)
├── .env.example          (환경변수 예시)
└── README.md             (시작 가이드)
```

---

### 4. 대시보드 링크 추가

```
[📁 예제 프로젝트 보기] → Google Drive 링크
```

---

## 플랫폼 공개 체크리스트

### 사전 준비

- [ ] GitHub 레포 Private으로 변경
- [ ] `.env.example` 파일 생성
- [ ] viewer.html Supabase 키 → 플레이스홀더 교체
- [ ] index.html Supabase 키 → 플레이스홀더 교체
- [ ] Google Drive 공유 폴더 생성 (보안 정보 제외)

### 대시보드

- [ ] Google Drive 링크 버튼 추가

### 문서

- [ ] CLAUDE.md 일반화 버전 검토
- [ ] Order Sheet v5 템플릿 작성 (Part A + Part B)
- [ ] README.md 시작 가이드 작성

### 향후 (선택)

- [ ] Supabase 멀티테넌트 설계 (user_id 추가)
- [ ] 온보딩 튜토리얼 작성

---

## 관련 문서

| 문서 | 경로 |
|------|------|
| 절대 규칙 | `.claude/CLAUDE.md` |
| SAL Grid 매뉴얼 | `S0_Project-SAL-Grid_생성/manual/PROJECT_SAL_GRID_MANUAL.md` |
| Order Sheet 템플릿 | `Human_ClaudeCode_Bridge/Orders/ORDER_TEMPLATE_v4.json` |

---

**문서 끝**
