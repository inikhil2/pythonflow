# 046: Mastery rules, the practice queue, the next step and mistake counts (task B2)
Files: app/utils/mastery.ts, scripts/check-mastery.ts, app/components/StatusChip.vue
Severity: med

## Problem
The Progress, Practice and Today pages need rules that are pure functions of the stored
progress and the course. The rules come from the proposal's honesty table:
- **Needs revision:** 2 or more of the concept's last 3 attempts failed.
- **Mastered:** every exercise tagged with the concept has passed, and at least one of them
  without hints.
- **In progress:** any attempt on one of its exercises. Otherwise **Not started**.
- **Practice queue:** the exercises of concepts that need revision come first, then the
  unpassed exercises in opened lessons. Each item says why it is there.
- **Recommended next:** a concept that needs revision. Otherwise, the next lesson in
  order after the last completed one. The text names the reason.
- **Mistakes:** failed attempts counted by category, for the last 7 days against the 7
  days before, with the last date.
- **Exercises passed today:** exercises whose `passedAt` falls on today's local date.

An exercise belongs to a concept when its lesson lists that concept (spec 045). Stored
attempts have a `concepts` field, but it is always `[]`. These rules ignore it and look
the exercise up in the course, so renaming a lesson's concepts also updates past
attempts.

`StatusChip` gets the two concept states, "Needs revision" and "Mastered".

Do this spec after 045.

## Required change
1. **Replace the whole of `app/utils/mastery.ts`** with exactly this content. The first
   half is the current file without changes. Node runs this file directly (the
   `import type` line is removed when it runs), so use only plain type annotations.
```ts
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
```

2. **Replace the whole of `scripts/check-mastery.ts`** with exactly this content. The
   first part is the current file without changes. It adds the 6 fixed cases for the
   rules, and the mistakes case.
```ts
import assert from 'node:assert/strict'
import { activity, conceptStatus, mistakes, nextStep, passedToday, recentEvents, recommendations } from '../app/utils/mastery.ts'

// Built from local times, so the check passes in any time zone.
const at = (day: number, hour = 12) => new Date(2026, 9, day, hour).toISOString()
const today = new Date(2026, 9, 23, 9) // Friday 23 October 2026

const days = activity([{ at: at(23) }, { at: at(23, 0) }, { at: at(17) }, { at: at(16) }, { at: at(24) }], today)
assert.equal(days.length, 7)
assert.equal(days[0]?.date, '2026-10-17')
assert.equal(days[6]?.date, '2026-10-23')
assert.equal(days[6]?.label, 'Fri')
assert.deepEqual(days.map((d) => d.count), [1, 0, 0, 0, 0, 0, 2])
assert.deepEqual(activity([], today).map((d) => d.count), [0, 0, 0, 0, 0, 0, 0])
// The 7 days cross a month boundary.
assert.equal(activity([], new Date(2026, 10, 3))[0]?.date, '2026-10-28')

const T1 = '2026-10-01T10:00:00.000Z'
const T2 = '2026-10-01T10:30:00.000Z'
const T3 = '2026-10-02T10:00:00.000Z'
assert.deepEqual(recentEvents({ '/a': { openedAt: T1, completedAt: T2 }, '/b': { openedAt: T3 } }), [
  { kind: 'opened', path: '/b', at: T3 },
  { kind: 'completed', path: '/a', at: T2 },
  { kind: 'opened', path: '/a', at: T1 },
])
const seven = Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((d) => [`/l${d}`, { openedAt: `2026-10-0${d}T10:00:00.000Z` }]))
assert.deepEqual(recentEvents(seven).map((e) => e.path), ['/l7', '/l6', '/l5', '/l4', '/l3'])
assert.deepEqual(recentEvents({}), [])

// Two lessons; print is taught in both.
const lessons = [
  { path: '/l1', title: 'Hello', concepts: ['print'], exercises: ['e1', 'e2'] },
  { path: '/l2', title: 'Vars', concepts: ['variables', 'print'], exercises: ['e3'] },
]
const concepts = [
  { id: 'print', title: 'Printing output', week: 0, group: 'Python basics', requires: [] },
  { id: 'variables', title: 'Variables', week: 0, group: 'Python basics', requires: ['print'] },
]
const fail = (id: string) => ({ id, at: T1, passed: false, category: 'NameError' })
const pass = (id: string) => ({ id, at: T2, passed: true, category: null })
const opened = { openedAt: T1 }

// 1. Fresh storage: nothing started, an empty queue, start at the first lesson.
const fresh = { lessons: {}, exercises: {}, attempts: [] }
assert.equal(conceptStatus(fresh, 'print', lessons), 'not-started')
assert.deepEqual(recommendations(fresh, lessons, concepts), [])
assert.deepEqual(nextStep(fresh, lessons, concepts), { to: '/l1', title: 'Hello', reason: 'The first lesson of the course.' })

// 2. One failed attempt: in progress; a concept with no attempts is still not started.
const tried = { lessons: {}, exercises: {}, attempts: [fail('e1')] }
assert.equal(conceptStatus(tried, 'print', lessons), 'in-progress')
assert.equal(conceptStatus(tried, 'variables', lessons), 'not-started')

// 3. Two of the last three print attempts failed: needs revision, first in the queue and next step.
const shaky = { lessons: {}, exercises: {}, attempts: [fail('e1'), pass('e1'), fail('e3')] }
assert.equal(conceptStatus(shaky, 'print', lessons), 'needs-revision')
assert.equal(conceptStatus(shaky, 'variables', lessons), 'in-progress')
const revise = 'Revise Printing output: at least 2 of your last 3 tries failed.'
assert.deepEqual(recommendations(shaky, lessons, concepts), [
  { exercise: 'e1', number: 1, path: '/l1', title: 'Hello', reason: revise },
  { exercise: 'e2', number: 2, path: '/l1', title: 'Hello', reason: revise },
  { exercise: 'e3', number: 1, path: '/l2', title: 'Vars', reason: revise },
])
assert.deepEqual(nextStep(shaky, lessons, concepts), {
  to: '/l1',
  title: 'Revise Printing output',
  reason: 'At least 2 of your last 3 tries on Printing output failed.',
})

// 4. Mastered needs every tagged exercise passed and at least one without hints.
const strong = {
  lessons: {},
  exercises: { e1: { passedAt: T2, hintsUsed: 0 }, e2: { passedAt: T2, hintsUsed: 1 }, e3: { passedAt: T2, hintsUsed: 2 } },
  attempts: [pass('e1'), pass('e2'), pass('e3')],
}
assert.equal(conceptStatus(strong, 'print', lessons), 'mastered')
assert.equal(conceptStatus(strong, 'variables', lessons), 'in-progress')

// 5. An opened lesson with an unpassed exercise puts that exercise in the queue.
const partway = { lessons: { '/l1': opened }, exercises: { e1: { passedAt: T2, hintsUsed: 0 } }, attempts: [pass('e1')] }
assert.equal(conceptStatus(partway, 'print', lessons), 'in-progress')
assert.deepEqual(recommendations(partway, lessons, concepts), [
  { exercise: 'e2', number: 2, path: '/l1', title: 'Hello', reason: 'Not passed yet in a lesson you opened.' },
])

// 6. The next step follows the last completed lesson, and is null when all are done.
const done = { openedAt: T1, completedAt: T2 }
const one = { lessons: { '/l1': done }, exercises: {}, attempts: [] }
assert.deepEqual(nextStep(one, lessons, concepts), { to: '/l2', title: 'Vars', reason: 'It comes after Hello.' })
assert.equal(nextStep({ lessons: { '/l1': done, '/l2': done }, exercises: {}, attempts: [] }, lessons, concepts), null)

// Mistakes: the last 7 days (17 to 23 Oct) against the 7 before (10 to 16 Oct).
const failAt = (category: string, time: string) => ({ id: 'e1', at: time, passed: false, category })
assert.deepEqual(
  mistakes([failAt('NameError', at(15)), failAt('Wrong output', at(5)), failAt('NameError', at(23)), pass('e1')], today),
  [
    { category: 'NameError', recent: 1, before: 1, lastAt: at(23) },
    { category: 'Wrong output', recent: 0, before: 0, lastAt: at(5) },
  ],
)
assert.deepEqual(mistakes([], today), [])

// Exercises passed today counts local today only.
assert.equal(passedToday({ a: { passedAt: at(23, 8), hintsUsed: 0 }, b: { passedAt: at(22), hintsUsed: 0 }, c: { hintsUsed: 1 } }, today), 1)

console.log('mastery ok')
```

3. **Replace the whole of `app/components/StatusChip.vue`** with exactly this content. It
   adds "Needs revision" and "Mastered". The icon and the word both show the state.
```vue
<script setup lang="ts">
import { Award, Circle, CircleAlert, CircleCheck, CircleDot } from '@lucide/vue'
import type { Status } from '~/utils/lessonStatus'
import type { ConceptStatus } from '~/utils/mastery'

const props = defineProps<{ status: Status | ConceptStatus }>()

const labels: Record<Status | ConceptStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  'needs-revision': 'Needs revision',
  completed: 'Completed',
  mastered: 'Mastered',
}
const label = computed(() => labels[props.status])
</script>

<template>
  <span class="chip" :class="status">
    <CircleCheck v-if="status === 'completed'" :size="14" aria-hidden="true" />
    <Award v-else-if="status === 'mastered'" :size="14" aria-hidden="true" />
    <CircleAlert v-else-if="status === 'needs-revision'" :size="14" aria-hidden="true" />
    <CircleDot v-else-if="status === 'in-progress'" :size="14" aria-hidden="true" />
    <Circle v-else :size="14" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  padding: var(--s1) var(--s2);
  border-radius: var(--r-pill);
  font-size: var(--text-xs);
  font-weight: 600;
  white-space: nowrap;
}

.not-started {
  background: var(--surface-2);
  color: var(--text-2);
}

.in-progress {
  background: var(--accent-soft);
  color: var(--accent-text);
}

.needs-revision {
  background: color-mix(in srgb, var(--warning) 14%, transparent);
  color: var(--warning);
}

.completed,
.mastered {
  background: color-mix(in srgb, var(--success) 14%, transparent);
  color: var(--success);
}
</style>
```

## Acceptance gates
- `node scripts/check-mastery.ts` prints `mastery ok` and exits 0.
- Changing `>= 2` to `>= 3` in `conceptStatus` makes the check fail (try it, then undo it).
- Changing `hintsUsed === 0` to `hintsUsed === 1` in `conceptStatus` makes the check fail
  (try it, then undo it).
- `grep -nE '#[0-9a-fA-F]{3,6}\b|: any\b|<any>|as any' app/utils/mastery.ts app/components/StatusChip.vue`
  prints nothing.
- `npm run generate` exits 0, and `/learn` still shows the "Not started" chip in the built HTML
  (`grep -c "Not started" .output/public/learn/index.html` prints `1` or more).
