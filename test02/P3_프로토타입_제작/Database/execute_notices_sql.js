// ================================================
// Supabase SQL 실행 스크립트
// ================================================
// 목적: 01_notices_tables.sql을 Supabase에 실행
// 작성일: 2025-12-01
// ================================================

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 인증 정보
const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzE1NTEsImV4cCI6MjA3OTE0NzU1MX0.AJy34h5VR8QS6WFEcUcBeJJu8I3bBQ6UCk1I84Wb7y4';

// Supabase 클라이언트 생성
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function executeSQLFile() {
    try {
        console.log('📂 SQL 파일 읽기 중...');

        // SQL 파일 읽기
        const sqlFilePath = path.join(__dirname, '01_notices_tables.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        console.log('✅ SQL 파일 읽기 완료');
        console.log('📝 SQL 길이:', sql.length, 'bytes');
        console.log('');
        console.log('⚠️  주의: Supabase JS Client로는 DDL(CREATE TABLE) 실행이 제한됩니다.');
        console.log('⚠️  Supabase Dashboard의 SQL Editor에서 직접 실행해야 합니다.');
        console.log('');
        console.log('📋 실행할 SQL 내용:');
        console.log('─'.repeat(80));
        console.log(sql);
        console.log('─'.repeat(80));
        console.log('');
        console.log('🔗 Supabase Dashboard SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/zwjmfewyshhwpgwdtrus/sql');
        console.log('');
        console.log('📌 실행 순서:');
        console.log('   1. 위 URL로 이동');
        console.log('   2. 위의 SQL 내용 복사');
        console.log('   3. SQL Editor에 붙여넣기');
        console.log('   4. "Run" 버튼 클릭');
        console.log('');

        // 테이블 존재 여부 확인 (읽기는 가능)
        console.log('🔍 기존 테이블 확인 중...');
        const { data: tables, error } = await supabase
            .from('notices')
            .select('*')
            .limit(1);

        if (error) {
            if (error.code === '42P01') {
                console.log('❌ notices 테이블이 아직 생성되지 않았습니다.');
                console.log('   → Supabase Dashboard에서 SQL을 실행해주세요.');
            } else {
                console.log('⚠️  테이블 확인 중 오류:', error.message);
            }
        } else {
            console.log('✅ notices 테이블이 이미 존재합니다.');
            console.log('   데이터 개수:', tables.length);
        }

    } catch (error) {
        console.error('❌ 오류 발생:', error);
        process.exit(1);
    }
}

// 실행
executeSQLFile();
