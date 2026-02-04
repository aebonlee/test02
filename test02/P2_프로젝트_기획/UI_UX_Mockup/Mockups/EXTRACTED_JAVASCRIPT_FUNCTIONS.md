# Dashboard Mockup - Complete JavaScript Functions Extraction

**Source:** `dashboard-mockup.html` (Lines 3000-5221)
**Extracted:** 2025-12-03
**Purpose:** Complete JavaScript function documentation for mockup recreation

---

## Table of Contents
1. [Global Variables & Configuration](#1-global-variables--configuration)
2. [Sidebar & Navigation Functions](#2-sidebar--navigation-functions)
3. [Template & Editor Functions](#3-template--editor-functions)
4. [Translation Functions](#4-translation-functions)
5. [Orders/Reports Functions](#5-ordersreports-functions)
6. [AI Integration Functions](#6-ai-integration-functions)
7. [Support & Help Functions](#7-support--help-functions)
8. [Modal Management Functions](#8-modal-management-functions)
9. [Project Management Functions](#9-project-management-functions)
10. [Real-time Monitoring Functions](#10-real-time-monitoring-functions)
11. [Utility Functions](#11-utility-functions)

---

## 1. Global Variables & Configuration

### SIDEBAR_STRUCTURE (Constant)
```javascript
const SIDEBAR_STRUCTURE = {
    "metadata": {
        "lastUpdate": "2025-11-19",
        "source": "PROJECT_DIRECTORY_STRUCTURE.md"
    },
    "manual": {
        "title": "PROJECT SAL GRID 매뉴얼",
        "path": "2_개발준비/2-4_Project_Grid/manual/PROJECT_SAL_GRID_매뉴얼.md",
        "description": "프로젝트 그리드 작성 방법, Task ID 규칙, Dual Execution System"
    },
    "structure": [...]  // 5 phases with nested categories
};
```
**Purpose:** Embedded JSON structure containing the entire project hierarchy (P1_사업계획 through 4_운영).

### PROJECT_CONFIGS (Object)
```javascript
const PROJECT_CONFIGS = {
    'PoliticianFinder': {
        ordersPath: 'C:\\!SSAL_Works_Private\\Developement_Real_PoliticianFinder\\Human_ClaudeCode_Bridge\\Orders',
        status: 'completed'
    },
    'SSAL Works': {
        ordersPath: 'C:\\!SSAL_Works_Private\\Human_ClaudeCode_Bridge\\Orders',
        status: 'in_progress'
    }
};
```
**Purpose:** Multi-project configuration for different orders paths.

### State Variables
```javascript
let currentSelectedProject = 'SSAL Works';
let ordersheetTemplates = null;
let translationTimeout = null;
let selectedAI = 'chatgpt';
let outboxCheckerInterval = null;
let lastOutboxCount = 0;
let orderStatusIntervals = {};  // Order ID → interval mapping
let supportFiles = [];
let currentCreditBalance = 2450;
```

---

## 2. Sidebar & Navigation Functions

### 2.1 loadSidebarStructure()
```javascript
function loadSidebarStructure()
```
**Purpose:** Loads embedded SIDEBAR_STRUCTURE data and renders it to DOM.
**Called:** On DOMContentLoaded event.
**Flow:**
1. Reads SIDEBAR_STRUCTURE constant
2. Calls renderSidebarFromJSON()

### 2.2 renderSidebarFromJSON(data)
```javascript
function renderSidebarFromJSON(data)
```
**Parameters:**
- `data`: SIDEBAR_STRUCTURE object

**Purpose:** Clears existing sidebar and generates HTML from JSON data.
**Algorithm:**
1. Find `.process-list` container
2. Clear innerHTML
3. Loop through `data.structure` (5 phases)
4. Call `generatePhaseHTML()` for each phase
5. Insert generated HTML

### 2.3 generatePhaseHTML(phase, index)
```javascript
function generatePhaseHTML(phase, index)
```
**Parameters:**
- `phase`: Phase object (P1_사업계획, 1_기획, etc.)
- `index`: Phase index (0-4)

**Purpose:** Generate complete HTML for a major process phase.
**Returns:** HTML string with:
- `.process-major` wrapper
- Progress bar
- Nested categories via `generateCategoryHTML()`
- Direct items via `generateDirectItemHTML()`

**Status Logic:**
```javascript
const status = index === 0 ? 'completed' : index === 1 ? 'active' : '';
```

### 2.4 generateCategoryHTML(category, phaseId)
```javascript
function generateCategoryHTML(category, phaseId)
```
**Parameters:**
- `category`: Category object (1-2.Project_Plan, etc.)
- `phaseId`: Parent phase ID

**Purpose:** Generate HTML for medium-level categories (중분류).
**Features:**
- Creates `.process-small` element
- Adds onclick for `loadTemplate()`
- Adds ondblclick for `openFolder()`
- Generates `.process-tiny-list` for sub-items

### 2.5 generateDirectItemHTML(item, phaseId)
```javascript
function generateDirectItemHTML(item, phaseId)
```
**Parameters:**
- `item`: Item object
- `phaseId`: Parent phase ID

**Purpose:** Generate HTML for items directly under a phase (no category parent).
**Returns:** `.process-small` HTML string.

### 2.6 toggleProcess(el)
```javascript
function toggleProcess(el)
```
**Parameters:**
- `el`: Clicked `.process-major` element

**Purpose:** Expand/collapse major process tree.
**Algorithm:**
1. Find `.process-small-list` child
2. Toggle `.expanded` class
3. Rotate arrow icon (▶ → ▼)
4. Set `active` class (if not completed)
5. Remove `active` from other major processes

### 2.7 toggleProcessTiny(el)
```javascript
function toggleProcessTiny(el)
```
**Parameters:**
- `el`: Clicked `.process-small` element

**Purpose:** Expand/collapse 3rd-level tiny list.
**Algorithm:**
1. Find next sibling with `.process-tiny-list`
2. Toggle `.expanded` class
3. Rotate arrow

### 2.8 toggleKnowledge(el) & toggleKnowledgeSmall(el)
```javascript
function toggleKnowledge(el)
function toggleKnowledgeSmall(el)
```
**Purpose:** Expand/collapse knowledge sections in right sidebar (학습용 콘텐츠).
**Similar to:** `toggleProcess()` and `toggleProcessTiny()`

---

## 3. Template & Editor Functions

### 3.1 loadOrderSheetTemplates()
```javascript
async function loadOrderSheetTemplates()
```
**Purpose:** Load order sheet templates from server on page load.
**Endpoint:** `GET http://localhost:3030/ordersheet-templates`
**Stores:** Templates in `ordersheetTemplates` variable.
**Called:** On DOMContentLoaded.

### 3.2 loadTemplate(categoryKey)
```javascript
function loadTemplate(categoryKey)
```
**Parameters:**
- `categoryKey`: Template identifier (e.g., '1-2_Project_Plan')

**Purpose:** Load template content into text editor.
**Algorithm:**
1. Check if `ordersheetTemplates[categoryKey]` exists
2. Confirm with user if editor has content
3. Set `#textEditor.value = template.template`
4. Show success status

### 3.3 loadWelcomeMessage()
```javascript
function loadWelcomeMessage()
```
**Purpose:** Display welcome message with Claude Code usage instructions.
**Called:** On page load.
**Content:** Multi-section markdown guide:
- Claude Code CLI 실행 방법
- 대시보드 사용법
- Order Sheet 작성법
- AI 질문 방법

### 3.4 clearEditor()
```javascript
function clearEditor()
```
**Purpose:** Clear text editor with confirmation.
**Flow:**
1. `confirm('작성 중인 내용을 삭제하시겠습니까?')`
2. If yes: `document.getElementById('textEditor').value = ''`

---

## 4. Translation Functions

### 4.1 translateToEnglish()
```javascript
async function translateToEnglish()
```
**Purpose:** Auto-translate Korean content to English (real-time with debounce).
**Trigger:** `oninput` event on `#textEditor` (300ms debounce).
**Algorithm:**
1. Clear previous timeout
2. Check for Korean characters: `/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/`
3. If no Korean → hide translation section
4. If Korean → show "번역 중..." → call `translateWithAI()`
5. Display bilingual markdown via `generateBilingualMarkdown()`

### 4.2 translateWithAI(text)
```javascript
async function translateWithAI(text)
```
**Parameters:**
- `text`: Korean text to translate

**Purpose:** AI-powered translation + grammar correction.
**Endpoint:** `POST http://localhost:3030/translate`
**Request Body:**
```json
{
  "text": "...",
  "mode": "translate_and_fix"
}
```
**Fallback:** If API fails → `mockTranslate()`

### 4.3 mockTranslate(text)
```javascript
async function mockTranslate(text)
```
**Parameters:**
- `text`: Text to translate

**Purpose:** Simple keyword-based translation fallback.
**Method:** Dictionary mapping (e.g., '회원가입' → 'Sign Up').
**Used When:** `translateWithAI()` fails.

### 4.4 generateBilingualMarkdown(koreanText, englishText)
```javascript
function generateBilingualMarkdown(koreanText, englishText)
```
**Parameters:**
- `koreanText`: Original Korean
- `englishText`: Translated English

**Purpose:** Create bilingual markdown where Korean is in HTML comments.
**Format:**
```markdown
<!-- Claude Code: Read English only -->

<!-- 🇰🇷 한글 내용 -->
English content
```
**Reason:** Claude Code only reads English, Korean is for human reference.

### 4.5 toggleTranslation()
```javascript
function toggleTranslation()
```
**Purpose:** Show/hide translation preview panel.
**Toggles:** `#translationPreview` display (none ↔ block)
**Arrow:** Changes between ▲ and ▼

---

## 5. Orders/Reports Functions

### 5.1 downloadToOrders()
```javascript
async function downloadToOrders()
```
**Purpose:** Save order sheet to project's Orders folder as JSON.
**Flow:**
1. Validate content and project selection
2. Confirm save with user
3. Detect Korean → translate if needed
4. Generate Order ID: `ORDER-{AREA}-{YYMMDD}-{SEQ}`
5. Create JSON structure:
```json
{
  "order_id": "ORDER-GE-251203-42",
  "order_name": "Dashboard에서 생성된 작업",
  "content_korean": "...",
  "content_english": "...",
  "priority": "medium",
  "status": "pending",
  "created_at": "2025-12-03T10:30:00.000Z",
  "project": "SSAL Works",
  "metadata": {
    "source": "dashboard-mockup",
    "has_translation": true
  }
}
```
6. POST to `http://localhost:3030/save`
7. Start order status tracking
8. Show success alert

**Fallback:** If server down → `manualDownload()`

### 5.2 manualDownload(content, filename)
```javascript
function manualDownload(content, filename)
```
**Parameters:**
- `content`: File content
- `filename`: Filename

**Purpose:** Browser download fallback when server unavailable.
**Method:**
1. Create Blob
2. Create temporary `<a>` element
3. Trigger click event
4. Cleanup

### 5.3 loadFromReports()
```javascript
async function loadFromReports()
```
**Purpose:** Load and display completed work from Claude Code (Reports).
**Endpoint:** `GET http://localhost:3030/reports/files`
**Algorithm:**
1. Fetch file list from Reports
2. For each JSON file:
   - Read file content
   - Extract `question`/`content_korean`
   - Show preview in modal
3. Sort by modified date (newest first)
4. Display in `#outboxFilesModal`
5. Exclude `*_ack.json` files

**File Display:**
```html
<div class="outbox-file-item">
    <div class="outbox-file-icon">📋</div>
    <div class="outbox-file-info">
        <div class="outbox-file-name">질문 내용 미리보기...</div>
        <div class="outbox-file-meta">ORDER-GE-251203-42 | 2025-12-03 10:30</div>
    </div>
    <div class="outbox-file-badge json">JSON</div>
</div>
```

### 5.4 selectOutboxFile(file)
```javascript
async function selectOutboxFile(file)
```
**Parameters:**
- `file`: File object from Outbox

**Purpose:** Display selected Outbox file content.
**Endpoint:** `GET http://localhost:3030/outbox/read/{filename}`
**Features:**
- Parse JSON structure
- Generate HTML preview
- Display in modal with syntax highlighting

### 5.5 generateHTMLFromJSON(data)
```javascript
function generateHTMLFromJSON(data)
```
**Parameters:**
- `data`: Parsed JSON object

**Purpose:** Convert JSON to readable HTML for preview.
**Returns:** Formatted HTML with proper styling.

### 5.6 closeOutboxModal()
```javascript
function closeOutboxModal()
```
**Purpose:** Close Outbox files modal and restore scroll.

---

## 6. AI Integration Functions

### 6.1 selectAI(aiType, event)
```javascript
function selectAI(aiType, event)
```
**Parameters:**
- `aiType`: 'chatgpt' | 'gemini' | 'perplexity'
- `event`: Click event

**Purpose:** Switch selected AI provider.
**Updates:**
- `selectedAI` global variable
- Button active states
- AI icon display

### 6.2 askAI()
```javascript
async function askAI()
```
**Purpose:** Send question to selected AI provider.
**Algorithm:**
1. Get question from `#aiQuestionInput`
2. Validate not empty
3. Determine endpoint based on `selectedAI`:
   - ChatGPT: `/ask-chatgpt`
   - Gemini: `/ask-gemini`
   - Perplexity: `/ask-perplexity`
4. POST request to `http://localhost:3030/{endpoint}`
5. Display response in workspace

**Response Display:**
```javascript
workspace.innerHTML = `
    <div class="ai-response-header">
        <strong>${aiName}</strong>의 답변
    </div>
    <div class="ai-response-content">${result.answer}</div>
    <div class="ai-response-meta">
        ${new Date().toLocaleString('ko-KR')}
    </div>
`;
```

### 6.3 askPerplexity()
```javascript
async function askPerplexity()
```
**Purpose:** Dedicated Perplexity question function (used in FAQ section).
**Similar to:** `askAI()` but specifically for Perplexity.
**Features:**
- Credit balance check
- Deduct credits on use
- Update credit display

### 6.4 rechargeCredit()
```javascript
function rechargeCredit()
```
**Purpose:** Handle Perplexity credit recharge.
**Flow:**
1. Show confirmation dialog
2. Simulate payment
3. Add 1000 credits
4. Update `currentCreditBalance`
5. Update UI display

---

## 7. Support & Help Functions

### 7.1 openSunnySupport(event)
```javascript
function openSunnySupport(event)
```
**Parameters:**
- `event`: Click event

**Purpose:** Toggle Sunny support panel (문의하기).
**Features:**
- Slide animation
- File attachment support
- Response display area

### 7.2 submitSupport()
```javascript
async function submitSupport()
```
**Purpose:** Submit support request to server.
**Endpoint:** `POST http://localhost:3030/support/submit`
**Request Body:**
```json
{
  "question": "...",
  "files": [
    { "name": "file.txt", "size": 1024, "type": "text/plain" }
  ]
}
```
**Response:** Display mock answer from "Sunny".

### 7.3 handleSupportFileSelect(event)
```javascript
function handleSupportFileSelect(event)
```
**Parameters:**
- `event`: File input change event

**Purpose:** Handle file attachments for support.
**Features:**
- Multiple file selection
- File size display (KB)
- File type icons
- Remove file buttons

### 7.4 removeSupportFile(index)
```javascript
function removeSupportFile(index)
```
**Parameters:**
- `index`: File index in `supportFiles` array

**Purpose:** Remove attached file from support request.

### 7.5 displaySupportResponse(question, answer, answeredAt)
```javascript
function displaySupportResponse(question, answer, answeredAt)
```
**Parameters:**
- `question`: User's question
- `answer`: Support response
- `answeredAt`: Timestamp

**Purpose:** Format and display support response.
**HTML Structure:**
```html
<div class="response-header">✅ Sunny의 답변</div>
<div class="response-content">
    <strong>Q:</strong> {question}
    <strong>A:</strong> {answer}
</div>
<div class="response-meta">답변 시각: {answeredAt}</div>
```

---

## 8. Modal Management Functions

### 8.1 openGridFullscreen()
```javascript
function openGridFullscreen()
```
**Purpose:** Open Project SAL Grid in fullscreen modal.
**Actions:**
1. Copy grid content from workspace bottom
2. Insert into `#gridFullscreenModal`
3. Add `.active` class
4. Disable body scroll

### 8.2 closeGridFullscreen()
```javascript
function closeGridFullscreen()
```
**Purpose:** Close fullscreen grid modal.
**Actions:**
1. Remove `.active` class
2. Restore body scroll

### 8.3 openTranslationFullview()
```javascript
function openTranslationFullview()
```
**Purpose:** Open translation preview in fullscreen.
**Features:**
- Large view for long translations
- Bilingual markdown display

### 8.4 closeTranslationFullview()
```javascript
function closeTranslationFullview()
```
**Purpose:** Close translation fullview modal.

### 8.5 openAddProjectModal()
```javascript
function openAddProjectModal()
```
**Purpose:** Open "Add New Project" modal.
**Form Fields:**
- Project name
- Inbox path
- Project status

### 8.6 closeAddProjectModal()
```javascript
function closeAddProjectModal()
```
**Purpose:** Close add project modal.

### 8.7 openServiceIntro()
```javascript
function openServiceIntro()
```
**Purpose:** Open SSAL Works service introduction modal.
**Content:**
- Company branding
- Service features
- Pricing information

### 8.8 closeServiceIntro()
```javascript
function closeServiceIntro()
```
**Purpose:** Close service intro modal.

### 8.9 openManual()
```javascript
function openManual()
```
**Purpose:** Open Project SAL Grid manual in new window.
**Action:** Navigate to manual path from `SIDEBAR_STRUCTURE.manual.path`

---

## 9. Project Management Functions

### 9.1 toggleProjectList()
```javascript
function toggleProjectList()
```
**Purpose:** Expand/collapse project list in left sidebar.
**Toggles:**
- Project list visibility
- Arrow direction (▲ ↔ ▼)

### 9.2 selectProject(projectName)
```javascript
function selectProject(projectName)
```
**Parameters:**
- `projectName`: 'PoliticianFinder' | 'SSAL Works'

**Purpose:** Switch active project.
**Actions:**
1. Update `currentSelectedProject`
2. Update UI selection states
3. Update header tagline
4. Load project-specific data

### 9.3 addProjectToList(name)
```javascript
function addProjectToList(name)
```
**Parameters:**
- `name`: New project name

**Purpose:** Add new project to sidebar list.
**Creates:**
```html
<div class="project-list-item" onclick="selectProject('{name}')">
    <span class="project-name">{name}</span>
    <span class="project-status">진행중</span>
</div>
```

### 9.4 isProjectCompleted()
```javascript
function isProjectCompleted()
```
**Returns:** Boolean
**Purpose:** Check if current project is completed.
**Logic:** `PROJECT_CONFIGS[currentSelectedProject].status === 'completed'`

---

## 10. Real-time Monitoring Functions

### 10.1 startOutboxWatcher()
```javascript
async function startOutboxWatcher()
```
**Purpose:** Monitor Outbox for new files from Claude Code.
**Interval:** 5 seconds
**Algorithm:**
1. Poll `http://localhost:3030/outbox/files` every 5s
2. Compare file count with `lastOutboxCount`
3. If new files → call `showOutboxNotification()`
4. Update `lastOutboxCount`

**Started:** On page load (DOMContentLoaded)

### 10.2 stopOutboxWatcher()
```javascript
function stopOutboxWatcher()
```
**Purpose:** Stop Outbox monitoring.
**Action:** Clear interval stored in `outboxCheckerInterval`

### 10.3 showOutboxNotification(fileCount, files)
```javascript
function showOutboxNotification(fileCount, files)
```
**Parameters:**
- `fileCount`: Number of new files
- `files`: Array of file objects

**Purpose:** Display notification popup for new Outbox files.
**Notification HTML:**
```html
<div class="outbox-notification">
    <div class="outbox-notification-icon">📬</div>
    <div class="outbox-notification-text">
        <div class="outbox-notification-title">새로운 결과물 {fileCount}개</div>
        <div class="outbox-notification-message">Claude Code가 작업을 완료했습니다</div>
    </div>
    <button class="outbox-notification-btn" onclick="loadFromOutboxNotification()">
        확인하기
    </button>
    <button class="outbox-notification-close" onclick="closeOutboxNotification()">
        ✕
    </button>
</div>
```

### 10.4 closeOutboxNotification()
```javascript
function closeOutboxNotification()
```
**Purpose:** Close Outbox notification popup.

### 10.5 loadFromOutboxNotification()
```javascript
function loadFromOutboxNotification()
```
**Purpose:** Close notification and open Outbox modal.
**Calls:** `closeOutboxNotification()` → `loadFromOutbox()`

### 10.6 startOrderStatusTracking(orderId)
```javascript
function startOrderStatusTracking(orderId)
```
**Parameters:**
- `orderId`: Order ID to track (e.g., 'ORDER-GE-251203-42')

**Purpose:** Start polling order status.
**Interval:** 3 seconds
**Algorithm:**
1. Create interval that calls `checkOrderStatus(orderId)`
2. Store interval in `orderStatusIntervals[orderId]`
3. Poll every 3 seconds

### 10.7 checkOrderStatus(orderId)
```javascript
async function checkOrderStatus(orderId)
```
**Parameters:**
- `orderId`: Order ID to check

**Purpose:** Check current order status.
**Endpoint:** `GET http://localhost:3030/order/status/{orderId}`
**Response:**
```json
{
  "success": true,
  "status": "in_progress" | "completed" | "failed",
  "message": "..."
}
```
**Actions:**
- If completed → call `stopOrderStatusTracking()`
- Update UI with status
- Show notification if status changed

### 10.8 stopOrderStatusTracking(orderId)
```javascript
function stopOrderStatusTracking(orderId)
```
**Parameters:**
- `orderId`: Order ID to stop tracking

**Purpose:** Stop polling order status.
**Action:** Clear interval from `orderStatusIntervals[orderId]`

### 10.9 updateOrderStatus(orderId, status, message)
```javascript
function updateOrderStatus(orderId, status, message)
```
**Parameters:**
- `orderId`: Order ID
- `status`: New status
- `message`: Status message

**Purpose:** Update order status in UI.
**Features:**
- Status badge color change
- Status icon update
- Toast notification

---

## 11. Utility Functions

### 11.1 showStatus(message, type, duration)
```javascript
function showStatus(message, type = 'info', duration = 3000)
```
**Parameters:**
- `message`: Status message
- `type`: 'info' | 'success' | 'error' (default: 'info')
- `duration`: Display duration in ms (default: 3000)

**Purpose:** Show temporary status indicator.
**Element:** `#serverStatus` (fixed position bottom-right)
**Auto-hide:** After `duration` ms

### 11.2 switchView(viewType)
```javascript
function switchView(viewType)
```
**Parameters:**
- `viewType`: '2d' | '3d'

**Purpose:** Switch Project SAL Grid view mode.
**Actions:**
1. Update active button states
2. Regenerate grid HTML
3. Apply appropriate CSS classes

### 11.3 openFolder(folderPath)
```javascript
function openFolder(folderPath)
```
**Parameters:**
- `folderPath`: Relative folder path (e.g., '1_기획/1-2_Project_Plan')

**Purpose:** Open folder in VS Code (double-click on sidebar items).
**Method:**
1. Send request to server
2. Server executes `code` command
3. Opens VS Code at specified path

**Note:** Requires VS Code CLI (`code`) in PATH.

---

## Function Summary by Category

### Sidebar & Navigation (9 functions)
- loadSidebarStructure()
- renderSidebarFromJSON()
- generatePhaseHTML()
- generateCategoryHTML()
- generateDirectItemHTML()
- toggleProcess()
- toggleProcessTiny()
- toggleKnowledge()
- toggleKnowledgeSmall()

### Template & Editor (4 functions)
- loadOrderSheetTemplates()
- loadTemplate()
- loadWelcomeMessage()
- clearEditor()

### Translation (5 functions)
- translateToEnglish()
- translateWithAI()
- mockTranslate()
- generateBilingualMarkdown()
- toggleTranslation()

### Orders/Reports (6 functions)
- downloadToOrders()
- manualDownload()
- loadFromReports()
- selectReportsFile()
- generateHTMLFromJSON()
- closeReportsModal()

### AI Integration (4 functions)
- selectAI()
- askAI()
- askPerplexity()
- rechargeCredit()

### Support & Help (5 functions)
- openSunnySupport()
- submitSupport()
- handleSupportFileSelect()
- removeSupportFile()
- displaySupportResponse()

### Modal Management (9 functions)
- openGridFullscreen()
- closeGridFullscreen()
- openTranslationFullview()
- closeTranslationFullview()
- openAddProjectModal()
- closeAddProjectModal()
- openServiceIntro()
- closeServiceIntro()
- openManual()

### Project Management (4 functions)
- toggleProjectList()
- selectProject()
- addProjectToList()
- isProjectCompleted()

### Real-time Monitoring (9 functions)
- startOutboxWatcher()
- stopOutboxWatcher()
- showOutboxNotification()
- closeOutboxNotification()
- loadFromOutboxNotification()
- startOrderStatusTracking()
- checkOrderStatus()
- stopOrderStatusTracking()
- updateOrderStatus()

### Utility (3 functions)
- showStatus()
- switchView()
- openFolder()

---

## API Endpoints Used

### Inbox Server (localhost:3030)
```
GET  /ordersheet-templates         - Load order templates
POST /translate                    - AI translation + grammar fix
POST /save                         - Save order to Inbox
GET  /outbox/files                 - List Outbox files
GET  /outbox/read/{filename}       - Read specific file
GET  /order/status/{orderId}       - Check order status
POST /support/submit               - Submit support request
```

### AI Server (localhost:3030)
```
POST /ask-chatgpt                  - ChatGPT GPT-5
POST /ask-gemini                   - Gemini 2.5 Pro
POST /ask-perplexity               - Perplexity search
```

---

## Event Listeners

### DOMContentLoaded
```javascript
document.addEventListener('DOMContentLoaded', () => {
    loadSidebarStructure();
    loadOrderSheetTemplates();
    loadWelcomeMessage();
    startOutboxWatcher();
});
```

### Text Editor Input (Debounced)
```javascript
document.getElementById('textEditor').addEventListener('input', translateToEnglish);
// 300ms debounce applied internally
```

---

## Key Technical Patterns

### 1. Hierarchical Tree Expansion
```javascript
// Three levels of expansion: Major → Small → Tiny
.process-small-list { max-height: 0; transition: max-height 0.3s; }
.process-small-list.expanded { max-height: 600px; }
```

### 2. Real-time Polling
```javascript
// 5-second interval for Outbox, 3-second for Order status
setInterval(() => checkOrderStatus(), 3000);
```

### 3. Bilingual Markdown Generation
```javascript
// Korean in HTML comments, English as plain text
<!-- 🇰🇷 한글 내용 -->
English content
```

### 4. Multi-AI Integration
```javascript
// Single interface, multiple backends
const endpoints = {
    'chatgpt': '/ask-chatgpt',
    'gemini': '/ask-gemini',
    'perplexity': '/ask-perplexity'
};
```

### 5. Order ID Generation
```javascript
// Format: ORDER-{AREA}-{YYMMDD}-{SEQ}
const orderId = `ORDER-GE-${dateStr}-${seq}`;
// Example: ORDER-GE-251203-42
```

---

## Global State Management

```javascript
// Project state
let currentSelectedProject = 'SSAL Works';

// Translation state
let translationTimeout = null;

// AI state
let selectedAI = 'chatgpt';
let currentCreditBalance = 2450;

// Monitoring state
let outboxCheckerInterval = null;
let lastOutboxCount = 0;
let orderStatusIntervals = {};  // orderId → intervalId mapping

// Support state
let supportFiles = [];

// Template state
let ordersheetTemplates = null;
```

---

**Total Functions:** 58 functions
**Lines of JavaScript:** ~2,200 lines (approx.)
**External Dependencies:** None (vanilla JavaScript)
**Server Requirements:** Node.js servers for inbox/AI APIs

---

**End of JavaScript Functions Extraction**
