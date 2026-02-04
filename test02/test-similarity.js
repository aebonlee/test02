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

async function testSimilarity() {
    console.log('질문과 Tips 문서의 유사도 테스트\n');

    // 질문 임베딩 생성
    const question = '5회 반복 디버깅 기법이 뭐야?';
    console.log(`질문: "${question}"\n`);

    const model = genAI.getGenerativeModel({ model: 'embedding-001' });
    const result = await model.embedContent(question);
    const queryEmbedding = result.embedding.values;

    console.log('질문 임베딩 생성 완료\n');

    // 유사도 검색 (matchThreshold 없이, 상위 10개)
    const { data, error } = await supabase.rpc('search_content', {
        query_embedding: queryEmbedding,
        match_threshold: 0.0, // threshold 0으로 설정
        match_count: 10
    });

    if (error) {
        console.error('에러:', error);
        return;
    }

    console.log(`검색 결과: ${data.length}개\n`);

    // Tips만 필터링해서 출력
    const tipsOnly = data.filter(d => d.content_type === 'tips');
    console.log(`Tips 문서: ${tipsOnly.length}개\n`);

    if (tipsOnly.length > 0) {
        console.log('Tips 검색 결과:');
        tipsOnly.forEach((item, idx) => {
            console.log(`\n${idx + 1}. ${item.title}`);
            console.log(`   유사도: ${(item.similarity * 100).toFixed(1)}%`);
            console.log(`   content_id: ${item.content_id}`);
        });
    } else {
        console.log('❌ Tips가 상위 10개에 포함되지 않았습니다.');
        console.log('\n전체 검색 결과 (상위 10개):');
        data.forEach((item, idx) => {
            console.log(`${idx + 1}. [${item.content_type}] ${item.title} (${(item.similarity * 100).toFixed(1)}%)`);
        });
    }
}

testSimilarity().catch(console.error);
