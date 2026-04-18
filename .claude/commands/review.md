# /review — Pre-Merge Session Review

Load context and verify readiness before committing. Run this before `/commit`.

## Instructions

1. **Git state** — check for uncommitted work:
   ```bash
   git status
   git diff --stat HEAD
   ```

2. **Recent commits** — for continuity:
   ```bash
   git log --oneline -5
   ```

3. **Spec queue** — confirm active spec is complete:
   ```bash
   cat ops/specs/QUEUE.md
   ```

4. **Build verification** — must all pass before committing:
   ```bash
   npm run build 2>&1 | tail -10
   npm run lint 2>&1 | tail -10
   npx tsc --noEmit 2>&1 | tail -10
   ```

5. **Untracked files check**:
   ```bash
   git status --short | grep "^??"
   ```
   Any untracked files that belong to this spec must be staged. Any that don't belong must be explained.

## Report

Present a pre-commit briefing:

- **Spec status** — is it marked COMPLETE in the spec file?
- **QUEUE.md** — is the spec moved to Completed with today's date?
- **Build** — pass or fail (with details if fail)
- **Uncommitted changes** — scope matches spec file list?
- **Untracked files** — none, or explained
- **Recommendation** — ready to commit, or blockers to resolve first
