const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkEmbeddings() {
    console.log('현재 임베딩 상태 확인 중...\n');
    
    const { data, error } = await supabase
        .from('content_embeddings')
        .select('content_type')
        .order('content_type');
    
    if (error) {
        console.error('에러:', error);
        return;
    }
    
    const counts = {};
    data.forEach(item => {
        counts[item.content_type] = (counts[item.content_type] || 0) + 1;
    });
    
    console.log('콘텐츠 타입별 임베딩 수:\n');
    Object.entries(counts).sort().forEach(([type, count]) => {
        console.log(`  ${type}: ${count}개`);
    });
    
    console.log(`\n총 임베딩 수: ${data.length}개\n`);
    
    if (!counts['tips']) {
        console.log('❌ 실전 Tips 임베딩이 없습니다!');
    } else {
        console.log(`✅ 실전 Tips 임베딩: ${counts['tips']}개`);
    }
}

checkEmbeddings().catch(console.error);
