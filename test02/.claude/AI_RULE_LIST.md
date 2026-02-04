# AI 규칙 체계 목록

> SSAL Works에서 Claude Code(AI)가 준수해야 하는 규칙 체계 상세 목록

---

## 전체 구성 (4가지 카테고리)

| # | 카테고리 | 개수 | 위치 | 성격 |
|---|----------|:----:|------|------|
| 1 | 7대 Rules | 7개 파일 | `.claude/rules/` | 작업별 상세 규칙 |
| 2 | 3대 Methods | 3개 파일 | `.claude/methods/` | 특정 상황 절차 |
| 3 | 12대 Compliance | 12개 항목 | `.claude/compliance/` | 행동 원칙 |
| 4 | 5대 절대 규칙 | 5개 규칙 | `.claude/CLAUDE.md` | 위반 시 즉시 중단 |

---

## 1. 7대 Rules 상세

> **위치:** `.claude/rules/`
> **성격:** 파일 생성/저장/작업 시 참조하는 상세 규칙

### 목록

| # | 파일명 | 제목 | 확인 시점 |
|---|--------|------|----------|
| 1 | `01_file-naming.md` | 파일 명명 규칙 | 파일명 정할 때 |
| 2 | `02_save-location.md` | 저장 위치 규칙 | 파일 저장할 때 |
| 3 | `03_area-stage.md` | Area/Stage 매핑 규칙 | 폴더 선택할 때 |
| 4 | `04_grid-writing-supabase.md` | Grid 작성 + Supabase CRUD 규칙 | Grid/DB 작업할 때 |
| 5 | `05_execution-process.md` | 6단계 실행 프로세스 | Task 실행할 때 |
| 6 | `06_verification.md` | 검증 기준 + 상태 전이 규칙 | 검증할 때 |
| 7 | `07_task-crud.md` | Task CRUD 프로세스 | Task 추가/삭제/수정할 때 |

### 각 규칙 핵심 내용

**01_file-naming.md**
- kebab-case 사용 (소문자 + 하이픈)
- [기능]-[동작].확장자 형식
- Task ID는 파일 상단 주석에

**02_save-location.md**
- Stage 폴더에 먼저 저장 (원본)
- Pre-commit Hook으로 루트에 자동 복사 (배포용)
- 수동 이중 저장 금지

**03_area-stage.md**
- 11개 Area: M, U, F, BI, BA, D, S, T, O, E, C
- 5개 Stage: S1~S5
- Task ID 구조: [Stage][Area][번호]

**04_grid-writing-supabase.md**
- Grid 22개 속성
- Task Agent / Verification Agent 올바른 값
- Supabase REST API 우선 사용

**05_execution-process.md**
- 6단계: Task 실행 → PO 도움 요청 → Task 검증 → Stage Gate 검증 → PO 테스트 가이드 → PO 최종 승인
- Main Agent는 오케스트레이션만, 직접 작업/검증 금지

**06_verification.md**
- 상태 전이 규칙 (task_status, verification_status)
- Task 검증 항목: Test Result, Build Verification, Integration Verification, Blockers
- Stage Gate 검증 기준

**07_task-crud.md**
- Task 추가/삭제/수정 시 5개 위치 동시 업데이트
- DB Method + JSON Method 구분
- 상태 전이 규칙 준수

---

## 2. 3대 Methods 상세

> **위치:** `.claude/methods/`
> **성격:** 특정 상황에서 따라야 하는 구체적 절차

### 목록

| # | 파일명 | 제목 | 적용 시점 |
|---|--------|------|----------|
| 1 | `01_supabase-crud.md` | Supabase CRUD 작업 방법 | DB 작업 시 |
| 2 | `02_builder-id.md` | 빌더 계정 ID 부여 방법 | 빌더 계정 생성 시 |
| 3 | `03_login-error.md` | 로그인 에러 대처 방법 | 로그인 오류 발생 시 |

### 각 방법 핵심 내용

**01_supabase-crud.md**
- PO에게 SQL 실행 요청 금지
- 우선순위: REST API → MCP → CLI → Dashboard(최후 수단)
- 환경변수 위치: `P3_프로토타입_제작/Database/.env`

**02_builder-id.md**
- 12자리 형식: YYMMNNNNNNXX
- 금액 코드: TH(300만), FO(400만), FI(500만)...
- 일련번호 6자리 (월별 초기화)

**03_login-error.md**
- 증상별 대처법
- OAuth 설정 불일치 확인
- Google Cloud Console, Supabase Dashboard 설정 점검

---

## 3. 12대 Compliance 상세

> **위치:** `.claude/compliance/AI_12_COMPLIANCE.md`
> **성격:** AI가 모든 작업에서 준수해야 하는 행동 원칙

### 목록

| # | 준수사항 | 설명 |
|---|----------|------|
| 1 | 작업 전 규칙 파일 확인 | 해당 작업의 규칙 파일을 먼저 읽음 |
| 2 | 추측 금지 | 불명확하면 추측하지 말고 질문 |
| 3 | 폴더 임의 생성 금지 | 승인 없이 새 폴더 생성 불가 |
| 4 | 검증 없이 완료 보고 금지 | Verification Agent 투입 필수 |
| 5 | 상태 전이 순서 준수 | Pending→In Progress→Executed→Completed |
| 6 | 작업자 ≠ 검증자 | Task Agent와 Verification Agent 분리 |
| 7 | Grid 업데이트 누락 금지 | Task 완료/수정 시 DB 업데이트 필수 |
| 8 | 거짓 기록 금지 | 실제 결과만 기록 |
| 9 | 보안 취약점 생성 금지 | OWASP Top 10 주의 |
| 10 | 기존 코드 확인 없이 수정 금지 | Read 먼저, Edit 나중 |
| 11 | 과도한 엔지니어링 금지 | 요청한 것만 구현 |
| 12 | 문서화 필수 | work_logs, Reports 기록 |

---

## 4. 5대 절대 규칙 상세

> **위치:** `.claude/CLAUDE.md` (⛔⛔⛔ 절대 규칙 섹션)
> **성격:** 위반 시 즉시 작업 중단해야 하는 핵심 규칙

### 목록

| # | 절대 규칙 | 핵심 내용 | 위반 시 |
|---|----------|----------|--------|
| 1 | 폴더 임의 생성 금지 | 기존 폴더 확인 → 승인 요청 → 승인 후 생성 | 파일 추적 불가 |
| 2 | 일반 작업 - 검증 및 문서화 필수 | 작업 → 검증 에이전트 → work_logs + Reports 저장 | 품질 미보장 |
| 3 | SAL Grid Task - 프로세스 및 상태 전이 규칙 | 6단계 프로세스 + 상태 전이 순서 준수 | Grid 데이터 엉망 |
| 4 | Stage 폴더 먼저 저장 | Stage 폴더(원본) → Pre-commit Hook → 루트(배포) | 동기화 깨짐 |
| 5 | Task 완료/수정 시 Grid 자동 업데이트 | 작업 완료 → project_sal_grid 테이블 PATCH | 진행률 불일치 |

### 각 규칙 상세

**절대 규칙 1: 폴더 임의 생성 금지**
```
필수 프로세스:
1. 즉시 작업 중단
2. 기존 폴더 확인
3. 승인 요청 (양식 필수)
4. 승인 후에만 폴더 생성
```

**절대 규칙 2: 일반 작업 - 검증 및 문서화 필수**
```
4단계 프로세스:
1. 작업 수행
2. 검증 에이전트 투입 (Task tool)
3. 문서화 (.claude/work_logs/current.md + Reports/)
4. 완료 보고
```

**절대 규칙 3: SAL Grid Task - 프로세스 및 상태 전이 규칙**
```
task_status 전이:
Pending → In Progress → Executed → Completed
                                     ↑
                             Verified 후만 가능!

verification_status 전이:
Not Verified → In Review → Verified (또는 Needs Fix)
```

**절대 규칙 4: Stage 폴더 먼저 저장**
```
저장 순서:
1. Stage 폴더에 저장 (원본)
2. git commit 실행
3. Pre-commit Hook 자동 실행
4. 루트 폴더로 자동 복사 (배포용)
```

**절대 규칙 5: Task 완료/수정 시 Grid 자동 업데이트**
```
업데이트 필드:
- task_status, task_progress
- generated_files, remarks
- modification_history (버그 수정 시)
- updated_at
```

---

## 우선순위

| 순위 | 카테고리 | 이유 |
|:----:|----------|------|
| 1 | 5대 절대 규칙 | 위반 시 즉시 작업 중단 |
| 2 | 7대 Rules | 작업별 상세 규칙 (항상 참조) |
| 3 | 3대 Methods | 특정 상황에서 적용 |
| 4 | 12대 Compliance | 전반적 행동 원칙 |

---

## 관계도

```
┌────────────────────────────────────────────────────────────────┐
│                    AI 규칙 체계 (4가지)                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   5대 절대 규칙                           │  │
│  │              (위반 시 즉시 작업 중단)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                 │
│              ┌───────────────┼───────────────┐                 │
│              ▼               ▼               ▼                 │
│      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│      │  7대 Rules  │  │ 3대 Methods │  │    12대     │        │
│      │  (상세규칙) │  │   (절차)    │  │ Compliance  │        │
│      │             │  │             │  │ (행동원칙)  │        │
│      └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 참조

| 문서 | 위치 |
|------|------|
| 메인 가이드 | `.claude/CLAUDE.md` |
| 7대 Rules | `.claude/rules/*.md` |
| 3대 Methods | `.claude/methods/*.md` |
| 12대 Compliance | `.claude/compliance/AI_12_COMPLIANCE.md` |
| SAL Grid 매뉴얼 | `S0_Project-SAL-Grid_생성/manual/PROJECT_SAL_GRID_MANUAL.md` |

---

> 작성일: 2026-01-05
> 버전: 1.0
