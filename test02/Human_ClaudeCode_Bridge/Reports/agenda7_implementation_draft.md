# Agenda #7: AI 크레딧 충전 & 사용 - 구현 초안

**작성일**: 2025-12-03
**아젠다**: #7
**목표**: 사용자가 AI 크레딧을 충전하고 AI 서비스를 이용함
**근거 문서**: User Flow #4 (AI Credit Purchase) UI 명세

---

## 📋 구현 체크리스트

### Admin Dashboard
- [ ] AI 크레딧 관리 섹션 구현
- [ ] AI 가격 관리 섹션 구현
- [ ] 수동 크레딧 지급 기능

### Database
- [ ] `credit_balance` 테이블 생성
- [ ] `credit_transactions` 테이블 생성
- [ ] `ai_service_pricing` 테이블 생성
- [ ] `ai_usage_log` 테이블 생성
- [ ] RLS 정책 설정

### Frontend
- [ ] 크레딧 잔액 위젯 (우측 상단)
- [ ] 크레딧 충전 페이지 (`/credit/purchase`)
- [ ] 충전 완료 팝업
- [ ] 크레딧 사용 내역 페이지 (`/credit/history`)
- [ ] AI Q&A 페이지 (`/ai/qa`)
- [ ] 크레딧 부족 팝업

### 외부 API 연동
- [ ] OpenAI API (ChatGPT)
- [ ] Google Gemini API
- [ ] Perplexity API
- [ ] 토스 페이먼트 (크레딧 충전)

---

## 🎨 1단계: Admin Dashboard 구현

### 1-1. AI 크레딧 관리 섹션

**파일 위치**: `P3_프로토타입_제작/admin-dashboard_prototype.html`

```html
<!-- ================================================= -->
<!-- AI 크레딧 관리 섹션 -->
<!-- ================================================= -->
<section id="credit-section" class="admin-section" style="display:none;">
  <h2>💰 AI 크레딧 관리</h2>

  <!-- 통계 대시보드 -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">💵</div>
      <div class="stat-content">
        <div class="stat-label">총 충전액</div>
        <div class="stat-value" id="total-charged">₩0</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">🔥</div>
      <div class="stat-content">
        <div class="stat-label">총 사용액</div>
        <div class="stat-value" id="total-spent">₩0</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">📊</div>
      <div class="stat-content">
        <div class="stat-label">평균 잔액</div>
        <div class="stat-value" id="avg-balance">₩0</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">👥</div>
      <div class="stat-content">
        <div class="stat-label">활성 사용자</div>
        <div class="stat-value" id="active-users">0</div>
      </div>
    </div>
  </div>

  <!-- 사용자별 크레딧 조회 -->
  <div class="table-container">
    <h3>사용자별 크레딧 현황</h3>
    <input type="text" id="credit-user-search" placeholder="회원 ID 또는 이메일 검색..." class="search-input" onkeyup="searchCreditUsers()">

    <table class="admin-table">
      <thead>
        <tr>
          <th>회원 ID</th>
          <th>이메일</th>
          <th>현재 잔액</th>
          <th>총 충전액</th>
          <th>총 사용액</th>
          <th>마지막 충전</th>
          <th>마지막 사용</th>
          <th>액션</th>
        </tr>
      </thead>
      <tbody id="credit-users-tbody">
        <!-- 동적 로딩 -->
      </tbody>
    </table>
  </div>

  <!-- 수동 크레딧 지급 -->
  <div class="manual-credit-section" style="margin-top: 40px;">
    <h3>수동 크레딧 지급</h3>
    <div class="manual-credit-form">
      <select id="manual-user-select" class="form-select">
        <option value="">사용자 선택</option>
        <!-- 동적 로딩 -->
      </select>

      <input type="number" id="manual-credit-amount" placeholder="지급 금액 (₩)" class="form-input" min="1000" step="1000">

      <input type="text" id="manual-credit-reason" placeholder="지급 사유" class="form-input">

      <button class="btn-primary" onclick="grantCredit()">지급하기</button>
    </div>
  </div>
</section>

<!-- ================================================= -->
<!-- AI 가격 관리 섹션 -->
<!-- ================================================= -->
<section id="ai-pricing-section" class="admin-section" style="display:none;">
  <h2>💎 AI 서비스 가격 관리</h2>

  <!-- 현재 가격 -->
  <div class="pricing-cards">
    <div class="pricing-card">
      <h3>🤖 ChatGPT (GPT-4)</h3>
      <div class="current-price" id="chatgpt-price">₩100</div>
      <div class="price-label">질문당 가격</div>
      <div class="api-cost">API 원가: <span id="chatgpt-cost">₩80</span></div>
      <div class="margin">마진: <span id="chatgpt-margin">20%</span></div>
      <button class="btn-edit" onclick="editPrice('ChatGPT')">가격 수정</button>
    </div>

    <div class="pricing-card">
      <h3>🔮 Gemini 2.5 Pro</h3>
      <div class="current-price" id="gemini-price">₩80</div>
      <div class="price-label">질문당 가격</div>
      <div class="api-cost">API 원가: <span id="gemini-cost">₩65</span></div>
      <div class="margin">마진: <span id="gemini-margin">23%</span></div>
      <button class="btn-edit" onclick="editPrice('Gemini')">가격 수정</button>
    </div>

    <div class="pricing-card">
      <h3>🔍 Perplexity</h3>
      <div class="current-price" id="perplexity-price">₩50</div>
      <div class="price-label">질문당 가격</div>
      <div class="api-cost">API 원가: <span id="perplexity-cost">₩40</span></div>
      <div class="margin">마진: <span id="perplexity-margin">25%</span></div>
      <button class="btn-edit" onclick="editPrice('Perplexity')">가격 수정</button>
    </div>
  </div>

  <!-- 가격 변경 이력 -->
  <div class="table-container" style="margin-top: 40px;">
    <h3>가격 변경 이력</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>변경일</th>
          <th>서비스</th>
          <th>이전 가격</th>
          <th>새 가격</th>
          <th>변경률</th>
          <th>변경자</th>
        </tr>
      </thead>
      <tbody id="price-history-tbody">
        <!-- 동적 로딩 -->
      </tbody>
    </table>
  </div>

  <!-- 일일 API 비용 통계 -->
  <div class="table-container" style="margin-top: 40px;">
    <h3>일일 API 비용 통계</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>날짜</th>
          <th>ChatGPT 사용량</th>
          <th>Gemini 사용량</th>
          <th>Perplexity 사용량</th>
          <th>총 API 비용</th>
          <th>총 수익</th>
          <th>순이익</th>
        </tr>
      </thead>
      <tbody id="daily-api-stats-tbody">
        <!-- 동적 로딩 -->
      </tbody>
    </table>
  </div>
</section>

<!-- CSS -->
<style>
.manual-credit-form {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #F9FAFB;
  padding: 20px;
  border-radius: 8px;
}

.manual-credit-form .form-select,
.manual-credit-form .form-input {
  flex: 1;
  height: 44px;
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.pricing-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.pricing-card h3 {
  font-size: 18px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 32px;
  font-weight: bold;
  color: #10B981;
  margin-bottom: 8px;
}

.price-label {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 16px;
}

.api-cost,
.margin {
  font-size: 13px;
  color: #374151;
  margin-bottom: 8px;
}

.btn-edit {
  background: #10B981;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
}

.btn-edit:hover {
  background: #059669;
}
</style>

<!-- JavaScript -->
<script>
// AI 크레딧 현황 로딩
async function loadCreditStats() {
  try {
    const { data, error } = await supabase
      .from('credit_balance')
      .select(`
        *,
        users (
          user_id,
          email
        )
      `);

    if (error) throw error;

    updateCreditStats(data);
    renderCreditUsers(data);
    populateUserSelect(data);
  } catch (err) {
    console.error('Error loading credit stats:', err);
    alert('❌ 크레딧 현황을 불러오는데 실패했습니다.');
  }
}

// 통계 업데이트
function updateCreditStats(balances) {
  const totalCharged = balances.reduce((sum, b) => sum + b.total_charged, 0);
  const totalSpent = balances.reduce((sum, b) => sum + b.total_spent, 0);
  const avgBalance = balances.length > 0 ? Math.floor(balances.reduce((sum, b) => sum + b.balance, 0) / balances.length) : 0;
  const activeUsers = balances.filter(b => b.balance > 0).length;

  document.getElementById('total-charged').textContent = `₩${totalCharged.toLocaleString()}`;
  document.getElementById('total-spent').textContent = `₩${totalSpent.toLocaleString()}`;
  document.getElementById('avg-balance').textContent = `₩${avgBalance.toLocaleString()}`;
  document.getElementById('active-users').textContent = activeUsers;
}

// 사용자별 크레딧 렌더링
function renderCreditUsers(balances) {
  const tbody = document.getElementById('credit-users-tbody');

  if (!balances || balances.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:40px;">데이터가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = balances.map(balance => `
    <tr>
      <td><strong>${balance.users.user_id}</strong></td>
      <td>${balance.users.email}</td>
      <td><strong style="color:#10B981;">₩${balance.balance.toLocaleString()}</strong></td>
      <td>₩${balance.total_charged.toLocaleString()}</td>
      <td>₩${balance.total_spent.toLocaleString()}</td>
      <td>${balance.last_charged_at ? new Date(balance.last_charged_at).toLocaleDateString('ko-KR') : '-'}</td>
      <td>${balance.last_spent_at ? new Date(balance.last_spent_at).toLocaleDateString('ko-KR') : '-'}</td>
      <td>
        <button class="btn-action" onclick="viewCreditDetail('${balance.user_id}')">상세</button>
      </td>
    </tr>
  `).join('');
}

// 사용자 선택 드롭다운 채우기
function populateUserSelect(balances) {
  const select = document.getElementById('manual-user-select');
  select.innerHTML = '<option value="">사용자 선택</option>' +
    balances.map(b => `<option value="${b.user_id}">${b.users.user_id} (${b.users.email})</option>`).join('');
}

// 수동 크레딧 지급
async function grantCredit() {
  const userId = document.getElementById('manual-user-select').value;
  const amount = parseInt(document.getElementById('manual-credit-amount').value);
  const reason = document.getElementById('manual-credit-reason').value;

  if (!userId || !amount || !reason) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  if (amount < 1000) {
    alert('최소 지급 금액은 ₩1,000입니다.');
    return;
  }

  if (!confirm(`${userId}에게 ₩${amount.toLocaleString()}을 지급하시겠습니까?\n\n사유: ${reason}`)) {
    return;
  }

  try {
    // 1. 잔액 업데이트
    const { data: current } = await supabase
      .from('credit_balance')
      .select('balance')
      .eq('user_id', userId)
      .single();

    const newBalance = current.balance + amount;

    const { error: balanceError } = await supabase
      .from('credit_balance')
      .update({
        balance: newBalance,
        total_charged: supabase.raw('total_charged + ' + amount),
        last_charged_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (balanceError) throw balanceError;

    // 2. 거래 내역 추가
    const { error: txError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        type: 'bonus',
        amount: amount,
        balance_after: newBalance,
        description: `관리자 지급: ${reason}`
      });

    if (txError) throw txError;

    alert(`✅ ₩${amount.toLocaleString()} 지급 완료!`);

    // 폼 초기화
    document.getElementById('manual-user-select').value = '';
    document.getElementById('manual-credit-amount').value = '';
    document.getElementById('manual-credit-reason').value = '';

    // 새로고침
    loadCreditStats();
  } catch (err) {
    console.error('Error granting credit:', err);
    alert('❌ 크레딧 지급에 실패했습니다.');
  }
}

// AI 가격 로딩
async function loadAIPricing() {
  try {
    const { data, error } = await supabase
      .from('ai_service_pricing')
      .select('*');

    if (error) throw error;

    data.forEach(service => {
      const serviceId = service.service_name.toLowerCase();
      document.getElementById(`${serviceId}-price`).textContent = `₩${service.price_per_use.toLocaleString()}`;
      document.getElementById(`${serviceId}-cost`).textContent = `₩${service.api_cost.toLocaleString()}`;
      document.getElementById(`${serviceId}-margin`).textContent = `${service.margin_percent}%`;
    });
  } catch (err) {
    console.error('Error loading AI pricing:', err);
    alert('❌ AI 가격 정보를 불러오는데 실패했습니다.');
  }
}

// 가격 수정
async function editPrice(serviceName) {
  const newPriceStr = prompt(`${serviceName}의 새로운 가격을 입력하세요 (₩):`);
  if (!newPriceStr) return;

  const newPrice = parseInt(newPriceStr.replace(/[^0-9]/g, ''));
  if (isNaN(newPrice) || newPrice <= 0) {
    alert('올바른 가격을 입력해주세요.');
    return;
  }

  if (!confirm(`${serviceName}의 가격을 ₩${newPrice.toLocaleString()}으로 변경하시겠습니까?`)) {
    return;
  }

  try {
    const { error } = await supabase
      .from('ai_service_pricing')
      .update({
        price_per_use: newPrice,
        updated_at: new Date().toISOString(),
        updated_by: 'admin' // 실제로는 현재 관리자 ID
      })
      .eq('service_name', serviceName);

    if (error) throw error;

    alert(`✅ ${serviceName} 가격이 변경되었습니다.`);

    // TODO: 사용자들에게 가격 변경 알림 발송

    loadAIPricing();
  } catch (err) {
    console.error('Error updating price:', err);
    alert('❌ 가격 변경에 실패했습니다.');
  }
}

// 초기 로딩
loadCreditStats();
loadAIPricing();
</script>
```

---

## 🗄️ 2단계: Database 구현

### 파일 위치: `P3_프로토타입_제작/Database/`

### 2-1. `23_create_credit_balance.sql`

```sql
-- =====================================================
-- Credit Balance 테이블 생성
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 사용자 크레딧 잔액 관리
-- =====================================================

CREATE TABLE IF NOT EXISTS public.credit_balance (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 0 CHECK (balance >= 0),
    total_charged INTEGER DEFAULT 0 CHECK (total_charged >= 0),
    total_spent INTEGER DEFAULT 0 CHECK (total_spent >= 0),
    last_charged_at TIMESTAMPTZ,
    last_spent_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_credit_balance_user_id ON public.credit_balance(user_id);
CREATE INDEX idx_credit_balance_balance ON public.credit_balance(balance);

-- 자동 updated_at 업데이트
CREATE OR REPLACE FUNCTION update_credit_balance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_credit_balance_updated_at
BEFORE UPDATE ON public.credit_balance
FOR EACH ROW
EXECUTE FUNCTION update_credit_balance_updated_at();

-- 완료
SELECT '✅ credit_balance 테이블 생성 완료!' as status;
```

### 2-2. `24_create_credit_transactions.sql`

```sql
-- =====================================================
-- Credit Transactions 테이블 생성
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 크레딧 충전/사용 내역 관리
-- =====================================================

CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('charge', 'spend', 'refund', 'bonus')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
    description TEXT,
    related_service TEXT CHECK (related_service IN ('ChatGPT', 'Gemini', 'Perplexity', NULL)),
    payment_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_credit_trans_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_trans_type ON public.credit_transactions(type);
CREATE INDEX idx_credit_trans_created_at ON public.credit_transactions(created_at DESC);
CREATE INDEX idx_credit_trans_service ON public.credit_transactions(related_service);

-- 완료
SELECT '✅ credit_transactions 테이블 생성 완료!' as status;
```

### 2-3. `25_create_ai_service_pricing.sql`

```sql
-- =====================================================
-- AI Service Pricing 테이블 생성
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: AI 서비스 가격 관리
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ai_service_pricing (
    service_name TEXT PRIMARY KEY CHECK (service_name IN ('ChatGPT', 'Gemini', 'Perplexity')),
    price_per_use INTEGER NOT NULL CHECK (price_per_use > 0),
    api_cost INTEGER CHECK (api_cost > 0),
    margin_percent INTEGER DEFAULT 20 CHECK (margin_percent >= 0 AND margin_percent <= 100),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT
);

-- 초기 데이터 삽입
INSERT INTO public.ai_service_pricing (service_name, price_per_use, api_cost, margin_percent) VALUES
('ChatGPT', 100, 80, 25),
('Gemini', 80, 65, 23),
('Perplexity', 50, 40, 25)
ON CONFLICT (service_name) DO NOTHING;

-- 완료
SELECT '✅ ai_service_pricing 테이블 생성 및 초기화 완료!' as status;
```

### 2-4. `26_create_ai_usage_log.sql`

```sql
-- =====================================================
-- AI Usage Log 테이블 생성
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: AI 서비스 사용 내역 기록
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ai_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    service_name TEXT NOT NULL CHECK (service_name IN ('ChatGPT', 'Gemini', 'Perplexity')),
    prompt TEXT NOT NULL,
    response TEXT,
    tokens_used INTEGER,
    cost INTEGER NOT NULL CHECK (cost > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_ai_usage_user_id ON public.ai_usage_log(user_id);
CREATE INDEX idx_ai_usage_service ON public.ai_usage_log(service_name);
CREATE INDEX idx_ai_usage_created_at ON public.ai_usage_log(created_at DESC);

-- 완료
SELECT '✅ ai_usage_log 테이블 생성 완료!' as status;
```

### 2-5. `27_credit_rls_dev.sql` (개발용)

```sql
-- =====================================================
-- Credit 관련 RLS 정책 (개발 환경용)
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 개발 중 anon 키로 테스트 가능하도록
-- ⚠️  프로덕션 배포 전 반드시 인증 정책으로 교체!
-- =====================================================

-- credit_balance RLS
ALTER TABLE public.credit_balance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_balance_select_all_dev" ON public.credit_balance
    FOR SELECT TO public USING (true);

CREATE POLICY "credit_balance_update_all_dev" ON public.credit_balance
    FOR UPDATE TO public USING (true) WITH CHECK (true);

-- credit_transactions RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_trans_select_all_dev" ON public.credit_transactions
    FOR SELECT TO public USING (true);

CREATE POLICY "credit_trans_insert_all_dev" ON public.credit_transactions
    FOR INSERT TO public WITH CHECK (true);

-- ai_service_pricing RLS
ALTER TABLE public.ai_service_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_pricing_select_all_dev" ON public.ai_service_pricing
    FOR SELECT TO public USING (true);

-- ai_usage_log RLS
ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_usage_select_all_dev" ON public.ai_usage_log
    FOR SELECT TO public USING (true);

CREATE POLICY "ai_usage_insert_all_dev" ON public.ai_usage_log
    FOR INSERT TO public WITH CHECK (true);

-- 완료
SELECT '✅ credit 관련 개발용 RLS 정책 적용 완료!' as status,
       '⚠️  프로덕션 배포 전 원래 정책으로 되돌려야 합니다!' as warning;
```

---

## 🌐 3단계: Frontend 구현

### 3-1. 크레딧 잔액 위젯 (우측 상단)

**파일 위치**: `P3_프로토타입_제작/Frontend/components/credit_widget.html`

```html
<!-- ================================================= -->
<!-- 크레딧 잔액 위젯 -->
<!-- ================================================= -->
<style>
.credit-widget {
  position: fixed;
  top: 80px;
  right: 20px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 280px;
  z-index: 100;
}

.credit-widget h3 {
  font-size: 16px;
  color: #1F2937;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.credit-balance {
  font-size: 24px;
  font-weight: bold;
  color: #10B981;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.credit-balance.low {
  color: #F59E0B;
}

.credit-balance.critical {
  color: #DC2626;
}

.realtime-indicator {
  font-size: 16px;
  color: #3B82F6;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.usage-info {
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 16px;
}

.usage-info div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.widget-buttons {
  display: flex;
  gap: 8px;
}

.widget-btn {
  flex: 1;
  height: 32px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.widget-btn.primary {
  background: #10B981;
  color: white;
}

.widget-btn.primary:hover {
  background: #059669;
}

.widget-btn.secondary {
  background: #F3F4F6;
  color: #6B7280;
}

.widget-btn.secondary:hover {
  background: #E5E7EB;
}
</style>

<div class="credit-widget" id="credit-widget">
  <h3>💰 AI 크레딧</h3>

  <div class="credit-balance" id="credit-balance">
    ₩<span id="balance-amount">0</span>
    <span class="realtime-indicator">⚡</span>
  </div>

  <div class="usage-info" id="usage-info">
    <div><span>ChatGPT:</span> <span id="chatgpt-count">0회</span></div>
    <div><span>Gemini:</span> <span id="gemini-count">0회</span></div>
    <div><span>Perplexity:</span> <span id="perplexity-count">0회</span></div>
  </div>

  <div class="widget-buttons">
    <button class="widget-btn primary" onclick="location.href='/credit/purchase'">충전하기</button>
    <button class="widget-btn secondary" onclick="location.href='/credit/history'">내역</button>
  </div>
</div>

<script>
// Supabase 초기화
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUserId = null;
let currentBalance = 0;
let aiPricing = {};

// 초기화
async function initCreditWidget() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userData } = await supabase
      .from('users')
      .select('user_id')
      .eq('id', user.id)
      .single();

    currentUserId = userData.user_id;

    // 가격 정보 로딩
    await loadAIPricing();

    // 잔액 로딩
    await loadCreditBalance();

    // 실시간 구독
    subscribeToBalanceUpdates();
  } catch (err) {
    console.error('Error initializing credit widget:', err);
  }
}

// AI 가격 로딩
async function loadAIPricing() {
  const { data, error } = await supabase
    .from('ai_service_pricing')
    .select('*');

  if (error) throw error;

  data.forEach(service => {
    aiPricing[service.service_name] = service.price_per_use;
  });
}

// 잔액 로딩
async function loadCreditBalance() {
  const { data, error } = await supabase
    .from('credit_balance')
    .select('balance')
    .eq('user_id', currentUserId)
    .single();

  if (error) throw error;

  updateBalanceDisplay(data.balance);
}

// 잔액 표시 업데이트
function updateBalanceDisplay(balance) {
  currentBalance = balance;

  // 잔액 표시
  const balanceEl = document.getElementById('credit-balance');
  const amountEl = document.getElementById('balance-amount');

  amountEl.textContent = balance.toLocaleString();

  // 색상 변경
  balanceEl.classList.remove('low', 'critical');
  if (balance < 1000) {
    balanceEl.classList.add('critical');
  } else if (balance < 5000) {
    balanceEl.classList.add('low');
  }

  // 사용 가능 횟수 계산
  if (Object.keys(aiPricing).length > 0) {
    document.getElementById('chatgpt-count').textContent = Math.floor(balance / aiPricing['ChatGPT']) + '회';
    document.getElementById('gemini-count').textContent = Math.floor(balance / aiPricing['Gemini']) + '회';
    document.getElementById('perplexity-count').textContent = Math.floor(balance / aiPricing['Perplexity']) + '회';
  }

  // 애니메이션
  animateBalanceUpdate();
}

// 잔액 업데이트 애니메이션
function animateBalanceUpdate() {
  const widget = document.getElementById('credit-widget');
  widget.style.background = '#D1FAE5';
  setTimeout(() => {
    widget.style.background = 'white';
  }, 300);
}

// 실시간 구독
function subscribeToBalanceUpdates() {
  supabase
    .channel('credit_balance_updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'credit_balance',
        filter: `user_id=eq.${currentUserId}`
      },
      (payload) => {
        updateBalanceDisplay(payload.new.balance);
      }
    )
    .subscribe();
}

// 초기화 실행
initCreditWidget();
</script>
```

### 3-2. `/credit/purchase` - 크레딧 충전 페이지

**파일 위치**: `P3_프로토타입_제작/Frontend/credit_purchase.html`

(UI 명세의 3번 참고 - 구조 및 스타일 동일하게 구현)

### 3-3. `/ai/qa` - AI Q&A 페이지

**파일 위치**: `P3_프로토타입_제작/Frontend/ai_qa.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Q&A - SSAL Works</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <style>
    /* UI 명세 6번 참고 - 스타일 생략 */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤖 AI Q&A</h1>
      <div class="credit-display">💰 현재 크레딧: <span id="current-credit">₩0</span></div>
    </div>

    <div class="main-layout">
      <!-- 대화 영역 -->
      <div class="chat-area" id="chat-area">
        <div class="welcome-message">
          AI 서비스를 선택하고 질문해주세요!
        </div>
      </div>

      <!-- AI 선택 영역 -->
      <div class="ai-select-area">
        <h3>AI 선택:</h3>

        <div class="ai-option active" id="chatgpt-option" onclick="selectAI('ChatGPT')">
          <div class="radio-btn"></div>
          <div class="ai-info">
            <div class="ai-name">🤖 ChatGPT (GPT-4)</div>
            <div class="ai-price">질문당 <span id="chatgpt-price">₩100</span></div>
            <div class="ai-desc">코드 작성, 기술 문서</div>
          </div>
        </div>

        <div class="ai-option" id="gemini-option" onclick="selectAI('Gemini')">
          <div class="radio-btn"></div>
          <div class="ai-info">
            <div class="ai-name">🔮 Gemini 2.5 Pro</div>
            <div class="ai-price">질문당 <span id="gemini-price">₩80</span></div>
            <div class="ai-desc">코드 리뷰, 아키텍처</div>
          </div>
        </div>

        <div class="ai-option" id="perplexity-option" onclick="selectAI('Perplexity')">
          <div class="radio-btn"></div>
          <div class="ai-info">
            <div class="ai-name">🔍 Perplexity</div>
            <div class="ai-price">질문당 <span id="perplexity-price">₩50</span></div>
            <div class="ai-desc">최신 정보, 실시간 검색</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 질문 입력 영역 -->
    <div class="input-area">
      <textarea id="question-input" placeholder="질문을 입력하세요..." maxlength="2000"></textarea>

      <div class="input-footer">
        <div class="cost-info">
          <span>예상 비용: <strong id="estimated-cost">₩100</strong></span>
          <span style="margin-left: 20px;">사용 후 잔액: <strong id="balance-after">₩0</strong></span>
        </div>
        <button class="btn-submit" id="submit-btn" onclick="submitQuestion()">질문하기</button>
      </div>
    </div>
  </div>

  <script>
    // Supabase 초기화
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let selectedAI = 'ChatGPT';
    let currentUserId = null;
    let currentBalance = 0;
    let aiPricing = {};

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

        // 가격 및 잔액 로딩
        await loadAIPricing();
        await loadCreditBalance();
      } catch (err) {
        console.error('Error initializing:', err);
      }
    }

    // AI 가격 로딩
    async function loadAIPricing() {
      const { data, error } = await supabase
        .from('ai_service_pricing')
        .select('*');

      if (error) throw error;

      data.forEach(service => {
        aiPricing[service.service_name] = service.price_per_use;
        document.getElementById(`${service.service_name.toLowerCase()}-price`).textContent =
          `₩${service.price_per_use.toLocaleString()}`;
      });

      updateEstimatedCost();
    }

    // 잔액 로딩
    async function loadCreditBalance() {
      const { data, error } = await supabase
        .from('credit_balance')
        .select('balance')
        .eq('user_id', currentUserId)
        .single();

      if (error) throw error;

      currentBalance = data.balance;
      document.getElementById('current-credit').textContent = `₩${currentBalance.toLocaleString()}`;
      updateEstimatedCost();
    }

    // AI 선택
    function selectAI(aiName) {
      selectedAI = aiName;

      document.querySelectorAll('.ai-option').forEach(opt => {
        opt.classList.remove('active');
      });

      document.getElementById(`${aiName.toLowerCase()}-option`).classList.add('active');

      updateEstimatedCost();
    }

    // 예상 비용 업데이트
    function updateEstimatedCost() {
      const cost = aiPricing[selectedAI] || 0;
      const balanceAfter = currentBalance - cost;

      document.getElementById('estimated-cost').textContent = `₩${cost.toLocaleString()}`;
      document.getElementById('balance-after').textContent = `₩${balanceAfter.toLocaleString()}`;

      // 잔액 부족 시 스타일 변경
      const balanceEl = document.getElementById('balance-after');
      if (balanceAfter < 0) {
        balanceEl.style.color = '#DC2626';
        document.getElementById('submit-btn').disabled = true;
      } else {
        balanceEl.style.color = '#10B981';
        document.getElementById('submit-btn').disabled = false;
      }
    }

    // 질문 제출
    async function submitQuestion() {
      const question = document.getElementById('question-input').value.trim();

      if (!question) {
        alert('질문을 입력해주세요.');
        return;
      }

      const cost = aiPricing[selectedAI];

      // 잔액 확인
      if (currentBalance < cost) {
        showInsufficientCreditPopup(cost);
        return;
      }

      // 로딩 표시
      showLoading();

      try {
        // TODO: AI API 호출
        const response = await callAIService(selectedAI, question);

        // 크레딧 차감
        await deductCredit(cost, question, response);

        // 응답 표시
        displayResponse(question, response, cost);

        // 입력 초기화
        document.getElementById('question-input').value = '';
      } catch (err) {
        console.error('Error submitting question:', err);
        alert('❌ AI 요청에 실패했습니다.');
      } finally {
        hideLoading();
      }
    }

    // AI 서비스 호출
    async function callAIService(aiName, question) {
      // TODO: 실제 AI API 호출 구현
      // - ChatGPT: OpenAI API
      // - Gemini: Google Gemini API
      // - Perplexity: Perplexity API

      return `이것은 ${aiName}의 테스트 응답입니다.\n\n질문: ${question}`;
    }

    // 크레딧 차감
    async function deductCredit(cost, question, response) {
      const newBalance = currentBalance - cost;

      // 1. 잔액 업데이트
      const { error: balanceError } = await supabase
        .from('credit_balance')
        .update({
          balance: newBalance,
          total_spent: supabase.raw('total_spent + ' + cost),
          last_spent_at: new Date().toISOString()
        })
        .eq('user_id', currentUserId);

      if (balanceError) throw balanceError;

      // 2. 거래 내역 추가
      const { error: txError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: currentUserId,
          type: 'spend',
          amount: -cost,
          balance_after: newBalance,
          description: `${selectedAI} 사용`,
          related_service: selectedAI
        });

      if (txError) throw txError;

      // 3. 사용 로그 기록
      const { error: logError } = await supabase
        .from('ai_usage_log')
        .insert({
          user_id: currentUserId,
          service_name: selectedAI,
          prompt: question,
          response: response,
          cost: cost
        });

      if (logError) throw logError;

      // 잔액 업데이트 (실시간 반영)
      currentBalance = newBalance;
      loadCreditBalance();
    }

    // 응답 표시
    function displayResponse(question, response, cost) {
      const chatArea = document.getElementById('chat-area');

      const responseHtml = `
        <div class="response-card">
          <div class="response-header">🤖 ${selectedAI} 응답</div>

          <div class="question-box">
            <strong>질문:</strong> ${escapeHtml(question)}
          </div>

          <div class="answer-box">
            <strong>답변:</strong><br>
            ${escapeHtml(response).replace(/\n/g, '<br>')}
          </div>

          <div class="cost-info">
            사용 크레딧: ₩${cost.toLocaleString()} |
            남은 잔액: ₩${currentBalance.toLocaleString()} ⚡
          </div>

          <div class="response-actions">
            <button onclick="askNewQuestion()">새 질문하기</button>
            <button onclick="copyResponse('${response.replace(/'/g, "\\'")}')">복사</button>
          </div>
        </div>
      `;

      chatArea.innerHTML = responseHtml;
    }

    // 크레딧 부족 팝업
    function showInsufficientCreditPopup(requiredCost) {
      const shortage = requiredCost - currentBalance;

      if (confirm(
        `⚠️ 크레딧 잔액 부족\n\n` +
        `현재 잔액: ₩${currentBalance.toLocaleString()}\n` +
        `필요 크레딧: ₩${requiredCost.toLocaleString()}\n` +
        `부족액: ₩${shortage.toLocaleString()}\n\n` +
        `크레딧을 충전하시겠습니까?`
      )) {
        window.location.href = '/credit/purchase';
      }
    }

    // 유틸리티 함수
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function showLoading() {
      const chatArea = document.getElementById('chat-area');
      chatArea.innerHTML = `
        <div class="loading-box">
          <div class="loading-spinner">●●●</div>
          <div>🤖 ${selectedAI}가 답변 중입니다...</div>
          <div style="margin-top: 12px; color: #6B7280;">잠시만 기다려주세요...</div>
        </div>
      `;
    }

    function hideLoading() {
      // 응답 표시로 자동 대체됨
    }

    function askNewQuestion() {
      document.getElementById('chat-area').innerHTML = `
        <div class="welcome-message">AI 서비스를 선택하고 질문해주세요!</div>
      `;
      document.getElementById('question-input').focus();
    }

    function copyResponse(text) {
      navigator.clipboard.writeText(text);
      alert('✅ 응답이 복사되었습니다!');
    }

    // 초기화 실행
    init();
  </script>
</body>
</html>
```

---

## ✅ 구현 완료 후 검증 체크리스트

### Admin Dashboard 검증
- [ ] 크레딧 현황 통계가 올바르게 표시되는가?
- [ ] 수동 크레딧 지급이 작동하는가?
- [ ] AI 가격 수정이 작동하는가?
- [ ] 일일 API 비용 통계가 표시되는가?

### Database 검증
- [ ] 모든 테이블이 생성되었는가?
- [ ] RLS 정책이 올바르게 적용되었는가?
- [ ] 초기 AI 가격이 삽입되었는가?

### Frontend 검증
- [ ] 크레딧 위젯이 실시간으로 업데이트되는가?
- [ ] 크레딧 충전이 작동하는가?
- [ ] AI Q&A에서 질문/응답이 작동하는가?
- [ ] 크레딧 차감이 올바르게 이루어지는가?
- [ ] 잔액 부족 시 팝업이 표시되는가?

### API 연동 검증
- [ ] OpenAI API 연동이 작동하는가?
- [ ] Gemini API 연동이 작동하는가?
- [ ] Perplexity API 연동이 작동하는가?
- [ ] 토스 페이먼트 충전이 작동하는가?

---

**작성자**: Claude Code
**작성일**: 2025-12-03
**상태**: 구현 준비 완료
**다음 단계**: Agenda #8 (My Page 통합) - 전체 섹션 통합 작업
