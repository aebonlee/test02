/**
 * AI Tutor Schema 실행 스크립트
 * Task: S3D1
 * Date: 2026-01-04
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// 환경 변수 로드
require('dotenv').config({ path: path.join(__dirname, '../P3_프로토타입_제작/Database/.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL이 설정되지 않았습니다.');
    process.exit(1);
}

async function executeSchema() {
    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔄 Supabase 연결 중...');
        const client = await pool.connect();
        console.log('✅ 연결 성공!');

        // SQL 파일 읽기
        const sqlPath = path.join(__dirname, '../S3_개발-2차/Database/ai_tutor_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('\n🔄 스키마 실행 중...');

        // SQL 실행 (개별 문장으로 분리하여 실행)
        const statements = sql
            .split(/;(?=\s*(?:--|CREATE|ALTER|DROP|INSERT|SELECT|$))/gi)
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('--'));

        for (const statement of statements) {
            if (statement.length > 10) {
                try {
                    await client.query(statement);
                    // 첫 20자만 표시
                    const preview = statement.substring(0, 60).replace(/\n/g, ' ');
                    console.log(`  ✅ ${preview}...`);
                } catch (err) {
                    if (err.message.includes('already exists')) {
                        console.log(`  ⚠️ 이미 존재: ${statement.substring(0, 40)}...`);
                    } else {
                        console.error(`  ❌ 오류: ${err.message}`);
                    }
                }
            }
        }

        // 테이블 확인
        console.log('\n📋 생성된 테이블 확인:');
        const tables = await client.query(`
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name IN ('content_embeddings', 'tutor_conversations', 'tutor_messages')
        `);
        tables.rows.forEach(row => {
            console.log(`  ✅ ${row.table_name}`);
        });

        // 함수 확인
        console.log('\n📋 생성된 함수 확인:');
        const functions = await client.query(`
            SELECT proname FROM pg_proc
            WHERE proname = 'search_content'
        `);
        functions.rows.forEach(row => {
            console.log(`  ✅ ${row.proname}()`);
        });

        // pgvector 확인
        console.log('\n📋 pgvector 확장 확인:');
        const extensions = await client.query(`
            SELECT extname FROM pg_extension WHERE extname = 'vector'
        `);
        if (extensions.rows.length > 0) {
            console.log('  ✅ pgvector 활성화됨');
        } else {
            console.log('  ❌ pgvector 미활성화');
        }

        client.release();
        console.log('\n🎉 스키마 실행 완료!');

    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
    } finally {
        await pool.end();
    }
}

executeSchema();
