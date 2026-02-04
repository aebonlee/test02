# Development Process Monitor - 정적 JSON 방식

> 프로젝트 P0~S5 진행률을 사이드바에 표시하는 시스템

---

## 개요

Development Process Monitor는 빌드 시점에 진행률을 계산하여 JSON 파일로 생성하고, 런타임에 해당 파일을 로드하여 사이드바에 표시하는 **정적 JSON 방식** 시스템입니다.

---

## 핵심 특징

| 항목 | 내용 |
|------|------|
| **방식** | 정적 JSON 방식 |
| **데이터 소스** | `phase_progress.json` (빌드 시 생성) |
| **DB 실시간 조회** | 없음 |
| **업데이트 시점** | 빌드/배포 시점에만 |

---

## 데이터 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                    빌드 시점 (Build Time)                        │
│          node Development_Process_Monitor/build-progress.js     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  P0~S0: 폴더/파일 존재 여부로 진행률 계산                         │
│       ↓                                                         │
│  S1~S5: sal_grid.csv에서 Task 완료율로 진행률 계산               │
│       ↓                                                         │
│  프로젝트 루트/data/phase_progress.json 파일 생성                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    런타임 시점 (Runtime)                         │
│                    index.html                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  loadPhaseProgressFromDB() 호출                                 │
│       ↓                                                         │
│  fetch('data/phase_progress.json')                              │
│       ↓                                                         │
│  사이드바 진행률 표시                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 관련 파일

| 파일 | 위치 | 역할 |
|------|------|------|
| `build-progress.js` | Development_Process_Monitor/ | 빌드 스크립트 (JSON 생성) |
| `sal_grid.csv` | S0_Project-SAL-Grid_생성/data/ | S1~S5 Task 데이터 (입력) |
| `phase_progress.json` | 프로젝트 루트/data/ | 진행률 데이터 (출력) |
| `index.html` | 프로젝트 루트 | 사이드바 표시 |

---

## 1. 빌드 스크립트: build-progress.js

**위치:** `Development_Process_Monitor/build-progress.js`

### 전체 코드

```javascript
/**
 * build-progress.js
 * P0~S0: 폴더/파일 구조에서 진행률 계산
 * S1~S5: sal_grid.csv에서 Task 완료율 계산
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

// P0~S0 Phase 정의
const PHASES = {
    'P0': { folder: 'P0_작업_디렉토리_구조_생성', name: '작업 디렉토리 구조 생성' },
    'P1': { folder: 'P1_사업계획', name: '사업계획' },
    'P2': { folder: 'P2_프로젝트_기획', name: '프로젝트 기획' },
    'P3': { folder: 'P3_프로토타입_제작', name: '프로토타입 제작' },
    'S0': { folder: 'S0_Project-SAL-Grid_생성', name: 'Project SAL Grid 생성' }
};

// 폴더 안에 파일이 1개 이상 있는지 확인
function hasFiles(folderPath) {
    try {
        const items = fs.readdirSync(folderPath);
        return items.some(item => {
            const itemPath = path.join(folderPath, item);
            try {
                return fs.statSync(itemPath).isFile();
            } catch (e) {
                return false;
            }
        });
    } catch (e) {
        return false;
    }
}

// P0~S0 진행률 계산 (폴더/파일 기반)
function calculatePhaseProgress(phaseCode, phasePath) {
    try {
        const items = fs.readdirSync(phasePath);

        // 하위 폴더 목록 (숨김 폴더 제외)
        const subfolders = items.filter(item => {
            if (item.startsWith('.') || item.startsWith('_')) return false;
            const itemPath = path.join(phasePath, item);
            try {
                return fs.statSync(itemPath).isDirectory();
            } catch (e) {
                return false;
            }
        });

        const total = subfolders.length;
        const completed = subfolders.filter(folder =>
            hasFiles(path.join(phasePath, folder))
        ).length;

        const progress = total > 0 ? Math.round(completed / total * 100) : 0;

        return { completed, total, progress };
    } catch (e) {
        return { completed: 0, total: 0, progress: 0 };
    }
}

// S1~S5 진행률 계산 (CSV 기반)
function calculateStageProgressFromCSV(csvPath) {
    const stageProgress = {
        'S1': { name: '개발 준비', progress: 0, completed: 0, total: 0 },
        'S2': { name: '개발 1차', progress: 0, completed: 0, total: 0 },
        'S3': { name: '개발 2차', progress: 0, completed: 0, total: 0 },
        'S4': { name: '개발 3차', progress: 0, completed: 0, total: 0 },
        'S5': { name: '개발 마무리', progress: 0, completed: 0, total: 0 }
    };

    try {
        if (!fs.existsSync(csvPath)) {
            console.warn('sal_grid.csv not found');
            return stageProgress;
        }

        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = csvContent.trim().split('\n');

        if (lines.length < 2) return stageProgress;

        // 헤더에서 stage, task_status 인덱스 찾기
        const headers = lines[0].split(',').map(h => h.trim());
        const stageIndex = headers.indexOf('stage');
        const statusIndex = headers.indexOf('task_status');

        if (stageIndex === -1 || statusIndex === -1) return stageProgress;

        // 데이터 파싱
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const stage = values[stageIndex];
            const status = values[statusIndex];

            const stageKey = `S${stage}`;
            if (stageProgress[stageKey]) {
                stageProgress[stageKey].total++;
                if (status === 'Completed') {
                    stageProgress[stageKey].completed++;
                }
            }
        }

        // 진행률 계산
        Object.keys(stageProgress).forEach(key => {
            const s = stageProgress[key];
            s.progress = s.total > 0 ? Math.round(s.completed / s.total * 100) : 0;
        });

        return stageProgress;
    } catch (e) {
        console.error('Error reading CSV:', e.message);
        return stageProgress;
    }
}

// CSV 라인 파싱 (쉼표 포함 값 처리)
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

// 메인 실행
function main() {
    console.log('📊 Progress Builder\n');

    const result = {
        project_id: 'SSALWORKS',
        updated_at: new Date().toISOString(),
        phases: {}
    };

    // P0~S0 계산
    Object.entries(PHASES).forEach(([code, config]) => {
        const phasePath = path.join(PROJECT_ROOT, config.folder);
        const progress = calculatePhaseProgress(code, phasePath);
        result.phases[code] = {
            name: config.name,
            progress: progress.progress,
            completed: progress.completed,
            total: progress.total
        };
        console.log(`${code}: ${progress.completed}/${progress.total} = ${progress.progress}%`);
    });

    // S1~S5 계산
    const csvPath = path.join(PROJECT_ROOT, 'S0_Project-SAL-Grid_생성', 'data', 'sal_grid.csv');
    const stageProgress = calculateStageProgressFromCSV(csvPath);
    Object.entries(stageProgress).forEach(([code, data]) => {
        result.phases[code] = data;
        console.log(`${code}: ${data.completed}/${data.total} = ${data.progress}%`);
    });

    // JSON 저장 (프로젝트 루트/data/)
    const outputDir = path.join(PROJECT_ROOT, 'data');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, 'phase_progress.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`\n✅ 저장: ${outputPath}`);
}

main();
```

---

## 2. 출력 파일: phase_progress.json

**위치:** `프로젝트 루트/data/phase_progress.json`

### 구조

```json
{
  "project_id": "SSALWORKS",
  "updated_at": "2025-12-26T00:00:00.000Z",
  "phases": {
    "P0": { "name": "작업 디렉토리 구조 생성", "progress": 100, "completed": 2, "total": 2 },
    "P1": { "name": "사업계획", "progress": 100, "completed": 5, "total": 5 },
    "P2": { "name": "프로젝트 기획", "progress": 100, "completed": 8, "total": 8 },
    "P3": { "name": "프로토타입 제작", "progress": 100, "completed": 3, "total": 3 },
    "S0": { "name": "Project SAL Grid 생성", "progress": 100, "completed": 4, "total": 4 },
    "S1": { "name": "개발 준비", "progress": 100, "completed": 9, "total": 9 },
    "S2": { "name": "개발 1차", "progress": 100, "completed": 16, "total": 16 },
    "S3": { "name": "개발 2차", "progress": 100, "completed": 6, "total": 6 },
    "S4": { "name": "개발 3차", "progress": 100, "completed": 21, "total": 21 },
    "S5": { "name": "개발 마무리", "progress": 100, "completed": 9, "total": 9 }
  }
}
```

---

## 3. 런타임: index.html

**위치:** `프로젝트 루트/index.html`

### loadPhaseProgressFromDB() 함수

```javascript
async function loadPhaseProgressFromDB(projectId = null) {
    try {
        // JSON 파일 로드
        const response = await fetch('data/phase_progress.json');
        if (!response.ok) {
            resetAllProgressToZero();
            return;
        }

        const jsonData = await response.json();
        updateCurrentProjectName(jsonData.project_id || 'SSALWORKS');

        // 진행률 적용
        if (jsonData.phases) {
            Object.entries(jsonData.phases).forEach(([code, phaseData]) => {
                const progress = phaseData.progress || 0;

                if (code === 'P0' || code === 'S0') {
                    updateSpecialProgress(code, progress);
                } else if (code.startsWith('P')) {
                    updatePrepProgressByCode(code, progress);
                } else if (code.startsWith('S')) {
                    updateStageProgress(code, progress);
                }
            });
        }
    } catch (e) {
        resetAllProgressToZero();
    }
}
```

### updateStageProgress() 함수

```javascript
function updateStageProgress(stageId, progress) {
    const processItems = document.querySelectorAll('.process-item');
    processItems.forEach(item => {
        const header = item.querySelector('.process-icon');
        if (header && header.textContent.includes(stageId)) {
            const progressFill = item.querySelector('.process-progress-fill');
            const percentText = item.querySelector('.process-percent');
            const majorDiv = item.querySelector('.process-major, .process-special-major');

            if (progressFill) progressFill.style.width = progress + '%';
            if (percentText) percentText.textContent = progress + '%';
            if (majorDiv) {
                majorDiv.setAttribute('data-progress', progress);
                if (progress === 100) {
                    majorDiv.classList.add('completed');
                } else {
                    majorDiv.classList.remove('completed');
                }
            }
        }
    });
}
```

### 호출 시점

```javascript
// 페이지 로드 시
window.addEventListener('load', () => {
    setTimeout(() => {
        loadPhaseProgressFromDB();
    }, 500);
});

// Supabase 초기화 후
function initSupabase() {
    // ...
    loadPhaseProgressFromDB();
}
```

---

## 4. 사이드바 HTML 구조

```html
<div class="process-item">
    <div class="process-major" data-progress="0">
        <div class="process-icon">S1</div>
        <div class="process-info">
            <div class="process-title">개발 준비</div>
            <div class="process-progress">
                <div class="process-progress-fill" style="width: 0%"></div>
            </div>
            <div class="process-percent">0%</div>
        </div>
    </div>
</div>
```

### CSS 클래스

| 클래스 | 역할 |
|--------|------|
| `.process-item` | 각 단계 컨테이너 |
| `.process-major` | 일반 단계 (S1~S5) |
| `.process-special-major` | 특별 단계 (P0, S0) |
| `.process-icon` | 단계 코드 표시 (S1, P0 등) |
| `.process-progress-fill` | 진행률 바 채움 |
| `.process-percent` | 퍼센트 텍스트 |
| `.completed` | 100% 완료 시 추가 |

---

## 5. sal_grid.csv 구조

**위치:** `S0_Project-SAL-Grid_생성/data/sal_grid.csv` (또는 프로젝트 구조에 따라 지정)

**생성:** S0 (Project SAL Grid 생성) 단계에서 생성된 파일. 별도 생성 스크립트 참고.

| 컬럼 | 설명 | 진행률 계산 사용 |
|------|------|:----------------:|
| task_id | Task ID | |
| task_name | Task 이름 | |
| stage | Stage 번호 (1~5) | ✅ |
| area | Area 코드 | |
| task_status | 작업 상태 | ✅ |
| task_progress | 진행률 | |
| verification_status | 검증 상태 | |
| dependencies | 선행 Task | |
| execution_type | 실행 유형 | |
| remarks | 비고 | |

### 진행률 계산 로직

```
completed = task_status === 'Completed' 인 Task 수
total = 해당 Stage의 전체 Task 수
progress = Math.round(completed / total * 100)
```

---

## 6. 실행 방법

```bash
node Development_Process_Monitor/build-progress.js
```

**전제 조건:** `S0_Project-SAL-Grid_생성/data/sal_grid.csv` 파일이 존재해야 함

---

## 7. 새 프로젝트 적용 시 수정 사항

| 항목 | 파일 | 수정 내용 |
|------|------|----------|
| 프로젝트 ID | `build-progress.js` | `project_id` 값 변경 |
| Phase 폴더명 | `build-progress.js` | `PHASES` 객체의 `folder` 값 변경 |
| Stage 수 | `build-progress.js` | `stageProgress` 객체 수정 |
| CSV 경로 | `build-progress.js` | `csvPath` 변수를 프로젝트 구조에 맞게 수정 |
| JSON 출력 경로 | `build-progress.js` | `outputPath` 변수를 원하는 위치로 수정 |

---

## 폴더 구조

```
Development_Process_Monitor/
├── build-progress.js                      # 진행률 빌드 스크립트
├── README.md                              # 이 파일 (정적 JSON 방식 설명)
└── DEVELOPMENT_PROCESS_WORKFLOW.md        # 개발 프로세스 워크플로우
```

---

**작성일:** 2025-12-26
