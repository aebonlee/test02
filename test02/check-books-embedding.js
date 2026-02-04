const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    console.log('Books 임베딩 차원 확인\n');

    const { data, error } = await supabase
        .from('content_embeddings')
        .select('content_id, title, embedding')
        .eq('content_type', 'books')
        .limit(3);

    if (error) {
        console.error('에러:', error);
        return;
    }

    data.forEach((item, idx) => {
        console.log(`${idx + 1}. ${item.title}`);
        console.log(`   embedding 차원: ${item.embedding ? item.embedding.length : 'null'}`);
        console.log('');
    });
}

check().catch(console.error);
