/**
 * @task S4F1
 * @description 구독 상태 관리
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let currentStatus = 'active';
let currentPage = 1;
const pageSize = 20;

// Initialize page
async function initPage() {
    await checkAdminAuth();
    await loadStatistics();
    await loadSubscriptions();
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
        // Active subscriptions
        const { count: activeCount } = await supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        // Canceling subscriptions
        const { count: cancelingCount } = await supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'canceling');

        // Paused subscriptions
        const { count: pausedCount } = await supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'paused');

        // Monthly Recurring Revenue (MRR)
        const { data: activeSubscriptions } = await supabase
            .from('subscriptions')
            .select('plan_price')
            .eq('status', 'active');

        const mrr = activeSubscriptions?.reduce((sum, sub) => sum + (sub.plan_price || 0), 0) || 0;

        // Update UI
        document.getElementById('active-count').textContent = activeCount?.toLocaleString() || '0';
        document.getElementById('canceling-count').textContent = cancelingCount?.toLocaleString() || '0';
        document.getElementById('paused-count').textContent = pausedCount?.toLocaleString() || '0';
        document.getElementById('mrr').textContent = `₩${mrr.toLocaleString()}`;

    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

// Load subscriptions
async function loadSubscriptions() {
    try {
        let query = supabase
            .from('subscriptions')
            .select(`
                *,
                users (
                    full_name,
                    email
                )
            `, { count: 'exact' })
            .order('created_at', { ascending: false });

        if (currentStatus !== 'all') {
            query = query.eq('status', currentStatus);
        }

        // Pagination
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize - 1;
        query = query.range(start, end);

        const { data: subscriptions, error, count } = await query;

        if (error) throw error;

        renderSubscriptions(subscriptions);
        renderPagination(count);

    } catch (error) {
        console.error('Failed to load subscriptions:', error);
        document.getElementById('subscriptions-list').innerHTML = `
            <tr>
                <td colspan="8" class="error">구독 목록을 불러오는데 실패했습니다.</td>
            </tr>
        `;
    }
}

// Render subscriptions
function renderSubscriptions(subscriptions) {
    const tbody = document.getElementById('subscriptions-list');

    if (!subscriptions || subscriptions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">구독 목록이 없습니다.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = subscriptions.map(subscription => {
        const statusBadge = getStatusBadge(subscription.status);
        const billingKeyBadge = subscription.billing_key ?
            '<span class="badge badge-success">등록됨</span>' :
            '<span class="badge badge-danger">미등록</span>';

        return `
            <tr>
                <td>${subscription.users?.full_name || '-'}</td>
                <td>${subscription.users?.email || '-'}</td>
                <td>${subscription.plan_name || '-'} (₩${subscription.plan_price?.toLocaleString() || 0}/월)</td>
                <td>${statusBadge}</td>
                <td>${new Date(subscription.created_at).toLocaleDateString('ko-KR')}</td>
                <td>${subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString('ko-KR') : '-'}</td>
                <td>${billingKeyBadge}</td>
                <td>
                    <button class="btn-sm btn-secondary" onclick="showSubscriptionDetail('${subscription.id}')">상세</button>
                    <button class="btn-sm btn-info" onclick="showBillingHistory('${subscription.id}')">결제이력</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Get status badge
function getStatusBadge(status) {
    const badges = {
        active: '<span class="badge badge-success">활성</span>',
        canceling: '<span class="badge badge-warning">취소 예정</span>',
        paused: '<span class="badge badge-info">정지</span>',
        expired: '<span class="badge badge-danger">만료</span>'
    };
    return badges[status] || status;
}

// Show subscription detail
window.showSubscriptionDetail = async (subscriptionId) => {
    try {
        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select(`
                *,
                users (
                    full_name,
                    email,
                    service_status
                )
            `)
            .eq('id', subscriptionId)
            .single();

        if (error) throw error;

        document.getElementById('subscription-details').innerHTML = `
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="label">사용자:</span>
                    <span class="value">${subscription.users?.full_name || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">이메일:</span>
                    <span class="value">${subscription.users?.email || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">플랜:</span>
                    <span class="value">${subscription.plan_name || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">월 이용료:</span>
                    <span class="value">₩${subscription.plan_price?.toLocaleString() || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="label">구독 상태:</span>
                    <span class="value">${getStatusBadge(subscription.status)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">서비스 상태:</span>
                    <span class="value">${subscription.users?.service_status || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">시작일:</span>
                    <span class="value">${new Date(subscription.created_at).toLocaleDateString('ko-KR')}</span>
                </div>
                <div class="detail-item">
                    <span class="label">다음 결제일:</span>
                    <span class="value">${subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString('ko-KR') : '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="label">빌링키:</span>
                    <span class="value">${subscription.billing_key ? '등록됨' : '미등록'}</span>
                </div>
                ${subscription.canceled_at ? `
                <div class="detail-item">
                    <span class="label">취소일:</span>
                    <span class="value">${new Date(subscription.canceled_at).toLocaleDateString('ko-KR')}</span>
                </div>
                ` : ''}
                ${subscription.cancellation_reason ? `
                <div class="detail-item full-width">
                    <span class="label">취소 사유:</span>
                    <span class="value">${subscription.cancellation_reason}</span>
                </div>
                ` : ''}
            </div>
        `;

        // Show action buttons based on status
        const pauseBtn = document.getElementById('pause-btn');
        const resumeBtn = document.getElementById('resume-btn');
        const cancelBtn = document.getElementById('cancel-subscription-btn');

        if (subscription.status === 'active') {
            pauseBtn.style.display = 'inline-block';
            pauseBtn.onclick = () => pauseSubscription(subscription.id);
            resumeBtn.style.display = 'none';
            cancelBtn.style.display = 'inline-block';
            cancelBtn.onclick = () => cancelSubscription(subscription.id);
        } else if (subscription.status === 'paused') {
            pauseBtn.style.display = 'none';
            resumeBtn.style.display = 'inline-block';
            resumeBtn.onclick = () => resumeSubscription(subscription.id);
            cancelBtn.style.display = 'inline-block';
            cancelBtn.onclick = () => cancelSubscription(subscription.id);
        } else {
            pauseBtn.style.display = 'none';
            resumeBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        }

        document.getElementById('subscription-detail-modal').classList.add('active');

    } catch (error) {
        console.error('Failed to load subscription detail:', error);
        alert('구독 정보를 불러오는데 실패했습니다.');
    }
};

// Show billing history
window.showBillingHistory = async (subscriptionId) => {
    try {
        const { data: payments, error } = await supabase
            .from('payments')
            .select('*')
            .eq('subscription_id', subscriptionId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!payments || payments.length === 0) {
            document.getElementById('billing-history').innerHTML = `
                <p class="no-data">결제 이력이 없습니다.</p>
            `;
        } else {
            document.getElementById('billing-history').innerHTML = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>결제일</th>
                            <th>주문번호</th>
                            <th>금액</th>
                            <th>결제 방법</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${payments.map(payment => `
                            <tr>
                                <td>${new Date(payment.created_at).toLocaleDateString('ko-KR')}</td>
                                <td>${payment.order_id || '-'}</td>
                                <td>₩${payment.amount.toLocaleString()}</td>
                                <td>${payment.payment_method || '-'}</td>
                                <td>${getPaymentStatusBadge(payment.status)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        document.getElementById('billing-history-modal').classList.add('active');

    } catch (error) {
        console.error('Failed to load billing history:', error);
        alert('결제 이력을 불러오는데 실패했습니다.');
    }
};

// Get payment status badge
function getPaymentStatusBadge(status) {
    const badges = {
        completed: '<span class="badge badge-success">완료</span>',
        pending: '<span class="badge badge-warning">대기</span>',
        failed: '<span class="badge badge-danger">실패</span>',
        refunded: '<span class="badge badge-info">환불</span>'
    };
    return badges[status] || status;
}

// Pause subscription
async function pauseSubscription(subscriptionId) {
    if (!confirm('구독을 일시정지하시겠습니까?')) return;

    try {
        const { error } = await supabase
            .from('subscriptions')
            .update({
                status: 'paused',
                paused_at: new Date().toISOString()
            })
            .eq('id', subscriptionId);

        if (error) throw error;

        alert('구독이 일시정지되었습니다.');
        closeSubscriptionDetailModal();
        await loadSubscriptions();
        await loadStatistics();

    } catch (error) {
        console.error('Failed to pause subscription:', error);
        alert('구독 일시정지에 실패했습니다.');
    }
}

// Resume subscription
async function resumeSubscription(subscriptionId) {
    if (!confirm('구독을 재개하시겠습니까?')) return;

    try {
        const { error } = await supabase
            .from('subscriptions')
            .update({
                status: 'active',
                paused_at: null
            })
            .eq('id', subscriptionId);

        if (error) throw error;

        alert('구독이 재개되었습니다.');
        closeSubscriptionDetailModal();
        await loadSubscriptions();
        await loadStatistics();

    } catch (error) {
        console.error('Failed to resume subscription:', error);
        alert('구독 재개에 실패했습니다.');
    }
}

// Cancel subscription
async function cancelSubscription(subscriptionId) {
    const reason = prompt('구독 취소 사유를 입력하세요:');
    if (!reason) return;

    try {
        const { error } = await supabase
            .from('subscriptions')
            .update({
                status: 'canceling',
                canceled_at: new Date().toISOString(),
                cancellation_reason: reason
            })
            .eq('id', subscriptionId);

        if (error) throw error;

        alert('구독이 취소 예정으로 변경되었습니다.');
        closeSubscriptionDetailModal();
        await loadSubscriptions();
        await loadStatistics();

    } catch (error) {
        console.error('Failed to cancel subscription:', error);
        alert('구독 취소에 실패했습니다.');
    }
}

// Close modals
function closeSubscriptionDetailModal() {
    document.getElementById('subscription-detail-modal').classList.remove('active');
}

function closeBillingHistoryModal() {
    document.getElementById('billing-history-modal').classList.remove('active');
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
    loadSubscriptions();
};

// Setup event listeners
function setupEventListeners() {
    // Tab filters
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentStatus = btn.dataset.status;
            currentPage = 1;
            loadSubscriptions();
        });
    });

    // Search
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#subscriptions-list tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Modal close buttons
    document.getElementById('close-detail-modal')?.addEventListener('click', closeSubscriptionDetailModal);
    document.getElementById('close-history-modal')?.addEventListener('click', closeBillingHistoryModal);

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '../auth/admin-login.html';
    });
}

// Initialize
initPage();
