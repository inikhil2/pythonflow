# 030: Learn page shows week titles and a status per lesson (task A9, part 3)
Files: app/pages/learn/index.vue
Severity: med

## Problem
The Learn page headings say only "Week 0", and no lesson shows whether it is started
or finished. Task A9 gate: "week 0 shows Functions and variables, and the hello lesson
shows its real status".

Do this spec after 028 and 029. It uses `useCourse()`, `lessonStatus()` and `StatusChip`.
The page lists only weeks that have lessons; the Today page (spec 034) shows all ten.

## Required change
Replace the whole of `app/pages/learn/index.vue` with exactly this content.
```vue
<script setup lang="ts">
import { Clock } from '@lucide/vue'

const weeks = await useCourse()
const { progress } = useProgress()

// Weeks without lessons yet appear only in the Today learning path.
const taught = computed(() => weeks.value.filter((w) => w.lessons.length > 0))

useHead({ title: 'Learn · PythonFlow' })
</script>

<template>
  <div class="page">
    <header>
      <h1>Learn</h1>
      <p class="sub">Lessons follow Harvard's CS50P, one week at a time.</p>
    </header>
    <section v-for="w in taught" :key="w.week" class="card" :aria-labelledby="`week-${w.week}`">
      <h2 :id="`week-${w.week}`">Week {{ w.week }}: {{ w.title }}</h2>
      <p class="sub">{{ w.summary }}</p>
      <ol class="lessons">
        <li v-for="lesson in w.lessons" :key="lesson.path">
          <NuxtLink :to="lesson.path" class="lesson">
            <span>{{ lesson.title }}</span>
            <span class="meta">
              <span v-if="lesson.minutes" class="time">
                <Clock :size="14" aria-hidden="true" /> {{ lesson.minutes }} min
              </span>
              <StatusChip :status="lessonStatus(progress, lesson.path)" />
            </span>
          </NuxtLink>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
  max-width: 46rem;
}

.sub {
  margin: var(--s2) 0 0;
  color: var(--text-2);
}

.lessons {
  margin: var(--s3) 0 0;
  padding: 0;
  list-style: none;
}

.lessons li + li {
  border-top: 1px solid var(--line);
}

.lesson {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2) var(--s4);
  padding: var(--s3) 0;
  color: var(--text);
  font-weight: 500;
  text-decoration: none;
}

.lesson:hover {
  color: var(--accent-text);
}

.meta,
.time {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
}

.meta {
  gap: var(--s3);
}

.time {
  color: var(--text-2);
  font-size: var(--text-s);
  font-weight: 400;
}
</style>
```

## Acceptance gates
- `npm run generate` exits 0, and `grep -c "Week 0: Functions and variables" .output/public/learn/index.html`
  prints `1` or more.
- In the browser with empty storage (run `localStorage.removeItem('pythonflow:v1')`,
  then reload), `/learn` shows "Hello, world" with the chip "Not started".
- After opening the hello lesson and going back to `/learn`, the chip says "In progress".
- After passing the hello exercise (Check answer), `/learn` shows "Completed".
- The keyboard Tab order reaches each lesson link, and the focus outline is visible.
