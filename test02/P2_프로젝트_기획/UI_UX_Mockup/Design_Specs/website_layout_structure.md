# SSALWorks 웹사이트 레이아웃 구조 설계

> **최종 업데이트**: 2025-12-03
> **목적**: SSALWorks 웹사이트 홈 화면 전체 레이아웃 구조 정의
> **기반**: `prototype_index_최종개선.html` 실제 프로토타입

---

## 📐 전체 레이아웃 구조

### HTML 구조
```html
<div class="page-wrapper">
    <header class="header">
        <!-- 헤더 영역 -->
    </header>

    <div class="layout-container">
        <aside class="left-sidebar">
            <!-- 좌측 사이드바 (3개 영역) -->
        </aside>

        <main class="center-workspace">
            <!-- 중앙 워크스페이스 (2개 영역) -->
        </main>

        <aside class="right-sidebar">
            <!-- 우측 사이드바 (6개 영역) -->
        </aside>
    </div>

    <footer class="footer">
        <!-- 푸터 영역 -->
    </footer>
</div>
```

### CSS Grid 레이아웃
```css
.layout-container {
    display: grid;
    grid-template-columns: 220px minmax(500px, 900px) 280px;
    flex: 1;
    gap: 0;
    width: 100%;
    justify-content: center;
}
```

**컬럼 너비:**
- 좌측 사이드바: `220px` (고정)
- 중앙 워크스페이스: `minmax(500px, 900px)` (가변, 최소 500px, 최대 900px)
- 우측 사이드바: `280px` (고정)

**전체 최대 너비:** 1400px (220 + 900 + 280)

---

## 🎨 컬러 시스템

```css
:root {
    /* Main Theme - Organic Growth: Emerald Green */
    --primary: #10B981;
    --primary-dark: #059669;

    /* Secondary Theme - Organic Growth: Amber Gold */
    --secondary: #F59E0B;
    --secondary-dark: #D97706;

    /* Tertiary Theme - Organic Growth: Navy Blue */
    --tertiary: #2C4A8A;
    --tertiary-dark: #1F3563;

    /* Status Colors */
    --success: #10B981;
    --warning: #ffc107;
    --danger: #EF4444;
    --info: #3B82F6;
    --neutral: #64748B;

    /* Background */
    --bg-light: #f8f9fa;
    --bg-white: #ffffff;
    --border-color: #dee2e6;

    /* Misc */
    --border-radius: 8px;
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
}
```

---

## 📍 Header (헤더)

### 구조
```html
<header class="header">
    <div class="header-inner">
        <div class="logo">
            <div class="rice-logo">
                <span class="rice-grain"></span>
                <span class="rice-grain"></span>
                <span class="rice-grain"></span>
            </div>
            SSAL Works
        </div>

        <div class="header-center">
            <div class="header-tagline">
                AI로 개발하고 Growth로 성장하는 스마트 워크스페이스
            </div>
        </div>

        <div class="header-right">
            <button class="header-btn">대시보드</button>
            <button class="header-btn">Books</button>
            <button class="header-btn">내 프로젝트</button>
            <button class="notification-btn">
                🔔
                <span class="notification-badge"></span>
            </button>
            <button class="header-btn">사용자명</button>
        </div>
    </div>
</header>
```

### CSS
```css
.header {
    width: 100%;
    background: linear-gradient(135deg, var(--tertiary) 0%, var(--tertiary-dark) 100%);
    color: white;
    box-shadow: var(--shadow-md);
    z-index: 100;
}

.header-inner {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 70px;
}
```

---

## 📍 영역 ① 📦 PROJECT (좌측 최상단)

### 구조
```html
<div class="left-sidebar-section">
    <h2 class="sidebar-title">📦 PROJECT</h2>

    <!-- 메뉴 -->
    <div class="project-menu">
        <div class="project-menu-item">
            <span>➕</span>
            <span>새 프로젝트</span>
        </div>
    </div>

    <!-- 프로젝트 리스트 -->
    <div class="project-list">
        <div class="project-list-item selected">
            <span class="project-icon">🌾</span>
            <span class="project-name">SSAL Works</span>
            <span class="project-status">진행중</span>
        </div>
        <!-- 추가 프로젝트... -->
    </div>
</div>
```

### CSS
```css
.left-sidebar-section {
    margin-bottom: 24px;
}

.sidebar-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #495057;
}

.project-list-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: #f8f9fa;
    border-left: 3px solid var(--primary);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 12px;
}

.project-list-item.selected {
    background: rgba(16, 185, 129, 0.05);
    border-left-color: var(--primary);
    border-left-width: 4px;
}
```

---

## 📍 영역 ② 📊 진행 프로세스 (좌측 중간)

### 구조
```html
<div class="left-sidebar-section">
    <h2 class="sidebar-title">📊 진행 프로세스</h2>

    <div class="process-list">
        <!-- 대분류 (Phase) -->
        <div class="process-item">
            <div class="process-major" data-progress="80">
                <div class="process-header">
                    <span class="process-icon">✅</span>
                    <span class="process-name">【예비 개발】</span>
                </div>
                <div class="process-progress-container">
                    <div class="process-bar">
                        <div class="process-bar-fill" style="width: 80%"></div>
                    </div>
                    <span class="process-status">80%</span>
                </div>
            </div>
        </div>
        <!-- 추가 Phase... -->
    </div>
</div>
```

### CSS
```css
.process-major {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px 10px;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 6px;
    transition: all 0.2s;
    cursor: pointer;
    margin-bottom: 6px;
}

.process-major:hover {
    background: var(--success) !important;
    color: white !important;
}

.process-bar {
    flex: 1;
    height: 6px;
    background: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
}

.process-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--success) 0%, #20c997 100%);
    transition: width 0.3s ease;
}
```

---

## 📍 영역 ③ 🔗 연계 서비스 바로가기 (좌측 하단)

### 구조
```html
<div class="left-sidebar-section">
    <h2 class="sidebar-title">🔗 연계 서비스 바로가기</h2>

    <div class="quick-links">
        <div class="quick-link-item">
            <span>🏠</span>
            <span>대시보드</span>
        </div>
        <div class="quick-link-item">
            <span>📊</span>
            <span>프로젝트 그리드</span>
        </div>
        <div class="quick-link-item">
            <span>💬</span>
            <span>써니에게 묻기</span>
        </div>
        <div class="quick-link-item">
            <span>🪙</span>
            <span>크레딧 충전</span>
            <small>잔액: ₩2,500</small>
        </div>
        <div class="quick-link-item">
            <span>⚙️</span>
            <span>설정</span>
        </div>
    </div>
</div>
```

### CSS
```css
.quick-link-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 12px;
    margin-bottom: 4px;
}

.quick-link-item:hover {
    background: rgba(16, 185, 129, 0.1);
    border-color: var(--primary);
    transform: translateX(3px);
}
```

---

## 📍 영역 ④ Workspace (중앙 상단 75%)

### 구조
```html
<div class="workspace-top">
    <div class="workspace-header">
        <div class="workspace-title">
            <h2>🛠️ Workspace</h2>
            <p>Order Sheet 작성 및 작업 지시</p>
        </div>
        <div class="workspace-actions">
            <button class="workspace-btn">📥 Orders 불러오기</button>
            <button class="workspace-btn">📤 Reports 불러오기</button>
            <button class="workspace-btn primary">📋 Order Sheet 발행</button>
        </div>
    </div>

    <div class="workspace-content">
        <div class="workspace-task-info">
            <h3>Task: P1F3 - 컬러 팔레트 작성</h3>
        </div>

        <div class="workspace-order-sheet">
            <label>Order Sheet 내용:</label>
            <textarea class="order-sheet-textarea" rows="10">
브랜드 컬러(Emerald Green, Amber Gold)를 사용한
웹사이트 컬러 팔레트를 작성해주세요.

필요 항목:
- Primary, Secondary, Accent 색상
- 각 색상의 명도 단계 (100-900)
            </textarea>
        </div>

        <div class="workspace-result">
            <h4>작업 결과:</h4>
            <div class="result-item">
                ✅ 컬러 팔레트 완성 (color_palette.css)
            </div>
        </div>
    </div>
</div>
```

### CSS
```css
.workspace-top {
    flex: 3;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: var(--border-radius);
    padding: 20px;
    box-shadow: var(--shadow-sm);
}

.workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.workspace-btn {
    padding: 8px 16px;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;
}

.workspace-btn.primary {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.order-sheet-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    font-family: 'Malgun Gothic', sans-serif;
    resize: vertical;
}
```

---

## 📍 영역 ⑤ Project SAL Grid (중앙 하단 25%)

### 구조
```html
<div class="workspace-bottom">
    <div class="grid-viewer-header">
        <div class="grid-viewer-title-group">
            <div class="grid-viewer-title">📊 Project SAL Grid</div>
            <div class="grid-stats">
                <span>전체: 120</span>
                <span>완료: 45</span>
                <span>진행: 12</span>
            </div>
        </div>
        <div class="grid-viewer-controls">
            <button class="grid-view-btn">2D Card View</button>
            <button class="grid-view-btn">3D Block View</button>
            <select class="grid-filter">
                <option>전체 보기</option>
                <option>Phase별</option>
                <option>Area별</option>
            </select>
        </div>
    </div>

    <div class="grid-content">
        <!-- Task 카드들 -->
        <div class="task-card" data-status="completed">
            <div class="task-id">P1F1</div>
            <div class="task-status">✅</div>
            <div class="task-name">기획</div>
        </div>
        <!-- 추가 Task 카드... -->
    </div>
</div>
```

### CSS
```css
.workspace-bottom {
    flex: 1;
    background: white;
    border-radius: var(--border-radius);
    padding: 16px;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
}

.grid-content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    overflow-y: auto;
    padding: 12px 0;
}

.task-card {
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: #f8f9fa;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.task-card[data-status="completed"] {
    background: rgba(16, 185, 129, 0.1);
    border-color: var(--success);
}

.task-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}
```

---

## 📍 영역 ⑥ 📚 학습용 콘텐츠 (우측 최상단)

### 구조
```html
<div class="sidebar-section">
    <h3>📚 학습용 콘텐츠</h3>

    <input type="text"
           id="learningSearchInput"
           placeholder="학습용 콘텐츠 검색하기"
           class="sidebar-search">

    <div class="knowledge-item">
        <div class="knowledge-major">
            <span class="knowledge-icon">📖</span>
            <span class="knowledge-name">Claude & Claude Code 사용법</span>
            <span class="knowledge-arrow">▶</span>
        </div>
        <div class="knowledge-medium-list">
            <div class="knowledge-medium">
                <span class="knowledge-medium-bullet">●</span>
                <span>Claude 기본</span>
            </div>
            <!-- 추가 항목... -->
        </div>
    </div>
</div>
```

### CSS
```css
.sidebar-section {
    margin-bottom: 24px;
    padding: 16px;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
}

.sidebar-search {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #495057;
    border-radius: 6px;
    font-size: 13px;
    margin-bottom: 12px;
}

.knowledge-major {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.knowledge-major:hover {
    background: rgba(16, 185, 129, 0.1);
}
```

---

## 📍 영역 ⑦ 🙋 FAQ (우측)

### 구조
```html
<div class="sidebar-section">
    <h3>🙋 FAQ</h3>

    <div class="faq-item">
        <div class="faq-question">
            Q: 구독료는 얼마인가요?
            <span class="faq-arrow">▼</span>
        </div>
        <div class="faq-answer" style="display: none;">
            A: SSAL Works 구독 방식은...
        </div>
    </div>
    <!-- 추가 FAQ... -->
</div>
```

---

## 📍 영역 ⑧ 🔔 Claude Code 업데이트 (우측)

### 구조
```html
<div class="sidebar-section">
    <h3>🔔 Claude Code 업데이트</h3>

    <div class="update-item">
        <div class="update-date">📅 2025-12-01</div>
        <div class="update-title">v4.5.0 릴리즈</div>
        <a href="#" class="update-link">자세히 →</a>
    </div>
    <!-- 추가 업데이트... -->
</div>
```

---

## 📍 영역 ⑨ 🤖 다른 AI에게 묻기 (우측)

### 구조
```html
<div class="sidebar-section">
    <h3>🤖 AI에게 묻기</h3>

    <div class="ai-balance">💰 잔액: ₩2,500</div>

    <div class="ai-selector">
        <label>
            <input type="radio" name="ai" value="chatgpt">
            ChatGPT-4 ₩150/쿼리
        </label>
        <label>
            <input type="radio" name="ai" value="gemini">
            Gemini Pro ₩100/쿼리
        </label>
        <label>
            <input type="radio" name="ai" value="perplexity" checked>
            Perplexity ₩240/쿼리
        </label>
    </div>

    <textarea class="ai-question" placeholder="질문을 입력하세요"></textarea>
    <button class="ai-submit-btn">질문하기</button>

    <div class="ai-answer">
        <h4>💬 답변:</h4>
        <div class="answer-content">
            <!-- 답변 내용 -->
        </div>
    </div>
</div>
```

---

## 📍 영역 ⑩ ☀️ Sunny에게 묻기 (우측)

### 구조
```html
<div class="sidebar-section">
    <h3>☀️ Sunny에게 묻기</h3>

    <input type="text" placeholder="제목" class="sunny-title">
    <textarea class="sunny-content" placeholder="문의 내용"></textarea>
    <p class="sunny-info">ℹ️ 24-48시간 이내 답변</p>
    <button class="sunny-submit-btn">문의하기</button>

    <div class="sunny-history">
        <h4>📜 내 문의 내역</h4>
        <div class="inquiry-item">
            <span class="inquiry-status">✅</span>
            <span class="inquiry-date">2025-12-01</span>
            <span class="inquiry-title">구독 갱신 관련</span>
        </div>
        <!-- 추가 문의... -->
    </div>
</div>
```

---

## 📍 영역 ⑪ 📢 공지사항 (우측 최하단)

### 구조
```html
<div class="sidebar-section">
    <h3>📢 공지사항</h3>

    <div class="notice-item">
        <div class="notice-icon">🔥</div>
        <div class="notice-content">
            <div class="notice-date">2025-12-01</div>
            <div class="notice-title">새 기능: User Flow #4</div>
            <a href="#" class="notice-link">자세히 →</a>
        </div>
    </div>
    <!-- 추가 공지... -->
</div>
```

---

## 📍 Footer (푸터)

### 구조
```html
<footer class="footer">
    <div class="footer-inner">
        <div class="footer-left">
            <button class="footer-btn">📖 매뉴얼</button>
            <button class="footer-btn">📧 문의</button>
        </div>
        <div class="footer-right">
            <span>© 2025 SSAL Works. All rights reserved.</span>
        </div>
    </div>
</footer>
```

### CSS
```css
.footer {
    width: 100%;
    background: white;
    border-top: 1px solid var(--border-color);
    font-size: 12px;
    color: #495057;
    z-index: 10;
}

.footer-inner {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 32px;
}
```

---

## 📱 반응형 디자인

### 데스크탑 (1920px 이상)
```css
.layout-container {
    grid-template-columns: 220px 900px 280px;
}
```

### 태블릿 (768px ~ 1919px)
```css
@media (max-width: 1919px) {
    .layout-container {
        grid-template-columns: 200px minmax(500px, 800px) 260px;
    }
}
```

### 모바일 (767px 이하)
```css
@media (max-width: 767px) {
    .layout-container {
        grid-template-columns: 1fr;
    }

    .left-sidebar,
    .right-sidebar {
        display: none;
    }

    /* 햄버거 메뉴로 접근 */
}
```

---

## 🎯 타이포그래피 계층

```css
/* H1: 로고 (SSAL Works) */
h1 {
    font-size: 26px;
    font-weight: 800;
}

/* H2: 주요 섹션 타이틀 (Workspace, Project SAL Grid) */
h2 {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-dark);
}

/* H3: 사이드바 1단계 (PROJECT, 진행 프로세스, 학습용 콘텐츠) */
h3 {
    font-size: 14px;
    font-weight: 700;
    color: #495057;
}

/* H4: 사이드바 2단계, 헤더/푸터 버튼 */
h4 {
    font-size: 13px;
    font-weight: 700;
}

/* H5: 사이드바 3단계, 강조 텍스트 */
h5 {
    font-size: 12px;
    font-weight: 700;
}

/* H6: 사이드바 4단계, 설명 텍스트 */
h6 {
    font-size: 12px;
    font-weight: 500;
}
```

---

## 📦 주요 컴포넌트 클래스

### 버튼
```css
.workspace-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
}

.workspace-btn.primary {
    background: var(--primary);
    color: white;
}
```

### 카드
```css
.task-card {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    transition: all 0.2s;
}

.task-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}
```

### 진행 막대
```css
.process-bar {
    height: 6px;
    background: #e9ecef;
    border-radius: 3px;
}

.process-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--success) 0%, #20c997 100%);
}
```

---

## 🔄 JavaScript 주요 함수

### Workspace
```javascript
// Order Sheet 발행
function publishOrderSheet() {
    const content = document.querySelector('.order-sheet-textarea').value;
    // Socket.io로 전송
}

// Orders 불러오기
function loadOrders() {
    // JSON 파일 읽기
}
```

### Grid
```javascript
// Task 카드 클릭
function selectTask(taskId) {
    // Workspace에 Order Sheet 생성
}

// 필터 적용
function filterTasks(filterType, value) {
    // Task 카드 필터링
}
```

### AI
```javascript
// AI 질문
function askAI() {
    const question = document.querySelector('.ai-question').value;
    const aiType = document.querySelector('input[name="ai"]:checked').value;
    // API 호출
}
```

---

**문서 끝**

> **다음 단계**: `Wireframes/home_screen_wireframe.md` 업데이트
