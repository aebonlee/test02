const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteProjects() {
    const projectIds = [
        '2512000003TH-P001',  // Dental Finder
        '2512000006TH-P002',  // ValueLine (진행중)
        '2512000006TH-P001'   // ValueLine (완료)
    ];

    console.log('═══════════════════════════════════════════════');
    console.log('  프로젝트 삭제');
    console.log('═══════════════════════════════════════════════\n');

    for (const pid of projectIds) {
        // 1. project_phase_progress 삭제 (FK 관계)
        const { error: phaseError } = await supabase
            .from('project_phase_progress')
            .delete()
            .eq('project_id', pid);

        if (phaseError) {
            console.log(`  phase_progress 삭제 실패 (${pid}): ${phaseError.message}`);
        }

        // 2. projects 삭제
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('project_id', pid);

        if (error) {
            console.log(`❌ ${pid} 삭제 실패: ${error.message}`);
        } else {
            console.log(`✅ ${pid} 삭제 완료`);
        }
    }

    // 확인
    console.log('\n확인:');
    const { data } = await supabase
        .from('projects')
        .select('project_id, project_name, status')
        .in('project_id', projectIds);

    console.log(`남은 레코드: ${data?.length || 0}개`);
}

deleteProjects().catch(console.error);
