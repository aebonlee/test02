// ================================================
// SERVICE ROLE KEY로 SQL 실행
// ================================================
// 목적: CREATE TABLE 등 관리자 권한 작업 수행
// 작성일: 2025-12-01
// ================================================

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// .env에서 인증 정보 로드
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// SERVICE ROLE KEY로 Supabase 클라이언트 생성 (RLS 우회 가능)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function executeSQL() {
    console.log('');
    console.log('═'.repeat(80));
    console.log('  Supabase SQL 실행 스크립트');
    console.log('  아젠다 #1: 공지사항 테이블 생성');
    console.log('═'.repeat(80));
    console.log('');

    try {
        // 1. SQL 파일 읽기
        console.log('📂 Step 1: SQL 파일 읽기 중...');
        const sqlFilePath = path.join(__dirname, '01_notices_tables.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        console.log('✅ SQL 파일 읽기 완료');
        console.log('   파일 크기:', sql.length, 'bytes');
        console.log('');

        // 2. Supabase REST API로 SQL 실행 시도
        console.log('⚙️  Step 2: SQL 실행 중...');
        console.log('   방법: Supabase REST API + SERVICE_ROLE_KEY');
        console.log('');

        // RPC 함수 사용 (만약 있다면)
        const { data, error } = await supabase.rpc('exec_sql', {
            query: sql
        });

        if (error) {
            if (error.message.includes('function') && error.message.includes('does not exist')) {
                console.log('⚠️  exec_sql RPC 함수가 존재하지 않습니다.');
                console.log('');
                console.log('━'.repeat(80));
                console.log('📝 대안: Supabase Dashboard SQL Editor 사용');
                console.log('━'.repeat(80));
                console.log('');
                console.log('⚠️  Supabase REST API로는 DDL(CREATE TABLE) 직접 실행이 불가능합니다.');
                console.log('   반드시 다음 중 하나의 방법을 사용해야 합니다:');
                console.log('');
                console.log('🔗 방법 1: Dashboard SQL Editor (권장)');
                console.log('   1. URL 접속:');
                console.log('      https://supabase.com/dashboard/project/zwjmfewyshhwpgwdtrus/sql');
                console.log('');
                console.log('   2. 새 쿼리 만들기:');
                console.log('      - "New query" 클릭');
                console.log('');
                console.log('   3. SQL 복사 & 붙여넣기:');
                console.log('      - 파일: 01_notices_tables.sql');
                console.log('      - 전체 내용 복사');
                console.log('      - SQL Editor에 붙여넣기');
                console.log('');
                console.log('   4. 실행:');
                console.log('      - "Run" 버튼 클릭 또는 Ctrl+Enter');
                console.log('');
                console.log('   5. 결과 확인:');
                console.log('      - Success 메시지 확인');
                console.log('      - Tables 메뉴에서 notices, notice_reads 테이블 확인');
                console.log('');
                console.log('🔗 방법 2: PostgreSQL 직접 연결');
                console.log('   1. Database 비밀번호 필요');
                console.log('   2. psql 또는 pg 라이브러리 사용');
                console.log('');
                console.log('━'.repeat(80));
                console.log('');
                console.log('💡 SQL 파일 미리보기:');
                console.log('   cat 01_notices_tables.sql | head -50');
                console.log('');

                // 테이블 존재 여부만 확인
                await checkTables();
                return;
            }

            throw error;
        }

        console.log('✅ SQL 실행 완료!');
        console.log('');

        // 3. 결과 확인
        await checkTables();

    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
        console.error('');
        console.error('상세 정보:', error);
        process.exit(1);
    }
}

async function checkTables() {
    console.log('🔍 Step 3: 테이블 생성 확인 중...');
    console.log('');

    try {
        // notices 테이블 확인
        const { data: noticesData, error: noticesError } = await supabase
            .from('notices')
            .select('id, title, important, created_at')
            .order('created_at', { ascending: false });

        if (noticesError) {
            if (noticesError.code === '42P01' || noticesError.message.includes('does not exist')) {
                console.log('❌ notices 테이블이 존재하지 않습니다.');
                console.log('   → Dashboard에서 SQL을 실행해주세요.');
                console.log('');
                return;
            }
            throw noticesError;
        }

        console.log('✅ notices 테이블 확인 완료');
        console.log('   레코드 수:', noticesData.length);
        console.log('');

        if (noticesData.length > 0) {
            console.log('📋 Mock 데이터:');
            noticesData.forEach((notice, index) => {
                const importantMark = notice.important ? '🔴' : '  ';
                const date = new Date(notice.created_at).toISOString().split('T')[0];
                console.log(`   ${index + 1}. ${importantMark} ${notice.title}`);
                console.log(`      작성일: ${date}`);
            });
            console.log('');
        }

        // notice_reads 테이블 확인
        const { data: readsData, error: readsError } = await supabase
            .from('notice_reads')
            .select('id')
            .limit(1);

        if (readsError) {
            if (readsError.code === '42P01' || readsError.message.includes('does not exist')) {
                console.log('❌ notice_reads 테이블이 존재하지 않습니다.');
                console.log('   → Dashboard에서 SQL을 실행해주세요.');
                console.log('');
                return;
            }
            throw readsError;
        }

        console.log('✅ notice_reads 테이블 확인 완료');
        console.log('');

        // 성공 메시지
        console.log('🎉 아젠다 #1 - Supabase 테이블 생성 완료!');
        console.log('');
        console.log('✅ 생성된 테이블:');
        console.log('   - notices (공지사항)');
        console.log('   - notice_reads (읽음 기록)');
        console.log('');
        console.log('📌 다음 단계:');
        console.log('   1. Admin Dashboard CRUD 구현');
        console.log('   2. Frontend 목록/상세 구현');
        console.log('   3. 테스트 및 검증');
        console.log('');

    } catch (error) {
        console.error('❌ 테이블 확인 중 오류:', error.message);
    }
}

// 실행
executeSQL();
