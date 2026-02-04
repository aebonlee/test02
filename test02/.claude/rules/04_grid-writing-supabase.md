# 04. Grid 작성 및 Supabase 작업 규칙

> **⚠️ 적용 대상: SSAL Works 내부 관리용 (DB Method)**
>
> 이 규칙은 Supabase DB를 사용하는 SSAL Works 내부 프로젝트에 적용됩니다.
> 일반 이용자는 CSV Method를 사용하므로 `04_grid-writing-csv.md` 파일을 참조하세요.
>
> **DB vs CSV 구분:**
> - **DB (Supabase)** = SSAL Works 예시 데이터 (고정, `viewer_database.html`)
> - **JSON 파일** = 이용자 본인 프로젝트 데이터 (가변, `viewer_json.html`)

---

PROJECT SAL Grid 데이터 작성 및 Supabase CRUD 작업 시 준수 사항

---

## 1. Grid 22개 속성

| # | 필드명 | 설명 | 작성자 |
|---|--------|------|--------|
| 1 | task_id | Task 고유 ID | 설계 시 |
| 2 | task_name | Task 이름 | 설계 시 |
| 3 | stage | Stage 코드 (S1~S5) | 설계 시 |
| 4 | area | Area 코드 (11개) | 설계 시 |
| 5 | level | Level (1~3) | 설계 시 |
| 6 | status | 상태 (대기/진행/완료) | Main Agent |
| 7 | progress | 진행률 (0~100) | Main Agent |
| 8 | dependencies | 선행 Task | 설계 시 |
| 9 | task_instruction | Task 수행 지침 | 설계 시 |
| 10 | task_agent | Task 수행 Agent | 설계 시 |
| 11 | generated_files | 생성된 파일 | Main Agent |
| 12 | duration | 소요 시간 | Main Agent |
| 13 | build_result | 빌드 결과 | Main Agent |
| 14 | verification_instruction | 검증 지침 | 설계 시 |
| 15 | verification_agent | 검증 Agent | 설계 시 |
| 16 | test_result | 테스트 결과 | Main Agent |
| 17 | build_verification | 빌드 검증 | Main Agent |
| 18 | integration_verification | 통합 검증 | Main Agent |
| 19 | blockers | 차단 요소 | Main Agent |
| 20 | comprehensive_verification | 종합 검증 | Main Agent |
| 21 | ai_verification_note | AI 검증 의견 | Main Agent |
| 22 | stage_gate_status | Stage Gate 상태 | PO |

---

## 1.1 SAL ID 및 의존성(dependencies) 규칙 ⭐

> **SAL ID는 의존성·병렬성·인접성을 인코딩합니다**

### 의존성 필드 (#8 dependencies) 작성 규칙

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 선행 Task ID < 후행 Task ID (의존성 방향)                │
│    → S1D1 → S2F1 (O)  Stage 1이 Stage 2보다 먼저           │
│    → S2F1 → S1D1 (X)  역방향 의존성 금지                    │
│                                                             │
│ 2. 순환 의존성 금지                                          │
│    → A → B → A (X)                                         │
│                                                             │
│ 3. 존재하지 않는 Task 참조 금지                              │
│    → dependencies에 Grid에 없는 Task ID 사용 금지           │
└─────────────────────────────────────────────────────────────┘
```

### SAL ID 부여 프로세스 (Provisional → Finalization)

| 단계 | SAL ID 상태 | 설명 |
|------|------------|------|
| Task 선정 시 | **Provisional (가확정)** | ID 부여, 검증 전 |
| 22개 속성 입력 | **검증** | dependencies 유효성 체크 |
| 검증 통과 | **Finalization (확정)** | Grid 완성 |
| 검증 실패 | → Task 선정 | ID 수정 후 재검증 |

### 의존성 유효성 검사 예시

| 후행 Task | dependencies | 유효성 | 이유 |
|-----------|--------------|:------:|------|
| S2F1 | S1D1 | ✅ | Stage 1 < Stage 2 |
| S3BA1 | S2F1, S2BA1 | ✅ | Stage 2 < Stage 3 |
| S2F1 | S3BA1 | ❌ | **역방향 (2 < 3 위반)** |
| S2F1 | S9X1 | ❌ | **존재하지 않는 Task** |

---

## 2. Task Agent 올바른 값

| Area | Task Agent |
|------|------------|
| M (Documentation) | `documentation-specialist` |
| U (Design) | `frontend-developer` |
| F (Frontend) | `frontend-developer` |
| BI (Backend Infra) | `backend-developer`, `devops-troubleshooter` |
| BA (Backend APIs) | `backend-developer` |
| D (Database) | `database-specialist` |
| S (Security) | `security-specialist` |
| T (Testing) | `test-engineer` |
| O (DevOps) | `devops-troubleshooter` |
| E (External) | `backend-developer`, `devops-troubleshooter` |
| C (Content) | `content-specialist` |

---

## 3. Verification Agent 올바른 값

| 용도 | Verification Agent |
|------|-------------------|
| 코드 리뷰 | `code-reviewer` |
| 품질 보증 | `qa-specialist` |
| 보안 감사 | `security-auditor` |
| DB 검증 | `database-specialist` |

**핵심 원칙:** Task Agent ≠ Verification Agent (작성자와 검증자 분리)

---

## 4. Verification 필드 JSON 형식

### #16 Test Result
```json
{
    "unit_test": "✅/❌/⏳ 설명",
    "integration_test": "✅/❌/⏳ 설명",
    "edge_cases": "✅/❌/⏳ 설명",
    "manual_test": "✅/❌/⏳ 설명"
}
```

### #17 Build Verification
```json
{
    "compile": "✅/❌/N/A 설명",
    "lint": "✅/❌/N/A 설명",
    "deploy": "✅/❌/N/A 설명",
    "runtime": "✅/❌/N/A 설명"
}
```

### #18 Integration Verification
```json
{
    "dependency_propagation": "✅/❌ 설명",
    "cross_task_connection": "✅/❌ 설명",
    "data_flow": "✅/❌ 설명"
}
```

### #19 Blockers
```json
{
    "dependency": "None/⚠️ 설명",
    "environment": "None/⚠️ 설명",
    "external_api": "None/⚠️ 설명",
    "status": "No Blockers ✅ / N Blockers 🚫"
}
```

### #20 Comprehensive Verification
```json
{
    "task_instruction": "✅/❌ 설명",
    "test": "✅/❌ N/N 통과",
    "build": "✅/❌ N/N 통과",
    "integration": "✅/❌ N/N 통과",
    "blockers": "✅ None/❌ N개",
    "final": "✅ Passed / ❌ Failed"
}
```

---

## 5. Tools 필드 올바른 값

**포함해야 할 것:**
- Slash Commands: `/review-pr`, `/deploy`, `/test`
- CLI 도구: `gh`, `vercel-cli`, `npm`
- MCP Servers: `/mcp__supabase__*`, `browser-mcp`
- Skills: `pdf-skill`, `playwright-mcp`
- SDK: `openai-sdk`, `toss-payments-sdk`

**포함하면 안 되는 것:**
- `Read`, `Write` (기본 동작)
- `TypeScript`, `React` (기술 스택)

---

## 6. Supabase 연결 정보

### 환경변수 위치
```
📁 P3_프로토타입_제작/Database/.env
```

### 환경변수 목록

| 변수명 | 용도 |
|--------|------|
| `SUPABASE_URL` | 프로젝트 URL |
| `SUPABASE_ANON_KEY` | 공개 키 (클라이언트용) |
| `SUPABASE_SERVICE_ROLE_KEY` | 관리자 키 (서버용) |

### 테이블명

| 용도 | 테이블명 |
|------|---------|
| Task 관리 | `project_sal_grid` |
| Stage 검증 | `stage_verification` |

---

## 7. Supabase CRUD 작업 방법

### 핵심 원칙

```
🚫 PO(사람)에게 SQL 실행을 요청하지 마라!
✅ AI가 직접 실행해야 함!
```

### 우선순위

| 순위 | 방법 | 사용 조건 |
|:----:|------|----------|
| **1** | REST API (Node.js) | **기본 방법** - 항상 작동 |
| 2 | Supabase MCP | MCP 연결 시 |
| 3 | Supabase CLI | CLI 설치 시 |
| 4 | Dashboard SQL Editor | 최후 수단 (PO 수동) |

### REST API 사용법

```
URL: https://{프로젝트}.supabase.co/rest/v1/{테이블명}
인증: apikey + Authorization 헤더에 SERVICE_ROLE_KEY
```

| 작업 | HTTP | 경로 예시 |
|------|------|----------|
| 조회 | GET | `/rest/v1/project_sal_grid?select=*` |
| 생성 | POST | `/rest/v1/project_sal_grid` |
| 수정 | PATCH | `/rest/v1/project_sal_grid?task_id=eq.S5U2` |
| 삭제 | DELETE | `/rest/v1/project_sal_grid?task_id=eq.S5U2` |

### PO(사람)에게 요청해야 하는 경우

아래 조건을 **모두** 만족할 때만 PO에게 요청:

1. REST API 시도 → 실패 (3회 이상)
2. MCP 시도 → 실패 또는 연결 안 됨
3. CLI 시도 → 설치 안 됨 또는 실패

**위 3가지 모두 실패한 경우에만:**
- "모든 방법 시도 후 실패했습니다. Dashboard에서 실행해주세요."
- SQL 파일 생성하여 제공

---

## 8. Task 완료/수정 시 Grid 자동 업데이트 ⭐ 필수!

### 핵심 원칙

```
🚫 Task 작업만 하고 Grid 업데이트 없이 끝내지 마라!
✅ 작업 완료 후 반드시 project_sal_grid 테이블 업데이트!
```

### 업데이트 시점

| 상황 | 업데이트 필드 |
|------|-------------|
| Task 시작 | `task_status`: 'In Progress', `task_progress`: 진행률 |
| Task 작업 완료 | `task_status`: 'Executed', `task_progress`: 100, `generated_files` |
| 검증 완료 | `verification_status`: 'Verified', `task_status`: 'Completed', 검증 관련 필드들 |
| 버그 수정 | `modification_history`, `remarks`, `updated_at` |

### modification_history 형식

```json
{
    "2025-12-20": "초기 구현 - 기능 설명",
    "2025-12-21": [
        "수정 내역 1",
        "수정 내역 2",
        "수정 내역 3"
    ]
}
```

### 업데이트 코드 템플릿

```javascript
// Task 완료/수정 시 Grid 업데이트
const updateData = {
    task_status: 'Completed',           // 상태
    task_progress: 100,                  // 진행률
    generated_files: '파일1, 파일2',      // 생성/수정된 파일
    modification_history: JSON.stringify({
        '날짜': ['수정내역1', '수정내역2']
    }),
    remarks: '작업 요약',
    updated_at: new Date().toISOString()
};

// PATCH 요청
fetch(SUPABASE_URL + '/rest/v1/project_sal_grid?task_id=eq.S4F5', {
    method: 'PATCH',
    headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
});
```

### 필수 업데이트 필드 (작업 완료 시)

| 필드 | 필수 | 설명 |
|------|:----:|------|
| `task_status` | ✅ | 'Completed' |
| `task_progress` | ✅ | 100 |
| `generated_files` | ✅ | 생성/수정된 파일 목록 |
| `modification_history` | ⭐ | 수정 이력 (버그 수정 시 필수) |
| `remarks` | ✅ | 작업 요약 |
| `updated_at` | ✅ | 현재 시간 |

### 자동 업데이트 프로세스

```
┌─────────────────────────────────────────────────────────────────┐
│  Task 작업 완료                                                  │
│      ↓                                                          │
│  project_sal_grid 테이블에서 해당 task_id 조회                    │
│      ↓                                                          │
│  PATCH로 상태/진행률/파일목록/수정이력 업데이트                   │
│      ↓                                                          │
│  work_logs/current.md에 작업 내역 기록                          │
│      ↓                                                          │
│  완료 보고                                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. JSON 데이터 구조 및 Viewer 로딩 방식 (GitHub URL 통합)

> **적용 대상:** JSON Viewer (`viewer_json.html`, `viewer_mobile_json.html`)
> **데이터 형식:** index.json + grid_records/*.json (개별 파일)
> **로딩 방식:** Supabase users 테이블 → github_repo_url → GitHub raw URL

### JSON 폴더 구조

```
S0_Project-SAL-Grid_생성/method/json/data/
├── index.json             ← 프로젝트 메타데이터 + task_ids 배열
└── grid_records/          ← 개별 Task JSON 파일 (66개)
    ├── S1BI1.json
    ├── S1BI2.json
    ├── S2F1.json
    └── ... (Task ID별 파일)
```

### Viewer 데이터 로딩 방식 ⭐ (GitHub URL 통합)

> **모든 사용자가 동일한 방식으로 GitHub raw URL에서 데이터 로드**

```javascript
// 1. 사용자 이메일 확인 (URL 파라미터 또는 Supabase 세션)
const urlParams = new URLSearchParams(window.location.search);
let userEmail = urlParams.get('email') || session?.user?.email;

// 2. Supabase users 테이블에서 github_repo_url 조회
const { data: userData } = await supabaseClient
    .from('users')
    .select('github_repo_url')
    .eq('email', userEmail)
    .single();

// 3. GitHub repo URL → raw URL 변환
// 예: github.com/user/repo → raw.githubusercontent.com/user/repo/master
const rawBaseUrl = githubToRawUrl(userData.github_repo_url);

// 4. index.json 로드
const indexUrl = `${rawBaseUrl}/S0_.../method/json/data/index.json`;
const indexData = await fetch(indexUrl).then(r => r.json());

// 5. 각 Task JSON 파일 로드
for (const taskId of indexData.task_ids) {
    const taskUrl = `${rawBaseUrl}/S0_.../method/json/data/grid_records/${taskId}.json`;
    const taskData = await fetch(taskUrl).then(r => r.json());
    // Task 데이터 처리
}
```

### 핵심 포인트

| 항목 | 내용 |
|------|------|
| 사용자 분기 | 없음 (모든 사용자 동일 방식) |
| 데이터 소스 | Supabase `users` 테이블의 `github_repo_url` 필드 |
| 로딩 URL | GitHub raw URL (`raw.githubusercontent.com/...`) |
| 캐시 | 없음 (즉시 반영) |

### 코드 위치 참조

| 항목 | 파일 | 라인 |
|------|------|------|
| `githubToRawUrl()` 함수 | `viewer_json.html` | 416-425 |
| 에러 핸들링 | `viewer_json.html` | 574-598 |

### 에러 핸들링

| 에러 상황 | 에러 코드 | UI 표시 |
|----------|----------|---------|
| 사용자 미등록 (users 테이블) | `PGRST116` | "GitHub 연결 필요" (회색 배지) |
| github_repo_url 없음 | - | "프로젝트 없음" 메시지 |
| 기타 조회 실패 | - | "사용자 조회 실패" (빨강 배지) |
| JSON 파일 404 | fetch error | "프로젝트 없음" 메시지 |

### "프로젝트 없음" 안내 메시지

index.json 파일이 없을 때 (404 응답) 표시:

```
📋 진행 중인 프로젝트가 아직 없습니다

프로젝트를 등록하고 Project SAL Grid를 생성하면
여기에 진행 현황이 표시됩니다.

👉 메인 화면 왼쪽 사이드바에서 새로운 프로젝트를 등록하세요.

💡 진행 프로세스에서 S0 단계인 'Project SAL Grid 생성'이 끝나면,
   Claude Code에게 Viewer 연결을 요청하세요.
```

### 관련 파일

| 파일 | 위치 |
|------|------|
| 데스크톱 Viewer | `S0_Project-SAL-Grid_생성/viewer/viewer_json.html` |
| 모바일 Viewer | `S0_Project-SAL-Grid_생성/viewer/viewer_mobile_json.html` |
| 프로젝트 메타데이터 | `S0_Project-SAL-Grid_생성/method/json/data/index.json` |
| 개별 Task 파일 | `S0_Project-SAL-Grid_생성/method/json/data/grid_records/*.json` |
| 사용자 정보 (github_repo_url) | Supabase `users` 테이블 |

---

## 체크리스트

### Grid 작성
- [ ] Task Agent가 Area에 맞는가?
- [ ] Verification Agent가 Task Agent와 다른가?
- [ ] Verification 필드가 JSON 형식인가?
- [ ] Tools에 기본 도구(Read/Write)가 없는가?

### Supabase 작업
- [ ] 테이블명이 `project_sal_grid`인가? (`tasks` 아님)
- [ ] REST API를 먼저 시도했는가?
- [ ] .env 파일에서 SERVICE_ROLE_KEY를 사용했는가?
- [ ] PO 요청은 3가지 방법 모두 실패 후인가?

### Task 완료/수정 시 Grid 업데이트 ⭐
- [ ] task_status를 'Completed'로 변경했는가?
- [ ] task_progress를 100으로 변경했는가?
- [ ] generated_files에 생성/수정 파일 기록했는가?
- [ ] modification_history에 수정 이력 추가했는가? (버그 수정 시)
- [ ] remarks에 작업 요약 기록했는가?
- [ ] updated_at을 현재 시간으로 업데이트했는가?
