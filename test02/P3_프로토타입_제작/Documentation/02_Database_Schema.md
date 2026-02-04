# 데이터베이스 스키마 설계서 (Database Schema Design)

**프로젝트:** SSALWorks Dashboard 프로토타입
**작성일:** 2025-12-02
**버전:** 1.0

---

## 목차

1. [개요](#개요)
2. [테이블 설계](#테이블-설계)
   - [notices 테이블](#notices-테이블)
   - [learning_contents 테이블](#learning_contents-테이블)
   - [faqs 테이블](#faqs-테이블)
3. [인덱스 전략](#인덱스-전략)
4. [RLS 정책](#rls-정책)
5. [트리거 및 함수](#트리거-및-함수)
6. [ERD](#erd)

---

## 개요

SSALWorks Dashboard는 Supabase(PostgreSQL)를 사용하며, 다음 3개의 주요 테이블로 구성됩니다:

1. **notices**: 공지사항 저장
2. **learning_contents**: 학습 콘텐츠 3단계 계층 구조 저장
3. **faqs**: FAQ 3단계 계층 구조 저장

---

## 테이블 설계

### notices 테이블

#### 목적
사용자에게 공지사항을 전달하기 위한 테이블

#### 스키마

```sql
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    important BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 필드 상세

| 필드명 | 타입 | 제약조건 | 기본값 | 설명 |
|--------|------|----------|--------|------|
| `id` | UUID | PRIMARY KEY | `uuid_generate_v4()` | 고유 식별자 |
| `title` | VARCHAR(200) | NOT NULL | - | 공지사항 제목 |
| `content` | TEXT | NOT NULL | - | 공지사항 내용 |
| `important` | BOOLEAN | - | `FALSE` | 중요 공지 여부 |
| `created_at` | TIMESTAMP | - | `NOW()` | 생성 일시 |
| `updated_at` | TIMESTAMP | - | `NOW()` | 수정 일시 |

#### 인덱스

```sql
CREATE INDEX idx_notices_important ON notices(important);
CREATE INDEX idx_notices_created_at ON notices(created_at DESC);
```

- `idx_notices_important`: 중요 공지사항 필터링 성능 향상
- `idx_notices_created_at`: 최신순 정렬 성능 향상

#### 데이터 특성

- **예상 데이터 크기**: 수십 ~ 수백 건
- **정렬 기준**: `important DESC, created_at DESC`
- **프론트엔드 표시**: 최신 3개만 표시

---

### learning_contents 테이블

#### 목적
학습 자료를 3단계 계층 구조로 저장

#### 스키마

```sql
CREATE TABLE learning_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    depth1 VARCHAR(100) NOT NULL,
    depth2 VARCHAR(100),
    depth3 VARCHAR(100),
    url VARCHAR(500),
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 필드 상세

| 필드명 | 타입 | 제약조건 | 기본값 | 설명 |
|--------|------|----------|--------|------|
| `id` | UUID | PRIMARY KEY | `uuid_generate_v4()` | 고유 식별자 |
| `depth1` | VARCHAR(100) | NOT NULL | - | 대분류 (예: "웹개발 기초") |
| `depth2` | VARCHAR(100) | - | - | 중분류 (예: "HTML/CSS") |
| `depth3` | VARCHAR(100) | - | - | 소분류 (예: "HTML 기본 구조") |
| `url` | VARCHAR(500) | - | - | 학습 자료 URL |
| `description` | TEXT | - | - | 설명 |
| `display_order` | INT | - | `0` | 표시 순서 |
| `created_at` | TIMESTAMP | - | `NOW()` | 생성 일시 |
| `updated_at` | TIMESTAMP | - | `NOW()` | 수정 일시 |

#### 계층 구조 표현 방식

3-column 방식을 사용하여 계층을 표현합니다:

**Depth1 (대분류만):**
```sql
INSERT INTO learning_contents (depth1, depth2, depth3)
VALUES ('웹개발 기초', NULL, NULL);
```

**Depth2 (중분류):**
```sql
INSERT INTO learning_contents (depth1, depth2, depth3)
VALUES ('웹개발 기초', 'HTML/CSS', NULL);
```

**Depth3 (소분류 - 실제 콘텐츠):**
```sql
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order)
VALUES ('웹개발 기초', 'HTML/CSS', 'HTML 기본 구조',
        'https://www.youtube.com/watch?v=example1',
        'HTML 문서의 기본 구조',
        1);
```

#### 인덱스

```sql
-- 계층별 조회 성능 향상
CREATE INDEX idx_learning_contents_depth1 ON learning_contents(depth1);
CREATE INDEX idx_learning_contents_depth2 ON learning_contents(depth1, depth2);
CREATE INDEX idx_learning_contents_depth3 ON learning_contents(depth1, depth2, depth3);

-- 정렬 성능 향상
CREATE INDEX idx_learning_contents_display_order ON learning_contents(display_order);

-- 전체 텍스트 검색 (Full-text search)
CREATE INDEX idx_learning_contents_search ON learning_contents
    USING gin(to_tsvector('simple',
        coalesce(depth1, '') || ' ' ||
        coalesce(depth2, '') || ' ' ||
        coalesce(depth3, '')
    ));
```

- `idx_learning_contents_depth1/2/3`: 계층별 필터링 성능 향상
- `idx_learning_contents_display_order`: 순서대로 정렬 시 성능 향상
- `idx_learning_contents_search`: 검색 기능 성능 향상 (GIN 인덱스)

#### 데이터 구조 설계

**5×5 구조:**
- 3개 대분류
- 각 대분류당 5개 중분류
- 각 중분류당 5개 소분류
- **총 75개 콘텐츠** (3 × 5 × 5)

**확장 가능성:**
- 3-column 구조는 최대 **10×10×10 = 1,000개**까지 수용 가능
- 더 많은 depth가 필요하면 `depth4`, `depth5` 컬럼 추가 가능

**예시 데이터:**

| depth1 | depth2 | depth3 | url | description |
|--------|--------|--------|-----|-------------|
| 웹개발 기초 | HTML/CSS | HTML 기본 구조 | https://... | HTML 문서의 기본 구조 |
| 웹개발 기초 | HTML/CSS | CSS 선택자 | https://... | CSS 선택자 종류 |
| 웹개발 기초 | JavaScript | JavaScript 기초 | https://... | 변수, 함수, 조건문 |
| 앱개발 | React Native | 시작하기 | https://... | 환경 설정 |
| 데이터베이스 | SQL | SELECT 문 | https://... | 데이터 조회 |

#### 쿼리 예시

**대분류 전체 조회:**
```sql
SELECT DISTINCT depth1 FROM learning_contents ORDER BY depth1;
```

**특정 대분류의 중분류 조회:**
```sql
SELECT DISTINCT depth2
FROM learning_contents
WHERE depth1 = '웹개발 기초'
ORDER BY depth2;
```

**특정 중분류의 소분류 (실제 콘텐츠) 조회:**
```sql
SELECT *
FROM learning_contents
WHERE depth1 = '웹개발 기초'
  AND depth2 = 'HTML/CSS'
  AND depth3 IS NOT NULL
ORDER BY display_order;
```

**전체 트리 구조 조회:**
```sql
SELECT *
FROM learning_contents
ORDER BY depth1, depth2, display_order;
```

---

### faqs 테이블

#### 목적
FAQ(자주 묻는 질문)를 3단계 계층 구조로 저장

#### 스키마

```sql
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    depth1 TEXT NOT NULL CHECK (char_length(depth1) > 0),
    depth2 TEXT NOT NULL CHECK (char_length(depth2) > 0),
    depth3 TEXT NOT NULL CHECK (char_length(depth3) > 0),
    answer TEXT NOT NULL CHECK (char_length(answer) > 0),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

#### 필드 상세

| 필드명 | 타입 | 제약조건 | 기본값 | 설명 |
|--------|------|----------|--------|------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | 고유 식별자 |
| `depth1` | TEXT | NOT NULL, CHECK | - | 대분류 (예: "로그인/회원가입") |
| `depth2` | TEXT | NOT NULL, CHECK | - | 중분류 (예: "계정 관리") |
| `depth3` | TEXT | NOT NULL, CHECK | - | 소분류/질문 (예: "비밀번호 재설정 방법은?") |
| `answer` | TEXT | NOT NULL, CHECK | - | 답변 내용 (HTML 지원) |
| `description` | TEXT | - | - | 설명 (선택사항) |
| `created_at` | TIMESTAMPTZ | NOT NULL | `now()` | 생성 일시 |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `now()` | 수정 일시 |

#### 계층 구조 표현 방식

3-column 방식을 사용하여 계층을 표현합니다 (learning_contents와 동일):

**FAQ 레코드 (질문+답변):**
```sql
INSERT INTO faqs (depth1, depth2, depth3, answer, description)
VALUES ('로그인/회원가입', '계정 관리', '비밀번호 재설정',
        '<p><strong>비밀번호 재설정 방법:</strong></p>
         <ol>
         <li>로그인 페이지에서 "비밀번호 찾기" 클릭</li>
         <li>가입한 이메일 주소 입력</li>
         <li>이메일로 받은 인증 링크 클릭</li>
         <li>새 비밀번호 입력 및 확인</li>
         </ol>
         <p>💡 이메일이 오지 않으면 스팸함을 확인해주세요.</p>',
        '비밀번호를 잊어버렸을 때 재설정하는 방법');
```

**learning_contents와의 차이점:**
- `learning_contents`: `url` 필드 (Google Drive 링크 등)
- `faqs`: `answer` 필드 (HTML 답변 텍스트)

#### 인덱스

```sql
-- 계층별 조회 성능 향상
CREATE INDEX idx_faqs_depth1 ON faqs(depth1);
CREATE INDEX idx_faqs_depth1_depth2 ON faqs(depth1, depth2);

-- 전체 텍스트 검색 (Full-text search)
CREATE INDEX idx_faqs_search ON faqs
    USING gin(to_tsvector('english',
        coalesce(depth1, '') || ' ' ||
        coalesce(depth2, '') || ' ' ||
        coalesce(depth3, '') || ' ' ||
        coalesce(answer, '')
    ));

-- 생성일 기준 정렬
CREATE INDEX idx_faqs_created_at ON faqs(created_at DESC);
```

- `idx_faqs_depth1`: 대분류 필터링 성능 향상
- `idx_faqs_depth1_depth2`: 중분류 필터링 성능 향상
- `idx_faqs_search`: 검색 기능 성능 향상 (GIN 인덱스, answer 포함)
- `idx_faqs_created_at`: 최신 FAQ 조회 성능 향상

#### 데이터 구조 설계

**3×5×5 구조:**
- 3개 대분류 (로그인/회원가입, Order 작성, AI 기능)
- 각 대분류당 5개 중분류
- 각 중분류당 5개 소분류 (질문+답변)
- **총 75개 FAQ** (3 × 5 × 5)

**확장 가능성:**
- 3-column 구조는 learning_contents와 동일
- 필요 시 더 많은 대분류/중분류 추가 가능
- depth 추가 확장은 learning_contents와 동일한 방식

**예시 데이터:**

| depth1 | depth2 | depth3 | answer (요약) | description |
|--------|--------|--------|---------------|-------------|
| 로그인/회원가입 | 계정 관리 | 비밀번호 재설정 | `<p>비밀번호 재설정 방법...</p>` | 비밀번호를 잊어버렸을 때 |
| 로그인/회원가입 | 계정 관리 | 이메일 인증 오류 | `<p>이메일 인증 오류 해결...</p>` | 인증 메일이 오지 않을 때 |
| Order 작성 | 기본 작성법 | 첫 Order 작성 | `<p>첫 Order 작성 가이드...</p>` | Order 시스템 사용법 |
| AI 기능 | AI 사용법 | AI 코드 생성 | `<p>AI로 코드 생성하는 법...</p>` | AI 기능 활용법 |

#### 쿼리 예시

**대분류 전체 조회:**
```sql
SELECT DISTINCT depth1 FROM faqs ORDER BY depth1;
```

**특정 대분류의 중분류 조회:**
```sql
SELECT DISTINCT depth2
FROM faqs
WHERE depth1 = '로그인/회원가입'
ORDER BY depth2;
```

**특정 중분류의 FAQ (질문+답변) 조회:**
```sql
SELECT *
FROM faqs
WHERE depth1 = '로그인/회원가입'
  AND depth2 = '계정 관리'
ORDER BY depth3;
```

**전체 트리 구조 조회:**
```sql
SELECT *
FROM faqs
ORDER BY depth1, depth2, depth3;
```

**답변 검색 (Full-text search):**
```sql
SELECT *
FROM faqs
WHERE to_tsvector('english',
    coalesce(depth1, '') || ' ' ||
    coalesce(depth2, '') || ' ' ||
    coalesce(depth3, '') || ' ' ||
    coalesce(answer, '')
) @@ to_tsquery('english', '비밀번호');
```

---

## 인덱스 전략

### notices 테이블 인덱스

```sql
-- 중요 공지사항 필터링
CREATE INDEX idx_notices_important ON notices(important);

-- 최신순 정렬
CREATE INDEX idx_notices_created_at ON notices(created_at DESC);
```

**쿼리 최적화:**
```sql
-- 이 쿼리는 위 인덱스들을 활용
SELECT * FROM notices
ORDER BY important DESC, created_at DESC
LIMIT 3;
```

### learning_contents 테이블 인덱스

```sql
-- 계층별 조회 (depth1만)
CREATE INDEX idx_learning_contents_depth1 ON learning_contents(depth1);

-- 계층별 조회 (depth1 + depth2)
CREATE INDEX idx_learning_contents_depth2 ON learning_contents(depth1, depth2);

-- 계층별 조회 (전체)
CREATE INDEX idx_learning_contents_depth3 ON learning_contents(depth1, depth2, depth3);

-- 정렬용
CREATE INDEX idx_learning_contents_display_order ON learning_contents(display_order);

-- 검색용 (Full-text search)
CREATE INDEX idx_learning_contents_search ON learning_contents
    USING gin(to_tsvector('simple',
        coalesce(depth1, '') || ' ' ||
        coalesce(depth2, '') || ' ' ||
        coalesce(depth3, '')
    ));
```

**쿼리 최적화 예시:**

1. **대분류 필터링** → `idx_learning_contents_depth1` 사용
```sql
SELECT * FROM learning_contents WHERE depth1 = '웹개발 기초';
```

2. **중분류 필터링** → `idx_learning_contents_depth2` 사용
```sql
SELECT * FROM learning_contents
WHERE depth1 = '웹개발 기초' AND depth2 = 'HTML/CSS';
```

3. **검색** → `idx_learning_contents_search` 사용
```sql
SELECT * FROM learning_contents
WHERE to_tsvector('simple',
    coalesce(depth1, '') || ' ' ||
    coalesce(depth2, '') || ' ' ||
    coalesce(depth3, '')
) @@ to_tsquery('simple', 'HTML');
```

### faqs 테이블 인덱스

```sql
-- 계층별 조회 (depth1만)
CREATE INDEX idx_faqs_depth1 ON faqs(depth1);

-- 계층별 조회 (depth1 + depth2)
CREATE INDEX idx_faqs_depth1_depth2 ON faqs(depth1, depth2);

-- 검색용 (Full-text search, answer 포함)
CREATE INDEX idx_faqs_search ON faqs
    USING gin(to_tsvector('english',
        coalesce(depth1, '') || ' ' ||
        coalesce(depth2, '') || ' ' ||
        coalesce(depth3, '') || ' ' ||
        coalesce(answer, '')
    ));

-- 생성일 기준 정렬
CREATE INDEX idx_faqs_created_at ON faqs(created_at DESC);
```

**쿼리 최적화 예시:**

1. **대분류 필터링** → `idx_faqs_depth1` 사용
```sql
SELECT * FROM faqs WHERE depth1 = '로그인/회원가입';
```

2. **중분류 필터링** → `idx_faqs_depth1_depth2` 사용
```sql
SELECT * FROM faqs
WHERE depth1 = '로그인/회원가입' AND depth2 = '계정 관리';
```

3. **검색 (답변 포함)** → `idx_faqs_search` 사용
```sql
SELECT * FROM faqs
WHERE to_tsvector('english',
    coalesce(depth1, '') || ' ' ||
    coalesce(depth2, '') || ' ' ||
    coalesce(depth3, '') || ' ' ||
    coalesce(answer, '')
) @@ to_tsquery('english', '비밀번호');
```

---

## RLS 정책

### notices 테이블 RLS

```sql
-- RLS 활성화
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 조회 가능
CREATE POLICY "Anyone can view notices" ON notices
    FOR SELECT
    USING (true);

-- 인증된 사용자만 추가 가능
CREATE POLICY "Only admins can insert notices" ON notices
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 수정 가능
CREATE POLICY "Only admins can update notices" ON notices
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 삭제 가능
CREATE POLICY "Only admins can delete notices" ON notices
    FOR DELETE
    USING (auth.role() = 'authenticated');
```

### learning_contents 테이블 RLS

```sql
-- RLS 활성화
ALTER TABLE learning_contents ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 조회 가능
CREATE POLICY "Anyone can view learning contents" ON learning_contents
    FOR SELECT
    USING (true);

-- 인증된 사용자만 추가 가능
CREATE POLICY "Only admins can insert learning contents" ON learning_contents
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 수정 가능
CREATE POLICY "Only admins can update learning contents" ON learning_contents
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 삭제 가능
CREATE POLICY "Only admins can delete learning contents" ON learning_contents
    FOR DELETE
    USING (auth.role() = 'authenticated');
```

### faqs 테이블 RLS

```sql
-- RLS 활성화
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 조회 가능
CREATE POLICY "faqs_select_all" ON faqs
    FOR SELECT
    USING (true);

-- 인증된 사용자만 추가 가능
CREATE POLICY "faqs_insert_authenticated" ON faqs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 인증된 사용자만 수정 가능
CREATE POLICY "faqs_update_authenticated" ON faqs
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 인증된 사용자만 삭제 가능
CREATE POLICY "faqs_delete_authenticated" ON faqs
    FOR DELETE
    TO authenticated
    USING (true);
```

**정책 요약:**
- **SELECT**: 익명 사용자 포함 모든 사용자 가능
- **INSERT/UPDATE/DELETE**: `authenticated` 역할만 가능 (Admin Dashboard에서만 사용)

**3개 테이블 공통 RLS 패턴:**
- 모든 테이블이 동일한 RLS 정책 사용
- Public read, authenticated write 패턴
- 프론트엔드: 읽기 전용 (anon key)
- Admin Dashboard: 읽기/쓰기 (authenticated key)

---

## 트리거 및 함수

### notices 테이블 updated_at 자동 업데이트

```sql
-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_notices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_update_notices_updated_at
    BEFORE UPDATE ON notices
    FOR EACH ROW
    EXECUTE FUNCTION update_notices_updated_at();
```

### learning_contents 테이블 updated_at 자동 업데이트

```sql
-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_learning_contents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_update_learning_contents_updated_at
    BEFORE UPDATE ON learning_contents
    FOR EACH ROW
    EXECUTE FUNCTION update_learning_contents_updated_at();
```

### faqs 테이블 updated_at 자동 업데이트

```sql
-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_faqs_updated_at();
```

**동작:**
- `UPDATE` 문 실행 시 자동으로 `updated_at` 필드를 현재 시간으로 업데이트

**3개 테이블 공통 트리거 패턴:**
- 모든 테이블이 동일한 `updated_at` 자동 업데이트 트리거 사용
- `BEFORE UPDATE` 시점에 실행
- 데이터 수정 이력 추적에 활용

---

## ERD

### notices 테이블

```
┌─────────────────────────────────┐
│         notices                 │
├─────────────────────────────────┤
│ 🔑 id (UUID) PK                 │
│ title (VARCHAR(200)) NOT NULL   │
│ content (TEXT) NOT NULL         │
│ important (BOOLEAN)             │
│ created_at (TIMESTAMP)          │
│ updated_at (TIMESTAMP)          │
└─────────────────────────────────┘
```

### learning_contents 테이블

```
┌─────────────────────────────────┐
│    learning_contents            │
├─────────────────────────────────┤
│ 🔑 id (UUID) PK                 │
│ depth1 (VARCHAR(100)) NOT NULL  │
│ depth2 (VARCHAR(100))           │
│ depth3 (VARCHAR(100))           │
│ url (VARCHAR(500))              │
│ description (TEXT)              │
│ display_order (INT)             │
│ created_at (TIMESTAMP)          │
│ updated_at (TIMESTAMP)          │
└─────────────────────────────────┘
```

### faqs 테이블

```
┌─────────────────────────────────┐
│            faqs                 │
├─────────────────────────────────┤
│ 🔑 id (UUID) PK                 │
│ depth1 (TEXT) NOT NULL          │
│ depth2 (TEXT) NOT NULL          │
│ depth3 (TEXT) NOT NULL          │
│ answer (TEXT) NOT NULL          │
│ description (TEXT)              │
│ created_at (TIMESTAMPTZ)        │
│ updated_at (TIMESTAMPTZ)        │
└─────────────────────────────────┘
```

### 계층 구조 시각화

**learning_contents 테이블 (학습 콘텐츠):**
```
웹개발 기초 (depth1)
├── HTML/CSS (depth2)
│   ├── HTML 기본 구조 (depth3) → URL, description
│   ├── CSS 선택자 (depth3) → URL, description
│   └── ...
├── JavaScript (depth2)
│   ├── JavaScript 기초 (depth3) → URL, description
│   └── ...
└── ...

앱개발 (depth1)
├── React Native (depth2)
│   ├── 시작하기 (depth3) → URL, description
│   └── ...
└── ...
```

**faqs 테이블 (FAQ):**
```
로그인/회원가입 (depth1)
├── 계정 관리 (depth2)
│   ├── 비밀번호 재설정 (depth3) → answer (HTML), description
│   ├── 이메일 인증 오류 (depth3) → answer (HTML), description
│   ├── 계정 삭제 방법 (depth3) → answer (HTML), description
│   └── ...
├── 회원가입 (depth2)
│   ├── 회원가입 방법 (depth3) → answer (HTML), description
│   └── ...
└── ...

Order 작성 (depth1)
├── 기본 작성법 (depth2)
│   ├── 첫 Order 작성 (depth3) → answer (HTML), description
│   └── ...
└── ...

AI 기능 (depth1)
├── AI 사용법 (depth2)
│   ├── AI 코드 생성 (depth3) → answer (HTML), description
│   └── ...
└── ...
```

**구조 비교:**
- **learning_contents**: depth3에 `url` 필드 (외부 링크)
- **faqs**: depth3에 `answer` 필드 (HTML 답변 텍스트)
- 두 테이블 모두 동일한 3단계 계층 구조 사용

---

## 데이터베이스 설계 의사결정

### 1. 왜 3-column 구조를 선택했는가?

**고려한 대안:**

**대안 1: Adjacency List (인접 리스트)**
```sql
CREATE TABLE learning_contents (
    id UUID PRIMARY KEY,
    parent_id UUID REFERENCES learning_contents(id),
    name VARCHAR(100),
    ...
);
```

**단점:**
- 계층 깊이 조회가 복잡 (재귀 쿼리 필요)
- 성능 저하 가능성

**대안 2: Closure Table (폐쇄 테이블)**
```sql
CREATE TABLE learning_contents (...);
CREATE TABLE learning_contents_tree (
    ancestor UUID,
    descendant UUID,
    depth INT
);
```

**단점:**
- 복잡한 구조
- 관리 오버헤드

**선택: 3-column 구조**
```sql
CREATE TABLE learning_contents (
    depth1 VARCHAR(100),
    depth2 VARCHAR(100),
    depth3 VARCHAR(100),
    ...
);
```

**장점:**
- ✅ 간단한 쿼리
- ✅ 빠른 조회 성능
- ✅ 이해하기 쉬움
- ✅ 고정된 3단계 계층에 최적화

**제약사항:**
- ❌ 계층 깊이가 고정됨 (3단계)
- ❌ 4단계 이상 필요 시 스키마 변경 필요

**결론:**
- 현재 요구사항 (3단계 고정)에 가장 적합
- 성능과 단순성의 균형

### 2. Full-text Search vs LIKE 검색

**선택: GIN 인덱스 + to_tsvector**

```sql
CREATE INDEX idx_learning_contents_search ON learning_contents
    USING gin(to_tsvector('simple', ...));
```

**이유:**
- `LIKE '%검색어%'`는 인덱스를 사용할 수 없음
- Full-text search는 대량 데이터에서도 빠른 성능
- 향후 검색 기능 확장 가능 (가중치, 랭킹 등)

---

## 성능 고려사항

### notices 테이블
- **예상 데이터**: ~100건
- **조회 빈도**: 매우 높음 (모든 페이지 로드 시)
- **최적화**: 인덱스 + 최신 3개만 조회

### learning_contents 테이블
- **예상 데이터**: ~75건 (확장 시 ~1,000건)
- **조회 빈도**: 높음
- **최적화**:
  - 계층별 인덱스
  - Full-text search 인덱스
  - 클라이언트 사이드 캐싱 (전체 데이터 로드 후 메모리에 저장)

### faqs 테이블
- **예상 데이터**: ~75건 (확장 시 ~500건)
- **조회 빈도**: 높음
- **최적화**:
  - 계층별 인덱스 (depth1, depth1+depth2)
  - Full-text search 인덱스 (answer 포함)
  - 클라이언트 사이드 캐싱 (전체 데이터 로드 후 메모리에 저장)
  - DOMPurify를 사용한 XSS 방지 (HTML 답변 정화)

**3개 테이블 공통 성능 전략:**
- 모든 테이블에 적절한 인덱스 설정
- 프론트엔드에서 초기 로드 후 메모리 캐싱
- RLS 정책으로 보안 유지하면서 성능 최적화

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2025-12-02 | 1.0 | 초안 작성 (notices, learning_contents) | Claude Code |
| 2025-12-02 | 1.1 | faqs 테이블 추가 (Agenda #3) | Claude Code |

---

**문서 끝**
