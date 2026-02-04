const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU3MTU1MSwiZXhwIjoyMDc5MTQ3NTUxfQ.ZMNl9_lCJQMG8lC0MEQjHrLEuYbCFJYsVsBIzvwnj1s';

async function insertData() {
    console.log('========================================');
    console.log('1. 테스트 사용자 삽입');
    console.log('========================================\n');

    // 기존 테스트 사용자 삭제
    for (const userId of ['TEST0001', 'TEST0002']) {
        const deleteRes = await fetch(
            `${SUPABASE_URL}/rest/v1/users?user_id=eq.${userId}`,
            {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
                }
            }
        );
        console.log(`   기존 ${userId} 삭제: ${deleteRes.status}`);
    }

    // 새 테스트 사용자 삽입 (올바른 스키마)
    const testUsers = [
        {
            user_id: 'TEST0001',
            email: 'test001@example.com',
            name: '테스트사용자1',
            nickname: '테스트1',
            real_name: '김테스트',
            phone: '010-1234-5678',
            subscription_status: 'active',
            is_onboarding_completed: true,
            role: 'user',
            installation_fee_paid: true,
            credit_balance: 50000,
            marketing_agreed: true
        },
        {
            user_id: 'TEST0002',
            email: 'test002@example.com',
            name: '테스트사용자2',
            nickname: '테스트2',
            real_name: '이테스트',
            phone: '010-9876-5432',
            subscription_status: 'active',
            is_onboarding_completed: true,
            role: 'user',
            installation_fee_paid: true,
            credit_balance: 30000,
            marketing_agreed: false
        }
    ];

    for (const user of testUsers) {
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
    }

    console.log('\n========================================');
    console.log('2. 결제 수단 삽입');
    console.log('========================================\n');

    // 기존 결제 수단 삭제
    for (const userId of ['TEST0001', 'TEST0002']) {
        await fetch(
            `${SUPABASE_URL}/rest/v1/payment_methods?user_id=eq.${userId}`,
            {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
                }
            }
        );
    }

    const paymentMethods = [
        {
            user_id: 'TEST0001',
            payment_type: 'card',
            card_last4: '1234',
            card_company: '신한카드',
            is_default: true,
            toss_billing_key: 'test_billing_key_001'
        },
        {
            user_id: 'TEST0001',
            payment_type: 'bank',
            bank_name: '하나은행',
            account_last4: '5678',
            is_default: false
        },
        {
            user_id: 'TEST0002',
            payment_type: 'card',
            card_last4: '9012',
            card_company: '삼성카드',
            is_default: true,
            toss_billing_key: 'test_billing_key_002'
        }
    ];

    for (const pm of paymentMethods) {
        const insertRes = await fetch(
            `${SUPABASE_URL}/rest/v1/payment_methods`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(pm)
            }
        );

        if (insertRes.ok || insertRes.status === 201) {
            console.log(`   ✅ ${pm.user_id} ${pm.payment_type} 삽입 성공`);
        } else {
            const errText = await insertRes.text();
            console.log(`   ❌ 삽입 실패: ${errText}`);
        }
    }

    console.log('\n========================================');
    console.log('3. 결제 내역 삽입');
    console.log('========================================\n');

    // 기존 결제 내역 삭제
    for (const userId of ['TEST0001', 'TEST0002']) {
        await fetch(
            `${SUPABASE_URL}/rest/v1/billing_history?user_id=eq.${userId}`,
            {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
                }
            }
        );
    }

    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);

    const billingHistory = [
        {
            user_id: 'TEST0001',
            billing_type: 'platform_fee',
            amount: 50000,
            status: 'paid',
            billing_date: threeMonthsAgo.toISOString(),
            payment_method: '신한카드 ****-1234',
            receipt_url: 'https://receipt.example.com/sample001'
        },
        {
            user_id: 'TEST0001',
            billing_type: 'platform_fee',
            amount: 50000,
            status: 'paid',
            billing_date: twoMonthsAgo.toISOString(),
            payment_method: '신한카드 ****-1234',
            receipt_url: 'https://receipt.example.com/sample002'
        },
        {
            user_id: 'TEST0001',
            billing_type: 'platform_fee',
            amount: 50000,
            status: 'paid',
            billing_date: oneMonthAgo.toISOString(),
            payment_method: '신한카드 ****-1234',
            receipt_url: 'https://receipt.example.com/sample003'
        },
        {
            user_id: 'TEST0001',
            billing_type: 'platform_fee',
            amount: 50000,
            status: 'failed',
            billing_date: threeDaysAgo.toISOString(),
            payment_method: '신한카드 ****-1234',
            failure_reason: '잔액 부족',
            retry_count: 2
        },
        {
            user_id: 'TEST0001',
            billing_type: 'credit_purchase',
            amount: 10000,
            status: 'paid',
            billing_date: fifteenDaysAgo.toISOString(),
            payment_method: '신한카드 ****-1234',
            receipt_url: 'https://receipt.example.com/credit001'
        },
        {
            user_id: 'TEST0002',
            billing_type: 'platform_fee',
            amount: 50000,
            status: 'paid',
            billing_date: twoMonthsAgo.toISOString(),
            payment_method: '삼성카드 ****-9012',
            receipt_url: 'https://receipt.example.com/sample004'
        },
        {
            user_id: 'TEST0002',
            billing_type: 'platform_fee',
            amount: 50000,
            status: 'refunded',
            billing_date: oneMonthAgo.toISOString(),
            payment_method: '삼성카드 ****-9012',
            refund_amount: 50000,
            refund_date: twentyDaysAgo.toISOString(),
            refund_reason: '서비스 불만족'
        }
    ];

    for (const bh of billingHistory) {
        const insertRes = await fetch(
            `${SUPABASE_URL}/rest/v1/billing_history`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(bh)
            }
        );

        if (insertRes.ok || insertRes.status === 201) {
            console.log(`   ✅ ${bh.user_id} ${bh.billing_type} ${bh.status} 삽입 성공`);
        } else {
            const errText = await insertRes.text();
            console.log(`   ❌ 삽입 실패: ${errText}`);
        }
    }

    console.log('\n========================================');
    console.log('4. 결과 확인');
    console.log('========================================\n');

    // 결과 확인
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
    console.log('테스트 사용자:', JSON.stringify(users, null, 2));

    const pmRes = await fetch(
        `${SUPABASE_URL}/rest/v1/payment_methods?user_id=in.(TEST0001,TEST0002)&select=user_id,payment_type,card_company,bank_name,is_default`,
        {
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
            }
        }
    );
    const pms = await pmRes.json();
    console.log('\n결제 수단:', JSON.stringify(pms, null, 2));

    const bhRes = await fetch(
        `${SUPABASE_URL}/rest/v1/billing_history?user_id=in.(TEST0001,TEST0002)&select=user_id,billing_type,amount,status,billing_date&order=billing_date.desc`,
        {
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
            }
        }
    );
    const bhs = await bhRes.json();
    console.log('\n결제 내역:', JSON.stringify(bhs, null, 2));

    console.log('\n========================================');
    console.log('✅ 완료!');
    console.log('========================================');
}

insertData().catch(console.error);
