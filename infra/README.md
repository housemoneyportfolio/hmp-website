# infra/ — Terraform for hmp-website

Provisions the AWS infrastructure for `housemoneyportfolio.com`.

## Resources

| Resource | Name | Purpose |
|---|---|---|
| S3 bucket | `hmp-website-prod` | Static site hosting (private; Cloudflare serves it) |
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

1. Add DNS CNAME or A record pointing `housemoneyportfolio.com` → S3 bucket. Enable Cloudflare proxy (orange cloud).
2. Enable WAF, Bot Fight Mode, and rate limiting on the Lambda Function URL.
3. **Add a Cloudflare Transform Rule or Page Rule** to rewrite directory-level paths to serve `index.html`:
   - Without this, S3 will return 403 on `/` and sub-paths because there is no S3 static website hosting configured (the bucket is private; Cloudflare handles routing).
4. Configure HTTPS-only, TLS 1.2+, HSTS.

## Maintenance

### Quarterly: Refresh Cloudflare IP ranges

The S3 bucket policy allows `GetObject` only from Cloudflare IP ranges. Cloudflare rotates these periodically.

To update:
1. Fetch current ranges: `https://www.cloudflare.com/ips-v4` and `https://www.cloudflare.com/ips-v6`
2. Update the `cloudflare_ipv4_ranges` and `cloudflare_ipv6_ranges` locals in `main.tf`
3. Run `terraform plan` — only the S3 bucket policy should change
4. Run `terraform apply`

## Security Posture

### S3 origin access: IP allowlist (v1)

`block_public_policy = false` is intentional. The S3 bucket policy grants `s3:GetObject` to `Principal: "*"` but gates it with an `aws:SourceIp` condition restricting reads to Cloudflare's published IPv4 and IPv6 ranges. This means:

- Direct requests to the S3 URL from non-Cloudflare IPs get 403 Forbidden
- Cloudflare fetches objects normally and caches/serves them to end users
- `BlockPublicAcls`, `IgnorePublicAcls`, and `RestrictPublicBuckets` remain enabled

**What this does NOT protect against:** if a Cloudflare IP is used as a proxy by someone bypassing Cloudflare, or if the IP list is stale after a Cloudflare range rotation. See Maintenance section for refresh procedure.

**Why not `block_public_policy = true`?** AWS classifies any policy with `Principal: "*"` as a "public" policy and blocks attachment when `BlockPublicPolicy` is on — even when the effective access is IP-restricted. Setting it to false is the only way to attach an IP-conditional policy. This is a known AWS behavior, not a misconfiguration.

**Long-term migration path:** Cloudflare Worker with SigV4 fetch (tracked as OPS_003). The Worker authenticates to S3 as a scoped IAM user and the bucket stays fully private with no bucket policy at all. Appropriate when the site has meaningful traffic and the architectural investment is justified.

## Known Follow-ups (not Phase 4 scope)

- **OPS_001**: Add CloudWatch alarm on Lambda errors + notification (email or Slack). Currently, Lambda failures are visible only in CloudWatch Logs — no proactive alerting.
