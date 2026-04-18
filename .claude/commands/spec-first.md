# Spec-First Development Workflow

Before implementing ANY feature or fix, follow this workflow. This is a hard gate, not a suggestion.

## Exemptions (No Spec Required)
- Typo fixes in comments, docs, or content copy
- Dependency version bumps with no API change
- Log message additions or changes
- Doc-only changes
- Changes under 10 lines to a single file

---

## Phase 0 — Context Gathering

Before writing the spec, understand the landscape:

1. Read `CLAUDE.md` — especially Never Do rules and the Rules Added Per Feature table
2. Run `git status` — check for pre-existing uncommitted changes; separate them first
3. Check `ops/specs/QUEUE.md` for priority and dependencies
4. Inspect the actual source files that will be touched — read them, don't guess
5. Run the build to establish a green baseline:
   ```bash
   npm run build
   npm run lint
   npx tsc --noEmit
   ```

---

## Phase 1 — Spec Creation

1. Determine the next available spec number — verify against **three sources**:
   ```bash
   cat ops/specs/SPEC_RECONCILIATION.md   # "Next available" header
   cat ops/specs/QUEUE.md                  # Next Up table (reserved numbers live here)
   ls ops/specs/MKT_*.md | sort | tail -1  # disk is authoritative
   ls ops/specs/FIX_*.md | sort | tail -1
   ```
2. Copy the template:
   ```
   ops/specs/_TEMPLATE.md → ops/specs/{MKT,FIX}_{NNN}_{slug}.md
   ```
3. Fill **every** section. If a section is not applicable, write "N/A" with a one-line reason.
4. The spec MUST include:
   - Exact file paths for all files to be created, modified, or deleted
   - `ls` every target path before labeling MODIFIED vs NEW
   - Acceptance criteria that can be mechanically verified
   - Build/lint/type-check commands that can be copy-pasted
   - A rollback plan
5. Save the spec. Do NOT proceed to implementation yet.
6. **Add the spec to `ops/specs/QUEUE.md`** — HARD GATE:
   - Add a row to **Active** with status `IN_PROGRESS`, or to **Next Up** if not starting immediately
   - Every MKT/FIX must have a queue entry before implementation begins

---

## Phase 2 — Operator Review Gate

1. Present the spec summary to the operator
2. Explicitly state: "Spec is ready at `ops/specs/<slug>.md`. Review and approve before I implement?"
3. **Wait for explicit approval.** Do not proceed on silence or ambiguity.
4. If changes are requested, update the spec first, then re-present.

---

## Phase 3 — Implementation

1. Follow the spec's file list exactly — do not add files not in the spec without asking
2. Run build between logical phases (e.g., after component changes, before integration)
3. If you discover the spec is wrong or incomplete mid-implementation:
   - **STOP** implementation
   - Update the spec with the discovered information
   - Add a `## Spec Amendments` section at the bottom of the spec
   - Inform the operator of the delta
   - Continue only after the spec is accurate
4. Follow existing patterns — check CLAUDE.md Naming Conventions and Never Do rules

---

## Phase 4 — Verification & Completion

### Build Verification

```bash
npm run build        # must pass clean
npm run lint         # must pass clean
npx tsc --noEmit     # must pass clean
```

**HARD GATE:** Do NOT proceed to `/commit` if any of these fail.

### Browser Verification

Open the changed pages in a browser. Verify:
- Golden path renders correctly
- No console errors
- Responsive layout works at mobile (375px) and desktop (1280px)

### Queue Update (AUTOMATIC — Never Ask the Operator)

When marking a spec COMPLETE, update `ops/specs/QUEUE.md` in the SAME session, BEFORE committing:
1. Remove the spec row from **Active** or **Next Up**
2. Add it to the **Completed (Last 10)** table with today's date
3. **HARD GATE:** Do NOT call `/commit` until QUEUE.md reflects the spec as Completed

### Completion Checklist

- [ ] All acceptance criteria in the spec are met
- [ ] `npm run build` passes clean
- [ ] `npm run lint` passes clean
- [ ] `npx tsc --noEmit` passes clean
- [ ] No untracked files left behind (`git status`)
- [ ] Spec status updated to `COMPLETE`
- [ ] **`ops/specs/QUEUE.md` updated** — spec moved to Completed with date
- [ ] `CLAUDE.md` updated with lessons learned (if any) — use `/lessons-learned`
- [ ] Commit with spec ID: `feat: add X (MKT_NNN)` or `fix: resolve Y (FIX_NNN)`
