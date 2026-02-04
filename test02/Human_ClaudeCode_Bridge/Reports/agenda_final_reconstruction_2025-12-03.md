# 📋 최종 아젠다 재구성 (2025-12-03)

**작성일**: 2025-12-03
**원칙**: Admin → Database → Frontend 3단계 통합 방식

---

## 🎯 아젠다 구성 원칙

### 3단계 플로우 (필수):
1. **Admin Dashboard** (입력/관리)
2. **Database (Supabase)** (저장)
3. **Frontend** (표시/사용)

### 각 아젠다는 반드시:
- ✅ Admin에서 데이터를 입력/관리할 수 있어야 함
- ✅ Supabase에 저장되어야 함
- ✅ Frontend에서 조회/사용할 수 있어야 함

---

## ✅ 완료된 아젠다 (3개)

### Agenda #1: 공지사항 (Notices) ✅
- **Admin**: 공지사항 작성/수정/삭제
- **Database**: `notices` 테이블
- **Frontend**: 공지사항 섹션 표시

### Agenda #2: 학습용 콘텐츠 (Learning Contents) ✅
- **Admin**: 3단계 트리 구조 관리 (대/중/소분류)
- **Database**: `learning_contents` 테이블
- **Frontend**: Accordion 방식 학습 콘텐츠 표시

### Agenda #3: FAQ (자주 묻는 질문) ✅
- **Admin**: FAQ 작성/수정/삭제, 카테고리 관리
- **Database**: `faqs` 테이블
- **Frontend**: FAQ 섹션 (Accordion)

---

## 🆕 새로운 아젠다 (5개)

---

## 📋 Agenda #4: 회원가입 & 인증 시스템

### 🎯 목표
사용자가 회원가입/로그인하고 플랫폼을 이용할 수 있도록 함

### 1️⃣ Admin Dashboard (관리)
**화면**: 회원 관리 섹션

**기능**:
- 회원 목록 조회 (테이블 형식)
  - 회원 ID, 이메일, 닉네임, 실명, 가입일
  - 구독 상태, 설치비 납부 여부
- 회원 검색 (이메일, 닉네임, 회원 ID)
- 회원 상세 정보 조회
- 회원 상태 변경 (활성/정지/탈퇴)
- 비밀번호 초기화 (관리자 권한)

**현재 구현 상태**: ❌ 미구현 (신규 추가 필요)

---

### 2️⃣ Database (Supabase)
**테이블**: `users`

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,           -- A3B5C7D9 (8자리)
    email TEXT UNIQUE NOT NULL,
    nickname TEXT UNIQUE NOT NULL,
    real_name TEXT NOT NULL,
    subscription_status TEXT DEFAULT 'free', -- free/active/paused/suspended/cancelled
    installation_fee_paid BOOLEAN DEFAULT false,
    installation_date TIMESTAMPTZ,
    platform_fee_start_date TIMESTAMPTZ,
    credit_balance INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
```

**Supabase Auth 연동**:
- `supabase.auth.signUp()` → users 테이블 레코드 자동 생성
- `supabase.auth.signIn()` → 세션 관리
- RLS 정책 설정 (사용자는 본인 정보만 조회/수정)

---

### 3️⃣ Frontend (표시/사용)
**화면**:

**A) `/signup` - 회원가입**
- 회원가입 폼
  - 이메일 (필수)
  - 비밀번호 (필수, 8자 이상)
  - 비밀번호 확인 (필수)
  - 닉네임 (필수, 2-20자)
  - 실명 (필수, 2-50자)
- 약관 동의
  - 서비스 이용약관 (필수)
  - 개인정보 처리방침 (필수)
  - 마케팅 수신 (선택)
- 회원 ID 자동 생성 (8자리 영숫자)
- 환영 팝업 (무료 기능 안내)

**B) `/login` - 로그인**
- 이메일 + 비밀번호
- "Remember Me" 체크박스
- "비밀번호 찾기" 링크

**C) `/mypage` - My Page (프로필 섹션)**
- 내 정보 표시
  - 회원 ID
  - 이메일
  - 닉네임
  - 가입일
- 닉네임 변경
- 비밀번호 변경
- 회원 탈퇴

**현재 구현 상태**: ❌ 모두 미구현 (신규 추가 필요)

---

### ✅ Agenda #4 체크리스트
- [ ] **Admin**: 회원 관리 섹션 구현
- [ ] **Database**: `users` 테이블 생성 SQL 작성 및 실행
- [ ] **Database**: Supabase Auth 설정
- [ ] **Database**: RLS 정책 설정
- [ ] **Frontend**: 회원가입 페이지 구현
- [ ] **Frontend**: 로그인 페이지 구현
- [ ] **Frontend**: My Page 기본 틀 구현 (프로필 섹션)

---

## 📋 Agenda #5: 프로젝트 등록 & 설치비 납부

### 🎯 목표
사용자가 설치비를 납부하고 프로젝트를 등록/관리할 수 있도록 함

### 1️⃣ Admin Dashboard (관리)
**화면**:

**A) 설치비 관리 섹션**
- 입금 대기 목록
  - 사용자 정보 (회원 ID, 이메일, 실명)
  - 입금 요청일
  - 입금자명 확인
  - 금액 확인 (₩3,000,000)
- "승인" 버튼
  - 클릭 시: `installation_fee_paid = true`
  - 크레딧 ₩5,000 자동 지급
  - 사용자에게 알림 발송
- "거부" 버튼 (입금자명 불일치 등)
  - 사유 입력
  - 사용자에게 문의 발송

**B) 프로젝트 관리 섹션**
- 전체 프로젝트 목록
  - 프로젝트 ID, 프로젝트명, 사용자, 상태, 진행률
- 프로젝트 검색 (프로젝트 ID, 사용자 ID, 프로젝트명)
- 프로젝트 상세 조회
- 프로젝트 상태 변경 (관리자 권한)

**현재 구현 상태**: ❌ 미구현 (신규 추가 필요)

---

### 2️⃣ Database (Supabase)
**테이블 1**: `users` (수정)
```sql
-- 이미 Agenda #4에서 생성됨
-- installation_fee_paid, installation_date 컬럼 활용
```

**테이블 2**: `projects` (신규)
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(user_id),
    project_id TEXT UNIQUE NOT NULL,        -- A3B5C7D9-P001
    project_name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'in_progress',      -- in_progress/completed/archived
    progress INTEGER DEFAULT 0,             -- 0-100
    current_stage INTEGER DEFAULT 0,        -- 0-5
    total_stages INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 인덱스
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_project_id ON projects(project_id);

-- 제약 조건: 한 사용자당 진행 중인 프로젝트 1개만
CREATE UNIQUE INDEX idx_one_in_progress_per_user
ON projects(user_id)
WHERE status = 'in_progress';
```

**테이블 3**: `installation_payment_requests` (신규)
```sql
CREATE TABLE installation_payment_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(user_id),
    depositor_name TEXT NOT NULL,
    amount INTEGER DEFAULT 3000000,
    status TEXT DEFAULT 'pending',          -- pending/approved/rejected
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    processed_by UUID,                      -- 관리자 ID
    reject_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_requests_status ON installation_payment_requests(status);
CREATE INDEX idx_payment_requests_user_id ON installation_payment_requests(user_id);
```

---

### 3️⃣ Frontend (표시/사용)
**화면**:

**A) `/payment/installation` - 설치비 안내**
- 설치비 정보 표시 (₩3,000,000)
- 포함 내용 안내
- 특별 혜택 (50% 환불 조건)
- 입금 정보 표시
  - 은행: 하나은행
  - 계좌번호: 287-910921-40507
  - 예금주: 선웅규
  - 입금자명: (회원가입 시 입력한 실명)
- "입금 완료" 버튼
  - API 호출: `POST /api/payment/installation-confirm`
  - 입금 확인 요청 접수 안내

**B) `/projects` - 내 프로젝트 목록**
- 진행 중인 프로젝트 표시 (1개)
- 완료된 프로젝트 목록
- "새 프로젝트 등록" 버튼
  - 설치비 미납 → `/payment/installation` 리다이렉트
  - 진행 중인 프로젝트 있음 → 완료 유도 모달
  - 없음 → `/projects/new`

**C) `/projects/new` - 새 프로젝트 등록**
- 프로젝트명 입력 (필수)
- 프로젝트 설명 입력
- 프로젝트 ID 자동 생성 (`{회원ID}-P{순번}`)
- 등록 완료 후 사용 안내 팝업

**D) `/projects/{id}` - 프로젝트 상세**
- 프로젝트 정보
- PROJECT SAL Grid 진행 상황
- Order Sheet 발행 버튼

**E) `/mypage` - My Page (프로젝트 섹션 추가)**
- 설치비 납부 상태 표시
  - 미납: "설치비 납부하기" 버튼
  - 승인 대기: "입금 확인 대기 중"
  - 완료: "납부 완료" + 납부일
- 내 프로젝트 요약
  - 진행 중: 프로젝트명, 진행률
  - 완료: 개수

**현재 구현 상태**: ❌ 모두 미구현 (신규 추가 필요)

---

### ✅ Agenda #5 체크리스트
- [ ] **Admin**: 설치비 관리 섹션 구현
- [ ] **Admin**: 프로젝트 관리 섹션 구현
- [ ] **Database**: `projects` 테이블 생성
- [ ] **Database**: `installation_payment_requests` 테이블 생성
- [ ] **Frontend**: 설치비 안내 페이지 구현
- [ ] **Frontend**: 프로젝트 목록 페이지 구현
- [ ] **Frontend**: 프로젝트 등록 페이지 구현
- [ ] **Frontend**: My Page에 프로젝트 섹션 추가

---

## 📋 Agenda #6: 플랫폼 이용료 & 결제 관리

### 🎯 목표
월간 플랫폼 이용료를 자동 결제하고 구독을 관리함

### 1️⃣ Admin Dashboard (관리)
**화면**: 결제 관리 섹션

**기능**:
- 전체 구독 현황 대시보드
  - 활성 구독자 수
  - 이번 달 예상 매출
  - 결제 실패 건수
- 구독 목록
  - 사용자 정보, 구독 상태, 다음 결제일
  - 결제 성공/실패 표시
- 결제 실패 관리
  - 실패 사유
  - 재시도 횟수
  - "수동 결제 요청" 버튼
- 결제 내역 조회 (전체)
  - 날짜별 필터
  - 사용자별 필터
  - 결제 상태별 필터
- 환불 처리
  - 환불 사유 입력
  - 환불 금액 입력
  - "환불 승인" 버튼

**현재 구현 상태**: ❌ 미구현 (신규 추가 필요)

---

### 2️⃣ Database (Supabase)
**테이블 1**: `payment_methods` (신규)
```sql
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(user_id),
    payment_type TEXT NOT NULL,             -- card/bank
    card_last4 TEXT,                        -- 카드 마지막 4자리
    card_company TEXT,                      -- 카드사
    bank_name TEXT,                         -- 은행명
    account_last4 TEXT,                     -- 계좌 마지막 4자리
    is_default BOOLEAN DEFAULT true,
    toss_billing_key TEXT,                  -- 토스 페이먼트 빌링키
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
```

**테이블 2**: `billing_history` (신규)
```sql
CREATE TABLE billing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(user_id),
    billing_type TEXT NOT NULL,             -- platform_fee/credit_purchase
    amount INTEGER NOT NULL,
    status TEXT NOT NULL,                   -- paid/failed/refunded
    billing_date TIMESTAMPTZ NOT NULL,
    payment_method TEXT,                    -- card_****1234
    receipt_url TEXT,
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    refund_amount INTEGER,
    refund_date TIMESTAMPTZ,
    refund_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_billing_user_id ON billing_history(user_id);
CREATE INDEX idx_billing_date ON billing_history(billing_date);
CREATE INDEX idx_billing_status ON billing_history(status);
```

---

### 3️⃣ Frontend (표시/사용)
**화면**:

**A) `/subscription/payment-method` - 결제 수단 등록**
- 카드 자동결제
  - 카드번호, 유효기간, CVC, 소유자명
- 계좌 자동이체
  - 은행 선택, 계좌번호, 예금주
- 토스 페이먼트 연동
- "등록하기" 버튼

**B) `/subscription/billing-history` - 결제 내역**
- 현재 구독 상태 표시
  - 활성/일시정지/해지
  - 다음 결제일
  - 월 이용료 (₩50,000)
- 결제 내역 테이블
  - 날짜, 상태, 금액, 영수증
- "결제 수단 변경" 버튼
- "구독 일시정지" 버튼
- "구독 해지" 버튼

**C) `/subscription/pause` - 구독 일시정지**
- 일시정지 안내
- 일시정지 사유 선택
- "일시정지하기" 버튼

**D) `/subscription/cancel` - 구독 해지**
- 해지 경고
- 해지 사유 선택 (필수)
- "해지하기" 버튼

**E) `/subscription/manual-payment` - 수동 결제**
- 미납 금액 표시
- 결제 수단 선택
- "결제하기" 버튼

**F) `/mypage` - My Page (구독 섹션 추가)**
- 구독 정보
  - 현재 상태
  - 다음 결제일
  - 월 이용료
  - "결제 내역 보기" 버튼
  - "결제 수단 변경" 버튼

**현재 구현 상태**: ❌ 모두 미구현 (신규 추가 필요)

---

### ✅ Agenda #6 체크리스트
- [ ] **Admin**: 결제 관리 섹션 구현
- [ ] **Database**: `payment_methods` 테이블 생성
- [ ] **Database**: `billing_history` 테이블 생성
- [ ] **Frontend**: 결제 수단 등록 페이지 구현
- [ ] **Frontend**: 결제 내역 페이지 구현
- [ ] **Frontend**: 구독 관리 페이지 구현 (일시정지/해지)
- [ ] **Frontend**: 수동 결제 페이지 구현
- [ ] **Frontend**: My Page에 구독 섹션 추가
- [ ] **토스 페이먼트 연동**

---

## 📋 Agenda #7: AI 크레딧 충전 & 사용

### 🎯 목표
사용자가 AI 크레딧을 충전하고 AI 서비스를 이용함

### 1️⃣ Admin Dashboard (관리)
**화면**:

**A) AI 크레딧 관리 섹션**
- 전체 크레딧 현황
  - 총 충전액
  - 총 사용액
  - 평균 잔액
- 사용자별 크레딧 조회
  - 현재 잔액
  - 충전 내역
  - 사용 내역
- 수동 크레딧 지급
  - 사용자 선택
  - 금액 입력
  - 지급 사유 입력
  - "지급하기" 버튼

**B) AI 가격 관리 섹션**
- 현재 AI 서비스 가격 표시
  - ChatGPT (GPT-4)
  - Gemini 2.5 Pro
  - Perplexity
- 가격 변경 이력
- 일일 API 비용 통계
- 수동 가격 조정
  - 서비스 선택
  - 새 가격 입력
  - "변경하기" 버튼

**현재 구현 상태**: ❌ 미구현 (신규 추가 필요)

---

### 2️⃣ Database (Supabase)
**테이블 1**: `credit_balance` (신규)
```sql
CREATE TABLE credit_balance (
    user_id TEXT PRIMARY KEY REFERENCES users(user_id),
    balance INTEGER DEFAULT 0,              -- 현재 잔액 (원 단위)
    total_charged INTEGER DEFAULT 0,        -- 총 충전액
    total_spent INTEGER DEFAULT 0,          -- 총 사용액
    last_charged_at TIMESTAMPTZ,
    last_spent_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_balance_user_id ON credit_balance(user_id);
```

**테이블 2**: `credit_transactions` (신규)
```sql
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(user_id),
    type TEXT NOT NULL,                     -- charge/spend/refund/bonus
    amount INTEGER NOT NULL,                -- 양수: 충전/보너스, 음수: 사용
    balance_after INTEGER NOT NULL,         -- 트랜잭션 후 잔액
    description TEXT,                       -- "₩10,000 충전 (+10% 보너스)"
    related_service TEXT,                   -- ChatGPT/Gemini/Perplexity (사용 시)
    payment_id UUID,                        -- billing_history 참조 (충전 시)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_trans_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_trans_type ON credit_transactions(type);
CREATE INDEX idx_credit_trans_created_at ON credit_transactions(created_at);
```

**테이블 3**: `ai_service_pricing` (신규)
```sql
CREATE TABLE ai_service_pricing (
    service_name TEXT PRIMARY KEY,          -- ChatGPT/Gemini/Perplexity
    price_per_use INTEGER NOT NULL,         -- 1회 사용 가격 (원)
    api_cost INTEGER,                       -- API 원가 (원)
    margin_percent INTEGER DEFAULT 20,      -- 마진 (%)
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID                         -- 관리자 ID
);

-- 초기 데이터
INSERT INTO ai_service_pricing (service_name, price_per_use, api_cost) VALUES
('ChatGPT', 100, 80),
('Gemini', 80, 65),
('Perplexity', 50, 40);
```

**테이블 4**: `ai_usage_log` (신규)
```sql
CREATE TABLE ai_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(user_id),
    service_name TEXT NOT NULL,             -- ChatGPT/Gemini/Perplexity
    prompt TEXT NOT NULL,                   -- 사용자 질문
    response TEXT,                          -- AI 응답
    tokens_used INTEGER,                    -- 사용한 토큰 수
    cost INTEGER NOT NULL,                  -- 차감된 크레딧
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user_id ON ai_usage_log(user_id);
CREATE INDEX idx_ai_usage_service ON ai_usage_log(service_name);
CREATE INDEX idx_ai_usage_created_at ON ai_usage_log(created_at);
```

---

### 3️⃣ Frontend (표시/사용)
**화면**:

**A) 크레딧 위젯 (우측 상단)**
- 현재 잔액 표시
- 사용 가능 횟수 표시 (AI별)
- "충전하기" 버튼
- "사용 내역" 버튼

**B) `/credit/purchase` - 크레딧 충전**
- 현재 잔액 표시
- 충전 금액 옵션 선택
  - ₩5,000 → ₩5,000
  - ₩10,000 → ₩11,000 (+10%)
  - ₩30,000 → ₩35,000 (+16.7%)
  - ₩50,000 → ₩60,000 (+20%)
  - ₩100,000 → ₩125,000 (+25%)
  - 직접 입력 (최소 ₩1,000)
- 결제 수단 선택
- 토스 페이먼트 결제
- 충전 완료 후 잔액 즉시 반영 (Supabase Realtime)

**C) `/credit/history` - 충전/사용 내역**
- 탭: 충전 내역 / 사용 내역
- 충전 내역
  - 날짜, 금액, 보너스, 결제 방법
- 사용 내역
  - 날짜, 서비스, 사용 금액, 질문 요약

**D) `/ai-qa` - AI Q&A**
- AI 서비스 선택 (ChatGPT/Gemini/Perplexity)
- 현재 가격 표시 (실시간)
- 질문 입력 폼
- 잔액 확인
  - 부족 시: 충전 안내 팝업
- "질문하기" 버튼
- AI 응답 표시
- 크레딧 차감 안내
- 대화 이력 (최근 10개)

**E) `/mypage` - My Page (크레딧 섹션 추가)**
- 크레딧 정보
  - 현재 잔액
  - 사용 가능 횟수 (AI별)
  - "충전하기" 버튼
  - "충전 내역" 버튼
  - "사용 내역" 버튼

**현재 구현 상태**: ❌ 모두 미구현 (신규 추가 필요)

---

### ✅ Agenda #7 체크리스트
- [ ] **Admin**: 크레딧 관리 섹션 구현
- [ ] **Admin**: AI 가격 관리 섹션 구현
- [ ] **Database**: `credit_balance` 테이블 생성
- [ ] **Database**: `credit_transactions` 테이블 생성
- [ ] **Database**: `ai_service_pricing` 테이블 생성
- [ ] **Database**: `ai_usage_log` 테이블 생성
- [ ] **Frontend**: 크레딧 위젯 구현 (우측 상단)
- [ ] **Frontend**: 크레딧 충전 페이지 구현
- [ ] **Frontend**: 크레딧 내역 페이지 구현
- [ ] **Frontend**: AI Q&A 페이지 구현
- [ ] **Frontend**: My Page에 크레딧 섹션 추가
- [ ] **OpenAI API 연동**
- [ ] **Gemini API 연동**
- [ ] **Perplexity API 연동**
- [ ] **토스 페이먼트 연동 (크레딧 충전)**

---

## 📋 Agenda #8: My Page 통합 완성

### 🎯 목표
Agenda #4~#7의 모든 섹션을 통합하여 완전한 My Page 완성

### 전제 조건
- ✅ Agenda #4 완료 (프로필 섹션)
- ✅ Agenda #5 완료 (프로젝트 섹션)
- ✅ Agenda #6 완료 (구독 섹션)
- ✅ Agenda #7 완료 (크레딧 섹션)

### 1️⃣ Admin Dashboard
**이미 완료됨** (Agenda #4~#7에서 각 섹션 구현)

---

### 2️⃣ Database
**이미 완료됨** (Agenda #4~#7에서 모든 테이블 생성)

---

### 3️⃣ Frontend (통합 작업)
**화면**: `/mypage` - My Page (최종 완성)

**레이아웃**:
```
┌────────────────────────────────────────────┐
│  👤 My Page                              │
├────────────────────────────────────────────┤
│                                             │
│  📋 내 정보 (Agenda #4)                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  회원 ID: A3B5C7D9                         │
│  이메일: user@example.com                  │
│  닉네임: 써니                               │
│  가입일: 2025-12-01                        │
│  [닉네임 변경] [비밀번호 변경] [회원 탈퇴]  │
│                                             │
│  📁 프로젝트 (Agenda #5)                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  설치비: ✅ 납부 완료 (2025-12-01)         │
│  진행 중인 프로젝트: 블로그 프로젝트        │
│  진행률: 85% (Stage 4/5)                   │
│  완료된 프로젝트: 0개                       │
│  [프로젝트 목록 보기]                       │
│                                             │
│  🔄 구독 정보 (Agenda #6)                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  상태: 활성                                 │
│  월 이용료: ₩50,000                        │
│  다음 결제일: 2026-01-01                   │
│  결제 수단: 신한카드 ****-1234             │
│  [결제 내역] [결제 수단 변경]               │
│                                             │
│  🪙 크레딧 (Agenda #7)                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  현재 잔액: ₩15,000                        │
│  사용 가능:                                 │
│  - ChatGPT: 150회                          │
│  - Gemini: 187회                           │
│  - Perplexity: 300회                       │
│  [충전하기] [내역 보기]                     │
│                                             │
│  ⚙️ 설정                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  알림 설정                                  │
│  개인정보 처리방침                          │
│  서비스 이용약관                            │
│                                             │
└────────────────────────────────────────────┘
```

### 작업 내용:
1. **레이아웃 통합**
   - 4개 섹션을 하나의 페이지로 통합
   - 반응형 디자인 (모바일 대응)
   - 탭 또는 Accordion 방식 선택

2. **데이터 로딩 최적화**
   - 4개 테이블 동시 조회
   - 로딩 인디케이터 표시
   - 에러 핸들링

3. **실시간 업데이트**
   - Supabase Realtime 연동
   - 크레딧 잔액 실시간 반영
   - 구독 상태 실시간 반영

4. **UX 개선**
   - 빠른 액션 버튼 (충전, 결제, 프로젝트 이동)
   - 스켈레톤 로딩
   - 부드러운 애니메이션

---

### ✅ Agenda #8 체크리스트
- [ ] **Frontend**: 4개 섹션 레이아웃 통합
- [ ] **Frontend**: 반응형 디자인 적용
- [ ] **Frontend**: 데이터 로딩 최적화
- [ ] **Frontend**: Supabase Realtime 연동
- [ ] **Frontend**: UX 개선 (애니메이션, 스켈레톤 등)
- [ ] **테스트**: 모든 섹션 정상 작동 확인
- [ ] **테스트**: 모바일 반응형 확인

---

## 📋 Agenda #9: 고객 문의 관리

### 🎯 목표
고객센터에서 접수된 문의를 Admin Dashboard에서 관리하고 답변함

### 1️⃣ Admin Dashboard (관리)
**화면**: 문의 관리 섹션

**기능**:
- 문의 목록 조회 (테이블 형식)
  - 문의 ID, 문의 유형, 제목, 작성자, 이메일, 접수일
  - 상태 (대기 중 / 답변 완료)
- 문의 검색 (제목, 이메일, 문의 유형)
- 문의 상세 보기
  - 문의 내용 전문
  - 연락처 정보
- 답변 작성
  - 답변 내용 입력
  - "답변 발송" 버튼 (이메일 발송)
- 상태 변경 (대기 중 → 답변 완료)

**현재 구현 상태**: ❌ 미구현 (신규 추가 필요)

---

### 2️⃣ Database (Supabase)
**테이블**: `inquiries` (신규)

```sql
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_type TEXT NOT NULL,             -- general/technical/payment/account/partnership/other
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',          -- pending/answered
    answer TEXT,
    answered_at TIMESTAMPTZ,
    answered_by UUID,                       -- 관리자 ID
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_email ON inquiries(email);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX idx_inquiries_type ON inquiries(inquiry_type);
```

---

### 3️⃣ Frontend (표시/사용)
**화면**: `/customer_service.html` - 고객센터

**기능** (이미 구현됨):
- 문의하기 폼
  - 문의 유형 선택 (일반 문의/기술 지원/결제·환불/계정 관련/제휴·협력/기타)
  - 이름, 이메일, 연락처
  - 제목, 문의 내용
  - 개인정보 수집 동의
- "문의 접수하기" 버튼
  - API 호출: `POST /api/inquiries`
  - 접수 완료 Toast 메시지

**추가 필요 기능**:
- Supabase 연동 (현재는 console.log만)
- 문의 접수 완료 후 이메일 확인 안내

**현재 구현 상태**: 🔶 부분 구현 (폼 UI 완료, DB 연동 필요)

---

### ✅ Agenda #9 체크리스트
- [ ] **Admin**: 문의 관리 섹션 구현
- [ ] **Admin**: 문의 목록 조회/검색 기능
- [ ] **Admin**: 문의 상세 보기/답변 작성 기능
- [ ] **Database**: `inquiries` 테이블 생성 SQL 작성 및 실행
- [ ] **Database**: RLS 정책 설정
- [ ] **Frontend**: 고객센터 문의 폼 → Supabase 연동
- [ ] **이메일 발송**: 답변 이메일 발송 기능 (선택)

---

## 📋 Agenda #10: PROJECT SAL GRID 매뉴얼 관리

### 🎯 목표
PROJECT SAL GRID 매뉴얼을 Admin Dashboard에서 관리하고, 뷰어에서 표시

### 1️⃣ Admin Dashboard (관리)
**화면**: 매뉴얼 관리 섹션

**기능**:
- 매뉴얼 목록 조회 (테이블 형식)
  - 매뉴얼 ID, 제목, 버전, Google Drive URL, 등록일, 수정일
- 매뉴얼 추가
  - 제목 입력
  - 버전 입력 (예: v3.0)
  - Google Drive URL 입력 (공유 링크)
  - 설명 입력 (선택)
- 매뉴얼 수정
  - URL 변경
  - 버전 업데이트
- 매뉴얼 삭제
- 매뉴얼 순서 변경 (드래그앤드롭)

**현재 구현 상태**: ❌ 미구현 (신규 추가 필요)

---

### 2️⃣ Database (Supabase)
**테이블**: `manuals` (신규)

```sql
CREATE TABLE manuals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,                    -- 'PROJECT SAL GRID MANUAL'
    version TEXT NOT NULL,                  -- 'v3.0'
    google_drive_url TEXT NOT NULL,         -- Google Drive 공유 링크
    description TEXT,                       -- 설명
    display_order INTEGER DEFAULT 0,        -- 표시 순서
    is_active BOOLEAN DEFAULT true,         -- 활성화 여부
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_manuals_display_order ON manuals(display_order);
CREATE INDEX idx_manuals_is_active ON manuals(is_active);

-- 초기 데이터
INSERT INTO manuals (title, version, google_drive_url, description, display_order) VALUES
('PROJECT SAL GRID MANUAL', 'v3.0', '', 'SSALWorks 플랫폼 - AI 협업 개발 가이드', 1);
```

---

### 3️⃣ Frontend (표시/사용)
**화면**: `manual.html` - 매뉴얼 뷰어

**작동 방식**:
1. 페이지 로드 시 Supabase에서 활성화된 매뉴얼 목록 조회
2. Google Drive URL에서 Markdown 파일 fetch
3. marked.js로 Markdown → HTML 변환
4. 목차 자동 생성 (h1, h2, h3 기반)
5. 검색 기능 제공

**현재 구현 상태**: 🔶 부분 구현 (뷰어 UI 완료, DB 연동 필요)

---

### ✅ Agenda #10 체크리스트
- [ ] **Admin**: 매뉴얼 관리 섹션 구현
- [ ] **Admin**: 매뉴얼 CRUD 기능 구현
- [ ] **Database**: `manuals` 테이블 생성 SQL 작성 및 실행
- [ ] **Database**: RLS 정책 설정
- [ ] **Frontend**: manual.html → Supabase 연동
- [ ] **콘텐츠**: PROJECT_SSAL_GRID_MANUAL.md → Google Drive 업로드
- [ ] **테스트**: 전체 플로우 테스트

---

## 📊 전체 아젠다 요약

| 아젠다 | 상태 | Admin | Database | Frontend | 우선순위 |
|-------|------|-------|----------|----------|---------|
| #1 공지사항 | ✅ 완료 | ✅ | ✅ | ✅ | - |
| #2 학습용 콘텐츠 | ✅ 완료 | ✅ | ✅ | ✅ | - |
| #3 FAQ | ✅ 완료 | ✅ | ✅ | ✅ | - |
| #4 회원가입 & 인증 | ⏳ 다음 | ❌ | ❌ | ❌ | 🔴 높음 |
| #5 프로젝트 & 설치비 | ⏸️ 대기 | ❌ | ❌ | ❌ | 🟡 중간 |
| #6 결제 & 구독 | ⏸️ 대기 | ❌ | ❌ | ❌ | 🟡 중간 |
| #7 AI 크레딧 | ⏸️ 대기 | ❌ | ❌ | ❌ | 🟢 낮음 |
| #8 My Page 통합 | ⏸️ 대기 | - | - | ❌ | 🟢 낮음 |
| #9 고객 문의 관리 | 🆕 신규 | ❌ | ❌ | 🔶 | 🟡 중간 |
| #10 매뉴얼 관리 | 🆕 신규 | ❌ | ❌ | 🔶 | 🟡 중간 |

---

## 🎯 권장 작업 순서

### 1단계: Agenda #4 (회원가입 & 인증) 🔴
**시작일**: 내일 (2025-12-04)
**예상 소요**: 2-3일
**이유**: 모든 기능의 전제 조건

### 2단계: Agenda #5 (프로젝트 & 설치비) 🟡
**시작일**: Agenda #4 완료 후
**예상 소요**: 3-4일
**이유**: 플랫폼 핵심 기능

### 3단계: Agenda #6 (결제 & 구독) 🟡
**시작일**: Agenda #5 완료 후
**예상 소요**: 4-5일
**이유**: 월간 수익 모델

### 4단계: Agenda #7 (AI 크레딧) 🟢
**시작일**: Agenda #6 완료 후
**예상 소요**: 3-4일
**이유**: 부가 서비스

### 5단계: Agenda #8 (My Page 통합) 🟢
**시작일**: Agenda #4~#7 완료 후
**예상 소요**: 1-2일
**이유**: 최종 통합

---

## ⚠️ 프로덕션 배포 전 필수 작업

### 완료된 아젠다 관련:
- [ ] 개발용 RLS 정책 → 원래 RLS 정책으로 교체
  - `07_learning_contents_rls_dev.sql` → `07_learning_contents_rls.sql`
  - `10_faqs_rls_dev.sql` → `10_faqs_rls.sql`

### 새로운 아젠다 관련:
- [ ] 모든 테이블 RLS 정책 설정 (프로덕션용)
- [ ] Admin Dashboard authenticated 로그인 구현
- [ ] 토스 페이먼트 실제 결제 테스트
- [ ] AI API 키 보안 강화
- [ ] 환경 변수 분리 (개발/프로덕션)

---

**작성자**: Claude Code
**작성일**: 2025-12-03
**근거**: User Flow #1~#5 전체 분석 + Admin-Database-Frontend 3단계 통합 원칙
