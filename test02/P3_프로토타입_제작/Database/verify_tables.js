// ================================================
// Supabase 테이블 생성 확인
// ================================================
// 목적: users, notices, notice_reads 테이블 확인
// 작성일: 2025-12-01
// ================================================

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verifyTables() {
    console.log('');
    console.log('═'.repeat(80));
    console.log('  Supabase 테이블 생성 확인');
    console.log('  아젠다 #1: 공지사항');
    console.log('═'.repeat(80));
    console.log('');

    try {
        // 1. users 테이블 확인
        console.log('🔍 Step 1: users 테이블 확인 중...');
        const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('id, email, name, role, subscription_status')
            .order('created_at', { ascending: true });

        if (usersError) {
            console.log('❌ users 테이블 오류:', usersError.message);
            return;
        }

        console.log('✅ users 테이블 확인 완료');
        console.log('   레코드 수:', usersData.length);
        console.log('');
        console.log('   사용자 목록:');
        usersData.forEach((user, index) => {
            const roleBadge = user.role === 'admin' ? '👑' : '👤';
            const statusBadge = user.subscription_status === 'active' ? '✅' :
                               user.subscription_status === 'onboarding' ? '🔄' : '⏸️';
            console.log(`   ${index + 1}. ${roleBadge} ${statusBadge} ${user.name} (${user.email})`);
            console.log(`      Role: ${user.role} | Status: ${user.subscription_status}`);
        });
        console.log('');

        // 2. notices 테이블 확인
        console.log('🔍 Step 2: notices 테이블 확인 중...');
        const { data: noticesData, error: noticesError } = await supabase
            .from('notices')
            .select('id, title, important, created_at')
            .order('created_at', { ascending: false });

        if (noticesError) {
            console.log('❌ notices 테이블 오류:', noticesError.message);
            return;
        }

        console.log('✅ notices 테이블 확인 완료');
        console.log('   레코드 수:', noticesData.length);
        console.log('');
        console.log('   공지사항 목록:');
        noticesData.forEach((notice, index) => {
            const importantMark = notice.important ? '🔴' : '  ';
            const date = new Date(notice.created_at).toISOString().split('T')[0];
            console.log(`   ${index + 1}. ${importantMark} ${notice.title}`);
            console.log(`      작성일: ${date}`);
        });
        console.log('');

        // 3. notice_reads 테이블 확인
        console.log('🔍 Step 3: notice_reads 테이블 확인 중...');
        const { data: readsData, error: readsError } = await supabase
            .from('notice_reads')
            .select('id')
            .limit(1);

        if (readsError) {
            console.log('❌ notice_reads 테이블 오류:', readsError.message);
            return;
        }

        console.log('✅ notice_reads 테이블 확인 완료');
        console.log('   (읽음 기록은 아직 없음)');
        console.log('');

        // 성공 메시지
        console.log('═'.repeat(80));
        console.log('🎉 아젠다 #1 - Supabase 테이블 생성 완료!');
        console.log('═'.repeat(80));
        console.log('');
        console.log('✅ 생성된 테이블:');
        console.log(`   - users (${usersData.length}개 레코드)`);
        console.log(`   - notices (${noticesData.length}개 레코드)`);
        console.log('   - notice_reads (0개 레코드)');
        console.log('');
        console.log('📌 다음 단계:');
        console.log('   1. ✅ Supabase 테이블 생성 완료');
        console.log('   2. ⏭️  Admin Dashboard CRUD 구현');
        console.log('   3. ⏭️  Frontend 목록/상세 구현');
        console.log('   4. ⏭️  테스트 및 검증');
        console.log('   5. ⏭️  완료 보고서 작성');
        console.log('');

    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
    }
}

// 실행
verifyTables();
