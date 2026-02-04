const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspect() {
    console.log('Tips 임베딩 상세 검사\n');

    const { data, error } = await supabase
        .from('content_embeddings')
        .select('content_id, title, content, embedding')
        .eq('content_type', 'tips')
        .limit(5);

    if (error) {
        console.error('에러:', error);
        return;
    }

    console.log(`Tips 임베딩 샘플 (5개):\n`);

    data.forEach((item, idx) => {
        console.log(`${idx + 1}. ${item.title}`);
        console.log(`   content_id: ${item.content_id}`);
        console.log(`   content 길이: ${item.content.length}자`);
        console.log(`   embedding 차원: ${item.embedding ? item.embedding.length : 'null'}`);
        console.log(`   content 미리보기: ${item.content.substring(0, 100)}...`);
        console.log('');
    });

    const { count } = await supabase
        .from('content_embeddings')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', 'tips');

    console.log(`총 Tips 임베딩 수: ${count}개`);
}

inspect().catch(console.error);
