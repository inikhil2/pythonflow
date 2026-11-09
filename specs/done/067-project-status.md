# 067: projectStatus util and its check script (task D1)
Files: app/utils/projectStatus.ts, scripts/check-project-status.ts
Severity: med

## Problem
The projects gallery and project page need "N/M milestones" and a status chip. A project's
milestones are ordinary exercises with ids like `calculator-1`, so their progress is already
stored in `progress.exercises`. These two functions read it:
- `milestonesPassed` counts the milestones with `passedAt`.
- `projectStatus` returns `completed` when every milestone has passed. It returns
  `in-progress` when any milestone has an exercise entry (saved code, a hint or an
  attempt), and `not-started` otherwise.
It reuses the `Status` type from `app/utils/lessonStatus.ts`, so `StatusChip` shows it
unchanged.

## Required change
1. **Create `app/utils/projectStatus.ts`** with exactly this content.
```ts
import type { Status } from '~/utils/lessonStatus'
import type { Progress } from '~/utils/progress'

// Only the exercises map is read, so readonly progress from useProgress() fits.
type Exercises = Pick<Progress, 'exercises'>

// Milestones count as passed only from stored check results.
export function milestonesPassed(p: Exercises, ids: readonly string[]): number {
  return ids.filter((id) => p.exercises[id]?.passedAt).length
}

// A project starts once any milestone has saved code, a hint or an attempt, and completes when all pass.
export function projectStatus(p: Exercises, ids: readonly string[]): Status {
  if (ids.length > 0 && milestonesPassed(p, ids) === ids.length) return 'completed'
  return ids.some((id) => p.exercises[id]) ? 'in-progress' : 'not-started'
}
```
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components.

2. **Create `scripts/check-project-status.ts`** with exactly this content.
```ts
import assert from 'node:assert/strict'
import { milestonesPassed, projectStatus } from '../app/utils/projectStatus.ts'

type Exercises = Record<string, { code: string; passedAt?: string; hintsUsed: number }>
const p = (exercises: Exercises) => ({ exercises })

const IDS = ['calculator-1', 'calculator-2']
const T1 = '2026-10-01T10:00:00.000Z'
const passed = { code: 'print(1)', passedAt: T1, hintsUsed: 0 }

assert.equal(milestonesPassed(p({}), IDS), 0)
assert.equal(milestonesPassed(p({ 'calculator-1': passed }), IDS), 1)
// Saved code without a pass is not a passed milestone.
assert.equal(milestonesPassed(p({ 'calculator-1': { code: 'x', hintsUsed: 1 } }), IDS), 0)
// Passes in other projects or lessons do not count.
assert.equal(milestonesPassed(p({ 'w0-l1-ex1': passed }), IDS), 0)

assert.equal(projectStatus(p({}), IDS), 'not-started')
assert.equal(projectStatus(p({ 'w0-l1-ex1': passed }), IDS), 'not-started')
assert.equal(projectStatus(p({ 'calculator-2': { code: 'x', hintsUsed: 0 } }), IDS), 'in-progress')
assert.equal(projectStatus(p({ 'calculator-1': passed }), IDS), 'in-progress')
assert.equal(projectStatus(p({ 'calculator-1': passed, 'calculator-2': passed }), IDS), 'completed')
assert.equal(projectStatus(p({}), []), 'not-started')

console.log('project status ok')
```

## Acceptance gates
1. Sizes:
   wc -c "app/utils/projectStatus.ts"   # expect 781
   wc -c "scripts/check-project-status.ts"   # expect 1293
2. `node scripts/check-project-status.ts` prints `project status ok`.
3. `grep -c "^import" app/utils/projectStatus.ts` prints 2.
4. `npx nuxi typecheck` exits 0.
5. `git status --short` shows only these two new files.
