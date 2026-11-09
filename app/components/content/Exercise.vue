<script setup lang="ts">
import { CircleCheck, ListChecks } from '@lucide/vue'
import type { CaseResult, TestCase } from '~/composables/useChecker'
import { NODE_PRELUDE } from '~/utils/nodePrelude'
import { randomCheck, type RandomSpec } from '~/utils/randomCheck'

const props = defineProps<{
  id: string
  title?: string
  prompt: string
  starter?: string
  tests?: TestCase[]
  hints?: string[]
  solution?: string
  random?: RandomSpec
  prelude?: 'nodes' // runs the list and tree helpers before the learner's code
  big?: string // a large check line: a correct, fast solution passes it, a slow one times out
  // Read by scripts/check-interview.ts; the page never shows these.
  wrong?: string[]
  slow?: string[]
}>()

const prelude = props.prelude === 'nodes' ? NODE_PRELUDE : ''

// The random check comes last, after the fixed tests.
const cases = computed<TestCase[]>(() => [
  ...(props.tests ?? []),
  ...(props.big ? [{ check: props.big }] : []),
  ...(props.random && props.solution ? [{ check: randomCheck(props.random, props.solution, !!prelude) }] : []),
])
const labels = computed(() =>
  cases.value.map((_, i) => {
    const tests = props.tests?.length ?? 0
    if (i < tests) return `Test ${i + 1}`
    return props.big && i === tests ? 'Big input' : '200 random inputs'
  }),
)

const code = ref(props.starter ?? '')

const { running } = usePython()
const { checking, check } = useChecker()
const { progress, recordAttempt, revealHint, saveCode } = useProgress()
const results = ref<CaseResult[] | null>(null)
// Passed before, and the results on screen (if any) are all passes.
const passed = computed(
  () => !!progress.value.exercises[props.id]?.passedAt && (results.value?.every((r) => r.passed) ?? true),
)
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
  results.value = await check(code.value, cases.value, prelude)
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
      <Workbench v-model="code" class="bench" :prelude="prelude" label="Your code" @reset="code = starter ?? ''" />
      <div class="actions">
        <button v-if="cases.length" type="button" class="btn-primary" :disabled="running || checking" @click="checkAnswer">
          <ListChecks :size="16" aria-hidden="true" /> {{ checking ? 'Checking…' : 'Check answer' }}
        </button>
        <p v-if="passed" class="passed"><CircleCheck :size="16" aria-hidden="true" /> Passed</p>
        <p class="keys">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (<kbd>⌘</kbd> + <kbd>Enter</kbd> on Mac) to run.</p>
      </div>
      <TestResults v-if="results" :results="results" :total="cases.length" :labels="labels" show-check />
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
