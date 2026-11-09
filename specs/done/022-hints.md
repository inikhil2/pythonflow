# 022: Hints revealed one at a time (task A6)
Files: app/components/HintList.vue, app/components/content/Exercise.vue, content/week0-functions/01-hello.md
Severity: med

## Problem
Exercises have no hints. The plan says hints are revealed one at a time with "Show hint
1 of N", and each reveal increments `hintsUsed` in progress. Do this spec only after
spec 021 is done.

## Required change
1. Create `app/components/HintList.vue` with exactly this content. After a reveal,
   focus moves to the new hint, so keyboard users are not dropped to the page when the
   button disappears after the last hint.
```vue
<script setup lang="ts">
import { Lightbulb } from '@lucide/vue'

const props = defineProps<{ hints: string[]; shown: number }>()
const emit = defineEmits<{ reveal: [] }>()

const visible = computed(() => props.hints.slice(0, props.shown))
const list = ref<HTMLOListElement>()

async function reveal() {
  emit('reveal')
  await nextTick()
  const last = list.value?.lastElementChild
  if (last instanceof HTMLElement) last.focus()
}
</script>

<template>
  <div class="hints">
    <ol v-if="visible.length" ref="list">
      <li v-for="(hint, i) in visible" :key="i" tabindex="-1">
        <strong>Hint {{ i + 1 }}.</strong> {{ hint }}
      </li>
    </ol>
    <button v-if="shown < hints.length" type="button" class="btn-secondary" @click="reveal">
      <Lightbulb :size="16" aria-hidden="true" /> Show hint {{ shown + 1 }} of {{ hints.length }}
    </button>
  </div>
</template>

<style scoped>
.hints {
  display: grid;
  justify-items: start;
  gap: var(--s3);
  margin-top: var(--s4);
}

ol {
  display: grid;
  gap: var(--s2);
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  padding: var(--s2) var(--s3);
  border-radius: var(--r-m);
  background: var(--accent-soft);
}
</style>
```

2. In `app/components/content/Exercise.vue` make exactly these three edits. Change
   nothing else.
   a. Replace
```ts
  tests?: TestCase[]
```
   with
```ts
  tests?: TestCase[]
  hints?: string[]
```
   b. Replace
```ts
const { progress, recordAttempt } = useProgress()
```
   with
```ts
const { progress, recordAttempt, revealHint } = useProgress()
```
   and add this line directly after the `const passed = ...` line:
```ts
const hintsUsed = computed(() => progress.value.exercises[props.id]?.hintsUsed ?? 0)
```
   c. Replace
```vue
    <TestResults v-if="results" :results="results" :total="tests?.length ?? 0" />
```
   with
```vue
    <TestResults v-if="results" :results="results" :total="tests?.length ?? 0" />
    <HintList v-if="hints?.length" :hints="hints" :shown="hintsUsed" @reveal="revealHint(id)" />
```

3. In `content/week0-functions/01-hello.md`, inside the `::exercise` block, replace
```yaml
tests:
  - stdin: ""
    stdout: "hello, world"
```
   with
```yaml
hints:
  - Use the print function and put the text inside its parentheses.
  - 'Text needs quotes around it: "hello, world".'
tests:
  - stdin: ""
    stdout: "hello, world"
```
   Change nothing else in the lesson.

## Acceptance gates
- `grep -c "<HintList" app/components/content/Exercise.vue` prints 1.
- `grep -c "hints:" content/week0-functions/01-hello.md` prints 1.
- `grep -cE "#[0-9a-fA-F]{3,6}\b" app/components/HintList.vue` prints 0.
- `npm run generate` exits 0.
- Browser (`/learn/week0-functions/01-hello`, fresh localStorage):
  1. The button reads "Show hint 1 of 2". Press it with the keyboard (Tab, Enter).
     "Hint 1." appears and has focus. The button now reads "Show hint 2 of 2".
  2. Press it again. "Hint 2." appears with focus, and the button is gone.
  3. `JSON.parse(localStorage['pythonflow:v1']).exercises['w0-l1-ex1'].hintsUsed` is 2.
  4. Reload. Both hints are still shown and there is no button.
