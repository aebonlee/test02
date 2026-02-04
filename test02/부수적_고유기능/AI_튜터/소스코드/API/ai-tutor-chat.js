/**
 * @task S3BA3
 * @description AI 튜터 채팅 API (RAG + SSE 스트리밍)
 * OWASP A05 대응: CORS 도메인 제한 적용 (2026-01-18)
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ragPipeline } = require('../Backend_Infra/rag');
const { setCorsHeaders } = require('../Backend_APIs/lib/cors');

// 환경변수
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Rate limit 저장소 (메모리 - Vercel serverless 한계로 단순화)
const rateLimitMap = new Map();

/**
 * Rate limit 체크 (30 req/min)
 */
function checkRateLimit(userId) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1분
    const maxRequests = 30;

    const userKey = `ai-tutor:${userId}`;
    const userData = rateLimitMap.get(userKey) || { count: 0, resetTime: now + windowMs };

    // 윈도우 리셋
    if (now > userData.resetTime) {
        userData.count = 0;
        userData.resetTime = now + windowMs;
    }

    userData.count++;
    rateLimitMap.set(userKey, userData);

    return userData.count <= maxRequests;
}

module.exports = async function handler(req, res) {
    // CORS 처리 (OWASP A05 대응: 도메인 제한)
    if (setCorsHeaders(req, res)) {
        return; // Preflight 요청 처리 완료
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, conversationId, history = [] } = req.body;

    if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Authorization 헤더 확인
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Supabase 클라이언트 (사용자 토큰으로 생성)
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // 서비스 롤 클라이언트 (크레딧 차감용)
    const supabaseAdmin = createClient(
        SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    try {
        // 사용자 확인
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Rate limiting
        if (!checkRateLimit(user.id)) {
            return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
        }

        // 크레딧 확인
        const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .select('credit_balance')
            .eq('id', user.id)
            .single();

        if (userError) {
            console.error('User fetch error:', userError);
            return res.status(500).json({ error: 'Failed to fetch user data' });
        }

        if (!userData || userData.credit_balance < 1) {
            return res.status(402).json({ error: 'Insufficient credits' });
        }

        // RAG 파이프라인 실행
        const ragResult = await ragPipeline(supabaseAdmin, message, {
            matchThreshold: 0.3, // 검색 감도 향상 (0.5 → 0.3)
            matchCount: 5,
            history: history
        });

        // SSE 헤더 설정
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        // Gemini 스트리밍 응답
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7
            }
        });

        // 프롬프트 구성
        const fullPrompt = `${ragResult.systemPrompt}\n\n${ragResult.userPrompt}`;

        // 스트리밍 생성
        const result = await model.generateContentStream(fullPrompt);

        let fullResponse = '';

        // 스트리밍 청크 전송
        for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
                fullResponse += text;
                res.write(`data: ${JSON.stringify({ type: 'content', text })}\n\n`);
            }
        }

        // 소스 정보 전송
        if (ragResult.sources && ragResult.sources.length > 0) {
            res.write(`data: ${JSON.stringify({ type: 'sources', sources: ragResult.sources })}\n\n`);
        }

        // 대화 저장
        let convId = conversationId;

        if (!convId) {
            // 새 대화 생성
            const { data: newConv, error: convError } = await supabaseAdmin
                .from('tutor_conversations')
                .insert({
                    user_id: user.id,
                    title: message.slice(0, 50) + (message.length > 50 ? '...' : '')
                })
                .select()
                .single();

            if (convError) {
                console.error('Conversation create error:', convError);
            } else {
                convId = newConv.id;
            }
        }

        // 메시지 저장 (대화 ID가 있는 경우만)
        if (convId) {
            await supabaseAdmin.from('tutor_messages').insert([
                { conversation_id: convId, role: 'user', content: message },
                {
                    conversation_id: convId,
                    role: 'assistant',
                    content: fullResponse,
                    sources: ragResult.sources
                }
            ]);

            // 대화 업데이트 시간 갱신
            await supabaseAdmin
                .from('tutor_conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', convId);
        }

        // 크레딧 차감 (1 크레딧)
        await supabaseAdmin
            .from('users')
            .update({ credit_balance: userData.credit_balance - 1 })
            .eq('id', user.id);

        // 사용 기록 저장
        await supabaseAdmin.from('ai_usage_log').insert({
            user_id: user.id,
            provider: 'google',
            model: 'gemini-2.0-flash-exp',
            prompt_tokens: 0, // Gemini 스트리밍에서는 정확한 토큰 수 불가
            completion_tokens: 0,
            total_tokens: 0,
            credits_used: 1,
            request_type: 'ai-tutor',
            success: true
        });

        // 완료 신호
        res.write(`data: ${JSON.stringify({
            type: 'done',
            conversationId: convId,
            creditsRemaining: userData.credit_balance - 1
        })}\n\n`);

        res.end();

    } catch (error) {
        console.error('AI Tutor error:', error);

        // 에러가 발생해도 SSE 형식으로 전송 시도
        try {
            res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
            res.end();
        } catch (e) {
            // 헤더가 이미 전송되지 않은 경우
            if (!res.headersSent) {
                res.status(500).json({ error: error.message });
            }
        }
    }
};
