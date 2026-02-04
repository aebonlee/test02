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

async function compareBooksAndTips() {
    console.log('═══════════════════════════════════════════════');
    console.log('  Books vs Tips 임베딩 비교');
    console.log('═══════════════════════════════════════════════\n');

    // 1. Books 샘플 조회
    const { data: booksData } = await supabase
        .from('content_embeddings')
        .select('content_id, title, content, embedding')
        .eq('content_type', 'books')
        .limit(1);

    // 2. Tips 샘플 조회
    const { data: tipsData } = await supabase
        .from('content_embeddings')
        .select('content_id, title, content, embedding')
        .eq('content_type', 'tips')
        .limit(1);

    console.log('📚 Books 샘플:');
    if (booksData && booksData.length > 0) {
        const book = booksData[0];
        console.log(`   제목: ${book.title}`);
        console.log(`   embedding 타입: ${typeof book.embedding}`);
        console.log(`   embedding 문자열 길이: ${book.embedding ? book.embedding.length : 'null'}자`);

        // vector 타입은 "[0.1, 0.2, ...]" 형태의 문자열로 반환됨
        if (book.embedding) {
            const vectorMatch = book.embedding.match(/\[([^\]]+)\]/);
            if (vectorMatch) {
                const values = vectorMatch[1].split(',').map(v => parseFloat(v.trim()));
                console.log(`   실제 벡터 차원: ${values.length}`);
                console.log(`   첫 5개 값: ${values.slice(0, 5).join(', ')}`);
            } else {
                console.log(`   벡터 파싱 실패: ${book.embedding.substring(0, 100)}`);
            }
        }
    }

    console.log('\n📝 Tips 샘플:');
    if (tipsData && tipsData.length > 0) {
        const tip = tipsData[0];
        console.log(`   제목: ${tip.title}`);
        console.log(`   embedding 타입: ${typeof tip.embedding}`);
        console.log(`   embedding 문자열 길이: ${tip.embedding ? tip.embedding.length : 'null'}자`);

        if (tip.embedding) {
            const vectorMatch = tip.embedding.match(/\[([^\]]+)\]/);
            if (vectorMatch) {
                const values = vectorMatch[1].split(',').map(v => parseFloat(v.trim()));
                console.log(`   실제 벡터 차원: ${values.length}`);
                console.log(`   첫 5개 값: ${values.slice(0, 5).join(', ')}`);
            } else {
                console.log(`   벡터 파싱 실패: ${tip.embedding.substring(0, 100)}`);
            }
        }
    }

    // 3. 검색 함수 직접 테스트
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  검색 테스트');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const question = 'Supabase 사용법';
    console.log(`질문: "${question}"\n`);

    const model = genAI.getGenerativeModel({ model: 'embedding-001' });
    const result = await model.embedContent(question);
    const queryEmbedding = result.embedding.values;

    console.log(`질문 임베딩 생성: ${queryEmbedding.length}차원\n`);

    // matchThreshold 0으로 설정하고 상위 20개 검색
    const { data: searchData, error } = await supabase.rpc('search_content', {
        query_embedding: queryEmbedding,
        match_threshold: 0.0,
        match_count: 20
    });

    if (error) {
        console.error('검색 에러:', error);
        return;
    }

    console.log(`검색 결과: 총 ${searchData.length}개\n`);

    // Books와 Tips 필터링
    const books = searchData.filter(d => d.content_type === 'books');
    const tips = searchData.filter(d => d.content_type === 'tips');

    console.log(`📚 Books: ${books.length}개`);
    books.slice(0, 3).forEach((item, idx) => {
        console.log(`   ${idx + 1}. ${item.title} (유사도: ${(item.similarity * 100).toFixed(1)}%)`);
    });

    console.log(`\n📝 Tips: ${tips.length}개`);
    if (tips.length > 0) {
        tips.slice(0, 3).forEach((item, idx) => {
            console.log(`   ${idx + 1}. ${item.title} (유사도: ${(item.similarity * 100).toFixed(1)}%)`);
        });
    } else {
        console.log('   ❌ Tips가 상위 20개에 없습니다!');
    }

    console.log('\n전체 상위 20개 타입 분포:');
    const typeCount = {};
    searchData.forEach(item => {
        typeCount[item.content_type] = (typeCount[item.content_type] || 0) + 1;
    });
    Object.entries(typeCount).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}개`);
    });
}

compareBooksAndTips().catch(console.error);
