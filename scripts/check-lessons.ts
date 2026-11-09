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

const folders = readdirSync(root).filter((f) => /^week\d+-/.test(f)).sort()
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
    assert.equal(meta.week, Number(folder.split('-')[0].slice(4)), `${name}: week must match the folder`)
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
