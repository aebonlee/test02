const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY  // ← ANON_KEY 사용 (프론트엔드와 동일)
);

async function testAdminAccess() {
    console.log('═══════════════════════════════════════════════');
    console.log('  관리자 페이지 접근 테스트');
    console.log('═══════════════════════════════════════════════\n');

    const ADMIN_EMAIL = 'wksun999@gmail.com';

    console.log(`🔑 Admin 이메일: ${ADMIN_EMAIL}\n`);

    // 1. Admin 사용자 정보 확인
    console.log('📊 1. Admin 사용자 정보 확인\n');

    const { data: adminUser, error: adminError } = await supabase
        .from('users')
        .select('id, email, role, name')
        .eq('email', ADMIN_EMAIL)
        .single();

    if (adminError) {
        console.error('❌ Admin 사용자 조회 실패:', adminError.message);
    } else {
        console.log('✅ Admin 사용자 정보:');
        console.log(`   이메일: ${adminUser.email}`);
        console.log(`   이름: ${adminUser.name}`);
        console.log(`   역할: ${adminUser.role}`);
        console.log(`   ID: ${adminUser.id}`);
    }

    console.log('\n' + '─'.repeat(50) + '\n');

    // 2. 회원 목록 조회 테스트 (ANON_KEY로)
    console.log('📊 2. 회원 목록 조회 테스트 (ANON_KEY)\n');

    const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, nickname, name, real_name, role, credit_balance, created_at, builder_id, installation_fee_paid, user_id')
        .order('created_at', { ascending: false });

    if (usersError) {
        console.error('❌ 회원 목록 조회 실패:', usersError.message);
        console.error('   코드:', usersError.code);
        console.error('   힌트:', usersError.hint);
        console.log('\n⚠️  RLS 정책으로 인해 조회 불가능합니다.');
        console.log('   프론트엔드에서는 로그인 후 auth.uid()로 조회해야 합니다.');
    } else {
        console.log(`✅ 회원 목록 조회 성공: ${usersData.length}명\n`);

        // 상위 5명만 표시
        usersData.slice(0, 5).forEach((user, idx) => {
            console.log(`${idx + 1}. ${user.email} (${user.name || '이름 없음'}) - ${user.role}`);
        });

        if (usersData.length > 5) {
            console.log(`   ... 외 ${usersData.length - 5}명`);
        }
    }

    console.log('\n' + '─'.repeat(50) + '\n');

    // 3. SERVICE_ROLE_KEY로 조회 테스트
    console.log('📊 3. 회원 목록 조회 테스트 (SERVICE_ROLE_KEY)\n');

    const supabaseAdmin = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: adminUsersData, error: adminUsersError } = await supabaseAdmin
        .from('users')
        .select('id, email, name, role')
        .order('created_at', { ascending: false })
        .limit(5);

    if (adminUsersError) {
        console.error('❌ 조회 실패:', adminUsersError.message);
    } else {
        console.log(`✅ 조회 성공: ${adminUsersData.length}명\n`);

        adminUsersData.forEach((user, idx) => {
            console.log(`${idx + 1}. ${user.email} (${user.name || '이름 없음'}) - ${user.role}`);
        });
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('  ⚠️  중요 사항');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('프론트엔드 관리자 페이지에서 회원 목록이 안 보인다면:');
    console.log('');
    console.log('1. 브라우저 콘솔 확인');
    console.log('   F12 → Console 탭에서 에러 메시지 확인');
    console.log('');
    console.log('2. 관리자로 로그인 확인');
    console.log('   wksun999@gmail.com으로 로그인했는지 확인');
    console.log('');
    console.log('3. RLS 정책 확인');
    console.log('   Supabase Dashboard → Database → Policies 확인');
    console.log('');
    console.log('4. 페이지 URL 확인');
    console.log('   https://www.ssalworks.com/pages/admin-dashboard.html');
    console.log('');
    console.log('═══════════════════════════════════════════════\n');
}

testAdminAccess().catch(console.error);
