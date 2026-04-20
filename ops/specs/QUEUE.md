# Feature & Fix Queue

> Priority-ordered backlog. Updated after each session.
> Spec numbering registry: [SPEC_RECONCILIATION.md](SPEC_RECONCILIATION.md)

---

## Active (In Progress)

| Spec ID | Title | Priority | Status |
|---|---|---|---|

## Next Up

| Spec ID | Title | Priority | Blocked By |
|---|---|---|---|

## Deferred

| Spec ID | Title | Trigger to activate | Plan Status |
|---|---|---|---|
| OPS_001 | CloudWatch alarm on Lambda errors + notification | After MKT_001 Phase 5 ships | No spec yet |
| OPS_002 | Scope hmp-terraform IAM permissions; rotate access keys | After MKT_001 Phase 5 ships | No spec yet |
| OPS_003 | Migrate S3 origin to Cloudflare Worker with SigV4 fetch | After site has traction | No spec yet |
| OPS_005 | Restore Cloudflare proxy on `api.housemoneyportfolio.com` (currently DNS-only due to FIX_001 521 issue) | Before public launch OR when abuse mitigation becomes meaningful. Investigate Pro plan Origin Rules / Cloudflare Worker passthrough / zone-level setting that resolves Free-plan APIGW 521 | No spec yet |
| OPS_006 | Add Cloudflare Turnstile to waitlist form (client-side token + server-side verify in Lambda) | Before public launch — substitute protection for missing Cloudflare proxy on `api.*` (FIX_001 / OPS_005) | No spec yet |

## Completed (Last 10)

| Spec ID | Title | Completed |
|---|---|---|
| FIX_001 | Pivot waitlist endpoint to API Gateway HTTP API behind api.housemoneyportfolio.com (Lambda Function URL was account-level blocked) | 2026-04-20 |
| MKT_001 Phase 5 | Deploy pipeline + Cloudflare cutover | 2026-04-18 |
| MKT_001 Phase 1 | Next.js 14 scaffold, brand tokens, content structure | 2026-04-18 |
| MKT_001 Phase 2 | Port April 17 JSX mockup into components | 2026-04-18 |
| MKT_001 Phase 2 revised | Full rewrite to match HMPMarketingSite.jsx exactly | 2026-04-18 |
| MKT_001 Phase 3 | SEO, OG image, favicon, robots, sitemap, JSON-LD | 2026-04-18 |
| MKT_001 Phase 4 | Terraform infrastructure (S3, Lambda, DynamoDB, IAM) | 2026-04-18 |
| MKT_002 | Port spec-first workflow infrastructure from HMP | 2026-04-18 |

> **OPS_004 retired:** original scope ("Cloudflare proxy for Lambda Function URL + rate limiting") was rendered moot by FIX_001 — the Function URL was abandoned. Successor concerns split into OPS_005 (proxy restoration on `api.*`) and OPS_006 (Turnstile substitute for proxy-side protection).
