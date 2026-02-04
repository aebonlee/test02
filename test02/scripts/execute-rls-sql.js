/**
 * execute-rls-sql.js
 *
 * project_phase_progress 테이블에 RLS 정책 적용
 * 일회성 실행 스크립트
 */

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'P3_프로토타입_제작', 'Database', '.env') });

// Supabase Pooler Session Mode (DDL 지원)
const SUPABASE_REF = 'zwjmfewyshhwpgwdtrus';
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!DB_PASSWORD) {
    console.error('❌ SUPABASE_DB_PASSWORD 환경변수가 설정되지 않았습니다.');
    process.exit(1);
}

// Session Mode (포트 6543) - DDL 명령 지원
const DATABASE_URL = `postgresql://postgres.${SUPABASE_REF}:${DB_PASSWORD}@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`;

// RLS 정책 SQL
const RLS_SQL = `
-- 1. RLS 활성화
ALTER TABLE project_phase_progress ENABLE ROW LEVEL SECURITY;

-- 2. 기존 정책 삭제 (있으면)
DROP POLICY IF EXISTS "Allow public read access" ON project_phase_progress;
DROP POLICY IF EXISTS "Allow public insert access" ON project_phase_progress;
DROP POLICY IF EXISTS "Allow public update access" ON project_phase_progress;
DROP POLICY IF EXISTS "Restrict delete access" ON project_phase_progress;

-- 3. SELECT 정책
CREATE POLICY "Allow public read access"
ON project_phase_progress
FOR SELECT
TO anon, authenticated
USING (true);

-- 4. INSERT 정책
CREATE POLICY "Allow public insert access"
ON project_phase_progress
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. UPDATE 정책
CREATE POLICY "Allow public update access"
ON project_phase_progress
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 6. DELETE 정책 (authenticated만)
CREATE POLICY "Restrict delete access"
ON project_phase_progress
FOR DELETE
TO authenticated
USING (true);
`;

async function executeRLS() {
    console.log('🔐 RLS 정책 적용 시작...\n');

    const client = new Client({
        host: 'aws-1-ap-southeast-1.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        user: `postgres.${SUPABASE_REF}`,
        password: DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ 데이터베이스 연결 성공');

        // SQL 실행
        await client.query(RLS_SQL);
        console.log('✅ RLS 정책 적용 완료!');

        // 확인
        const result = await client.query(`
            SELECT
                schemaname, tablename, policyname, permissive, roles, cmd, qual
            FROM pg_policies
            WHERE tablename = 'project_phase_progress'
        `);

        console.log('\n📋 적용된 RLS 정책:');
        console.log('─'.repeat(60));
        result.rows.forEach(policy => {
            console.log(`  ${policy.policyname}`);
            console.log(`    - 명령: ${policy.cmd}`);
            console.log(`    - 대상: ${policy.roles}`);
        });
        console.log('─'.repeat(60));

    } catch (err) {
        console.error('❌ 오류 발생:', err.message);
        process.exit(1);
    } finally {
        await client.end();
        console.log('\n🔌 데이터베이스 연결 종료');
    }
}

executeRLS();
