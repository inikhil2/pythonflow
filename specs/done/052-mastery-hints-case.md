# 052: Test that a concept passed only with hints is not mastered
Files: scripts/check-mastery.ts
Severity: low

## Problem
The mastery rule says a concept is mastered when every exercise tagged with it has passed,
**at least one of them without hints**. `scripts/check-mastery.ts` (spec 046) does not test
the case where every exercise passed but each one used hints. So changing
`hintsUsed === 0` to `hintsUsed === 1` in `conceptStatus` (`app/utils/mastery.ts`) still
prints `mastery ok`: the hints half of the rule is unguarded. Spec 046's own mutation gate
named this change and should have failed.

## Required change
In `scripts/check-mastery.ts`, find this line (line 77):
```ts
assert.equal(conceptStatus(strong, 'variables', lessons), 'in-progress')
```
Directly after it, insert exactly these lines. Change no other lines and add no import lines.
```ts
// Every tagged exercise passed, but each one used hints: not mastered yet.
const leaned = {
  lessons: {},
  exercises: { e1: { passedAt: T2, hintsUsed: 1 }, e2: { passedAt: T2, hintsUsed: 2 }, e3: { passedAt: T2, hintsUsed: 1 } },
  attempts: [pass('e1'), pass('e2'), pass('e3')],
}
assert.equal(conceptStatus(leaned, 'print', lessons), 'in-progress')
```

## Acceptance gates
- `git diff --stat HEAD` lists only `scripts/check-mastery.ts`, with `7 insertions(+)` and no deletions.
- `node scripts/check-mastery.ts` prints `mastery ok`.
- Changing `hintsUsed === 0` to `hintsUsed === 1` in `app/utils/mastery.ts` makes
  `node scripts/check-mastery.ts` exit non-zero. Undo it afterwards, and check that
  `git diff --stat HEAD -- app/utils/mastery.ts` prints nothing.
