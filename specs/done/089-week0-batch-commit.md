# 089: Week 0 lessons 02 to 05 check and commit (shell step)
Files: none
Severity: med

## Why a shell step
It builds and clicks through the four new lessons, then commits them. Do it after specs
087 and 088 pass and the principal engineer has read both batches.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`:

```sh
node scripts/check-lessons.ts
npm run generate
git status --short
```

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 5 lessons, 9 exercises`.
2. `npm run generate` exits 0, and its log lists `/learn/week0-functions/02-variables`,
   `03-input`, `04-strings` and `05-f-strings`.
3. Browser, dark theme, wide and phone widths:
   - Learn lists week 0 lessons 1 to 5 in order.
   - Each new lesson renders with no raw `::` text and has a trace that steps.
   - Previous and Next walk 01 to 05.
   - Pasting each solution into its exercise and pressing Check answer passes, and Progress
     counts it.
   - No console errors, and no page scrolls sideways.
4. Commit as "Week 0: variables, input, strings and f-strings lessons".
