/**
 * @task S3BA3
 * @description AI 튜터 대화 관리 API (CRUD)
 */

const { createClient } = require('@supabase/supabase-js');

// 환경변수
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

module.exports = async function handler(req, res) {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).end();
    }

    // Authorization 헤더 확인
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Supabase 클라이언트 (사용자 토큰으로 생성 - RLS 적용)
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });

    try {
        // 사용자 확인
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // 쿼리 파라미터에서 ID 추출
        const { id } = req.query;

        switch (req.method) {
            case 'GET': {
                if (id) {
                    // 특정 대화 + 메시지 조회
                    const { data: conversation, error } = await supabase
                        .from('tutor_conversations')
                        .select(`
                            id,
                            title,
                            created_at,
                            updated_at,
                            tutor_messages (
                                id,
                                role,
                                content,
                                sources,
                                created_at
                            )
                        `)
                        .eq('id', id)
                        .single();

                    if (error) {
                        if (error.code === 'PGRST116') {
                            return res.status(404).json({ error: 'Conversation not found' });
                        }
                        throw error;
                    }

                    // 메시지 정렬 (시간순)
                    if (conversation.tutor_messages) {
                        conversation.tutor_messages.sort((a, b) =>
                            new Date(a.created_at) - new Date(b.created_at)
                        );
                    }

                    return res.json(conversation);
                } else {
                    // 대화 목록 조회 (최근 순)
                    const { data: conversations, error } = await supabase
                        .from('tutor_conversations')
                        .select('id, title, created_at, updated_at')
                        .order('updated_at', { ascending: false })
                        .limit(50);

                    if (error) throw error;

                    return res.json(conversations || []);
                }
            }

            case 'POST': {
                // 새 대화 생성
                const { title } = req.body;

                const { data, error } = await supabase
                    .from('tutor_conversations')
                    .insert({
                        user_id: user.id,
                        title: title || '새 대화'
                    })
                    .select()
                    .single();

                if (error) throw error;

                return res.status(201).json(data);
            }

            case 'PATCH': {
                // 대화 제목 수정
                if (!id) {
                    return res.status(400).json({ error: 'Conversation ID is required' });
                }

                const { title } = req.body;
                if (!title || title.trim() === '') {
                    return res.status(400).json({ error: 'Title is required' });
                }

                const { data, error } = await supabase
                    .from('tutor_conversations')
                    .update({
                        title: title.trim(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') {
                        return res.status(404).json({ error: 'Conversation not found' });
                    }
                    throw error;
                }

                return res.json(data);
            }

            case 'DELETE': {
                // 대화 삭제 (cascade로 메시지도 삭제됨)
                if (!id) {
                    return res.status(400).json({ error: 'Conversation ID is required' });
                }

                const { error } = await supabase
                    .from('tutor_conversations')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                return res.status(204).end();
            }

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('AI Tutor Conversations API error:', error);
        return res.status(500).json({ error: error.message });
    }
};
