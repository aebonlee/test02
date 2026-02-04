# SSALWorks 데이터베이스 스키마 설계

**작성일**: 2025-11-18
**버전**: 2.0 (최종)

---

## 📋 개요

SSALWorks는 **범용 프로젝트 관리 플랫폼**으로, 멀티 사용자 환경에서 다음 기능을 제공합니다:

- 3D 그리드 기반 프로젝트 관리
- AI Q&A (ChatGPT, Claude, Gemini, Perplexity)
- 크레딧 기반 과금 시스템
- 온보딩 + 월 구독 비즈니스 모델
- 써니에게 묻기 (사람 답변 지원)

**설계 원칙:**
- ✅ DB에는 **멀티 사용자 공유 데이터만** 저장
- ✅ 사용자별 로컬 데이터는 **파일 시스템** 사용
- ✅ 비용 최소화 (Supabase 스토리지 절약)

---

## 🗂️ 테이블 목록 (총 10개)

### 사용자 & 프로젝트
1. `users` - 사용자 계정 + 온보딩 정보
2. `projects` - 프로젝트 정보

### 결제 & 구독
3. `payment_transactions` - 모든 결제 내역
4. `monthly_subscriptions` - 월 구독 관리

### 온보딩 & 환불
5. `onboarding_progress` - 온보딩 진행 상황
6. `customer_revenue_proof` - 고객 수입 증빙

### 크레딧 시스템
7. `credit_balance` - 크레딧 잔액
8. `credit_transactions` - 크레딧 거래 내역
9. `ai_service_pricing` - AI 서비스 요금표

### 지원
10. `support_requests` - 써니에게 묻기

---

## 📊 테이블 상세

### 1. users (사용자)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT,

  -- 온보딩 정보
  onboarding_start_date DATE,
  onboarding_end_date DATE,
  subscription_status VARCHAR(20) DEFAULT 'inactive',  -- 'onboarding', 'active', 'inactive'
  is_onboarding_completed BOOLEAN DEFAULT false,

  -- 권한
  role VARCHAR(20) DEFAULT 'user',  -- 'admin', 'user'

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
```

**필드 설명:**
- `subscription_status`:
  - `onboarding` - 초기 3개월 (₩3,000,000)
  - `active` - 월 구독 활성 (₩50,000/월)
  - `inactive` - 구독 없음

---

### 2. projects (프로젝트)

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  name VARCHAR(200) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '📁',

  -- 프로젝트 경로 (로컬 파일 시스템)
  project_path TEXT NOT NULL,  -- 예: C:\!SSAL_Works_Private

  status VARCHAR(20) DEFAULT 'active',  -- 'active', 'completed', 'paused'

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
```

**참고:**
- `inbox`, `outbox` 경로는 DB에 저장 안 함
- 파일 시스템 스캔으로 자동 감지 (`/project-structure` API)

---

### 3. payment_transactions (결제 내역)

```sql
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- 결제 유형
  payment_type VARCHAR(20) NOT NULL,  -- 'onboarding', 'monthly', 'credit_charge', 'refund'

  -- 금액
  amount DECIMAL(10, 2) NOT NULL,       -- 금액 (부가세 별도)
  vat DECIMAL(10, 2) NOT NULL,          -- 부가세 (10%)
  total_amount DECIMAL(10, 2) NOT NULL, -- 총액 (amount + vat)

  -- 결제 정보
  payment_method VARCHAR(50),           -- '계좌이체', '카드', 등
  payment_status VARCHAR(20) NOT NULL,  -- 'pending', 'completed', 'failed', 'refunded'

  -- 환불 정보
  refund_amount DECIMAL(10, 2),
  refund_reason TEXT,
  refunded_at TIMESTAMPTZ,

  -- 영수증
  receipt_url TEXT,
  invoice_number VARCHAR(50),

  -- 타임스탬프
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_type ON payment_transactions(payment_type);
CREATE INDEX idx_payment_status ON payment_transactions(payment_status);
CREATE INDEX idx_payment_date ON payment_transactions(transaction_date DESC);
```

**결제 유형:**
- `onboarding` - 초기 ₩3,000,000
- `monthly` - 월 구독 ₩50,000
- `credit_charge` - 크레딧 충전
- `refund` - 환불 (50% 조건 충족 시)

---

### 4. monthly_subscriptions (월 구독 관리)

```sql
CREATE TABLE monthly_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- 청구 주기
  billing_cycle_start DATE NOT NULL,
  billing_cycle_end DATE NOT NULL,

  -- 금액 (고정)
  amount DECIMAL(10, 2) DEFAULT 50000,

  -- 결제 상태
  payment_status VARCHAR(20) NOT NULL,  -- 'pending', 'paid', 'overdue'
  payment_transaction_id UUID REFERENCES payment_transactions(id),

  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_monthly_sub_user_id ON monthly_subscriptions(user_id);
CREATE INDEX idx_monthly_sub_status ON monthly_subscriptions(payment_status);
CREATE INDEX idx_monthly_sub_cycle ON monthly_subscriptions(billing_cycle_start);
```

---

### 5. onboarding_progress (온보딩 진행 상황)

```sql
CREATE TABLE onboarding_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- 환불 조건 체크 (3개월 내 달성 시 50% 환불)
  website_completed BOOLEAN DEFAULT false,
  website_completed_at TIMESTAMPTZ,

  service_launched BOOLEAN DEFAULT false,
  service_launched_at TIMESTAMPTZ,

  revenue_customers_count INTEGER DEFAULT 0,  -- 수입 발생 고객 수
  revenue_goal_achieved BOOLEAN DEFAULT false, -- 10명 이상 달성 여부
  revenue_goal_achieved_at TIMESTAMPTZ,

  -- 환불 처리
  refund_eligible BOOLEAN DEFAULT false,      -- 환불 자격
  refund_requested BOOLEAN DEFAULT false,
  refund_processed BOOLEAN DEFAULT false,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_onboarding_user_id ON onboarding_progress(user_id);
```

**환불 조건:**
1. ✅ 웹사이트 완성
2. ✅ 서비스 런칭
3. ✅ 10명 이상 고객으로부터 수입 발생

→ **₩1,500,000 환불 (50%)**

---

### 6. customer_revenue_proof (고객 수입 증빙)

```sql
CREATE TABLE customer_revenue_proof (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- 고객 정보
  customer_name VARCHAR(100),
  revenue_amount DECIMAL(10, 2),
  revenue_date DATE,

  -- 증빙 자료
  proof_type VARCHAR(50),        -- '계좌이체', '카드결제', '세금계산서' 등
  proof_document_url TEXT,       -- 증빙 문서 URL (업로드)

  -- 관리자 확인
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_revenue_proof_user_id ON customer_revenue_proof(user_id);
CREATE INDEX idx_revenue_proof_verified ON customer_revenue_proof(verified);
```

---

### 7. credit_balance (크레딧 잔액)

```sql
CREATE TABLE credit_balance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  balance DECIMAL(10, 2) DEFAULT 10000,  -- 기본 ₩10,000 제공

  total_charged DECIMAL(10, 2) DEFAULT 0,   -- 총 충전액
  total_spent DECIMAL(10, 2) DEFAULT 0,     -- 총 사용액

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_balance_user_id ON credit_balance(user_id);
```

---

### 8. credit_transactions (크레딧 거래 내역)

```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- 거래 유형
  transaction_type VARCHAR(20) NOT NULL,  -- 'charge', 'spend', 'refund'
  amount DECIMAL(10, 2) NOT NULL,

  -- AI 사용 관련 (spend일 때만)
  ai_service VARCHAR(20),      -- 'chatgpt', 'claude', 'gemini', 'perplexity'
  model_name VARCHAR(50),      -- 'gpt-4', 'claude-3-sonnet', etc.

  -- API 사용량 상세
  api_request_tokens INTEGER,
  api_response_tokens INTEGER,
  total_tokens INTEGER,

  -- 비용 계산
  api_cost_usd DECIMAL(10, 6),      -- API 실제 비용 (USD)
  exchange_rate DECIMAL(10, 2),     -- 환율
  api_cost_krw DECIMAL(10, 2),      -- API 비용 (KRW)
  markup_rate DECIMAL(5, 2) DEFAULT 1.2,  -- 마진율 (20% 고정)
  charged_amount DECIMAL(10, 2),    -- 사용자에게 청구한 금액

  -- 메타데이터
  question_text TEXT,
  answer_text TEXT,

  balance_after DECIMAL(10, 2),     -- 거래 후 잔액

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_tx_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_tx_type ON credit_transactions(transaction_type);
CREATE INDEX idx_credit_tx_ai_service ON credit_transactions(ai_service);
CREATE INDEX idx_credit_tx_created ON credit_transactions(created_at DESC);
```

**마진 계산:**
```
API 실제 비용 (USD) × 환율 (KRW) × 1.2 (20% 마진) = 사용자 청구 금액
```

---

### 9. ai_service_pricing (AI 서비스 요금표)

```sql
CREATE TABLE ai_service_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  service_name VARCHAR(20) NOT NULL,  -- 'chatgpt', 'claude', 'gemini', 'perplexity'
  model_name VARCHAR(50) NOT NULL,    -- 'gpt-4', 'claude-3-sonnet', etc.

  -- 요금 (USD per 1K tokens)
  input_price_per_1k DECIMAL(10, 6),
  output_price_per_1k DECIMAL(10, 6),

  -- 마진율 (모든 서비스 일괄 20%)
  markup_rate DECIMAL(5, 2) DEFAULT 1.2,

  is_active BOOLEAN DEFAULT true,

  -- 가격 유효 기간
  effective_from DATE,
  effective_to DATE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_pricing_service ON ai_service_pricing(service_name, model_name);
CREATE INDEX idx_ai_pricing_active ON ai_service_pricing(is_active);
```

**초기 데이터 예시:**
```sql
INSERT INTO ai_service_pricing
  (service_name, model_name, input_price_per_1k, output_price_per_1k, markup_rate, effective_from)
VALUES
  ('chatgpt', 'gpt-4', 0.03, 0.06, 1.2, '2025-01-01'),
  ('chatgpt', 'gpt-3.5-turbo', 0.0015, 0.002, 1.2, '2025-01-01'),
  ('claude', 'claude-3-sonnet', 0.003, 0.015, 1.2, '2025-01-01'),
  ('gemini', 'gemini-pro', 0.00025, 0.0005, 1.2, '2025-01-01');
```

---

### 10. support_requests (써니에게 묻기)

```sql
CREATE TABLE support_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- 질문
  question_text TEXT NOT NULL,
  category VARCHAR(50),  -- 'general', 'bug', 'feature', 'billing', etc.

  -- 첨부 파일 (Supabase Storage URLs)
  attachment_urls TEXT[],  -- 파일/이미지 URL 배열

  -- 답변
  answer_text TEXT,
  answered_at TIMESTAMPTZ,
  answered_by UUID REFERENCES users(id),  -- 관리자 ID

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_support_user_id ON support_requests(user_id);
CREATE INDEX idx_support_answered ON support_requests(answered_at);
CREATE INDEX idx_support_created ON support_requests(created_at DESC);
```

**파일 업로드 프로세스:**
1. 사용자가 파일 선택 (이미지, PDF, 문서 등)
2. Supabase Storage에 업로드: `support-attachments/{user_id}/{request_id}/{filename}`
3. 공개 URL 생성
4. URL 배열을 `attachment_urls` 컬럼에 저장
5. 관리자가 첨부 파일 확인 가능

**Supabase Realtime 구독:**
```javascript
const channel = supabase
  .channel('support-answers')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'support_requests',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      if (payload.new.answered_at) {
        // 답변 도착 시 워크스페이스에 표시
        displayAnswerInWorkspace(payload.new);
      }
    }
  )
  .subscribe();
```

---

## 🚫 제거된 테이블 (파일 시스템 사용)

### 디렉토리 구조 관련
- ❌ `process_phases` - 고정값 (P1_사업계획 ~ 4_운영)
- ❌ `process_categories` - 사용자별 로컬 스캔
- ❌ `process_subcategories` - 사용자별 로컬 스캔

**대안:** `inbox_server.js`의 `/project-structure` API로 실시간 스캔

### 기타
- ❌ `ordersheet_templates` - 사용 안 함
- ❌ `ordersheets` - 사용 안 함
- ❌ `ai_conversations` - 크레딧 관리만 필요 (대화 내역 저장 안 함)
- ❌ `knowledge_base` - 기능 제공 안 함
- ❌ `outbox_files` - 파일 시스템이 더 빠르고 정확

---

## 🔗 관계도 (ER Diagram)

```
users
  ├─→ projects (1:N)
  ├─→ payment_transactions (1:N)
  ├─→ monthly_subscriptions (1:N)
  ├─→ onboarding_progress (1:1)
  ├─→ customer_revenue_proof (1:N)
  ├─→ credit_balance (1:1)
  ├─→ credit_transactions (1:N)
  └─→ support_requests (1:N)

payment_transactions
  └─→ monthly_subscriptions (1:1)

ai_service_pricing
  (독립 테이블, 관리자만 수정)
```

---

## 🔒 Row Level Security (RLS) 정책

### users
```sql
-- 자신의 레코드만 조회
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- 자신의 레코드만 수정
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### projects, payment_transactions, credit_transactions, support_requests 등
```sql
-- 자신의 데이터만 CRUD
CREATE POLICY "Users can manage own data" ON {table_name}
  FOR ALL USING (auth.uid() = user_id);
```

### ai_service_pricing
```sql
-- 모든 사용자 읽기 가능
CREATE POLICY "Everyone can read pricing" ON ai_service_pricing
  FOR SELECT USING (true);

-- admin만 수정 가능
CREATE POLICY "Only admin can manage pricing" ON ai_service_pricing
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
```

---

## 💰 비즈니스 모델 플로우

### 신규 가입
```
1. 사용자 가입
   ↓
2. ₩3,000,000 선불 결제 (부가세 별도)
   - payment_transactions 생성 (type: 'onboarding')
   ↓
3. users 테이블 업데이트
   - subscription_status: 'onboarding'
   - onboarding_start_date: 오늘
   - onboarding_end_date: 3개월 후
   ↓
4. credit_balance 생성 (₩10,000 기본 지급)
   ↓
5. onboarding_progress 생성
```

### 온보딩 기간 (3개월)
```
웹사이트 완성 → onboarding_progress 업데이트
서비스 런칭 → onboarding_progress 업데이트
고객 수입 증빙 → customer_revenue_proof 추가
   ↓
10명 달성 시
   ↓
refund_eligible = true
   ↓
사용자 환불 요청
   ↓
payment_transactions 생성 (type: 'refund', amount: ₩1,500,000)
```

### 3개월 후 (정규 운영)
```
onboarding_end_date 도래
   ↓
subscription_status: 'active'
   ↓
매월 monthly_subscriptions 생성 (₩50,000)
   ↓
매월 payment_transactions 생성 (type: 'monthly')
```

### AI 사용 & 크레딧 차감
```
사용자 AI 질문
   ↓
ChatGPT/Claude/Gemini/Perplexity API 호출
   ↓
API 응답 (usage 정보 포함)
   ↓
비용 계산:
  - API 비용 (USD) × 환율 × 1.2 (마진 20%)
   ↓
credit_balance 차감
   ↓
credit_transactions 기록
   ↓
잔액 부족 시 → 크레딧 충전 안내
```

---

## 🚀 마이그레이션 순서

### Phase 1: 기본 인프라
```sql
1. users
2. projects
```

### Phase 2: 결제 시스템
```sql
3. payment_transactions
4. monthly_subscriptions
5. onboarding_progress
6. customer_revenue_proof
```

### Phase 3: 크레딧 시스템
```sql
7. credit_balance
8. credit_transactions
9. ai_service_pricing
```

### Phase 4: 지원
```sql
10. support_requests
```

---

## 📝 다음 단계

1. ✅ **데이터베이스 스키마 확정** (완료)
2. [ ] Supabase 프로젝트 생성
3. [ ] SQL 마이그레이션 스크립트 작성
4. [ ] RLS 정책 적용
5. [ ] 초기 데이터 (ai_service_pricing) 입력
6. [ ] Supabase JS Client 연동
7. [ ] 실시간 구독 구현 (Realtime)
8. [ ] 테스트 & 검증

---

**작성자**: Claude Code
**최종 수정**: 2025-11-18
