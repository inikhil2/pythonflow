# 111: Load the packages that code imports
Files: public/pyodide-worker.js, scripts/pyRunner.ts
Severity: med

## Problem
Week 5 teaches pytest, and its exercises use `import pytest` and `pytest.raises`. Pyodide ships
pytest 8.3.5 in its package list, but it loads a package only when asked. Right now nothing
asks, so `import pytest` stops with `ModuleNotFoundError` under Run, Check and Step through.
The same happens in the lesson checker.

The principal engineer probed it: after `loadPackagesFromImports`, `pytest.raises` and
`pytest.main` both work, and the pytest wheels load in about half a second. The wheels come from
the jsdelivr CDN, which the worker already loads Pyodide from. Code that imports nothing from
Pyodide's package list loads nothing, so other lessons don't change.

## Required change
1. **In `public/pyodide-worker.js`, in `run`**, find these two lines:
```js
  try {
    await pyodide.runPythonAsync(code, { globals, filename: 'main.py' });
```
   and add two lines between them, so the block reads:
```js
  try {
    // Fetch the Pyodide packages the code imports, such as pytest, before it runs.
    await pyodide.loadPackagesFromImports(code);
    await pyodide.runPythonAsync(code, { globals, filename: 'main.py' });
```
2. **In `public/pyodide-worker.js`, in `trace`**, find this line:
```js
    return { type: 'trace', ...JSON.parse(tracer(code, stdin)) };
```
   and add one line straight before it, with the same four-space indent:
```js
    await pyodide.loadPackagesFromImports(code);
```
3. **In `scripts/pyRunner.ts`, in `run`**, find these two lines:
```ts
  try {
    await pyodide.runPythonAsync(code, { globals, filename: 'main.py' })
```
   and add two lines between them. They are the same as step 1, without semicolons:
```ts
  try {
    // Fetch the Pyodide packages the code imports, such as pytest, before it runs.
    await pyodide.loadPackagesFromImports(code)
    await pyodide.runPythonAsync(code, { globals, filename: 'main.py' })
```
Change nothing else. In particular, leave the `TestCase` type in `scripts/pyRunner.ts` as it is.

## Acceptance gates
1. `grep -c "loadPackagesFromImports(code)" public/pyodide-worker.js scripts/pyRunner.ts`
   shows 2 for the worker and 1 for pyRunner.
2. `wc -c public/pyodide-worker.js scripts/pyRunner.ts` shows 2861 and 1880.
3. `git diff --stat` shows 3 insertions in the worker, 2 in pyRunner, and no deletions.
4. `node scripts/check-lessons.ts` prints `lessons ok: 24 lessons, 46 exercises`, and
   `npx nuxi typecheck` exits 0.
