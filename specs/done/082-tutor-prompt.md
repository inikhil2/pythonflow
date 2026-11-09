# 082: Tutor prompt builder and its check (task T7, part 1 of 3)
Files: app/utils/tutorPrompt.ts, scripts/check-tutor-prompt.ts
Severity: med

## Problem
plan.md task T7 adds an "Ask the tutor" box. It sends the exercise and the learner's code
to the local Qwen model through llama-server. The system prompt keeps answers short and
encouraging, and gives hints rather than full solutions.

This spec adds the pure part: a function that builds the chat messages. It sends the
exercise prompt, the learner's code and the failed tests from their last check (at most
two), then the question. An empty question becomes "What should I try next?". Spec 083
sends the messages and spec 084 adds the box.

The exercise is the context, not the whole lesson. It is what the learner is stuck on,
and it keeps each request small, so the reply comes back quickly.

## Required change
1. **Create `app/utils/tutorPrompt.ts`** with exactly this content.
```ts
import type { CaseResult } from '~/composables/useChecker'

export interface ChatMessage {
  role: 'system' | 'user'
  content: string
}

export interface TutorContext {
  task: string
  code: string
  results: CaseResult[] | null
  question: string
}

export const TUTOR_SYSTEM = [
  'You are a warm, patient Python tutor for a beginner taking CS50P.',
  'Reply in at most four short sentences of plain text, with no headings or lists.',
  'Give one hint or ask one guiding question. Never write the full solution or a corrected program.',
  "You may quote one short piece of the learner's own code to point at a mistake.",
].join(' ')

// The exercise, the learner's code and their latest check, then the question. Two failures are enough context.
export function tutorMessages({ task, code, results, question }: TutorContext): ChatMessage[] {
  const parts = [`Exercise: ${task}`, `My code:\n${code.trim() || '(empty)'}`]
  const failed = results?.filter((r) => !r.passed) ?? []
  if (results && failed.length === 0) parts.push('My code passes every test.')
  for (const r of failed.slice(0, 2)) {
    parts.push(r.error
      ? `A test stopped with this error: ${r.error}`
      : `A test expected ${JSON.stringify(r.expected)} but my code printed ${JSON.stringify(r.actual)}.`)
  }
  parts.push(`My question: ${question.trim() || 'What should I try next?'}`)
  return [
    { role: 'system', content: TUTOR_SYSTEM },
    { role: 'user', content: parts.join('\n\n') },
  ]
}
```

2. **Create `scripts/check-tutor-prompt.ts`** with exactly this content.
```ts
import assert from 'node:assert/strict'
import { TUTOR_SYSTEM, tutorMessages } from '../app/utils/tutorPrompt.ts'

const pass = { passed: true, expected: 'hi', actual: 'hi', error: null, timedOut: false }
const wrong = { passed: false, expected: 'hello, world', actual: 'hello', error: null, timedOut: false }
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
].join('\n\n'))

// Not checked yet, empty editor and empty question.
const fresh = tutorMessages({ task: 'Print hi.', code: '  ', results: null, question: '' })[1].content
assert.equal(fresh, 'Exercise: Print hi.\n\nMy code:\n(empty)\n\nMy question: What should I try next?')

// Every test passed.
assert.match(tutorMessages({ task: 'T', code: 'x', results: [pass], question: 'q' })[1].content, /My code passes every test\./)

console.log('tutor prompt ok')
```

Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components. The `.ts` extension in the script's import is required: Node runs it directly.

## Acceptance gates
1. `node scripts/check-tutor-prompt.ts` prints `tutor prompt ok`.
2. `npx nuxi typecheck` exits 0.
3. File sizes match:
```sh
   wc -c "app/utils/tutorPrompt.ts"   # expect 1479
   wc -c "scripts/check-tutor-prompt.ts"   # expect 1433
```
4. `git status --short` lists only these two new files.
