# infra/ — Terraform for hmp-website

Provisions the AWS infrastructure for `housemoneyportfolio.com`.

## Resources

| Resource | Name | Purpose |
|---|---|---|
| S3 bucket | `housemoneyportfolio.com` | Static site hosting (public website endpoint; Cloudflare proxies it) |
| DynamoDB table | `hmp-website-waitlist` | Waitlist email storage |
| Lambda function | `hmp-website-waitlist-handler` | Waitlist form API |
| Lambda Function URL | — | Public HTTPS endpoint for the Lambda |
| Secrets Manager secret | `/hmp/prod/marketing/resend_api_key` | Resend API key (value set manually post-apply) |
| CloudWatch log group | `/aws/lambda/hmp-website-waitlist-handler` | Lambda logs, 30-day retention |
| IAM role | `hmp-website-lambda-role` | Lambda execution role |
| IAM user | `hmp-website-deploy` | GitHub Actions deploy credentials |

## State Backend

```
bucket: hmp-website-terraform-state-897545367327
key:    hmp-website/terraform.tfstate
region: us-east-2
```

The state bucket was created manually before Terraform was initialized.
The account-ID suffix (`897545367327`) is intentional — S3 bucket names are globally unique and generic names like `hmp-terraform-state` can be taken by other AWS accounts.

## Usage

```bash
cd infra/

# First time
terraform init

# Preview changes
terraform plan

# Apply (requires explicit operator approval — never run in CI)
terraform apply

# Show sensitive outputs after apply
terraform output -json
```

## Post-apply Setup

After `terraform apply` completes, the operator must:

### 1. Populate the Resend API key

```bash
aws secretsmanager put-secret-value \
  --secret-id /hmp/prod/marketing/resend_api_key \
  --secret-string '{"api_key":"re_xxxxxxxxxx"}'
```

Sign up at resend.com, verify the `housemoneyportfolio.com` domain, then replace `re_xxxxxxxxxx` with the real key.

### 2. Set GitHub Actions secrets

From `terraform output -json`, copy:
- `deploy_user_access_key_id` → GitHub secret `AWS_ACCESS_KEY_ID`
- `deploy_user_secret_access_key` → GitHub secret `AWS_SECRET_ACCESS_KEY`

Also set:
- `AWS_REGION` = `us-east-2`
- `CLOUDFLARE_API_TOKEN` — scoped to Zone: Cache Purge on `housemoneyportfolio.com` only
- `CLOUDFLARE_ZONE_ID`

### 3. Set the waitlist endpoint env var

```bash
# .env.local (local dev) or Vercel/CI env
NEXT_PUBLIC_WAITLIST_ENDPOINT=<lambda_function_url output>
```

### 4. Configure Cloudflare (manual steps — not in Terraform)

Complete these steps in order. Steps 1 and 2 must be done before creating DNS records.

#### Step 1 — SSL/TLS mode (do this FIRST, before DNS records exist)

Cloudflare dashboard → `housemoneyportfolio.com` → SSL/TLS → Overview → set mode to **Full**.

> **Why "Full" and not "Full (strict)"?** The S3 website endpoint (`s3-website.us-east-2.amazonaws.com`) serves over HTTP only — it has no TLS certificate. Cloudflare connects to the origin over HTTP. "Full" is correct here. Traffic from browser to Cloudflare is still HTTPS — visitors see the padlock.

#### Step 2 — HTTPS redirect

Cloudflare dashboard → Rules → Configuration Rules → Create rule.

- Rule name: `Always HTTPS`
- Field: SSL, Operator: Off
- Action: SSL/TLS → HTTPS Only: On

Or use Page Rules → `http://housemoneyportfolio.com/*` → Always Use HTTPS.

#### Step 3 — DNS records

Cloudflare dashboard → DNS → Records → Add record:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `@` (apex) | `housemoneyportfolio.com.s3-website.us-east-2.amazonaws.com` | **ON (orange cloud)** |
| CNAME | `www` | `housemoneyportfolio.com` | **ON (orange cloud)** |

> **Important:** use `s3-website.us-east-2.amazonaws.com`, NOT `s3.us-east-2.amazonaws.com`. The website endpoint handles `index.html` fallback; the REST endpoint does not.
>
> Cloudflare performs automatic CNAME flattening at the apex — entering `@` works even though bare CNAME records are technically invalid per RFC.

#### Step 4 — WAF managed rules

Cloudflare dashboard → Security → WAF → Managed Rules.

- Enable **OWASP Core Ruleset** at Recommended sensitivity (requires Pro plan)
- If on Free plan: WAF managed rules are not available. Bot Fight Mode (Step 5) covers basic automated threats.

#### Step 5 — Bot Fight Mode

Cloudflare dashboard → Security → Bots → Enable **Bot Fight Mode**.

#### Step 6 — Lambda rate limiting (deferred — OPS_004)

Not configured in Phase 5. The Lambda Function URL's CORS is locked to `housemoneyportfolio.com` (set in Terraform). AWS regional DDoS protection covers the endpoint. Revisit if abuse is observed — tracked as OPS_004 (Cloudflare proxy for Lambda URL + rate limiting).

## DNS Cutover Sequence

Complete this sequence in order. The point of no return is Step 3 (creating DNS records) — after that, live traffic is affected.

**Pre-cutover checklist:**
- [ ] All 6 GitHub Secrets configured (`gh secret list` to verify names)
- [ ] `terraform apply` succeeded — website hosting enabled, bucket is public-read
- [ ] Cloudflare SSL mode set to **"Full"** (Step 1 above — must be done first)
- [ ] HTTPS redirect rule created (Step 2 above)
- [ ] Local build succeeded with real `NEXT_PUBLIC_WAITLIST_ENDPOINT` env var
- [ ] First workflow run pushed and S3 bucket populated

**Cutover:**
1. Create DNS records (Step 3 above) with proxy **ON from the start** — do not do unproxied first
2. Verify DNS propagation: `dig housemoneyportfolio.com` → should return Cloudflare IPs (104.x.x.x or 172.x.x.x range)
3. Verify origin: `curl -I https://housemoneyportfolio.com` → expect HTTP 200, `cf-ray` header present
4. Browser test: `https://housemoneyportfolio.com` and `https://www.housemoneyportfolio.com`
5. Complete WAF and Bot Fight Mode (Steps 4–5 above)

## Rollback

**Automated rollback (preferred):** Revert the offending commit, push to `main` → Actions workflow redeploys the previous state automatically.

**Manual rollback (if Actions is broken):**

```bash
git checkout <previous-commit-sha>
NEXT_PUBLIC_WAITLIST_ENDPOINT=https://6woorghof75bdossrpr7ceo3bm0tmkcf.lambda-url.us-east-2.on.aws/ npm run build

aws s3 sync out/ s3://housemoneyportfolio.com/ \
  --delete \
  --cache-control "public,max-age=31536000,immutable"

aws s3 cp out/ s3://housemoneyportfolio.com/ \
  --recursive \
  --exclude "*" \
  --include "*.html" \
  --cache-control "no-cache,no-store,must-revalidate"
```

**Emergency (origin broken, DNS live):** Cloudflare dashboard → Security → Under Attack Mode → On. Blocks automated traffic while you fix the origin. Turn off after resolution.

## Security Posture

### S3 origin access: public website endpoint (v1)

The S3 bucket uses website hosting mode with a public-read bucket policy. All four public access block settings are `false`. This means:

- Direct requests to `housemoneyportfolio.com.s3-website.us-east-2.amazonaws.com` are publicly accessible, bypassing Cloudflare
- This is acceptable for static marketing HTML/CSS/JS — no user data, no secrets in the bucket
- Cloudflare fronts normal traffic for WAF, DDoS protection, Bot Fight Mode, and analytics

**Why not IP-restrict the bucket?** The S3 website endpoint is always public regardless of bucket policy. The v1 IP-allowlist approach (Phase 4) was dropped in Phase 5 because Cloudflare proxied connections to the S3 REST endpoint fail TLS under "Full (strict)" — Cloudflare sends the wrong SNI hostname. Fixing this requires Cloudflare Pro (Host Header Override). Not justified for v1 marketing content.

**Long-term migration path:** Cloudflare Worker with SigV4 fetch (tracked as OPS_003). The Worker authenticates to S3 as a scoped IAM user; the bucket returns to fully private. Appropriate when site has meaningful traffic and the architectural investment is justified.

### Deploy IAM user scope

`hmp-website-deploy` has exactly two permissions: `s3:PutObject` and `s3:DeleteObject` on `housemoneyportfolio.com/*`, plus `s3:ListBucket` on the bucket itself. If the GitHub Actions secret leaks, blast radius is limited to defacing the marketing site — no database, Lambda, or secrets access.

## Known Follow-ups

- **OPS_001**: CloudWatch alarm on Lambda errors + notification. Lambda failures currently visible only in logs — no proactive alerting.
- **OPS_002**: Scope hmp-terraform IAM permissions; rotate access keys.
- **OPS_003**: Migrate S3 origin to Cloudflare Worker with SigV4 fetch (restore private bucket).
- **OPS_004**: Cloudflare proxy for Lambda Function URL + rate limiting (10 req/min per IP).
