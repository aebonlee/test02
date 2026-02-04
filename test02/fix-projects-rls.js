const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixProjectsRLS() {
    console.log('═══════════════════════════════════════════════');
    console.log('  Projects 테이블 RLS 정책 수정');
    console.log('═══════════════════════════════════════════════\n');

    console.log('문제: projects.user_id (커스텀 ID) ≠ auth.uid() (UUID)');
    console.log('해결: users 테이블을 통해 매칭\n');

    // SQL 실행
    const sql = `
        -- =====================================================
        -- projects 테이블 RLS 정책 수정
        -- 문제: user_id = auth.uid() 비교 (커스텀 ID vs UUID 불일치)
        -- 해결: users 테이블 조인으로 커스텀 user_id 매칭
        -- =====================================================

        -- 기존 정책 삭제
        DROP POLICY IF EXISTS "projects_select_own" ON projects;
        DROP POLICY IF EXISTS "projects_insert_own" ON projects;
        DROP POLICY IF EXISTS "projects_update_own" ON projects;
        DROP POLICY IF EXISTS "projects_delete_admin" ON projects;

        -- SELECT: 본인 프로젝트 또는 Admin
        CREATE POLICY "projects_select_own" ON projects
            FOR SELECT TO authenticated
            USING (
                user_id IN (SELECT user_id FROM users WHERE id = auth.uid())
                OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
            );

        -- INSERT: 본인 프로젝트만
        CREATE POLICY "projects_insert_own" ON projects
            FOR INSERT TO authenticated
            WITH CHECK (
                user_id IN (SELECT user_id FROM users WHERE id = auth.uid())
            );

        -- UPDATE: 본인 프로젝트 또는 Admin
        CREATE POLICY "projects_update_own" ON projects
            FOR UPDATE TO authenticated
            USING (
                user_id IN (SELECT user_id FROM users WHERE id = auth.uid())
                OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
            );

        -- DELETE: Admin만
        CREATE POLICY "projects_delete_admin" ON projects
            FOR DELETE TO authenticated
            USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
    `;

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        console.log('RPC 방식 실패, 개별 실행 시도...\n');

        // 개별 정책 삭제 및 생성
        const statements = [
            `DROP POLICY IF EXISTS "projects_select_own" ON projects`,
            `DROP POLICY IF EXISTS "projects_insert_own" ON projects`,
            `DROP POLICY IF EXISTS "projects_update_own" ON projects`,
            `DROP POLICY IF EXISTS "projects_delete_admin" ON projects`,
            `CREATE POLICY "projects_select_own" ON projects FOR SELECT TO authenticated USING (user_id IN (SELECT user_id FROM users WHERE id = auth.uid()) OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`,
            `CREATE POLICY "projects_insert_own" ON projects FOR INSERT TO authenticated WITH CHECK (user_id IN (SELECT user_id FROM users WHERE id = auth.uid()))`,
            `CREATE POLICY "projects_update_own" ON projects FOR UPDATE TO authenticated USING (user_id IN (SELECT user_id FROM users WHERE id = auth.uid()) OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`,
            `CREATE POLICY "projects_delete_admin" ON projects FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`
        ];

        for (const stmt of statements) {
            const { error: stmtError } = await supabase.rpc('exec_sql', { sql_query: stmt });
            if (stmtError) {
                console.log(`❌ 실패: ${stmt.substring(0, 60)}...`);
                console.log(`   에러: ${stmtError.message}`);
            } else {
                console.log(`✅ 성공: ${stmt.substring(0, 60)}...`);
            }
        }
    } else {
        console.log('✅ RLS 정책 수정 완료!');
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('  수정 완료');
    console.log('═══════════════════════════════════════════════\n');
    console.log('변경 내용:');
    console.log('  BEFORE: user_id = auth.uid()  (UUID와 커스텀 ID 비교 → 항상 불일치)');
    console.log('  AFTER:  user_id IN (SELECT user_id FROM users WHERE id = auth.uid())');
    console.log('          → users 테이블에서 auth UUID를 커스텀 user_id로 변환 후 비교');
}

fixProjectsRLS().catch(console.error);
