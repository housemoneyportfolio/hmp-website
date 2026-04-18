# /preflight — Session Orientation & Compliance Gate

You are starting a new work session. Before writing ANY code, you must complete this preflight checklist. Do NOT skip steps. Do NOT begin implementation until the operator says "go."

## Step 1: Identify the Task

Read `ops/specs/QUEUE.md`. Identify what is in the **Active** section.

- If Active is empty, ask the operator: "No active spec in QUEUE.md. What are we working on today?"
- If Active has an entry, read the full spec file at `ops/specs/{SPEC_ID}_{slug}.md`.
- If the operator names a specific spec, read that spec instead.

Output: State the spec ID, title, priority, and current status.

## Step 2: Read the Spec

Read the full spec file. Extract and display:

1. **Problem Statement** — one sentence summary
2. **Files Changed** — the complete table from Section 3
3. **Acceptance Criteria** — the complete table from Section 5
4. **Test Plan** — the exact build/lint commands from Section 6
5. **Dependencies** — any specs this depends on

If the spec status is not APPROVED or IN_PROGRESS, STOP. Tell the operator: "This spec is in {status} state. It needs to be APPROVED before implementation. Should I proceed anyway?"

## Step 3: Load Rules

Read `CLAUDE.md` — specifically the "Session Rules", "Scope Control", "Agent Behavior", and "Spec-First Development" sections.

Based on the files in the spec's "Files Changed" table, flag any Never Do rules that are particularly relevant to this work.

## Step 4: Check for Handoff Artifact

Check if `ops/handoffs/{SPEC_ID}_handoff.md` exists.

- If it exists, read it. Follow its implementation guidance verbatim.
- If it does not exist, proceed without it.

## Step 5: Output the Preflight Summary

Display the following:

```
PREFLIGHT SUMMARY
═══════════════════════════════════════
Spec:          {SPEC_ID} — {Title}
Priority:      {P0/P1/P2}
Status:        {Status}
Handoff:       {Found / Not found}

FILES I WILL TOUCH:
  {file path} — {NEW/MODIFIED/DELETED} — {description}
  ...

FILES I WILL NOT TOUCH:
  Everything else. Any file not listed above requires explicit operator approval.

ACCEPTANCE CRITERIA:
  AC1: {criterion}
  AC2: {criterion}
  ...

BUILD COMMANDS:
  npm run build
  npm run lint
  npx tsc --noEmit

READY FOR IMPLEMENTATION.
Waiting for operator approval to proceed.
```

## Step 6: Wait

Do NOT proceed until the operator explicitly approves. Acceptable approvals: "go", "approved", "proceed", "start", "yes."

If the operator asks questions or requests changes to the plan, answer them but do NOT begin implementation.

## Compliance Reminders

- You are in PLAN MODE until the operator approves.
- Do not exit plan mode on your own.
- Do not modify any files until approved.
- If you discover during preflight that the spec is outdated or conflicts with existing code, report this to the operator instead of improvising.
