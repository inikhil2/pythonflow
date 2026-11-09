# 096: Stop the tutor blaming print's newline
Files: app/utils/tutorPrompt.ts, scripts/check-tutor-prompt.ts
Severity: med

## Problem
In the 095 browser check, two of three tutor replies to `print("hello")` blamed a newline
character. The real problem was the missing `, world`. `tutorMessages` sends the raw
output, so the model reads `my code printed "hello\n"`. The `\n` is just the line end that
`print` always adds, and the checker ignores trailing whitespace when comparing.

The principal engineer tested it against llama-server, three replies each. With `"hello\n"`,
2 of 3 replies blamed a newline. With `"hello"`, 0 of 3 did, and all three named the
missing comma and word.

## Required change
1. In `app/utils/tutorPrompt.ts`, add this comment line directly above the line
   `  for (const r of failed.slice(0, 2)) {`:
```ts
  // The checker ignores trailing whitespace, so the tutor must not see print's newline and blame it.
```
2. In `app/utils/tutorPrompt.ts`, replace this line:
```ts
      : `A test expected ${JSON.stringify(r.expected)} but my code printed ${JSON.stringify(r.actual)}.`)
```
   with:
```ts
      : `A test expected ${JSON.stringify((r.expected ?? '').trimEnd())} but my code printed ${JSON.stringify(r.actual.trimEnd())}.`)
```
3. In `scripts/check-tutor-prompt.ts`, change only the `actual` value in the `const wrong` line,
   from `actual: 'hello',` to `actual: 'hello\n',`. The full line becomes:
```ts
const wrong = { passed: false, expected: 'hello, world', actual: 'hello\n', error: null, timedOut: false }
```
   Change nothing else in either file.

## Acceptance gates
1. `node scripts/check-tutor-prompt.ts` prints `tutor prompt ok`.
2. `npx nuxi typecheck` exits 0.
3. File sizes match:
```sh
   wc -c app/utils/tutorPrompt.ts   # expect 1849
   wc -c scripts/check-tutor-prompt.ts   # expect 1573
```
4. `git diff --stat` shows 2 insertions and 1 deletion in `app/utils/tutorPrompt.ts`, and
   1 insertion and 1 deletion in `scripts/check-tutor-prompt.ts`.
5. `git status --short` shows only these two files as changed.
