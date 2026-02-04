# 📋 앞으로 해야 할 작업 목록

**작성일**: 2025-12-03
**작성자**: Claude Code
**목적**: Agenda #4~#8 실행을 위한 작업 순서 정리

---

## ✅ 완료된 작업

### 1. Agenda #1~#3 (완료됨)
- ✅ **Agenda #1**: 공지사항
- ✅ **Agenda #2**: 학습용 콘텐츠
- ✅ **Agenda #3**: FAQ

### 2. 구현 초안 작성 (완료됨)
- ✅ **Agenda #4**: 회원가입 & 인증 (`agenda4_implementation_draft.md`)
- ✅ **Agenda #5**: 프로젝트 관리 & 설치비 납부 (`agenda5_implementation_draft.md`)
- ✅ **Agenda #6**: 플랫폼 이용료 & 결제 관리 (`agenda6_implementation_draft.md`)
- ✅ **Agenda #7**: AI 크레딧 충전 & 사용 (`agenda7_implementation_draft.md`)

---

## 🔴 다음 작업: Agenda #4 실행 (최우선)

### Phase 1: Admin Dashboard 구현

#### 작업 1-1: 회원 관리 섹션 추가
**파일**: `P3_프로토타입_제작/admin-dashboard_prototype.html`

**할 일**:
- [ ] `agenda4_implementation_draft.md`의 "1-1. 회원 관리 섹션" 코드 복사
- [ ] admin-dashboard_prototype.html에 섹션 추가
- [ ] 네비게이션 메뉴에 "회원 관리" 버튼 추가
- [ ] 초기 로딩 함수 `loadUsers()` 호출 추가

**검증**:
- [ ] 회원 목록이 표시되는가?
- [ ] 검색 기능이 작동하는가?
- [ ] 상세 보기 모달이 표시되는가?

---

### Phase 2: Database 구현

#### 작업 2-1: users 테이블 생성
**파일**: `P3_프로토타입_제작/Database/12_create_users.sql`

**할 일**:
- [ ] SQL 파일 생성 (agenda4 초안의 "2-1" 참고)
- [ ] Supabase SQL Editor에서 실행
- [ ] 테이블 생성 확인 (`SELECT * FROM users LIMIT 1;`)

**검증**:
- [ ] users 테이블이 생성되었는가?
- [ ] 모든 컬럼이 올바르게 생성되었는가?
- [ ] 인덱스가 생성되었는가?

#### 작업 2-2: users RLS 정책 적용 (개발용)
**파일**: `P3_프로토타입_제작/Database/13_users_rls_dev.sql`

**할 일**:
- [ ] 개발용 RLS SQL 파일 생성
- [ ] Supabase SQL Editor에서 실행
- [ ] RLS 정책 확인 (`SELECT * FROM pg_policies WHERE tablename = 'users';`)

**검증**:
- [ ] RLS가 활성화되었는가?
- [ ] anon 역할로 SELECT/INSERT/UPDATE/DELETE가 가능한가?

**⚠️ 중요**: 프로덕션 배포 전 `13_users_rls.sql` (인증 정책)로 교체 필수!

#### 작업 2-3: users 샘플 데이터 삽입
**파일**: `P3_프로토타입_제작/Database/14_users_sample_data.sql`

**할 일**:
- [ ] 샘플 데이터 SQL 파일 생성
- [ ] Supabase SQL Editor에서 실행
- [ ] 데이터 확인 (`SELECT * FROM users;`)

**검증**:
- [ ] 샘플 사용자가 생성되었는가?
- [ ] user_id가 8자리 영숫자로 생성되었는가?

---

### Phase 3: Frontend 구현

#### 작업 3-1: 회원가입 페이지
**파일**: `P3_프로토타입_제작/Frontend/signup.html`

**할 일**:
- [ ] agenda4 초안의 "3-1" 전체 코드 복사
- [ ] signup.html 파일 생성
- [ ] Supabase URL 및 Anon Key 설정
- [ ] 로컬에서 테스트 (Live Server 등)

**검증**:
- [ ] 회원가입 폼이 올바르게 표시되는가?
- [ ] 이메일 중복 검사가 작동하는가?
- [ ] 비밀번호 검증이 작동하는가?
- [ ] user_id가 자동 생성되는가?
- [ ] 회원가입 완료 후 환영 팝업이 표시되는가?
- [ ] users 테이블에 데이터가 삽입되는가?

#### 작업 3-2: 로그인 페이지
**파일**: `P3_프로토타입_제작/Frontend/login.html`

**할 일**:
- [ ] agenda4 초안의 "3-2" 전체 코드 복사
- [ ] login.html 파일 생성
- [ ] Supabase Auth 설정
- [ ] 세션 관리 구현

**검증**:
- [ ] 로그인이 작동하는가?
- [ ] 세션이 유지되는가?
- [ ] 로그인 후 Dashboard로 리다이렉트되는가?

#### 작업 3-3: My Page (프로필 섹션)
**파일**: `P3_프로토타입_제작/Frontend/mypage.html`

**할 일**:
- [ ] agenda4 초안의 "3-3" 전체 코드 복사
- [ ] mypage.html 파일 생성
- [ ] 프로필 정보 표시 구현
- [ ] 닉네임 변경 기능 구현
- [ ] 비밀번호 변경 기능 구현

**검증**:
- [ ] 로그인한 사용자의 정보가 표시되는가?
- [ ] 닉네임 변경이 작동하는가?
- [ ] 비밀번호 변경이 작동하는가?

---

### Phase 4: Agenda #4 최종 검증

**종합 검증**:
- [ ] Admin Dashboard에서 회원 목록이 표시되는가?
- [ ] 회원가입이 정상적으로 작동하는가?
- [ ] 로그인 후 세션이 유지되는가?
- [ ] My Page에서 정보 수정이 가능한가?
- [ ] 모든 CRUD 작업이 Supabase에 반영되는가?

**완료 조건**:
- [ ] 모든 검증 항목 통과
- [ ] `.claude/work_logs/current.md`에 작업 내역 기록
- [ ] `PROJECT_STATUS.md` 업데이트 (Agenda #4 완료)

---

## 🟡 이후 작업: Agenda #5 실행

### Phase 1: Admin Dashboard
- [ ] 설치비 관리 섹션 추가
- [ ] 프로젝트 관리 섹션 추가

### Phase 2: Database
- [ ] `projects` 테이블 생성 (`15_create_projects.sql`)
- [ ] `installation_payment_requests` 테이블 생성 (`16_create_installation_payment_requests.sql`)
- [ ] RLS 정책 적용 (개발용: `17_projects_rls_dev.sql`)
- [ ] 샘플 데이터 삽입 (`18_sample_projects.sql`)

### Phase 3: Frontend
- [ ] 설치비 안내 페이지 (`/payment/installation`)
- [ ] 입금 안내 페이지 (`/payment/installation-deposit`)
- [ ] 입금 확인 대기 화면 (`/payment/installation-pending`)
- [ ] 프로젝트 목록 페이지 (`/projects`)
- [ ] 프로젝트 등록 페이지 (`/projects/new`)
- [ ] PROJECT SAL Grid 초기 화면 (`/projects/{id}/grid`)

### Phase 4: 최종 검증
- [ ] 설치비 입금 확인 요청이 작동하는가?
- [ ] Admin에서 승인 시 사용자 계정이 활성화되는가?
- [ ] AI 크레딧 ₩5,000이 자동 지급되는가?
- [ ] 프로젝트 등록이 작동하는가?
- [ ] 진행 중인 프로젝트가 1개로 제한되는가?

---

## 🟡 이후 작업: Agenda #6 실행

### Phase 1: Admin Dashboard
- [ ] 결제 관리 섹션 추가
- [ ] 구독 현황 대시보드 추가

### Phase 2: Database
- [ ] `payment_methods` 테이블 생성 (`19_create_payment_methods.sql`)
- [ ] `billing_history` 테이블 생성 (`20_create_billing_history.sql`)
- [ ] RLS 정책 적용 (개발용: `21_billing_rls_dev.sql`)
- [ ] 샘플 데이터 삽입 (`22_sample_billing.sql`)

### Phase 3: Frontend
- [ ] 결제 수단 등록 페이지 (`/subscription/payment-method`)
- [ ] 결제 내역 조회 페이지 (`/subscription/billing-history`)
- [ ] 구독 일시정지 페이지 (`/subscription/pause`)
- [ ] 구독 해지 페이지 (`/subscription/cancel`)
- [ ] 수동 결제 페이지 (`/subscription/manual-payment`)

### Phase 4: 토스 페이먼트 연동
- [ ] 토스 페이먼트 계정 생성 및 API 키 발급
- [ ] 빌링키 발급 기능 구현
- [ ] 자동 결제 기능 구현
- [ ] 환불 API 연동

### Phase 5: 최종 검증
- [ ] 결제 수단 등록이 작동하는가?
- [ ] 자동 결제가 실행되는가?
- [ ] 결제 실패 시 재시도가 작동하는가?
- [ ] 환불 처리가 작동하는가?

---

## 🟡 이후 작업: Agenda #7 실행

### Phase 1: Admin Dashboard
- [ ] AI 크레딧 관리 섹션 추가
- [ ] AI 가격 관리 섹션 추가

### Phase 2: Database
- [ ] `credit_balance` 테이블 생성 (`23_create_credit_balance.sql`)
- [ ] `credit_transactions` 테이블 생성 (`24_create_credit_transactions.sql`)
- [ ] `ai_service_pricing` 테이블 생성 (`25_create_ai_service_pricing.sql`)
- [ ] `ai_usage_log` 테이블 생성 (`26_create_ai_usage_log.sql`)
- [ ] RLS 정책 적용 (개발용: `27_credit_rls_dev.sql`)

### Phase 3: Frontend
- [ ] 크레딧 잔액 위젯 구현 (우측 상단, 실시간)
- [ ] 크레딧 충전 페이지 (`/credit/purchase`)
- [ ] 크레딧 사용 내역 페이지 (`/credit/history`)
- [ ] AI Q&A 페이지 (`/ai/qa`)

### Phase 4: AI API 연동
- [ ] OpenAI API 키 발급 및 연동 (ChatGPT)
- [ ] Google Gemini API 키 발급 및 연동
- [ ] Perplexity API 키 발급 및 연동
- [ ] 실시간 가격 조회 기능 구현

### Phase 5: 최종 검증
- [ ] 크레딧 충전이 작동하는가?
- [ ] AI Q&A에서 질문/응답이 작동하는가?
- [ ] 크레딧 차감이 올바르게 이루어지는가?
- [ ] 사용 내역이 기록되는가?
- [ ] 실시간 잔액 업데이트가 작동하는가?

---

## 🟢 최종 작업: Agenda #8 실행 (My Page 통합)

### Phase 1: My Page 통합

**전제 조건**:
- ✅ Agenda #4 완료 (프로필 섹션)
- ✅ Agenda #5 완료 (프로젝트 섹션)
- ✅ Agenda #6 완료 (구독 섹션)
- ✅ Agenda #7 완료 (크레딧 섹션)

**할 일**:
- [ ] 4개 섹션을 하나의 페이지로 통합
- [ ] 탭 또는 Accordion 방식 레이아웃 구현
- [ ] 반응형 디자인 적용 (데스크톱/태블릿/모바일)

### Phase 2: 데이터 로딩 최적화
- [ ] 4개 테이블 동시 조회 (병렬 처리)
- [ ] 로딩 인디케이터 표시
- [ ] 에러 핸들링

### Phase 3: 실시간 업데이트
- [ ] Supabase Realtime 연동
- [ ] 크레딧 잔액 실시간 반영
- [ ] 구독 상태 실시간 반영

### Phase 4: UX 개선
- [ ] 빠른 액션 버튼 (충전, 결제, 프로젝트 이동)
- [ ] 스켈레톤 로딩
- [ ] 부드러운 애니메이션 (fade-in, slide-up)

### Phase 5: 최종 검증
- [ ] 모든 섹션이 올바르게 표시되는가?
- [ ] 데이터가 올바르게 로딩되는가?
- [ ] 실시간 업데이트가 작동하는가?
- [ ] 모바일에서 반응형이 작동하는가?

---

## ⚠️ 프로덕션 배포 전 필수 작업

### 1. RLS 정책 교체
- [ ] `learning_contents`: 개발용 → 프로덕션용
- [ ] `faqs`: 개발용 → 프로덕션용
- [ ] `projects`: 개발용 → 프로덕션용
- [ ] `payment_methods`: 개발용 → 프로덕션용
- [ ] `billing_history`: 개발용 → 프로덕션용
- [ ] `credit_balance`: 개발용 → 프로덕션용
- [ ] `credit_transactions`: 개발용 → 프로덕션용
- [ ] `ai_usage_log`: 개발용 → 프로덕션용

**교체 방법**:
1. 개발용 정책 모두 삭제 (`DROP POLICY IF EXISTS ...`)
2. 프로덕션용 정책 적용 (authenticated 역할 사용)

### 2. Admin Dashboard 인증
- [ ] Admin 전용 로그인 구현
- [ ] authenticated 역할로 접근 제한
- [ ] 관리자 권한 확인 로직 추가

### 3. API 키 보안
- [ ] 환경 변수로 API 키 분리
- [ ] .env 파일 생성 (개발/프로덕션 분리)
- [ ] .gitignore에 .env 추가

### 4. 최종 테스트
- [ ] 모든 기능 E2E 테스트
- [ ] 결제 시스템 실제 결제 테스트
- [ ] AI API 실제 호출 테스트
- [ ] 부하 테스트 (동시 접속 100명)

---

## 📊 진행 상황 요약

| 아젠다 | 상태 | 진행률 | 비고 |
|-------|------|--------|------|
| #1 공지사항 | ✅ 완료 | 100% | - |
| #2 학습용 콘텐츠 | ✅ 완료 | 100% | RLS 개발용 적용 중 |
| #3 FAQ | ✅ 완료 | 100% | RLS 개발용 적용 중 |
| #4 회원가입 & 인증 | 🔴 다음 작업 | 0% | 구현 초안 완료 |
| #5 프로젝트 & 설치비 | ⏳ 대기 | 0% | 구현 초안 완료 |
| #6 결제 & 구독 | ⏳ 대기 | 0% | 구현 초안 완료 |
| #7 AI 크레딧 | ⏳ 대기 | 0% | 구현 초안 완료 |
| #8 My Page 통합 | ⏸️ 대기 | 0% | #4~#7 완료 후 시작 |

---

## 🎯 추천 작업 순서

### 1주차: Agenda #4 (회원가입 & 인증)
**Day 1-2**: Admin Dashboard + Database
**Day 3-4**: Frontend (회원가입, 로그인)
**Day 5**: My Page (프로필 섹션) + 검증

### 2주차: Agenda #5 (프로젝트 & 설치비)
**Day 1-2**: Admin Dashboard + Database
**Day 3-4**: Frontend (설치비, 프로젝트 등록)
**Day 5**: PROJECT SAL Grid + 검증

### 3주차: Agenda #6 (결제 & 구독)
**Day 1**: Admin Dashboard + Database
**Day 2-3**: Frontend (결제 수단, 결제 내역)
**Day 4**: 토스 페이먼트 연동
**Day 5**: 검증

### 4주차: Agenda #7 (AI 크레딧)
**Day 1**: Admin Dashboard + Database
**Day 2**: Frontend (크레딧 위젯, 충전)
**Day 3-4**: AI Q&A 페이지 + AI API 연동
**Day 5**: 검증

### 5주차: Agenda #8 (My Page 통합) + 배포 준비
**Day 1-2**: My Page 통합
**Day 3**: RLS 정책 교체 (프로덕션)
**Day 4**: 최종 테스트
**Day 5**: 배포

---

## 📝 작업 시 주의사항

### 1. 파일 저장 위치
- **Admin Dashboard**: `P3_프로토타입_제작/admin-dashboard_prototype.html`
- **Database SQL**: `P3_프로토타입_제작/Database/`
- **Frontend**: `P3_프로토타입_제작/Frontend/`

### 2. Supabase 설정
- **URL**: Supabase 프로젝트 Settings → API → Project URL
- **Anon Key**: Supabase 프로젝트 Settings → API → anon/public key

### 3. 작업 완료 시 필수
- [ ] `.claude/work_logs/current.md` 업데이트
- [ ] `PROJECT_STATUS.md` 업데이트
- [ ] 검증 체크리스트 완료
- [ ] Git commit (변경 사항)

### 4. 문제 발생 시
1. `.claude/CLAUDE.md`의 "작업 6대 원칙" 확인
2. Supabase 콘솔에서 에러 로그 확인
3. 브라우저 개발자 도구 (F12) 콘솔 확인
4. RLS 정책이 올바르게 적용되었는지 확인

---

**작성 완료**: 2025-12-03
**다음 확인**: 내일 (2025-12-04) Agenda #4 실행 시작
**예상 완료**: 5주 후 (2026-01-07)

모든 구현 초안이 준비되어 있으니, 이 TODO 리스트에 따라 순차적으로 진행하시면 됩니다! 🚀
