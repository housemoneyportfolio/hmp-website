# Feature & Fix Queue

> Priority-ordered backlog. Updated after each session.
> Spec numbering registry: [SPEC_RECONCILIATION.md](SPEC_RECONCILIATION.md)

---

## Active (In Progress)

| Spec ID | Title | Priority | Status |
|---|---|---|---|
| MKT_001 Phase 5 | Deploy pipeline + Cloudflare cutover | P0 | IN_PROGRESS |

## Next Up

| Spec ID | Title | Priority | Blocked By |
|---|---|---|---|

## Deferred

| Spec ID | Title | Trigger to activate | Plan Status |
|---|---|---|---|
| OPS_001 | CloudWatch alarm on Lambda errors + notification | After MKT_001 Phase 5 ships | No spec yet |
| OPS_002 | Scope hmp-terraform IAM permissions; rotate access keys | After MKT_001 Phase 5 ships | No spec yet |
| OPS_003 | Migrate S3 origin to Cloudflare Worker with SigV4 fetch | After site has traction | No spec yet |
| OPS_004 | Cloudflare proxy for Lambda Function URL + rate limiting (10 req/min per IP) | After site has traction or abuse observed | No spec yet |

## Completed (Last 10)

| Spec ID | Title | Completed |
|---|---|---|
| MKT_001 Phase 1 | Next.js 14 scaffold, brand tokens, content structure | 2026-04-18 |
| MKT_001 Phase 2 | Port April 17 JSX mockup into components | 2026-04-18 |
| MKT_001 Phase 2 revised | Full rewrite to match HMPMarketingSite.jsx exactly | 2026-04-18 |
| MKT_001 Phase 3 | SEO, OG image, favicon, robots, sitemap, JSON-LD | 2026-04-18 |
| MKT_001 Phase 4 | Terraform infrastructure (S3, Lambda, DynamoDB, IAM) | 2026-04-18 |
| MKT_002 | Port spec-first workflow infrastructure from HMP | 2026-04-18 |
