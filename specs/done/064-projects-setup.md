# 064: Dev tools for Phase D and remove the projects placeholder (shell step, task D1)
Files: package.json, package-lock.json, app/pages/projects.vue
Severity: med

## Why a shell step
It installs packages and deletes a file, which Qwen cannot do reliably.

- `pyodide` and `yaml` let `scripts/check-projects.ts` (spec 066) run every project
  solution in Node with the same Pyodide version the app loads (0.29.5).
- `typescript` and `vue-tsc` let `npx nuxi typecheck` run. It is a new gate for Phase D. Today
  it finds two errors in existing code, fixed by spec 065. typescript 6 breaks vue-tsc 3.1,
  so it is pinned to 5.9.3.
- `app/pages/projects.vue` is the "Nothing here yet" placeholder. If it stays,
  it becomes the parent route of `app/pages/projects/index.vue` (spec 068) and hides it.
  Between this step and spec 068, `/projects` is a 404. That is expected.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`:

```sh
git rm app/pages/projects.vue
npm install -D pyodide@0.29.5 yaml@2.9.1 typescript@5.9.3 vue-tsc@3.1.5
npx nuxi typecheck
```

## Acceptance gates
1. `git status --short` shows only `package.json`, `package-lock.json` and
   `D  app/pages/projects.vue`.
2. `package.json` devDependencies lists pyodide, yaml, typescript and vue-tsc.
3. `npx nuxi typecheck` reports exactly 2 errors, both TS2532:
   `app/utils/compareOutput.ts(26,28)` and `app/utils/errorHelp.ts(72,17)`.
4. Commit as "Shell 064: Phase D dev tools, remove projects placeholder".
