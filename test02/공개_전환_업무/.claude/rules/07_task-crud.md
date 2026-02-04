# Task CRUD Process

> When adding, deleting, or modifying Tasks, update all **5 locations** below

---

## Update Locations (5)

| # | Location | Description |
|---|----------|-------------|
| 1 | CSV File | `{project-root}/S0_Project-SAL-Grid_생성/data/sal_grid.csv` |
| 2 | Task Instruction File | `sal-grid/task-instructions/{TaskID}_instruction.md` |
| 3 | Verification Instruction File | `sal-grid/verification-instructions/{TaskID}_verification.md` |
| 4 | TASK_PLAN.md | Task plan document |
| 5 | Work Log | `.claude/work_logs/current.md` |

---

## Status Transition Rules (Must Follow)

> See `.claude/CLAUDE.md` Absolute Rule 3

```
task_status transitions:
Pending -> In Progress -> Executed -> Completed
                                        ^
                                Only after Verified!

verification_status transitions:
Not Verified -> In Review -> Verified (or Needs Fix)
```

**Key**: `Completed` can only be set when `verification_status = 'Verified'`!

---

## Task Addition Scenarios

| Scenario | Description | task_status | verification_status |
|----------|-------------|-------------|---------------------|
| **A. New Task** | Task not yet worked on | `Pending` | `Not Verified` |
| **B. Completed Task** | Already completed, registering retroactively | `Completed` | `Verified` |

---

## Task Addition Process

### Step 1: Determine Task ID

```
Format: S[Stage][Area][Number]
Example: S4F5 = Stage 4 + Frontend + 5th task
```

**Check existing Tasks:**
```bash
ls S0_Project-SAL-Grid_생성/sal-grid/task-instructions/ | grep "S4F"
```

### Step 2: Update CSV File

**File Location:** `S0_Project-SAL-Grid_생성/data/sal_grid.csv`

#### Scenario A: New Task (not yet worked on)

Add a new row with these values:
```
task_id,task_name,stage,area,task_status,task_progress,verification_status,...
S4F5,Task Name,4,F,Pending,0,Not Verified,...
```

#### Scenario B: Completed Task (retroactive registration)

Add a new row with these values:
```
task_id,task_name,stage,area,task_status,task_progress,verification_status,generated_files,...
S4F5,Task Name,4,F,Completed,100,Verified,file1.js file2.html,...
```

**Stage Numbers:**
| Stage | Number |
|-------|--------|
| S1 | 1 |
| S2 | 2 |
| S3 | 3 |
| S4 | 4 |
| S5 | 5 |

### Step 3: Create Task Instruction File

**Location:** `S0_Project-SAL-Grid_생성/sal-grid/task-instructions/{TaskID}_instruction.md`

**Template:**
```markdown
# {TaskID}: {Task Name}

## Task Information
- **Task ID**: {TaskID}
- **Task Name**: {Task Name}
- **Stage**: S{N} ({Stage Name})
- **Area**: {Area Code} ({Area Name})
- **Dependencies**: {Preceding Task ID}

## Task Goal

{Goal description}

## Changes

{Specific changes}

## Files to Create/Modify

| File | Change Description |
|------|-------------------|
| `file path` | Description |

---

## Required Rules Reference

| Rule File | Content | When to Reference |
|-----------|---------|-------------------|
| `.claude/rules/02_save-location.md` | Save location rules | When saving files |
| `.claude/rules/05_execution-process.md` | 6-step execution process | Throughout work |
```

### Step 4: Create Verification Instruction File

**Location:** `S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/{TaskID}_verification.md`

**Template:**
```markdown
# {TaskID}: {Task Name} - Verification Instructions

## Verification Information
- **Task ID**: {TaskID}
- **Verification Agent**: code-reviewer

## Verification Items

### 1. Code Verification
- [ ] Item 1
- [ ] Item 2

### 2. Functional Testing
- [ ] Test item 1
- [ ] Test item 2

## Pass Criteria

{Pass conditions}

---

## Required Rules Reference

| Rule File | Content | When to Reference |
|-----------|---------|-------------------|
| `.claude/rules/06_verification.md` | Verification criteria | Core reference |
```

### Step 5: Update TASK_PLAN.md

**Updates:**
1. **Total Task count**: Update header
2. **Stage Task count table**: Modify relevant row
3. **Area distribution table**: Modify relevant column
4. **Stage section**: Add Task to appropriate section
5. **Version and date**: Increment version, update date
6. **Change history**: Record changes

### Step 6: Update Work Log

**Location:** `.claude/work_logs/current.md`

```markdown
## {TaskID} Task Added (YYYY-MM-DD)

### Status: Completed

### Added Task
| Task ID | Task Name | Area | Description |
|---------|-----------|------|-------------|
| {TaskID} | {Task Name} | {Area} | {Description} |

### Updated Files
1. sal_grid.csv
2. task-instructions/{TaskID}_instruction.md
3. verification-instructions/{TaskID}_verification.md
4. TASK_PLAN.md
```

### Step 7: Git Commit & Push

```bash
git add S0_Project-SAL-Grid_생성/data/sal_grid.csv
git add S0_Project-SAL-Grid_생성/sal-grid/task-instructions/{TaskID}_instruction.md
git add S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/{TaskID}_verification.md
git add S0_Project-SAL-Grid_생성/sal-grid/TASK_PLAN.md
git add .claude/work_logs/current.md
git commit -m "feat: Add {TaskID} {Task Name} Task"
git push
```

---

## Task Deletion Process

### Step 1: Remove from TASK_PLAN.md

Update all counts and remove Task row

### Step 2: Delete Instruction Files

```bash
rm S0_Project-SAL-Grid_생성/sal-grid/task-instructions/{TaskID}_instruction.md
rm S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/{TaskID}_verification.md
```

### Step 3: Remove from CSV File

Delete the row with matching task_id from `sal_grid.csv`

### Step 4: Update Work Log

Record deletion in `.claude/work_logs/current.md`

### Step 5: Git Commit & Push

```bash
git add -A
git commit -m "chore: Delete {TaskID} Task"
git push
```

---

## Task Modification Process

### Step 1: Define Changes

**Modifiable fields:**
- task_name
- task_instruction
- verification_instruction
- remarks
- dependencies
- task_agent / verification_agent
- execution_type
- tools

### Step 2: Update TASK_PLAN.md

Modify relevant row and add to change history

### Step 3: Modify Task Instruction File

Edit `task-instructions/{TaskID}_instruction.md`

### Step 4: Modify Verification Instruction File

Edit `verification-instructions/{TaskID}_verification.md`

### Step 5: Update CSV File

Modify the relevant row in `sal_grid.csv`

### Step 6: Update Work Log

```markdown
## {TaskID} Task Modified (YYYY-MM-DD)

### Status: Completed

### Changes
| Field | Before | After |
|-------|--------|-------|
| Task Name | {old name} | {new name} |
| Description | {old desc} | {new desc} |

### Updated Files
1. TASK_PLAN.md
2. task-instructions/{TaskID}_instruction.md
3. verification-instructions/{TaskID}_verification.md
4. sal_grid.csv
```

### Step 7: Git Commit & Push

```bash
git add S0_Project-SAL-Grid_생성/sal-grid/
git add S0_Project-SAL-Grid_생성/data/sal_grid.csv
git add .claude/work_logs/current.md
git commit -m "refactor: Modify {TaskID} Task - {summary}"
git push
```

---

## Task Status Update (On Work/Verification Completion)

> Update CSV when Task is executed or verification is completed

### On Work Completion (Executed)

Update the row in CSV:
```
task_status: Executed
task_progress: 100
generated_files: list of generated files
updated_at: current timestamp
```

### On Verification Completion (Verified -> Completed)

```
# Step 1: Set verification_status to Verified
verification_status: Verified

# Step 2: Only after Verified, set task_status to Completed
task_status: Completed
```

**IMPORTANT**: `Completed` can only be set after `verification_status = 'Verified'`!

---

## Checklist

### New Addition

- [ ] **Scenario confirmed**: New (Pending) vs Completed?
- [ ] Updated CSV file with new row
  - [ ] `task_status` set (Pending or Completed)
  - [ ] `verification_status` set (Not Verified or Verified)
  - [ ] `task_progress` set (0 or 100)
- [ ] Created task-instructions/{TaskID}_instruction.md
- [ ] Created verification-instructions/{TaskID}_verification.md
- [ ] Updated TASK_PLAN.md (Task added + counts updated + change history)
- [ ] Recorded in .claude/work_logs/current.md
- [ ] Git commit & push

### Deletion

- [ ] Removed Task from TASK_PLAN.md (counts updated + change history)
- [ ] Deleted task-instructions/{TaskID}_instruction.md
- [ ] Deleted verification-instructions/{TaskID}_verification.md
- [ ] Removed row from CSV file
- [ ] Recorded in .claude/work_logs/current.md
- [ ] Git commit & push

### Modification

- [ ] Updated TASK_PLAN.md (row modified + change history)
- [ ] Modified task-instructions/{TaskID}_instruction.md
- [ ] Modified verification-instructions/{TaskID}_verification.md
- [ ] Updated row in CSV file
- [ ] Recorded in .claude/work_logs/current.md
- [ ] Git commit & push

### Status Update (Work/Verification Completion)

- [ ] On work completion: `task_status` = 'Executed', `task_progress` = 100
- [ ] On verification completion: `verification_status` = 'Verified'
- [ ] On final completion: `task_status` = 'Completed' (only after Verified!)
- [ ] Verified status in CSV file

---

## Notes

1. **Update all 5 locations**: Missing any causes inconsistency
2. **No duplicate Task IDs**: Check existing Tasks before assigning number
3. **Stage number is integer**: S4 -> 4 (not string)
4. **Order Sheet auto-includes**: Grid reference method, no separate update needed
5. **TASK_PLAN.md counts accurate**: Update total, per-stage, per-area counts
6. **Change history required**: Record in change history section
7. **Status transition order**: Completed only after Verified
8. **verification_status required**: Must explicitly set when adding

---

## Related Files

| Item | Location |
|------|----------|
| CSV Data | `S0_Project-SAL-Grid_생성/data/sal_grid.csv` |
| Task Plan | `S0_Project-SAL-Grid_생성/sal-grid/TASK_PLAN.md` |
| Task Instructions | `S0_Project-SAL-Grid_생성/sal-grid/task-instructions/` |
| Verification Instructions | `S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/` |
| Stage Gates | `S0_Project-SAL-Grid_생성/sal-grid/stage-gates/` |
| Manual | `S0_Project-SAL-Grid_생성/manual/PROJECT_TASK_GRID_MANUAL.md` |
| Work Log | `.claude/work_logs/current.md` |
