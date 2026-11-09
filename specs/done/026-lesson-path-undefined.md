# 026: Declare `path` in the lesson page (generate fails with 500)
Files: app/pages/learn/[...slug].vue
Severity: high

## Problem
`npm run generate` fails: prerendering `/learn/week0-functions/01-hello` returns 500.
The dev server shows the real error:
```
path is not defined
  at ComputedRefImpl.fn (app/pages/learn/[...slug].vue:30:59)
```
Spec 023 told the page to declare `const path = lesson.value.path`, but that line never
landed. Lines 22, 28 and 30 use `path`, so the `completed` computed throws during
server render. `exerciseIds` is not the cause.

## Required change
In `app/pages/learn/[...slug].vue`, replace exactly
```ts
const { progress, openLesson, completeLesson } = useProgress()
```
with exactly
```ts
// Progress is keyed by the content path, which does not change with trailing slashes.
const path = lesson.value.path
const { progress, openLesson, completeLesson } = useProgress()
```
Change nothing else in this file.

## Acceptance gates
- `grep -c "const path = lesson.value.path" 'app/pages/learn/[...slug].vue'` prints 1.
- `npm run generate` exits 0.
- Browser (`/learn/week0-functions/01-hello`): the page loads with no 500, and the
  header shows no "Completed" with fresh localStorage.
