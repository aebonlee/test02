# SSAL Works 프로젝트 계획서

> **최종 수정**: 2025-12-02
> **프로젝트 유형**: AI 기반 웹사이트 개발 프로젝트 실행 및 관리 플랫폼
> **도메인**: ssalworks.world
> **프로젝트 관리자**: Sunny (써니)
> **주요 변경**: 구독 모델 업데이트 (설치비 + 월 사용료 + 챌린지), AI 크레딧 시스템, Workflow 문서 추가

---

## 📋 목차

1. [프로젝트 비전](#1-프로젝트-비전-what--why)
2. [브랜드 정체성](#2-브랜드-정체성)
3. [핵심 기능](#3-핵심-기능-core-features)
4. [기술 스택 요약](#4-기술-스택-요약)
5. [프로젝트 구조](#5-프로젝트-구조)
6. [주요 문서 맵](#6-주요-문서-맵)
7. [빠른 시작 가이드](#7-빠른-시작-가이드)

---

## 1. 프로젝트 비전 (What & Why)

### 1.1 핵심 아이디어

**AI 기반 웹사이트 개발 프로젝트 실행 및 관리 플랫폼**

> **"기술은 몰라도, 내 사이트는 내가 만든다"**

SSAL Works는 비개발자가 AI(Claude Code)를 활용하여 웹사이트를 직접 개발할 수 있도록 돕는 플랫폼입니다.

**4대 핵심 기능:**
1. **실행 (Execution)**: Workspace + Order Sheet → Claude Code에게 작업 지시 → AI가 실제 코드 작성/수정
2. **관리 (Management)**: 좌측 사이드바 + PROJECT SAL Grid → SAL(Stage-Area-Level) 3D 그리드로 프로젝트 Task 관리
3. **학습 (Learning)**: 우측 사이드바 상단 → Books + FAQ + AI Q&A (ChatGPT, Gemini, Perplexity)
4. **멘토링 (Mentoring)**: 우측 사이드바 하단 → 써니에게 묻기 (CPA + 엑셀러레이터 자문)

**플랫폼 특징:**
- **실행이 핵심**: Order Sheet로 AI에게 실제 작업 시키기
- **관리로 체계화**: PROJECT SAL Grid로 무엇을 할지 계획
- **학습하며 성장**: Books + FAQ + AI Q&A (3개 AI 모델)로 지식 습득
- **멘토링으로 완성**: 비즈니스 자문까지 제공

### 1.2 문제 정의

**현재 프로젝트 관리 도구의 한계:**
- ❌ 기존 도구는 복잡하고 개발자 중심적
- ❌ 비개발자는 AI 도구를 활용하기 어려움
- ❌ 작업 간 의존성 파악이 어려움
- ❌ AI 연동이 수동적이고 비효율적

### 1.3 SSAL Works의 해결책

**✅ SAL 3D 그리드 시스템**
- X축(Stage), Y축(Area), Z축(Level)로 프로젝트 구조를 입체적으로 시각화
- 작업 의존성을 한눈에 파악

**✅ AI 자동화 연동**
- Order Sheet 시스템 (Orders/Outbox)
- Socket.io 실시간 알림으로 즉각 반응
- Claude Code, ChatGPT, Gemini 등 다양한 AI 도구 활용

**✅ 실시간 협업**
- Socket.io 기반 실시간 알림
- Supabase Realtime으로 DB 변경 즉시 반영 (예정)

**✅ 직관적 사용자 경험**
- 비개발자도 "프롬프팅"으로 프로젝트 관리
- AI를 운전하듯이 쉽게 활용

### 1.4 개발 철학

> **"나는 AI에게 프롬프팅을 하고 있는 것이다. 프롬프팅에 따라서 AI가 개발하는 것이다."**

- 비개발자도 AI를 운전하듯이 프로젝트를 관리
- 트랙터(AI)를 운전해서 밭(프로젝트)을 경작
- 노코드/로우코드가 아닌 **프롬프트 코딩**

---

## 2. 브랜드 정체성

### 2.1 브랜드 의미

- **S** (첫 번째): **Sunny** (써니) - 창작자의 닉네임
- **SAL**: **Stage-Area-Level** - 3D 그리드 시스템
- **Works**: **실행, 협업, 작업**

### 2.2 슬로건

> **"써니의 3차원 혁신, 모두를 위한 미래 협업 — SSAL Works"**

### 2.3 테마

**Organic Growth (유기적 성장)**
- 🌾 **Growth** (성장): 프로젝트가 자라나는 과정
- ☀️ **Warmth** (따뜻함): 비개발자도 접근 가능
- 💼 **Professional** (전문성): 신뢰할 수 있는 도구
- 🤝 **Trust** (신뢰): 팀원 간 협업 증진

**디자인 철학:**
- "Dark Mode" 개발자 도구 느낌 회피
- 밝고 친근한 색상 (Emerald Green, Amber Gold)
- 비개발자(Founders)를 타겟으로 한 UX

---

## 3. 홈 화면 11개 영역 구성 및 4대 핵심 기능

### 3.0 홈 화면 11개 영역 구조

**SSAL Works 홈 화면은 11개 영역으로 구성되어 있습니다.**

```
┌──────────────────────────────────────────────────────────┐
│  SSAL Works Dashboard - 11개 영역                        │
├──────────┬───────────────────────────────┬───────────────┤
│          │                               │               │
│   좌측   │        중앙 워크스페이스       │    우측       │
│ 사이드바 │                               │  사이드바     │
│ (3개 영역)│        (2개 영역)             │ (6개 영역)    │
│          │                               │               │
│ ① 📦 PROJECT   │ ④ Workspace (상단 75%)   │ ⑥ 📚 학습    │
│ ② 📊 진행      │    - Order Sheet 작성     │    콘텐츠    │
│    프로세스    │    - Orders/Outbox       │ ⑦ 🙋 FAQ     │
│ ③ 🔗 연계      │                          │ ⑧ 🔔 Claude  │
│    서비스      │ ⑤ Project SAL Grid       │    Code      │
│    바로가기    │    (하단 25%)            │    업데이트  │
│               │    - Task 관리            │ ⑨ 🤖 다른AI  │
│               │                          │    묻기      │
│               │                          │ ⑩ ☀️ Sunny   │
│               │                          │    묻기      │
│               │                          │ ⑪ 📢 공지    │
└──────────┴───────────────────────────────┴───────────────┘
```

**3개 부분으로 구성:**
- **좌측 사이드바**: 프로젝트 관리 및 탐색 (3개 영역)
- **중앙 워크스페이스**: 실행 및 관리 (2개 영역)
- **우측 사이드바**: 학습 및 지원 (6개 영역)

**핵심 철학: "머슬 메모리(Muscle Memory)의 외주화"**
- 기술적인 근육 기억은 AI에게 맡김
- 사용자는 "무엇을 만들 것인가"라는 기획과 지시에만 집중

---

## 4. 4대 핵심 기능 (Core Features)

### 4.1 실행 (Execution) - ④ Workspace + Order Sheet

**SSAL Works의 가장 핵심적인 기능입니다.**

**화면 위치:** ④ Workspace (중앙 워크스페이스 상단 75%)

**Order Sheet 시스템:**
```
Dashboard에서 Order Sheet 발행
    ↓
Orders/ 폴더에 JSON 저장 (Human_ClaudeCode_Bridge)
    ↓
Claude Code가 실제 코드 작성/수정
    ↓
Outbox/ 폴더에 결과 저장 (Web_ClaudeCode_Bridge)
    ↓
Dashboard에서 결과 확인
```

**🔔 실시간 Order Sheet 알림 시스템 (구현 완료: 2025-12-01)**

**시스템 구조:**
```
Dashboard (Order Sheet 생성)
    ↓
Orders/ 폴더 (JSON 파일 저장 - Human_ClaudeCode_Bridge)
    ↓
inbox_server.js (Node.js + Socket.io v4.7.2)
    - File Watcher로 Orders 폴더 감지
    - WebSocket으로 실시간 양방향 통신
    ↓
Dashboard (모든 클라이언트에 브로드캐스트)
    - 중앙 모달 팝업 (노란색 강조)
    - 자동 재연결 (최대 10회 시도)
```

**동작 흐름:**
1. Dashboard에서 Order Sheet 생성
2. JSON 파일이 `Human_ClaudeCode_Bridge/Orders/` 폴더에 저장됨
3. `inbox_server.js`의 file watcher가 새 파일 감지
4. Socket.io를 통해 'new-order' 이벤트 발생
5. 연결된 모든 클라이언트(Dashboard)에 실시간 브로드캐스트
6. Dashboard에서 중앙 모달 팝업으로 알림 표시

**주요 기능:**
- ✅ 실시간 양방향 통신 (WebSocket 기반)
- ✅ 자동 재연결 (연결 끊김 시 최대 10회 자동 재시도)
- ✅ 연결 상태 로깅 (연결/재연결/오류 콘솔 출력)
- ✅ 새 Order 알림 팝업 (중앙 모달, 노란색 강조)
- ✅ 팝업 외부 클릭 시 닫기
- ✅ modalZoomIn/Out 애니메이션 (0.3s)

**기술 스택:**
- Backend: Node.js + Socket.io v4.7.2
- Server: `inbox_server.js` (Port 3030)
- Protocol: WebSocket (실시간 양방향 통신)
- File Watching: Node.js `fs.watch()`

**지원 AI 도구:**
- **Claude Code**: 개발 자동화 (메인)
- ChatGPT: 코드 작성, 문서 생성
- Gemini: 코드 리뷰, 설계
- Perplexity: AI Q&A

**Workspace 역할:**
- Order Sheet 발행 → Claude Code에게 작업 지시
- 작업 결과 확인
- 프로젝트 실행의 중심 공간

### 4.2 관리 (Management) - ①②③ 좌측 사이드바 + ⑤ Project SAL Grid

**체계적인 프로젝트 Task 관리**

**화면 위치:**
- ①②③ 좌측 사이드바 (PROJECT, 진행 프로세스, 연계 서비스 바로가기)
- ⑤ Project SAL Grid (중앙 워크스페이스 하단 25%)

**PROJECT SAL Grid - SAL 3D 그리드 시스템:**

**3차원 프로젝트 구조:**
- **X축: Stage** (개발 단계)
  - Stage 1: 기획 → Stage 2: 설계 → Stage 3: 개발 → Stage 4: 테스트 → Stage 5: 배포
- **Y축: Area** (개발 영역)
  - O (DevOps), D (Database), BI (Backend Infrastructure)
  - BA (Backend APIs), F (Frontend), U (UI Components), M (Modals)
  - T (Test), E (E2E Test), C (CI/CD)
- **Z축: Level** (작업 단위)
  - 개별 Task (P1F1, P2BA3 등의 Task ID)

**시각화:**
- **2D 카드 뷰**: Task 카드를 Stage/Area별로 카드 형태로 표시
- **3D 블록 뷰**: 3차원 공간에서 프로젝트 전체 구조 시각화 (예정)

**좌측 사이드바 역할:**
- 프로젝트 목록 탐색
- 현재 프로젝트 진행 상황 확인
- Task 상태 관리 (To Do, In Progress, Done)
- PROJECT SAL Grid로 이동

### 4.3 학습 (Learning) - ⑥⑦⑧⑨ 우측 사이드바 상단

**프로젝트를 진행하면서 학습**

**화면 위치:** ⑥⑦⑧⑨ 우측 사이드바 상단

**영역 ⑥ 📚 학습용 콘텐츠:**
- Claude & Claude Code 사용법 (10편)
- 웹개발 기초지식 (추가 예정)
- 프로젝트 관리 가이드 (추가 예정)
- GitHub + Vercel 정적 파일 배포

**영역 ⑦ 🙋 FAQ:**
- SSAL Works 사용법 관련 자주 묻는 질문
- 프로젝트 등록, Order Sheet, 결제 관련 FAQ
- 빠른 문제 해결을 위한 Q&A 모음

**영역 ⑧ 🔔 Claude Code 업데이트:**
- Claude Code 최신 업데이트 및 릴리즈 노트
- 새로운 기능 소개
- 버그 수정 내역
- 사용법 가이드 링크

**영역 ⑨ 🤖 다른 AI에게 묻기:**
- **ChatGPT**: 일반적인 코딩 질문, 개념 설명
- **Gemini**: 코드 리뷰, 최적화 제안
- **Perplexity**: 웹 검색 기반 최신 정보 제공
- 크레딧 기반 과금 (동적 가격: API 원가 + 30% 마진)
- 실시간 답변 (3-5초)
- 질문/답변 이력 저장 (최대 50개, localStorage)

### 4.4 멘토링 (Mentoring) - ⑩⑪ 우측 사이드바 하단

**CPA + 엑셀러레이터의 비즈니스 자문 + 플랫폼 공지**

**화면 위치:** ⑩⑪ 우측 사이드바 하단

**영역 ⑩ ☀️ Sunny에게 묻기:**
- AI로 해결 안 되는 복잡한 비즈니스/기술 문제
- Supabase Realtime으로 실시간 알림
- 프로젝트별 맞춤 답변
- 평균 응답 시간: 24-48시간
- 공인회계사(CPA) + 엑셀러레이터(Accelerator)
- 사업 전략, 수익 모델, 시장 진입 등 자문
- 무제한 질문 가능 (플랫폼 이용료에 포함)
- "창업가의 러닝메이트(Running Mate)" 역할

**영역 ⑪ 📢 공지사항:**
- SSAL Works 새로운 기능, 업데이트, 이벤트
- 전체 화면 모달 뷰어
- 미확인 공지 알림 배지
- Markdown 렌더링
- 중요 공지사항 고정 (예정)

### 4.5 구독 관리

**구독 방식:**
- **설치비**: ₩3,000,000 (1회, 무통장 입금)
- **월 사용료**: ₩50,000/월 (4개월차부터, 1~3개월 무료)
- **3개월 챌린지**: 목표 달성 시 설치비 50% 환불 (₩1,500,000)

**포함 내용:**
- 프로젝트 관리 무제한
- PROJECT SAL Grid 사용
- Books 콘텐츠 무제한
- 써니에게 묻기 (비즈니스 자문)

**별도 충전:**
- AI 크레딧 (ChatGPT, Gemini, Perplexity 사용)
- 동적 가격: API 원가 + 30% 마진
- 매일 자동 가격 업데이트

**관리:**
- 관리자(Sunny) 수동 확인 후 승인
- 챌린지 목표 달성 여부 자동 검증

---

## 4. 기술 스택 요약

### 4.1 프론트엔드
```
Next.js 14 + React 18 + TypeScript + Tailwind CSS + Three.js
```

### 4.2 백엔드
```
Supabase (PostgreSQL + Auth + Realtime)
Socket.io 4.7.2 (Order Sheet 알림)
Node.js 20.x (inbox_server.js)
```

### 4.3 배포 & 인프라
```
Vercel (프론트엔드 + API)
Supabase (데이터베이스)
```

### 4.4 AI 연동
```
Claude Code (개발 자동화)
Perplexity API (AI Q&A)
```

**📄 상세 기술 스택:** `1-7_Tech_Stack/TECH_STACK.md`

---

## 5. 프로젝트 구조

### 5.1 Stage 구성

```
project-root/
├── P1_사업계획/              # Business Plan (GRID 범위 외)
├── P2_프로젝트_기획/          # Planning (GRID 범위 외) ← 현재 위치
├── P3_프로토타입_제작/        # Prototype (GRID 범위 외)
├── S1_개발_준비/              # Development Preparation (Stage 1)
├── S2_개발-1차/               # Development Phase 1 (Stage 2)
├── S3_개발-2차/               # Development Phase 2 (Stage 3)
├── S4_개발-3차/               # Development Phase 3 (Stage 4)
└── S5_개발_마무리/            # Development Stabilization (Stage 5)
```

### 5.2 기획 폴더 구조 (P2_프로젝트_기획/)

```
P2_프로젝트_기획/
├── 1-1_Project_Plan/         # 프로젝트 계획서 (이 문서)
├── 1-2_Requirements/         # 기능 요구사항
├── 1-3_User_Flows/           # 사용자 플로우
├── 1-4_Workflows/            # 워크플로우
├── 1-5_Design_System/        # 디자인 시스템
├── 1-6_UI_UX_Mockup/         # UI/UX 목업
└── 1-7_Tech_Stack/           # 기술 스택 명세
```

### 5.3 핵심 도구 폴더

```
.claude/                      # Claude Code 설정 및 가이드
Web_ClaudeCode_Bridge/        # Web ↔ Claude Code 브릿지
    └── Outbox/               # Claude Code → Dashboard
Human_ClaudeCode_Bridge/      # Human ↔ Claude Code 브릿지
    └── Orders/               # Dashboard → Claude Code
Project-SSAL-Grid/            # PROJECT SAL GRID 관리
Development_Process_Monitor/        # 사이드바 프로세스 도구
```

**📄 전체 구조:** `PROJECT_DIRECTORY_STRUCTURE.md` (루트)

---

## 6. 주요 문서 맵

### 6.1 기획 단계 문서 (P2_프로젝트_기획/)

| 문서 | 경로 | 용도 |
|------|------|------|
| **프로젝트 계획** | `1-1_Project_Plan/PROJECT_PLAN.md` | **이 문서** - 종합 개요 |
| **기능 요구사항** | `1-2_Requirements/functional_requirements.md` | 모든 기능 상세 명세 (FR-XXX-NNN) |
| **사용자 플로우** | `1-3_User_Flows/` | 사용자 시나리오 및 여정 |
| **워크플로우** | `1-4_Workflows/` | 업무 흐름도 |
| - Admin Operations | `1-4_Workflows/Admin_Operations_Workflow.md` | 관리자 일일/주간/월간 업무 |
| - System Automation | `1-4_Workflows/System_Automation_Workflow.md` | 자동화 및 Cron Jobs |
| - Integrated Journey | `1-4_Workflows/Integrated_Journey.md` | 사용자 여정 통합 |
| - Admin Dashboard Features | `1-4_Workflows/Admin_Dashboard_Features.md` | Admin 14개 섹션 상세 |
| **디자인 시스템** | `1-5_Design_System/DESIGN_SYSTEM_V2.md` | 컬러, 타이포, 컴포넌트 스펙 |
| **UI/UX 목업** | `1-6_UI_UX_Mockup/` | 화면 설계 |
| **기술 스택** | `1-7_Tech_Stack/TECH_STACK.md` | 모든 기술 스택 및 버전 명세 |

### 6.2 프로젝트 전체 문서 (루트)

| 문서 | 경로 | 용도 |
|------|------|------|
| **디렉토리 구조** | `PROJECT_DIRECTORY_STRUCTURE.md` | 전체 폴더 구조 및 설명 |
| **프로젝트 상태** | `PROJECT_STATUS.md` | 진행 현황 및 완료/진행/예정 |
| **Claude 가이드** | `.claude/CLAUDE.md` | AI 작업 규칙 및 원칙 |
| **README** | `README.md` | 프로젝트 소개 |

---

## 7. 빠른 시작 가이드

### 7.1 문서 읽는 순서 (신규 팀원)

**추천 순서:**

1. ✅ **PROJECT_PLAN.md** (이 문서) - 5분
   - 프로젝트가 무엇인지, 왜 만드는지 전체 개요 파악

2. 📖 **functional_requirements.md** - 20분
   - 어떤 기능들이 있는지 상세히 이해

3. 🎨 **DESIGN_SYSTEM_V2.md** - 10분
   - 디자인 가이드라인 (컬러, 폰트, 컴포넌트)

4. 🔧 **TECH_STACK.md** - 10분
   - 사용할 기술들 및 버전

5. 📂 **PROJECT_DIRECTORY_STRUCTURE.md** - 10분
   - 파일을 어디에 저장하는지

6. 🤖 **.claude/CLAUDE.md** - 15분
   - Claude Code와 작업할 때 규칙

**총 소요 시간:** 약 70분

### 7.2 개발 시작 전 체크리스트

**환경 설정:**
- [ ] Node.js 20.x 설치 (`node --version`)
- [ ] Git 설정 (`git config --global user.name`)
- [ ] VS Code 설치 (권장)
- [ ] Claude Code CLI 설치

**프로젝트 설정:**
- [ ] 프로젝트 클론 또는 생성
- [ ] `npm install` (의존성 설치)
- [ ] `.env` 파일 생성 (`.env.example` 참고)
- [ ] Supabase 프로젝트 생성 및 연결

**문서 읽기:**
- [ ] `.claude/CLAUDE.md` 읽기 (필수!)
- [ ] `PROJECT_DIRECTORY_STRUCTURE.md` 읽기
- [ ] 담당 Area 관련 문서 읽기

**준비 완료!**
- [ ] `npm run dev` 실행하여 로컬 서버 확인
- [ ] Claude Code 세션 시작 (`claude`)

### 7.3 자주 찾는 정보

**"어디에 파일을 저장해야 하나요?"**
→ `PROJECT_DIRECTORY_STRUCTURE.md` 참고

**"어떤 기능을 만들어야 하나요?"**
→ `functional_requirements.md` 참고

**"디자인은 어떻게 해야 하나요?"**
→ `DESIGN_SYSTEM_V2.md` 참고

**"어떤 기술을 사용해야 하나요?"**
→ `TECH_STACK.md` 참고

**"현재 진행 상황은?"**
→ `PROJECT_STATUS.md` (루트) 참고

**"Claude Code와 어떻게 작업하나요?"**
→ `.claude/CLAUDE.md` 참고

---

## 8. 연락처 & 지원

### 8.1 프로젝트 관리

- **프로젝트 관리자**: Sunny (써니)
- **웹사이트**: https://ssalworks.world
- **이메일**: support@ssalworks.world

### 8.2 문의

- **일반 문의**: 웹사이트 "써니에게 묻기"
- **긴급 문의**: 이메일 직접 연락

---

## 9. 라이선스

Copyright © 2025 SSAL Works (써니쌀웍스). All rights reserved.

---

## 10. 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| v2.0 | 2025-12-01 | 대폭 개편 (종합 개요서로 재정의, 중복 제거) |
| v1.0 | 2025-11-14 | 초안 작성 |

---

**"써니의 특별한 3D 프로젝트, 모두와 함께 만드는 협업 플랫폼, SSAL Works"**
