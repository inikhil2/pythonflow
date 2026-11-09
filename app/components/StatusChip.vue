<script setup lang="ts">
import { Award, Circle, CircleAlert, CircleCheck, CircleDot } from '@lucide/vue'
import type { Status } from '~/utils/lessonStatus'
import type { ConceptStatus } from '~/utils/mastery'

const props = defineProps<{ status: Status | ConceptStatus }>()

const labels: Record<Status | ConceptStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  'needs-revision': 'Needs revision',
  completed: 'Completed',
  mastered: 'Mastered',
}
const label = computed(() => labels[props.status])
</script>

<template>
  <span class="chip" :class="status">
    <CircleCheck v-if="status === 'completed'" :size="14" aria-hidden="true" />
    <Award v-else-if="status === 'mastered'" :size="14" aria-hidden="true" />
    <CircleAlert v-else-if="status === 'needs-revision'" :size="14" aria-hidden="true" />
    <CircleDot v-else-if="status === 'in-progress'" :size="14" aria-hidden="true" />
    <Circle v-else :size="14" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  padding: var(--s1) var(--s2);
  border-radius: var(--r-pill);
  font-size: var(--text-xs);
  font-weight: 600;
  white-space: nowrap;
}

.not-started {
  background: var(--surface-2);
  color: var(--text-2);
}

.in-progress {
  background: var(--accent-soft);
  color: var(--accent-text);
}

.needs-revision {
  background: color-mix(in srgb, var(--warning) 14%, transparent);
  color: var(--warning);
}

.completed,
.mastered {
  background: color-mix(in srgb, var(--success) 14%, transparent);
  color: var(--success);
}
</style>
