/**
 * @task S4BA (Admin)
 * @description Sunny 문의 답변 저장 API (Admin 전용)
 * RLS를 우회하기 위해 service_role_key 사용
 */

const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
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

    const { inquiryId, answer, adminId } = req.body;

    if (!inquiryId || !answer) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['inquiryId', 'answer']
        });
    }

    // Admin 인증 확인 (Authorization 헤더)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Supabase 클라이언트 (Service Role Key 사용)
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    try {
        // Admin 권한 확인
        const token = authHeader.substring(7);
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error('Auth error:', authError);
            return res.status(401).json({ error: 'Invalid token', details: authError?.message });
        }

        // Admin 여부 확인 (users 테이블에서 - email로 조회)
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, email')
            .eq('email', user.email)
            .single();

        console.log('User lookup:', { userId: user.id, email: user.email, userData, userError });

        // Admin 확인: role이 'admin'이거나, 특정 Admin 이메일인 경우 허용
        const ADMIN_EMAILS = ['wksun999@gmail.com', 'admin@ssalworks.ai.kr'];
        const isAdmin = (userData?.role === 'admin') || ADMIN_EMAILS.includes(user.email);

        if (!isAdmin) {
            return res.status(403).json({
                error: 'Admin access required',
                debug: { role: userData?.role, email: user.email }
            });
        }

        // 1. 문의 정보 조회 (content 컬럼 사용 - question이 아님!)
        const { data: inquiry, error: fetchError } = await supabase
            .from('sunny_inquiries')
            .select('user_id, content, title')
            .eq('id', inquiryId)
            .single();

        if (fetchError) {
            console.error('Inquiry fetch error:', fetchError);
            return res.status(404).json({ error: 'Inquiry not found', details: fetchError.message });
        }

        // 2. 답변 저장 (Service Role Key로 RLS 우회)
        const { error: updateError } = await supabase
            .from('sunny_inquiries')
            .update({
                admin_answer: answer,
                status: 'answered',
                answered_at: new Date().toISOString(),
                answered_by: adminId || 'ADMIN001'
            })
            .eq('id', inquiryId);

        if (updateError) {
            console.error('Update error:', updateError);
            return res.status(500).json({ error: 'Failed to save answer', details: updateError.message });
        }

        // 3. 사용자에게 알림 생성
        if (inquiry.user_id) {
            // content 또는 title을 사용하여 알림 메시지 생성
            const notificationMessage = inquiry.title || inquiry.content?.substring(0, 50) + (inquiry.content?.length > 50 ? '...' : '');
            await supabase
                .from('user_notifications')
                .insert({
                    user_id: inquiry.user_id,
                    notification_type: 'sunny_answer',
                    title: '써니가 답변했습니다',
                    message: notificationMessage || '문의에 답변이 등록되었습니다.',
                    is_read: false,
                    created_at: new Date().toISOString()
                });
        }

        return res.status(200).json({
            success: true,
            message: '답변이 저장되었습니다.'
        });

    } catch (error) {
        console.error('Admin sunny answer error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};
