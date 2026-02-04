# Admin → Database → Frontend 통합 검토 아젠다

**작성일**: 2025-12-01
**목적**: 3단계 플로우를 아젠다별로 한 번에 검토

---

## 📋 아젠다 #1: 공지사항 (Notices)

### 1️⃣ Admin Dashboard (입력)

**화면**: 공지사항 관리 섹션
```
┌─────────────────────────────────────┐
│  📢 공지사항 관리                     │
├─────────────────────────────────────┤
│  [+ 새 공지사항 추가]                 │
│                                      │
│  공지사항 목록:                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🔴 시스템 점검 안내 [수정] [삭제]    │
│  📌 업데이트 소식 [수정] [삭제]       │
└─────────────────────────────────────┘
```

**입력 폼**:
```
제목: [___________________________]
내용: [___________________________]
      [___________________________]
      (여러 줄)

[✓] 중요 공지로 표시
상태: (•) 게시 ( ) 임시저장

[저장] [취소]
```

**기능**:
- 제목, 내용 입력 (DOMPurify Sanitization 적용)
- 중요 공지 체크박스
- 게시 상태 선택 (published/draft)
- 저장 버튼 → Supabase INSERT

**현재 구현 상태**: ⚠️ Admin에 구조만 있음 (CRUD 미구현)

---

### 2️⃣ Database (저장)

**테이블**: `notices`
```sql
CREATE TABLE notices (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,           -- Admin 입력
    content TEXT NOT NULL,          -- Admin 입력
    important BOOLEAN DEFAULT false, -- Admin 체크박스
    status TEXT DEFAULT 'published', -- Admin 선택
    created_by UUID,                -- Admin 사용자 ID
    created_at TIMESTAMPTZ,         -- 자동 생성
    updated_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ
);
```

**Mock 데이터**:
```sql
INSERT INTO notices (title, content, important, status) VALUES
('시스템 점검 안내', '2025년 12월 1일...', true, 'published'),
('11월 업데이트 소식', '새로운 기능...', false, 'published'),
('크레딧 정책 변경', '크레딧 정책...', false, 'published');
```

**API 엔드포인트** (필요):
- `POST /api/admin/notices` - Admin이 작성
- `PUT /api/admin/notices/:id` - Admin이 수정
- `DELETE /api/admin/notices/:id` - Admin이 삭제
- `GET /api/notices` - Frontend가 조회

---

### 3️⃣ Frontend (표시)

**화면**: 공지사항 섹션
```
┌─────────────────────────────────────┐
│  📢 공지사항                          │
├─────────────────────────────────────┤
│  🔴 [중요] 시스템 점검 안내 (12/01)   │
│  📌 11월 업데이트 소식 (11/28)        │
│  📌 크레딧 정책 변경 안내 (11/20)     │
└─────────────────────────────────────┘

클릭 시 모달:
┌─────────────────────────────────────┐
│  시스템 점검 안내                     │
│  작성일: 2025-12-01                  │
├─────────────────────────────────────┤
│  2025년 12월 1일 오전 2시~4시        │
│  시스템 점검이 진행됩니다...          │
│                                      │
│  [닫기]                              │
└─────────────────────────────────────┘
```

**기능**:
- Supabase에서 `SELECT * FROM notices WHERE status='published'`
- 중요 공지 상단 고정 (important=true)
- 최신순 정렬 (created_at DESC)
- DOMPurify로 content Sanitize 후 표시
- 클릭 시 모달에 상세 내용

**현재 구현 상태**: ❌ 섹션 자체가 없음 (신규 추가 필요)

---

### ✅ 아젠다 #1 검토 질문

**Q1. Admin 입력 폼 필드가 충분한가?**
- 현재: 제목, 내용, 중요 체크박스, 게시 상태
- 추가 필요: 첨부파일? 카테고리? 게시 기간?

**Q2. Database 테이블 필드가 충분한가?**
- 현재: title, content, important, status, created_by, timestamps
- 추가 필요: attachment_urls? category? valid_from/valid_to?

**Q3. Frontend 표시 기능이 충분한가?**
- 현재: 목록 표시, 상세 모달
- 추가 필요: 읽음/안읽음 표시? 검색? 페이지네이션?

**Q4. 전체 플로우가 명확한가?**
- Admin 저장 → Supabase INSERT → Frontend 조회 → 화면 표시
- 빠진 단계가 있는가?

---

## 📋 아젠다 #2: 학습용 콘텐츠 (Learning Contents)

### 1️⃣ Admin Dashboard (입력)

**화면**: 학습용 콘텐츠 관리 섹션
```
┌─────────────────────────────────────┐
│  📚 학습용 콘텐츠 관리                │
├─────────────────────────────────────┤
│  [+ 새 콘텐츠 추가]                   │
│                                      │
│  트리 구조:                           │
│  📂 웹개발 기초                       │
│    📂 HTML/CSS                       │
│      📄 HTML 기본 문법 [수정] [삭제]  │
│      📄 CSS 레이아웃 [수정] [삭제]    │
│    📂 JavaScript                     │
│      📄 변수와 데이터 타입 [수정]      │
└─────────────────────────────────────┘
```

**입력 폼** (3가지 방식):
```
방식 1: 대분류 추가
  대분류명: [___________________]
  [저장]

방식 2: 중분류 추가
  대분류 선택: [웹개발 기초 ▼]
  중분류명: [___________________]
  [저장]

방식 3: 소분류(콘텐츠) 추가
  대분류: [웹개발 기초 ▼]
  중분류: [HTML/CSS ▼]
  소분류: [___________________]

  콘텐츠 타입: (•) Google Drive ( ) 일반 URL
  링크: [___________________________]
  설명: [___________________________]

  [저장]
```

**기능**:
- 3단계 트리 구조 입력
- Google Drive 링크 연결
- 정렬 순서 드래그 앤 드롭
- DOMPurify Sanitization 적용

**현재 구현 상태**: ⚠️ Admin에 구조만 있음 (CRUD 미구현)

---

### 2️⃣ Database (저장)

**테이블**: `learning_contents`
```sql
CREATE TABLE learning_contents (
    id UUID PRIMARY KEY,
    depth1 TEXT NOT NULL,           -- 대분류
    depth2 TEXT NOT NULL,           -- 중분류
    depth3 TEXT NOT NULL,           -- 소분류
    content_type TEXT DEFAULT 'text', -- google_drive, url, video
    content_url TEXT,               -- 링크
    description TEXT,               -- 설명
    order_num INTEGER DEFAULT 0,    -- 정렬 순서
    status TEXT DEFAULT 'published',
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

**Mock 데이터**:
```sql
INSERT INTO learning_contents (depth1, depth2, depth3, content_type, content_url, description, order_num) VALUES
('웹개발 기초', 'HTML/CSS', 'HTML 기본 문법', 'google_drive', 'https://drive.google.com/...', 'HTML 태그...', 1),
('웹개발 기초', 'HTML/CSS', 'CSS 레이아웃', 'google_drive', 'https://drive.google.com/...', 'Flexbox...', 2),
('웹개발 기초', 'JavaScript', '변수와 데이터 타입', 'google_drive', 'https://drive.google.com/...', '변수 선언...', 3);
```

**API 엔드포인트** (필요):
- `POST /api/admin/learning-contents` - Admin이 작성
- `GET /api/learning-contents` - Frontend가 조회

---

### 3️⃣ Frontend (표시)

**화면**: 학습용 콘텐츠 섹션 (Accordion)
```
┌─────────────────────────────────────┐
│  📚 학습용 콘텐츠                     │
├─────────────────────────────────────┤
│  [검색: _________________ 🔍]        │
│                                      │
│  ▼ 📂 웹개발 기초                    │
│     ▼ 📂 HTML/CSS                   │
│        📄 HTML 기본 문법             │
│        📄 CSS 레이아웃               │
│     ▶ 📂 JavaScript                 │
│  ▶ 📂 AI 활용법                      │
│  ▶ 📂 프로젝트 관리                  │
└─────────────────────────────────────┘

콘텐츠 클릭 시:
- Google Drive 링크 → 새 탭 열기
- 일반 콘텐츠 → 모달에 표시
```

**기능**:
- Supabase에서 `SELECT * FROM learning_contents WHERE status='published' ORDER BY order_num`
- 3단계 트리를 Accordion으로 렌더링
- 접기/펼치기 기능
- 검색 기능 (제목 검색)
- Google Drive 링크 정규식 검증
- DOMPurify로 description Sanitize

**현재 구현 상태**: ⚠️ 섹션은 있지만 빈 상태 (콘텐츠 로딩 미구현)

---

### ✅ 아젠다 #2 검토 질문

**Q1. Admin 입력 방식이 편리한가?**
- 현재: 3단계 각각 입력
- 대안: 한 번에 입력? 엑셀 업로드?

**Q2. Database 트리 구조가 적절한가?**
- 현재: depth1, depth2, depth3 (3개 컬럼)
- 대안: parent_id 방식? (무한 depth 가능)

**Q3. Frontend Accordion 방식이 적절한가?**
- 현재: 접기/펼치기 트리
- 대안: 탭? 리스트?

**Q4. Google Drive 링크만 지원하는가?**
- YouTube, Notion, 외부 URL도 지원?

---

## 📋 아젠다 #3: FAQ (자주 묻는 질문)

### 1️⃣ Admin Dashboard (입력)

**화면**: FAQ 관리 섹션
```
┌─────────────────────────────────────┐
│  🙋 FAQ 관리                          │
├─────────────────────────────────────┤
│  [+ 새 FAQ 추가]                      │
│                                      │
│  카테고리별 보기: [전체 ▼]            │
│                                      │
│  [결제/구독]                          │
│  ❓ 크레딧은 어떻게 충전하나요?        │
│     [수정] [삭제] [위로] [아래로]     │
│  ❓ 구독은 어떻게 신청하나요?          │
│     [수정] [삭제] [위로] [아래로]     │
│                                      │
│  [사용법]                             │
│  ❓ Order Sheet 작성법?               │
│     [수정] [삭제] [위로] [아래로]     │
└─────────────────────────────────────┘
```

**입력 폼**:
```
카테고리: [결제/구독 ▼]
  - payment (결제/구독)
  - usage (사용법)
  - general (일반)
  - technical (기술)

질문: [___________________________]
답변: [___________________________]
      [___________________________]
      (여러 줄)

정렬 순서: [1] (자동 또는 수동)

[저장] [취소]
```

**기능**:
- 질문/답변 입력
- 카테고리 선택
- 정렬 순서 드래그 앤 드롭
- DOMPurify Sanitization 적용

**현재 구현 상태**: ⚠️ Admin에 구조만 있음 (CRUD 미구현)

---

### 2️⃣ Database (저장)

**테이블**: `faqs`
```sql
CREATE TABLE faqs (
    id UUID PRIMARY KEY,
    category TEXT NOT NULL,         -- payment, usage, general, technical
    question TEXT NOT NULL,         -- 질문
    answer TEXT NOT NULL,           -- 답변
    order_num INTEGER DEFAULT 0,    -- 정렬 순서
    status TEXT DEFAULT 'published',
    view_count INTEGER DEFAULT 0,   -- 조회수 (선택)
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

**Mock 데이터**:
```sql
INSERT INTO faqs (category, question, answer, order_num) VALUES
('payment', '크레딧은 어떻게 충전하나요?', 'Perplexity 섹션에서...', 1),
('payment', '구독은 어떻게 신청하나요?', '상단 메뉴의 구독하기...', 2),
('usage', 'Order Sheet 작성법?', 'Order Sheet 템플릿을...', 3);
```

**API 엔드포인트** (필요):
- `POST /api/admin/faqs` - Admin이 작성
- `GET /api/faqs?category=payment` - Frontend가 조회

---

### 3️⃣ Frontend (표시)

**화면**: FAQ 섹션 (Accordion)
```
┌─────────────────────────────────────┐
│  🙋 FAQ (자주 묻는 질문)              │
├─────────────────────────────────────┤
│  [검색: _________________ 🔍]        │
│                                      │
│  카테고리: [전체] [결제] [사용법] ... │
│                                      │
│  [결제/구독]                          │
│  ▼ ❓ 크레딧은 어떻게 충전하나요?      │
│     💡 Perplexity 섹션에서 크레딧    │
│        충전 버튼을 클릭하세요...      │
│                                      │
│  ▶ ❓ 구독은 어떻게 신청하나요?        │
│                                      │
│  [사용법]                             │
│  ▶ ❓ Order Sheet 작성법?             │
└─────────────────────────────────────┘
```

**기능**:
- Supabase에서 `SELECT * FROM faqs WHERE status='published' ORDER BY order_num`
- 카테고리별 필터링
- Accordion (질문 클릭 → 답변 펼침)
- 검색 기능
- DOMPurify로 answer Sanitize

**현재 구현 상태**: ⚠️ 섹션은 있지만 빈 상태 (FAQ 로딩 미구현)

---

### ✅ 아젠다 #3 검토 질문

**Q1. FAQ 카테고리가 충분한가?**
- 현재: payment, usage, general, technical
- 추가 필요: billing, account, feature 등?

**Q2. FAQ 정렬 방식이 적절한가?**
- 현재: order_num (수동 정렬)
- 대안: 조회수순? 최신순?

**Q3. Frontend Accordion 방식이 적절한가?**
- 현재: 질문 클릭 → 답변 펼침
- 대안: 전체 펼침 옵션?

---

## 📋 아젠다 #4: My Page & 결제/구독 (Phase 2)

### 1️⃣ Admin Dashboard

**Admin은 조회만**:
- 회원 관리 섹션에서 사용자 목록 조회
- 구독 관리 섹션에서 구독 상태 조회
- 결제 관리 섹션에서 결제 내역 조회
- 크레딧 관리 섹션에서 크레딧 지급/차감

---

### 2️⃣ Database (기존 테이블 활용)

**이미 있는 테이블**:
- `users` - 사용자 정보
- `payment_transactions` - 결제 내역
- `monthly_subscriptions` - 월 구독
- `credit_balance` - 크레딧 잔액

**추가 필요 없음** (기존 스키마 활용)

---

### 3️⃣ Frontend (표시)

**My Page 화면**:
```
┌─────────────────────────────────────┐
│  👤 My Page                        │
├─────────────────────────────────────┤
│  📋 내 정보                          │
│    이메일: user@example.com         │
│    가입일: 2025-11-01               │
│                                      │
│  🔄 구독 상태                        │
│    현재 플랜: Pro (₩29,900/월)       │
│    다음 결제일: 2025-12-15          │
│    [플랜 변경] [구독 취소]            │
│                                      │
│  🪙 크레딧 잔액                      │
│    현재 잔액: ₩10,000               │
│    [충전하기]                        │
│                                      │
│  💳 결제 내역                        │
│    2025-11-15 | Pro 구독 | ₩29,900 │
│    2025-11-10 | 크레딧 충전 | ₩5,000│
└─────────────────────────────────────┘
```

**기능**:
- Supabase에서 사용자 정보 조회
- 구독 상태 조회
- 크레딧 잔액 조회
- 결제 내역 조회

**현재 구현 상태**: ❌ My Page 없음 (신규 추가 필요)

---

### ✅ 아젠다 #4 검토 질문

**Q1. My Page에 표시할 정보가 충분한가?**
- 현재: 내 정보, 구독 상태, 크레딧, 결제 내역
- 추가 필요: 프로필 사진? 알림 설정?

**Q2. 결제 모듈은 어떤 것을 사용할 것인가?**
- Toss Payments?
- Stripe?
- 기타?

---

## 📝 전체 검토 순서

### Phase 1 (즉시 구현 필수)
1. ✅ **아젠다 #1: 공지사항** - Admin 입력 → DB 저장 → Frontend 표시
2. ✅ **아젠다 #2: 학습용 콘텐츠** - Admin 입력 → DB 저장 → Frontend 표시

### Phase 2 (빠르게 구현)
3. ✅ **아젠다 #3: FAQ** - Admin 입력 → DB 저장 → Frontend 표시
4. ✅ **아젠다 #4: My Page & 결제** - 기존 DB 활용 → Frontend 표시

---

## 🔍 검토 방식

**각 아젠다별로**:
1. Admin 입력 폼이 적절한가?
2. Database 테이블 구조가 충분한가?
3. Frontend 표시 방식이 명확한가?
4. 전체 플로우에 빠진 단계가 없는가?

---

**작성 완료**: 2025-12-01
**다음 단계**: 아젠다별로 하나씩 검토 및 승인
