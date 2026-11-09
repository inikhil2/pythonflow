# 065: Fix the two type errors from noUncheckedIndexedAccess
Files: app/utils/compareOutput.ts, app/utils/errorHelp.ts
Severity: low

## Problem
`.nuxt/tsconfig.json` sets `noUncheckedIndexedAccess`, so `split(':')[0]` has type
`string | undefined`. Calling `.trim()` on it fails `npx nuxi typecheck` (TS2532). At run
time `split` always returns at least one item, so behaviour does not change.

Do this after shell step 064, which installs vue-tsc.

## Required change
1. In `app/utils/compareOutput.ts`, line 26, replace this line:
```ts
  if (failed.error) return failed.error.split(':')[0].trim()
```
with this line:
```ts
  if (failed.error) return (failed.error.split(':')[0] ?? '').trim()
```
2. In `app/utils/errorHelp.ts`, line 72, replace this line:
```ts
  return byName[error.split(':')[0].trim()] ?? null
```
with this line:
```ts
  return byName[(error.split(':')[0] ?? '').trim()] ?? null
```
Change nothing else in either file.

## Acceptance gates
1. `npx nuxi typecheck` exits 0 with no errors.
2. `git diff --stat` shows 2 files, 1 insertion and 1 deletion each.
3. `npm run generate` exits 0.
