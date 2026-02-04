# Frontend 사용자 페이지 추가 기능 구현 계획

**작성일**: 2025-11-30
**작성자**: Claude Code
**목적**: Admin Dashboard에 추가된 기능에 상응하는 Frontend 사용자 페이지 기능 구현 계획 수립

---

## 📊 Admin Dashboard 기능 분석 결과

### Admin Dashboard 4대 섹션 (13개 기능)

#### 1️⃣ 컨텐츠 관리 (5개)
1. ✅ **공지사항 관리** (`notice`)
   - 관리자가 공지사항 작성/수정/삭제
   - 공지사항 목록 테이블
   - 상태: 게시중/미게시

2. ✅ **학습용 컨텐츠 관리** (`learning`)
   - 3단계 트리 구조 (대분류/중분류/소분류)
   - Google Drive 링크 연결
   - 컨텐츠 추가/수정/삭제

3. ✅ **FAQ 관리** (`faq`)
   - FAQ 작성/수정/삭제
   - 카테고리별 분류
   - 답변 상태 관리

4. ✅ **Order Sheet 템플릿** (`ordersheet`)
   - 템플릿 관리

5. ✅ **안내문 관리** (`guide`)
   - 안내문 작성/수정

#### 2️⃣ 회원/결제 (5개)
6. ✅ **회원 관리** (`users`)
   - 회원 목록
   - 회원 상태 관리

7. ✅ **구독 관리** (`subscription`)
   - 구독 플랜 관리

8. ✅ **결제 관리** (`payment`)
   - 결제 내역 조회

9. ✅ **크레딧 관리** (`credit`)
   - 크레딧 지급/차감
   - 이메일/금액/사유 입력
   - 즉시 적용 기능

10. ✅ **문의 관리** (`inquiries`)
    - 사용자 문의 조회
    - 답변 작성/전송
    - 문의 상태 관리 (답변 대기/답변 완료)

#### 3️⃣ 통계 (2개)
11. ✅ **통계 및 분석** (`stats`)
    - 회원 통계
    - 매출 통계
    - AI 사용 통계

12. ✅ **API 사용량** (`api`)
    - API 호출 통계

#### 4️⃣ 시스템 (1개)
13. ✅ **설정** (`settings`)
    - 시스템 설정

---

## 🔍 Frontend 사용자 페이지 현재 상태

### 현재 구현된 기능
1. ✅ **학습용 콘텐츠** 섹션 존재
   - 위치: `prototype_index_최종개선.html:2675`
   - 구조: `<h3>📚 학습용 콘텐츠</h3>`
   - 상태: **구조만 있음 (내용 없음)**

2. ✅ **FAQ** 섹션 존재
   - 위치: `prototype_index_최종개선.html:3074`
   - 구조: `<h3>🙋 FAQ</h3>`
   - 상태: **구조만 있음 (내용 없음)**

3. ✅ **써니에게 문의** 기능 존재
   - 위치: `prototype_index_최종개선.html:6140-6174`
   - 기능: 문의 제출 양식
   - 상태: **작동 중 (alert 기반)**

4. ✅ **크레딧 시스템** 존재
   - 위치: `prototype_index_최종개선.html:3681-3684, 6966-6984`
   - 기능: 크레딧 잔액 표시 + 충전 기능
   - 상태: **작동 중 (프론트엔드만)**

### 구현되지 않은 기능
1. ❌ **공지사항** 섹션 없음
2. ❌ **결제/구독** 섹션 없음
3. ❌ **My Page** 없음

---

## 🎯 Admin ↔ Frontend 기능 매핑 분석

| # | Admin 기능 | Frontend 대응 기능 | 상태 | 우선순위 |
|---|-----------|------------------|------|---------|
| 1 | 📢 공지사항 관리 | **📢 공지사항 보기** | ❌ **없음** | 🔴 HIGH |
| 2 | 📚 학습용 컨텐츠 관리 | **📚 학습용 콘텐츠 보기** | ⚠️ **구조만** | 🔴 HIGH |
| 3 | 🙋 FAQ 관리 | **🙋 FAQ 보기** | ⚠️ **구조만** | 🟡 MEDIUM |
| 4 | 📝 Order Sheet 템플릿 | _(Admin 전용)_ | - | - |
| 5 | 📖 안내문 관리 | _(필요시 팝업)_ | ⚠️ | 🟢 LOW |
| 6 | 👥 회원 관리 | _(Admin 전용)_ | - | - |
| 7 | 🔄 구독 관리 | **🔄 구독 신청/관리** | ❌ **없음** | 🟡 MEDIUM |
| 8 | 💳 결제 관리 | **💳 결제하기** | ❌ **없음** | 🟡 MEDIUM |
| 9 | 🪙 크레딧 관리 | **🪙 크레딧 잔액 확인** | ✅ **있음** | ✅ 완료 |
| 10 | 💬 문의 관리 | **💬 문의하기** | ✅ **있음** | ✅ 완료 |
| 11 | 📈 통계 및 분석 | _(Admin 전용)_ | - | - |
| 12 | 🔌 API 사용량 | _(Admin 전용)_ | - | - |
| 13 | ⚙️ 설정 | **⚙️ My Page/설정** | ❌ **없음** | 🟡 MEDIUM |

---

## 🚀 Frontend 추가 기능 구현 계획

### Phase 1: CRITICAL - 즉시 구현 (🔴 HIGH 우선순위)

#### 1-1. 공지사항 보기 페이지 (NEW)
**목적**: Admin이 작성한 공지사항을 사용자에게 표시

**구현 내용**:
```
📍 위치: Sidebar - "📢 공지사항" (신규 추가)
📍 섹션 ID: `section-notice`

구조:
┌─────────────────────────────────────┐
│  📢 공지사항                          │
├─────────────────────────────────────┤
│  🔴 [중요] 시스템 점검 안내 (11/30)   │
│  📌 11월 업데이트 소식                │
│  📌 크레딧 정책 변경 안내             │
└─────────────────────────────────────┘

기능:
- 공지사항 목록 표시 (최신순)
- 중요 공지 상단 고정 + 🔴 아이콘
- 클릭 시 상세 내용 모달
- 읽음/안읽음 표시
- Admin Dashboard의 '공지사항 관리'와 연동

데이터:
- Admin이 작성한 공지사항 (제목, 내용, 작성일, 중요도)
- Backend API: GET /api/notices

보안:
- ✅ DOMPurify로 Sanitization 필수 (Admin이 입력한 HTML)
```

#### 1-2. 학습용 콘텐츠 완성
**목적**: Admin이 등록한 학습 콘텐츠를 사용자에게 표시

**현재 상태**:
```html
<!-- 현재: 빈 섹션만 존재 -->
<h3>📚 학습용 콘텐츠</h3>
```

**구현 내용**:
```
📍 위치: Sidebar - "📚 학습용 콘텐츠" (기존 확장)
📍 섹션 ID: `section-learning`

구조 (Admin의 3단계 트리 구조 그대로):
┌─────────────────────────────────────┐
│  📚 학습용 콘텐츠                     │
├─────────────────────────────────────┤
│  📂 1. 웹개발 기초                   │
│    📂 1-1. HTML/CSS                 │
│      📄 HTML 기본 문법               │
│      📄 CSS 레이아웃                 │
│    📂 1-2. JavaScript               │
│      📄 변수와 데이터 타입            │
│  📂 2. AI 활용법                     │
│    📂 2-1. ChatGPT                  │
│      📄 프롬프트 작성법               │
└─────────────────────────────────────┘

기능:
- Accordion 트리 구조 (접기/펼치기)
- 콘텐츠 클릭 시:
  - Google Drive 링크 → 새 탭 열기
  - 일반 콘텐츠 → 모달에 표시
- 검색 기능 (제목 검색)
- Admin Dashboard의 '학습용 컨텐츠 관리'와 연동

데이터:
- Admin이 등록한 3단계 트리 (대분류/중분류/소분류)
- Backend API: GET /api/learning-contents

보안:
- ✅ DOMPurify로 Sanitization 필수
- ✅ Google Drive 링크 검증 (정규식)
```

---

### Phase 2: IMPORTANT - 곧 구현 (🟡 MEDIUM 우선순위)

#### 2-1. FAQ 완성
**목적**: Admin이 작성한 FAQ를 사용자에게 표시

**현재 상태**:
```html
<!-- 현재: 빈 섹션만 존재 -->
<h3>🙋 FAQ</h3>
```

**구현 내용**:
```
📍 위치: Sidebar - "🙋 FAQ" (기존 확장)
📍 섹션 ID: `section-faq`

구조:
┌─────────────────────────────────────┐
│  🙋 FAQ (자주 묻는 질문)              │
├─────────────────────────────────────┤
│  [카테고리] 결제/구독                │
│  ❓ 크레딧은 어떻게 충전하나요?       │
│     💡 답변: Perplexity 섹션에서... │
│                                      │
│  [카테고리] 사용법                   │
│  ❓ Order Sheet는 어떻게 작성하나요?  │
│     💡 답변: ...                    │
└─────────────────────────────────────┘

기능:
- Accordion (질문 클릭 시 답변 펼침)
- 카테고리별 필터링
- 검색 기능
- Admin Dashboard의 'FAQ 관리'와 연동

데이터:
- Admin이 작성한 FAQ (질문, 답변, 카테고리)
- Backend API: GET /api/faqs

보안:
- ✅ DOMPurify로 Sanitization 필수
```

#### 2-2. My Page (NEW)
**목적**: 사용자 정보, 구독 상태, 결제 내역 확인

**구현 내용**:
```
📍 위치: Header - "👤 My Page" (신규 버튼)
📍 섹션 ID: `section-mypage`

구조:
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

기능:
- 사용자 정보 조회
- 구독 플랜 조회 및 변경
- 크레딧 잔액 조회 및 충전
- 결제 내역 조회
- 회원 탈퇴

데이터:
- Backend API:
  - GET /api/user/profile
  - GET /api/user/subscription
  - GET /api/user/payments
  - POST /api/user/subscription/change
```

#### 2-3. 결제/구독 시스템 (NEW)
**목적**: 구독 신청 및 결제

**구현 내용**:
```
📍 위치: Header - "💳 구독하기" (신규 버튼)
📍 섹션 ID: `section-subscription`

구조:
┌─────────────────────────────────────┐
│  🔄 구독 플랜 선택                   │
├─────────────────────────────────────┤
│  [ ] Free (₩0/월)                   │
│      - 기본 기능                     │
│                                      │
│  [✓] Pro (₩29,900/월) ⭐ 추천       │
│      - 모든 기능                     │
│      - AI 무제한                     │
│                                      │
│  [ ] Enterprise (문의)               │
│      - 맞춤형 솔루션                 │
│                                      │
│  [다음 단계] → 결제하기              │
└─────────────────────────────────────┘

기능:
- 플랜 선택 UI
- 결제 모듈 (Toss Payments, Stripe 등)
- 구독 확인 및 자동 갱신
- Admin Dashboard의 '구독 관리', '결제 관리'와 연동

데이터:
- Backend API:
  - GET /api/subscription/plans
  - POST /api/subscription/subscribe
  - POST /api/payment/process
```

---

### Phase 3: OPTIONAL - 필요시 구현 (🟢 LOW 우선순위)

#### 3-1. 안내문 팝업 (선택)
**목적**: 중요 안내문을 팝업으로 표시

**구현 내용**:
```
구조:
- 페이지 로드 시 모달 팝업
- "오늘 하루 보지 않기" 옵션
- 닫기 버튼

기능:
- Admin이 '긴급'으로 설정한 안내문만 팝업
- LocalStorage로 "오늘 하루 보지 않기" 저장

데이터:
- Backend API: GET /api/guides/popup
```

---

## 📋 구현 우선순위 요약

### 🔴 CRITICAL (즉시 구현 필수)
1. ✅ **공지사항 보기** - 사용자에게 중요 정보 전달
2. ✅ **학습용 콘텐츠 완성** - 핵심 콘텐츠 제공

### 🟡 IMPORTANT (빠르게 구현)
3. ✅ **FAQ 완성** - 고객 지원 자동화
4. ✅ **My Page** - 사용자 편의성
5. ✅ **결제/구독 시스템** - 수익화 필수

### 🟢 OPTIONAL (필요시 구현)
6. ⚪ **안내문 팝업** - 긴급 안내용

---

## 🛠️ 기술 스택 및 구현 방법

### Frontend 구조 (prototype_index_최종개선.html 기준)

**Sidebar 확장**:
```html
<!-- 신규 추가 -->
<div class="sidebar-section">
    <h3 onclick="loadSection('notice')">📢 공지사항</h3>
</div>

<!-- 기존 확장 -->
<div class="sidebar-section">
    <h3 onclick="loadSection('learning')">📚 학습용 콘텐츠</h3>
    <div id="learning-tree" class="learning-tree">
        <!-- 3단계 트리 구조 동적 생성 -->
    </div>
</div>

<div class="sidebar-section">
    <h3 onclick="loadSection('faq')">🙋 FAQ</h3>
    <div id="faq-accordion" class="faq-accordion">
        <!-- FAQ 동적 생성 -->
    </div>
</div>
```

**Content Area 확장**:
```html
<!-- 공지사항 섹션 -->
<div id="section-notice" class="content-section" style="display:none;">
    <h2>📢 공지사항</h2>
    <div id="notice-list" class="notice-list">
        <!-- 동적 생성 -->
    </div>
</div>

<!-- 학습용 콘텐츠 섹션 -->
<div id="section-learning" class="content-section" style="display:none;">
    <h2>📚 학습용 콘텐츠</h2>
    <input type="text" id="learning-search" placeholder="검색...">
    <div id="learning-content" class="learning-content">
        <!-- 동적 생성 -->
    </div>
</div>

<!-- FAQ 섹션 -->
<div id="section-faq" class="content-section" style="display:none;">
    <h2>🙋 FAQ</h2>
    <div class="faq-filters">
        <button data-category="all">전체</button>
        <button data-category="payment">결제/구독</button>
        <button data-category="usage">사용법</button>
    </div>
    <div id="faq-content" class="faq-content">
        <!-- 동적 생성 -->
    </div>
</div>

<!-- My Page 섹션 -->
<div id="section-mypage" class="content-section" style="display:none;">
    <h2>👤 My Page</h2>
    <!-- 사용자 정보, 구독 상태, 결제 내역 -->
</div>
```

### JavaScript 함수

```javascript
// ========== 공지사항 ==========
async function loadNotices() {
    const notices = await fetch('/api/notices').then(r => r.json());
    const noticeList = document.getElementById('notice-list');
    noticeList.innerHTML = notices.map(notice => `
        <div class="notice-item ${notice.important ? 'important' : ''}"
             onclick="showNoticeDetail('${notice.id}')">
            ${notice.important ? '🔴 [중요] ' : '📌 '}
            ${DOMPurify.sanitize(notice.title)}
            <span class="notice-date">${notice.date}</span>
        </div>
    `).join('');
}

function showNoticeDetail(noticeId) {
    // 모달에 상세 내용 표시
}

// ========== 학습용 콘텐츠 ==========
async function loadLearningContents() {
    const contents = await fetch('/api/learning-contents').then(r => r.json());
    renderLearningTree(contents);
}

function renderLearningTree(data) {
    // 3단계 트리 구조 렌더링
    // Accordion 형태로 접기/펼치기
}

// ========== FAQ ==========
async function loadFAQs(category = 'all') {
    const faqs = await fetch(`/api/faqs?category=${category}`).then(r => r.json());
    const faqContent = document.getElementById('faq-content');
    faqContent.innerHTML = faqs.map(faq => `
        <div class="faq-item">
            <div class="faq-question" onclick="toggleFAQ(this)">
                ❓ ${DOMPurify.sanitize(faq.question)}
            </div>
            <div class="faq-answer" style="display:none;">
                💡 ${DOMPurify.sanitize(faq.answer)}
            </div>
        </div>
    `).join('');
}

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
}

// ========== My Page ==========
async function loadMyPage() {
    const profile = await fetch('/api/user/profile').then(r => r.json());
    const subscription = await fetch('/api/user/subscription').then(r => r.json());
    const payments = await fetch('/api/user/payments').then(r => r.json());

    renderMyPage(profile, subscription, payments);
}

// ========== DOMPurify Sanitization 필수! ==========
// Admin이 입력한 모든 HTML 콘텐츠는 반드시 DOMPurify.sanitize() 처리!
```

### CSS 스타일

```css
/* ========== 공지사항 ========== */
.notice-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.notice-item {
    padding: 16px;
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.notice-item:hover {
    border-color: #6B5CCC;
    box-shadow: 0 2px 8px rgba(107, 92, 204, 0.1);
}

.notice-item.important {
    border-left: 4px solid #DC2626;
    background: #FEF2F2;
}

.notice-date {
    float: right;
    color: #6c757d;
    font-size: 0.9em;
}

/* ========== 학습용 콘텐츠 ========== */
.learning-tree {
    margin-left: 20px;
}

.learning-depth1 {
    font-weight: 600;
    cursor: pointer;
    padding: 8px;
}

.learning-depth2 {
    margin-left: 20px;
    cursor: pointer;
    padding: 6px;
}

.learning-depth3 {
    margin-left: 40px;
    cursor: pointer;
    padding: 4px;
    color: #6c757d;
}

.learning-depth3:hover {
    color: #6B5CCC;
    text-decoration: underline;
}

/* ========== FAQ ========== */
.faq-item {
    margin-bottom: 16px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
}

.faq-question {
    padding: 16px;
    background: white;
    cursor: pointer;
    font-weight: 500;
}

.faq-question:hover {
    background: #f8f9fa;
}

.faq-answer {
    padding: 16px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
}

/* ========== My Page ========== */
.mypage-section {
    background: white;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 24px;
}

.subscription-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border: 2px solid #6B5CCC;
    border-radius: 12px;
}

.payment-history-table {
    width: 100%;
    border-collapse: collapse;
}

.payment-history-table td {
    padding: 12px;
    border-bottom: 1px solid #e9ecef;
}
```

---

## 🔒 보안 체크리스트 (필수!)

### XSS 방어 (CRITICAL)
- ✅ **모든 Admin 입력 콘텐츠는 DOMPurify.sanitize() 필수**
  - 공지사항 제목/내용
  - 학습용 콘텐츠 제목
  - FAQ 질문/답변
  - 안내문 내용

### 입력 검증
- ✅ Google Drive 링크 정규식 검증
- ✅ 이메일 형식 검증
- ✅ 금액 범위 검증

### API 보안
- ✅ HTTPS 필수
- ✅ JWT 토큰 인증
- ✅ CSRF 토큰 (백엔드)
- ✅ Rate Limiting

---

## 📊 데이터 흐름

```
Admin Dashboard (관리자)
    ↓ (POST /api/notices)
Backend API + Database
    ↓ (GET /api/notices)
Frontend (사용자)
    ↓ (DOMPurify.sanitize)
사용자 화면에 안전하게 표시
```

---

## ✅ 완료 기준

### Phase 1 완료 조건
- [ ] 공지사항 섹션 추가 및 API 연동
- [ ] 학습용 콘텐츠 트리 구조 완성
- [ ] DOMPurify 적용 완료
- [ ] 반응형 디자인 적용
- [ ] 브라우저 테스트 (Chrome, Safari, Edge)

### Phase 2 완료 조건
- [ ] FAQ Accordion 완성
- [ ] My Page UI/API 연동
- [ ] 결제 모듈 통합
- [ ] E2E 테스트 통과

### Phase 3 완료 조건
- [ ] 안내문 팝업 (선택)
- [ ] 사용성 테스트

---

## 📝 다음 단계

1. **Backend API 개발** (우선)
   - Admin Dashboard에서 저장한 데이터를 반환하는 API
   - GET /api/notices
   - GET /api/learning-contents
   - GET /api/faqs

2. **Frontend 구현** (이 계획서 기반)
   - Phase 1: 공지사항 + 학습용 콘텐츠
   - Phase 2: FAQ + My Page + 결제
   - Phase 3: 안내문 팝업 (선택)

3. **통합 테스트**
   - Admin에서 작성 → Frontend에 표시 확인
   - XSS 공격 테스트
   - 성능 테스트

---

**작성 완료**: 2025-11-30
**다음 작업**: Backend API 개발 또는 Frontend Phase 1 구현 시작
