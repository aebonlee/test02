const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsers() {
    console.log('═══════════════════════════════════════════════');
    console.log('  SSAL Works 회원가입 현황 확인');
    console.log('═══════════════════════════════════════════════\n');

    // 1. auth.users 테이블 확인 (Supabase Auth)
    console.log('📊 1. Supabase Auth Users (auth.users)\n');

    const { data: authUsers, error: authError, count: authCount } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 100
    });

    if (authError) {
        console.error('❌ Auth Users 조회 실패:', authError.message);
    } else {
        console.log(`총 회원 수: ${authUsers.users.length}명\n`);

        if (authUsers.users.length === 0) {
            console.log('❌ 회원가입자가 한 명도 없습니다!\n');
        } else {
            console.log('회원 목록:\n');
            authUsers.users.forEach((user, idx) => {
                console.log(`${idx + 1}. 이메일: ${user.email}`);
                console.log(`   ID: ${user.id}`);
                console.log(`   가입일: ${user.created_at}`);
                console.log(`   이메일 인증: ${user.email_confirmed_at ? '✅' : '❌'}`);
                console.log(`   Provider: ${user.app_metadata.provider || 'email'}`);
                console.log('');
            });
        }
    }

    console.log('─'.repeat(50) + '\n');

    // 2. public.users 테이블 확인 (커스텀 사용자 데이터)
    console.log('📊 2. Custom Users Table (public.users)\n');

    const { data: customUsers, error: customError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (customError) {
        console.error('❌ Custom Users 조회 실패:', customError.message);
    } else {
        console.log(`총 레코드 수: ${customUsers.length}개\n`);

        if (customUsers.length === 0) {
            console.log('❌ public.users 테이블이 비어있습니다!\n');
        } else {
            console.log('사용자 목록:\n');
            customUsers.forEach((user, idx) => {
                console.log(`${idx + 1}. 이메일: ${user.email}`);
                console.log(`   이름: ${user.name || '(없음)'}`);
                console.log(`   역할: ${user.role || '(없음)'}`);
                console.log(`   가입일: ${user.created_at}`);
                console.log('');
            });
        }
    }

    console.log('─'.repeat(50) + '\n');

    // 3. 테이블 구조 확인
    console.log('📋 3. public.users 테이블 구조 확인\n');

    const { data: tableInfo, error: tableError } = await supabase
        .from('users')
        .select('*')
        .limit(0);

    if (tableError) {
        console.error('❌ 테이블 구조 확인 실패:', tableError.message);
    } else {
        console.log('✅ public.users 테이블 존재 확인됨');
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('  확인 완료!');
    console.log('═══════════════════════════════════════════════\n');
}

checkUsers().catch(console.error);
