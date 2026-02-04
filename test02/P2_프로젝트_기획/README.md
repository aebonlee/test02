# P2_프로젝트_기획 폴더 가이드

> **작성일**: 2025-12-01
> **용도**: 프로젝트 기획 문서 작성 가이드 및 순서 안내
> **대상**: 기획자, PM, 신규 팀원

---

## 📋 목차

1. [폴더 개요](#1-폴더-개요)
2. [문서 작성 순서](#2-문서-작성-순서)
3. [각 폴더 설명](#3-각-폴더-설명)
4. [작성 가이드](#4-작성-가이드)
5. [주의사항](#5-주의사항)

---

## 1. 폴더 개요

**P2_프로젝트_기획/** 폴더는 프로젝트의 **기획 단계** 문서를 모두 포함합니다.

### 폴더 구조

```
P2_프로젝트_기획/
├── README.md                  # 이 문서 (작성 가이드)
├── 1-1_Project_Plan/          # 프로젝트 계획서
├── 1-2_User_Flows/            # 사용자 플로우
├── 1-3_Requirements/          # 기능 요구사항
├── 1-4_Workflows/             # 워크플로우
├── 1-5_Design_System/         # 디자인 시스템
├── 1-6_UI_UX_Mockup/          # UI/UX 목업
└── 1-7_Tech_Stack/            # 기술 스택
```

**폴더 개수**: 7개 (1-1 ~ 1-7)

---

## 2. 문서 작성 순서

### 🎯 **왜 이 순서인가?**

**기획 문서는 "큰 그림 → 사용자 관점 → 시스템 관점 → 구현 방법" 순서로 작성합니다.**

```
전체 방향 → 사용자 시나리오 → 기능 분해 → 시스템 처리 → 디자인 → 화면 → 기술
```

---

### 📝 **단계별 작성 순서**

#### **1단계: 1-1_Project_Plan/ (프로젝트 계획)**

**목적**: 프로젝트의 전체 방향을 정의

**작성 내용**:
- 프로젝트 비전 (What & Why)
- 브랜드 정체성
- 핵심 기능 요약
- 프로젝트 구조
- 문서 맵 (다른 문서로의 링크)

**주요 질문**:
- 우리는 무엇을 만드는가?
- 왜 만드는가?
- 누구를 위한 것인가?
- 어떤 가치를 제공하는가?

**산출물**:
- `PROJECT_PLAN.md` (종합 개요서)
- `PROJECT_DIRECTORY_STRUCTURE.md` (디렉토리 구조)

**소요 시간**: 1-2일

---

#### **2단계: 1-2_User_Flows/ (사용자 플로우)**

**목적**: 사용자가 무엇을 하는지 시나리오로 정의

**작성 내용**:
- 회원가입 플로우
- 로그인 플로우
- 구독 플로우
- 프로젝트 생성 플로우
- AI 연동 플로우
- Books 학습 플로우
- AI Q&A 플로우
- 써니에게 묻기 플로우

**주요 질문**:
- 사용자가 어떤 행동을 하는가?
- 각 단계에서 무엇을 보는가?
- 성공/실패 시나리오는?
- 예외 상황은 어떻게 처리하는가?

**형식**:
- 플로우차트 (Mermaid 또는 ASCII)
- 시나리오 설명
- 스크린샷 참조

**산출물**:
- `1_signup_flow.md`
- `2_subscription_flow.md`
- `3_project_creation_flow.md`
- `4_ai_integration_flow.md`
- `5_books_learning_flow.md`
- `6_ai_qa_flow.md`
- `7_support_flow.md`

**소요 시간**: 2-3일

**📌 중요**: User Flows가 먼저 작성되어야 Requirements를 정확히 도출할 수 있습니다!

---

#### **3단계: 1-3_Requirements/ (기능 요구사항)**

**목적**: User Flows를 기능으로 분해하고 상세 명세 작성

**작성 내용**:
- 기능 요구사항 (Functional Requirements)
- 비기능 요구사항 (Non-Functional Requirements)
- FR ID (FR-AUTH-001, FR-SUB-001 등)
- 입력/처리/출력/예외 처리
- DB 스키마
- API 엔드포인트 (간략)

**주요 질문**:
- 각 User Flow를 구현하려면 어떤 기능이 필요한가?
- 입력은 무엇인가?
- 어떻게 처리하는가?
- 출력은 무엇인가?
- 예외는 어떻게 처리하는가?

**형식**:
- FR ID 명명 규칙: `FR-[CATEGORY]-[NUMBER]`
- 예: `FR-AUTH-001`, `FR-SUB-002`

**산출물**:
- `functional_requirements.md` (1,000줄+ 상세 명세)

**소요 시간**: 5-7일

**📌 핵심**: 이 문서가 개발자가 구현할 기능의 바이블입니다!

---

#### **4단계: 1-4_Workflows/ (워크플로우)**

**목적**: 시스템이 어떻게 처리하는지 내부 로직 정의

**작성 내용**:
- 프로세스 워크플로우
- 시스템 처리 흐름
- DB 트랜잭션
- API 호출 순서
- 이메일 발송 로직
- 결제 처리 프로세스

**주요 질문**:
- 시스템이 어떻게 동작하는가?
- DB는 어떻게 업데이트되는가?
- 외부 API는 언제 호출되는가?
- 트랜잭션은 어떻게 관리하는가?

**차이점**:
- **User Flows**: 사용자 관점 ("사용자가 버튼을 클릭한다")
- **Workflows**: 시스템 관점 ("DB에 INSERT 쿼리 실행")

**산출물**:
- `process_workflow.md`
- `ssalworks_complete_process.md`
- `website_development_process.md`

**소요 시간**: 3-4일

---

#### **5단계: 1-5_Design_System/ (디자인 시스템)**

**목적**: 일관된 디자인 가이드라인 정의

**작성 내용**:
- 컬러 팔레트 (Primary, Secondary, Neutral)
- 타이포그래피 (폰트, 크기, 굵기)
- 스페이싱 & 레이아웃 (그리드, 여백)
- 컴포넌트 스펙 (버튼, 카드, 모달, 입력 등)
- 애니메이션 (keyframes)
- 아이콘
- 반응형 Breakpoints
- 접근성 (Accessibility)

**주요 질문**:
- 브랜드 컬러는?
- 어떤 폰트를 사용하는가?
- 버튼은 어떻게 생겼는가?
- 모달은 어떤 스타일인가?

**산출물**:
- `DESIGN_SYSTEM_V2.md` (300줄+ 완전 명세)

**소요 시간**: 2-3일

**📌 중요**: 디자이너와 프론트엔드 개발자가 함께 작성합니다!

---

#### **6단계: 1-6_UI_UX_Mockup/ (UI/UX 목업)**

**목적**: 실제 화면 설계

**작성 내용**:
- 와이어프레임
- 목업 (Figma, Sketch 또는 HTML)
- 화면 구조 설명
- 인터랙션 정의

**주요 질문**:
- 실제 화면은 어떻게 생겼는가?
- 버튼 위치는?
- 폼 필드는 어디에?
- 모바일에서는 어떻게 보이는가?

**산출물**:
- `dashboard-mockup.html`
- `admin-dashboard.html`
- `manual.html`
- `ADMIN_DASHBOARD_설계.md`
- `website_layout_structure.md`

**소요 시간**: 3-5일

---

#### **7단계: 1-7_Tech_Stack/ (기술 스택)**

**목적**: 구현에 사용할 기술 및 버전 명세

**작성 내용**:
- 프론트엔드 기술 (Next.js, React, TypeScript 등)
- 백엔드 기술 (Supabase, Socket.io, Node.js 등)
- AI 연동 (Perplexity, Claude Code 등)
- 데이터베이스 (PostgreSQL)
- 배포 & 인프라 (Vercel, Supabase)
- 개발 도구 (ESLint, Prettier, Jest 등)
- 환경 변수
- 버전 정책

**주요 질문**:
- 어떤 기술을 사용하는가?
- 왜 이 기술을 선택했는가?
- 버전은?
- 의존성은?

**산출물**:
- `TECH_STACK.md` (500줄+ 상세 명세)

**소요 시간**: 1-2일

**📌 중요**: 기술 스택은 Requirements를 보고 결정합니다!

---

## 3. 각 폴더 설명

### 1-1_Project_Plan/ (프로젝트 계획)

**역할**: 종합 개요서 + 문서 허브

**주요 파일**:
- `PROJECT_PLAN.md` - 5분 안에 프로젝트 전체 파악
- `PROJECT_DIRECTORY_STRUCTURE.md` - 전체 폴더 구조

**읽는 대상**: 신규 팀원, 투자자, 협력자

**읽는 시간**: 5분

---

### 1-2_User_Flows/ (사용자 플로우)

**역할**: 사용자 시나리오 정의

**주요 파일**:
- `1_signup_flow.md` - 회원가입
- `2_subscription_flow.md` - 구독
- `3_project_creation_flow.md` - 프로젝트 생성
- `4_ai_integration_flow.md` - AI 연동
- `5_books_learning_flow.md` - Books 학습
- `6_ai_qa_flow.md` - AI Q&A
- `7_support_flow.md` - 써니에게 묻기

**읽는 대상**: 기획자, 디자이너, UX 설계자

**읽는 시간**: 각 5-10분

---

### 1-3_Requirements/ (기능 요구사항)

**역할**: 모든 기능 상세 명세 (개발자 바이블)

**주요 파일**:
- `functional_requirements.md` - 1,134줄 상세 명세

**FR ID 예시**:
- `FR-AUTH-001` - 회원가입
- `FR-SUB-001` - 구독 신청
- `FR-GRID-001` - 그리드 뷰어
- `FR-NOTIFY-001` - Socket.io 실시간 알림

**읽는 대상**: 개발자, QA 엔지니어

**읽는 시간**: 20-30분

---

### 1-4_Workflows/ (워크플로우)

**역할**: 시스템 처리 로직 정의

**주요 파일**:
- `process_workflow.md` - 프로세스 워크플로우
- `ssalworks_complete_process.md` - 전체 프로세스
- `website_development_process.md` - 웹사이트 개발 프로세스

**읽는 대상**: 백엔드 개발자, 시스템 설계자

**읽는 시간**: 각 10-15분

---

### 1-5_Design_System/ (디자인 시스템)

**역할**: 디자인 가이드라인

**주요 파일**:
- `DESIGN_SYSTEM_V2.md` - 325줄 완전 명세

**주요 내용**:
- 컬러 (Emerald Green, Amber Gold)
- 폰트 (Pretendard)
- 컴포넌트 (버튼, 카드, 모달 등 12개)
- 애니메이션 (modalZoomIn/Out 등)

**읽는 대상**: 디자이너, 프론트엔드 개발자

**읽는 시간**: 10분

---

### 1-6_UI_UX_Mockup/ (UI/UX 목업)

**역할**: 실제 화면 설계

**주요 파일**:
- `dashboard-mockup.html` - 대시보드 목업
- `admin-dashboard.html` - 관리자 대시보드
- `ADMIN_DASHBOARD_설계.md` - 관리자 화면 설계

**읽는 대상**: 디자이너, 프론트엔드 개발자

**읽는 시간**: HTML 실행하여 확인

---

### 1-7_Tech_Stack/ (기술 스택)

**역할**: 기술 및 버전 명세

**주요 파일**:
- `TECH_STACK.md` - 539줄 상세 명세

**주요 내용**:
- 프론트엔드 (Next.js 14, React 18, TypeScript 5)
- 백엔드 (Supabase, Socket.io 4.7.2, Node.js 20)
- AI 연동 (Perplexity, Claude Code)
- 환경 변수

**읽는 대상**: 개발자, DevOps

**읽는 시간**: 10분

---

## 4. 작성 가이드

### 📌 **일반 원칙**

#### 1. **순서대로 작성**

```
❌ 잘못된 순서:
Tech Stack → UI Mockup → Requirements → User Flows

✅ 올바른 순서:
Project Plan → User Flows → Requirements → Workflows → Design System → UI Mockup → Tech Stack
```

**이유**:
- 큰 그림 없이 세부 사항을 정하면 나중에 전체를 갈아엎어야 함
- 사용자 시나리오 없이 기능을 정의하면 불필요한 기능 추가됨
- 화면 설계 없이 기술을 선택하면 나중에 기술 변경 필요

---

#### 2. **반복적 개선 (Agile)**

```
1차: Project Plan → User Flows → Requirements (간략)
      ↓
    개발 시작
      ↓
2차: Requirements 보완 → Workflows 추가 → Design System 확정
      ↓
    프로토타입 제작
      ↓
3차: UI Mockup 보완 → Tech Stack 확정
```

**이유**:
- 모든 문서를 완벽하게 작성할 필요 없음
- 개발하면서 발견되는 것들을 문서에 반영
- 반복적으로 개선하는 것이 실무

---

#### 3. **문서 간 연결**

각 문서는 다른 문서를 참조해야 합니다.

**예시 (Requirements에서 User Flow 참조):**

```markdown
**기능 ID:** FR-AUTH-001

**설명:** 신규 사용자가 회원가입

**User Flow 참조:** `1-2_User_Flows/1_signup_flow.md`

**입력:**
- 이메일 (필수)
- 비밀번호 (필수, 8자 이상)
```

---

#### 4. **명명 규칙**

**폴더명:**
- `1-X_CamelCase_Name/` 형식
- 예: `1-2_User_Flows/`, `1-3_Requirements/`

**파일명:**
- `snake_case.md` 또는 `UPPER_CASE.md`
- 예: `functional_requirements.md`, `DESIGN_SYSTEM_V2.md`

**FR ID:**
- `FR-[CATEGORY]-[NUMBER]`
- 예: `FR-AUTH-001`, `FR-SUB-002`

---

### 📌 **각 문서 작성 팁**

#### **User Flows 작성 팁**

**구조:**
```markdown
# 회원가입 플로우

## 1. 개요
- 목적: 신규 사용자 계정 생성
- 시작: 메인 페이지
- 종료: 대시보드 진입

## 2. 정상 플로우
1. 메인 페이지 진입
2. "회원가입" 버튼 클릭
3. 이메일 입력
4. 비밀번호 입력
5. 비밀번호 확인
6. "가입하기" 버튼 클릭
7. 이메일 인증 메일 발송
8. 이메일 인증 링크 클릭
9. 대시보드 진입

## 3. 예외 플로우
- 이메일 중복: "이미 가입된 이메일입니다" 표시
- 약한 비밀번호: "8자 이상 필요" 표시

## 4. 플로우 다이어그램
[Mermaid 또는 ASCII 다이어그램]
```

---

#### **Requirements 작성 팁**

**구조:**
```markdown
**기능 ID:** FR-AUTH-001

**설명:** 신규 사용자가 이메일과 비밀번호로 계정 생성

**User Flow 참조:** `1-2_User_Flows/1_signup_flow.md`

**우선순위:** P0 (Critical)

**의존성:** 없음

**입력:**
- 이메일 (필수, 이메일 형식)
- 비밀번호 (필수, 8자 이상)
- 비밀번호 확인 (필수)

**처리:**
1. 이메일 중복 검증
2. 비밀번호 강도 검증
3. Supabase Auth에 사용자 등록
4. `users` 테이블에 프로필 생성

**출력:**
- 성공: 이메일 인증 안내 페이지
- 실패: 오류 메시지

**예외 처리:**
- 이메일 중복: "이미 가입된 이메일입니다"
- 약한 비밀번호: "8자 이상, 영문+숫자 조합 필요"

**성공 기준:**
- 회원가입 성공률 > 95%
- 응답 시간 < 500ms
```

---

## 5. 주의사항

### ❌ **하지 말아야 할 것**

#### 1. **순서 무시**

```
❌ Tech Stack부터 작성
❌ UI Mockup부터 작성
❌ Requirements 없이 개발 시작
```

**결과**: 나중에 전체를 갈아엎어야 함

---

#### 2. **문서 간 연결 부족**

```
❌ User Flows와 Requirements가 별개
❌ Requirements와 Workflows가 불일치
❌ Design System과 UI Mockup이 다름
```

**결과**: 문서 신뢰성 하락, 개발 혼란

---

#### 3. **과도한 완벽주의**

```
❌ 모든 문서를 100% 완벽하게 작성 후 개발 시작
❌ 세부 사항까지 전부 정의 후 진행
```

**결과**: 개발 시작 지연, 변경 시 문서 갈아엎기

**올바른 접근:**
- 70-80% 작성 후 개발 시작
- 개발하면서 발견되는 것들을 문서에 반영
- 반복적 개선

---

#### 4. **중복 작성**

```
❌ PROJECT_PLAN.md에 모든 것 다 쓰기
❌ Requirements에 디자인 상세 포함
❌ Tech Stack을 여러 문서에 중복
```

**결과**: 문서 업데이트 시 여러 곳 수정 필요, 일관성 유지 어려움

**올바른 접근:**
- 각 문서는 자기 역할에만 충실
- 다른 문서는 링크로 참조
- Single Source of Truth

---

### ✅ **해야 할 것**

#### 1. **문서 간 일관성 유지**

```
✅ User Flow의 단계 → Requirements의 FR로 매핑
✅ Requirements의 기능 → Workflows의 처리 로직으로 매핑
✅ Design System의 컴포넌트 → UI Mockup에서 사용
```

---

#### 2. **버전 관리**

```
✅ 각 문서에 버전 히스토리 추가
✅ 주요 변경 시 버전 업
✅ Git 커밋 메시지에 문서 변경 내역 명시
```

**예시:**
```markdown
## 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| v2.0 | 2025-12-01 | Socket.io 실시간 알림 추가 |
| v1.0 | 2025-11-14 | 초안 작성 |
```

---

#### 3. **정기적 검토**

```
✅ 월 1회 모든 문서 검토
✅ 개발 진행 중 문서와 실제 불일치 발견 시 즉시 수정
✅ Phase 전환 시 문서 전체 리뷰
```

---

## 6. 자주 묻는 질문 (FAQ)

### Q1. User Flows 없이 Requirements를 먼저 작성하면 안 되나요?

**A**: 가능하지만 비효율적입니다.

**이유**:
- User Flows 없이 Requirements를 작성하면 **불필요한 기능**이 추가됨
- 사용자가 실제로 필요로 하지 않는 기능을 구현하게 됨
- 나중에 User Flows를 작성하면 Requirements를 다시 갈아엎어야 함

**권장**: User Flows를 먼저 작성하고, 그것을 기반으로 Requirements를 도출

---

### Q2. 모든 문서를 완벽하게 작성 후 개발을 시작해야 하나요?

**A**: 아니요. 70-80% 작성 후 개발을 시작하세요.

**이유**:
- 개발하면서 발견되는 것들이 많음
- 완벽한 문서는 존재하지 않음
- 반복적 개선이 실무

**권장 접근**:
1. Project Plan → User Flows → Requirements (70%) 작성
2. 개발 시작 (프로토타입)
3. 개발 중 발견된 것들을 문서에 반영
4. Workflows, Design System, UI Mockup 보완
5. Tech Stack 확정

---

### Q3. 문서가 너무 방대한데, 간략하게 작성하면 안 되나요?

**A**: 문서 유형에 따라 다릅니다.

**간략하게 작성해도 되는 문서**:
- Project Plan (종합 개요)
- User Flows (플로우차트 중심)
- Design System (핵심만)

**상세하게 작성해야 하는 문서**:
- Requirements (개발자 바이블)
- Workflows (시스템 로직)
- Tech Stack (버전, 의존성)

**이유**: Requirements가 부실하면 개발자가 혼란스러워하고 재작업 발생

---

### Q4. 문서 작성에 시간이 너무 오래 걸리는데요?

**A**: 처음에는 시간이 걸리지만, 장기적으로는 시간 절약입니다.

**문서 작성 시간 vs 재작업 시간**:
```
문서 작성 시간: 10일
재작업 없는 개발: 30일
---
총 40일

문서 없이 개발: 0일
재작업 발생: 50일 (2번 이상 갈아엎기)
---
총 50일+
```

**권장**: 초기에 충분한 시간을 투자하세요.

---

### Q5. 혼자 개발하는데도 이렇게 문서를 다 작성해야 하나요?

**A**: 혼자 개발해도 문서는 필수입니다.

**이유**:
- 6개월 후 자신의 코드도 이해 못 함
- 문서 없이 개발하면 나중에 유지보수 불가능
- 팀원이 늘어날 때 문서가 없으면 온보딩 불가능

**최소한 작성할 문서**:
1. Project Plan (전체 방향)
2. Requirements (기능 명세)
3. Tech Stack (기술 및 버전)

**나머지는 필요 시 작성**

---

## 7. 체크리스트

### 📋 **문서 작성 완료 체크리스트**

#### **1-1_Project_Plan/**
- [ ] PROJECT_PLAN.md 작성 (종합 개요)
- [ ] PROJECT_DIRECTORY_STRUCTURE.md 작성 (디렉토리 구조)

#### **1-2_User_Flows/**
- [ ] 회원가입 플로우
- [ ] 구독 플로우
- [ ] 프로젝트 생성 플로우
- [ ] AI 연동 플로우
- [ ] Books 학습 플로우
- [ ] AI Q&A 플로우
- [ ] 써니에게 묻기 플로우

#### **1-3_Requirements/**
- [ ] functional_requirements.md 작성 (FR-XXX-NNN)
- [ ] 비기능 요구사항 포함 (NFR-X)
- [ ] 완료 조건 (DoD) 명시

#### **1-4_Workflows/**
- [ ] 프로세스 워크플로우
- [ ] 시스템 처리 로직
- [ ] DB 트랜잭션 흐름

#### **1-5_Design_System/**
- [ ] DESIGN_SYSTEM_V2.md 작성
- [ ] 컬러 팔레트 정의
- [ ] 컴포넌트 스펙 정의
- [ ] 애니메이션 정의

#### **1-6_UI_UX_Mockup/**
- [ ] 와이어프레임 작성
- [ ] 목업 (HTML 또는 Figma) 작성
- [ ] 화면 구조 문서 작성

#### **1-7_Tech_Stack/**
- [ ] TECH_STACK.md 작성
- [ ] 프론트엔드 기술 명시
- [ ] 백엔드 기술 명시
- [ ] 환경 변수 명시

---

## 8. 참고 자료

### 📚 **추가 학습 자료**

**기획 방법론**:
- User Story Mapping
- Jobs to be Done (JTBD)
- Design Thinking

**문서 작성 도구**:
- Markdown (문서 작성)
- Mermaid (플로우차트)
- Figma (UI 목업)
- Draw.io (다이어그램)

**참고 문서**:
- `.claude/CLAUDE.md` - AI 작업 가이드
- `PROJECT_STATUS.md` - 프로젝트 진행 상황
- `PROJECT_DIRECTORY_STRUCTURE.md` - 전체 디렉토리 구조

---

## 9. 문서 관리 규칙

### 📌 **업데이트 규칙**

1. **문서 수정 시 버전 히스토리 업데이트**
2. **주요 변경 시 관련 문서 모두 업데이트**
3. **월 1회 정기 검토**
4. **Phase 전환 시 전체 리뷰**

### 📌 **문서 소유자**

- Project Plan: PM
- User Flows: UX 설계자, 기획자
- Requirements: 기획자, PM
- Workflows: 시스템 설계자, 백엔드 개발자
- Design System: 디자이너
- UI/UX Mockup: 디자이너, UX 설계자
- Tech Stack: CTO, 리드 개발자

---

## 10. 마무리

**이 폴더의 문서들은 프로젝트의 "설계도"입니다.**

건축에서 설계도 없이 집을 지을 수 없듯이,
소프트웨어도 기획 문서 없이 개발하면 실패합니다.

**시간을 충분히 투자하여 문서를 작성하세요.**
**그것이 가장 빠른 길입니다.**

---

**"제대로 기획하는 것이 가장 빠른 개발입니다."**
