const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU3MTU1MSwiZXhwIjoyMDc5MTQ3NTUxfQ.ZMNl9_lCJQMG8lC0MEQjHrLEuYbCFJYsVsBIzvwnj1s';

async function addSubscriptionColumns() {
    console.log('========================================');
    console.log('Users 테이블에 구독 관리 컬럼 추가');
    console.log('========================================\n');

    // 먼저 현재 users 테이블 스키마 확인
    const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/users?limit=1&select=*`,
        {
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
            }
        }
    );

    const checkData = await checkRes.json();
    if (checkData.length > 0) {
        const existingColumns = Object.keys(checkData[0]);
        console.log('현재 users 테이블 컬럼:');
        console.log(existingColumns.join(', '));
        console.log('');

        const neededColumns = [
            'subscription_paused_at',
            'subscription_pause_end_date',
            'subscription_cancelled_at',
            'data_deletion_scheduled_at'
        ];

        const missingColumns = neededColumns.filter(col => !existingColumns.includes(col));

        if (missingColumns.length === 0) {
            console.log('✅ 모든 구독 관리 컬럼이 이미 존재합니다.');
            return;
        }

        console.log('누락된 컬럼:', missingColumns.join(', '));
        console.log('\n⚠️  REST API로는 ALTER TABLE을 실행할 수 없습니다.');
        console.log('   Supabase SQL Editor에서 다음 SQL을 실행해주세요:');
        console.log('   파일: 23_add_subscription_columns.sql\n');
    }

    // 대신 테스트 사용자 데이터로 기능 테스트
    console.log('========================================');
    console.log('기존 컬럼으로 구독 상태 테스트');
    console.log('========================================\n');

    // TEST0001 사용자의 subscription_status 업데이트 테스트
    const testRes = await fetch(
        `${SUPABASE_URL}/rest/v1/users?user_id=eq.TEST0001`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                subscription_status: 'active',
                updated_at: new Date().toISOString()
            })
        }
    );

    if (testRes.ok) {
        const testData = await testRes.json();
        console.log('✅ TEST0001 구독 상태 업데이트 성공');
        console.log('   subscription_status:', testData[0]?.subscription_status);
    } else {
        const errText = await testRes.text();
        console.log('❌ 업데이트 실패:', errText);
    }

    // 최종 확인
    console.log('\n========================================');
    console.log('현재 테스트 사용자 상태');
    console.log('========================================\n');

    const finalRes = await fetch(
        `${SUPABASE_URL}/rest/v1/users?user_id=in.(TEST0001,TEST0002)&select=user_id,name,subscription_status`,
        {
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
            }
        }
    );

    const finalData = await finalRes.json();
    console.log(JSON.stringify(finalData, null, 2));

    console.log('\n========================================');
    console.log('완료');
    console.log('========================================');
}

addSubscriptionColumns().catch(console.error);
