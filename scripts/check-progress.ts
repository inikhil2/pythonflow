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
