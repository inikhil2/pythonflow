# 048: Progress page, Recommended next, and Exercises passed today (tasks B3, B4, B5)
Files: app/components/NextStep.vue, app/pages/progress.vue, app/pages/index.vue
Severity: med

## Problem
`/progress` is still a placeholder EmptyState. The proposal's honesty table asks for:
- tiles with real counts: lessons completed, concepts mastered, and exercises passed;
- mastery per group and mistake counts;
- "Recommended next" (a concept needing revision, else the next lesson), with its reason in words;
- the dropped Daily Practice ring replaced by "Exercises passed today: N" on the dashboard.

Do this spec after 047.

## Required change
Keep every import line exactly as shown and add no others. `useCourse`, `useConcepts`,
`useProgress`, `nextStep`, `conceptStatus`, `completedCount`, `passedToday`, `computed`, `ref`
and `onMounted` are auto-imported by Nuxt.

1. Create `app/components/NextStep.vue` with exactly this content.
```vue
<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import type { Concept, LessonRef } from '~/utils/mastery'

const props = defineProps<{ concepts: Concept[]; lessons: LessonRef[] }>()
const { progress } = useProgress()

const step = computed(() => nextStep(progress.value, props.lessons, props.concepts))
</script>

<template>
  <section class="card" aria-labelledby="next-title">
    <p class="eyebrow">Recommended next</p>
    <template v-if="step">
      <h2 id="next-title">
        <NuxtLink :to="step.to" class="link">{{ step.title }} <ArrowRight :size="16" aria-hidden="true" /></NuxtLink>
      </h2>
      <p class="reason">{{ step.reason }}</p>
    </template>
    <template v-else>
      <h2 id="next-title">You have finished every lesson</h2>
      <p class="reason">Practice keeps the exercises you have not passed.</p>
    </template>
  </section>
</template>

<style scoped>
.eyebrow {
  margin: 0 0 var(--s2);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-2);
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-size: var(--text-l);
}

.link {
  display: inline-flex;
  align-items: center;
  gap: var(--s2);
  color: var(--accent-text);
}

.reason {
  margin: var(--s2) 0 0;
  color: var(--text-2);
}
</style>
```

2. **Replace the whole of `app/pages/progress.vue`** with exactly this content.
```vue
<script setup lang="ts">
const weeks = await useCourse()
const concepts = await useConcepts()
const { progress } = useProgress()

const lessons = computed(() => weeks.value.flatMap((w) => w.lessons))
const exercises = computed(() => lessons.value.flatMap((l) => l.exercises))
const lessonsDone = computed(() => completedCount(progress.value, lessons.value.map((l) => l.path)))
const mastered = computed(
  () => concepts.value.filter((c) => conceptStatus(progress.value, c.id, lessons.value) === 'mastered').length,
)
const passed = computed(() => exercises.value.filter((id) => progress.value.exercises[id]?.passedAt).length)

useHead({ title: 'Progress · PythonFlow' })
</script>

<template>
  <div class="page">
    <h1>Your progress</h1>
    <div class="tiles">
      <StatTile label="Lessons completed" :value="`${lessonsDone} / ${lessons.length}`" />
      <StatTile label="Concepts mastered" :value="`${mastered} / ${concepts.length}`" />
      <StatTile label="Exercises passed" :value="`${passed} / ${exercises.length}`" />
    </div>
    <div class="grid">
      <div class="main">
        <MasteryList :concepts="concepts" :lessons="lessons" />
        <MistakeList />
      </div>
      <div class="side">
        <NextStep :concepts="concepts" :lessons="lessons" />
        <ActivityBars />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
}

.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--s4);
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  align-items: start;
  gap: var(--s5);
}

.main,
.side {
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

3. **Replace the whole of `app/pages/index.vue`** with exactly this content. It is the
   current file plus `concepts`, `lessons`, `today`, `passed`, the NextStep card and the
   "Exercises passed today" tile in the side column.
```vue
<script setup lang="ts">
const weeks = await useCourse()
const concepts = await useConcepts()
const { progress } = useProgress()

const lessons = computed(() => weeks.value.flatMap((w) => w.lessons))

// The clock is read after mount so the prerendered page and the first render match.
const hour = ref<number | null>(null)
const today = ref<Date | null>(null)
onMounted(() => {
  today.value = new Date()
  hour.value = today.value.getHours()
})
const title = computed(() => greeting(hour.value, progress.value.name))
const passed = computed(() => (today.value ? passedToday(progress.value.exercises, today.value) : 0))

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
        <LearningPath :weeks="weeks" />
      </div>
      <div class="side">
        <NextStep :concepts="concepts" :lessons="lessons" />
        <StatTile label="Exercises passed today" :value="String(passed)" />
        <ActivityBars />
        <RecentActivity :weeks="weeks" />
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

.main,
.side {
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
- `grep -c "^import" app/components/NextStep.vue` prints `2`.
- `grep -n "^import" app/pages/progress.vue app/pages/index.vue` prints nothing.
- `grep -n "EmptyState" app/pages/progress.vue` prints nothing.
- `git diff --stat HEAD -- app/pages` shows both pages changed with more than 0 lines added each,
  and `wc -c app/components/NextStep.vue` prints a number above 500.
- `npm run generate` exits 0.
- `.output/public/progress/index.html` contains `Lessons completed`, `Concepts mastered`,
  `Exercises passed`, `Mastery by topic`, `Python basics`, `Recommended next` and
  `A concept is mastered when` (check each with `grep -c`).
- `.output/public/index.html` contains `Recommended next`, `The first lesson of the course.`
  and `Exercises passed today`.
- Browser (Orca): with fresh storage, `/progress` shows `0 / 1`, `0 / 33` and `0 / 1`.
  Pass the hello exercise without hints, then reload `/progress`. It shows `1 / 1` lessons
  and `1 / 1` exercises, and Python basics shows `2 of 5 mastered`. Print and Strings
  are both mastered, because hello teaches both. Today shows `Exercises passed today` `1`.
