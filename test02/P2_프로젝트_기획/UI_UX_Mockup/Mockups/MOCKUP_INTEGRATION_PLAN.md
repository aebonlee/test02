# Mockup Integration Plan - Complete Implementation Blueprint

**Created:** 2025-12-03
**Purpose:** Detailed plan for creating home_screen_complete_mockup.html and admin_dashboard_complete_mockup.html

---

## 📊 Analysis Summary

### Source Documents Read
✅ `dashboard-mockup.html` (5,221 lines) - FULLY ANALYZED
✅ `EXTRACTED_CSS_SYSTEM.md` - 16 CSS variables, full stylesheet
✅ `EXTRACTED_JAVASCRIPT_FUNCTIONS.md` - 58 functions documented
✅ `USERFLOW_SUMMARY.md` - 8 flows + 11 areas
✅ `ADMIN_WORKFLOWS_SUMMARY.md` - Admin dashboard structure

### Statistics
- **Original mockup:** 5,221 lines, 247+ interactive elements
- **CSS variables:** 16 variables (colors, shadows, spacing)
- **JavaScript functions:** 58 functions (sidebar, translation, AI, modals, monitoring)
- **User Flows:** 8 flows with detailed specifications
- **Areas:** 11 home screen areas (3 left + 2 center + 6 right)

---

## 🎯 Objectives

### Primary Goal
Create **TWO** complete, functional mockups that are **BETTER** than the original:
1. `home_screen_complete_mockup.html` - User dashboard (11 areas)
2. `admin_dashboard_complete_mockup.html` - Admin dashboard

### Success Criteria
- ✅ 100% of original CSS preserved
- ✅ 100% of original JavaScript functions preserved
- ✅ All 247+ interactive elements functional
- ✅ All 11 home screen areas implemented
- ✅ All User Flow features integrated
- ✅ Admin dashboard features integrated
- ✅ Real-time monitoring functional (Outbox watcher, Order status)
- ✅ Translation system functional
- ✅ Multi-AI integration functional

---

## 🏗️ File Structure Plan

### File #1: home_screen_complete_mockup.html

**Size Target:** 5,500+ lines (original: 5,221 lines)
**Enhancements over original:**
- All User Flow integrations
- All 11 areas fully implemented
- Enhanced UI components
- Better documentation in comments

**Structure:**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>SSAL Works - Home Dashboard</title>
    <style>
        /* Lines 1-1,653: Complete CSS from dashboard-mockup.html */
        /* Additional: User Flow specific styles */
        /* Additional: Enhanced interactive states */
    </style>
</head>
<body>
    <!-- Header (70px) -->
    <!-- Left Sidebar (198px): 3 areas -->
    <!-- Center Workspace: 2 areas -->
    <!-- Right Sidebar (266px): 6 areas -->
    <!-- Footer (60px) -->

    <!-- Modals -->
    <!-- Grid Fullscreen Modal -->
    <!-- Translation Modal -->
    <!-- Add Project Modal -->
    <!-- Service Intro Modal -->
    <!-- Outbox Files Modal -->

    <script>
        /* Lines 3,000-5,221: All 58 JavaScript functions */
        /* Additional: User Flow specific functions */
        /* Additional: Enhanced interactions */
    </script>
</body>
</html>
```

### File #2: admin_dashboard_complete_mockup.html

**Size Target:** 3,500+ lines
**Features:**
- Admin-specific sidebar (5 sections)
- Dashboard overview with charts
- Content management interfaces
- Member/payment management
- Statistics and analytics

**Structure:**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>SSAL Works - Admin Dashboard</title>
    <style>
        /* Admin-specific CSS (based on original + modifications) */
    </style>
</head>
<body>
    <!-- Header (70px) -->
    <!-- Left Sidebar (180px): Admin menu -->
    <!-- Main Content Area: Dynamic sections -->
    <!-- Footer (60px) -->

    <script>
        /* Admin-specific JavaScript */
        /* Chart.js integration */
        /* CRUD operations */
        /* Real-time updates */
    </script>
</body>
</html>
```

---

## 🎨 CSS Integration Plan

### Base CSS (100% preserved from original)

**From EXTRACTED_CSS_SYSTEM.md:**

```css
:root {
    --primary: #6B5CCC;
    --primary-dark: #5847B3;
    --secondary: #CC785C;
    --secondary-dark: #B35A44;
    --tertiary: #20808D;
    --tertiary-dark: #20808D;
    --success: #20808D;
    --warning: #ffc107;
    --danger: #dc3545;
    --info: #0099ff;
    --neutral: #6c757d;
    --bg-light: #f8f9fa;
    --bg-white: #ffffff;
    --border-color: #dee2e6;
    --border-radius: 8px;
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
}
```

**Layout Grid:**
```css
.layout-container {
    display: grid;
    grid-template-columns: 198px 1fr 266px;
    grid-template-rows: 70px 1fr 60px;
    min-height: 100vh;
    gap: 0;
    max-width: 1800px;
    margin: 0 auto;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.15);
}
```

**All component styles:** (full preservation)
- Header, Footer, Sidebars
- Process hierarchy (3 levels)
- Task cards, status badges
- Modals, notifications
- Buttons, forms, inputs
- Scrollbars, transitions

### Design System V2 Enhancements (Optional)

**Plan for future integration:**
- Keep original colors as default
- Add CSS classes for Design System V2 colors
- Allow theme switching via JavaScript
- Document both color schemes

---

## 📜 JavaScript Integration Plan

### All 58 Functions Preserved

**From EXTRACTED_JAVASCRIPT_FUNCTIONS.md:**

#### Category 1: Sidebar & Navigation (9 functions)
```javascript
// All functions preserved exactly as original
loadSidebarStructure()
renderSidebarFromJSON(data)
generatePhaseHTML(phase, index)
generateCategoryHTML(category, phaseId)
generateDirectItemHTML(item, phaseId)
toggleProcess(el)
toggleProcessTiny(el)
toggleKnowledge(el)
toggleKnowledgeSmall(el)
```

#### Category 2: Template & Editor (4 functions)
```javascript
loadOrderSheetTemplates()
loadTemplate(categoryKey)
loadWelcomeMessage()
clearEditor()
```

#### Category 3: Translation (5 functions)
```javascript
translateToEnglish()
translateWithAI(text)
mockTranslate(text)
generateBilingualMarkdown(koreanText, englishText)
toggleTranslation()
```

#### Category 4: Inbox/Outbox (6 functions)
```javascript
downloadToInbox()
manualDownload(content, filename)
loadFromOutbox()
selectOutboxFile(file)
generateHTMLFromJSON(data)
closeOutboxModal()
```

#### Category 5: AI Integration (4 functions)
```javascript
selectAI(aiType, event)
askAI()
askPerplexity()
rechargeCredit()
```

#### Category 6: Support & Help (5 functions)
```javascript
openSunnySupport(event)
submitSupport()
handleSupportFileSelect(event)
removeSupportFile(index)
displaySupportResponse(question, answer, answeredAt)
```

#### Category 7: Modal Management (9 functions)
```javascript
openGridFullscreen()
closeGridFullscreen()
openTranslationFullview()
closeTranslationFullview()
openAddProjectModal()
closeAddProjectModal()
openServiceIntro()
closeServiceIntro()
openManual()
```

#### Category 8: Project Management (4 functions)
```javascript
toggleProjectList()
selectProject(projectName)
addProjectToList(name)
isProjectCompleted()
```

#### Category 9: Real-time Monitoring (9 functions)
```javascript
startOutboxWatcher()
stopOutboxWatcher()
showOutboxNotification(fileCount, files)
closeOutboxNotification()
loadFromOutboxNotification()
startOrderStatusTracking(orderId)
checkOrderStatus(orderId)
stopOrderStatusTracking(orderId)
updateOrderStatus(orderId, status, message)
```

#### Category 10: Utility (3 functions)
```javascript
showStatus(message, type, duration)
switchView(viewType)
openFolder(folderPath)
```

### Additional Functions for User Flows

**New functions to add based on User Flow analysis:**

```javascript
// Signup Flow
function handleSignup(formData) { /* ... */ }
function validateSignupForm() { /* ... */ }

// Project Registration Flow
function registerNewProject(projectData) { /* ... */ }
function checkInstallationFeePaid() { /* ... */ }

// Subscription Management
function updateSubscriptionStatus(status) { /* ... */ }
function showPaymentModal(amount) { /* ... */ }

// Credit Purchase
function purchaseCreditPackage(packageId) { /* ... */ }
function updateCreditBalance(newBalance) { /* ... */ }
```

---

## 🏠 Home Screen - 11 Areas Implementation

### Layout Structure (Preserved from original)

```html
<div class="layout-container">
    <header class="header">...</header>

    <!-- LEFT SIDEBAR (198px) - 3 Areas -->
    <aside class="left-sidebar">
        <!-- Area ① 📦 PROJECT -->
        <!-- Area ② 📊 진행 프로세스 -->
        <!-- Area ③ 🔗 연계 서비스 바로가기 -->
    </aside>

    <!-- CENTER WORKSPACE - 2 Areas -->
    <main class="center-workspace">
        <!-- Area ④ Workspace (75%) -->
        <!-- Area ⑤ Project SAL Grid (25%) -->
    </main>

    <!-- RIGHT SIDEBAR (266px) - 6 Areas -->
    <aside class="right-sidebar">
        <!-- Area ⑥ 📚 학습용 콘텐츠 -->
        <!-- Area ⑦ 🙋 FAQ -->
        <!-- Area ⑧ 🔔 Claude Code 업데이트 -->
        <!-- Area ⑨ 🤖 AI묻기 -->
        <!-- Area ⑩ ☀️ Sunny묻기 -->
        <!-- Area ⑪ 📢 공지사항 -->
    </aside>

    <footer class="footer">...</footer>
</div>
```

### Area ① 📦 PROJECT - Implementation Details

**HTML Structure:**
```html
<div class="project-section">
    <h2 class="sidebar-title">📁 Project</h2>

    <!-- Project List Header -->
    <div class="project-list-header" onclick="toggleProjectList()">
        <span>Project 목록</span>
        <span id="projectListArrow">▲</span>
    </div>

    <!-- Project List -->
    <div class="project-list" id="projectList">
        <div class="project-list-item" onclick="selectProject('PoliticianFinder')">
            <span class="project-name">PoliticianFinder</span>
            <span class="project-status" style="background: var(--success);">완료</span>
        </div>
        <div class="project-list-item selected" onclick="selectProject('SSAL Works')">
            <span class="project-name">SSAL Works</span>
            <span class="project-status">진행중</span>
        </div>
    </div>

    <!-- Add New Project Button -->
    <div class="project-menu">
        <div class="project-menu-item" onclick="openAddProjectModal()">
            <span>➕</span>
            <span>새로운 Project 추가</span>
        </div>
    </div>
</div>
```

**Features:**
- Project list with status (completed/in-progress)
- Project selection (updates workspace)
- "Add New Project" button → modal
- Project cards with hover effects

### Area ② 📊 진행 프로세스 - Implementation Details

**HTML Structure (Dynamic from JSON):**
```javascript
const SIDEBAR_STRUCTURE = {
    structure: [
        { id: "P1_사업계획", name: "P1_사업계획", categories: [...] },
        { id: "1_기획", name: "1_기획", categories: [...] },
        { id: "2_개발준비", name: "2_개발준비", categories: [...] },
        { id: "3_개발", name: "3_개발", categories: [...] },
        { id: "4_운영", name: "4_운영", categories: [...] }
    ]
};

// Rendered dynamically by:
loadSidebarStructure() → renderSidebarFromJSON() → generatePhaseHTML()
```

**3-Level Hierarchy:**
1. **Major (Phase):** `.process-major` - 5 phases
2. **Small (Category):** `.process-small` - Sub-categories
3. **Tiny (Item):** `.process-tiny` - Individual items

**Interactive Features:**
- Click major → expand/collapse small list
- Click small → toggle tiny list
- Click tiny → load template in workspace
- Double-click → open folder in VS Code
- Progress bar per phase
- Status indicators (✅🔵⚪🔴)

### Area ③ 🔗 연계 서비스 바로가기 - Implementation Details

**HTML Structure:**
```html
<div class="quick-links-section">
    <h3 class="sidebar-section-title">⚡ 바로가기</h3>
    <div class="quick-links">
        <a href="#dashboard" class="quick-link-btn">
            <span>🏠</span> <span>대시보드</span>
        </a>
        <a href="#grid" class="quick-link-btn">
            <span>📊</span> <span>프로젝트 그리드</span>
        </a>
        <a href="#sunny" class="quick-link-btn" onclick="openSunnySupport(event)">
            <span>💬</span> <span>써니에게 묻기</span>
        </a>
        <a href="#credit" class="quick-link-btn" onclick="rechargeCredit()">
            <span>🪙</span> <span>크레딧 충전</span>
        </a>
        <a href="#settings" class="quick-link-btn">
            <span>⚙️</span> <span>설정</span>
        </a>
    </div>
</div>
```

**Features:**
- Quick access links
- Icon + text labels
- Hover effects
- Click handlers for modals

### Area ④ Workspace (75%) - Implementation Details

**HTML Structure:**
```html
<div class="workspace-top">
    <!-- Header with action buttons -->
    <div class="workspace-header">
        <div class="workspace-title">📝 Order Sheet 작성</div>
        <div class="workspace-actions">
            <button class="action-btn" onclick="clearEditor()">🗑️ 전체 삭제</button>
            <button class="action-btn success" onclick="downloadToInbox()">📥 Download Order Sheet</button>
            <button class="action-btn secondary" onclick="loadFromOutbox()">📤 Load from Outbox</button>
        </div>
    </div>

    <!-- Outbox Notification (hidden by default) -->
    <div class="outbox-notification" id="outboxNotification" style="display: none;">
        <!-- Real-time notification content -->
    </div>

    <!-- Workspace Content -->
    <div class="workspace-content">
        <!-- Translation Preview Section -->
        <div class="translation-section" id="translationSection" style="display: none;">
            <div class="translation-header">
                <div class="translation-title">🌐 영어 번역 미리보기 (한영 병기)</div>
                <button class="translation-toggle" id="toggleText" onclick="toggleTranslation()">▼</button>
            </div>
            <div class="translation-preview" id="translationPreview">
                <pre id="translatedText">번역 대기 중...</pre>
            </div>
        </div>

        <!-- Main Text Editor -->
        <textarea id="textEditor" class="text-editor"
                  placeholder="여기에 Order Sheet를 작성하세요..."
                  oninput="translateToEnglish()"></textarea>
    </div>
</div>
```

**Features:**
- Text editor (textarea) with real-time translation
- Translation preview with bilingual markdown
- Action buttons (Clear, Download, Load)
- Outbox notification popup (real-time)
- Template loading from sidebar click

### Area ⑤ Project SAL Grid (25%) - Implementation Details

**HTML Structure:**
```html
<div class="workspace-bottom">
    <!-- Grid Header -->
    <div class="grid-viewer-header">
        <div class="grid-viewer-title-group">
            <div class="grid-viewer-title">📋 Project SAL Grid</div>
            <div style="display: flex; gap: 12px;">
                <button class="manual-btn-inline" onclick="openManual()">📖 Manual</button>
                <button class="expand-btn-inline" onclick="openGridFullscreen()">⛶ Fullscreen</button>
            </div>
        </div>
        <div class="view-toggle">
            <button class="view-btn active" onclick="switchView('2d')">2D Card</button>
            <button class="view-btn" onclick="switchView('3d')">3D Block</button>
        </div>
    </div>

    <!-- Grid Content -->
    <div class="grid-content" id="gridContent">
        <!-- Stats Bar -->
        <div class="stats-bar">
            <div class="stat-item">
                <span class="stat-label">완료</span>
                <span class="stat-value completed">8</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">진행 중</span>
                <span class="stat-value in-progress">5</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">대기</span>
                <span class="stat-value pending">12</span>
            </div>
        </div>

        <!-- Task Cards (dynamically generated) -->
        <div class="grid-area">
            <div class="area-header">Phase 1: 기획</div>
            <div class="task-cards">
                <!-- Task card example -->
                <div class="task-card completed">
                    <div class="task-header">
                        <span class="task-id">P1BA1</span>
                        <span class="status-badge completed">완료</span>
                    </div>
                    <div class="task-title">회원가입 API</div>
                    <div class="task-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 100%"></div>
                        </div>
                        <span class="progress-text">100%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

**Features:**
- Stats bar (completed/in-progress/pending counts)
- Task cards with status badges
- Progress bars per task
- 2D/3D view toggle
- Fullscreen modal
- Manual link

### Area ⑥-⑪ Right Sidebar - Implementation Details

**Area ⑥ 📚 학습용 콘텐츠 (Books):**
```html
<div class="sidebar-section">
    <h3>📚 학습용 콘텐츠</h3>
    <div class="knowledge-item">
        <div class="knowledge-major" onclick="toggleKnowledge(this)">
            <span class="knowledge-icon">📖</span>
            <span class="knowledge-name">웹 개발 기초</span>
            <span class="knowledge-arrow">▶</span>
        </div>
        <div class="knowledge-medium-list">
            <!-- Medium level items (expandable) -->
        </div>
    </div>
</div>
```

**Area ⑨ 🤖 AI묻기:**
```html
<div class="sidebar-section">
    <h3>🤖 다른 AI에게 묻기</h3>

    <!-- AI Selector Buttons -->
    <div style="display: flex; gap: 6px; margin-bottom: 12px;">
        <button class="ai-selector-btn active" onclick="selectAI('chatgpt', event)">ChatGPT</button>
        <button class="ai-selector-btn" onclick="selectAI('gemini', event)">Gemini</button>
        <button class="ai-selector-btn" onclick="selectAI('perplexity', event)">Perplexity</button>
    </div>

    <!-- Question Input -->
    <div class="ai-input-area">
        <textarea id="aiQuestionInput" placeholder="AI에게 질문을 입력하세요..."></textarea>
        <button onclick="askAI()">🤖 Ask AI</button>
    </div>

    <!-- Credit Balance -->
    <div class="credit-info">
        크레딧 잔액: <span id="creditBalance">2,450</span> C
        <button onclick="rechargeCredit()">충전</button>
    </div>
</div>
```

---

## 🔧 Admin Dashboard Implementation

### Layout Structure

```html
<div class="admin-layout-container">
    <header class="admin-header">SSAL Works Admin - 관리자 대시보드</header>

    <!-- LEFT SIDEBAR (180px) -->
    <aside class="admin-sidebar">
        <h3>메인</h3>
        <div class="admin-menu-item active" onclick="loadSection('dashboard')">
            📊 대시보드 개요
        </div>

        <h3>컨텐츠 관리</h3>
        <div class="admin-menu-item" onclick="loadSection('announcements')">📢 공지사항 관리</div>
        <div class="admin-menu-item" onclick="loadSection('books')">📚 학습용 컨텐츠 관리</div>
        <div class="admin-menu-item" onclick="loadSection('faq')">🙋 FAQ 관리</div>
        <div class="admin-menu-item" onclick="loadSection('templates')">📝 Order Sheet 템플릿</div>
        <div class="admin-menu-item" onclick="loadSection('guides')">📖 안내문 관리</div>

        <h3>회원/결제</h3>
        <div class="admin-menu-item" onclick="loadSection('users')">👥 회원 관리</div>
        <div class="admin-menu-item" onclick="loadSection('subscriptions')">🔄 구독 관리</div>
        <div class="admin-menu-item" onclick="loadSection('payments')">💳 결제 관리</div>
        <div class="admin-menu-item" onclick="loadSection('credits')">🪙 크레딧 관리</div>
        <div class="admin-menu-item" onclick="loadSection('inquiries')">
            💬 문의 관리 <span class="badge">12</span>
        </div>

        <h3>통계</h3>
        <div class="admin-menu-item" onclick="loadSection('analytics')">📈 통계 및 분석</div>
        <div class="admin-menu-item" onclick="loadSection('api-usage')">🔌 API 사용량</div>

        <h3>시스템</h3>
        <div class="admin-menu-item" onclick="loadSection('settings')">⚙️ 설정</div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="admin-content" id="adminMainContent">
        <!-- Dynamic content loaded based on section -->
    </main>

    <footer class="admin-footer">© 2025 SSAL Works. All rights reserved.</footer>
</div>
```

### Dashboard Overview Section

```html
<div class="admin-dashboard-section">
    <!-- 4 Stats Cards -->
    <div class="stats-cards">
        <div class="stat-card primary">
            <div class="stat-icon">👥</div>
            <div class="stat-value">1,234</div>
            <div class="stat-label">총 회원 수</div>
            <div class="stat-change positive">↑ +15명</div>
        </div>
        <div class="stat-card success">
            <div class="stat-icon">💰</div>
            <div class="stat-value">₩5,200,000</div>
            <div class="stat-label">이번 달 매출</div>
            <div class="stat-change positive">↑ +8%</div>
        </div>
        <div class="stat-card warning">
            <div class="stat-icon">🪙</div>
            <div class="stat-value">830,000 C</div>
            <div class="stat-label">크레딧 판매</div>
            <div class="stat-change negative">↓ -5%</div>
        </div>
        <div class="stat-card danger">
            <div class="stat-icon">💬</div>
            <div class="stat-value">12건</div>
            <div class="stat-label">미처리 문의</div>
            <div class="stat-badge">⚠️ 긴급 3건</div>
        </div>
    </div>

    <!-- Recent Activity Timeline -->
    <div class="activity-timeline">
        <h3>최근 활동</h3>
        <div class="timeline-item urgent">
            <span class="timeline-icon">🔴</span>
            <span class="timeline-message">긴급 문의 (결제 오류)</span>
            <span class="timeline-time">3분 전</span>
        </div>
        <!-- More timeline items -->
    </div>

    <!-- Urgent Tasks -->
    <div class="urgent-tasks">
        <h3>긴급 처리 필요</h3>
        <div class="task-list">
            <div class="task-item high-priority" onclick="loadSection('subscriptions')">
                <span class="priority-badge">🔴 High</span>
                <span class="task-description">미납 회원 (구독 정지 예정)</span>
                <span class="task-count">3명</span>
            </div>
            <!-- More urgent tasks -->
        </div>
    </div>

    <!-- Charts -->
    <div class="charts-container">
        <div class="chart-box">
            <h3>회원 가입 추이 (최근 7일)</h3>
            <canvas id="signupChart"></canvas>
        </div>
        <div class="chart-box">
            <h3>매출 추이 (최근 4주)</h3>
            <canvas id="revenueChart"></canvas>
        </div>
    </div>

    <!-- Recent Inquiries -->
    <div class="recent-inquiries">
        <h3>최근 문의</h3>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>문의번호</th>
                    <th>이메일</th>
                    <th>질문</th>
                    <th>상태</th>
                    <th>시간</th>
                    <th>작업</th>
                </tr>
            </thead>
            <tbody id="inquiriesTableBody">
                <!-- Dynamically loaded -->
            </tbody>
        </table>
    </div>
</div>
```

---

## ⚡ Interactive Elements Checklist (247+)

### Category 1: Navigation & Selection (50+)
- [ ] Project selection (영역 ①)
- [ ] Phase expansion/collapse (영역 ②)
- [ ] Category expansion/collapse (영역 ②)
- [ ] Item expansion/collapse (영역 ②)
- [ ] Books expansion/collapse (영역 ⑥)
- [ ] Quick links (영역 ③)
- [ ] Admin menu items
- [ ] Breadcrumb navigation

### Category 2: Forms & Inputs (30+)
- [ ] Text editor (영역 ④)
- [ ] AI question input (영역 ⑨)
- [ ] Support question input (영역 ⑩)
- [ ] File attachments (영역 ⑩)
- [ ] Project creation form
- [ ] Signup form
- [ ] Admin CRUD forms

### Category 3: Buttons & Actions (80+)
- [ ] Clear editor button
- [ ] Download Order Sheet button
- [ ] Load from Outbox button
- [ ] AI Ask button (3 AI types)
- [ ] Credit recharge button
- [ ] Support submit button
- [ ] Modal open/close buttons (5+ modals)
- [ ] View toggle (2D/3D)
- [ ] Fullscreen button
- [ ] Admin CRUD buttons

### Category 4: Modals & Overlays (10+)
- [ ] Grid Fullscreen Modal
- [ ] Translation Fullview Modal
- [ ] Add Project Modal
- [ ] Service Intro Modal
- [ ] Outbox Files Modal
- [ ] Credit Recharge Modal
- [ ] Payment Modal
- [ ] Confirmation dialogs

### Category 5: Real-time Elements (20+)
- [ ] Outbox notification popup
- [ ] Order status updates
- [ ] Outbox watcher (5s polling)
- [ ] Order status tracker (3s polling)
- [ ] Translation preview (300ms debounce)
- [ ] Live stats updates (admin)
- [ ] Activity timeline (admin)

### Category 6: Status Indicators (30+)
- [ ] Task status badges (✅🔵⚪🔴)
- [ ] Progress bars (per task)
- [ ] Phase progress bars
- [ ] Credit balance display
- [ ] Project status (completed/in-progress)
- [ ] Subscription status
- [ ] Payment status

### Category 7: Lists & Tables (27+)
- [ ] Project list (영역 ①)
- [ ] Process hierarchy (영역 ②)
- [ ] Books hierarchy (영역 ⑥)
- [ ] FAQ list (영역 ⑦)
- [ ] Announcement list (영역 ⑪)
- [ ] Task cards grid (영역 ⑤)
- [ ] Outbox file list
- [ ] Admin tables (users, payments, inquiries)

---

## 🧪 Testing & Verification Plan

### Phase 1: Visual Verification
- [ ] All 11 home areas visible
- [ ] All admin sections visible
- [ ] Layout matches original (198px-1fr-266px)
- [ ] Colors match CSS variables
- [ ] Fonts render correctly

### Phase 2: Interactive Testing
- [ ] Click all 247+ interactive elements
- [ ] Test all 58 JavaScript functions
- [ ] Verify expansion/collapse animations
- [ ] Test modal open/close
- [ ] Test form submissions

### Phase 3: Real-time Testing
- [ ] Outbox watcher polling (5s)
- [ ] Order status tracking (3s)
- [ ] Translation debounce (300ms)
- [ ] Notification popups

### Phase 4: User Flow Testing
- [ ] Signup flow simulation
- [ ] Project registration flow
- [ ] Order Sheet creation flow
- [ ] AI Q&A flow
- [ ] Support inquiry flow
- [ ] Admin content management flow

### Phase 5: Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari

### Phase 6: Comparison with Original
- [ ] Line-by-line CSS comparison
- [ ] Function-by-function JS comparison
- [ ] Feature completeness check
- [ ] Enhancement verification

---

## 📦 Deliverables

### File 1: home_screen_complete_mockup.html
- ✅ 5,500+ lines (enhanced from original 5,221)
- ✅ 100% CSS preserved + enhancements
- ✅ 100% JavaScript (58 functions) + additions
- ✅ All 11 areas functional
- ✅ All 247+ interactive elements
- ✅ All User Flow integrations

### File 2: admin_dashboard_complete_mockup.html
- ✅ 3,500+ lines
- ✅ Admin-specific layout & styling
- ✅ Dashboard overview with charts
- ✅ 5 admin sections fully functional
- ✅ CRUD interfaces for all content types
- ✅ Real-time statistics & monitoring

### Supporting Documentation
- ✅ EXTRACTED_CSS_SYSTEM.md (completed)
- ✅ EXTRACTED_JAVASCRIPT_FUNCTIONS.md (completed)
- ✅ USERFLOW_SUMMARY.md (completed)
- ✅ ADMIN_WORKFLOWS_SUMMARY.md (completed)
- ✅ MOCKUP_INTEGRATION_PLAN.md (this document)

---

## 🚀 Implementation Timeline

### Step 1: Copy Base Structure (5 minutes)
- Copy dashboard-mockup.html as template
- Review all 5,221 lines
- Understand structure

### Step 2: Verify CSS (10 minutes)
- Compare with EXTRACTED_CSS_SYSTEM.md
- Ensure all variables present
- Verify all component styles

### Step 3: Verify JavaScript (15 minutes)
- Compare with EXTRACTED_JAVASCRIPT_FUNCTIONS.md
- Ensure all 58 functions present
- Check global variables

### Step 4: Add User Flow Integrations (30 minutes)
- Add signup flow elements
- Add project registration elements
- Add subscription elements
- Add credit purchase elements

### Step 5: Add Missing Areas (20 minutes)
- Verify all 11 areas present
- Add missing sub-sections
- Complete sidebar items

### Step 6: Add Admin Dashboard (40 minutes)
- Create admin layout
- Add sidebar menu
- Implement dashboard overview
- Add CRUD interfaces
- Integrate Chart.js

### Step 7: Testing (30 minutes)
- Test all 247+ interactions
- Verify real-time features
- Check responsiveness
- Cross-browser test

### Step 8: Final Verification (20 minutes)
- Compare with original line-by-line
- Document all enhancements
- Create verification report

**Total Estimated Time:** 2 hours 50 minutes

---

## ✅ Success Criteria (Final Checklist)

### Completeness
- [ ] All 11 home areas implemented
- [ ] All 5 admin sections implemented
- [ ] All 58 JavaScript functions working
- [ ] All 247+ interactive elements functional
- [ ] All CSS variables preserved
- [ ] All User Flows integrated

### Quality
- [ ] No broken functionality
- [ ] No console errors
- [ ] Smooth animations
- [ ] Proper event handling
- [ ] Clean, readable code

### Enhancements
- [ ] Better than original (user feedback)
- [ ] More features than original
- [ ] Better documentation
- [ ] Future-ready architecture

### Verification
- [ ] Original vs new comparison completed
- [ ] All tests passed
- [ ] User Flow scenarios verified
- [ ] Admin workflows verified

---

## 📄 Summary

This integration plan provides a complete blueprint for creating two high-quality mockup files that are **BETTER** than the original while preserving 100% of its functionality.

**Key Principles Followed:**
1. ✅ **"제대로 & 빠르게"** - Do it right, do it fast
2. ✅ **No false completion** - Verify everything
3. ✅ **Complete preservation** - All CSS, all JS, all features
4. ✅ **Enhancement, not replacement** - Build on original, don't simplify
5. ✅ **Thorough testing** - 247+ elements, all flows
6. ✅ **Proper documentation** - Clear, detailed, actionable

**Ready for Implementation.**

---

**End of Mockup Integration Plan**
