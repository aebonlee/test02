/**
 * @task S2BA5
 * 프로젝트 생성 API
 * POST /api/projects/create
 */

import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../lib/auth-middleware.js';

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

    const { name, description, template_id } = req.body;

    // 입력 검증
    if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: '프로젝트 이름은 필수입니다' });
    }

    if (name.trim().length > 100) {
        return res.status(400).json({ error: '프로젝트 이름은 100자 이하여야 합니다' });
    }

    if (description && description.length > 500) {
        return res.status(400).json({ error: '프로젝트 설명은 500자 이하여야 합니다' });
    }

    try {
        // 프로젝트 생성
        const projectData = {
            user_id: user.id,
            name: name.trim(),
            description: description?.trim() || '',
            template_id: template_id || null,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data: project, error } = await supabase
            .from('projects')
            .insert(projectData)
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            throw error;
        }

        // 템플릿 기반 초기 데이터 생성 (있는 경우)
        if (template_id) {
            await initializeFromTemplate(project.id, template_id);
        }

        return res.status(201).json({
            success: true,
            message: '프로젝트가 생성되었습니다',
            project
        });

    } catch (error) {
        console.error('Project creation error:', error);
        return res.status(500).json({
            error: '프로젝트 생성 중 오류가 발생했습니다',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * 템플릿에서 초기 데이터 복사
 * @param {string} projectId - 생성된 프로젝트 ID
 * @param {string} templateId - 템플릿 ID
 */
async function initializeFromTemplate(projectId, templateId) {
    try {
        // 템플릿에서 Task 목록 조회
        const { data: templateTasks, error: fetchError } = await supabase
            .from('template_tasks')
            .select('*')
            .eq('template_id', templateId)
            .order('order_index', { ascending: true });

        if (fetchError || !templateTasks?.length) {
            console.log('No template tasks found or error:', fetchError);
            return;
        }

        // 프로젝트에 Task 복사
        const projectTasks = templateTasks.map(task => ({
            project_id: projectId,
            title: task.title,
            description: task.description,
            order_index: task.order_index,
            status: 'pending',
            created_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabase
            .from('project_tasks')
            .insert(projectTasks);

        if (insertError) {
            console.error('Template initialization error:', insertError);
        }
    } catch (error) {
        console.error('Template initialization failed:', error);
        // 템플릿 초기화 실패해도 프로젝트 생성은 성공으로 처리
    }
}
