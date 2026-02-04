const fs = require('fs');
const path = require('path');

const templatesPath = path.join(__dirname, 'ordersheet_templates.json');
const sidebarPath = path.join(__dirname, '..', 'Sidebar_Process_Tools', 'sidebar_generation', 'sidebar_structure.json');

const templates = require(templatesPath);
const sidebar = require(sidebarPath);

// 매칭되는 11개만 남기기
const matched = [
  '0-1_Vision_Mission',
  '0-2_Market_Analysis',
  '0-3_Business_Model',
  '2-1_Tech_Stack',
  '2-2_Architecture',
  '3-2_Engines',
  '3-5_Backend_APIs',
  '4-1_Monitoring',
  '4-2_Maintenance',
  '4-3_Backup',
  '4-4_Security'
];

const newTemplates = {};

// 1. 매칭되는 11개 복사
matched.forEach(key => {
  if (templates[key]) {
    newTemplates[key] = templates[key];
  }
});

console.log('✅ 11개 매칭 템플릿 유지');

// 2. 57개 전체 구조 생성 (제목만)
let added = 0;
sidebar.structure.forEach(phase => {
  phase.categories.forEach(cat => {
    if (cat.items && cat.items.length > 0) {
      // 소분류가 있으면 소분류별로
      cat.items.forEach(item => {
        const key = cat.id.replace('.', '_') + '_' + item.id;
        if (!newTemplates[key]) {
          newTemplates[key] = {
            name: item.name_ko || item.name_en,
            category: phase.name,
            parent: cat.name_ko || cat.name_en,
            template: 'TODO'
          };
          added++;
        }
      });
    } else {
      // 소분류 없으면 중분류
      const key = cat.id.replace('.', '_');
      if (!newTemplates[key]) {
        newTemplates[key] = {
          name: cat.name_ko || cat.name_en,
          category: phase.name,
          template: 'TODO'
        };
        added++;
      }
    }
  });
});

console.log('✅ ' + added + '개 제목 추가');

// 정렬된 키 순서로 재구성
const sortedKeys = Object.keys(newTemplates).sort((a, b) => {
  const [phaseA] = a.split('_');
  const [phaseB] = b.split('_');

  const phaseNumA = parseInt(phaseA.split('-')[0]);
  const phaseNumB = parseInt(phaseB.split('-')[0]);

  if (phaseNumA !== phaseNumB) return phaseNumA - phaseNumB;
  return a.localeCompare(b);
});

const sortedTemplates = {};
sortedKeys.forEach(key => {
  sortedTemplates[key] = newTemplates[key];
});

// 저장
fs.writeFileSync(templatesPath, JSON.stringify(sortedTemplates, null, 2), 'utf8');

console.log('✅ ordersheet_templates.json 업데이트 완료!');
console.log('');
console.log('📊 통계:');
console.log('  - 유지된 템플릿: 11개');
console.log('  - 삭제된 템플릿: 13개');
console.log('  - 추가된 항목 (제목만): ' + added + '개');
console.log('  - 총 항목: ' + Object.keys(sortedTemplates).length + '개');
