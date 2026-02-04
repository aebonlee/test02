/**
 * @task S4S2
 * @description Viewer 접근 보안 API
 *
 * 기능:
 * - JWT 토큰 검증
 * - 사용자 프로젝트 접근 권한 확인
 * - 프로젝트 소유권 검증
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * JWT 토큰에서 사용자 정보 추출
 */
async function getUserFromToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) throw error;
        return user;
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return null;
    }
}

/**
 * 사용자 역할 조회
 */
async function getUserRole(userId) {
    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

    if (error) return 'user';
    return data?.role || 'user';
}

/**
 * 프로젝트 소유권 확인
 */
async function checkProjectOwnership(userId, projectId) {
    const { data, error } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single();

    return !error && data !== null;
}

/**
 * Viewer 접근 권한 확인 API
 *
 * GET /api/viewer/auth
 * Headers: Authorization: Bearer <token>
 *
 * Response:
 * - 비로그인: { authenticated: false, accessLevel: 'public' }
 * - 로그인: { authenticated: true, accessLevel: 'user', userId: '...', projects: [...] }
 * - 관리자: { authenticated: true, accessLevel: 'admin', userId: '...' }
 */
export default async function handler(req, res) {
    // CORS 헤더
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const user = await getUserFromToken(req.headers.authorization);

        // 비로그인 사용자
        if (!user) {
            return res.status(200).json({
                authenticated: false,
                accessLevel: 'public',
                message: 'SSALWORKS 예시 프로젝트만 접근 가능합니다.'
            });
        }

        // 사용자 역할 확인
        const role = await getUserRole(user.id);

        // 관리자
        if (role === 'admin') {
            return res.status(200).json({
                authenticated: true,
                accessLevel: 'admin',
                userId: user.id,
                email: user.email,
                message: '모든 프로젝트에 접근 가능합니다.'
            });
        }

        // 일반 사용자 - 자신의 프로젝트 목록 조회
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, project_name, status, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Projects query error:', error);
        }

        return res.status(200).json({
            authenticated: true,
            accessLevel: 'user',
            userId: user.id,
            email: user.email,
            projects: projects || [],
            message: '자신의 프로젝트에만 접근 가능합니다.'
        });

    } catch (error) {
        console.error('Auth API error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

/**
 * 프로젝트 접근 권한 확인 API
 *
 * POST /api/viewer/auth
 * Headers: Authorization: Bearer <token>
 * Body: { projectId: '...' }
 *
 * Response:
 * - 권한 있음: { hasAccess: true }
 * - 권한 없음: { hasAccess: false, reason: '...' }
 */
export async function checkAccess(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { projectId } = req.body;

    if (!projectId) {
        return res.status(400).json({ error: 'projectId is required' });
    }

    // SSALWORKS 공개 프로젝트는 누구나 접근 가능
    if (projectId === 'SSALWORKS' || projectId === null) {
        return res.status(200).json({
            hasAccess: true,
            reason: 'Public project'
        });
    }

    const user = await getUserFromToken(req.headers.authorization);

    // 비로그인 사용자는 공개 프로젝트만 접근 가능
    if (!user) {
        return res.status(200).json({
            hasAccess: false,
            reason: '로그인이 필요합니다.'
        });
    }

    // 관리자는 모든 프로젝트 접근 가능
    const role = await getUserRole(user.id);
    if (role === 'admin') {
        return res.status(200).json({
            hasAccess: true,
            reason: 'Admin access'
        });
    }

    // 일반 사용자는 자신의 프로젝트만 접근 가능
    const isOwner = await checkProjectOwnership(user.id, projectId);

    return res.status(200).json({
        hasAccess: isOwner,
        reason: isOwner ? 'Project owner' : '접근 권한이 없습니다.'
    });
}
