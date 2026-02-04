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

async function compareGit() {
    console.log('Books vs Tips: "Git" 검색 비교\n');
    console.log('═══════════════════════════════════════════════\n');

    const question = 'Git';
    console.log(`질문: "${question}"\n`);

    const model = genAI.getGenerativeModel({ model: 'embedding-001' });
    const result = await model.embedContent(question);
    const queryEmbedding = result.embedding.values;

    const { data, error } = await supabase.rpc('search_content', {
        query_embedding: queryEmbedding,
        match_threshold: 0.0,
        match_count: 30
    });

    if (error) {
        console.error('에러:', error);
        return;
    }

    const books = data.filter(d => d.content_type === 'books');
    const tips = data.filter(d => d.content_type === 'tips');

    console.log(`📚 Books (상위 5개):`);
    books.slice(0, 5).forEach((item, idx) => {
        console.log(`   ${idx + 1}. ${item.title} (${(item.similarity * 100).toFixed(1)}%)`);
    });

    console.log(`\n📝 Tips (상위 5개):`);
    tips.slice(0, 5).forEach((item, idx) => {
        console.log(`   ${idx + 1}. ${item.title} (${(item.similarity * 100).toFixed(1)}%)`);
    });

    // Git으로_버전_관리하기 찾기
    const gitTip = data.find(d => d.content_id === 'Git으로_버전_관리하기');
    const gitRank = data.findIndex(d => d.content_id === 'Git으로_버전_관리하기') + 1;

    console.log(`\n🔍 "Git으로_버전_관리하기" 파일:`);
    if (gitTip) {
        console.log(`   순위: ${gitRank}위`);
        console.log(`   유사도: ${(gitTip.similarity * 100).toFixed(1)}%`);
    } else {
        console.log(`   ❌ 상위 30개에 없음`);
    }
}

compareGit().catch(console.error);
