// ================================================
// Supabase Management API로 SQL 실행
// ================================================
// 목적: SERVICE_ROLE_KEY를 사용하여 SQL 실행
// 작성일: 2025-12-01
// ================================================

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = 'zwjmfewyshhwpgwdtrus';

async function executeSQL() {
    console.log('');
    console.log('═'.repeat(80));
    console.log('  Supabase Management API - SQL 실행');
    console.log('  아젠다 #1: 공지사항 테이블 생성');
    console.log('═'.repeat(80));
    console.log('');

    try {
        // SQL 파일 읽기
        console.log('📂 Step 1: SQL 파일 읽기 중...');
        const sqlFilePath = path.join(__dirname, '01_notices_tables.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        console.log('✅ SQL 파일 읽기 완료 (' + sql.length + ' bytes)');
        console.log('');

        // Supabase Management API 사용
        console.log('⚙️  Step 2: Supabase Management API 호출 중...');
        console.log('   Project: ' + PROJECT_REF);
        console.log('');

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/exec_sql`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({ query: sql })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            if (errorText.includes('function') && errorText.includes('does not exist')) {
                console.log('⚠️  exec_sql RPC 함수가 존재하지 않습니다.');
                console.log('');
                console.log('━'.repeat(80));
                console.log('📝 해결 방법: Supabase Dashboard SQL Editor 사용 (권장)');
                console.log('━'.repeat(80));
                console.log('');
                console.log('✅ 가장 간단한 방법:');
                console.log('');
                console.log('1️⃣  Supabase Dashboard SQL Editor 접속');
                console.log('   URL: https://supabase.com/dashboard/project/zwjmfewyshhwpgwdtrus/sql');
                console.log('');
                console.log('2️⃣  SQL 복사');
                console.log('   파일 열기: 01_notices_tables.sql');
                console.log('   내용 전체 복사 (Ctrl+A → Ctrl+C)');
                console.log('');
                console.log('3️⃣  SQL Editor에서 실행');
                console.log('   - "New query" 버튼 클릭');
                console.log('   - SQL 붙여넣기 (Ctrl+V)');
                console.log('   - "Run" 버튼 클릭 또는 Ctrl+Enter');
                console.log('');
                console.log('4️⃣  성공 확인');
                console.log('   - "Success. No rows returned" 메시지 확인');
                console.log('   - Table Editor에서 notices, notice_reads 테이블 확인');
                console.log('');
                console.log('━'.repeat(80));
                console.log('');

                // 파일 내용 미리보기
                console.log('💡 SQL 파일 미리보기 (처음 30줄):');
                console.log('─'.repeat(80));
                const lines = sql.split('\n').slice(0, 30);
                lines.forEach((line, index) => {
                    console.log(`${(index + 1).toString().padStart(4, ' ')} │ ${line}`);
                });
                console.log('─'.repeat(80));
                console.log('   ... (총 ' + sql.split('\n').length + '줄)');
                console.log('');
            } else {
                throw new Error(`API Error (${response.status}): ${errorText}`);
            }
        } else {
            const result = await response.json();
            console.log('✅ SQL 실행 성공!');
            console.log('   결과:', result);
            console.log('');
        }

        // 테이블 존재 여부 확인 (읽기는 언제나 가능)
        console.log('🔍 Step 3: 테이블 확인 중...');
        await checkTables();

    } catch (error) {
        console.error('');
        console.error('❌ 오류 발생:', error.message);
        console.error('');

        // 대안 제시
        console.log('━'.repeat(80));
        console.log('📝 권장 해결 방법');
        console.log('━'.repeat(80));
        console.log('');
        console.log('Supabase Dashboard에서 직접 SQL을 실행하는 것이 가장 확실합니다:');
        console.log('');
        console.log('🔗 Dashboard URL:');
        console.log('   https://supabase.com/dashboard/project/zwjmfewyshhwpgwdtrus/sql');
        console.log('');
        console.log('📄 실행할 SQL 파일:');
        console.log('   ' + path.join(__dirname, '01_notices_tables.sql'));
        console.log('');
    }
}

async function checkTables() {
    try {
        // notices 테이블 확인
        const noticesResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/notices?select=id,title,important,created_at&order=created_at.desc`,
            {
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
                }
            }
        );

        if (!noticesResponse.ok) {
            const error = await noticesResponse.json();
            if (error.code === '42P01' || (error.message && error.message.includes('does not exist'))) {
                console.log('❌ notices 테이블이 존재하지 않습니다.');
                console.log('   → Dashboard에서 SQL을 먼저 실행해주세요.');
                console.log('');
                return;
            }
            throw new Error(JSON.stringify(error));
        }

        const noticesData = await noticesResponse.json();
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
        const readsResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/notice_reads?select=id&limit=1`,
            {
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
                }
            }
        );

        if (!readsResponse.ok) {
            const error = await readsResponse.json();
            if (error.code === '42P01' || (error.message && error.message.includes('does not exist'))) {
                console.log('❌ notice_reads 테이블이 존재하지 않습니다.');
                console.log('   → Dashboard에서 SQL을 먼저 실행해주세요.');
                console.log('');
                return;
            }
            throw new Error(JSON.stringify(error));
        }

        console.log('✅ notice_reads 테이블 확인 완료');
        console.log('');

        // 성공 메시지
        console.log('🎉 아젠다 #1 - Supabase 테이블 생성 완료!');
        console.log('');
        console.log('✅ 확인된 테이블:');
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
        console.log('');
    }
}

// 실행
executeSQL();
