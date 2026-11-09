export type TestCase = { stdin?: string; stdout: string } | { stdin?: string; check: string }

export interface CaseResult {
  passed: boolean
  expected: string | null // null for a check case
  actual: string
  error: string | null
  timedOut: boolean
  input: string | null // a check line short enough to show, so a timeout can name the input it was on
}

export function useChecker() {
  const { run } = usePython()
  const checking = ref(false)

  async function check(code: string, tests: TestCase[], prelude = ''): Promise<CaseResult[]> {
    checking.value = true
    const results: CaseResult[] = []
    try {
      for (const test of tests) {
        const isCheck = 'check' in test
        const r = await run(isCheck ? code + '\n' + test.check : code, test.stdin ?? '', prelude)
        const expected = isCheck ? null : test.stdout
        const passed = !r.error && (expected === null || sameOutput(expected, r.stdout))
        results.push({ passed, expected, actual: r.stdout, error: r.error, timedOut: r.timedOut, input: r.timedOut && r.input ? r.input : isCheck && /^[^\n]{1,200}$/.test(test.check) ? test.check : null })
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
