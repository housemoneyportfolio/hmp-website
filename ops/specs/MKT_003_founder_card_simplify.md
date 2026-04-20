# MKT_003: Simplify founder card — drop corporate credentials, center vertically, sync bio to deck

> **Spec ID:** MKT_003
> **Priority:** P2 (cosmetic; not blocking)
> **Status:** COMPLETE — 2026-04-20 (pending push + production verification)
> **Triggered by:** Operator's fiancée flagged the corporate credential stack ("ENTERPRISE ARCHITECT / QGE / GGIT / FORMERLY / Senior Network Engineering Manager") on the founder card as buried-the-lead noise on a consumer fintech marketing site. Operator agrees.

---

## 1. Problem Statement

The founder card on the marketing site renders five lines of corporate-org credentials below the headshot:

```
Quentrell Green
FOUNDER & ARCHITECT

ENTERPRISE ARCHITECT
QGE / GGIT

FORMERLY
Senior Network
Engineering Manager
```

For a consumer-facing fintech marketing site, this reads more like a LinkedIn resumé than a founder pitch — the corporate acronyms (`QGE / GGIT`) mean nothing to the audience, and the `FORMERLY` tag points backward instead of anchoring the founder to the product. The credibility signal is real (~15 years of enterprise tech experience) but the framing buries it in noise.

The operator's chosen final state for the card:

```
Quentrell Green
FOUNDER
```

Two lines. Clean. Lets the bio on the right column do the credibility work.

## 2. Solution

Two file edits, no new files, no behavior change beyond presentation.

### 2.1 — `lib/content.ts`

Edit the `founder` export:

```ts
// before
export const founder = {
  eyebrow:      'THE FOUNDER',
  name:         'Quentrell Green',
  title:        'FOUNDER & ARCHITECT',
  credentials:  [
    { label: 'ENTERPRISE ARCHITECT', value: 'QGE / GGIT' },
    { label: 'FORMERLY',             value: 'Senior Network\nEngineering Manager' },
  ],
  // ...rest unchanged
}

// after
export const founder = {
  eyebrow:      'THE FOUNDER',
  name:         'Quentrell Green',
  title:        'FOUNDER',
  // credentials field removed
  // ...rest unchanged
}
```

Two changes:
- `title` shortened from `'FOUNDER & ARCHITECT'` to `'FOUNDER'`
- `credentials` array deleted entirely

### 2.2 — `components/FounderSection.tsx`

Two changes to the dark-card container (left column):

**a. Add vertical centering to the card.** The card currently uses `padding: '40px 32px'` and stacks children top-down. With credentials removed, the bottom of the card has empty space and the headshot drifts toward the top relative to the bio column on the right. Fix: add `display: flex; flex-direction: column; justifyContent: 'center'` to keep headshot + name + title vertically centered as the right-column bio dictates the row height.

**b. Remove the credentials render block** ([components/FounderSection.tsx:64-69](../../components/FounderSection.tsx#L64-L69)):

```tsx
{founder.credentials.map(c => (
  <div key={c.label} style={{ /* ... */ }}>
    <div style={{ fontWeight: 700, color: colors.bgWhite }}>{c.label}</div>
    <div>{c.value}</div>
  </div>
))}
```

Delete that whole block. Also drop the `marginBottom: 24` on the title `<div>` (line 60) since there are no credentials below it anymore — change to `marginBottom: 0` or just remove the property.

The dark card's existing structure (gold accent bar, headshot with gold ring, name, title) remains intact. Only the credentials list is removed and the layout becomes flex-centered.

### 2.3 — Bio copy sync to investor deck (added during execution)

The bio paragraphs in `lib/content.ts` `founder.bio` were rewritten to match the deck verbatim. Three changes from the previous copy:

- Para 1 opening: "I spent over a decade managing enterprise network infrastructure — building systems where" → "I spent nearly two decades building enterprise network infrastructure where," (note: comma after "where" preserved verbatim from deck)
- Para 1 mid: "The hard problems were never the routing protocols." → "The hard problems weren't the routing protocols."
- Para 3: "telecom-grade control planes" → "enterprise grade control planes" (no hyphen, per operator)

Para 2 ("Trading platforms have the same problems. Most ignore them.") unchanged.

### 2.4 — Mobile breakpoint

Existing `@media (max-width: 768px)` rule collapses the grid to a single column. With centered card content and no credentials, the mobile view becomes shorter — that's fine. No mobile-specific changes needed.

## 3. Files Changed

| File | Action | Description |
|------|--------|-------------|
| `lib/content.ts` | MODIFIED | `title: 'FOUNDER & ARCHITECT'` → `'FOUNDER'`; delete `credentials` array (3 lines removed) |
| `components/FounderSection.tsx` | MODIFIED | Delete credentials `.map()` block (6 lines); add `display: flex; flex-direction: column; justify-content: center;` to dark card div; drop `marginBottom: 24` on title div |
| `ops/specs/MKT_003_founder_card_simplify.md` | NEW | This spec |
| `ops/specs/QUEUE.md` | MODIFIED | Add MKT_003 to Active → move to Completed on ship |
| `ops/specs/SPEC_RECONCILIATION.md` | MODIFIED | Bump "Next available MKT" to MKT_004; add MKT_003 to Shipped Specs |

No type changes (the `credentials` field is structurally optional in TypeScript since it's just an inline object literal — but I'll verify with `npx tsc --noEmit` that no other code reads `founder.credentials`).

## 4. Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| AC1 | `lib/content.ts` `founder.title` is `'FOUNDER'` and `credentials` field is gone | `grep` after edit |
| AC2 | `components/FounderSection.tsx` no longer references `founder.credentials` | `grep -n "credentials" components/FounderSection.tsx` returns 0 lines |
| AC3 | `npx tsc --noEmit` passes (no other code depends on `founder.credentials`) | Run command, expect exit 0 |
| AC4 | `npm run build` produces clean static export to `out/` | Run command, expect exit 0 |
| AC5 | Local dev server (`npm run dev`) renders the founder section with headshot + "Quentrell Green" + "FOUNDER" centered vertically in the dark card | Browser visual check at `http://localhost:3000` |
| AC6 | Card height matches the natural height of the bio column (no large empty space below the title) | Same browser check |
| AC7 | Mobile view (≤768px) still collapses to single column without broken layout | Browser DevTools responsive mode |
| AC8 | After deploy, production site at `https://housemoneyportfolio.com` shows the simplified card | Browser check post-workflow-success |

## 5. Test Plan

```bash
cd /Users/quentrellgreen/Documents/hmp-website

# 1. Verify no other code depends on founder.credentials before editing
grep -rn "founder\.credentials\|founder\.title" --include="*.ts" --include="*.tsx" .

# 2. Make the edits

# 3. Type check
npx tsc --noEmit

# 4. Build
npm run build

# 5. Local visual check
npm run dev
# Open http://localhost:3000, scroll to founder section
# Verify: card centered, no credential rows, no large empty space

# 6. Mobile sanity (DevTools responsive mode @ 375px width)

# 7. Commit + push (workflow rebuilds + deploys)

# 8. Post-deploy verification
open https://housemoneyportfolio.com
# Scroll to founder section, confirm visual matches
```

## 6. Rollback Plan

```bash
# If the simplification looks wrong in production:
git revert <fix-commit-sha>
git push origin main
# Workflow rebuilds with the original card. Site is back to current state in ~3 minutes.
```

Low-risk rollback: pure presentation change, no data, no infrastructure.

## 7. Risks

- **Very low — TypeScript breakage if `founder.credentials` is referenced elsewhere.** Mitigation: AC3 (`tsc --noEmit`) catches it before commit. If anything fails, fix the reference.
- **Very low — visual regression on a different breakpoint.** Mitigation: AC5 + AC7 (desktop + mobile browser checks before deploy).
- **None — content/SEO/accessibility regressions.** The `headshotAlt` (`"Quentrell Green, Founder"`) is unchanged. No copy that's part of the page narrative is affected. The bio + headline on the right column are untouched.

## 8. Status

- [x] Create this spec file
- [x] Verify no other code reads `founder.credentials` — only consumer is `components/FounderSection.tsx`
- [x] Edit `lib/content.ts` (drop credentials, shorten title)
- [x] Edit `components/FounderSection.tsx` (remove map block, add flex centering, drop title marginBottom)
- [x] `npx tsc --noEmit` passes (AC3)
- [x] `npm run build` passes (AC4) — 10 static routes generated clean
- [x] Local browser check at desktop width (AC5, AC6) — operator confirmed
- [x] Local browser check at mobile width (AC7) — operator confirmed (combined check)
- [x] Update `ops/specs/QUEUE.md` (MKT_003 → Completed)
- [x] Update `ops/specs/SPEC_RECONCILIATION.md` (Next MKT → MKT_004; MKT_003 → Shipped)
- [ ] Commit: `MKT_003: simplify founder card — drop corporate credentials, center vertically`
- [ ] Operator pushes to origin
- [ ] Workflow deploys
- [ ] Production browser check (AC8)

---

## Critical Files

- [lib/content.ts:94-101](../../lib/content.ts#L94-L101) — the `founder` content object to edit
- [components/FounderSection.tsx:31-70](../../components/FounderSection.tsx#L31-L70) — the dark-card render block (centering + credential removal happen here)
- [components/FounderSection.tsx:97-101](../../components/FounderSection.tsx#L97-L101) — mobile media query (no change needed; verifying intact)
