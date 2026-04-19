# MKT_001 — Bootstrap HMP Marketing Site

**Repo:** `hmp-website` (new, separate from HMP monorepo)
**Target:** `housemoneyportfolio.com` (root apex + www)
**Date drafted:** 2026-04-18
**Status:** IN_PROGRESS (Phase 5 active — Phases 1–4 complete)
**Owner:** Q

---

## 1. Objective

Stand up the public marketing site for House Money Portfolio at `housemoneyportfolio.com`. The site exists to do three things, in priority order:

1. Signal credibility to InvestFest judges and semifinalist reviewers during the application review window.
2. Capture waitlist leads ahead of the SaaS debut.
3. Provide a sign-in path that redirects authenticated users to the HMP app at `app.housemoneyportfolio.com`.

This is a one-page static marketing site with two legal sub-pages (`/privacy`, `/terms`) and one dynamic endpoint (waitlist form handler). It is not a full application. It is not a product surface. It does not render live trading data.

---

## 2. Architecture Summary

| Layer | Implementation |
|---|---|
| Framework | Next.js 14 App Router, `output: 'export'` (static generation) |
| DNS + CDN + TLS + WAF | Cloudflare (already owns the domain, proxy enabled) |
| Static hosting | S3 bucket (private; Cloudflare is the sole reader) |
| Waitlist endpoint | AWS Lambda + Function URL |
| Waitlist storage | DynamoDB table |
| Email notification | Resend API (notifies `quentrell@housemoneyportfolio.com`) |
| Secrets | AWS Secrets Manager (`/hmp/prod/marketing/*`) |
| Terraform | Standalone in `infra/`, separate state file in existing S3 backend |
| Dev environment | Local laptop (Node.js + npm + aws CLI + terraform) |
| Deploy | GitHub Actions on push to `main` |

Request flow: `user → Cloudflare edge → S3 (static assets)` and `user → Cloudflare edge → Lambda Function URL (waitlist POST)`.

Blast radius: fully isolated from HMP trading platform. Shares only AWS account `897545367327` and billing.

---

## 3. Scope

### In scope
- New GitHub repository `hmp-website`
- Next.js 14 scaffolding with static export configuration
- Port of the April 17 `HMPMarketingSite.jsx` artifact into production component files
- Static signals screenshot (replaces the animated mockup table)
- Real brand assets (logo, wordmark, founder headshot) provided by Q and placed in `public/`
- SEO: Metadata API, OG image, favicon set, robots.ts, sitemap.ts, Organization + SoftwareApplication JSON-LD
- Waitlist form wiring (frontend → Lambda → DynamoDB + Resend)
- Legal pages: `/privacy` and `/terms` (placeholder content, to be replaced with reviewed legal copy before launch)
- Terraform module for all AWS resources, standalone state file
- GitHub Actions deploy workflow
- Scoped IAM user for laptop deploys
- Cloudflare DNS and proxy configuration (documented; manual steps)
- README with local dev setup, deploy process, and operational runbook

### Out of scope
- Blog, docs, `/about`, `/pricing`, or any non-legal secondary pages
- Live signals feed from HMP API
- Clerk integration on the marketing site (sign-in button is a plain `<a href>` to the app subdomain)
- A/B testing, feature flags, personalization
- Internationalization
- Service worker / PWA behavior
- Google Analytics or any cookie-dependent analytics (Cloudflare Web Analytics only if needed)
- Email drip sequences (only the immediate notification is wired)
- CloudFront distribution (explicitly replaced by Cloudflare proxy per Pattern C decision)
- Image generation, resizing, or manipulation of brand assets by Claude Code — Q provides finished files

---

## 4. Repo Structure

```
hmp-website/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── app/
│   ├── layout.tsx                 # Metadata API, font loading, JSON-LD, global styles
│   ├── page.tsx                   # Marketing page (imports components below)
│   ├── privacy/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   ├── opengraph-image.tsx        # Dynamic OG image generation (1200x630)
│   ├── icon.svg                   # Favicon (SVG, modern browsers) — derived from logo
│   ├── apple-icon.png             # 180x180 PNG for iOS home screen
│   ├── robots.ts                  # Static robots.txt generator
│   ├── sitemap.ts                 # Static sitemap.xml generator
│   └── not-found.tsx              # Custom 404 page
├── components/
│   ├── Nav.tsx                    # Renders logo + wordmark (clickable, links to /)
│   ├── Hero.tsx
│   ├── CredibilityStrip.tsx
│   ├── ProblemSection.tsx
│   ├── SignalsPreview.tsx         # Static image + caption
│   ├── MoatsSection.tsx
│   ├── FounderSection.tsx         # Renders square headshot with emerald accent ring
│   ├── FinalCTA.tsx
│   ├── Footer.tsx
│   └── WaitlistForm.tsx           # Reused in Hero and FinalCTA
├── lib/
│   ├── brand.ts                   # Color, typography, spacing constants (see Section 4.5)
│   ├── content.ts                 # All copy and stats (single source of truth)
│   └── waitlist.ts                # Client-side submit logic
├── public/
│   ├── brand/
│   │   ├── logo.svg               # Provided by Q — chip/coin motif, emerald + gold
│   │   └── wordmark.svg           # Provided by Q — "HOUSE MONEY" black + "PORTFOLIO" gold
│   ├── founder/
│   │   ├── quentrell-green.jpg    # Provided by Q — square crop, 800x800 minimum
│   │   └── quentrell-green@2x.jpg # Provided by Q — retina 1600x1600
│   ├── screenshots/
│   │   ├── signals-preview.png    # Provided by Q — real app screenshot
│   │   └── signals-preview@2x.png
│   ├── og.png                     # Fallback static OG image
│   └── favicon.ico                # Legacy fallback
├── infra/
│   ├── main.tf                    # S3, Lambda, DynamoDB, Secrets Manager, IAM
│   ├── variables.tf
│   ├── outputs.tf
│   ├── backend.tf                 # S3 backend config (separate state file)
│   └── README.md                  # Terraform usage and Cloudflare manual steps
├── lambda/
│   └── waitlist/
│       ├── index.mjs              # ~50 lines: parse, validate, write DDB, call Resend
│       ├── package.json
│       └── package-lock.json
├── .env.example
├── .env.local                     # Gitignored
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 4.5 Brand Tokens

Brand palette matches the HMP main app post-FEAT_250/FEAT_252 redesign. Do not invent colors. Do not use the April 17 JSX artifact's blue/cyan palette — that was from the pre-redesign digest and is wrong.

**Color palette (from `lib/brand.ts` — authoritative):**

| Token | Value | Usage |
|---|---|---|
| `primary` | `#0D9B7A` | Emerald — main brand color, primary CTAs, moat icons |
| `primaryLight` | `#19c49b` | Hover states, accent rings |
| `primaryDeep` | `#118a6f` | Mid-depth emerald |
| `primaryDark` | `#0A7057` | Pressed states |
| `primaryDarker` | `#064D3D` | Dark section backgrounds (FinalCTA, FounderCard) |
| `accent` | `#10B981` | Emerald accent (success tick, moat bullets) |
| `accentLight` | `#34D399` | Light emerald highlights |
| `accentPale` | `#D1FAE5` | Very light emerald icon backgrounds |
| `gold` | `#e1a73a` | Gold — wordmark accent, founder card strip, CTA highlight |
| `goldLight` | `#F5C261` | Light gold for subheadlines on dark backgrounds |
| `goldPale` | `#FEF3D8` | Pale gold backgrounds |
| `bgWhite` | `#FFFFFF` | Card surface white |
| `bgPaper` | `#FAFBFC` | Page background / footer |
| `bgMuted` | `#F5F7FA` | Section backgrounds |
| `bgSubtle` | `#EEF2F7` | Subtle section backgrounds |
| `textPrimary` | `rgba(0,0,0,0.87)` | Primary body text |
| `textSecondary` | `#475569` | Secondary text, descriptions |
| `textMuted` | `#94A3B8` | Muted / caption text |
| `borderLight` | `rgba(15,23,42,0.08)` | Card borders, dividers |
| `borderMid` | `rgba(15,23,42,0.14)` | Slightly stronger borders |
| `success` | `#10B981` | Success states |
| `warning` | `#F59E0B` | Warning states |
| `danger` | `#EF4444` | Error / danger states (ProblemSection) |

**Typography:**
- Primary typeface: Inter via `next/font/google`
- Weights loaded: 400, 500, 600, 700
- Do not re-render "HOUSE MONEY PORTFOLIO" as text anywhere — always use the wordmark SVG asset

**Shadows and borders (from `lib/brand.ts`):**
- Card shadow: `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)`
- Dashboard shadow: `0 20px 50px -20px rgba(13,155,122,0.2), 0 8px 24px -12px rgba(0,0,0,0.08)`
- Card border: `1px solid rgba(15,23,42,0.08)`
- Border radius: `12px` for cards, `8px` for buttons, `999px` for pills/chips

**Gold is a spice, not a sauce.** Use emerald as the dominant brand color. Apply gold in at most three places on the page (e.g., wordmark accent, founder card top strip, final CTA highlight). Overusing gold cheapens the brand.

---

## 5. Execution Phases

Claude Code executes in five phases. Each phase has a clear completion gate. Q reviews each gate before the next phase begins.

### Phase 1: Repo scaffold and local dev
- Initialize Next.js 14 project with TypeScript, App Router, static export config
- Set up `.gitignore`, `tsconfig.json`, `next.config.ts` with `output: 'export'`
- Install dependencies: `next`, `react`, `react-dom`, `lucide-react`, `typescript`, `@types/node`, `@types/react`
- Create `lib/brand.ts` with color constants matching Section 4.5 exactly. Do not invent colors. Do not use blue/cyan.
- Create `lib/content.ts` with placeholder structure (tagline, credibility numbers, moats content, founder bio, legal disclaimer) — real copy is ported in Phase 2
- Set up `app/layout.tsx` with `next/font` loading Inter (weights 400, 500, 600, 700), basic Metadata API defaults
- Create a minimal `app/page.tsx` that renders "Hello HMP" so local dev is verifiable
- Create `README.md` with local dev instructions

**Gate:** `npm run dev` runs locally on laptop, site loads at `localhost:3000`, `npm run build` produces static output in `out/`. Brand tokens in `lib/brand.ts` match Section 4.5 exactly (Q verifies by opening the file).

### Phase 2: Port the April 17 mockup
- Create each component file under `components/` from the JSX artifact
- **Port structure and copy only; all colors must use tokens from `lib/brand.ts`.** The April 17 artifact's blue/cyan palette is outdated and was replaced during Phase 2 — do not reintroduce it.
- Replace the animated `SignalsTableSection` with `SignalsPreview.tsx` (static screenshot + caption). Screenshot file is a placeholder PNG for now; Q provides the real screenshot before launch.
- Wire all components into `app/page.tsx` in the correct order
- Implement `components/WaitlistForm.tsx` with client-side submit to the Lambda Function URL (endpoint doesn't exist yet — form shows loading + error + success states but POSTs to a placeholder URL from env var)
- **Brand assets integration:**
  - Q places `public/brand/logo.svg` and `public/brand/wordmark.svg` before Phase 2 begins
  - Q places `public/founder/quentrell-green.jpg` (square-cropped) and `@2x` variant before Phase 2 begins
  - If any of these are missing at Phase 2 kickoff, Claude Code uses placeholder files (simple 1-color SVG for brand, gray square for headshot) and flags the missing assets in the gate report
  - `components/Nav.tsx` renders the logo + wordmark as the top-left brand mark. Clickable, links to `/`. Uses `<Image>` or `<img>` with explicit `width`/`height`.
  - `components/FounderSection.tsx` renders the headshot with a 4px emerald accent ring (`border: 4px solid var(--primary-light)` or `#19c49b`). Use `<Image>` with explicit `width={160} height={160}`. Square frame.
- Update the `Sign in` nav link to `<a href="https://app.housemoneyportfolio.com/sign-in">` (plain anchor, not client-side routing)
- Create `app/privacy/page.tsx` and `app/terms/page.tsx` with placeholder content and a TODO comment noting legal review required
- Create `app/not-found.tsx` matching brand

**Gate:** Full marketing page renders locally, visually matches the April 17 artifact but with correct emerald/gold palette, all internal links work, sign-in link points to app subdomain, real logo and wordmark render in nav, real headshot renders in founder section with emerald accent ring.

### Phase 3: SEO + polish
- Populate `app/layout.tsx` Metadata API: title template, description, OG tags, Twitter card, canonical
- Create `app/opengraph-image.tsx` that generates a 1200x630 image with HMP wordmark, tagline, and three moat labels. Use the brand palette (emerald background or white background with emerald accents — not blue).
- Add `app/icon.svg` — favicon derived from `public/brand/logo.svg`, sized appropriately for favicon context
- Add `app/apple-icon.png` (180x180) — same logo motif as the favicon
- Implement `app/robots.ts` and `app/sitemap.ts`
- Add Organization and SoftwareApplication JSON-LD to `app/layout.tsx`
- Optimize signals screenshot: pre-build to WebP with fallback PNG, proper `width`/`height` attributes
- Run Lighthouse locally, address any red flags on Performance, Accessibility, Best Practices, SEO

**Gate:** Lighthouse scores: Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO = 100 on local build. OG image previews correctly when URL is pasted into a Slack or LinkedIn draft (Q verifies by drafting a message, not sending).

### Phase 4: Infrastructure (Terraform) ✅ COMPLETE 2026-04-18

- Write `infra/main.tf` provisioning:
  - S3 bucket `hmp-website-prod` (private, versioned, 30-day version expiry, SSE-S3, block all public access)
  - S3 bucket policy allowing read access from Cloudflare IP ranges only (documented list; acknowledge the maintenance burden)
    - **Actual:** `block_public_policy = false` required — AWS blocks `Principal:*` policies regardless of `aws:SourceIp` conditions. See Amendment 2.
  - DynamoDB table `hmp-website-waitlist` (partition key `email`, on-demand billing, point-in-time recovery)
  - Lambda function `hmp-website-waitlist-handler` with Function URL (auth type NONE, CORS restricted to `housemoneyportfolio.com`)
  - Lambda execution IAM role (DynamoDB PutItem on the table, Secrets Manager read on resend key, CloudWatch logs) — all specific ARNs, no `Resource: "*"`
  - Secrets Manager entry `/hmp/prod/marketing/resend_api_key`
  - IAM user `hmp-website-deploy` with policy allowing only `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on the marketing bucket
  - CloudWatch log group for the Lambda (30-day retention)
- Configure `infra/backend.tf` for separate state file
  - **Actual state bucket:** `hmp-website-terraform-state-897545367327` in `us-east-2` — see Amendment 1
  - State key: `hmp-website/terraform.tfstate`
- Write Lambda handler `lambda/waitlist/index.mjs`:
  - Parse JSON body, validate email format
  - Write to DynamoDB with timestamp and source tag; `ConditionExpression` deduplicates on `email`
  - POST to Resend API with notification email to `quentrell@housemoneyportfolio.com`
  - **Actual `from` address:** `waitlist@send.housemoneyportfolio.com` — see Amendment 3
  - Return 200 on success, 400 on bad input, 500 on internal error
  - All errors logged to CloudWatch, never leak details in response body
- Terraform outputs: S3 bucket name, Lambda Function URL, deploy user access key (sensitive)
- **Terraform provider:** `hashicorp/aws ~> 5.0`, `hashicorp/archive ~> 2.0`; lock file committed at `infra/.terraform.lock.hcl`

**Gate:** ✅ Met — `terraform plan` clean (0 destroy). `terraform apply` succeeded (16 resources). Lambda invocation returns 400 on invalid payload, 200 on valid. Test entry in DynamoDB. Notification email `New signup: quentrell@housemoneyportfolio.com` arrived at M365 inbox. `infra/README.md` complete with Cloudflare manual steps, maintenance, post-apply setup, and security posture sections.

### Phase 5: Deploy pipeline and cutover
- Write `.github/workflows/deploy.yml`:
  - Trigger on push to `main`
  - Checkout, setup Node 20, `npm ci`, `npm run build`
  - Configure AWS credentials from GitHub Secrets (deploy user access key)
  - `aws s3 sync out/ s3://hmp-website-prod/ --delete`
  - Curl Cloudflare API to purge cache (token from GitHub Secrets)
- Document manual Cloudflare steps in `infra/README.md`:
  - Create DNS A/AAAA record for apex → S3 bucket website endpoint (or CNAME to the S3 regional endpoint)
  - Create CNAME for `www` → apex
  - Enable proxy (orange cloud) on both records
  - Set SSL/TLS mode to "Full (strict)" with S3 as origin
  - Create Page Rule or Configuration Rule: always use HTTPS
  - Configure WAF managed rules (OWASP core ruleset, recommended level)
  - Enable Bot Fight Mode
  - Configure rate limiting on the waitlist Lambda URL (10 requests per minute per IP)
  - Create a separate CNAME for the Lambda URL if fronting it through Cloudflare (recommended) or use direct Lambda URL (acceptable v1)
  - Explicitly do not enable Cloudflare Access policies on this zone (no 2FA for public visitors)
- Update S3 bucket policy to allow reads from Cloudflare IP ranges (documented reference to Cloudflare's published IP list)
- Smoke test: push a commit, verify deploy runs, verify site loads at `housemoneyportfolio.com`, submit waitlist form, verify DynamoDB row and email notification

**Gate:** Site is live on `housemoneyportfolio.com`. Waitlist form submits end-to-end. Sign-in link redirects to `app.housemoneyportfolio.com`. Cloudflare WAF and Bot Fight Mode are enabled. Q receives test email.

---

## 6. Configuration

### Environment variables (local dev, `.env.local`)
```
# Only needed if testing waitlist submit locally against deployed Lambda
NEXT_PUBLIC_WAITLIST_ENDPOINT=https://<lambda-function-url>
```

### GitHub Secrets (for Actions)
```
AWS_ACCESS_KEY_ID            # hmp-website-deploy user
AWS_SECRET_ACCESS_KEY        # hmp-website-deploy user
AWS_REGION                   # us-east-2
CLOUDFLARE_API_TOKEN         # Scoped: Zone:Cache Purge on housemoneyportfolio.com only
CLOUDFLARE_ZONE_ID
```

### Lambda environment variables (set via Terraform)
```
DYNAMODB_TABLE=hmp-website-waitlist
RESEND_SECRET_ARN=arn:aws:secretsmanager:us-east-2:897545367327:secret:/hmp/prod/marketing/resend_api_key
NOTIFICATION_EMAIL=quentrell@housemoneyportfolio.com
```

---

## 7. Security Considerations

- Deploy IAM user has zero permissions outside the marketing S3 bucket. If laptop credentials leak, blast radius is "someone can vandalize the marketing site." Nothing else.
- Cloudflare API token scoped to Cache Purge on a single zone. Cannot modify DNS, WAF rules, or any other Cloudflare resource.
- Lambda is internet-facing via Function URL but gated by Cloudflare rate limiting + Bot Fight Mode.
- DynamoDB waitlist table has point-in-time recovery enabled. Waitlist data is not PII-sensitive beyond email addresses.
- Resend API key stored in Secrets Manager, rotated manually if compromised.
- S3 bucket is private, versioned, with public access blocks on. Only Cloudflare reads.
- No Clerk secrets, no HMP API secrets, no trading platform credentials are ever present in this repo or its deploy pipeline.

---

## 8. Operational Runbook

Documented in `README.md` and `infra/README.md`:

- How to run locally
- How to deploy (push to `main`)
- How to roll back (revert commit, push, deploy runs again; or manual `aws s3 sync` from a previous commit's build output)
- How to purge Cloudflare cache manually
- How to inspect waitlist leads (`aws dynamodb scan --table-name hmp-website-waitlist`)
- How to rotate the Resend API key
- How to respond to a Cloudflare WAF alert
- How to update brand assets (replace files in `public/brand/` or `public/founder/`, commit, push — no code changes needed)

---

## 9. Definition of Done

- [ ] Site loads at `https://housemoneyportfolio.com` and `https://www.housemoneyportfolio.com`
- [ ] HTTP → HTTPS redirect works
- [ ] All sections from the April 17 mockup render correctly in emerald/gold palette (no blue/cyan anywhere)
- [ ] Real logo renders in navigation, clickable, returns to top of page
- [ ] Real wordmark renders in navigation and footer
- [ ] Real founder headshot renders in founder section with emerald accent ring
- [ ] Sign-in button routes to `https://app.housemoneyportfolio.com/sign-in`
- [ ] Waitlist form submits successfully; email arrives at `quentrell@housemoneyportfolio.com`; row appears in DynamoDB
- [ ] `/privacy` and `/terms` routes render (with placeholder content flagged for legal review)
- [ ] OG image preview renders correctly when URL is shared in Slack / LinkedIn / iMessage
- [ ] Favicon visible in browser tab, derived from the logo
- [ ] Lighthouse scores meet Phase 3 gate
- [ ] Cloudflare proxy enabled, WAF on, Bot Fight Mode on, rate limiting on Lambda URL
- [ ] No Cloudflare Access policies on the zone (no 2FA for public visitors)
- [ ] GitHub Actions deploy runs in under 3 minutes
- [ ] `terraform plan` is clean after apply (no drift)
- [ ] README and infra/README are complete
- [ ] Q has successfully submitted a test waitlist entry end-to-end

---

## 10. Known Open Items (Not Blocking)

- **Brand assets (logo, wordmark, headshot):** Q places files in `public/brand/` and `public/founder/` before Phase 2 execution begins. Claude Code references these files by path but does not generate, resize, or manipulate them. Placeholder files may be used during Phase 1 to unblock scaffolding.
- **Signals screenshot:** Q to provide the real screenshot before launch. Placeholder used until then.
- **Legal copy for /privacy and /terms:** Placeholder text in place with TODO. Real copy pending legal review. Required before public launch but not required before InvestFest application review window (judges won't read legal pages).
- **Exact credibility numbers:** Pulled from memory (55+ services, 13 brokers, 60+ data sources). Verify against current platform state in `lib/content.ts` before final deploy.

---

## 11. Risks

- **Cloudflare IP range drift:** S3 bucket policy references Cloudflare's published IP ranges. Cloudflare updates these periodically. Mitigation: documented manual refresh quarterly, or alternative — use a Cloudflare Worker as origin fetch (future enhancement, out of scope).
- **Cold start on Lambda:** First waitlist submit after idle period may take 1–2 seconds. Acceptable for v1. If user experience suffers, provision reserved concurrency (1) at ~$5/month.
- **Resend deliverability:** Notification email may land in Gmail promotions or spam initially. Mitigation: SPF/DKIM/DMARC on `housemoneyportfolio.com` must be configured; send from a subdomain like `notify@housemoneyportfolio.com`.
- **Brand asset quality:** If the headshot is not square-cropped before Phase 2, the circular frame component will distort. Q confirms square crop before Phase 2 kickoff.

---

## 12. Handoff Instructions for Claude Code

Execute phases sequentially. At each phase gate, pause and await review before proceeding. Do not skip the review gates — the phase-by-phase structure exists so Q can catch drift early rather than debug a finished build.

Do not:
- Add pages, routes, or features beyond the scope in Section 3
- Introduce dependencies beyond those listed in Section 5 Phase 1 without approval
- Attempt to integrate Clerk, MUI, Tailwind, or any other framework used in the HMP main app
- Use `any` types in TypeScript without explicit justification
- Commit secrets to the repo
- Use the April 17 JSX artifact's blue/cyan colors — the correct palette is in Section 4.5
- Generate, resize, crop, or otherwise manipulate Q's brand assets (logo, wordmark, headshot)
- Re-render the wordmark as HTML text — always reference the SVG asset

Do:
- Mirror the HMP main app's code style (2-space indent, TypeScript strict mode, descriptive variable names)
- Match the brand palette in Section 4.5 exactly
- Write inline comments for any non-obvious design decisions
- Keep components focused — one component per file, no nested subcomponents beyond trivially small helpers
- Ship Phase 1 before touching Phase 2
- Flag missing brand assets in gate reports rather than fabricating substitutes beyond trivial placeholders

---

## 13. Spec Amendments

### Amendment 1 — Terraform state bucket name collision (2026-04-18, Phase 4)

The kickoff prompt specified state bucket `hmp-terraform-state`. During `terraform init`, this bucket was found to be owned by an unknown party in `eu-central-1` — the bucket name was taken globally. `aws s3 ls` confirmed the bucket did not exist in account `897545367327`. The original `aws s3api create-bucket` command had silently failed.

**Resolution:** Operator created new state bucket `hmp-website-terraform-state-897545367327` in `us-east-2`. The account-ID suffix is now standard convention for this project to prevent future name collisions. `infra/backend.tf` references this name.

**Rule added to CLAUDE.md:** Never use a generic S3 bucket name for Terraform state — suffix with account ID to guarantee global uniqueness. Always verify `create-bucket` succeeded with `aws s3 ls | grep <name>` before running `terraform init`.

---

### Amendment 2 — `block_public_policy = false` required for IP-conditional bucket policy (2026-04-18, Phase 4)

The spec called for an S3 bucket policy restricting reads to Cloudflare IP ranges with all public access block settings on. During `terraform apply`, the bucket policy creation failed with `AccessDenied: public policies are prevented by the BlockPublicPolicy setting`. AWS classifies any policy with `Principal: "*"` as a "public" policy — even when the effective access is restricted by an `aws:SourceIp` condition.

**Resolution:** Set `block_public_policy = false` with a prominent inline comment explaining the intent. The other three public access block settings (`block_public_acls`, `ignore_public_acls`, `restrict_public_buckets`) remain `true`. The IP condition in the bucket policy is the operative access control. Long-term migration path: Cloudflare Worker with SigV4 fetch (tracked as OPS_003).

Security posture documented in `infra/README.md` under "Security Posture" section.

**Rule added to CLAUDE.md:** Never expect `BlockPublicPolicy = true` to permit a `Principal:*` bucket policy even when gated by `aws:SourceIp` — AWS evaluates the Principal field to classify a policy as public, not effective access after conditions.

---

### Amendment 3 — Lambda `from` address must use verified Resend sending subdomain (2026-04-18, Phase 4)

The initial Lambda code set `from: "waitlist@housemoneyportfolio.com"`. The Resend-verified sending domain is `send.housemoneyportfolio.com` (a subdomain). Resend rejected sends with HTTP 403 `domain not verified`. The Lambda returned 200 (DDB write succeeded) but silently dropped the notification. The error was only visible in CloudWatch: `Resend error 403 {"message":"The housemoneyportfolio.com domain is not verified..."}`.

**Resolution:** Changed `from` to `waitlist@send.housemoneyportfolio.com`. Redeployed via `terraform apply` (Lambda source hash update only). End-to-end verified: notification email `New signup: quentrell@housemoneyportfolio.com` arrived in M365 inbox.

**Rule added to CLAUDE.md:** Never set a Lambda `from` email address to a domain that isn't exactly the verified Resend sending domain — subdomains are verified separately from their apex.

---

### Amendment 4 — Phase-specific spec files rejected (2026-04-18, Phase 4)

During Phase 4, a separate spec file `MKT_001_phase4_terraform_infrastructure.md` was created to track the phase. Operator rejected this pattern: specs are numbered at the deliverable level, not the phase level. A multi-phase deliverable stays as one spec file with phases as sections. Phase completion is tracked in `QUEUE.md` Completed entries.

**Resolution:** Deleted phase-specific spec file. Updated `CLAUDE.md` Naming Conventions and `SPEC_RECONCILIATION.md` with the spec granularity rule.

---

### Amendment 5 — `hmp-terraform` has AdministratorAccess (2026-04-18, Phase 4, non-blocking)

IAM diagnostics during the state bucket investigation revealed `hmp-terraform` has AWS-managed `AdministratorAccess` policy — full account permissions. This is broader than needed for Terraform operations.

**Not blocking Phase 4 or Phase 5.** Tracked as OPS_002: "Scope hmp-terraform IAM permissions; rotate access keys" in `ops/specs/QUEUE.md` Deferred.
