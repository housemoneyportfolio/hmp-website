# Spec Number Reconciliation — Single Source of Truth

> **Authority:** `ops/specs/` on disk is the single source of truth. Memory and project knowledge files are secondary and may be stale. When conflicts arise, trust what exists on disk.
> **Last reconciled:** 2026-04-20 (FIX_001)
> **Next available MKT:** MKT_003
> **Next available FIX:** FIX_002

---

## 1. Prefix Conventions

| Prefix | Use |
|--------|-----|
| `MKT_{NNN}` | Marketing site features — new pages, sections, integrations |
| `FIX_{NNN}` | Bug fixes — broken behavior, regressions, content errors |

### Spec Granularity Rule

Numbers are assigned at the **deliverable level**, not the phase level. A multi-phase deliverable is one spec file (`MKT_001_bootstrap_marketing_site.md`) with phases as sections. Never create phase-specific spec files. Phase completion is tracked in `QUEUE.md` Completed entries ("MKT_001 Phase N").

## 2. Shipped Specs

| Spec ID | Title | Status | Completed |
|---------|-------|--------|-----------|
| MKT_001 | Bootstrap Marketing Site (Phases 1–5 complete) | COMPLETE | 2026-04-18 |
| MKT_002 | Port spec-first workflow infrastructure | COMPLETE | 2026-04-18 |
| FIX_001 | Pivot waitlist endpoint to API Gateway HTTP API behind api.housemoneyportfolio.com | COMPLETE | 2026-04-20 |

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
