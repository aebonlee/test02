/**
 * @task S4BA-ADMIN
 * @description 관리자용 회원 삭제 API
 *
 * auth.users와 users 테이블 모두에서 삭제
 * SERVICE_ROLE_KEY 사용 (서버 전용)
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // CORS 헤더
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, adminToken } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Admin 권한 확인 (요청자가 관리자인지 검증)
        const supabaseUrl = process.env.SUPABASE_URL || 'https://zwjmfewyshhwpgwdtrus.supabase.co';
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseServiceKey) {
            console.error('SERVICE_ROLE_KEY not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Service Role 클라이언트 생성
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 요청자 권한 확인 (adminToken으로 현재 사용자가 admin인지 확인)
        if (adminToken) {
            const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(adminToken);

            if (authError || !user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // users 테이블에서 role 확인
            const { data: adminUser, error: adminError } = await supabaseAdmin
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();

            if (adminError || !adminUser || adminUser.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
        }

        // 1. 삭제 대상 사용자 정보 확인
        const { data: targetUser, error: findError } = await supabaseAdmin
            .from('users')
            .select('id, email, nickname')
            .eq('id', userId)
            .single();

        if (findError || !targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`🗑️ Deleting user: ${targetUser.email} (${userId})`);

        // 2. auth.users에서 삭제 (Admin API)
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (authDeleteError) {
            console.error('Auth delete error:', authDeleteError);
            // auth에서 이미 삭제되었거나 없는 경우 무시하고 계속 진행
            if (!authDeleteError.message.includes('not found')) {
                return res.status(500).json({
                    error: 'Failed to delete from auth',
                    details: authDeleteError.message
                });
            }
        }

        // 3. users 테이블에서 삭제
        const { error: usersDeleteError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', userId);

        if (usersDeleteError) {
            console.error('Users table delete error:', usersDeleteError);
            return res.status(500).json({
                error: 'Failed to delete from users table',
                details: usersDeleteError.message
            });
        }

        console.log(`✅ User deleted successfully: ${targetUser.email}`);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            deletedUser: {
                id: userId,
                email: targetUser.email,
                nickname: targetUser.nickname
            }
        });

    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
