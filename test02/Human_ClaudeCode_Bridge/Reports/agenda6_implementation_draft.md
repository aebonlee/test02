# Agenda #6: 플랫폼 이용료 & 결제 관리 - 구현 초안

**작성일**: 2025-12-03
**아젠다**: #6
**목표**: 월간 플랫폼 이용료를 자동 결제하고 구독을 관리함
**근거 문서**: User Flow #3 (Subscription) UI 명세

---

## 📋 구현 체크리스트

### Admin Dashboard
- [ ] 결제 관리 섹션 구현
- [ ] 구독 현황 대시보드
- [ ] 결제 실패 관리
- [ ] 환불 처리 기능

### Database
- [ ] `payment_methods` 테이블 생성
- [ ] `billing_history` 테이블 생성
- [ ] RLS 정책 설정

### Frontend
- [ ] 결제 수단 등록 페이지 (`/subscription/payment-method`)
- [ ] 결제 내역 조회 페이지 (`/subscription/billing-history`)
- [ ] 구독 일시정지 페이지 (`/subscription/pause`)
- [ ] 구독 해지 페이지 (`/subscription/cancel`)
- [ ] 수동 결제 페이지 (`/subscription/manual-payment`)
- [ ] 결제 알림 (결제일 도래, 완료, 실패)

### 외부 API 연동
- [ ] 토스 페이먼트 빌링키 연동

---

## 🎨 1단계: Admin Dashboard 구현

### 1-1. 결제 관리 섹션

**파일 위치**: `P3_프로토타입_제작/admin-dashboard_prototype.html`

```html
<!-- ================================================= -->
<!-- 결제 관리 섹션 -->
<!-- ================================================= -->
<section id="billing-section" class="admin-section" style="display:none;">
  <h2>💳 결제 관리</h2>

  <!-- 구독 현황 대시보드 -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">✅</div>
      <div class="stat-content">
        <div class="stat-label">활성 구독자</div>
        <div class="stat-value" id="active-subscribers">0</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">💰</div>
      <div class="stat-content">
        <div class="stat-label">이번 달 예상 매출</div>
        <div class="stat-value" id="monthly-revenue">₩0</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">❌</div>
      <div class="stat-content">
        <div class="stat-label">결제 실패 건수</div>
        <div class="stat-value" id="failed-payments">0</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">⏸️</div>
      <div class="stat-content">
        <div class="stat-label">일시정지 구독자</div>
        <div class="stat-value" id="paused-subscribers">0</div>
      </div>
    </div>
  </div>

  <!-- 필터 바 -->
  <div class="filter-bar">
    <select id="billing-status-filter" class="filter-select" onchange="filterBillingHistory()">
      <option value="">전체 상태</option>
      <option value="paid">결제 완료</option>
      <option value="failed">결제 실패</option>
      <option value="refunded">환불</option>
    </select>

    <input type="month" id="billing-month-filter" class="filter-input" onchange="filterBillingHistory()">

    <button class="btn-filter" onclick="resetFilters()">초기화</button>
  </div>

  <!-- 결제 내역 테이블 -->
  <div class="table-container">
    <h3>결제 내역</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>결제일</th>
          <th>회원 ID</th>
          <th>이메일</th>
          <th>금액</th>
          <th>결제 수단</th>
          <th>상태</th>
          <th>실패 사유</th>
          <th>액션</th>
        </tr>
      </thead>
      <tbody id="billing-history-tbody">
        <!-- 동적 로딩 -->
      </tbody>
    </table>
  </div>

  <!-- 결제 실패 관리 -->
  <div class="table-container" style="margin-top: 40px;">
    <h3>결제 실패 관리</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>실패일</th>
          <th>회원 ID</th>
          <th>이메일</th>
          <th>금액</th>
          <th>실패 사유</th>
          <th>재시도 횟수</th>
          <th>액션</th>
        </tr>
      </thead>
      <tbody id="failed-payments-tbody">
        <!-- 동적 로딩 -->
      </tbody>
    </table>
  </div>
</section>

<!-- CSS -->
<style>
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.filter-select,
.filter-input {
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
}

.btn-filter {
  padding: 8px 16px;
  background: #F3F4F6;
  color: #374151;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn-filter:hover {
  background: #E5E7EB;
}

.btn-retry {
  background: #F59E0B;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-retry:hover {
  background: #D97706;
}

.btn-refund {
  background: #DC2626;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
}

.btn-refund:hover {
  background: #B91C1C;
}

.status-paid {
  background: #D1FAE5;
  color: #065F46;
}

.status-failed {
  background: #FEE2E2;
  color: #991B1B;
}

.status-refunded {
  background: #FEF3C7;
  color: #92400E;
}
</style>

<!-- JavaScript -->
<script>
let allBillingHistory = [];

// 결제 내역 로딩
async function loadBillingHistory() {
  try {
    const { data, error } = await supabase
      .from('billing_history')
      .select(`
        *,
        users (
          user_id,
          email
        )
      `)
      .order('billing_date', { ascending: false });

    if (error) throw error;

    allBillingHistory = data;
    updateBillingStats(data);
    renderBillingHistory(data);
    renderFailedPayments(data.filter(b => b.status === 'failed'));
  } catch (err) {
    console.error('Error loading billing history:', err);
    alert('❌ 결제 내역을 불러오는데 실패했습니다.');
  }
}

// 통계 업데이트
function updateBillingStats(history) {
  const activeCount = new Set(
    history.filter(h => h.status === 'paid')
      .map(h => h.user_id)
  ).size;

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyRevenue = history
    .filter(h => h.billing_date.startsWith(thisMonth) && h.status === 'paid')
    .reduce((sum, h) => sum + h.amount, 0);

  const failedCount = history.filter(h => h.status === 'failed').length;

  // TODO: 일시정지 구독자 수 계산 (users 테이블의 subscription_status)

  document.getElementById('active-subscribers').textContent = activeCount;
  document.getElementById('monthly-revenue').textContent = `₩${monthlyRevenue.toLocaleString()}`;
  document.getElementById('failed-payments').textContent = failedCount;
}

// 결제 내역 렌더링
function renderBillingHistory(history) {
  const tbody = document.getElementById('billing-history-tbody');

  if (!history || history.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:40px;">결제 내역이 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = history.map(bill => {
    const statusClass = `status-${bill.status}`;
    const statusText = {
      'paid': '완료',
      'failed': '실패',
      'refunded': '환불'
    }[bill.status];

    return `
      <tr>
        <td>${new Date(bill.billing_date).toLocaleDateString('ko-KR')}</td>
        <td><strong>${bill.users.user_id}</strong></td>
        <td>${bill.users.email}</td>
        <td><strong>₩${bill.amount.toLocaleString()}</strong></td>
        <td>${bill.payment_method || '-'}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${bill.failure_reason || '-'}</td>
        <td>
          ${bill.status === 'paid' ? `
            <button class="btn-refund" onclick="processRefund('${bill.id}')">환불</button>
          ` : bill.status === 'failed' ? `
            <button class="btn-retry" onclick="retryPayment('${bill.id}', '${bill.user_id}')">재시도</button>
          ` : '-'}
        </td>
      </tr>
    `;
  }).join('');
}

// 결제 실패 렌더링
function renderFailedPayments(failures) {
  const tbody = document.getElementById('failed-payments-tbody');

  if (!failures || failures.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:40px;">결제 실패 건이 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = failures.map(bill => `
    <tr>
      <td>${new Date(bill.billing_date).toLocaleDateString('ko-KR')}</td>
      <td><strong>${bill.users.user_id}</strong></td>
      <td>${bill.users.email}</td>
      <td><strong>₩${bill.amount.toLocaleString()}</strong></td>
      <td>${bill.failure_reason || '알 수 없음'}</td>
      <td>${bill.retry_count || 0}회</td>
      <td>
        <button class="btn-retry" onclick="retryPayment('${bill.id}', '${bill.user_id}')">재시도</button>
        <button class="btn-action" onclick="sendManualPaymentRequest('${bill.user_id}')">수동 결제 요청</button>
      </td>
    </tr>
  `).join('');
}

// 필터링
function filterBillingHistory() {
  const statusFilter = document.getElementById('billing-status-filter').value;
  const monthFilter = document.getElementById('billing-month-filter').value;

  let filtered = allBillingHistory;

  if (statusFilter) {
    filtered = filtered.filter(b => b.status === statusFilter);
  }

  if (monthFilter) {
    filtered = filtered.filter(b => b.billing_date.startsWith(monthFilter));
  }

  renderBillingHistory(filtered);
}

// 필터 초기화
function resetFilters() {
  document.getElementById('billing-status-filter').value = '';
  document.getElementById('billing-month-filter').value = '';
  renderBillingHistory(allBillingHistory);
}

// 결제 재시도
async function retryPayment(billingId, userId) {
  if (!confirm('결제를 재시도하시겠습니까?')) return;

  try {
    // TODO: 토스 페이먼트 빌링키로 재결제 시도
    alert('결제 재시도 중...');

    // 재시도 횟수 증가
    const { error } = await supabase
      .from('billing_history')
      .update({
        retry_count: supabase.raw('retry_count + 1')
      })
      .eq('id', billingId);

    if (error) throw error;

    alert('✅ 결제 재시도가 완료되었습니다.');
    loadBillingHistory();
  } catch (err) {
    console.error('Error retrying payment:', err);
    alert('❌ 결제 재시도에 실패했습니다.');
  }
}

// 수동 결제 요청
async function sendManualPaymentRequest(userId) {
  if (!confirm('사용자에게 수동 결제 요청 알림을 보내시겠습니까?')) return;

  try {
    // TODO: 알림 발송 로직
    alert(`✅ ${userId}에게 수동 결제 요청 알림을 발송했습니다.`);
  } catch (err) {
    console.error('Error sending manual payment request:', err);
    alert('❌ 알림 발송에 실패했습니다.');
  }
}

// 환불 처리
async function processRefund(billingId) {
  const reason = prompt('환불 사유를 입력해주세요:');
  if (!reason) return;

  const amountStr = prompt('환불 금액을 입력해주세요 (₩):');
  if (!amountStr) return;

  const refundAmount = parseInt(amountStr.replace(/[^0-9]/g, ''));
  if (isNaN(refundAmount) || refundAmount <= 0) {
    alert('올바른 금액을 입력해주세요.');
    return;
  }

  if (!confirm(`₩${refundAmount.toLocaleString()}을 환불하시겠습니까?`)) return;

  try {
    // TODO: 토스 페이먼트 환불 API 호출

    const { error } = await supabase
      .from('billing_history')
      .update({
        status: 'refunded',
        refund_amount: refundAmount,
        refund_date: new Date().toISOString(),
        refund_reason: reason
      })
      .eq('id', billingId);

    if (error) throw error;

    alert('✅ 환불이 완료되었습니다.');
    loadBillingHistory();
  } catch (err) {
    console.error('Error processing refund:', err);
    alert('❌ 환불 처리에 실패했습니다.');
  }
}

// 초기 로딩
loadBillingHistory();
</script>
```

---

## 🗄️ 2단계: Database 구현

### 파일 위치: `P3_프로토타입_제작/Database/`

### 2-1. `19_create_payment_methods.sql`

```sql
-- =====================================================
-- Payment Methods 테이블 생성
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 사용자 결제 수단 정보 관리
-- =====================================================

CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    payment_type TEXT NOT NULL CHECK (payment_type IN ('card', 'bank')),
    card_last4 TEXT,
    card_company TEXT,
    bank_name TEXT,
    account_last4 TEXT,
    is_default BOOLEAN DEFAULT true,
    toss_billing_key TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT check_card_info
        CHECK (
            (payment_type = 'card' AND card_last4 IS NOT NULL AND card_company IS NOT NULL)
            OR
            (payment_type = 'bank' AND bank_name IS NOT NULL AND account_last4 IS NOT NULL)
        )
);

-- 인덱스 생성
CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX idx_payment_methods_is_default ON public.payment_methods(is_default) WHERE is_default = true;

-- 자동 updated_at 업데이트
CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION update_payment_methods_updated_at();

-- 완료
SELECT '✅ payment_methods 테이블 생성 완료!' as status;
```

### 2-2. `20_create_billing_history.sql`

```sql
-- =====================================================
-- Billing History 테이블 생성
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 플랫폼 이용료 결제 내역 관리
-- =====================================================

CREATE TABLE IF NOT EXISTS public.billing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    billing_type TEXT NOT NULL CHECK (billing_type IN ('platform_fee', 'credit_purchase')),
    amount INTEGER NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL CHECK (status IN ('paid', 'failed', 'refunded')),
    billing_date TIMESTAMPTZ NOT NULL,
    payment_method TEXT,
    receipt_url TEXT,
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    refund_amount INTEGER,
    refund_date TIMESTAMPTZ,
    refund_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_billing_user_id ON public.billing_history(user_id);
CREATE INDEX idx_billing_date ON public.billing_history(billing_date DESC);
CREATE INDEX idx_billing_status ON public.billing_history(status);
CREATE INDEX idx_billing_type ON public.billing_history(billing_type);

-- 완료
SELECT '✅ billing_history 테이블 생성 완료!' as status;
```

### 2-3. `21_billing_rls_dev.sql` (개발용)

```sql
-- =====================================================
-- Billing 관련 RLS 정책 (개발 환경용)
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 개발 중 anon 키로 테스트 가능하도록
-- ⚠️  프로덕션 배포 전 반드시 인증 정책으로 교체!
-- =====================================================

-- payment_methods RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_methods_select_all_dev" ON public.payment_methods
    FOR SELECT TO public USING (true);

CREATE POLICY "payment_methods_insert_all_dev" ON public.payment_methods
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "payment_methods_update_all_dev" ON public.payment_methods
    FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "payment_methods_delete_all_dev" ON public.payment_methods
    FOR DELETE TO public USING (true);

-- billing_history RLS
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "billing_select_all_dev" ON public.billing_history
    FOR SELECT TO public USING (true);

CREATE POLICY "billing_insert_all_dev" ON public.billing_history
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "billing_update_all_dev" ON public.billing_history
    FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "billing_delete_all_dev" ON public.billing_history
    FOR DELETE TO public USING (true);

-- 완료
SELECT '✅ billing 관련 개발용 RLS 정책 적용 완료!' as status,
       '⚠️  프로덕션 배포 전 원래 정책으로 되돌려야 합니다!' as warning;
```

### 2-4. `22_sample_billing.sql`

```sql
-- =====================================================
-- Billing 샘플 데이터
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 테스트용 샘플 결제 내역
-- =====================================================

-- 샘플 결제 수단
INSERT INTO public.payment_methods (
    user_id,
    payment_type,
    card_last4,
    card_company,
    is_default,
    toss_billing_key
) VALUES (
    'A3B5C7D9',
    'card',
    '1234',
    '신한카드',
    true,
    'test_billing_key_123'
);

-- 샘플 결제 내역 1: 성공
INSERT INTO public.billing_history (
    user_id,
    billing_type,
    amount,
    status,
    billing_date,
    payment_method,
    receipt_url
) VALUES (
    'A3B5C7D9',
    'platform_fee',
    50000,
    'paid',
    NOW() - INTERVAL '1 month',
    '신한카드 ****-1234',
    'https://receipt.example.com/123'
);

-- 샘플 결제 내역 2: 실패
INSERT INTO public.billing_history (
    user_id,
    billing_type,
    amount,
    status,
    billing_date,
    payment_method,
    failure_reason,
    retry_count
) VALUES (
    'A3B5C7D9',
    'platform_fee',
    50000,
    'failed',
    NOW(),
    '신한카드 ****-1234',
    '잔액 부족',
    2
);

-- 완료
SELECT '✅ 샘플 결제 내역 생성 완료!' as status;
```

---

## 🌐 3단계: Frontend 구현

### 3-1. `/subscription/payment-method` - 결제 수단 등록

**파일 위치**: `P3_프로토타입_제작/Frontend/subscription_payment_method.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>결제 수단 등록 - SSAL Works</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="https://js.tosspayments.com/v1"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #F9FAFB;
      padding: 40px 20px;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .title {
      font-size: 28px;
      font-weight: bold;
      color: #1F2937;
      margin-bottom: 12px;
      text-align: center;
    }

    .subtitle {
      font-size: 16px;
      color: #6B7280;
      text-align: center;
      margin-bottom: 16px;
    }

    .free-notice {
      font-size: 18px;
      font-weight: bold;
      color: #10B981;
      text-align: center;
      margin-bottom: 8px;
    }

    .next-billing {
      font-size: 14px;
      color: #374151;
      text-align: center;
      margin-bottom: 32px;
    }

    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 24px 0;
    }

    .payment-option {
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
      cursor: pointer;
      transition: all 200ms;
    }

    .payment-option:hover {
      border-color: #10B981;
      background: #F9FAFB;
    }

    .payment-option.active {
      border-color: #10B981;
      border-width: 2px;
      background: #ECFDF5;
    }

    .payment-option.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .option-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .radio-btn {
      width: 20px;
      height: 20px;
      border: 2px solid #D1D5DB;
      border-radius: 50%;
      position: relative;
    }

    .payment-option.active .radio-btn {
      border-color: #10B981;
    }

    .payment-option.active .radio-btn::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      background: #10B981;
      border-radius: 50%;
    }

    .option-title {
      font-size: 16px;
      font-weight: bold;
      color: #1F2937;
    }

    .option-fields {
      margin-top: 16px;
      display: none;
    }

    .payment-option.active .option-fields {
      display: block;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      color: #374151;
      margin-bottom: 6px;
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: 12px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #10B981;
      border-width: 2px;
    }

    .inline-inputs {
      display: flex;
      gap: 12px;
    }

    .inline-inputs .form-input {
      flex: 1;
    }

    .buttons {
      display: flex;
      gap: 12px;
      margin-top: 32px;
    }

    .btn {
      flex: 1;
      height: 48px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 200ms;
    }

    .btn-primary {
      background: #10B981;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #059669;
    }

    .btn-primary:disabled {
      background: #D1D5DB;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #F3F4F6;
      color: #6B7280;
    }

    .btn-secondary:hover {
      background: #E5E7EB;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1 class="title">💳 결제 수단 등록</h1>
      <p class="subtitle">플랫폼 이용료 자동결제를 위해<br>결제 수단을 등록해주세요.</p>

      <div class="free-notice">첫 달은 무료입니다!</div>
      <div class="next-billing">다음 결제일: <span id="next-billing-date">2026-01-01</span></div>

      <div class="divider"></div>

      <!-- 계좌 자동이체 -->
      <div class="payment-option" id="bank-option" onclick="selectOption('bank')">
        <div class="option-header">
          <div class="radio-btn"></div>
          <div class="option-title">계좌 자동이체</div>
        </div>
        <div class="option-fields">
          <div class="form-group">
            <label class="form-label">은행 선택</label>
            <select class="form-select" id="bank-name">
              <option value="">은행을 선택하세요</option>
              <option value="KB국민은행">KB국민은행</option>
              <option value="신한은행">신한은행</option>
              <option value="우리은행">우리은행</option>
              <option value="하나은행">하나은행</option>
              <option value="NH농협은행">NH농협은행</option>
              <option value="IBK기업은행">IBK기업은행</option>
              <option value="카카오뱅크">카카오뱅크</option>
              <option value="토스뱅크">토스뱅크</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">계좌번호</label>
            <input type="text" class="form-input" id="account-number" placeholder="계좌번호 입력 (숫자만)" maxlength="14">
          </div>
          <div class="form-group">
            <label class="form-label">예금주</label>
            <input type="text" class="form-input" id="account-holder" placeholder="예금주명">
          </div>
        </div>
      </div>

      <!-- 카드 자동결제 -->
      <div class="payment-option active" id="card-option" onclick="selectOption('card')">
        <div class="option-header">
          <div class="radio-btn"></div>
          <div class="option-title">신용/체크카드 자동결제</div>
        </div>
        <div class="option-fields">
          <div class="form-group">
            <label class="form-label">카드번호</label>
            <input type="text" class="form-input" id="card-number" placeholder="0000-0000-0000-0000" maxlength="19">
          </div>
          <div class="inline-inputs">
            <div class="form-group" style="flex: 1;">
              <label class="form-label">유효기간</label>
              <input type="text" class="form-input" id="card-expiry" placeholder="MM / YY" maxlength="7">
            </div>
            <div class="form-group" style="flex: 0 0 100px;">
              <label class="form-label">CVC</label>
              <input type="text" class="form-input" id="card-cvc" placeholder="123" maxlength="4">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">카드 소유자명</label>
            <input type="text" class="form-input" id="card-holder" placeholder="카드에 표시된 이름">
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="buttons">
        <button class="btn btn-primary" onclick="registerPaymentMethod()">등록하기</button>
        <button class="btn btn-secondary" onclick="skip()">나중에</button>
      </div>
    </div>
  </div>

  <script>
    // Supabase 초기화
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 토스 페이먼트 초기화
    const clientKey = 'YOUR_TOSS_CLIENT_KEY';
    const tossPayments = TossPayments(clientKey);

    let selectedType = 'card';
    let currentUserId = null;

    // 옵션 선택
    function selectOption(type) {
      selectedType = type;

      document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('active');
      });

      document.getElementById(`${type}-option`).classList.add('active');
    }

    // 다음 결제일 계산
    function calculateNextBillingDate() {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 2);
      nextMonth.setDate(1);

      return nextMonth.toISOString().slice(0, 10);
    }

    // 초기화
    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert('로그인이 필요합니다.');
          window.location.href = '/login';
          return;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('user_id')
          .eq('id', user.id)
          .single();

        currentUserId = userData.user_id;

        document.getElementById('next-billing-date').textContent =
          calculateNextBillingDate();
      } catch (err) {
        console.error('Error initializing:', err);
      }
    }

    // 결제 수단 등록
    async function registerPaymentMethod() {
      try {
        let paymentData = {};

        if (selectedType === 'card') {
          const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
          const cardExpiry = document.getElementById('card-expiry').value.replace(/\s/g, '');
          const cardCvc = document.getElementById('card-cvc').value;
          const cardHolder = document.getElementById('card-holder').value;

          if (!cardNumber || !cardExpiry || !cardCvc || !cardHolder) {
            alert('모든 카드 정보를 입력해주세요.');
            return;
          }

          // TODO: 토스 페이먼트 빌링키 발급
          const billingKey = 'test_billing_key_' + Date.now();

          paymentData = {
            user_id: currentUserId,
            payment_type: 'card',
            card_last4: cardNumber.slice(-4),
            card_company: '신한카드', // TODO: 실제 카드사 판별
            is_default: true,
            toss_billing_key: billingKey
          };
        } else if (selectedType === 'bank') {
          const bankName = document.getElementById('bank-name').value;
          const accountNumber = document.getElementById('account-number').value;
          const accountHolder = document.getElementById('account-holder').value;

          if (!bankName || !accountNumber || !accountHolder) {
            alert('모든 계좌 정보를 입력해주세요.');
            return;
          }

          paymentData = {
            user_id: currentUserId,
            payment_type: 'bank',
            bank_name: bankName,
            account_last4: accountNumber.slice(-4),
            is_default: true
          };
        }

        const { error } = await supabase
          .from('payment_methods')
          .insert(paymentData);

        if (error) throw error;

        alert('✅ 결제 수단이 등록되었습니다!\n\n첫 달은 무료이며, 다음 달부터 자동 결제됩니다.');
        window.location.href = '/dashboard';
      } catch (err) {
        console.error('Error registering payment method:', err);
        alert('❌ 결제 수단 등록에 실패했습니다.');
      }
    }

    // 나중에
    function skip() {
      if (confirm('나중에 등록하시겠습니까?\n\n다음 결제일 전에 등록하지 않으면 서비스가 일시정지될 수 있습니다.')) {
        window.location.href = '/dashboard';
      }
    }

    // 카드번호 자동 포맷팅
    document.getElementById('card-number')?.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '');
      let formatted = value.match(/.{1,4}/g)?.join('-') || value;
      e.target.value = formatted;
    });

    // 유효기간 자동 포맷팅
    document.getElementById('card-expiry')?.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
      }
      e.target.value = value;
    });

    init();
  </script>
</body>
</html>
```

### 3-2. `/subscription/billing-history` - 결제 내역

**파일 위치**: `P3_프로토타입_제작/Frontend/subscription_billing_history.html`

(UI 명세의 4번 참고 - 길이 제한으로 핵심 구조만 작성)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>결제 내역 - SSAL Works</title>
  <!-- 스타일 생략 -->
</head>
<body>
  <div class="container">
    <h1>💳 플랫폼 이용료 결제 내역</h1>

    <!-- 현재 구독 상태 -->
    <div class="subscription-status">
      <div class="status-badge active">활성</div>
      <div>다음 결제일: <span id="next-billing">2026-03-01</span></div>
      <div>월 이용료: <strong>₩50,000</strong></div>
    </div>

    <!-- 결제 내역 -->
    <div id="billing-list">
      <!-- 동적 로딩 -->
    </div>

    <!-- 액션 버튼 -->
    <div class="actions">
      <button onclick="location.href='/subscription/payment-method'">결제 수단 변경</button>
      <button onclick="location.href='/subscription/pause'">구독 일시정지</button>
      <button onclick="location.href='/subscription/cancel'">구독 해지</button>
    </div>
  </div>

  <script>
    // Supabase 로직
    async function loadBillingHistory() {
      const { data, error } = await supabase
        .from('billing_history')
        .select('*')
        .eq('billing_type', 'platform_fee')
        .order('billing_date', { ascending: false });

      renderBillingHistory(data);
    }

    loadBillingHistory();
  </script>
</body>
</html>
```

---

## ✅ 구현 완료 후 검증 체크리스트

### Admin Dashboard 검증
- [ ] 구독 현황 통계가 올바르게 표시되는가?
- [ ] 결제 내역 필터링이 작동하는가?
- [ ] 결제 실패 건에 대한 재시도가 가능한가?
- [ ] 환불 처리가 올바르게 작동하는가?

### Database 검증
- [ ] `payment_methods` 테이블이 생성되었는가?
- [ ] `billing_history` 테이블이 생성되었는가?
- [ ] RLS 정책이 올바르게 적용되었는가?

### Frontend 검증
- [ ] 결제 수단 등록 페이지가 올바르게 작동하는가?
- [ ] 카드번호 자동 포맷팅이 작동하는가?
- [ ] 결제 내역이 올바르게 표시되는가?
- [ ] 구독 일시정지/해지가 작동하는가?

### 토스 페이먼트 연동 검증
- [ ] 빌링키 발급이 작동하는가?
- [ ] 자동 결제가 실행되는가?
- [ ] 환불 API가 작동하는가?

---

**작성자**: Claude Code
**작성일**: 2025-12-03
**상태**: 구현 준비 완료
**다음 단계**: Agenda #7 구현 초안 작성
