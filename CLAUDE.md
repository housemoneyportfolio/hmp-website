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

### Infrastructure
- Never use a generic S3 bucket name for Terraform state (e.g. `hmp-terraform-state`) — S3 names are globally unique across all AWS accounts; suffix with account ID (`hmp-website-terraform-state-897545367327`) to guarantee ownership
- Never assume an `aws s3api create-bucket` succeeded without verifying with `aws s3 ls | grep <name>` — the command can fail silently, and `terraform init` will hit a stranger's bucket with the same name and return a confusing 301/AccessDenied
- Never diagnose an S3 `AccessDenied` as a permissions problem without first checking `aws s3 ls` — if the bucket isn't in the account listing, the real cause is a name collision with a bucket owned by another AWS account, not a missing IAM policy
- Never use a kickoff prompt as a substitute for a spec — a detailed operator prompt is instructions, not a spec; create the spec file in `ops/specs/` before or immediately after scaffolding infrastructure files
- Never expect `BlockPublicPolicy = true` to permit a `Principal: "*"` S3 bucket policy even when gated by `aws:SourceIp` — AWS evaluates the Principal field to classify a policy as "public", not the effective access after conditions; set `block_public_policy = false` deliberately with a comment, keep the other three public access block settings on
- Never set a Lambda `from` email address to a domain that isn't exactly the verified Resend sending domain — subdomains are verified separately from their apex; `send.example.com` verified does NOT permit sends from `@example.com`; mismatch returns Lambda 200 (DDB write succeeded) but Resend silently drops the email, visible only in CloudWatch as `Resend error 403 domain not verified`
- Never name an S3 bucket anything other than the exact custom domain when using S3 static website hosting with a Cloudflare (or any CDN) proxy — S3 website hosting uses the incoming `Host` header to look up the bucket; a mismatch produces `NoSuchBucket`. For this project the bucket must be named `housemoneyportfolio.com`
- Never plan S3-behind-Cloudflare via the REST endpoint (`s3.*.amazonaws.com`) on the Cloudflare Free plan — Cloudflare sends the proxied hostname as SNI, not the S3 bucket hostname; this fails TLS under "Full (strict)". Host Header Override that fixes it requires Cloudflare Pro ($20/mo). For Free-plan static sites: use S3 website endpoint (`s3-website.*.amazonaws.com`) + Cloudflare SSL mode "Full" + public bucket policy
- Never add `trailingSlash: true` to `next.config.mjs` while the project has App Router image metadata files (`app/icon.svg`, `app/apple-icon.png`, `app/opengraph-image.*`, `app/twitter-image.*`) — in this project's Next.js 14 setup, trailing-slash mode produces `PageNotFoundError` on the generated metadata routes during build. If directory-style URLs are needed for S3 hosting, move the metadata files to `public/` and use explicit `<link>` tags in `layout.tsx` instead
- Never use Lambda Function URLs with `AuthType=NONE` for any public endpoint on AWS account `897545367327` — the account has a server-side block that returns `403 AccessDeniedException` on every invocation regardless of resource policy, with zero CloudWatch log entries because the handler is never invoked. The block applies to every Function URL on every Lambda in the account. Default to API Gateway HTTP API (free for first 1M req/month) fronted by a custom domain. The block is invisible to AWS CLI v2.34.32 (`get-public-access-block-config` does not exist as a subcommand). Discovered in FIX_001
- Never verify a Lambda Function URL or any public HTTPS endpoint with `aws lambda invoke` alone — direct management-API invocation bypasses the endpoint's auth layer entirely. Always test with curl to the actual hostname (or a browser form submission). MKT_001 Phase 4 was declared "end-to-end verified" based on `aws lambda invoke` output; the URL's auth layer was never exercised until Phase 5 went live and the first real form submission hit a 403. The Function URL had been dead since creation
- Never assume AWS CLI feature availability equals AWS API/service feature availability — some AWS features (Lambda's Public Access Block, Resource Control Policies, newer setting APIs) may exist at the service layer but not be exposed in older CLI versions. If a setting is blocking behavior but no CLI command exists in your installed version, check AWS docs / Console / a newer CLI before concluding the feature doesn't exist. When the block can't be cleared from your side, treat it as an account-level constraint and pivot the architecture
- Never assume `DomainStatus: AVAILABLE` on a new API Gateway regional custom domain means it's fully reachable from external networks — AWS docs note up to 40 minutes for full propagation across regional edge nodes. AWS regional endpoints are geo-balanced via DNS: different resolvers receive different IP pools. A curl from one location may succeed while a curl from another location (Cloudflare's edge, for example) still hits an unprovisioned node. When 521s/connection-refused appear post-creation, wait the full documented window before declaring a different failure mode
- Never proxy AWS API Gateway regional custom domains through Cloudflare on the Free plan without first verifying that the proxied path works end-to-end — Cloudflare proxy → API Gateway regional endpoint can return persistent 521 (connection refused) even when the origin is healthy and reachable from any non-Cloudflare client. Root cause undetermined as of FIX_001 (likely Cloudflare-side edge IP behavior or Free-plan SSL/SNI handling). Workaround: set the API CNAME to DNS-only (grey cloud); accept the loss of WAF/Bot Fight Mode and add Cloudflare Turnstile to the form for client-side bot mitigation instead. Tracked as OPS_005 (proxy restoration) and OPS_006 (Turnstile)

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
| 2026-04-18 | MKT_001 Phase 4 | Never use a generic S3 bucket name for Terraform state — suffix with account ID to guarantee global uniqueness |
| 2026-04-18 | MKT_001 Phase 4 | Never assume `aws s3api create-bucket` succeeded — verify with `aws s3 ls | grep <name>` before running `terraform init` |
| 2026-04-18 | MKT_001 Phase 4 | Never diagnose S3 AccessDenied as a permissions problem without checking `aws s3 ls` first — missing from list = name collision, not IAM |
| 2026-04-18 | MKT_001 Phase 4 | Never use a kickoff prompt as a substitute for a spec — create the spec file before or immediately after scaffolding |
| 2026-04-18 | MKT_001 Phase 4 | Never expect `BlockPublicPolicy = true` to allow `Principal:*` bucket policy — AWS labels it "public" regardless of `aws:SourceIp` conditions |
| 2026-04-18 | MKT_001 Phase 4 | Never use a `from` address whose domain differs from the verified Resend sending domain — Lambda returns 200 but email is silently dropped |
| 2026-04-18 | MKT_001 Phase 5 | Never use S3 REST endpoint as Cloudflare proxied origin on Free plan — SNI mismatch fails TLS; use website endpoint + SSL "Full" |
| 2026-04-18 | MKT_001 Phase 5 | Never add `trailingSlash: true` with Next.js 14 image metadata files — breaks build on `apple-icon.png` / `icon.svg` routes |
| 2026-04-19 | FIX_001 | Never use Lambda Function URLs `AuthType=NONE` on account 897545367327 — invisible account-level block returns 403 on every invoke; pivot to API Gateway HTTP API |
| 2026-04-19 | FIX_001 | Never verify a public HTTPS endpoint with `aws lambda invoke` alone — bypasses the URL auth layer; always curl the hostname or use a browser |
| 2026-04-19 | FIX_001 | Never assume CLI feature availability equals AWS API availability — newer service features may not be exposed in older CLI versions |
| 2026-04-20 | FIX_001 | Never assume APIGW regional custom domain `DomainStatus: AVAILABLE` means fully propagated — wait up to 40 min before debugging connectivity |
| 2026-04-20 | FIX_001 | Never proxy APIGW regional custom domains through Cloudflare Free without testing E2E — persistent 521 with no clear cause; use DNS-only + Turnstile (OPS_005, OPS_006) |

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

### Multi-Phase Specs

Specs are numbered at the **deliverable level**, not the phase level. A multi-phase deliverable (e.g. MKT_001) is one spec file with phases as sections and gates between them. Do NOT create separate spec files per phase (no `MKT_001_phase4_*.md`). Phase completion is tracked in `QUEUE.md` Completed entries using the notation "MKT_001 Phase N" — the master spec file remains the single source of truth.

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
