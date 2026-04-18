# MKT_001 — Bootstrap HMP Marketing Site

**Repo:** `hmp-website` (new, separate from HMP monorepo)
**Target:** `housemoneyportfolio.com` (root apex + www)
**Date drafted:** 2026-04-18
**Status:** Ready for Claude Code execution
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
│   ├── icon.svg                   # Favicon (SVG, modern browsers)
│   ├── apple-icon.png             # 180x180 PNG for iOS home screen
│   ├── robots.ts                  # Static robots.txt generator
│   ├── sitemap.ts                 # Static sitemap.xml generator
│   └── not-found.tsx              # Custom 404 page
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── CredibilityStrip.tsx
│   ├── ProblemSection.tsx
│   ├── SignalsPreview.tsx         # Static image + caption
│   ├── MoatsSection.tsx
│   ├── FounderSection.tsx
│   ├── FinalCTA.tsx
│   ├── Footer.tsx
│   └── WaitlistForm.tsx           # Reused in Hero and FinalCTA
├── lib/
│   ├── brand.ts                   # Color, typography, spacing constants
│   ├── content.ts                 # All copy and stats (single source of truth)
│   └── waitlist.ts                # Client-side submit logic
├── public/
│   ├── og.png                     # Fallback static OG image
│   ├── screenshots/
│   │   ├── signals-preview.png
│   │   └── signals-preview@2x.png
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

## 5. Execution Phases

Claude Code executes in five phases. Each phase has a clear completion gate. Q reviews each gate before the next phase begins.

### Phase 1: Repo scaffold and local dev
- Initialize Next.js 14 project with TypeScript, App Router, static export config
- Set up `.gitignore`, `tsconfig.json`, `next.config.ts` with `output: 'export'`
- Install dependencies: `next`, `react`, `react-dom`, `lucide-react`, `typescript`, `@types/node`, `@types/react`
- Create `lib/brand.ts` with color constants (`#1976D2`, `#00BCD4`, MUI-style borders, Inter font references)
- Create `lib/content.ts` with all copy and stats (tagline, credibility numbers, moats content, founder bio, legal disclaimer)
- Set up `app/layout.tsx` with `next/font` loading Inter, basic Metadata API defaults
- Create a minimal `app/page.tsx` that renders "Hello HMP" so local dev is verifiable
- Create `README.md` with local dev instructions

**Gate:** `npm run dev` runs locally on laptop, site loads at `localhost:3000`, `npm run build` produces static output in `out/`.

### Phase 2: Port the April 17 mockup
- Create each component file under `components/` from the JSX artifact
- Replace the animated `SignalsTableSection` with `SignalsPreview.tsx` (static screenshot + caption). Screenshot file is a placeholder PNG for now; Q will provide the real screenshot before launch.
- Wire all components into `app/page.tsx` in the correct order
- Implement `components/WaitlistForm.tsx` with client-side submit to `/api/waitlist` (endpoint doesn't exist yet — form shows loading + error + success states but POSTs to placeholder)
- Update the `Sign in` nav link to `<a href="https://app.housemoneyportfolio.com/sign-in">`
- Create `app/privacy/page.tsx` and `app/terms/page.tsx` with placeholder content and a TODO comment noting legal review required
- Create `app/not-found.tsx` matching brand

**Gate:** Full marketing page renders locally, visually matches the April 17 artifact, all internal links work, sign-in link points to app subdomain.

### Phase 3: SEO + polish
- Populate `app/layout.tsx` Metadata API: title template, description, OG tags, Twitter card, canonical
- Create `app/opengraph-image.tsx` that generates a 1200x630 image with HMP logo, tagline, and three moat labels
- Add `app/icon.svg` (favicon matching the HMP app's favicon)
- Add `app/apple-icon.png` (180x180)
- Implement `app/robots.ts` and `app/sitemap.ts`
- Add Organization and SoftwareApplication JSON-LD to `app/layout.tsx`
- Optimize signals screenshot: pre-build to WebP with fallback PNG, proper `width`/`height` attributes
- Run Lighthouse locally, address any red flags on Performance, Accessibility, Best Practices, SEO

**Gate:** Lighthouse scores: Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO = 100 on local build.

### Phase 4: Infrastructure (Terraform)
- Write `infra/main.tf` provisioning:
  - S3 bucket `hmp-website-prod` (private, versioned, 30-day version expiry, SSE-S3, block all public access)
  - S3 bucket policy allowing read access from Cloudflare IP ranges only (documented list; acknowledge the maintenance burden)
  - DynamoDB table `hmp-website-waitlist` (partition key `email`, on-demand billing, point-in-time recovery)
  - Lambda function `hmp-website-waitlist-handler` with Function URL (auth type NONE, CORS restricted to `housemoneyportfolio.com`)
  - Lambda execution IAM role (DynamoDB PutItem on the table, Secrets Manager read on resend key, CloudWatch logs)
  - Secrets Manager entry `/hmp/prod/marketing/resend_api_key`
  - IAM user `hmp-website-deploy` with policy allowing only `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on the marketing bucket
  - CloudWatch log group for the Lambda
- Configure `infra/backend.tf` for separate state file: `s3://hmp-terraform-state/hmp-website/terraform.tfstate` (adjust path if existing backend structure differs — verify with Q before apply)
- Write Lambda handler `lambda/waitlist/index.mjs`:
  - Parse JSON body, validate email format
  - Write to DynamoDB with timestamp and source tag
  - POST to Resend API with notification email to `quentrell@housemoneyportfolio.com`
  - Return 200 on success, 400 on bad input, 500 on internal error
  - All errors logged to CloudWatch, never leak details in response body
- Terraform outputs: S3 bucket name, Lambda Function URL, deploy user access key (sensitive)

**Gate:** `terraform plan` runs clean. Q reviews the plan. `terraform apply` succeeds. Lambda Function URL returns 400 when POSTed with invalid payload, 200 with valid payload. Test entry appears in DynamoDB. Test notification email arrives at `quentrell@housemoneyportfolio.com`.

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

---

## 9. Definition of Done

- [ ] Site loads at `https://housemoneyportfolio.com` and `https://www.housemoneyportfolio.com`
- [ ] HTTP → HTTPS redirect works
- [ ] All sections from the April 17 mockup render correctly
- [ ] Sign-in button routes to `https://app.housemoneyportfolio.com/sign-in`
- [ ] Waitlist form submits successfully; email arrives at `quentrell@housemoneyportfolio.com`; row appears in DynamoDB
- [ ] `/privacy` and `/terms` routes render (with placeholder content flagged for legal review)
- [ ] OG image preview renders correctly when URL is shared in Slack / LinkedIn / iMessage
- [ ] Favicon visible in browser tab, matches HMP app favicon
- [ ] Lighthouse scores meet Phase 3 gate
- [ ] Cloudflare proxy enabled, WAF on, Bot Fight Mode on, rate limiting on Lambda URL
- [ ] No Cloudflare Access policies on the zone (no 2FA for public visitors)
- [ ] GitHub Actions deploy runs in under 3 minutes
- [ ] `terraform plan` is clean after apply (no drift)
- [ ] README and infra/README are complete
- [ ] Q has successfully submitted a test waitlist entry end-to-end

---

## 10. Known Open Items (Not Blocking)

- **Signals screenshot:** Q to provide the real screenshot. Placeholder used until then.
- **Legal copy for /privacy and /terms:** Placeholder text in place with TODO. Real copy pending legal review. Required before public launch but not required before InvestFest application review window (judges won't read legal pages).
- **Real founder photo:** Placeholder used until Q provides the final photo.
- **Exact credibility numbers:** Pulled from memory (55+ services, 13 brokers, 60+ data sources). Verify against current `lib/content.ts` before final deploy.

---

## 11. Risks

- **Cloudflare IP range drift:** S3 bucket policy references Cloudflare's published IP ranges. Cloudflare updates these periodically. Mitigation: documented manual refresh quarterly, or alternative — use a Cloudflare Worker as origin fetch (future enhancement, out of scope).
- **Cold start on Lambda:** First waitlist submit after idle period may take 1–2 seconds. Acceptable for v1. If user experience suffers, provision reserved concurrency (1) at ~$5/month.
- **Resend deliverability:** Notification email may land in Gmail promotions or spam initially. Mitigation: SPF/DKIM/DMARC on `housemoneyportfolio.com` must be configured; send from a subdomain like `notify@housemoneyportfolio.com`.

---

## 12. Handoff Instructions for Claude Code

Execute phases sequentially. At each phase gate, pause and await review before proceeding. Do not skip the review gates — the phase-by-phase structure exists so Q can catch drift early rather than debug a finished build.

Do not:
- Add pages, routes, or features beyond the scope in Section 3
- Introduce dependencies beyond those listed in Section 5 Phase 1 without approval
- Attempt to integrate Clerk, MUI, Tailwind, or any other framework used in the HMP main app
- Use `any` types in TypeScript without explicit justification
- Commit secrets to the repo

Do:
- Mirror the HMP main app's code style (2-space indent, TypeScript strict mode, descriptive variable names)
- Write inline comments for any non-obvious design decisions
- Keep components focused — one component per file, no nested subcomponents beyond trivially small helpers
- Ship Phase 1 before touching Phase 2
