# AI Tutor 콘텐츠 임베딩 프로세스

> 작성일: 2026-01-05
> 목적: AI Tutor가 학습할 콘텐츠를 임베딩하여 RAG 검색 가능하게 만드는 프로세스

---

## 1. 개요

AI Tutor는 RAG(Retrieval-Augmented Generation) 방식으로 작동합니다.
사용자 질문이 들어오면, 임베딩된 콘텐츠에서 유사한 내용을 검색하여 답변에 활용합니다.

```
사용자 질문 → 임베딩 → 벡터 검색 → 관련 콘텐츠 → AI 답변 생성
```

---

## 2. 임베딩 스크립트

**파일 위치:** `scripts/generate-embeddings.js`

**실행 방법:**
```bash
node scripts/generate-embeddings.js
```

---

## 3. 작동 프로세스

```
1. MD 파일 읽기 (각 콘텐츠 폴더에서)
       ↓
2. 프론트매터 제거 + 제목 추출
       ↓
3. 텍스트 청킹 (1000자, 200자 오버랩)
       ↓
4. Gemini API로 임베딩 생성 (768차원 벡터)
       ↓
5. Supabase content_embeddings 테이블에 저장
```

---

## 4. 청킹 설정

| 설정 | 값 | 설명 |
|------|-----|------|
| CHUNK_SIZE | 1000자 | 각 청크의 최대 길이 |
| CHUNK_OVERLAP | 200자 | 청크 간 중복 (문맥 유지) |
| DELAY_MS | 150ms | Rate limiting (분당 60회 제한) |

---

## 5. 콘텐츠 경로 설정

스크립트의 `CONTENT_PATHS` 객체에서 경로를 관리합니다.

### 현재 등록된 경로:

| content_type | 경로 | 파일 수 |
|--------------|------|---------|
| tips | 부수적_고유기능/콘텐츠/실전_Tips | 67개 |
| books | 부수적_고유기능/콘텐츠/학습용_Books_New | 87개 |
| guides | 부수적_고유기능/콘텐츠/외부_연동_설정_Guide | 6개 |
| briefings | Briefings_OrderSheets/Briefings | 34개 |
| ordersheets | Briefings_OrderSheets/OrderSheet_Templates | 30개 |
| manuals | S0_Project-SAL-Grid_생성/manual | 1개 |

### 추가할 경로:

| content_type | 경로 | 파일 수 |
|--------------|------|---------|
| service_intro | P2_프로젝트_기획/Service_Introduction | 10개 |
| tech_stack | P2_프로젝트_기획/Tech_Stack | 1개 |
| compliance | .claude/compliance | 1개 |
| rules | .claude/rules | 7개 |
| methods | .claude/methods | 3개 |

---

## 6. 새 콘텐츠 추가 방법

### Step 1: 스크립트에 경로 추가

`scripts/generate-embeddings.js` 파일의 `CONTENT_PATHS` 객체에 추가:

```javascript
const CONTENT_PATHS = {
    // 기존 경로...

    // 새로 추가
    service_intro: path.join(BASE_PATH, 'P2_프로젝트_기획/Service_Introduction'),
    tech_stack: path.join(BASE_PATH, 'P2_프로젝트_기획/Tech_Stack'),
    compliance: path.join(BASE_PATH, '.claude/compliance'),
    rules: path.join(BASE_PATH, '.claude/rules'),
    methods: path.join(BASE_PATH, '.claude/methods'),
};
```

### Step 2: 스크립트 실행

```bash
node scripts/generate-embeddings.js
```

### Step 3: 결과 확인

스크립트 실행 후 출력되는 통계 확인:
- 처리된 파일 수
- 생성된 청크 수
- 오류 수
- 소요 시간

---

## 7. 데이터베이스 구조

**테이블:** `content_embeddings`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | 고유 ID |
| content_type | text | 콘텐츠 유형 (tips, books 등) |
| content_id | text | 파일명 |
| chunk_index | integer | 청크 순서 |
| title | text | 문서 제목 |
| content | text | 청크 내용 |
| embedding | vector(768) | 임베딩 벡터 |
| metadata | jsonb | 파일 경로 등 메타데이터 |
| created_at | timestamp | 생성일 |

---

## 8. 필요한 환경변수

`.env` 파일에 다음 설정 필요:

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
GEMINI_API_KEY=xxx
```

**환경변수 파일 위치:** `P3_프로토타입_제작/Database/.env`

---

## 9. 비용

| 항목 | 비용 |
|------|------|
| Gemini embedding-001 | **무료** |
| Supabase 저장 | 무료 티어 내 |

---

## 10. 주의사항

1. **기존 데이터 삭제**: 필요시 스크립트의 `clearExistingData()` 함수 주석 해제
2. **Rate Limiting**: Gemini 무료 티어는 분당 60회 제한
3. **중복 실행**: 같은 파일을 다시 실행하면 중복 저장됨
4. **큰 파일**: 파일이 크면 청크가 많이 생성됨

---

## 11. 관련 파일

| 파일 | 설명 |
|------|------|
| `scripts/generate-embeddings.js` | 임베딩 생성 스크립트 |
| `api/Backend_Infra/rag/index.js` | RAG 파이프라인 |
| `api/Backend_Infra/rag/embeddings.js` | 임베딩 검색 |
| `api/External/ai-tutor-chat.js` | AI Tutor API |

---

## 12. 임베딩 현황 확인

Supabase에서 현재 임베딩된 청크 수 확인:

```sql
SELECT content_type, COUNT(*) as chunk_count
FROM content_embeddings
GROUP BY content_type
ORDER BY content_type;
```
