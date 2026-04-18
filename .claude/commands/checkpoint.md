# /checkpoint — Mid-Session Compliance Audit

STOP all implementation work. Perform the following audit immediately.

## Step 1: Files Audit

Run `git diff --name-only` and `git diff --cached --name-only` to get all modified files.

Compare against the spec's "Files Changed" table (Section 3).

Output:

```
FILES AUDIT
═══════════════════════════════════════
Spec: {SPEC_ID}

IN SPEC AND MODIFIED:     ✅
  {file} — {spec says NEW/MODIFIED/DELETED}
  ...

IN SPEC BUT NOT YET TOUCHED:  ⏳
  {file} — {spec says NEW/MODIFIED/DELETED}
  ...

MODIFIED BUT NOT IN SPEC:     ⚠️
  {file} — WHY? {explain or flag for operator}
  ...
```

If any files are in the "MODIFIED BUT NOT IN SPEC" category, ask the operator: "I've modified {n} file(s) outside the spec. Should I revert these changes, or should the spec be updated?"

## Step 2: Acceptance Criteria Progress

For each AC in the spec, assess current status:

```
ACCEPTANCE CRITERIA
═══════════════════════════════════════
AC1: {criterion}
     Status: ✅ DONE / 🔄 IN PROGRESS / ⏳ NOT STARTED
     Evidence: {how you know — build output, browser check, code reference}

AC2: {criterion}
     Status: ...
     Evidence: ...
```

## Step 3: Time & Scope Check

- **Session time elapsed:** {estimate based on conversation length}
- **60-90 min session rule:** {are we at risk of overrun?}
- **Scope creep indicators:**
  - Have I added any features not in the spec? {yes/no — list if yes}
  - Have I refactored anything not in the spec? {yes/no — list if yes}
  - Have I "helpfully" expanded scope? {yes/no — list if yes}

## Step 4: Re-Read Spec (if > 30 min elapsed)

If significant time has passed, re-read the spec file to recalibrate. Confirm: "I have re-read the spec. My current work is aligned / has drifted in the following ways: {describe}."

## Step 5: Resume or Adjust

Present the checkpoint summary and ask: "Should I continue on the current path, adjust course, or wrap up the session?"

Do NOT resume implementation until the operator responds.
