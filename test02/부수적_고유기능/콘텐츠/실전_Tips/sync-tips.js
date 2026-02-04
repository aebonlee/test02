/**
 * 실전 Tips 동기화 스크립트
 *
 * tips-list.json을 읽어서 3개 파일의 TIPS_CONTENTS를 자동 업데이트합니다.
 *
 * 사용법: node sync-tips.js
 */

const fs = require('fs');
const path = require('path');

// 경로 설정
const TIPS_DIR = __dirname;
const ROOT_DIR = path.join(__dirname, '../../..');

const FILES = {
    source: path.join(TIPS_DIR, 'tips-list.json'),
    viewer: path.join(TIPS_DIR, 'viewer.html'),
    index: path.join(ROOT_DIR, 'index.html')
};

// JSON 읽기
function loadTipsList() {
    const data = fs.readFileSync(FILES.source, 'utf8');
    return JSON.parse(data);
}

// viewer.html용 객체 형식 생성
function generateViewerObject(categories) {
    let lines = [];

    categories.forEach((cat, idx) => {
        const comma = idx < categories.length - 1 ? ',' : '';
        lines.push(`            '${cat.id}': {`);
        lines.push(`                name: '${cat.name}',`);
        lines.push(`                icon: '${cat.icon}',`);
        lines.push(`                description: '${cat.description}',`);
        lines.push(`                files: [`);

        cat.files.forEach((file, fIdx) => {
            const fComma = fIdx < cat.files.length - 1 ? ',' : '';
            const filePath = `실전_Tips/${cat.id}/${file.file}`;
            lines.push(`                    { name: '${file.name}', path: '${filePath}' }${fComma}`);
        });

        lines.push(`                ]`);
        lines.push(`            }${comma}`);
    });

    return lines.join('\n');
}

// index.html용 배열 형식 생성
function generateIndexArray(categories) {
    let items = [];

    categories.forEach(cat => {
        cat.files.forEach(file => {
            const filePath = `실전_Tips/${cat.id}/${file.file}`;
            items.push(`            { category: '${cat.name}', title: '${file.name}', path: '${filePath}' }`);
        });
    });

    return items.join(',\n');
}

// viewer.html 업데이트
function updateViewerFile(filePath, newContent, totalCount) {
    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️ 파일 없음: ${filePath}`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. 상단 개수 자동 업데이트 (Tips 카테고리 (XX개))
    const countPattern = /Tips 카테고리 \(\d+개\)/;
    if (countPattern.test(content)) {
        content = content.replace(countPattern, `Tips 카테고리 (${totalCount}개)`);
        console.log(`  ✅ 개수 업데이트: ${totalCount}개`);
    }

    // 2. TIPS_CONTENTS 객체 교체 (정규식으로 찾기)
    const pattern = /const TIPS_CONTENTS = \{[\s\S]*?\n        \};/;
    const replacement = `const TIPS_CONTENTS = {\n${newContent}\n        };`;

    if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ 업데이트: ${path.basename(filePath)}`);
        return true;
    } else {
        console.log(`  ⚠️ TIPS_CONTENTS 패턴 못 찾음: ${filePath}`);
        return false;
    }
}

// index.html 업데이트
function updateIndexFile(filePath, newContent) {
    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️ 파일 없음: ${filePath}`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // TIPS_CONTENTS 배열 교체
    const pattern = /const TIPS_CONTENTS = \[[\s\S]*?\n        \];/;
    const replacement = `const TIPS_CONTENTS = [\n${newContent}\n        ];`;

    if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ 업데이트: ${path.basename(filePath)}`);
        return true;
    } else {
        console.log(`  ⚠️ TIPS_CONTENTS 패턴 못 찾음: ${filePath}`);
        return false;
    }
}

// 메인 실행
function main() {
    console.log('');
    console.log('🔄 실전 Tips 동기화 시작...');
    console.log('');

    // 1. JSON 로드
    console.log('📄 tips-list.json 로드...');
    const tipsList = loadTipsList();
    const categories = tipsList.categories;

    // 통계
    let totalFiles = 0;
    categories.forEach(cat => totalFiles += cat.files.length);
    console.log(`   카테고리: ${categories.length}개`);
    console.log(`   Tips 파일: ${totalFiles}개`);
    console.log('');

    // 2. 콘텐츠 생성
    const viewerContent = generateViewerObject(categories);
    const indexContent = generateIndexArray(categories);

    // 3. 파일 업데이트
    console.log('📝 파일 업데이트...');

    updateViewerFile(FILES.viewer, viewerContent, totalFiles);
    updateIndexFile(FILES.index, indexContent);

    console.log('');
    console.log('✅ 동기화 완료!');
    console.log('');
}

main();
