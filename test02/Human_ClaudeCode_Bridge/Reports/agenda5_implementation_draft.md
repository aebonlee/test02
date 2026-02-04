# Agenda #5: 프로젝트 관리 & 설치비 납부 - 구현 초안

**작성일**: 2025-12-03
**아젠다**: #5
**목표**: 사용자가 설치비를 납부하고 프로젝트를 등록/관리할 수 있도록 함
**근거 문서**: User Flow #2 (Project Registration) UI 명세

---

## 📋 구현 체크리스트

### Admin Dashboard
- [ ] 설치비 관리 섹션 구현
- [ ] 프로젝트 관리 섹션 구현

### Database
- [ ] `projects` 테이블 생성
- [ ] `installation_payment_requests` 테이블 생성
- [ ] RLS 정책 설정

### Frontend
- [ ] 설치비 안내 페이지 (`/payment/installation`)
- [ ] 입금 안내 페이지
- [ ] 입금 확인 대기 화면
- [ ] 프로젝트 목록 페이지 (`/projects`)
- [ ] 프로젝트 등록 페이지 (`/projects/new`)
- [ ] 프로젝트 등록 완료 팝업
- [ ] PROJECT SAL Grid 초기 화면 (`/projects/{id}/grid`)
- [ ] 진행 중인 프로젝트 완료 유도 모달

---

## 🎨 1단계: Admin Dashboard 구현

### 1-1. 설치비 관리 섹션

**파일 위치**: `P3_프로토타입_제작/admin-dashboard_prototype.html`

```html
<!-- ================================================= -->
<!-- 설치비 관리 섹션 -->
<!-- ================================================= -->
<section id="installation-section" class="admin-section" style="display:none;">
  <h2>💰 설치비 관리</h2>

  <!-- 통계 대시보드 -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">⏳</div>
      <div class="stat-content">
        <div class="stat-label">입금 대기</div>
        <div class="stat-value" id="pending-payment-count">0</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">✅</div>
      <div class="stat-content">
        <div class="stat-label">승인 완료</div>
        <div class="stat-value" id="approved-payment-count">0</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">💵</div>
      <div class="stat-content">
        <div class="stat-label">총 설치비 수익</div>
        <div class="stat-value" id="total-installation-revenue">₩0</div>
      </div>
    </div>
  </div>

  <!-- 입금 대기 목록 -->
  <div class="table-container">
    <h3>입금 대기 목록</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>요청일</th>
          <th>회원 ID</th>
          <th>이메일</th>
          <th>실명</th>
          <th>입금자명</th>
          <th>금액</th>
          <th>상태</th>
          <th>액션</th>
        </tr>
      </thead>
      <tbody id="installation-requests-tbody">
        <!-- 동적 로딩 -->
      </tbody>
    </table>
  </div>
</section>

<!-- CSS -->
<style>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 36px;
}

.stat-label {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1F2937;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #E5E7EB;
}

.admin-table th {
  background: #F3F4F6;
  font-weight: bold;
  color: #374151;
}

.admin-table tbody tr:hover {
  background: #F9FAFB;
}

.btn-approve {
  background: #10B981;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-approve:hover {
  background: #059669;
}

.btn-reject {
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

.btn-reject:hover {
  background: #B91C1C;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-pending {
  background: #FEF3C7;
  color: #92400E;
}

.status-approved {
  background: #D1FAE5;
  color: #065F46;
}

.status-rejected {
  background: #FEE2E2;
  color: #991B1B;
}
</style>

<!-- JavaScript -->
<script>
// 설치비 요청 로딩
async function loadInstallationRequests() {
  try {
    const { data, error } = await supabase
      .from('installation_payment_requests')
      .select(`
        *,
        users (
          user_id,
          email,
          real_name
        )
      `)
      .order('requested_at', { ascending: false });

    if (error) throw error;

    updateInstallationStats(data);
    renderInstallationRequests(data);
  } catch (err) {
    console.error('Error loading installation requests:', err);
    alert('❌ 설치비 요청을 불러오는데 실패했습니다.');
  }
}

// 통계 업데이트
function updateInstallationStats(requests) {
  const pending = requests.filter(r => r.status === 'pending').length;
  const approved = requests.filter(r => r.status === 'approved').length;
  const totalRevenue = approved * 3000000;

  document.getElementById('pending-payment-count').textContent = pending;
  document.getElementById('approved-payment-count').textContent = approved;
  document.getElementById('total-installation-revenue').textContent =
    `₩${totalRevenue.toLocaleString()}`;
}

// 테이블 렌더링
function renderInstallationRequests(requests) {
  const tbody = document.getElementById('installation-requests-tbody');

  if (!requests || requests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:40px;">입금 대기 중인 요청이 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = requests.map(req => {
    const statusClass = `status-${req.status}`;
    const statusText = {
      'pending': '대기',
      'approved': '승인',
      'rejected': '거부'
    }[req.status];

    return `
      <tr>
        <td>${new Date(req.requested_at).toLocaleString('ko-KR')}</td>
        <td><strong>${req.users.user_id}</strong></td>
        <td>${req.users.email}</td>
        <td>${req.users.real_name}</td>
        <td>${req.depositor_name}</td>
        <td><strong>₩${req.amount.toLocaleString()}</strong></td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
          ${req.status === 'pending' ? `
            <button class="btn-approve" onclick="approveInstallation('${req.id}', '${req.user_id}')">승인</button>
            <button class="btn-reject" onclick="rejectInstallation('${req.id}')">거부</button>
          ` : '-'}
        </td>
      </tr>
    `;
  }).join('');
}

// 설치비 승인
async function approveInstallation(requestId, userId) {
  if (!confirm('이 설치비 입금을 승인하시겠습니까?\n\n승인 시:\n- 사용자의 installation_fee_paid = true\n- AI 크레딧 ₩5,000 자동 지급\n- 사용자에게 알림 발송')) {
    return;
  }

  try {
    // 1. 요청 상태 변경
    const { error: updateError } = await supabase
      .from('installation_payment_requests')
      .update({
        status: 'approved',
        processed_at: new Date().toISOString(),
        processed_by: 'admin' // 실제로는 현재 관리자 ID
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // 2. 사용자 정보 업데이트
    const { error: userError } = await supabase
      .from('users')
      .update({
        installation_fee_paid: true,
        installation_date: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (userError) throw userError;

    // 3. AI 크레딧 지급 (₩5,000)
    // TODO: credit_balance 및 credit_transactions 업데이트

    alert('✅ 설치비 승인 완료!\n\n- 사용자 계정 활성화\n- AI 크레딧 ₩5,000 지급\n- 알림 발송 완료');

    // 새로고침
    loadInstallationRequests();
  } catch (err) {
    console.error('Error approving installation:', err);
    alert('❌ 설치비 승인에 실패했습니다.');
  }
}

// 설치비 거부
async function rejectInstallation(requestId) {
  const reason = prompt('거부 사유를 입력해주세요:');
  if (!reason) return;

  try {
    const { error } = await supabase
      .from('installation_payment_requests')
      .update({
        status: 'rejected',
        processed_at: new Date().toISOString(),
        processed_by: 'admin',
        reject_reason: reason
      })
      .eq('id', requestId);

    if (error) throw error;

    alert('✅ 설치비 요청이 거부되었습니다.\n사용자에게 사유가 전달됩니다.');
    loadInstallationRequests();
  } catch (err) {
    console.error('Error rejecting installation:', err);
    alert('❌ 설치비 거부에 실패했습니다.');
  }
}

// 초기 로딩
loadInstallationRequests();
</script>
```

### 1-2. 프로젝트 관리 섹션

```html
<!-- ================================================= -->
<!-- 프로젝트 관리 섹션 -->
<!-- ================================================= -->
<section id="projects-section" class="admin-section" style="display:none;">
  <h2>📁 프로젝트 관리</h2>

  <!-- 검색 & 필터 -->
  <div class="filter-bar">
    <input type="text" id="project-search" placeholder="프로젝트 ID, 사용자 ID, 프로젝트명 검색..." class="search-input">
    <select id="project-status-filter" class="filter-select">
      <option value="">전체 상태</option>
      <option value="in_progress">진행 중</option>
      <option value="completed">완료됨</option>
      <option value="archived">보관됨</option>
    </select>
  </div>

  <!-- 프로젝트 목록 -->
  <div class="table-container">
    <table class="admin-table">
      <thead>
        <tr>
          <th>프로젝트 ID</th>
          <th>프로젝트명</th>
          <th>사용자</th>
          <th>상태</th>
          <th>진행률</th>
          <th>생성일</th>
          <th>액션</th>
        </tr>
      </thead>
      <tbody id="projects-tbody">
        <!-- 동적 로딩 -->
      </tbody>
    </table>
  </div>
</section>

<script>
// 프로젝트 로딩
async function loadProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        users (
          user_id,
          email,
          nickname
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    renderProjects(data);
  } catch (err) {
    console.error('Error loading projects:', err);
    alert('❌ 프로젝트를 불러오는데 실패했습니다.');
  }
}

// 프로젝트 렌더링
function renderProjects(projects) {
  const tbody = document.getElementById('projects-tbody');

  if (!projects || projects.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:40px;">프로젝트가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = projects.map(project => {
    const statusBadge = {
      'in_progress': '<span class="status-badge" style="background:#DBEAFE; color:#1E40AF;">진행 중</span>',
      'completed': '<span class="status-badge" style="background:#D1FAE5; color:#065F46;">완료됨</span>',
      'archived': '<span class="status-badge" style="background:#F3F4F6; color:#6B7280;">보관됨</span>'
    }[project.status];

    return `
      <tr>
        <td><strong>${project.project_id}</strong></td>
        <td>${project.project_name}</td>
        <td>${project.users.user_id} (${project.users.nickname})</td>
        <td>${statusBadge}</td>
        <td>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${project.progress}%"></div>
          </div>
          <span class="progress-text">${project.progress}%</span>
        </td>
        <td>${new Date(project.created_at).toLocaleDateString('ko-KR')}</td>
        <td>
          <button class="btn-action" onclick="viewProjectDetail('${project.id}')">상세</button>
        </td>
      </tr>
    `;
  }).join('');
}

// 프로젝트 상세보기
function viewProjectDetail(projectId) {
  // TODO: 프로젝트 상세 모달 표시
  alert(`프로젝트 상세 보기: ${projectId}`);
}

// 초기 로딩
loadProjects();
</script>
```

---

## 🗄️ 2단계: Database 구현

### 파일 위치: `P3_프로토타입_제작/Database/`

### 2-1. `15_create_projects.sql`

```sql
-- =====================================================
-- Projects 테이블 생성
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 사용자 프로젝트 정보 관리
-- =====================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_id TEXT UNIQUE NOT NULL,
    project_name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'archived')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    current_stage INTEGER DEFAULT 0 CHECK (current_stage >= 0 AND current_stage <= 5),
    total_stages INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_project_id ON public.projects(project_id);

-- 제약 조건: 한 사용자당 진행 중인 프로젝트 1개만
CREATE UNIQUE INDEX idx_one_in_progress_per_user
ON public.projects(user_id)
WHERE status = 'in_progress';

-- 자동 updated_at 업데이트
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_projects_updated_at();

-- 완료
SELECT '✅ projects 테이블 생성 완료!' as status;
```

### 2-2. `16_create_installation_payment_requests.sql`

```sql
-- =====================================================
-- Installation Payment Requests 테이블 생성
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 설치비 입금 확인 요청 관리
-- =====================================================

CREATE TABLE IF NOT EXISTS public.installation_payment_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    depositor_name TEXT NOT NULL,
    amount INTEGER DEFAULT 3000000,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    processed_by TEXT,
    reject_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_payment_requests_status ON public.installation_payment_requests(status);
CREATE INDEX idx_payment_requests_user_id ON public.installation_payment_requests(user_id);
CREATE INDEX idx_payment_requests_requested_at ON public.installation_payment_requests(requested_at DESC);

-- 완료
SELECT '✅ installation_payment_requests 테이블 생성 완료!' as status;
```

### 2-3. `17_projects_rls.sql`

```sql
-- =====================================================
-- Projects RLS 정책 (프로덕션용)
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 프로젝트 데이터 보안
-- =====================================================

-- RLS 활성화
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 정책 1: 사용자는 본인의 프로젝트만 조회 가능
CREATE POLICY "users_select_own_projects" ON public.projects
    FOR SELECT
    TO authenticated
    USING (user_id = auth.jwt() ->> 'user_id');

-- 정책 2: 사용자는 본인의 프로젝트만 생성 가능
CREATE POLICY "users_insert_own_projects" ON public.projects
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.jwt() ->> 'user_id');

-- 정책 3: 사용자는 본인의 프로젝트만 수정 가능
CREATE POLICY "users_update_own_projects" ON public.projects
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.jwt() ->> 'user_id')
    WITH CHECK (user_id = auth.jwt() ->> 'user_id');

-- 정책 4: 사용자는 본인의 프로젝트만 삭제 가능
CREATE POLICY "users_delete_own_projects" ON public.projects
    FOR DELETE
    TO authenticated
    USING (user_id = auth.jwt() ->> 'user_id');

-- 완료
SELECT '✅ projects RLS 정책 적용 완료!' as status;
```

### 2-4. `17_projects_rls_dev.sql` (개발용)

```sql
-- =====================================================
-- Projects RLS 정책 (개발 환경용)
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 개발 중 anon 키로 테스트 가능하도록
-- ⚠️  프로덕션 배포 전 반드시 17_projects_rls.sql로 교체!
-- =====================================================

-- RLS 활성화
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 개발용 정책: 모든 작업 허용
CREATE POLICY "projects_select_all_dev" ON public.projects
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "projects_insert_all_dev" ON public.projects
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "projects_update_all_dev" ON public.projects
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "projects_delete_all_dev" ON public.projects
    FOR DELETE
    TO public
    USING (true);

-- 완료
SELECT '✅ projects 개발용 RLS 정책 적용 완료!' as status,
       '⚠️  프로덕션 배포 전 원래 정책으로 되돌려야 합니다!' as warning;
```

### 2-5. `18_sample_projects.sql`

```sql
-- =====================================================
-- Projects 샘플 데이터
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 테스트용 샘플 프로젝트
-- =====================================================

-- 샘플 프로젝트 1: 진행 중
INSERT INTO public.projects (
    user_id,
    project_id,
    project_name,
    description,
    status,
    progress,
    current_stage,
    total_stages
) VALUES (
    'A3B5C7D9',  -- 실제 테스트 사용자 ID로 변경
    'A3B5C7D9-P001',
    '블로그 프로젝트',
    '개인 블로그 사이트\n일상, 여행, 사진 공유',
    'in_progress',
    85,
    4,
    5
);

-- 샘플 프로젝트 2: 완료됨
INSERT INTO public.projects (
    user_id,
    project_id,
    project_name,
    description,
    status,
    progress,
    current_stage,
    total_stages,
    completed_at
) VALUES (
    'A3B5C7D9',
    'A3B5C7D9-P000',
    '테스트 프로젝트',
    '첫 번째 테스트 프로젝트',
    'completed',
    100,
    5,
    5,
    NOW() - INTERVAL '7 days'
);

-- 완료
SELECT '✅ 샘플 프로젝트 생성 완료!' as status;
```

---

## 🌐 3단계: Frontend 구현

### 3-1. `/payment/installation` - 설치비 안내 페이지

**파일 위치**: `P3_프로토타입_제작/Frontend/payment_installation.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSAL Works 설치비 안내</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
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
      margin-bottom: 16px;
      text-align: center;
    }

    .subtitle {
      font-size: 16px;
      color: #6B7280;
      text-align: center;
      margin-bottom: 32px;
    }

    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 24px 0;
    }

    .price-section {
      text-align: center;
      margin: 32px 0;
    }

    .price-label {
      font-size: 16px;
      color: #6B7280;
      margin-bottom: 8px;
    }

    .price {
      font-size: 32px;
      font-weight: bold;
      color: #10B981;
    }

    .features {
      margin: 24px 0;
    }

    .features h3 {
      font-size: 18px;
      color: #374151;
      margin-bottom: 16px;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 14px;
      color: #374151;
    }

    .feature-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .special-offer {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid #10B981;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }

    .special-offer h3 {
      font-size: 18px;
      color: #065F46;
      margin-bottom: 12px;
    }

    .refund-amount {
      font-size: 24px;
      font-weight: bold;
      color: #10B981;
      margin: 12px 0;
    }

    .refund-conditions {
      font-size: 14px;
      color: #374151;
      margin-top: 12px;
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

    .btn-primary:hover {
      background: #059669;
    }

    .btn-secondary {
      background: transparent;
      color: #6B7280;
      border: 1px solid #D1D5DB;
    }

    .btn-secondary:hover {
      background: #F3F4F6;
    }

    /* 반응형 */
    @media (max-width: 768px) {
      .card {
        padding: 24px;
      }

      .buttons {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1 class="title">💰 SSAL Works 설치비</h1>
      <p class="subtitle">프로젝트를 등록하려면 설치비 납부가 필요합니다</p>

      <div class="divider"></div>

      <div class="price-section">
        <div class="price-label">설치비</div>
        <div class="price">₩3,000,000</div>
      </div>

      <div class="features">
        <h3>포함 내용:</h3>
        <div class="feature-item">
          <span class="feature-icon">✅</span>
          <span>프로젝트 평생 무제한 등록 (동시 1개만)</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">✅</span>
          <span>PROJECT SAL Grid 시스템 무제한 사용</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">✅</span>
          <span>플랫폼 이용료 1개월 면제 (₩50,000)</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">✅</span>
          <span>AI 크레딧 ₩5,000 지급<br>(ChatGPT, Gemini, Perplexity)</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">✅</span>
          <span>Books + FAQ 무제한</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">✅</span>
          <span>"써니에게 묻기" 무제한 (비즈니스 멘토링)</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="special-offer">
        <h3>🎁 특별 혜택</h3>
        <div class="refund-amount">성공 시 50% 환불 (₩1,500,000)</div>
        <div class="refund-conditions">
          <strong>환불 조건 (3개월 내):</strong><br>
          ✅ 웹사이트 완성 및 배포<br>
          ✅ 서비스 런칭<br>
          ✅ 10명 이상 고객 수입 발생
        </div>
      </div>

      <div class="divider"></div>

      <div class="buttons">
        <button class="btn btn-primary" onclick="proceedToPayment()">설치비 납부하기</button>
        <button class="btn btn-secondary" onclick="goBack()">나중에</button>
      </div>
    </div>
  </div>

  <script>
    // Supabase 초기화
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    function proceedToPayment() {
      // 입금 안내 페이지로 이동
      window.location.href = '/payment/installation-deposit';
    }

    function goBack() {
      window.history.back();
    }
  </script>
</body>
</html>
```

### 3-2. `/payment/installation-deposit` - 입금 안내 페이지

**파일 위치**: `P3_프로토타입_제작/Frontend/payment_installation_deposit.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>입금 정보 - SSAL Works</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
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
      max-width: 500px;
      margin: 0 auto;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .title {
      font-size: 24px;
      font-weight: bold;
      color: #1F2937;
      margin-bottom: 24px;
      text-align: center;
    }

    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 24px 0;
    }

    .info-table {
      width: 100%;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #F3F4F6;
    }

    .info-label {
      font-size: 14px;
      font-weight: bold;
      color: #6B7280;
    }

    .info-value {
      font-size: 16px;
      color: #1F2937;
    }

    .info-value.amount {
      font-size: 20px;
      font-weight: bold;
      color: #10B981;
    }

    .warning-box {
      background: #FEF3C7;
      border: 1px solid #F59E0B;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
    }

    .warning-box h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      color: #92400E;
      margin-bottom: 12px;
    }

    .warning-box p {
      font-size: 14px;
      color: #92400E;
      line-height: 1.6;
    }

    .depositor-name {
      font-size: 16px;
      font-weight: bold;
      color: #1F2937;
      margin: 8px 0;
    }

    .btn-submit {
      width: 100%;
      height: 48px;
      background: #10B981;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 24px;
    }

    .btn-submit:hover {
      background: #059669;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1 class="title">💳 입금 정보</h1>

      <div class="divider"></div>

      <div class="info-table">
        <div class="info-row">
          <span class="info-label">은행</span>
          <span class="info-value">하나은행</span>
        </div>
        <div class="info-row">
          <span class="info-label">계좌번호</span>
          <span class="info-value">287-910921-40507</span>
        </div>
        <div class="info-row">
          <span class="info-label">예금주</span>
          <span class="info-value">선웅규</span>
        </div>
        <div class="info-row">
          <span class="info-label">입금액</span>
          <span class="info-value amount">₩3,000,000</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="warning-box">
        <h3>⚠️ 중요 안내</h3>
        <p>입금자명: <span class="depositor-name" id="depositor-name">김써니</span></p>
        <p>(회원가입 시 입력한 실명)</p>
        <p style="margin-top: 12px;">
          입금자명이 실명과 다를 경우<br>
          확인이 지연될 수 있습니다.
        </p>
      </div>

      <p style="text-align: center; color: #6B7280; font-size: 14px; margin-top: 24px;">
        입금 후 아래 버튼을 클릭해주세요.
      </p>

      <button class="btn-submit" onclick="confirmDeposit()">입금 완료</button>
    </div>
  </div>

  <script>
    // Supabase 초기화
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 사용자 정보 로딩
    async function loadUserInfo() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert('로그인이 필요합니다.');
          window.location.href = '/login';
          return;
        }

        // 사용자 실명 조회
        const { data, error } = await supabase
          .from('users')
          .select('real_name')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        document.getElementById('depositor-name').textContent = data.real_name;
      } catch (err) {
        console.error('Error loading user info:', err);
      }
    }

    // 입금 완료 처리
    async function confirmDeposit() {
      if (!confirm('입금을 완료하셨습니까?\n\n입금 확인은 영업일 기준 24시간 이내에 완료됩니다.')) {
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('로그인 필요');

        // 사용자 정보 조회
        const { data: userData } = await supabase
          .from('users')
          .select('user_id, real_name')
          .eq('id', user.id)
          .single();

        // 입금 확인 요청 등록
        const { error } = await supabase
          .from('installation_payment_requests')
          .insert({
            user_id: userData.user_id,
            depositor_name: userData.real_name,
            amount: 3000000,
            status: 'pending'
          });

        if (error) throw error;

        // 대기 화면으로 이동
        window.location.href = '/payment/installation-pending';
      } catch (err) {
        console.error('Error confirming deposit:', err);
        alert('❌ 입금 확인 요청에 실패했습니다.');
      }
    }

    // 초기 로딩
    loadUserInfo();
  </script>
</body>
</html>
```

### 3-3. `/projects/new` - 프로젝트 등록 페이지

**파일 위치**: `P3_프로토타입_제작/Frontend/projects_new.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>새 프로젝트 등록 - SSAL Works</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
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
      font-size: 14px;
      color: #6B7280;
      text-align: center;
      margin-bottom: 32px;
    }

    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 24px 0;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: bold;
      color: #374151;
      margin-bottom: 8px;
    }

    .form-label .required {
      color: #DC2626;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 200ms;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #10B981;
      border-width: 2px;
    }

    .form-textarea {
      min-height: 120px;
      resize: vertical;
    }

    .form-hint {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin-top: 8px;
      font-size: 12px;
      color: #9CA3AF;
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
      border-radius: 6px;
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
      background: transparent;
      color: #6B7280;
      border: 1px solid #D1D5DB;
    }

    .btn-secondary:hover {
      background: #F3F4F6;
    }

    .error-message {
      background: #FEE2E2;
      border: 1px solid #EF4444;
      border-radius: 6px;
      padding: 12px;
      margin-top: 8px;
      font-size: 14px;
      color: #991B1B;
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1 class="title">📁 새 프로젝트 등록</h1>
      <p class="subtitle">프로젝트 정보를 입력해주세요.</p>

      <div class="divider"></div>

      <form id="project-form" onsubmit="handleSubmit(event)">
        <!-- 프로젝트명 -->
        <div class="form-group">
          <label class="form-label">
            프로젝트명 <span class="required">*</span>
          </label>
          <input
            type="text"
            class="form-input"
            id="project-name"
            placeholder="예: 블로그 프로젝트"
            maxlength="50"
            required
          >
          <div id="name-error" class="error-message"></div>
        </div>

        <!-- 프로젝트 설명 -->
        <div class="form-group">
          <label class="form-label">프로젝트 설명</label>
          <textarea
            class="form-textarea"
            id="project-description"
            placeholder="개인 블로그 사이트&#10;일상, 여행, 사진 공유"
            maxlength="500"
          ></textarea>
          <div class="form-hint">
            <span>ℹ️</span>
            <span>프로젝트 목적과 주요 기능을 간단히 설명해주세요 (선택사항)</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- 버튼 -->
        <div class="buttons">
          <button type="submit" class="btn btn-primary" id="submit-btn">
            프로젝트 등록하기
          </button>
          <button type="button" class="btn btn-secondary" onclick="cancel()">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>

  <script>
    // Supabase 초기화
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let currentUserId = null;

    // 초기 검증
    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert('로그인이 필요합니다.');
          window.location.href = '/login';
          return;
        }

        // 사용자 정보 조회
        const { data: userData } = await supabase
          .from('users')
          .select('user_id, installation_fee_paid')
          .eq('id', user.id)
          .single();

        currentUserId = userData.user_id;

        // 설치비 미납 시 리다이렉트
        if (!userData.installation_fee_paid) {
          alert('설치비 납부가 필요합니다.');
          window.location.href = '/payment/installation';
          return;
        }

        // 진행 중인 프로젝트 확인
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', currentUserId)
          .eq('status', 'in_progress');

        if (projects && projects.length > 0) {
          showInProgressModal(projects[0]);
        }
      } catch (err) {
        console.error('Error initializing:', err);
        alert('오류가 발생했습니다.');
      }
    }

    // 진행 중인 프로젝트 모달
    function showInProgressModal(project) {
      const proceed = confirm(
        `⚠️ 진행 중인 프로젝트가 있습니다\n\n` +
        `현재 프로젝트: ${project.project_name}\n` +
        `진행률: ${project.progress}% (Stage ${project.current_stage}/${project.total_stages})\n\n` +
        `새 프로젝트를 등록하려면 기존 프로젝트를 먼저 완료해야 합니다.\n\n` +
        `기존 프로젝트를 완료하시겠습니까?`
      );

      if (proceed) {
        // 프로젝트 완료 처리
        completeProject(project.id);
      } else {
        window.location.href = '/projects';
      }
    }

    // 프로젝트 완료
    async function completeProject(projectId) {
      try {
        const { error } = await supabase
          .from('projects')
          .update({
            status: 'completed',
            progress: 100,
            completed_at: new Date().toISOString()
          })
          .eq('id', projectId);

        if (error) throw error;

        alert('✅ 프로젝트가 완료되었습니다!\n이제 새 프로젝트를 등록할 수 있습니다.');
      } catch (err) {
        console.error('Error completing project:', err);
        alert('❌ 프로젝트 완료에 실패했습니다.');
        window.location.href = '/projects';
      }
    }

    // 폼 제출
    async function handleSubmit(event) {
      event.preventDefault();

      const projectName = document.getElementById('project-name').value.trim();
      const description = document.getElementById('project-description').value.trim();
      const errorDiv = document.getElementById('name-error');
      const submitBtn = document.getElementById('submit-btn');

      // 유효성 검사
      if (projectName.length < 2) {
        errorDiv.textContent = '프로젝트명은 최소 2자 이상이어야 합니다.';
        errorDiv.style.display = 'block';
        return;
      }

      // 중복 확인
      const { data: existing } = await supabase
        .from('projects')
        .select('id, status')
        .eq('user_id', currentUserId)
        .eq('project_name', projectName);

      if (existing && existing.length > 0) {
        const existingProject = existing[0];
        errorDiv.innerHTML = `
          ❌ 이미 같은 이름의 프로젝트가 있습니다.<br>
          다른 이름을 사용해주세요.<br><br>
          <strong>추천 이름:</strong><br>
          • ${projectName} v2<br>
          • ${projectName} 2025<br>
          • 새 ${projectName}
        `;
        errorDiv.style.display = 'block';
        return;
      }

      errorDiv.style.display = 'none';

      // 프로젝트 ID 생성
      const projectCount = await getProjectCount();
      const projectId = `${currentUserId}-P${String(projectCount + 1).padStart(3, '0')}`;

      // 등록 처리
      submitBtn.disabled = true;
      submitBtn.textContent = '등록 중...';

      try {
        const { error } = await supabase
          .from('projects')
          .insert({
            user_id: currentUserId,
            project_id: projectId,
            project_name: projectName,
            description: description || null,
            status: 'in_progress',
            progress: 0,
            current_stage: 0,
            total_stages: 5
          });

        if (error) throw error;

        // 완료 팝업 표시
        showSuccessModal(projectName, projectId);
      } catch (err) {
        console.error('Error creating project:', err);
        alert('❌ 프로젝트 등록에 실패했습니다.');
        submitBtn.disabled = false;
        submitBtn.textContent = '프로젝트 등록하기';
      }
    }

    // 프로젝트 개수 조회
    async function getProjectCount() {
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId);

      return count || 0;
    }

    // 완료 모달
    function showSuccessModal(projectName, projectId) {
      alert(
        `🎉 프로젝트가 등록되었습니다!\n\n` +
        `프로젝트: ${projectName}\n` +
        `등록일: ${new Date().toLocaleDateString('ko-KR')}\n\n` +
        `이제 PROJECT SAL Grid에서 작업을 시작할 수 있습니다!`
      );

      window.location.href = `/projects/${projectId}/grid`;
    }

    // 취소
    function cancel() {
      if (confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
        window.location.href = '/projects';
      }
    }

    // 초기화
    init();
  </script>
</body>
</html>
```

---

## ✅ 구현 완료 후 검증 체크리스트

### Admin Dashboard 검증
- [ ] 설치비 대기 목록이 표시되는가?
- [ ] "승인" 버튼 클릭 시 사용자 계정이 활성화되는가?
- [ ] AI 크레딧 ₩5,000이 자동 지급되는가?
- [ ] 프로젝트 목록이 올바르게 표시되는가?

### Database 검증
- [ ] `projects` 테이블이 생성되었는가?
- [ ] `installation_payment_requests` 테이블이 생성되었는가?
- [ ] RLS 정책이 올바르게 적용되었는가?
- [ ] 샘플 데이터가 삽입되었는가?

### Frontend 검증
- [ ] 설치비 안내 페이지가 올바르게 표시되는가?
- [ ] 입금 안내 페이지에서 사용자 실명이 표시되는가?
- [ ] 프로젝트 등록 시 중복 검사가 작동하는가?
- [ ] 진행 중인 프로젝트가 있을 때 모달이 표시되는가?
- [ ] 프로젝트 등록 완료 후 Grid 화면으로 이동하는가?

---

**작성자**: Claude Code
**작성일**: 2025-12-03
**상태**: 구현 준비 완료
**다음 단계**: Agenda #6 구현 초안 작성
