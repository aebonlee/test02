# Executive Directive: SSAL Works "Static Refactoring"

**Target Actor:** Claude Code (AI Assistant)
**Objective:** Transition the project from a "Pseudo-React" state to a clean, component-based **Static MPA (Multi-Page Application)**.
**Constraint:** Do NOT use a build step (Webpack/Vite). Use native browser capabilities and a custom Component Loader.

---

## Phase 1: Dependency "Diet" (Cleanup)

**Context:** The `package.json` contains ghost dependencies that confuse the development environment.

### Action Item 1.1: Remove Unused Packages
Execute the following command to strip unnecessary frameworks:
```bash
npm uninstall next react react-dom eslint-config-next @types/react @types/react-dom tailwindcss @tailwindcss/postcss
```

### Action Item 1.2: Stabilize `package.json`
Update `package.json` to reflect the true nature of the project.
- **Change `scripts`**:
  ```json
  "scripts": {
    "dev": "npx serve . -l 8888",
    "build:assets": "node scripts/build-web-assets.js",
    "build:all": "node scripts/build-all.js"
  }
  ```

---

## Phase 2: Configuration & Global Namespace Hygiene

**Context:** Currently, keys are hardcoded in logic files. We need a central configuration source that loads *before* anything else.

### Action Item 2.1: Create `assets/js/config.js`
Create a new file `assets/js/config.js`. This MUST be loaded first in `index.html`.

```javascript
/**
 * SSAL Works - Global Configuration
 * Loaded before all other scripts.
 */
window.SSAL_CONFIG = {
    supabase: {
        url: 'https://zwjmfewyshhwpgwdtrus.supabase.co',
        anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE' // Extract from assets/js/supabase-init.js
    },
    version: '1.0.0',
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
};
```

### Action Item 2.2: Refactor `supabase-init.js`
Modify `assets/js/supabase-init.js` to use the config.

```javascript
// BEFORE
// const SUPABASE_URL = '...';

// AFTER
const { url, anonKey } = window.SSAL_CONFIG.supabase;
window.supabaseClient = supabase.createClient(url, anonKey);
```

---

## Phase 3: The "Component Loader" Architecture (Core Task)

**Context:** We need to split `index.html` without a bundler. We will use `fetch` to load HTML fragments. **CRITICAL INFO**: Standard `DOMContentLoaded` events will fire *before* these components are loaded. We must implement a custom event system.

### Action Item 3.1: Create `assets/js/layout-loader.js`
This script is the engine of the new architecture.

**Logic Requirements:**
1.  Define a map of components: `{ "header-placeholder": "/components/header.html", "sidebar-placeholder": "/components/sidebar_left.html" }`.
2.  Iterate through placeholders found in the DOM.
3.  `fetch()` the HTML content.
4.  Inject `innerHTML`.
5.  **CRITICAL**: After *all* components are loaded, dispatch a custom event `SSAL:LayoutLoaded`. This tells other scripts (like `sidebar.js`) that it is safe to attach event listeners.

```javascript
// assets/js/layout-loader.js (Draft Logic)
document.addEventListener('DOMContentLoaded', async () => {
    const components = [
        { id: 'component-header', url: '/components/header.html' },
        { id: 'component-sidebar-left', url: '/components/sidebar_left.html' }
    ];

    await Promise.all(components.map(async (comp) => {
        const el = document.getElementById(comp.id);
        if (el) {
            const res = await fetch(comp.url);
            el.innerHTML = await res.text();
        }
    }));

    // Dispatch the "Ready" signal
    console.log('🚀 Layout Loaded');
    window.dispatchEvent(new Event('SSAL:LayoutLoaded'));
});
```

### Action Item 3.2: Refactor `assets/js/sidebar.js`
Modify the initialization logic to wait for the layout loader.

```javascript
// Change this:
// document.addEventListener('DOMContentLoaded', initSidebarElements);

// To this:
function init() {
    initSidebarElements();
    // Re-attach listeners now that DOM is present
}

// Fallback: Check if already loaded, or wait for event
if (window.SSAL_LAYOUT_READY) {
    init();
} else {
    window.addEventListener('SSAL:LayoutLoaded', init);
}
```

---

## Phase 4: Surgical Extraction

**Context:** Physically moving the code.

### Action Item 4.1: Extract Header
1.  Create `components/header.html`.
2.  Cut everything inside `<header class="header">...</header>` from `index.html`.
3.  Paste into `components/header.html`.
4.  In `index.html`, replace the deleted block with: `<div id="component-header"></div>`.

### Action Item 4.2: Extract Sidebar
1.  Create `components/sidebar_left.html`.
2.  Cut everything inside `<aside class="left-sidebar">...</aside>` from `index.html`.
3.  Paste into `components/sidebar_left.html`.
4.  In `index.html`, replace with: `<div id="component-sidebar-left"></div>`.

### Action Item 4.3: Update Head
In `index.html` `<head>`, add the new scripts *in this order*:
1.  `assets/js/config.js`
2.  `assets/js/layout-loader.js` (Must be before main logic scripts or handle async correctly)
3.  `assets/js/common.js`
4.  `assets/js/sidebar.js`

## Verification Checklist for Claude Code
1.  **Server Start**: `npx serve .` runs without errors.
2.  **Visual Verification**: The page looks identical to before. There is no "FOUC" (Flash of Unstyled Content) - or it is minimal.
3.  **Interactive Verification**:
    -   Click the "Mobile Menu" hamburger button -> Does the sidebar open? (Tests event delegation on dynamically loaded element).
    -   Click "Project > Example Project" -> Does the accordion expand?
4.  **Console Check**: No "element not found" errors in the DevTools console.
