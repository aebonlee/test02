/**
 * @task S2BA5
 * 프로젝트 목록 조회 API
 * GET /api/projects/list
 */

import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../lib/auth-middleware.js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 허용되는 상태 값
const VALID_STATUSES = ['active', 'completed', 'archived', 'deleted', 'all'];

// 허용되는 정렬 필드
const VALID_SORT_FIELDS = ['created_at', 'updated_at', 'name', 'status'];

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

    // 인증 확인
    const user = await verifyToken(req);
    if (!user) {
        return res.status(401).json({ error: '인증이 필요합니다' });
    }

    // 쿼리 파라미터 파싱
    const {
        status = 'all',
        page = '1',
        limit = '10',
        sort = 'created_at',
        order = 'desc',
        search = ''
    } = req.query;

    // 파라미터 검증
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            error: '유효하지 않은 상태 필터입니다',
            validStatuses: VALID_STATUSES
        });
    }

    if (!VALID_SORT_FIELDS.includes(sort)) {
        return res.status(400).json({
            error: '유효하지 않은 정렬 필드입니다',
            validSortFields: VALID_SORT_FIELDS
        });
    }

    try {
        // 기본 쿼리 생성
        let query = supabase
            .from('projects')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id);

        // 상태 필터 적용 (deleted 제외 기본)
        if (status === 'all') {
            query = query.neq('status', 'deleted');
        } else {
            query = query.eq('status', status);
        }

        // 검색어 필터 적용
        if (search && search.trim()) {
            const searchTerm = search.trim();
            query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        // 정렬 적용
        query = query.order(sort, { ascending: order === 'asc' });

        // 페이지네이션 적용
        query = query.range(offset, offset + limitNum - 1);

        const { data: projects, count, error } = await query;

        if (error) {
            console.error('Supabase query error:', error);
            throw error;
        }

        // 통계 정보 조회
        const stats = await getProjectStats(user.id);

        return res.status(200).json({
            success: true,
            projects: projects || [],
            pagination: {
                total: count || 0,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil((count || 0) / limitNum),
                hasNext: offset + limitNum < (count || 0),
                hasPrev: pageNum > 1
            },
            stats
        });

    } catch (error) {
        console.error('Project list error:', error);
        return res.status(500).json({
            error: '프로젝트 목록 조회 중 오류가 발생했습니다',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * 사용자의 프로젝트 통계 조회
 * @param {string} userId - 사용자 ID
 * @returns {Object} 상태별 프로젝트 수
 */
async function getProjectStats(userId) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('status')
            .eq('user_id', userId);

        if (error || !data) {
            return {
                total: 0,
                active: 0,
                completed: 0,
                archived: 0
            };
        }

        const stats = {
            total: data.filter(p => p.status !== 'deleted').length,
            active: data.filter(p => p.status === 'active').length,
            completed: data.filter(p => p.status === 'completed').length,
            archived: data.filter(p => p.status === 'archived').length
        };

        return stats;
    } catch (error) {
        console.error('Stats query error:', error);
        return {
            total: 0,
            active: 0,
            completed: 0,
            archived: 0
        };
    }
}
