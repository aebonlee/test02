/**
 * AI 크레딧 시스템 테이블 생성 - REST API 방식
 *
 * Supabase REST API로 직접 CREATE TABLE은 불가능하므로,
 * SQL Editor에서 실행해야 합니다.
 *
 * 이 스크립트는 SQL 파일 내용을 표시하고 안내합니다.
 */

const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('AI 크레딧 시스템 테이블 생성 안내');
console.log('========================================\n');

console.log('⚠️ CREATE TABLE은 REST API로 직접 실행할 수 없습니다.');
console.log('   Supabase SQL Editor에서 아래 순서로 실행해주세요:\n');

console.log('📋 실행 순서:');
console.log('   1. 24_create_credit_tables.sql  (테이블 생성)');
console.log('   2. 25_credit_rls_dev.sql        (개발용 RLS 정책)');
console.log('   3. execute_credit_tables.js 재실행 (샘플 데이터 삽입)\n');

console.log('========================================');
console.log('SQL 파일 내용 미리보기');
console.log('========================================\n');

// 테이블 생성 SQL 핵심 부분만 출력
console.log('--- 24_create_credit_tables.sql ---');
console.log(`
-- 1. AI 서비스 가격 테이블
CREATE TABLE public.ai_service_pricing (
    service_name VARCHAR(20) PRIMARY KEY
        CHECK (service_name IN ('ChatGPT', 'Gemini', 'Perplexity')),
    price_per_use INTEGER NOT NULL CHECK (price_per_use > 0),
    api_cost INTEGER CHECK (api_cost > 0),
    margin_percent INTEGER DEFAULT 20,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by VARCHAR(8)
);

-- 2. 크레딧 거래 내역 테이블
CREATE TABLE public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(8) NOT NULL,
    type VARCHAR(10) NOT NULL
        CHECK (type IN ('charge', 'spend', 'refund', 'bonus', 'expire')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
    description TEXT,
    related_service VARCHAR(20),
    payment_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_credit_trans_user FOREIGN KEY (user_id)
        REFERENCES public.users(user_id) ON DELETE CASCADE
);

-- 3. AI 사용 로그 테이블
CREATE TABLE public.ai_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(8) NOT NULL,
    service_name VARCHAR(20) NOT NULL
        CHECK (service_name IN ('ChatGPT', 'Gemini', 'Perplexity')),
    prompt TEXT NOT NULL,
    response TEXT,
    tokens_used INTEGER,
    cost INTEGER NOT NULL CHECK (cost > 0),
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_ai_usage_user FOREIGN KEY (user_id)
        REFERENCES public.users(user_id) ON DELETE CASCADE
);
`);

console.log('\n--- 25_credit_rls_dev.sql ---');
console.log(`
-- 개발 환경용 RLS (모든 접근 허용)
ALTER TABLE public.ai_service_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_pricing_select_dev" ON public.ai_service_pricing
    FOR SELECT TO public USING (true);
-- (INSERT/UPDATE/DELETE도 true)

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "credit_trans_select_dev" ON public.credit_transactions
    FOR SELECT TO public USING (true);
-- (INSERT/UPDATE/DELETE도 true)

ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_usage_select_dev" ON public.ai_usage_log
    FOR SELECT TO public USING (true);
-- (INSERT/UPDATE/DELETE도 true)
`);

console.log('\n========================================');
console.log('Supabase SQL Editor 접속 방법');
console.log('========================================');
console.log('1. https://app.supabase.com 접속');
console.log('2. 프로젝트 선택 (zwjmfewyshhwpgwdtrus)');
console.log('3. 좌측 메뉴에서 "SQL Editor" 클릭');
console.log('4. "+ New query" 버튼 클릭');
console.log('5. SQL 파일 내용 붙여넣기');
console.log('6. "Run" 버튼 클릭');
console.log('========================================\n');

// 전체 SQL 파일 내용 출력 (복사용)
console.log('\n========================================');
console.log('📋 전체 SQL (복사하여 SQL Editor에서 실행)');
console.log('========================================\n');

try {
    const sqlFile = fs.readFileSync(path.join(__dirname, '24_create_credit_tables.sql'), 'utf8');
    console.log(sqlFile);
} catch (e) {
    console.log('(파일 읽기 실패 - 위의 요약 내용을 참고하세요)');
}
