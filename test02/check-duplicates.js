const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDuplicates() {
    console.log('Tips 중복 데이터 확인\n');

    // 파일별 청크 수 확인
    const { data, error } = await supabase
        .from('content_embeddings')
        .select('content_id, chunk_index, id')
        .eq('content_type', 'tips')
        .order('content_id', { ascending: true })
        .order('chunk_index', { ascending: true });

    if (error) {
        console.error('에러:', error.message);
        return;
    }

    console.log(`총 Tips 레코드: ${data.length}개\n`);

    // 중복 체크
    const chunks = {};
    data.forEach(row => {
        const key = `${row.content_id}_${row.chunk_index}`;
        if (!chunks[key]) {
            chunks[key] = [];
        }
        chunks[key].push(row.id);
    });

    // 중복된 항목 찾기
    const duplicates = Object.entries(chunks).filter(([key, ids]) => ids.length > 1);

    if (duplicates.length > 0) {
        console.log(`❌ 중복 발견: ${duplicates.length}개\n`);
        duplicates.slice(0, 10).forEach(([key, ids]) => {
            console.log(`${key}: ${ids.length}개 중복`);
            console.log(`   IDs: ${ids.slice(0, 3).join(', ')}${ids.length > 3 ? '...' : ''}`);
        });
    } else {
        console.log('✅ 중복 없음');
    }

    // 고유한 파일 수 확인
    const uniqueFiles = new Set(data.map(row => row.content_id));
    console.log(`\n고유 파일 수: ${uniqueFiles.size}개`);
}

checkDuplicates().catch(console.error);
