// ================================================
// PostgreSQL 직접 연결로 SQL 실행
// ================================================
// 목적: 01_notices_tables.sql을 Supabase PostgreSQL에 직접 실행
// 작성일: 2025-12-01
// ================================================

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// .env 파일 로드
require('dotenv').config();

// Supabase PostgreSQL 연결 정보
const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres.zwjmfewyshhwpgwdtrus:Wpd9UpRmZ0g9A1Pb@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';

async function executeSQLFile() {
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🔌 Supabase PostgreSQL에 연결 중...');
        console.log('   Project: zwjmfewyshhwpgwdtrus');
        console.log('');

        await client.connect();
        console.log('✅ 연결 성공!');
        console.log('');

        // SQL 파일 읽기
        console.log('📂 SQL 파일 읽기 중...');
        const sqlFilePath = path.join(__dirname, '01_notices_tables.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        console.log('✅ SQL 파일 읽기 완료');
        console.log('   파일 크기:', sql.length, 'bytes');
        console.log('');

        // SQL 실행
        console.log('⚙️  SQL 실행 중...');
        console.log('─'.repeat(80));

        const result = await client.query(sql);

        console.log('─'.repeat(80));
        console.log('✅ SQL 실행 완료!');
        console.log('');

        // 테이블 생성 확인
        console.log('🔍 생성된 테이블 확인 중...');

        const checkNotices = await client.query(`
            SELECT COUNT(*) as count FROM notices;
        `);
        console.log('   ✅ notices 테이블: 생성 완료 (레코드 수:', checkNotices.rows[0].count, ')');

        const checkNoticeReads = await client.query(`
            SELECT COUNT(*) as count FROM notice_reads;
        `);
        console.log('   ✅ notice_reads 테이블: 생성 완료 (레코드 수:', checkNoticeReads.rows[0].count, ')');
        console.log('');

        // Mock 데이터 확인
        console.log('📋 Mock 데이터 확인:');
        const mockData = await client.query(`
            SELECT id, title, important, created_at
            FROM notices
            ORDER BY created_at DESC;
        `);

        mockData.rows.forEach((row, index) => {
            const importantMark = row.important ? '🔴' : '  ';
            console.log(`   ${index + 1}. ${importantMark} ${row.title}`);
            console.log(`      작성일: ${row.created_at.toISOString().split('T')[0]}`);
        });
        console.log('');

        console.log('🎉 아젠다 #1 - Supabase 테이블 생성 완료!');
        console.log('');
        console.log('📌 다음 단계:');
        console.log('   1. Admin Dashboard CRUD 구현');
        console.log('   2. Frontend 목록/상세 구현');
        console.log('   3. 테스트 및 검증');

    } catch (error) {
        console.error('');
        console.error('❌ 오류 발생:');
        console.error('');

        if (error.code === '28P01') {
            console.error('🔐 인증 실패: 데이터베이스 비밀번호가 올바르지 않습니다.');
            console.error('');
            console.error('📝 해결 방법:');
            console.error('   1. Supabase Dashboard → Settings → Database');
            console.error('   2. Database password 확인');
            console.error('   3. 환경 변수 설정:');
            console.error('      export SUPABASE_DB_PASSWORD=your_password');
            console.error('   4. 다시 실행:');
            console.error('      node execute_sql_direct.js');
        } else if (error.code === 'ENOTFOUND') {
            console.error('🌐 연결 실패: 네트워크 연결을 확인해주세요.');
        } else if (error.code === '42P07') {
            console.error('⚠️  테이블이 이미 존재합니다.');
            console.error('   DROP TABLE 후 다시 실행하거나');
            console.error('   "CREATE TABLE IF NOT EXISTS" 구문을 사용하세요.');
        } else {
            console.error('오류 코드:', error.code);
            console.error('오류 메시지:', error.message);
            console.error('');
            console.error('상세 정보:', error);
        }

        process.exit(1);
    } finally {
        await client.end();
        console.log('');
        console.log('🔌 연결 종료');
    }
}

// 실행
console.log('');
console.log('═'.repeat(80));
console.log('  Supabase SQL 실행 스크립트');
console.log('  아젠다 #1: 공지사항 테이블 생성');
console.log('═'.repeat(80));
console.log('');

executeSQLFile();
