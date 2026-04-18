# /investigate — Root Cause Investigation Mode

You are entering INVESTIGATION MODE. The rules change:

## Iron Law: No Fixes Without Root Cause

You are NOT allowed to modify any code to fix the problem until you have:
1. Stated a hypothesis for the root cause
2. Gathered evidence that supports or refutes the hypothesis
3. Confirmed the root cause with the operator

Fixing symptoms is a violation. If you catch yourself thinking "let me just try changing this to see if it helps" — STOP. That is not investigation, that is guessing.

## Step 1: Define the Problem

Ask the operator (or extract from context):

- **What is the symptom?** (What's happening that shouldn't be, or not happening that should be?)
- **When did it start?** (After a deploy? After a specific change? Intermittent?)
- **What is the expected behavior?**
- **What is the actual behavior?**

Write a one-sentence problem statement.

## Step 2: Scope Lock

Identify the module(s) under investigation based on the symptom.

**SCOPE LOCK ACTIVE:** For the duration of this investigation, you may only READ files outside the investigation scope. You may NOT MODIFY files outside the investigation scope without explicit operator approval.

Investigation scope:
```
Locked to: {file/directory path(s)}
Can READ: anything
Can MODIFY: only files within scope
```

Display this scope lock to the operator.

## Step 3: Gather Evidence

Before forming hypotheses, gather data:

1. **Read the relevant code** — trace the execution path from input to symptom
2. **Check build output** — `npm run build 2>&1 | tail -30`
3. **Check type errors** — `npx tsc --noEmit 2>&1`
4. **Check lint errors** — `npm run lint 2>&1`
5. **Check recent changes** — `git log --oneline -10 -- {files in scope}`
6. **Check CLAUDE.md** — search for Never Do rules referencing these files

Output what you found.

## Step 4: Hypothesize

State up to 3 hypotheses, ranked by likelihood. For each:

- **Hypothesis:** {what you think is wrong}
- **Evidence for:** {what supports this}
- **Evidence against:** {what contradicts this}
- **Test:** {how to confirm or refute — a specific command or code read}

Present to operator. Get approval to test the top hypothesis.

## Step 5: Test Hypotheses

Execute the test for the approved hypothesis. Report results.

- If confirmed → proceed to Step 6
- If refuted → move to next hypothesis
- If all 3 hypotheses refuted → STOP. Tell the operator:

  "I've exhausted my initial hypotheses. Here's what I've ruled out:
   1. {hypothesis} — refuted because {reason}
   2. {hypothesis} — refuted because {reason}
   3. {hypothesis} — refuted because {reason}

   I need more context or a different angle. Options:
   a) I can broaden the investigation scope (operator must approve new scope)
   b) I can gather more data from {specific source}"

Do NOT generate more hypotheses without operator input after 3 failures.

## Step 6: Propose Fix

Root cause confirmed. Now propose a fix:

1. **Root cause:** {one sentence}
2. **Fix:** {what code changes are needed}
3. **Files to modify:** {list — must be within scope lock unless operator approves expansion}
4. **Risk:** {what could go wrong with this fix}
5. **Regression test:** {a build/type check that would catch this class of bug}

Wait for operator approval before implementing the fix.

## Step 7: Implement and Verify

After approval:
1. Implement the fix
2. Run `npm run build && npm run lint && npx tsc --noEmit`
3. Verify the original symptom is resolved in the browser
4. Run `/lessons-learned` to capture what was learned

## Investigation Rules

- Never modify code to "see what happens" — that's experimentation, not investigation
- Never expand scope without operator approval
- Never fix more than the root cause — if you find other bugs during investigation, note them for a separate spec
- If the root cause is in a spec (wrong design, not wrong code), flag it to the operator before touching anything
