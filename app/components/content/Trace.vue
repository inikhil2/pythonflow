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
          <VariableBoxes :locals="current.locals" title="Variables" />
          <VariableBoxes v-if="current.globals" :locals="current.globals" title="Global variables" />
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
