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
  if (failed.error) return (failed.error.split(':')[0] ?? '').trim()
  return 'Wrong output'
}
