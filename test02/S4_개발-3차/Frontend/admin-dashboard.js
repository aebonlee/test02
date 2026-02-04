/**
 * @task S4F1
 * @description 관리자 대시보드 로직 - 통계, 차트, 긴급알림
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let usersChart;
let revenueChart;

// Initialize dashboard
async function initDashboard() {
    await checkAdminAuth();
    await loadStatistics();
    await checkPendingInstallations();
    await loadRevenueBreakdown();
    await loadCharts();
    await loadRecentActivities();

    setupEventListeners();
}

// Check admin authentication
async function checkAdminAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        window.location.href = '../auth/admin-login.html';
        return;
    }

    // Check if user is admin
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
        // Total users
        const { count: totalUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        // Active subscriptions
        const { count: activeSubscriptions } = await supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        // Monthly revenue (current month)
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const { data: payments } = await supabase
            .from('payments')
            .select('amount')
            .eq('status', 'completed')
            .gte('created_at', startOfMonth);

        const monthlyRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

        // Pending installations
        const { count: pendingInstallations } = await supabase
            .from('installation_fees')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        // Calculate changes (last month comparison)
        const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString();
        const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

        const { count: lastMonthUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .lt('created_at', lastMonthEnd);

        const userChange = totalUsers - (lastMonthUsers || 0);

        // Update UI
        document.getElementById('total-users').textContent = totalUsers?.toLocaleString() || '0';
        document.getElementById('active-subscriptions').textContent = activeSubscriptions?.toLocaleString() || '0';
        document.getElementById('monthly-revenue').textContent = `₩${monthlyRevenue.toLocaleString()}`;
        document.getElementById('pending-installations').textContent = pendingInstallations?.toLocaleString() || '0';

        document.getElementById('users-change').textContent = `+${userChange} (이번 달)`;

    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

// Check pending installations and show alert
async function checkPendingInstallations() {
    try {
        const { data: pending, count } = await supabase
            .from('installation_fees')
            .select('*', { count: 'exact' })
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        if (count > 0) {
            // Update badge
            const badge = document.getElementById('pending-badge');
            badge.textContent = count;
            badge.style.display = 'inline-block';

            // Show alert
            const alertsContainer = document.getElementById('emergency-alerts');
            alertsContainer.innerHTML = `
                <div class="alert alert-warning">
                    <span class="alert-icon">⚠️</span>
                    <div class="alert-content">
                        <strong>입금 확인 필요</strong>
                        <p>${count}건의 설치비 입금이 확인 대기 중입니다.</p>
                    </div>
                    <a href="installation.html" class="btn-primary">확인하기</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to check pending installations:', error);
    }
}

// Load revenue breakdown
async function loadRevenueBreakdown() {
    try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

        // Installation fees
        const { data: installations } = await supabase
            .from('installation_fees')
            .select('amount')
            .eq('status', 'confirmed')
            .gte('confirmed_at', startOfMonth);

        const installationRevenue = installations?.reduce((sum, i) => sum + i.amount, 0) || 0;

        // Credit purchases
        const { data: credits } = await supabase
            .from('payments')
            .select('amount')
            .eq('payment_type', 'credit')
            .eq('status', 'completed')
            .gte('created_at', startOfMonth);

        const creditRevenue = credits?.reduce((sum, c) => sum + c.amount, 0) || 0;

        // Subscription payments
        const { data: subscriptions } = await supabase
            .from('payments')
            .select('amount')
            .eq('payment_type', 'subscription')
            .eq('status', 'completed')
            .gte('created_at', startOfMonth);

        const subscriptionRevenue = subscriptions?.reduce((sum, s) => sum + s.amount, 0) || 0;

        const totalRevenue = installationRevenue + creditRevenue + subscriptionRevenue;

        // Update UI
        document.getElementById('installation-revenue').textContent = `₩${installationRevenue.toLocaleString()}`;
        document.getElementById('credit-revenue').textContent = `₩${creditRevenue.toLocaleString()}`;
        document.getElementById('subscription-revenue').textContent = `₩${subscriptionRevenue.toLocaleString()}`;

        if (totalRevenue > 0) {
            document.getElementById('installation-percent').textContent =
                `${((installationRevenue / totalRevenue) * 100).toFixed(1)}%`;
            document.getElementById('credit-percent').textContent =
                `${((creditRevenue / totalRevenue) * 100).toFixed(1)}%`;
            document.getElementById('subscription-percent').textContent =
                `${((subscriptionRevenue / totalRevenue) * 100).toFixed(1)}%`;
        }

    } catch (error) {
        console.error('Failed to load revenue breakdown:', error);
    }
}

// Load charts
async function loadCharts() {
    await loadUsersChart();
    await loadRevenueChart();
}

// Load users chart
async function loadUsersChart() {
    try {
        // Get user registration data for last 12 months
        const months = [];
        const userCounts = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString();

            const { count } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', monthStart)
                .lt('created_at', monthEnd);

            months.push(date.toLocaleDateString('ko-KR', { month: 'short' }));
            userCounts.push(count || 0);
        }

        const ctx = document.getElementById('users-chart');
        usersChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '신규 가입자',
                    data: userCounts,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Failed to load users chart:', error);
    }
}

// Load revenue chart
async function loadRevenueChart() {
    try {
        // Get revenue data for last 12 months
        const months = [];
        const revenues = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString();

            const { data: payments } = await supabase
                .from('payments')
                .select('amount')
                .eq('status', 'completed')
                .gte('created_at', monthStart)
                .lt('created_at', monthEnd);

            const { data: installations } = await supabase
                .from('installation_fees')
                .select('amount')
                .eq('status', 'confirmed')
                .gte('confirmed_at', monthStart)
                .lt('confirmed_at', monthEnd);

            const paymentRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
            const installationRevenue = installations?.reduce((sum, i) => sum + i.amount, 0) || 0;

            months.push(date.toLocaleDateString('ko-KR', { month: 'short' }));
            revenues.push(paymentRevenue + installationRevenue);
        }

        const ctx = document.getElementById('revenue-chart');
        revenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: '매출 (원)',
                    data: revenues,
                    backgroundColor: '#10b981',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₩' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Failed to load revenue chart:', error);
    }
}

// Load recent activities
async function loadRecentActivities() {
    try {
        const activities = [];

        // Recent user registrations
        const { data: recentUsers } = await supabase
            .from('users')
            .select('full_name, email, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        recentUsers?.forEach(user => {
            activities.push({
                type: 'user_registered',
                user: user.full_name || user.email,
                time: new Date(user.created_at)
            });
        });

        // Recent payments
        const { data: recentPayments } = await supabase
            .from('payments')
            .select('*, users(full_name, email)')
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(5);

        recentPayments?.forEach(payment => {
            activities.push({
                type: 'payment',
                user: payment.users?.full_name || payment.users?.email,
                amount: payment.amount,
                paymentType: payment.payment_type,
                time: new Date(payment.created_at)
            });
        });

        // Sort by time
        activities.sort((a, b) => b.time - a.time);

        // Render activities
        const container = document.getElementById('recent-activities');

        if (activities.length === 0) {
            container.innerHTML = '<p class="no-data">최근 활동이 없습니다.</p>';
            return;
        }

        container.innerHTML = activities.slice(0, 10).map(activity => {
            const timeAgo = getTimeAgo(activity.time);

            if (activity.type === 'user_registered') {
                return `
                    <div class="activity-item">
                        <span class="activity-icon">👤</span>
                        <div class="activity-content">
                            <p><strong>${activity.user}</strong> 님이 가입했습니다.</p>
                            <span class="activity-time">${timeAgo}</span>
                        </div>
                    </div>
                `;
            } else if (activity.type === 'payment') {
                const typeLabel = activity.paymentType === 'credit' ? '크레딧 충전' : '구독 결제';
                return `
                    <div class="activity-item">
                        <span class="activity-icon">💳</span>
                        <div class="activity-content">
                            <p><strong>${activity.user}</strong> - ${typeLabel} ₩${activity.amount.toLocaleString()}</p>
                            <span class="activity-time">${timeAgo}</span>
                        </div>
                    </div>
                `;
            }
        }).join('');

    } catch (error) {
        console.error('Failed to load recent activities:', error);
        document.getElementById('recent-activities').innerHTML =
            '<p class="error">활동 로드 실패</p>';
    }
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return '방금 전';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}일 전`;

    return date.toLocaleDateString('ko-KR');
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '../auth/admin-login.html';
    });
}

// Initialize on page load
initDashboard();
