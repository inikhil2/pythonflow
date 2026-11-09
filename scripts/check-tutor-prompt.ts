import assert from 'node:assert/strict'
import { TUTOR_SYSTEM, tutorMessages } from '../app/utils/tutorPrompt.ts'

const HINT = 'Please give me a hint in words, without writing any code I could paste. I want to find the fix myself.'

const pass = { passed: true, expected: 'hi', actual: 'hi', error: null, timedOut: false }
const wrong = { passed: false, expected: 'hello, world', actual: 'hello\n', error: null, timedOut: false }
const crash = { passed: false, expected: 'hi', actual: '', error: "NameError: name 'hello' is not defined", timedOut: false }

const [system, user] = tutorMessages({ task: 'Print hi.', code: 'print(hi)\n', results: [crash, wrong, wrong], question: ' Why? ' })
assert.deepEqual(system, { role: 'system', content: TUTOR_SYSTEM })
assert.match(TUTOR_SYSTEM, /Never write the full solution/)
assert.equal(user.role, 'user')
assert.equal(user.content, [
  'Exercise: Print hi.',
  'My code:\nprint(hi)',
  "A test stopped with this error: NameError: name 'hello' is not defined",
  'A test expected "hello, world" but my code printed "hello".',
  'My question: Why?',
  HINT,
].join('\n\n'))

// Not checked yet, empty editor and empty question.
const fresh = tutorMessages({ task: 'Print hi.', code: '  ', results: null, question: '' })[1].content
assert.equal(fresh, `Exercise: Print hi.\n\nMy code:\n(empty)\n\nMy question: What should I try next?\n\n${HINT}`)

// Every test passed.
assert.match(tutorMessages({ task: 'T', code: 'x', results: [pass], question: 'q' })[1].content, /My code passes every test\./)

console.log('tutor prompt ok')
