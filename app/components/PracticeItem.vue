<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import type { QueueItem } from '~/utils/mastery'

defineProps<{ item: QueueItem }>()
</script>

<template>
  <li class="card item">
    <div>
      <h2>Exercise {{ item.number }} in {{ item.title }}</h2>
      <p class="reason">{{ item.reason }}</p>
    </div>
    <NuxtLink :to="`${item.path}#${item.exercise}`" class="btn-secondary">
      Open <ArrowRight :size="16" aria-hidden="true" />
      <span class="visually-hidden">exercise {{ item.number }} in {{ item.title }}</span>
    </NuxtLink>
  </li>
</template>

<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s4);
}

h2 {
  margin: 0;
  font-size: var(--text-m);
}

.reason {
  margin: var(--s1) 0 0;
  color: var(--text-2);
}
</style>
