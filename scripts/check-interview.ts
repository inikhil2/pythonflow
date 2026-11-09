// Checks every interview problem against docs/interview-format.md. Each solution must pass every test,
// and each starter must fail at least one, using the same Pyodide runner as check-lessons.
// The main thread only schedules: a pool of worker threads (this same file), each with its own Pyodide, checks
// the files and then their mutants in parallel. Results are reported in file order, so output and the first
// failure are the same as a sequential run.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { availableParallelism } from 'node:os'
import { isMainThread, parentPort, Worker } from 'node:worker_threads'
import type { TestCase } from './pyRunner.ts'
import { randomCheck, type RandomSpec } from '../app/utils/randomCheck.ts'
import { NODE_PRELUDE, WRAP_PY } from '../app/utils/nodePrelude.ts'

interface Meta {
  title?: unknown
  tier?: unknown
  order?: unknown
  leetcode?: unknown
  url?: unknown
  companies?: unknown
  topic?: unknown
  needs?: unknown
}

interface Exercise {
  id?: unknown
  prompt?: unknown
  starter?: unknown
  tests?: TestCase[]
  solution?: unknown
  brute?: unknown
  random?: unknown
  big?: unknown
  slow?: unknown
  no_slow?: unknown
  prelude?: unknown
  valid?: unknown
  equivalent?: unknown
  wrong?: unknown
}

interface Mutant {
  line: number
  text: string
  code: string
}

// Python: every one-site mutant of SRC, as the source text plus the first line that changed.
const MUTANT_PY = `
import ast, json
SWAP = {ast.Lt: ast.LtE, ast.LtE: ast.Lt, ast.Gt: ast.GtE, ast.GtE: ast.Gt, ast.Eq: ast.NotEq, ast.NotEq: ast.Eq, ast.Is: ast.IsNot, ast.IsNot: ast.Is,
        ast.And: ast.Or, ast.Or: ast.And, ast.Add: ast.Sub, ast.Sub: ast.Add}

class Mutate(ast.NodeTransformer):
    def __init__(self, target):
        self.target, self.count = target, 0

    def hit(self):
        self.count += 1
        return self.count == self.target

    def swap(self, node):
        if type(node.op) in SWAP and self.hit():
            node.op = SWAP[type(node.op)]()
        return node

    def visit_BinOp(self, node):
        self.generic_visit(node)
        return self.swap(node)

    visit_BoolOp = visit_AugAssign = visit_BinOp

    def visit_Compare(self, node):
        self.generic_visit(node)
        for i, op in enumerate(node.ops):
            if type(op) in SWAP and self.hit():
                node.ops[i] = SWAP[type(op)]()
        return node

    def visit_Constant(self, node):
        if isinstance(node.value, bool):
            return ast.Constant(not node.value) if self.hit() else node
        if isinstance(node.value, int):
            for d in (1, -1):
                if self.hit():
                    return ast.Constant(node.value + d)
        return node

    def visit_UnaryOp(self, node):
        self.generic_visit(node)
        if isinstance(node.op, ast.Not) and self.hit():
            return node.operand
        return node

    def visit_Call(self, node):
        self.generic_visit(node)
        if isinstance(node.func, ast.Name) and node.func.id in ("min", "max") and self.hit():
            node.func = ast.Name("max" if node.func.id == "min" else "min", ast.Load())
        return node

probe = Mutate(-1)
probe.visit(ast.parse(SRC))
orig = ast.unparse(ast.parse(SRC)).split("\\n")
out = []
for k in range(1, probe.count + 1):
    text = ast.unparse(Mutate(k).visit(ast.parse(SRC))).split("\\n")
    diff = [i for i, (a, b) in enumerate(zip(orig, text)) if a != b]
    if diff:
        out.append({"line": diff[0] + 1, "text": text[diff[0]].strip(), "code": "\\n".join(text)})
print(json.dumps(out))
`

// Mutant runs only: a step limit, so a mutant that loops forever fails instead of hanging the checker.
const LIMIT_PY = `import sys as _pf_sys
_pf_steps = [0]
def _pf_trace(frame, event, arg):
    if event == "line":
        _pf_steps[0] += 1
        if _pf_steps[0] > 2000000:
            _pf_sys.settrace(None)
            raise TimeoutError("ran too many steps")
    return _pf_trace
_pf_sys.settrace(_pf_trace)
`

// Runs a mutant, then clears the trace, since later runs share this Python process.
async function limited(code: string, test: TestCase, prelude = '') {
  const why = await failure(LIMIT_PY + code, test, prelude)
  await run('import sys\nsys.settrace(None)', '')
  return why
}

// The step limit counts only Python lines, so a slow method built on builtins (sum of a slice per window) passes it.
// big is therefore also timed. Pyodide in node cannot be interrupted, so the run finishes and its wall-clock time
// is scaled to an idle machine: a fixed benchmark runs before and after, and REF_BENCH_MS is its time on an idle
// machine (measured under load; recalibrate it on an idle machine). The app stops a run at 10 seconds.
const APP_LIMIT_S = 10
const SOLUTION_LIMIT_S = APP_LIMIT_S / 5 // the intended solution must finish big well inside the limit
const REF_BENCH_MS = 240
// A worker stuck in a C-level call cannot be interrupted, so the main thread stops it. A hung mutant counts as killed;
// a hung file is an error. Raise the limits on a loaded machine.
const MUTANT_S = Number(process.env.CHECK_MUTANT_S) || 20
const FILE_S = Number(process.env.CHECK_FILE_S) || 120
// wrong and slow solutions run on big as their own jobs, because a builtin doing O(n^2) work in C cannot be interrupted.
const WRONG_S = Number(process.env.CHECK_WRONG_S) || 10
const SLOW_S = Number(process.env.CHECK_SLOW_S) || 15
const BENCH_PY = `s = 0
for i in range(300000):
    s += i
xs = list(range(1000000))
sum(xs[::2])
sorted(xs[::-1])
`
async function bench() {
  const t = performance.now()
  await run(BENCH_PY, '')
  return performance.now() - t
}
async function timedBig(code: string, test: TestCase, prelude: string) {
  const before = await bench()
  const t = performance.now()
  const why = await limited(code, test, prelude)
  const took = performance.now() - t
  const after = await bench()
  return { why, seconds: (took / 1000) * (REF_BENCH_MS / ((before + after) / 2)) }
}

// Python: runs solution and brute on the same 200 inputs as the random check. Brute runs under the step
// limit, and an input where it hits the limit is skipped. Prints the first disagreement and the skip count.
// Kept out of randomCheck, so brute never reaches the browser's random check.
function bruteCheck(random: RandomSpec, solution: string, brute: string, prelude = ''): string {
  const lit = (s: string) => JSON.stringify(s)
  const call = lit(random.call)
  const head = [
    'import copy, json, random, sys',
    prelude && prelude + '\n' + WRAP_PY,
    prelude && `_pf_wrap = json.loads(${lit(JSON.stringify(random.wrap ?? {}))})`,
    `_pf_sol, _pf_brute, _pf_gen, _pf_same = {}, {}, {}, {}`,
    prelude && `exec(${lit(prelude)}, _pf_sol)\nexec(${lit(prelude)}, _pf_brute)`,
    `exec(${lit(solution)}, _pf_sol)`,
    `exec(${lit(brute)}, _pf_brute)`,
    random.driver && `exec(${lit(random.driver)}, _pf_sol)\nexec(${lit(random.driver)}, _pf_brute)`,
    `exec(${lit(random.gen)}, _pf_gen)`,
    random.same
      ? `exec(${lit(random.same)}, _pf_same)\n_pf_ok = _pf_same["same"]`
      : '_pf_ok = lambda args, got, want: got == want',
  ]
  const body = `
_pf_steps = [0]
def _pf_trace(frame, event, arg):
    if event == "line":
        _pf_steps[0] += 1
        if _pf_steps[0] > 2000000:
            raise TimeoutError("ran too many steps")
    return _pf_trace
def _pf_call(fn, args):
    try:
        return ("value", ${prelude ? '_pf_apply(fn, copy.deepcopy(args), _pf_wrap)' : 'fn(*copy.deepcopy(args))'})
    except TimeoutError:
        raise
    except Exception as e:
        return ("raised", f"{type(e).__name__}: {e}")
def _pf_show(r):
    return repr(r[1]) if r[0] == "value" else "raised " + r[1]
def _pf_agree(args, a, b):
    if a[0] != "value" or b[0] != "value":
        return a == b
    return _pf_ok(args, a[1], b[1]) and _pf_ok(args, b[1], a[1])
_pf_out = {"mismatch": None, "skipped": 0}
for _pf_i in range(200):
    _pf_args = _pf_gen["gen"](random.Random(_pf_i), min(_pf_i // 10, 12))
    _pf_want = _pf_call(_pf_sol[${call}], _pf_args)
    _pf_steps[0] = 0
    sys.settrace(_pf_trace)
    try:
        _pf_got = _pf_call(_pf_brute[${call}], _pf_args)
    except TimeoutError:
        _pf_out["skipped"] += 1
        continue
    finally:
        sys.settrace(None)
    if not _pf_agree(_pf_args, _pf_want, _pf_got) and _pf_out["mismatch"] is None:
        _pf_text = ", ".join(repr(_pf_a) for _pf_a in _pf_args)
        _pf_out["mismatch"] = [f"${random.call}({_pf_text})", _pf_show(_pf_want), _pf_show(_pf_got)]
print(json.dumps(_pf_out))
`
  return [...head, body].join('\n')
}

// Only a worker loads Pyodide; the main thread never runs Python.
let py: typeof import('./pyRunner.ts')
const failure: typeof py.failure = (...a) => py.failure(...a)
const run: typeof py.run = (...a) => py.run(...a)

const root = new URL('../content/', import.meta.url)
const tiers = ['easy', 'medium', 'hard']
const minTests: Record<string, number> = { easy: 5, medium: 6, hard: 8 }
const minWrong: Record<string, number> = { easy: 2, medium: 3, hard: 3 }
const ids = new Set<string>()
const leetcodes = new Set<number>()
let file = ''
let problems = 0

// What a worker learns about one file before its mutants run.
interface Prepared {
  leetcode: number
  id: string
  mutants: Mutant[]
  equivalent: string[]
  all: TestCase[]
  prelude: string
  noSlow: string | null
  minDistinct: number | null
  bigSeconds: number | null
  big: TestCase | null
  wrong: string[]
  slow: string[]
}

type BigRun = { killed: true } | { killed?: false; why: string | null; seconds: number }

// Every failure names the file it came from.
function need(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(`${file}: ${message}`)
}

async function prepare(tier: string, name: string): Promise<Prepared> {
  // CHECK_TIMING=1 prints the seconds each phase took, to find what makes a file slow.
  let last = performance.now()
  const lap = (phase: string) => {
    const now = performance.now()
    if (process.env.CHECK_TIMING) console.error(`${name}: ${phase}: ${((now - last) / 1000).toFixed(1)} s`)
    last = now
  }
  const text = readFileSync(new URL(file, root), 'utf8')
  const [, front, body] = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? []
  need(front !== undefined && body !== undefined, 'the file must start with --- frontmatter ---')
  const meta = parse(front) as Meta

  need(/^\d{3}-[a-z0-9-]+\.md$/.test(name), 'the file name must be NNN-slug.md')
  const order = Number(name.slice(0, 3))
  need(typeof meta.title === 'string' && meta.title !== '', 'title is required')
  need(meta.tier === tier, `tier must be ${tier}, the folder name`)
  need(meta.order === order, `order must be ${order}, the number in the file name`)

  const leetcode = meta.leetcode
  need(typeof leetcode === 'number' && Number.isInteger(leetcode) && leetcode > 0, 'leetcode must be a positive integer')

  need(
    typeof meta.url === 'string' && meta.url.startsWith('https://leetcode.com/problems/') && meta.url.endsWith('/'),
    'url must start with https://leetcode.com/problems/ and end with /',
  )
  need(
    Array.isArray(meta.companies) && meta.companies.length > 0 && meta.companies.every((c) => typeof c === 'string' && c !== ''),
    'companies must be a non-empty list of names',
  )
  need(typeof meta.topic === 'string' && meta.topic !== '', 'topic is required')
  need(
    Array.isArray(meta.needs) &&
      meta.needs.every((p) => typeof p === 'string' && p.startsWith('/learn/') && existsSync(new URL(`${p.slice(7)}.md`, root))),
    'every needs entry must be the path of an existing lesson, such as /learn/week2-loops/04-dictionaries',
  )

  need(!/^\s*# /.test(body), 'the body must not start with a # heading, the page shows the title')
  const found = [...body.matchAll(/^::exercise\n---\n([\s\S]*?)\n---\n::$/gm)].map((m) => parse(m[1]) as Exercise)
  need(found.length === 1, `a problem has exactly one ::exercise block, found ${found.length}`)
  const ex = found[0]

  const id = `iv-${tier}-${String(order).padStart(3, '0')}`
  need(ex.id === id, `the exercise id must be ${id}`)
  need(typeof ex.prompt === 'string' && ex.prompt !== '', 'prompt is required')
  need(typeof ex.starter === 'string', 'starter is required')
  need(typeof ex.solution === 'string' && ex.solution !== '', 'solution is required')

  const tests = ex.tests ?? []
  need(tests.length >= minTests[tier], `${tier} problems need at least ${minTests[tier]} tests, found ${tests.length}`)
  need(tests.every((t) => 'check' in t && typeof t.check === 'string'), 'every test must be a check test, with a check line')

  const random = ex.random as RandomSpec | undefined
  need(random !== undefined && typeof random.call === 'string' && typeof random.gen === 'string', 'random needs call and gen')
  need(random.driver === undefined || typeof random.driver === 'string', 'random.driver must be Python source')
  // With a driver, call names the driver's function and the solution is a class; the driver is not mutated.
  const defines = random.driver ?? ex.solution
  need(new RegExp(`^def ${random.call}\\(`, 'm').test(defines), `random call ${random.call} must name a def in the ${random.driver ? 'driver' : 'solution'}`)
  need(ex.prelude === undefined || ex.prelude === 'nodes', 'prelude must be nodes, or left out')
  const prelude = ex.prelude === 'nodes' ? NODE_PRELUDE : ''
  const kinds = ['nodes', 'tree', 'cycle', 'random', 'shared']
  const resultKinds = ['nodes', 'tree', 'random', 'index']
  const wrap = random.wrap
  need(!wrap || prelude, 'random.wrap needs prelude: nodes')
  need(
    !wrap || ((wrap.args ?? []).every((k) => k === null || kinds.includes(k)) && (wrap.result === undefined || resultKinds.includes(wrap.result))),
    'wrap args must be nodes, tree, cycle, random, shared, or null for an argument left alone; the result must be nodes, tree, random or index',
  )
  // valid: the statement's input rules. The solution's function is wrapped so the arguments are recorded before it
  // runs; only the outermost call is checked, so a recursive solution's inner calls are left alone.
  need(ex.valid === undefined || (typeof ex.valid === 'string' && /^def valid\(/m.test(ex.valid)), 'valid must define def valid(...)')
  const call = random.call
  const solution = ex.valid
    ? `${ex.solution}\n${random.driver ?? ''}\n${ex.valid}\n` +
      `_pf_real, _pf_depth = ${call}, [0]\n` +
      `def ${call}(*_a, **_k):\n` +
      `    if _pf_depth[0] == 0 and not valid(*_a, **_k):\n` +
      `        _g = globals()\n` +
      `        _s = ", ".join(repr(from_nodes(x) if "ListNode" in _g and isinstance(x, ListNode) else from_tree(x) if "TreeNode" in _g and isinstance(x, TreeNode) else x) for x in _a)\n` +
      `        raise AssertionError("input breaks the problem's rules (valid): ${call}(" + _s[:300] + ")")\n` +
      `    _pf_depth[0] += 1\n` +
      `    try:\n` +
      `        return _pf_real(*_a, **_k)\n` +
      `    finally:\n` +
      `        _pf_depth[0] -= 1\n`
    : ex.solution
  // The fixed tests, then the random check, which is the last case.
  need(ex.big === undefined || (typeof ex.big === 'string' && ex.big !== ''), 'big must be one check line')
  need(ex.big === undefined || /\bassert\b/.test(ex.big as string), 'big must assert its result, or a wrong answer would pass')
  const big: TestCase | null = ex.big === undefined ? null : { check: ex.big as string }
  need(!ex.slow || big, 'slow solutions need a big test')
  const all: TestCase[] = [...tests, ...(big ? [big] : []), { check: randomCheck(random, ex.solution, !!prelude) }]

  let bigSeconds: number | null = null
  for (const [i, test] of all.entries()) {
    let why: string | null
    if (test === big) {
      // big runs under the step limit and is timed: a solution that cannot finish it fast is not the answer key.
      const timed = await timedBig(solution, test, prelude)
      why = timed.why
      bigSeconds = timed.seconds
      need(
        why !== null || bigSeconds <= SOLUTION_LIMIT_S,
        `the solution takes ${bigSeconds.toFixed(1)} s on big; it must stay under ${SOLUTION_LIMIT_S} s (a fifth of the app's ${APP_LIMIT_S} s limit)`,
      )
    } else {
      why = await failure(solution, test, prelude)
    }
    need(why === null, `the solution fails test ${i + 1}: ${why}`)
  }
  lap('solution on fixed tests, big and random')
  let starterFails = false
  for (const test of all) {
    if ((await failure(ex.starter, test, prelude)) !== null) starterFails = true
  }
  need(starterFails, 'the starter passes every test, it must fail at least one')

  lap('starter')
  // brute: a slow answer key, written from the statement, independent of solution.
  need(typeof ex.brute === 'string' && ex.brute !== '', 'brute is required: a slow answer key written from the statement')
  need(random.driver || new RegExp(`^def ${random.call}\\(`, 'm').test(ex.brute), `brute must define ${random.call}`)
  for (const [i, test] of tests.entries()) {
    const why = await limited(ex.brute, test, prelude)
    need(why === null, `brute fails test ${i + 1}: ${why}`)
  }
  const compared = await run(bruteCheck(random, ex.solution, ex.brute, prelude), '')
  need(compared.error === null, `brute check failed: ${compared.error}`)
  const { mismatch, skipped } = JSON.parse(compared.stdout) as { mismatch: string[] | null; skipped: number }
  if (mismatch) {
    need(false, `solution and brute disagree on ${mismatch[0]}: solution ${mismatch[1]}, brute ${mismatch[2]}`)
  }
  need(skipped <= 50, 'brute too slow')

  lap('brute tests and brute-vs-solution')
  const wrong = Array.isArray(ex.wrong) ? ex.wrong : []
  need(
    Array.isArray(ex.wrong) && ex.wrong.every((w) => typeof w === 'string' && w.trim() !== ''),
    'wrong must be a list of solutions, each one a string',
  )
  need(wrong.length >= minWrong[tier], `${tier} problems need at least ${minWrong[tier]} wrong solutions, found ${wrong.length}`)
  for (const [i, bad] of wrong.entries()) {
    let caught = false
    for (const test of tests) {
      if ((await limited(bad, test, prelude)) !== null) caught = true
    }
    need(caught, `wrong solution ${i + 1} passes every test; add a test that catches it`)
  }
  lap('wrong on fixed tests')
  // slow: correct on every fixed test, but too many steps on big (the app would stop it at 10 seconds).
  const slow = Array.isArray(ex.slow) ? ex.slow : []
  need(!ex.slow || (Array.isArray(ex.slow) && slow.every((w) => typeof w === 'string' && w.trim() !== '')), 'slow must be a list of solutions')
  for (const [i, bad] of slow.entries()) {
    for (const [j, test] of tests.entries()) {
      const why = await limited(bad, test, prelude)
      need(why === null, `slow solution ${i + 1} fails test ${j + 1}: ${why}; a slow solution must be correct`)
    }
  }

  lap('slow on fixed tests')
  // Medium and hard need a speed test: big, and a slow solution that fails it, unless no_slow says why not.
  let noSlow: string | null = null
  if (tier !== 'easy') {
    if (ex.no_slow !== undefined) {
      need(typeof ex.no_slow === 'string' && ex.no_slow.trim() !== '', 'no_slow must be a reason, as a non-empty string')
      need(slow.length === 0, 'no_slow and slow are both set; keep one')
      noSlow = ex.no_slow
    } else {
      need(big && slow.length > 0, `${tier} problems need a big test and at least one slow solution, or no_slow: "<reason>"`)
    }
  }

  lap('speed-test rules')
  const distinct = await run(
    `import random\n_g = {}\nexec(${JSON.stringify(random.gen)}, _g)\n` +
      `print(len({repr(_g["gen"](random.Random(i), min(i // 10, 12))) for i in range(200)}))`,
    '',
  )
  need(distinct.error === null, `gen fails: ${distinct.error}`)
  // min_distinct lowers the 50 for a small input space; it must carry a "# why:" comment, which the YAML parser drops.
  const md = (random as { min_distinct?: unknown }).min_distinct
  let minDistinct: number | null = null
  if (md !== undefined) {
    need(Number.isInteger(md) && (md as number) >= 1, 'random.min_distinct must be a whole number of at least 1')
    need(/^\s*min_distinct:\s*\d+\s+# why: *\S/m.test(body), 'random.min_distinct needs a "# why: ..." comment on its line')
    minDistinct = md as number
  }
  const needed = minDistinct ?? 50
  // Below 10 the input space must be exhausted: the random run sees exactly min_distinct inputs, no more.
  need(
    minDistinct === null || minDistinct >= 10 || Number(distinct.stdout) === minDistinct,
    `random.min_distinct below 10 needs gen to give exactly that many distinct inputs, but it gives ${distinct.stdout.trim()} of 200`,
  )
  need(Number(distinct.stdout) >= needed, `gen gives too few distinct inputs (${distinct.stdout.trim()} of 200, need ${needed})`)

  lap('gen distinct check')
  const mutantRun = await run(`SRC = ${JSON.stringify(ex.solution)}\n${MUTANT_PY}`, '')
  need(mutantRun.error === null, `mutation testing failed: ${mutantRun.error}`)
  const mutants = JSON.parse(mutantRun.stdout) as Mutant[]
  // An entry is "<line>: <text>" (YAML reads `- 12: text` as a map, so both forms are accepted) or, as before, bare text.
  const equivalent = (Array.isArray(ex.equivalent) ? ex.equivalent : []).map((e) =>
    typeof e === 'object' && e !== null ? Object.entries(e).map(([k, v]) => `${k}: ${v}`)[0] : String(e),
  )
  lap('mutant generation')
  return { leetcode, id, mutants, equivalent, all, prelude, noSlow, minDistinct, bigSeconds, big, wrong, slow }
}

// True when some test fails the mutant (a mutant that runs too long counts as killed).
async function isDead(task: { code: string; all: TestCase[]; prelude: string }): Promise<boolean> {
  for (const test of task.all) {
    if ((await limited(task.code, test, task.prelude)) !== null) return true
  }
  return false
}

interface Task {
  id?: number
  kind: 'file' | 'mutant' | 'bigrun'
  [key: string]: unknown
}

if (!isMainThread) {
  py = await import('./pyRunner.ts')
  parentPort!.on('message', async (task: Task) => {
    let reply: { value?: unknown; error?: string }
    try {
      if (task.kind === 'file') {
        file = task.file as string
        reply = { value: await prepare(task.tier as string, task.name as string) }
      } else if (task.kind === 'bigrun') {
        const { why, seconds } = await timedBig(task.code as string, task.big as TestCase, task.prelude as string)
        reply = { value: { why, seconds } }
      } else {
        reply = { value: await isDead(task as never) }
      }
    } catch (e) {
      reply = { error: e instanceof Error ? e.message : String(e) }
    }
    parentPort!.postMessage(reply)
  })
} else {
  await main()
}

async function main() {
  type Reply = { value?: any; error?: string }
  const idle: Worker[] = []
  const queue: { task: Task; resolve: (r: Reply) => void }[] = []
  // A mutant goes to the front, so files already under way finish before new ones start.
  const submit = (task: Task) =>
    new Promise<Reply>((resolve) => {
      queue[task.kind !== 'file' ? 'unshift' : 'push']({ task, resolve })
      pump()
    })
  function pump() {
    while (idle.length && queue.length) {
      const w = idle.pop()!
      const job = queue.shift()!
      const done = (r: Reply) => {
        clearTimeout(timer)
        w.off('message', done).off('error', crashed)
        idle.push(w)
        job.resolve(r)
        pump()
      }
      const crashed = (e: Error) => done({ error: `${(job.task.file as string) ?? 'worker'}: ${e.message}` })
      const timer = setTimeout(() => {
        w.off('message', done).off('error', crashed)
        void w.terminate()
        idle.push(new Worker(new URL(import.meta.url)))
        job.resolve(job.task.kind === 'mutant' ? { value: true } : job.task.kind === 'bigrun' ? { value: { killed: true } } : { error: `${job.task.file}: no answer after ${FILE_S} s` })
        pump()
      }, (job.task.kind === 'mutant' ? MUTANT_S : job.task.kind === 'bigrun' ? (job.task.cap as number) : FILE_S) * 1000)
      w.on('message', done).on('error', crashed)
      w.postMessage(job.task)
    }
  }

  async function runFile(tier: string, name: string): Promise<Reply & { dead?: boolean[]; wrongRuns?: BigRun[]; slowRuns?: BigRun[] }> {
    const f = await submit({ kind: 'file', file: `interview/${tier}/${name}`, tier, name })
    if (f.error) return f
    const p = f.value as Prepared
    const bigRun = (code: string, cap: number) => submit({ kind: 'bigrun', code, big: p.big, prelude: p.prelude, cap })
    const [results, wrongRuns, slowRuns] = await Promise.all([
      Promise.all(p.mutants.map((m) => submit({ kind: 'mutant', code: m.code, all: p.all, prelude: p.prelude }))),
      Promise.all((p.big ? p.wrong : []).map((w) => bigRun(w, WRONG_S))),
      Promise.all((p.big ? p.slow : []).map((w) => bigRun(w, SLOW_S))),
    ])
    const bad = results.find((r) => r.error)
    return bad ?? { value: p, dead: results.map((r) => r.value as boolean), wrongRuns: wrongRuns.map((r) => r.value as BigRun), slowRuns: slowRuns.map((r) => r.value as BigRun) }
  }

  try {
    // File arguments check only those problems; with none, every problem is checked.
    const only = process.argv.slice(2).map((f) => f.replace(/^.*content\/interview\//, '').split('/'))
    const everything = readdirSync(new URL('interview/', root))
      .filter((f) => !f.startsWith('.'))
      .sort()
      .flatMap((tier) => {
        file = `interview/${tier}`
        need(tiers.includes(tier), 'the folder must be easy, medium or hard')
        return readdirSync(new URL(`interview/${tier}/`, root)).filter((f) => f.endsWith('.md')).sort().map((name) => [tier, name])
      })
    const list = only.length ? only : everything
    // One worker per file at most; CHECK_JOBS overrides, for a loaded machine.
    const size = Number(process.env.CHECK_JOBS) || Math.max(1, Math.min(list.length, availableParallelism() - 2))
    for (let i = 0; i < size; i++) idle.push(new Worker(new URL(import.meta.url)))
    const jobs = list.map(([tier, name]) => runFile(tier, name))
    for (const [i, [tier, name]] of list.entries()) {
      file = `interview/${tier}/${name}`
      const r = await jobs[i]
      if (r.error) throw new Error(r.error)
      const p = r.value as Prepared
      need(!leetcodes.has(p.leetcode), `leetcode ${p.leetcode} is used by another problem`)
      leetcodes.add(p.leetcode)
      need(!ids.has(p.id), `${p.id} is used by another problem`)
      ids.add(p.id)
      // A slow solution must be slow on big: killed at the cap, out of steps, or over the app's limit, never a wrong answer.
      for (const [i, run] of r.slowRuns!.entries()) {
        if (run.killed) {
          console.log(`${p.id}: slow #${i + 1} on big: killed at ${SLOW_S} s`)
          continue
        }
        need(run.why !== null || run.seconds > APP_LIMIT_S, `slow solution ${i + 1} passes big in ${run.seconds.toFixed(1)} s; make big larger or the slow solution slower`)
        need(run.why === null || run.why.includes('too many steps'), `slow solution ${i + 1} fails big with a wrong answer (${run.why}), not by being slow`)
      }
      // big must catch a wrong solution by its output, or its assert holds for wrongs too. A kill or an out-of-steps proves nothing.
      let byOutput = false
      for (const [i, run] of r.wrongRuns!.entries()) {
        if (run.killed) console.log(`${p.id}: wrong #${i + 1} on big: killed at ${WRONG_S} s`)
        else if (run.why === null) continue
        else if (run.why.includes('too many steps')) console.log(`${p.id}: wrong #${i + 1} on big: ran out of steps`)
        else byOutput = true
      }
      need(
        r.wrongRuns!.length === 0 || byOutput,
        r.wrongRuns!.every((x) => !x.killed && x.why === null)
          ? 'big is too easy: every wrong solution passes it'
          : 'big is too easy: no wrong solution fails it by output; the others pass, run out of steps or time',
      )
      // Every surviving mutant is listed, not just the first. An entry bound to a line ("12: text") excuses that one
      // line; a bare-text entry still works, but only while it excuses survivors on a single line.
      let killed = 0
      const bad: string[] = []
      const bare = new Map<string, Set<number>>()
      for (const [k, m] of p.mutants.entries()) {
        if (r.dead![k]) {
          killed++
        } else if (p.equivalent.includes(`${m.line}: ${m.text}`)) {
          continue
        } else if (p.equivalent.includes(m.text)) {
          bare.set(m.text, (bare.get(m.text) ?? new Set()).add(m.line))
        } else {
          bad.push(`mutant survives (line ${m.line}: ${m.text}); add a test or widen gen, or list it under equivalent`)
        }
      }
      for (const [text, lines] of bare) {
        if (lines.size > 1) {
          const at = [...lines].join(', ')
          bad.push(`equivalent "${text}" excuses survivors on lines ${at}; list each as "<line>: ${text}" (one entry per line)`)
        }
      }
      need(bad.length === 0, bad.join(`\n${file}: `))
      console.log(`${name.slice(0, -3)}: ${killed} mutants killed`)
      if (p.bigSeconds !== null) console.log(`${name.slice(0, -3)}: big ran in ${p.bigSeconds.toFixed(2)} s of ${SOLUTION_LIMIT_S} s allowed`)
      if (p.minDistinct) console.log(`${name.slice(0, -3)}: min_distinct: ${p.minDistinct}`)
      if (p.noSlow) console.log(`${name.slice(0, -3)}: no_slow: ${p.noSlow}`)
      problems++
    }
    console.log(`interview ok: ${problems} problems`)
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e))
    process.exitCode = 1
  }
  process.exit()
}
