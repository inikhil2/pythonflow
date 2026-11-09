# 041: Replace the whole Learn page file, without the unused import (redo of 040)
Files: app/pages/learn/index.vue
Severity: low

## Problem
`app/pages/learn/index.vue` line 3 is `import type { RunResult } from '~/composables/usePython'`.
Nothing in the page uses `RunResult`, and patterns.md rule 6 does not allow hand imports.
Spec 040 asked for this one line to be deleted, and it failed twice with no change to
the file. So this spec replaces the whole file instead.

The new content is the page from spec 030, which is what the file holds now apart from
that one line.

## Required change
Delete everything in `app/pages/learn/index.vue`, then write exactly this content.
Copy it character for character. Do not add any import lines.
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
- `grep -n "RunResult\|usePython" app/pages/learn/index.vue` prints nothing.
- `grep -c "^import" app/pages/learn/index.vue` prints `1`.
- `git diff --stat -- app/pages/learn/index.vue` shows `1 deletion(-)` and no insertions.
- `npm run generate` exits 0, and `grep -c "Week 0: Functions and variables" .output/public/learn/index.html`
  prints `1` or more.
