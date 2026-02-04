# User Flow #6: 개발 프로세스 전체 여정 (사업계획 → 배포)

> **최종 수정:** 2025-12-03
> **버전:** 1.0 (초안)
> **목적:** 프로젝트 등록 이후 전체 개발 프로세스 안내 (Order Sheet 템플릿 연계)

---

## 📋 목차

1. [플로우 개요](#1-플로우-개요)
2. [전체 프로세스 구조](#2-전체-프로세스-구조)
3. [준비 단계 (○) - 병렬 진행](#3-준비-단계--병렬-진행)
4. [특별 단계 (☆) - 자동화](#4-특별-단계--자동화)
5. [실행 단계 (S1-S5) - 순차 진행](#5-실행-단계-s1-s5--순차-진행)
6. [Order Sheet 템플릿 연계](#6-order-sheet-템플릿-연계)
7. [Workspace UI 스펙](#7-workspace-ui-스펙)

---

## 1. 플로우 개요

### 1.1 정의

**User Flow #6**은 프로젝트 등록(User Flow #2) 완료 이후, 실제 웹사이트 개발을 시작하여 배포까지 완료하는 **전체 개발 여정**입니다.

**핵심 특징:**
- 좌측 사이드바의 **프로세스 영역**과 완벽히 연동
- 각 단계마다 **Order Sheet 템플릿** 자동 제공
- Workspace에서 템플릿 기반 작업 지시
- Claude Code와의 원활한 협업

### 1.2 전제 조건

- ✅ 회원가입 완료 (User Flow #1)
- ✅ 프로젝트 등록 완료 (User Flow #2)
- ✅ 설치비 납부 완료
- ✅ Dashboard 진입 및 프로젝트 선택

### 1.3 시작/종료

**시작:** 프로젝트 등록 후 "사용 안내" 팝업 확인
**종료:** 웹사이트 배포 완료 및 프로젝트 완료 표시
**예상 소요 기간:** 프로젝트 규모에 따라 2주 ~ 3개월

---

## 2. 전체 프로세스 구조

### 2.1 좌측 사이드바 프로세스 영역 구조

```
┌─────────────────────────────────────┐
│ 📊 프로세스                         │
├─────────────────────────────────────┤
│                                     │
│ ☆ 작업 디렉토리 구조 생성           │
│                                     │
│ ○ 사업계획                          │
│   ├─ 0-1 시장조사                   │
│   ├─ 0-2 경쟁분석                   │
│   └─ 0-3 사업계획서                 │
│                                     │
│ ○ 프로젝트 기획                     │
│   ├─ 1-1 Project Plan               │
│   ├─ 1-2 Requirements               │
│   ├─ 1-3 Architecture               │
│   ├─ 1-4 UI/UX                      │
│   ├─ 1-5 DB Design                  │
│   └─ 1-6 API Design                 │
│                                     │
│ ☆ PROJECT SAL Grid 생성             │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│ S1. 개발 준비                       │
│   ├─ Vercel 설정                    │
│   ├─ 환경변수                       │
│   └─ 도메인 연결                    │
│                                     │
│ S2. 개발 1차                        │
│   ├─ OAuth                          │
│   ├─ 이메일                         │
│   └─ 회원가입                       │
│                                     │
│ S3. 개발 2차                        │
│   ├─ AI 연동                        │
│   ├─ 구독 권한                      │
│   └─ AI Q&A UI                      │
│                                     │
│ S4. 개발 3차                        │
│   ├─ 결제                           │
│   ├─ 관리자 대시보드                │
│   └─ 크레딧                         │
│                                     │
│ S5. 개발 마무리                     │
│   ├─ 프로덕션 배포                  │
│   ├─ QA                             │
│   └─ 안정화                         │
│                                     │
└─────────────────────────────────────┘
```

### 2.2 3단계 분류

| 단계 기호 | 명칭 | 진행 방식 | 특징 |
|----------|------|----------|------|
| **☆** | 특별 단계 | 자동화/필수 | 디렉토리 구조 생성, Grid 생성 |
| **○** | 준비 단계 | 병렬 진행 가능 | 사업계획, 프로젝트 기획 |
| **S1~S5** | 실행 단계 | 순차 진행 필수 | 실제 개발 및 배포 |

---

## 3. 준비 단계 (○) - 병렬 진행

### 3.1 사업계획 (○)

**목적:** 비즈니스 전략 수립

#### Step 1: 좌측 사이드바에서 "○ 사업계획" 클릭

**화면:**
```
○ 사업계획 (확장됨)
  ├─ 0-1 시장조사 ⚪ (대기)
  ├─ 0-2 경쟁분석 ⚪ (대기)
  └─ 0-3 사업계획서 ⚪ (대기)
```

#### Step 2: "0-1 시장조사" 클릭

**Workspace 변화:**

```
┌─────────────────────────────────────────────────────────┐
│ 🛠️ Workspace - Order Sheet 작성                         │
├─────────────────────────────────────────────────────────┤
│ 선택된 작업: 0-1 시장조사                               │
│                                                         │
│ [템플릿 자동 로드됨]                                    │
│                                                         │
│ Order Sheet 내용:                                       │
│ ┌─────────────────────────────────────────────────────┐│
│ │ # 시장조사 Order Sheet                             ││
│ │                                                     ││
│ │ ## 목표                                             ││
│ │ [사업 아이템]에 대한 시장 조사를 수행하고,         ││
│ │ 시장 규모, 트렌드, 고객 니즈를 분석하여           ││
│ │ 보고서를 작성해주세요.                             ││
│ │                                                     ││
│ │ ## 조사 항목                                        ││
│ │ 1. 시장 규모 (TAM, SAM, SOM)                       ││
│ │ 2. 시장 트렌드 분석                                ││
│ │ 3. 타겟 고객 프로필                                ││
│ │ 4. 고객 Pain Points                                ││
│ │ 5. 시장 성장 가능성                                ││
│ │                                                     ││
│ │ ## 사용자 수정 영역 (여기를 수정하세요)            ││
│ │ 사업 아이템: [여기에 입력]                         ││
│ │ 타겟 시장: [여기에 입력]                           ││
│ │                                                     ││
│ │ ## 예상 결과물                                      ││
│ │ - 시장조사_보고서.md                               ││
│ │ - 시장_데이터_분석.xlsx (선택)                     ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ [Order Sheet 수정하기] [Order Sheet 발행]              │
│                                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                         │
│ Order 진행 상황: 대기 중                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Order Sheet 템플릿 경로:**
`Briefings_OrderSheets/OrderSheet_Templates/준비단계_○/사업계획/Market_Analysis.md`

#### Step 3: 사용자가 템플릿 수정

**수정 예시:**
```markdown
## 사용자 수정 영역
사업 아이템: 개발자 포트폴리오 제작 플랫폼
타겟 시장: 국내 주니어 개발자 및 취업 준비생 (20-30대)

추가 요청사항:
- 경쟁사 3개 이상 분석 포함
- SWOT 분석 포함
```

#### Step 4: "Order Sheet 발행" 클릭

**System Actions:**
1. Order JSON 파일 생성
2. `Human_ClaudeCode_Bridge/Orders/order_[timestamp].json` 저장
3. Socket.io 알림 발송
4. 좌측 사이드바 상태 업데이트: `⚪ (대기)` → `🔵 (진행 중)`

#### Step 5: Claude Code 작업 수행

**User Actions:**
- Claude Code 세션에서 Orders 확인
- AI가 시장조사 수행
- 결과를 Reports에 저장

#### Step 6: 결과 확인

**Workspace에서 "Load from Reports" 클릭**

**표시 내용:**
```
✅ 작업 완료: 0-1 시장조사

생성된 파일:
- P1_사업계획/0-1_시장조사/시장조사_보고서.md
- P1_사업계획/0-1_시장조사/경쟁사_분석.md

주요 내용:
- 시장 규모: TAM ₩500억, SAM ₩100억, SOM ₩10억
- 주요 경쟁사: 3개 분석 완료
- SWOT 분석 포함
```

**좌측 사이드바 상태 업데이트:**
`🔵 (진행 중)` → `✅ (완료)`

---

#### Step 7: 다음 작업 진행

**동일한 방식으로 반복:**
- 0-2 경쟁분석
- 0-3 사업계획서

**Order Sheet 템플릿:**
- `Vision_Mission.md` (비전 및 미션)
- 기타 사업계획 템플릿

---

### 3.2 프로젝트 기획 (○)

**목적:** 기술 사양 및 설계

#### 진행 방식

**동일한 UI Flow:**
1. 좌측 사이드바 "○ 프로젝트 기획" 클릭 → 확장
2. 하위 항목 선택 (예: 1-1 Project Plan)
3. Workspace에 템플릿 자동 로드
4. 템플릿 수정
5. Order Sheet 발행
6. Claude Code 작업
7. 결과 확인

**Order Sheet 템플릿 매핑:**

| 프로세스 항목 | Order Sheet 템플릿 경로 | 설명 |
|--------------|------------------------|------|
| 1-1 Project Plan | `/준비단계_○/프로젝트기획/Project_Plan.md` | 프로젝트 개요 및 목표 |
| 1-2 Requirements | `/준비단계_○/프로젝트기획/Requirements.md` | 기능 요구사항 정의 |
| 1-3 Architecture | (생성 필요) | 시스템 아키텍처 설계 |
| 1-4 UI/UX | (생성 필요) | 와이어프레임 및 디자인 |
| 1-5 DB Design | (생성 필요) | 데이터베이스 스키마 설계 |
| 1-6 API Design | (생성 필요) | API 엔드포인트 설계 |

---

## 4. 특별 단계 (☆) - 자동화

### 4.1 ☆ 작업 디렉토리 구조 생성

**목적:** 프로젝트 폴더 및 하위 디렉토리 자동 생성

#### Step 1: 좌측 사이드바에서 "☆ 작업 디렉토리 구조 생성" 클릭

**Workspace:**
```
┌─────────────────────────────────────────────────────────┐
│ 🛠️ Workspace - 특별 작업                                │
├─────────────────────────────────────────────────────────┤
│ 선택된 작업: ☆ 작업 디렉토리 구조 생성                  │
│                                                         │
│ [자동 템플릿 로드]                                      │
│                                                         │
│ Order Sheet 내용:                                       │
│ ┌─────────────────────────────────────────────────────┐│
│ │ # 작업 디렉토리 구조 생성                          ││
│ │                                                     ││
│ │ ## 목표                                             ││
│ │ 프로젝트 전체 폴더 구조를 표준 템플릿에 따라      ││
│ │ 자동으로 생성해주세요.                             ││
│ │                                                     ││
│ │ ## 생성할 디렉토리                                  ││
│ │ P1_사업계획/                                        ││
│ │   ├─ 0-1_시장조사/                                 ││
│ │   ├─ 0-2_경쟁분석/                                 ││
│ │   └─ 0-3_사업계획서/                               ││
│ │                                                     ││
│ │ 1_프로젝트_기획/                                   ││
│ │   ├─ 1-1_Project_Plan/                             ││
│ │   ├─ 1-2_Requirements/                             ││
│ │   ├─ 1-3_Architecture/                             ││
│ │   ├─ 1-4_UI_UX/                                    ││
│ │   ├─ 1-5_DB_Design/                                ││
│ │   └─ 1-6_API_Design/                               ││
│ │                                                     ││
│ │ ... (전체 구조 생략)                                ││
│ │                                                     ││
│ │ ## 프로젝트 경로                                    ││
│ │ [자동 설정: 사용자 프로젝트 폴더]                  ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ⚠️ 이 작업은 자동으로 실행됩니다.                       │
│ "Order Sheet 발행" 클릭 시 즉시 디렉토리가 생성됩니다.  │
│                                                         │
│ [Order Sheet 발행 (자동 실행)]                          │
└─────────────────────────────────────────────────────────┘
```

**Order Sheet 템플릿 경로:**
`Briefings_OrderSheets/OrderSheet_Templates/특별단계_☆/디렉토리_구조_생성.md`

#### Step 2: "Order Sheet 발행" 클릭

**자동 실행:**
- Claude Code가 즉시 작업 수행
- 약 1-2분 내 완료
- 좌측 사이드바 상태: `⚪` → `🔵` → `✅` (빠른 전환)

---

### 4.2 ☆ PROJECT SAL Grid 생성

**목적:** 5단계 개발 그리드 자동 생성

**동일한 UI Flow:**
- 특별 단계 클릭 → 자동 템플릿 로드 → 발행 → 자동 완료

**Order Sheet 템플릿 경로:**
`Briefings_OrderSheets/OrderSheet_Templates/특별단계_☆/SAL_GRID_생성.md`

---

## 5. 실행 단계 (S1-S5) - 순차 진행

### 5.1 실행 단계 개요

**특징:**
- **순차 진행 필수**: S1 완료 → S2 시작 → S3 → S4 → S5
- 각 단계마다 여러 하위 작업 포함
- Order Sheet 템플릿 제공

### 5.2 S1. 프로토타입 제작

#### 하위 작업

```
S1. 프로토타입 제작
  ├─ Frontend ⚪
  ├─ Backend ⚪
  └─ Integration ⚪
```

#### Step 1: "S1. 프로토타입 제작" 클릭 → 확장

#### Step 2: "Frontend" 클릭

**Workspace:**
```
선택된 작업: S1. 프로토타입 제작 - Frontend

[자동 템플릿 로드]

Order Sheet 내용:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# S1 프로토타입 제작 - Frontend

## 목표
프론트엔드 프로토타입을 구현하여 기본 UI/UX를 검증합니다.

## 작업 내용
1. 메인 페이지 HTML 구조 작성
2. 기본 스타일링 (CSS)
3. 간단한 인터랙션 (JavaScript)
4. 반응형 디자인 적용

## 기술 스택
- HTML5
- CSS3 (또는 Tailwind CSS)
- Vanilla JavaScript (또는 React)

## 사용자 수정 영역
기술 스택 선택: [여기에 입력]
추가 요구사항: [여기에 입력]

## 예상 결과물
- index.html
- styles.css
- script.js
- README.md (실행 방법)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Order Sheet 수정하기] [Order Sheet 발행]
```

**Order Sheet 템플릿 경로:**
`Briefings_OrderSheets/OrderSheet_Templates/실행단계/S1_프로토타입_Frontend.md`

#### Step 3-7: 동일한 Flow 반복

**Backend, Integration도 동일 방식으로 진행**

**Order Sheet 템플릿:**
- `S1_프로토타입_Backend.md`
- `일반_작업요청.md` (Integration 등 범용)

---

### 5.3 S2-S5 단계

**동일한 UI Flow 적용:**

| 단계 | 하위 작업 | Order Sheet 템플릿 |
|------|----------|-------------------|
| **S2. 개발 준비** | Tech Stack, Architecture, Development Setup | `일반_작업요청.md` |
| **S3. 개발 1차** | Frontend, Backend, Database | `일반_작업요청.md` |
| **S4. 개발 2차** | API Integration, Authentication, External Services | `일반_작업요청.md` |
| **S5. 개발 마무리** | Deployment, Monitoring, Maintenance | `일반_작업요청.md` |

**참고:**
- 현재 `일반_작업요청.md` 템플릿 사용
- 향후 각 단계별 전용 템플릿 추가 가능

---

## 6. Order Sheet 템플릿 연계

### 6.1 템플릿 자동 로드 시스템

**동작 방식:**

```javascript
// 좌측 사이드바 항목 클릭 시
function onProcessItemClick(item) {
  const templatePath = getTemplatePathByItem(item);

  if (templatePath) {
    // 템플릿 파일 읽기
    const template = loadTemplate(templatePath);

    // Workspace에 표시
    renderWorkspaceWithTemplate({
      itemName: item.name,
      template: template,
      status: item.status
    });
  } else {
    // 템플릿 없으면 빈 Order Sheet
    renderWorkspaceWithBlankOrderSheet(item.name);
  }
}
```

### 6.2 템플릿 매핑 테이블

**완전한 매핑:**

| 프로세스 항목 | 템플릿 경로 | 상태 |
|--------------|------------|------|
| **특별 단계** | | |
| ☆ 작업 디렉토리 구조 생성 | `/특별단계_☆/디렉토리_구조_생성.md` | ✅ 존재 |
| ☆ PROJECT SAL Grid 생성 | `/특별단계_☆/SAL_GRID_생성.md` | ✅ 존재 |
| **준비 단계 - 사업계획** | | |
| 0-1 시장조사 | `/준비단계_○/사업계획/Market_Analysis.md` | ✅ 존재 |
| 0-2 경쟁분석 | `/준비단계_○/사업계획/Vision_Mission.md` | ✅ 존재 (내용 조정 필요) |
| 0-3 사업계획서 | `/준비단계_○/사업계획/Vision_Mission.md` | ✅ 존재 (내용 조정 필요) |
| **준비 단계 - 프로젝트 기획** | | |
| 1-1 Project Plan | `/준비단계_○/프로젝트기획/Project_Plan.md` | ✅ 존재 |
| 1-2 Requirements | `/준비단계_○/프로젝트기획/Requirements.md` | ✅ 존재 |
| 1-3 Architecture | (생성 필요) | ⚠️ 없음 |
| 1-4 UI/UX | (생성 필요) | ⚠️ 없음 |
| 1-5 DB Design | (생성 필요) | ⚠️ 없음 |
| 1-6 API Design | (생성 필요) | ⚠️ 없음 |
| **실행 단계** | | |
| S1 - Frontend | `/실행단계/S1_프로토타입_Frontend.md` | ✅ 존재 |
| S1 - Backend | `/실행단계/S1_프로토타입_Backend.md` | ✅ 존재 |
| S1 - Integration | `/실행단계/일반_작업요청.md` | ✅ 존재 |
| S2 - 모든 항목 | `/실행단계/일반_작업요청.md` | ✅ 존재 |
| S3 - 모든 항목 | `/실행단계/일반_작업요청.md` | ✅ 존재 |
| S4 - 모든 항목 | `/실행단계/일반_작업요청.md` | ✅ 존재 |
| S5 - 모든 항목 | `/실행단계/일반_작업요청.md` | ✅ 존재 |

**추가 필요 템플릿:**
- Architecture 설계 템플릿
- UI/UX 와이어프레임 템플릿
- DB Design 스키마 템플릿
- API Design 엔드포인트 템플릿

---

## 7. Workspace UI 스펙

### 7.1 Workspace 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│ 🛠️ Workspace                                            │
├─────────────────────────────────────────────────────────┤
│ 상단: 선택된 작업 정보                                   │
│ ┌─────────────────────────────────────────────────────┐│
│ │ 선택된 작업: 0-1 시장조사                           ││
│ │ 상태: ⚪ 대기                                       ││
│ │ 템플릿: Market_Analysis.md                         ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ 중간: Order Sheet 편집 영역                             │
│ ┌─────────────────────────────────────────────────────┐│
│ │ [Order Sheet 내용]                                 ││
│ │                                                     ││
│ │ (Markdown 형식 편집기)                             ││
│ │ (Textarea 또는 Monaco Editor)                      ││
│ │                                                     ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ 하단: 액션 버튼                                         │
│ [템플릿 리셋] [Order Sheet 발행] [Reports 불러오기]    │
│                                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                         │
│ 결과 영역: Reports 내용 표시                            │
│ ┌─────────────────────────────────────────────────────┐│
│ │ (Order 완료 후 결과 표시)                          ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.2 템플릿 로드 로직

**JavaScript 함수:**

```javascript
// 템플릿 경로 가져오기
function getTemplatePathByItem(item) {
  const templateMap = {
    // 특별 단계
    "작업 디렉토리 구조 생성": "/특별단계_☆/디렉토리_구조_생성.md",
    "PROJECT SAL Grid 생성": "/특별단계_☆/SAL_GRID_생성.md",

    // 준비 단계 - 사업계획
    "0-1 시장조사": "/준비단계_○/사업계획/Market_Analysis.md",
    "0-2 경쟁분석": "/준비단계_○/사업계획/Vision_Mission.md",
    "0-3 사업계획서": "/준비단계_○/사업계획/Vision_Mission.md",

    // 준비 단계 - 프로젝트 기획
    "1-1 Project Plan": "/준비단계_○/프로젝트기획/Project_Plan.md",
    "1-2 Requirements": "/준비단계_○/프로젝트기획/Requirements.md",

    // 실행 단계
    "S1 - Frontend": "/실행단계/S1_프로토타입_Frontend.md",
    "S1 - Backend": "/실행단계/S1_프로토타입_Backend.md",

    // 기본 템플릿 (없을 경우)
    "default": "/실행단계/일반_작업요청.md"
  };

  return templateMap[item.name] || templateMap["default"];
}

// 템플릿 로드
async function loadTemplate(templatePath) {
  try {
    const response = await fetch(`/Briefings_OrderSheets/OrderSheet_Templates${templatePath}`);
    const template = await response.text();
    return template;
  } catch (error) {
    console.error("템플릿 로드 실패:", error);
    return getDefaultTemplate();
  }
}

// Workspace에 렌더링
function renderWorkspaceWithTemplate(data) {
  const workspaceElement = document.getElementById("workspace-order-sheet");

  workspaceElement.innerHTML = `
    <div class="workspace-header">
      <h3>선택된 작업: ${data.itemName}</h3>
      <span class="status-badge ${data.status}">${getStatusText(data.status)}</span>
      <p class="template-info">템플릿: ${data.templatePath}</p>
    </div>

    <div class="workspace-editor">
      <label>Order Sheet 내용:</label>
      <textarea id="order-sheet-content" rows="20">${data.template}</textarea>
    </div>

    <div class="workspace-actions">
      <button onclick="resetTemplate()">템플릿 리셋</button>
      <button onclick="downloadToOrders()" class="primary">Order Sheet 발행</button>
      <button onclick="openReportsModal()">Reports 불러오기</button>
    </div>

    <div class="workspace-result">
      <h4>작업 결과</h4>
      <div id="outbox-result">
        <p class="placeholder">Order 완료 후 결과가 여기에 표시됩니다.</p>
      </div>
    </div>
  `;
}
```

### 7.3 상태 관리

**프로세스 항목 상태:**

```javascript
const processStates = {
  PENDING: "pending",       // ⚪ 대기
  IN_PROGRESS: "progress",  // 🔵 진행 중
  COMPLETED: "completed",   // ✅ 완료
  ON_HOLD: "hold"          // 🔴 보류
};

// 상태 아이콘 매핑
function getStatusIcon(status) {
  const icons = {
    "pending": "⚪",
    "progress": "🔵",
    "completed": "✅",
    "hold": "🔴"
  };
  return icons[status] || "⚪";
}

// 상태 텍스트
function getStatusText(status) {
  const texts = {
    "pending": "대기",
    "progress": "진행 중",
    "completed": "완료",
    "hold": "보류"
  };
  return texts[status] || "대기";
}
```

### 7.4 Order Sheet 발행 시 동작

```javascript
async function downloadToInbox() {
  const orderContent = document.getElementById("order-sheet-content").value;
  const selectedItem = getCurrentSelectedItem(); // 현재 선택된 프로세스 항목

  // Order ID 생성
  const orderId = generateOrderId(selectedItem);

  // Order JSON 생성
  const orderData = {
    order_id: orderId,
    item_name: selectedItem.name,
    item_type: selectedItem.type, // "special", "prepare", "execute"
    content: orderContent,
    template_used: selectedItem.templatePath,
    created_at: new Date().toISOString()
  };

  // Orders에 저장
  const filename = `order_${Date.now()}.json`;
  const blob = new Blob([JSON.stringify(orderData, null, 2)], {
    type: "application/json"
  });

  // 다운로드 (사용자가 Orders 폴더에 저장)
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  // 상태 업데이트: pending → progress
  updateProcessItemStatus(selectedItem.id, "progress");

  // 알림
  showNotification(`Order Sheet가 발행되었습니다. Orders에 저장하세요.`);
}
```

---

## 8. 예외 플로우 및 에러 처리

### 8.1 템플릿 없을 경우

**시나리오:**
- 사용자가 1-3 Architecture 클릭
- 해당 템플릿이 없음

**동작:**
```javascript
if (!templatePath) {
  // 기본 템플릿 사용
  const defaultTemplate = `
# ${item.name}

## 목표
[작업 목표를 입력하세요]

## 작업 내용
[상세 작업 내용을 입력하세요]

## 예상 결과물
- [파일명 1]
- [파일명 2]
  `;

  renderWorkspaceWithTemplate({
    itemName: item.name,
    template: defaultTemplate,
    status: item.status,
    templatePath: "기본 템플릿 (사용자 작성)"
  });
}
```

### 8.2 Order 진행 중 다른 항목 선택

**시나리오:**
- 0-1 시장조사 Order 발행 (진행 중)
- 사용자가 0-2 경쟁분석 클릭

**동작:**
```javascript
if (currentOrderInProgress) {
  showConfirmDialog({
    title: "진행 중인 Order가 있습니다",
    message: "0-1 시장조사가 진행 중입니다. 새 작업을 시작하시겠습니까?",
    options: [
      { text: "기다리기", action: () => {} },
      { text: "새 작업 시작", action: () => loadNewItem() }
    ]
  });
}
```

---

## 9. 성공 기준

### 9.1 기능적 성공

- ✅ 좌측 사이드바 프로세스 항목 클릭 시 Workspace 업데이트
- ✅ 템플릿 자동 로드 (존재 시)
- ✅ Order Sheet 수정 가능
- ✅ Order Sheet 발행 → Inbox 저장
- ✅ 프로세스 항목 상태 자동 업데이트 (⚪ → 🔵 → ✅)
- ✅ Outbox 결과 표시

### 9.2 UX 성공

- ✅ 프로세스 단계별 명확한 안내
- ✅ 템플릿 제공으로 작업 시작 용이
- ✅ 상태 아이콘으로 진행 상황 직관적 파악
- ✅ 병렬/순차 진행 구분 명확

### 9.3 비즈니스 성공

- ✅ 사용자가 단계별로 체계적 개발 진행
- ✅ Order Sheet 표준화로 AI 작업 품질 향상
- ✅ 전체 프로세스 가시화로 프로젝트 관리 용이

---

## 10. 다음 단계

### 10.1 추가 필요 작업

1. **Order Sheet 템플릿 추가 작성:**
   - 1-3 Architecture 템플릿
   - 1-4 UI/UX 템플릿
   - 1-5 DB Design 템플릿
   - 1-6 API Design 템플릿

2. **UI 스펙 상세화:**
   - Workspace 편집기 기능 (Markdown preview, Syntax highlighting)
   - 템플릿 리셋 기능 구현
   - 작업 히스토리 기록

3. **Mockup 업데이트:**
   - 템플릿 로드 로직 추가
   - 프로세스 항목 클릭 핸들러 구현
   - 상태 관리 시스템 통합

---

## 11. 검토 포인트

**이 초안을 검토할 때 확인할 사항:**

1. **프로세스 구조:**
   - 좌측 사이드바의 실제 구조와 일치하는가?
   - 단계 구분(☆, ○, S1-S5)이 명확한가?

2. **Order Sheet 템플릿 연계:**
   - 모든 프로세스 항목에 템플릿이 매핑되어 있는가?
   - 템플릿 경로가 실제 파일 구조와 일치하는가?

3. **UI Flow:**
   - 사용자 동선이 자연스러운가?
   - Workspace 변화가 직관적인가?

4. **예외 처리:**
   - 템플릿 없는 경우 처리 방법이 적절한가?
   - 에러 상황에 대한 대응이 충분한가?

5. **누락 사항:**
   - 추가해야 할 단계나 기능이 있는가?
   - Order Sheet 템플릿이 더 필요한 항목이 있는가?

---

**문서 작성:** Claude Code
**상태:** 초안 (검토 필요)
**다음 단계:** 사용자 검토 후 수정 및 보완

---

**End of User Flow #6 초안**
