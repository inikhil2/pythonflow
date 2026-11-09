<script setup lang="ts">
import type { CourseWeek } from '~/composables/useCourse'

defineProps<{ weeks: CourseWeek[] }>()
const { progress } = useProgress()
</script>

<template>
  <section class="card" aria-labelledby="path-title">
    <h2 id="path-title">Learning path</h2>
    <ol class="weeks">
      <li v-for="w in weeks" :key="w.week">
        <NuxtLink v-if="w.lessons.length" :to="`/learn#week-${w.week}`" class="row">
          <span class="num" aria-hidden="true">{{ w.week }}</span>
          <span class="title"><span class="visually-hidden">Week {{ w.week }}: </span>{{ w.title }}</span>
          <StatusChip :status="weekStatus(progress, w.lessons.map((l) => l.path))" />
        </NuxtLink>
        <div v-else class="row soon">
          <span class="num" aria-hidden="true">{{ w.week }}</span>
          <span class="title"><span class="visually-hidden">Week {{ w.week }}: </span>{{ w.title }}</span>
          <span class="meta">No lessons yet</span>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
h2 {
  margin: 0;
}

.weeks {
  margin: var(--s3) 0 0;
  padding: 0;
  list-style: none;
}

.weeks li + li {
  border-top: 1px solid var(--line);
}

.row {
  display: flex;
  align-items: center;
  gap: var(--s3);
  padding: var(--s3) 0;
  color: var(--text);
  font-weight: 500;
  text-decoration: none;
}

a.row:hover {
  color: var(--accent-text);
}

.num {
  display: grid;
  place-items: center;
  flex: none;
  width: var(--s6);
  height: var(--s6);
  border-radius: var(--r-pill);
  background: var(--surface-2);
  color: var(--text-2);
  font-size: var(--text-s);
  font-weight: 600;
}

.title {
  flex: 1;
}

.soon .title,
.meta {
  color: var(--text-2);
}

.meta {
  font-size: var(--text-s);
  font-weight: 400;
}
</style>
