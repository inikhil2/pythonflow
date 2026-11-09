# 034: Today page learning path, weeks 0 to 9 with status (task A12)
Files: app/components/LearningPath.vue, app/pages/index.vue
Severity: med

## Problem
Task A12 adds the learning path to the Today page: weeks 0 to 9, each with its status.
The mock shows a "Locked" state; ruling 7 drops locks, so the states are those of
`StatusChip` (spec 028): Not started, In progress, Completed. A week with no lessons yet
cannot be started, so it shows "No lessons yet" instead of a chip and is not a link.
A week with lessons links to its section on the Learn page (`/learn#week-0`; spec 030
gives each week heading that id).

`StatusChip.vue` is listed in the proposal for A12, but spec 028 already made it.

Do this spec after 030 and 032.

## Required change
1. Create `app/components/LearningPath.vue` with exactly this content.
```vue
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
```

2. In `app/pages/index.vue`, replace:
```html
        <ContinueCard :weeks="weeks" />
```
   with:
```html
        <ContinueCard :weeks="weeks" />
        <LearningPath :weeks="weeks" />
```

## Acceptance gates
- `npm run generate` exits 0, and `.output/public/index.html` contains
  `Functions and variables`, `Et cetera` and `No lessons yet`.
- In the browser with empty storage, `/` lists ten weeks (0 to 9). Week 0 shows "Not
  started"; weeks 1 to 9 show "No lessons yet" and are not links.
- After opening the hello lesson, week 0 shows "In progress". After passing its exercise,
  week 0 shows "Completed".
- Clicking week 0 goes to `/learn` and scrolls to the "Week 0: Functions and variables"
  heading.
- A screen reader name for the week 0 link starts with "Week 0: Functions and variables".
