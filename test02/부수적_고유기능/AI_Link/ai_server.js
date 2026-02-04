// AI_Link Server - AI API 전용 서버
// Bridge와 분리된 독립적인 AI API 서버

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3031;

// Middleware
app.use(cors());
app.use(express.json());

// 시작 배너
console.log('\n' + '='.repeat(60));
console.log('🤖 AI_Link Server Starting...');
console.log('='.repeat(60));

// Perplexity API 엔드포인트
app.post('/ask-perplexity', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                error: '질문이 비어있습니다.'
            });
        }

        console.log(`🔍 Perplexity 질문: ${question.substring(0, 50)}...`);

        // Perplexity API 모듈 로드
        const { askPerplexity } = require('./AI/Perplexity/perplexity_api.js');

        const answer = await askPerplexity(question);

        console.log(`✅ Perplexity 응답 완료`);

        res.json({
            success: true,
            question: question,
            answer: answer
        });

    } catch (error) {
        console.error('❌ Perplexity 질문 실패:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ChatGPT API 엔드포인트
app.post('/ask-chatgpt', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                error: '질문이 비어있습니다.'
            });
        }

        console.log(`💬 ChatGPT 질문: ${question.substring(0, 50)}...`);

        // ChatGPT API 모듈 로드
        const { askChatGPT } = require('./AI/ChatGPT/chatgpt_api.js');

        const answer = await askChatGPT(question);

        console.log(`✅ ChatGPT 응답 완료`);

        res.json({
            success: true,
            question: question,
            answer: answer
        });

    } catch (error) {
        console.error('❌ ChatGPT 질문 실패:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Gemini API 엔드포인트
app.post('/ask-gemini', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                error: '질문이 비어있습니다.'
            });
        }

        console.log(`🔷 Gemini 질문: ${question.substring(0, 50)}...`);

        // Gemini API 모듈 로드
        const { askGemini } = require('./AI/Gemini/gemini_api.js');

        const answer = await askGemini(question);

        console.log(`✅ Gemini 응답 완료`);

        res.json({
            success: true,
            question: question,
            answer: answer
        });

    } catch (error) {
        console.error('❌ Gemini 질문 실패:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check 엔드포인트
app.get('/ping', (req, res) => {
    res.json({
        success: true,
        message: 'AI_Link Server is running',
        timestamp: new Date().toISOString()
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🤖 AI_Link Server is running!');
    console.log('='.repeat(60));
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log('='.repeat(60));
    console.log('\n📋 Available AI API Endpoints:');
    console.log('   POST /ask-perplexity  - Perplexity AI 질문');
    console.log('   POST /ask-chatgpt     - ChatGPT 질문');
    console.log('   POST /ask-gemini      - Gemini 질문');
    console.log('   GET  /ping            - Health check');
    console.log('\n💡 Google Translate는 별도 웹 인터페이스 사용');
    console.log('='.repeat(60) + '\n');
});
