# Claude Code가 Supabase에 직접 CRUD 하는 방법

> Claude Code는 Supabase 데이터베이스에 직접 데이터를 생성/조회/수정/삭제할 수 있습니다.
> 이 문서는 그 방법들을 설명하고, 어떤 방법을 우선 사용해야 하는지 안내합니다.

---

## CRUD란?

데이터베이스의 4가지 기본 작업입니다.

| 영어 | 한글 | SQL 명령어 | HTTP 메서드 | 예시 |
|------|------|-----------|-------------|------|
| **C**reate | 생성 | INSERT | POST | 새 Task 등록 |
| **R**ead | 조회 | SELECT | GET | Task 목록 보기 |
| **U**pdate | 수정 | UPDATE | PATCH | Task 상태 변경 |
| **D**elete | 삭제 | DELETE | DELETE | Task 삭제 |

---

## AI가 할 수 있는 것 vs PO(Project Owner; 사람)가 해야 하는 것

### DML vs DDL 구분

데이터베이스 작업은 두 종류로 나뉩니다.

| 구분 | 의미 | 예시 | Claude Code 직접 실행 |
|------|------|------|:--------------------:|
| **DML** | 데이터 조작 | INSERT, SELECT, UPDATE, DELETE | ✅ 가능 (REST API) |
| **DDL** | 스키마 정의 | CREATE TABLE, ALTER TABLE, CREATE FUNCTION | ❌ 불가능 |

### Claude Code가 직접 할 수 있는 작업

**DML (Data Manipulation Language)** - REST API로 직접 실행 가능:
- 데이터 조회 (SELECT)
- 데이터 추가 (INSERT)
- 데이터 수정 (UPDATE)
- 데이터 삭제 (DELETE)

### Claude Code가 직접 할 수 없는 작업 (PO 실행 필요)

**DDL (Data Definition Language)** - SQL 파일 생성 후 PO에게 요청:
- 테이블 생성/수정 (CREATE TABLE, ALTER TABLE)
- 컬럼 추가/삭제 (ADD COLUMN, DROP COLUMN)
- 인덱스 생성 (CREATE INDEX)
- 함수/트리거 생성 (CREATE FUNCTION, CREATE TRIGGER)
- RLS 정책 생성/수정 (CREATE POLICY)

**DDL을 직접 실행할 수 없는 이유:**
1. Supabase REST API는 DML만 지원하고, DDL은 지원하지 않음
2. Supabase MCP가 설정되어 있지 않거나 연결 불안정
3. Supabase CLI가 설치되어 있지 않음

**DDL 작업 시 Claude Code가 해야 할 일:**
1. SQL 파일 작성 (예: `05_add_builder_id.sql`)
2. PO에게 요청: "Supabase Dashboard > SQL Editor에서 실행해주세요"
3. 실행할 SQL 코드를 복사 가능하게 제공

### 기타 PO(Project Owner; 사람)가 직접 해야 하는 작업

| 작업 | 이유 | 어디서? |
|------|------|---------|
| OAuth Provider 설정 | AI 도구 미지원 | Dashboard > Auth > Providers |
| API 키 재생성 | 보안상 이유 | Dashboard > Project Settings |
| 환경 변수 배포 | 외부 서비스 | Vercel Dashboard |
| 프로젝트 생성/삭제 | 중요 작업 | Supabase Dashboard |

---

## 방법 1: REST API (Node.js로 직접 호출)

Supabase는 모든 테이블에 자동으로 REST API를 제공합니다. Node.js의 `https` 모듈로 이 API를 직접 호출하면 됩니다.

**장점**: MCP 연결 상태와 무관하게 항상 작동합니다. 가장 안정적인 방법입니다.

**작동 방식**:
- URL 형식: `https://{프로젝트ID}.supabase.co/rest/v1/{테이블명}`
- 인증: HTTP 헤더에 `apikey`와 `Authorization`에 Service Role Key 포함
- 조건 지정: URL 쿼리 파라미터로 조건 추가 (예: `?task_id=eq.S5U2`)

**쿼리 연산자**:
- `eq` (=), `neq` (≠), `gt` (>), `gte` (≥), `lt` (<), `lte` (≤)
- `like` (패턴 매칭), `in` (여러 값 중 하나)

---

## 방법 2: Supabase MCP (Model Context Protocol)

Claude Code에 Supabase MCP 서버가 연결되어 있으면, 자연어로 데이터베이스 작업을 지시할 수 있습니다.

**장점**: 자연어로 편하게 요청 가능. "users 테이블에 새 사용자 추가해줘"처럼 말하면 됩니다.

**단점**: Windows 환경에서 한글 인코딩 문제, 연결 타임아웃 등으로 불안정할 수 있습니다.

**주요 도구**:
- `apply_migration`: 테이블 생성/수정 등 스키마 변경 (DDL)
- `execute_sql`: 데이터 조회/추가/수정/삭제 (DML)

**연결 확인**: `claude mcp list` 명령어로 supabase가 보이면 연결된 상태입니다.

---

## 방법 3: Supabase CLI

Supabase CLI가 설치되어 있으면 터미널에서 직접 SQL을 실행할 수 있습니다.

**장점**: 마이그레이션 파일 관리, 버전 관리에 유용합니다.

**단점**: 별도 설치가 필요합니다.

**주요 명령어**:
- `supabase status`: 연결 상태 확인
- `supabase db execute "SQL문"`: SQL 직접 실행
- `supabase db push`: 마이그레이션 적용

---

## 방법 4: curl 명령어

터미널에서 curl로 REST API를 직접 호출하는 방법입니다.

**장점**: 간단한 테스트에 유용합니다.

**단점**: Windows에서는 따옴표 처리 문제로 자주 실패합니다. 한글이 포함된 데이터도 인코딩 문제가 발생할 수 있습니다. Linux/Mac에서는 잘 작동합니다.

---

## 방법 5: Dashboard SQL Editor (수동)

Supabase Dashboard의 SQL Editor에서 직접 쿼리를 실행하는 방법입니다.

**사용 시점**: 위의 모든 방법이 안 될 때 최후 수단으로 사용합니다.

**작업 흐름**:
1. Claude Code가 SQL 파일을 생성
2. PO(사람)가 Dashboard > SQL Editor에서 해당 SQL을 복사하여 실행

---

## PO(사람)에게 요청해야 하는 경우

Claude Code는 기본적으로 직접 실행해야 합니다. 하지만 아래 조건을 **모두** 만족할 때는 PO에게 요청할 수 있습니다.

**PO 요청 조건 (모두 충족 시):**
1. REST API 시도 → 실패 (3회 이상)
2. MCP 시도 → 실패 또는 연결 안 됨
3. CLI 시도 → 설치 안 됨 또는 실패

**위 3가지 모두 실패한 경우에만:**
- Claude Code: "모든 방법 시도 후 실패했습니다. Dashboard에서 실행해주세요."
- SQL 파일 생성하여 PO에게 제공
- PO가 Dashboard > SQL Editor에서 실행

---

## 방법별 우선순위

위 5가지 방법을 모두 이해했다면, 아래 우선순위에 따라 선택하세요.

| 순위 | 방법 | 안정성 | 권장 상황 |
|:----:|------|:------:|----------|
| **1** | REST API (Node.js) | 매우 안정 | 기본으로 사용 |
| 2 | Supabase MCP | 불안정 | MCP 연결이 잘 될 때 |
| 3 | Supabase CLI | 안정 | CLI 설치되어 있을 때 |
| 4 | curl | Windows 이슈 | Linux/Mac 환경 |
| 5 | Dashboard SQL Editor | 안정 | 최후 수단 (수동) |

**결정 흐름**:
```
REST API → MCP → CLI → Dashboard
```

---

## API 키 종류

Supabase는 두 종류의 API 키를 제공합니다.

| 키 | RLS 정책 | 용도 | 주의사항 |
|----|:--------:|------|----------|
| Anon Key | 적용됨 | 웹/앱 클라이언트 | 공개 가능 |
| Service Role Key | 무시됨 | 서버, AI 작업 | **절대 공개 금지** |

Claude Code가 데이터베이스 작업을 할 때는 Service Role Key를 사용합니다. 이 키는 RLS(Row Level Security) 정책을 우회하므로 모든 데이터에 접근할 수 있습니다.

---

## Anon Key로 DELETE가 안 되는 이유

Supabase의 RLS(Row Level Security) 정책은 기본적으로 **anon 키로는 DELETE를 허용하지 않습니다**.

**실제 사례:**
```javascript
// anon 키로 삭제 시도
const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

// error가 null이어도 실제로 삭제되지 않음!
// RLS 정책이 차단하지만, 에러 없이 조용히 실패함
```

**해결 방법:**

| 방법 | 설명 |
|------|------|
| Service Role Key 사용 | RLS 우회 가능, 서버 환경에서만 사용 |
| Dashboard에서 직접 삭제 | Table Editor 또는 SQL Editor 사용 |
| RLS 정책 수정 | DELETE 정책 추가 (보안 주의) |

**중요:** Anon Key로 `delete()` 호출 시 에러 없이 성공처럼 보여도 실제 삭제가 안 될 수 있습니다. 반드시 삭제 후 데이터를 다시 조회하여 확인하세요.

**Claude Code가 해야 할 일:**

Anon Key로 DELETE 시도 후 실패하면 (또는 Service Role Key가 없으면):
1. 삭제할 데이터의 조건을 명확히 파악
2. DELETE SQL 쿼리 작성
3. PO에게 요청: "Dashboard > SQL Editor에서 이 SQL을 실행해주세요"

```
예시 요청:
"아래 SQL을 Supabase Dashboard > SQL Editor에서 실행해주세요:

DELETE FROM users WHERE email NOT IN ('keep@example.com', 'admin@example.com');"
```

---

## 환경변수 위치

```
P3_프로토타입_제작/Database/.env
```

이 파일에 `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`가 저장되어 있습니다.

---

*상세 내용: `.claude/methods/01_supabase-crud.md` 참조*
