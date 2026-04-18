# /guard-rails — Spec-Scoped File Write Restrictions

Activate file-level write restrictions based on the current spec.

## Setup

Read the current spec's "Files Changed" table (Section 3). This is your **allowlist** for this session.

```
GUARD RAILS ACTIVE
═══════════════════════════════════════
Spec: {SPEC_ID}

WRITE-ALLOWED FILES:
  {file path} — {NEW/MODIFIED/DELETED}
  ...

ALWAYS ALLOWED (infrastructure):
  ops/specs/{SPEC_ID}*.md — spec status updates
  ops/specs/QUEUE.md — queue updates
  CLAUDE.md — lessons learned (via /lessons-learned only)

ALL OTHER FILES: READ-ONLY unless operator approves
═══════════════════════════════════════
```

## Enforcement

For the remainder of this session:

1. **Before modifying any file**, check it against the allowlist.
2. If the file is ON the allowlist → proceed.
3. If the file is NOT on the allowlist → STOP and ask:
   "I need to modify `{file path}` which is not in the spec's file list.
    Reason: {why you need to modify it}
    Should I proceed? If yes, I'll add it to the guard rails for this session."
4. If the operator approves, add it to the session allowlist and note it for a potential spec update.
5. If the operator denies, find another way or flag it as a follow-up.

## Special Protections

These files require extra justification beyond the standard guard rails check. Even if they're in the spec, state your intent before modifying:

- `app/layout.tsx` — root layout, affects every page
- `lib/tokens.ts` — brand tokens, visual consistency across entire site
- `next.config.mjs` — build configuration, affects deployment
- `.claude/settings.json` — agent permissions
- `package.json` / `package-lock.json` — dependency changes

## Deactivation

Guard rails remain active until:
- The session ends
- The operator says "drop guard rails" or "unfreeze"
- A new `/preflight` is run (which re-establishes guard rails for the new spec)
