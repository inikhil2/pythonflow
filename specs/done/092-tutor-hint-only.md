# 092: Stop the tutor writing the fixed line
Files: app/utils/tutorPrompt.ts, scripts/check-tutor-prompt.ts
Severity: med

## Problem
In the 086 browser check, the live tutor replied with the fixed line `print("hello, world")`,
which gives away the exercise. The system prompt already says "Never write the full solution
or a corrected program", but the local 9B model does not keep that rule reliably.

The principal engineer tested this against llama-server, three replies per variant:
- The current prompt wrote corrected code in 1 of 3 replies.
- A stricter system prompt wrote it in 2 of 3.
- The current system prompt, plus one closing line in the learner's own message asking for a
  hint in words, wrote it in 0 of 6 replies across the hello and swap exercises.

The fix adds that closing line to the user message.

## Required change
1. In `app/utils/tutorPrompt.ts`, directly after the line `].join(' ')` that ends
   `TUTOR_SYSTEM`, add one blank line and then exactly these two lines:
```ts
// The local model keeps this rule better when the learner asks for it than when the system prompt does.
const HINT_ONLY = 'Please give me a hint in words, without writing any code I could paste. I want to find the fix myself.'
```
   Keep the existing blank line before the `// The exercise, the learner's code` comment.
2. In `app/utils/tutorPrompt.ts`, replace this line:
```ts
  parts.push(`My question: ${question.trim() || 'What should I try next?'}`)
```
   with:
```ts
  parts.push(`My question: ${question.trim() || 'What should I try next?'}`, HINT_ONLY)
```
   Change nothing else in the file. `TUTOR_SYSTEM` stays exactly as it is.
3. In `scripts/check-tutor-prompt.ts`, add this line directly above `const pass =`:
```ts
const HINT = 'Please give me a hint in words, without writing any code I could paste. I want to find the fix myself.'
```
4. In `scripts/check-tutor-prompt.ts`, in the first `assert.equal(user.content, [...])`, add
   the line `  HINT,` directly after `  'My question: Why?',`.
5. In `scripts/check-tutor-prompt.ts`, replace this line:
```ts
assert.equal(fresh, 'Exercise: Print hi.\n\nMy code:\n(empty)\n\nMy question: What should I try next?')
```
   with:
```ts
assert.equal(fresh, `Exercise: Print hi.\n\nMy code:\n(empty)\n\nMy question: What should I try next?\n\n${HINT}`)
```

## Acceptance gates
1. `node scripts/check-tutor-prompt.ts` prints `tutor prompt ok`.
2. `npx nuxi typecheck` exits 0.
3. File sizes match:
```sh
   wc -c app/utils/tutorPrompt.ts   # expect 1719
   wc -c scripts/check-tutor-prompt.ts   # expect 1570
```
4. `git diff --stat` shows 4 insertions and 1 deletion in `app/utils/tutorPrompt.ts`, and
   3 insertions and 1 deletion in `scripts/check-tutor-prompt.ts`.
5. `git status --short` shows only these two files as changed.
