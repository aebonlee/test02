---
name: ai-tutor-build
description: RAG 기반 AI 튜터 시스템 구축 - DB 설정 → 임베딩 → API → 프론트엔드
argument-hint: "<콘텐츠폴더경로>"
allowed-tools: "Bash(node *), Bash(npm *), Read, Write, Edit, AskUserQuestion"
---

# RAG 기반 AI 튜터 시스템 구축

학습 콘텐츠(마크다운 파일)를 벡터 임베딩으로 변환하고, 사용자 질문에 대해 관련 문서를 검색하여 AI가 답변하는 튜터 시스템을 구축합니다.

## 사용 AI 모델

이 템플릿은 **Google Gemini**를 기본으로 사용합니다:
- **임베딩**: Gemini `embedding-001` (768차원 벡터)
- **응답 생성**: Gemini `gemini-2.0-flash-exp` (스트리밍 지원)

다른 모델로 대체 가능합니다:
- **OpenAI**: `text-embedding-3-small` (임베딩) + `gpt-4o` (생성) — 차원 수 변경 필요 (1536차원)
- **Anthropic Claude**: 생성 모델로 대체 가능 (임베딩은 별도 서비스 필요)
- **Cohere**: `embed-multilingual-v3.0` (임베딩) + `command-r-plus` (생성)

> 모델 변경 시 임베딩 차원 수(`vector(768)`)와 API 호출 코드를 해당 모델에 맞게 수정하세요.

## 아키텍처 개요

```
사용자 질문
    ↓
[프론트엔드] 채팅 UI → HTTP POST (SSE 스트리밍)
    ↓
[API 서버] 인증 → 크레딧 확인 → RAG 파이프라인 호출
    ↓
[RAG 파이프라인]
  1. 질문 → 임베딩 벡터 생성 (Gemini embedding-001, 768차원)
  2. 하이브리드 검색 (벡터 70% + 키워드 30%)
  3. 관련 문서 + 시스템 프롬프트 조합
    ↓
[LLM] Gemini에 프롬프트 전송 → 스트리밍 응답
    ↓
[프론트엔드] SSE로 실시간 렌더링
```

## 프로세스

### Step 1: 데이터베이스 설정 (Supabase)

사용자에게 Supabase 프로젝트 URL과 키를 확인합니다.

pgvector 확장과 pg_trgm 확장을 활성화하고, 하이브리드 검색을 위한 테이블과 함수를 생성합니다:

```sql
-- 벡터 확장 활성화
CREATE EXTENSION IF NOT EXISTS vector;

-- 키워드 검색용 트라이그램 확장 (하이브리드 검색)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 콘텐츠 임베딩 테이블
CREATE TABLE content_embeddings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL,
    content_id VARCHAR(100) NOT NULL,
    chunk_index INTEGER NOT NULL,
    title VARCHAR(500),
    content TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 벡터 검색 인덱스
CREATE INDEX idx_content_embeddings_vector
ON content_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 키워드 검색 인덱스 (트라이그램)
CREATE INDEX idx_content_embeddings_trgm
ON content_embeddings USING gin (content gin_trgm_ops);

-- 벡터 전용 유사도 검색 RPC 함수
CREATE OR REPLACE FUNCTION search_content(
    query_embedding vector(768),
    match_threshold float DEFAULT 0.3,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    content_type VARCHAR,
    content_id VARCHAR,
    title VARCHAR,
    content TEXT,
    similarity float
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ce.id, ce.content_type, ce.content_id, ce.title, ce.content,
        1 - (ce.embedding <=> query_embedding) AS similarity
    FROM content_embeddings ce
    WHERE 1 - (ce.embedding <=> query_embedding) > match_threshold
    ORDER BY ce.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- 하이브리드 검색 RPC 함수 (벡터 70% + 키워드 30%)
CREATE OR REPLACE FUNCTION hybrid_search_content(
    query_embedding vector(768),
    query_text text,
    match_threshold float DEFAULT 0.3,
    match_count int DEFAULT 5,
    vector_weight float DEFAULT 0.7,
    keyword_weight float DEFAULT 0.3
)
RETURNS TABLE (
    id UUID,
    content_type VARCHAR,
    content_id VARCHAR,
    title VARCHAR,
    content TEXT,
    similarity float,
    keyword_score float,
    combined_score float
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ce.id, ce.content_type, ce.content_id, ce.title, ce.content,
        (1 - (ce.embedding <=> query_embedding))::float AS similarity,
        COALESCE(similarity(ce.content, query_text), 0)::float AS keyword_score,
        (
            vector_weight * (1 - (ce.embedding <=> query_embedding)) +
            keyword_weight * COALESCE(similarity(ce.content, query_text), 0)
        )::float AS combined_score
    FROM content_embeddings ce
    WHERE
        (1 - (ce.embedding <=> query_embedding)) > match_threshold
        OR similarity(ce.content, query_text) > 0.1
    ORDER BY combined_score DESC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- 대화 기록 테이블
CREATE TABLE tutor_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tutor_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES tutor_conversations(id),
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    sources JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE content_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read embeddings" ON content_embeddings FOR SELECT USING (true);
CREATE POLICY "Users view own conversations" ON tutor_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own conversations" ON tutor_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own messages" ON tutor_messages FOR SELECT USING (
    conversation_id IN (SELECT id FROM tutor_conversations WHERE user_id = auth.uid())
);
```

완료 후 사용자에게 "DB 설정이 완료되었습니다. 다음 단계로 진행할까요?" 확인.

### Step 2: RAG 모듈 구현

프로젝트에 RAG 파이프라인 파일 3개를 생성합니다.

**2-1. 텍스트 청킹 모듈 (chunker.js)**

마크다운 파일을 1000자 단위로 분할합니다 (200자 오버랩).

```javascript
// chunker.js 핵심 함수
function chunkText(text, chunkSize = 1000, overlap = 200) { ... }
function extractTitle(text) { ... }
function removeFrontmatter(text) { ... }
```

**2-2. 임베딩 모듈 (embeddings.js)**

Gemini embedding-001로 벡터를 생성하고, 하이브리드 검색(벡터 70% + 키워드 30%)으로 관련 문서를 찾습니다.

```javascript
// embeddings.js 핵심 함수
async function generateEmbedding(text) { ... }        // 768차원 벡터 생성
async function searchSimilarContent(supabase, queryEmbedding, options) { ... }  // 벡터 전용 검색
async function hybridSearch(supabase, queryEmbedding, queryText, options) { ... } // 하이브리드 검색
async function findRelevantDocuments(supabase, question, options) { ... }       // 통합 (하이브리드 우선)
```

**2-3. 프롬프트 빌더 (prompt-builder.js)**

시스템 프롬프트 + 검색된 문서 컨텍스트를 조합합니다.

```javascript
// prompt-builder.js 핵심
const SYSTEM_PROMPT = `...`;  // 튜터 역할, 규칙, 할루시네이션 방지 지침
function buildPrompt(question, documents) { ... }
function buildPromptWithHistory(question, documents, history) { ... }
```

**2-4. RAG 파이프라인 메인 (index.js)**

```javascript
// index.js - 전체 파이프라인 조율
async function ragPipeline(supabase, question, options) {
    const embedding = await generateEmbedding(question);
    // 하이브리드 검색: 벡터 유사도 70% + 키워드 매칭 30%
    const docs = await hybridSearch(supabase, embedding, question, options);
    const prompt = buildPromptWithHistory(question, docs, options.history);
    return { systemPrompt, userPrompt, sources };
}
```

사용자에게 시스템 프롬프트 내용을 보여주고 "이 프롬프트가 적절한가요? 수정할 부분이 있으면 말씀해주세요." 확인.

### Step 3: 콘텐츠 임베딩 생성

인자로 받은 콘텐츠 폴더의 마크다운 파일들을 임베딩으로 변환합니다.

```bash
node embed-content.js $ARGUMENTS
```

프로세스:
1. 폴더 내 `.md` 파일 목록 수집
2. 각 파일을 청크로 분할 (1000자, 200자 오버랩)
3. 각 청크에 대해 Gemini 임베딩 생성
4. Supabase `content_embeddings` 테이블에 저장

완료 후 사용자에게 보고:
- 처리된 파일 수
- 생성된 청크 수
- 총 임베딩 수

### Step 4: API 엔드포인트 구현

SSE 스트리밍을 지원하는 API를 생성합니다.

```javascript
// ai-tutor-chat.js 처리 흐름
module.exports = async function handler(req, res) {
    // 1. 인증 (JWT Bearer 토큰)
    // 2. 레이트 리밋 (30회/분)
    // 3. 크레딧 잔액 확인
    // 4. RAG 파이프라인 실행
    // 5. Gemini 스트리밍 응답
    // 6. SSE로 프론트엔드에 전송
    // 7. 대화 기록 저장
    // 8. 크레딧 차감
    // 9. 사용 로그 기록
};
```

SSE 이벤트 타입:
- `content` - 응답 텍스트 청크
- `sources` - 참조 문서 목록
- `done` - 완료 신호 (대화 ID, 잔여 크레딧)
- `error` - 에러 메시지

### Step 5: 프론트엔드 채팅 UI

채팅 모달을 구현합니다:

- 메시지 입력 영역 + 전송 버튼
- SSE 스트리밍 수신 및 실시간 렌더링
- 대화 히스토리 사이드바
- 참조 문서 표시
- 마크다운 렌더링 (코드 블록 포함)

### Step 6: 테스트

자동 테스트 스크립트를 생성하여 검증합니다.

```bash
node test-ai-tutor.js
```

테스트 항목:
- 질문에 대해 올바른 문서가 검색되는가
- 할루시네이션 없이 문서 기반으로 답변하는가
- 잘못된 정보(예: 외부 서비스를 자기 서비스로 혼동)가 없는가
- SSE 스트리밍이 정상 작동하는가

## 핵심 설정값

| 항목 | 값 | 설명 |
|------|---|------|
| 임베딩 모델 | embedding-001 | 768차원 벡터 |
| 생성 모델 | gemini-2.0-flash-exp | 스트리밍 지원 |
| 청크 크기 | 1000자 | 오버랩 200자 |
| 벡터 검색 가중치 | 0.7 (70%) | 의미적 유사도 |
| 키워드 검색 가중치 | 0.3 (30%) | 트라이그램 매칭 |
| 유사도 임계값 | 0.3 | 낮을수록 더 많은 문서 매칭 |
| 검색 문서 수 | 5 | 상위 N개 |
| temperature | 0.7 | 응답 다양성 |
| maxOutputTokens | 2048 | 최대 응답 길이 |
| 레이트 리밋 | 30회/분 | 사용자당 |

## 사용 예시

```
/ai-tutor-build docs/학습콘텐츠
/ai-tutor-build content/tutorials
```

## 관련 파일 (구축 후 생성되는 파일들)

- API: `api/ai-tutor-chat.js` - 프로덕션 엔드포인트
- API: `api/ai-tutor-test.js` - 테스트 엔드포인트
- RAG: `rag/index.js` - 파이프라인 메인
- RAG: `rag/embeddings.js` - 임베딩 생성/검색
- RAG: `rag/prompt-builder.js` - 프롬프트 구성
- RAG: `rag/chunker.js` - 텍스트 청킹
- 도구: `embed-content.js` - 콘텐츠 임베딩 스크립트
- 테스트: `test-ai-tutor.js` - 자동 테스트
- 설정: `.env` - API 키, DB 연결 정보

## 사전 준비 (이 스킬을 사용하기 전에)

이 SKILL.md는 **구축 가이드 템플릿**입니다. 아래 항목이 먼저 준비되어 있어야 합니다.

1. **Supabase 프로젝트**: supabase.com에서 프로젝트 생성 + pgvector 확장 활성화
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 필요
2. **Google Gemini API 키**: aistudio.google.com에서 발급
   - `GEMINI_API_KEY` 필요
3. **학습 콘텐츠**: 마크다운(.md) 파일로 준비된 학습 자료
   - 임베딩할 콘텐츠가 최소 수 개 이상 필요
4. **Node.js 환경**: Node.js 18+ 설치
   - 패키지: `@google/generative-ai`, `@supabase/supabase-js`
5. **배포 환경 (선택)**: Vercel 등 서버리스 플랫폼 (SSE 스트리밍 지원 필요)

이 스킬은 위 환경이 갖춰진 상태에서 Claude Code에게 `/ai-tutor-build docs/콘텐츠폴더`를 실행하면, 각 단계를 순서대로 구축해줍니다. 각 단계마다 사용자 확인을 거치므로 안전하게 진행됩니다.
