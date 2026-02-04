const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    console.log('Gemini 임베딩 차원 테스트\n');

    const model = genAI.getGenerativeModel({ model: 'embedding-001' });
    const text = '테스트 문장입니다.';

    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    console.log(`임베딩 차원: ${embedding.length}`);
    console.log(`임베딩 타입: ${typeof embedding}`);
    console.log(`첫 5개 값: ${embedding.slice(0, 5).join(', ')}`);
}

test().catch(console.error);
