# CLAUDE.md Template

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Note**: This is a template for the CLAUDE.md file. Customize the paths and project-specific details for your own project.

---

## 7 Core Work Rules - Always Check First!

> **STOP before creating/saving files - read the relevant rule file!**
> **DO NOT create folders/save files without checking rules!**
> **NO guessing - rule files are the source of truth!**

| # | Rule File | When to Check | Content |
|---|----------|---------------|---------|
| 1 | `01_file-naming.md` | When naming files | File naming conventions |
| 2 | `02_save-location.md` | **When saving files** | Save location rules |
| 3 | `03_area-stage.md` | When selecting folders | Area/Stage mapping |
| 4 | `04_grid-writing-database.md` | **When working with Grid/DB** | Grid writing + DB CRUD |
| 5 | `05_execution-process.md` | When executing Tasks | 6-step execution process |
| 6 | `06_verification.md` | When verifying | Verification criteria |
| 7 | `07_task-crud.md` | **When adding/removing/editing Tasks** | Task CRUD process |

**Location:** `.claude/rules/`

---

## Absolute Rules - Stop Work if Violated!

### Absolute Rule 1: No Arbitrary Folder Creation

```
DO NOT create folders arbitrarily!
DO NOT create new folders without checking existing ones!
"Create now, organize later" = FORBIDDEN!
```

**Required process when folder creation is needed:**

1. **Stop work immediately**
2. **Check existing folders** - Is there really no suitable folder?
3. **Request user approval** (required format below)
4. **Create folder only after approval**

**Approval request format (required):**
```
"Folder Creation Request

Folder to create: [full path]
Reason: [why this folder is needed]
Alternatives reviewed: [why existing folders won't work]
Existing similar folders: [list of checked folders]

Do you approve?"
```

---

### Absolute Rule 2: General Tasks - Verification and Documentation Required

> **Applies to**: All requests that are not Project Task Grid Tasks (process one at a time)

```
DO NOT report completion without verification!
DO NOT update work_logs without verification!
DO NOT skip Reports folder!
```

**Required process (4 steps):**
```
1. Perform work
     |
2. Deploy verification agent (use Task tool)
   - Select appropriate sub-agent (code-reviewer, qa-specialist, etc.)
   - Get verification results
     |
3. Document (both locations required!)
   - .claude/work_logs/current.md - Record work details
   - Human_ClaudeCode_Bridge/Reports/{task}_report.json - Save results
     |
4. Report completion to user
```

---

### Absolute Rule 3: Project Task Grid - Process and State Transition Rules

> **Applies to**: Task Grid Task execution (can process multiple at once)
> **Key**: Follow 6-step process + state transition rules!

```
Skipping this process = Grid data becomes corrupted!
State transition order MUST be followed!
Each Task requires state management when processing multiple!
```

**Task Execution 6-Step Process:**

```
+-----------------------------------------------------------+
|  STEP 1: Read Task Instruction                            |
|  -> task-grid/task-instructions/{TaskID}_instruction.md   |
+-----------------------------------------------------------+
                              |
+-----------------------------------------------------------+
|  STEP 2: Check Rule Files                                 |
|  -> Read relevant rules from .claude/rules/               |
+-----------------------------------------------------------+
                              |
+-----------------------------------------------------------+
|  STEP 3: Update Grid Status (DB)                          |
|  -> task_status: 'Pending' -> 'In Progress'               |
|  -> UPDATE in Database                                    |
+-----------------------------------------------------------+
                              |
+-----------------------------------------------------------+
|  STEP 4: Execute Task with Task Agent                     |
|  -> Execute according to Task Instruction                 |
|  -> On completion: task_status: 'In Progress' -> 'Executed'|
+-----------------------------------------------------------+
                              |
+-----------------------------------------------------------+
|  STEP 5: Deploy Verification Agent (sub-agent)            |
|  -> verification_status: 'Not Verified' -> 'In Review'    |
|  -> Verify according to Verification Instruction          |
|  -> Result: 'Verified' or 'Needs Fix'                     |
+-----------------------------------------------------------+
                              |
+-----------------------------------------------------------+
|  STEP 6: Final Status Update (DB)                         |
|  -> Only when verification_status: 'Verified'             |
|  -> task_status: 'Executed' -> 'Completed'                |
|  -> Save work_logs, Reports                               |
+-----------------------------------------------------------+
```

**State Transition Rules (must follow order!):**

```
task_status transitions:
+---------+    +-------------+    +----------+    +-----------+
| Pending | -> | In Progress | -> | Executed | -> | Completed |
+---------+    +-------------+    +----------+    +-----------+
                                       ^              ^
                                  Work done      Only after Verified!

verification_status transitions:
+--------------+    +-----------+    +----------+
| Not Verified | -> | In Review | -> | Verified |
+--------------+    +-----------+    +----------+
                                          |
                                     Needs Fix (on failure)
```

**Key rules:**
- **Executed** = Work done but not yet verified
- **Completed** = Verification (Verified) also complete
- **Completed only possible when Verified!** (enforced by DB trigger)
- **No skipping states** (Pending -> Completed not allowed!)
- **State update required for each Task** (when processing multiple)

**Verification result recording (NEVER skip!):**

```
Verification without recording = meaningless!
Saying "verified" without DB update = NOT acceptable!
Verification results MUST be recorded in Database!
```

**Required recording location after verification:**
```
Database (project_task_grid table)
   -> verification_status: 'Verified' or 'Needs Fix'
   -> test_result: Test results (JSON)
   -> build_verification: Build verification (JSON)
   -> integration_verification: Integration verification (JSON)
   -> blockers: Blocking issues (JSON)
   -> comprehensive_verification: Overall results (JSON)
```

---

### Absolute Rule 4: Stage First → Auto-copy to Root

> **Applies to**: Frontend, Backend APIs, Security, External API code file creation/modification

```
1. Save code files to Stage folder FIRST (original, process management)
2. Pre-commit hook auto-copies to Root (deployment)
3. Stage = source of truth, Root = auto-generated copy
```

**Save order:**
```
Stage 폴더에 저장 (원본)
      ↓
git commit 실행
      ↓
Pre-commit Hook 자동 실행 (scripts/sync-to-root.js)
      ↓
루트 폴더로 자동 복사 (배포용)
```

**Stage → Root mapping:**
| Area | Stage Folder | Root Folder (auto-copy) |
|------|--------------|------------------------|
| F | `S?_*/Frontend/` | `pages/` |
| BA | `S?_*/Backend_APIs/` | `api/Backend_APIs/` |
| S | `S?_*/Security/` | `api/Security/` |
| BI | `S?_*/Backend_Infra/` | `api/Backend_Infra/` |
| E | `S?_*/External/` | `api/External/` |

**Root deployment structure:**
```
Project Root/
├── api/                    ← Backend interface (deploy)
├── pages/                  ← Pages/screens (deploy)
├── assets/                 ← Static resources (deploy)
├── scripts/                ← Automation tools (dev only)
├── index.html              ← Main page
└── 404.html                ← Error page
```

**WARNING:** Vercel recognizes the `api` folder name - do not rename!

---

### Absolute Rule 5: Auto-update Grid on Task Completion/Modification

> **Applies to**: When Task Grid Task is completed or bugs are fixed

```
DO NOT finish Task work without Grid update!
Saying "work complete" without DB update = NOT acceptable!
MUST update project_task_grid table after work completion!
```

**Update timing:**
| Situation | Fields to Update |
|-----------|-----------------|
| Task completion | `task_status`, `task_progress`, `generated_files`, `remarks` |
| Bug fix | `modification_history`, `remarks`, `updated_at` |

**Required process:**
```
Task work complete
     |
PATCH update project_task_grid table
     |
Record in work_logs/current.md
     |
Report completion
```

---

## Work Methods

> **When performing specific tasks, you MUST follow these methods!**

| # | Method File | When to Apply | Key Point |
|---|------------|---------------|-----------|
| 1 | `01_database-crud.md` | **When doing DB CRUD** | Don't ask PO, AI executes directly |

**Location:** `.claude/methods/`

### Database CRUD Work Requirements

```
DO NOT ask PO (human) to execute SQL!
"Please run this SQL" = FORBIDDEN!
"Please execute in Dashboard" = FORBIDDEN!
AI MUST execute directly via REST API!
```

**Priority:**
```
1. REST API (Node.js) <- Default method, always works
2. Database MCP <- When connected
3. Database CLI <- When installed
4. Dashboard (PO manual) <- Last resort
```

**When to request PO help (only when ALL fail):**
```
1. REST API attempt -> Failed (3+ times)
2. MCP attempt -> Failed or not connected
3. CLI attempt -> Not installed or failed

-> Only request PO after all 3 methods fail
-> "All methods failed. Please execute in Dashboard."
-> Provide SQL file
```

**Environment variables location:** `{your-project}/Database/.env`

---

## Other Reference Documents

### AI Compliance Guidelines
> `.claude/compliance/AI_COMPLIANCE.md`

### Task Grid Manual
> `{task-grid-folder}/manual/PROJECT_TASK_GRID_MANUAL.md`

### Cautions
> `.claude/CAUTION.md` (RLS, Production TODOs, Database alternative processes)

---

## Session Start Checklist

### 1. Work Records
`.claude/work_logs/current.md` - TOP PRIORITY

### 2. Previous Work Results
`Human_ClaudeCode_Bridge/Reports/` - Check this

### 3. Project Status
- `{project-status-folder}/Project_Status.md`
- `{project-status-folder}/Project_Directory_Structure.md`

---

## Web Deployment File Updates

When modifying Order Sheets, Guides, or Manuals:
```bash
node scripts/build-web-assets.js
```

---

## Script Storage Principle

```
1. Single-target scripts → Save in respective folder
   Example: generate-ordersheets-js.js → OrderSheet_Templates/

2. Multi-target scripts → Save in root scripts/
   Example: build-web-assets.js → scripts/
```

---

## Build vs Server Distinction (Don't Confuse!)

| Task | File | Purpose |
|------|------|---------|
| **Build** (MD->JS bundle) | `build-web-assets.js` | Generate deployment files |
| **Server** (Real-time API) | `bridge_server.js` | Local development server |

**Don't confuse:**
- "Build Order Sheet" -> Run `build-web-assets.js`
- "Build Guides" -> Run `build-web-assets.js`
- **`bridge_server.js` is NOT a build tool!** (Runtime API server)

---

## Customization Guide

When adapting this template for your project:

1. **Replace placeholders:**
   - `{your-project}` -> Your project folder name
   - `{task-grid-folder}` -> Your Task Grid location
   - `{project-status-folder}` -> Your status files location

2. **Configure Database:**
   - Set up your database connection
   - Create `.env` file with your credentials
   - Update REST API endpoints in method files

3. **Customize Areas/Stages:**
   - Edit `03_area-stage.md` with your project's areas
   - Define stages appropriate for your development workflow

4. **Set up Task Grid:**
   - CSV mode: Local file-based tracking
   - Database mode: Database-backed tracking
   - Both track YOUR project's tasks with different data sources

5. **Configure Human_ClaudeCode_Bridge:**
   - Orders folder: Work requests for AI
   - Reports folder: Work results from AI
   - bridge_server.js: Optional local file server
