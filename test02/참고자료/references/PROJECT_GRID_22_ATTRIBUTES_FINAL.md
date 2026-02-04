# PROJECT SAL GRID - 22개 속성 + Stage Gate 시스템 최종안

> **작성일**: 2025-11-23  
> **버전**: v2.0 Final (Stage Gate 추가)  
> **용도**: SSALWorks 프로젝트 관리 시스템 - Task 속성 정의 + 하이브리드 관리 시스템

---

## 📊 22개 속성 전체 구조

### **[1-4] Basic Info (기본 정보)**

```
1. Stage (단계)
   - 값: 1~5 (개발 단계)
   - 예시: 4

2. Area (영역)
   - **정의**: 작업이 속한 개발 영역
   - **값 범위**: 11개 표준 영역 또는 프로젝트에 따라 유연하게 정의
   - **표준 영역** (11개):
     • **M (Documentation)**: 문서화
     • **U (Design)**: UI/UX 디자인
     • **F (Frontend)**: 프론트엔드
     • **BI (Backend Infrastructure)**: 백엔드 기반 (Supabase 클라이언트, 미들웨어, 공통 유틸)
     • **BA (Backend APIs)**: 백엔드 API (비즈니스 로직, REST API 엔드포인트)
     • **D (Database)**: 데이터베이스
     • **S (Security)**: 보안/인증/인가
     • **T (Testing)**: 테스트
     • **O (DevOps)**: 운영/배포
     • **E (External)**: 외부 연동
     • **C (Content System)**: 콘텐츠 시스템
   - **커스텀 영역**: 프로젝트 필요에 따라 자유롭게 정의 가능
   - **데이터 타입**: 텍스트 (고정값)
   - **예시**: "DevOps", "Frontend", "Backend Infrastructure", "Backend APIs"
   - **용도**: Y축 좌표, 작업 분류 및 담당 AI Agent 역할 결정

3. Task ID (작업ID)
   - **정의**: 각 작업의 고유 식별 번호
   - **형식**: S[Stage][Area][Number][병렬기호]
     • Stage: 1, 2, 3, 4, 5, 6
     • Area: M, U, F, BI, BA, D, S, T, O, E, C
     • Number: 1, 2, 3... (순차적)
     • 병렬기호: a, b, c... (소문자, 병렬 작업 시만 사용)
   - **데이터 타입**: 텍스트 (고정값)
   - **예시**:
     • "S1F1" (Stage 1, Frontend, 작업 1번 - 단독)
     • "S2BI3a" (Stage 2, Backend Infrastructure, 작업 3번 병렬 a)
     • "S2BA5b" (Stage 2, Backend APIs, 작업 5번 병렬 b)
     • "S3F7" (Stage 3 개발 1차, Frontend, 작업 7번 - 단독)
   - **용도**: Grid에서 작업을 추적하고 의존성/병렬성을 표현하는 핵심 키값

4. Task Name (업무명)
   - **정의**: 작업의 간단한 설명 (한 줄)
   - **값**: 간결한 작업 내용 요약
   - **데이터 타입**: 텍스트
   - **예시**: "크롤링 스케줄러", "회원가입 페이지 구현", "정치인 테이블 마이그레이션"
   - **용도**: Grid Viewer에서 Task 식별 및 빠른 이해
```

---

### **[5-9] Task Definition (작업 정의)**

```
5. Task Instruction (작업지시서)
   - **정의**: 작업을 수행하기 위한 상세 지시사항이 저장된 파일의 경로
   - **값**: 파일 경로 또는 URL
   - **데이터 타입**: 텍스트
   - **예시**:
     • "tasks/S4O1_instruction.md" (상대 경로)
     • "/docs/instructions/S4BA1.md" (절대 경로)
     • "https://docs.example.com/tasks/S1O1" (웹 문서)
     • "-" (지시서 없음)
   - **표준 위치**: `project-ssal-grid/task-instructions/{TaskID}_instruction.md`
   - **표준 파일명**: `{TaskID}_instruction.md`
   - **용도**: AI Agent가 작업 수행 시 참조하는 핵심 문서
   - **주의**: 경로가 틀리면 AI가 작업 불가

6. Task Agent (작업에이전트)
   - **정의**: 작업을 수행할 AI 에이전트 이름
   - **값**: Agent 이름
   - **데이터 타입**: 텍스트
   - **예시**: "devops-troubleshooter", "fullstack-developer", "frontend-specialist"
   - **용도**: 작업을 실제로 수행하는 AI Agent 지정

7. Tools (사용도구)
   - **정의**: Agent가 작업 수행 시 동원하는 도구 목록
   - **값**: 쉼표로 구분된 도구 목록
   - **데이터 타입**: 텍스트
   - **포함 항목** (Agent가 사용하는 도구만):
     • **Claude Code Plugins**: 플러그인 이름 (예: @anthropic/code-review)
     • **Slash Commands**: /review-pr, /test, /deploy 등
     • **Skills**: pdf, xlsx, image-processing 등
     • **MCP Servers**: /mcp__github__*, /mcp__postgres__* 등
     • **CLI 도구**: gh (GitHub CLI), docker, npm 등
   - **제외 항목** (구현에 사용되는 것, Task Instruction에 명시):
     • ❌ 기술 스택: TypeScript, React, Next.js 등
     • ❌ 라이브러리: Tailwind CSS, Zustand, Zod 등
   - **예시**:
     • "/deploy, gh, @myteam/devops-plugin"
     • "/review-pr, pdf-skill, /mcp__github__create-pr"
     • "/test, docker, @anthropic/testing-tools"
   - **용도**: Agent가 작업 수행 시 동원할 수 있는 도구 명시
   - **참고**: Claude Code Plugin System (Commands, Skills, MCP 포함)

8. Execution Type (실행유형)
   - **정의**: 작업 수행 방식 (AI 자동화 수준)
   - **값**: AI-Only | Human-AI | Human-Only
   - **데이터 타입**: 텍스트 (고정값)
   - **예시**:
     • "AI-Only" (기본값, 80% 목표)
     • "Human-AI" (AI가 물리적으로 불가능한 경우만)
     • "Human-Only" (거의 사용 안 함)
   - **용도**: 작업의 자동화 수준 명시
   - **원칙**: AI-First, 명확한 사유 없이 Human 개입 금지

9. Dependencies (의존성체인)
   - **정의**: 현재 작업이 시작되기 전에 먼저 완료되어야 할 선행 작업의 ID
   - **값**: Task ID 목록 (쉼표로 구분)
   - **데이터 타입**: 텍스트
   - **예시**:
     • "S1O4" (단일 의존성)
     • "S2BI1, S2F2" (복수 의존성)
     • "S3F2a, S3F2b, S3F2c" (병렬 작업 그룹 전체 의존)
     • "-" 또는 빈 칸 (의존성 없음)
   - **용도**: Task 실행 순서 제어, 자동 의존성 검증
   - **참고**: 코드 import 문에서 자동 의존성 감지 가능
```

---

### **[10-13] Task Execution (작업 실행)**

```
10. Task Progress (작업진도)
    - 값: 0% ~ 100%
    - 예시: 100%

11. Task Status (작업상태)
    - **정의**: 현재 작업 상태
    - **값**: Pending | In Progress | Completed | Fixing
    - **데이터 타입**: 텍스트 (고정값)
    - **예시**:
      • "Pending" (대기)
      • "In Progress" (진행 중)
      • "Completed" (완료)
      • "Fixing" (수정 중)
    - **용도**: 작업 진행 단계 추적
    - **참고**: 타임스탬프는 DB의 created_at, updated_at 사용

12. Generated Files (생성파일)
    - **정의**: 작업으로 생성된 파일 목록
    - **값**: 쉼표로 구분된 파일 경로 목록
    - **데이터 타입**: 텍스트
    - **예시**:
      • "src/app/api/cron/route.ts, vercel.json, README.md"
      • "src/components/ProfileCard.tsx, src/lib/utils.ts"
    - **표준 파일명**: {TaskID}_ 접두사 사용 권장
    - **용도**: Task가 생성한 파일 추적
    - **참고**: Git 커밋으로 파일 생성 시점 추적 가능

13. Modification History (수정이력)
    - **정의**: 생성된 파일들의 수정 내역 및 오류 복구 과정
    - **값**: 버전 및 변경 내용 기록
    - **데이터 타입**: 텍스트
    - **예시**:
      • "[v1.0.0] 초기 구현"
      • "[ERROR] TypeScript 타입 오류 → [FIX] 인터페이스 수정 → [PASS] 빌드 성공"
      • "[v1.0.1] 코드 리뷰 반영"
    - **작성 원칙**: 버전 번호 포함, 오류 복구 과정 상세 기록
    - **용도**: 변경 이력 추적 및 문제 해결 과정 기록
```

---

### **[14-15] Verification Definition (검증 정의)**

```
14. Verification Instruction (검증지시서)
    - **정의**: 검증을 수행하기 위한 체크리스트가 저장된 파일의 경로
    - **값**: 파일 경로 또는 URL
    - **데이터 타입**: 텍스트
    - **예시**:
      • "tasks/S4O1_verification.md" (상대 경로)
      • "/docs/verifications/S4BA1.md" (절대 경로)
      • "-" (검증지시서 없음)
    - **표준 위치**: `project-ssal-grid/verification-instructions/{TaskID}_verification.md`
    - **표준 파일명**: `{TaskID}_verification.md`
    - **용도**: 검증 Agent가 Task 검증 시 참조하는 체크리스트

15. Verification Agent (검증에이전트)
    - **정의**: 작업 완료 후 검증을 수행할 전문 AI 에이전트 이름
    - **값**: Agent 이름
    - **데이터 타입**: 텍스트
    - **예시**:
      • "qa-specialist" (품질 보증 전문가)
      • "code-reviewer" (코드 리뷰어)
      • "security-auditor" (보안 감사자)
      • "performance-tester" (성능 테스터)
    - **용도**: 1단계 Task 검증 수행 (작성자와 분리된 독립 검증자)
    - **참고**: Task Agent와 다른 Agent 사용 권장 (객관적 검증)
```

---

### **[16-19] Verification Execution (검증 실행)**

```
16. Test (테스트)
    - **정의**: 작업 결과물에 대한 테스트 수행 결과
    - **구성**: 4가지 테스트 유형
      • Unit Test (단위테스트): 개별 함수/컴포넌트 테스트
      • Integration Test (통합테스트): 모듈 간 연동 테스트
      • Edge Cases (엣지케이스): 경계값/예외 상황 테스트
      • Manual Test (수동테스트): 실제 동작 확인
    - **데이터 타입**: 구조화된 텍스트 (각 테스트별 Pass/Fail)
    - **예시**:
      • Unit Test (단위테스트): ✅ CRON_SECRET 인증
      • Integration Test (통합테스트): ✅ S4BA1 크롤러 연동
      • Edge Cases (엣지케이스): ✅ 빈 데이터 처리
      • Manual Test (수동테스트): ✅ curl 실행 확인
    - **용도**: 코드 품질 검증 및 오류 조기 발견
    - **참고**: 모든 항목이 ✅ Pass 되어야 Comprehensive Verification 통과

17. Build (빌드)
    - **정의**: 빌드 프로세스 각 단계의 성공 여부
    - **구성**: 4가지 빌드 단계
      • Compile (컴파일): 타입스크립트/컴파일 오류 검사
      • Lint (린트): 코드 스타일 및 정적 분석
      • Deploy (배포): 실제 배포 환경 테스트
      • Runtime (실행): 런타임 동작 확인
    - **데이터 타입**: 구조화된 텍스트 (각 단계별 Pass/Fail)
    - **예시**:
      • Compile (컴파일): ✅ TypeScript 오류 없음
      • Lint (린트): ✅ ESLint 통과
      • Deploy (배포): ✅ Vercel Production 정상
      • Runtime (실행): ✅ Cron 로그 확인
    - **용도**: 프로덕션 배포 가능 여부 판단
    - **참고**: Compile, Lint는 필수, Deploy/Runtime은 선택적

18. Integration Verification (연동검증)
    - **정의**: 다른 Task 또는 시스템과의 연동 상태 검증
    - **구성**: 3가지 연동 검증 항목
      • Dependency Propagation (의존성전파): 선행 Task의 결과물이 올바르게 전달되는지
      • Cross-Task Connection (Task간 연결): 관련 Task들과 정상 연동되는지
      • Data Flow (데이터 흐름): 데이터가 올바르게 흐르는지
    - **데이터 타입**: 구조화된 텍스트 (각 항목별 Pass/Fail)
    - **예시**:
      • Dependency Propagation (의존성전파): S4O2, S4O3 ✅
      • Cross-Task Connection (Task간 연결): ✅ S4BA1 API 정상 호출
      • Data Flow (데이터 흐름): ✅ DB → API → Frontend 데이터 전달
    - **용도**: 시스템 통합 상태 확인
    - **참고**: Dependencies가 있는 Task는 반드시 검증 필요

19. Blockers (블로커)
    - **정의**: 작업 완료를 방해하는 장애물 목록
    - **구성**: 4가지 블로커 유형
      • Dependency (의존성): 선행 Task 미완료
      • Environment (환경설정): 환경변수, API 키 등 설정 문제
      • External API (외부 API): 외부 서비스 장애 또는 제한
      • Status (상태): 전체 블로커 상태 요약
    - **데이터 타입**: 구조화된 텍스트 (각 유형별 블로커 내용)
    - **예시**:
      • Dependency (의존성): None
      • Environment (환경설정): None
      • External API (외부 API): None
      • Status (상태): No Blockers ✅
    - **예시 (블로커 있는 경우)**:
      • Dependency (의존성): ⚠️ S4BA1 미완료 대기중
      • Environment (환경설정): ⚠️ SUPABASE_URL 미설정
      • External API (외부 API): ⚠️ OpenAI API 할당량 초과
      • Status (상태): 3 Blockers 🚫 작업 중단
    - **용도**: 작업 진행 장애물 추적 및 해결
    - **참고**: 블로커 해결되면 즉시 Status 업데이트
```

---

### **[20-22] Verification Completion (검증 완료)**

```
20. Comprehensive Verification (종합검증결과)
    - **정의**: 모든 검증 항목을 종합한 최종 검증 결과 리포트
    - **구성**: 6가지 검증 항목 + 최종 판정
      • Task Instruction (작업지시서): 지시서 요구사항 충족 여부
      • Test (테스트): #16 테스트 결과 요약
      • Build (빌드): #17 빌드 결과 요약
      • Integration (연동): #18 연동 검증 결과 요약
      • Blockers (블로커): #19 블로커 상태 요약
      • Final (최종): 전체 검증 통과/실패 판정
    - **데이터 타입**: 구조화된 텍스트 (각 항목별 Pass/Fail + 최종 판정)
    - **예시 (통과)**:
      • [Task Instruction (작업지시서)] ✅ 모든 요구사항 충족
      • [Test (테스트)] ✅ 4/4 통과
      • [Build (빌드)] ✅ 4/4 통과
      • [Integration (연동)] ✅ 3/3 통과
      • [Blockers (블로커)] ✅ None
      • [Final (최종)] ✅ Passed (검증 통과)
    - **예시 (실패)**:
      • [Task Instruction (작업지시서)] ✅ 모든 요구사항 충족
      • [Test (테스트)] ❌ 2/4 실패 (Unit, Integration)
      • [Build (빌드)] ❌ Compile 오류 발생
      • [Integration (연동)] ⚠️ 검증 불가 (선행 Task 미완료)
      • [Blockers (블로커)] ❌ 2 Blockers
      • [Final (최종)] ❌ Failed (재작업 필요)
    - **용도**: Verification Agent가 작성하는 최종 검증 리포트
    - **참고**: 모든 항목 ✅ Pass 시에만 Verification Status가 "Passed"

21. Verification Status (검증상태)
    - **정의**: 검증 완료 후 최종 판정 상태
    - **값**: Not Verified | Passed | Failed
    - **데이터 타입**: 텍스트 (고정값)
    - **예시**:
      • "Not Verified" (미검증 - 초기 상태)
      • "Passed" (통과 - 검증 성공)
      • "Failed" (실패 - 재작업 필요)
    - **용도**: Task의 품질 승인 여부 추적
    - **참고**:
      • Passed → Task 완전 완료, 다음 Task 진행 가능
      • Failed → Task Status를 "Fixing"으로 변경, 재작업

22. Remarks (참고사항)
    - **정의**: 후속 작업자를 위한 참고사항, 주의사항, 제약사항
    - **값**: 자유 형식 텍스트
    - **데이터 타입**: 텍스트
    - **예시**:
      • "매일 6시 자동 실행됨"
      • "CRON_SECRET 환경변수 필수"
      • "S4O2 작업 시 이 Task의 로그 파일 경로 참조 필요"
      • "향후 시간 변경 시 vercel.json 수정"
      • "OpenAI API 할당량 주의 (월 100만 토큰 제한)"
    - **용도**:
      • 다음 세션 Agent가 작업 이어갈 때 참고
      • 운영/유지보수 시 주의사항 전달
      • 의존 Task에서 이 Task의 결과물 사용 시 필요한 정보
    - **작성 원칙**:
      • 구체적이고 실행 가능한 정보 기록
      • 환경변수, 파일 경로, 설정값 등 명시
      • "왜 이렇게 했는지" 맥락 제공
```

---

## 🔄 Task 작업 플로우

```
[1-9] Task 정의 (AI가 Supabase에 생성)
  ↓
[10] Task Progress: 0% → 작업 시작
[11] Task Status: Pending → In Progress
  ↓
[작업 에이전트 실행]
  - [5] Task Instruction 읽기
  - 코드 작성
  ↓
[10] Task Progress: 100%
[11] Task Status: Completed
[12] Generated Files 기록
[13] Modification History 기록
  ↓
[검증 에이전트 실행]
  - [14] Verification Order 읽기
  ↓
[16] Test 수행
[17] Build 수행
[18] Integration Verification 수행
[19] Blockers 확인
  ↓
[20] Comprehensive Verification 작성
[21] Verification Status 판정
  ↓
  ✅ Passed → 완료!
  ❌ Failed → [11] Work Status: Fixing → 10번부터 재작업
  ↓
[22] Remarks 작성 (후속 작업자를 위한 참고사항)
```

---

## ✅ 검증 로직

### **검증 통과 조건 (ALL 충족)**
```
✅ Test (16번) - 모든 테스트 통과
✅ Build (17번) - 모든 빌드 정상
✅ Integration Verification (18번) - 모든 연동 확인
✅ Blockers (19번) - 블로커 없음 (None)

→ Comprehensive Verification (20번): Passed
→ Verification Status (21번): Passed (통과)
```

### **검증 실패 조건 (ANY 해당)**
```
❌ Test 실패
❌ Build 실패
❌ Integration 실패
❌ Blockers 존재

→ Comprehensive Verification (20번): Failed
→ Verification Status (21번): Failed (실패)
→ Work Status (11번): Fixing (수정중)
→ Work Progress (10번): 재조정 후 재작업
```

---

## 📋 Supabase 테이블 스키마 (예시)

```sql
CREATE TABLE project_grid (
  -- Basic Info
  stage INT,
  area VARCHAR,
  task_id VARCHAR PRIMARY KEY,
  task_name TEXT,
  
  -- Work Definition
  work_order TEXT,
  work_agent VARCHAR,
  tools TEXT,
  work_method VARCHAR,
  dependencies TEXT,
  
  -- Work Execution
  work_progress INT,
  work_status VARCHAR,
  generated_files TEXT,
  modification_history TEXT,
  
  -- Verification Definition
  verification_order TEXT,
  verification_agent VARCHAR,
  
  -- Verification Execution
  test JSONB,
  build JSONB,
  integration_verification JSONB,
  blockers JSONB,
  
  -- Verification Completion
  comprehensive_verification TEXT,
  verification_status VARCHAR,
  remarks TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚪 Stage Gate 시스템

### **개념**
Stage Gate는 각 Stage가 완료된 후 다음 Stage로 넘어가기 전에 거치는 **이중 검증 관문**입니다.

### **Stage Verification 테이블**

```sql
CREATE TABLE stage_verification (
  stage_name VARCHAR PRIMARY KEY,  -- "Stage 1: 프로토타입", "Stage 2: 개발 준비", "Stage 3: 개발 1차" 등
  project_id VARCHAR,
  
  -- 검증 정의
  stage_verification_order TEXT,    -- stages/Stage1_VERIFY.md
  stage_verification_agent VARCHAR, -- stage-qa-reviewer
  
  -- 1차: AI 자동 검증
  auto_verification_status VARCHAR,  -- Not Verified | Passed | Failed
  auto_verification_result TEXT,     -- AI 검증 상세 리포트
  auto_verification_date TIMESTAMP,
  
  -- 2차: Project Owner (프로젝트 오너) 수동 검증
  manual_verification_status VARCHAR,  -- Not Verified | Approved | Rejected
  manual_verification_comment TEXT,    -- Project Owner의 검토 의견
  manual_verification_date TIMESTAMP,
  
  -- Stage Gate 최종 상태
  stage_gate_status VARCHAR,  -- Not Started | AI Verified | Approved | Rejected
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### **Stage Gate 상태**

```
- Not Started (미시작): 아직 모든 Task 미완료
- AI Verified (AI 검증 완료): 1차 자동 검증 통과, Project Owner 승인 대기
- Approved (승인 완료): Project Owner 최종 승인 → 다음 Stage 진입 가능 (Stage 1~6) ✅
- Rejected (거부): Project Owner가 수정 요청, Inbox로 Order Sheet 발행 필요
```

### **Stage Gate 플로우**

```
Stage N 모든 Task 완료
  ↓
[1차: AI 자동 검증 - 자동 실행]
  ├─ 모든 Task 완료 여부 확인
  ├─ 각 Task 검증상태 확인
  ├─ Stage 목표 달성 확인
  ├─ stages/StageN_VERIFY.md 기준 검증
  └─ stage_gate_status = "AI Verified"
  ↓
[2차: Project Owner (프로젝트 오너) 수동 검증]
  ├─ PROJECT SAL GRID 확인
  ├─ AI 검증 리포트 검토
  └─ 실제 결과물 확인
  ↓
  ✅ 승인:
    ├─ PROJECT SAL GRID에서 직접 승인
    ├─ stage_gate_status = "Approved"
    └─ Stage Gate 통과! (완료)

  ❌ 거부:
    ├─ Inbox에 Order Sheet 작성
    ├─ {
    │    "action": "reject_stage_gate",
    │    "stage_name": "Stage N",
    │    "tasks_to_fix": [...],
    │    "instructions": [...]
    │  }
    ├─ Claude Code → 수정 작업
    ├─ AI 재검증 (자동)
    └─ Project Owner 재확인
```

### **Stage 시작 제어**

모든 Stage는 **Project Owner의 명시적 지시**로만 시작됩니다:

```
Stage N Gate 승인됨
  ↓
❌ 자동 시작 안 됨 (대기)
  ↓
Project Owner → Inbox에 Order Sheet 작성
{
  "action": "start_stage",
  "stage_name": "Stage N+1: [이름]",
  "instruction": "Stage N+1 시작"
}
  ↓
Claude Code → Stage N+1 시작 ✅
```

---

## 📬 하이브리드 시스템: PROJECT SAL GRID + Inbox/Outbox

### **시스템 구조**

**PROJECT SAL GRID (자동 실행 영역):**
- Task 정의 및 저장
- Task 순차 자동 실행
- Task별 검증
- Stage Gate AI 자동 검증

**Inbox/Outbox (수동 제어 영역):**
- Stage 시작 명령
- Stage Gate 거부 + 수정 지시
- 작업 진행 중 긴급 개입

### **Inbox Order Sheet 발행 시점**

Project Owner가 Order Sheet를 발행하는 **3가지 경우**:

#### **1. 새 Stage 시작 (필수)**
```json
{
  "action": "start_stage",
  "stage_name": "Stage 2: MVP 개발",
  "instruction": "Stage 2 모든 Task 시작"
}
```

#### **2. Stage Gate 거부 + 수정 지시 (필요 시)**
```json
{
  "action": "reject_stage_gate",
  "stage_name": "Stage 1: 기획",
  "tasks_to_fix": ["S1F3", "S1B2"],
  "instructions": [
    "S1F3: ERD 다이어그램 수정 필요",
    "S1B2: API 명세서 보완"
  ],
  "reason": "데이터 구조 재검토 필요"
}
```

#### **3. 수시 작업 지시 (필요 시)**
```json
{
  "action": "runtime_intervention",
  "task_id": "S3F5",
  "instruction": "현재 방식 중단, React Query 사용으로 변경",
  "urgency": "immediate"
}
```

### **자동 vs 수동 구분**

| 작업 | 자동 (PROJECT SAL GRID) | 수동 (Order Sheet) |
|------|---------------------|-------------------|
| Task 실행 | ✅ 자동 순차 실행 | - |
| Task 검증 | ✅ 자동 검증 | - |
| Stage Gate AI 검증 | ✅ 자동 실행 | - |
| Stage Gate 승인 | - | ⚠️ PROJECT GRID 직접 클릭 |
| Stage Gate 거부 | - | ✅ Order Sheet 필수 |
| Stage 시작 | - | ✅ Order Sheet 필수 |
| 긴급 수정 | - | ✅ Order Sheet |

---

## 🎯 핵심 원칙

### **1. 하이브리드 자동화**
- PROJECT SAL GRID: Task 자동 실행 (80%)
- Inbox/Outbox: Project Owner의 전략적 개입 (20%)
- Stage 시작/종료는 Project Owner가 제어

### **2. 이중 검증 (Stage Gate)**
- 1차: AI 자동 검증 (형식/완성도)
- 2차: Project Owner 수동 검증 (품질/방향성)
- 둘 다 통과해야 다음 Stage 진입

### **3. 검증 분리**
- Task 작업 에이전트 ≠ Task 검증 에이전트
- Task 검증 ≠ Stage 검증
- 독립적 검증으로 품질 보장

### **4. 명시적 Stage 제어**
- 모든 Stage는 Project Owner의 명령으로 시작
- 자동 진행 없음 (통제 유지)
- Stage Gate 거부 시 Order Sheet 필수

### **5. 블로커 관리**
- 블로커 있으면 검증 실패
- 의존성/환경/외부 API 체크 필수
- 블로커 해결 후 재작업

### **6. 후속 작업 배려**
- Remarks에 참고사항 필수 기록
- 다음 작업자가 막히지 않도록 상세 기록

---

## 📌 SSALWorks 연동

이 22개 속성 + Stage Gate 시스템은 **SSALWorks 플랫폼**의 핵심입니다:

1. **3D Grid Viewer**: Stage(X), Area(Y), Task Number(Z)로 시각화
2. **하이브리드 자동화**: 
   - PROJECT SAL GRID 기반 자동 실행 (80%)
   - Inbox/Outbox 수동 제어 (20%)
3. **Stage Gate 관리**:
   - AI 자동 검증 + Project Owner 수동 승인
   - 각 Stage 품질 보증
4. **품질 보장**: 
   - Task/Stage 다층 검증
   - 작업/검증 에이전트 분리

---

**문서 끝**
