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
