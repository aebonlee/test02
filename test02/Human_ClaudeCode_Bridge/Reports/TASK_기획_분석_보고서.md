# SSALWorks Task 기획 분석 보고서

> **작성일**: 2025-12-13
> **작성자**: Claude Code
> **목적**: P3 프로토타입 완료 후 남은 Task 기획 및 정리

---

## 1. 현재 상황 분석

### 1.1 완료된 작업 (P3 프로토타입)

**P3 프로토타입 제작 완료** (Agenda #1~#10):

| # | Agenda | 상태 | 주요 결과물 |
|---|--------|------|------------|
| 1 | 공지사항 | ✅ | notices 테이블, Admin CRUD, User 표시 |
| 2 | 학습용 콘텐츠 | ✅ | learning_contents 테이블 (3단계 트리), Accordion UI |
| 3 | FAQ | ✅ | faqs 테이블, Admin CRUD, Accordion UI |
| 4 | 회원가입 & 인증 | ✅ | users 테이블, login.html, signup.html |
| 5 | 프로젝트 등록 & 설치비 | ✅ | projects 테이블, installation.html |
| 6 | 플랫폼 이용료 & 결제 | ✅ | billing_history, payment_methods 테이블 |
| 7 | AI 크레딧 충전 & 사용 | ✅ | credit_transactions, ai_usage_log 테이블 |
| 8 | My Page 통합 | ✅ | 5개 섹션 (프로필/프로젝트/구독/크레딧/보안) |
| 9 | 고객 문의 관리 | ✅ | inquiries 테이블, customer_service.html |
| 10 | PROJECT SAL GRID 매뉴얼 | ✅ | manuals 테이블, manual/index.html |

### 1.2 생성된 리소스

**Database (SQL 파일 41개)**:
- 테이블 생성: 12개 테이블
- RLS 정책: 개발용 (_dev.sql) 적용 중
- 샘플 데이터: 각 테이블별 준비

**Frontend (HTML 파일 22개)**:
```
Frontend/Prototype/
├── index.html                    # 메인 대시보드
├── admin-dashboard.html          # 관리자 대시보드 (8개 섹션)
├── pages/
│   ├── auth/login.html, signup.html
│   ├── mypage/index.html, profile.html, security.html, subscription.html, credit.html
│   ├── projects/index.html, new.html
│   ├── payment/installation.html
│   ├── subscription/payment-method.html, billing-history.html
│   ├── manual/index.html
│   └── legal/terms.html, privacy.html, customer_service.html
```

---

## 2. 기존 Task 계획 분석

### 2.1 템플릿 vs 실전용

| 구분 | 파일 | Task 수 | 용도 |
|------|------|---------|------|
| 템플릿 | `TEMPLATE_STANDARD_PROJECT_SSAL_GRID.sql` | 57개 | 범용 예시 |
| 실전용 | `SSALWORKS_TASK_PLAN.md` | 86개 | SSALWorks 전용 |

### 2.2 기존 86개 Task 분포 (SSALWORKS_TASK_PLAN.md 기준)

| Stage | Task 수 | 목표 |
|-------|---------|------|
| S1 프로토타입 제작 | 12 | 핵심 화면 + DB 구조 |
| S2 개발 준비 | 14 | 인프라 + 개발 환경 |
| S3 개발 1차 | 18 | 인증 + 구독 + 기본 CRUD |
| S4 개발 2차 | 16 | 그리드 + Books 콘텐츠 |
| S5 개발 3차 | 14 | AI + 관리자 대시보드 |
| S6 운영 | 12 | 유지보수 + 모니터링 |
| **합계** | **86** | |

---

## 3. P3 완료로 인한 변화 분석

### 3.1 P3에서 이미 완료된 것 (기존 계획 대비)

**S1 프로토타입 제작 (12개 중 ~10개 완료)**:
- ✅ 디자인 시스템 정의 → admin-dashboard.html CSS
- ✅ UI 컴포넌트 정의 → 재사용 컴포넌트 구현됨
- ✅ 주요 화면 구현 → 22개 HTML 페이지
- ✅ Supabase 테이블 생성 → 12개 테이블
- ✅ 시드 데이터 → 샘플 데이터 SQL

**S3-S5에서 일부 선행 완료**:
- ✅ 관리자 대시보드 → admin-dashboard.html (8개 섹션)
- ✅ 회원가입/로그인 UI → auth/login.html, signup.html
- ✅ 프로젝트 CRUD UI → projects/index.html, new.html
- ✅ 구독/결제 UI → payment/, subscription/
- ✅ 고객 문의 시스템 → customer_service.html

### 3.2 아직 완료되지 않은 것

**프로덕션 필수 작업**:
1. **RLS 정책 교체** (개발용 → 프로덕션용)
2. **HTML → React 전환**
3. **Supabase Auth 실제 연동**
4. **토스 페이먼트 실제 연동**
5. **AI API 연동** (Perplexity 등)
6. **테스트 코드 작성**
7. **배포 환경 구성** (Vercel)

---

## 4. 권장 Task 재정립

### 4.1 접근 방식

**원칙**: P3에서 완료된 작업은 Task에서 제외하고, 남은 작업만 정리

**결과**: 86개 → **약 55~60개**로 축소 예상

### 4.2 Stage별 재정립안

---

#### **Stage 1: 프로토타입 제작** → **대부분 완료** (남은 Task: 2개)

| Task ID | Task명 | 상태 | 비고 |
|---------|--------|------|------|
| S1M1 | 프로토타입 설명서 | 신규 | P3 결과물 정리 문서 |
| S1M2 | 데모 시나리오 | 신규 | 시연 스크립트 |

**완료된 것 (Task 제외)**:
- 디자인 시스템 → CSS 변수 정의됨
- UI 컴포넌트 → HTML에 구현됨
- 주요 화면 → 22개 HTML
- DB 테이블 → 12개 테이블
- 시드 데이터 → SQL 파일 존재

---

#### **Stage 2: 개발 준비** (남은 Task: 12개)

| Task ID | Task명 | 설명 |
|---------|--------|------|
| S2M1 | 개발 가이드 | 코딩 컨벤션, 브랜치 전략 |
| S2M2 | 프로젝트 구조 문서 | React 폴더 구조 |
| S2BI1 | Next.js 프로젝트 생성 | 초기 설정 |
| S2BI2 | Supabase 클라이언트 설정 | TypeScript 타입 생성 |
| S2BI3 | 미들웨어 설정 | 인증 미들웨어 |
| S2D1 | 프로덕션 RLS 적용 | 개발용 → 프로덕션 RLS |
| S2D2 | DB 함수 작성 | PostgreSQL 함수 |
| S2S1 | 환경변수 설정 | .env 구조화 |
| S2S2 | 인증 구조 설정 | Supabase Auth 설정 |
| S2T1 | 테스트 환경 설정 | Vitest 설정 |
| S2O1 | 배포 환경 준비 | Vercel 프로젝트 설정 |
| S2O2 | CI/CD 초기 설정 | GitHub Actions |

---

#### **Stage 3: 개발 1차 - React 전환 & 인증** (남은 Task: 14개)

| Task ID | Task명 | 설명 |
|---------|--------|------|
| S3M1 | API 문서 v1 | 인증/구독 API 명세 |
| S3U1 | 반응형 디자인 검증 | 모바일/태블릿 대응 확인 |
| S3F1 | 레이아웃 컴포넌트 | Header, Sidebar, Footer React 전환 |
| S3F2 | 인증 페이지 전환 | login.html, signup.html → React |
| S3F3 | 회원가입 기능 완성 | Supabase Auth 연동 |
| S3F4 | 로그인 기능 완성 | 세션 관리 |
| S3F5 | 비밀번호 재설정 | 이메일 인증 |
| S3F6 | 메인 대시보드 전환 | index.html → React |
| S3BI1 | 에러 핸들링 시스템 | 전역 에러 처리 |
| S3BA1 | 인증 API | Supabase Auth 래퍼 |
| S3S1 | 인증 미들웨어 완성 | 보호된 라우트 |
| S3S2 | 입력값 검증 | Zod 스키마 |
| S3T1 | 인증 테스트 | 회원가입/로그인 테스트 |
| S3O1 | 스테이징 배포 | 스테이징 환경 배포 |

---

#### **Stage 4: 개발 2차 - My Page & 프로젝트** (남은 Task: 12개)

| Task ID | Task명 | 설명 |
|---------|--------|------|
| S4F1 | My Page 전환 | mypage/*.html → React (5개 섹션) |
| S4F2 | 프로젝트 목록 전환 | projects/index.html → React |
| S4F3 | 프로젝트 생성 전환 | projects/new.html → React |
| S4F4 | 구독 정보 전환 | subscription/*.html → React |
| S4F5 | 결제 수단 전환 | payment-method.html → React |
| S4BA1 | 프로젝트 API | 프로젝트 CRUD API |
| S4BA2 | 구독 API | 구독 상태/신청 API |
| S4D1 | 인덱스 최적화 | 자주 사용 쿼리 인덱스 |
| S4S1 | 구독 권한 체크 | 접근 권한 검증 |
| S4T1 | 프로젝트 API 테스트 | CRUD 통합 테스트 |
| S4T2 | My Page 테스트 | 컴포넌트 테스트 |
| S4E1 | 토스 페이먼트 연동 | 빌링키, 정기결제 |

---

#### **Stage 5: 개발 3차 - 관리자 & AI** (남은 Task: 10개)

| Task ID | Task명 | 설명 |
|---------|--------|------|
| S5M1 | 관리자 가이드 | Admin Dashboard 사용법 |
| S5F1 | 관리자 대시보드 전환 | admin-dashboard.html → React |
| S5F2 | 학습 콘텐츠 뷰어 | Books 콘텐츠 표시 |
| S5F3 | AI Q&A 인터페이스 | AI 질문/답변 UI |
| S5BA1 | AI Q&A API | Perplexity API 프록시 |
| S5BA2 | 콘텐츠 API | Books 콘텐츠 조회 |
| S5S1 | 관리자 권한 체크 | Admin 전용 라우트 보호 |
| S5T1 | AI Q&A 테스트 | API 연동 테스트 |
| S5T2 | E2E 테스트 | 주요 시나리오 테스트 |
| S5O1 | 프로덕션 배포 | 도메인 연결, 프로덕션 배포 |

---

#### **Stage 6: 운영** (남은 Task: 8개)

| Task ID | Task명 | 설명 |
|---------|--------|------|
| S6M1 | 운영 매뉴얼 | 시스템 관리 가이드 |
| S6M2 | 장애 대응 가이드 | 트러블슈팅 문서 |
| S6F1 | 버그 수정 | 보고된 버그 수정 |
| S6BA1 | API 최적화 | 성능 개선 |
| S6D1 | 데이터 백업 설정 | 자동 백업 |
| S6S1 | 보안 점검 | 취약점 스캔 |
| S6O1 | 모니터링 시스템 | 에러 추적, 성능 모니터링 |
| S6O2 | 스케일링 대응 | 트래픽 증가 대응 |

---

## 5. 최종 Task 수 요약

| Stage | 기존 계획 | 재정립 후 | 변화 |
|-------|----------|----------|------|
| S1 프로토타입 | 12 | **2** | -10 (P3 완료) |
| S2 개발 준비 | 14 | **12** | -2 |
| S3 개발 1차 | 18 | **14** | -4 |
| S4 개발 2차 | 16 | **12** | -4 |
| S5 개발 3차 | 14 | **10** | -4 |
| S6 운영 | 12 | **8** | -4 |
| **합계** | **86** | **58** | **-28** |

---

## 6. 주요 고려사항

### 6.1 HTML → React 전환 전략

**원칙**: P3에서 만든 HTML을 **충실히 React로 전환**

```
전환 순서:
1. 레이아웃 컴포넌트 (Header, Sidebar, Footer)
2. 인증 페이지 (login, signup)
3. 메인 대시보드
4. My Page (5개 섹션)
5. 프로젝트 페이지
6. 구독/결제 페이지
7. 관리자 대시보드
```

### 6.2 프로덕션 필수 작업

**반드시 완료해야 하는 것**:
1. ⚠️ RLS 정책 교체 (보안)
2. ⚠️ Supabase Auth 실제 연동
3. ⚠️ 토스 페이먼트 연동 (가맹점 심사 필요)
4. ⚠️ AI API 연동

### 6.3 선택 사항

**프로덕션 후 추가 가능**:
- Grid Viewer 고도화
- 실시간 알림 시스템
- 고급 분석 대시보드

---

## 7. 권장 진행 순서

```
1. PROJECT SAL GRID SQL 파일 생성 (58개 Task)
2. Supabase에 Grid 테이블 생성 및 데이터 삽입
3. Stage 2 (개발 준비) 시작
   - Next.js 프로젝트 생성
   - RLS 프로덕션 정책 적용
4. Stage 3 (개발 1차) - React 전환 & 인증
5. Stage 4 (개발 2차) - My Page & 프로젝트
6. Stage 5 (개발 3차) - 관리자 & AI
7. Stage 6 (운영) - 모니터링 & 유지보수
```

---

## 8. 결론

### 기존 86개 → 58개로 축소

**이유**:
- P3 프로토타입에서 S1 대부분 완료 (12→2)
- 관리자 대시보드 선행 구현으로 S5 일부 완료
- 중복/불필요 Task 정리

### 핵심 작업

1. **HTML → React 전환** (가장 큰 작업)
2. **Supabase Auth 연동**
3. **토스 페이먼트 연동**
4. **AI API 연동**
5. **테스트 & 배포**

---

**문서 작성 완료**: 2025-12-13
**작성자**: Claude Code
