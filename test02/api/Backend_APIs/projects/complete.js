/**
 * @task S2BA5
 * 프로젝트 완료 처리 API
 * POST /api/projects/complete
 */

import { createClient } from '@supabase/supabase-js';
import { verifyToken, verifyOwnership } from '../lib/auth-middleware.js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 인증 확인
    const user = await verifyToken(req);
    if (!user) {
        return res.status(401).json({ error: '인증이 필요합니다' });
    }

    const { id, completion_note } = req.body;

    // 필수 필드 검증
    if (!id) {
        return res.status(400).json({ error: '프로젝트 ID는 필수입니다' });
    }

    try {
        // 프로젝트 존재 및 소유권 확인
        const { data: existing, error: fetchError } = await supabase
            .from('projects')
            .select('user_id, status, name')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
            return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다' });
        }

        if (!verifyOwnership(existing.user_id, user.id)) {
            return res.status(403).json({ error: '권한이 없습니다' });
        }

        // 상태 검증
        if (existing.status === 'completed') {
            return res.status(400).json({
                error: '이미 완료된 프로젝트입니다',
                completed_at: existing.completed_at
            });
        }

        if (existing.status === 'deleted') {
            return res.status(400).json({ error: '삭제된 프로젝트는 완료 처리할 수 없습니다' });
        }

        if (existing.status === 'archived') {
            return res.status(400).json({ error: '보관된 프로젝트는 먼저 활성화해야 합니다' });
        }

        // 완료되지 않은 Task 확인 (있다면 경고)
        const { data: pendingTasks, error: tasksError } = await supabase
            .from('project_tasks')
            .select('id, title')
            .eq('project_id', id)
            .neq('status', 'completed')
            .limit(5);

        let warningMessage = null;
        if (!tasksError && pendingTasks && pendingTasks.length > 0) {
            warningMessage = `${pendingTasks.length}개의 미완료 작업이 있습니다`;
        }

        // 완료 처리
        const updateData = {
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        if (completion_note) {
            updateData.completion_note = completion_note.trim();
        }

        const { data: project, error: updateError } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Supabase update error:', updateError);
            throw updateError;
        }

        // 완료 통계 업데이트 (비동기, 실패해도 무시)
        updateCompletionStats(user.id).catch(err => {
            console.error('Stats update failed:', err);
        });

        return res.status(200).json({
            success: true,
            message: '프로젝트가 완료되었습니다',
            project,
            warning: warningMessage
        });

    } catch (error) {
        console.error('Project complete error:', error);
        return res.status(500).json({
            error: '프로젝트 완료 처리 중 오류가 발생했습니다',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * 사용자의 프로젝트 완료 통계 업데이트
 * @param {string} userId - 사용자 ID
 */
async function updateCompletionStats(userId) {
    try {
        // 완료된 프로젝트 수 조회
        const { count, error } = await supabase
            .from('projects')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'completed');

        if (error) throw error;

        // 사용자 프로필에 통계 업데이트
        await supabase
            .from('users')
            .update({
                completed_projects_count: count || 0,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);
    } catch (error) {
        console.error('Stats update error:', error);
    }
}
