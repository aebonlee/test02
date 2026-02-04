# project_id 자동 주입 프로그램 위치 설명

> 작성일: 2026-01-04
> 목적: 프로젝트 등록 시 project_id가 어떻게 자동 주입되는지 프로그램 위치 및 구조 설명

---

## 1. 개요

사용자가 SSAL Works 플랫폼에서 프로젝트를 등록하면, **project_id가 자동으로 생성되어 Dev Package에 주입**됩니다.

이 과정은 3단계로 이루어지며, 사용자는 프로젝트명만 입력하면 됩니다.

---

## 2. 핵심 파일 위치 (3개)

| 단계 | 역할 | 파일 경로 | 라인 |
|------|------|----------|------|
| **1** | project_id 생성 | `api/Backend_APIs/projects/create.js` | 162-180 |
| **2** | ID 전달 + 전역 변수 저장 | `index.html` | 6313-6567 |
| **3** | ZIP 동적 생성 + 주입 | `index.html` | 5959-6052 |

---

## 3. 단계별 상세 설명

### 3-1. Backend API: project_id 생성

**파일:** `api/Backend_APIs/projects/create.js`
**라인:** 162-180

```javascript
// Builder ID 조회
const builderId = userData.builder_id;  // 예: "2512000001TH"

// 해당 사용자의 프로젝트 개수 조회
const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

// project_id 생성
const nextProjectNum = (projectCount || 0) + 1;
const projectId = `${builderId}-P${String(nextProjectNum).padStart(3, '0')}`;
// 결과: "2512000001TH-P001"
```

**project_id 형식:**
```
{builderId}-P{순번}
     │         │
     │         └── 3자리 순번 (001, 002, ...)
     └── 12자리 Builder ID (YYMMNNNNNNXX)
```

---

### 3-2. Frontend: ID 전달 + 전역 변수 저장

**파일:** `index.html`
**라인:** 6313-6567

```javascript
// 사용자가 [다음] 버튼 클릭 시
const response = await fetch('/api/projects/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({
        projectName: name,
        description: description
    })
});

const result = await response.json();

if (result.success) {
    // Backend에서 생성된 project_id를 전역 변수에 저장
    window.registeredProjectId = result.projectId;  // 라인 6546
    window.registeredProjectName = name;

    // Step 2로 전환 (Dev Package 다운로드 페이지)
}
```

---

### 3-3. Frontend: ZIP 동적 생성 + 주입

**파일:** `index.html`
**라인:** 5959-6052

```javascript
async function downloadDevPackageAndComplete() {
    const projectName = window.registeredProjectName;
    const projectId = window.registeredProjectId;  // 전역 변수에서 가져옴

    // 1. 템플릿 ZIP 다운로드
    const devPackageTemplateUrl = '/assets/dev-package/Project_Dev_Package_Template.zip';
    const response = await fetch(devPackageTemplateUrl);
    const zipBlob = await response.blob();

    // 2. JSZip으로 ZIP 해제
    const zip = await JSZip.loadAsync(zipBlob);

    // 3. .ssal-project.json 생성 + project_id 주입 (라인 5983-5990)
    const ssalProjectConfig = {
        project_id: projectId,      // ← 자동 주입!
        project_name: projectName,
        created_at: new Date().toISOString(),
        description: projectName + ' 프로젝트'
    };
    zip.file('.ssal-project.json', JSON.stringify(ssalProjectConfig, null, 4));

    // 4. .env 파일도 추가 (라인 5992-6000)
    const envContent = `# Supabase 설정 (자동 생성됨)
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Project 설정
PROJECT_ID=${projectId}`;
    zip.file('.env', envContent);

    // 5. 새 ZIP 생성 및 브라우저 다운로드
    const newZipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(newZipBlob, `${projectName}_Dev_Package.zip`);

    // 6. DB 업데이트 (등록 완료 표시)
    await supabase
        .from('projects')
        .update({ registration_complete: true })
        .eq('project_id', projectId);
}
```

---

## 4. 전체 플로우 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│ 사용자: 프로젝트명 입력 → [다음] 클릭                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend API: POST /api/projects/create                       │
│ ├── Builder ID 조회                                          │
│ ├── project_id 생성: {builderId}-P{순번}                     │
│ ├── projects 테이블에 INSERT                                 │
│ └── 응답: { projectId: "2512000001TH-P001" }                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend: window.registeredProjectId에 저장                  │
│ └── Step 2 (Dev Package 다운로드 페이지) 표시                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 사용자: [Dev Package 다운로드] 클릭                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend: downloadDevPackageAndComplete() 실행               │
│ ├── 템플릿 ZIP 다운로드                                       │
│ ├── JSZip으로 해제                                           │
│ ├── .ssal-project.json 생성 + project_id 주입                │
│ ├── .env 생성 + PROJECT_ID 주입                              │
│ ├── 새 ZIP 생성                                              │
│ └── 브라우저 다운로드                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 사용자: {프로젝트명}_Dev_Package.zip 받음                     │
│ └── .ssal-project.json에 project_id 자동 포함!               │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. 사용자 관점 요약

| 사용자 액션 | 자동화된 작업 |
|------------|--------------|
| 프로젝트명 입력 | - |
| [다음] 클릭 | project_id 생성 (Backend) |
| [다운로드] 클릭 | .ssal-project.json + .env 자동 생성 |
| ZIP 압축 해제 | - |

**사용자가 직접 설정할 것: 없음** (모두 자동)

---

## 6. 관련 파일 전체 목록

| 파일 | 역할 |
|------|------|
| `api/Backend_APIs/projects/create.js` | project_id 생성 API |
| `index.html` | 프로젝트 등록 UI + ZIP 동적 생성 |
| `/assets/dev-package/Project_Dev_Package_Template.zip` | 템플릿 ZIP |
| `.ssal-project.json` (생성됨) | 프로젝트 메타데이터 |
| `.env` (생성됨) | 환경 변수 |

---

## 7. 기술 스택

| 기술 | 용도 |
|------|------|
| **JSZip** | ZIP 파일 동적 생성/수정 |
| **FileSaver.js** | 브라우저 다운로드 |
| **Supabase** | 프로젝트 정보 저장 |

---

## 8. 참고 문서

- `P2_프로젝트_기획/User_Flows/Project_Registration_Process.md`
- `.claude/CLAUDE.md` - 프로젝트 등록 프로세스 섹션
