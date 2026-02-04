# 기능 명세서 (Feature Specification)

**프로젝트:** SSALWorks Dashboard 프로토타입
**작성일:** 2025-12-02
**버전:** 1.0

---

## 목차

1. [Agenda #1: 공지사항 시스템](#agenda-1-공지사항-시스템)
2. [Agenda #2: 학습 콘텐츠 관리 시스템](#agenda-2-학습-콘텐츠-관리-시스템)
3. [Agenda #3: FAQ 시스템](#agenda-3-faq-시스템)

---

## Agenda #1: 공지사항 시스템

### 1.1 개요

사용자에게 중요한 공지사항을 전달하기 위한 시스템입니다. 관리자는 공지사항을 작성/수정/삭제할 수 있으며, 일반 사용자는 공지사항을 조회할 수 있습니다.

### 1.2 주요 기능

#### 1.2.1 공지사항 표시 (Frontend)

**위치:** 우측 사이드바 하단

**기능:**
- 최신 공지사항 3개 표시
- 중요 공지사항 우선 표시 (빨간 아이콘)
- 클릭 시 상세 내용 팝업 표시

**표시 순서:**
1. `important = true` (중요) 공지사항 우선
2. `created_at` 최신순

**제약사항:**
- 최대 3개까지만 표시
- 스크롤 없이 간단히 확인 가능

#### 1.2.2 공지사항 상세 팝업

**동작:**
- 공지사항 항목 클릭 시 팝업 표시
- 팝업 위치: 공지사항 항목 근처 (위 또는 아래, 공간에 따라 자동 결정)
- 팝업 크기: 최대 높이 500px, 너비 600px

**표시 정보:**
- 제목
- 중요 표시 (중요한 공지사항일 경우)
- 작성일
- 내용 (줄바꿈 지원)

**닫기:**
- 배경 클릭 시 닫기
- "닫기" 버튼 클릭 시 닫기

#### 1.2.3 공지사항 관리 (Admin Dashboard)

**위치:** Admin Dashboard > 공지사항 관리 섹션

**CRUD 기능:**

1. **생성 (Create)**
   - 제목 입력 (필수)
   - 내용 입력 (필수)
   - 중요 표시 체크박스
   - "추가" 버튼 클릭 시 저장

2. **조회 (Read)**
   - 전체 공지사항 목록 표시
   - 중요 표시 아이콘 (🔴)
   - 작성일 표시

3. **수정 (Update)**
   - 각 공지사항 옆 [수정] 버튼
   - 기존 내용 불러오기
   - 수정 후 저장

4. **삭제 (Delete)**
   - 각 공지사항 옆 [삭제] 버튼
   - 확인 모달 표시
   - 확인 후 삭제

**통계:**
- 총 공지사항 개수
- 중요 공지사항 개수

### 1.3 데이터 구조

**테이블명:** `notices`

**필드:**
- `id` (UUID, PK): 고유 ID
- `title` (VARCHAR): 제목
- `content` (TEXT): 내용
- `important` (BOOLEAN): 중요 표시 여부
- `created_at` (TIMESTAMP): 작성일
- `updated_at` (TIMESTAMP): 수정일

### 1.4 보안 정책 (RLS)

- **SELECT**: 모든 사용자 (익명 포함)
- **INSERT/UPDATE/DELETE**: 인증된 사용자만 (관리자)

### 1.5 제약사항

- 제목: 최대 200자
- 내용: 제한 없음 (TEXT)
- XSS 방지: DOMPurify 사용

---

## Agenda #2: 학습 콘텐츠 관리 시스템

### 2.1 개요

사용자에게 학습 자료를 체계적으로 제공하기 위한 3단계 계층 구조 시스템입니다. 관리자는 학습 콘텐츠를 추가/수정/삭제할 수 있으며, 사용자는 검색 및 탐색이 가능합니다.

### 2.2 주요 기능

#### 2.2.1 학습 콘텐츠 표시 (Frontend)

**위치:** 우측 사이드바 최상단

**계층 구조:**
- **Depth 1 (대분류)**: 예) 웹개발 기초, 앱개발, 데이터베이스
- **Depth 2 (중분류)**: 예) HTML/CSS, JavaScript, React
- **Depth 3 (소분류)**: 예) HTML 기본 구조, CSS 선택자

**기능:**
- 트리 구조로 표시
- 접기/펼치기 가능
- 소분류 클릭 시 학습 자료 URL로 이동

**데이터 구조:**
- 3개 대분류
- 각 대분류당 5개 중분류
- 각 중분류당 5개 소분류
- **총 75개 학습 콘텐츠** (3 × 5 × 5)

#### 2.2.2 검색 기능

**위치:** 학습 콘텐츠 섹션 상단

**기능:**
- 실시간 검색 (입력 즉시 필터링)
- 검색 대상: depth1, depth2, depth3, description
- 검색 결과 별도 표시 (트리 숨김)
- 검색 결과에 경로 표시 (예: 웹개발 기초 > HTML/CSS > HTML 기본 구조)

**동작:**
1. 검색어 입력
2. 전체 데이터에서 필터링
3. 검색 결과 개수 표시
4. 결과 클릭 시 해당 URL로 이동

**검색 초기화:**
- 검색어 삭제 시 자동 초기화
- ✕ 버튼 클릭 시 초기화

#### 2.2.3 학습 콘텐츠 관리 (Admin Dashboard)

**위치:** Admin Dashboard > 학습 콘텐츠 관리 섹션

**트리 구조 표시:**
- 대분류 (depth1)
  - 중분류 (depth2)
    - 소분류 (depth3): URL, 설명

**CRUD 기능:**

##### 2.2.3.1 생성 (Create)

**Depth1 (대분류) 추가:**
- "대분류 추가" 버튼 클릭
- 이름 입력
- 저장

**Depth2 (중분류) 추가:**
- 대분류 옆 "+중분류" 버튼 클릭
- 이름 입력
- 저장 (자동으로 해당 대분류에 연결)

**Depth3 (소분류) 추가:**
- 중분류 옆 "+소분류" 버튼 클릭
- 이름 입력
- URL 입력
- 설명 입력
- 저장 (자동으로 해당 중분류에 연결)

##### 2.2.3.2 수정 (Update)

- 각 항목 옆 [수정] 버튼
- 기존 내용 불러오기
- 수정 후 저장

##### 2.2.3.3 삭제 (Delete)

**동작:**
- 각 항목 옆 [삭제] 버튼
- 확인 모달 표시

**Cascade 경고:**
- 대분류 삭제 시: "모든 하위 중분류 및 소분류도 함께 삭제됩니다!" 경고
- 중분류 삭제 시: "모든 하위 소분류도 함께 삭제됩니다!" 경고
- 소분류 삭제 시: 단순 삭제

**실제 삭제 방식:**
- Depth1 삭제: `WHERE depth1 = '대분류명'`
- Depth2 삭제: `WHERE depth1 = '대분류명' AND depth2 = '중분류명'`
- Depth3 삭제: `WHERE id = 'UUID'`

**통계:**
- 총 콘텐츠 개수
- 대분류 개수
- 중분류 개수
- 소분류 개수

### 2.3 데이터 구조

**테이블명:** `learning_contents`

**필드:**
- `id` (UUID, PK): 고유 ID
- `depth1` (VARCHAR): 대분류 (필수)
- `depth2` (VARCHAR): 중분류 (nullable)
- `depth3` (VARCHAR): 소분류 (nullable)
- `url` (VARCHAR): 학습 자료 URL (nullable)
- `description` (TEXT): 설명 (nullable)
- `display_order` (INT): 표시 순서 (기본값: 0)
- `created_at` (TIMESTAMP): 작성일
- `updated_at` (TIMESTAMP): 수정일

**계층 구조 표현:**
- Depth1만 있음: 대분류
- Depth1 + Depth2: 중분류
- Depth1 + Depth2 + Depth3: 소분류 (실제 콘텐츠)

### 2.4 보안 정책 (RLS)

- **SELECT**: 모든 사용자 (익명 포함)
- **INSERT/UPDATE/DELETE**: 인증된 사용자만 (관리자)

### 2.5 인덱스

**성능 최적화를 위한 인덱스:**
- `idx_learning_contents_depth1`: depth1
- `idx_learning_contents_depth2`: (depth1, depth2)
- `idx_learning_contents_depth3`: (depth1, depth2, depth3)
- `idx_learning_contents_display_order`: display_order
- `idx_learning_contents_search`: Full-text search (depth1, depth2, depth3)

### 2.6 제약사항

- Depth1/2/3: 최대 100자
- URL: 최대 500자
- Description: 제한 없음 (TEXT)
- 3-column 구조: 10×10×10 = 최대 1,000개 콘텐츠 수용 가능

---

## Agenda #3: FAQ 시스템

### 3.1 개요

사용자의 자주 묻는 질문에 대한 답변을 체계적으로 제공하기 위한 3단계 계층 구조 시스템입니다. **학습 콘텐츠와 동일한 구조**이지만, URL 대신 답변 텍스트를 직접 저장합니다.

### 3.2 주요 기능

#### 3.2.1 FAQ 표시 (Frontend)

**위치:** 우측 사이드바 (학습 콘텐츠 하단)

**계층 구조:**
- **Depth 1 (대분류)**: 예) 로그인/회원가입, Order 작성, AI 기능
- **Depth 2 (중분류)**: 예) 계정 관리, 회원가입, 보안 설정
- **Depth 3 (소분류/질문)**: 예) 비밀번호 재설정, 이메일 인증 오류

**기능:**
- 트리 구조로 표시 (학습 콘텐츠와 동일)
- 접기/펼치기 가능
- 소분류(질문) 클릭 시 답변 모달 표시

**데이터 구조:**
- 3개 대분류
- 각 대분류당 5개 중분류
- 각 중분류당 5개 소분류(질문)
- **총 75개 FAQ** (3 × 5 × 5)

#### 3.2.2 답변 모달

**동작:**
- 질문(depth3) 클릭 시 모달 표시
- 모달 위치: 화면 중앙
- 모달 크기: 최대 너비 700px, 최대 높이 60vh (스크롤 가능)

**표시 정보:**
- 질문(depth3)
- 경로 표시 (예: 📂 로그인/회원가입 > 계정 관리)
- 답변 내용 (HTML 지원)

**디자인:**
- 그라디언트 헤더 (보라색 그라데이션)
- 스크롤 가능한 본문
- hover 효과

**닫기:**
- 배경 클릭 시 닫기
- "닫기" 버튼 클릭 시 닫기
- X 버튼 클릭 시 닫기

#### 3.2.3 FAQ 관리 (Admin Dashboard)

**위치:** Admin Dashboard > FAQ 관리 섹션

**트리 구조 표시:**
- 대분류 (depth1)
  - 중분류 (depth2)
    - 소분류/질문 (depth3): 💬 답변

**CRUD 기능:**

##### 3.2.3.1 생성 (Create)

**Depth1 (대분류) 추가:**
- "대분류 추가" 버튼 클릭
- 이름 입력
- 저장
- **참고**: 임시 depth2, depth3 자동 생성 (나중에 수정 필요)

**Depth2 (중분류) 추가:**
- 대분류 옆 "+중분류" 버튼 클릭
- 이름 입력
- 저장 (자동으로 해당 대분류에 연결)
- **참고**: 임시 depth3 자동 생성 (나중에 수정 필요)

**Depth3 (소분류/질문) 추가:**
- 중분류 옆 "+소분류" 버튼 클릭
- 질문 입력 (depth3)
- **답변 입력 (answer)** - HTML 태그 사용 가능
  - `<p>`, `<ul>`, `<ol>`, `<li>`, `<strong>` 등
  - DOMPurify로 XSS 방지
- 설명 입력 (선택)
- 저장 (자동으로 해당 중분류에 연결)

##### 3.2.3.2 수정 (Update)

- 소분류(질문) 옆 [수정] 버튼
- 기존 내용 불러오기
- 질문 및 답변 수정
- 저장

##### 3.2.3.3 삭제 (Delete)

**동작:**
- 각 항목 옆 [삭제] 버튼
- 확인 모달 표시

**Cascade 경고:**
- 대분류 삭제 시: "모든 하위 중분류 및 소분류도 함께 삭제됩니다!" 경고
- 중분류 삭제 시: "모든 하위 소분류도 함께 삭제됩니다!" 경고
- 소분류 삭제 시: 단순 삭제

**실제 삭제 방식:**
- Depth1 삭제: `WHERE depth1 = '대분류명'`
- Depth2 삭제: `WHERE depth1 = '대분류명' AND depth2 = '중분류명'`
- Depth3 삭제: `WHERE id = 'UUID'`

**통계:**
- 총 FAQ 개수
- 대분류 개수
- 중분류 개수

### 3.3 데이터 구조

**테이블명:** `faqs`

**필드:**
- `id` (UUID, PK): 고유 ID
- `depth1` (TEXT): 대분류 (필수, NOT NULL)
- `depth2` (TEXT): 중분류 (필수, NOT NULL)
- `depth3` (TEXT): 소분류/질문 (필수, NOT NULL)
- `answer` (TEXT): 답변 내용 (필수, NOT NULL, HTML 가능)
- `description` (TEXT): 설명 (선택, nullable)
- `created_at` (TIMESTAMPTZ): 작성일
- `updated_at` (TIMESTAMPTZ): 수정일 (자동 업데이트)

**학습 콘텐츠와의 차이점:**
- 학습 콘텐츠: `url` (VARCHAR, 외부 링크)
- FAQ: `answer` (TEXT, HTML 답변)

**계층 구조 표현:**
- 모든 FAQ는 depth1 + depth2 + depth3 필수
- answer 필드에 답변 저장

### 3.4 보안 정책 (RLS)

- **SELECT**: 모든 사용자 (익명 포함)
- **INSERT/UPDATE/DELETE**: 인증된 사용자만 (관리자)

**개발 환경:**
- anon 키로도 CUD 작업 가능 (테스트 편의성)
- 프로덕션 환경에서는 RLS 강화 예정

### 3.5 인덱스

**성능 최적화를 위한 인덱스:**
- `idx_faqs_depth1`: depth1
- `idx_faqs_depth1_depth2`: (depth1, depth2)
- `idx_faqs_search`: Full-text search (GIN 인덱스, depth1 + depth2 + depth3)
- `idx_faqs_created_at`: created_at (DESC)

**검색 최적화:**
- GIN 인덱스로 전체 텍스트 검색 지원
- 향후 검색 기능 추가 시 활용

### 3.6 제약사항

- Depth1/2/3: 빈 문자열 불가 (`CHECK (char_length(...) > 0)`)
- Answer: 빈 문자열 불가, HTML 가능
- Description: 제한 없음 (TEXT, nullable)
- DOMPurify로 XSS 방지 (Admin Dashboard, Frontend 양쪽)
- 3단계 구조: 최대 1,000개 FAQ 수용 가능

### 3.7 샘플 데이터

**구조: 3×5×5 = 75개 FAQ**

**대분류 (3개):**
1. 로그인/회원가입
2. Order 작성
3. AI 기능

**중분류 예시 (로그인/회원가입):**
1. 계정 관리
2. 회원가입
3. 로그인 문제
4. 보안 설정
5. 계정 복구

**소분류 예시 (계정 관리):**
1. 비밀번호 재설정
2. 이메일 인증 오류
3. 계정 삭제 방법
4. 프로필 수정
5. 이메일 변경

---

## 공통 요구사항

### 기술 스택
- **Backend**: Supabase (PostgreSQL)
- **Frontend**: Vanilla JavaScript (ES6+)
- **보안**: DOMPurify (XSS 방지)
- **인증**: Supabase Auth

### 브라우저 호환성
- Chrome (최신)
- Firefox (최신)
- Edge (최신)
- Safari (최신)

### 반응형 디자인
- 데스크톱 우선
- 최소 화면 너비: 1024px

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2025-12-02 | 1.0 | 초안 작성 | Claude Code |

---

**문서 끝**
