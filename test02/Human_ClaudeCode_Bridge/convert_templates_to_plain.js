const fs = require('fs');
const path = require('path');

const templatesPath = path.join(__dirname, 'ordersheet_templates.json');
const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));

// 마크다운을 평문으로 변환하는 함수
function markdownToPlain(markdown) {
  let plain = markdown;

  // # 제목 → 제목
  plain = plain.replace(/^# (.+)$/gm, '$1');
  plain = plain.replace(/^## (.+)$/gm, '\n$1');
  plain = plain.replace(/^### (.+)$/gm, '\n$1');

  // 체크박스 - [ ] → -
  plain = plain.replace(/- \[ \] /g, '- ');

  // 볼드 **text** → text
  plain = plain.replace(/\*\*(.+?)\*\*/g, '$1');

  // 이모지는 유지하되 불필요한 빈 줄 정리
  plain = plain.replace(/\n{3,}/g, '\n\n');

  // 시작과 끝 공백 제거
  plain = plain.trim();

  return plain;
}

let converted = 0;

Object.keys(templates).forEach(key => {
  if (templates[key].template && templates[key].template !== 'TODO') {
    const original = templates[key].template;
    const plain = markdownToPlain(original);

    if (original !== plain) {
      templates[key].template = plain;
      converted++;
      console.log(`✅ ${key} - 평문으로 변환 완료`);
    }
  }
});

// 저장
fs.writeFileSync(templatesPath, JSON.stringify(templates, null, 2), 'utf8');

console.log('');
console.log('✅ 전체 완료!');
console.log(`변환된 템플릿 수: ${converted}개`);
console.log(`총 템플릿 수: ${Object.keys(templates).length}개`);
