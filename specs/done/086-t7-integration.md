# 086: T7 integration check and commit (shell step)
Files: none
Severity: med

## Why a shell step
It runs the build and the browser checks for the tutor box, then commits. Do it after
specs 082 to 085 all pass. llama-server must be running on port 8080 with no aider run in
progress, so the tutor's request does not queue behind a long aider reply.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`:

```sh
npx nuxi typecheck
node scripts/check-tutor-prompt.ts
node scripts/check-lessons.ts
node scripts/check-projects.ts
npm run generate
git status --short
```

## Acceptance gates
1. `npx nuxi typecheck` exits 0.
2. `node scripts/check-tutor-prompt.ts` prints `tutor prompt ok`.
3. `node scripts/check-lessons.ts` prints `lessons ok: 1 lessons, 1 exercises`.
4. `node scripts/check-projects.ts` prints `projects ok: 5 projects, 22 milestones`.
5. `npm run generate` exits 0.
6. Browser, dark theme, wide and phone widths, on `/learn/week0-functions/01-hello`. Type
   `print(hello, world)` and press Check answer, then open "Ask the tutor" and ask "Why does
   this fail?".
   - The button reads "Asking…" while waiting.
   - An answer appears within 30 seconds. It points at the missing quotes and does not
     give the whole corrected program.
   - The box sits under the hints, in the left column when wide.
7. Offline check, without stopping llama-server. In the console run:
   `const f = window.fetch; window.fetch = (u, o) => String(u).includes(':8080') ? Promise.reject(new TypeError('Failed to fetch')) : f(u, o)`.
   Then ask again. The offline message appears, Run and Check answer still work, and
   there is no uncaught error in the console. Reload to undo the patch.
8. Keyboard: Tab to "Ask the tutor", open it with Enter, then Tab to the field and the
   Ask button. Focus is visible at each step.
9. Commit as "T7: Ask the tutor, and a lesson checker".
