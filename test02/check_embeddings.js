const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkEmbeddings() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('='.repeat(80));
  console.log('📊 content_embeddings 테이블 확인');
  console.log('='.repeat(80));
  console.log('');

  // 1. 전체 개수
  const { count: total } = await supabase
    .from('content_embeddings')
    .select('*', { count: 'exact', head: true });

  console.log(`전체 임베딩 수: ${total || 0}개`);
  console.log('');

  // 2. content_type별 개수
  const { data: types } = await supabase
    .from('content_embeddings')
    .select('content_type')
    .limit(1000);

  const typeCounts = {};
  types?.forEach(row => {
    typeCounts[row.content_type] = (typeCounts[row.content_type] || 0) + 1;
  });

  console.log('content_type별 분포:');
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}개`);
  });
  console.log('');

  // 3. "실전" 또는 "tip" 관련 검색
  const { data: tips } = await supabase
    .from('content_embeddings')
    .select('content_id, title, content_type')
    .or('content_type.eq.tip,title.ilike.%실전%,title.ilike.%tip%')
    .limit(10);

  console.log('실전 팁스 관련 임베딩:', tips?.length || 0, '개');
  if (tips && tips.length > 0) {
    tips.forEach(tip => {
      console.log(`  - [${tip.content_type}] ${tip.title || tip.content_id}`);
    });
  } else {
    console.log('  ❌ 실전 팁스 임베딩이 하나도 없습니다!');
  }
  console.log('');

  // 4. "Vanilla" 또는 "React" 검색
  const { data: vanilla } = await supabase
    .from('content_embeddings')
    .select('content_id, title, content_type')
    .or('title.ilike.%Vanilla%,title.ilike.%React%,content.ilike.%Vanilla%')
    .limit(5);

  console.log('"Vanilla" 또는 "React" 포함 임베딩:', vanilla?.length || 0, '개');
  if (vanilla && vanilla.length > 0) {
    vanilla.forEach(doc => {
      console.log(`  - [${doc.content_type}] ${doc.title || doc.content_id}`);
    });
  } else {
    console.log('  ❌ Vanilla/React 관련 임베딩이 없습니다!');
  }
  console.log('');

  console.log('='.repeat(80));
  console.log('결론:');
  if (total === 0) {
    console.log('❌ content_embeddings 테이블이 완전히 비어있습니다!');
    console.log('→ 학습 콘텐츠 임베딩 생성 스크립트를 실행해야 합니다.');
  } else if (!tips || tips.length === 0) {
    console.log('⚠️  일부 콘텐츠만 임베딩되어 있고 실전 팁스는 빠져있습니다!');
    console.log('→ 실전 팁스 임베딩 생성이 필요합니다.');
  } else {
    console.log('✅ 임베딩이 존재합니다. RAG 검색 감도 문제일 수 있습니다.');
  }
  console.log('='.repeat(80));
}

checkEmbeddings().catch(console.error);
