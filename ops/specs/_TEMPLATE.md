# {PREFIX}_{NNN}: {Title}

> **Spec ID:** {PREFIX}_{NNN}
> **Priority:** P0 | P1 | P2
> **Status:** DRAFT | READY_FOR_REVIEW | APPROVED | IN_PROGRESS | COMPLETE
> **Triggered by:** {Optional — prior spec, incident, or observation}
> **Depends on:** {Optional — prior spec IDs that must be completed first}

---

## 1. Problem Statement

{What is wrong or missing? Why does it matter? Include screenshots or evidence if available.}

## 2. Solution

{High-level approach. Use sub-sections (### 2.1, 2.2, ...) for major components.}

## 3. Files Changed

| File | Action | Description |
|------|--------|-------------|
| `app/path/to/file.tsx` | NEW / MODIFIED / DELETED | Brief description of change |

## 4. Environment Variables

> Remove this section if no new env vars are added.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_EXAMPLE` | Yes / No | `value` | What this controls |

## 5. Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| AC1 | {What must be true when this is done} | {How to verify — browser check, `npm run build`, or automated test} |

## 6. Test Plan

```bash
# Build must pass clean
npm run build

# Lint must pass clean
npm run lint

# Type check must pass clean
npx tsc --noEmit
```

## 7. Rollback Plan

{How to revert if something goes wrong. `git revert`? Feature flag? Config change? Include specific commands.}

## 8. Status

- [ ] Create spec (this file)
- [ ] {Implementation step 1}
- [ ] {Implementation step 2}
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] Verify acceptance criteria in browser
- [ ] Update CLAUDE.md with lessons learned (if any)
- [ ] Update `ops/specs/QUEUE.md` — move to Completed with today's date
