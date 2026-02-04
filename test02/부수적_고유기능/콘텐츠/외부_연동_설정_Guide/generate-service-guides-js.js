/**
 * Service Guides 빌드 스크립트
 * 외부 연동 설정 가이드를 service-guides.js로 번들
 */

const fs = require('fs');
const path = require('path');

const inputDir = __dirname;
const outputFile = path.join(__dirname, 'service-guides.js');

console.log('📋 service-guides.js 생성 시작...');

// MD 파일 찾기
const mdFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.md'));
console.log(`\n📄 발견된 MD 파일: ${mdFiles.length}개\n`);

const guides = {};

mdFiles.forEach(file => {
    const name = path.basename(file, '.md');
    const content = fs.readFileSync(path.join(inputDir, file), 'utf-8');
    guides[name] = content;
    console.log(`✅ ${file}`);
});

// JS 파일 생성
const jsContent = `// Auto-generated Service Guides
// Generated at: ${new Date().toISOString()}

window.SERVICE_GUIDES = ${JSON.stringify(guides, null, 2)};
`;

fs.writeFileSync(outputFile, jsContent, 'utf-8');
console.log(`\n✅ service-guides.js 생성 완료: ${outputFile}`);
console.log(`📊 총 ${Object.keys(guides).length}개 가이드 포함`);
