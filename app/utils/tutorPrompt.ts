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

// The local model keeps this rule better when the learner asks for it than when the system prompt does.
const HINT_ONLY = 'Please give me a hint in words, without writing any code I could paste. I want to find the fix myself.'

// The exercise, the learner's code and their latest check, then the question. Two failures are enough context.
export function tutorMessages({ task, code, results, question }: TutorContext): ChatMessage[] {
  const parts = [`Exercise: ${task}`, `My code:\n${code.trim() || '(empty)'}`]
  const failed = results?.filter((r) => !r.passed) ?? []
  if (results && failed.length === 0) parts.push('My code passes every test.')
  // The checker ignores trailing whitespace, so the tutor must not see print's newline and blame it.
  for (const r of failed.slice(0, 2)) {
    parts.push(r.error
      ? `A test stopped with this error: ${r.error}`
      : `A test expected ${JSON.stringify((r.expected ?? '').trimEnd())} but my code printed ${JSON.stringify(r.actual.trimEnd())}.`)
  }
  parts.push(`My question: ${question.trim() || 'What should I try next?'}`, HINT_ONLY)
  return [
    { role: 'system', content: TUTOR_SYSTEM },
    { role: 'user', content: parts.join('\n\n') },
  ]
}
