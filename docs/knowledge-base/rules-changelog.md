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
