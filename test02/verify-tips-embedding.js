const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
    console.log('실전 Tips 임베딩 검증 중...\n');

    const { data: tipsData, error: tipsError } = await supabase
        .from('content_embeddings')
        .select('*')
        .eq('content_type', 'tips')
        .limit(5);

    if (tipsError) {
        console.error('에러:', tipsError);
        return;
    }

    console.log(`✅ content_type='tips' 검색 결과: ${tipsData.length}개`);

    if (tipsData.length > 0) {
        console.log('\n처음 3개 샘플:');
        tipsData.slice(0, 3).forEach((item, idx) => {
            console.log(`\n${idx + 1}. ${item.title}`);
            console.log(`   content_id: ${item.content_id}`);
            console.log(`   chunk_index: ${item.chunk_index}`);
            console.log(`   content 미리보기: ${item.content.substring(0, 100)}...`);
        });
    }

    const { count, error: countError } = await supabase
        .from('content_embeddings')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', 'tips');

    if (!countError) {
        console.log(`\n총 Tips 임베딩 수: ${count}개`);
    }
}

verify().catch(console.error);
