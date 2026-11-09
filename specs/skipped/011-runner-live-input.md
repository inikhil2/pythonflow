# 011: input() cannot ask the learner; it only reads supplied stdin
Files: public/pyodide-worker.js, app/composables/usePython.ts, nuxt.config.ts
Severity: med

## Problem
Do this only after specs 009 and 010.
plan.md T3: "feed `input()` from supplied lines or an inline prompt". Today
`setStdin` in `public/pyodide-worker.js` only shifts supplied lines. When they
run out it returns `undefined` and the program fails with
`EOFError: EOF when reading a line`. The Run panel (T4) has no way to ask
the learner for a line.

Pyodide's stdin callback must return synchronously. The worker therefore
blocks with `Atomics.wait` on a `SharedArrayBuffer` until the page writes the
answer. `SharedArrayBuffer` exists only when the page is cross-origin isolated,
which needs two response headers. The jsDelivr CDN already sends
`cross-origin-resource-policy: cross-origin`, so Pyodide still loads. Where the
host does not send the headers, `crossOriginIsolated` is false and input falls
back to today's behavior (EOFError after the supplied lines).

## Required change
1. In `public/pyodide-worker.js`, directly after the closing `}` of the `tidy` function, add:
```js

// Blocks until the page writes the learner's answer into the shared buffer.
// Layout: Int32 [0] = flag (0 waiting, 1 answered), Int32 [1] = byte length, then UTF-8 bytes from byte 8.
function ask(inputBuffer, stdout) {
  const header = new Int32Array(inputBuffer, 0, 2);
  Atomics.store(header, 0, 0);
  self.postMessage({ type: 'input', stdout });
  Atomics.wait(header, 0, 0);
  return new TextDecoder().decode(new Uint8Array(inputBuffer, 8, header[1]).slice());
}
```
2. In `public/pyodide-worker.js`, replace `const { code, stdin } = e.data;` with
   `const { code, stdin, inputBuffer } = e.data;`
3. In `public/pyodide-worker.js`, replace these two lines:
```js
  // Returning undefined means end of input.
  pyodide.setStdin({ stdin: () => lines.shift() });
```
   with exactly:
```js
  // Supplied lines first, then ask the page. Returning undefined means end of input.
  pyodide.setStdin({
    stdin: () => (lines.length ? lines.shift() : inputBuffer ? ask(inputBuffer, stdout) : undefined),
  });
```
4. Replace the whole file `app/composables/usePython.ts` with exactly:
```ts
import { ref } from 'vue'

export interface RunResult {
  stdout: string
  stderr: string
  error: string | null
  timedOut: boolean
}

/** Asked when the program calls input() after the supplied lines run out. Gets the output so far. */
export type AskInput = (stdoutSoFar: string) => Promise<string>

const TIMEOUT_MS = 10_000
const LOAD_ERROR = 'Python could not start. Check your internet connection, then press Run again.'
const INPUT_BYTES = 4096

// One worker and one state, shared by every component on the page.
const ready = ref(false)
const running = ref(false)
let worker: Worker | null = null
let whenReady: Promise<void> = Promise.resolve()
let finish: ((result: RunResult) => void) | null = null
let onInput: ((stdoutSoFar: string) => void) | null = null

function settle(result: RunResult) {
  running.value = false
  onInput = null
  finish?.(result)
  finish = null
}

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
      if (e.data.type === 'input') {
        onInput?.(e.data.stdout)
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

  function run(code: string, stdin = '', ask?: AskInput): Promise<RunResult> {
    if (running.value) {
      return Promise.resolve({ stdout: '', stderr: '', error: 'Python is already running. Press Stop first.', timedOut: false })
    }
    if (!worker) start()
    running.value = true
    // Live input needs SharedArrayBuffer, which needs cross-origin isolation (see nuxt.config.ts).
    const inputBuffer = ask && globalThis.crossOriginIsolated ? new SharedArrayBuffer(8 + INPUT_BYTES) : null
    return new Promise((resolve) => {
      let timer: ReturnType<typeof setTimeout> | undefined
      // The timeout counts only run time: not the Pyodide download, not time spent typing.
      const startTimer = () => {
        timer = setTimeout(
          () => restart('Your program ran for more than 10 seconds and was stopped. Is there an infinite loop?', true),
          TIMEOUT_MS,
        )
      }
      finish = (result) => {
        clearTimeout(timer)
        resolve(result)
      }
      if (inputBuffer && ask) {
        const handler = async (stdoutSoFar: string) => {
          clearTimeout(timer)
          const answer = await ask(stdoutSoFar)
          if (onInput !== handler) return // stopped while the learner was typing
          const bytes = new TextEncoder().encode(answer).slice(0, INPUT_BYTES)
          new Uint8Array(inputBuffer, 8).set(bytes)
          const header = new Int32Array(inputBuffer, 0, 2)
          header[1] = bytes.length
          Atomics.store(header, 0, 1)
          Atomics.notify(header, 0)
          startTimer()
        }
        onInput = handler
      }
      whenReady.then(() => {
        startTimer()
        worker?.postMessage({ code, stdin, inputBuffer })
      })
    })
  }

  function stop() {
    if (running.value) restart('Stopped.', false)
  }

  return { ready, running, run, stop }
}
```
5. In `nuxt.config.ts`, directly after the line `css: ['~/assets/css/main.css'],`, add:
```ts
  // Cross-origin isolation enables SharedArrayBuffer, which live input() needs.
  routeRules: {
    '/**': {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  },
```

## Acceptance gates
- `node --check public/pyodide-worker.js` exits 0
- `grep -c 'Atomics.wait' public/pyodide-worker.js` prints `1`
- `grep -c 'Atomics.notify' app/composables/usePython.ts` prints `1`
- `grep -c "export type AskInput" app/composables/usePython.ts` prints `1`
- `npm run generate` exits 0
- With `npm run dev` running: `curl -sI http://localhost:3000/ | grep -ci '^cross-origin-'` prints `2`
- Reviewer, in the browser once T4 passes an `ask` callback: `print("hi", input("Name: "))` with no stdin asks once, shows `Name: ` as the output so far, and after typing `Bob` shows `Name: hi Bob`.
