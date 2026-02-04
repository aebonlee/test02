/**
 * @task S4F1
 * @description 결제 내역 조회 및 필터
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let currentFilters = {
    paymentType: 'all',
    period: '30',
    status: 'all'
};
let currentPage = 1;
const pageSize = 20;

// Initialize page
async function initPage() {
    await checkAdminAuth();
    await loadStatistics();
    await loadPayments();
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
        .select('role, full_name')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        alert('관리자 권한이 필요합니다.');
        window.location.href = '../dashboard.html';
        return;
    }

    document.getElementById('admin-name').textContent = profile.full_name || '관리자';
}

// Load statistics
async function loadStatistics() {
    try {
        // Total payments
        const { count: totalPayments } = await supabase
            .from('payments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed');

        // Credit payments
        const { count: creditPayments } = await supabase
            .from('payments')
            .select('*', { count: 'exact', head: true })
            .eq('payment_type', 'credit')
            .eq('status', 'completed');

        // Subscription payments
        const { count: subscriptionPayments } = await supabase
            .from('payments')
            .select('*', { count: 'exact', head: true })
            .eq('payment_type', 'subscription')
            .eq('status', 'completed');

        // Installation payments
        const { count: installationPayments } = await supabase
            .from('installation_fees')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'confirmed');

        // Update UI
        document.getElementById('total-payments').textContent =
            (totalPayments + installationPayments).toLocaleString();
        document.getElementById('credit-payments').textContent = creditPayments.toLocaleString();
        document.getElementById('subscription-payments').textContent = subscriptionPayments.toLocaleString();
        document.getElementById('installation-payments').textContent = installationPayments.toLocaleString();

    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

// Load payments
async function loadPayments() {
    try {
        let query = supabase
            .from('payments')
            .select(`
                *,
                users (
                    full_name,
                    email
                )
            `, { count: 'exact' })
            .order('created_at', { ascending: false });

        // Apply filters
        if (currentFilters.paymentType !== 'all') {
            if (currentFilters.paymentType === 'installation') {
                // Handle installation fees separately
                await loadInstallationFees();
                return;
            }
            query = query.eq('payment_type', currentFilters.paymentType);
        }

        if (currentFilters.status !== 'all') {
            query = query.eq('status', currentFilters.status);
        }

        if (currentFilters.period !== 'all') {
            const daysAgo = parseInt(currentFilters.period);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            query = query.gte('created_at', date.toISOString());
        }

        // Pagination
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize - 1;
        query = query.range(start, end);

        const { data: payments, error, count } = await query;

        if (error) throw error;

        renderPayments(payments);
        renderPagination(count);

    } catch (error) {
        console.error('Failed to load payments:', error);
        document.getElementById('payments-list').innerHTML = `
            <tr>
                <td colspan="8" class="error">결제 내역을 불러오는데 실패했습니다.</td>
            </tr>
        `;
    }
}

// Load installation fees
async function loadInstallationFees() {
    try {
        let query = supabase
            .from('installation_fees')
            .select(`
                *,
                users (
                    full_name,
                    email
                )
            `, { count: 'exact' })
            .order('created_at', { ascending: false });

        if (currentFilters.status !== 'all') {
            query = query.eq('status', currentFilters.status === 'completed' ? 'confirmed' : currentFilters.status);
        }

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize - 1;
        query = query.range(start, end);

        const { data: installations, error, count } = await query;

        if (error) throw error;

        renderInstallationFees(installations);
        renderPagination(count);

    } catch (error) {
        console.error('Failed to load installation fees:', error);
    }
}

// Render payments
function renderPayments(payments) {
    const tbody = document.getElementById('payments-list');

    if (!payments || payments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">결제 내역이 없습니다.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = payments.map(payment => {
        const statusBadge = getStatusBadge(payment.status);
        const typeLabel = payment.payment_type === 'credit' ? '크레딧 충전' : '구독 결제';

        return `
            <tr>
                <td>${new Date(payment.created_at).toLocaleDateString('ko-KR')}</td>
                <td>${payment.order_id || '-'}</td>
                <td>${payment.users?.full_name || payment.users?.email || '-'}</td>
                <td>${typeLabel}</td>
                <td>₩${payment.amount.toLocaleString()}</td>
                <td>${payment.payment_method || '-'}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn-sm btn-secondary" onclick="showPaymentDetail('${payment.id}')">상세</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Render installation fees
function renderInstallationFees(installations) {
    const tbody = document.getElementById('payments-list');

    if (!installations || installations.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">설치비 내역이 없습니다.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = installations.map(installation => {
        const statusBadge = getStatusBadge(installation.status === 'confirmed' ? 'completed' : installation.status);

        return `
            <tr>
                <td>${new Date(installation.created_at).toLocaleDateString('ko-KR')}</td>
                <td>INS-${installation.id.slice(0, 8)}</td>
                <td>${installation.users?.full_name || installation.users?.email || '-'}</td>
                <td>설치비</td>
                <td>₩${installation.amount.toLocaleString()}</td>
                <td>계좌이체</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn-sm btn-secondary" onclick="showInstallationDetail('${installation.id}')">상세</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Get status badge
function getStatusBadge(status) {
    const badges = {
        completed: '<span class="badge badge-success">완료</span>',
        pending: '<span class="badge badge-warning">대기</span>',
        failed: '<span class="badge badge-danger">실패</span>',
        refunded: '<span class="badge badge-info">환불</span>'
    };
    return badges[status] || status;
}

// Show payment detail
window.showPaymentDetail = async (paymentId) => {
    try {
        const { data: payment, error } = await supabase
            .from('payments')
            .select(`
                *,
                users (
                    full_name,
                    email
                )
            `)
            .eq('id', paymentId)
            .single();

        if (error) throw error;

        const typeLabel = payment.payment_type === 'credit' ? '크레딧 충전' : '구독 결제';

        document.getElementById('payment-details').innerHTML = `
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="label">주문번호:</span>
                    <span class="value">${payment.order_id || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">사용자:</span>
                    <span class="value">${payment.users?.full_name || payment.users?.email || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">결제 유형:</span>
                    <span class="value">${typeLabel}</span>
                </div>
                <div class="detail-item">
                    <span class="label">금액:</span>
                    <span class="value">₩${payment.amount.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="label">결제 방법:</span>
                    <span class="value">${payment.payment_method || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">상태:</span>
                    <span class="value">${getStatusBadge(payment.status)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">결제일:</span>
                    <span class="value">${new Date(payment.created_at).toLocaleString('ko-KR')}</span>
                </div>
                ${payment.transaction_id ? `
                <div class="detail-item">
                    <span class="label">거래 ID:</span>
                    <span class="value">${payment.transaction_id}</span>
                </div>
                ` : ''}
            </div>
        `;

        // Show refund button if applicable
        const refundBtn = document.getElementById('refund-btn');
        if (payment.status === 'completed' && payment.payment_type === 'credit') {
            refundBtn.style.display = 'inline-block';
            refundBtn.onclick = () => handleRefund(payment.id);
        } else {
            refundBtn.style.display = 'none';
        }

        document.getElementById('payment-detail-modal').classList.add('active');

    } catch (error) {
        console.error('Failed to load payment detail:', error);
        alert('결제 정보를 불러오는데 실패했습니다.');
    }
};

// Show installation detail
window.showInstallationDetail = async (installationId) => {
    // Similar to showPaymentDetail but for installation fees
    alert('설치비 상세 정보 (구현 예정)');
};

// Handle refund
async function handleRefund(paymentId) {
    if (!confirm('정말 환불 처리하시겠습니까?')) return;

    // Implement refund logic
    alert('환불 처리 기능 (구현 예정)');
}

// Render pagination
function renderPagination(totalCount) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const pagination = document.getElementById('pagination');

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '<div class="pagination-buttons">';

    if (currentPage > 1) {
        html += `<button onclick="changePage(${currentPage - 1})">이전</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<button class="active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span>...</span>`;
        }
    }

    if (currentPage < totalPages) {
        html += `<button onclick="changePage(${currentPage + 1})">다음</button>`;
    }

    html += '</div>';
    pagination.innerHTML = html;
}

// Change page
window.changePage = (page) => {
    currentPage = page;
    loadPayments();
};

// Export to Excel
async function exportToExcel() {
    alert('엑셀 내보내기 기능 (구현 예정)');
}

// Setup event listeners
function setupEventListeners() {
    // Filter changes
    document.getElementById('payment-type-filter')?.addEventListener('change', (e) => {
        currentFilters.paymentType = e.target.value;
        currentPage = 1;
        loadPayments();
    });

    document.getElementById('period-filter')?.addEventListener('change', (e) => {
        currentFilters.period = e.target.value;
        currentPage = 1;
        loadPayments();
    });

    document.getElementById('status-filter')?.addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        currentPage = 1;
        loadPayments();
    });

    // Search
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#payments-list tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Export
    document.getElementById('export-btn')?.addEventListener('click', exportToExcel);

    // Modal close
    document.getElementById('close-detail-modal')?.addEventListener('click', () => {
        document.getElementById('payment-detail-modal').classList.remove('active');
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '../auth/admin-login.html';
    });
}

// Initialize
initPage();
