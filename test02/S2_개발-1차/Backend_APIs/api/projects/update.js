/**
 * @task S2BA5
 * 프로젝트 수정 API
 * PUT /api/projects/update
 */

import { createClient } from '@supabase/supabase-js';
import { verifyToken, verifyOwnership } from '../lib/auth-middleware.js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 허용되는 상태 값
const VALID_STATUSES = ['active', 'archived', 'deleted'];

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 인증 확인
    const user = await verifyToken(req);
    if (!user) {
        return res.status(401).json({ error: '인증이 필요합니다' });
    }

    const { id, name, description, status } = req.body;

    // 필수 필드 검증
    if (!id) {
        return res.status(400).json({ error: '프로젝트 ID는 필수입니다' });
    }

    // 입력 검증
    if (name !== undefined && name.trim().length === 0) {
        return res.status(400).json({ error: '프로젝트 이름은 비워둘 수 없습니다' });
    }

    if (name !== undefined && name.trim().length > 100) {
        return res.status(400).json({ error: '프로젝트 이름은 100자 이하여야 합니다' });
    }

    if (description !== undefined && description.length > 500) {
        return res.status(400).json({ error: '프로젝트 설명은 500자 이하여야 합니다' });
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            error: '유효하지 않은 상태입니다',
            validStatuses: VALID_STATUSES
        });
    }

    try {
        // 프로젝트 존재 및 소유권 확인
        const { data: existing, error: fetchError } = await supabase
            .from('projects')
            .select('user_id, status')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
            return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다' });
        }

        if (!verifyOwnership(existing.user_id, user.id)) {
            return res.status(403).json({ error: '권한이 없습니다' });
        }

        // 삭제된 프로젝트는 수정 불가
        if (existing.status === 'deleted') {
            return res.status(400).json({ error: '삭제된 프로젝트는 수정할 수 없습니다' });
        }

        // 완료된 프로젝트는 일부 필드만 수정 가능
        if (existing.status === 'completed' && name !== undefined) {
            return res.status(400).json({ error: '완료된 프로젝트의 이름은 수정할 수 없습니다' });
        }

        // 업데이트할 필드만 포함
        const updateData = {
            updated_at: new Date().toISOString()
        };

        if (name !== undefined) {
            updateData.name = name.trim();
        }
        if (description !== undefined) {
            updateData.description = description.trim();
        }
        if (status !== undefined) {
            updateData.status = status;

            // archived로 변경 시 archived_at 기록
            if (status === 'archived') {
                updateData.archived_at = new Date().toISOString();
            }

            // deleted로 변경 시 deleted_at 기록 (soft delete)
            if (status === 'deleted') {
                updateData.deleted_at = new Date().toISOString();
            }
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

        return res.status(200).json({
            success: true,
            message: '프로젝트가 수정되었습니다',
            project
        });

    } catch (error) {
        console.error('Project update error:', error);
        return res.status(500).json({
            error: '프로젝트 수정 중 오류가 발생했습니다',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
