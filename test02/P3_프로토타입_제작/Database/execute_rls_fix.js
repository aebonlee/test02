// ================================================
// RLS 정책 임시 수정 실행
// ================================================
// 목적: 테스트를 위해 모든 사용자가 CRUD 가능하도록 설정
// ================================================

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function executeRLSFix() {
    console.log('');
    console.log('═'.repeat(80));
    console.log('  RLS 정책 임시 수정');
    console.log('═'.repeat(80));
    console.log('');

    try {
        console.log('📂 SQL 파일 읽기 중...');
        const sqlFile = path.join(__dirname, '02_notices_rls_temp_fix.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');
        console.log('✅ SQL 파일 읽기 완료');
        console.log('');

        // SQL을 개별 명령어로 분리
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log('⚙️  RLS 정책 수정 중...');
        console.log(`   총 ${statements.length}개 명령어 실행`);
        console.log('');

        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i];
            if (stmt.includes('DROP POLICY')) {
                console.log(`   ${i + 1}. 기존 정책 삭제 중...`);
            } else if (stmt.includes('CREATE POLICY')) {
                console.log(`   ${i + 1}. 새 정책 생성 중...`);
            }

            const { error } = await supabase.rpc('exec_sql', { query: stmt + ';' });

            if (error && !error.message.includes('does not exist')) {
                console.log(`   ⚠️  경고:`, error.message);
            }
        }

        console.log('');
        console.log('✅ RLS 정책 수정 완료!');
        console.log('');
        console.log('📋 적용된 정책:');
        console.log('   - 모든 사용자가 공지사항 INSERT 가능');
        console.log('   - 모든 사용자가 공지사항 UPDATE 가능');
        console.log('   - 모든 사용자가 공지사항 DELETE 가능');
        console.log('');
        console.log('⚠️  주의: 이것은 테스트용 임시 설정입니다.');
        console.log('   실제 운영 시에는 Admin 권한 체크가 필요합니다.');
        console.log('');

        // 테스트: 공지사항 조회
        console.log('🔍 테스트: 공지사항 조회 중...');
        const { data, error: selectError } = await supabase
            .from('notices')
            .select('id, title, important');

        if (selectError) {
            console.log('❌ 조회 실패:', selectError.message);
        } else {
            console.log(`✅ 조회 성공: ${data.length}개 공지사항`);
            data.forEach((n, i) => {
                const mark = n.important ? '🔴' : '  ';
                console.log(`   ${i + 1}. ${mark} ${n.title}`);
            });
        }
        console.log('');

    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
    }
}

executeRLSFix();
