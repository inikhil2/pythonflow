# 003: Fix the Pyodide runner: invalid syntax, lost handlers, stuck running state
Files: app/composables/usePython.ts, public/pyodide-worker.js
Severity: high

## Problem
`app/composables/usePython.ts`:
1. Lines 18, 33, 57: `worker?.onmessage = ...`. Optional chaining on the left of
   `=` is a syntax error. The file does not compile.
2. Each `run()` replaces `worker.onmessage`, so the `ready` handler is lost and
   `ready` never becomes `true` after the first run.
3. `ready` and `running` are created per call of `usePython()`, but the worker is
   shared. Two components disagree about state.
4. On timeout and on `stop()`, `runningState` is never set back to `false`, so
   every later `run()` returns "Already running." forever.
5. The 10 second timeout starts before Pyodide has loaded, so a slow first
   download is reported as an infinite loop.
6. `pendingResolve: ((value: any) => void)` uses `any`. `let running = false` is unused.

`public/pyodide-worker.js`:
7. A `run` message that arrives before `init` finishes uses `pyodide === null` and crashes.
8. Pyodide puts the Python traceback in the thrown error's `message`, not in
   stderr, so `err.join('\n')` is empty and the error line is lost.
9. `pendingResolve` is unused. Pyodide is pinned to `v0.26.4`; use `v0.29.5`
   (same API, current maintenance release).

## Required change
1. Replace the whole file `public/pyodide-worker.js` with exactly:

```js
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/';
importScripts(PYODIDE_URL + 'pyodide.js');

// Start loading at once; every run waits for this.
const pyodideReady = loadPyodide({ indexURL: PYODIDE_URL });
pyodideReady.then(() => self.postMessage({ type: 'ready' }));

self.onmessage = async (e) => {
  const { code, stdin } = e.data;
  const pyodide = await pyodideReady;
  const out = [];
  const err = [];
  const lines = stdin ? stdin.split('\n') : [];

  pyodide.setStdout({ batched: (s) => out.push(s) });
  pyodide.setStderr({ batched: (s) => err.push(s) });
  // Returning undefined means end of input.
  pyodide.setStdin({ stdin: () => lines.shift() });

  let error = null;
  try {
    await pyodide.runPythonAsync(code, { globals: pyodide.globals.get('dict')() });
  } catch (e) {
    const traceback = String(e.message ?? e).trimEnd();
    err.push(traceback);
    error = traceback.split('\n').pop();
  }
  self.postMessage({ type: 'result', stdout: out.join('\n'), stderr: err.join('\n'), error });
};
```

2. Replace the whole file `app/composables/usePython.ts` with exactly:

```ts
import { ref } from 'vue'

export interface RunResult {
  stdout: string
  stderr: string
  error: string | null
  timedOut: boolean
}

const TIMEOUT_MS = 10_000

// One worker and one state, shared by every component on the page.
const ready = ref(false)
const running = ref(false)
let worker: Worker | null = null
let whenReady: Promise<void> = Promise.resolve()
let finish: ((result: RunResult) => void) | null = null

function settle(result: RunResult) {
  running.value = false
  finish?.(result)
  finish = null
}

function start() {
  ready.value = false
  const w = new Worker('/pyodide-worker.js')
  worker = w
  whenReady = new Promise((resolve) => {
    w.onmessage = (e: MessageEvent) => {
      if (e.data.type === 'ready') {
        ready.value = true
        resolve()
        return
      }
      settle({ stdout: e.data.stdout, stderr: e.data.stderr, error: e.data.error, timedOut: false })
    }
  })
}

function restart(error: string, timedOut: boolean) {
  worker?.terminate()
  start()
  settle({ stdout: '', stderr: '', error, timedOut })
}

export function usePython() {
  if (import.meta.client && !worker) start()

  function run(code: string, stdin = ''): Promise<RunResult> {
    if (running.value) {
      return Promise.resolve({ stdout: '', stderr: '', error: 'Python is already running. Press Stop first.', timedOut: false })
    }
    if (!worker) start()
    running.value = true
    return new Promise((resolve) => {
      let timer: ReturnType<typeof setTimeout> | undefined
      finish = (result) => {
        clearTimeout(timer)
        resolve(result)
      }
      // The timeout counts only run time, not the Pyodide download.
      whenReady.then(() => {
        timer = setTimeout(
          () => restart('Your program ran for more than 10 seconds and was stopped. Is there an infinite loop?', true),
          TIMEOUT_MS,
        )
        worker?.postMessage({ code, stdin })
      })
    })
  }

  function stop() {
    if (running.value) restart('Stopped.', false)
  }

  return { ready, running, run, stop }
}
```

3. Do not export `warm`. Nothing else imports it (`grep -rn warm app` finds only this file).

## Acceptance gates
- `grep -c 'worker?.onmessage' app/composables/usePython.ts` prints `0`
- `grep -c 'any' app/composables/usePython.ts` prints `0`
- `node --check public/pyodide-worker.js` exits 0
- `curl -sI https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.js | head -1` prints `HTTP/2 200`
- `npm run generate` exits 0
- Reviewer, in the browser once T4 wires a Run button: `print("hi")` shows `hi`; `while True: pass` returns the 10 second message and a following `print(1)` works; `print(input())` with stdin `abc` shows `abc`; `print(` shows an error line starting with `SyntaxError`.
