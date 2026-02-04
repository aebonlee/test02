# 프로젝트 등록 프로세스 (Project Registration Process)

> 최종 수정일: 2025-12-31
> 관련 파일: `index.html` (lines 8916-8997, 10935-11042)

---

## 개요

새로운 프로젝트를 등록할 때 **Dev Package 다운로드까지 완료해야** 등록이 완료됩니다.
단순히 프로젝트명과 설명만 입력하고 끝나는 것이 아닙니다.

---

## 프로세스 플로우

```
┌─────────────────────────────────────────────────────────────────┐
│                    프로젝트 등록 프로세스                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  사용자: "새로운 프로젝트 등록" 버튼 클릭                          │
│      ↓                                                          │
│  시스템: 로그인 확인 + 빌더 계정 확인                              │
│      ↓                                                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Step 1: 프로젝트 정보 입력                                  │  │
│  │                                                            │  │
│  │  - 프로젝트명 (필수)                                        │  │
│  │  - 프로젝트 설명 (선택)                                     │  │
│  │  - [다음 →] 버튼 클릭                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│      ↓                                                          │
│  시스템: API 호출 → 프로젝트 생성 (DB 저장)                       │
│      ↓                                                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Step 2: Dev Package 다운로드 (필수!)                        │  │
│  │                                                            │  │
│  │  ✅ "프로젝트 정보가 등록되었습니다!"                         │  │
│  │                                                            │  │
│  │  📦 Dev Package를 다운로드하세요                             │  │
│  │  - Claude Code와 함께 사용할 개발 패키지                     │  │
│  │  - 이 패키지가 있어야 AI 협업 개발 시작 가능                  │  │
│  │                                                            │  │
│  │  [⬇️ Dev Package 다운로드 (ZIP)] 버튼 클릭                   │  │
│  │                                                            │  │
│  │  ⚠️ 다운로드 전까지 모달 닫기 불가                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│      ↓                                                          │
│  시스템: Google Drive에서 ZIP 다운로드 시작                       │
│      ↓                                                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Step 3: 등록 완료                                           │  │
│  │                                                            │  │
│  │  🎉 프로젝트 등록 완료!                                      │  │
│  │                                                            │  │
│  │  📋 다음 단계:                                               │  │
│  │  1. ZIP 파일 압축 해제                                       │  │
│  │  2. README.md 읽고 설치 진행                                 │  │
│  │  3. claude 명령으로 시작                                     │  │
│  │                                                            │  │
│  │  [확인] 버튼 클릭 → 모달 닫기                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│      ↓                                                          │
│  시스템: 추가 안내 가이드 표시                                    │
│  - 첫 번째 프로젝트: 전체 설치 안내 (Package Install Guide)       │
│  - 두 번째 이후: 새 폴더 준비 안내 (New Folder Guide)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 핵심 규칙

### 1. Dev Package 다운로드 필수
```
❌ 잘못된 플로우:
   프로젝트명 입력 → "등록 완료" → 끝
   (Dev Package 없이는 개발을 시작할 수 없음)

✅ 올바른 플로우:
   프로젝트명 입력 → "정보 등록됨" → Dev Package 다운로드 → "등록 완료"
```

### 2. 모달 닫기 방지
- Step 2 진행 중에는 X 버튼, 배경 클릭으로 모달 닫기 불가
- "프로젝트 등록을 완료하려면 Dev Package를 다운로드해주세요" 알림

### 3. 상태 메시지 구분
| 단계 | 메시지 | 의미 |
|------|--------|------|
| Step 1 완료 | "프로젝트 정보가 등록되었습니다!" | DB에 저장됨, 아직 미완료 |
| Step 2 완료 | "프로젝트 등록 완료!" | 다운로드까지 완료, 진짜 완료 |

---

## 관련 함수

| 함수명 | 위치 | 역할 |
|--------|------|------|
| `registerNewProject()` | index.html:8743 | 등록 시작, 로그인/빌더 확인 |
| `openAddProjectModal()` | index.html:8894 | 모달 열기 |
| `closeAddProjectModal()` | index.html:8917 | 모달 닫기 (Step 2에서 차단) |
| `resetProjectModalSteps()` | index.html:8933 | 모달 단계 초기화 |
| `downloadDevPackageAndComplete()` | index.html:8949 | 다운로드 후 완료 처리 |
| `closeAddProjectModalFinal()` | index.html:8977 | 최종 닫기 + 가이드 표시 |

---

## 관련 UI 요소

| 요소 ID | 역할 |
|---------|------|
| `addProjectModal` | 등록 모달 전체 |
| `projectRegStep1` | Step 1 컨테이너 |
| `projectRegStep2` | Step 2 컨테이너 |
| `projectRegStep3` | Step 3 컨테이너 |
| `projectModalTitle` | 모달 제목 (단계별 변경) |
| `projectModalCloseBtn` | X 닫기 버튼 |
| `registeredProjectName` | Step 2에 표시할 프로젝트명 |
| `completedProjectName` | Step 3에 표시할 프로젝트명 |
| `devPackageDownloadBtnModal` | 다운로드 버튼 |

---

## 전역 변수

| 변수명 | 용도 |
|--------|------|
| `window.projectRegInStep2` | Step 2 진행 중 여부 (닫기 방지용) |
| `window.registeredProjectName` | 등록된 프로젝트명 |
| `window.registeredProjectPath` | 생성된 프로젝트 경로 |
| `window.isFirstProject` | 첫 번째 프로젝트 여부 |

---

## Dev Package 다운로드 URL

```javascript
// Google Drive 직접 다운로드 링크
const devPackageUrl = 'https://drive.google.com/uc?export=download&id=1Lz0Qi99dSVDlrTEsxeXsUWbM8dv9W-ds';
```

- 파일명: `Project_Dev_Package.zip`
- 크기: 약 12MB
- 동일 URL이 `pages/mypage/index.html`에서도 사용됨

---

## 버전 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2025-12-31 | 2단계 → 3단계 프로세스로 개선 (Dev Package 다운로드 필수화) |
