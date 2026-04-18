# /commit — Commit Changes

Create a well-structured git commit for all staged or unstaged changes.

## Pre-Commit Gate

Before committing, verify that `/review` passed in this session:
- `npm run build` — PASS
- `npm run lint` — PASS
- `npx tsc --noEmit` — PASS
- `ops/specs/QUEUE.md` — spec moved to Completed

If any of these are not confirmed, state: "Cannot commit — `/review` has not passed. Run `/review` first."

## Instructions

1. Run `git status` to see what files have been modified, added, or deleted
2. Run `git diff --stat HEAD` to understand the scope of changes
3. Run `git log --oneline -5` to understand the recent commit message style
4. Stage relevant changes — use explicit paths, not `git add .` or `git add -A` when changes from multiple specs are in the working tree
5. Write a commit message following this format:

```
<type>: <short summary> (<SPEC_ID>)

<optional body with bullet points>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

## Commit Types
- `feat`: New feature or page
- `fix`: Bug fix
- `refactor`: Code refactoring
- `content`: Copy, content, or design changes
- `docs`: Documentation only
- `chore`: Maintenance tasks (deps, config)
- `style`: Formatting, no logic change
- `perf`: Performance improvement

## Rules
- Keep the summary line under 72 characters
- Use imperative mood ("add" not "added")
- Include the spec ID in parentheses: `feat: add hero section (MKT_001)`
- Always include the Co-Authored-By line
- Never use `git add .` or `git add -A` when the working tree has changes from multiple specs

## Example

```bash
git add app/page.tsx app/components/Hero.tsx lib/tokens.ts
git commit -m "$(cat <<'EOF'
feat: add hero section with waitlist CTA (MKT_001)

- Emerald/gold palette applied via CSS tokens
- Waitlist form wired to Resend API
- LCP < 2.5s verified in Lighthouse

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

After committing:

1. Show the commit hash and message
2. Run `git status` to confirm clean state
3. Remind the operator to push when ready: `git push origin <branch>`
