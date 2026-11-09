# 054: Trace message in the worker and usePython().trace (task C1)
Files: public/pyodide-worker.js, app/composables/usePython.ts
Severity: med

## Problem
The visual explorer needs the worker to run code under `public/trace.py` (shell step 053)
and send back the recorded steps. Today the worker only runs code, and `usePython()` only
has `run()`.

New protocol: the page sends `{ type: 'run' | 'trace', code, stdin }`. A trace reply is
`{ type: 'trace', steps, stdout, error, note }`. The worker fetches `/trace.py` once, the
first time a trace is asked for. Run, Stop and the 10 s timeout work as before, for both
kinds of job. `usePython()` gains `trace(code, stdin)` and the trace types.

Do this after shell step 053.

## Required change
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components. `usePython.ts` has no import lines at all.

1. **Replace the whole of `public/pyodide-worker.js`** with exactly this content. Delete everything in the file first.
```js
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/';
importScripts(PYODIDE_URL + 'pyodide.js');

// Start loading at once; every run waits for this.
const pyodideReady = loadPyodide({ indexURL: PYODIDE_URL });
pyodideReady.then(
  (pyodide) => self.postMessage({ type: 'ready', version: pyodide.runPython('import sys\nsys.version.split()[0]') }),
  () => self.postMessage({ type: 'load-error' }),
);

// Keep the header line and the learner's own frames; drop Pyodide's internal frames.
function tidy(traceback) {
  const lines = traceback.split('\n');
  const start = lines.findIndex((line) => line.startsWith('  File "main.py"'));
  return start === -1 ? traceback : [lines[0], ...lines.slice(start)].join('\n');
}

async function run(pyodide, code, stdin) {
  const decoder = new TextDecoder();
  let stdout = '';
  let stderr = '';
  const lines = stdin ? stdin.split('\n') : [];

  pyodide.setStdout({ write: (buf) => { stdout += decoder.decode(buf); return buf.length; } });
  pyodide.setStderr({ write: (buf) => { stderr += decoder.decode(buf); return buf.length; } });
  // Returning undefined means end of input.
  pyodide.setStdin({ stdin: () => lines.shift() });

  let error = null;
  const globals = pyodide.globals.get('dict')();
  try {
    await pyodide.runPythonAsync(code, { globals, filename: 'main.py' });
  } catch (e) {
    const traceback = tidy(String(e.message ?? e).trimEnd());
    stderr += traceback;
    error = traceback.split('\n').pop();
  } finally {
    // print(..., end="") stays in Python's buffer until flushed.
    pyodide.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()');
    globals.destroy();
  }
  return { type: 'result', stdout, stderr, error };
}

// The tracer in /trace.py is loaded the first time a trace is asked for.
let tracer = null;

async function trace(pyodide, code, stdin) {
  try {
    if (!tracer) {
      const response = await fetch('/trace.py');
      pyodide.runPython(await response.text());
      tracer = pyodide.globals.get('trace');
    }
    return { type: 'trace', ...JSON.parse(tracer(code, stdin)) };
  } catch {
    return {
      type: 'trace',
      steps: [],
      stdout: '',
      error: 'The tracer could not start. Check your internet connection, then press Run and trace again.',
      note: null,
    };
  }
}

self.onmessage = async (e) => {
  const { type, code, stdin } = e.data;
  const pyodide = await pyodideReady;
  self.postMessage(type === 'trace' ? await trace(pyodide, code, stdin) : await run(pyodide, code, stdin));
};
```

2. **Replace the whole of `app/composables/usePython.ts`** with exactly this content. Delete everything in the file first.
```ts
export interface RunResult {
  stdout: string
  stderr: string
  error: string | null
  timedOut: boolean
}

// The types below mirror what public/trace.py records.
export interface TraceValue {
  type: string
  repr: string
  items?: string[] // lists, tuples and dicts: the first 12 items
  length?: number // lists, tuples and dicts: how many items there are
}

export interface TraceFrame {
  name: string // '<module>' is the main program
  args: Record<string, string>
}

export interface TraceStep {
  event: 'line' | 'call' | 'return' | 'exception'
  line: number
  stack: TraceFrame[] // outermost first
  locals: Record<string, TraceValue>
  stdoutLength: number // how much of stdout was printed before this step
  error?: string // exception steps only
}

export interface TraceResult {
  steps: TraceStep[]
  stdout: string
  error: string | null
  note: string | null // 'Stopped after 1000 steps.' when the trace was cut short
  timedOut: boolean
}

const TIMEOUT_MS = 10_000
const LOAD_ERROR = 'Python could not start. Check your internet connection, then press Run again.'

// What the worker sends back for a run or a trace. A failure fills only error and timedOut.
interface Reply {
  stdout?: string
  stderr?: string
  steps?: TraceStep[]
  note?: string | null
  error: string | null
  timedOut: boolean
}

// One worker and one state, shared by every component on the page.
const ready = ref(false)
const running = ref(false)
const version = ref('')
let worker: Worker | null = null
let whenReady: Promise<void> = Promise.resolve()
let finish: ((reply: Reply) => void) | null = null

function settle(reply: Reply) {
  running.value = false
  finish?.(reply)
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
      settle({ error: LOAD_ERROR, timedOut: false })
    }
    w.onerror = failed
    w.onmessage = (e: MessageEvent) => {
      if (e.data.type === 'ready') {
        version.value = e.data.version
        ready.value = true
        resolve()
        return
      }
      if (e.data.type === 'load-error') {
        failed()
        return
      }
      settle({ ...e.data, timedOut: false })
    }
  })
}

function restart(error: string, timedOut: boolean) {
  worker?.terminate()
  start()
  settle({ error, timedOut })
}

// Sends one job to the worker and waits for its reply, the timeout or Stop.
function send(job: { type: 'run' | 'trace', code: string, stdin: string }): Promise<Reply> {
  if (running.value) {
    return Promise.resolve({ error: 'Python is already running. Press Stop first.', timedOut: false })
  }
  if (!worker) start()
  running.value = true
  return new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout> | undefined
    finish = (reply) => {
      clearTimeout(timer)
      resolve(reply)
    }
    // The timeout counts only run time, not the Pyodide download.
    whenReady.then(() => {
      timer = setTimeout(
        () => restart('Your program ran for more than 10 seconds and was stopped. Is there an infinite loop?', true),
        TIMEOUT_MS,
      )
      worker?.postMessage(job)
    })
  })
}

export function usePython() {
  if (import.meta.client && !worker) start()

  async function run(code: string, stdin = ''): Promise<RunResult> {
    const reply = await send({ type: 'run', code, stdin })
    return { stdout: reply.stdout ?? '', stderr: reply.stderr ?? '', error: reply.error, timedOut: reply.timedOut }
  }

  // Runs the code under public/trace.py: one step per line, call, return and exception.
  async function trace(code: string, stdin = ''): Promise<TraceResult> {
    const reply = await send({ type: 'trace', code, stdin })
    return {
      steps: reply.steps ?? [],
      stdout: reply.stdout ?? '',
      error: reply.error,
      note: reply.note ?? null,
      timedOut: reply.timedOut,
    }
  }

  function stop() {
    if (running.value) restart('Stopped.', false)
  }

  return { ready, running, version, run, trace, stop }
}
```

## Acceptance gates
- `git diff --stat HEAD` lists only these two files.
- `wc -c < public/pyodide-worker.js` prints `2548` and
  `wc -c < app/composables/usePython.ts` prints `4193`.
- `grep -c "^import" app/composables/usePython.ts` prints `0`.
- `npm run generate` exits 0.
- Browser (Orca): in the hello lesson, Run on `print("hello, world")` still prints
  `hello, world`. Run on `while True: pass` still stops after 10 seconds with the
  infinite-loop message.
