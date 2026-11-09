# 074: Workbench component and the split exercise layout (task E3)
Files: app/components/Workbench.vue, app/components/content/Exercise.vue
Severity: med

## Problem
DESIGN.md says wide lesson pages are a split pane: text on the left (1fr) and the
workbench on the right (1.2fr), sticking while the text scrolls. Today the editor and
Run panel always stack under the prompt.

The editor plus Run panel pair will also be used by the playground (spec 076), so it moves
into its own component, `Workbench`. It takes a `label` and a `v-model` for the code,
and emits `reset` when the Run panel's Reset button is pressed. Ctrl+Enter in the editor
still runs the code.

`Exercise` wraps its content in a `.layout` div and becomes a size container. When the
exercise card is at least 50rem wide, the title, prompt, actions, test results and hints
form the left column, and the workbench is the right column with `position: sticky`.
Narrower cards keep today's stacked layout. A container query is used instead of a
media query, because the card width depends on the page, not the window. Spec 075 widens
the lesson and project pages from 75rem so the split can happen there.

There is no drag handle: the ratio is fixed.

## Required change
1. **Create `app/components/Workbench.vue`** with exactly this content.
```vue
<script setup lang="ts">
// The dark code workbench: the editor above its Run panel. Ctrl+Enter in the editor runs the code.
defineProps<{ label: string }>()
const code = defineModel<string>({ required: true })
const emit = defineEmits<{ reset: [] }>()

const panel = ref<{ run: () => void }>()
</script>

<template>
  <div class="workbench">
    <CodeEditor v-model="code" :label="label" @run="panel?.run()" />
    <RunPanel ref="panel" :code="code" @reset="emit('reset')" />
  </div>
</template>

<style scoped>
.workbench {
  overflow: hidden;
  border-radius: var(--r-l);
  background: var(--code-bg);
}
</style>
```
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components. This file has no imports.

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
    grid-template-rows: repeat(4, auto) 1fr;
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

The script loses the `panel` ref. The template wraps everything in `<div class="layout">` and
uses `<Workbench>`. The CSS moves `.workbench` into Workbench.vue and adds the container
rules. Nothing else changes.

## Acceptance gates
1. Sizes:
   wc -c "app/components/Workbench.vue"   # expect 617
   wc -c "app/components/content/Exercise.vue"   # expect 3772
2. `grep -c "^import" app/components/Workbench.vue` prints 0, and
   `grep -c "^import" app/components/content/Exercise.vue` prints 2.
3. `grep -c "RunPanel\|CodeEditor" app/components/content/Exercise.vue` prints 0.
4. `npx nuxi typecheck` exits 0.
5. `npm run generate` exits 0.
6. Browser gates are run by Orca, in the dark theme, at 1440, 834 and 390 px wide. At all three widths a lesson exercise still stacks (the page is not wide
   yet). Run, Ctrl+Enter, Reset and Check answer still work.
