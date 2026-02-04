const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function search() {
    console.log('특정 Tips 파일 검색\n');

    const filenames = [
        'Git으로_버전_관리하기',
        '5회_반복_디버깅_기법',
        'Feature_브랜치로_Vercel_Preview_테스트_후_병합하기',
        'Vanilla와_React란_무엇인가'
    ];

    for (const filename of filenames) {
        const { data, error } = await supabase
            .from('content_embeddings')
            .select('content_id, title, content')
            .eq('content_type', 'tips')
            .eq('content_id', filename)
            .limit(1);

        if (error) {
            console.error(`에러 (${filename}):`, error.message);
            continue;
        }

        if (data.length > 0) {
            console.log(`✅ ${filename}`);
            console.log(`   제목: ${data[0].title}`);
            console.log(`   내용 미리보기: ${data[0].content.substring(0, 100)}...`);
        } else {
            console.log(`❌ ${filename} - 임베딩 없음`);
        }
        console.log('');
    }
}

search().catch(console.error);
