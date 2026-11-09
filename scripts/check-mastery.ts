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

// Every tagged exercise passed, but each one used hints: not mastered yet.
const leaned = {
  lessons: {},
  exercises: { e1: { passedAt: T2, hintsUsed: 1 }, e2: { passedAt: T2, hintsUsed: 2 }, e3: { passedAt: T2, hintsUsed: 1 } },
  attempts: [pass('e1'), pass('e2'), pass('e3')],
}
assert.equal(conceptStatus(leaned, 'print', lessons), 'in-progress')

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
