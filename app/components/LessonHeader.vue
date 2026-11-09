<script setup lang="ts">
import { CircleCheck, Clock } from '@lucide/vue'

defineProps<{
  title: string
  week: number
  minutes?: number
  position: number // 1-based place of this lesson in its week
  total: number // lessons in the week
  done: number // completed lessons in the week
  completed: boolean
}>()
</script>

<template>
  <header class="header">
    <div class="top">
      <p class="eyebrow">Week {{ week }} - Lesson {{ position }} of {{ total }}</p>
      <p class="week">
        <progress :value="done" :max="total" :aria-label="`Lessons completed in week ${week}`" />
        {{ done }} / {{ total }} done
      </p>
    </div>
    <h1>{{ title }}</h1>
    <p v-if="minutes" class="meta">
      <Clock :size="14" aria-hidden="true" /> {{ minutes }} min
    </p>
    <p v-if="completed" class="meta done">
      <CircleCheck :size="14" aria-hidden="true" /> Completed
    </p>
  </header>
</template>

<style scoped>
.header {
  margin: var(--s5) 0;
}

.top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2) var(--s4);
}

.eyebrow,
.meta,
.week {
  display: flex;
  align-items: center;
  gap: var(--s1);
  margin: 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

.week {
  gap: var(--s2);
}

.week progress {
  width: 8rem;
}

.done {
  margin-top: var(--s1);
  color: var(--success);
  font-weight: 600;
}

h1 {
  margin: var(--s1) 0 var(--s2);
  font-size: var(--text-2xl);
}
</style>
