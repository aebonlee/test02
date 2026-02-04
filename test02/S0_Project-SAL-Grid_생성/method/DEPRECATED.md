# ⚠️ DEPRECATED - 더 이상 사용하지 않는 폴더

이 `method/` 폴더는 **더 이상 사용되지 않습니다**.

## 새로운 폴더 구조

규칙에 따라 다음 폴더로 이동되었습니다:

| 이전 경로 | 새 경로 |
|----------|--------|
| `method/csv/` | `CSV_Method/` |
| `method/database/` | `Database_Method/` |

## 데이터 파일 위치

- **JSON (Source)**: `CSV_Method/data/in_progress/project_sal_grid.json`
- **CSV (Generated)**: `CSV_Method/data/in_progress/sal_grid.csv`

## 변환 스크립트

JSON → CSV 변환:
```bash
node CSV_Method/scripts/json-to-csv.js
```

---

**삭제 예정**: 이 폴더는 추후 삭제될 예정입니다.
