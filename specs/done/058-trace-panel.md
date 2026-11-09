# 058: CallStack and the Trace panel (tasks C4 and C5)
Files: app/components/CallStack.vue, app/components/content/Trace.vue
Severity: med

## Problem
- `CallStack` lists the frames with their arguments, innermost first; the main program
  is shown as `main program`. On an exception step it shows the error line and its
  plain-English explanation (`ErrorHelp`).
- `Trace` is the whole explorer: the editor with the current line highlighted, Reset
  code and Run and trace, then the stepper, the variables, the call stack and the output
  up to the current step. If the learner edits the code after a trace, the old steps are
  hidden until the next Run and trace, so the state shown always comes from that run.

Deviation from the proposal: the panel lives in `app/components/content/Trace.vue`, so
the explore page (spec 061) and the `::trace` lesson block (spec 062) share one component.
No separate wrapper is needed.

Do this after specs 054 to 057.

## Required change
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components.

1. **Create `app/components/CallStack.vue`** with exactly this content.
```vue
<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'
import type { TraceFrame } from '~/composables/usePython'

const props = defineProps<{ stack: TraceFrame[], error?: string }>()

function label(frame: TraceFrame) {
  if (frame.name === '<module>') return 'main program'
  const args = Object.entries(frame.args).map(([name, value]) => `${name}=${value}`)
  return `${frame.name}(${args.join(', ')})`
}

// Innermost first: the top frame is the one running now.
const frames = computed(() => [...props.stack].reverse().map(label))
</script>

<template>
  <div>
    <h3 class="title">Call stack</h3>
    <ol class="frames">
      <li v-for="(frame, i) in frames" :key="i" :class="{ now: i === 0 }">
        <code>{{ frame }}</code>
      </li>
    </ol>
    <div v-if="error" class="error">
      <p class="line"><CircleAlert :size="16" aria-hidden="true" /> {{ error }}</p>
      <ErrorHelp :error="error" />
    </div>
  </div>
</template>

<style scoped>
.title {
  margin: 0 0 var(--s2);
  color: var(--code-muted);
  font-size: var(--text-s);
  font-weight: 600;
}

.frames {
  display: grid;
  gap: var(--s1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.frames li {
  padding: var(--s2) var(--s3);
  border-radius: var(--r-m);
  background: var(--code-bg);
  color: var(--code-muted);
  font-size: var(--text-s);
  overflow-wrap: anywhere;
}

.frames .now {
  box-shadow: inset 3px 0 0 var(--accent);
  color: var(--code-text);
}

.error {
  margin-top: var(--s3);
}

.line {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin: 0;
  color: var(--code-err);
  font-family: var(--font-mono);
  font-size: var(--text-s);
}
</style>
```

2. **Create `app/components/content/Trace.vue`** with exactly this content.
```vue
<script setup lang="ts">
import { Footprints, LoaderCircle, RotateCcw } from '@lucide/vue'

const props = defineProps<{ code: string }>()

const code = ref(props.code)
const { ready } = usePython()
const { running, result, traced, steps, index, current, output, go } = useTrace()

// After an edit the shown run is out of date until the next Run and trace.
const fresh = computed(() => !!result.value && traced.value === code.value)

const status = computed(() => {
  if (running.value) return ready.value ? 'Tracing…' : 'Loading Python…'
  if (!result.value) return 'Press Run and trace to step through this code.'
  if (!fresh.value) return 'The code has changed. Press Run and trace to see the new run.'
  if (result.value.timedOut) return 'Stopped after 10 seconds'
  return `Traced ${steps.value.length} steps` + (result.value.error ? ', then the program stopped with an error' : '')
})
</script>

<template>
  <div class="trace">
    <CodeEditor v-model="code" label="Code to trace" :highlight-line="fresh ? current?.line : undefined" @run="go(code)" />
    <div class="bar">
      <p class="status" role="status">
        <LoaderCircle v-if="running" class="spin" :size="16" aria-hidden="true" />
        {{ status }}
      </p>
      <button type="button" class="btn-secondary" :disabled="running" @click="code = props.code">
        <RotateCcw :size="16" aria-hidden="true" /> Reset code
      </button>
      <button type="button" class="btn-primary" :disabled="running" @click="go(code)">
        <Footprints :size="16" aria-hidden="true" /> Run and trace
      </button>
    </div>
    <template v-if="fresh">
      <template v-if="current">
        <TraceStepper v-model="index" :total="steps.length" :line="current.line" />
        <div class="state">
          <VariableBoxes :locals="current.locals" />
          <CallStack :stack="current.stack" :error="current.error" />
        </div>
      </template>
      <div class="output">
        <h3 class="title">Output</h3>
        <pre v-if="output">{{ output }}</pre>
        <p v-else-if="steps.length" class="empty">Nothing printed yet.</p>
        <p v-if="result?.note" class="empty">{{ result.note }}</p>
        <!-- No steps: the code did not compile, or the run timed out. -->
        <template v-if="!steps.length && result?.error">
          <pre class="err">{{ result.error }}</pre>
          <ErrorHelp :error="result.error" />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.trace {
  overflow: hidden;
  margin: var(--s5) 0;
  border-radius: var(--r-l);
  background: var(--code-bar);
  color: var(--code-text);
}

.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s2);
  padding: var(--s2) var(--s3);
}

.status {
  display: flex;
  align-items: center;
  gap: var(--s2);
  flex: 1;
  margin: 0;
  color: var(--code-muted);
  font-size: var(--text-s);
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.btn-secondary {
  background: var(--code-line);
  color: var(--code-text);
}

.state {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--s4);
  padding: var(--s3);
  border-top: 1px solid var(--code-line);
}

.output {
  padding: var(--s3);
  border-top: 1px solid var(--code-line);
}

.title {
  margin: 0 0 var(--s2);
  color: var(--code-muted);
  font-size: var(--text-s);
  font-weight: 600;
}

pre {
  margin: 0;
  color: var(--code-text);
  font-size: var(--text-s);
  white-space: pre-wrap;
}

.err { color: var(--code-err); }

.empty {
  margin: 0;
  color: var(--code-muted);
  font-size: var(--text-s);
}

@media (prefers-reduced-motion: reduce) {
  .spin { animation: none; }
}
</style>
```

## Acceptance gates
- `git status --short` lists only these two new files.
- `wc -c < app/components/CallStack.vue` prints `1673` and
  `wc -c < app/components/content/Trace.vue` prints `3750`.
- `grep -c "^import" app/components/CallStack.vue` prints `2`.
- `grep -c "^import" app/components/content/Trace.vue` prints `1`.
- `npm run generate` exits 0. The browser test is in spec 061.
