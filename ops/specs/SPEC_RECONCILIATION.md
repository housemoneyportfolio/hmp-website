# Spec Number Reconciliation — Single Source of Truth

> **Authority:** `ops/specs/` on disk is the single source of truth. Memory and project knowledge files are secondary and may be stale. When conflicts arise, trust what exists on disk.
> **Last reconciled:** 2026-04-18 (bootstrap)
> **Next available MKT:** MKT_002
> **Next available FIX:** FIX_001

---

## 1. Prefix Conventions

| Prefix | Use |
|--------|-----|
| `MKT_{NNN}` | Marketing site features — new pages, sections, integrations |
| `FIX_{NNN}` | Bug fixes — broken behavior, regressions, content errors |

## 2. Shipped Specs

| Spec ID | Title | Status | Completed |
|---------|-------|--------|-----------|
| MKT_001 | Bootstrap Marketing Site | APPROVED / IN_PROGRESS | — |

## 3. Retired / Reserved Numbers

None yet.

## 4. Claude Code Action Items

When Claude Code opens a session, it should:

1. **Check this file** before claiming any spec number — never use memory alone
2. **Check `QUEUE.md` Next Up table** — reserved numbers live there before they get a disk file
3. **Check `ls ops/specs/`** — the disk is authoritative
4. **Start new marketing features at MKT_002**
5. **Start new fix specs at FIX_001**

## 5. Number Drift Log

> Record any cases where a number was used differently than planned, or where collisions were resolved.

| Date | Entry | Resolution |
|------|-------|------------|
