<script setup lang="ts">
import { CircleCheck, Circle } from '@lucide/vue'

defineProps<{ milestones: { id: string; title: string }[]; current: string; link: (id: string) => string }>()
const { progress } = useProgress()
</script>

<template>
  <nav aria-label="Milestones">
    <ol class="milestones">
      <li v-for="(m, i) in milestones" :key="m.id">
        <NuxtLink :to="link(m.id)" :aria-current="m.id === current ? 'step' : undefined">
          <CircleCheck v-if="progress.exercises[m.id]?.passedAt" class="done" :size="16" aria-hidden="true" />
          <Circle v-else :size="16" aria-hidden="true" />
          {{ i + 1 }}. {{ m.title }}
          <span v-if="progress.exercises[m.id]?.passedAt" class="visually-hidden">(passed)</span>
        </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.milestones {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  display: inline-flex;
  align-items: center;
  gap: var(--s2);
  padding: var(--s2) var(--s3);
  border-radius: var(--r-pill);
  background: var(--surface-2);
  color: var(--text-2);
  font-size: var(--text-s);
  text-decoration: none;
}

a:hover {
  color: var(--text);
}

a[aria-current='step'] {
  background: var(--accent-soft);
  color: var(--accent-text);
  font-weight: 600;
}

.done {
  color: var(--success);
}
</style>
