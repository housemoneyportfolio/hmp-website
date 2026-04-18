# /lessons-learned — Capture a Rule from This Session

Add a "Never Do" rule or update project rules based on what went wrong or was learned.

## Instructions

1. **Identify the lesson** — What went wrong, was ambiguous, or should be avoided in the future?

2. **Determine the category** — Which section of CLAUDE.md does this belong to?
   - Agent Behavior
   - Code Quality
   - Scope Control
   - Content & SEO
   - Performance
   - Accessibility
   - Build & Tooling
   - Infrastructure
   - Brand

3. **Add the rule to CLAUDE.md**:
   - Find the appropriate "Never Do" section
   - Add a new bullet point starting with "Never..."
   - Keep it concise and actionable

4. **Update the rules table** in CLAUDE.md:
   - Add an entry to the "Rules Added Per Feature" table
   - Format: `| YYYY-MM-DD | Feature Name | Brief description of rule added |`

5. **Log it in `docs/knowledge-base/rules-changelog.md`**:
   - Add a row to the table with date, feature, and rule summary

## Rule Writing Guidelines

- Start with "Never" for consistency
- Be specific and actionable
- Include the "why" if not obvious
- Reference specific files/paths when relevant

## Examples

**Good rules:**
- Never use `<img>` directly — use `next/image` for automatic optimization and CLS prevention
- Never hardcode a color value in a component file — use CSS variables from `lib/tokens.ts`
- Never add `target="_blank"` links without `rel="noopener noreferrer"`

**Bad rules (too vague):**
- Never make mistakes
- Never write bad code
- Always be careful

## Quick Add Template

```markdown
### [Category]
- Never [specific action] — [reason if not obvious]
```

Table entry (CLAUDE.md + rules-changelog.md):
```markdown
| 2026-04-18 | Feature Name | Brief description |
```
