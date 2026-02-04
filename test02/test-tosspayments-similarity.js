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

async function testTossPayments() {
    console.log('토스페이먼츠 검색 테스트\n');
    console.log('═══════════════════════════════════════════════\n');

    const question = '토스페이먼츠 결제 시스템 설정 방법';
    console.log(`질문: "${question}"\n`);

    const model = genAI.getGenerativeModel({ model: 'embedding-001' });
    const result = await model.embedContent(question);
    const queryEmbedding = result.embedding.values;

    const { data, error } = await supabase.rpc('search_content', {
        query_embedding: queryEmbedding,
        match_threshold: 0.0,
        match_count: 20
    });

    if (error) {
        console.error('에러:', error);
        return;
    }

    console.log(`검색 결과: 총 ${data.length}개\n`);

    // Guides 필터링
    const guides = data.filter(d => d.content_type === 'guides');
    console.log(`📖 Guides: ${guides.length}개\n`);

    if (guides.length > 0) {
        guides.forEach((item, idx) => {
            console.log(`${idx + 1}. ${item.title} (유사도: ${(item.similarity * 100).toFixed(1)}%)`);
            console.log(`   content_id: ${item.content_id}`);
        });
    }

    // 05_결제_시스템_설정 찾기
    const target = data.find(d => d.content_id === '05_결제_시스템_설정');
    const targetRank = data.findIndex(d => d.content_id === '05_결제_시스템_설정') + 1;

    console.log(`\n🔍 "05_결제_시스템_설정" 파일:`);
    if (target) {
        console.log(`   순위: ${targetRank}위`);
        console.log(`   유사도: ${(target.similarity * 100).toFixed(1)}%`);
        console.log(`   제목: ${target.title}`);
    } else {
        console.log(`   ❌ 상위 20개에 없음`);
    }

    console.log(`\n상위 5개:`);
    data.slice(0, 5).forEach((item, idx) => {
        console.log(`${idx + 1}. [${item.content_type}] ${item.title} (${(item.similarity * 100).toFixed(1)}%)`);
    });
}

testTossPayments().catch(console.error);
