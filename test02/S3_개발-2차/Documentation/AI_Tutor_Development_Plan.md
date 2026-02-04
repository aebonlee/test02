# AI 튜터 자체 개발 구현 계획

> **작성일**: 2026-01-04
> **Stage**: S3 (개발 2차 - AI 연동)
> **관련 Tasks**: S3D1, S3BI2, S3BA3, S3F2, S3T1

## 목표
외부 서비스(aitalker.co.kr) iframe을 제거하고, RAG 기반 자체 AI 튜터 시스템 구축

---

## SSAL Works Project SAL Grid 규칙 적용

### Task 생성 계획

AI 튜터 기능을 **S3 (개발 2차 - AI 연동)** Stage에 새로운 Task로 추가

**기존 S3 Task 확인:**
- S3F1, S3BI1, S3BA1, S3BA2, S3S1, S3E1 (6개)

**신규 추가 Task (5개):**

| Task ID | Task Name | Area | 설명 |
|---------|-----------|------|------|
| S3D1 | AI 튜터 DB 스키마 | D | content_embeddings, tutor_conversations, tutor_messages 테이블 |
| S3BI2 | RAG 파이프라인 구축 | BI | Gemini 임베딩, 벡터 검색, 컨텍스트 증강 |
| S3BA3 | AI 튜터 API 개발 | BA | 채팅 API, 대화 관리 API |
| S3F2 | AI 튜터 UI 개발 | F | iframe 제거, 자체 채팅 모달, 스트리밍 렌더링 |
| S3T1 | AI 튜터 통합 테스트 | T | E2E 테스트, 크레딧 검증 |

**총 S3 Task: 6개 → 11개**

### 진행 순서 (Stage Gate 방식)

```
[1단계] S3D1: DB 스키마 생성 → 테스트 → 검증
    ↓
[2단계] S3BI2: RAG 파이프라인 → 임베딩 생성 → 테스트 → 검증
    ↓
[3단계] S3BA3: API 개발 → 테스트 → 검증
    ↓
[4단계] S3F2: UI 개발 → 테스트 → 검증
    ↓
[5단계] S3T1: 통합 테스트 → Stage Gate 검증 → PO 승인
```

### Task CRUD 프로세스 (07_task-crud.md)

각 Task 생성 시:
1. SSALWORKS_TASK_PLAN.md 업데이트
2. task-instructions/{TaskID}_instruction.md 생성
3. verification-instructions/{TaskID}_verification.md 생성
4. Supabase project_sal_grid 테이블에 INSERT
5. JSON 파일 (grid_records/{TaskID}.json) 생성
6. work_logs/current.md 기록

---

## 아키텍처 개요

```
Frontend (index.html)
    │
    ▼ SSE/Fetch
Backend (Vercel Serverless)
    │
    ├─► RAG Pipeline (벡터 검색 → 컨텍스트 증강)
    │
    └─► Gemini Client (기존 재사용)
    │
    ▼
Supabase (pgvector + 대화 저장)
```

---

## Phase 1: DB 스키마 구축 (S3D1)

### 1.1 pgvector 확장 활성화
- Supabase Dashboard → SQL Editor에서 실행

### 1.2 테이블 생성
**파일:** `P3_프로토타입_제작/Database/ai_tutor_schema.sql`

```sql
-- content_embeddings: 학습 콘텐츠 임베딩 (225개 MD → ~675 청크)
-- tutor_conversations: 대화 세션
-- tutor_messages: 개별 메시지
-- search_content(): 벡터 유사도 검색 함수
```

---

## Phase 2: RAG 파이프라인 구축 (S3BI2)

### 2.1 임베딩 스크립트
**파일:** `scripts/generate-embeddings.js`

- 225개 MD 파일 로드 (Tips, Books, Guides, Briefings)
- 청킹: 1000자, 오버랩 200자
- 임베딩: Gemini Embedding (768차원, 무료)
- Supabase content_embeddings 테이블에 저장

### 2.2 메타데이터 JSON 활용
- `tips-list.json` → 카테고리, 제목 추출
- `guides-list.json` → 가이드 메타데이터

### 2.3 RAG 유틸리티 모듈
**폴더:** `api/Backend_Infra/rag/`

| 파일 | 역할 |
|------|------|
| `index.js` | RAG 파이프라인 메인 |
| `embeddings.js` | 임베딩 생성/검색 |
| `chunker.js` | 텍스트 청킹 |
| `prompt-builder.js` | 시스템 프롬프트 템플릿 |

---

## Phase 3: API 개발 (S3BA3)

### 3.1 API 엔드포인트
**폴더:** `api/External/`

| 파일 | 엔드포인트 | 기능 |
|------|-----------|------|
| `ai-tutor-chat.js` | POST /api/ai-tutor/chat | 메인 채팅 (RAG + 스트리밍) |
| `ai-tutor-conversations.js` | GET/POST/DELETE | 대화 CRUD |

### 3.2 기존 코드 재사용
- `api/Backend_Infra/ai/` → AI 클라이언트 (스트리밍 추가)
- `api/Backend_Infra/rate-limiter.js` → Rate Limiting
- `api/External/ai-qa.js` → 크레딧 차감 로직 참조

---

## Phase 4: UI 개발 (S3F2)

### 4.1 index.html 수정
**수정 위치:** 라인 929-954, 5096-5165

| 기존 | 신규 |
|------|------|
| iframe (aitalker.co.kr) | 자체 채팅 UI |
| 단순 팝업 | 대화 히스토리 |

### 4.2 UI 컴포넌트

```html
<div id="ai-tutor-modal">
  <!-- 헤더: 새 대화, 대화 목록, 닫기 (Gemini 고정 - 모델 선택 없음) -->
  <!-- 사이드바: 대화 히스토리 (토글) -->
  <!-- 메시지 영역: 스트리밍 렌더링 + 참조 문서 표시 -->
  <!-- 입력 영역: textarea + 전송 버튼 + 크레딧 표시 -->
</div>
```

### 4.3 스트리밍 처리
- SSE (Server-Sent Events) 방식
- 실시간 타이핑 효과
- 참조 문서 표시

---

## Phase 5: 통합 테스트 (S3T1)

- End-to-End 테스트
- 크레딧 차감 검증
- 모바일 반응형 확인
- 에러 핸들링

---

## 파일 생성/수정 목록

### 신규 생성 (10개)

| 파일 | 설명 |
|------|------|
| `P3_프로토타입_제작/Database/ai_tutor_schema.sql` | DB 스키마 |
| `scripts/generate-embeddings.js` | 임베딩 생성 스크립트 |
| `api/Backend_Infra/rag/index.js` | RAG 메인 |
| `api/Backend_Infra/rag/embeddings.js` | 임베딩 유틸 |
| `api/Backend_Infra/rag/chunker.js` | 청킹 유틸 |
| `api/Backend_Infra/rag/prompt-builder.js` | 프롬프트 템플릿 |
| `api/External/ai-tutor-chat.js` | 채팅 API |
| `api/External/ai-tutor-conversations.js` | 대화 CRUD API |
| `S3_개발-2차/Backend_Infra/rag/` | Stage 원본 (자동 복사) |
| `S3_개발-2차/External/` | Stage 원본 (자동 복사) |

### 수정 (3개)

| 파일 | 수정 내용 |
|------|----------|
| `index.html` | AI Tutor UI 전면 교체 |
| `api/Backend_Infra/ai/gemini-client.js` | 스트리밍 메서드 추가 |
| `vercel.json` | 새 API 라우트 추가 |

---

## 기술 선택

| 항목 | 선택 | 이유 |
|------|------|------|
| **임베딩** | Gemini Embedding | **무료**, 768차원 |
| **답변 AI** | **Gemini 2.5 Flash만** | 콘텐츠 기반이라 AI별 차별화 없음, 단순화 |
| 벡터 DB | Supabase pgvector | 기존 인프라 활용 |
| 스트리밍 | SSE | Vercel 호환 |
| 청킹 | 1000자/200자 오버랩 | 문맥 유지 |
| 대화 저장 | Supabase DB | 여러 기기에서 이어서 대화 |
| 크레딧 | 기존 방식 (1크레딧/질문) | Gemini 고정이므로 단순 |

**핵심: Gemini 하나로 임베딩 + 답변 모두 처리 (단순화)**

---

## 예상 비용

| 항목 | 비용 |
|------|------|
| 초기 임베딩 (225개 파일) | **$0 (Gemini 무료)** |
| 월간 운영 (1000 질문 기준) | ~$0.05 (AI 응답만) |

---

## 구현 순서

1. **S3D1**: DB 스키마 → SQL 실행 → 검증
2. **S3BI2**: RAG 파이프라인 → 임베딩 생성 → 검증
3. **S3BA3**: API 개발 → 엔드포인트 구현 → 검증
4. **S3F2**: Frontend UI → index.html 수정 → 검증
5. **S3T1**: 통합 테스트 → E2E 검증 → Stage Gate
