# 066: Project checker and the calculator project (shell step, tasks D3 and D7)
Files: scripts/check-projects.ts, content/projects/01-calculator.yml
Severity: med

## Why a shell step
Project files are long YAML with Python inside, and one wrong space changes the meaning.
Heredocs write them exactly.

Each project is one file, `content/projects/NN-<slug>.yml`. It has `slug`, `title`,
`summary`, `icon` (a lucide name), `requires` (concept ids), `afterWeek`, optional `note`,
and `milestones`. Each milestone has `id`, `title`, `prompt`, `starter`, `tests`, `hints` and
`solution`. Each starter is the previous milestone's solution, so the learner builds
one program step by step. Nothing is locked: `afterWeek` and `requires` are advice only.

`scripts/check-projects.ts` is the gate for every project. It runs each milestone in
Pyodide the way `public/pyodide-worker.js` and `useChecker` do. Every solution must pass
all its tests, and every starter must fail at least one. It also checks the file names,
the required fields, the concept ids and that milestone ids are unique. It checks that every
text is a string, because a hint ending in `:` parses as a YAML mapping.

Do this after shell step 064.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`:

```sh
mkdir -p content/projects
cat > 'scripts/check-projects.ts' <<'EOF_TS'
// Runs every project milestone in Pyodide the way the app's checker does:
// each solution must pass all its tests, and each starter must fail at least one.
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { loadPyodide } from 'pyodide'
import { parse } from 'yaml'
import { sameOutput } from '../app/utils/compareOutput.ts'

type TestCase = { stdin?: string; stdout?: string; check?: string }
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

const pyodide = await loadPyodide()
const decoder = new TextDecoder()

// Same as run() in public/pyodide-worker.js: fresh globals, stdin by line, buffers flushed.
async function run(code: string, stdin: string) {
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
async function failure(code: string, test: TestCase): Promise<string | null> {
  const r = await run(test.check ? code + '\n' + test.check : code, test.stdin ?? '')
  if (r.error) return r.error
  if (test.check === undefined && !sameOutput(test.stdout ?? '', r.stdout)) return `printed ${JSON.stringify(r.stdout)}`
  return null
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
EOF_TS
cat > 'content/projects/01-calculator.yml' <<'EOF_YML'
slug: calculator
title: Calculator
summary: Read two numbers and an operator, then print the answer, without crashing on division by zero.
icon: calculator
requires: [input, numbers, conditionals]
afterWeek: 1
milestones:
  - id: calculator-1
    title: Read two numbers
    prompt: >-
      Ask for two numbers with input("First number: ") and input("Second number: "),
      and turn each answer into a float. Then print "You entered", the first number,
      "and", and the second number, for example: You entered 3.0 and 4.5
    starter: |
      # Ask for two numbers, then print them back.
    tests:
      - stdin: "3\n4.5"
        stdout: "First number: Second number: You entered 3.0 and 4.5"
      - stdin: "-2\n10"
        stdout: "First number: Second number: You entered -2.0 and 10.0"
    hints:
      - input() always returns a string. float() turns "3" into 3.0.
      - An f-string puts values into text, for example f"You entered {x} and {y}".
    solution: |
      x = float(input("First number: "))
      y = float(input("Second number: "))
      print(f"You entered {x} and {y}")
  - id: calculator-2
    title: Add them
    prompt: >-
      Your program so far is in the editor. Instead of repeating the numbers, print
      the addition, for example: 3.0 + 4.5 = 7.5
    starter: |
      x = float(input("First number: "))
      y = float(input("Second number: "))
      print(f"You entered {x} and {y}")
    tests:
      - stdin: "3\n4.5"
        stdout: "First number: Second number: 3.0 + 4.5 = 7.5"
      - stdin: "-2\n10"
        stdout: "First number: Second number: -2.0 + 10.0 = 8.0"
    hints:
      - You can do arithmetic inside the braces of an f-string, for example {x + y}.
    solution: |
      x = float(input("First number: "))
      y = float(input("Second number: "))
      print(f"{x} + {y} = {x + y}")
  - id: calculator-3
    title: Choose an operator
    prompt: >-
      After the two numbers, ask for an operator with input("Operator: "). Use if and
      elif to handle +, -, * and /, and print the calculation the same way, for example:
      3.0 * 4.5 = 13.5. For any other operator, print Unknown operator
    starter: |
      x = float(input("First number: "))
      y = float(input("Second number: "))
      print(f"{x} + {y} = {x + y}")
    tests:
      - stdin: "3\n4.5\n*"
        stdout: "First number: Second number: Operator: 3.0 * 4.5 = 13.5"
      - stdin: "10\n4\n/"
        stdout: "First number: Second number: Operator: 10.0 / 4.0 = 2.5"
      - stdin: "7\n2\n-"
        stdout: "First number: Second number: Operator: 7.0 - 2.0 = 5.0"
      - stdin: "3\n4.5\n+"
        stdout: "First number: Second number: Operator: 3.0 + 4.5 = 7.5"
      - stdin: "1\n2\n%"
        stdout: "First number: Second number: Operator: Unknown operator"
    hints:
      - Compare the operator with ==, as in op == "+".
      - The last branch, else, catches every operator you did not list.
    solution: |
      x = float(input("First number: "))
      y = float(input("Second number: "))
      op = input("Operator: ")
      if op == "+":
          print(f"{x} + {y} = {x + y}")
      elif op == "-":
          print(f"{x} - {y} = {x - y}")
      elif op == "*":
          print(f"{x} * {y} = {x * y}")
      elif op == "/":
          print(f"{x} / {y} = {x / y}")
      else:
          print("Unknown operator")
  - id: calculator-4
    title: Guard against division by zero
    prompt: >-
      Dividing by 0 stops the program with ZeroDivisionError. When the operator is /
      and the second number is 0, print You cannot divide by zero. instead. Every
      other sum works as before.
    starter: |
      x = float(input("First number: "))
      y = float(input("Second number: "))
      op = input("Operator: ")
      if op == "+":
          print(f"{x} + {y} = {x + y}")
      elif op == "-":
          print(f"{x} - {y} = {x - y}")
      elif op == "*":
          print(f"{x} * {y} = {x * y}")
      elif op == "/":
          print(f"{x} / {y} = {x / y}")
      else:
          print("Unknown operator")
    tests:
      - stdin: "5\n0\n/"
        stdout: "First number: Second number: Operator: You cannot divide by zero."
      - stdin: "10\n4\n/"
        stdout: "First number: Second number: Operator: 10.0 / 4.0 = 2.5"
      - stdin: "5\n0\n*"
        stdout: "First number: Second number: Operator: 5.0 * 0.0 = 0.0"
    hints:
      - Check the second number inside the / branch, before you divide.
      - 0.0 == 0 is True in Python, so y == 0 works for floats too.
    solution: |
      x = float(input("First number: "))
      y = float(input("Second number: "))
      op = input("Operator: ")
      if op == "+":
          print(f"{x} + {y} = {x + y}")
      elif op == "-":
          print(f"{x} - {y} = {x - y}")
      elif op == "*":
          print(f"{x} * {y} = {x * y}")
      elif op == "/":
          if y == 0:
              print("You cannot divide by zero.")
          else:
              print(f"{x} / {y} = {x / y}")
      else:
          print("Unknown operator")
EOF_YML
node scripts/check-projects.ts
```

## Acceptance gates
1. Sizes:
   wc -c "scripts/check-projects.ts"   # expect 3899
   wc -c "content/projects/01-calculator.yml"   # expect 5047
2. `node scripts/check-projects.ts` prints `projects ok: 1 projects, 4 milestones`.
3. `git status --short` shows only the two new files.
4. Commit as "Shell 066: project checker and calculator project".
