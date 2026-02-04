const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkContent() {
    console.log('임베딩된 실제 내용 확인\n');
    console.log('═══════════════════════════════════════════════\n');

    const files = [
        'Git으로_버전_관리하기',
        '5회_반복_디버깅_기법',
        'Vanilla와_React란_무엇인가'
    ];

    for (const filename of files) {
        console.log(`파일: ${filename}\n`);

        const { data, error } = await supabase
            .from('content_embeddings')
            .select('chunk_index, title, content')
            .eq('content_type', 'tips')
            .eq('content_id', filename)
            .order('chunk_index', { ascending: true });

        if (error) {
            console.error('에러:', error.message);
            continue;
        }

        console.log(`총 청크 수: ${data.length}개\n`);

        data.forEach((chunk, idx) => {
            console.log(`[청크 ${chunk.chunk_index}]`);
            console.log(`내용 길이: ${chunk.content.length}자`);
            console.log(`내용 미리보기:\n${chunk.content.substring(0, 200)}...\n`);

            // 키워드 체크
            const hasGit = chunk.content.toLowerCase().includes('git');
            const hasDebug = chunk.content.includes('디버깅') || chunk.content.includes('버그');
            const hasVanilla = chunk.content.includes('Vanilla') || chunk.content.includes('vanilla');
            const hasReact = chunk.content.includes('React') || chunk.content.includes('react');

            console.log(`키워드: Git(${hasGit}) 디버깅(${hasDebug}) Vanilla(${hasVanilla}) React(${hasReact})`);
            console.log('');
        });

        console.log('───────────────────────────────────────────────\n');
    }
}

checkContent().catch(console.error);
