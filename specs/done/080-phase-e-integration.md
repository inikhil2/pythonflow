# 080: Phase E integration check and commit (shell step, task T19)
Files: none
Severity: med

## Why a shell step
It runs the full build and the browser click-through, then commits. Do it after specs 074
to 079 all pass. The proposal asks for light and dark. Light is in the backlog, so this
run is dark only.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`:

```sh
npx nuxi typecheck
node scripts/check-projects.ts
node scripts/check-project-status.ts
npm run generate
git status --short
```

## Acceptance gates
1. `npx nuxi typecheck` exits 0.
2. `node scripts/check-projects.ts` prints `projects ok: 5 projects, 22 milestones`.
3. `node scripts/check-project-status.ts` prints `project status ok`.
4. `npm run generate` exits 0, and its log lists `/playground`, `/settings` and `/about`.
5. `git status --short` lists only the files from specs 074 to 079.
6. Browser at 1440, 834 and 390, dark theme. Go Today, then Learn, then a lesson. Press Run,
   then Check answer with the right code. Then open Progress: the exercise counts as passed.
   Also open Playground, Settings, About and `/nope`. No console errors on any page, and no
   page scrolls sideways.
7. Commit as "Phase E: workbench split, playground, settings, error and about pages".
