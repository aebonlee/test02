/**
 * @task S4F5
 * @description 프로젝트 생성 API
 *
 * POST /api/projects/create
 *
 * Request Body:
 * {
 *   "projectName": "string",
 *   "description": "string" (optional)
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "projectId": "A3B5C7D9-P001",
 *   "projectName": "string",
 *   "projectPath": "virtual path for display"
 * }
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 8자리 고유 user_id 생성 함수
function generateUserId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 고유한 user_id 생성 (중복 체크)
async function createUniqueUserId() {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        const userId = generateUserId();
        const { data } = await supabase
            .from('users')
            .select('user_id')
            .eq('user_id', userId)
            .single();

        if (!data) {
            return userId;
        }
        attempts++;
    }
    throw new Error('Failed to generate unique user_id');
}

module.exports = async (req, res) => {
    // CORS 헤더
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // OPTIONS 요청 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST 메서드만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // 1. 사용자 인증 확인
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: '로그인이 필요합니다'
            });
        }

        const token = authHeader.substring(7);
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({
                success: false,
                error: '유효하지 않은 인증 토큰입니다'
            });
        }

        // 2. 요청 데이터 검증
        const { projectName, description } = req.body;

        if (!projectName || projectName.trim() === '') {
            return res.status(400).json({
                success: false,
                error: '프로젝트 이름을 입력해주세요'
            });
        }

        // 3. users 테이블에서 builder_id (12자리) 조회
        // 빌더 계정 ID 기준으로 프로젝트 관리
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_id, builder_id, installation_fee_paid')
            .eq('id', user.id)
            .single();

        if (!userData) {
            return res.status(400).json({
                success: false,
                error: '사용자 정보를 찾을 수 없습니다'
            });
        }

        // 빌더 계정 개설비 납부 확인
        if (!userData.installation_fee_paid) {
            return res.status(400).json({
                success: false,
                error: '빌더 계정 개설비 납부 후 프로젝트를 생성할 수 있습니다'
            });
        }

        // 빌더 계정 ID 확인
        if (!userData.builder_id) {
            return res.status(400).json({
                success: false,
                error: '빌더 계정 ID가 없습니다. 관리자에게 문의하세요.'
            });
        }

        const builderId = userData.builder_id;
        const userId = userData.user_id;

        // 4. 진행 중인 프로젝트가 있는지 확인
        // (DB에 idx_one_in_progress_per_user 제약조건 있음 - 사용자당 1개만 허용)
        const { data: existingProject, error: checkError } = await supabase
            .from('projects')
            .select('project_id, project_name')
            .eq('user_id', userId)
            .eq('status', 'in_progress')
            .single();

        if (existingProject) {
            return res.status(400).json({
                success: false,
                error: `이미 진행 중인 프로젝트가 있습니다: ${existingProject.project_name}`,
                existingProjectId: existingProject.project_id,
                existingProjectName: existingProject.project_name,
                hint: '기존 프로젝트를 완료하거나 삭제한 후 새 프로젝트를 생성해주세요'
            });
        }

        // 5. project_id 생성 (builder_id-P001 형식)
        // 빌더 계정 ID 기준으로 프로젝트 ID 생성
        const { count: projectCount, error: countError } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (countError) {
            console.error('Project count failed:', countError);
            return res.status(500).json({
                success: false,
                error: '프로젝트 수 조회 실패',
                details: countError.message,
                builderId: builderId
            });
        }

        const nextProjectNum = (projectCount || 0) + 1;
        const projectId = `${builderId}-P${String(nextProjectNum).padStart(3, '0')}`;

        console.log('Creating project:', { builderId, userId, projectId, projectName: projectName.trim() });

        // 6. 프로젝트 생성
        const { data: newProject, error: insertError } = await supabase
            .from('projects')
            .insert({
                user_id: userId,
                project_id: projectId,
                project_name: projectName.trim(),
                description: description?.trim() || null,
                status: 'in_progress',
                progress: 0,
                current_stage: 0,
                total_stages: 5
            })
            .select()
            .single();

        if (insertError) {
            console.error('Project insert failed:', insertError);

            // 사용자당 1개 진행 중 프로젝트 제약조건 위반 (레이스 컨디션 대비)
            if (insertError.code === '23505' && insertError.message.includes('idx_one_in_progress_per_user')) {
                return res.status(400).json({
                    success: false,
                    error: '이미 진행 중인 프로젝트가 있습니다',
                    hint: '기존 프로젝트를 완료하거나 삭제한 후 새 프로젝트를 생성해주세요'
                });
            }

            return res.status(500).json({
                success: false,
                error: '프로젝트 생성에 실패했습니다',
                details: insertError.message,
                code: insertError.code,
                userId: userId,
                projectId: projectId
            });
        }

        // 7. project_phase_progress 초기 데이터 생성 (P0~P3, S0~S5)
        const phaseProgressData = [
            { project_id: projectId, phase_code: 'P0', phase_name: '작업 디렉토리 구조 생성', progress: 0, completed_items: 0, total_items: 2, status: 'Not Started' },
            { project_id: projectId, phase_code: 'P1', phase_name: '사업계획', progress: 0, completed_items: 0, total_items: 5, status: 'Not Started' },
            { project_id: projectId, phase_code: 'P2', phase_name: '프로젝트 기획', progress: 0, completed_items: 0, total_items: 6, status: 'Not Started' },
            { project_id: projectId, phase_code: 'P3', phase_name: '프로토타입 제작', progress: 0, completed_items: 0, total_items: 3, status: 'Not Started' },
            { project_id: projectId, phase_code: 'S0', phase_name: 'Project SAL Grid 생성', progress: 0, completed_items: 0, total_items: 1, status: 'Not Started' },
            { project_id: projectId, phase_code: 'S1', phase_name: '개발 준비', progress: 0, completed_items: 0, total_items: 10, status: 'Not Started' },
            { project_id: projectId, phase_code: 'S2', phase_name: '개발 1차', progress: 0, completed_items: 0, total_items: 20, status: 'Not Started' },
            { project_id: projectId, phase_code: 'S3', phase_name: '개발 2차', progress: 0, completed_items: 0, total_items: 15, status: 'Not Started' },
            { project_id: projectId, phase_code: 'S4', phase_name: '개발 3차', progress: 0, completed_items: 0, total_items: 10, status: 'Not Started' },
            { project_id: projectId, phase_code: 'S5', phase_name: '개발 마무리', progress: 0, completed_items: 0, total_items: 5, status: 'Not Started' }
        ];

        const { error: phaseError } = await supabase
            .from('project_phase_progress')
            .insert(phaseProgressData);

        if (phaseError) {
            console.warn('Phase progress 생성 실패 (프로젝트는 성공):', phaseError);
            // Phase progress 실패해도 프로젝트는 생성됨
        } else {
            console.log('Phase progress 초기화 완료:', projectId);
        }

        // 8. 성공 응답
        return res.status(200).json({
            success: true,
            projectId: projectId,
            projectName: newProject.project_name,
            projectPath: `C:/!SSAL_Works_Private/${projectName.trim()}/`,
            message: '프로젝트가 성공적으로 생성되었습니다'
        });

    } catch (error) {
        console.error('Project creation error:', error);
        return res.status(500).json({
            success: false,
            error: '프로젝트 생성 중 오류가 발생했습니다',
            details: error.message
        });
    }
};
