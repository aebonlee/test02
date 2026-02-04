/**
 * build-all.js
 *
 * 모든 빌드 스크립트를 한 번에 실행하는 통합 스크립트
 *
 * 실행: node Production/build-all.js
 *
 * 포함된 빌드:
 * 1. build-progress.js - 진행률 계산 (phase_progress.json)
 * 2. build-web-assets.js - MD → JS 번들 (Order Sheet, 안내문)
 * 3. build-sal-grid-csv.js - SAL Grid CSV 생성
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 현재 스크립트 위치 (Production 폴더)
const PRODUCTION_DIR = __dirname;
const PROJECT_ROOT = path.join(PRODUCTION_DIR, '..');

console.log('🚀 Build All - 통합 빌드 시작\n');
console.log('=' .repeat(50));

// 빌드 스크립트 목록
const buildScripts = [
    {
        name: '진행률 계산',
        script: 'build-progress.js',
        dir: path.join(PROJECT_ROOT, 'Development_Process_Monitor')
    },
    {
        name: 'Web Assets 빌드 (Order Sheet, 안내문)',
        script: 'build-web-assets.js',
        dir: PRODUCTION_DIR
    },
    {
        name: 'SAL Grid CSV 생성',
        script: 'build-sal-grid-csv.js',
        dir: path.join(PROJECT_ROOT, 'S0_Project-SAL-Grid_생성')
    }
];

let successCount = 0;
let failCount = 0;

// 각 스크립트 실행
buildScripts.forEach((build, index) => {
    const scriptPath = path.join(build.dir, build.script);

    console.log(`\n[${index + 1}/${buildScripts.length}] ${build.name}`);
    console.log(`    스크립트: ${build.script}`);

    // 파일 존재 확인
    if (!fs.existsSync(scriptPath)) {
        console.log(`    ⚠️ 스크립트 없음 - 건너뜀`);
        return;
    }

    try {
        execSync(`node "${scriptPath}"`, {
            cwd: build.dir,
            stdio: 'inherit'
        });
        console.log(`    ✅ 완료`);
        successCount++;
    } catch (error) {
        console.log(`    ❌ 실패: ${error.message}`);
        failCount++;
    }
});

// 결과 요약
console.log('\n' + '='.repeat(50));
console.log('📊 빌드 결과 요약');
console.log(`    ✅ 성공: ${successCount}개`);
console.log(`    ❌ 실패: ${failCount}개`);
console.log('='.repeat(50));

if (failCount > 0) {
    console.log('\n⚠️ 일부 빌드가 실패했습니다.');
    process.exit(1);
} else {
    console.log('\n🎉 모든 빌드 완료!');
}
