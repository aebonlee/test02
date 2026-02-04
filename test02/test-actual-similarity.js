const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testActualSimilarity() {
    console.log('질문과 Tips의 실제 유사도 계산\n');
    console.log('═══════════════════════════════════════════════\n');

    const tests = [
        { question: 'Git 사용법', expected: 'Git으로_버전_관리하기' },
        { question: '디버깅 방법', expected: '5회_반복_디버깅_기법' },
        { question: 'Vanilla React', expected: 'Vanilla와_React란_무엇인가' }
    ];

    for (const test of tests) {
        console.log(`질문: "${test.question}"`);
        console.log(`기대 파일: ${test.expected}\n`);

        // 질문 임베딩 생성
        const model = genAI.getGenerativeModel({ model: 'embedding-001' });
        const result = await model.embedContent(test.question);
        const queryEmbedding = result.embedding.values;

        // 벡터 검색 (threshold 0, 상위 30개)
        const { data, error } = await supabase.rpc('search_content', {
            query_embedding: queryEmbedding,
            match_threshold: 0.0,
            match_count: 30
        });

        if (error) {
            console.error('에러:', error);
            continue;
        }

        // 기대 파일 찾기
        const targetDoc = data.find(d => d.content_id === test.expected);
        const targetRank = data.findIndex(d => d.content_id === test.expected) + 1;

        if (targetDoc) {
            console.log(`✅ 발견! 순위: ${targetRank}위`);
            console.log(`   제목: ${targetDoc.title}`);
            console.log(`   유사도: ${(targetDoc.similarity * 100).toFixed(1)}%`);
            console.log(`   content_type: ${targetDoc.content_type}`);
        } else {
            console.log(`❌ 상위 30개에 없음`);
        }

        // 상위 3개 출력
        console.log(`\n상위 3개:`);
        data.slice(0, 3).forEach((item, idx) => {
            console.log(`   ${idx + 1}. [${item.content_type}] ${item.title} (${(item.similarity * 100).toFixed(1)}%)`);
        });

        console.log('\n───────────────────────────────────────────────\n');
    }
}

testActualSimilarity().catch(console.error);
