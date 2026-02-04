/**
 * @task S3BA3
 * AI 사용량 집계 API
 * GET /api/ai/usage
 *
 * Query Parameters:
 * - period: 'day' | 'week' | 'month' | 'all' (default: 'month')
 * - service: 'ChatGPT' | 'Gemini' | 'Perplexity' | 'all' (default: 'all')
 * - user_id: 특정 사용자 필터 (optional)
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Admin 이메일 목록
const ADMIN_EMAILS = [
    process.env.ADMIN_EMAIL,
    'wksun999@gmail.com'
].filter(Boolean);

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 인증 확인
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: '인증이 필요합니다' });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: '유효하지 않은 토큰입니다' });
        }

        // Admin 권한 확인
        const isAdmin = ADMIN_EMAILS.includes(user.email);
        if (!isAdmin) {
            return res.status(403).json({ error: '관리자 권한이 필요합니다' });
        }

        // Query 파라미터 파싱
        const { period = 'month', service = 'all', user_id } = req.query;

        // 기간 계산
        const now = new Date();
        let startDate;
        switch (period) {
            case 'day':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'all':
                startDate = new Date('2024-01-01');
                break;
            default:
                startDate = new Date(now.setMonth(now.getMonth() - 1));
        }

        // 1. 전체 통계
        const totalStats = await getTotalStats(startDate, service, user_id);

        // 2. 서비스별 통계
        const serviceStats = await getServiceStats(startDate, user_id);

        // 3. 일별 추이
        const dailyTrend = await getDailyTrend(startDate, service, user_id);

        // 4. 상위 사용자
        const topUsers = await getTopUsers(startDate, service);

        return res.status(200).json({
            success: true,
            period,
            start_date: startDate.toISOString(),
            end_date: new Date().toISOString(),
            summary: totalStats,
            by_service: serviceStats,
            daily_trend: dailyTrend,
            top_users: topUsers,
            generated_at: new Date().toISOString()
        });

    } catch (error) {
        console.error('AI Usage API error:', error);
        return res.status(500).json({
            error: '사용량 조회 실패',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * 전체 통계 조회
 */
async function getTotalStats(startDate, service, userId) {
    let query = supabase
        .from('ai_usage_log')
        .select('cost, tokens_used, response_time_ms', { count: 'exact' })
        .gte('created_at', startDate.toISOString());

    if (service !== 'all') {
        query = query.eq('service_name', service);
    }
    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error('Total stats error:', error);
        return { total_requests: 0, total_cost: 0, total_tokens: 0, avg_response_time: 0 };
    }

    const totalCost = data.reduce((sum, row) => sum + (row.cost || 0), 0);
    const totalTokens = data.reduce((sum, row) => sum + (row.tokens_used || 0), 0);
    const avgResponseTime = data.length > 0
        ? Math.round(data.reduce((sum, row) => sum + (row.response_time_ms || 0), 0) / data.length)
        : 0;

    return {
        total_requests: count || 0,
        total_cost: totalCost,
        total_cost_formatted: `₩${totalCost.toLocaleString()}`,
        total_tokens: totalTokens,
        total_tokens_formatted: `${(totalTokens / 1000).toFixed(1)}K`,
        avg_response_time: avgResponseTime,
        avg_response_time_formatted: `${avgResponseTime}ms`
    };
}

/**
 * 서비스별 통계
 */
async function getServiceStats(startDate, userId) {
    const services = ['ChatGPT', 'Gemini', 'Perplexity'];
    const stats = {};

    for (const service of services) {
        let query = supabase
            .from('ai_usage_log')
            .select('cost, tokens_used', { count: 'exact' })
            .eq('service_name', service)
            .gte('created_at', startDate.toISOString());

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, count, error } = await query;

        if (error) {
            console.error(`${service} stats error:`, error);
            stats[service] = { requests: 0, cost: 0, tokens: 0 };
            continue;
        }

        const totalCost = data.reduce((sum, row) => sum + (row.cost || 0), 0);
        const totalTokens = data.reduce((sum, row) => sum + (row.tokens_used || 0), 0);

        stats[service] = {
            requests: count || 0,
            cost: totalCost,
            cost_formatted: `₩${totalCost.toLocaleString()}`,
            tokens: totalTokens,
            tokens_formatted: `${(totalTokens / 1000).toFixed(1)}K`,
            icon: getServiceIcon(service),
            color: getServiceColor(service)
        };
    }

    return stats;
}

/**
 * 일별 추이
 */
async function getDailyTrend(startDate, service, userId) {
    let query = supabase
        .from('ai_usage_log')
        .select('created_at, cost, service_name')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

    if (service !== 'all') {
        query = query.eq('service_name', service);
    }
    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Daily trend error:', error);
        return [];
    }

    // 날짜별 그룹핑
    const dailyMap = {};
    data.forEach(row => {
        const date = row.created_at.split('T')[0];
        if (!dailyMap[date]) {
            dailyMap[date] = { date, requests: 0, cost: 0 };
        }
        dailyMap[date].requests += 1;
        dailyMap[date].cost += row.cost || 0;
    });

    return Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 상위 사용자 (Top 10)
 */
async function getTopUsers(startDate, service) {
    let query = supabase
        .from('ai_usage_log')
        .select('user_id, cost')
        .gte('created_at', startDate.toISOString());

    if (service !== 'all') {
        query = query.eq('service_name', service);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Top users error:', error);
        return [];
    }

    // 사용자별 집계
    const userMap = {};
    data.forEach(row => {
        if (!userMap[row.user_id]) {
            userMap[row.user_id] = { user_id: row.user_id, requests: 0, total_cost: 0 };
        }
        userMap[row.user_id].requests += 1;
        userMap[row.user_id].total_cost += row.cost || 0;
    });

    // 상위 10명 정렬
    return Object.values(userMap)
        .sort((a, b) => b.total_cost - a.total_cost)
        .slice(0, 10)
        .map(user => ({
            ...user,
            total_cost_formatted: `₩${user.total_cost.toLocaleString()}`
        }));
}

/**
 * 서비스 아이콘
 */
function getServiceIcon(service) {
    const icons = {
        'ChatGPT': '🤖',
        'Gemini': '🌟',
        'Perplexity': '🔍'
    };
    return icons[service] || '💬';
}

/**
 * 서비스 컬러
 */
function getServiceColor(service) {
    const colors = {
        'ChatGPT': '#10A37F',
        'Gemini': '#4285F4',
        'Perplexity': '#1FB8CD'
    };
    return colors[service] || '#718096';
}
