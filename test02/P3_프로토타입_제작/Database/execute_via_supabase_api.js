// ================================================
// Supabase REST API를 통한 테이블 생성 우회 방법
// ================================================
// 목적: ANON KEY로 데이터 조회 및 INSERT만 가능
//       DDL(CREATE TABLE)은 Supabase Dashboard에서만 가능
// ================================================

const { createClient } = require('@supabase/supabase-js');
const fs = require('path');

// Supabase 인증 정보
const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzE1NTEsImV4cCI6MjA3OTE0NzU1MX0.AJy34h5VR8QS6WFEcUcBeJJu8I3bBQ6UCk1I84Wb7y4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAndGuide() {
    console.log('');
    console.log('═'.repeat(80));
    console.log('  Supabase 테이블 생성 가이드');
    console.log('  아젠다 #1: 공지사항 테이블');
    console.log('═'.repeat(80));
    console.log('');

    try {
        // 1. 테이블 존재 여부 확인
        console.log('🔍 Step 1: 기존 테이블 확인 중...');
        console.log('');

        const { data: noticesData, error: noticesError } = await supabase
            .from('notices')
            .select('id, title, important, created_at')
            .limit(5);

        if (noticesError) {
            if (noticesError.code === '42P01' || noticesError.message.includes('does not exist')) {
                console.log('❌ notices 테이블이 존재하지 않습니다.');
                console.log('   → Supabase Dashboard에서 테이블을 생성해야 합니다.');
                console.log('');
                showManualInstructions();
                return;
            } else {
                console.log('⚠️  오류 발생:', noticesError.message);
                console.log('');
                showManualInstructions();
                return;
            }
        }

        console.log('✅ notices 테이블이 존재합니다!');
        console.log('');

        // 2. 데이터 확인
        console.log('📋 Step 2: 기존 데이터 확인');
        console.log('─'.repeat(80));

        if (noticesData && noticesData.length > 0) {
            console.log(`   총 ${noticesData.length}개의 공지사항 발견:`);
            console.log('');
            noticesData.forEach((notice, index) => {
                const importantMark = notice.important ? '🔴' : '  ';
                const date = new Date(notice.created_at).toISOString().split('T')[0];
                console.log(`   ${index + 1}. ${importantMark} ${notice.title}`);
                console.log(`      작성일: ${date}`);
            });
        } else {
            console.log('   ⚠️  데이터가 비어있습니다.');
            console.log('   → Mock 데이터를 추가해야 합니다.');
        }
        console.log('');

        // 3. notice_reads 테이블 확인
        console.log('🔍 Step 3: notice_reads 테이블 확인 중...');
        const { data: readsData, error: readsError } = await supabase
            .from('notice_reads')
            .select('id')
            .limit(1);

        if (readsError) {
            if (readsError.code === '42P01' || readsError.message.includes('does not exist')) {
                console.log('❌ notice_reads 테이블이 존재하지 않습니다.');
                console.log('');
                showManualInstructions();
                return;
            }
        } else {
            console.log('✅ notice_reads 테이블이 존재합니다!');
        }
        console.log('');

        // 4. 완료 메시지
        console.log('🎉 아젠다 #1 - Supabase 테이블 확인 완료!');
        console.log('');
        console.log('✅ 확인된 테이블:');
        console.log('   - notices');
        console.log('   - notice_reads');
        console.log('');
        console.log('📌 다음 단계:');
        console.log('   1. Admin Dashboard CRUD 구현');
        console.log('   2. Frontend 목록/상세 구현');
        console.log('   3. 테스트 및 검증');
        console.log('');

    } catch (error) {
        console.error('❌ 예기치 않은 오류:', error.message);
        console.log('');
        showManualInstructions();
    }
}

function showManualInstructions() {
    console.log('━'.repeat(80));
    console.log('📝 Supabase Dashboard에서 SQL 실행 방법');
    console.log('━'.repeat(80));
    console.log('');
    console.log('⚠️  Supabase JS Client(ANON KEY)로는 CREATE TABLE 실행이 불가능합니다.');
    console.log('   반드시 Supabase Dashboard의 SQL Editor를 사용해야 합니다.');
    console.log('');
    console.log('🔗 Step 1: SQL Editor 열기');
    console.log('   URL: https://supabase.com/dashboard/project/zwjmfewyshhwpgwdtrus/sql');
    console.log('');
    console.log('📄 Step 2: SQL 파일 복사');
    console.log('   파일: 01_notices_tables.sql');
    console.log('   경로: C:\\!SSAL_Works_Private\\P3_프로토타입_제작\\Database\\01_notices_tables.sql');
    console.log('');
    console.log('▶️  Step 3: SQL Editor에서 실행');
    console.log('   1. SQL Editor에 SQL 내용 붙여넣기');
    console.log('   2. "Run" 버튼 클릭 또는 Ctrl+Enter');
    console.log('   3. 성공 메시지 확인');
    console.log('');
    console.log('✅ Step 4: 이 스크립트 다시 실행');
    console.log('   명령어: node execute_via_supabase_api.js');
    console.log('   → 테이블 생성 확인 및 Mock 데이터 검증');
    console.log('');
    console.log('━'.repeat(80));
    console.log('');
    console.log('💡 팁: SQL 파일 내용 미리보기');
    console.log('   명령어: cat 01_notices_tables.sql');
    console.log('');
}

// 실행
checkAndGuide();
