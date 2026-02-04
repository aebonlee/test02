# PROJECT SAL GRID - 표준 디렉토리 구조

> **작성일**: 2025-11-23
> **수정일**: 2025-11-26  
> **버전**: v2.0 (6×11 매트릭스 적용)  
> **용도**: SSALWorks 프로젝트의 표준 폴더 구조 정의

---

## 📋 목차

1. [개요](#1-개요)
2. [전체 구조](#2-전체-구조)
3. [루트 파일 설명](#3-루트-파일-설명)
4. [Stage 폴더 (준비 + 1-6)](#4-stage-폴더-준비--1-6)
5. [claude/ 폴더](#5-claude-폴더)
6. [web_claude-code_bridge/ 폴더](#6-web_claude-code_bridge-폴더)
7. [project-ssal-grid/ 폴더](#7-project-ssal-grid-폴더)
8. [파일 명명 규칙](#8-파일-명명-규칙)
9. [주의사항](#9-주의사항)

---

## 1. 개요

**Standard Project Directory Structure**는 SSALWorks 프로젝트의 표준 폴더 구조입니다.

**목적:**
- 일관된 프로젝트 구조
- 파일 위치 예측 가능
- 협업 효율성 향상
- Claude와의 원활한 작업

---

## 2. 전체 구조

```
project-root/
├── README.md
├── PROJECT_STATUS.md
├── PROJECT_DIRECTORY_STRUCTURE.md
│
├── .gitignore                        # Git 제외 파일 목록
├── .env                              # 환경 변수 (gitignore)
├── .env.example                      # 환경 변수 예시
│
├── package.json                      # 프로젝트 의존성
├── package-lock.json                 # 의존성 버전 잠금
├── tsconfig.json                     # TypeScript 설정
├── next.config.js                    # Next.js 설정 (Next.js 사용 시)
│
├── node_modules/                     # npm 패키지 (gitignore)
├── .next/                            # Next.js 빌드 캐시 (gitignore)
├── dist/                             # 빌드 결과물 (gitignore)
│
├── 참고자료/                         # 프로젝트 참고 자료
│
├── P1_사업계획/                        # Business Plan (GRID 범위 외)
├── P2_프로젝트_기획/                   # Planning (GRID 범위 외)
├── P3_프로토타입_제작/                 # Prototype (Stage 1)
├── S1_개발_준비/                       # Development Preparation (Stage 2)
├── 3_개발_1차/                        # Development Phase 1 (Stage 3)
├── 4_개발_2차/                        # Development Phase 2 (Stage 4)
├── 5_개발_3차/                        # Development Phase 3 (Stage 5)
├── S5_운영/                            # Operations (Stage 6)
│
├── claude/                            # Claude 작업 폴더
│   └── claude.md
│
├── Web_ClaudeCode_Bridge/            # Web ↔ Claude Code 브릿지
│   ├── inbox/                        # Project Owner → Claude
│   └── outbox/                       # Claude → Project Owner
│
├── Development_Process_Monitor/            # SSALWorks 사이드바 프로세스 도구
│   ├── progress_data/                # 진행 상황 데이터 (JSON)
│   └── sidebar_generation/           # 사이드바 생성 스크립트
│
└── project-ssal-grid/                # PROJECT SAL GRID 관리
    ├── manual/                       # 매뉴얼
    │   └── references/               # 참고자료
    ├── supabase/                     # 스키마 + SQL
    ├── task-instructions/            # Task Instructions
    ├── verification-instructions/    # Verification Instructions
    └── viewer/                       # 뷰어
        └── viewer.html              # HTML 뷰어 (Supabase 직접 연동)
```

---

## 3. 루트 파일 및 폴더 설명

### 프로젝트 문서

**README.md**
```markdown
# 프로젝트명

프로젝트 개요 및 소개

## 디렉토리 구조
PROJECT_DIRECTORY_STRUCTURE.md 참고

## 프로젝트 상태
PROJECT_STATUS.md 참고
```

**PROJECT_STATUS.md**
```markdown
# Project Status

- **Current Stage**: Stage 1 (프로토타입 제작)
- **Progress**: 35%
- **Last Updated**: 2025-11-26

## Completed Stages
- ✅ 프로젝트 기획 (2025-11-15 완료) ← GRID 범위 외

## Current Tasks
- 🔄 S2F3: 로그인 페이지 (In Progress)
- 🔄 S2B2: 인증 API (In Progress)

## Blocked Tasks
- ⏸️ S2F5: 대시보드 (의존성: S2B3)
```

**PROJECT_DIRECTORY_STRUCTURE.md**
- 이 문서의 전체 내용
- 각 폴더의 역할 설명
- 프로젝트 루트에 위치

---

### 개발 환경 설정 파일

**.gitignore**
```
# 의존성
node_modules/
venv/
__pycache__/

# 환경 변수
.env
.env.local

# 빌드 결과물
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp

# 로그
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

**.env (gitignore 대상)**
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
```

**.env.example (Git 추적)**
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

**package.json**
- 프로젝트 의존성 패키지 목록
- 스크립트 명령어 정의
- npm/yarn으로 자동 생성

**package-lock.json / yarn.lock**
- 의존성 정확한 버전 잠금
- 재현 가능한 빌드 보장

**tsconfig.json**
- TypeScript 컴파일러 설정
- 타입 체크 옵션

**next.config.js / vite.config.js 등**
- 프레임워크별 설정 파일
- 프로젝트 기술 스택에 따라 달라짐

---

### 빌드 및 캐시 폴더 (gitignore 대상)

**node_modules/**
- npm/yarn으로 설치된 패키지
- `npm install` 또는 `yarn install`로 생성
- Git 추적하지 않음 (용량 매우 큼)

**.next/**
- Next.js 빌드 캐시 및 출력 (Next.js 사용 시)
- Git 추적하지 않음

**dist/ 또는 build/**
- 프로덕션 빌드 결과물
- Git 추적하지 않음

---

### 참고자료/ 폴더

**용도:**
- 프로젝트 진행에 필요한 참고 자료 보관
- 디자인 에셋, 문서, 가이드라인 등

**포함되는 내용 예시:**
```
참고자료/
├── 디자인_가이드라인.pdf
├── API_문서/
├── 경쟁사_분석_자료/
├── 사용자_리서치_결과/
└── 외부_라이브러리_문서/
```

**특징:**
- Stage 폴더가 아닌 프로젝트 전반에 걸쳐 참고하는 자료
- 프로젝트 외부에서 받은 문서, 이미지 등
- Git 추적 여부는 파일 크기/성격에 따라 결정

---

## 4. Stage 폴더 (준비 + 1-6)

### 명명 규칙

```
{번호}_{한글명}/
```

### Stage별 폴더 구조 (Area 기반)

각 Stage는 **해당 단계에서 실제로 사용되는 Area만** 포함합니다.

**Area 약어:**
```
M  - Documentation (문서화)
U  - Design (UI/UX 디자인)
F  - Frontend (프론트엔드)
BI - Backend Infrastructure (백엔드 기반)
BA - Backend APIs (백엔드 API)
D  - Database (데이터베이스)
S  - Security (보안/인증/인가)
T  - Testing (테스트)
O  - DevOps (운영/배포)
E  - External (외부 연동)
C  - Content System (콘텐츠 시스템)
```

---

### Stage별 주요 산출물

**P1_사업계획:**
```
P1_사업계획/
└── (Area 배정 없음 - 자유 형식의 사업계획 문서 보관)
```

**1_기획 (Planning):**

```
1_기획/
├── M/  ⭐⭐⭐ 모든 기획 문서
│   ├── requirements.md (요구사항 정의)
│   ├── screen_structure.md (화면 구조, 페이지 목록)
│   ├── erd.md (ERD, 데이터 모델링)
│   ├── table_schemas.md (테이블 구조)
│   ├── external_services.md (외부 서비스 조사, API 선정)
│   ├── content_strategy.md (콘텐츠 전략)
│   ├── PROJECT_SAL_GRID.csv (Grid 생성 결과)
│   └── grid_summary.md
│
└── U/  ⭐⭐⭐ 목업 디자인
    │    🔴 매우 중요! Grid 생성 전 필수 완성
    ├── wireframes/
    ├── mockups/
    ├── user_flow.md
    └── components/
```

**핵심:** M (요구사항 정의) → U (목업 디자인 완성 🔴) → M (ERD) → M (Grid 생성) 순서!

---

**2_프로토타입_제작 (Prototype):**
```
2_프로토타입_제작/
├── M/  프로토타입 설명서, 데모 시나리오
├── U/  디자인 시스템 초안, UI 컴포넌트 디자인
├── F/  주요 화면 프로토타입, 인터랙션 구현 (Supabase Client로 DB 직접 접근)
└── D/  Supabase 테이블에 시드 데이터
```
⚠️ **주의:** JSON 목데이터 사용 금지! 처음부터 Supabase 사용 (전환 시 에러 방지)

**3_개발_준비 (Development Preparation):**
```
3_개발_준비/
├── M/  개발 가이드, 프로젝트 구조 설정, 라이브러리 선정, 테스트/배포 계획 문서
├── BI/ Supabase 클라이언트, 미들웨어, 공통 유틸
├── D/  마이그레이션 파일, 스키마 확정, 시드 데이터, RLS 정책
└── S/  인증 구조, 환경변수 설정
```

**4_개발 (Production Development):**
```
4_개발/
├── M/  API 문서, 사용자 가이드, README
├── U/  세부 UI/UX 완성, 애니메이션, 반응형
├── F/  모든 페이지 구현, 상태 관리, 최적화
├── BI/ 에러 핸들링, 로깅, 성능 모니터링, 캐싱
├── BA/ 모든 API 구현, 비즈니스 로직, 최적화
├── D/  모든 테이블, 관계 설정, 인덱스, 쿼리 최적화
├── S/  전체 인증/인가, RLS 완성, 보안 점검
├── T/  유닛/통합/E2E 테스트 전체 작성
├── O/  프로덕션 배포, 모니터링, 로깅
├── E/  모든 외부 서비스 연동, Webhook
└── C/  콘텐츠 생성 엔진 완성, AI 통합
```

**5_운영 (Operations):**
```
5_운영/
├── M/  운영 매뉴얼, 장애 대응 가이드, 업데이트 로그
├── F/  버그 수정, 성능 개선, 신규 기능
├── BA/ 버그 수정, 성능 개선, API 추가
├── D/  데이터 백업, 스키마 변경, 성능 튜닝
├── S/  보안 패치, 취약점 점검, 권한 관리
├── T/  회귀 테스트, 신규 기능 테스트
├── O/  모니터링, 스케일링, 장애 대응, 배포
├── E/  외부 서비스 업데이트, API 버전 관리
└── C/  콘텐츠 업데이트, 알고리즘 개선
```

**주의:** 프로젝트 특성에 따라 필요없는 Area는 생략 가능합니다.

---

## 5. claude/ 폴더

### claude.md

```markdown
# Claude 작업 메모

## 현재 작업
- Task S2F3 진행 중

## 완료 작업
- S1M1: 프로젝트 계획서 작성
- S1M2: 기술 스택 문서화

## 다음 작업
- S2F4: 회원가입 페이지

## 참고사항
- Supabase RLS 정책 주의
- Tailwind v3 사용
```

### 역할

- Claude의 작업 메모
- 세션 간 컨텍스트 유지
- 작업 기록
- 임시 메모

---

## 6. web_claude-code_bridge/ 폴더

### Inbox/Outbox System

**inbox/ (수신함)**
```
inbox/
├── 20251123_143000_stage_start.json
├── 20251123_150000_gate_rejection.json
└── 20251123_160000_ad_hoc.json
```

**outbox/ (발신함)**
```
outbox/
├── 20251123_145000_progress.json
├── 20251123_155000_completion.json
└── 20251123_165000_question.json
```

### 파일 명명 규칙

```
형식: {YYYYMMDD}_{HHMMSS}_{type}.json

예시:
- 20251123_143000_stage_start.json
- 20251123_150000_gate_rejection.json
- 20251123_160000_ad_hoc.json
```

### 역할

**inbox/:**
- Project Owner → Claude
- Order Sheet 전달
- 작업 지시

**outbox/:**
- Claude → Project Owner
- 작업 완료 보고
- 질문/요청

---

## 7. project-ssal-grid/ 폴더

### 구조

```
project-ssal-grid/
├── manual/
│   ├── PROJECT_SAL_GRID_생성_가이드.md
│   └── PROJECT_DIRECTORY_STRUCTURE.md
│
├── supabase/
│   ├── schema.sql
│   ├── migrations/
│   └── rls_policies.sql
│
├── task-instructions/
│   ├── S1M1_instruction.md
│   ├── S2F3_instruction.md
│   └── ...
│
├── verification-instructions/
│   ├── S1M1_verification.md
│   ├── S2F3_verification.md
│   └── ...
│
└── viewer/
    └── viewer.html              # Supabase 직접 연동 (변환기 불필요)
```

### 각 폴더 역할

**manual/**
- PROJECT SAL GRID 생성 가이드
- 디렉토리 구조 문서
- 사용법 문서
- 매뉴얼

**supabase/**
- 데이터베이스 스키마
- 마이그레이션 파일
- RLS 정책
- 트리거/함수

**task-instructions/**
- 각 Task의 작업 지시서
- `{TaskID}_instruction.md` 형식
- Claude가 Task 실행 시 참고
- 작업 목표 및 지시사항

**verification-instructions/**
- 각 Task의 검증 지시서
- `{TaskID}_verification.md` 형식
- verification_agent가 검증 시 사용
- 체크리스트 및 합격 기준

**viewer/**
- HTML 뷰어
- Grid 시각화
- 진행 상황 모니터링
- CSV → HTML 변환기

---

## 8. 파일 명명 규칙

### Task Instruction

```
형식: {TaskID}_instruction.md
예시: S2F3_instruction.md
```

### Verification Instruction

```
형식: {TaskID}_verification.md
예시: S2F3_verification.md
```

### 코드 파일

```
형식: {TaskID}_{설명}.{확장자}

예시:
- S2B5_auth_api.py
- S2F3_login_component.tsx
- S2D1_users_table.sql
```

### 테스트 파일

```
형식: {TaskID}_{테스트대상}_test.{확장자}

예시:
- S2B5_auth_test.spec.ts (단위 테스트)
- S2B5_login_integration_test.ts (통합 테스트)
- S3T1_e2e_test.ts (E2E 테스트)
```

### Inbox/Outbox 파일

```
형식: {YYYYMMDD}_{HHMMSS}_{type}.json

예시:
- 20251123_143000_stage_start.json
- 20251123_145000_progress.json
```

---

## 9. 주의사항

### 필수 파일

프로젝트 시작 시 반드시 생성:
- ✅ README.md (루트)
- ✅ PROJECT_STATUS.md (루트)
- ✅ PROJECT_DIRECTORY_STRUCTURE.md (루트)
- ✅ claude.md (claude/ 폴더)

### 폴더 생성 시기

**즉시 생성:**
- 준비 폴더 + Stage 1-6 폴더 (프로젝트 시작 시)
- claude/ 폴더
- web_claude-code_bridge/inbox/
- web_claude-code_bridge/outbox/
- project-ssal-grid/manual/
- project-ssal-grid/supabase/
- project-ssal-grid/viewer/

**작업 중 생성:**
- task-instructions/ (Task 생성 시 파일 추가)
- verification-instructions/ (Task 생성 시 파일 추가)

### 버전 관리

**Git 추적 대상:**
- 모든 폴더 구조
- 모든 문서 파일
- 모든 코드 파일
- Inbox/Outbox JSON 파일 (선택적)

**.gitignore 추가:**
```
# 의존성
node_modules/
venv/
__pycache__/

# 환경 변수
.env
.env.local

# 빌드 결과물
dist/
build/
.next/

# IDE
.vscode/
.idea/

# 로그
*.log

# OS
.DS_Store
Thumbs.db
```

### 권장 사항

**폴더 구조 유지:**
- 표준 구조를 최대한 준수
- 필요 시 하위 폴더 추가 가능
- 임의로 폴더명 변경 금지

**문서화:**
- 각 Stage 폴더에 README.md 추가 권장
- 중요한 결정사항은 문서로 기록
- 변경 이력은 Git 커밋 메시지로

**백업:**
- 정기적인 Git 커밋
- 중요 시점에 태그 생성
- Supabase 데이터베이스 백업

---

## 10. 프로젝트 초기 설정 체크리스트

### 1단계: 루트 파일 생성
- [ ] README.md
- [ ] PROJECT_STATUS.md
- [ ] PROJECT_DIRECTORY_STRUCTURE.md (이 문서 복사)

### 2단계: Stage 폴더 생성

**GRID 범위 외 (Preparation):**
- [ ] P1_사업계획/ (자유 형식)
- [ ] P2_프로젝트_기획/M/ U/

**Stage 1: 프로토타입 제작** (4개 Area)
- [ ] P3_프로토타입_제작/M/ U/ F/ D/

**Stage 2: 개발 준비** (6+ Area)
- [ ] S1_개발_준비/M/ BI/ D/ S/ T/ O/

**Stage 3/4/5: 개발 1차/2차/3차** (11개 Area)
- [ ] 3_개발_1차/M/ U/ F/ BI/ BA/ D/ S/ T/ O/ E/ C/
- [ ] 4_개발_2차/M/ U/ F/ BI/ BA/ D/ S/ T/ O/ E/ C/
- [ ] 5_개발_3차/M/ U/ F/ BI/ BA/ D/ S/ T/ O/ E/ C/

**Stage 6: 운영** (9개 Area)
- [ ] S5_운영/M/ F/ BA/ D/ S/ T/ O/ E/ C/

### 3단계: 작업 폴더 생성
- [ ] claude/
- [ ] claude/claude.md
- [ ] web_claude-code_bridge/inbox/
- [ ] web_claude-code_bridge/outbox/

### 4단계: Grid 관리 폴더 생성
- [ ] project-ssal-grid/manual/
- [ ] project-ssal-grid/supabase/
- [ ] project-ssal-grid/task-instructions/
- [ ] project-ssal-grid/verification-instructions/
- [ ] project-ssal-grid/viewer/

### 5단계: Git 설정
- [ ] .gitignore 생성
- [ ] Git 저장소 초기화
- [ ] 첫 커밋

---

**문서 끝**

이 문서는 SSALWorks 프로젝트의 표준 디렉토리 구조를 정의합니다. 모든 프로젝트는 이 구조를 기본으로 시작해야 합니다. 🌾
