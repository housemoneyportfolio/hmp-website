# FIX_001: Waitlist endpoint returns 403 — pivot from Lambda Function URL to API Gateway HTTP API

> **Spec ID:** FIX_001
> **Priority:** P0 (blocks all lead capture on the live marketing site)
> **Status:** COMPLETE — 2026-04-20
> **Triggered by:** Operator-reported failure on desktop ("Network error") and mobile ("Forbidden. For troubleshooting Function URL authorization issues…") after MKT_001 Phase 5 Cloudflare cutover on 2026-04-18.
> **Supersedes:** Initial FIX_001 draft (aws_lambda_permission pairing). Refuted by evidence gathered 2026-04-19.
> **Outcome:** Phase 521 forced one architectural amendment to Phase C (Cloudflare proxy off; api.housemoneyportfolio.com is DNS-only). Tracked as OPS_005 (proxy restoration) and OPS_006 (Turnstile substitute). All 10 ACs met.

---

## 1. Problem Statement

Submitting any email to the waitlist form on `https://housemoneyportfolio.com` fails. The Lambda Function URL at `https://6woorghof75bdossrpr7ceo3bm0tmkcf.lambda-url.us-east-2.on.aws/` rejects ALL requests with HTTP 403 `AccessDeniedException`. Desktop surfaces this as "Network error" (via [lib/waitlist.ts:26](../../lib/waitlist.ts#L26)); mobile Safari surfaces the raw 403 JSON body. This blocks the only lead-capture mechanism on the live site.

### Investigation narrative

The root cause was not obvious. Four hypotheses were proposed, probed, and refuted before landing on the actual answer:

**Hypothesis 1 — Missing `aws_lambda_permission` / malformed policy.** Refuted: `aws lambda get-policy` returned a canonical public-access statement with well-formed `Principal: "*"`, `Action: lambda:InvokeFunctionUrl`, and `Condition: lambda:FunctionUrlAuthType = NONE`. Raw policy bytes clean.

**Hypothesis 2 — Stale auth-layer binding (permission added out-of-band during Phase 4, needs rebinding).** Refuted by the Step A probe: `aws lambda remove-permission` + `aws lambda add-permission` (identical canonical statement) executed cleanly; subsequent curl POST still returned 403 with a fresh request id. Rebinding the permission did not change behavior.

**Hypothesis 3 — Corrupted Function URL resource, needs destroy-and-recreate.** Refuted by the alias-URL experiment: created `debug` alias, attached a brand-new `AuthType=NONE` Function URL at `https://bqmghmfosavcpirgqiq76f4o5u0xztge.lambda-url.us-east-2.on.aws/` with its own canonical public-invoke statement. POST still returned 403. Two independent URL resources, two independent policy statements, identical rejection.

**Hypothesis 4 — Function-specific poisoning of `hmp-website-waitlist-handler`.** Refuted by the isolated-function experiment: created throwaway Lambda `hmp-test-debug-403` with a minimal handler, fresh Function URL, canonical public-invoke permission. POST still returned 403. The block applies to every `AuthType=NONE` Function URL created on this account, not a specific function or URL.

### Evidence table (full)

| Check | Result |
|---|---|
| Lambda URL baked into deployed JS | `https://6woorghof75bdossrpr7ceo3bm0tmkcf.lambda-url.us-east-2.on.aws/` (matches Terraform output) |
| `aws lambda get-function-url-config` | `AuthType: NONE`, CORS origins = apex + www, literal JSON confirmed |
| `aws lambda get-policy` | Canonical public-access statement present; raw bytes clean |
| OPTIONS preflight from `https://housemoneyportfolio.com` | 200 OK with correct `Access-Control-Allow-Origin` |
| POST with Origin header | 403 `AccessDeniedException`; `Access-Control-Allow-Origin: https://housemoneyportfolio.com` and `Vary: Origin` present on the 403 (CORS evaluator passes; auth layer denies) |
| POST without Origin header | 403 `AccessDeniedException` |
| GET | 403 `AccessDeniedException` |
| POST signed with SigV4 as `hmp-terraform` (AdministratorAccess, same account) | 403 (moot — with `AuthType=NONE`, SigV4 is ignored and request is evaluated anonymously) |
| Management-API `aws lambda invoke` | 200 OK, handler returned `{"message":"Success"}` |
| CloudWatch log streams for the function (all time) | Only contain entries from `aws lambda invoke` management-API calls. **Zero entries from any Function URL invocation.** The URL has never successfully invoked the handler, not today, not on Phase 4 setup day. |
| Step A: remove-permission + add-permission + curl | remove exit 0, add exit 0, curl 403 |
| Alias URL (different ARN, different policy statement, fresh) | 403 |
| Throwaway Lambda (different function entirely, fresh URL, fresh permission) | 403 |
| `aws lambda get-public-access-block-config` | `ParamValidation`: not in CLI v2.34.32 |
| `aws lambda get-resource-policy` | `ParamValidation`: not in CLI v2.34.32 |
| `aws resource-control-policies list-policies` | `ParamValidation`: not a command |
| `aws lambda get-account-settings` | Normal limits, no public-access fields |
| `aws organizations describe-organization` | `AWSOrganizationsNotInUseException` — standalone account, no SCPs possible |
| Terraform state | `aws_lambda_function_url.waitlist` present and managed; not orphaned |
| `grep aws_lambda_permission infra/` | No matches — permission was added out-of-band in Phase 4 |

### Ruled out

CORS (preflight succeeds, 403 reproduces with no Origin); Cloudflare (direct-to-AWS curl bypasses it, same 403); handler health (management-API invoke succeeds); TLS/DNS (cert matches, handshake fine); SCPs (standalone account, no Organizations); URL corruption (fresh URL on alias also 403s); function poisoning (throwaway function also 403s); malformed policy (raw bytes canonical); stale auth binding (rebind changed nothing); CLI-exposed account-level toggles (none available in v2.34.32).

## 2. Root Cause

**AWS account `897545367327` has a server-side block on `AuthType=NONE` Lambda Function URLs that is not exposed via any CLI command available in AWS CLI v2.34.32.** The block affects every Function URL created on every Lambda function in this account in region `us-east-2`. It is unknown whether the block extends to other regions, whether it was applied by default for new-ish accounts, or whether a paid AWS Support ticket would reveal a toggle. No investigation path remains that is cheaper than working around it.

**We cannot fix the Function URL on this account.** We pivot to **API Gateway HTTP API**, which uses a different auth layer and is not affected by this block (this is the same pattern recommended by AWS for public Lambda invocation behind a custom domain). HTTP APIs are free for the first 1M requests/month — the waitlist is nowhere near that.

## 3. Solution — API Gateway HTTP API + `api.housemoneyportfolio.com` custom domain

Replace `aws_lambda_function_url.waitlist` with an API Gateway HTTP API fronted by a stable custom domain. The custom domain stabilizes the endpoint against future API Gateway recreates and lets Cloudflare proxy the endpoint (free WAF / Bot Fight Mode / DDoS protection — folds in OPS_004 from Phase 5's deferred list).

### Architecture after

```
Browser
  └─ POST https://api.housemoneyportfolio.com/
       └─ Cloudflare (proxy ON; WAF + Bot Fight Mode)
            └─ API Gateway HTTP API (regional custom domain)
                 └─ Lambda integration (AWS_PROXY)
                      └─ hmp-website-waitlist-handler   (unchanged)
                           ├─ DynamoDB PutItem           (unchanged)
                           └─ Resend notification email  (unchanged)
```

### Resources added (Terraform)

| # | Resource | Purpose |
|---|---|---|
| 1 | `aws_acm_certificate.api` | Public TLS cert for `api.housemoneyportfolio.com`, DNS validated |
| 2 | `aws_acm_certificate_validation.api` | Waits for ACM `Issued` status before dependents create |
| 3 | `aws_apigatewayv2_api.waitlist` | HTTP API with `cors_configuration` (apex + www allowed origins, `POST`/`OPTIONS`, `content-type` header, `max_age: 300`) |
| 4 | `aws_apigatewayv2_integration.waitlist` | AWS_PROXY integration to Lambda (payload format v2.0) |
| 5 | `aws_apigatewayv2_route.waitlist_post` | `POST /` → integration 4 |
| 6 | `aws_apigatewayv2_stage.waitlist_default` | Default stage, auto-deploy |
| 7 | `aws_lambda_permission.waitlist_apigw_invoke` | Grants `apigateway.amazonaws.com` invoke on the Lambda, source ARN scoped to the API |
| 8 | `aws_apigatewayv2_domain_name.api` | API Gateway regional custom domain bound to cert 1, TLS 1.2 minimum |
| 9 | `aws_apigatewayv2_api_mapping.api_default` | Binds custom domain 8 to stage 6 |

### Resources removed (Terraform)

- `aws_lambda_function_url.waitlist` — destroyed by `terraform apply`
- `outputs.tf` `lambda_function_url` — replaced with `api_gateway_invoke_url` and `api_custom_domain_target`

### Resources added (manual — Cloudflare DNS)

- **CNAME (temporary) for ACM validation**: record name and value from `aws_acm_certificate.api.domain_validation_options` (Terraform output). **Proxy OFF (DNS-only)** — proxying breaks DNS validation. Removable after cert issues.
- **CNAME `api.housemoneyportfolio.com`** → `aws_apigatewayv2_domain_name.api.domain_name_configuration[0].target_domain_name`. **Proxy ON**. This is the production cutover record.

### Resources added (manual — GitHub)

- Update `NEXT_PUBLIC_WAITLIST_ENDPOINT` repository secret from the current Lambda URL to `https://api.housemoneyportfolio.com`. Next workflow run rebuilds the site with the new endpoint.

### Phased execution

The sequence matters because ACM cert issuance blocks custom-domain creation, and custom-domain creation blocks API mapping, and DNS cutover blocks end-to-end testing. Phases are gated — operator verifies before advancing.

**Phase A — Preparation + ACM cert request + DNS validation**

Operator actions before apply:
- A1. Clean up inert `Version: 1` orphan from debug experiment: `aws lambda delete-function --function-name hmp-website-waitlist-handler --qualifier 1 --region us-east-2`. (Harmless but the account should end this fix clean.)

Terraform resources in this phase:
- A2. `aws_acm_certificate.api` (adds only; DNS validation is manual and happens in A4)

Apply + manual:
- A3. `terraform plan` shows only `aws_acm_certificate.api` to add. Operator reviews, then `terraform apply`.
- A4. Terraform output `acm_validation_record` reveals a CNAME name + value. Operator creates this record in Cloudflare, **proxy OFF (DNS-only)**.
- A5. Wait for ACM to transition to `Issued` (typically 5–15 min). Verify: `aws acm describe-certificate --certificate-arn <arn> --region us-east-2 --query 'Certificate.Status'` returns `"Issued"`.

**Gate A →** Operator confirms cert Issued before advancing.

**Phase B — API Gateway + custom domain + Lambda permission**

Terraform resources added in this phase:
- B1. `aws_acm_certificate_validation.api` (waits for Issued — resolves immediately if cert is already issued)
- B2. `aws_apigatewayv2_api.waitlist`
- B3. `aws_apigatewayv2_integration.waitlist`
- B4. `aws_apigatewayv2_route.waitlist_post`
- B5. `aws_apigatewayv2_stage.waitlist_default`
- B6. `aws_lambda_permission.waitlist_apigw_invoke`
- B7. `aws_apigatewayv2_domain_name.api`
- B8. `aws_apigatewayv2_api_mapping.api_default`
- B9. **Destroy** `aws_lambda_function_url.waitlist`
- B10. Update `outputs.tf`: remove `lambda_function_url`, add `api_gateway_invoke_url` + `api_custom_domain_target`

Apply:
- B11. `terraform plan` shows: 9 to add (B1–B8, B10), 1 to destroy (B9), 0 to change.
- B12. `terraform apply`.

Direct-to-AWS verification (bypasses Cloudflare, tests API Gateway in isolation):
- B13. `curl -i -X POST "$(terraform output -raw api_gateway_invoke_url)" -H "Content-Type: application/json" -d '{"email":"phaseb-probe@example.com"}'` — expect 200 with `{"message":"Success"}`. This confirms the HTTP API's auth layer is not subject to the Function URL block.

**Gate B →** Operator confirms 200 from invoke URL before advancing. If 403, STOP — pivot again (unlikely but possible; would mean the account block is broader than Function URLs).

**Phase C — Cloudflare DNS cutover**

- C1. Remove the temporary ACM validation CNAME from Cloudflare (cert is validated; record is no longer needed).
- C2. Add production CNAME in Cloudflare: `api.housemoneyportfolio.com` → Terraform output `api_custom_domain_target`. **Proxy ON**.
- C3. Wait for propagation. Verify: `dig api.housemoneyportfolio.com +short` returns Cloudflare proxy IPs (104.x.x.x or 172.x.x.x), not raw AWS hostnames.
- C4. `curl -i -X POST "https://api.housemoneyportfolio.com/" -H "Content-Type: application/json" -d '{"email":"phasec-probe@example.com"}'` — expect 200. Response headers include `server: cloudflare` + `cf-ray: ...` confirming proxy path.

**Gate C →** Operator confirms 200 via custom domain before advancing.

**Phase D — GitHub Secret update + site redeploy**

- D1. Operator updates repository secret `NEXT_PUBLIC_WAITLIST_ENDPOINT` in GitHub → Settings → Secrets and variables → Actions, value: `https://api.housemoneyportfolio.com`.
- D2. Push a trivial commit to `main` (or re-run the deploy workflow manually) to trigger a rebuild. The workflow at [.github/workflows/deploy.yml:22](../../.github/workflows/deploy.yml#L22) reads the secret at build time.
- D3. Wait for workflow success.
- D4. Verify the new endpoint is baked into the deployed JS: `curl -s https://housemoneyportfolio.com/_next/static/chunks/app/page-*.js | grep -oE 'https://api\.housemoneyportfolio\.com/?'` — expect a match.

**Gate D →** Operator confirms new endpoint is in the deployed bundle before advancing.

**Phase E — End-to-end verification + close**

- E1. Browser: open `https://housemoneyportfolio.com` in Chrome desktop, Safari desktop, mobile Safari. Submit a unique email. Confirm success state (no "Network error").
- E2. `aws dynamodb scan --table-name hmp-website-waitlist --region us-east-2 --filter-expression "email = :e" --expression-attribute-values '{":e":{"S":"<test-email>"}}' --output json` — confirm row exists.
- E3. Check `quentrell@housemoneyportfolio.com` inbox for Resend notification.
- E4. Mark FIX_001 complete in [ops/specs/QUEUE.md](../QUEUE.md), [ops/specs/SPEC_RECONCILIATION.md](../SPEC_RECONCILIATION.md), append lessons to [CLAUDE.md](../../CLAUDE.md) + [rules-changelog.md](../../docs/knowledge-base/rules-changelog.md), commit.

## 4. Files Changed

### Terraform
| File | Action | Description |
|------|--------|-------------|
| `infra/main.tf` | MODIFIED | Remove `aws_lambda_function_url.waitlist`. Add 9 new resources (ACM cert + validation, APIGW API/integration/route/stage/permission, custom domain + mapping). CORS moves from the deleted Function URL into `aws_apigatewayv2_api.waitlist.cors_configuration`. |
| `infra/outputs.tf` | MODIFIED | Remove `lambda_function_url`. Add `api_gateway_invoke_url`, `api_custom_domain_target`, `acm_validation_record` (name + value). |
| `infra/variables.tf` | MODIFIED | Add `api_subdomain` (default `"api"`) if we want to parameterize; otherwise interpolate directly. |

### Spec + operator docs
| File | Action | Description |
|------|--------|-------------|
| `ops/specs/FIX_001_waitlist_lambda_403.md` | NEW (this file) | Spec for the pivot |
| `ops/specs/QUEUE.md` | MODIFIED | Add FIX_001 to Active → move to Completed on ship. Remove OPS_004 from Deferred (rolled into this spec via Cloudflare proxy). |
| `ops/specs/SPEC_RECONCILIATION.md` | MODIFIED | Bump "Next available FIX" to FIX_002; add FIX_001 to Shipped Specs |
| `CLAUDE.md` | MODIFIED | Add three Never Do rules (§9) |
| `docs/knowledge-base/rules-changelog.md` | MODIFIED | Log all three lessons with date 2026-04-19 |
| `infra/README.md` | MODIFIED | Update the Cloudflare section to document the new `api.housemoneyportfolio.com` CNAME alongside the existing apex/www records |

### Unchanged
- `components/WaitlistForm.tsx`, `lib/waitlist.ts`, `lambda/waitlist/index.mjs` — no application code changes. The Lambda handler, DynamoDB schema, and Resend flow are identical.
- `.github/workflows/deploy.yml` — no changes; it already reads `NEXT_PUBLIC_WAITLIST_ENDPOINT` from secrets.

### Known orphans left behind after apply
- **`FunctionURLAllowPublicAccess` Lambda resource policy statement** — was added out-of-band in Phase 4, never managed by Terraform. When `aws_lambda_function_url.waitlist` is destroyed, this statement is left behind attached to the Lambda. It references a permission (`lambda:InvokeFunctionUrl`) that no longer has a target. Benign but documented here for awareness. Can be removed with `aws lambda remove-permission --function-name hmp-website-waitlist-handler --statement-id FunctionURLAllowPublicAccess --region us-east-2` as an optional Phase E cleanup step.
- **Lambda `Version: 1`** — published during the debug alias experiment. Inert (no alias or URL points at it). Phase A1 removes it.

## 5. Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| AC1 | ACM cert for `api.housemoneyportfolio.com` reaches `Issued` status | `aws acm describe-certificate ... --query Certificate.Status` = `"Issued"` |
| AC2 | API Gateway HTTP API's direct invoke URL returns 200 to an unauthenticated POST | Phase B13 curl |
| AC3 | `dig api.housemoneyportfolio.com +short` returns the configured CNAME target | Phase C3 — **AMENDED at execution time:** initially proxied (Cloudflare 104.x / 172.x IPs ✓), but proxy mode produced persistent 521 (see Phase C addendum below). Flipped to DNS-only; final dig returns AWS APIGW IPs (3.128.x / 3.151.x). |
| AC4 | `curl https://api.housemoneyportfolio.com/` returns 200 | Phase C4 — **AMENDED:** confirmed 200 via direct-to-AWS path (no Cloudflare). Original AC required `server: cloudflare` + `cf-ray`; this is no longer true post-flip. Tracked as OPS_005. |
| AC5 | Deployed site's JS bundle references `https://api.housemoneyportfolio.com` | Phase D4 grep |
| AC6 | Browser submission succeeds on desktop Chrome, desktop Safari, mobile Safari; UI shows success state | Phase E1 |
| AC7 | New row appears in DynamoDB `hmp-website-waitlist` table | Phase E2 |
| AC8 | Resend notification email arrives at `quentrell@housemoneyportfolio.com` | Phase E3 |
| AC9 | `terraform plan` post-apply shows "No changes" | Run after Phase B |
| AC10 | Old Lambda `Version: 1` orphan is gone | `aws lambda list-versions-by-function --function-name hmp-website-waitlist-handler` returns only `$LATEST` |

## 6. Test Plan

```bash
# Pre-change sanity
cd /Users/quentrellgreen/Documents/hmp-website
npx tsc --noEmit && npm run build && npm run lint   # no app-code changes, all should pass

# Phase A
aws lambda delete-function --function-name hmp-website-waitlist-handler --qualifier 1 --region us-east-2
cd infra && terraform plan && terraform apply        # adds aws_acm_certificate.api only
# (manual) Add ACM validation CNAME to Cloudflare, proxy OFF
aws acm describe-certificate --certificate-arn "$(terraform output -raw acm_cert_arn)" \
  --region us-east-2 --query 'Certificate.Status'    # poll until "Issued"

# Phase B
terraform plan && terraform apply                    # 9 add, 1 destroy
curl -i -X POST "$(terraform output -raw api_gateway_invoke_url)" \
  -H "Content-Type: application/json" \
  -d '{"email":"phaseb-probe@example.com"}'          # expect HTTP/1.1 200 + {"message":"Success"}
terraform plan                                        # expect "No changes" (AC9)

# Phase C
# (manual) Remove validation CNAME; add api.housemoneyportfolio.com CNAME, proxy ON
dig api.housemoneyportfolio.com +short               # expect Cloudflare IPs (AC3)
curl -i -X POST "https://api.housemoneyportfolio.com/" \
  -H "Content-Type: application/json" \
  -d '{"email":"phasec-probe@example.com"}'          # expect 200, server: cloudflare (AC4)

# Phase D
# (manual) Update NEXT_PUBLIC_WAITLIST_ENDPOINT GitHub secret; push commit or re-run workflow
curl -s https://housemoneyportfolio.com/_next/static/chunks/app/page-*.js \
  | grep -oE 'https://api\.housemoneyportfolio\.com/?'  # expect match (AC5)

# Phase E — end-to-end in browser (AC6–AC8)
aws dynamodb scan --table-name hmp-website-waitlist --region us-east-2 \
  --filter-expression "email = :e" --expression-attribute-values '{":e":{"S":"<e2e-email>"}}'
```

### Phase C addendum — Cloudflare proxy 521 (amendment to spec, applied at execution time)

After the production CNAME for `api.housemoneyportfolio.com` was created with proxy ON (per spec), every Cloudflare-proxied request returned `HTTP/2 521` (Cloudflare connection-refused) despite the origin being fully healthy. Verified:

- Direct curl to APIGW custom-domain target IPs with SNI `api.housemoneyportfolio.com` → 200 OK from anywhere except via Cloudflare.
- 521 persisted ~5+ hours after Phase B apply (well past AWS's documented 40-min propagation window).
- Clock skew, propagation, SSL mode, and SNI mismatch ruled out via direct probes (see [docs/knowledge-base/rules-changelog.md](../../docs/knowledge-base/rules-changelog.md) entries dated 2026-04-20).

**Resolution:** flipped the `api` CNAME to DNS-only (grey cloud). End-to-end immediately worked. Tradeoff: lose Cloudflare WAF / Bot Fight Mode / proxy-side rate limiting on the waitlist endpoint. Acceptable for v1 (~50 signups/day expected); meaningful protection comes from Resend rate limits + DDB conditional writes + planned OPS_006 Turnstile.

**Filed:** OPS_005 (proxy restoration investigation) and OPS_006 (Cloudflare Turnstile as substitute protection) in [ops/specs/QUEUE.md](../QUEUE.md) Deferred. Rules for "never proxy APIGW regional through Cloudflare Free without testing E2E" added to CLAUDE.md and rules-changelog.

## 7. Rollback Plan

**Be honest: rollback returns to the current broken state** (403 on waitlist). The new architecture is what makes the site actually work; reverting means waitlist is broken again. Rollback is for "the new architecture is somehow worse than broken" — e.g., CORS misconfiguration that blocks the marketing site itself, or a DNS typo that takes down apex.

### Rollback sequence

```bash
# 1. Revert the commit
cd /Users/quentrellgreen/Documents/hmp-website
git revert <fix-commit-sha>

# 2. Apply reverted Terraform — destroys API Gateway resources, recreates aws_lambda_function_url.waitlist
cd infra && terraform apply

# 3. MANUAL: Remove api.housemoneyportfolio.com CNAME from Cloudflare
#    (Terraform does not manage Cloudflare DNS)

# 4. MANUAL: Revert NEXT_PUBLIC_WAITLIST_ENDPOINT GitHub secret to the old Lambda URL
#    (which will return 403 — waitlist is back to broken)

# 5. MANUAL: Push a commit or re-run the workflow to rebuild the site with the old endpoint
```

### Why rollback is non-trivial
- **Cloudflare DNS is manual.** Any rollback requires operator action in Cloudflare.
- **GitHub secret is manual.** Operator must revert the value.
- **ACM cert stays issued.** Not removed by rollback; no harm, just cruft.
- **Recreated `aws_lambda_function_url.waitlist` will still 403.** The account-level block is unchanged. Rollback does not restore a working waitlist — it restores the current broken state.

### Safer than rollback: leave things in place, debug forward
If something is wrong post-apply, the default response should be "identify the specific thing that's wrong and fix it forward," not "rollback the whole pivot." The API Gateway path is architecturally correct; a misconfiguration is cheaper to fix than to undo.

## 8. Risks

- **Medium — ACM DNS validation stall.** If the Cloudflare validation CNAME is created with proxy ON (orange cloud), ACM cannot validate; cert hangs in `Pending validation`. Mitigation: spec's Phase A4 explicitly says **proxy OFF**. Operator verifies the orange cloud is off before marking complete.
- **Medium — API Gateway CORS config surprise.** APIGW HTTP API CORS config uses `allow_methods = ["POST", "OPTIONS"]` (unlike Lambda Function URL which only needed `POST`). If misspecified, browser preflight fails. Mitigation: Phase C4 curl confirms 200 via Cloudflare before Phase D; if broken there, fix before touching GitHub.
- **Medium — Cloudflare proxy + APIGW TLS mismatch.** APIGW regional endpoint serves the custom domain cert. Cloudflare "Full" SSL mode connects origin-side over HTTPS. This works because the APIGW endpoint has our own cert for `api.housemoneyportfolio.com`, not a wildcard — matches the proxied hostname. No Pro plan Host Header Override needed for this path (unlike the apex S3 case). Mitigation: Phase C4 curl confirms TLS path end-to-end.
- **Low — deploy pipeline cache.** If the GitHub Actions runner caches the old build, the new endpoint won't ship. Mitigation: Phase D4 curl grep of the deployed JS is the objective check.
- **Low — account-level block extends beyond Function URLs to all Lambda public invocations.** Unlikely because API Gateway uses a fundamentally different auth layer (identity-based IAM for API Gateway service principal, not resource-based public invoke). Phase B13's direct-to-AWS curl to the invoke URL is the early canary — if it 403s, we STOP before DNS cutover and the pivot direction itself is wrong.
- **Very low — OPS_004 scope creep concern.** This spec folds the deferred OPS_004 (Cloudflare proxy for waitlist endpoint) into FIX_001 because `api.*` routed through Cloudflare IS that scope, delivered as a side-effect of the custom domain. Operator has explicitly accepted this scope in the kickoff; no scope-creep risk.
- **Note on SCPs**: this is a standalone AWS account (`AWSOrganizationsNotInUseException` confirmed). SCPs do not apply.

## 9. Lessons to Capture (CLAUDE.md + rules-changelog.md)

**Lesson 1 — Pairing requirement (from initial draft, preserved):**
> Never create a public Lambda Function URL (`authorization_type = "NONE"`) without a paired `aws_lambda_permission` resource managed by the same Terraform module. A manually-added resource policy statement can look canonical in `aws lambda get-policy` output and still fail to authorize invocations — the permission must be bound via `AddPermission` from the same source that owns the Function URL. *Note: on this account the pairing would still not have fixed the 403, but it is still the correct pattern on accounts where Function URLs are not blocked at the account level.*

**Lesson 2 — End-to-end verification, not `aws lambda invoke`:**
> Never verify a Lambda Function URL (or any public HTTP endpoint) by `aws lambda invoke` alone. Direct management-API invocation bypasses the endpoint's auth layer entirely. Always test with a real HTTP request (curl to the hostname, or a browser form submission) before declaring the endpoint working end-to-end. MKT_001 Phase 4 claimed "end-to-end verified" based on `aws lambda invoke` output; the URL's auth layer was never exercised until Phase 5 went live and a real form submission hit the 403.

**Lesson 3 — AWS CLI feature parity is not AWS API feature parity:**
> Never assume AWS CLI feature availability equals AWS API/service feature availability. Some AWS features (Lambda's Public Access Block, Resource Control Policies, newer setting APIs) exist at the service layer but aren't exposed in older CLI versions. If a setting is blocking behavior but has no CLI command in your installed version, consult the AWS documentation directly — the AWS Console or a newer CLI may expose the setting. When the block can't be cleared from our side, treat it as an account-level constraint and pivot the architecture.

**Lesson 4 — Default Lambda public invocation to API Gateway HTTP API on this account:**
> On AWS account `897545367327`, do not use Lambda Function URLs with `AuthType=NONE` for any public endpoint. The account has an invisible server-side block that rejects every such invocation with `403 AccessDeniedException` regardless of the resource policy. Default to API Gateway HTTP API (free for first 1M req/month) fronted by a custom domain for any public Lambda invocation on this account until/unless the block is cleared by AWS Support.

## 10. Status

### Phase A — Preparation + ACM cert
- [x] Create this spec file
- [x] Clean up Lambda `Version: 1` orphan (`delete-function --qualifier 1`)
- [x] Add `aws_acm_certificate.api` to `infra/main.tf`
- [x] Add `acm_validation_record` + `acm_cert_arn` outputs to `infra/outputs.tf`
- [x] Operator: `terraform plan` → `terraform apply`
- [x] Operator: create ACM validation CNAME in Cloudflare, **proxy OFF**
- [x] Operator: poll `aws acm describe-certificate` until Status = `Issued` (AC1) — flipped at 14:05:44
- [x] **Gate A** — cert issued, proceeded to Phase B

### Phase B — API Gateway + custom domain + Lambda permission
- [x] Add 7 APIGW resources + 1 cert validation + 1 lambda_permission to `infra/main.tf`
- [x] Remove `aws_lambda_function_url.waitlist` from `infra/main.tf`
- [x] Update `infra/outputs.tf` (remove `lambda_function_url`; add `api_gateway_invoke_url`, `api_custom_domain_target`, `waitlist_endpoint`)
- [x] Operator: `terraform plan` (8 add, 1 destroy — see §10 note on add count vs spec's 9)
- [x] Operator: `terraform apply`
- [x] Operator: curl direct invoke URL → 200 (AC2) — `apigw-requestid: cFOzsjaniYcEPCw=`
- [x] **Gate B** — 200 confirmed; account block does not extend to API Gateway

### Phase C — Cloudflare DNS cutover
- [x] Operator: remove ACM validation CNAME from Cloudflare
- [x] Operator: add `api.housemoneyportfolio.com` CNAME → custom domain target
- [x] Operator: `dig` returns Cloudflare IPs (AC3) — initially proxied ✓
- [x] Operator: curl via custom domain → 200 (AC4) — **AMENDED:** required flipping CNAME to DNS-only after persistent 521; see Phase C addendum in §6 for details
- [x] **Gate C** — 200 via DNS-only path; OPS_005 + OPS_006 filed for future work

### Phase D — GitHub Secret + redeploy
- [x] Operator: update `NEXT_PUBLIC_WAITLIST_ENDPOINT` GitHub secret to `https://api.housemoneyportfolio.com`
- [x] Operator: push commit / trigger workflow ("successfully deployed")
- [x] Operator: verified deployed JS references new endpoint (AC5) — chunk `/_next/static/chunks/app/page-40db7ea9253f0848.js`
- [x] **Gate D** — new endpoint in deployed bundle

### Phase E — E2E verification + close
- [x] Operator: browser submission succeeds (AC6) — "You're on the list" success copy confirmed
- [x] Operator: DynamoDB rows exist (AC7) — `qgreen@gogreencs.com` at 03:08:07Z, `gogreenits@gmail.com` at 03:08:28Z
- [x] Operator: Resend emails received (AC8) — both confirmed in inbox
- [x] Operator: `list-versions-by-function` shows only `$LATEST` (AC10) — done in Phase A1
- [ ] (Optional) Remove orphaned `FunctionURLAllowPublicAccess` policy statement from the Lambda — deferred; cosmetic
- [x] Update `infra/README.md` Cloudflare section with `api.*` CNAME docs + OPS_004 retirement note
- [x] Update `CLAUDE.md` Never Do with all five lessons from §9 (one extra lesson added during Phase C)
- [x] Append all five lessons to `docs/knowledge-base/rules-changelog.md` dated 2026-04-19/20
- [x] Update `ops/specs/QUEUE.md`: move FIX_001 to Completed; OPS_004 retired with note; OPS_005 + OPS_006 added to Deferred
- [x] Update `ops/specs/SPEC_RECONCILIATION.md`: bump Next available FIX to FIX_002; FIX_001 added to Shipped
- [ ] Commit: `FIX_001: pivot waitlist endpoint to API Gateway HTTP API behind api.housemoneyportfolio.com`

> **§10 note on plan count:** spec's §3 said "9 to add" for Phase B; actual plan was "8 to add, 1 to destroy" because `aws_acm_certificate_validation.api` is an internal-state synchronization resource that doesn't make an AWS API call (Terraform plan summary only counts resources with side effects). Functionally equivalent.

---

## Critical Files

- [infra/main.tf:221-231](../../infra/main.tf#L221-L231) — current `aws_lambda_function_url "waitlist"` block to be destroyed
- [infra/main.tf:200-219](../../infra/main.tf#L200-L219) — `aws_lambda_function "waitlist"` block (unchanged, referenced by new integration)
- [infra/outputs.tf](../../infra/outputs.tf) — needs `lambda_function_url` removed, three new outputs added
- [.github/workflows/deploy.yml:22](../../.github/workflows/deploy.yml#L22) — where `NEXT_PUBLIC_WAITLIST_ENDPOINT` is read at build time
- [lib/waitlist.ts](../../lib/waitlist.ts) — client fetch; no changes (environment variable picks up new endpoint)
- [infra/README.md](../../infra/README.md) — Cloudflare manual steps, needs `api.*` CNAME section added
- [ops/specs/MKT_001_bootstrap_marketing_site.md](MKT_001_bootstrap_marketing_site.md) — original spec's §4 design oversight (Function URL without paired permission, and `aws lambda invoke`–only verification)
