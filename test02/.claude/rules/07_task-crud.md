# Task 추가/삭제/수정 프로세스

> **두 가지 방식 지원:** DB Method (Supabase) | JSON Method (JSON)
>
> Task 추가, 삭제, 수정 시 반드시 아래 **5개 위치**를 모두 업데이트해야 함

---

## 🔀 방식 선택 가이드

| 방식 | 사용 대상 | 데이터 저장 | 도구 | Stage Gate 위치 |
|------|----------|------------|------|----------------|
| **DB Method** | SSAL Works (내부) | Supabase DB | REST API | `Database_Method/stage-gates/` |
| **JSON Method** | 일반 사용자 | JSON 파일 | Claude Code Edit | `method/json/stage-gates/` |

**⚠️ SSAL Works는 두 방식을 동시에 사용 (내부 관리용 DB + 사용자 배포용 JSON)**

### 언제 어떤 방식을 사용하는가?

| 상황 | 선택 | 이유 |
|------|------|------|
| SSAL Works 내부 Task 관리 | DB Method | 실시간 동기화, 다중 사용자 |
| 사용자에게 배포할 템플릿 | JSON Method | Supabase 없이 작동 |
| 외부 이용자 프로젝트 | JSON Method | 독립 실행 가능 |
| 두 방식 동시 적용 | **둘 다** | SSAL Works 내부 운영 |

---

## 📋 업데이트 필수 위치 (5개)

| # | 위치 | DB Method | JSON Method |
|---|------|-----------|------------|
| 1 | SSALWORKS_TASK_PLAN.md | ✅ 동일 | ✅ 동일 |
| 2 | Task Instruction 파일 | ✅ 동일 | ✅ 동일 |
| 3 | Verification Instruction 파일 | ✅ 동일 | ✅ 동일 |
| 4 | **데이터 저장** | Supabase DB | **JSON 파일** |
| 5 | 작업 로그 (work_logs/current.md) | ✅ 동일 | ✅ 동일 |

---

## ⚠️ 상태 전이 규칙 (필수 준수)

> `.claude/CLAUDE.md` 절대 규칙 3 참조

```
task_status 전이:
Pending → In Progress → Executed → Completed
                                      ↑
                              Verified 후만 가능!

verification_status 전이:
Not Verified → In Review → Verified (또는 Needs Fix)
```

**핵심**: `Completed`는 `verification_status = 'Verified'`일 때만 설정 가능!

---

## Task 추가 시나리오 구분

| 시나리오 | 설명 | task_status | verification_status |
|----------|------|-------------|---------------------|
| **A. 신규 Task** | 아직 작업 안 한 Task 추가 | `Pending` | `Not Verified` |
| **B. 완료된 Task** | 이미 작업 완료한 것을 Task로 등록 | `Completed` | `Verified` |

---

## Task 신규 추가 프로세스

### Step 1: Task ID 결정 + SAL ID 부여 (Provisional, 가확정)

```
형식: S[Stage][Area][번호]
예시: S4F5 = Stage 4 + Frontend + 5번째
```

**⚠️ SAL ID 부여 규칙 (의존성 기반):**
```
┌─────────────────────────────────────────────────────────────┐
│ SAL ID는 의존성·병렬성·인접성을 인코딩합니다                  │
│                                                             │
│ 1. 선행 Task ID < 후행 Task ID (의존성 방향)                │
│    예: S1D1 → S2F1 (O), S2F1 → S1D1 (X)                    │
│                                                             │
│ 2. 동일 Stage·Area 내 Task는 병렬 실행 가능                 │
│    예: S2F1, S2F2, S2F3는 동시 실행 가능                    │
│                                                             │
│ 3. Stage 번호가 작을수록 먼저 실행됨                         │
│    S1 → S2 → S3 → S4 → S5 순서                            │
└─────────────────────────────────────────────────────────────┘
```

**이 단계에서 ID는 '가확정(Provisional)' 상태입니다.**
→ Step 5에서 의존성 검증 후 '최종 확정(Finalization)'됩니다.

**기존 Task 확인:**
```bash
ls S0_Project-SAL-Grid_생성/sal-grid/task-instructions/ | grep "S4F"
```

### Step 2: SSALWORKS_TASK_PLAN.md 업데이트

**파일 위치:** `S0_Project-SAL-Grid_생성/sal-grid/SSALWORKS_TASK_PLAN.md`

**업데이트 항목:**
1. **총 Task 수 업데이트**: 헤더의 `총 Task 수` 변경
2. **Stage별 Task 수 표**: 해당 Stage 행 수정
3. **Area별 분포 표**: 해당 Area 열 수정
4. **Stage 섹션**: 해당 Stage의 Area 섹션에 Task 추가
5. **버전 및 수정일**: 버전 증가, 수정일 업데이트
6. **변경 이력 섹션**: 변경 내용 기록

해당 Stage의 Area 섹션에 Task 추가:
```markdown
| S4F5 | Task 이름 | 설명 | 의존성 |
```

변경 이력 추가:
```markdown
### v4.X (YYYY-MM-DD)
- **신규 Task 추가**: {TaskID} ({Task Name})
- **Task 수 변경**: N → N+1 tasks
- **S{N} Task 수**: N → N+1
- **이유**: {추가 이유}
```

### Step 3: Task Instruction 파일 생성

**저장 위치:** `S0_Project-SAL-Grid_생성/sal-grid/task-instructions/{TaskID}_instruction.md`

**템플릿:**
```markdown
# {TaskID}: {Task Name}

## Task 정보
- **Task ID**: {TaskID}
- **Task Name**: {Task Name}
- **Stage**: S{N} ({Stage Name})
- **Area**: {Area Code} ({Area Name})
- **Dependencies**: {선행 Task ID}

## Task 목표

{목표 설명}

## 수정 사항

{구체적인 수정 내용}

## 생성/수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `파일경로` | 변경 설명 |

---

## 필수 참조 규칙

| 규칙 파일 | 내용 | 참조 시점 |
|----------|------|----------|
| `.claude/rules/02_save-location.md` | 저장 위치 규칙 | 파일 저장 시 |
| `.claude/rules/05_execution-process.md` | 6단계 실행 프로세스 | 작업 전체 |
```

### Step 4: Verification Instruction 파일 생성

**저장 위치:** `S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/{TaskID}_verification.md`

**템플릿:**
```markdown
# {TaskID}: {Task Name} - 검증 지침

## 검증 정보
- **Task ID**: {TaskID}
- **Verification Agent**: code-reviewer

## 검증 항목

### 1. 코드 검증
- [ ] 검증 항목 1
- [ ] 검증 항목 2

### 2. 기능 테스트
- [ ] 테스트 항목 1
- [ ] 테스트 항목 2

## 통과 기준

{통과 조건 설명}

---

## 필수 참조 규칙

| 규칙 파일 | 내용 | 참조 시점 |
|----------|------|----------|
| `.claude/rules/06_verification.md` | 검증 기준 | 핵심 참조 |
```

### Step 5: 의존성 검증 (SAL ID Finalization)

> **⚠️ 데이터 저장 전 반드시 의존성 검증 수행!**

**의존성 검증 체크리스트:**
```
┌─────────────────────────────────────────────────────────────┐
│ □ 선행 Task ID < 후행 Task ID인가?                          │
│   → dependencies 필드에 명시된 Task가 현재 Task보다 작아야 함 │
│   → 예: S2F1의 dependencies가 "S1D1"이면 OK (1 < 2)         │
│   → 예: S2F1의 dependencies가 "S3BA1"이면 ERROR (2 < 3 위반)│
│                                                             │
│ □ 순환 의존성이 없는가?                                      │
│   → A → B → A 같은 순환 금지                                │
│                                                             │
│ □ 존재하지 않는 Task를 참조하지 않는가?                      │
│   → dependencies에 없는 Task ID 참조 금지                   │
└─────────────────────────────────────────────────────────────┘
```

**검증 결과 처리:**
| 결과 | 조치 |
|------|------|
| ✅ 통과 | SAL ID **확정(Finalization)** → Step 6 진행 |
| ❌ 위반 | Step 1로 돌아가 **ID 수정** 후 재검증 |

---

### Step 6: 데이터 저장 (방식별 분기)

**⚠️ 시나리오에 따라 상태값 다르게 설정!**
**⚠️ SSAL Works는 6A + 6B 둘 다 수행!**

---

#### 📌 Step 6A: DB Method (Supabase)

> **적용 대상:** SSAL Works 내부 관리, Supabase 사용 프로젝트

##### 시나리오 A: 신규 Task (아직 작업 안 함)

```javascript
// project_sal_grid 테이블에 INSERT
const { data, error } = await supabase
    .from('project_sal_grid')
    .insert({
        task_id: 'S4F5',
        task_name: 'Task 이름',
        stage: 4,  // integer: 1~5
        area: 'F', // M, U, F, BI, BA, D, S, T, O, E, C
        task_status: 'Pending',           // ← 신규: Pending
        task_progress: 0,                 // ← 신규: 0
        verification_status: 'Not Verified',  // ← 필수! 명시적으로 설정
        dependencies: 'S2BA5',
        task_instruction: 'Task 수행 지침 요약',
        task_agent: 'frontend-developer',
        verification_instruction: '검증 지침 요약',
        verification_agent: 'code-reviewer',
        execution_type: 'AI-Only'
    });
```

##### 시나리오 B: 완료된 Task (이미 작업 완료, 사후 등록)

```javascript
// project_sal_grid 테이블에 INSERT
const { data, error } = await supabase
    .from('project_sal_grid')
    .insert({
        task_id: 'S4F5',
        task_name: 'Task 이름',
        stage: 4,
        area: 'F',
        task_status: 'Completed',         // ← 완료됨: Completed
        task_progress: 100,               // ← 완료됨: 100
        verification_status: 'Verified',  // ← 완료됨: Verified
        generated_files: '생성된 파일 목록',  // ← 완료됨: 결과물 기록
        dependencies: 'S2BA5',
        task_instruction: 'Task 수행 지침 요약',
        task_agent: 'frontend-developer',
        verification_instruction: '검증 지침 요약',
        verification_agent: 'code-reviewer',
        execution_type: 'AI-Only',
        remarks: '이미 완료된 작업. YYYY-MM-DD 완료.'
    });
```

---

#### 📌 Step 6B: JSON Method (개별 파일 방식)

> **적용 대상:** 일반 사용자, Supabase 없는 프로젝트

**JSON 폴더 구조:**
```
S0_Project-SAL-Grid_생성/method/json/data/
├── index.json             ← 프로젝트 메타데이터 + task_ids 배열
└── grid_records/          ← 개별 Task JSON 파일
    ├── S1BI1.json
    ├── S2F1.json
    └── ... (Task ID별 파일)
```

**핵심:** Viewer는 `index.json` + `grid_records/*.json` 구조를 로드

##### 시나리오 A: 신규 Task (아직 작업 안 함)

**1. index.json에 task_id 추가:**
```json
{
  "task_ids": ["S1BI1", "S1BI2", ..., "S4F5"]  // 새 Task ID 추가
}
```

**2. grid_records/S4F5.json 파일 생성:**
```json
{
    "task_id": "S4F5",
    "task_name": "Task 이름",
    "stage": 4,
    "area": "F",
    "task_status": "Pending",
    "task_progress": 0,
    "verification_status": "Not Verified",
    "dependencies": "S2BA5",
    "task_instruction": "Task 수행 지침 요약",
    "task_agent": "frontend-developer",
    "verification_instruction": "검증 지침 요약",
    "verification_agent": "code-reviewer",
    "execution_type": "AI-Only"
}
```

##### 시나리오 B: 완료된 Task (이미 작업 완료, 사후 등록)

**grid_records/S4F5.json:**
```json
{
    "task_id": "S4F5",
    "task_name": "Task 이름",
    "stage": 4,
    "area": "F",
    "task_status": "Completed",
    "task_progress": 100,
    "verification_status": "Verified",
    "generated_files": "생성된 파일 목록",
    "dependencies": "S2BA5",
    "task_instruction": "Task 수행 지침 요약",
    "task_agent": "frontend-developer",
    "verification_instruction": "검증 지침 요약",
    "verification_agent": "code-reviewer",
    "execution_type": "AI-Only",
    "remarks": "이미 완료된 작업. YYYY-MM-DD 완료."
}
```

**Claude Code가 JSON 파일 수정:**
```bash
# 1. index.json의 task_ids 배열에 새 Task ID 추가
# 2. grid_records/ 폴더에 {TaskID}.json 파일 생성/수정
```

---

**Stage 번호:**
| Stage | 번호 |
|-------|------|
| S1 | 1 |
| S2 | 2 |
| S3 | 3 |
| S4 | 4 |
| S5 | 5 |

### Step 7: 작업 로그 업데이트

**파일 위치:** `.claude/work_logs/current.md`

작업 내용 기록:
```markdown
## {TaskID} Task 추가 (YYYY-MM-DD)

### 작업 상태: ✅ 완료

### 추가된 Task
| Task ID | Task Name | Area | 설명 |
|---------|-----------|------|------|
| {TaskID} | {Task Name} | {Area} | {설명} |

### 업데이트된 파일
1. SSALWORKS_TASK_PLAN.md
2. task-instructions/{TaskID}_instruction.md
3. verification-instructions/{TaskID}_verification.md
4. Supabase DB (project_sal_grid)
```

### Step 8: Git 커밋 & 푸시

```bash
git add S0_Project-SAL-Grid_생성/sal-grid/task-instructions/{TaskID}_instruction.md
git add S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/{TaskID}_verification.md
git add S0_Project-SAL-Grid_생성/sal-grid/SSALWORKS_TASK_PLAN.md
git add .claude/work_logs/current.md
git commit -m "feat: {TaskID} {Task Name} Task 추가"
git push
```

---

## Task 삭제 프로세스

### Step 1: SSALWORKS_TASK_PLAN.md에서 제거

**업데이트 항목:**
1. **총 Task 수**: 감소
2. **Stage별 Task 수 표**: 해당 Stage 행 수정
3. **Area별 분포 표**: 해당 Area 열 수정
4. **Stage 섹션**: 해당 Task 행 삭제
5. **버전 및 수정일**: 버전 증가, 수정일 업데이트
6. **변경 이력 섹션**: 삭제 내용 기록

### Step 2: Instruction 파일 삭제

```bash
rm S0_Project-SAL-Grid_생성/sal-grid/task-instructions/{TaskID}_instruction.md
rm S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/{TaskID}_verification.md
```

### Step 3: 데이터 삭제 (방식별 분기)

**⚠️ SSAL Works는 3A + 3B 둘 다 수행!**

#### 📌 Step 3A: DB Method (Supabase)

```javascript
const { error } = await supabase
    .from('project_sal_grid')
    .delete()
    .eq('task_id', 'S4F5');
```

#### 📌 Step 3B: JSON Method (개별 파일 방식)

```bash
# 1. index.json의 task_ids 배열에서 해당 task_id 제거
# 2. grid_records/{TaskID}.json 파일 삭제
```

**JSON 파일 위치:**
- 메타데이터: `S0_Project-SAL-Grid_생성/method/json/data/index.json`
- 개별 Task: `S0_Project-SAL-Grid_생성/method/json/data/grid_records/{TaskID}.json`

### Step 4: 작업 로그 업데이트

`.claude/work_logs/current.md`에 삭제 내용 기록

### Step 5: Git 커밋 & 푸시

```bash
git add -A
git commit -m "chore: {TaskID} Task 삭제"
git push
```

---

## Task 수정 프로세스

> Task 이름, 목표, 설명 등을 변경할 때 사용

### Step 1: 수정 내용 정의

**수정 가능 항목:**
- task_name (Task 이름)
- task_instruction (Task 목표/지침)
- verification_instruction (검증 지침)
- remarks (설명)
- dependencies (의존성)
- task_agent / verification_agent
- execution_type
- tools

### Step 2: SSALWORKS_TASK_PLAN.md 업데이트

**파일 위치:** `S0_Project-SAL-Grid_생성/sal-grid/SSALWORKS_TASK_PLAN.md`

**업데이트 항목:**
1. **해당 Task 행**: Task 이름, 설명 변경
2. **의존성 다이어그램**: Task 이름이 변경된 경우 다이어그램도 수정
3. **버전 및 수정일**: 버전 증가, 수정일 업데이트
4. **변경 이력 섹션**: 변경 내용 기록

변경 이력 추가:
```markdown
### v4.X (YYYY-MM-DD)
- **Task 수정**: {TaskID} "{이전 이름}" → "{새 이름}"
- **변경 내용**: {변경 사항 설명}
- **이유**: {수정 이유}
```

### Step 3: Task Instruction 파일 수정

**파일 위치:** `S0_Project-SAL-Grid_생성/sal-grid/task-instructions/{TaskID}_instruction.md`

```bash
# 파일 열어서 내용 수정
# Task Name, Task Goal, Instructions 등 변경
```

### Step 4: Verification Instruction 파일 수정

**파일 위치:** `S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/{TaskID}_verification.md`

```bash
# 검증 목표, 체크리스트 등 변경
```

### Step 5: 데이터 업데이트 (방식별 분기)

**⚠️ SSAL Works는 6A + 6B 둘 다 수행!**

#### 📌 Step 6A: DB Method (Supabase)

```bash
# curl로 PATCH 요청
curl -X PATCH "https://zwjmfewyshhwpgwdtrus.supabase.co/rest/v1/project_sal_grid?task_id=eq.{TaskID}" \
  -H "apikey: {SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d @update.json
```

**update.json 예시:**
```json
{
  "task_name": "새로운 Task 이름",
  "remarks": "새로운 설명"
}
```

**주의:** 한글이 포함된 JSON은 파일로 저장 후 `@파일명` 방식 사용

#### 📌 Step 6B: JSON Method (개별 파일 방식)

```bash
# Claude Code의 Edit 도구로 grid_records/{TaskID}.json 파일 직접 수정
```

**JSON 파일 위치:** `S0_Project-SAL-Grid_생성/method/json/data/grid_records/{TaskID}.json`

**수정 예시 (grid_records/S4F5.json):**
```json
// 기존
{ "task_id": "S4F5", "task_name": "이전 이름", ... }

// 수정 후
{ "task_id": "S4F5", "task_name": "새로운 Task 이름", ... }
```

### Step 6: 작업 로그 업데이트

**파일 위치:** `.claude/work_logs/current.md`

```markdown
## {TaskID} Task 수정 (YYYY-MM-DD)

### 작업 상태: ✅ 완료

### 수정 내용
| 항목 | 이전 | 이후 |
|------|------|------|
| Task Name | {이전 이름} | {새 이름} |
| 설명 | {이전 설명} | {새 설명} |

### 업데이트된 파일/위치
1. SSALWORKS_TASK_PLAN.md
2. task-instructions/{TaskID}_instruction.md
3. verification-instructions/{TaskID}_verification.md
4. Supabase project_sal_grid 테이블
```

### Step 7: Git 커밋 & 푸시

```bash
git add S0_Project-SAL-Grid_생성/sal-grid/task-instructions/{TaskID}_instruction.md
git add S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/{TaskID}_verification.md
git add S0_Project-SAL-Grid_생성/sal-grid/SSALWORKS_TASK_PLAN.md
git add .claude/work_logs/current.md
git commit -m "refactor: {TaskID} Task 수정 - {변경 요약}"
git push
```

---

## Task 상태 업데이트 (작업/검증 완료 시)

> Task가 실행되거나 검증이 완료되면 데이터 상태를 업데이트해야 함
> **⚠️ SSAL Works는 DB + JSON 둘 다 업데이트!**

---

### 📌 DB Method (Supabase)

#### 작업 완료 시 (Executed)

```javascript
// task_status를 Executed로 변경
await supabase
    .from('project_sal_grid')
    .update({
        task_status: 'Executed',
        task_progress: 100,
        generated_files: '생성된 파일 목록',
        updated_at: new Date().toISOString()
    })
    .eq('task_id', 'S4F5');
```

#### 검증 완료 시 (Verified → Completed)

```javascript
// 1. verification_status를 Verified로 변경
await supabase
    .from('project_sal_grid')
    .update({
        verification_status: 'Verified',
        updated_at: new Date().toISOString()
    })
    .eq('task_id', 'S4F5');

// 2. Verified 확인 후 task_status를 Completed로 변경
await supabase
    .from('project_sal_grid')
    .update({
        task_status: 'Completed'
    })
    .eq('task_id', 'S4F5');
```

#### 상태 확인 쿼리

```javascript
// 특정 Task 상태 조회
const { data } = await supabase
    .from('project_sal_grid')
    .select('task_id, task_status, verification_status, task_progress')
    .eq('task_id', 'S4F5');

console.log(data);
// 예상 결과: { task_id: 'S4F5', task_status: 'Completed', verification_status: 'Verified', task_progress: 100 }
```

---

### 📌 JSON Method (개별 파일 방식)

**JSON 파일 위치:** `S0_Project-SAL-Grid_생성/method/json/data/grid_records/{TaskID}.json`

#### 작업 완료 시 (Executed)

```json
// Claude Code Edit 도구로 grid_records/S4F5.json 수정
{
    "task_id": "S4F5",
    "task_status": "Executed",
    "task_progress": 100,
    "generated_files": "생성된 파일 목록",
    "updated_at": "2025-12-25T12:00:00Z"
}
```

#### 검증 완료 시 (Verified → Completed)

```json
// 1단계: verification_status 변경
{
    "task_id": "S4F5",
    "verification_status": "Verified"
}

// 2단계: task_status를 Completed로 변경
{
    "task_id": "S4F5",
    "task_status": "Completed"
}
```

---

**⚠️ 중요**: `Completed`는 반드시 `verification_status = 'Verified'` 확인 후 설정!

---

## 체크리스트

### 신규 추가 시

- [ ] **시나리오 확인**: 신규(Pending) vs 완료됨(Completed)?
- [ ] **방식 확인**: DB Method / JSON Method / 둘 다?
- [ ] SSALWORKS_TASK_PLAN.md 업데이트 (Task 추가 + 수치 변경 + 변경 이력)
- [ ] task-instructions/{TaskID}_instruction.md 생성
- [ ] verification-instructions/{TaskID}_verification.md 생성
- [ ] **의존성 검증 (SAL ID Finalization)**
  - [ ] 선행 Task ID < 후행 Task ID 확인
  - [ ] 순환 의존성 없음 확인
  - [ ] 존재하지 않는 Task 참조 없음 확인
- [ ] **[DB Method]** Supabase `project_sal_grid` 테이블에 INSERT
  - [ ] `task_status` 설정 (Pending 또는 Completed)
  - [ ] `verification_status` 설정 (Not Verified 또는 Verified)
  - [ ] `task_progress` 설정 (0 또는 100)
- [ ] **[JSON Method]** 개별 파일 방식으로 Task 추가
  - [ ] index.json의 task_ids 배열에 새 task_id 추가
  - [ ] grid_records/{TaskID}.json 파일 생성
- [ ] .claude/work_logs/current.md 작업 로그 기록
- [ ] Git 커밋 & 푸시
- [ ] **최종 확인**: DB 또는 JSON에서 상태 확인

### 삭제 시

- [ ] **방식 확인**: DB Method / JSON Method / 둘 다?
- [ ] SSALWORKS_TASK_PLAN.md 업데이트 (Task 제거 + 수치 변경 + 변경 이력)
- [ ] task-instructions/{TaskID}_instruction.md 삭제
- [ ] verification-instructions/{TaskID}_verification.md 삭제
- [ ] **[DB Method]** Supabase `project_sal_grid` 테이블에서 DELETE
- [ ] **[JSON Method]** index.json에서 task_id 제거 + grid_records/{TaskID}.json 삭제
- [ ] .claude/work_logs/current.md 작업 로그 기록
- [ ] Git 커밋 & 푸시

### 수정 시

- [ ] **방식 확인**: DB Method / JSON Method / 둘 다?
- [ ] SSALWORKS_TASK_PLAN.md 업데이트 (해당 행 수정 + 의존성 다이어그램 + 변경 이력)
- [ ] task-instructions/{TaskID}_instruction.md 내용 수정
- [ ] verification-instructions/{TaskID}_verification.md 내용 수정
- [ ] **[DB Method]** Supabase `project_sal_grid` 테이블 PATCH
- [ ] **[JSON Method]** `grid_records/{TaskID}.json` 파일에서 해당 필드 수정
- [ ] .claude/work_logs/current.md 작업 로그 기록
- [ ] Git 커밋 & 푸시

### 상태 업데이트 시 (작업/검증 완료)

- [ ] **방식 확인**: DB Method / JSON Method / 둘 다?
- [ ] 작업 완료 시: `task_status` = 'Executed', `task_progress` = 100
- [ ] 검증 완료 시: `verification_status` = 'Verified'
- [ ] 최종 완료 시: `task_status` = 'Completed' (Verified 후에만!)
- [ ] **[DB Method]** DB 조회로 상태 확인
- [ ] **[JSON Method]** JSON 파일에서 상태 확인

---

## 주의사항

1. **5개 위치 모두 수행**: 하나라도 빠지면 불일치 발생
2. **Task ID 중복 금지**: 기존 Task 확인 후 번호 결정
3. **Stage 번호는 integer**: S4 → 4 (문자열 아님)
4. **Order Sheet는 자동 포함**: Grid 참조 방식이므로 별도 수정 불필요
5. **SSALWORKS_TASK_PLAN.md 수치 정확하게**: 총 Task 수, Stage별/Area별 분포 표 모두 업데이트
6. **변경 이력 필수**: Task Plan에 변경 이력 섹션에 기록
7. **⚠️ 상태 전이 규칙 준수**: Completed는 반드시 Verified 후에만 설정 가능
8. **⚠️ verification_status 필수**: INSERT 시 반드시 verification_status 명시적 설정
9. **⚠️ SSAL Works는 DB + JSON 둘 다**: 두 방식 동시 적용 시 반드시 양쪽 모두 업데이트
10. **⚠️ Stage Gate 경로 구분**: DB Method와 JSON Method의 Stage Gate 저장 위치가 다름
11. **⚠️ JSON 파일 구조**: `index.json` + `grid_records/{TaskID}.json` 개별 파일 방식 사용
12. **⚠️ Task 추가 시**: `index.json`의 `task_ids` 배열에 추가 + `grid_records/`에 새 파일 생성
13. **⚠️ SAL ID 의존성 규칙**: 선행 Task ID < 후행 Task ID (역방향 의존성 금지)
14. **⚠️ 의존성 검증 필수**: 데이터 저장 전 반드시 의존성 검증 수행 (Provisional → Finalization)

---

## 관련 파일

### 공통 파일

| 항목 | 위치 |
|------|------|
| Task Plan | `S0_Project-SAL-Grid_생성/sal-grid/SSALWORKS_TASK_PLAN.md` |
| Task Instructions | `S0_Project-SAL-Grid_생성/sal-grid/task-instructions/` |
| Verification Instructions | `S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/` |
| 통합 매뉴얼 | `S0_Project-SAL-Grid_생성/manual/PROJECT_SAL_GRID_MANUAL.md` |
| 작업 로그 | `.claude/work_logs/current.md` |

### DB Method 전용 파일

| 항목 | 위치 |
|------|------|
| Supabase 테이블 | `project_sal_grid` |
| Stage Gates | `S0_Project-SAL-Grid_생성/Database_Method/stage-gates/` |
| .env 파일 | `P3_프로토타입_제작/Database/.env` |

### JSON Method 전용 파일

| 항목 | 위치 |
|------|------|
| 프로젝트 메타데이터 | `S0_Project-SAL-Grid_생성/method/json/data/index.json` |
| 개별 Task 파일 | `S0_Project-SAL-Grid_생성/method/json/data/grid_records/{TaskID}.json` |
| Stage Gates | `S0_Project-SAL-Grid_생성/method/json/stage-gates/` |
| 유틸리티 스크립트 | `S0_Project-SAL-Grid_생성/method/json/scripts/` |
| JSON 템플릿 | `S0_Project-SAL-Grid_생성/method/json/templates/` |

### JSON Method 폴더 구조 ⭐ (개별 파일 방식)

```
S0_Project-SAL-Grid_생성/method/json/data/
├── index.json             ← 프로젝트 메타데이터 + task_ids 배열
└── grid_records/          ← 개별 Task JSON 파일 (66개)
    ├── S1BI1.json
    ├── S1BI2.json
    ├── S2F1.json
    └── ... (Task ID별 파일)
```

**index.json 구조:**
```json
{
  "project_id": "SSALWORKS",
  "project_name": "SSAL Works",
  "total_tasks": 66,
  "task_ids": ["S1BI1", "S1BI2", "S1D1", ...]
}
```

**Viewer 로딩 순서:**
1. `index.json` 로드 → `task_ids` 배열 확인
2. 각 `task_id`에 대해 `grid_records/{task_id}.json` 로드
3. 전체 Task 데이터 조합하여 표시
