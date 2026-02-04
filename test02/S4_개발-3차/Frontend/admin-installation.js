/**
 * @task S4F1
 * @description 빌더 계정 개설비 입금 확인/거부 모달 및 처리
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzE1NTEsImV4cCI6MjA3OTE0NzU1MX0.AJy34h5VR8QS6WFEcUcBeJJu8I3bBQ6UCk1I84Wb7y4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let currentStatus = 'pending';
let currentInstallation = null;

// Initialize page
async function initPage() {
    await checkAdminAuth();
    await loadInstallations();
    setupEventListeners();
}

// Check admin authentication
async function checkAdminAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        window.location.href = '../auth/admin-login.html';
        return;
    }

    const { data: profile } = await supabase
        .from('users')
        .select('role, name')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        alert('관리자 권한이 필요합니다.');
        window.location.href = '../dashboard.html';
        return;
    }

    document.getElementById('admin-name').textContent = profile.name || '관리자';
}

// Load installations
async function loadInstallations() {
    try {
        let query = supabase
            .from('installation_fees')
            .select(`
                *,
                users (
                    name,
                    email
                )
            `)
            .order('created_at', { ascending: false });

        if (currentStatus !== 'all') {
            query = query.eq('status', currentStatus);
        }

        const { data: installations, error } = await query;

        if (error) throw error;

        renderInstallations(installations);

    } catch (error) {
        console.error('Failed to load installations:', error);
        document.getElementById('installation-list').innerHTML = `
            <tr>
                <td colspan="7" class="error">빌더 계정 개설비 내역을 불러오는데 실패했습니다.</td>
            </tr>
        `;
    }
}

// Render installations
function renderInstallations(installations) {
    const tbody = document.getElementById('installation-list');

    if (!installations || installations.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">빌더 계정 개설비 내역이 없습니다.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = installations.map(installation => {
        const statusBadge = getStatusBadge(installation.status);
        const actionButtons = getActionButtons(installation);

        return `
            <tr>
                <td>${new Date(installation.created_at).toLocaleDateString('ko-KR')}</td>
                <td>${installation.users?.name || '-'}</td>
                <td>${installation.users?.email || '-'}</td>
                <td>₩${installation.amount.toLocaleString()}</td>
                <td>${statusBadge}</td>
                <td>${installation.confirmed_at ? new Date(installation.confirmed_at).toLocaleDateString('ko-KR') : '-'}</td>
                <td>${actionButtons}</td>
            </tr>
        `;
    }).join('');
}

// Get status badge
function getStatusBadge(status) {
    const badges = {
        pending: '<span class="badge badge-warning">입금 대기</span>',
        confirmed: '<span class="badge badge-success">입금 완료</span>',
        rejected: '<span class="badge badge-danger">입금 거부</span>'
    };
    return badges[status] || status;
}

// Get action buttons
function getActionButtons(installation) {
    if (installation.status === 'pending') {
        return `
            <button class="btn-sm btn-success" onclick="showConfirmModal('${installation.id}')">확인</button>
            <button class="btn-sm btn-danger" onclick="showRejectModal('${installation.id}')">거부</button>
        `;
    } else if (installation.status === 'confirmed') {
        return '<span class="text-muted">처리 완료</span>';
    } else if (installation.status === 'rejected') {
        return `<span class="text-muted">거부됨</span>`;
    }
    return '';
}

// Show confirm modal
window.showConfirmModal = async (installationId) => {
    try {
        const { data: installation, error } = await supabase
            .from('installation_fees')
            .select(`
                *,
                users (
                    name,
                    email
                )
            `)
            .eq('id', installationId)
            .single();

        if (error) throw error;

        currentInstallation = installation;

        document.getElementById('confirm-details').innerHTML = `
            <div class="detail-item">
                <span class="label">사용자:</span>
                <span class="value">${installation.users?.name || '-'}</span>
            </div>
            <div class="detail-item">
                <span class="label">이메일:</span>
                <span class="value">${installation.users?.email || '-'}</span>
            </div>
            <div class="detail-item">
                <span class="label">금액:</span>
                <span class="value">₩${installation.amount.toLocaleString()}</span>
            </div>
            <div class="detail-item">
                <span class="label">신청일:</span>
                <span class="value">${new Date(installation.created_at).toLocaleString('ko-KR')}</span>
            </div>
        `;

        document.getElementById('confirm-modal').classList.add('active');

    } catch (error) {
        console.error('Failed to load installation:', error);
        alert('빌더 계정 개설비 정보를 불러오는데 실패했습니다.');
    }
};

// Show reject modal
window.showRejectModal = async (installationId) => {
    try {
        const { data: installation, error } = await supabase
            .from('installation_fees')
            .select(`
                *,
                users (
                    name,
                    email
                )
            `)
            .eq('id', installationId)
            .single();

        if (error) throw error;

        currentInstallation = installation;

        document.getElementById('reject-details').innerHTML = `
            <div class="detail-item">
                <span class="label">사용자:</span>
                <span class="value">${installation.users?.name || '-'}</span>
            </div>
            <div class="detail-item">
                <span class="label">이메일:</span>
                <span class="value">${installation.users?.email || '-'}</span>
            </div>
            <div class="detail-item">
                <span class="label">금액:</span>
                <span class="value">₩${installation.amount.toLocaleString()}</span>
            </div>
        `;

        document.getElementById('reject-reason').value = '';
        document.getElementById('reject-modal').classList.add('active');

    } catch (error) {
        console.error('Failed to load installation:', error);
        alert('빌더 계정 개설비 정보를 불러오는데 실패했습니다.');
    }
};

/**
 * 빌더 계정 ID 생성 (12자리)
 * 형식: YYMMNNNNNNXX
 * - YY: 연도 (2자리)
 * - MM: 월 (2자리)
 * - NNNNNN: 일련번호 (6자리, 월별)
 * - XX: 개설비 금액 코드 (2자리)
 */
async function generateDeveloperAccountId(amount) {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2); // YY
    const month = String(now.getMonth() + 1).padStart(2, '0'); // MM

    // 금액 코드 매핑 (단위: 만원)
    const amountCodes = {
        3000000: 'TH',  // 300만원 = THREE
        4000000: 'FO',  // 400만원 = FOUR
        5000000: 'FI',  // 500만원 = FIVE
        6000000: 'SI',  // 600만원 = SIX
        7000000: 'SE',  // 700만원 = SEVEN
        8000000: 'EI',  // 800만원 = EIGHT
        9000000: 'NI'   // 900만원 = NINE
    };
    const amountCode = amountCodes[amount] || 'TH'; // 기본값 TH (300만원)

    // 이번 달 일련번호 조회 (user_id가 현재 연월로 시작하는 사용자 수)
    const prefix = year + month;
    const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .like('user_id', `${prefix}%`);

    if (error) {
        console.error('일련번호 조회 실패:', error);
    }

    const serialNumber = String((count || 0) + 1).padStart(6, '0'); // NNNNNN

    return `${year}${month}${serialNumber}${amountCode}`;
}

// Confirm installation
async function confirmInstallation() {
    if (!currentInstallation) return;

    try {
        // 1. 빌더 계정 ID 생성
        const developerAccountId = await generateDeveloperAccountId(currentInstallation.amount);
        console.log('📌 빌더 계정 ID 생성:', developerAccountId);

        // 2. Update installation status
        const { error: updateError } = await supabase
            .from('installation_fees')
            .update({
                status: 'confirmed',
                confirmed_at: new Date().toISOString()
            })
            .eq('id', currentInstallation.id);

        if (updateError) throw updateError;

        // 3. Activate service, set developer account ID, and mark installation fee as paid
        const { error: serviceError } = await supabase
            .from('users')
            .update({
                user_id: developerAccountId,  // 빌더 계정 ID 저장
                service_status: 'active',
                installation_fee_paid: true,
                installation_date: new Date().toISOString()
            })
            .eq('id', currentInstallation.user_id);

        if (serviceError) throw serviceError;

        // Grant ₩50,000 credits
        const { error: creditError } = await supabase
            .from('credit_transactions')
            .insert({
                user_id: currentInstallation.user_id,
                transaction_type: 'grant',
                amount: 50000,
                balance_after: 50000,
                description: '빌더 계정 개설비 입금 확인 - 웰컴 크레딧'
            });

        if (creditError) throw creditError;

        // Send email notification (would call backend API)
        // await sendInstallationConfirmEmail(currentInstallation.user_id);

        alert(`입금 확인이 완료되었습니다.\n\n빌더 계정 ID: ${developerAccountId}`);
        closeConfirmModal();
        await loadInstallations();

    } catch (error) {
        console.error('Failed to confirm installation:', error);
        alert('입금 확인 처리에 실패했습니다.');
    }
}

// Reject installation
async function rejectInstallation() {
    if (!currentInstallation) return;

    const reason = document.getElementById('reject-reason').value.trim();

    if (!reason) {
        alert('거부 사유를 입력해주세요.');
        return;
    }

    try {
        const { error } = await supabase
            .from('installation_fees')
            .update({
                status: 'rejected',
                rejected_at: new Date().toISOString(),
                rejection_reason: reason
            })
            .eq('id', currentInstallation.id);

        if (error) throw error;

        // Send email notification (would call backend API)
        // await sendInstallationRejectEmail(currentInstallation.user_id, reason);

        alert('입금 거부 처리가 완료되었습니다.');
        closeRejectModal();
        await loadInstallations();

    } catch (error) {
        console.error('Failed to reject installation:', error);
        alert('입금 거부 처리에 실패했습니다.');
    }
}

// Close modals
function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('active');
    currentInstallation = null;
}

function closeRejectModal() {
    document.getElementById('reject-modal').classList.remove('active');
    currentInstallation = null;
}

// Setup event listeners
function setupEventListeners() {
    // Tab filters
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentStatus = btn.dataset.status;
            loadInstallations();
        });
    });

    // Search
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#installation-list tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Modal buttons
    document.getElementById('confirm-submit')?.addEventListener('click', confirmInstallation);
    document.getElementById('confirm-cancel')?.addEventListener('click', closeConfirmModal);
    document.getElementById('reject-submit')?.addEventListener('click', rejectInstallation);
    document.getElementById('reject-cancel')?.addEventListener('click', closeRejectModal);

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '../auth/admin-login.html';
    });
}

// Initialize
initPage();
