/**
 * Custom Skills 빌드 스크립트
 * skills-list.json + skills/ 하위 SKILL.md → custom-skills.js 번들
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const contentDir = path.join(projectRoot, '부수적_고유기능/콘텐츠/Custom_Skills');
const skillsDir = path.join(contentDir, 'skills');
const listFile = path.join(contentDir, 'skills-list.json');
const outputFile = path.join(contentDir, 'custom-skills.js');

console.log('🔧 custom-skills.js 생성 시작...');

// skills-list.json 읽기
if (!fs.existsSync(listFile)) {
    console.log('❌ skills-list.json 파일이 없습니다.');
    process.exit(1);
}

const skillsList = JSON.parse(fs.readFileSync(listFile, 'utf-8'));
const skills = {};

console.log(`\n📄 등록된 스킬: ${skillsList.skills.length}개\n`);

skillsList.skills.forEach(skill => {
    const mdPath = path.join(skillsDir, skill.id, 'SKILL.md');
    if (fs.existsSync(mdPath)) {
        const content = fs.readFileSync(mdPath, 'utf-8');
        skills[skill.id] = {
            content: content,
            meta: {
                id: skill.id,
                title: skill.title,
                icon: skill.icon,
                category: skill.category,
                description: skill.description
            }
        };
        console.log(`✅ ${skill.id} - ${skill.title}`);
    } else {
        console.log(`⚠️ ${skill.id} - SKILL.md 파일 없음 (${mdPath})`);
    }
});

// JS 파일 생성
const jsContent = `// Auto-generated Custom Skills Bundle
// Generated at: ${new Date().toISOString()}
// Total skills: ${Object.keys(skills).length}

window.CUSTOM_SKILLS = ${JSON.stringify(skills, null, 2)};
`;

fs.writeFileSync(outputFile, jsContent, 'utf-8');
console.log(`\n✅ custom-skills.js 생성 완료: ${outputFile}`);
console.log(`📊 총 ${Object.keys(skills).length}개 스킬 포함`);
