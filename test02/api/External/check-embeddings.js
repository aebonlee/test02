/**
 * 임베딩 테이블 확인용 임시 API
 */

const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // 1. 전체 개수
    const { count: total } = await supabase
      .from('content_embeddings')
      .select('*', { count: 'exact', head: true });

    // 2. content_type별 개수
    const { data: allRows } = await supabase
      .from('content_embeddings')
      .select('content_type')
      .limit(1000);

    const typeCounts = {};
    allRows?.forEach(row => {
      typeCounts[row.content_type] = (typeCounts[row.content_type] || 0) + 1;
    });

    // 3. 실전 팁스 관련 검색
    const { data: tips } = await supabase
      .from('content_embeddings')
      .select('content_id, title, content_type')
      .or('content_type.eq.tip,title.ilike.%실전%,title.ilike.%Tip%')
      .limit(10);

    // 4. Vanilla/React 검색
    const { data: vanilla } = await supabase
      .from('content_embeddings')
      .select('content_id, title, content_type')
      .or('title.ilike.%Vanilla%,title.ilike.%React%')
      .limit(5);

    res.status(200).json({
      total: total || 0,
      typeDistribution: typeCounts,
      tipsCount: tips?.length || 0,
      tipsData: tips || [],
      vanillaReactCount: vanilla?.length || 0,
      vanillaReactData: vanilla || [],
      conclusion:
        total === 0 ? '❌ 테이블이 완전히 비어있습니다!' :
        (!tips || tips.length === 0) ? '⚠️ 실전 팁스가 임베딩되지 않았습니다!' :
        '✅ 임베딩이 존재합니다.'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
