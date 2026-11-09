# 084: Ask the tutor box in every exercise (task T7, part 3 of 3)
Files: app/components/TutorBox.vue, app/components/content/Exercise.vue
Severity: med

## Problem
Specs 082 and 083 build and send the tutor request. This spec adds the box the learner
sees, under the hints in every exercise.

- It is a native `<details>` with the summary "Ask the tutor", closed at first. Keyboards
  and screen readers handle it without extra code.
- A note says what the tutor sees and that it gives hints, not answers.
- There is a question field with a visually hidden label, plus an "Ask" button that reads
  "Asking…" and is disabled while a request runs.
- The answer appears in an `aria-live="polite"` region as plain text. It is never
  `v-html`, because model output is untrusted.
- When offline, it suggests a hint instead and says the tutor runs through llama-server on
  port 8080.

`Exercise.vue` passes the exercise id, prompt, code and last results. Its wide grid gets
one more auto row, because the box is a sixth item in the left column.

## Required change
1. **Create `app/components/TutorBox.vue`** with exactly this content.
```vue
<script setup lang="ts">
import { MessageCircleQuestion } from '@lucide/vue'
import type { CaseResult } from '~/composables/useChecker'

const props = defineProps<{ id: string; task: string; code: string; results: CaseResult[] | null }>()

const question = ref('')
const { answer, asking, offline, ask } = useTutor()

function send() {
  ask(tutorMessages({ task: props.task, code: props.code, results: props.results, question: question.value }))
}
</script>

<template>
  <details class="tutor">
    <summary><MessageCircleQuestion :size="16" aria-hidden="true" /> Ask the tutor</summary>
    <p class="sub">The tutor sees this exercise, your code and your last check. It gives hints, not answers.</p>
    <form class="ask" @submit.prevent="send">
      <label :for="`${id}-question`" class="visually-hidden">Your question</label>
      <textarea :id="`${id}-question`" v-model="question" rows="2" placeholder="Why does my code print the wrong thing?" />
      <button type="submit" class="btn-secondary" :disabled="asking">{{ asking ? 'Asking…' : 'Ask' }}</button>
    </form>
    <div aria-live="polite">
      <p v-if="answer" class="answer">{{ answer }}</p>
      <p v-else-if="offline" class="offline">
        The tutor is offline right now, so try a hint instead. It runs on this computer through llama-server
        on port 8080, and everything else works without it.
      </p>
    </div>
  </details>
</template>

<style scoped>
.tutor {
  margin-top: var(--s4);
}

summary {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  cursor: pointer;
  color: var(--accent-text);
  font-weight: 600;
}

.sub {
  margin: var(--s2) 0 var(--s3);
  color: var(--text-2);
  font-size: var(--text-s);
}

.ask {
  display: grid;
  justify-items: start;
  gap: var(--s2);
}

textarea {
  box-sizing: border-box;
  width: 100%;
  padding: var(--s2) var(--s3);
  border: 1px solid var(--line);
  border-radius: var(--r-m);
  background: var(--surface-2);
  color: var(--text);
  font: inherit;
  resize: vertical;
}

.answer,
.offline {
  margin: var(--s3) 0 0;
  padding: var(--s2) var(--s3);
  border-radius: var(--r-m);
  white-space: pre-wrap;
}

.answer {
  background: var(--accent-soft);
}

.offline {
  background: var(--surface-2);
  color: var(--text-2);
}
</style>
```

2. **Replace the whole of `app/components/content/Exercise.vue`** with exactly this content. Delete everything in the file first.
```vue
<script setup lang="ts">
import { CircleCheck, ListChecks } from '@lucide/vue'
import type { CaseResult, TestCase } from '~/composables/useChecker'

const props = defineProps<{
  id: string
  title?: string
  prompt: string
  starter?: string
  tests?: TestCase[]
  hints?: string[]
  solution?: string
}>()

const code = ref(props.starter ?? '')

const { running } = usePython()
const { checking, check } = useChecker()
const { progress, recordAttempt, revealHint, saveCode } = useProgress()
const results = ref<CaseResult[] | null>(null)
const passed = computed(() => !!progress.value.exercises[props.id]?.passedAt)
const hintsUsed = computed(() => progress.value.exercises[props.id]?.hintsUsed ?? 0)

onMounted(() => {
  // '' means never saved: hints and attempts create the entry with empty code.
  const saved = progress.value.exercises[props.id]?.code
  if (saved) code.value = saved
})

// Save 500 ms after the last change, and at once when the lesson closes.
let timer: ReturnType<typeof setTimeout> | undefined
function flush() {
  clearTimeout(timer)
  timer = undefined
  saveCode(props.id, code.value)
}
watch(code, () => {
  clearTimeout(timer)
  timer = setTimeout(flush, 500)
})
onBeforeUnmount(() => {
  if (timer) flush()
})

async function checkAnswer() {
  results.value = await check(code.value, props.tests ?? [])
  const category = failureCategory(results.value)
  // Pressing Stop during a check is not an attempt.
  if (category === 'Stopped.') return
  recordAttempt({ id: props.id, at: new Date().toISOString(), passed: category === null, category, concepts: [] })
}
</script>

<template>
  <section :id="id" class="card exercise" :aria-labelledby="`${id}-title`">
    <div class="layout">
      <h2 :id="`${id}-title`">{{ title ?? 'Try it yourself' }}</h2>
      <p class="prompt">{{ prompt }}</p>
      <Workbench v-model="code" class="bench" label="Your code" @reset="code = starter ?? ''" />
      <div class="actions">
        <button v-if="tests?.length" type="button" class="btn-primary" :disabled="running || checking" @click="checkAnswer">
          <ListChecks :size="16" aria-hidden="true" /> {{ checking ? 'Checking…' : 'Check answer' }}
        </button>
        <p v-if="passed" class="passed"><CircleCheck :size="16" aria-hidden="true" /> Passed</p>
        <p class="keys">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (<kbd>⌘</kbd> + <kbd>Enter</kbd> on Mac) to run.</p>
      </div>
      <TestResults v-if="results" :results="results" :total="tests?.length ?? 0" />
      <HintList v-if="hints?.length" :hints="hints" :shown="hintsUsed" @reveal="revealHint(id)" />
      <TutorBox :id="id" :task="prompt" :code="code" :results="results" />
    </div>
  </section>
</template>

<style scoped>
.exercise {
  container-type: inline-size;
  margin: var(--s6) 0;
}

.prompt {
  margin: var(--s2) 0 var(--s4);
  color: var(--text-2);
}

/* Wide cards: instructions on the left, the workbench on the right, sticking while the left scrolls. */
@container (min-width: 50rem) {
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    grid-template-rows: repeat(5, auto) 1fr;
    column-gap: var(--s5);
  }

  .layout > * {
    grid-column: 1;
  }

  .layout > .bench {
    position: sticky;
    top: var(--s5);
    grid-column: 2;
    grid-row: 1 / -1;
    align-self: start;
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s3);
  margin-top: var(--s3);
}

.passed {
  display: flex;
  align-items: center;
  gap: var(--s1);
  margin: 0;
  color: var(--success);
  font-weight: 600;
}

.keys {
  margin: 0 0 0 auto;
  color: var(--text-2);
  font-size: var(--text-s);
}

kbd {
  font-family: var(--font);
  font-size: var(--text-xs);
  padding: 0 var(--s1);
  border-radius: var(--r-s);
  background: var(--surface-2);
}
</style>
```

Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components.

## Acceptance gates
1. `npx nuxi typecheck` exits 0.
2. File sizes match:
```sh
   wc -c "app/components/TutorBox.vue"   # expect 2289
   wc -c "app/components/content/Exercise.vue"   # expect 3847
```
3. `grep -c "v-html" app/components/TutorBox.vue` gives 0.
4. `git diff --stat app/components/content/Exercise.vue` shows 2 insertions and 1 deletion.
5. `git status --short` lists only these two files.
