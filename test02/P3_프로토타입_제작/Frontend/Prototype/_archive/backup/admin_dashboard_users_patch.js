/**
 * Admin Dashboard - 회원 관리 Supabase 연동 패치
 * =====================================================
 * 작성일: 2025-12-10
 * 목적: 회원 관리 섹션 Supabase 연동 JavaScript 함수
 * 적용 방법: admin-dashboard_prototype.html의 </script> 태그 앞에 이 내용 추가
 * =====================================================
 */

// ========== 회원 관리 함수 ==========

/**
 * 회원 목록 로드
 */
async function loadUsers() {
    try {
        console.log('📥 회원 목록 로드 중...');
        showLoading();

        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('✅ 회원 목록 로드 성공:', data.length, '명');

        // 통계 업데이트
        updateUserStats(data);

        // 테이블 렌더링
        renderUsersTable(data);

        hideLoading();

    } catch (error) {
        console.error('❌ 회원 목록 로드 실패:', error);
        showToast('회원 목록을 불러오는데 실패했습니다: ' + error.message, 'error');
        hideLoading();
    }
}

/**
 * 회원 검색
 */
async function searchUsers() {
    const searchTerm = document.getElementById('userSearchInput').value.trim();

    if (!searchTerm) {
        loadUsers();
        return;
    }

    try {
        console.log('🔍 회원 검색 중:', searchTerm);
        showLoading();

        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .or(`email.ilike.%${searchTerm}%,nickname.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('✅ 검색 결과:', data.length, '명');

        updateUserStats(data);
        renderUsersTable(data);

        hideLoading();

    } catch (error) {
        console.error('❌ 검색 실패:', error);
        showToast('검색에 실패했습니다: ' + error.message, 'error');
        hideLoading();
    }
}

/**
 * 회원 통계 업데이트
 */
function updateUserStats(users) {
    const total = users.length;
    const free = users.filter(u => u.subscription_status === 'free' || !u.subscription_status).length;
    const active = users.filter(u => u.subscription_status === 'active').length;

    const today = new Date().toISOString().split('T')[0];
    const todaySignups = users.filter(u =>
        u.created_at && u.created_at.startsWith(today)
    ).length;

    // DOM 요소 업데이트
    const totalEl = document.getElementById('totalUsersCount');
    const freeEl = document.getElementById('freeUsersCount');
    const activeEl = document.getElementById('activeUsersCount');
    const todayEl = document.getElementById('todaySignupsCount');

    if (totalEl) totalEl.textContent = total;
    if (freeEl) freeEl.textContent = free;
    if (activeEl) activeEl.textContent = active;
    if (todayEl) todayEl.textContent = todaySignups;
}

/**
 * 회원 테이블 렌더링
 */
function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) {
        console.warn('usersTableBody 요소를 찾을 수 없습니다.');
        return;
    }

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                    <div style="color: #6c757d;">검색 결과가 없습니다.</div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td><strong>${escapeHtmlUser(user.user_id || '-')}</strong></td>
            <td>${escapeHtmlUser(user.email || '-')}</td>
            <td>${escapeHtmlUser(user.nickname || user.name || '-')}</td>
            <td>${escapeHtmlUser(user.real_name || '-')}</td>
            <td>${getSubscriptionBadge(user.subscription_status)}</td>
            <td>${user.installation_fee_paid ? '<span class="status-badge active">완료</span>' : '<span class="status-badge pending">미납</span>'}</td>
            <td>₩${(user.credit_balance || 0).toLocaleString()}</td>
            <td>${formatDateUser(user.created_at)}</td>
            <td>
                <a href="#" class="action-link" onclick="event.preventDefault(); viewUserDetail('${user.id}')">상세</a>
            </td>
        </tr>
    `).join('');
}

/**
 * 구독 상태 뱃지
 */
function getSubscriptionBadge(status) {
    const badges = {
        'free': '<span class="status-badge" style="background: #e9ecef; color: #495057;">무료</span>',
        'active': '<span class="status-badge active">활성</span>',
        'paused': '<span class="status-badge" style="background: #fff3cd; color: #856404;">일시정지</span>',
        'suspended': '<span class="status-badge pending">정지</span>',
        'cancelled': '<span class="status-badge pending">해지</span>'
    };
    return badges[status] || '<span class="status-badge" style="background: #e9ecef; color: #495057;">무료</span>';
}

/**
 * 날짜 포맷
 */
function formatDateUser(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
}

/**
 * HTML 이스케이프 (회원용)
 */
function escapeHtmlUser(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 회원 상세 보기
 */
async function viewUserDetail(userId) {
    try {
        showLoading();

        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        showUserDetailModal(data);
        hideLoading();

    } catch (error) {
        console.error('❌ 회원 상세 조회 실패:', error);
        showToast('회원 정보를 불러오는데 실패했습니다.', 'error');
        hideLoading();
    }
}

/**
 * 회원 상세 모달 표시
 */
function showUserDetailModal(user) {
    const modal = document.getElementById('userDetailModal');
    const content = document.getElementById('userDetailContent');

    if (!modal || !content) {
        console.warn('회원 상세 모달 요소를 찾을 수 없습니다.');
        alert(`회원 ID: ${user.user_id || '-'}\n이메일: ${user.email}\n닉네임: ${user.nickname || user.name || '-'}`);
        return;
    }

    content.innerHTML = `
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <strong>회원 ID</strong>
                <span>${escapeHtmlUser(user.user_id || '-')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <strong>이메일</strong>
                <span>${escapeHtmlUser(user.email || '-')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <strong>닉네임</strong>
                <span>${escapeHtmlUser(user.nickname || user.name || '-')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <strong>실명</strong>
                <span>${escapeHtmlUser(user.real_name || '-')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <strong>구독 상태</strong>
                <span>${getSubscriptionBadge(user.subscription_status)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <strong>설치비 납부</strong>
                <span>${user.installation_fee_paid ? '✅ 완료' : '❌ 미납'}</span>
            </div>
            ${user.installation_date ? `
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <strong>설치비 납부일</strong>
                <span>${formatDateUser(user.installation_date)}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <strong>크레딧 잔액</strong>
                <span style="color: var(--warning); font-weight: 600;">₩${(user.credit_balance || 0).toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <strong>가입일</strong>
                <span>${formatDateUser(user.created_at)}</span>
            </div>
            ${user.last_login_at ? `
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <strong>마지막 로그인</strong>
                <span>${formatDateUser(user.last_login_at)}</span>
            </div>
            ` : ''}
        </div>
    `;

    modal.style.display = 'flex';
}

/**
 * 회원 상세 모달 닫기
 */
function closeUserDetailModal() {
    const modal = document.getElementById('userDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========== showSection 함수에 users 섹션 로딩 추가 필요 ==========
// 기존 showSection 함수에 아래 코드 추가:
//
// if (section === 'users') {
//     loadUsers();
// }

console.log('✅ 회원 관리 패치 로드 완료');
