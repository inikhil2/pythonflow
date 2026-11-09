# 019: Progress store in localStorage, with pure reducers and a check script (task A3)
Files: app/utils/progress.ts, app/composables/useProgress.ts, scripts/check-progress.ts
Severity: high

## Problem
The app stores no progress. Later tasks (check answer, hints, resume code, lesson
completion, Today and Progress pages) all need one shared store. It lives in the
browser only, under the localStorage key `pythonflow:v1`, as JSON with a version field.
None of the three files exists yet.

Rules:
- `app/utils/progress.ts` holds the types and pure functions. Each `with...` function
  returns a new object and never changes its input. They take the time as an ISO
  string so tests are fixed.
- `app/composables/useProgress.ts` holds the one shared state and the storage. It reads
  storage only in the browser, after the component mounts, so prerendered HTML and the
  first client render match. Corrupt or unknown JSON starts fresh progress and never
  throws. Blocked storage (private mode) keeps progress in memory.
- Attempts are capped at the newest 500.

## Required change
1. Create `app/utils/progress.ts` with exactly this content:
```ts
export const STORAGE_KEY = 'pythonflow:v1'
export const MAX_ATTEMPTS = 500

export interface Attempt {
  id: string // exercise id
  at: string // ISO time
  passed: boolean
  category: string | null // 'NameError', 'Wrong output', 'Timeout', or null when passed
  concepts: string[]
}

export interface LessonProgress {
  openedAt: string
  completedAt?: string
}

export interface ExerciseProgress {
  code: string
  passedAt?: string
  hintsUsed: number
}

export interface Progress {
  version: 1
  name: string
  lessons: Record<string, LessonProgress> // key = lesson path
  exercises: Record<string, ExerciseProgress> // key = exercise id
  attempts: Attempt[] // newest last
}

export function emptyProgress(): Progress {
  return { version: 1, name: '', lessons: {}, exercises: {}, attempts: [] }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

// Returns null for anything that is not version 1 progress JSON.
export function parseProgress(text: string | null): Progress | null {
  if (!text) return null
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return null
  }
  if (!isObject(data) || data.version !== 1) return null
  return {
    version: 1,
    name: typeof data.name === 'string' ? data.name : '',
    lessons: isObject(data.lessons) ? (data.lessons as Progress['lessons']) : {},
    exercises: isObject(data.exercises) ? (data.exercises as Progress['exercises']) : {},
    attempts: Array.isArray(data.attempts) ? (data.attempts as Attempt[]) : [],
  }
}

function exercise(p: Progress, id: string): ExerciseProgress {
  return p.exercises[id] ?? { code: '', hintsUsed: 0 }
}

export function withLessonOpened(p: Progress, path: string, now: string): Progress {
  return { ...p, lessons: { ...p.lessons, [path]: { ...p.lessons[path], openedAt: now } } }
}

// The first completion time is kept.
export function withLessonCompleted(p: Progress, path: string, now: string): Progress {
  const lesson = p.lessons[path]
  if (lesson?.completedAt) return p
  return { ...p, lessons: { ...p.lessons, [path]: { openedAt: lesson?.openedAt ?? now, completedAt: now } } }
}

export function withCode(p: Progress, id: string, code: string): Progress {
  return { ...p, exercises: { ...p.exercises, [id]: { ...exercise(p, id), code } } }
}

export function withHint(p: Progress, id: string): Progress {
  const ex = exercise(p, id)
  return { ...p, exercises: { ...p.exercises, [id]: { ...ex, hintsUsed: ex.hintsUsed + 1 } } }
}

// A passing attempt also marks the exercise passed; the first pass time is kept.
export function withAttempt(p: Progress, attempt: Attempt): Progress {
  const attempts = [...p.attempts, attempt].slice(-MAX_ATTEMPTS)
  if (!attempt.passed) return { ...p, attempts }
  const ex = exercise(p, attempt.id)
  return {
    ...p,
    attempts,
    exercises: { ...p.exercises, [attempt.id]: { ...ex, passedAt: ex.passedAt ?? attempt.at } },
  }
}

export function withName(p: Progress, name: string): Progress {
  return { ...p, name: name.trim() }
}
```

2. Create `app/composables/useProgress.ts` with exactly this content. The functions
   from `app/utils/progress.ts` and `ref`, `readonly`, `onMounted`,
   `getCurrentInstance` are auto-imported by Nuxt; only the types are imported.
```ts
import type { Attempt, Progress } from '~/utils/progress'

// One state for the whole app.
const state = ref<Progress>(emptyProgress())
let loaded = false

function load() {
  if (loaded) return
  loaded = true
  try {
    state.value = parseProgress(localStorage.getItem(STORAGE_KEY)) ?? emptyProgress()
  } catch {
    // Storage is blocked (private mode): progress lives in memory for this visit.
  }
}

function update(change: (p: Progress) => Progress) {
  if (!import.meta.client) return
  load()
  state.value = change(state.value)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  } catch {
    // Storage is blocked or full: keep the in-memory copy.
  }
}

export function useProgress() {
  // Read storage after mount so the prerendered HTML and the first render match.
  if (import.meta.client && getCurrentInstance()) onMounted(load)
  const now = () => new Date().toISOString()

  return {
    progress: readonly(state),
    openLesson: (path: string) => update((p) => withLessonOpened(p, path, now())),
    completeLesson: (path: string) => update((p) => withLessonCompleted(p, path, now())),
    saveCode: (id: string, code: string) => update((p) => withCode(p, id, code)),
    revealHint: (id: string) => update((p) => withHint(p, id)),
    recordAttempt: (attempt: Attempt) => update((p) => withAttempt(p, attempt)),
    setName: (name: string) => update((p) => withName(p, name)),
    exportJson: () => JSON.stringify(state.value, null, 2),
    // Returns false and changes nothing when the text is not PythonFlow progress.
    importJson(text: string): boolean {
      const imported = parseProgress(text)
      if (!imported) return false
      update(() => imported)
      return true
    },
    reset: () => update(() => emptyProgress()),
  }
}
```

3. Create `scripts/check-progress.ts` with exactly this content:
```ts
import assert from 'node:assert/strict'
import {
  MAX_ATTEMPTS, emptyProgress, parseProgress,
  withAttempt, withCode, withHint, withLessonCompleted, withLessonOpened, withName,
} from '../app/utils/progress.ts'

const T1 = '2026-10-01T10:00:00.000Z'
const T2 = '2026-10-02T10:00:00.000Z'
const lesson = '/learn/week0-functions/01-hello'
const attempt = (passed: boolean, at = T1) =>
  ({ id: 'w0-l1-ex1', at, passed, category: passed ? null : 'Wrong output', concepts: [] })

// Parsing: bad input gives null, good input round-trips.
assert.equal(parseProgress(null), null)
assert.equal(parseProgress(''), null)
assert.equal(parseProgress('not json'), null)
assert.equal(parseProgress('[]'), null)
assert.equal(parseProgress('{"version":2}'), null)
assert.deepEqual(parseProgress('{"version":1}'), emptyProgress())
const opened = withLessonOpened(emptyProgress(), lesson, T1)
assert.deepEqual(parseProgress(JSON.stringify(opened)), opened)

// Lessons: opening updates openedAt; the first completion time is kept.
assert.equal(opened.lessons[lesson].openedAt, T1)
assert.equal(withLessonOpened(opened, lesson, T2).lessons[lesson].openedAt, T2)
const done = withLessonCompleted(opened, lesson, T1)
assert.equal(withLessonCompleted(done, lesson, T2).lessons[lesson].completedAt, T1)
assert.equal(withLessonCompleted(emptyProgress(), lesson, T2).lessons[lesson].openedAt, T2)

// Exercises: code and hints.
const coded = withCode(emptyProgress(), 'w0-l1-ex1', 'print(1)')
assert.deepEqual(coded.exercises['w0-l1-ex1'], { code: 'print(1)', hintsUsed: 0 })
assert.equal(withHint(withHint(coded, 'w0-l1-ex1'), 'w0-l1-ex1').exercises['w0-l1-ex1'].hintsUsed, 2)
assert.equal(withHint(emptyProgress(), 'other').exercises.other.hintsUsed, 1)

// Attempts: a fail does not pass; the first pass time is kept; the list is capped.
assert.equal(withAttempt(emptyProgress(), attempt(false)).exercises['w0-l1-ex1'], undefined)
const passed = withAttempt(withAttempt(emptyProgress(), attempt(true, T1)), attempt(true, T2))
assert.equal(passed.exercises['w0-l1-ex1'].passedAt, T1)
let many = emptyProgress()
for (let i = 0; i < MAX_ATTEMPTS + 10; i++) many = withAttempt(many, attempt(false, String(i)))
assert.equal(many.attempts.length, MAX_ATTEMPTS)
assert.equal(many.attempts.at(-1)?.at, String(MAX_ATTEMPTS + 9))

// Name is trimmed; reducers never change their input.
assert.equal(withName(emptyProgress(), '  Sam ').name, 'Sam')
const before = emptyProgress()
withCode(before, 'x', 'y')
withAttempt(before, attempt(true))
assert.deepEqual(before, emptyProgress())

console.log('ok')
```

## Acceptance gates
- `node scripts/check-progress.ts` (run from `cs50p-tutor/`, Node 24) prints exactly `ok`.
- `npm run generate` exits 0.
- `grep -c "localStorage" app/composables/useProgress.ts` prints 2.
