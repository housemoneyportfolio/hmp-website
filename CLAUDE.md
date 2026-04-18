# CLAUDE.md — hmp-website Project Rules

> Updated by Scribe terminal after each feature. Read by Claude Code on every session.
> For incident-specific rules see `docs/knowledge-base/rules-changelog.md`.

---

## Core Invariants (Violate These = Brand or Revenue Damage)

These are non-negotiable. If you're about to break one, stop and ask.

1. **Brand Tokens Are Source of Truth**: All colors come from `lib/brand.ts`. Never hardcode hex values in component files. Never deviate from the emerald/gold palette defined there.
2. **Wordmark**: Never render "HOUSE MONEY PORTFOLIO" as HTML text. Always use `/public/brand/wordmark.svg`.
3. **Static Export**: `npm run build` must complete clean and produce `out/`. No server-side features (`getServerSideProps`, API routes, etc.).
4. **Lighthouse Budget**: Performance ≥ 95 · Accessibility ≥ 95 · Best Practices = 100 · SEO = 100. These are hard gates before any deploy.
5. **Brand Assets Read-Only**: Never generate, resize, crop, or modify files in `public/brand/` or `public/founder/`. Q provides finished files.
6. **Spec-First**: Every new page, section, or non-trivial change needs a spec before implementation. No exceptions outside the exemptions list in `/spec-first`.
7. **Zero Type Errors, Zero Lint Errors**: `npx tsc --noEmit` and `npm run build` must pass clean. These are CI gates, not suggestions.
8. **Accessibility**: WCAG 2.1 AA minimum. Every `<img>` has meaningful `alt`. Every interactive element has visible focus styles and keyboard support.

---

## Never Do

> Condensed universal rules. Specific decisions are logged in `docs/knowledge-base/rules-changelog.md`.

### Agent Behavior
- Never implement beyond the spec's file list without asking
- Never skip running tests/build after implementation — actually run them
- Never add features during a fix step; never "helpfully" expand scope
- Never implement a spec literally without first exploring what already exists — specs may be outdated
- Never consider a feature complete while files remain untracked (`??` in git status)
- Never start a new feature without checking `git status` first — separate pre-existing uncommitted changes
- Never start implementing without first creating or locating its spec in `ops/specs/` AND adding it to `ops/specs/QUEUE.md` Active section
- Never consider a spec complete without moving it to Completed in `ops/specs/QUEUE.md` with today's date — do it in the same commit as the implementation
- Never claim a MKT/FIX number from memory alone — verify against three sources: `SPEC_RECONCILIATION.md` "Next available", `QUEUE.md` Next Up table, and `ls ops/specs/`
- Never write a spec §3 "Files Changed" table without `ls`-ing every target path first — a MODIFIED label on a file that doesn't exist is a latent failure
- Never reference a field name or prop in a spec from memory — grep the TypeScript interface or component first

### Code Quality
- Never use `"use client"` at the Next.js page level — use server component `page.tsx` → client wrapper pattern
- Never hardcode colors (`#10B981`, `#D4AF37`, etc.) in component files — always import from `lib/brand.ts`
- Never add a font family other than the project's configured typefaces — check `app/layout.tsx` for the current font setup
- Never use `<img>` directly — use `next/image` for all images for automatic optimization and CLS prevention
- Never use `setInterval` for polling in React — use `setTimeout`-after-completion pattern to avoid stacking requests
- Never write a React `useEffect` without a dependency array — missing deps cause infinite re-render loops
- Never use `Promise.all` for independent parallel fetches where partial failure is acceptable — use `Promise.allSettled`
- Never leave TypeScript `any` types in production code — use proper types or `unknown` with narrowing
- Never commit with `console.log` statements left in — remove or replace with proper error handling before commit
- Never hardcode copyright years — use `new Date().getFullYear()` for dynamic year display
- Never add npm packages without updating `package-lock.json` — `npm ci` in CI requires lockfile sync

### Scope Control
- Never escalate a UI component change to a full-stack spec without explicit operator approval — default to the smallest frontend-only scope first
- Never add a new page without checking routing, metadata (`export const metadata`), and sitemap inclusion
- Never consider a frontend feature "done" after `next build` passes without actually opening it in a browser
- Never trust spec task checkboxes for implementation status — verify by reading actual source files
- Never ship a spec without updating `SPEC_RECONCILIATION.md` "Next available" numbers and pipeline status

### Content & SEO
- Never hardcode Open Graph images — use the Next.js `opengraph-image` convention or `generateMetadata`
- Never duplicate `<title>` or `<meta description>` across pages — each page gets unique values via `generateMetadata`
- Never add external links without `rel="noopener noreferrer"` on `target="_blank"` links
- Never add tracking scripts without loading them via `next/script` with appropriate `strategy`

### Accessibility
- Never render interactive elements (buttons, links) without visible focus styles
- Never use color alone to convey meaning — pair with icon, text, or pattern
- Never omit `aria-label` on icon-only buttons
- Never use `<div>` or `<span>` as interactive elements — use semantic HTML (`<button>`, `<a>`)

---

## Rules Added Per Feature

| Date | Spec | Rule Summary |
|---|---|---|
| 2026-04-18 | MKT_001 Phase 1 | Never use `next.config.ts` with Next.js 14 |
| 2026-04-18 | MKT_001 Phase 1 | Never run `create-next-app` in a non-empty directory |
| 2026-04-18 | MKT_001 Phase 2 | Never type lucide-react icons as `ComponentType<{ size: number; color: string }>` |
| 2026-04-18 | MKT_001 Phase 2 | Never delete a component without updating all imports in the same commit |
| 2026-04-18 | MKT_001 Phase 2 revised | Never rebuild from a mockup without re-gating |
| 2026-04-18 | MKT_001 Phase 2 | Never expand brand tokens without updating Section 4.5 of the spec |
| 2026-04-18 | MKT_001 Phase 3 | Never use `opengraph-image.tsx` / `ImageResponse` in static export — use SVG + sharp rasterization |
| 2026-04-18 | MKT_002 | Never start implementation before porting workflow infrastructure |
| 2026-04-18 | MKT_002 | Never assume ops/specs/ files don't exist — check disk before creating; Claude Code harness may have seeded them |

---

## Session Rules

| Rule | Enforcement |
|------|-------------|
| 60-90 min max | Stop mid-thought if needed |
| No "one more thing" | Scope creep is the enemy |
| Boredom = Success | If you're bored, you've won |

---

## Session Workflow

| Step | Command | Purpose |
|------|---------|---------|
| 1. Orient | `/preflight` | Read spec, load rules, prove comprehension |
| 2. Scope | `/guard-rails` | Lock file writes to spec manifest |
| 3. Implement | `/spec-first` | Follow spec exactly |
| 4. Check | `/checkpoint` | Mid-session compliance audit (every 30 min or on drift) |
| 5. Debug | `/investigate` | Root-cause-first debugging (if needed) |
| 6. Learn | `/lessons-learned` | Capture lessons |
| 7. Review | `/review` | Pre-merge review |
| 8. Ship | `/commit` | Commit with proper message |

---

## Spec-First Development

**Every feature and fix requires a spec before implementation** (except typo fixes, dep bumps, log-only, doc-only changes).

| Step | Action |
|------|--------|
| Read context | `CLAUDE.md`, existing code, `ops/specs/QUEUE.md` |
| Write spec | Copy `ops/specs/_TEMPLATE.md` → `ops/specs/{MKT,FIX}_{NNN}_{slug}.md` |
| Get approval | Present spec summary; wait for explicit "go" |
| Implement | Follow spec file list exactly; run `npm run build` between phases |
| Complete | All AC met, build passes, spec marked COMPLETE, **QUEUE.md updated** (moved to Completed with date), lessons captured |

Run `/spec-first` for the full workflow. Never implement without an approved spec.

---

## Naming Conventions

| Type | Pattern |
|------|---------|
| Marketing feature specs | `ops/specs/MKT_{NNN}_{slug}.md` |
| Fix specs | `ops/specs/FIX_{NNN}_{slug}.md` |
| Spec template | `ops/specs/_TEMPLATE.md` |
| Brand tokens | `lib/brand.ts` |
| Page components | `app/{page}/page.tsx` (server) + `app/{page}/ui/{Page}Client.tsx` (client) |

---

## Claude Code Permissions

Project-level permissions in `.claude/settings.json` (committed) define safe defaults.
Personal overrides go in `.claude/settings.local.json` (gitignored).

**Key deny rules:**
- `git push` — push interactively, never auto-approved
- `sudo`, `rm -rf` — no root or mass deletion
- `terraform apply`, `terraform destroy` — no infrastructure changes without explicit approval
- `.env` / `.env.*` — no reading secrets

**To add a personal override:** edit `.claude/settings.local.json` (never committed).

---

## Reference

- [Rules changelog](docs/knowledge-base/rules-changelog.md)
- [Spec queue](ops/specs/QUEUE.md)
- [Spec number registry](ops/specs/SPEC_RECONCILIATION.md)

*Add new rules to this file under the appropriate Never Do section. Log them in the Rules Added Per Feature table and in `docs/knowledge-base/rules-changelog.md`.*
