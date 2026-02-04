/**
 * @task TEST
 * @description AI 튜터 테스트 전용 API (인증 우회, Rate Limiting만)
 * ⚠️ 주의: 이 API는 테스트 전용입니다. 프로덕션에서는 사용하지 마세요.
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ragPipeline } = require('../Backend_Infra/rag');

// 환경변수
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Rate limit 저장소 (IP 기반)
const rateLimitMap = new Map();

/**
 * Rate limit 체크 (1분에 5회)
 */
function checkRateLimit(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1분
    const maxRequests = 5; // 테스트이므로 제한적

    const key = `test:${ip}`;
    const data = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

    // 윈도우 리셋
    if (now > data.resetTime) {
        data.count = 0;
        data.resetTime = now + windowMs;
    }

    data.count++;
    rateLimitMap.set(key, data);

    return data.count <= maxRequests;
}

/**
 * IP 주소 추출
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           'unknown';
}

module.exports = async function handler(req, res) {
    // CORS 허용 (테스트용)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, history = [] } = req.body;

    if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required' });
    }

    // IP 기반 Rate limiting
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP)) {
        return res.status(429).json({
            error: 'Too many requests',
            message: '테스트 API는 1분에 5회로 제한됩니다.'
        });
    }

    // Service Role 클라이언트 (인증 우회)
    const supabaseAdmin = createClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY
    );

    try {
        console.log(`[TEST API] 질문: ${message}`);

        // RAG 파이프라인 실행
        const ragResult = await ragPipeline(supabaseAdmin, message, {
            matchThreshold: 0.25, // 검색 감도 향상 (0.5 → 0.3 → 0.25)
            matchCount: 10, // 검색 문서 수 증가 (5 → 10)
            history: history
        });

        console.log(`[TEST API] RAG 컨텍스트: ${ragResult.contextCount}개 문서`);

        // Gemini 모델 초기화
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

        // SSE 응답 설정
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // 스트리밍 응답
        const result = await model.generateContentStream(fullPrompt);

        let fullText = '';

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;

            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }

        console.log(`[TEST API] 응답 완료 (${fullText.length}자)`);

        // 완료 신호
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('[TEST API] 오류:', error);

        // SSE 형식으로 오류 전송
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'text/event-stream');
        }

        res.write(`data: ${JSON.stringify({
            error: true,
            message: error.message
        })}\n\n`);
        res.end();
    }
};
