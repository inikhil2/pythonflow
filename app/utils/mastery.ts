import type { Attempt, ExerciseProgress, LessonProgress } from '~/utils/progress'

export interface DayCount {
  date: string // local YYYY-MM-DD
  label: string // short weekday, e.g. "Fri"
  count: number
}

export interface LessonEvent {
  kind: 'opened' | 'completed'
  path: string
  at: string
}

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Attempts per local day for the 7 days ending on today, oldest first.
export function activity(attempts: readonly Pick<Attempt, 'at'>[], today: Date): DayCount[] {
  const days = Array.from({ length: 7 }, (_, i) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + i))
  const counts = new Map(days.map((d) => [dayKey(d), 0]))
  for (const attempt of attempts) {
    const key = dayKey(new Date(attempt.at))
    const count = counts.get(key)
    if (count !== undefined) counts.set(key, count + 1)
  }
  return days.map((d) => ({
    date: dayKey(d),
    label: d.toLocaleDateString('en', { weekday: 'short' }),
    count: counts.get(dayKey(d)) ?? 0,
  }))
}

// The 5 newest lesson events, newest first.
export function recentEvents(lessons: Readonly<Record<string, Readonly<LessonProgress>>>): LessonEvent[] {
  return Object.entries(lessons)
    .flatMap(([path, lesson]): LessonEvent[] => [
      ...(lesson.completedAt ? [{ kind: 'completed' as const, path, at: lesson.completedAt }] : []),
      { kind: 'opened', path, at: lesson.openedAt },
    ])
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5)
}

export interface Concept {
  id: string
  title: string
  week: number
  group: string
  requires: string[]
}

export type ConceptStatus = 'not-started' | 'in-progress' | 'needs-revision' | 'mastered'

// The Progress page lists concept groups in this order.
export const GROUPS = [
  'Python basics',
  'Control flow',
  'Data structures',
  'Functions',
  'Errors and testing',
  'Files and text',
  'Objects',
  'Going further',
]

// What the rules need from a lesson: the concepts it teaches and its exercise ids.
export interface LessonRef {
  path: string
  title: string
  concepts: string[]
  exercises: string[]
}

export interface QueueItem {
  exercise: string
  number: number // 1-based place of the exercise in its lesson
  path: string // lesson path
  title: string // lesson title
  reason: string
}

export interface Step {
  to: string
  title: string
  reason: string
}

export interface MistakeCount {
  category: string
  recent: number // the last 7 days, today included
  before: number // the 7 days before those
  lastAt: string
}

// Only these parts of stored progress are read, so readonly progress fits.
interface Stored {
  lessons: Readonly<Record<string, Readonly<LessonProgress>>>
  exercises: Readonly<Record<string, Readonly<Pick<ExerciseProgress, 'passedAt' | 'hintsUsed'>>>>
  attempts: readonly Readonly<Pick<Attempt, 'id' | 'at' | 'passed' | 'category'>>[]
}

const taggedExercises = (lessons: readonly LessonRef[], conceptId: string) =>
  lessons.filter((l) => l.concepts.includes(conceptId)).flatMap((l) => l.exercises)

// The Progress page states these rules in a footnote.
export function conceptStatus(p: Stored, conceptId: string, lessons: readonly LessonRef[]): ConceptStatus {
  const ids = taggedExercises(lessons, conceptId)
  const tries = p.attempts.filter((a) => ids.includes(a.id))
  if (tries.slice(-3).filter((a) => !a.passed).length >= 2) return 'needs-revision'
  const allPassed = ids.every((id) => p.exercises[id]?.passedAt)
  if (ids.length > 0 && allPassed && ids.some((id) => p.exercises[id]?.hintsUsed === 0)) return 'mastered'
  return tries.length > 0 ? 'in-progress' : 'not-started'
}

// The practice queue: every exercise of a concept that needs revision, then the unpassed
// exercises of opened lessons. Course order, no repeats.
export function recommendations(p: Stored, lessons: readonly LessonRef[], concepts: readonly Concept[]): QueueItem[] {
  const items: QueueItem[] = []
  const add = (lesson: LessonRef, reason: string, keep: (id: string) => boolean) => {
    lesson.exercises.forEach((exercise, i) => {
      if (keep(exercise) && !items.some((item) => item.exercise === exercise)) {
        items.push({ exercise, number: i + 1, path: lesson.path, title: lesson.title, reason })
      }
    })
  }
  for (const c of concepts) {
    if (conceptStatus(p, c.id, lessons) !== 'needs-revision') continue
    const reason = `Revise ${c.title}: at least 2 of your last 3 tries failed.`
    for (const lesson of lessons) if (lesson.concepts.includes(c.id)) add(lesson, reason, () => true)
  }
  for (const lesson of lessons) {
    if (p.lessons[lesson.path]) add(lesson, 'Not passed yet in a lesson you opened.', (id) => !p.exercises[id]?.passedAt)
  }
  return items
}

// A concept that needs revision, else the lesson after the last completed one, else null.
export function nextStep(p: Stored, lessons: readonly LessonRef[], concepts: readonly Concept[]): Step | null {
  for (const c of concepts) {
    const lesson = lessons.find((l) => l.concepts.includes(c.id))
    if (lesson && conceptStatus(p, c.id, lessons) === 'needs-revision') {
      return { to: lesson.path, title: `Revise ${c.title}`, reason: `At least 2 of your last 3 tries on ${c.title} failed.` }
    }
  }
  let last = -1
  lessons.forEach((l, i) => {
    if (p.lessons[l.path]?.completedAt) last = i
  })
  const next = lessons[last + 1]
  if (!next) return null
  const reason = last === -1 ? 'The first lesson of the course.' : `It comes after ${lessons[last]?.title}.`
  return { to: next.path, title: next.title, reason }
}

// Failed attempts by category, the category seen most recently first.
export function mistakes(attempts: Stored['attempts'], today: Date): MistakeCount[] {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).getTime()
  const before = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13).getTime()
  const byCategory = new Map<string, MistakeCount>()
  for (const a of attempts) {
    if (a.passed || !a.category) continue
    const count = byCategory.get(a.category) ?? { category: a.category, recent: 0, before: 0, lastAt: a.at }
    const t = new Date(a.at).getTime()
    if (t >= start) count.recent += 1
    else if (t >= before) count.before += 1
    if (a.at > count.lastAt) count.lastAt = a.at
    byCategory.set(a.category, count)
  }
  return [...byCategory.values()].sort((a, b) => b.lastAt.localeCompare(a.lastAt))
}

// How many exercises were first passed on today's local date.
export function passedToday(exercises: Stored['exercises'], today: Date): number {
  return Object.values(exercises).filter((e) => e.passedAt && dayKey(new Date(e.passedAt)) === dayKey(today)).length
}
