const fs = require('fs');
const path = require('path');

const templatesPath = path.join(__dirname, 'ordersheet_templates.json');
const templates = require(templatesPath);

let removed = 0;

Object.keys(templates).forEach(key => {
  if (templates[key].template && templates[key].template !== 'TODO') {
    // "## ⏰ 예상 소요 시간" 섹션 제거
    const original = templates[key].template;
    const cleaned = original.replace(/## ⏰ 예상 소요 시간\n- 작업 시간: [^\n]+\n\n/g, '');

    if (original !== cleaned) {
      templates[key].template = cleaned;
      removed++;
      console.log('✅ ' + key + ' - 시간 추정 제거');
    }
  }
});

// 저장
fs.writeFileSync(templatesPath, JSON.stringify(templates, null, 2), 'utf8');

console.log('');
console.log('✅ 완료!');
console.log('제거된 항목 수: ' + removed);
