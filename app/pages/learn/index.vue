<script setup lang="ts">
import { Clock, SquareTerminal, Telescope } from '@lucide/vue'

const weeks = await useCourse()
const { progress } = useProgress()

// Weeks without lessons yet appear only in the Today learning path.
const taught = computed(() => weeks.value.filter((w) => w.lessons.length > 0))

useHead({ title: 'Learn · PythonFlow' })
</script>

<template>
  <div class="page">
    <header class="head">
      <div>
        <h1>Learn</h1>
        <p class="sub">Lessons follow Harvard's CS50P, one week at a time.</p>
      </div>
      <NuxtLink to="/playground" class="btn-secondary">
        <SquareTerminal :size="16" aria-hidden="true" /> Open the playground
      </NuxtLink>
    </header>
    <NuxtLink to="/learn/explore" class="card explore">
      <Telescope :size="20" aria-hidden="true" />
      <span>
        <strong>Explore</strong>
        <span class="sub">Step through real Python and watch each variable change.</span>
      </span>
    </NuxtLink>
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

.head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--s3);
}

.head .btn-secondary {
  text-decoration: none;
}

.explore {
  display: flex;
  align-items: flex-start;
  gap: var(--s3);
  color: var(--text);
  text-decoration: none;
}

.explore .sub {
  display: block;
  margin-top: var(--s1);
}

.explore:hover strong {
  color: var(--accent-text);
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
