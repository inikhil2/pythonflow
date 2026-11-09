# 061: Explore page and its link on Learn (task C5)
Files: app/pages/learn/explore/[[topic]].vue, app/pages/learn/index.vue
Severity: med

## Problem
The explorer needs a page. `/learn/explore/<topic>` shows the topic chips, then the topic
title, week and summary, then the `Trace` panel with the topic code. `/learn/explore`
opens the first topic, and an unknown topic is a 404. The Learn page gets a card that
links to it. Explore stays under Learn, so the sidebar keeps 5 items and the phone tab bar
does not change.

Do this after specs 058 and 060.

## Required change
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components.

1. **Create `app/pages/learn/explore/[[topic]].vue`** with exactly this content.
```vue
<script setup lang="ts">
const route = useRoute()

const { data: topics } = await useAsyncData('explorer', () => queryCollection('explorer').order('stem', 'ASC').all())

// /learn/explore opens the first topic.
const topic = computed(() => {
  const all = topics.value ?? []
  return route.params.topic ? all.find((t) => t.topic === route.params.topic) : all[0]
})

if (!topic.value) {
  throw createError({ statusCode: 404, statusMessage: 'Topic not found', fatal: true })
}

useHead({ title: () => `${topic.value?.title} · Explore · PythonFlow` })
</script>

<template>
  <div class="page">
    <header>
      <h1>Explore</h1>
      <p class="sub">Run real Python one step at a time and watch each variable change.</p>
    </header>
    <nav aria-label="Topics">
      <ul class="topics">
        <li v-for="t in topics" :key="t.topic">
          <NuxtLink
            :to="`/learn/explore/${t.topic}`"
            class="topic"
            :aria-current="t.topic === topic?.topic ? 'page' : undefined"
          >
            {{ t.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <section v-if="topic" aria-labelledby="topic-title">
      <h2 id="topic-title">{{ topic.title }}</h2>
      <p class="sub">Week {{ topic.week }} · {{ topic.summary }}</p>
      <Trace :key="topic.topic" :code="topic.code" />
    </section>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
  max-width: 52rem;
}

.sub {
  margin: var(--s2) 0 0;
  color: var(--text-2);
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.topic {
  display: inline-block;
  padding: var(--s1) var(--s3);
  border-radius: var(--r-pill);
  background: var(--surface-2);
  color: var(--text-2);
  font-size: var(--text-s);
  font-weight: 500;
  text-decoration: none;
}

.topic:hover {
  color: var(--text);
}

.topic[aria-current='page'] {
  background: var(--accent-soft);
  color: var(--accent-text);
}
</style>
```

2. **Replace the whole of `app/pages/learn/index.vue`** with exactly this content. Delete everything in the file first.
```vue
<script setup lang="ts">
import { Clock, Telescope } from '@lucide/vue'

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
```

## Acceptance gates
- `git status --short` lists `?? app/pages/learn/explore/` and ` M app/pages/learn/index.vue`
  and nothing else.
- `wc -c < "app/pages/learn/explore/[[topic]].vue"` prints `2000` and
  `wc -c < app/pages/learn/index.vue` prints `2526`.
- `grep -c "^import" "app/pages/learn/explore/[[topic]].vue"` prints `0`, and
  `grep -c "^import" app/pages/learn/index.vue` prints `1`.
- `npm run generate` exits 0, and `.output/public/learn/explore/loops/index.html` exists
  and contains `Loops`.
- Browser (Orca), at `/learn/explore/variables`:
  - Press Run and trace. The status says `Traced 6 steps`, the stepper says
    `Step 1 of 6 · line 1`, and line 1 of the editor is highlighted.
  - Press Step twice. The stepper says `Step 3 of 6 · line 3`, and the variables show
    `name` (`str`, `'Ada'`) and `age` (`int`, `36`).
  - Press Last. `age` is `37`, and the output shows `Hello, Ada 37`.
  - Type a space in the editor. The steps are hidden and the status says the code has
    changed.
- Browser (Orca), at `/learn/explore/functions`: step to the first step inside `square`.
  The call stack shows `square(n=3)` above `sum_of_squares(a=3, b=4)` above `main program`.
- Browser (Orca), at `/learn/explore/exceptions`: an exception step shows
  `IndexError: list index out of range` with its explanation.
