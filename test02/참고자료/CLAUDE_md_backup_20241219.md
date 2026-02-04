# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🛑🛑🛑 절대 불변 2대 규칙 (ABSOLUTE RULES) 🛑🛑🛑

> **이 규칙은 모든 다른 규칙보다 우선합니다. 예외 없이 100% 준수해야 합니다.**
> **위반 시 프로젝트에 심각한 문제가 발생합니다.**

### 🛑 절대 규칙 1: 새 폴더 생성 전 반드시 사용자 승인

```
⛔ 새 폴더를 만들기 전에 반드시 사용자에게 물어야 합니다!
⛔ 절대 임의로 폴더를 생성하지 마세요!
⛔ 이 규칙은 어떤 상황에서도 예외가 없습니다!
```

**반드시 수행해야 할 프로세스:**
```
1. 파일 저장이 필요함
2. 해당 폴더가 존재하는가? → YES → 저장
3. 해당 폴더가 존재하는가? → NO → ⚠️ 중단!
4. 사용자에게 질문:
   "폴더 [폴더명]이 존재하지 않습니다.
    새 폴더를 생성해도 될까요?
    경로: [전체 경로]
    용도: [왜 필요한지]"
5. 사용자 승인 후에만 폴더 생성
```

**금지 행동:**
- ❌ `mkdir` 명령어를 사용자 승인 없이 실행
- ❌ "편의상" 새 폴더 생성
- ❌ "나중에 정리하면 되겠지" 생각
- ❌ Production, Stage 폴더에 임의로 하위 폴더 추가

---

### 🛑 절대 규칙 2: Task 작업은 반드시 서브에이전트 투입 + 검증

```
⛔ Main Agent가 직접 Task 작업을 수행하면 안 됩니다!
⛔ Task 작업 완료 후 반드시 검증 서브에이전트를 투입해야 합니다!
⛔ 검증 없이 "완료" 보고는 금지입니다!
```

**반드시 수행해야 할 프로세스:**
```
[Task 작업 요청 받음]
    ↓
[1단계: Task Agent 서브에이전트 투입]
Main Agent → Task tool 사용
           → 적합한 서브에이전트 선택 (frontend-developer, backend-developer 등)
           → 서브에이전트가 작업 수행
           → 결과 반환
    ↓
[2단계: Verification Agent 서브에이전트 투입]
Main Agent → Task tool 사용
           → 검증 서브에이전트 선택 (code-reviewer, test-engineer 등)
           → 서브에이전트가 검증 수행
           → 검증 결과 반환
    ↓
[3단계: 완료 보고]
Main Agent → 사용자에게 작업 및 검증 결과 보고
```

**금지 행동:**
- ❌ Main Agent가 직접 코드 작성/수정 (서브에이전트 없이)
- ❌ 검증 단계 생략
- ❌ Task Agent가 자신의 작업을 검증 (작성자 ≠ 검증자)
- ❌ 검증 없이 "완료했습니다" 보고

**서브에이전트 참조:**
> ⚠️ Task Agent와 Verification Agent는 **Project SSAL Grid에 사전 정의**되어 있습니다.
> 매뉴얼 참조: `S0_Project-SSAL-Grid_생성/manual/PROJECT_SSAL_GRID_MANUAL.md`
> Grid의 `task_agent`와 `verification_agent` 필드 값을 따르세요.

---

### 🛑 절대 규칙 3: 작업 중 PO 도움 필요 시 즉시 요청

```
⛔ 외부 서비스 설정이 필요한데 나중에 알리면 안 됩니다!
⛔ 작업 완료 후 "아, 이거 설정 필요해요"는 금지입니다!
⛔ AI가 할 수 없는 작업은 작업 시작 시점에 요청해야 합니다!
```

**작업 중 즉시 PO에게 요청해야 하는 상황:**
- 외부 서비스 API 키 필요 (Resend, Stripe, OpenAI 등)
- OAuth Provider 설정 필요 (Google, GitHub, Kakao 등)
- 환경 변수 설정 필요 (Vercel, Supabase 등)
- 외부 대시보드 접속 필요 (Supabase Dashboard, Google Cloud Console 등)
- 결제/인증 관련 실제 자격증명 필요

**반드시 수행해야 할 프로세스:**
```
[Task 작업 시작 전]
    ↓
[외부 설정 필요 여부 확인]
    ↓
[필요한 경우 즉시 PO에게 요청]
"이 기능을 구현하려면 [설정 항목]이 필요합니다.
지금 설정하시겠습니까?
1. [설정 단계 1]
2. [설정 단계 2]
설정 완료 후 알려주시면 진행하겠습니다."
    ↓
[PO 설정 완료 후 작업 진행]
```

**금지 행동:**
- ❌ 외부 설정 필요한데 코드만 작성하고 "완료" 보고
- ❌ 작업 완료 후에야 "설정 필요합니다" 알림
- ❌ 테스트 시점에 "아, 이거 안 되네요. 설정해야 해요" 발언
- ❌ 검증 리포트에만 "외부 설정 필요" 기재하고 PO에게 직접 알리지 않음

---

### 🛑 절대 규칙 4: Stage Gate 검증 시 PO 테스트 가이드 제공

```
⛔ AI 검증만으로 Stage Gate 통과를 선언하면 안 됩니다!
⛔ PO가 직접 테스트할 수 있는 가이드 없이 완료 보고 금지!
⛔ "코드 검증 완료"만으로는 불충분합니다!
```

**Stage Gate AI 검증 완료 후 필수 제공 항목:**

1. **테스트 가능 조건**
   - 필요한 외부 설정 완료 여부
   - 서버 실행 필요 여부
   - 환경 변수 설정 상태

2. **기능별 테스트 가이드**
   ```
   [기능 1: Google 로그인]
   - 테스트 파일: Production/Frontend/pages/auth/google-login.html
   - 테스트 방법: 브라우저에서 열고 버튼 클릭
   - 예상 결과: Google 로그인 페이지로 이동
   - 필요 설정: Supabase Google Provider 활성화
   ```

3. **설정 완료 체크리스트**
   - [ ] 설정 항목 1 - 완료/미완료
   - [ ] 설정 항목 2 - 완료/미완료

**반드시 수행해야 할 프로세스:**
```
[AI Stage Gate 검증 완료]
    ↓
[PO 테스트 가이드 작성]
    ↓
[PO에게 제시]
"S2 Stage Gate AI 검증 완료되었습니다.
직접 테스트하실 수 있도록 가이드를 준비했습니다.

[테스트 1: 기능명]
- 파일: [경로]
- 방법: [단계별 설명]
- 필요 설정: [완료 여부]

테스트 진행해주시고 결과 알려주세요."
    ↓
[PO 테스트 완료 및 승인 후 Stage Gate 통과]
```

**금지 행동:**
- ❌ AI 검증만 하고 "Stage Gate 통과" 선언
- ❌ 테스트 방법 없이 "확인해보세요" 요청
- ❌ 필요 설정 미완료 상태에서 테스트 요청
- ❌ PO 승인 없이 다음 Stage 진행

---

### 🛑 절대 규칙 5: Human-AI Task는 실제 작동 테스트 필수

```
⛔ Human-AI Task에서 가이드 문서 작성만으로 "완료" 처리 금지!
⛔ PO가 실제로 외부 서비스 설정을 완료해야 합니다!
⛔ 실제 작동 테스트 성공 없이 Task 완료 금지!
```

**Human-AI Task란?**
- `execution_type: 'Human-AI'` 또는 `'Human-Assisted'`로 설정된 Task
- AI가 혼자 완료할 수 없고 PO(사람)의 직접 작업이 필요한 Task
- 예: 외부 서비스 설정 (Google OAuth, Resend, 결제 등)

**Human-AI Task 완료 기준:**

| 단계 | 수행자 | 필수 여부 |
|------|--------|----------|
| 1. 설정 가이드 작성 | AI | ✅ |
| 2. PO에게 설정 요청 | AI | ✅ |
| 3. 외부 서비스 설정 | **PO (Human)** | ✅ **필수** |
| 4. 설정 완료 확인 | AI + PO | ✅ |
| 5. **실제 작동 테스트** | AI + PO | ✅ **필수** |
| 6. 테스트 성공 시 "완료" | AI | ✅ |

**올바른 프로세스:**
```
[AI] 가이드 문서 작성
    ↓
[AI → PO] "이 설정이 필요합니다. 진행해주세요."
    - Google Cloud Console에서 ~
    - Supabase Dashboard에서 ~
    ↓
[PO] 실제로 외부 서비스 설정 수행
    ↓
[PO → AI] "설정 완료했어"
    ↓
[AI + PO] 실제 작동 테스트
    - 로컬 서버 실행
    - 기능 테스트 (로그인, 이메일 발송 등)
    ↓
[테스트 성공] → "Task 완료"
[테스트 실패] → 문제 해결 후 재테스트
```

**금지 행동:**
- ❌ 가이드 문서만 작성하고 "완료" 처리
- ❌ PO에게 설정 요청 없이 Task 완료
- ❌ 설정 완료 확인 없이 다음 Task 진행
- ❌ 실제 작동 테스트 없이 검증 통과
- ❌ Verification Instruction에서 문서 존재만 확인

**Human-AI Task 예시:**
- S1S1: Supabase Auth Provider 설정 (Google OAuth)
- S2BI1: Resend 이메일 서비스 설정
- S3E1: AI API 키 설정
- S4O1: PG사 설정 (토스 페이먼트)
- S5O1: 프로덕션 배포
- S5O2: 도메인 연결

---

## 📋 상세 작업 규칙 참조 (2025-12-19)

> **상세 규칙은 `.claude/rules/` 폴더에 별도 파일로 분리되어 있습니다.**

### 규칙 파일 목록

| 파일 | 내용 |
|------|------|
| `01_file-naming.md` | 파일 명명 규칙 (kebab-case, Task ID 주석) |
| `02_save-location.md` | 저장 위치 규칙 (5개 Area 이중 저장) |
| `03_area-stage.md` | 11개 Area, 5개 Stage 매핑 |
| `04_grid-writing-supabase.md` | Grid 22개 속성 작성 규칙 |
| `05_execution-process.md` | 6단계 실행 프로세스 (PO 협력 포함) |
| `06_verification.md` | Task/Stage Gate/PO 검증 기준 |

### 규칙 참조 우선순위

```
1순위: 절대 불변 규칙 (위 ABSOLUTE RULES)
2순위: .claude/rules/ 상세 규칙
3순위: Order Sheet 지시사항
4순위: PROJECT_SSAL_GRID_MANUAL.md
```

**⚠️ Task 작업 전 반드시 해당 규칙 파일을 읽으세요!**

---

## 🌾 SSALWorks Project - FIRST THINGS FIRST

**🚨 새 세션 시작 시 필수 확인 사항 (반드시 순서대로!)**

**⚡ AI-Only 원칙: 사용자가 아무 말 안 해도 자동으로 수행!**

### 0단계: Order Sheet 처리 규칙 (변경됨!)

**🚨 중요: 시스템 변경 사항 (2025-12-01)**

**이전 방식 (폐기):**
- ❌ Claude가 자동으로 Inbox 확인
- ❌ 세션 시작 시 자동으로 Order 찾기
- ❌ AI가 먼저 확인하고 작업 시작

**현재 방식 (2025-12-18 업데이트):**
- ✅ **사용자가 대시보드에서 Order Sheet 작성 후 클립보드에 복사**
- ✅ **사용자가 Claude Code에 직접 붙여넣기로 Order 전달**
- ✅ **Claude Code가 Order Sheet를 Orders 폴더에 저장 후 작업 시작**
- ✅ **Claude Code가 작업 완료 후 Reports 폴더에 결과 저장**
- ✅ **사용자가 대시보드의 "Reports 불러오기" 버튼으로 결과 확인**

**동작 원칙:**
```
[Order Sheet 전달]
사용자: 대시보드에서 Order Sheet 작성
    ↓
사용자: "Order Sheet 복사하기" 버튼 클릭 → 클립보드에 복사
    ↓
사용자: Claude Code에 붙여넣기
    ↓
AI: Order Sheet를 Human_ClaudeCode_Bridge/Orders/에 저장 (원칙!)
    ↓
AI: Order 읽고 작업 시작
    ↓
AI: 작업 완료 후 Human_ClaudeCode_Bridge/Reports/에 결과 저장

[결과 확인]
사용자: 대시보드에서 "Reports 불러오기" 버튼 클릭
    ↓
대시보드: Reports 폴더의 파일 목록 표시
    ↓
사용자: 원하는 Report 파일 선택하여 확인
```

**폴더 구조:**
```
Human_ClaudeCode_Bridge/
├── Orders/     # Order Sheet 저장 (Claude Code가 받으면 여기 저장!)
└── Reports/    # 작업 결과 보고서 저장
```

**파일 형식 규칙:**
| 파일 종류 | 형식 | 비고 |
|----------|------|------|
| Order Sheet | `.json` | 구조화된 요청 데이터 |
| 작업 완료 보고서 | `.json` | AI 메모리 활용을 위해 필수 |
| 검증 리포트 | `.json` | 구조화된 검증 결과 |
| 요약 문서 | `.md` | 선택 (필요시만 추가) |

> **상세 가이드**: `Human_ClaudeCode_Bridge/HUMAN_CLAUDECODE_BRIDGE_GUIDE.md` 참조

**금지 사항:**
- ❌ 세션 시작 시 자동 Orders 폴더 확인 금지
- ❌ Order Sheet를 받았는데 Orders 폴더에 저장하지 않고 바로 작업 시작 금지

**허용 사항:**
- ✅ 사용자가 Order Sheet를 붙여넣으면 Orders 폴더에 저장
- ✅ 저장 후 작업 시작
- ✅ 작업 완료 후 Reports 폴더에 결과 저장

---

### 1단계: 작업 기록 확인
**먼저 이 파일들을 읽어서 이전 작업 내용을 파악:**

1. **`.claude/work_logs/current.md`** 🔴 **최우선!**
   - 가장 최근 작업 내역 (활성 로그)
   - 이전 세션에서 무엇을 했는지
   - 다음에 무엇을 해야 하는지
   - 중요한 참고사항
   - **세션이 끊어졌어도 작업 연속성 유지 가능!**
   - **자동 순환**: 50KB 초과 시 날짜별 파일로 자동 저장

### 2단계: 프로젝트 상태 확인
**현재 프로젝트 진행 상황 파악:**

3. **`P0_작업_디렉토리_구조_생성/Project_Status.md`**
   - 현재 프로젝트 진행 상황
   - 어디까지 완료되었는지
   - 다음에 무엇을 해야 하는지

4. **`P0_작업_디렉토리_구조_생성/Project_Directory_Structure.md`**
   - 전체 디렉토리 구조 및 설명
   - 파일을 어디에 저장해야 하는지
   - 네이밍 규칙 및 프로젝트 구조
   - **파일 작업 전에 이 문서를 참고하세요!**

### 3단계: Memory MCP 활용
**세션 간 정보 공유:**

- Memory MCP 서버가 설정되어 있음 (`@modelcontextprotocol/server-memory`)
- 중요한 정보는 자동으로 기억됨
- 이전 세션의 컨텍스트 활용 가능

### 작업 완료 시 필수 작업

**작업을 완료할 때마다 반드시:**

1. **`.claude/work_logs/current.md` 업데이트**
   ```
   - 작업 내용 기록
   - 생성/수정된 파일 목록
   - 검증 결과
   - 다음 작업 예정 사항
   ```

   **자동 순환 규칙**:
   - `current.md` 파일 크기 확인
   - 50KB 초과 시:
     1. `current.md` → `YYYY-MM-DD.md`로 이름 변경
     2. 새로운 `current.md` 생성
     3. 이전 로그 링크 추가
   - 30일 이상 된 로그 → `archive/`로 이동

2. **필요시 `Human_ClaudeCode_Bridge/Reports/`에 결과 보고**
   - 작업 완료 JSON 파일 생성
   - 사용자가 직접 파일 확인

3. **웹 배포 파일 자동 업데이트** ⚠️ **중요!**

   다음 파일을 수정했을 경우, **반드시** 웹 배포 파일을 재생성해야 합니다:

   | 수정한 파일 | 실행할 명령 |
   |-------------|-------------|
   | Order Sheet 템플릿 (`Briefings_OrderSheets/OrderSheet_Templates/*.md`) | `node Production/build-web-assets.js --ordersheets` |
   | 안내문 HTML (`P2_프로젝트_기획/User_Flows/상황별_안내문/*.html`) | `node Production/build-web-assets.js --guides` |
   | PROJECT_SAL_GRID_MANUAL.md (`S0_Project-SAL-Grid_생성/manual/`) | `node Production/build-web-assets.js --manual` |
   | 위 파일들 중 여러 개 수정 | `node Production/build-web-assets.js` (전체 빌드) |

   **자동 처리 사항:**
   - 번들 JS 파일 생성 (ordersheets.js, guides.js)
   - Production/, Production/Frontend/, P3_프로토타입_제작/Frontend/Prototype/에 자동 복사
   - MANUAL HTML 변환 및 참고자료/ 폴더에 저장

   **⚠️ 이 단계를 건너뛰면 웹사이트에 변경사항이 반영되지 않습니다!**

### 📂 작업 결과물 저장 2대 규칙 (2025-12-13 확정)

> **이 규칙은 모든 Task 작업에 적용됩니다. 반드시 준수하세요!**

#### 📌 제1 규칙: Stage + Area 폴더에 저장

**모든 작업 결과물은 Task ID의 Stage와 Area에 해당하는 폴더에 저장합니다.**

```
Task ID 구조: [Stage][Area][번호]
예: S1S1 → Stage: S1, Area: S (Security)
    S2F1 → Stage: S2, Area: F (Frontend)
```

**Stage 폴더 매핑:**
| Stage | 폴더명 |
|-------|--------|
| S1 | `S1_개발_준비/` |
| S2 | `S2_개발-1차/` |
| S3 | `S3_개발-2차/` |
| S4 | `S4_개발-3차/` |
| S5 | `S5_운영/` |

**Area 폴더 매핑:**
| Area 코드 | 폴더명 |
|-----------|--------|
| M | `Documentation/` |
| F | `Frontend/` |
| BI | `Backend_Infra/` |
| BA | `Backend_API/` |
| D | `Database/` |
| S | `Security/` |
| T | `Testing/` |
| O | `DevOps/` |
| E | `External/` |
| C | `Content_System/` |

**예시:**
- S1S1 → `S1_개발_준비/Security/`
- S1M1 → `S1_개발_준비/Documentation/`
- S2F1 → `S2_개발-1차/Frontend/`
- S3BA1 → `S3_개발-2차/Backend_API/`

#### 📌 제2 규칙: Production 코드는 이중 저장

**Frontend, Database, Backend_API 코드 파일은 Stage/Area 폴더 + Production 폴더 둘 다 저장합니다.**

```
Production/                 ← 배포용 코드 (최신 상태 유지)
├── Frontend/               # 프론트엔드 코드
├── Backend_API/            # API 코드
└── Database/               # DB 스키마
```

**이중 저장 대상:**
| Area | Stage 폴더 | Production 폴더 |
|------|------------|-----------------|
| F (Frontend) | `S?_*/Frontend/` | `Production/Frontend/` |
| BA (Backend_API) | `S?_*/Backend_API/` | `Production/Backend_API/` |
| D (Database) | `S?_*/Database/` | `Production/Database/` |

**예시:**
- S2F1 코드 → `S2_개발-1차/Frontend/` + `Production/Frontend/`
- S3BA1 코드 → `S3_개발-2차/Backend_API/` + `Production/Backend_API/`
- S1D1 스키마 → `S1_개발_준비/Database/` + `Production/Database/`

**문서는 Stage 폴더에만:**
- Documentation, Security, Testing, DevOps 등 문서는 Production에 저장하지 않음
- 예: S1S1 문서 → `S1_개발_준비/Security/` (Production에 저장 X)

---

### 📂 파일 명명 및 Production 폴더 규칙 (2025-12-18 확정)

> **비개발자도 직관적으로 이해할 수 있는 파일 구조!**

#### 1. 파일 생성 시 규칙 (Stage에서)

**파일명: 직관적인 이름 사용**
```
✅ 좋은 예:
- google-login.js      (뭐하는 파일인지 바로 앎)
- subscription-cancel.js
- email-send.js

❌ 나쁜 예:
- auth.js             (뭐하는 건지 모름)
- handler.js
- utils.js
```

**파일 상단: Task ID 주석 필수**
```javascript
/**
 * @task S2BA1
 */
export default async function handler(req, res) {
  // ...
}
```
→ Task ID 하나로 Stage, Area, 순서 모두 파악 가능!
→ S2BA1 = S2(Stage) + BA(Area) + 1(순서)

#### 2. Production 폴더 구조

```
Production/                    ← Vercel 루트
├── Frontend/                  ← 화면 (F Area)
│   ├── Pages/                 # HTML 페이지
│   └── Assets/                # CSS, JS, 이미지
│
├── API/                       ← 서버 (Area별 분류)
│   ├── Backend_APIs/          # BA Area (구독, 이메일 등)
│   ├── Security/              # S Area (인증, 권한)
│   ├── Backend_Infrastructure/# BI Area (공통 라이브러리)
│   └── External/              # E Area (외부 연동)
│
└── Config/                    ← 설정 (O Area)
    ├── vercel.json
    └── package.json
```

**핵심 원칙:**
- 폴더명 = Area 이름 (직관적!)
- URL에 Area가 노출됨: `/api/Security/google-login`
- 개발자가 아니어도 구조를 바로 이해!

#### 3. Stage → Production 복사 규칙

**이름 변경 없이 그대로 복사:**
```
Stage:      S2_개발-1차/Backend_APIs/google-login.js
                         ↓ (그대로 복사)
Production: Production/API/Backend_APIs/google-login.js
```

**1 파일 = 1 Task 원칙:**
- ✅ Task 1개 → 파일 여러 개 (OK)
- ❌ 파일 1개 → Task 여러 개 (안 됨, 설계 문제)

#### 4. Production에 넣을 것 / 안 넣을 것

| 구분 | Production에 | 이유 |
|------|-------------|------|
| Frontend (F) | ✅ 넣음 | 배포 필요 |
| API (BA, S, BI, E) | ✅ 넣음 | 배포 필요 |
| Config (O) | ✅ 넣음 | 배포 필요 |
| Database (D) | ❌ 안 넣음 | SQL은 Supabase에서 실행 |
| Documentation (M) | ❌ 안 넣음 | 배포 불필요 |
| Testing (T) | ❌ 안 넣음 | 배포 불필요 |

---

**학습용 문서:**
- **학습/참고 자료**: `부수적_고유기능/콘텐츠/학습용_Books/`
- **개발 팁**: `부수적_고유기능/콘텐츠/Tips/`
- **외부 연동 설정**: `부수적_고유기능/콘텐츠/외부_연동_설정_Guide/`

**네이밍 규칙:**
- **예비단계**: P1, P2, P3 (한글+숫자)
- **실행단계**: S1, S2, S3, S4, S5 (한글+숫자)
- **하위 폴더**: 영문 사용 (Frontend, Backend_API, Database)

---

## ⚠️ 🚨 CRITICAL: 파일 저장 위치 철칙 🚨 ⚠️

**이 규칙은 반드시 지켜야 합니다. 실전 프로젝트에서 가장 많은 문제를 일으킨 사항입니다!**

### 🚫 새 폴더 생성 절대 금지 (2025-12-13 확정)

> **폴더 구조가 완성되었습니다. 더 이상 새 폴더를 만들 필요가 없습니다.**

```
⛔ 절대 금지: 새 폴더 생성
⛔ 절대 금지: 폴더 구조 변경
⛔ 절대 금지: 폴더 이름 변경
```

**현재 폴더 구조는 충분히 모든 파일을 수용할 수 있습니다:**
- P0~P3: 예비단계 (기획, 프로토타입)
- S0~S5: 실행단계 (개발, 운영)
- Production: 배포용 코드
- 부수적_고유기능: SSALWorks 전용 기능
- 기타 독립 폴더: 브릿지, 사이드바, 참고자료

**새 폴더가 필요하다고 느껴지면:**
1. ❌ 절대 직접 생성하지 말 것
2. ✅ 기존 폴더 중 적합한 곳을 찾을 것
3. ✅ 정말 없다면 사용자에게 문의할 것

---

### 1. 지정된 폴더에만 파일 저장

**규칙:**
- 파일은 **반드시 `Project_Directory_Structure.md`에 정의된 폴더**에만 저장
- **임의로 새 폴더를 만들거나 예상 밖의 위치에 저장하는 것은 절대 금지**

### 2. 적절한 폴더가 없을 경우 필수 절차

**적절한 폴더가 보이지 않으면:**

1. **즉시 작업 중단**
2. **사용자에게 반드시 문의**:
   ```
   "이 파일을 저장할 적절한 폴더를 찾을 수 없습니다.

   파일명: [파일명]
   용도: [파일의 목적]

   다음 중 하나를 선택해주세요:
   A) [제안 경로 1] - [이유]
   B) [제안 경로 2] - [이유]
   C) 새 폴더 생성: [제안 경로] - [이유]

   어떤 방법을 사용할까요?"
   ```

3. **사용자 승인 후에만 진행**

### 3. 절대 하지 말아야 할 행동

❌ **금지 사항:**
- 임의로 루트 디렉토리에 파일 생성
- 예상치 못한 위치에 파일 생성
- "일단 여기 저장하고 나중에 옮기면 되겠지" 라는 생각
- 사용자 확인 없이 새 폴더 생성
- `Project_Directory_Structure.md`를 무시하고 직감으로 저장

### 4. 올바른 작업 절차

✅ **올바른 절차:**
1. `Project_Directory_Structure.md` 확인
2. 파일 목적에 맞는 폴더 찾기
3. 폴더가 명확하면 → 저장
4. 폴더가 불명확하면 → **사용자에게 문의 후 승인 받기**
5. 저장 후 사용자에게 저장 위치 보고

### 5. 예시 상황

**상황 1: Git 설정 파일**
- ❌ 잘못: 루트에 `.gitconfig` 저장
- ✅ 올바름: `2_개발준비/2-3_Development_Setup/Git/` 확인 → 저장

**상황 2: 새로운 유형의 파일 (예: 디자인 시스템 토큰)**
- ❌ 잘못: 임의로 `design-tokens/` 폴더 생성
- ✅ 올바름:
  ```
  "디자인 토큰 JSON 파일을 저장할 위치를 찾을 수 없습니다.

  제안:
  A) 1_기획/1-2_UI_UX_Design/Design_Guidelines/
  B) 새 폴더: 1_기획/1-2_UI_UX_Design/Design_Tokens/

  어떤 방법을 사용할까요?"
  ```

**상황 3: 테스트 파일**
- ❌ 잘못: 코드 파일 옆에 `signup.test.js` 저장
- ✅ 올바름: `3_개발/3-8_Test/unit/` 또는 해당 테스트 폴더에 저장

### 6. 왜 이 규칙이 중요한가?

**실전에서 발생한 문제들:**
- 파일이 여기저기 흩어져서 찾을 수 없음
- 프로젝트 구조가 무너짐
- 팀원 간 혼란 발생
- Git 관리 어려움
- 문서와 실제 구조 불일치

**이 규칙을 지키면:**
- ✅ 파일을 쉽게 찾을 수 있음
- ✅ 프로젝트 구조 일관성 유지
- ✅ 팀 협업 원활
- ✅ 유지보수 용이

---

### 🚀 작업 시작 전 체크리스트

- [ ] `Project_Status.md` 읽고 현재 Phase 확인
- [ ] `Project_Directory_Structure.md` 읽고 디렉토리 구조 파악
- [ ] 현재 Phase에 맞는 작업 폴더 확인
- [ ] **파일 저장 위치 규칙 숙지 (위 CRITICAL 섹션 반드시 확인!)**


---

## ⚠️ 🚨 CRITICAL: 개발 환경 RLS 정책 경고 🚨 ⚠️

**프로덕션 배포 전 필수 되돌림 작업!**

### 현재 상태 (2025-12-03)

**개발 환경용 RLS 정책 적용 중**:
- ✅ `07_learning_contents_rls_dev.sql` - learning_contents 테이블 (anon 접근 허용)
- ✅ `10_faqs_rls_dev.sql` - faqs 테이블 (anon 접근 허용)

**목적**: Admin Dashboard가 anon key로 INSERT/UPDATE/DELETE 가능하도록 임시 허용 (개발/테스트용)

### ⚠️ 프로덕션 배포 전 필수 작업

**반드시 원래 RLS 정책으로 교체해야 함**:

1. **Supabase SQL Editor에서 실행**:
   ```sql
   -- 원래 정책 파일 실행:
   -- 1. P3_프로토타입_제작/Database/07_learning_contents_rls.sql
   -- 2. P3_프로토타입_제작/Database/10_faqs_rls.sql
   ```

2. **원래 정책의 보안 수준**:
   - SELECT: 모든 사용자 가능
   - INSERT/UPDATE/DELETE: `authenticated` 역할만 가능
   - anon 역할은 INSERT/UPDATE/DELETE 불가

### 배포 전 체크리스트

**프로덕션 배포 시 반드시 확인**:

- [ ] `07_learning_contents_rls_dev.sql` → `07_learning_contents_rls.sql`로 교체 실행
- [ ] `10_faqs_rls_dev.sql` → `10_faqs_rls.sql`로 교체 실행
- [ ] Admin Dashboard에 authenticated 사용자 로그인 구현 완료
- [ ] anon key로 INSERT/UPDATE/DELETE 시도 시 차단되는지 확인
- [ ] authenticated 사용자로 로그인하여 CRUD 작동 확인

### 왜 이 경고가 중요한가?

**개발 환경 정책을 그대로 배포하면**:
- ❌ 누구나 학습용 콘텐츠 추가/수정/삭제 가능
- ❌ 누구나 FAQ 추가/수정/삭제 가능
- ❌ 심각한 보안 취약점
- ❌ 데이터 무결성 파괴 가능

**원래 정책으로 되돌리면**:
- ✅ 인증된 관리자만 콘텐츠 관리 가능
- ✅ 일반 사용자는 조회만 가능
- ✅ 보안 강화
- ✅ 데이터 무결성 보호

### 개발 vs 프로덕션

**개발 단계 (지금)**:
- RLS 완화 (`_dev.sql` 파일들)
- anon 역할도 INSERT/UPDATE/DELETE 가능
- Admin Dashboard 테스트 가능
- 빠른 개발 및 디버깅

**프로덕션 배포 시**:
- RLS 강화 (원래 `.sql` 파일들)
- authenticated 역할만 INSERT/UPDATE/DELETE 가능
- 보안 강화
- 일반 사용자는 조회만 가능

### 기억할 것

> **"개발 환경 RLS 정책은 반드시 프로덕션 배포 전에 원래대로!"**
> **"보안은 타협할 수 없다!"**

---

## ⚠️ 🚨 CRITICAL: 본개발 단계 TODO 🚨 ⚠️

**프로토타입 단계에서 의도적으로 제외한 항목들 - 본개발 단계에서 반드시 구현!**

### 1. 토스 페이먼트 API 연동 (Agenda #6 관련)

**현재 상태**: 프로토타입에서는 더미 빌링키(`test_billing_key_001`) 사용

**본개발에서 구현 필요:**
- [ ] 토스 페이먼트 가맹점 등록 (심사 기간 1-2주 소요)
- [ ] 빌링키 발급 API 연동
- [ ] 자동결제(정기결제) API 연동
- [ ] 결제 웹훅 처리 (성공/실패 콜백)
- [ ] 환불 API 연동
- [ ] 결제 실패 시 재시도 로직

**참고:**
- [토스 페이먼트 개발자 문서](https://docs.tosspayments.com/)
- [빌링키 발급 가이드](https://docs.tosspayments.com/guides/billing)

---

### 2. PG 이용약관 동의 체크박스 (Agenda #6 관련)

**현재 상태**: `payment-method.html`에 약관 동의 UI 없음

**본개발에서 구현 필요:**
- [ ] 전자금융거래 이용약관 동의 체크박스
- [ ] 개인정보 제3자 제공 동의 체크박스 (카드사/PG사)
- [ ] 약관 내용 팝업/모달
- [ ] 동의 여부 DB 저장

**법적 근거:**
- 전자금융거래법: 결제 서비스 이용 전 약관 동의 필수
- 개인정보보호법: 제3자 제공 시 별도 동의 필요

**구현 위치:**
- `P3_프로토타입_제작/Frontend/Prototype/pages/subscription/payment-method.html`

---

### 3. 구독 관리 확장 컬럼 (선택사항)

**현재 상태**: `subscription_status` 컬럼만으로 기본 기능 동작 중

**추가하면 좋은 컬럼 (상세 이력 추적용):**
- `subscription_paused_at` - 일시정지 시작일
- `subscription_pause_end_date` - 일시정지 만료일
- `subscription_cancelled_at` - 해지일
- `data_deletion_scheduled_at` - 데이터 삭제 예정일

**SQL 파일**: `P3_프로토타입_제작/Database/23_add_subscription_columns.sql`

---

### 본개발 시작 전 체크리스트

- [ ] 토스 페이먼트 가맹점 신청 (심사 기간 고려)
- [ ] PG 이용약관 법무 검토
- [ ] 개인정보 처리방침 업데이트
- [ ] 결제 테스트 환경 구성

---

## ⚠️ 🚨 CRITICAL: 작업 6대 원칙 🚨 ⚠️

**이 원칙들은 실전 프로젝트에서 반복적으로 발생한 문제를 방지하기 위한 핵심 규칙입니다!**

### 원칙 1: AI-First 작업 원칙 (강화됨 2025-12-19)

**🚨 핵심 원칙: AI가 할 수 있는 모든 방법을 시도한 후에만 인간에게 요청!**

**기본 방침:**
- **모든 작업은 AI가 수행하는 것을 원칙으로 함**
- 사용자에게 요청하는 것은 **최후의 최후의 수단**
- **"안 된다"고 말하기 전에 최소 5가지 이상 대안 방법 시도 필수**

**AI가 "안 된다"고 말하기 전 필수 체크리스트:**

1. **도구별 대안 시도** (최소 3가지 이상)
   - 도구 A 안 되면 → 도구 B 시도
   - 도구 B 안 되면 → 도구 C 시도
   - 직접 방법 안 되면 → 간접 방법 시도

2. **우회 방법 연구**
   - MCP 안 되면 → SDK 스크립트 작성
   - curl 안 되면 → Node.js 스크립트 작성
   - 직접 DB 접근 안 되면 → JSON 파일 + Sync 스크립트 방식

3. **프로젝트 내 기존 솔루션 검색**
   - 같은 문제를 해결한 스크립트가 이미 있는가?
   - 비슷한 기능을 하는 코드가 있는가?
   - 참고할 수 있는 패턴이 있는가?

**실제 사례 - Supabase 업데이트:**
```
❌ 잘못된 접근:
"MCP로 Supabase 업데이트가 안 됩니다."
"curl도 안 됩니다."
"사용자가 직접 해주세요."  ← 이렇게 하면 안 됨!

✅ 올바른 접근:
시도 1: Supabase MCP → 실패
시도 2: curl 명령어 → 실패
시도 3: 기존 스크립트 검색 → update-grid.js 발견!
시도 4: Supabase SDK 스크립트 → 작동!
시도 5: JSON 파일 + sync_task_results_to_db.js → 가장 안정적!

결론: JSON 파일 생성 후 Sync 스크립트 실행으로 해결!
```

**정말 불가능할 때만 사용자에게 요청:**
```
"다음 작업을 수행하려 했으나 AI로는 불가능합니다:

작업: [작업 내용]

시도한 방법 (5가지 이상):
1. [방법 1] - 실패 (이유)
2. [방법 2] - 실패 (이유)
3. [방법 3] - 실패 (이유)
4. [방법 4] - 실패 (이유)
5. [방법 5] - 실패 (이유)

프로젝트 내 대안 검색: 해당 없음

이 작업은 AI가 근본적으로 수행 불가능합니다.
사용자님께서 다음을 수행해주셔야 합니다:
[구체적인 요청 사항]

진행하시겠습니까?"
```

**AI가 근본적으로 할 수 없는 작업 (예외 인정):**
- 외부 서비스 대시보드 접속 (Supabase Dashboard, Google Cloud Console 등)
- OAuth Provider 설정 (Google, GitHub, Kakao 인증 설정)
- API 키/시크릿 발급 (Resend, Stripe, OpenAI 등)
- 결제 가맹점 등록 및 심사
- 도메인 DNS 설정
- 실제 브라우저에서의 UI 테스트
- 사용자 계정 권한 설정

**⚠️ 위 예외 외에는 무조건 AI가 방법을 찾아야 함!**

**예시:**

❌ **절대 금지 - 즉시 포기:**
```
"GitHub 토큰이 필요합니다. 설정해주세요."
(1가지만 시도하고 즉시 요청)
```

❌ **절대 금지 - 대안 검색 안 함:**
```
"MCP가 안 됩니다. curl도 안 됩니다. 방법이 없습니다."
(프로젝트 내 기존 스크립트 검색 안 함)
```

✅ **올바른 접근:**
```
시도 1: MCP 서버로 GitHub 연동 → 실패
시도 2: 환경 변수로 토큰 읽기 → 실패
시도 3: .env 파일 확인 → 파일 없음
시도 4: gh CLI 명령어 시도 → 미설치
시도 5: 프로젝트 내 GitHub 관련 스크립트 검색 → 없음

5가지 방법을 모두 시도했으나 불가능합니다.
GitHub 토큰은 외부 서비스 인증 정보로, AI가 근본적으로 발급 불가능합니다.
GitHub 토큰 설정이 필요합니다. 진행하시겠습니까?"
```

---

### 원칙 2: 절대 시간 추정 금지

**금지 사항:**
- ❌ "이 작업은 3시간 걸립니다"
- ❌ "예상 소요 시간: 2일"
- ❌ "5주 안에 완료 가능합니다"
- ❌ 모든 형태의 시간 추정 금지

**이유:**
- 시간 추정은 항상 부정확함
- 실제와 차이나서 혼란 발생
- 사용자에게 잘못된 기대 형성
- **실전에서 시간 추정은 전부 엉터리였음**

**대신 사용할 표현:**

✅ **올바른 표현:**
- "Task를 단계별로 나누어 진행하겠습니다"
- "작업을 완료하고 보고하겠습니다"
- "다음 단계로 진행하겠습니다"
- 진행 상황만 보고 (시간 언급 X)

**작업 계획 제시 시:**

❌ **잘못된 계획:**
```
작업 계획:
1. DB 스키마 작성 (2시간)
2. API 개발 (5시간)
3. 테스트 (3시간)
총 예상 시간: 10시간
```

✅ **올바른 계획:**
```
작업 계획:
1. DB 스키마 작성
2. API 개발
3. 테스트
4. 검증

각 단계를 완료하고 다음 단계로 진행하겠습니다.
```

---

### 원칙 3: 불필요한 문서 생성 금지

**기본 방침:**
- **문서 생성 전 반드시 사용자 승인 필요**
- 사용자가 보고 싶어하는 문서만 생성
- 무분별한 문서 생성 절대 금지

**문서 생성 전 필수 절차:**

1. **생성 전 문의**
   ```
   "다음 문서를 생성하려고 합니다:

   파일명: [파일명]
   위치: [저장 경로]
   목적: [왜 이 문서가 필요한가]
   내용: [어떤 내용을 담을 것인가]

   생성하시겠습니까?"
   ```

2. **승인 받은 후에만 생성**

3. **생성 후에도 확인**
   ```
   "다음 문서를 생성했습니다:
   - [파일 경로]

   저장하시겠습니까? 아니면 삭제할까요?"
   ```

**예외 (승인 없이 생성 가능):**
- ✅ 명시적으로 요청받은 파일
- ✅ 코드 파일 (실행에 필수)
- ✅ 설정 파일 (필수 구성)

**예외 (반드시 승인 필요):**
- ⚠️ README.md
- ⚠️ 가이드 문서
- ⚠️ 설명 문서
- ⚠️ 매뉴얼
- ⚠️ 모든 .md 파일 (코드 제외)

**실전 문제:**
- 너무 많은 파일로 인한 혼란
- 필요 없는 문서로 디렉토리 복잡화
- 사용자가 보지 않을 파일들
- 정작 필요한 파일 찾기 어려움

**올바른 예:**

❌ **잘못된 접근:**
```
(승인 없이)
- CONTRIBUTING.md 생성
- CODE_OF_CONDUCT.md 생성
- SECURITY.md 생성
- CHANGELOG.md 생성
```

✅ **올바른 접근:**
```
"프로젝트에 다음 문서들을 추가하면 좋을 것 같습니다:
- CONTRIBUTING.md (기여 가이드)
- SECURITY.md (보안 정책)

필요하신가요? 생성할까요?"

→ 사용자 응답 대기
→ 승인된 것만 생성
```

---

### 원칙 4: Skills/Subagents/Commands 적극 활용

**기본 방침:**
- **프로젝트에는 16개 Skills, 18개 Subagents, 14개 Commands가 설정되어 있음**
- 작업 중 항상 이들을 활용할 방법을 연구
- 사용자에게 활용 제안 필수

**작업 시작 전 필수 검토:**

1. **해당 작업에 적합한 도구 확인**
   - Skills 중 사용 가능한 것?
   - Subagents 중 적합한 것?
   - Commands로 빠르게 처리 가능한 것?

2. **사용자에게 제안**
   ```
   "이 작업에 다음 도구들을 활용할 수 있습니다:

   추천 Subagent:
   - [subagent명]: [왜 적합한가]

   추천 Skill:
   - [skill명]: [어떻게 도움되는가]

   추천 Command:
   - /[command명]: [어떤 효과가 있는가]

   이 도구들을 사용하시겠습니까?"
   ```

3. **승인 후 활용**

**Available Tools:**

**Skills (16개):**
```
.claude/skills/
├── api-builder.md
├── code-review.md
├── db-schema.md
├── test-runner.md
└── ... (총 16개)
```

**Subagents (18개):**
```
.claude/subagents/
├── backend-developer.md
├── frontend-developer.md
├── database-developer.md
├── devops-troubleshooter.md
├── code-reviewer.md
├── test-engineer.md
└── ... (총 18개)
```

**Slash Commands (14개):**
```
.claude/commands/
├── /commit - Git 커밋 자동화
├── /review - 코드 리뷰
├── /test - 테스트 실행
├── /deploy - 배포
└── ... (총 14개)
```

**활용 예시:**

**상황 1: API 개발 작업**
```
"API 개발을 시작하기 전에 제안드립니다:

1. Subagent 활용:
   - backend-developer: API 구조 설계 및 구현
   - api-designer: RESTful API 설계 검증

2. Skill 활용:
   - api-builder: API 자동 생성 템플릿
   - test-runner: API 테스트 자동화

3. Command 활용:
   - /test: 작성 후 테스트 자동 실행

이 도구들을 사용하시겠습니까?"
```

**상황 2: 데이터베이스 작업**
```
"DB 스키마 작업에 다음을 활용할 수 있습니다:

1. Subagent:
   - database-developer: 스키마 설계

2. Skill:
   - db-schema: 스키마 자동 생성

3. Command:
   - /review: 스키마 검증

사용하시겠습니까?"
```

**상황 3: 배포 작업**
```
"배포 작업에 다음 도구를 활용할 수 있습니다:

1. Subagent:
   - devops-troubleshooter: 배포 문제 해결

2. Command:
   - /deploy: 자동 배포
   - /deploy-check: 배포 상태 확인

사용하시겠습니까?"
```

**금지 사항:**

❌ **도구를 무시하고 직접 작업**
```
(Skills/Subagents 확인 없이)
"API를 작성하겠습니다..."
```

✅ **도구 활용 제안 후 작업**
```
"API 작업에 backend-developer subagent와 api-builder skill을 활용하면 
더 효율적입니다. 사용하시겠습니까?"
```

**주기적 검토:**
- 작업 시작 시: 도구 활용 방법 검토
- 작업 중간: 추가 도구 활용 가능성 확인
- 작업 완료 시: 사용한 도구 보고

---

### 원칙 5: 작업 완료 후 필수 검증 제안

**기본 방침:**
- **작업이 끝나면 반드시 검증 담당 도구 실행을 자발적으로 제안**
- 검증은 시간 낭비가 아니라 **재작업 방지로 시간 절약**
- 사용자 승인 후 검증 수행

**작업 완료 후 필수 프로세스:**

1. **작업 완료 직후**
   ```
   "작업이 완료되었습니다.

   완료된 작업:
   - [작업 내용]

   생성/수정된 파일:
   - [파일 목록]

   이제 검증을 수행하고자 합니다.
   다음 도구를 사용하여 검증하겠습니다:

   검증 Subagent:
   - [검증 subagent명]: [검증 항목]

   검증 Skill:
   - [검증 skill명]: [검증 방법]

   검증 Command:
   - /[command명]: [검증 내용]

   검증을 진행하시겠습니까?"
   ```

2. **사용자 승인 대기**

3. **승인 후 검증 수행**
   - 모든 검증 항목 실행
   - 검증 결과 상세 보고

4. **검증 완료 후 문서화 필수** ⭐ **중요!**

   **작업 완료 → 검증 → 문서화 → 보고 순서**

   **📋 필수 생성 파일 (Reports에 저장):**

   a) **작업 결과 보고서** (`Human_ClaudeCode_Bridge/Reports/`)
      ```
      파일명 예시: agenda3_faq_system_completed.json
      또는: task_[작업명]_completed.json

      내용:
      - 작업 내용 요약
      - 생성/수정된 파일 목록
      - 주요 기능 설명
      - 완료 상태
      ```

   b) **검증 결과 보고서** (`Human_ClaudeCode_Bridge/Reports/`)
      ```
      파일명 예시: agenda3_faq_verification_report.json
      또는: task_[작업명]_verification.json

      내용:
      - 검증 도구 사용 내역
      - 테스트 결과 (통과/실패)
      - 발견된 이슈 및 해결 사항
      - 최종 검증 결과
      ```

   c) **프로젝트 문서화** (해당 폴더에 저장)
      ```
      위치: P3_프로토타입_제작/Documentation/ (또는 해당 작업 폴더)

      예시:
      - 01_Feature_Specification.md 업데이트
      - 02_Database_Schema.md 업데이트
      - API 명세서 작성
      - 사용자 가이드 작성
      ```

   **⚠️ 중요한 예외: Project Grid 작업**

   **Project Grid 작업일 경우:**
   - ✅ Project Grid의 검증 프로세스를 따름
   - ✅ Project Grid 매뉴얼에 정의된 문서화 규칙 적용
   - ✅ `Developement_Real_PoliticianFinder/0-5_Development_ProjectGrid/` 참고

   **Project Grid가 아닌 모든 작업:**
   - ✅ 반드시 검증 수행
   - ✅ 작업 결과 보고서 생성 (Reports)
   - ✅ 검증 결과 보고서 생성 (Reports)
   - ✅ 프로젝트 문서화 (해당 폴더)

5. **최종 완료 보고**
   ```
   "✅ 작업 완료 및 검증 완료

   작업 내용:
   - [작업 항목들]

   생성된 파일:
   - [코드 파일들]

   검증 결과:
   - ✅ [검증 항목 1]
   - ✅ [검증 항목 2]

   생성된 문서:
   - ✅ Human_ClaudeCode_Bridge/Reports/[작업명]_completed.json
   - ✅ Human_ClaudeCode_Bridge/Reports/[작업명]_verification.json
   - ✅ Documentation/[관련 문서].md (업데이트)

   다음 작업 지시를 기다리겠습니다."
   ```

**검증의 중요성:**

**❌ 검증 없이 진행:**
```
작업 완료 → 다음 작업 시작 → 오류 발견 → 이전 작업 재수정 → 시간 낭비
```

**✅ 검증 후 진행:**
```
작업 완료 → 검증 수행 → 오류 즉시 발견 및 수정 → 다음 작업 안심 진행 → 시간 절약
```

**검증 도구 예시:**

**코드 작업 후:**
```
"코드 작성이 완료되었습니다.

다음 검증을 제안합니다:

1. Subagent:
   - code-reviewer: 코드 품질 검토
   - test-engineer: 테스트 케이스 확인

2. Skill:
   - test-runner: 자동 테스트 실행

3. Command:
   - /test: 전체 테스트 실행
   - /review: 코드 리뷰

검증하시겠습니까?"
```

**데이터베이스 작업 후:**
```
"DB 스키마 작업이 완료되었습니다.

다음 검증을 제안합니다:

1. Subagent:
   - database-developer: 스키마 유효성 검사

2. Command:
   - /db-check: 스키마 검증

검증하시겠습니까?"
```

**API 작업 후:**
```
"API 구현이 완료되었습니다.

다음 검증을 제안합니다:

1. Subagent:
   - backend-developer: API 로직 검토
   - test-engineer: API 테스트

2. Skill:
   - api-builder: API 명세 검증

3. Command:
   - /test: API 테스트 실행
   - /review: 코드 리뷰

검증하시겠습니까?"
```

**금지 사항:**

❌ **검증 제안 없이 완료 보고**
```
"작업 완료했습니다!"
(검증 제안 X)
```

✅ **검증 제안과 함께 완료 보고**
```
"작업 완료했습니다!
검증을 위해 code-reviewer와 /test를 실행하고자 합니다.
진행하시겠습니까?"
```

**검증 결과 보고 형식:**
```
✅ 검증 완료

검증 도구:
- code-reviewer: ✅ 통과 (이슈 0개)
- /test: ✅ 통과 (24/24 tests)

검증 결과: 모든 검증 통과
다음 작업 진행 가능합니다.
```

---

### 원칙 6: 절대 거짓 보고 금지 - 제대로 & 빠르게

**핵심 원칙:**
- **"제대로 하되 빠르게"가 목표**
- **"빨리 하되 대충"은 절대 금지**
- 거짓 완료 보고는 신뢰를 파괴함

**금지 사항:**

**❌ 절대 금지 - 대충 하고 완료 보고:**
```
(실제로는 제대로 안 됨)
"완료했습니다!"
```

**❌ 절대 금지 - 테스트 없이 완료:**
```
(테스트 안 돌려봄)
"모든 테스트 통과했습니다!"
```

**❌ 절대 금지 - 오류 숨기고 완료:**
```
(오류 있는데 무시)
"문제없이 완료했습니다!"
```

**❌ 절대 금지 - 일부만 하고 전체 완료:**
```
(70%만 구현)
"전체 기능 완료했습니다!"
```

**올바른 작업 태도:**

**✅ 정직하고 정확한 보고:**
```
"작업 완료했습니다.

완료 항목:
- ✅ 기능 A: 100% 완료
- ✅ 기능 B: 100% 완료
- ⚠️ 기능 C: 90% 완료 (edge case 1개 남음)

테스트:
- ✅ Unit tests: 24/24 통과
- ⚠️ E2E tests: 4/5 통과 (1개 실패)

실패한 테스트:
- test_edge_case_timeout: timeout 이슈

해결 필요 사항:
- edge case 1개 수정
- timeout 이슈 해결

추가 작업 시간 필요합니다. 진행하시겠습니까?"
```

**작업 우선순위:**

**1순위: 정확성 (Correctness)**
- 제대로 동작하는가?
- 모든 요구사항 충족하는가?
- 테스트 통과하는가?

**2순위: 속도 (Speed)**
- 빠르게 완료할 수 있는가?
- 효율적인 방법인가?

**절대 안 되는 것:**
```
속도 > 정확성  ← ❌ 절대 금지
```

**올바른 우선순위:**
```
정확성 > 속도  ← ✅ 올바름
```

**"제대로 & 빠르게" 실천 방법:**

**1. 계획 단계에서 시간 확보**
```
빠른 계획 → 엉터리 구현 → 재작업  ← ❌ 느림

충분한 계획 → 제대로 구현 → 1회 완성  ← ✅ 빠름
```

**2. 검증 단계에서 시간 확보**
```
검증 없이 진행 → 오류 발견 → 재작업  ← ❌ 느림

즉시 검증 → 오류 조기 발견 → 빠른 수정  ← ✅ 빠름
```

**3. 완료 기준 명확화**
```
완료 = "코드 작성함"  ← ❌ 잘못됨

완료 = "코드 작성 + 테스트 통과 + 검증 완료"  ← ✅ 올바름
```

**실제 작업 예시:**

**❌ 잘못된 접근:**
```
15분: 빠르게 코드 작성 (대충)
5분: "완료!" 보고
---
나중에...
30분: 오류 발견 및 재작업
20분: 추가 수정
15분: 재검증
---
총 85분 소요
```

**✅ 올바른 접근:**
```
30분: 꼼꼼하게 코드 작성 (제대로)
10분: 테스트 및 검증
5분: 검증 결과 포함 완료 보고
---
총 45분 소요
```

**완료 보고 체크리스트:**

작업 완료 보고 전 반드시 확인:

- [ ] 모든 요구사항 구현했는가?
- [ ] 테스트 작성 및 실행했는가?
- [ ] 모든 테스트 통과했는가?
- [ ] 검증 도구로 확인했는가?
- [ ] 오류나 경고 없는가?
- [ ] Edge cases 처리했는가?
- [ ] 문서화 필요한 것 했는가?

**모두 YES일 때만 완료 보고**

**거짓 보고의 결과:**
- ❌ 신뢰 파괴
- ❌ 재작업 시간 낭비
- ❌ 프로젝트 전체 지연
- ❌ 다른 작업에 영향

**정직한 보고의 이점:**
- ✅ 신뢰 유지
- ✅ 정확한 진행 상황 파악
- ✅ 문제 조기 발견
- ✅ 전체 프로젝트 성공

**기억할 것:**
> **"빨리 하려고 대충 하는 것은 결국 느리다"**
> **"제대로 하는 것이 가장 빠른 길이다"**

---

## 📝 6대 원칙 최종 요약

1. **AI-Only**: 모든 작업은 AI가 수행. 정말 불가능할 때만 요청 (3가지 이상 시도 후)
2. **시간 금지**: 시간 추정 절대 금지. 진행 상황만 보고
3. **문서 승인**: 문서 생성 전 반드시 승인. 무분별한 생성 금지
4. **도구 활용**: Skills/Subagents/Commands 적극 활용 및 제안
5. **필수 검증 + 문서화**:
   - 작업 완료 후 검증 도구 실행 자발적 제안
   - 검증 후 반드시 문서화 (작업 결과 보고서, 검증 결과 보고서 → Reports)
   - 프로젝트 문서 업데이트 (해당 폴더)
   - **예외**: Project Grid 작업은 해당 프로세스 따름
6. **거짓 금지**: 절대 거짓 보고 금지. "제대로 & 빠르게" (속도 < 정확성)

**이 원칙들을 지키면:**
- ✅ 사용자 개입 최소화
- ✅ 현실적인 기대 형성
- ✅ 깔끔한 프로젝트 구조 유지
- ✅ 최대 효율의 작업 수행
- ✅ 재작업 없는 빠른 개발
- ✅ 신뢰할 수 있는 결과물

---

## ⚠️ 🚨 CRITICAL: PROJECT SAL GRID 데이터 작성 규칙 🚨 ⚠️

**Grid 데이터 생성/수정 시 반드시 매뉴얼을 준수해야 합니다!**

### 필수 참조 문서

**Grid 작업 전 반드시 읽어야 할 문서:**
```
S0_Project-SSAL-Grid_생성/manual/PROJECT_SSAL_GRID_MANUAL.md
```

### Stage 명칭 (정확히 사용)

| Stage | 올바른 명칭 | ❌ 잘못된 예시 |
|-------|-------------|---------------|
| S1 | 개발 준비 (Development Setup) | 기반 구축, Foundation |
| S2 | 개발 1차 (Core Development) | 핵심 기능, Core Features |
| S3 | 개발 2차 (Advanced Features) | AI 기능, AI Features |
| S4 | 개발 3차 (QA & Optimization) | 결제 연동, Payment |
| S5 | 운영 (Operations) | 배포 운영, Deployment |

### Area 명칭 (정확히 사용)

| Area | 올바른 명칭 | ❌ 잘못된 예시 |
|------|-------------|---------------|
| M | Documentation (문서화) | Management |
| U | Design (UI/UX 디자인) | UI/UX |
| F | Frontend (프론트엔드) | - |
| BI | Backend Infrastructure (백엔드 기반) | Backend Infra |
| BA | Backend APIs (백엔드 API) | - |
| D | Database (데이터베이스) | - |
| S | Security (보안/인증/인가) | 보안 |
| T | Testing (테스트) | - |
| O | DevOps (운영/배포) | 운영 |
| E | External (외부 연동) | 외부연동 |
| C | Content System (콘텐츠 시스템) | Content, 콘텐츠 |

### Task Agent (작업 수행자) - 올바른 값

**Area별 적합한 Task Agent:**
- **M (Documentation)**: `documentation-specialist`
- **F (Frontend)**: `frontend-developer`
- **BI (Backend Infrastructure)**: `devops-troubleshooter`, `backend-developer`
- **BA (Backend APIs)**: `backend-developer`
- **D (Database)**: `database-specialist`
- **S (Security)**: `security-specialist`
- **T (Testing)**: `test-engineer`
- **O (DevOps)**: `devops-troubleshooter`
- **E (External)**: `devops-troubleshooter`, `backend-developer`
- **C (Content)**: `content-specialist`

**❌ 잘못된 예시**: `code-reviewer` (이것은 Verification Agent용)

### Verification Agent (검증자) - Task Agent와 다르게!

**검증 전문 Agent:**
- `code-reviewer` - 코드 리뷰
- `qa-specialist` - 품질 보증
- `security-auditor` - 보안 감사
- `database-specialist` - DB 검증 (DB Task의 경우)

**⚠️ 핵심 원칙**: Task Agent ≠ Verification Agent (작성자와 검증자 분리)

### 🔄 종합 검증 프로세스 규칙 (2025-12-13 확정)

#### **1단계: Task 실행 및 검증 (서브에이전트 투입)**

| 단계 | 수행자 | 기록자 | 기록 필드 |
|------|--------|--------|----------|
| Task 작업 | Task Agent **서브에이전트** | Main Agent | Grid #10-13 |
| Task 검증 | Verification Agent **서브에이전트** | Main Agent | Grid #16-21 |

**프로세스:**
```
[Task 작업]
Main Agent → Task Agent 서브에이전트 투입 (Task tool)
           → 서브에이전트가 작업 수행
           → 결과 반환
           → Main Agent가 Grid에 기록 (#10-13)

[Task 검증]
Main Agent → Verification Agent 서브에이전트 투입 (Task tool)
           → 서브에이전트가 검증 수행
           → 결과 반환
           → Main Agent가 Grid에 기록 (#16-21)
```

**❌ 금지:**
- Main Agent가 직접 Task 작업 수행
- Main Agent가 직접 Task 검증 수행
- Task Agent가 검증까지 수행 (작성자 ≠ 검증자)

#### **2단계: Stage Gate 검증 (Main Agent 직접)**

**Stage Gate는 Main Agent가 직접 수행 + 리포트 파일 저장:**
```
[Stage Gate 검증 프로세스]
1. Main Agent가 직접 검증 수행
   - Stage 내 모든 Task 완료 확인
   - 전체 빌드/테스트 통과 확인
   - 의존성 체인 완결성 확인

2. 검증 리포트 파일 생성
   - 저장 위치: S0_Project-SSAL-Grid_생성/ssal-grid/stage-gates/
   - 파일명: S{N}GATE_verification_report.md

3. DB에 파일 경로 기록 (stage_verification 테이블)
   - verification_report_path: 리포트 파일 경로
   - ai_verification_note: 검증 의견
   - stage_gate_status: 'AI Verified'
```

**⭐ Stage Gate 리포트 저장:**
```
[파일 저장]
S0_Project-SSAL-Grid_생성/ssal-grid/stage-gates/
├── S1GATE_verification_report.md  ← 리포트 내용
├── S2GATE_verification_report.md
└── ...

[DB 기록] stage_verification 테이블
┌─────────────────────────────────────────────────────────────────────┐
│ verification_report_path:                                           │
│   'S0_Project-SSAL-Grid_생성/ssal-grid/stage-gates/S1GATE_verification_report.md' │
│                                                                     │
│ ai_verification_note: '모든 Task 완료, 빌드/테스트 통과'            │
│ stage_gate_status: 'AI Verified'                                    │
└─────────────────────────────────────────────────────────────────────┘
```

#### **3단계: Project Owner 최종 승인**

- AI 검증 리포트 (파일 경로로 찾아서) 검토
- 최종 승인/거부 → `stage_gate_status: 'Approved'/'Rejected'`

#### **요약 표**

| 검증 단계 | 수행자 | 리포트 저장 | DB 기록 |
|----------|--------|------------|---------|
| Task 작업 | Task Agent 서브에이전트 | - | Grid #10-13 |
| Task 검증 | Verification Agent 서브에이전트 | - | Grid #16-21 |
| Stage Gate | **Main Agent 직접** | `ssal-grid/stage-gates/` | `verification_report_path`에 경로 저장 |
| 최종 승인 | Project Owner | - | `stage_gate_status` |

### Tools (사용 도구) - 올바른 값

**포함해야 할 것:**
- ✅ Slash Commands: `/review-pr`, `/deploy`, `/test`
- ✅ CLI 도구: `gh`, `vercel-cli`, `npm`
- ✅ MCP Servers: `/mcp__supabase__*`, `browser-mcp`
- ✅ Skills: `pdf-skill`, `playwright-mcp`
- ✅ SDK: `openai-sdk`, `toss-payments-sdk`

**❌ 포함하면 안 되는 것:**
- ❌ `Read`, `Write` (기본 동작)
- ❌ `TypeScript`, `React` (기술 스택 - Task Instruction에 기재)

### Verification 필드 (22개 속성 중 16-20번)

**반드시 JSON 형식으로 구조화:**

```javascript
// #16 Test
{
    "unit_test": "✅/❌/⏳ 설명",
    "integration_test": "✅/❌/⏳ 설명",
    "edge_cases": "✅/❌/⏳ 설명",
    "manual_test": "✅/❌/⏳ 설명"
}

// #17 Build
{
    "compile": "✅/❌/N/A 설명",
    "lint": "✅/❌/N/A 설명",
    "deploy": "✅/❌/N/A 설명",
    "runtime": "✅/❌/N/A 설명"
}

// #18 Integration Verification
{
    "dependency_propagation": "✅/❌ 설명",
    "cross_task_connection": "✅/❌ 설명",
    "data_flow": "✅/❌ 설명"
}

// #19 Blockers
{
    "dependency": "None/⚠️ 설명",
    "environment": "None/⚠️ 설명",
    "external_api": "None/⚠️ 설명",
    "status": "No Blockers ✅ / N Blockers 🚫"
}

// #20 Comprehensive Verification
{
    "task_instruction": "✅/❌ 설명",
    "test": "✅/❌ N/N 통과",
    "build": "✅/❌ N/N 통과",
    "integration": "✅/❌ N/N 통과",
    "blockers": "✅ None/❌ N개",
    "final": "✅ Passed / ❌ Failed"
}
```

### Grid 데이터 작성 체크리스트

Grid 데이터 생성/수정 전 확인:

- [ ] 매뉴얼 (`PROJECT_SSAL_GRID_MANUAL.md`) 읽었는가?
- [ ] Stage 명칭이 정확한가? (개발 준비, 개발 1차, 개발 2차, 개발 3차, 운영)
- [ ] Area 명칭이 정확한가? (Documentation, Design, Frontend, ...)
- [ ] Task Agent가 작업 유형에 맞는가? (documentation-specialist, frontend-developer, ...)
- [ ] Verification Agent가 Task Agent와 다른가?
- [ ] Tools에 Skills/Commands/MCP가 있는가? (Read/Write 금지)
- [ ] Verification 필드가 JSON 형식인가?
- [ ] 의존성(Dependencies)이 정확한가?

**이 규칙을 어기면 Grid 데이터가 엉망이 됩니다!**

---

## Universal Development Guidelines

### Code Quality Standards
- Write clean, readable, and maintainable code
- Follow consistent naming conventions across the project
- Use meaningful variable and function names
- Keep functions focused and single-purpose
- Add comments for complex logic and business rules

### Git Workflow
- Use descriptive commit messages following conventional commits format
- Create feature branches for new development
- Keep commits atomic and focused on single changes
- Use pull requests for code review before merging
- Maintain a clean commit history

### Documentation
- Keep README.md files up to date
- Document public APIs and interfaces
- Include usage examples for complex features
- Maintain inline code documentation
- Update documentation when making changes

### Testing Approach
- Write tests for new features and bug fixes
- Maintain good test coverage
- Use descriptive test names that explain the expected behavior
- Organize tests logically by feature or module
- Run tests before committing changes

### Security Best Practices
- Never commit sensitive information (API keys, passwords, tokens)
- Use environment variables for configuration
- Validate input data and sanitize outputs
- Follow principle of least privilege
- Keep dependencies updated

## Project Structure Guidelines

### File Organization
- Group related files in logical directories
- Use consistent file and folder naming conventions
- Separate source code from configuration files
- Keep build artifacts out of version control
- Organize assets and resources appropriately

### Configuration Management
- Use configuration files for environment-specific settings
- Centralize configuration in dedicated files
- Use environment variables for sensitive or environment-specific data
- Document configuration options and their purposes
- Provide example configuration files

## Development Workflow

### Before Starting Work
1. Pull latest changes from main branch
2. Create a new feature branch
3. Review existing code and architecture
4. Plan the implementation approach

### During Development
1. Make incremental commits with clear messages
2. Run tests frequently to catch issues early
3. Follow established coding standards
4. Update documentation as needed

### Before Submitting
1. Run full test suite
2. Check code quality and formatting
3. Update documentation if necessary
4. Create clear pull request description

## Common Patterns

### Error Handling
- Use appropriate error handling mechanisms for the language
- Provide meaningful error messages
- Log errors appropriately for debugging
- Handle edge cases gracefully
- Don't expose sensitive information in error messages

### Performance Considerations
- Profile code for performance bottlenecks
- Optimize database queries and API calls
- Use caching where appropriate
- Consider memory usage and resource management
- Monitor and measure performance metrics

### Code Reusability
- Extract common functionality into reusable modules
- Use dependency injection for better testability
- Create utility functions for repeated operations
- Design interfaces for extensibility
- Follow DRY (Don't Repeat Yourself) principle

## Project Grid Dual Execution System

This project uses the Project Grid methodology with a dual execution system for quality assurance.

### Dual Execution Overview

**Every task goes through TWO execution phases**:

1. **1st Execution (Claude Code Sub-agents)**
   - Assigned by task type (devops-troubleshooter, database-developer, frontend-developer, etc.)
   - Implements code according to task instructions
   - Performs initial testing and validation

2. **2nd Execution & Verification (Claude Code - Different Session)**
   - Reviews 1st execution results
   - **Can**: Leave unchanged / Modify / Rewrite / Add new files
   - Re-runs tests and builds
   - Final quality gate before Phase completion

### Recording Dual Execution in Project Grid

**Note**: As of 2025-11-06, Claude Code (different session) now performs FULL execution (build, test, verification) with enhanced capabilities.

#### 1st Execution (Claude Code Session 1) - Basic Format
When recording 1st execution results in Project Grid:

```json
{
  "assigned_agent": "1차: backend-developer",
  "files": ["3_Backend_APIs/auth/P1BA1_signup.ts"],
  "duration": "1차: 25분",
  "build_result": "1차: ✅ 성공",
  "test_history": "1차: Test(20/20)@Claude | Build ✅"
}
```

#### 2nd Execution (Claude Code Session 2) - Detailed Report Format
Claude Code (Session 2) creates a comprehensive JSON report saved to `Human_ClaudeCode_Bridge/Orders/{task_id}.json`:

```json
{
  "task_id": "P1BA1",
  "task_name": "회원가입 API",
  "phase": 1,
  "area": "BA",
  "status": "완료",
  "progress": 100,

  "execution_info": {
    "assigned_agent": "1차: backend-developer | 2차: Claude Code(실행 및 검증)",
    "generator": "Claude Code",
    "generated_at": "2025-11-06T15:48:00Z"
  },

  "duration": {
    "first_execution_minutes": 25,
    "second_execution_minutes": 35,
    "total_minutes": 60
  },

  "files": {
    "expected": ["3_Backend_APIs/auth/P1BA1_signup.ts"],
    "generated_by_first": ["3_Backend_APIs/auth/P1BA1_signup.ts"],
    "modified_by_second": ["3_Backend_APIs/auth/P1BA1_signup.ts"],
    "added_by_second": []
  },

  "static_analysis": {
    "task_id_comment": {"status": "✅", "location": "첫 줄부터 시작"},
    "file_paths": {"status": "✅", "details": "모든 파일이 기대 결과물과 정확히 일치"},
    "content_validation": {"status": "✅", "requirements_met": "100%"},
    "dependencies": {"status": "✅", "details": "모든 의존성 올바르게 처리됨"}
  },

  "dynamic_analysis": {
    "build": {"status": "✅ 성공", "details": "번들 사이즈: 245KB"},
    "unit_tests": {"status": "✅ 통과", "total": 24, "passed": 24, "failed": 0},
    "e2e_tests": {"status": "✅ 통과", "total": 5, "passed": 5, "failed": 0},
    "lint": {"status": "✅ 통과", "errors": 0, "warnings": 0},
    "type_check": {"status": "✅ 통과", "errors": 0}
  },

  "issues_found_and_fixed": [
    {
      "type": "개선",
      "description": "비밀번호 검증 로직 강화",
      "file": "3_Backend_APIs/auth/P1BA1_signup.ts",
      "fix_applied": "정규식 패턴 추가",
      "status": "✅ 수정 완료"
    }
  ],

  "test_history": {
    "first_execution": "1차: Test(20/20)@Claude | Build ✅",
    "second_execution": "2차: Test(24/24)@ClaudeCode | Build ✅ | E2E(5/5)@ClaudeCode",
    "combined": "최종: Test(24/24) + E2E(5/5) + Build ✅ + Lint ✅ + Type ✅"
  },

  "validation_result": "✅ 통과",
  "ready_for_phase_advance": true
}
```

**Key Rules for Dual Execution Recording**:
- **1st Execution**: Claude Code Session 1 records basic info (file paths, basic build/test results)
- **2nd Execution**: Claude Code Session 2 creates comprehensive JSON report in `Human_ClaudeCode_Bridge/Orders/{task_id}.json`
- **File Tracking**: Mark Session 2's work with `(ClaudeCode수정)`, `(ClaudeCode추가)`, or `(ClaudeCode재작현)` in `generated_files`
- **Test History**: Always show both 1st and 2nd execution results separated by ` | `
- **Build Result**: Always show both 1st and 2nd execution results separated by ` | `
- **Report Location**: Claude Code Session 2 saves full report to `Human_ClaudeCode_Bridge/Orders/{task_id}.json` (required for final verification)

### Phase-based Workflow

Work is done by **Phase** (not task-by-task):

1. Claude Code sub-agents complete all Phase 1 tasks (20 tasks)
2. Claude Code (different session) performs 2nd execution & verification on all Phase 1 tasks
3. Phase Gate approval after 2nd execution completes
4. Proceed to Phase 2

This minimizes human intervention while ensuring quality through dual execution.

### Reference Documents

- Full details: `Developement_Real_PoliticianFinder/0-5_Development_ProjectGrid/PHASE_BASED_DUAL_VERIFICATION.md`
- Manual: `Developement_Real_PoliticianFinder/0-5_Development_ProjectGrid/PROJECT_GRID_매뉴얼_V4.0.md`

---

## Review Checklist

Before marking any task as complete:
- [ ] Code follows established conventions
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Security considerations are addressed
- [ ] Performance impact is considered
- [ ] Code is reviewed for maintainability
- [ ] Project Grid updated with dual execution information (if applicable)