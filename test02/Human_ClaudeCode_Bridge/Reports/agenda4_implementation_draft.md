# 📋 Agenda #4: 회원가입 & 인증 시스템 - 구현 상세 초안

**작성일**: 2025-12-03
**목표**: 사용자가 회원가입/로그인하고 플랫폼을 이용할 수 있도록 함
**원칙**: Admin → Database → Frontend 3단계 통합

---

## 🎯 구현 개요

### 주요 기능:
1. 회원가입 (이메일 + 비밀번호)
2. 로그인 / 로그아웃
3. Admin: 회원 관리
4. My Page (프로필 섹션)

### 기술 스택:
- **인증**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Frontend**: HTML + JavaScript
- **Admin**: `admin-dashboard_prototype.html`

---

## 1️⃣ Admin Dashboard 구현

### 파일: `admin-dashboard_prototype.html`

### A) HTML 구조 추가

**위치**: 기존 섹션 뒤에 추가

```html
<!-- ========== 회원 관리 섹션 ========== -->
<div id="userManagementSection" class="content-section" style="display: none;">
    <div class="section-header">
        <h2>👥 회원 관리</h2>
        <div class="section-actions">
            <input type="text" id="userSearchInput" placeholder="이메일, 닉네임, 회원 ID 검색..."
                   style="padding: 8px 12px; border: 1px solid #dee2e6; border-radius: 6px; width: 300px;">
            <button onclick="searchUsers()" class="btn-primary">검색</button>
            <button onclick="loadUsers()" class="btn-secondary">전체 조회</button>
        </div>
    </div>

    <!-- 통계 카드 -->
    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
        <div class="stat-card">
            <h3>전체 회원</h3>
            <p class="stat-number" id="totalUsersCount">0</p>
        </div>
        <div class="stat-card">
            <h3>무료 회원</h3>
            <p class="stat-number" id="freeUsersCount">0</p>
        </div>
        <div class="stat-card">
            <h3>유료 회원</h3>
            <p class="stat-number" id="activeUsersCount">0</p>
        </div>
        <div class="stat-card">
            <h3>오늘 가입</h3>
            <p class="stat-number" id="todaySignupsCount">0</p>
        </div>
    </div>

    <!-- 회원 목록 테이블 -->
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>회원 ID</th>
                    <th>이메일</th>
                    <th>닉네임</th>
                    <th>실명</th>
                    <th>구독 상태</th>
                    <th>설치비</th>
                    <th>크레딧</th>
                    <th>가입일</th>
                    <th>작업</th>
                </tr>
            </thead>
            <tbody id="usersTableBody">
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">👥</div>
                        <div>회원 목록을 불러오는 중...</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- 회원 상세 모달 -->
<div id="userDetailModal" class="modal" style="display: none;">
    <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
            <h3>👤 회원 상세 정보</h3>
            <button class="modal-close" onclick="closeUserDetailModal()">&times;</button>
        </div>
        <div class="modal-body" id="userDetailContent">
            <!-- 회원 상세 정보가 여기에 표시됩니다 -->
        </div>
        <div class="modal-footer">
            <button onclick="closeUserDetailModal()" class="btn-secondary">닫기</button>
        </div>
    </div>
</div>
```

### B) CSS 스타일 추가

```html
<style>
    /* 회원 관리 스타일 */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 30px;
    }

    .stat-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .stat-card h3 {
        font-size: 14px;
        color: #6c757d;
        margin-bottom: 10px;
    }

    .stat-number {
        font-size: 32px;
        font-weight: 700;
        color: #f59e0b;
        margin: 0;
    }

    .table-container {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
    }

    .data-table thead {
        background: #f8f9fa;
    }

    .data-table th {
        padding: 12px 16px;
        text-align: left;
        font-weight: 600;
        color: #495057;
        border-bottom: 2px solid #dee2e6;
    }

    .data-table td {
        padding: 12px 16px;
        border-bottom: 1px solid #dee2e6;
    }

    .data-table tbody tr:hover {
        background: #f8f9fa;
    }

    .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }

    .badge-free {
        background: #e9ecef;
        color: #495057;
    }

    .badge-active {
        background: #d4edda;
        color: #155724;
    }

    .badge-paused {
        background: #fff3cd;
        color: #856404;
    }

    .badge-suspended {
        background: #f8d7da;
        color: #721c24;
    }

    .badge-yes {
        background: #d4edda;
        color: #155724;
    }

    .badge-no {
        background: #f8d7da;
        color: #721c24;
    }

    .btn-action {
        padding: 4px 8px;
        font-size: 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 4px;
    }

    .btn-action.view {
        background: #007bff;
        color: white;
    }

    .btn-action.edit {
        background: #ffc107;
        color: #000;
    }

    .btn-action.suspend {
        background: #dc3545;
        color: white;
    }
</style>
```

### C) JavaScript 함수 구현

```javascript
// ========== 회원 관리 함수 ==========

// 회원 목록 로드
async function loadUsers() {
    try {
        console.log('회원 목록 로드 중...');

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('✅ 회원 목록 로드 성공:', data.length, '명');

        // 통계 업데이트
        updateUserStats(data);

        // 테이블 렌더링
        renderUsersTable(data);

    } catch (error) {
        console.error('❌ 회원 목록 로드 실패:', error);
        alert('회원 목록을 불러오는데 실패했습니다: ' + error.message);
    }
}

// 회원 검색
async function searchUsers() {
    const searchTerm = document.getElementById('userSearchInput').value.trim();

    if (!searchTerm) {
        loadUsers();
        return;
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .or(`email.ilike.%${searchTerm}%,nickname.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('✅ 검색 결과:', data.length, '명');

        updateUserStats(data);
        renderUsersTable(data);

    } catch (error) {
        console.error('❌ 검색 실패:', error);
        alert('검색에 실패했습니다: ' + error.message);
    }
}

// 통계 업데이트
function updateUserStats(users) {
    const total = users.length;
    const free = users.filter(u => u.subscription_status === 'free').length;
    const active = users.filter(u => u.subscription_status === 'active').length;

    const today = new Date().toISOString().split('T')[0];
    const todaySignups = users.filter(u =>
        u.created_at && u.created_at.startsWith(today)
    ).length;

    document.getElementById('totalUsersCount').textContent = total;
    document.getElementById('freeUsersCount').textContent = free;
    document.getElementById('activeUsersCount').textContent = active;
    document.getElementById('todaySignupsCount').textContent = todaySignups;
}

// 회원 테이블 렌더링
function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                    <div>검색 결과가 없습니다.</div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td><strong>${escapeHtml(user.user_id)}</strong></td>
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(user.nickname || '-')}</td>
            <td>${escapeHtml(user.real_name || '-')}</td>
            <td>${getSubscriptionBadge(user.subscription_status)}</td>
            <td>${user.installation_fee_paid ? '<span class="badge badge-yes">완료</span>' : '<span class="badge badge-no">미납</span>'}</td>
            <td>₩${(user.credit_balance || 0).toLocaleString()}</td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <button class="btn-action view" onclick="viewUserDetail('${user.id}')">상세</button>
                <button class="btn-action edit" onclick="editUser('${user.id}')">수정</button>
            </td>
        </tr>
    `).join('');
}

// 구독 상태 뱃지
function getSubscriptionBadge(status) {
    const badges = {
        'free': '<span class="badge badge-free">무료</span>',
        'active': '<span class="badge badge-active">활성</span>',
        'paused': '<span class="badge badge-paused">일시정지</span>',
        'suspended': '<span class="badge badge-suspended">정지</span>',
        'cancelled': '<span class="badge badge-suspended">해지</span>'
    };
    return badges[status] || '<span class="badge">-</span>';
}

// 날짜 포맷
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
}

// HTML 이스케이프
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 회원 상세 보기
async function viewUserDetail(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        showUserDetailModal(data);

    } catch (error) {
        console.error('❌ 회원 상세 조회 실패:', error);
        alert('회원 정보를 불러오는데 실패했습니다.');
    }
}

// 회원 상세 모달 표시
function showUserDetailModal(user) {
    const modal = document.getElementById('userDetailModal');
    const content = document.getElementById('userDetailContent');

    content.innerHTML = `
        <div style="display: grid; gap: 16px;">
            <div>
                <strong>회원 ID:</strong> ${escapeHtml(user.user_id)}
            </div>
            <div>
                <strong>이메일:</strong> ${escapeHtml(user.email)}
            </div>
            <div>
                <strong>닉네임:</strong> ${escapeHtml(user.nickname || '-')}
            </div>
            <div>
                <strong>실명:</strong> ${escapeHtml(user.real_name || '-')}
            </div>
            <div>
                <strong>구독 상태:</strong> ${getSubscriptionBadge(user.subscription_status)}
            </div>
            <div>
                <strong>설치비 납부:</strong> ${user.installation_fee_paid ? '✅ 완료' : '❌ 미납'}
            </div>
            ${user.installation_date ? `
            <div>
                <strong>설치비 납부일:</strong> ${formatDate(user.installation_date)}
            </div>
            ` : ''}
            <div>
                <strong>크레딧 잔액:</strong> ₩${(user.credit_balance || 0).toLocaleString()}
            </div>
            <div>
                <strong>가입일:</strong> ${formatDate(user.created_at)}
            </div>
            ${user.last_login ? `
            <div>
                <strong>마지막 로그인:</strong> ${formatDate(user.last_login)}
            </div>
            ` : ''}
        </div>
    `;

    modal.style.display = 'flex';
}

// 회원 상세 모달 닫기
function closeUserDetailModal() {
    document.getElementById('userDetailModal').style.display = 'none';
}

// 회원 수정 (placeholder)
function editUser(userId) {
    alert('회원 수정 기능은 추후 구현 예정입니다.\nUser ID: ' + userId);
}

// 페이지 로드 시 회원 목록 로드 (사용자가 회원 관리 섹션 선택 시)
// 좌측 메뉴에 "회원 관리" 추가 필요
```

### D) 좌측 메뉴에 회원 관리 추가

```html
<!-- 기존 메뉴 항목 뒤에 추가 -->
<li onclick="showSection('userManagementSection')">
    <span>👥</span> 회원 관리
</li>
```

---

## 2️⃣ Database (Supabase) 구현

### 파일: `P3_프로토타입_제작/Database/12_create_users.sql`

```sql
-- =====================================================
-- users 테이블 생성
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 회원 정보 저장 및 관리
-- 아젠다: #4 회원가입 & 인증 시스템
-- =====================================================

-- users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,           -- A3B5C7D9 (8자리 영숫자)
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

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- =====================================================
-- 완료!
-- =====================================================
SELECT 'users 테이블이 성공적으로 생성되었습니다!' as status;
```

### 파일: `P3_프로토타입_제작/Database/13_users_rls.sql`

```sql
-- =====================================================
-- users 테이블 RLS (Row Level Security) 정책
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 사용자 정보 보안 관리
-- 아젠다: #4 회원가입 & 인증 시스템
-- =====================================================

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 정책 1: 본인 정보 조회 가능
-- =====================================================
CREATE POLICY "users_select_own"
    ON users
    FOR SELECT
    USING (auth.uid()::text = id::text);

-- =====================================================
-- 정책 2: 회원가입 시 INSERT 가능 (누구나)
-- =====================================================
CREATE POLICY "users_insert_signup"
    ON users
    FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- 정책 3: 본인 정보 수정 가능
-- =====================================================
CREATE POLICY "users_update_own"
    ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- =====================================================
-- 정책 4: Admin은 모든 사용자 조회 가능
-- =====================================================
-- Admin 역할 확인: auth.jwt() -> role = 'admin'
-- (실제 구현 시 Admin 역할 설정 필요)
CREATE POLICY "users_select_admin"
    ON users
    FOR SELECT
    USING (
        (auth.jwt() ->> 'role') = 'admin'
    );

-- =====================================================
-- RLS 정책 요약
-- =====================================================
-- [SELECT]
--   - 사용자: 본인 정보만 조회 가능
--   - Admin: 모든 사용자 조회 가능
--
-- [INSERT]
--   - 회원가입 시: 모두 가능
--
-- [UPDATE]
--   - 사용자: 본인 정보만 수정 가능
--
-- [DELETE]
--   - 불가 (회원 탈퇴는 status 변경으로 처리)
-- =====================================================

SELECT 'users 테이블 RLS 정책이 적용되었습니다!' as status;
```

### 파일: `P3_프로토타입_제작/Database/14_users_sample_data.sql`

```sql
-- =====================================================
-- users 테이블 샘플 데이터
-- =====================================================
-- 작성일: 2025-12-03
-- 목적: 테스트용 회원 데이터
-- 아젠다: #4 회원가입 & 인증 시스템
-- =====================================================

-- 샘플 회원 데이터 (10명)
INSERT INTO users (user_id, email, nickname, real_name, subscription_status, installation_fee_paid, credit_balance) VALUES
('A1B2C3D4', 'user1@example.com', '써니', '김써니', 'active', true, 15000),
('E5F6G7H8', 'user2@example.com', '달빛', '이달빛', 'active', true, 8000),
('I9J0K1L2', 'user3@example.com', '별하늘', '박별하', 'free', false, 0),
('M3N4O5P6', 'user4@example.com', '바람', '최바람', 'free', false, 2000),
('Q7R8S9T0', 'user5@example.com', '구름', '정구름', 'active', true, 25000),
('U1V2W3X4', 'user6@example.com', '하늘', '강하늘', 'paused', true, 5000),
('Y5Z6A7B8', 'user7@example.com', '강물', '윤강물', 'free', false, 0),
('C9D0E1F2', 'user8@example.com', '산들', '조산들', 'active', true, 12000),
('G3H4I5J6', 'user9@example.com', '꽃잎', '임꽃잎', 'free', false, 1000),
('K7L8M9N0', 'user10@example.com', '이슬', '한이슬', 'active', true, 18000);

-- 일부 회원 설치비 납부일 설정
UPDATE users SET installation_date = NOW() - INTERVAL '10 days' WHERE user_id = 'A1B2C3D4';
UPDATE users SET installation_date = NOW() - INTERVAL '5 days' WHERE user_id = 'E5F6G7H8';
UPDATE users SET installation_date = NOW() - INTERVAL '15 days' WHERE user_id = 'Q7R8S9T0';

-- 일부 회원 플랫폼 이용료 시작일 설정
UPDATE users SET platform_fee_start_date = NOW() + INTERVAL '20 days' WHERE user_id = 'A1B2C3D4';
UPDATE users SET platform_fee_start_date = NOW() + INTERVAL '25 days' WHERE user_id = 'E5F6G7H8';
UPDATE users SET platform_fee_start_date = NOW() + INTERVAL '15 days' WHERE user_id = 'Q7R8S9T0';

-- =====================================================
-- 완료!
-- =====================================================
SELECT
    COUNT(*) as total_users,
    SUM(CASE WHEN installation_fee_paid THEN 1 ELSE 0 END) as paid_users,
    SUM(CASE WHEN subscription_status = 'free' THEN 1 ELSE 0 END) as free_users
FROM users;
```

---

## 3️⃣ Frontend 구현

### A) 회원가입 페이지

**파일**: `P3_프로토타입_제작/Frontend/Prototype/signup.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원가입 - SSAL Works</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .signup-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            padding: 40px;
        }

        .logo {
            text-align: center;
            font-size: 48px;
            margin-bottom: 10px;
        }

        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
        }

        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }

        input[type="email"],
        input[type="password"],
        input[type="text"] {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input:focus {
            outline: none;
            border-color: #667eea;
        }

        .checkbox-group {
            margin-bottom: 20px;
        }

        .checkbox-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .checkbox-item input[type="checkbox"] {
            margin-right: 8px;
        }

        .checkbox-item label {
            margin: 0;
            font-weight: 400;
            cursor: pointer;
        }

        .required {
            color: #dc3545;
        }

        .btn-signup {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .btn-signup:hover {
            transform: translateY(-2px);
        }

        .btn-signup:active {
            transform: translateY(0);
        }

        .login-link {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 14px;
        }

        .login-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }

        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }

        .help-text {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="signup-container">
        <div class="logo">🌾</div>
        <h1>SSAL Works 회원가입</h1>
        <p class="subtitle">무료로 시작하고 학습 콘텐츠를 이용하세요</p>

        <div id="errorMessage" class="error-message"></div>

        <form id="signupForm" onsubmit="handleSignup(event)">
            <div class="form-group">
                <label for="email">이메일 <span class="required">*</span></label>
                <input type="email" id="email" required placeholder="example@email.com">
            </div>

            <div class="form-group">
                <label for="password">비밀번호 <span class="required">*</span></label>
                <input type="password" id="password" required placeholder="8자 이상">
                <p class="help-text">영문, 숫자, 특수문자 포함 8자 이상</p>
            </div>

            <div class="form-group">
                <label for="passwordConfirm">비밀번호 확인 <span class="required">*</span></label>
                <input type="password" id="passwordConfirm" required placeholder="비밀번호 재입력">
            </div>

            <div class="form-group">
                <label for="nickname">닉네임 <span class="required">*</span></label>
                <input type="text" id="nickname" required placeholder="2-20자" maxlength="20">
            </div>

            <div class="form-group">
                <label for="realName">실명 <span class="required">*</span></label>
                <input type="text" id="realName" required placeholder="입금자명 확인용">
                <p class="help-text">설치비 납부 시 입금자명 확인에 사용됩니다</p>
            </div>

            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="agreeTerms" required>
                    <label for="agreeTerms">서비스 이용약관 동의 <span class="required">*</span></label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="agreePrivacy" required>
                    <label for="agreePrivacy">개인정보 처리방침 동의 <span class="required">*</span></label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="agreeMarketing">
                    <label for="agreeMarketing">마케팅 정보 수신 동의 (선택)</label>
                </div>
            </div>

            <button type="submit" class="btn-signup">회원가입</button>
        </form>

        <div class="login-link">
            이미 계정이 있으신가요? <a href="login.html">로그인</a>
        </div>
    </div>

    <script>
        // Supabase 초기화
        const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzE1NTEsImV4cCI6MjA3OTE0NzU1MX0.AJy34h5VR8QS6WFEcUcBeJJu8I3bBQ6UCk1I84Wb7y4';
        const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // 회원 ID 생성 (8자리 영숫자)
        function generateUserId() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let userId = '';
            for (let i = 0; i < 8; i++) {
                userId += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return userId;
        }

        // 비밀번호 검증
        function validatePassword(password) {
            if (password.length < 8) {
                return '비밀번호는 8자 이상이어야 합니다.';
            }

            const hasLetter = /[a-zA-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (!hasLetter || !hasNumber || !hasSpecial) {
                return '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.';
            }

            return null;
        }

        // 에러 메시지 표시
        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';

            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }

        // 회원가입 처리
        async function handleSignup(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;
            const nickname = document.getElementById('nickname').value;
            const realName = document.getElementById('realName').value;

            // 비밀번호 확인
            if (password !== passwordConfirm) {
                showError('비밀번호가 일치하지 않습니다.');
                return;
            }

            // 비밀번호 검증
            const passwordError = validatePassword(password);
            if (passwordError) {
                showError(passwordError);
                return;
            }

            try {
                // 회원 ID 생성
                const userId = generateUserId();

                // Supabase Auth로 회원가입
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: email,
                    password: password
                });

                if (authError) throw authError;

                // users 테이블에 레코드 생성
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .insert({
                        id: authData.user.id,
                        user_id: userId,
                        email: email,
                        nickname: nickname,
                        real_name: realName,
                        subscription_status: 'free',
                        installation_fee_paid: false,
                        credit_balance: 0
                    })
                    .select()
                    .single();

                if (userError) throw userError;

                // 성공 - 환영 페이지로 이동
                alert(`🎉 회원가입이 완료되었습니다!\n\n회원 ID: ${userId}\n닉네임: ${nickname}\n\nBooks 학습 콘텐츠를 무료로 이용하실 수 있습니다.`);
                window.location.href = 'prototype_index_최종개선.html';

            } catch (error) {
                console.error('회원가입 실패:', error);

                if (error.message.includes('duplicate key')) {
                    if (error.message.includes('email')) {
                        showError('이미 가입된 이메일입니다.');
                    } else if (error.message.includes('nickname')) {
                        showError('이미 사용 중인 닉네임입니다.');
                    }
                } else {
                    showError('회원가입에 실패했습니다: ' + error.message);
                }
            }
        }
    </script>
</body>
</html>
```

---

## ✅ Agenda #4 완료 기준

### Admin Dashboard:
- [x] 회원 관리 섹션 HTML 구조
- [x] 회원 목록 조회 기능
- [x] 회원 검색 기능
- [x] 회원 상세 조회 기능
- [x] 통계 대시보드

### Database:
- [x] `users` 테이블 생성 SQL
- [x] RLS 정책 설정 SQL
- [x] 샘플 데이터 SQL

### Frontend:
- [x] 회원가입 페이지 (signup.html)
- [ ] 로그인 페이지 (login.html) - 다음 파일로 작성
- [ ] My Page 프로필 섹션 - 다음 파일로 작성

---

**작성자**: Claude Code
**작성일**: 2025-12-03
**다음 단계**: 로그인 페이지 및 My Page 구현
