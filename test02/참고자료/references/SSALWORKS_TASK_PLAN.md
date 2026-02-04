# SSALWorks Task 기획서 [★ 실전용 ★]

> **작성일**: 2025-11-27
> **수정일**: 2025-12-12
> **버전**: v3.0
> **프로젝트**: SSALWorks v1.0 (프로덕션)
> **총 Task 수**: 42개 (GRID 관리 범위: S1-S5)
> **유형**: ★ 실전용 (템플릿 아님) ★
> **아키텍처**: HTML + Serverless Functions (Vercel)

---

## 1. 개요

이 문서는 SSALWorks v1.0 프로덕션 개발을 위한 **실전용** 상세 Task 기획서입니다.
PROJECT SAL GRID 5×11 매트릭스 체계에 따라 작성되었습니다.

> **중요 변경사항 (v3.0)**:
> - **아키텍처 확정**: HTML + Serverless (Next.js 전환 불필요)
> - **P3 중복 제거**: 이미 완료된 UI 관련 Task 제거
> - **누락 항목 추가**: Vercel, Google OAuth, Resend, 결제, 도메인 등
> - **PoliticianFinder 프로젝트 참조하여 실전 검증됨**
> - **50 tasks → 42 tasks**로 최적화 (GRID 자체 기능 6개 제거)

### 아키텍처 결정 배경

**P3에서 완료된 것:**
- ✅ 모든 프론트엔드 UI (HTML/CSS/JS)
- ✅ Supabase 직접 연결 (공개 데이터)
- ✅ 기본 인증 플로우
- ✅ 그리드 뷰어 UI
- ✅ Books 콘텐츠 뷰어

**S1-S5에서 해야 할 것:**
- Serverless API (결제, AI 등 보안 필요 기능)
- Google OAuth 연동
- Resend 이메일 서비스
- AI 연동 (Gemini, ChatGPT, Perplexity 3개)
- 결제 시스템 (토스 페이먼트)
- Vercel 배포 및 도메인 연결
- 테스트 및 품질 보증

### 프로세스 구조

```
╔═══════════════════════════════════════════════════════════════════════╗
║              PRELIMINARY (예비단계) - GRID 범위 밖                     ║
╠═══════════════════════════════════════════════════════════════════════╣
║   [P1 사업계획] ──→ [P2 프로젝트 기획] ──→ [P3 프로토타입 제작] ✅     ║
║                                                     (완료됨)           ║
║   - 모든 HTML/CSS/JS UI 완성                                          ║
║   - Supabase 직접 연결 완성                                            ║
║   - 기본 인증 완성                                                     ║
╚═══════════════════════════════════════════════════════════════════════╝
                              │
                              ▼
╔═══════════════════════════════════════════════════════════════════════╗
║                PROJECT SAL GRID 관리 범위 (S1-S5)                     ║
╠═══════════════════════════════════════════════════════════════════════╣
║   Stage 1: 개발 준비 (8 tasks) - Vercel/도메인/환경 설정              ║
║   Stage 2: 개발 1차 (12 tasks) - OAuth/이메일/핵심 API                ║
║   Stage 3: 개발 2차 (4 tasks) - AI연동/구독권한                       ║
║   Stage 4: 개발 3차 (10 tasks) - 결제/관리자/테스트                   ║
║   Stage 5: 운영 (8 tasks) - 배포/도메인연결/운영                      ║
║                                                                       ║
║   ※ GRID 자체 기능(뷰어, Task CRUD)은 GRID 생성 단계에서 별도 처리   ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### Task 분포 요약

| Stage | 설명 | Task 수 |
|-------|------|---------|
| S1 개발 준비 | Vercel 설정 + 환경 준비 | 8 |
| S2 개발 1차 | OAuth + 이메일 + 핵심 API | 12 |
| S3 개발 2차 | AI 연동 + 구독 권한 | 4 |
| S4 개발 3차 | 결제 + 관리자 + QA | 10 |
| S5 운영 | 배포 + 도메인 + 유지보수 | 8 |
| **합계** | | **42** |

### Area별 분포

| Stage | M | U | F | BI | BA | D | S | T | O | E | C | 합계 |
|-------|---|---|---|----|----|----|---|---|---|---|---|------|
| S1 | 1 | - | 2 | 1 | - | 1 | 1 | 1 | 1 | - | - | **8** |
| S2 | 1 | - | 2 | 2 | 3 | 1 | 1 | 1 | - | - | 1 | **12** |
| S3 | - | - | - | 1 | 1 | - | 1 | - | - | 1 | - | **4** |
| S4 | 1 | - | 2 | 1 | 2 | - | 1 | 2 | 1 | - | - | **10** |
| S5 | 1 | - | 1 | - | 1 | 1 | 1 | - | 3 | - | - | **8** |
| **합계** | 4 | 0 | 7 | 5 | 7 | 3 | 5 | 4 | 5 | 1 | 1 | **42** |

> **참고**:
> - Area U (UI/UX)는 P3에서 모두 완료되어 S1-S5에서는 Task 없음
> - Project SAL GRID 자체 기능(그리드 뷰어, Task CRUD 등)은 GRID 생성 단계에서 별도 처리

---

## 2. Stage 1: 개발 준비 (8 Tasks)

> **목표**: Vercel 배포 환경 + 도메인 + 인프라 설정
> **Areas**: M(1), F(2), BI(1), D(1), S(1), T(1), O(1)

### Area M - Manual/Documentation (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S1M1 | 개발 가이드 | 코딩 컨벤션, 파일 명명 규칙, Serverless API 구조 | - |

### Area F - Frontend (2)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S1F1 | Vercel 프로젝트 설정 | Vercel 프로젝트 생성, Git 연결, 프레임워크 설정 | - |
| S1F2 | vercel.json 설정 | 빌드 설정, 라우팅, 보안 헤더, CORS 설정 | S1F1 |

### Area BI - Backend Infrastructure (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S1BI1 | 환경변수 설정 | .env 파일 구조, Vercel 환경변수 설정 | S1F1 |

### Area D - Database (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S1D1 | DB 스키마 확정 | 마이그레이션 파일 점검, RLS 정책 확인 | - |

### Area S - Security (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S1S1 | Supabase Auth Provider 설정 | Google OAuth Provider 설정, Redirect URL 등록 | S1BI1 |

### Area T - Test (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S1T1 | 테스트 환경 설정 | Jest/Vitest 설정, Playwright 설정 | S1F1 |

### Area O - Operations (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S1O1 | DNS 설정 | DNS 레코드 설정, Vercel 연결 준비 (도메인은 P2에서 구매 완료) | - |

---

## 3. Stage 2: 개발 1차 (12 Tasks)

> **목표**: Google OAuth + 이메일 서비스 + 핵심 API 완성
> **Areas**: M(1), F(2), BI(2), BA(3), D(1), S(1), T(1), C(1)

### Area M - Manual/Documentation (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S2M1 | API 문서 v1 | Serverless API 명세서 (인증/구독 API) | S2BA1, S2BA2, S2BA3 |

### Area F - Frontend (2)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S2F1 | Google 소셜 로그인 UI | Google 로그인 버튼, OAuth 콜백 페이지 | S2BA1 |
| S2F2 | 비밀번호 재설정 UI | 이메일 인증 기반 재설정 폼 + 이메일 전송 연동 | S2BA2 |

### Area BI - Backend Infrastructure (2)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S2BI1 | Resend 이메일 서비스 설정 | Resend API 키 설정, 도메인 인증, 발신자 설정 | S1BI1 |
| S2BI2 | 에러 핸들링 시스템 | 전역 에러 처리, 토스트 알림, 에러 로깅 | - |

### Area BA - Backend APIs (3)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S2BA1 | Google OAuth Serverless API | /api/auth/google, /api/auth/google/callback | S1S1 |
| S2BA2 | 이메일 발송 API (Resend) | 비밀번호 재설정, 환영 메일 API | S2BI1 |
| S2BA3 | 구독 관리 API | 구독 신청/상태 조회/해지 API | S1D1 |

### Area D - Database (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S2D1 | 인덱스 최적화 | 자주 사용 쿼리 인덱스 추가 | S1D1 |

### Area S - Security (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S2S1 | 인증 미들웨어 | Serverless API 인증 미들웨어, 토큰 검증 | S2BA1 |

### Area T - Test (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S2T1 | 인증 API 테스트 | OAuth/이메일 API 유닛 테스트 | S2BA1, S2BA2 |

### Area C - Content (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S2C1 | Books 콘텐츠 업로드 | Claude 사용법 기초 콘텐츠 등록 | S1D1 |

---

## 4. Stage 3: 개발 2차 (4 Tasks)

> **목표**: AI 연동 + 구독 권한
> **Areas**: BI(1), BA(1), S(1), E(1)
> **참고**: Project SAL GRID 자체 기능(그리드 뷰어, Task CRUD 등)은 GRID 생성 단계에서 별도 처리

### Area BI - Backend Infrastructure (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S3BI1 | AI API 클라이언트 통합 | Gemini, ChatGPT, Perplexity 3개 서비스 연동 구조 | - |

### Area BA - Backend APIs (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S3BA1 | AI Q&A API | Gemini, ChatGPT, Perplexity 프록시 API, 크레딧 차감 | S3BI1 |

### Area S - Security (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S3S1 | 구독 권한 체크 | Books/AI 접근 권한 검증 | S2S1 |

### Area E - External (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S3E1 | AI API 키 설정 | Gemini, ChatGPT, Perplexity API 키 환경변수 설정 | S1BI1 |

---

## 5. Stage 4: 개발 3차 (10 Tasks)

> **목표**: 결제 시스템 + 관리자 대시보드 + 품질 보증
> **Areas**: M(1), F(2), BI(1), BA(2), S(1), T(2), O(1)

### Area M - Manual/Documentation (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S4M1 | 관리자 가이드 | Admin Dashboard 사용법 | S4F1 |

### Area F - Frontend (2)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S4F1 | 관리자 대시보드 강화 | 통계, 사용자 관리, 구독 승인 | S4BA2 |
| S4F2 | AI Q&A 인터페이스 | Gemini/ChatGPT/Perplexity 선택, 질문 입력, 답변 표시, 크레딧 | S3BA2 |

### Area BI - Backend Infrastructure (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S4BI1 | Sentry 에러 트래킹 설정 | 클라이언트/서버 에러 모니터링 | S1BI1 |

### Area BA - Backend APIs (2)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S4BA1 | 결제 API (토스 페이먼트) | 결제 요청/확인 Serverless API | S2BA3 |
| S4BA2 | 결제 웹훅 API | 토스 결제 완료 콜백, 구독 상태 업데이트 | S4BA1 |

### Area S - Security (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S4S1 | 관리자 권한 체크 | Admin 전용 라우트 보호, 역할 검증 | S2S1 |

### Area T - Test (2)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S4T1 | E2E 테스트 | 주요 사용자 시나리오 (회원가입→결제→그리드) | S4F1 |
| S4T2 | API 통합 테스트 | 모든 Serverless API 엔드포인트 테스트 | S4BA2 |

### Area O - Operations (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S4O1 | Cron Jobs 설정 | 정기 작업 (구독 만료 체크, 통계 집계 등) | S1F2 |

---

## 6. Stage 5: 운영 (8 Tasks)

> **목표**: 프로덕션 배포 및 지속적 운영
> **Areas**: M(1), F(1), BA(1), D(1), S(1), O(3)

### Area M - Manual/Documentation (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S5M1 | 운영 매뉴얼 | 시스템 관리, 백업, 복구 절차, 장애 대응 | S5O1 |

### Area F - Frontend (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S5F1 | 버그 수정 (프론트엔드) | 보고된 버그 수정, UI/UX 개선 | S5O1 |

### Area BA - Backend APIs (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S5BA1 | API 버그 수정 및 최적화 | Serverless API 성능 개선, 버그 수정 | S5O1 |

### Area D - Database (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S5D1 | 데이터 백업 설정 | Supabase 자동 백업 확인, 복구 테스트 | S5O1 |

### Area S - Security (1)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S5S1 | 보안 점검 및 패치 | 취약점 스캔, 보안 패치, 의존성 업데이트 | S5O1 |

### Area O - Operations (3)

| Task ID | Task명 | 설명 | 의존성 |
|---------|--------|------|--------|
| S5O1 | 프로덕션 배포 | Vercel 프로덕션 배포, 환경변수 확인 | S4T2 |
| S5O2 | 도메인 연결 | 커스텀 도메인 Vercel 연결, DNS 최종 설정 | S5O1, S1O1 |
| S5O3 | SSL 인증서 확인 | HTTPS 설정 확인, 인증서 자동 갱신 확인 | S5O2 |

---

## 7. Task 의존성 다이어그램

### S1 (개발 준비) 의존성
```
S1F1 (Vercel 프로젝트) ──> S1F2 (vercel.json)
S1F1 ──> S1BI1 (환경변수) ──> S1S1 (Auth Provider)
S1F1 ──> S1T1 (테스트환경)
```

### S1 → S2 의존성
```
S1S1 (Auth Provider) ──> S2BA1 (OAuth API)
S1BI1 (환경변수) ──> S2BI1 (Resend 설정)
S1D1 (스키마) ──> S2D1 (인덱스)
S1D1 ──> S2BA3 (구독 API)
```

### S2 → S3 의존성
```
S2BA1 (OAuth) ──> S2S1 (인증 미들웨어) ──> S3S1 (구독 권한)
S1BI1 ──> S3E1 (Perplexity 키)
S1D1 ──> S3BA1 (Task API) ──> S3F1 (그리드 뷰어)
S3BI1 (API 클라이언트) ──> S3BA2 (AI API)
```

### S3 → S4 의존성
```
S3BA2 (AI API) ──> S4F2 (AI Q&A UI)
S2BA3 (구독 API) ──> S4BA1 (결제 API) ──> S4BA2 (웹훅)
S4BA2 ──> S4F1 (관리자 대시보드)
S2S1 ──> S4S1 (관리자 권한)
```

### S4 → S5 의존성
```
S4T2 (통합 테스트) ──> S5O1 (프로덕션 배포)
S5O1 ──> S5O2 (도메인 연결) ──> S5O3 (SSL)
S5O1 ──> S5M1, S5F1, S5BA1, S5D1, S5S1
```

### 전체 의존성 요약
```
                    S1 (8 tasks)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    Vercel설정      환경변수설정    DB스키마확정
         │               │               │
         └───────────────┼───────────────┘
                         ▼
                    S2 (12 tasks)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    OAuth API      이메일 API      구독 API
         │               │               │
         └───────────────┼───────────────┘
                         ▼
                    S3 (10 tasks)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    Task API        AI API         권한체크
         │               │               │
         └───────────────┼───────────────┘
                         ▼
                    S4 (10 tasks)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    결제 API        관리자           테스트
         │               │               │
         └───────────────┼───────────────┘
                         ▼
                    S5 (8 tasks)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
      배포          도메인연결        운영
```

---

## 8. Gate 체크리스트

### P3 → S1 Gate (프로토타입 → 개발준비) ✅ 완료
- [x] 프로토타입 핵심 기능 작동 (Agenda #1~#10 완료)
- [x] 모든 HTML/CSS/JS UI 완성
- [x] Supabase 직접 연결 작동
- [x] 개발 범위 확정 (HTML + Serverless)

### S1 → S2 Gate (개발준비 → 개발1차)
- [ ] Vercel 프로젝트 설정 완료
- [ ] vercel.json 보안 헤더 설정
- [ ] 환경변수 설정 완료
- [ ] DNS 설정 완료 (도메인은 P2에서 구매 완료)
- [ ] Google OAuth Provider 설정 완료

### S2 → S3 Gate (개발1차 → 개발2차)
- [ ] Google OAuth 로그인 작동
- [ ] Resend 이메일 발송 작동
- [ ] 구독 API 작동
- [ ] 인증 API 테스트 통과

### S3 → S4 Gate (개발2차 → 개발3차)
- [ ] AI Q&A API 작동 (Gemini, ChatGPT, Perplexity)
- [ ] 구독 권한 체크 작동

### S4 → S5 Gate (개발3차 → 운영)
- [ ] 결제 시스템 작동 (토스 페이먼트)
- [ ] 관리자 대시보드 완성
- [ ] E2E 테스트 통과
- [ ] API 통합 테스트 통과
- [ ] Sentry 에러 트래킹 설정 완료

---

## 9. 변경 이력

### v3.0 (2025-12-12)
- **아키텍처 확정**: HTML + Serverless (Next.js 전환 불필요)
- **P3 중복 제거**: UI 관련 Task 모두 제거
- **GRID 자체 기능 분리**: 그리드 뷰어, Task CRUD 등 6개 Task 제거 (GRID 생성 단계에서 별도 처리)
- **AI 연동 3개 반영**: Gemini, ChatGPT, Perplexity
- **누락 항목 추가**:
  - Vercel 프로젝트 설정 (S1F1, S1F2)
  - Google OAuth API (S2BA1)
  - Resend 이메일 서비스 (S2BI1, S2BA2)
  - 결제 API (S4BA1, S4BA2)
  - DNS/도메인 연결 설정 (S1O1, S5O2, S5O3) - 도메인은 P2에서 구매 완료
  - Sentry 에러 트래킹 (S4BI1)
  - Cron Jobs (S4O1)
- **Task 수 최적화**: 50 → 42 tasks
- PoliticianFinder 프로젝트 참조하여 실전 검증

### v2.0 (2025-12-12)
- **구조 변경**: S1-S6 (86 tasks) → S1-S5 (50 tasks)
- **P1-P3**: GRID 범위 밖으로 분리
- Gate 체크리스트 추가
- 의존성 다이어그램 업데이트

### v1.0 (2025-11-27)
- 초기 Task 기획서 작성
- 총 86개 Task 정의
- 6개 Stage별 Task 배분

---

## 10. 참고 문서

| 문서 | 위치 |
|------|------|
| 5×11 매트릭스 | `Project-SSAL-Grid/manual/references/SSALWORKS_5x11_MATRIX.md` |
| Task 선정 매트릭스 | `Project-SSAL-Grid/manual/references/TASK_SELECTION_MATRIX.md` |
| 프로세스 워크플로우 | `Development_Process_Monitor/DEVELOPMENT_PROCESS_WORKFLOW.md` |
| PROJECT SAL GRID 매뉴얼 | `Project-SSAL-Grid/manual/PROJECT_SSAL_GRID_MANUAL.md` |
| PoliticianFinder (참조) | `C:\Development_PoliticianFinder_com\Developement_Real_PoliticianFinder` |

---

## 11. 병렬 작업 가능 Task

### S1 병렬 작업
```
┌─ S1M1 (개발 가이드)
├─ S1D1 (DB 스키마 확정)     ── 동시 진행 가능
└─ S1O1 (도메인 구매)
```

### S2 병렬 작업
```
S2BA1 (OAuth API) 완료 후:
┌─ S2F1 (Google 로그인 UI)
├─ S2T1 (인증 API 테스트)     ── 동시 진행 가능
└─ S2C1 (Books 콘텐츠)

S2BI1 (Resend 설정) 완료 후:
┌─ S2BA2 (이메일 API)
└─ S2F2 (비밀번호 재설정 UI)   ── 동시 진행 가능
```

### S3 병렬 작업
```
┌─ S3BA1 (Task API)
└─ S3BA2 (AI API)              ── 동시 진행 가능 (의존성 다름)

S3BA1 완료 후:
┌─ S3F1 (그리드 뷰어)
├─ S3F2 (Task 팝업)
└─ S3F3 (Export)               ── 순차 진행
```

### S4 병렬 작업
```
┌─ S4BA1 (결제 API)
├─ S4BI1 (Sentry)              ── 동시 진행 가능
└─ S4S1 (관리자 권한)

S4BA2 완료 후:
┌─ S4F1 (관리자 대시보드)
└─ S4T1 (E2E 테스트)           ── 동시 진행 가능
```

---

**문서 끝**
