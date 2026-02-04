# 05. Execution Process Rules

> 6-step process from Task execution to PO final approval

---

## Overall Process Flow

```
+---------------------------------------------------------------------+
|                      6-Step Execution Process                        |
+---------------------------------------------------------------------+
|                                                                     |
|  [Step 1] Task Execution -------------- Sub-agent                  |
|      |                                                              |
|  [Step 2] PO Help Request (if needed) - AI -> PO                   |
|      |                                                              |
|  [Step 3] Task Verification ----------- Sub-agent                  |
|      |                                                              |
|  [Step 4] Stage Gate Verification ----- Main Agent                 |
|      |                                                              |
|  [Step 5] PO Test Guide Provision ----- Main Agent -> PO           |
|      |                                                              |
|  [Step 6] PO Final Approval ----------- PO                         |
|                                                                     |
+---------------------------------------------------------------------+
```

---

## Step 1: Task Execution

**Performer:** Task Agent Sub-agent

```
Main Agent -> Deploy Task Agent Sub-agent (using Task tool)
           -> Sub-agent performs work
           -> Returns results
           -> Main Agent records in Grid (#10-13)
```

**Record items:**
- #10 task_agent: Agent used
- #11 generated_files: List of generated files
- #12 duration: Time spent
- #13 build_result: Build result

**Prohibited:**
- Main Agent directly performing Task work
- Task Agent also performing verification

---

## Step 2: PO Help Request (if needed)

**Performer:** AI -> PO

**Situations requiring request:**
- External service API key needed (Resend, Stripe, OpenAI, etc.)
- OAuth Provider setup needed (Google, GitHub, Kakao, etc.)
- Environment variable setup needed (Vercel, Database, etc.)
- External dashboard access needed

**Request format:**
```
"To implement this feature, [setting item] is needed.

Required settings:
1. [Setting step 1]
2. [Setting step 2]
3. [Setting step 3]

Please let me know when setup is complete and I will proceed."
```

**Prohibited:**
- Only notifying "setup needed" after work completion
- Saying "need to set up" at testing time
- Reporting "complete" after only writing code when external setup is needed

---

## Step 3: Task Verification

**Performer:** Verification Agent Sub-agent

```
Main Agent -> Deploy Verification Agent Sub-agent (using Task tool)
           -> Sub-agent performs verification
           -> Returns results
           -> Main Agent records in Grid (#16-21)
```

**Record items:**
- #16 test_result: Test results
- #17 build_verification: Build verification
- #18 integration_verification: Integration verification
- #19 blockers: Blocking factors
- #20 comprehensive_verification: Overall verification
- #21 ai_verification_note: AI verification notes

**Key principle:** Task Agent ≠ Verification Agent

---

## Step 4: Stage Gate Verification

**Performer:** Main Agent (direct execution)

```
Main Agent directly verifies:
    -> Confirm all Tasks in Stage are complete
    -> Confirm overall build/test passes
    -> Confirm dependency chain is complete
    -> Generate verification report
```

**Report storage:**
- Location: `S0_Project-SAL-Grid_생성/sal-grid/stage-gates/`
- Filename: `S{N}GATE_verification_report.md`

**CSV record:**
- Update `stage_gate_status` field in CSV file
- Update verification fields as needed

---

## Step 5: PO Test Guide Provision

**Performer:** Main Agent -> PO

**Items to provide:**

### 1) Test Readiness Conditions
```
- Required external settings: [Complete/Incomplete]
- Server execution required: [Yes/No]
- Environment variable setup: [Complete/Incomplete]
```

### 2) Feature-by-Feature Test Guide
```
[Feature 1: Google Login]
- Test file: Production/Frontend/pages/auth/google-login.html
- Test method: Open in browser and click button
- Expected result: Redirect to Google login page
- Required setting: OAuth Provider enabled
```

### 3) Setup Completion Checklist
```
- [ ] Google OAuth setup complete
- [ ] Resend API key setup complete
- [ ] Environment variable deployment complete
```

**Prohibited:**
- Declaring "Stage Gate passed" with only AI verification
- Requesting "please check" without test methods

---

## Step 6: PO Final Approval

**Performer:** PO

```
PO performs:
    -> Review AI verification report
    -> Follow test guide to test directly
    -> Confirm features work correctly
    -> Approve or reject
```

**Results:**
- Approved: `stage_gate_status: 'Approved'`
- Rejected: `stage_gate_status: 'Rejected'` + reason

---

## Summary Table

| Step | Performer | Content | Record Location |
|------|-----------|---------|-----------------|
| 1 | Sub-agent | Task execution | Grid #10-13 |
| 2 | AI -> PO | External setup request | - |
| 3 | Sub-agent | Task verification | Grid #16-21 |
| 4 | Main Agent | Stage Gate verification | stage-gates/ |
| 5 | Main Agent -> PO | Test guide | - |
| 6 | PO | Final approval | CSV stage_gate_status |

---

## Checklist

- [ ] Did you delegate Task execution to a sub-agent?
- [ ] If PO help was needed, did you request it before starting work?
- [ ] Did you delegate Task verification to a different sub-agent?
- [ ] Did you generate a Stage Gate verification report?
- [ ] Did you provide a PO test guide?
- [ ] Did you receive PO approval?
