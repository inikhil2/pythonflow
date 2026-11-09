# 024: Mark a lesson Completed when all its exercises pass (task A8)
Files: app/utils/lessonExercises.ts, scripts/check-lesson-exercises.ts, app/pages/learn/[...slug].vue
Severity: med

## Problem
Passing every exercise in a lesson does not complete it. `completeLesson(path)` exists
in `useProgress()` (spec 019) but nothing calls it, and the lesson header does not show
completion. Do this spec only after spec 023 is done.

The lesson page needs the ids of the exercises in the lesson body. Nuxt Content stores
the body as a minimark tree. For the hello lesson it looks like this (shortened):
```json
{ "type": "minimark", "value": [
  ["p", {}, "Welcome to ", ["strong", {}, "function"], "..."],
  ["exercise", { "id": "w0-l1-ex1", "prompt": "Print the text hello, world on one line.", ":tests": "[...]" }]
] }
```
A node is either a string (text) or an array `[tag, props, ...children]`.

## Required change
1. Create `app/utils/lessonExercises.ts` with exactly this content. Node runs this file
   directly, so it must use only plain type annotations (no enums, no namespaces).
```ts
// A minimark node: plain text, or [tag, props, ...children].
type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

export interface MinimarkBody {
  value: MinimarkNode[]
}

// The ids of every ::exercise block in a lesson body, in page order.
export function exerciseIds(body: MinimarkBody | null | undefined): string[] {
  const ids: string[] = []
  const walk = (node: MinimarkNode) => {
    if (typeof node === 'string') return
    const [tag, props, ...children] = node
    if (tag === 'exercise' && typeof props.id === 'string') ids.push(props.id)
    children.forEach(walk)
  }
  body?.value.forEach(walk)
  return ids
}
```

2. Create `scripts/check-lesson-exercises.ts` with exactly this content.
```ts
import assert from 'node:assert/strict'
import { exerciseIds } from '../app/utils/lessonExercises.ts'

assert.deepEqual(
  exerciseIds({
    value: [
      ['p', {}, 'Intro ', ['code', {}, 'print()']],
      ['exercise', { id: 'w0-l1-ex1', prompt: 'Print hi.' }],
      'stray text',
      ['div', {}, ['exercise', { id: 'w0-l1-ex2' }]],
      ['exercise', {}],
    ],
  }),
  ['w0-l1-ex1', 'w0-l1-ex2'],
)
assert.deepEqual(exerciseIds({ value: [['p', {}, 'No exercises here.']] }), [])
assert.deepEqual(exerciseIds({ value: [] }), [])
assert.deepEqual(exerciseIds(null), [])
assert.deepEqual(exerciseIds(undefined), [])

console.log('ok')
```

3. In `app/pages/learn/[...slug].vue` make exactly these edits. Change nothing else.
   `exerciseIds` is auto-imported.
   a. Replace
```ts
import { ChevronLeft, ChevronRight, Clock } from '@lucide/vue'
```
   with
```ts
import { ChevronLeft, ChevronRight, CircleCheck, Clock } from '@lucide/vue'
```
   b. Replace
```ts
const { openLesson } = useProgress()
onMounted(() => openLesson(path))
```
   with
```ts
const { progress, openLesson, completeLesson } = useProgress()
onMounted(() => openLesson(path))

// Passing every exercise completes the lesson; the first completion time is kept.
const ids = exerciseIds(lesson.value.body)
const allPassed = computed(() => ids.length > 0 && ids.every((id) => !!progress.value.exercises[id]?.passedAt))
watch(allPassed, (done) => {
  if (done) completeLesson(path)
})
const completed = computed(() => !!progress.value.lessons[path]?.completedAt)
```
   c. Replace
```vue
      <p v-if="lesson.minutes" class="meta">
        <Clock :size="14" aria-hidden="true" /> {{ lesson.minutes }} min
      </p>
```
   with
```vue
      <p v-if="lesson.minutes" class="meta">
        <Clock :size="14" aria-hidden="true" /> {{ lesson.minutes }} min
      </p>
      <p v-if="completed" class="meta done">
        <CircleCheck :size="14" aria-hidden="true" /> Completed
      </p>
```
   d. Add this rule directly after the `.eyebrow, .meta { ... }` rule:
```css
.done {
  margin-top: var(--s1);
  color: var(--success);
  font-weight: 600;
}
```

## Acceptance gates
- `node scripts/check-lesson-exercises.ts` prints `ok` (shell step for the orchestrator).
- `grep -c "completeLesson(path)" 'app/pages/learn/[...slug].vue'` prints 1.
- `npm run generate` exits 0.
- Browser (`/learn/week0-functions/01-hello`, fresh localStorage):
  1. The header does not show "Completed".
  2. Type `print("hello, world")` and press Check answer. The header shows "Completed".
  3. Reload. The header still shows "Completed", and
     `JSON.parse(localStorage['pythonflow:v1']).lessons['/learn/week0-functions/01-hello'].completedAt`
     is set.
