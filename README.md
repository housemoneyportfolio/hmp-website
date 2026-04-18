# HMP Website

Public marketing site for House Money Portfolio — housemoneyportfolio.com

See [docs/specs/MKT_001_bootstrap_marketing_site.md](docs/specs/MKT_001_bootstrap_marketing_site.md) for the full build spec.

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

## Requirements

- Node 20+
- npm 10+
- AWS CLI (for infra work)
- Terraform 1.5+ (for infra work)
