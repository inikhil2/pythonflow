# 010: run() hangs forever when Pyodide fails to load
Files: public/pyodide-worker.js, app/composables/usePython.ts
Severity: med

## Problem
Do this only after spec 009.
If the CDN is unreachable (learner offline), `importScripts` throws or
`loadPyodide` rejects inside the worker. The worker never posts `ready`, so
`whenReady` in `app/composables/usePython.ts` never resolves. `run()` then
never returns and `running` stays `true`; only Stop gets the page back. The
learner sees no message. `usePython.ts` sets no `w.onerror`, and the worker's
`pyodideReady.then(...)` has no rejection handler.

## Required change
1. In `public/pyodide-worker.js`, replace the line
   `pyodideReady.then(() => self.postMessage({ type: 'ready' }));`
   with exactly:
```js
pyodideReady.then(
  () => self.postMessage({ type: 'ready' }),
  () => self.postMessage({ type: 'load-error' }),
);
```
2. In `app/composables/usePython.ts`, directly below the line `const TIMEOUT_MS = 10_000`, add:
```ts
const LOAD_ERROR = 'Python could not start. Check your internet connection, then press Run again.'
```
3. In `app/composables/usePython.ts`, replace the whole `start` function with exactly:
```ts
function start() {
  ready.value = false
  const w = new Worker('/pyodide-worker.js')
  worker = w
  whenReady = new Promise((resolve) => {
    // A failed worker is dropped; the next run() starts a fresh one.
    const failed = () => {
      w.terminate()
      worker = null
      settle({ stdout: '', stderr: '', error: LOAD_ERROR, timedOut: false })
    }
    w.onerror = failed
    w.onmessage = (e: MessageEvent) => {
      if (e.data.type === 'ready') {
        ready.value = true
        resolve()
        return
      }
      if (e.data.type === 'load-error') {
        failed()
        return
      }
      settle({ stdout: e.data.stdout, stderr: e.data.stderr, error: e.data.error, timedOut: false })
    }
  })
}
```
Change nothing else.

## Acceptance gates
- `grep -c "type: 'load-error'" public/pyodide-worker.js` prints `1`
- `grep -c 'w.onerror = failed' app/composables/usePython.ts` prints `1`
- `grep -c 'LOAD_ERROR' app/composables/usePython.ts` prints `2`
- `node --check public/pyodide-worker.js` exits 0
- `npm run generate` exits 0
