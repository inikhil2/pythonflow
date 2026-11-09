<script setup lang="ts">
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from '@lucide/vue'

const props = defineProps<{ total: number, line: number }>()
const index = defineModel<number>({ required: true })

const last = computed(() => props.total - 1)

// The buttons stay enabled so focus never drops; go() keeps the index inside the steps.
function go(i: number) {
  index.value = Math.min(Math.max(i, 0), last.value)
}
</script>

<template>
  <div class="stepper">
    <div class="buttons">
      <button type="button" class="btn-secondary" :aria-disabled="index === 0" @click="go(0)">
        <ChevronFirst :size="16" aria-hidden="true" /> First
      </button>
      <button type="button" class="btn-secondary" :aria-disabled="index === 0" @click="go(index - 1)">
        <ChevronLeft :size="16" aria-hidden="true" /> Back
      </button>
      <button type="button" class="btn-primary" :aria-disabled="index === last" @click="go(index + 1)">
        Step <ChevronRight :size="16" aria-hidden="true" />
      </button>
      <button type="button" class="btn-secondary" :aria-disabled="index === last" @click="go(last)">
        Last <ChevronLast :size="16" aria-hidden="true" />
      </button>
    </div>
    <input
      v-model.number="index"
      type="range"
      min="0"
      :max="last"
      aria-label="Step"
      :aria-valuetext="`Step ${index + 1} of ${total}, line ${line}`"
    >
    <p class="count" aria-live="polite">Step {{ index + 1 }} of {{ total }} · line {{ line }}</p>
  </div>
</template>

<style scoped>
.stepper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s2) var(--s4);
  padding: var(--s3);
  border-top: 1px solid var(--code-line);
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
}

.btn-secondary {
  background: var(--code-line);
  color: var(--code-text);
}

button[aria-disabled='true'] {
  cursor: default;
  opacity: 0.5;
}

input[type='range'] {
  flex: 1;
  min-width: 8rem;
  accent-color: var(--accent);
}

.count {
  margin: 0;
  color: var(--code-muted);
  font-size: var(--text-s);
  font-variant-numeric: tabular-nums;
}
</style>
