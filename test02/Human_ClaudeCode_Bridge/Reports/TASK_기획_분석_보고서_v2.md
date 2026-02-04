# SSALWorks Task 기획 분석 보고서 v2.0

> **작성일**: 2025-12-13
> **작성자**: Claude Code
> **목적**: 새로운 프로세스 구조(P1~P3 + S1~S5)에 맞춘 Task 재기획

---

## 1. 프로세스 구조 변경 사항

### 1.1 기존 구조 (SSALWORKS_TASK_PLAN.md 기준)
```
Stage 1: 프로토타입 제작 (12개)
Stage 2: 개발 준비 (14개)
Stage 3: 개발 1차 (18개)
Stage 4: 개발 2차 (16개)
Stage 5: 개발 3차 (14개)
Stage 6: 운영 (12개)
─────────────────────
총 86개 Task
```

### 1.2 새로운 구조 (DEVELOPMENT_PROCESS_WORKFLOW.md 기준)
```
┌─────────────────────────────────────────────────────┐
│          PRELIMINARY (예비단계) - P1 ~ P3           │
├─────────────────────────────────────────────────────┤
│   P1 사업계획 → P2 프로젝트 기획 → P3 프로토타입    │
│   (✅ 완료)    (✅ 완료)          (✅ 완료)         │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│            STAGE (실행단계) - S1 ~ S5               │
├─────────────────────────────────────────────────────┤
│   S1 개발준비 → S2 개발1차 → S3 개발2차 →          │
│   S4 개발3차 → S5 운영                              │
└─────────────────────────────────────────────────────┘
```

### 1.3 핵심 차이점

| 구분 | 기존 (86개 Task) | 새 구조 |
|------|-----------------|---------|
| 프로토타입 | Stage 1 (GRID 범위) | **P3** (GRID 범위 외) |
| 개발 준비 | Stage 2 | **S1** |
| 개발 1차 | Stage 3 | **S2** |
| 개발 2차 | Stage 4 | **S3** |
| 개발 3차 | Stage 5 | **S4** |
| 운영 | Stage 6 | **S5** |

**핵심**: P1~P3는 **PROJECT SAL GRID 범위 외**

---

## 2. 현재 완료 상태

### 2.1 PRELIMINARY (예비단계) - 모두 완료

| 단계 | 상태 | 산출물 |
|------|------|--------|
| **P1 사업계획** | ✅ 완료 | `P1_사업계획/` 폴더 |
| **P2 프로젝트 기획** | ✅ 완료 | `P2_프로젝트_기획/` 폴더 |
| **P3 프로토타입 제작** | ✅ 완료 | `P3_프로토타입_제작/` (22개 HTML, 41개 SQL) |

### 2.2 P3 완료로 확보된 자산

**Frontend (22개 HTML 파일)**:
- index.html (메인 대시보드)
- admin-dashboard.html (관리자 대시보드 - 8개 섹션)
- auth/login.html, signup.html
- mypage/index.html, profile.html, security.html, subscription.html, credit.html
- projects/index.html, new.html
- payment/installation.html
- subscription/payment-method.html, billing-history.html
- manual/index.html
- legal/terms.html, privacy.html, customer_service.html

**Database (12개 테이블, 41개 SQL 파일)**:
- notices, learning_contents, faqs
- users, projects
- manuals, payment_methods, billing_history
- credit_transactions, ai_usage_log, ai_service_pricing
- inquiries

---

## 3. PROJECT SAL GRID 범위 재정립

### 3.1 GRID 범위

**새 구조에서 GRID가 관리하는 범위**:
```
┌────────────────────────────────────────────┐
│         PROJECT SAL GRID 관리 범위         │
├────────────────────────────────────────────┤
│  S1: 개발 준비 (Development Setup)         │
│  S2: 개발 1차 (Auth & Registration)        │
│  S3: 개발 2차 (AI Integration)             │
│  S4: 개발 3차 (Payment & Admin)            │
│  S5: 운영 (Operation & Maintenance)        │
└────────────────────────────────────────────┘

⚠️ P1, P2, P3는 GRID 범위 외 (이미 완료)
```

### 3.2 11 Areas (작업 영역) - 유지

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

## 4. Stage별 Task 재정립

### 4.1 Stage 분포 요약

| Stage | 설명 | 권장 Task 수 |
|-------|------|-------------|
| **S1** | 개발 준비 | 10개 |
| **S2** | 개발 1차 (핵심 기능) | 14개 |
| **S3** | 개발 2차 (고급 기능) | 12개 |
| **S4** | 개발 3차 (QA/최적화) | 8개 |
| **S5** | 운영 | 6개 |
| **합계** | | **50개** |

---

## 5. Stage별 상세 Task 목록

### S1: 개발 준비 (Development Setup) - 10개 Task

| Task ID | Area | Task명 | 설명 |
|---------|------|--------|------|
| S1M1 | M | 개발 가이드 | 코딩 컨벤션, Git 브랜치 전략 |
| S1M2 | M | 프로젝트 구조 문서 | React 프로젝트 폴더 구조 |
| S1BI1 | BI | Next.js 프로젝트 생성 | 초기 프로젝트 셋업 |
| S1BI2 | BI | Supabase 클라이언트 설정 | TypeScript 타입 생성, 연결 |
| S1D1 | D | 프로덕션 RLS 적용 | 개발용 → 프로덕션 RLS 교체 |
| S1D2 | D | DB 함수 작성 | PostgreSQL 함수 (통계 등) |
| S1S1 | S | 환경변수 설정 | .env 구조화, 시크릿 관리 |
| S1T1 | T | 테스트 환경 설정 | Vitest/Jest 설정 |
| S1O1 | O | Vercel 프로젝트 설정 | 배포 환경 준비 |
| S1O2 | O | CI/CD 설정 | GitHub Actions |

---

### S2: 개발 1차 - 핵심 기능 (Auth & Registration) - 14개 Task

| Task ID | Area | Task명 | 설명 |
|---------|------|--------|------|
| S2M1 | M | API 문서 v1 | 인증/프로젝트 API 명세 |
| S2U1 | U | 반응형 검증 | 모바일/태블릿 대응 확인 |
| S2F1 | F | 레이아웃 컴포넌트 | Header, Sidebar, Footer React 전환 |
| S2F2 | F | 인증 페이지 전환 | login.html, signup.html → React |
| S2F3 | F | 회원가입 완성 | Supabase Auth 연동 |
| S2F4 | F | 로그인 완성 | 세션 관리 |
| S2F5 | F | 비밀번호 재설정 | 이메일 인증 |
| S2F6 | F | 메인 대시보드 전환 | index.html → React |
| S2BI1 | BI | 에러 핸들링 | 전역 에러 처리, 토스트 |
| S2BA1 | BA | 인증 API | Supabase Auth 래퍼 |
| S2S1 | S | 인증 미들웨어 | 보호된 라우트 처리 |
| S2S2 | S | 입력값 검증 | Zod 스키마 |
| S2T1 | T | 인증 테스트 | 회원가입/로그인 테스트 |
| S2O1 | O | 스테이징 배포 | 스테이징 환경 배포 |

---

### S3: 개발 2차 - 고급 기능 (AI Integration) - 12개 Task

| Task ID | Area | Task명 | 설명 |
|---------|------|--------|------|
| S3F1 | F | My Page 전환 | mypage/*.html → React (5개 섹션) |
| S3F2 | F | 프로젝트 목록 전환 | projects/index.html → React |
| S3F3 | F | 프로젝트 생성 전환 | projects/new.html → React |
| S3F4 | F | 구독/결제 전환 | subscription/*.html → React |
| S3F5 | F | 관리자 대시보드 전환 | admin-dashboard.html → React |
| S3BA1 | BA | 프로젝트 API | 프로젝트 CRUD API |
| S3BA2 | BA | 구독 API | 구독 상태/신청 API |
| S3D1 | D | 인덱스 최적화 | 쿼리 성능 개선 |
| S3S1 | S | 구독 권한 체크 | 접근 권한 검증 |
| S3E1 | E | 토스 페이먼트 연동 | 빌링키, 정기결제 |
| S3E2 | E | 이메일 서비스 연동 | Resend API |
| S3E3 | E | AI API 연동 | Perplexity API |

---

### S4: 개발 3차 - 결제 & 관리자 (Payment & Admin) - 8개 Task

| Task ID | Area | Task명 | 설명 |
|---------|------|--------|------|
| S4M1 | M | 사용자 가이드 | 전체 사용법 문서 |
| S4M2 | M | 관리자 가이드 | Admin Dashboard 사용법 |
| S4T1 | T | Unit 테스트 | 컴포넌트/함수 테스트 |
| S4T2 | T | E2E 테스트 | 주요 시나리오 테스트 |
| S4T3 | T | 크로스 브라우저 테스트 | Chrome, Safari, Firefox |
| S4S1 | S | 보안 점검 | 취약점 스캔, OWASP 체크 |
| S4O1 | O | 성능 최적화 | 번들 사이즈, 로딩 속도 |
| S4O2 | O | 프로덕션 배포 준비 | 환경변수, 도메인 설정 |

---

### S5: 운영 (Operation & Maintenance) - 6개 Task

| Task ID | Area | Task명 | 설명 |
|---------|------|--------|------|
| S5M1 | M | 운영 매뉴얼 | 시스템 관리 가이드 |
| S5M2 | M | 장애 대응 가이드 | 트러블슈팅 문서 |
| S5O1 | O | 프로덕션 배포 | Vercel 배포, 도메인 연결 |
| S5O2 | O | 모니터링 설정 | 에러 추적, 성능 모니터링 |
| S5D1 | D | 데이터 백업 설정 | 자동 백업 |
| S5S1 | S | 보안 패치 정책 | 취약점 대응 절차 |

---

## 6. Task 수 비교

| 비교 항목 | 기존 계획 | 새 계획 | 변화 |
|----------|----------|---------|------|
| 프로토타입 (S1/P3) | 12 | **0** (P3로 이동) | -12 |
| 개발 준비 | 14 | **10** | -4 |
| 개발 1차 | 18 | **14** | -4 |
| 개발 2차 | 16 | **12** | -4 |
| 개발 3차 | 14 | **8** | -6 |
| 운영 | 12 | **6** | -6 |
| **합계** | **86** | **50** | **-36** |

---

## 7. 핵심 변경 요약

### 7.1 P3 분리로 인한 효과

**기존**: 프로토타입이 Stage 1로 GRID 범위 내
**새 구조**: 프로토타입이 P3로 GRID 범위 외

→ **GRID는 S1~S5만 관리** (50개 Task)
→ **P3 작업은 이미 완료됨** (Agenda #1~#10)

### 7.2 남은 핵심 작업

```
1. S1: 개발 환경 구축 (Next.js, RLS, CI/CD)
2. S2: HTML → React 전환 + 인증 연동
3. S3: 외부 서비스 연동 (토스, AI API)
4. S4: 테스트 + QA + 최적화
5. S5: 프로덕션 배포 + 운영
```

---

## 8. 권장 진행 순서

```
1. PROJECT SAL GRID SQL 파일 생성 (50개 Task)
   - S1~S5 기준으로 재작성
   - 22개 속성 반영

2. Supabase에 Grid 테이블 생성 및 데이터 삽입

3. S1 (개발 준비) 시작
   - Next.js 프로젝트 생성
   - RLS 프로덕션 정책 적용
   - CI/CD 설정

4. S2 (개발 1차) - HTML → React 전환 & 인증

5. S3 (개발 2차) - 외부 서비스 연동

6. S4 (개발 3차) - 테스트 & QA

7. S5 (운영) - 배포 & 모니터링
```

---

## 9. 폴더 구조 매핑

| Stage | 폴더 | 설명 |
|-------|------|------|
| S1 | `S1_개발_준비/` | 이미 존재 |
| S2 | `S2_개발-1차/` | 이미 존재 |
| S3 | `S3_개발-2차/` | 이미 존재 |
| S4 | `S4_개발-3차/` | 이미 존재 |
| S5 | `S5_운영/` | 이미 존재 |

---

## 10. 결론

### 기존 86개 → 50개로 축소

**축소 이유**:
1. **P3 분리**: 프로토타입(12개)이 GRID 범위 외로 이동
2. **P3 완료**: 프로토타입 이미 구현됨 (22개 HTML, 12개 테이블)
3. **작업 최적화**: 중복/불필요 Task 제거

### 핵심 작업 (S1~S5)

| Stage | 핵심 목표 |
|-------|----------|
| S1 | 개발 환경 구축, RLS 적용, CI/CD |
| S2 | **HTML → React 전환**, 인증 연동 |
| S3 | **외부 서비스 연동** (토스, AI API) |
| S4 | 테스트, QA, 성능 최적화 |
| S5 | 프로덕션 배포, 모니터링 |

---

**문서 작성 완료**: 2025-12-13
**작성자**: Claude Code
**버전**: v2.0 (P1~P3 + S1~S5 구조 반영)
