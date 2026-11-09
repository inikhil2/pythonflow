# 110: Put back the TestCase type in pyRunner
Files: scripts/pyRunner.ts
Severity: low

## Problem
Spec 106 asked for two added lines in `scripts/pyRunner.ts` and said "Change nothing else".
The change also rewrote the `TestCase` type on line 5 into the union from
`app/composables/useChecker.ts`:
```ts
export type TestCase = { stdin?: string; stdout: string } | { stdin?: string; check: string }
```
`failure()` in the same file reads `test.check` and `test.stdout` on any test. With the union,
TypeScript rejects both reads, because neither property is on both members. The scripts still
run only because Node strips types without checking them. The file is now 1767 bytes, not the
1748 that spec 106 gated.

## Required change
In `scripts/pyRunner.ts`, replace line 5:
```ts
export type TestCase = { stdin?: string; stdout: string } | { stdin?: string; check: string }
```
with the original line:
```ts
export type TestCase = { stdin?: string; stdout?: string; check?: string }
```
Keep the two `__name__` lines from spec 106. Change nothing else.

## Acceptance gates
1. `grep -c "export type TestCase = { stdin?: string; stdout?: string; check?: string }" scripts/pyRunner.ts` prints 1.
2. `grep -c "globals.set('__name__', '__main__')" scripts/pyRunner.ts` prints 1.
3. `wc -c scripts/pyRunner.ts` shows 1748.
4. `git diff scripts/pyRunner.ts` shows only the two added `__name__` lines.
