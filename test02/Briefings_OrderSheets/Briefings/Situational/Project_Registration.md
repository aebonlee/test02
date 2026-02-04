# 처음 프로젝트 개발환경설정 가이드

**이 안내는 첫 번째 프로젝트 등록 시에만 표시됩니다.**

두 번째 이후 프로젝트는 이미 개발 환경이 구축되어 있으므로 간단한 폴더 준비만 하면 됩니다.

---

## 핵심 요약 (TL;DR)

1. **Dev Package 다운로드**
2. **Node.js 설치** (https://nodejs.org → LTS 버전)
3. **Claude Code 설치** (`npm install -g @anthropic-ai/claude-code`)
4. **폴더에서 `claude` 실행**
5. **"개발 환경 확인해줘"라고 말하기**
6. **끝!** 나머지는 Claude Code가 알아서 합니다.

> 아래는 "왜 이런 것들이 필요한지" 이해를 돕기 위한 상세 설명입니다.

---

## 프로젝트 정보 입력 완료

프로젝트 정보 입력이 완료되었습니다.

다음 단계로 **1회성 개발 환경 설정**이 필요합니다.

---

## 왜 개발 환경 설정이 필요한가요?

이 플랫폼은 **내 컴퓨터에서 직접 개발**하는 방식입니다. 이를 위해 3가지가 필요합니다.

**Dev Package**
- 무엇인가: 프로젝트 폴더 + AI 작업 규칙
- 왜 필요한가: AI가 올바르게 코드를 작성하도록 안내

**개발 도구 (Git, Node.js)**
- 무엇인가: 코드 실행 및 버전 관리 도구
- 왜 필요한가: 코드 실행 및 버전 관리

**Claude Code**
- 무엇인가: AI 개발 어시스턴트
- 왜 필요한가: 내가 말하면 AI가 코드 작성

한 번만 설치하면 이후 프로젝트에서는 다시 설치할 필요 없습니다.

---

## STEP 1: Dev Package 다운로드

### Dev Package 전체 구조

```
Dev_Package/
├── .claude/                          # Claude Code 설정 (63개 파일)
├── api/                              # 백엔드 API (배포용)
├── assets/                           # 정적 자원 (CSS, JS, 이미지)
├── pages/                            # 프론트엔드 페이지 (배포용)
├── scripts/                          # 자동화 스크립트
├── Development_Process_Monitor/      # 개발 프로세스 모니터
├── Human_ClaudeCode_Bridge/          # Human-AI 협업 브릿지
├── P0_작업_디렉토리_구조_생성/        # 디렉토리 구조/상태 문서
├── P1_사업계획/                      # 사업계획
├── P2_프로젝트_기획/                  # 프로젝트 기획
├── P3_프로토타입_제작/                # 프로토타입 제작
├── S0_Project-SAL-Grid_생성/         # SAL Grid 시스템
├── S1_개발_준비/                     # 개발 환경 준비
├── S2_개발-1차/                      # 1차 개발 (핵심 기능)
├── S3_개발-2차/                      # 2차 개발 (확장 기능)
├── S4_개발-3차/                      # 3차 개발 (고급 기능)
├── S5_개발_마무리/                   # 개발 마무리 (배포/안정화)
├── .ssal-project.json                # 프로젝트 설정 (project_id 등)
├── .env.sample                       # 환경 변수 템플릿 (DB 연동 시)
├── .gitignore                        # Git 제외 설정
└── README.md                         # 패키지 설명
```

**총 119개 폴더, 107개 파일**

---

### .claude/

Claude Code가 프로젝트 실행 시 가장 먼저 읽는 폴더.

```
.claude/
├── CLAUDE.md                    # AI 최상위 지침
├── CAUTION.md                   # 주의사항
├── rules/                       # 7대 작업 규칙
│   ├── 01_file-naming.md
│   ├── 02_save-location.md
│   ├── 03_area-stage.md
│   ├── 04_grid-writing-json.md
│   ├── 05_execution-process.md
│   ├── 06_verification.md
│   └── 07_task-crud.md
├── methods/                     # 작업 방법
│   └── 01_json-crud.md
├── commands/                    # 슬래시 커맨드 (15개)
├── skills/                      # AI 스킬 정의 (14개)
├── subagents/                   # 서브에이전트 정의 (17개)
├── compliance/                  # AI 준수사항
│   └── AI_12_COMPLIANCE.md
└── work_logs/                   # 작업 기록
```

**CLAUDE.md** - AI의 최상위 지침 파일. 7대 규칙 파일 참조 지시, 절대 금지 행동 정의.

**rules/** - 7대 작업 규칙
- 01: 파일명 규칙 (kebab-case)
- 02: 저장 위치 규칙 (Stage → Root 자동 복사)
- 03: Area/Stage 매핑 (11개 Area, 5개 Stage)
- 04: Grid 작성 및 JSON 작업 규칙
- 05: 6단계 실행 프로세스
- 06: 검증 규칙 및 상태 전이
- 07: Task CRUD 프로세스

**commands/** - 슬래시 커맨드 (15개): commit, deploy, test, review 등

**skills/** - AI 스킬 정의 (14개): fullstack-dev, api-builder, db-schema 등

**subagents/** - 서브에이전트 정의 (17개): frontend-developer, backend-developer, code-reviewer 등

---

### P0_작업_디렉토리_구조_생성/

- **Project_Status.md**: 프로젝트 현재 상태 기록
- **Project_Directory_Structure.md**: 프로젝트 전체 폴더 구조 문서화

---

### P1_사업계획/

시장조사, 경쟁분석, 사업계획서 저장 폴더

하위 폴더: Business_Model, BusinessPlan, Market_Analysis, Patent, Vision_Mission

---

### P2_프로젝트_기획/

요구사항 정의서, 아키텍처 설계, UI/UX 와이어프레임 저장 폴더

하위 폴더: Design_System, Project_Plan, Requirements, Service_Introduction, Tech_Stack, UI_UX_Mockup, User_Flows, Workflows

---

### P3_프로토타입_제작/

프로토타입 개발을 위한 폴더

하위 폴더: Database, Documentation, Frontend

- Database/: DB 스키마
- Documentation/: 프로토타입 관련 문서
- Frontend/Prototype/: 프로토타입 HTML 페이지

---

### S0_Project-SAL-Grid_생성/

```
S0_Project-SAL-Grid_생성/
├── sal-grid/
│   ├── stage-gates/              # Stage Gate 검증 리포트
│   ├── task-instructions/        # Task 수행 지침
│   ├── verification-instructions/ # 검증 지침
│   └── TASK_PLAN.md              # Task 계획 문서
├── manual/
│   └── PROJECT_SAL_GRID_MANUAL.md  # SAL Grid 매뉴얼
├── method/
│   └── json/
│       └── data/
│           ├── index.json        # 프로젝트 메타데이터 + task_ids 배열
│           ├── grid_records/     # 개별 Task JSON 파일
│           │   ├── S1BI1.json
│           │   ├── S1BI2.json
│           │   └── ...           # (Task ID별 파일)
│           └── stage_gate_records/  # Stage Gate 기록 (S1~S5)
├── viewer/
│   ├── viewer_json.html           # PC용 JSON 뷰어 (내 프로젝트)
│   ├── viewer_database.html      # PC용 DB 뷰어 (예시용)
│   ├── viewer_mobile_json.html    # 모바일용 JSON 뷰어
│   └── viewer_mobile_database.html  # 모바일용 DB 뷰어 (예시용)
```

> **JSON 데이터 구조**: `index.json`에서 Task ID 목록을 읽고, 각 `grid_records/{TaskID}.json` 파일에서 개별 Task 데이터를 로드합니다.

---

### S1_개발_준비/ ~ S5_개발_마무리/

각 Stage 폴더는 11개 Area 폴더를 포함.

- **S1** - S1_개발_준비
- **S2** - S2_개발-1차
- **S3** - S3_개발-2차
- **S4** - S4_개발-3차
- **S5** - S5_개발_마무리

**11개 Area:**
Backend_APIs, Backend_Infra, Content_System, Database, Design, DevOps, Documentation, External, Frontend, Security, Testing

---

### Development_Process_Monitor/

개발 프로세스 진행 상황 모니터링 시스템

- build-progress.js: 진행률 계산 스크립트
- data/phase_progress.json: 단계별 진행률 데이터
- README.md: 모니터 사용 가이드
- **DB_Method/**: DB 업로드 관련 파일 (SSAL Works 연동 시 필요)
  - create_table.sql: Supabase 테이블 생성 SQL
  - upload-progress.js: DB 업로드 스크립트
  - pre-commit-hook-example.sh: pre-commit hook 예시
  - README.md: DB Method 상세 가이드

> **📌 진행률 DB 연동 (필수)**: SSAL Works 플랫폼에서 진행률을 확인하려면 DB 연동이 필요합니다. `.env` 파일은 Dev Package 다운로드 시 자동 생성됩니다.

---

### Human_ClaudeCode_Bridge/

사람과 AI 간 협업을 위한 브릿지 시스템

- **Orders/**: 사람이 AI에게 전달하는 작업 요청 파일
- **Reports/**: AI가 작업 완료 후 결과 보고 파일

---

### 📥 Dev Package 가져오기

**프로젝트 등록 완료 시 Dev Package ZIP 파일이 다운로드됩니다.**

1. 작업용 폴더를 내 컴퓨터의 C드라이브에 먼저 만드세요 (예: `C:\Projects\내프로젝트명`)
2. 다운로드한 Dev Package ZIP 파일의 압축을 풀어서 작업용 폴더로 이동시키세요

---

## STEP 2: 필요한 개발 도구 (참고용)

다음 도구들이 필요합니다. **Git은 직접 설치하지 않아도 됩니다** - Claude Code가 확인하고 안내해드립니다.

아래 내용은 "이런 게 왜 필요한지" 이해를 돕기 위한 참고 자료입니다.

---

### 2-1. Git이란?

코드의 변경 이력을 기록하는 "버전 관리 시스템"입니다.

**왜 필요한가요?**
- 실수로 코드를 삭제해도 이전 버전으로 복구 가능
- 언제 무엇을 변경했는지 기록이 남음
- 여러 버전을 관리할 수 있음

**설치 방법 (참고):**
- Windows: https://git-scm.com 에서 다운로드
- Mac: 터미널에서 `xcode-select --install` 실행

---

### 2-2. Node.js란?

JavaScript를 웹 브라우저 밖에서도 실행할 수 있게 해주는 환경입니다.

**왜 필요한가요?**
- 웹 개발의 필수 도구
- Claude Code가 Node.js 위에서 작동함
- npm(패키지 관리자)이 함께 설치됨

**npm이란?**
Node Package Manager의 약자로, 다른 개발자들이 만든 코드(라이브러리)를 쉽게 설치하고 관리합니다.

**설치 방법 (참고):**
- Windows/Mac: https://nodejs.org 에서 LTS 버전 다운로드

---

### 2-3. Claude Code란? (이것만 직접 설치!)

Anthropic에서 만든 AI 개발 어시스턴트입니다. 터미널에서 실행하며, 코드 작성, 파일 수정, 명령어 실행 등을 AI가 대신 해줍니다.

**Claude Code가 할 수 있는 것:**
- 코드 파일 읽기/쓰기/수정
- 터미널 명령어 실행
- 웹 검색 및 정보 수집
- 프로젝트 구조 분석
- 버그 찾기 및 수정
- **필요한 도구(Git, Node.js) 설치 여부 확인 및 안내**

**설치 방법:**

Node.js 설치 후, 터미널에서 다음 명령어를 실행하세요:

```bash
npm install -g @anthropic-ai/claude-code
```

> ⚠️ **Node.js와 Claude Code를 직접 설치하면 됩니다.** Git은 Claude Code가 알아서 확인하고 안내해드립니다.

**사용 요금:**
| 옵션 | 비용 | 설명 |
|------|------|------|
| Claude Pro | $20/월 | claude.ai Pro 구독 시 포함 |
| Claude Max | $100/월 | 더 많은 사용량 |
| API 크레딧 | 사용량 기반 | Anthropic API 키 + 크레딧 충전 |

> 무료 플랜으로는 Claude Code 사용이 제한됩니다.

---

### 정리: 뭘 직접 설치해야 하나요?

| 도구 | 직접 설치? | 설명 |
|------|:----------:|------|
| **Node.js** | ⭕ 필수 | Claude Code 설치를 위해 필요 (npm 포함) |
| **Claude Code** | ⭕ 필수 | 위 명령어로 직접 설치 |
| Git | ❌ | Claude Code가 확인/안내 |

Dev Package 다운로드 후 `claude` 실행하면, Claude Code가 Git 등 나머지를 알아서 처리합니다.

복잡해 보여도 **자동화되어 있으니 안심하세요.**

---

## STEP 3: Claude Code 실행하기

> 💡 `claude` 명령어가 "command not found" 오류가 나면, STEP 2의 Claude Code 설치를 먼저 진행해주세요.

### 터미널이란?

컴퓨터에게 글자로 명령을 내리는 창입니다.

마우스로 클릭하는 대신, 키보드로 명령어를 입력합니다. 처음엔 낯설지만 금방 익숙해집니다.

**터미널의 다른 이름:**
- Windows: 명령 프롬프트(cmd), PowerShell, 터미널
- Mac: 터미널(Terminal)

---

### 터미널 여는 방법

#### Windows

**방법 1: 폴더에서 바로 열기 (권장)**
1. Dev Package 폴더를 엽니다
2. 폴더 안 빈 공간에서 **마우스 우클릭**
3. **"터미널에서 열기"** 클릭

**방법 2: 주소창 이용**
1. Dev Package 폴더를 엽니다
2. 상단 주소창(폴더 경로가 보이는 곳)을 클릭
3. `cmd` 입력 후 Enter

**방법 3: 시작 메뉴에서**
1. 시작 버튼 클릭
2. "터미널" 또는 "cmd" 검색
3. 실행 후 `cd 폴더경로` 입력 (예: `cd C:\Projects\MyProject`)

#### Mac

**방법 1: Finder에서 바로 열기 (권장)**
1. Finder에서 Dev Package 폴더를 엽니다
2. 폴더를 **우클릭**
3. **"폴더에서 새로운 터미널 열기"** 클릭

**방법 2: Terminal 앱에서**
1. Spotlight (Cmd + Space) → "Terminal" 검색 → 실행
2. `cd 폴더경로` 입력 (예: `cd ~/Projects/MyProject`)

---

### Claude Code 실행

터미널이 열렸으면, 다음을 입력하고 **Enter**를 누르세요:

```
claude
```

> 💡 `claude`라는 다섯 글자만 입력하면 됩니다.

---

### 첫 실행 시 로그인

Claude Code를 처음 실행하면 로그인이 필요합니다.

**로그인 과정:**
1. 터미널에 `claude` 입력 후 Enter
2. 브라우저가 자동으로 열림
3. Anthropic 계정으로 로그인 (없으면 가입)
4. 로그인 완료 후 터미널로 돌아오면 사용 가능

**필요한 구독:**
- Claude Pro ($20/월) 또는 Claude Max ($100/월) 구독, 또는
- Anthropic API 키 + 크레딧 충전

---

### 첫 실행 후 요청하기

로그인이 완료되면 Claude Code가 대기 상태가 됩니다.

다음과 같이 입력해보세요:

```
개발 환경 확인하고 프로젝트 초기 설정 해줘
```

### Claude Code가 자동으로 해주는 것

- **도구 확인**: Git, Node.js가 설치되어 있는지 확인
- **설치 안내**: 부족한 도구가 있으면 설치 방법을 친절하게 안내
- **프로젝트 초기화**: 설정 파일 생성, 폴더 구조 확인
- **Git 저장소 생성**: 버전 관리 자동 설정
- **개발 준비 완료**: 다음 단계 안내

> Claude Code는 프로젝트 폴더의 `.claude/CLAUDE.md` 파일을 자동으로 읽고, 이 프로젝트에 맞는 규칙과 작업 방법을 이해합니다. 별도로 설명하지 않아도 됩니다.

---

## STEP 4: 설치 완료 후

모든 설치가 완료되면 컨트롤 데스크로 가서 Claude Code와 함께 개발을 시작하세요.

### 개발 진행 방법

**1단계: 진행 프로세스 확인**
- 왼쪽 사이드바에서 진행 프로세스 확인

**2단계: 안내문 읽기**
- 각 단계별 안내문 확인

**3단계: Order Sheet 전달**
- Order Sheet를 컨트롤 데스크에 로딩하여 수정한 후 Claude Code에게 전달해서 작업 지시

**4단계: 결과 확인**
- AI가 수행한 작업 결과 검토

### 개발 프로세스

**P0 - 작업 환경**
- 디렉토리 구조 생성, 상태 관리

**P1 - 사업계획**
- 시장조사, 경쟁분석, 사업계획서

**P2 - 프로젝트 기획**
- 요구사항, 아키텍처, UI/UX 설계

**P3 - 프로토타입**
- 페이지 개발, DB 구축

**S1~S5 - 본개발**
- 인증, API, 결제, 배포

---

## 도움이 필요하면

- **📚 학습용 Books**, **💡 실전 Tips**, **🔗 외부 연동 설정 Guide**를 확인해 보세요
- **다른 AI에게 질문하기** 또는 **☀️ Sunny에게 질문하기**를 통해 해결하세요

