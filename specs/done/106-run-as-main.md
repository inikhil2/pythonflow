# 106: Run code as the main script
Files: public/pyodide-worker.js, scripts/pyRunner.ts
Severity: med

## Problem
Run and Check execute the learner's code in a fresh dict with no `__name__` set, so Python
fills in `builtins`. In real Python, the file you run has `__name__ == "__main__"`, and
`public/trace.py` already runs traced code with `{'__name__': '__main__'}`.

So `print(__name__)` prints `builtins` under Run but `__main__` under Step through. And the
standard ending below never calls `main()` under Run or Check:
```python
if __name__ == "__main__":
    main()
```
Week 4 teaches that ending, and CS50P uses it in every program from then on. Without this
fix, a correct program prints nothing.

`scripts/pyRunner.ts` copies the worker's run rules for the lesson checker, so it needs
the same line.

## Required change
1. **In `public/pyodide-worker.js`**, find this line:
```js
  const globals = pyodide.globals.get('dict')();
```
   and add these two lines straight after it, with the same two-space indent:
```js
  // Run code as a script, like python main.py and the tracer, so the __main__ guard works.
  globals.set('__name__', '__main__');
```
2. **In `scripts/pyRunner.ts`**, find this line:
```ts
  const globals = pyodide.globals.get('dict')()
```
   and add these two lines straight after it. They have the same text, without semicolons:
```ts
  // Run code as a script, like python main.py and the tracer, so the __main__ guard works.
  globals.set('__name__', '__main__')
```
Change nothing else.

## Acceptance gates
1. `grep -c "globals.set('__name__', '__main__')" public/pyodide-worker.js scripts/pyRunner.ts`
   shows 1 for each file.
2. `wc -c public/pyodide-worker.js scripts/pyRunner.ts` shows 2679 and 1748.
3. `node scripts/check-lessons.ts` prints `lessons ok: 19 lessons, 37 exercises`, and
   `npx nuxi typecheck` exits 0.
4. `git diff --stat` shows 2 insertions in each file and nothing else.
