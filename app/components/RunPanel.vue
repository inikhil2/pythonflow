<script setup lang="ts">
import { CircleAlert, CircleCheck, LoaderCircle, Play, RotateCcw, Square } from '@lucide/vue'
import type { RunResult } from '~/composables/usePython'

const props = defineProps<{ code: string, prelude?: string }>()
const emit = defineEmits<{ reset: [] }>()

const { ready, running, version, run, stop } = usePython()
const stdin = ref('')
const result = ref<RunResult | null>(null)

const failed = computed(() => !!result.value && (!!result.value.error || !!result.value.stderr))

const status = computed(() => {
  if (running.value) return ready.value ? 'Running…' : 'Loading Python…'
  if (!result.value) return ready.value ? 'Ready' : 'Loading Python…'
  if (result.value.timedOut) return 'Stopped after 10 seconds'
  // 'Stopped.' is the message usePython().stop() returns.
  if (result.value.error === 'Stopped.') return 'Stopped'
  return failed.value ? 'Finished with an error' : 'Finished'
})

async function start() {
  result.value = await run(props.code, stdin.value, props.prelude)
}

defineExpose({ run: start })
</script>

<template>
  <div class="panel">
    <div class="bar">
      <p class="status" role="status">
        <LoaderCircle v-if="running" class="spin" :size="16" aria-hidden="true" />
        <CircleAlert v-else-if="failed" class="bad" :size="16" aria-hidden="true" />
        <CircleCheck v-else-if="result" class="ok" :size="16" aria-hidden="true" />
        {{ status }}
      </p>
      <span v-if="version" class="version">Python {{ version }}</span>
      <button type="button" class="btn-secondary dark" :disabled="running" @click="emit('reset')">
        <RotateCcw :size="16" aria-hidden="true" /> Reset code
      </button>
      <button v-if="running" type="button" class="btn-primary" @click="stop">
        <Square :size="16" aria-hidden="true" /> Stop
      </button>
      <button v-else type="button" class="btn-primary" @click="start">
        <Play :size="16" aria-hidden="true" /> Run
      </button>
    </div>
    <label class="stdin">
      <span>Input <small>(one line for each <code>input()</code> call)</small></span>
      <textarea v-model="stdin" rows="2" spellcheck="false" />
    </label>
    <RunOutput :result="result" />
  </div>
</template>

<style scoped>
.panel {
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

.version {
  color: var(--code-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

.ok { color: var(--code-ok); }
.bad { color: var(--code-err); }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.btn-secondary.dark {
  background: var(--code-line);
  color: var(--code-text);
}

.stdin {
  display: grid;
  gap: var(--s1);
  padding: 0 var(--s3) var(--s3);
  font-size: var(--text-s);
  color: var(--code-muted);
}

.stdin textarea {
  border: 0;
  border-radius: var(--r-m);
  padding: var(--s2) var(--s3);
  background: var(--code-bg);
  color: var(--code-text);
  font-size: 0.875rem;
  resize: vertical;
}

@media (prefers-reduced-motion: reduce) {
  .spin { animation: none; }
}
</style>
