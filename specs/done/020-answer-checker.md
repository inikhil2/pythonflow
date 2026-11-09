# 020: Answer checker that runs an exercise's tests, with a check script (task A4)
Files: app/utils/compareOutput.ts, app/composables/useChecker.ts, scripts/check-compare.ts
Severity: high

## Problem
Exercises have `tests` in their frontmatter, but nothing runs them. A test case is
either:
- `{ stdin, stdout }`: run the learner's code with that input; it passes when there is no
  error and the output matches `stdout`, ignoring trailing spaces on each line and
  trailing blank lines (rule from `docs/lesson-format.md`); or
- `{ check }`: run the learner's code followed by a newline and the `check` Python
  (for example `assert square(3) == 9`); it passes when nothing raises.

Cases run one at a time through `usePython().run`, because there is one worker.
A stop or a timeout ends the check early. The failure category (stored with each
attempt in a later task) is `'Timeout'`, the exception name (`'NameError'`), or
`'Wrong output'`. None of the three files exists yet. Task A5 adds the button that uses
this.

## Required change
1. Create `app/utils/compareOutput.ts` with exactly this content:
```ts
// Trailing spaces on each line and trailing blank lines are ignored; all else must match.
export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trimEnd()
}

export function sameOutput(expected: string, actual: string): boolean {
  return normalizeOutput(expected) === normalizeOutput(actual)
}

interface CaseOutcome {
  passed: boolean
  error: string | null
  timedOut: boolean
}

// The category of the first failed case, or null when every case passed.
export function failureCategory(results: CaseOutcome[]): string | null {
  const failed = results.find((r) => !r.passed)
  if (!failed) return null
  if (failed.timedOut) return 'Timeout'
  if (failed.error) return failed.error.split(':')[0].trim()
  return 'Wrong output'
}
```

2. Create `app/composables/useChecker.ts` with exactly this content. `usePython`,
   `sameOutput` and `ref` are auto-imported by Nuxt.
```ts
export type TestCase = { stdin?: string; stdout: string } | { stdin?: string; check: string }

export interface CaseResult {
  passed: boolean
  expected: string | null // null for a check case
  actual: string
  error: string | null
  timedOut: boolean
}

export function useChecker() {
  const { run } = usePython()
  const checking = ref(false)

  async function check(code: string, tests: TestCase[]): Promise<CaseResult[]> {
    checking.value = true
    const results: CaseResult[] = []
    try {
      for (const test of tests) {
        const isCheck = 'check' in test
        const r = await run(isCheck ? code + '\n' + test.check : code, test.stdin ?? '')
        const expected = isCheck ? null : test.stdout
        const passed = !r.error && (expected === null || sameOutput(expected, r.stdout))
        results.push({ passed, expected, actual: r.stdout, error: r.error, timedOut: r.timedOut })
        // Later cases would hit the same stop or wait 10 seconds each.
        if (r.timedOut || r.error === 'Stopped.') break
      }
    } finally {
      checking.value = false
    }
    return results
  }

  return { checking, check }
}
```

3. Create `scripts/check-compare.ts` with exactly this content:
```ts
import assert from 'node:assert/strict'
import { failureCategory, normalizeOutput, sameOutput } from '../app/utils/compareOutput.ts'

// Output comparison.
assert.ok(sameOutput('hello, world', 'hello, world\n'))
assert.ok(sameOutput('a\nb', 'a  \nb\n\n'))
assert.ok(sameOutput('a\nb', 'a\r\nb\r\n'))
assert.ok(!sameOutput('hello, world', 'Hello, world'))
assert.ok(!sameOutput('a b', 'a  b'))
assert.ok(!sameOutput('a\nb', 'a\n\nb'))
assert.ok(!sameOutput('x', ' x'))
assert.equal(normalizeOutput('Name: hi Bob \n'), 'Name: hi Bob')

// Failure category.
const pass = { passed: true, error: null, timedOut: false }
assert.equal(failureCategory([]), null)
assert.equal(failureCategory([pass, pass]), null)
assert.equal(failureCategory([pass, { passed: false, error: null, timedOut: false }]), 'Wrong output')
assert.equal(failureCategory([{ passed: false, error: "NameError: name 'x' is not defined", timedOut: false }]), 'NameError')
assert.equal(failureCategory([{ passed: false, error: 'AssertionError', timedOut: false }]), 'AssertionError')
assert.equal(failureCategory([{ passed: false, error: 'Your program ran for more than 10 seconds and was stopped. Is there an infinite loop?', timedOut: true }]), 'Timeout')

console.log('ok')
```

## Acceptance gates
- `node scripts/check-compare.ts` (run from `cs50p-tutor/`, Node 24) prints exactly `ok`.
- `npm run generate` exits 0.
- `grep -n "'check' in test" app/composables/useChecker.ts` prints one line.
