const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU3MTU1MSwiZXhwIjoyMDc5MTQ3NTUxfQ.ZMNl9_lCJQMG8lC0MEQjHrLEuYbCFJYsVsBIzvwnj1s';

async function executeAllCreditTables() {
    console.log('========================================');
    console.log('AI 크레딧 시스템 테이블 생성 및 데이터 삽입');
    console.log('========================================\n');

    // =============================================
    // 1. AI 서비스 가격 테이블 생성 확인 및 데이터 삽입
    // =============================================
    console.log('1. AI 서비스 가격 데이터 삽입...');

    const pricingData = [
        { service_name: 'ChatGPT', price_per_use: 100, api_cost: 80, margin_percent: 25, description: 'GPT-4 기반 - 코드 작성, 기술 문서', is_active: true },
        { service_name: 'Gemini', price_per_use: 80, api_cost: 65, margin_percent: 23, description: 'Gemini 2.5 Pro - 코드 리뷰, 아키텍처', is_active: true },
        { service_name: 'Perplexity', price_per_use: 50, api_cost: 40, margin_percent: 25, description: '실시간 검색 - 최신 정보 조회', is_active: true }
    ];

    // 먼저 기존 데이터 삭제
    await fetch(`${SUPABASE_URL}/rest/v1/ai_service_pricing?service_name=in.(ChatGPT,Gemini,Perplexity)`, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
    });

    const pricingRes = await fetch(`${SUPABASE_URL}/rest/v1/ai_service_pricing`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(pricingData)
    });

    if (pricingRes.ok) {
        const data = await pricingRes.json();
        console.log(`✅ AI 서비스 가격 데이터 ${data.length}개 삽입 완료`);
        data.forEach(p => console.log(`   - ${p.service_name}: ${p.price_per_use}원`));
    } else {
        const errText = await pricingRes.text();
        console.log('❌ AI 서비스 가격 삽입 실패:', errText);

        // 테이블이 없으면 테이블 생성이 필요함을 안내
        if (errText.includes('relation') && errText.includes('does not exist')) {
            console.log('\n⚠️ ai_service_pricing 테이블이 없습니다.');
            console.log('   Supabase SQL Editor에서 24_create_credit_tables.sql 실행 필요');
            return;
        }
    }

    // =============================================
    // 2. 크레딧 거래 내역 삽입
    // =============================================
    console.log('\n2. 크레딧 거래 내역 삽입...');

    // 기존 테스트 데이터 삭제
    await fetch(`${SUPABASE_URL}/rest/v1/credit_transactions?user_id=in.(TEST0001,TEST0002)`, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
    });

    const now = new Date();
    const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

    const creditTransactions = [
        // TEST0001
        { user_id: 'TEST0001', type: 'charge', amount: 50000, balance_after: 50000, description: '첫 충전 - 카드 결제', created_at: daysAgo(30) },
        { user_id: 'TEST0001', type: 'spend', amount: -100, balance_after: 49900, description: 'ChatGPT 사용', related_service: 'ChatGPT', created_at: daysAgo(25) },
        { user_id: 'TEST0001', type: 'spend', amount: -80, balance_after: 49820, description: 'Gemini 사용', related_service: 'Gemini', created_at: daysAgo(20) },
        { user_id: 'TEST0001', type: 'charge', amount: 10000, balance_after: 59820, description: '추가 충전 - 카드 결제', created_at: daysAgo(15) },
        { user_id: 'TEST0001', type: 'bonus', amount: 5000, balance_after: 64820, description: '관리자 지급: 이벤트 당첨', created_at: daysAgo(10) },
        { user_id: 'TEST0001', type: 'spend', amount: -50, balance_after: 64770, description: 'Perplexity 사용', related_service: 'Perplexity', created_at: daysAgo(7) },
        { user_id: 'TEST0001', type: 'spend', amount: -50, balance_after: 64720, description: 'Perplexity 사용', related_service: 'Perplexity', created_at: daysAgo(5) },
        { user_id: 'TEST0001', type: 'spend', amount: -100, balance_after: 64620, description: 'ChatGPT 사용', related_service: 'ChatGPT', created_at: daysAgo(3) },
        { user_id: 'TEST0001', type: 'spend', amount: -80, balance_after: 64540, description: 'Gemini 사용', related_service: 'Gemini', created_at: daysAgo(1) },
        // TEST0002
        { user_id: 'TEST0002', type: 'charge', amount: 30000, balance_after: 30000, description: '첫 충전 - 카드 결제', created_at: daysAgo(20) },
        { user_id: 'TEST0002', type: 'spend', amount: -100, balance_after: 29900, description: 'ChatGPT 사용', related_service: 'ChatGPT', created_at: daysAgo(18) },
        { user_id: 'TEST0002', type: 'spend', amount: -100, balance_after: 29800, description: 'ChatGPT 사용', related_service: 'ChatGPT', created_at: daysAgo(15) },
        { user_id: 'TEST0002', type: 'spend', amount: -50, balance_after: 29750, description: 'Perplexity 사용', related_service: 'Perplexity', created_at: daysAgo(10) },
        { user_id: 'TEST0002', type: 'refund', amount: 5000, balance_after: 34750, description: 'API 오류로 인한 환불', created_at: daysAgo(8) }
    ];

    const transRes = await fetch(`${SUPABASE_URL}/rest/v1/credit_transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(creditTransactions)
    });

    if (transRes.ok) {
        const data = await transRes.json();
        console.log(`✅ 크레딧 거래 내역 ${data.length}개 삽입 완료`);
        console.log(`   - TEST0001: ${data.filter(d => d.user_id === 'TEST0001').length}개`);
        console.log(`   - TEST0002: ${data.filter(d => d.user_id === 'TEST0002').length}개`);
    } else {
        const errText = await transRes.text();
        console.log('❌ 크레딧 거래 내역 삽입 실패:', errText);

        if (errText.includes('relation') && errText.includes('does not exist')) {
            console.log('\n⚠️ credit_transactions 테이블이 없습니다.');
            console.log('   Supabase SQL Editor에서 24_create_credit_tables.sql 실행 필요');
            return;
        }
    }

    // =============================================
    // 3. AI 사용 로그 삽입
    // =============================================
    console.log('\n3. AI 사용 로그 삽입...');

    // 기존 테스트 데이터 삭제
    await fetch(`${SUPABASE_URL}/rest/v1/ai_usage_log?user_id=in.(TEST0001,TEST0002)`, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
    });

    const usageLogs = [
        // TEST0001
        { user_id: 'TEST0001', service_name: 'ChatGPT', prompt: 'React 컴포넌트 작성 방법 알려줘', response: 'React 컴포넌트는 함수형과 클래스형으로 작성할 수 있습니다...', tokens_used: 500, cost: 100, response_time_ms: 2500, created_at: daysAgo(25) },
        { user_id: 'TEST0001', service_name: 'Gemini', prompt: '이 코드 리뷰해줘: function sum(a,b){return a+b}', response: '코드 리뷰 결과: 1. 화살표 함수로 변경 권장...', tokens_used: 300, cost: 80, response_time_ms: 1800, created_at: daysAgo(20) },
        { user_id: 'TEST0001', service_name: 'Perplexity', prompt: '2025년 최신 JavaScript 트렌드', response: '2025년 JavaScript 트렌드: 1. Server Components...', tokens_used: 200, cost: 50, response_time_ms: 3000, created_at: daysAgo(7) },
        { user_id: 'TEST0001', service_name: 'Perplexity', prompt: 'Next.js 15 새로운 기능', response: 'Next.js 15의 새로운 기능: 1. Turbopack 안정화...', tokens_used: 250, cost: 50, response_time_ms: 2800, created_at: daysAgo(5) },
        { user_id: 'TEST0001', service_name: 'ChatGPT', prompt: 'TypeScript 제네릭 설명해줘', response: '제네릭(Generics)은 타입을 매개변수화하는 기능입니다...', tokens_used: 450, cost: 100, response_time_ms: 2200, created_at: daysAgo(3) },
        { user_id: 'TEST0001', service_name: 'Gemini', prompt: 'Supabase RLS 정책 작성 방법', response: 'Supabase RLS 정책은 CREATE POLICY 문으로 작성합니다...', tokens_used: 350, cost: 80, response_time_ms: 1900, created_at: daysAgo(1) },
        // TEST0002
        { user_id: 'TEST0002', service_name: 'ChatGPT', prompt: 'Python 리스트 컴프리헨션 예제', response: '리스트 컴프리헨션은 [표현식 for 항목 in 반복가능객체]...', tokens_used: 400, cost: 100, response_time_ms: 2300, created_at: daysAgo(18) },
        { user_id: 'TEST0002', service_name: 'ChatGPT', prompt: 'Django ORM 쿼리 최적화', response: 'Django ORM 최적화: 1. select_related 사용...', tokens_used: 550, cost: 100, response_time_ms: 2600, created_at: daysAgo(15) },
        { user_id: 'TEST0002', service_name: 'Perplexity', prompt: 'AWS Lambda 비용 계산', response: 'AWS Lambda 비용 계산: 요청 수 * 요청당 비용 + 컴퓨팅 시간...', tokens_used: 180, cost: 50, response_time_ms: 2900, created_at: daysAgo(10) }
    ];

    const usageRes = await fetch(`${SUPABASE_URL}/rest/v1/ai_usage_log`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(usageLogs)
    });

    if (usageRes.ok) {
        const data = await usageRes.json();
        console.log(`✅ AI 사용 로그 ${data.length}개 삽입 완료`);
        console.log(`   - TEST0001: ${data.filter(d => d.user_id === 'TEST0001').length}개`);
        console.log(`   - TEST0002: ${data.filter(d => d.user_id === 'TEST0002').length}개`);
    } else {
        const errText = await usageRes.text();
        console.log('❌ AI 사용 로그 삽입 실패:', errText);

        if (errText.includes('relation') && errText.includes('does not exist')) {
            console.log('\n⚠️ ai_usage_log 테이블이 없습니다.');
            console.log('   Supabase SQL Editor에서 24_create_credit_tables.sql 실행 필요');
            return;
        }
    }

    // =============================================
    // 4. users 테이블 credit_balance 업데이트
    // =============================================
    console.log('\n4. 사용자 크레딧 잔액 업데이트...');

    const updateUser1 = await fetch(`${SUPABASE_URL}/rest/v1/users?user_id=eq.TEST0001`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({ credit_balance: 64540 })
    });

    const updateUser2 = await fetch(`${SUPABASE_URL}/rest/v1/users?user_id=eq.TEST0002`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({ credit_balance: 34750 })
    });

    if (updateUser1.ok && updateUser2.ok) {
        console.log('✅ 사용자 크레딧 잔액 업데이트 완료');
        console.log('   - TEST0001: 64,540원');
        console.log('   - TEST0002: 34,750원');
    } else {
        console.log('⚠️ 사용자 크레딧 잔액 업데이트 실패 (credit_balance 컬럼이 없을 수 있음)');
    }

    // =============================================
    // 5. 최종 확인
    // =============================================
    console.log('\n========================================');
    console.log('데이터 삽입 결과 확인');
    console.log('========================================\n');

    // AI 가격 확인
    const checkPricing = await fetch(`${SUPABASE_URL}/rest/v1/ai_service_pricing?select=*`, {
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
    });
    if (checkPricing.ok) {
        const pricing = await checkPricing.json();
        console.log('📊 AI 서비스 가격:');
        pricing.forEach(p => console.log(`   ${p.service_name}: ${p.price_per_use}원 (원가: ${p.api_cost}원, 마진: ${p.margin_percent}%)`));
    }

    // 거래 내역 확인
    const checkTrans = await fetch(`${SUPABASE_URL}/rest/v1/credit_transactions?select=*&order=created_at.desc&limit=5`, {
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
    });
    if (checkTrans.ok) {
        const trans = await checkTrans.json();
        console.log('\n📊 최근 크레딧 거래 (최근 5개):');
        trans.forEach(t => console.log(`   ${t.user_id}: ${t.type} ${t.amount}원 → 잔액 ${t.balance_after}원`));
    }

    // 사용 로그 확인
    const checkUsage = await fetch(`${SUPABASE_URL}/rest/v1/ai_usage_log?select=*&order=created_at.desc&limit=5`, {
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
    });
    if (checkUsage.ok) {
        const usage = await checkUsage.json();
        console.log('\n📊 최근 AI 사용 로그 (최근 5개):');
        usage.forEach(u => console.log(`   ${u.user_id}: ${u.service_name} - ${u.cost}원 (${u.response_time_ms}ms)`));
    }

    console.log('\n========================================');
    console.log('✅ AI 크레딧 시스템 데이터베이스 설정 완료!');
    console.log('========================================');
}

executeAllCreditTables().catch(console.error);
