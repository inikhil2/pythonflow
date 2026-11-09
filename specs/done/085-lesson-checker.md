# 085: Shared Pyodide runner and a lesson checker (before content tasks T9 to T18)
Files: scripts/pyRunner.ts, scripts/check-projects.ts, scripts/check-lessons.ts
Severity: high

## Problem
plan.md requires, for every content week, that each exercise's reference solution
passes its own tests. Projects have `scripts/check-projects.ts`, but nothing checks lesson
exercises, so a wrong lesson would ship silently.

`check-lessons.ts` reads every `content/week<N>-*/*.md` and enforces
`docs/lesson-format.md`:
- frontmatter: a title; a week that matches the folder and `weeks.yml`; an order that
  matches the file number; concepts that exist in `concepts.yml`;
- the body does not start with a `#` heading;
- at least one exercise per lesson;
- each exercise id is unique and shaped `w<week>-l<order>-ex<n>`;
- each exercise's texts are strings;
- each solution passes every test, and each starter fails at least one;
- every trace block runs without an error.

The Pyodide runner moves out of `check-projects.ts` into `scripts/pyRunner.ts`, so both
checkers run code exactly the same way. `check-projects.ts` loses its copy and imports it.

## Required change
1. **Create `scripts/pyRunner.ts`** with exactly this content.
```ts
// Runs Python in Pyodide the way the app's checker does, for the content check scripts.
import { loadPyodide } from 'pyodide'
import { sameOutput } from '../app/utils/compareOutput.ts'

export type TestCase = { stdin?: string; stdout?: string; check?: string }

const pyodide = await loadPyodide()
const decoder = new TextDecoder()

// Same as run() in public/pyodide-worker.js: fresh globals, stdin by line, buffers flushed.
export async function run(code: string, stdin: string) {
  let stdout = ''
  const lines = stdin ? stdin.split('\n') : []
  pyodide.setStdout({ write: (buf: Uint8Array) => { stdout += decoder.decode(buf); return buf.length } })
  pyodide.setStderr({ write: (buf: Uint8Array) => buf.length })
  pyodide.setStdin({ stdin: () => lines.shift() })
  let error: string | null = null
  const globals = pyodide.globals.get('dict')()
  try {
    await pyodide.runPythonAsync(code, { globals, filename: 'main.py' })
  } catch (e) {
    error = String(e instanceof Error ? e.message : e).trimEnd().split('\n').pop() ?? 'Error'
  } finally {
    pyodide.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()')
    globals.destroy()
  }
  return { stdout, error }
}

// Same rule as useChecker: a check case appends its code; a stdout case compares output.
export async function failure(code: string, test: TestCase): Promise<string | null> {
  const r = await run(test.check ? code + '\n' + test.check : code, test.stdin ?? '')
  if (r.error) return r.error
  if (test.check === undefined && !sameOutput(test.stdout ?? '', r.stdout)) return `printed ${JSON.stringify(r.stdout)}`
  return null
}
```

2. **Replace the whole of `scripts/check-projects.ts`** with exactly this content. Delete everything in the file first.
```ts
// Runs every project milestone in Pyodide the way the app's checker does:
// each solution must pass all its tests, and each starter must fail at least one.
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { failure, type TestCase } from './pyRunner.ts'

interface Milestone {
  id: string
  title: string
  prompt: string
  starter: string
  tests: TestCase[]
  hints: string[]
  solution: string
}
interface Project {
  slug: string
  title: string
  summary: string
  icon: string
  requires: string[]
  afterWeek: number
  milestones: Milestone[]
}

const read = (path: string) => parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const concepts = new Set((read('../content/concepts.yml').concepts as { id: string }[]).map((c) => c.id))
const files = readdirSync(new URL('../content/projects/', import.meta.url)).filter((f) => f.endsWith('.yml')).sort()
const ids = new Set<string>()
let milestones = 0

for (const file of files) {
  const p = read('../content/projects/' + file) as Project
  assert.equal(file.replace(/^\d+-/, ''), p.slug + '.yml', `${file}: the file name must end in the slug`)
  assert.ok(p.title && p.summary && p.icon && p.afterWeek >= 0, `${file}: title, summary, icon and afterWeek are required`)
  for (const c of p.requires) assert.ok(concepts.has(c), `${file}: ${c} is not in content/concepts.yml`)
  for (const m of p.milestones) {
    assert.ok(m.id.startsWith(p.slug + '-') && !ids.has(m.id), `${m.id}: ids must be unique and start with ${p.slug}-`)
    ids.add(m.id)
    assert.ok(m.title && m.prompt && m.tests.length > 0 && m.hints.length > 0, `${m.id}: title, prompt, tests and hints are required`)
    // A stray ": " in YAML turns a hint or prompt into a mapping.
    assert.ok([m.title, m.prompt, m.starter, m.solution, ...m.hints].every((t) => typeof t === 'string'), `${m.id}: every text must be a string`)
    for (const [i, test] of m.tests.entries()) {
      const why = await failure(m.solution, test)
      assert.equal(why, null, `${m.id}: the solution fails test ${i + 1}: ${why}`)
    }
    const starterFails = []
    for (const test of m.tests) starterFails.push(await failure(m.starter, test))
    assert.ok(starterFails.some((why) => why !== null), `${m.id}: the starter already passes every test`)
    milestones++
  }
}

console.log(`projects ok: ${files.length} projects, ${milestones} milestones`)
```

3. **Create `scripts/check-lessons.ts`** with exactly this content.
```ts
// Checks every lesson the way docs/lesson-format.md describes it, and runs its Python in Pyodide:
// each exercise solution must pass all its tests, each starter must fail one, and each trace must run.
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { failure, run, type TestCase } from './pyRunner.ts'

interface Exercise {
  id: string
  prompt: string
  starter?: string
  hints?: string[]
  tests: TestCase[]
  solution: string
}

const root = new URL('../content/', import.meta.url)
const read = (path: string) => readFileSync(new URL(path, root), 'utf8')
const weeks = new Set((parse(read('weeks.yml')).weeks as { week: number }[]).map((w) => w.week))
const concepts = new Set((parse(read('concepts.yml')).concepts as { id: string }[]).map((c) => c.id))
// A block's YAML sits between "::name\n---\n" and "\n---\n::".
const blocks = (body: string, name: string) =>
  [...body.matchAll(new RegExp(`^::${name}\\n---\\n([\\s\\S]*?)\\n---\\n::$`, 'gm'))].map((m) => parse(m[1]))

const folders = readdirSync(root).filter((f) => /^week\d-/.test(f)).sort()
const ids = new Set<string>()
let lessons = 0
let exercises = 0

for (const folder of folders) {
  for (const file of readdirSync(new URL(folder + '/', root)).filter((f) => f.endsWith('.md')).sort()) {
    const name = `${folder}/${file}`
    const [, front, body] = read(name).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? []
    assert.ok(front !== undefined && body !== undefined, `${name}: the file must start with --- frontmatter ---`)
    const meta = parse(front) as { title?: string; week?: number; order?: number; concepts?: string[] }
    assert.ok(meta.title, `${name}: title is required`)
    assert.equal(meta.week, Number(folder[4]), `${name}: week must match the folder`)
    assert.ok(weeks.has(meta.week), `${name}: week ${meta.week} is not in content/weeks.yml`)
    assert.equal(meta.order, Number(file.split('-')[0]), `${name}: order must match the file number`)
    for (const c of meta.concepts ?? []) assert.ok(concepts.has(c), `${name}: ${c} is not in content/concepts.yml`)
    assert.ok(!/^\s*# /.test(body), `${name}: the page shows the title, so the body must not start with a # heading`)

    const found = blocks(body, 'exercise') as Exercise[]
    assert.ok(found.length > 0, `${name}: a lesson needs at least one exercise`)
    for (const ex of found) {
      assert.match(ex.id, new RegExp(`^w${meta.week}-l${meta.order}-ex\\d+$`), `${name}: ${ex.id} must look like w${meta.week}-l${meta.order}-ex1`)
      assert.ok(!ids.has(ex.id), `${ex.id}: ids must be unique`)
      ids.add(ex.id)
      assert.ok(ex.prompt && ex.solution && ex.tests?.length > 0, `${ex.id}: prompt, tests and solution are required`)
      // A stray ": " in YAML turns a hint or prompt into a mapping.
      assert.ok([ex.prompt, ex.starter ?? '', ex.solution, ...(ex.hints ?? [])].every((t) => typeof t === 'string'), `${ex.id}: every text must be a string`)
      for (const [i, test] of ex.tests.entries()) {
        const why = await failure(ex.solution, test)
        assert.equal(why, null, `${ex.id}: the solution fails test ${i + 1}: ${why}`)
      }
      const starterFails = []
      for (const test of ex.tests) starterFails.push(await failure(ex.starter ?? '', test))
      assert.ok(starterFails.some((why) => why !== null), `${ex.id}: the starter already passes every test`)
      exercises++
    }
    for (const trace of blocks(body, 'trace') as { code: string }[]) {
      const r = await run(trace.code, '')
      assert.equal(r.error, null, `${name}: a trace fails: ${r.error}`)
    }
    lessons++
  }
}

console.log(`lessons ok: ${lessons} lessons, ${exercises} exercises`)
```

Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components. The `.ts` extensions in script imports are required: Node runs them directly.

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 1 lessons, 1 exercises`.
2. `node scripts/check-projects.ts` still prints `projects ok: 5 projects, 22 milestones`.
3. `grep -c "loadPyodide" scripts/check-projects.ts` gives 0.
4. File sizes match:
```sh
   wc -c "scripts/pyRunner.ts"   # expect 1618
   wc -c "scripts/check-projects.ts"   # expect 2447
   wc -c "scripts/check-lessons.ts"   # expect 3740
```
5. `git status --short` lists only these three files.
