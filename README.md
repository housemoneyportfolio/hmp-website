# HMP Website

Public marketing site for House Money Portfolio — housemoneyportfolio.com

See [ops/specs/MKT_001_bootstrap_marketing_site.md](ops/specs/MKT_001_bootstrap_marketing_site.md) for the full build spec.

## Local dev

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Build static export
npm run build
# → out/ directory
```

## Deploy

Push to `main` — GitHub Actions handles build and S3 sync automatically.

## Rollback

Revert the commit and push. The deploy workflow runs again and syncs the previous build output.

## Waitlist leads

```bash
aws dynamodb scan --table-name hmp-website-waitlist
```

## Brand assets

Replace files in `public/brand/` or `public/founder/`, commit, push. No code changes needed.

## Workflow

This repo uses a spec-first development workflow. All features start as a written spec before any code is touched.

| Resource | Path |
|----------|------|
| Agent rules & invariants | [CLAUDE.md](CLAUDE.md) |
| Feature queue & backlog | [ops/specs/QUEUE.md](ops/specs/QUEUE.md) |
| Spec template | [ops/specs/_TEMPLATE.md](ops/specs/_TEMPLATE.md) |
| Spec number registry | [ops/specs/SPEC_RECONCILIATION.md](ops/specs/SPEC_RECONCILIATION.md) |
| Rules changelog | [docs/knowledge-base/rules-changelog.md](docs/knowledge-base/rules-changelog.md) |

**Starting a new feature:** claim a spec number from `SPEC_RECONCILIATION.md`, create a spec from `_TEMPLATE.md`, add it to `QUEUE.md`, then run `/preflight` in a Claude Code session.

## Requirements

- Node 20+
- npm 10+
- AWS CLI (for infra work)
- Terraform 1.5+ (for infra work)
