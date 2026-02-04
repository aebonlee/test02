const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProjects() {
    console.log('═══════════════════════════════════════════════');
    console.log('  Projects 테이블 전체 조회');
    console.log('═══════════════════════════════════════════════\n');

    // 1. 모든 프로젝트 조회
    const { data: allProjects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('에러:', error.message);
        return;
    }

    console.log(`총 프로젝트 수: ${allProjects.length}개\n`);

    allProjects.forEach((p, idx) => {
        console.log(`${idx + 1}. 프로젝트명: ${p.project_name}`);
        console.log(`   project_id: ${p.project_id}`);
        console.log(`   user_id: ${p.user_id}`);
        console.log(`   status: ${p.status}`);
        console.log(`   registration_complete: ${p.registration_complete}`);
        console.log(`   created_at: ${p.created_at}`);
        console.log(`   progress: ${p.progress}`);
        console.log('');
    });

    // 2. "ValueLine" 프로젝트 찾기
    console.log('─'.repeat(50));
    console.log('\n🔍 "ValueLine" 프로젝트 검색\n');

    const valueLine = allProjects.filter(p =>
        p.project_name && p.project_name.toLowerCase().includes('value')
    );

    if (valueLine.length > 0) {
        console.log(`발견! ${valueLine.length}개\n`);
        valueLine.forEach(p => {
            console.log(`프로젝트명: ${p.project_name}`);
            console.log(`project_id: ${p.project_id}`);
            console.log(`user_id: ${p.user_id}`);
            console.log(`status: ${p.status}`);
            console.log(`registration_complete: ${p.registration_complete}`);
            console.log(`전체 데이터:`, JSON.stringify(p, null, 2));
        });
    } else {
        console.log('❌ "ValueLine" 프로젝트 없음');
    }

    // 3. status별 분류
    console.log('\n' + '─'.repeat(50));
    console.log('\n📊 Status별 분류\n');

    const statusGroups = {};
    allProjects.forEach(p => {
        const s = p.status || 'null';
        if (!statusGroups[s]) statusGroups[s] = [];
        statusGroups[s].push(p.project_name);
    });

    Object.entries(statusGroups).forEach(([status, names]) => {
        console.log(`[${status}]: ${names.length}개 - ${names.join(', ')}`);
    });

    // 4. in_progress 프로젝트 상세
    console.log('\n' + '─'.repeat(50));
    console.log('\n🔄 in_progress 프로젝트 상세\n');

    const inProgress = allProjects.filter(p => p.status === 'in_progress');
    if (inProgress.length > 0) {
        inProgress.forEach(p => {
            console.log(`프로젝트명: ${p.project_name}`);
            console.log(`user_id: ${p.user_id}`);
            console.log(`registration_complete: ${p.registration_complete}`);
            console.log('');
        });
    } else {
        console.log('없음');
    }
}

checkProjects().catch(console.error);
