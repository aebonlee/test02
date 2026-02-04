const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function removeDuplicates() {
    console.log('═══════════════════════════════════════════════');
    console.log('  Tips 중복 데이터 제거');
    console.log('═══════════════════════════════════════════════\n');

    // 모든 Tips 가져오기
    const { data, error } = await supabase
        .from('content_embeddings')
        .select('*')
        .eq('content_type', 'tips')
        .order('content_id', { ascending: true })
        .order('chunk_index', { ascending: true })
        .order('created_at', { ascending: true }); // 오래된 것 먼저

    if (error) {
        console.error('조회 에러:', error.message);
        return;
    }

    console.log(`총 Tips 레코드: ${data.length}개\n`);

    // 중복 찾기 (content_id + chunk_index 기준)
    const seen = new Set();
    const toKeep = [];
    const toDelete = [];

    data.forEach(row => {
        const key = `${row.content_id}_${row.chunk_index}`;
        if (!seen.has(key)) {
            seen.add(key);
            toKeep.push(row.id);
        } else {
            toDelete.push(row.id);
        }
    });

    console.log(`유지할 레코드: ${toKeep.length}개`);
    console.log(`삭제할 레코드: ${toDelete.length}개\n`);

    if (toDelete.length === 0) {
        console.log('✅ 중복 없음!');
        return;
    }

    console.log('중복 데이터 삭제 중...\n');

    // 배치로 삭제 (한 번에 100개씩)
    let deleted = 0;
    for (let i = 0; i < toDelete.length; i += 100) {
        const batch = toDelete.slice(i, i + 100);

        const { error: deleteError } = await supabase
            .from('content_embeddings')
            .delete()
            .in('id', batch);

        if (deleteError) {
            console.error(`배치 ${Math.floor(i / 100) + 1} 삭제 에러:`, deleteError.message);
        } else {
            deleted += batch.length;
            console.log(`진행: ${deleted}/${toDelete.length} 삭제됨`);
        }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('  완료!');
    console.log('═══════════════════════════════════════════════');
    console.log(`삭제된 레코드: ${deleted}개`);
    console.log(`남은 레코드: ${toKeep.length}개`);
    console.log('═══════════════════════════════════════════════\n');
}

removeDuplicates().catch(console.error);
