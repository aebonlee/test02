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

async function testCLITutor() {
    console.log('CLI 관련 AI 튜터 테스트\n');
    console.log('═══════════════════════════════════════════════\n');

    const questions = [
        'CLI가 뭐야?',
        'Supabase CLI로 무엇을 할 수 있어?',
        'Vercel CLI 사용 방법을 알려줘',
        'GitHub CLI로 Pull Request를 만드는 방법은?',
        'Claude Code는 어떻게 CLI 도구를 사용해?'
    ];

    for (const question of questions) {
        console.log(`\n📝 질문: "${question}"\n`);

        // 임베딩 생성
        const model = genAI.getGenerativeModel({ model: 'embedding-001' });
        const result = await model.embedContent(question);
        const queryEmbedding = result.embedding.values;

        // 검색
        const { data, error } = await supabase.rpc('search_content', {
            query_embedding: queryEmbedding,
            match_threshold: 0.25,
            match_count: 5
        });

        if (error) {
            console.error('❌ 검색 에러:', error.message);
            continue;
        }

        console.log(`🔍 검색 결과: ${data.length}개\n`);

        if (data.length === 0) {
            console.log('❌ 관련 문서를 찾을 수 없습니다.\n');
            console.log('─'.repeat(50));
            continue;
        }

        // CLI 관련 문서 필터링
        const cliDocs = data.filter(d =>
            d.content_id === 'CLI란_무엇인가_그리고_주요_CLI_도구들' ||
            d.title.includes('CLI') ||
            d.content.includes('CLI')
        );

        console.log(`📄 CLI 관련 문서: ${cliDocs.length}개\n`);

        // 상위 3개 결과 표시
        data.slice(0, 3).forEach((doc, idx) => {
            const isCLI = doc.content_id === 'CLI란_무엇인가_그리고_주요_CLI_도구들' ? '✅ CLI 문서' : '';
            console.log(`${idx + 1}. [${doc.content_type}] ${doc.title} ${isCLI}`);
            console.log(`   유사도: ${(doc.similarity * 100).toFixed(1)}%`);
            console.log(`   content_id: ${doc.content_id}`);
            console.log(`   내용: ${doc.content.substring(0, 100)}...`);
            console.log('');
        });

        // CLI 문서 순위 확인
        const cliDocIndex = data.findIndex(d => d.content_id === 'CLI란_무엇인가_그리고_주요_CLI_도구들');
        if (cliDocIndex !== -1) {
            console.log(`🎯 CLI 문서 순위: ${cliDocIndex + 1}위 (유사도: ${(data[cliDocIndex].similarity * 100).toFixed(1)}%)`);
        } else {
            console.log(`❌ CLI 문서가 상위 5개에 없습니다.`);
        }

        console.log('\n' + '─'.repeat(50));
    }

    console.log('\n\n✅ 테스트 완료!');
}

testCLITutor().catch(console.error);
