# 032: Today page with greeting and Continue card (task A11)
Files: app/utils/greeting.ts, app/components/ContinueCard.vue, app/pages/index.vue
Severity: med

## Problem
`/` still renders `content/index.md`, a static welcome. Task A11 replaces it with the
Today page: a greeting by time of day (with the name from Settings when one is set) and
a Continue card. Rules from the proposal:
- Continue shows "the most recently opened lesson that is not completed, from
  `lessons[path].openedAt`". With fresh storage it says "Start with Hello, world".
- No emoji (ruling 5). The card shows a week badge "W0", not the Python logo (ruling 6).
- The mock subline "You're doing great!" is praise the app cannot back, so it is not used.

`nextLesson()` from spec 028 already does the Continue rule, including the fallback to
the first unfinished lesson. The clock is read after mount: the page is prerendered, so
reading it during setup would bake the build time into the HTML. Until then the heading
says "Welcome".

Do this spec after 028, 029 and 031 (it uses the `<progress>` style from 031). Then the
orchestrator runs shell step `specs/shell/033-remove-index-md.md`.

## Required change
1. Create `app/utils/greeting.ts` with exactly this content.
```ts
// hour is null before the page mounts, when the visitor's clock is not known yet.
export function greeting(hour: number | null, name: string): string {
  let words = 'Welcome'
  if (hour !== null) words = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  return name ? `${words}, ${name}` : words
}
```

2. Create `app/components/ContinueCard.vue` with exactly this content.
```vue
<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import type { CourseWeek } from '~/composables/useCourse'

const props = defineProps<{ weeks: CourseWeek[] }>()
const { progress } = useProgress()

const lessons = computed(() => props.weeks.flatMap((w) => w.lessons))
const next = computed(() => nextLesson(progress.value, lessons.value.map((l) => l.path)))
const lesson = computed(() => lessons.value.find((l) => l.path === next.value?.path) ?? null)
const week = computed(() => props.weeks.find((w) => w.week === lesson.value?.week) ?? null)
const weekPaths = computed(() => week.value?.lessons.map((l) => l.path) ?? [])
const done = computed(() => completedCount(progress.value, weekPaths.value))
</script>

<template>
  <section class="card" aria-labelledby="continue-title">
    <template v-if="lesson && week">
      <p class="eyebrow">{{ next?.resume ? 'Continue learning' : 'Start here' }}</p>
      <div class="head">
        <span class="badge" aria-hidden="true">W{{ week.week }}</span>
        <div>
          <h2 id="continue-title">{{ next?.resume ? lesson.title : `Start with ${lesson.title}` }}</h2>
          <p class="meta">
            Week {{ week.week }}: {{ week.title }}<template v-if="lesson.minutes"> · {{ lesson.minutes }} min</template>
          </p>
        </div>
      </div>
      <p class="count">
        <progress :value="done" :max="weekPaths.length" :aria-label="`Lessons completed in week ${week.week}`" />
        {{ done }} / {{ weekPaths.length }} lessons
      </p>
      <NuxtLink :to="lesson.path" class="btn-primary">
        {{ next?.resume ? 'Continue' : 'Start lesson' }} <ArrowRight :size="16" aria-hidden="true" />
      </NuxtLink>
    </template>
    <template v-else>
      <h2 id="continue-title">You have finished every lesson</h2>
      <p class="meta">New lessons appear on the Learn page as they are added.</p>
      <NuxtLink to="/learn" class="btn-secondary">See all lessons</NuxtLink>
    </template>
  </section>
</template>

<style scoped>
.eyebrow {
  margin: 0 0 var(--s3);
  color: var(--text-2);
  font-size: var(--text-s);
  font-weight: 600;
}

.head {
  display: flex;
  align-items: center;
  gap: var(--s3);
}

.badge {
  display: grid;
  place-items: center;
  flex: none;
  width: var(--s7);
  height: var(--s7);
  border-radius: var(--r-m);
  background: var(--accent-soft);
  color: var(--accent-text);
  font-weight: 700;
}

h2 {
  margin: 0;
}

.meta {
  margin: var(--s1) 0 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

.count {
  display: flex;
  align-items: center;
  gap: var(--s3);
  margin: var(--s4) 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

.count progress {
  flex: 1;
  max-width: 16rem;
}

.btn-primary,
.btn-secondary {
  text-decoration: none;
}
</style>
```

3. Create `app/pages/index.vue` with exactly this content.
```vue
<script setup lang="ts">
const weeks = await useCourse()
const { progress } = useProgress()

// The clock is read after mount so the prerendered page and the first render match.
const hour = ref<number | null>(null)
onMounted(() => (hour.value = new Date().getHours()))
const title = computed(() => greeting(hour.value, progress.value.name))

useHead({ title: 'Today · PythonFlow' })
</script>

<template>
  <div class="page">
    <header>
      <h1>{{ title }}</h1>
      <p class="sub">Short lessons, real Python, at your own pace.</p>
    </header>
    <div class="grid">
      <div class="main">
        <ContinueCard :weeks="weeks" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
}

.sub {
  margin: var(--s2) 0 0;
  color: var(--text-2);
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  align-items: start;
  gap: var(--s5);
}

.main {
  display: grid;
  gap: var(--s5);
}

@media (max-width: 64rem) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
```

## Acceptance gates
- `npm run generate` exits 0, and `.output/public/index.html` contains
  `Start with Hello, world` and does not contain `Learn Python with a personal tutor`.
- In the browser with empty storage, `/` shows a "Good morning", "Good afternoon" or
  "Good evening" heading that matches the local hour, and the card "Start with Hello,
  world" with "0 / 1 lessons" and a "Start lesson" link.
- After opening the hello lesson and going back to `/`, the card says "Continue
  learning", "Hello, world", and the link says "Continue".
- After `localStorage` progress has a name (in the console:
  `const p = JSON.parse(localStorage.getItem('pythonflow:v1')); p.name = 'Sam'; localStorage.setItem('pythonflow:v1', JSON.stringify(p))`,
  then reload), the heading ends with ", Sam".
- At a window width of 375 px the page has no horizontal scroll.
- `grep -nE '#[0-9a-fA-F]{3,6}\b|: any\b|<any>|as any' app/components/ContinueCard.vue app/pages/index.vue app/utils/greeting.ts`
  prints nothing.
