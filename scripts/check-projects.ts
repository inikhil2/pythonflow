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
