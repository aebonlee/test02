const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkGuidesEmbedding() {
    console.log('외부 연동 설정 가이드 임베딩 확인\n');
    console.log('═══════════════════════════════════════════════\n');

    // content_type = 'guides' 검색
    const { data, error } = await supabase
        .from('content_embeddings')
        .select('content_id, title, content')
        .eq('content_type', 'guides')
        .limit(10);

    if (error) {
        console.error('에러:', error.message);
        return;
    }

    console.log(`Guides 임베딩: ${data.length}개\n`);

    if (data.length > 0) {
        console.log('상위 10개 샘플:\n');
        data.forEach((item, idx) => {
            console.log(`${idx + 1}. ${item.title}`);
            console.log(`   content_id: ${item.content_id}`);
            console.log(`   내용 미리보기: ${item.content.substring(0, 100)}...`);
            console.log('');
        });
    } else {
        console.log('❌ Guides 임베딩이 없습니다!');
    }

    // 전체 카운트
    const { count } = await supabase
        .from('content_embeddings')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', 'guides');

    console.log(`총 Guides 임베딩 수: ${count}개`);

    // 특정 파일 검색
    console.log('\n특정 가이드 파일 검색:\n');

    const targetFiles = [
        '01_데이터베이스_설정',
        '02_회원인증_설정',
        '03_이메일_시스템_설정',
        '04_배포_도메인_설정',
        '05_결제_시스템_설정'
    ];

    for (const filename of targetFiles) {
        const { data: fileData } = await supabase
            .from('content_embeddings')
            .select('content_id, title')
            .eq('content_type', 'guides')
            .eq('content_id', filename)
            .limit(1);

        if (fileData && fileData.length > 0) {
            console.log(`✅ ${filename}`);
        } else {
            console.log(`❌ ${filename} - 없음`);
        }
    }
}

checkGuidesEmbedding().catch(console.error);
