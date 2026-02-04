# 04. Grid 작성 및 CSV 작업 규칙

> Project Task Grid 데이터 작성 및 CSV 파일 CRUD 작업 시 준수 사항

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
    "unit_test": "PASS/FAIL/PENDING 설명",
    "integration_test": "PASS/FAIL/PENDING 설명",
    "edge_cases": "PASS/FAIL/PENDING 설명",
    "manual_test": "PASS/FAIL/PENDING 설명"
}
```

### #17 Build Verification
```json
{
    "compile": "PASS/FAIL/N/A 설명",
    "lint": "PASS/FAIL/N/A 설명",
    "deploy": "PASS/FAIL/N/A 설명",
    "runtime": "PASS/FAIL/N/A 설명"
}
```

### #18 Integration Verification
```json
{
    "dependency_propagation": "PASS/FAIL 설명",
    "cross_task_connection": "PASS/FAIL 설명",
    "data_flow": "PASS/FAIL 설명"
}
```

### #19 Blockers
```json
{
    "dependency": "None/WARNING 설명",
    "environment": "None/WARNING 설명",
    "external_api": "None/WARNING 설명",
    "status": "No Blockers / N Blockers"
}
```

### #20 Comprehensive Verification
```json
{
    "task_instruction": "PASS/FAIL 설명",
    "test": "PASS/FAIL N/N 통과",
    "build": "PASS/FAIL N/N 통과",
    "integration": "PASS/FAIL N/N 통과",
    "blockers": "None/N개",
    "final": "Passed / Failed"
}
```

---

## 5. Tools 필드 올바른 값

**포함해야 할 것:**
- Slash Commands: `/review-pr`, `/deploy`, `/test`
- CLI 도구: `gh`, `vercel-cli`, `npm`
- MCP Servers: `browser-mcp`
- Skills: `pdf-skill`, `playwright-mcp`
- SDK: `openai-sdk`

**포함하면 안 되는 것:**
- `Read`, `Write` (기본 동작)
- `TypeScript`, `React` (기술 스택)

---

## 6. CSV 파일 정보

### CSV 파일 위치
```
{project-root}/S0_Project-SAL-Grid_생성/data/sal_grid.csv
```

### CSV 파일 형식

```csv
task_id,task_name,stage,area,task_status,task_progress,verification_status,...
S1F1,로그인 페이지 구현,1,F,Pending,0,Not Verified,...
S1F2,회원가입 페이지 구현,1,F,In Progress,50,Not Verified,...
```

### 필수 컬럼

| 컬럼 | 설명 | 예시 값 |
|------|------|--------|
| task_id | Task 고유 ID | S1F1, S2BA1 |
| task_name | Task 이름 | 로그인 페이지 구현 |
| stage | Stage 번호 | 1, 2, 3, 4, 5 |
| area | Area 코드 | F, BA, D, S, ... |
| task_status | 작업 상태 | Pending, In Progress, Executed, Completed |
| task_progress | 진행률 | 0~100 |
| verification_status | 검증 상태 | Not Verified, In Review, Verified, Needs Fix |

---

## 7. CSV CRUD 작업 방법

### 핵심 원칙

```
CSV 파일을 직접 수정!
Read -> Parse -> Modify -> Write 순서로 작업
```

### 읽기 (Read)

```javascript
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'S0_Project-SAL-Grid_생성/data/sal_grid.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// CSV 파싱
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');
const data = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, i) => row[h.trim()] = values[i]);
    return row;
});
```

### 수정 (Update)

```javascript
// 특정 Task 찾기
const taskIndex = data.findIndex(row => row.task_id === 'S1F1');

if (taskIndex !== -1) {
    // 필드 수정
    data[taskIndex].task_status = 'Completed';
    data[taskIndex].task_progress = '100';
    data[taskIndex].verification_status = 'Verified';
}
```

### 쓰기 (Write)

```javascript
// CSV 문자열 생성
const csvLines = [headers.join(',')];
data.forEach(row => {
    const values = headers.map(h => {
        const val = row[h.trim()] || '';
        // 쉼표나 줄바꿈 포함 시 따옴표로 감싸기
        return val.includes(',') || val.includes('\n') ? `"${val}"` : val;
    });
    csvLines.push(values.join(','));
});

fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf-8');
```

### CSV 라인 파싱 함수

```javascript
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}
```

---

## 8. Task 완료/수정 시 Grid 자동 업데이트

### 핵심 원칙

```
Task 작업만 하고 Grid 업데이트 없이 끝내지 마라!
작업 완료 후 반드시 CSV 파일 업데이트!
```

### 업데이트 시점

| 상황 | 업데이트 필드 |
|------|-------------|
| Task 시작 | `task_status`: 'In Progress', `task_progress`: 진행률 |
| Task 작업 완료 | `task_status`: 'Executed', `task_progress`: 100, `generated_files` |
| 검증 완료 | `verification_status`: 'Verified', `task_status`: 'Completed' |
| 버그 수정 | `modification_history`, `remarks`, `updated_at` |

### 업데이트 프로세스

```
Task 작업 완료
     |
CSV 파일 읽기
     |
해당 task_id 행 찾기
     |
상태/진행률/파일목록 업데이트
     |
CSV 파일 저장
     |
work_logs/current.md에 작업 내역 기록
     |
완료 보고
```

---

## 체크리스트

### Grid 작성
- [ ] Task Agent가 Area에 맞는가?
- [ ] Verification Agent가 Task Agent와 다른가?
- [ ] Verification 필드가 JSON 형식인가?
- [ ] Tools에 기본 도구(Read/Write)가 없는가?

### CSV 작업
- [ ] CSV 파일 경로가 올바른가?
- [ ] CSV 파싱 시 따옴표 처리를 했는가?
- [ ] 수정 후 파일을 저장했는가?
- [ ] UTF-8 인코딩으로 저장했는가?

### Task 완료/수정 시 Grid 업데이트
- [ ] task_status를 'Completed'로 변경했는가?
- [ ] task_progress를 100으로 변경했는가?
- [ ] generated_files에 생성/수정 파일 기록했는가?
- [ ] verification_status를 'Verified'로 변경했는가?
- [ ] CSV 파일을 저장했는가?
