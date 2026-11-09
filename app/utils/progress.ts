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
