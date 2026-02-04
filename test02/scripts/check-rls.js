const { Client } = require('pg');

// Session mode pooler (port 5432)
const client = new Client({
  connectionString: 'postgresql://postgres.zwjmfewyshhwpgwdtrus:DkvOOSG1fm1K17Vc@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkPolicies() {
  await client.connect();
  console.log('✅ PostgreSQL 연결 성공!\n');

  const result = await client.query(`
    SELECT tablename, policyname, cmd
    FROM pg_policies
    WHERE tablename IN ('learning_contents', 'faqs')
    ORDER BY tablename, policyname
  `);

  console.log('=== 현재 적용된 RLS 정책 ===\n');
  console.log('총', result.rows.length, '개 정책\n');
  result.rows.forEach(row => {
    console.log(row.tablename + ' | ' + row.policyname + ' | ' + row.cmd);
  });

  await client.end();
}

checkPolicies().catch(e => {
  console.error('❌ 에러:', e.message);
  client.end();
});
