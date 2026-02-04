/**
 * @task S4F1
 * @description 크레딧 조회 및 수동 지급
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let currentBalanceFilter = 'all';
let currentTransactionType = 'all';
let currentTransactionPeriod = '30';
let currentBalancePage = 1;
let currentTransactionPage = 1;
const pageSize = 20;
let selectedUser = null;

// Initialize page
async function initPage() {
    await checkAdminAuth();
    await loadStatistics();
    await loadBalances();
    await loadTransactions();
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
        // Get all credit transactions to calculate totals
        const { data: transactions } = await supabase
            .from('credit_transactions')
            .select('transaction_type, amount');

        let totalIssued = 0;
        let totalUsed = 0;

        transactions?.forEach(tx => {
            if (tx.transaction_type === 'charge' || tx.transaction_type === 'grant') {
                totalIssued += tx.amount;
            } else if (tx.transaction_type === 'usage') {
                totalUsed += tx.amount;
            }
        });

        const totalRemaining = totalIssued - totalUsed;
        const usageRate = totalIssued > 0 ? ((totalUsed / totalIssued) * 100).toFixed(1) : 0;

        // Update UI
        document.getElementById('total-issued').textContent = `₩${totalIssued.toLocaleString()}`;
        document.getElementById('total-used').textContent = `₩${totalUsed.toLocaleString()}`;
        document.getElementById('total-remaining').textContent = `₩${totalRemaining.toLocaleString()}`;
        document.getElementById('usage-rate').textContent = `${usageRate}%`;

    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

// Load credit balances
async function loadBalances() {
    try {
        let query = supabase
            .from('users')
            .select('id, full_name, email, credit_balance, created_at', { count: 'exact' })
            .order('credit_balance', { ascending: false });

        // Apply filters
        if (currentBalanceFilter === 'positive') {
            query = query.gt('credit_balance', 0);
        } else if (currentBalanceFilter === 'zero') {
            query = query.eq('credit_balance', 0);
        } else if (currentBalanceFilter === 'high') {
            query = query.gte('credit_balance', 100000);
        }

        // Pagination
        const start = (currentBalancePage - 1) * pageSize;
        const end = start + pageSize - 1;
        query = query.range(start, end);

        const { data: users, error, count } = await query;

        if (error) throw error;

        // Get total charged and used for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const { data: txs } = await supabase
                .from('credit_transactions')
                .select('transaction_type, amount, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            let totalCharged = 0;
            let totalUsed = 0;
            let lastUsage = null;

            txs?.forEach(tx => {
                if (tx.transaction_type === 'charge' || tx.transaction_type === 'grant') {
                    totalCharged += tx.amount;
                }
                if (tx.transaction_type === 'usage') {
                    totalUsed += tx.amount;
                    if (!lastUsage) lastUsage = tx.created_at;
                }
            });

            return {
                ...user,
                totalCharged,
                totalUsed,
                lastUsage
            };
        }));

        renderBalances(usersWithStats);
        renderBalancesPagination(count);

    } catch (error) {
        console.error('Failed to load balances:', error);
        document.getElementById('balances-list').innerHTML = `
            <tr>
                <td colspan="7" class="error">크레딧 잔액을 불러오는데 실패했습니다.</td>
            </tr>
        `;
    }
}

// Render balances
function renderBalances(users) {
    const tbody = document.getElementById('balances-list');

    if (!users || users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">사용자가 없습니다.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => {
        return `
            <tr>
                <td>${user.full_name || '-'}</td>
                <td>${user.email}</td>
                <td class="amount-positive">₩${user.credit_balance.toLocaleString()}</td>
                <td>₩${user.totalCharged.toLocaleString()}</td>
                <td>₩${user.totalUsed.toLocaleString()}</td>
                <td>${user.lastUsage ? new Date(user.lastUsage).toLocaleDateString('ko-KR') : '-'}</td>
                <td>
                    <button class="btn-sm btn-secondary" onclick="showCreditDetail('${user.id}')">상세</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load credit transactions
async function loadTransactions() {
    try {
        let query = supabase
            .from('credit_transactions')
            .select(`
                *,
                users (
                    full_name,
                    email
                )
            `, { count: 'exact' })
            .order('created_at', { ascending: false });

        // Apply filters
        if (currentTransactionType !== 'all') {
            query = query.eq('transaction_type', currentTransactionType);
        }

        if (currentTransactionPeriod !== 'all') {
            const daysAgo = parseInt(currentTransactionPeriod);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            query = query.gte('created_at', date.toISOString());
        }

        // Pagination
        const start = (currentTransactionPage - 1) * pageSize;
        const end = start + pageSize - 1;
        query = query.range(start, end);

        const { data: transactions, error, count } = await query;

        if (error) throw error;

        renderTransactions(transactions);
        renderTransactionsPagination(count);

    } catch (error) {
        console.error('Failed to load transactions:', error);
        document.getElementById('transactions-list').innerHTML = `
            <tr>
                <td colspan="6" class="error">거래 내역을 불러오는데 실패했습니다.</td>
            </tr>
        `;
    }
}

// Render transactions
function renderTransactions(transactions) {
    const tbody = document.getElementById('transactions-list');

    if (!transactions || transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">거래 내역이 없습니다.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = transactions.map(tx => {
        const typeBadge = getTransactionTypeBadge(tx.transaction_type);
        const amountClass = tx.transaction_type === 'usage' ? 'amount-negative' : 'amount-positive';
        const amountPrefix = tx.transaction_type === 'usage' ? '-' : '+';

        return `
            <tr>
                <td>${new Date(tx.created_at).toLocaleString('ko-KR')}</td>
                <td>${tx.users?.full_name || tx.users?.email || '-'}</td>
                <td>${typeBadge}</td>
                <td class="${amountClass}">${amountPrefix}₩${tx.amount.toLocaleString()}</td>
                <td>₩${tx.balance_after.toLocaleString()}</td>
                <td>${tx.description || '-'}</td>
            </tr>
        `;
    }).join('');
}

// Get transaction type badge
function getTransactionTypeBadge(type) {
    const badges = {
        charge: '<span class="badge badge-success">충전</span>',
        usage: '<span class="badge badge-danger">사용</span>',
        grant: '<span class="badge badge-info">지급</span>',
        refund: '<span class="badge badge-warning">환불</span>'
    };
    return badges[type] || type;
}

// Show credit detail
window.showCreditDetail = async (userId) => {
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('full_name, email, credit_balance')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        const { data: transactions, error: txError } = await supabase
            .from('credit_transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (txError) throw txError;

        let totalCharged = 0;
        let totalUsed = 0;
        let totalGranted = 0;

        transactions?.forEach(tx => {
            if (tx.transaction_type === 'charge') totalCharged += tx.amount;
            if (tx.transaction_type === 'usage') totalUsed += tx.amount;
            if (tx.transaction_type === 'grant') totalGranted += tx.amount;
        });

        document.getElementById('credit-details').innerHTML = `
            <div class="detail-header">
                <h3>${user.full_name || user.email}</h3>
                <p>현재 잔액: <strong>₩${user.credit_balance.toLocaleString()}</strong></p>
            </div>
            <div class="detail-stats">
                <div class="stat-item">
                    <span class="label">총 충전:</span>
                    <span class="value">₩${totalCharged.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                    <span class="label">총 지급:</span>
                    <span class="value">₩${totalGranted.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                    <span class="label">총 사용:</span>
                    <span class="value">₩${totalUsed.toLocaleString()}</span>
                </div>
            </div>
            <h4>거래 내역</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>일시</th>
                        <th>유형</th>
                        <th>금액</th>
                        <th>잔액</th>
                        <th>설명</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.length > 0 ? transactions.map(tx => {
                        const amountClass = tx.transaction_type === 'usage' ? 'amount-negative' : 'amount-positive';
                        const amountPrefix = tx.transaction_type === 'usage' ? '-' : '+';
                        return `
                            <tr>
                                <td>${new Date(tx.created_at).toLocaleString('ko-KR')}</td>
                                <td>${getTransactionTypeBadge(tx.transaction_type)}</td>
                                <td class="${amountClass}">${amountPrefix}₩${tx.amount.toLocaleString()}</td>
                                <td>₩${tx.balance_after.toLocaleString()}</td>
                                <td>${tx.description || '-'}</td>
                            </tr>
                        `;
                    }).join('') : '<tr><td colspan="5" class="no-data">거래 내역이 없습니다.</td></tr>'}
                </tbody>
            </table>
        `;

        document.getElementById('credit-detail-modal').classList.add('active');

    } catch (error) {
        console.error('Failed to load credit detail:', error);
        alert('크레딧 상세 정보를 불러오는데 실패했습니다.');
    }
};

// Search users for credit grant
async function searchUsers(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) {
        document.getElementById('user-suggestions').innerHTML = '';
        return;
    }

    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, full_name, email, credit_balance')
            .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
            .limit(5);

        if (error) throw error;

        const suggestions = document.getElementById('user-suggestions');

        if (!users || users.length === 0) {
            suggestions.innerHTML = '<div class="suggestion-item">사용자를 찾을 수 없습니다.</div>';
            return;
        }

        suggestions.innerHTML = users.map(user => `
            <div class="suggestion-item" onclick="selectUser('${user.id}', '${user.full_name || user.email}', ${user.credit_balance})">
                <div>
                    <strong>${user.full_name || user.email}</strong>
                    <span class="text-muted">${user.email}</span>
                </div>
                <span>잔액: ₩${user.credit_balance.toLocaleString()}</span>
            </div>
        `).join('');

    } catch (error) {
        console.error('Failed to search users:', error);
    }
}

// Select user for credit grant
window.selectUser = (userId, name, balance) => {
    selectedUser = { id: userId, name, balance };
    document.getElementById('user-search').value = name;
    document.getElementById('user-suggestions').innerHTML = '';
};

// Grant credit
async function grantCredit(e) {
    e.preventDefault();

    if (!selectedUser) {
        alert('사용자를 선택해주세요.');
        return;
    }

    const amount = parseInt(document.getElementById('credit-amount').value);
    const reason = document.getElementById('grant-reason').value.trim();

    if (amount < 1000) {
        alert('최소 ₩1,000 이상 지급해야 합니다.');
        return;
    }

    if (!reason) {
        alert('지급 사유를 입력해주세요.');
        return;
    }

    if (!confirm(`${selectedUser.name}에게 ₩${amount.toLocaleString()}을 지급하시겠습니까?`)) {
        return;
    }

    try {
        // Update user credit balance
        const newBalance = selectedUser.balance + amount;

        const { error: updateError } = await supabase
            .from('users')
            .update({ credit_balance: newBalance })
            .eq('id', selectedUser.id);

        if (updateError) throw updateError;

        // Create transaction record
        const { error: txError } = await supabase
            .from('credit_transactions')
            .insert({
                user_id: selectedUser.id,
                transaction_type: 'grant',
                amount: amount,
                balance_after: newBalance,
                description: reason
            });

        if (txError) throw txError;

        alert('크레딧이 지급되었습니다.');

        // Reset form
        document.getElementById('grant-credit-form').reset();
        selectedUser = null;

        // Reload data
        await loadStatistics();
        await loadBalances();
        await loadTransactions();

    } catch (error) {
        console.error('Failed to grant credit:', error);
        alert('크레딧 지급에 실패했습니다.');
    }
}

// Render pagination
function renderBalancesPagination(totalCount) {
    renderPagination('balances-pagination', totalCount, currentBalancePage, (page) => {
        currentBalancePage = page;
        loadBalances();
    });
}

function renderTransactionsPagination(totalCount) {
    renderPagination('transactions-pagination', totalCount, currentTransactionPage, (page) => {
        currentTransactionPage = page;
        loadTransactions();
    });
}

function renderPagination(elementId, totalCount, currentPage, callback) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const pagination = document.getElementById(elementId);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '<div class="pagination-buttons">';

    if (currentPage > 1) {
        html += `<button onclick="changePage_${elementId}(${currentPage - 1})">이전</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<button class="active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button onclick="changePage_${elementId}(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span>...</span>`;
        }
    }

    if (currentPage < totalPages) {
        html += `<button onclick="changePage_${elementId}(${currentPage + 1})">다음</button>`;
    }

    html += '</div>';
    pagination.innerHTML = html;

    // Create callback function
    window[`changePage_${elementId}`] = callback;
}

// Setup event listeners
function setupEventListeners() {
    // User search
    let searchTimeout;
    document.getElementById('user-search')?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => searchUsers(e.target.value), 300);
    });

    // Grant credit form
    document.getElementById('grant-credit-form')?.addEventListener('submit', grantCredit);

    // Balance filter
    document.getElementById('balance-filter')?.addEventListener('change', (e) => {
        currentBalanceFilter = e.target.value;
        currentBalancePage = 1;
        loadBalances();
    });

    // Balance search
    document.getElementById('balance-search')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#balances-list tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Transaction filters
    document.getElementById('transaction-type-filter')?.addEventListener('change', (e) => {
        currentTransactionType = e.target.value;
        currentTransactionPage = 1;
        loadTransactions();
    });

    document.getElementById('transaction-period-filter')?.addEventListener('change', (e) => {
        currentTransactionPeriod = e.target.value;
        currentTransactionPage = 1;
        loadTransactions();
    });

    // Transaction search
    document.getElementById('transaction-search')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#transactions-list tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Modal close
    document.getElementById('close-detail-modal')?.addEventListener('click', () => {
        document.getElementById('credit-detail-modal').classList.remove('active');
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '../auth/admin-login.html';
    });
}

// Initialize
initPage();
