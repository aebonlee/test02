# SSALWorks 프로젝트 디렉토리 구조 가이드

> **버전**: v12.5
> **최종 업데이트**: 2025-12-26
> **프로젝트**: SaaS 구독형 학습 + 프로젝트 관리 통합 플랫폼

---

## 📖 이 문서는 무엇인가요?

이 문서는 **SSALWorks 프로젝트의 모든 폴더와 파일이 어디에 있고, 왜 그렇게 구성되어 있는지**를 설명합니다.

**이 문서를 읽으면:**
- 어떤 파일을 어디에 저장해야 하는지 알 수 있습니다
- 프로젝트 구조를 이해하고 효율적으로 작업할 수 있습니다
- 팀원들과 일관된 방식으로 협업할 수 있습니다

---

## 📁 전체 디렉토리 구조 (한눈에 보기)

```
C:\!SSAL_Works_Private\
│
# ========== 특별단계 (P0, S0) - 프로젝트 기초 ==========
├── P0_작업_디렉토리_구조_생성/    # 프로젝트 구조 및 상태 관리 ⭐ 핵심 문서
│   ├── Project_Directory_Structure.md   # 이 파일!
│   └── Project_Status.md                # 프로젝트 진행 상황
├── S0_Project-SAL-Grid_생성/     # 프로젝트 그리드 관리 시스템
│
# ========== 예비단계 (P1-P3) - GRID 범위 밖 ==========
├── P1_사업계획/                  # 비즈니스 계획
├── P2_프로젝트_기획/              # 프로젝트 기획
├── P3_프로토타입_제작/            # 프로토타입 제작 (완료)
│
# ========== 실행단계 (S1-S5) - GRID 관리 ==========
├── S1_개발_준비/                 # 개발 환경 준비
├── S2_개발-1차/                  # 1차 개발 (핵심 기능)
├── S3_개발-2차/                  # 2차 개발 (확장 기능)
├── S4_개발-3차/                  # 3차 개발 (고급 기능)
├── S5_개발_마무리/               # 개발 마무리 (배포/안정화)
│
# ========== 배포용 코드 (루트 폴더) ==========
├── api/                         # 백엔드 API (BA, S, BI, E Area)
├── pages/                       # 프론트엔드 페이지 (F Area)
├── assets/                      # 정적 자원 (CSS, JS, 이미지)
│
# ========== 부수적 고유기능 (SSALWorks 전용) ==========
├── 부수적_고유기능/              # SSALWorks에만 필요한 고유 기능 모음
│   ├── AI_Link/                 # AI 서비스 연동 (ChatGPT, Gemini, Perplexity)
│   ├── 콘텐츠/                  # 사용자 제공 콘텐츠 통합 폴더
│   │   ├── 실전_Tips/           # 개발 팁 및 노하우
│   │   ├── 외부_연동_설정_Guide/  # 외부 서비스 연동 설정 가이드
│   │   └── 학습용_Books/        # 학습용 콘텐츠 (Books)
│
# ========== 독립 폴더 ==========
├── Briefings_OrderSheets/       # Order Sheet 템플릿 및 브리핑
├── Human_ClaudeCode_Bridge/     # 사람 ↔ Claude Code 브릿지
├── Development_Process_Monitor/       # 사이드바 프로세스 관리 도구
├── 참고자료/                    # 참고용 파일들
│
# ========== 설정 폴더 ==========
├── .claude/                     # Claude Code 설정
├── .git/                        # Git 저장소
├── .github/                     # GitHub 설정 (Actions, etc.)
│
# ========== 자동화 스크립트 ==========
├── scripts/                         # Pre-commit Hook 자동화 스크립트
│   ├── build-web-assets.js          # 1~7번 자동화 통합 실행
│   └── sync-to-root.js              # 8번: Stage → Root 자동 복사
│
# ========== 루트 파일 ==========
├── .gitignore                       # Git 제외 파일 목록
└── package.json                     # Node.js 의존성
```

---

## 🎯 디렉토리 네이밍 규칙

### 규칙 1: 특별단계는 P0, S0
```
✅ P0_작업_디렉토리_구조_생성/    # 프로젝트 구조 문서
✅ S0_Project-SAL-Grid_생성/     # 프로젝트 그리드
```

### 규칙 2: 예비단계는 P + 숫자
```
✅ P1_사업계획/
✅ P2_프로젝트_기획/
✅ P3_프로토타입_제작/
```

### 규칙 3: 실행단계는 S + 숫자
```
✅ S1_개발_준비/
✅ S2_개발-1차/
✅ S3_개발-2차/
✅ S4_개발-3차/
✅ S5_개발_마무리/
```

### 규칙 4: 하위 폴더는 영문 사용
```
✅ P2_프로젝트_기획/User_Flows/
✅ S2_개발-1차/Backend_APIs/
❌ S2_개발-1차/백엔드_API/  (한글 사용 X)
```

### 규칙 5: 파일 명명 규칙 (2025-12-18 확정)

> **비개발자도 직관적으로 이해할 수 있는 파일명!**

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

**Task ID의 힘 (3차원 구조):**
- `S2BA1` = Stage(S2) + Area(BA) + 순서(1)
- Task ID 하나로 Stage, Area, 순서 모두 파악!
- **1 파일 = 1 Task 원칙** (파일이 여러 Task에 걸치면 안 됨)

---

## 🔄 개발 프로세스 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                    특별단계 (프로젝트 기초)                     │
├─────────────────────────────────────────────────────────────┤
│  P0_작업_디렉토리_구조_생성 + S0_Project-SAL-Grid_생성         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    예비단계 (GRID 범위 밖)                     │
├─────────────────────────────────────────────────────────────┤
│  P1_사업계획 → P2_프로젝트_기획 → P3_프로토타입_제작 ✅ 완료    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    실행단계 (GRID 관리)                       │
├─────────────────────────────────────────────────────────────┤
│  S1_개발_준비 → S2_개발-1차 → S3_개발-2차 → S4_개발-3차 → S5_개발_마무리 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 예비단계 (P1-P3) 상세 구조

### P1_사업계획/

**용도:** 비즈니스 전략 및 계획 (GRID 범위 밖)

```
P1_사업계획/
├── Vision_Mission/         # 비전과 미션
├── Market_Analysis/        # 시장 분석
├── Business_Model/         # 비즈니스 모델
├── BusinessPlan/           # 사업 계획서
└── Patent/                 # 특허 관련
```

**언제 사용하나요?**
- 사업 계획 수립할 때
- 사업 방향 검토할 때

---

### P2_프로젝트_기획/

**용도:** 프로젝트 기획 및 설계 (GRID 범위 밖)

```
P2_프로젝트_기획/
├── Project_Plan/           # 프로젝트 계획
├── User_Flows/             # 사용자 플로우
│   ├── 1_Signup/                   # 회원가입 플로우
│   ├── 2_Project_Registration/     # 프로젝트 등록 플로우
│   ├── 3_Subscription/             # 구독 플로우
│   ├── 4_Credit_Purchase/          # 크레딧 구매 플로우
│   ├── 5_Development_Process/      # 개발 프로세스 플로우
│   ├── Briefings_OrderSheets/OrderSheet_Templates/         # Order Sheet 템플릿
│   └── 상황별_안내문/              # 상황별 안내 메시지
├── Requirements/           # 기능 요구사항
├── Design_System/          # 디자인 시스템
├── UI_UX_Mockup/           # UI/UX 목업
│   ├── Wireframes/                 # 와이어프레임
│   ├── Mockups/                    # 목업 HTML
│   └── Design_Specs/               # 디자인 명세
├── Tech_Stack/             # 기술 스택
├── Service_Introduction/   # 서비스 소개
└── Workflows/              # 워크플로우
```

**Wireframe vs Mockup vs Prototype 차이:**

| 구분 | Wireframe | Mockup | Prototype |
|------|-----------|--------|-----------|
| 목적 | 화면 배치 설계 | 시각적 샘플 | 실제 작동 코드 |
| DB 연결 | ❌ 없음 | ❌ 없음 | ✅ 있음 |
| 위치 | P2/UI_UX_Mockup/Wireframes/ | P2/UI_UX_Mockup/Mockups/ | P3_프로토타입_제작/ |

---

### P3_프로토타입_제작/ ✅ 완료

**용도:** 실제 작동하는 프로토타입 (DB 연결, GRID 범위 밖)

```
P3_프로토타입_제작/
├── Database/               # SQL 파일 (31개+)
├── Documentation/          # 문서화
│   ├── 01_Feature_Specification.md
│   └── 02_Database_Schema.md
└── Frontend/               # 프론트엔드 코드
    ├── Prototype/                  # 실제 프로토타입 (22개 HTML)
    │   ├── index.html              # 메인 페이지
    │   ├── admin-dashboard.html    # 관리자 대시보드
    │   └── pages/                  # 하위 페이지들
    │       ├── auth/               # 로그인/회원가입
    │       ├── mypage/             # My Page
    │       ├── projects/           # 프로젝트
    │       ├── payment/            # 결제
    │       ├── subscription/       # 구독
    │       ├── manual/             # 매뉴얼
    │       └── legal/              # 약관/정책
              
```

**현재 상태:** ✅ Agenda #1~#10 완료
- 15개 DB 테이블
- 22개 HTML 페이지
- Admin Dashboard 8개 섹션

---

## 📂 실행단계 (S1-S5) 상세 구조

> **참고**: 각 Stage의 폴더 구조는 SSALWORKS_TASK_PLAN.md의 Area 분포와 일치합니다.
> Area 약어: M(Documentation), F(Frontend), BI(Backend_Infra), BA(Backend_APIs), D(Database), S(Security), T(Testing), O(DevOps), E(External), C(Content_System)

### S1_개발_준비/

**용도:** 개발 환경 구축 및 준비 (GRID 관리)

**TASK_PLAN Areas:** M(1), F(2), BI(1), D(1), S(1), T(1), O(1) = 8 Tasks

```
S1_개발_준비/
├── Backend_Infra/          # BI: 백엔드 인프라 설정
│   ├── Docker/
│   ├── Environment/
│   ├── Git/
│   ├── Node/
│   ├── Supabase/
│   └── Vercel/
├── Database/               # D: 데이터베이스 초기 설정
├── DevOps/                 # O: 운영/배포 설정
├── Documentation/          # M: 문서화 (개발 가이드 등)
├── Frontend/               # F: 프론트엔드 설정
├── Security/               # S: 보안 초기 설정
└── Testing/                # T: 테스트 환경 설정
```

**핵심 작업:**
- Vercel 프로젝트 설정 (S1F1, S1F2)
- 환경변수 설정 (S1BI1)
- DB 스키마 확정 (S1D1)
- Auth Provider 설정 (S1S1)
- 테스트 환경 설정 (S1T1)
- DNS 설정 (S1O1)

---

### S2_개발-1차/ (핵심 기능)

**용도:** 1차 개발 - 핵심 기능 구현 (GRID 관리)

**TASK_PLAN Areas:** M(1), F(2), BI(2), BA(3), D(1), S(1), T(1), C(1) = 12 Tasks

```
S2_개발-1차/
├── Backend_APIs/            # BA: 백엔드 API
├── Backend_Infra/          # BI: 백엔드 인프라
├── Content_System/         # C: 콘텐츠 시스템
├── Database/               # D: 데이터베이스
├── Documentation/          # M: 문서화
├── Frontend/               # F: 프론트엔드
├── Security/               # S: 보안/인증
└── Testing/                # T: 테스트
```

**핵심 작업:**
- Google OAuth API (S2BA1)
- Resend 이메일 서비스 (S2BI1, S2BA2)
- 구독 관리 API (S2BA3)
- 인증 미들웨어 (S2S1)
- Books 콘텐츠 업로드 (S2C1)

---

### S3_개발-2차/ (확장 기능)

**용도:** 2차 개발 - 확장 기능 구현 (GRID 관리)

**TASK_PLAN Areas:** BI(1), BA(1), S(1), E(1) = 4 Tasks

```
S3_개발-2차/
├── Backend_APIs/           # BA: AI Q&A API
├── Backend_Infra/          # BI: AI API 클라이언트
├── Database/               # D: 데이터베이스 (필요시)
├── External/               # E: AI API 키 설정
├── Frontend/               # F: 프론트엔드 (필요시)
└── Security/               # S: 구독 권한 체크
```

**핵심 작업:**
- AI API 클라이언트 통합 (S3BI1)
- AI Q&A API (S3BA1)
- 구독 권한 체크 (S3S1)
- AI API 키 설정 (S3E1)

---

### S4_개발-3차/ (고급 기능)

**용도:** 3차 개발 - 고급 기능 구현 (GRID 관리)

**TASK_PLAN Areas:** M(1), F(2), BI(1), BA(2), S(1), T(2), O(1) = 10 Tasks

```
S4_개발-3차/
├── Backend_APIs/           # BA: 결제 API, 웹훅
├── Backend_Infra/          # BI: Sentry 에러 트래킹
├── Database/               # D: 데이터베이스 (필요시)
├── DevOps/                 # O: Cron Jobs 설정
├── Documentation/          # M: 관리자 가이드
├── External/               # E: 외부 연동 (필요시)
├── Frontend/               # F: 관리자 대시보드, AI Q&A UI
├── Security/               # S: 관리자 권한 체크
└── Testing/                # T: E2E 테스트, API 통합 테스트
```

**핵심 작업:**
- 결제 API (S4BA1, S4BA2)
- 관리자 대시보드 강화 (S4F1)
- AI Q&A 인터페이스 (S4F2)
- E2E/통합 테스트 (S4T1, S4T2)

---

### S5_개발_마무리/

**용도:** 개발 마무리 - 배포/안정화/QA (GRID 관리)

**TASK_PLAN Areas:** M(1), U(1), F(1), BA(1), D(1), S(1), T(1), O(2) = 9 Tasks

```
S5_개발_마무리/
├── Backend_APIs/            # BA: API 버그 수정 및 최적화
├── Database/               # D: 데이터 백업 설정
├── DevOps/                 # O: 프로덕션 배포, 도메인 연결, SSL
├── Documentation/          # M: 운영 매뉴얼
├── Frontend/               # F: 버그 수정
└── Security/               # S: 보안 점검 및 패치
```

**핵심 작업:**
- 배포 및 도메인 연결
- 모니터링
- 유지보수

---

## 📦 배포 구조 (루트 폴더 - Vercel 배포)

**용도:** S1-S5 작업 결과가 모이는 실제 배포용 코드 (Vercel Root Directory)

```
루트/                           ← Vercel 루트 디렉토리
├── api/                       ← 백엔드 API (Area별 분류)
│   ├── Backend_APIs/          # BA Area (구독, 이메일 등)
│   ├── Security/              # S Area (인증, 권한)
│   ├── Backend_Infra/         # BI Area (공통 라이브러리)
│   └── External/              # E Area (외부 연동)
│
├── pages/                     ← 화면 (F Area)
│   ├── auth/                  # 인증 관련
│   ├── mypage/                # My Page
│   └── subscription/          # 구독 관련
│
├── assets/                    ← 정적 자원
│   ├── css/                   # 스타일시트
│   ├── js/                    # JavaScript
│   └── images/                # 이미지
│
├── scripts/                   ← 자동화 스크립트 (개발용)
├── index.html                 ← 메인 페이지
├── 404.html                   ← 에러 페이지
├── vercel.json                ← Vercel 설정
└── package.json               ← 패키지 설정
```

**핵심:** 4개 폴더 (api/, pages/, assets/, scripts/) + 2개 HTML

**Area별 API 분류:**
| Area | 루트 폴더 | 예시 |
|------|----------|------|
| BA (Backend_APIs) | `api/Backend_APIs/` | 구독, 이메일 API |
| S (Security) | `api/Security/` | 로그인, 인증 |
| BI (Backend_Infra) | `api/Backend_Infra/` | 공통 라이브러리 |
| E (External) | `api/External/` | 외부 서비스 연동 |

**Stage → 루트 복사 규칙:**
| Stage 폴더 | 루트 위치 |
|------------|----------|
| `S?_*/Frontend/` | `pages/` |
| `S?_*/Backend_APIs/` | `api/Backend_APIs/` |
| `S?_*/Security/` | `api/Security/` |
| `S?_*/Backend_Infra/` | `api/Backend_Infra/` |
| `S?_*/External/` | `api/External/` |

**배포 폴더에 넣지 않는 것:**
- `Testing/` - 테스트 코드 (개발용)
- `Documentation/` - 문서 (개발용)
- `Database/` - SQL 파일 (Supabase에서 실행)

**워크플로우 (Pre-commit Hook 자동화):**
```
1. Stage 폴더에서 작업 수행 (원본)
      ↓
2. git commit 실행
      ↓
3. Pre-commit Hook 자동 실행 (scripts/sync-to-root.js)
      ↓
4. 루트 폴더로 자동 복사 (배포용)
```

**핵심:** Stage가 원본, 루트 폴더는 Pre-commit Hook으로 자동 생성되는 복사본

---

## 🔄 Pre-commit Hook 자동화 (8가지)

> git commit 실행 시 자동으로 실행되는 8가지 자동화

### 자동화 목록

| # | 자동화 내용 | 소스 파일 | 출력 파일 |
|---|------------|----------|----------|
| 1 | Order Sheets MD → JS 번들링 | `Briefings_OrderSheets/OrderSheet_Templates/*.md` | `ordersheets.js` |
| 2 | Briefings (상황별 안내문) MD → JS 번들링 | `Briefings_OrderSheets/Briefings/**/*.md` | `guides.js` |
| 3 | 외부 연동 설정 가이드 MD → JS 번들링 | `부수적_고유기능/콘텐츠/외부_연동_설정_Guide/*.md` | `service-guides.js` |
| 4 | 서비스 소개 모달 MD → index.html 삽입 | `P2_.../Service_Introduction/서비스_소개.md` | `index.html` |
| 5 | SAL Grid 매뉴얼 MD → HTML 변환 | `S0_.../manual/PROJECT_SAL_GRID_MANUAL.md` | `참고자료/*.html` |
| 6 | 빌더 계정 매뉴얼 MD → HTML 변환 | `P2_.../Service_Introduction/빌더용_사용_매뉴얼.md` | `pages/mypage/manual.html` |
| 7 | P0~S5 진행률 → JSON 생성 | `P0~S0 폴더`, `sal_grid.csv` | `Development_Process_Monitor/data/phase_progress.json` |
| 8 | Stage 폴더 → 배포 폴더 자동 복사 | `S?_*/Frontend/`, `S?_*/Backend_APIs/` 등 | `pages/`, `api/` |

### 스크립트 위치

```
개별 폴더 스크립트 (단일 대상):
├── Briefings_OrderSheets/OrderSheet_Templates/generate-ordersheets-js.js
├── Briefings_OrderSheets/Briefings/generate-briefings-js.js
└── 부수적_고유기능/콘텐츠/외부_연동_설정_Guide/generate-service-guides-js.js

루트 scripts/ 폴더 스크립트 (복수 대상):
├── scripts/build-web-assets.js     ← 1~7번 통합 실행
└── scripts/sync-to-root.js         ← 8번: Stage → Root 자동 복사
```

### Stage → Root 매핑 (8번 자동화)

| Area | Stage 폴더 | Root 폴더 |
|------|-----------|----------|
| F | `S?_*/Frontend/` | `pages/` |
| BA | `S?_*/Backend_APIs/` | `api/Backend_APIs/` |
| S | `S?_*/Security/` | `api/Security/` |
| BI | `S?_*/Backend_Infra/` | `api/Backend_Infra/` |
| E | `S?_*/External/` | `api/External/` |

### 참조 문서

> `.claude/pre-commit-hooks.md` - Pre-commit Hook 상세 문서

---

## 📂 독립 폴더 상세 설명

### S0_Project-SAL-Grid_생성/

**용도:** 프로젝트 그리드 관리 시스템

```
S0_Project-SAL-Grid_생성/
├── manual/                 # 매뉴얼
│   ├── PROJECT_SAL_GRID_MANUAL.md
│   └── references/                 # 참조 문서
│       ├── SSALWORKS_TASK_PLAN.md
│       ├── SSALWORKS_5x11_MATRIX.md
│       └── TASK_SELECTION_MATRIX.md
├── sal-grid/               # SAL Grid 코어
├── supabase/               # Supabase 연동
└── viewer/                 # 그리드 뷰어
```

**프로젝트 그리드란?**
- 3차원 그리드로 모든 개발 작업 관리
- X축 (Stage): S1 → S2 → S3 → S4 → S5
- Y축 (Area): DevOps, Database, Backend, Frontend, Test 등
- Z축 (Level): 개별 Task (S1F1, S2BA3 등)

---

### Briefings_OrderSheets/

**용도:** Order Sheet 템플릿 및 브리핑 문서

```
Briefings_OrderSheets/
├── Briefings/              # 브리핑 문서
└── OrderSheet_Templates/   # Order Sheet 템플릿
    ├── P0-S0_표준양식.md   # P0~S0용 표준 양식
    ├── S1/                 # S1 Order Sheet
    ├── S2/                 # S2 Order Sheet
    ├── S3/                 # S3 Order Sheet
    ├── S4/                 # S4 Order Sheet
    └── S5/                 # S5 Order Sheet
```

**Order Sheet 양식:**
| 구분 | 특징 |
|------|------|
| P0~S0 | SAL Grid 없음, 작업 내용 직접 기재, 5단계 프로세스 |
| S1~S5 | SAL Grid 참조, Task 기반 작업, 7단계 프로세스 |

---

### Human_ClaudeCode_Bridge/

**용도:** 사람 ↔ Claude Code 작업 요청/결과 교환 브릿지

```
Human_ClaudeCode_Bridge/
├── Orders/                 # Order Sheet 저장 (사람 → Claude Code)
├── Reports/                # 작업 결과 저장 (Claude Code → 사람)
└── HUMAN_CLAUDECODE_BRIDGE_GUIDE.md  # 시스템 가이드
```

**파일 형식 규칙:**
| 파일 종류 | 형식 |
|----------|------|
| Order Sheet | `.json` |
| 작업 완료 보고서 | `.json` |
| 검증 리포트 | `.json` |
| 요약 문서 | `.md` (선택) |

**작업 흐름:**
1. 대시보드에서 Order Sheet 작성 → 클립보드 복사
2. Claude Code에 붙여넣기
3. Claude Code가 `Orders/`에 저장 후 작업 수행
4. 결과 보고서를 `Reports/`에 JSON으로 저장
5. 대시보드에서 "Reports 불러오기"로 결과 확인

---

### 부수적_고유기능/AI_Link/

**용도:** AI 서비스 연동

```
부수적_고유기능/AI_Link/
├── AI/
│   ├── ChatGPT/            # ChatGPT 연동
│   ├── Gemini/             # Gemini 연동
│   └── Perplexity/         # Perplexity 연동
├── ai_server.js            # AI 서버 스크립트
└── README.md               # AI Link 설명
```

---

### Development_Process_Monitor/

**용도:** 플랫폼 사이드바의 프로세스 관리 도구

```
Development_Process_Monitor/
├── progress_data/          # 진도 추적 데이터
└── sidebar_generation/     # 사이드바 자동 생성
```

---

### 부수적_고유기능/콘텐츠/실전_Tips/

**용도:** 개발 팁 및 노하우 모음

```
부수적_고유기능/콘텐츠/실전_Tips/
├── Claude_Code_활용/           # Claude Code 활용 팁
├── SAL_Grid_활용/              # SAL Grid 활용 팁
├── 개발_생산성/                # 개발 생산성 향상 팁
└── 효율적인_질문법/            # 효율적인 질문 방법
```

---

### 부수적_고유기능/콘텐츠/외부_연동_설정_Guide/

**용도:** 외부 서비스 연동 설정 가이드 (기능별 통합)

```
부수적_고유기능/콘텐츠/외부_연동_설정_Guide/
├── 01_데이터베이스_설정.md     # Supabase 프로젝트 + DB + RLS
├── 02_회원인증_설정.md         # Google OAuth + Supabase Auth
├── 03_이메일_시스템_설정.md    # Resend + SMTP + 템플릿
├── 04_배포_도메인_설정.md      # Vercel + DNS 설정
└── 05_결제_시스템_설정.md      # 토스페이먼츠
```

**특징:**
- 개발 순서에 맞게 기능별로 통합
- 실전 트러블슈팅 경험 포함
- DB → 인증 → 이메일 → 배포 → 결제 순서

---

### 부수적_고유기능/콘텐츠/학습용_Books/

**용도:** 학습 자료 및 개발 지식 저장소

```
부수적_고유기능/콘텐츠/학습용_Books/
├── 1. Claude&ClaudeCode사용법/         # Claude & Claude Code 가이드
├── 2. 웹개발 기초지식/                 # 웹 개발 기초 지식
├── 3_SAL Grid/                        # SAL Grid 관련
├── viewer.html                         # 콘텐츠 뷰어
└── 학습용_콘텐츠_제공_프로세스.md       # 프로세스 문서
```

**중요:**
- 모든 파일은 Markdown (.md) 형식
- viewer.html로 콘텐츠 열람 가능

---

### 참고자료/

**용도:** 분류하기 애매한 참고용 파일

```
참고자료/
├── Project_Grid_DB/                 # 프로젝트 그리드 DB 참고
├── references/                       # 참조 문서들
├── PROJECT_SAL_GRID_MANUAL.html     # SAL Grid 매뉴얼 (HTML)
└── SSALWorks참고자료.md              # SSALWorks 참고자료
```

---

### .claude/

**용도:** Claude Code 설정 및 커스터마이징

```
.claude/
├── CLAUDE.md               # Claude에게 주는 전역 지시사항
├── commands/               # Slash Commands (14개)
├── skills/                 # Skills (16개)
├── subagents/              # Subagents (18개)
├── workflows/              # 워크플로우
└── work_logs/              # 작업 로그
    ├── current.md          # 현재 활성 로그
    └── archive/            # 아카이브
```

**Skills (16개):** 특정 작업에 특화된 워크플로우
**Subagents (18개):** 전문 분야별 AI 어시스턴트
**Commands (14개):** 슬래시 명령어로 빠른 작업

---

## 🎯 파일을 어디에 저장해야 할까?

### 빠른 참조 테이블

| 파일 유형 | 저장 위치 |
|----------|----------|
| 사업 계획서 | `P1_사업계획/` |
| UI/UX 목업 | `P2_프로젝트_기획/UI_UX_Mockup/Mockups/` |
| 와이어프레임 | `P2_프로젝트_기획/UI_UX_Mockup/Wireframes/` |
| 사용자 플로우 | `P2_프로젝트_기획/User_Flows/` |
| 개발 환경 설정 | `S1_개발_준비/Backend_Infra/` |
| HTML 페이지 | 해당 Stage `Frontend/` + `Production/Frontend/` |
| SQL 파일 | 해당 Stage `Database/` + `Production/Database/` |
| API 코드 | 해당 Stage `Backend_APIs/` + `Production/Backend_APIs/` |
| 테스트 코드 | 해당 Stage `Testing/` |
| 배포 설정 | 해당 Stage `DevOps/` |
| 배포용 코드 | `Production/` (종합집결지) |
| 학습 자료 | `부수적_고유기능/콘텐츠/학습용_Books/` |
| 개발 팁 | `부수적_고유기능/콘텐츠/실전_Tips/` |
| 외부 연동 설정 | `부수적_고유기능/콘텐츠/외부_연동_설정_Guide/` |
| Order Sheet | `Human_ClaudeCode_Bridge/Orders/` |
| 작업 결과 보고 | `Human_ClaudeCode_Bridge/Reports/` |

### 체크리스트

**Q: 학습용 문서를 작성했어요**
→ `부수적_고유기능/콘텐츠/학습용_Books/`

**Q: 개발 팁을 정리했어요**
→ `부수적_고유기능/콘텐츠/실전_Tips/`

**Q: 외부 서비스 연동 가이드를 작성했어요**
→ `부수적_고유기능/콘텐츠/외부_연동_설정_Guide/`

**Q: HTML 페이지를 만들었어요**
→ 해당 Stage의 `Frontend/` + `Production/Frontend/`에 반영

**Q: SQL 파일을 작성했어요**
→ 해당 Stage의 `Database/` + `Production/Database/`에 반영

**Q: API 코드를 작성했어요**
→ 해당 Stage의 `Backend_APIs/` + `Production/Backend_APIs/`에 반영

**Q: 테스트 코드를 작성했어요**
→ 해당 Stage의 `Testing/`

**Q: 어디에 넣어야 할지 모르겠어요**
→ `참고자료/` (임시 보관 후 나중에 정리)

---

## 🛠️ 기술 스택 정리

### Frontend
- HTML5, CSS3 (Flexbox, Grid)
- JavaScript (ES6+, Vanilla)
- DOMPurify (XSS 방지)

### Backend
- **Supabase**
  - PostgreSQL (데이터베이스)
  - Auth (인증 - 이메일/비밀번호, Google OAuth)
  - RLS (Row Level Security)
  - REST API

### Deployment
- Vercel (Frontend + Serverless)

### External Services
- **Resend**: 이메일
- **토스페이먼츠**: 결제
- **Google OAuth**: 소셜 로그인

### AI & Automation
- **Claude Code** (Skills 16개, Subagents 18개, Commands 14개)

---

## 📝 중요 원칙 및 규칙

### 🛑 절대 규칙: 새 폴더 생성 전 사용자 승인 필수

```
⛔ 폴더 구조가 완성되었습니다. 새 폴더를 만들 필요가 없습니다!
⛔ 새 폴더가 정말 필요하다면 반드시 사용자에게 먼저 물어야 합니다!
⛔ 임의로 폴더를 생성하면 프로젝트 구조가 엉망이 됩니다!
```

**새 폴더 생성이 필요할 때:**
1. 기존 폴더 중 적합한 곳이 있는지 먼저 확인
2. 정말 없다면 작업 중단
3. 사용자에게 질문: "폴더 [폴더명] 생성이 필요합니다. 승인하시겠습니까?"
4. 승인 후에만 폴더 생성

---

### ✅ 반드시 지켜야 할 것

1. **P1-P3는 GRID 범위 밖** (예비단계)
2. **S1-S5는 GRID로 관리** (실행단계)
3. **네이밍 규칙 준수** (대분류: 한글+숫자, 하위: 영문)
4. **순서대로 진행** (P1 → P2 → P3 → S1 → S2 → S3 → S4 → S5)
5. **문서화 필수**
6. **새 폴더 생성 전 사용자 승인 필수**

### ❌ 절대 하지 말아야 할 것

1. **기획 없이 코딩 시작**
2. **디렉토리 구조 무시**
3. **비밀 정보 Git에 올리기** (.env 파일은 .gitignore에)
4. **문서 없이 코드만 작성**
5. **사용자 승인 없이 새 폴더 생성** ← 가장 중요!

---

## ⚠️ 현재 프로젝트 상태

### 완료
- ✅ P1_사업계획
- ✅ P2_프로젝트_기획
- ✅ P3_프로토타입_제작 (Agenda #1~#10)

### 대기 중
- ⏳ S1_개발_준비
- ⏳ S2_개발-1차
- ⏳ S3_개발-2차
- ⏳ S4_개발-3차
- ⏳ S5_개발_마무리

### 주의 사항
- ⚠️ 개발용 RLS 정책 적용 중 (프로덕션 배포 전 교체 필요)
- ⚠️ 토스페이먼츠 연동 대기 (가맹점 등록 필요)

---

## 📝 문서 수정 이력

| 버전 | 수정일 | 수정 내용 | 수정자 |
|-----|--------|---------|--------|
| v1.0 | 2025-11-17 | 초기 문서 작성 | Claude Code |
| v2.0 | 2025-11-17 | 콘텐츠 → 학습용_콘텐츠 변경 | Claude Code |
| v3.0 | 2025-11-17 | 사업계획 → P1_사업계획 변경 | Claude Code |
| v4.0 | 2025-11-17 | 실전 프로젝트 참고 구조 개선 | Claude Code |
| v5.0 | 2025-12-02 | P2, P3 폴더 구조 상세화 | Claude Code |
| v6.0 | 2025-12-12 | 전면 재작성: P1-P3 + S1-S5 실제 구조 반영 | Claude Code |
| v7.0 | 2025-12-13 | S1-S5 구조를 SSALWORKS_TASK_PLAN.md와 완전 일치하도록 수정 | Claude Code |
| v8.0 | 2025-12-13 | Production/ 종합집결지 추가, 체크리스트 개선 | Claude Code |
| v9.0 | 2025-12-14 | 실제 폴더와 문서 일치화: AI_Link/학습용_콘텐츠 경로 수정, Project-SSAL-Grid→S0_Project-SSAL-Grid_생성, 누락 파일 추가 | Claude Code |
| v10.0 | 2025-12-17 | 부수적_고유기능 폴더 구조 업데이트: 학습용_콘텐츠→학습용_Books, Tips/외부_연동_설정_Guide 추가 | Claude Code |
| v11.0 | 2025-12-18 | Web_ClaudeCode_Bridge → Human_ClaudeCode_Bridge 변경, Inbox/Outbox → Orders/Reports 변경, 파일 형식 규칙 추가 | Claude Code |
| v12.0 | 2025-12-18 | 파일 명명 규칙 추가 (규칙 5), Production 폴더 구조 재설계 (Area별 분류) | Claude Code |
| v12.1 | 2025-12-20 | Backend_API → Backend_APIs 용어 통일 (실제 폴더명과 일치화) | Claude Code |
| v12.2 | 2025-12-20 | Production 구조 6대 규칙 일치화: API→api, Backend_Infrastructure→Backend_Infra | Claude Code |
| v12.3 | 2025-12-23 | 실제 폴더 구조와 일치화: S0 SSAL→SAL, P2 Service_Introduction 추가, S3/S4 폴더 추가, S5 Backend_APIs 통일, Briefings_OrderSheets 추가 | Claude Code |
| **v12.4** | **2025-12-26** | **Pre-commit Hook 8가지 자동화 섹션 추가, scripts/data/ 폴더 추가, Production 워크플로우를 Pre-commit Hook 자동 복사로 업데이트** | Claude Code |

---

**현재 버전:** v12.4
**작성자:** SSALWorks Team
**마지막 업데이트:** 2025-12-26
