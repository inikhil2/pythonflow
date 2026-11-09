# 021: Check answer button and test results (task A5)
Files: app/components/TestResults.vue, app/components/content/Exercise.vue
Severity: med

## Problem
`useChecker()` (spec 020) and `useProgress()` (spec 019) exist, but nothing in a lesson
uses them. The learner can run code but cannot check it against the exercise tests,
and no attempt is ever recorded.

## Required change
1. Create `app/components/TestResults.vue` with exactly this content. It shows one row
   per checked case. A failed output case shows the expected output next to the
   learner's output. `ErrorHelp` is not used here because it is styled for the dark
   console.
```vue
<script setup lang="ts">
import { CircleCheck, CircleX } from '@lucide/vue'
import type { CaseResult } from '~/composables/useChecker'

const props = defineProps<{ results: CaseResult[]; total: number }>()

const passedCount = computed(() => props.results.filter((r) => r.passed).length)
</script>

<template>
  <div class="results">
    <p class="summary" role="status">{{ passedCount }} of {{ total }} tests passed</p>
    <ol>
      <li v-for="(r, i) in results" :key="i" :class="r.passed ? 'pass' : 'fail'">
        <p class="name">
          <CircleCheck v-if="r.passed" :size="16" aria-hidden="true" />
          <CircleX v-else :size="16" aria-hidden="true" />
          Test {{ i + 1 }}: {{ r.passed ? 'Passed' : 'Failed' }}
        </p>
        <template v-if="!r.passed">
          <p v-if="r.timedOut" class="note">Your program ran for more than 10 seconds.</p>
          <pre v-else-if="r.error" class="error">{{ r.error }}</pre>
          <div v-else-if="r.expected !== null" class="diff">
            <div>
              <p class="label">Expected</p>
              <pre>{{ r.expected }}</pre>
            </div>
            <div>
              <p class="label">Your output</p>
              <pre>{{ r.actual || '(nothing)' }}</pre>
            </div>
          </div>
        </template>
      </li>
    </ol>
    <p v-if="results.length < total" class="note">The remaining tests were not run.</p>
  </div>
</template>

<style scoped>
.results {
  margin-top: var(--s4);
}

.summary {
  margin: 0 0 var(--s2);
  font-weight: 600;
}

ol {
  display: grid;
  gap: var(--s3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.name {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin: 0;
  font-weight: 600;
}

.pass .name { color: var(--success); }
.fail .name { color: var(--error); }

.diff {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--s2);
  margin-top: var(--s2);
}

.label,
.note {
  margin: var(--s2) 0 var(--s1);
  color: var(--text-2);
  font-size: var(--text-s);
}

.diff .label {
  margin-top: 0;
}

pre {
  margin: 0;
  padding: var(--s2) var(--s3);
  border-radius: var(--r-m);
  background: var(--surface-2);
  font-family: var(--font-mono);
  font-size: var(--text-s);
  white-space: pre-wrap;
  word-break: break-word;
}

.error {
  margin-top: var(--s2);
  color: var(--error);
}
</style>
```

2. Replace the whole of `app/components/content/Exercise.vue` with exactly this content.
   What changes: `tests` now uses the `TestCase` type, a "Check answer" button and a
   "Passed" label sit under the workbench, results show below, and the old `.hint`
   paragraph is renamed `.keys` (the name `hint` is needed by spec 022).
   `usePython`, `useChecker`, `useProgress`, `failureCategory` and `TestResults` are
   auto-imported; do not import them.
```vue
<script setup lang="ts">
import { CircleCheck, ListChecks } from '@lucide/vue'
import type { CaseResult, TestCase } from '~/composables/useChecker'

const props = defineProps<{
  id: string
  prompt: string
  starter?: string
  tests?: TestCase[]
  solution?: string
}>()

const code = ref(props.starter ?? '')
const panel = ref<{ run: () => void }>()

const { running } = usePython()
const { checking, check } = useChecker()
const { progress, recordAttempt } = useProgress()
const results = ref<CaseResult[] | null>(null)
const passed = computed(() => !!progress.value.exercises[props.id]?.passedAt)

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
    <h2 :id="`${id}-title`">Try it yourself</h2>
    <p class="prompt">{{ prompt }}</p>
    <div class="workbench">
      <CodeEditor v-model="code" label="Your code" @run="panel?.run()" />
      <RunPanel ref="panel" :code="code" @reset="code = starter ?? ''" />
    </div>
    <div class="actions">
      <button v-if="tests?.length" type="button" class="btn-primary" :disabled="running || checking" @click="checkAnswer">
        <ListChecks :size="16" aria-hidden="true" /> {{ checking ? 'Checking…' : 'Check answer' }}
      </button>
      <p v-if="passed" class="passed"><CircleCheck :size="16" aria-hidden="true" /> Passed</p>
      <p class="keys">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (<kbd>⌘</kbd> + <kbd>Enter</kbd> on Mac) to run.</p>
    </div>
    <TestResults v-if="results" :results="results" :total="tests?.length ?? 0" />
  </section>
</template>

<style scoped>
.exercise {
  margin: var(--s6) 0;
}

.prompt {
  margin: var(--s2) 0 var(--s4);
  color: var(--text-2);
}

.workbench {
  overflow: hidden;
  border-radius: var(--r-l);
  background: var(--code-bg);
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

## Acceptance gates
- `grep -c "<TestResults" app/components/content/Exercise.vue` prints 1.
- `grep -cE "#[0-9a-fA-F]{3,6}\b" app/components/TestResults.vue` prints 0.
- `grep -c "any" app/components/TestResults.vue app/components/content/Exercise.vue` prints 0 for each file.
- `npm run generate` exits 0.
- Browser (`npm run dev`, lesson `/learn/week0-functions/01-hello`, fresh localStorage):
  1. Type `print("hi")` and press Check answer. It shows "0 of 1 tests passed",
     "Test 1: Failed", Expected `hello, world` and Your output `hi`.
  2. Type `print(x)` and press Check answer. Test 1 shows the NameError line.
  3. Type `print("hello, world")` and press Check answer. It shows "1 of 1 tests
     passed" and a "Passed" label beside the button.
  4. In devtools, `JSON.parse(localStorage['pythonflow:v1'])` has 3 attempts, and
     `exercises['w0-l1-ex1'].passedAt` is set.
