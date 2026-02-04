/**
 * Order Sheet 템플릿 MD 파일들을 JavaScript 객체로 변환
 *
 * file:// 프로토콜에서 fetch가 CORS로 차단되므로
 * MD 내용을 JS 파일로 미리 번들링
 *
 * 사용법: node scripts/generate-ordersheets-js.js
 */

const fs = require('fs');
const path = require('path');

// Order Sheet 템플릿 폴더 위치 (스크립트가 OrderSheet_Templates 폴더에 있음)
const TEMPLATES_DIR = __dirname;
// 출력 JS 파일 위치 - 현재 폴더(OrderSheet_Templates)에 저장
const OUTPUT_FILE = path.join(__dirname, 'ordersheets.js');

/**
 * 디렉토리를 재귀적으로 탐색하여 모든 MD 파일 찾기
 */
function findMdFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findMdFiles(filePath, fileList);
        } else if (file.endsWith('.md')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

function main() {
    console.log('📋 ordersheets.js 생성 시작...\n');

    if (!fs.existsSync(TEMPLATES_DIR)) {
        console.log(`❌ Order Sheet 템플릿 폴더가 없습니다: ${TEMPLATES_DIR}`);
        return;
    }

    // 모든 MD 파일 찾기 (하위 폴더 포함)
    const mdFiles = findMdFiles(TEMPLATES_DIR);
    console.log(`📄 발견된 MD 파일: ${mdFiles.length}개\n`);

    const templates = {};

    mdFiles.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        // 파일명에서 .md 제거하여 키로 사용
        const fileName = path.basename(filePath, '.md');
        templates[fileName] = content;

        // 상대 경로 표시
        const relativePath = path.relative(TEMPLATES_DIR, filePath);
        console.log(`✅ ${relativePath}`);
    });

    // JavaScript 파일 생성 (var 사용하여 전역 접근 가능하게)
    const jsContent = `/**
 * Order Sheet 표준 템플릿 MD 콘텐츠
 * 자동 생성됨 - 직접 수정하지 마세요
 * 생성 시간: ${new Date().toISOString()}
 *
 * 사용법: ORDER_SHEET_TEMPLATES['P1-1_Vision_Mission']
 */

var ORDER_SHEET_TEMPLATES = ${JSON.stringify(templates, null, 2)};
`;

    fs.writeFileSync(OUTPUT_FILE, jsContent, 'utf8');

    console.log('\n' + '─'.repeat(50));
    console.log(`\n✅ ordersheets.js 생성 완료: ${OUTPUT_FILE}`);
    console.log(`📊 총 ${Object.keys(templates).length}개 Order Sheet 템플릿 포함`);
}

main();
