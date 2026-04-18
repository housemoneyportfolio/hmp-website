# MKT_001 — Bootstrap Marketing Site

**Repo:** hmp-website  
**Org:** housemoneyportfolio  
**Domain:** housemoneyportfolio.com  
**Target:** One-page marketing site + Privacy Policy + Terms of Service, live before InvestFest  
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · AWS (S3 + CloudFront) · Terraform  

---

## Scope

Strictly a one-page marketing site with two supporting legal pages. No blog, no docs portal, no support center. Those are post-InvestFest concerns. Ship the one-pager first.

### Pages

| Route | Purpose |
|---|---|
| `/` | Marketing landing page (hero, value prop, CTA) |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

### Not in scope (Phase 1–5)

- Blog
- Docs portal
- Support portal
- Authentication
- Any dynamic backend

---

## Architecture

### Frontend

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Output:** Static export (`next export`) — no server-side rendering required
- **Node version:** 20.x or higher

### Hosting

- **S3** — static site hosting bucket
- **CloudFront** — CDN distribution in front of S3
- **Route 53** — DNS for housemoneyportfolio.com (assumed already managed in AWS account 897545367327)
- **ACM** — TLS certificate for housemoneyportfolio.com (us-east-1, required for CloudFront)

### Infrastructure as Code

- **Terraform** — manages S3 bucket, CloudFront distribution, ACM cert, Route 53 records
- **State:** local for now (remote state in S3 is a post-Phase-1 concern)
- **Terraform version:** 1.5+

### CI/CD

- **GitHub Actions** — on push to `main`: build → export → sync to S3 → invalidate CloudFront cache
- AWS credentials stored as GitHub Actions secrets

---

## Phases

### Phase 1 — Scaffold (local only, no push until reviewed)

**Goal:** Working Next.js project that builds and exports successfully.

Tasks:
1. `npx create-next-app@latest` with TypeScript, Tailwind, App Router, no src directory, no turbopack
2. Remove boilerplate (default page content, global CSS resets from create-next-app)
3. Add three routes: `/`, `/privacy`, `/terms` — stub content only
4. Verify `npm run build` succeeds and `out/` directory is generated
5. Commit locally — do not push

**Gate:** Claude Code stops here and reports status. Human reviews diff before authorizing Phase 2.

---

### Phase 2 — Terraform infrastructure

**Goal:** S3 bucket and CloudFront distribution provisioned in AWS account 897545367327.

Tasks:
1. Create `terraform/` directory at repo root
2. Write `main.tf`, `variables.tf`, `outputs.tf`
3. Resources: S3 bucket (private, static website hosting), CloudFront distribution (OAC to S3), ACM cert (us-east-1), Route 53 A/AAAA records
4. `terraform init && terraform plan` — review plan before apply
5. `terraform apply` only after human approves plan output

**Gate:** Human reviews `terraform plan` output. Claude Code does not run `apply` without explicit authorization.

---

### Phase 3 — CI/CD pipeline

**Goal:** GitHub Actions workflow that deploys on push to `main`.

Tasks:
1. Create `.github/workflows/deploy.yml`
2. Steps: checkout → setup Node 20 → install → build → export → `aws s3 sync out/ s3://BUCKET` → CloudFront invalidation
3. Add required secrets to GitHub Actions: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `CLOUDFRONT_DISTRIBUTION_ID`, `S3_BUCKET`
4. Trigger a test deploy from a scratch branch before wiring to `main`

**Gate:** Successful test deploy confirmed in CloudFront URL before pipeline is pointed at `main`.

---

### Phase 4 — Content

**Goal:** Real copy and design on all three pages.

Tasks:
1. Landing page: hero section (headline, subheadline, CTA button), value proposition section, footer with links to `/privacy` and `/terms`
2. Privacy Policy: real content (not lorem ipsum) — cover data collection, cookies, contact info
3. Terms of Service: real content — cover use of service, disclaimers, governing law
4. Responsive design (mobile-first via Tailwind)
5. Accessibility: semantic HTML, alt text, sufficient color contrast

**Gate:** Visual review in browser at localhost:3000. Mobile view checked via DevTools.

---

### Phase 5 — Go live

**Goal:** housemoneyportfolio.com resolves and serves the site over HTTPS.

Tasks:
1. ACM cert validated (DNS validation via Route 53)
2. CloudFront distribution deployed and healthy
3. Route 53 records pointing to CloudFront
4. `https://housemoneyportfolio.com` loads with valid TLS
5. `https://www.housemoneyportfolio.com` redirects to apex (or vice versa — pick one)
6. Verify all three routes resolve: `/`, `/privacy`, `/terms`

**Gate:** Human confirms site loads correctly in browser on real domain before calling Phase 5 complete.

---

## Naming conventions

| Thing | Name |
|---|---|
| GitHub org | housemoneyportfolio |
| GitHub repo | hmp-website |
| S3 bucket | hmp-website-prod (or hmp-website-static) |
| CloudFront distribution | no fixed name — tag with `Project=hmp-website` |
| Terraform workspace | default (single env for now) |
| GitHub Actions workflow | deploy.yml |

---

## Git discipline

- `main` is the production branch — deploys on push
- Do all work in feature branches, PR to main
- Claude Code leaves commits local until human reviews diff and authorizes push
- Never commit: `.env*`, `*.tfstate`, `.terraform/`, `out/`, `node_modules/`

---

## AWS account

- **Account ID:** 897545367327
- **Region:** us-east-1 (primary; CloudFront is global)
- Caller identity should be verified with `aws sts get-caller-identity` before Terraform work begins

---

## Pre-flight checklist (run before Phase 1)

```bash
node --version        # 20.x or higher
npm --version         # anything recent
git --version         # anything recent
aws sts get-caller-identity   # should show account 897545367327
terraform version     # 1.5+
```

---

## Kickoff prompt for Claude Code

> Read `docs/specs/MKT_001_bootstrap_marketing_site.md`. Execute Phase 1 only — do not proceed to Phase 2. At the end of Phase 1, stop and report status so I can review before authorizing Phase 2. Do not push to GitHub; leave commits local so I can review the diff before pushing.
