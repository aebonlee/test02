/**
 * 외부 연동 설정 Guide 동기화 스크립트
 *
 * guides-list.json을 읽어서 2개 파일을 자동 업데이트합니다.
 * 1. Production/index.html - SERVICE_GUIDE_PATHS, SERVICE_GUIDE_TITLES
 * 2. Production/Frontend/service-guides.js - MD 콘텐츠 번들
 *
 * 사용법: node sync-guides.js
 */

const fs = require('fs');
const path = require('path');

// 경로 설정
const GUIDES_DIR = __dirname;
const PRODUCTION_DIR = path.join(__dirname, '../../../Production');

const FILES = {
    source: path.join(GUIDES_DIR, 'guides-list.json'),
    index: path.join(PRODUCTION_DIR, 'index.html'),
    serviceGuides: path.join(PRODUCTION_DIR, 'Frontend', 'service-guides.js')
};

// JSON 읽기
function loadGuidesList() {
    const data = fs.readFileSync(FILES.source, 'utf8');
    return JSON.parse(data);
}

// SERVICE_GUIDE_PATHS 생성
function generatePaths(guidesList) {
    const base = guidesList.githubRawBase;
    const basePath = guidesList.basePath;
    let lines = [];

    guidesList.guides.forEach((guide, idx) => {
        const comma = idx < guidesList.guides.length - 1 ? ',' : '';
        const url = `\${GITHUB_RAW_BASE}/${basePath}/${guide.file}`;
        lines.push(`            '${guide.id}': \`${url}\`${comma}`);
    });

    return lines.join('\n');
}

// SERVICE_GUIDE_TITLES 생성
function generateTitles(guidesList) {
    let lines = [];

    guidesList.guides.forEach((guide, idx) => {
        const comma = idx < guidesList.guides.length - 1 ? ',' : '';
        lines.push(`            '${guide.id}': '${guide.icon} ${guide.title}'${comma}`);
    });

    return lines.join('\n');
}

// index.html 업데이트
function updateIndexFile(guidesList) {
    if (!fs.existsSync(FILES.index)) {
        console.log(`  ⚠️ 파일 없음: ${FILES.index}`);
        return false;
    }

    let content = fs.readFileSync(FILES.index, 'utf8');
    let updated = false;

    // SERVICE_GUIDE_PATHS 교체
    const pathsPattern = /const SERVICE_GUIDE_PATHS = \{[\s\S]*?\n        \};/;
    const pathsContent = generatePaths(guidesList);
    const pathsReplacement = `const SERVICE_GUIDE_PATHS = {\n${pathsContent}\n        };`;

    if (pathsPattern.test(content)) {
        content = content.replace(pathsPattern, pathsReplacement);
        updated = true;
    } else {
        console.log(`  ⚠️ SERVICE_GUIDE_PATHS 패턴 못 찾음`);
    }

    // SERVICE_GUIDE_TITLES 교체
    const titlesPattern = /const SERVICE_GUIDE_TITLES = \{[\s\S]*?\n        \};/;
    const titlesContent = generateTitles(guidesList);
    const titlesReplacement = `const SERVICE_GUIDE_TITLES = {\n${titlesContent}\n        };`;

    if (titlesPattern.test(content)) {
        content = content.replace(titlesPattern, titlesReplacement);
        updated = true;
    } else {
        console.log(`  ⚠️ SERVICE_GUIDE_TITLES 패턴 못 찾음`);
    }

    if (updated) {
        fs.writeFileSync(FILES.index, content, 'utf8');
        console.log(`  ✅ 업데이트: index.html (SERVICE_GUIDE_PATHS, SERVICE_GUIDE_TITLES)`);
        return true;
    }

    return false;
}

// service-guides.js 생성 (MD 콘텐츠 번들)
function generateServiceGuidesJs(guidesList) {
    const guides = {};

    guidesList.guides.forEach(guide => {
        const filePath = path.join(GUIDES_DIR, guide.file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            guides[guide.id] = content;
            console.log(`    ✅ ${guide.file} → ${guide.id}`);
        } else {
            console.log(`    ⚠️ ${guide.file} 파일 없음`);
        }
    });

    const jsContent = `/**
 * 외부 연동 설정 가이드 MD 콘텐츠
 * 자동 생성됨 - 직접 수정하지 마세요
 * 생성 시간: ${new Date().toISOString()}
 *
 * 사용법: SERVICE_GUIDE_CONTENTS['database']
 */

const SERVICE_GUIDE_CONTENTS = ${JSON.stringify(guides, null, 2)};
`;

    // Frontend 폴더 확인
    const frontendDir = path.join(PRODUCTION_DIR, 'Frontend');
    if (!fs.existsSync(frontendDir)) {
        fs.mkdirSync(frontendDir, { recursive: true });
    }

    fs.writeFileSync(FILES.serviceGuides, jsContent, 'utf8');
    console.log(`  ✅ 생성: service-guides.js (${Object.keys(guides).length}개 가이드 번들)`);

    return true;
}

// 메인 실행
function main() {
    console.log('');
    console.log('🔄 외부 연동 설정 Guide 동기화 시작...');
    console.log('');

    // 1. JSON 로드
    console.log('📄 guides-list.json 로드...');
    const guidesList = loadGuidesList();
    console.log(`   가이드: ${guidesList.guides.length}개`);
    console.log('');

    // 2. index.html 업데이트
    console.log('📝 index.html 업데이트...');
    updateIndexFile(guidesList);
    console.log('');

    // 3. service-guides.js 생성
    console.log('📦 service-guides.js 번들링...');
    generateServiceGuidesJs(guidesList);

    console.log('');
    console.log('✅ 동기화 완료!');
    console.log('');
}

main();
