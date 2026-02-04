# Dashboard Mockup - Complete CSS System Extraction

**Source:** `dashboard-mockup.html` (Lines 8-1653)
**Extracted:** 2025-12-03
**Purpose:** Complete CSS documentation for mockup recreation

---

## 1. CSS Variables (:root)

### Color Palette
```css
/* Main Theme - Purple (Header, Main Elements) */
--primary: #6B5CCC;
--primary-dark: #5847B3;

/* Secondary Theme - Orange (Buttons, Actions) */
--secondary: #CC785C;
--secondary-dark: #B35A44;

/* Tertiary Theme - Teal (Progress, Accents) */
--tertiary: #20808D;
--tertiary-dark: #20808D;

/* Status Colors */
--success: #20808D;
--warning: #ffc107;
--danger: #dc3545;
--info: #0099ff;
--neutral: #6c757d;

/* Background */
--bg-light: #f8f9fa;
--bg-white: #ffffff;
--border-color: #dee2e6;

/* Misc */
--border-radius: 8px;
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
```

---

## 2. Layout System

### Grid Container
```css
.layout-container {
    display: grid;
    grid-template-columns: 198px 1fr 266px;  /* Left | Center | Right */
    grid-template-rows: 70px 1fr 60px;       /* Header | Content | Footer */
    min-height: 100vh;
    gap: 0;
    max-width: 1800px;
    margin: 0 auto;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.15);
}
```

### Typography
```css
body {
    font-family: 'Noto Sans KR', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #212529;
    background: var(--bg-light);
    padding: 0 20px;
}
```

---

## 3. Header Component (.header)

```css
.header {
    grid-column: 1 / 4;
    grid-row: 1;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    box-shadow: var(--shadow-md);
    z-index: 100;
}
```

### Logo Component
```css
.logo {
    font-size: 28px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Segoe UI', 'Arial', sans-serif;
    letter-spacing: -0.5px;
}

.rice-logo {
    display: flex;
    align-items: center;
    gap: 3px;
    transform: rotate(-15deg);
}

.rice-grain {
    width: 8px;
    height: 14px;
    background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
    border-radius: 40%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.rice-grain:nth-child(1) { transform: rotate(-5deg); }
.rice-grain:nth-child(2) { transform: rotate(5deg); margin-top: 2px; }
.rice-grain:nth-child(3) { transform: rotate(-3deg); margin-top: -1px; }
```

### Header Tagline
```css
.header-tagline {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.3px;
    opacity: 0.95;
    white-space: nowrap;
    color: white;
}
```

### Header Buttons
```css
.header-btn {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    color: white;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.header-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
}
```

### Notification Badge
```css
.notification-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
}

.notification-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    border: 2px solid var(--primary);
}
```

---

## 4. Left Sidebar (.left-sidebar)

```css
.left-sidebar {
    grid-column: 1;
    grid-row: 2;
    overflow-y: auto;
    background: var(--bg-white);
    border-right: 1px solid var(--border-color);
    padding: 16px 8px 16px 12px;
    display: flex;
    flex-direction: column;
}
```

### Project List
```css
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

.project-list-item:hover {
    background: #e9ecef;
    transform: translateX(2px);
}

.project-list-item.selected {
    background: #e3f5f8;
    border-left-color: #20808D;
    border-left-width: 4px;
}
```

### Process Hierarchy

#### Major Process (Level 1)
```css
.process-major {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    transition: all 0.2s;
    cursor: pointer;
    margin-bottom: 8px;
}

.process-major:hover {
    background: var(--success);
    color: white;
}

.process-major.active {
    background: var(--success);
    color: white;
}

.process-major.completed {
    background: #d4edda;
}
```

#### Small Process (Level 2)
```css
.process-small {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 8px;
    font-size: 11px;
    color: #6c757d;
    margin-bottom: 2px;
    border-radius: 4px;
    transition: all 0.2s;
    cursor: pointer;
}

.process-small:hover {
    background: #f8f9fa;
    color: var(--primary);
}
```

#### Tiny Process (Level 3)
```css
.process-tiny {
    padding: 3px 6px;
    font-size: 10px;
    color: #868e96;
    cursor: pointer;
    border-radius: 3px;
    margin-bottom: 1px;
    transition: all 0.2s;
}

.process-tiny:hover {
    background: #f8f9fa;
    color: var(--primary);
}
```

### Process List Expansion
```css
.process-small-list {
    margin-left: 4px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.process-small-list.expanded {
    max-height: 600px;
}

.process-tiny-list {
    margin-left: 6px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.process-tiny-list.expanded {
    max-height: 200px;
}
```

### Process Arrows
```css
.process-arrow {
    font-size: 10px;
    transition: transform 0.3s;
    margin-right: 4px;
}

.process-arrow.expanded {
    transform: rotate(90deg);
}

.process-small-arrow {
    font-size: 7px;
    transition: transform 0.3s;
    opacity: 0.5;
}

.process-small-arrow.expanded {
    transform: rotate(90deg);
}
```

### Progress Bar
```css
.process-progress {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    overflow: hidden;
}

.process-progress-fill {
    height: 100%;
    background: var(--success);
    transition: width 0.3s ease;
}

.process-major.completed .process-progress-fill {
    background: var(--success);
}

.process-major.active .process-progress-fill {
    background: linear-gradient(90deg, #ffc107 0%, #ffca2c 100%);
}
```

---

## 5. Center Workspace (.center-workspace)

```css
.center-workspace {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    background: var(--bg-light);
    overflow: hidden;
}
```

### Workspace Top (75% height)
```css
.workspace-top {
    height: 75%;
    background: white;
    border-bottom: 2px solid var(--border-color);
    display: flex;
    flex-direction: column;
}
```

### Workspace Header
```css
.workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
    border-bottom: 1px solid var(--border-color);
    position: relative;
}

.workspace-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-dark);
    display: flex;
    align-items: center;
    gap: 8px;
}
```

### Action Buttons
```css
.action-btn {
    padding: 6px 12px;
    background: white;
    border: 2px solid #999;
    color: #333;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 11px;
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.action-btn:hover {
    background: #20808D;
    color: white;
    border-color: #20808D;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}
```

### Outbox Notification
```css
.outbox-notification {
    position: absolute;
    top: 70px;
    right: 24px;
    background: white;
    border: 2px solid var(--success);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(40, 167, 69, 0.2);
    z-index: 1000;
    animation: slideInDown 0.3s ease-out;
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### Translation Section
```css
.translation-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: var(--border-radius);
    border-left: 3px solid var(--secondary);
    flex-shrink: 0;
}

.translation-preview {
    background: white;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 10px;
    line-height: 1.4;
    color: #6c757d;
    max-height: 100px;
    overflow-y: auto;
    display: none;
}

.translation-preview.expanded {
    max-height: 200px;
    overflow-y: auto;
}
```

### Text Editor
```css
.text-editor {
    width: 100%;
    flex: 1;
    min-height: 300px;
    padding: 12px;
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.6;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
}

.text-editor:focus {
    border-color: #6c757d;
}

.text-editor::placeholder {
    color: #adb5bd;
}
```

### Workspace Bottom (25% height) - Grid Viewer
```css
.workspace-bottom {
    height: 25%;
    background: white;
    display: flex;
    flex-direction: column;
    min-height: 200px;
}

.grid-viewer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
    border-bottom: 1px solid var(--border-color);
}
```

### View Toggle
```css
.view-toggle {
    display: flex;
    gap: 8px;
}

.view-btn {
    padding: 6px 14px;
    border: 1px solid var(--border-color);
    background: white;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s;
}

.view-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.view-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}
```

### Stats Bar
```css
.stats-bar {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: var(--border-radius);
    margin-bottom: 16px;
}

.stat-item {
    flex: 1;
    text-align: center;
    padding: 10px;
    background: white;
    border-radius: 6px;
    box-shadow: var(--shadow-sm);
}

.stat-value {
    display: block;
    font-size: 20px;
    font-weight: 700;
}

.stat-value.completed { color: var(--success); }
.stat-value.in-progress { color: var(--warning); }
.stat-value.pending { color: var(--neutral); }
```

### Task Cards
```css
.task-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
}

.task-card {
    background: white;
    border-radius: var(--border-radius);
    padding: 14px;
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
    border-left: 4px solid;
}

.task-card.completed { border-left-color: var(--success); }
.task-card.in-progress { border-left-color: var(--warning); }
.task-card.pending { border-left-color: var(--neutral); }

.task-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}
```

### Status Badges
```css
.status-badge {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
}

.status-badge.completed {
    background: #d4edda;
    color: #155724;
}

.status-badge.in-progress {
    background: #fff3cd;
    color: #856404;
}

.status-badge.pending {
    background: #e2e3e5;
    color: #383d41;
}
```

---

## 6. Right Sidebar (.right-sidebar)

```css
.right-sidebar {
    grid-column: 3;
    grid-row: 2;
    overflow-y: auto;
    background: var(--bg-white);
    border-left: 1px solid var(--border-color);
    padding: 16px;
}
```

### Knowledge Hierarchy
```css
.knowledge-major {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.knowledge-major:hover {
    background: var(--secondary);
    color: white;
}

.knowledge-medium-list {
    margin-left: 12px;
    margin-top: 4px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.knowledge-medium-list.expanded {
    max-height: 400px;
}

.knowledge-small-list {
    margin-left: 12px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.knowledge-small-list.expanded {
    max-height: 300px;
}
```

### Quick Links
```css
.quick-link-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    text-decoration: none;
    color: #495057;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
}

.quick-link-btn:hover {
    background: var(--bg-light);
    border-color: var(--success);
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.quick-link-btn.vscode:hover {
    border-color: #007ACC;
    background: rgba(0, 122, 204, 0.05);
}

.quick-link-btn.github:hover {
    border-color: #24292e;
    background: rgba(36, 41, 46, 0.05);
}

.quick-link-btn.vercel:hover {
    border-color: #000;
    background: rgba(0, 0, 0, 0.05);
}

.quick-link-btn.supabase:hover {
    border-color: #3ECF8E;
    background: rgba(62, 207, 142, 0.05);
}
```

### AI Selector Buttons
```css
.ai-selector-btn {
    flex: 1;
    min-width: 60px;
    padding: 6px 8px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    background: white;
    color: #666;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.ai-selector-btn:hover {
    border-color: #20808D;
    background: rgba(32, 128, 141, 0.05);
    transform: translateY(-1px);
}

.ai-selector-btn.active {
    border-color: #20808D;
    background: #20808D;
    color: white;
    box-shadow: 0 2px 8px rgba(32, 128, 141, 0.3);
}
```

### AI Input Area
```css
.ai-input-area textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-family: inherit;
    font-size: 11px;
    resize: vertical;
    line-height: 1.5;
    color: #333;
}

.ai-input-area button {
    padding: 10px;
    background: var(--secondary);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.ai-input-area button:hover {
    background: var(--secondary-dark);
}
```

### Support Response
```css
.support-response {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    margin-top: 12px;
}

.support-response.show {
    max-height: 400px;
    overflow-y: auto;
}

.response-header {
    background: var(--success);
    color: white;
    padding: 8px 12px;
    border-radius: 6px 6px 0 0;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
}

.response-content {
    background: #f8f9fa;
    padding: 12px;
    border: 1px solid #dee2e6;
    border-top: none;
    border-radius: 0 0 6px 6px;
    font-size: 13px;
    line-height: 1.6;
    color: #212529;
}
```

---

## 7. Footer (.footer)

```css
.footer {
    grid-column: 1 / 4;
    grid-row: 3;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 32px;
    font-size: 12px;
    gap: 8px;
    position: relative;
}

.footer-links {
    display: flex;
    align-items: center;
    gap: 20px;
}

.footer-link {
    color: rgba(255, 255, 255, 0.95);
    text-decoration: none;
    transition: color 0.2s;
    font-size: 13px;
    font-weight: 500;
}

.footer-link:hover {
    color: white;
}

.admin-link {
    position: absolute;
    right: 32px;
    bottom: 12px;
    opacity: 0.15;
    font-size: 9px;
    transition: opacity 0.3s;
    color: rgba(255, 255, 255, 0.95);
    text-decoration: none;
}

.admin-link:hover {
    opacity: 0.6;
}
```

---

## 8. Modal System

### Base Modal
```css
.grid-fullscreen-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 9999;
    padding: 20px;
}

.grid-fullscreen-modal.active {
    display: flex;
    flex-direction: column;
}
```

### Modal Header
```css
.grid-fullscreen-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: 8px 8px 0 0;
    margin-bottom: 16px;
}

.grid-fullscreen-title {
    font-size: 24px;
    font-weight: 700;
    color: white;
}

.grid-fullscreen-close {
    padding: 10px 20px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
}

.grid-fullscreen-close:hover {
    background: #5a6268;
    transform: scale(1.05);
}
```

### Modal Content
```css
.grid-fullscreen-content {
    flex: 1;
    background: white;
    border-radius: 8px;
    overflow-y: auto;
    padding: 24px;
}
```

---

## 9. Utility Classes

### Scrollbar Customization
```css
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}
```

### Server Status Indicator
```css
.server-status {
    position: fixed;
    bottom: 20px;
    right: 300px;
    padding: 10px 16px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 6px;
    font-size: 12px;
    z-index: 1000;
    display: none;
}

.server-status.show {
    display: block;
}

.server-status.success {
    background: #6c757d;
}

.server-status.error {
    background: var(--danger);
}
```

---

## 10. Animation Keyframes

### Slide In Down
```css
@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

## 11. Responsive Breakpoints

**Note:** Original mockup does not include responsive CSS. The fixed layout is:
- Left Sidebar: 198px
- Center Workspace: Flexible (1fr)
- Right Sidebar: 266px
- Max container width: 1800px

---

## 12. Interactive State Classes

### Expansion States
- `.expanded` - Applied to arrows and expandable lists
- `.active` - Applied to active items (processes, views)
- `.selected` - Applied to selected items (projects)
- `.show` - Applied to visible elements (notifications, responses)

### Status States
- `.completed` - Green success theme
- `.in-progress` - Yellow warning theme
- `.pending` - Gray neutral theme

### Hover States
All interactive elements have `:hover` pseudo-class with:
- `transition: all 0.2s` or `transition: all 0.3s`
- Transform effects (translateX, translateY, scale)
- Color/background changes
- Border color changes

---

## 13. Z-Index Hierarchy

```
z-index: 9999  - Fullscreen modals
z-index: 1000  - Notifications, status indicators
z-index: 100   - Header
z-index: 10    - Footer
```

---

## Summary Statistics

- **Total CSS Lines:** ~1,645 lines
- **CSS Variables:** 16 variables
- **Color Palette:** 3 themes + 5 status colors
- **Major Components:** 11 (Header, Footer, 3 sidebars sections, Workspace, Modals, etc.)
- **Animation Keyframes:** 1 (slideInDown)
- **Interactive Elements:** 247+ (buttons, cards, list items)
- **Hierarchical Levels:** 3 (Major > Small > Tiny)

---

**End of CSS Extraction**
