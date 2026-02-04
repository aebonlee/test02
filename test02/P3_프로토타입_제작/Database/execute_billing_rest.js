const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU3MTU1MSwiZXhwIjoyMDc5MTQ3NTUxfQ.ZMNl9_lCJQMG8lC0MEQjHrLEuYbCFJYsVsBIzvwnj1s';

const sqlFiles = [
    '19-0_sample_test_users.sql',
    '19-1_create_payment_methods.sql',
    '20_create_billing_history.sql',
    '21_billing_rls_dev.sql',
    '22_sample_billing.sql'
];

async function executeSql(sql, fileName) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
}

async function executeViaPostgrest() {
    console.log('Supabase REST API를 통한 SQL 실행을 시도합니다...\n');
    console.log('⚠️  참고: Supabase REST API는 직접 SQL 실행을 지원하지 않습니다.');
    console.log('   대신 각 테이블의 데이터를 확인하고 삽입하는 방식을 사용합니다.\n');

    // 먼저 users 테이블에 테스트 사용자 삽입
    console.log('========================================');
    console.log('1. 테스트 사용자 삽입');
    console.log('========================================');

    const testUsers = [
        {
            user_id: 'TEST0001',
            email: 'test001@example.com',
            name: '테스트사용자1',
            phone: '010-1234-5678',
            company_name: '테스트회사1',
            company_type: 'corporation',
            employee_count: '10-50',
            industry: 'IT/소프트웨어'
        },
        {
            user_id: 'TEST0002',
            email: 'test002@example.com',
            name: '테스트사용자2',
            phone: '010-9876-5432',
            company_name: '테스트회사2',
            company_type: 'startup',
            employee_count: '1-10',
            industry: '제조업'
        }
    ];

    // 기존 테스트 사용자 삭제
    for (const user of testUsers) {
        try {
            const deleteRes = await fetch(
                `${SUPABASE_URL}/rest/v1/users?user_id=eq.${user.user_id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'apikey': SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
                    }
                }
            );
            console.log(`   삭제 시도 ${user.user_id}: ${deleteRes.status}`);
        } catch (e) {
            console.log(`   삭제 실패 ${user.user_id}: ${e.message}`);
        }
    }

    // 테스트 사용자 삽입
    for (const user of testUsers) {
        try {
            const insertRes = await fetch(
                `${SUPABASE_URL}/rest/v1/users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(user)
                }
            );

            if (insertRes.ok || insertRes.status === 201) {
                console.log(`   ✅ ${user.user_id} 삽입 성공`);
            } else {
                const errText = await insertRes.text();
                console.log(`   ❌ ${user.user_id} 삽입 실패: ${errText}`);
            }
        } catch (e) {
            console.log(`   ❌ ${user.user_id} 삽입 오류: ${e.message}`);
        }
    }

    // users 테이블 확인
    console.log('\n   현재 테스트 사용자 확인:');
    const usersRes = await fetch(
        `${SUPABASE_URL}/rest/v1/users?user_id=in.(TEST0001,TEST0002)&select=user_id,name,email`,
        {
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
            }
        }
    );
    const users = await usersRes.json();
    console.log('   ', JSON.stringify(users, null, 2));

    console.log('\n========================================');
    console.log('⚠️  테이블 생성 (CREATE TABLE)은 REST API로 불가능합니다.');
    console.log('   Supabase SQL Editor에서 직접 실행해주세요:');
    console.log('   - 19-1_create_payment_methods.sql');
    console.log('   - 20_create_billing_history.sql');
    console.log('   - 21_billing_rls_dev.sql');
    console.log('========================================\n');

    // payment_methods 테이블 존재 확인
    console.log('========================================');
    console.log('2. payment_methods 테이블 존재 확인');
    console.log('========================================');
    try {
        const pmRes = await fetch(
            `${SUPABASE_URL}/rest/v1/payment_methods?limit=1`,
            {
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
                }
            }
        );
        if (pmRes.ok) {
            console.log('   ✅ payment_methods 테이블 존재함');
        } else {
            const errText = await pmRes.text();
            console.log(`   ❌ payment_methods 테이블 없음: ${errText}`);
        }
    } catch (e) {
        console.log(`   ❌ 확인 실패: ${e.message}`);
    }

    // billing_history 테이블 존재 확인
    console.log('\n========================================');
    console.log('3. billing_history 테이블 존재 확인');
    console.log('========================================');
    try {
        const bhRes = await fetch(
            `${SUPABASE_URL}/rest/v1/billing_history?limit=1`,
            {
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
                }
            }
        );
        if (bhRes.ok) {
            console.log('   ✅ billing_history 테이블 존재함');
        } else {
            const errText = await bhRes.text();
            console.log(`   ❌ billing_history 테이블 없음: ${errText}`);
        }
    } catch (e) {
        console.log(`   ❌ 확인 실패: ${e.message}`);
    }

    console.log('\n========================================');
    console.log('완료');
    console.log('========================================');
}

executeViaPostgrest().catch(console.error);
