# SAL Grid Viewer 프로세스 문서 불일치 분석 리포트

**작성일:** 2026-01-03
**검증 방식:** 서브에이전트 투입 역검증
**상태:** 검토 대기

---

## 1. 검증 개요

`PROJECT_SAL_GRID_VIEWER_PROCESS.md` 문서 작성 후, 실제 구현과 일치하는지 역검증 수행

---

## 2. 발견된 불일치 사항 (3건)

### 불일치 #1: 폴더 구조

**문서에서 기술한 구조:**
```
method/json/data/
├── in_progress/                ← 문서에만 존재
│   └── project_sal_grid.json
├── completed/                  ← 문서에만 존재
│   └── {project_name}_sal_grid.json
├── users/                      ← 문서에만 존재
│   └── {email}/
│       └── project_sal_grid.json
├── grid_records/
├── stage_gate_records/
└── index.json
```

**실제 폴더 구조:**
```
method/json/data/
├── grid_records/       ← 66개 개별 Task JSON
├── stage_gate_records/ ← 5개 Stage Gate JSON
└── index.json          ← Task ID 목록
```

**없는 폴더:** `in_progress/`, `completed/`, `users/`

---

### 불일치 #2: JSON Method 데이터 로드 방식

**문서 설명:**
```javascript
const userEmail = localStorage.getItem('userEmail');

if (userEmail === 'wksun999@gmail.com') {
    jsonPath = '../method/json/data/in_progress/project_sal_grid.json';
} else {
    jsonPath = `../method/json/data/users/${email}/project_sal_grid.json`;
}
```

**실제 구현 (viewer_json.html Line 527-708):**
```javascript
// 1. URL 파라미터 또는 Supabase 세션에서 이메일
const urlParams = new URLSearchParams(window.location.search);
let userEmail = urlParams.get('email') || session?.user?.email;

// 2. Supabase users 테이블에서 github_repo_url 조회
const { data: userData } = await supabaseClient
    .from('users')
    .select('github_repo_url')
    .eq('email', userEmail)
    .single();

// 3. GitHub raw URL로 데이터 로드
jsonBasePath = userData.github_repo_url;
indexUrl = githubToRawUrl(jsonBasePath, 'S0_.../method/json/data/index.json');
taskUrl = githubToRawUrl(jsonBasePath, `S0_.../method/json/data/grid_records/${taskId}.json`);
```

---

### 불일치 #3: 데이터 형식

| 항목 | 문서 설명 | 실제 구현 |
|------|----------|----------|
| 데이터 형식 | 단일 `project_sal_grid.json` | `index.json` + 66개 개별 JSON |
| 이메일 소스 | `localStorage` | URL 파라미터 / Supabase 세션 |
| 관리자 분기 | `wksun999@gmail.com` 특별 처리 | 없음 (모든 사용자 동일) |
| 호스팅 | 로컬 상대경로 | GitHub raw URL |

---

## 3. 영향받는 문서 목록

| 문서 | 위치 | 영향 섹션 |
|------|------|----------|
| 프로세스 가이드 | `S0_.../PROJECT_SAL_GRID_VIEWER_PROCESS.md` | JSON Method 전체 |
| CLAUDE.md | `.claude/CLAUDE.md` | "사용자별 JSON 경로 분기 로직" |
| Grid 작성 규칙 | `.claude/rules/04_grid-writing-supabase.md` | 섹션 9 |

---

## 4. 불일치 발생 원인 가설

### 가설 A: 문서가 과거 설계 기준
- 초기 설계 시 `in_progress/`, `users/` 폴더 구조를 계획했으나
- 실제 구현 시 GitHub 기반 방식으로 변경됨
- 문서(CLAUDE.md 등)는 업데이트되지 않음

### 가설 B: 문서가 미래 계획 기준
- 현재는 GitHub 방식으로 구현되어 있으나
- 향후 로컬 폴더 방식으로 전환할 계획이 문서에 반영됨

### 가설 C: 두 가지 방식 혼재
- DB Method는 Supabase 직접 조회
- JSON Method는 원래 로컬 폴더 방식이었으나 GitHub 방식으로 변경
- CLAUDE.md는 원래 설계 기준으로 작성됨

---

## 5. 검토 필요 사항

1. **어떤 것이 "정답"인가?**
   - 문서대로 로컬 폴더 구조로 구현을 변경할 것인가?
   - 실제 구현대로 문서를 수정할 것인가?

2. **CLAUDE.md 수정 여부**
   - CLAUDE.md는 AI 작업 규칙의 핵심 문서
   - 실제와 다른 내용이 있으면 AI가 잘못된 방식으로 작업할 수 있음

3. **일반 사용자 영향**
   - 문서를 보고 따라하는 일반 사용자가 혼란을 겪을 수 있음

---

## 6. 검증 결과 요약

| 검증 항목 | 결과 |
|----------|------|
| 파일 위치 검증 | **부분 일치** (3개 폴더 미존재) |
| DB Method 검증 | **완전 일치** |
| JSON Method 검증 | **불일치** (로드 방식 다름) |
| Stage Gate 필드 | **완전 일치** |
| 렌더링 로직 | **완전 일치** |

---

**다음 액션:** PO 검토 후 수정 방향 결정
