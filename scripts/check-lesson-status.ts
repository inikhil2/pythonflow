import assert from 'node:assert/strict'
import { completedCount, lessonStatus, nextLesson, weekStatus } from '../app/utils/lessonStatus.ts'

type Lessons = Record<string, { openedAt: string; completedAt?: string }>
const p = (lessons: Lessons) => ({ lessons })

const A = '/learn/week0-functions/01-hello'
const B = '/learn/week0-functions/02-variables'
const C = '/learn/week1-conditionals/01-if'
const T1 = '2026-10-01T10:00:00.000Z'
const T2 = '2026-10-02T10:00:00.000Z'
const T3 = '2026-10-03T10:00:00.000Z'
const done = { openedAt: T1, completedAt: T2 }

assert.equal(lessonStatus(p({}), A), 'not-started')
assert.equal(lessonStatus(p({ [A]: { openedAt: T1 } }), A), 'in-progress')
assert.equal(lessonStatus(p({ [A]: done }), A), 'completed')

assert.equal(weekStatus(p({}), [A, B]), 'not-started')
assert.equal(weekStatus(p({ [B]: { openedAt: T1 } }), [A, B]), 'in-progress')
assert.equal(weekStatus(p({ [A]: done }), [A, B]), 'in-progress')
assert.equal(weekStatus(p({ [A]: done, [B]: done }), [A, B]), 'completed')
assert.equal(weekStatus(p({ [A]: done }), []), 'not-started')

assert.equal(completedCount(p({ [A]: done, [B]: { openedAt: T1 } }), [A, B]), 1)
assert.equal(completedCount(p({ [C]: done }), [A, B]), 0)

// Fresh storage: start at the first lesson.
assert.deepEqual(nextLesson(p({}), [A, B, C]), { path: A, resume: false })
// The most recently opened unfinished lesson wins.
assert.deepEqual(nextLesson(p({ [A]: { openedAt: T1 }, [B]: { openedAt: T3 } }), [A, B, C]), { path: B, resume: true })
// A completed lesson is never resumed, even when opened last.
assert.deepEqual(nextLesson(p({ [A]: { openedAt: T3, completedAt: T3 }, [B]: { openedAt: T1 } }), [A, B, C]), { path: B, resume: true })
// Nothing in progress: the first unfinished lesson in course order.
assert.deepEqual(nextLesson(p({ [A]: done }), [A, B, C]), { path: B, resume: false })
// A stored path that is no longer in the course is ignored.
assert.deepEqual(nextLesson(p({ '/learn/old': { openedAt: T3 } }), [A, B, C]), { path: A, resume: false })
assert.equal(nextLesson(p({ [A]: done, [B]: done, [C]: done }), [A, B, C]), null)

console.log('lesson status ok')
