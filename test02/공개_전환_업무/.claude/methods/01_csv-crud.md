# 01. CSV CRUD 작업 방법

> CSV 파일 기반 Task Grid CRUD 작업 시 준수 사항

---

## 핵심 원칙

```
CSV 파일을 AI가 직접 수정!
Read -> Parse -> Modify -> Write 순서로 작업!
```

---

## CSV 파일 위치

```
{project-root}/S0_Project-SAL-Grid_생성/data/sal_grid.csv
```

---

## CRUD 작업

### 조회 (Read)

```javascript
const fs = require('fs');

// CSV 파일 읽기
const csvContent = fs.readFileSync('sal_grid.csv', 'utf-8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim());

// 데이터 파싱
const data = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, i) => row[h] = values[i] || '');
    return row;
});

// 특정 Task 조회
const task = data.find(row => row.task_id === 'S1F1');
```

### 생성 (Create)

```javascript
// 새 Task 추가
const newTask = {
    task_id: 'S1F3',
    task_name: '새로운 Task',
    stage: '1',
    area: 'F',
    task_status: 'Pending',
    task_progress: '0',
    verification_status: 'Not Verified',
    // ... 기타 필드
};

data.push(newTask);

// CSV 파일 저장
saveCSV(headers, data, 'sal_grid.csv');
```

### 수정 (Update)

```javascript
// 특정 Task 수정
const taskIndex = data.findIndex(row => row.task_id === 'S1F1');

if (taskIndex !== -1) {
    data[taskIndex].task_status = 'Completed';
    data[taskIndex].task_progress = '100';
    data[taskIndex].verification_status = 'Verified';
}

// CSV 파일 저장
saveCSV(headers, data, 'sal_grid.csv');
```

### 삭제 (Delete)

```javascript
// 특정 Task 삭제
const taskIndex = data.findIndex(row => row.task_id === 'S1F1');

if (taskIndex !== -1) {
    data.splice(taskIndex, 1);
}

// CSV 파일 저장
saveCSV(headers, data, 'sal_grid.csv');
```

---

## 유틸리티 함수

### CSV 라인 파싱

```javascript
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}
```

### CSV 파일 저장

```javascript
function saveCSV(headers, data, filePath) {
    const lines = [headers.join(',')];

    data.forEach(row => {
        const values = headers.map(h => {
            const val = row[h] || '';
            // 쉼표, 줄바꿈, 따옴표 포함 시 처리
            if (val.includes(',') || val.includes('\n') || val.includes('"')) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        });
        lines.push(values.join(','));
    });

    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
}
```

---

## 주의사항

1. **UTF-8 인코딩**: CSV 파일은 항상 UTF-8로 저장
2. **따옴표 처리**: 쉼표, 줄바꿈 포함 시 따옴표로 감싸기
3. **백업**: 중요한 수정 전 파일 백업 권장
4. **동시 수정**: 여러 프로세스가 동시에 수정하지 않도록 주의

---

## 체크리스트

- [ ] CSV 파일 경로가 올바른가?
- [ ] 파싱 시 따옴표 처리를 했는가?
- [ ] 수정 후 파일을 저장했는가?
- [ ] UTF-8 인코딩으로 저장했는가?
