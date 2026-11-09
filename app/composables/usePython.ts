export interface RunResult {
  stdout: string
  stderr: string
  error: string | null
  timedOut: boolean
  input: string // a timeout only: the last random input that started, if any
}

// The types below mirror what public/trace.py records.
export interface TraceValue {
  type: string
  repr: string
  items?: string[] // lists, tuples, dicts and objects: the first 12 items
  length?: number // lists, tuples, dicts and objects: how many items there are
  keyed?: boolean // dicts and objects: each item is a key or attribute with its value, so it gets no index
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
  globals?: Record<string, TraceValue> // inside a function: the main program's variables, if any
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
  input?: string
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
let lastInput = '' // the random check posts each input as it starts

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
      if (typeof e.data === 'string') {
        lastInput = e.data.replace(/^pf-input /, '')
        return
      }
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
  const input = lastInput
  worker?.terminate()
  start()
  settle({ error, timedOut, input })
}

// Sends one job to the worker and waits for its reply, the timeout or Stop.
function send(job: { type: 'run' | 'trace', code: string, stdin: string, prelude?: string }): Promise<Reply> {
  if (running.value) {
    return Promise.resolve({ error: 'Python is already running. Press Stop first.', timedOut: false })
  }
  if (!worker) start()
  running.value = true
  lastInput = ''
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

  async function run(code: string, stdin = '', prelude = ''): Promise<RunResult> {
    const reply = await send({ type: 'run', code, stdin, prelude })
    return { stdout: reply.stdout ?? '', stderr: reply.stderr ?? '', error: reply.error, timedOut: reply.timedOut, input: reply.input ?? '' }
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
