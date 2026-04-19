# Rules Changelog — Lessons Learned Per Feature

> Audit log of every rule added to CLAUDE.md, organized by date and feature.
> Each entry corresponds to a bullet point in the main CLAUDE.md Never Do sections.

---

## Rules Added Per Feature

| Date | Feature | Rule Added |
|------|---------|------------|
| 2026-04-18 | MKT_001 Bootstrap | Never hardcode color values in components — import from `lib/brand.ts` |
| 2026-04-18 | MKT_001 Bootstrap | Never use `<img>` directly — use `next/image` with `unoptimized: true` for static export |
| 2026-04-18 | MKT_001 Bootstrap | Never add `target="_blank"` without `rel="noopener noreferrer"` |
| 2026-04-18 | MKT_001 Bootstrap | Never use `opengraph-image.tsx` / `ImageResponse` — not supported in `output: 'export'`; use SVG + sharp rasterization |
| 2026-04-18 | MKT_001 Bootstrap | Never rename `next.config.mjs` to `.ts` — Next.js 14 does not support TypeScript config files |
| 2026-04-18 | MKT_001 Bootstrap | Never type Lucide icon props as `ComponentType<{ size: number; color: string }>` — use `ComponentType<LucideProps>` (size is `string | number`) |
| 2026-04-18 | MKT_001 Bootstrap | Never overwrite `public/brand/*` or `public/founder/*` assets without explicit operator approval — these are production brand assets |
| 2026-04-18 | MKT_002 Spec Workflow | Never assume ops/specs/ files don't exist — always check disk before creating; Claude Code harness may have seeded them |
| 2026-04-18 | MKT_002 Spec Workflow | Never start implementation before porting workflow infrastructure (CLAUDE.md, ops/specs/, slash commands) |
| 2026-04-18 | MKT_001 Phase 4 Terraform | Never use a generic S3 bucket name for Terraform state — suffix with account ID (`-897545367327`) to guarantee global uniqueness; confirmed via collision with stranger's `hmp-terraform-state` in `eu-central-1` |
| 2026-04-18 | MKT_001 Phase 4 Terraform | Never assume `aws s3api create-bucket` succeeded — always verify with `aws s3 ls | grep <name>` before `terraform init`; silent failures cause confusing 301/AccessDenied in Terraform |
| 2026-04-18 | MKT_001 Phase 4 Terraform | Never diagnose S3 `AccessDenied` as an IAM permissions problem without first checking `aws s3 ls` — if the bucket is absent from the listing, it's a name collision with another account's bucket, not a missing policy |
| 2026-04-18 | MKT_001 Phase 4 Terraform | Never treat a detailed operator kickoff prompt as a substitute for a spec — create the spec file in `ops/specs/` before or immediately after scaffolding infra files |
| 2026-04-18 | MKT_001 Phase 4 Terraform | Never expect AWS `BlockPublicPolicy` to permit `Principal:*` bucket policies even when gated by `aws:SourceIp` conditions — AWS evaluates the Principal field for the "public" label, not effective access after conditions. Set `block_public_policy = false` deliberately with a loud comment explaining why; keep the other three public access blocks on. |
| 2026-04-18 | MKT_001 Phase 4 Terraform | Never run `aws s3api create-bucket` without verifying the bucket appeared in your account via `aws s3 ls` immediately after — bucket names are globally unique; a silently-failed create leaves `terraform init` routing to a stranger's bucket in another region, producing confusing 301/403 AccessDenied errors. |
| 2026-04-18 | MKT_001 Phase 4 | Never use a `from` address whose domain isn't exactly the verified Resend sending domain — subdomains are verified separately from their apex; verifying `send.example.com` does NOT authorize sends from `@example.com`. Mismatch produces Lambda returns 200 (DDB write succeeded), notification silently dropped at Resend, visible only in CloudWatch logs as `Resend error 403 domain not verified`. |
