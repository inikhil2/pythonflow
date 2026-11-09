# 075: Wide lesson and project pages from 75rem (task E3)
Files: app/pages/learn/[...slug].vue, app/pages/projects/[slug]/[[milestone]].vue
Severity: med

## Problem
Lesson and project pages are capped at 46rem, so the exercise card never reaches the 50rem
that spec 074 needs for its split. From 75rem wide, both pages drop the cap. Their text
keeps a 40rem reading measure: lesson paragraphs, lists and code blocks, and the project
summary and note. Under 75rem nothing changes.

Do this after spec 074.

## Required change
1. **Replace the whole of `app/pages/learn/[...slug].vue`** with exactly this content. Delete everything in the file first.
```vue
<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const route = useRoute()

const { data: lesson } = await useAsyncData('lesson-' + route.path, () =>
  queryCollection('lessons').path(route.path).first(),
)

if (!lesson.value) {
  throw createError({ statusCode: 404, statusMessage: 'Lesson not found', fatal: true })
}

const { data: around } = await useAsyncData('lesson-around-' + route.path, () =>
  queryCollectionItemSurroundings('lessons', route.path, { fields: ['title'] }).order('week', 'ASC').order('order', 'ASC'),
)

const previous = computed(() => around.value?.[0] ?? null)
const next = computed(() => around.value?.[1] ?? null)

// "Lesson n of m" and the week bar count only this lesson's week.
const weeks = await useCourse()
const weekPaths = weeks.value.find((w) => w.week === lesson.value?.week)?.lessons.map((l) => l.path) ?? []
const position = weekPaths.indexOf(lesson.value.path) + 1

// Progress is keyed by the content path, which does not change with trailing slashes.
const path = lesson.value.path
const { progress, openLesson, completeLesson } = useProgress()
onMounted(() => openLesson(path))

// Passing every exercise completes the lesson; the first completion time is kept.
const ids = exerciseIds(lesson.value.body)
const allPassed = computed(() => ids.length > 0 && ids.every((id) => !!progress.value.exercises[id]?.passedAt))
watch(allPassed, (done) => {
  if (done) completeLesson(path)
})
const completed = computed(() => !!progress.value.lessons[path]?.completedAt)
const weekDone = computed(() => completedCount(progress.value, weekPaths))

useHead({ title: `${lesson.value.title} · PythonFlow` })
</script>

<template>
  <article v-if="lesson" class="lesson">
    <NuxtLink to="/learn" class="back">
      <ChevronLeft :size="16" aria-hidden="true" /> All lessons
    </NuxtLink>
    <LessonHeader
      :title="lesson.title"
      :week="lesson.week"
      :minutes="lesson.minutes"
      :position="position"
      :total="weekPaths.length"
      :done="weekDone"
      :completed="completed"
    />
    <ContentRenderer :value="lesson" class="prose" />
    <nav class="pager" aria-label="Lessons">
      <NuxtLink v-if="previous" :to="previous.path" class="btn-secondary">
        <ChevronLeft :size="16" aria-hidden="true" /> {{ previous.title }}
      </NuxtLink>
      <NuxtLink v-if="next" :to="next.path" class="btn-primary next">
        Next lesson: {{ next.title }} <ChevronRight :size="16" aria-hidden="true" />
      </NuxtLink>
    </nav>
  </article>
</template>

<style scoped>
.lesson {
  max-width: 46rem;
}

/* From 75rem the page widens so each exercise splits in two; the text keeps its 40rem measure. */
@media (min-width: 75rem) {
  .lesson {
    max-width: none;
  }
}

.back {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  color: var(--text-2);
  font-size: var(--text-s);
  text-decoration: none;
}

.prose {
  font-size: var(--text-body);
  line-height: 1.65;
}

/* Direct children only, so lesson styles stay out of the workbench. */
.prose > :deep(p),
.prose > :deep(ul),
.prose > :deep(pre) {
  max-width: 40rem;
}

.prose > :deep(pre) {
  padding: var(--s4);
  border-radius: var(--r-l);
  background: var(--surface-2);
  font-size: 0.875rem;
  line-height: 1.6;
  overflow-x: auto;
}

.prose > :deep(p code),
.prose > :deep(ul code) {
  padding: 0 var(--s1);
  border-radius: var(--r-s);
  background: var(--surface-2);
  font-size: 0.9em;
}

.pager {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3);
  margin-top: var(--s6);
}

.pager a {
  text-decoration: none;
}

.next {
  margin-left: auto;
}
</style>
```

Two things differ from the current file: a `@media (min-width: 75rem)` rule that sets
`.lesson { max-width: none; }`, and `.prose > :deep(pre)` added to the 40rem rule.

2. **Replace the whole of `app/pages/projects/[slug]/[[milestone]].vue`** with exactly this content. Delete everything in the file first.
```vue
<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const route = useRoute()
const slug = String(route.params.slug)

const { data: project } = await useAsyncData('project-' + slug, () =>
  queryCollection('projects').where('slug', '=', slug).first(),
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

// One milestone per page: /projects/<slug> shows the first, /projects/<slug>/<id> any other.
// Path params, not a query, so every milestone is prerendered by nuxt generate.
const milestones = project.value.milestones
const index = route.params.milestone ? milestones.findIndex((m) => m.id === route.params.milestone) : 0
const current = milestones[index]

if (!current) {
  throw createError({ statusCode: 404, statusMessage: 'Milestone not found', fatal: true })
}

const previous = milestones[index - 1]
const next = milestones[index + 1]
const link = (id: string) => `/projects/${slug}/${id}`

const { progress } = useProgress()
const ids = milestones.map((m) => m.id)
const passed = computed(() => milestonesPassed(progress.value, ids))
const status = computed(() => projectStatus(progress.value, ids))

useHead({ title: `${project.value.title} · PythonFlow` })
</script>

<template>
  <article v-if="project" class="project">
    <NuxtLink to="/projects" class="back">
      <ChevronLeft :size="16" aria-hidden="true" /> All projects
    </NuxtLink>
    <header>
      <h1>{{ project.title }}</h1>
      <p class="summary">{{ project.summary }}</p>
      <p v-if="project.note" class="note">{{ project.note }}</p>
      <p class="meta">
        <StatusChip :status="status" />
        <span>{{ passed }}/{{ ids.length }} milestones</span>
      </p>
    </header>
    <MilestoneList :milestones="milestones" :current="current.id" :link="link" />
    <Exercise
      :id="current.id"
      :title="`Milestone ${index + 1}: ${current.title}`"
      :prompt="current.prompt"
      :starter="current.starter"
      :tests="current.tests"
      :hints="current.hints"
    />
    <nav class="pager" aria-label="Previous and next milestone">
      <NuxtLink v-if="previous" :to="link(previous.id)" class="btn-secondary">
        <ChevronLeft :size="16" aria-hidden="true" /> {{ previous.title }}
      </NuxtLink>
      <NuxtLink v-if="next" :to="link(next.id)" class="btn-primary next">
        Next milestone: {{ next.title }} <ChevronRight :size="16" aria-hidden="true" />
      </NuxtLink>
    </nav>
  </article>
</template>

<style scoped>
.project {
  max-width: 46rem;
}

/* From 75rem the page widens so the milestone exercise splits in two, as on lesson pages. */
@media (min-width: 75rem) {
  .project {
    max-width: none;
  }
}

.back {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  color: var(--text-2);
  font-size: var(--text-s);
  text-decoration: none;
}

.summary,
.note {
  max-width: 40rem;
  margin: var(--s2) 0 0;
  color: var(--text-2);
}

.note {
  font-size: var(--text-s);
}

.meta {
  display: flex;
  align-items: center;
  gap: var(--s3);
  margin: var(--s3) 0 var(--s5);
  color: var(--text-2);
  font-size: var(--text-s);
}

.pager {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3);
  margin-top: var(--s6);
}

.pager a {
  text-decoration: none;
}

.next {
  margin-left: auto;
}
</style>
```

Two things differ from the current file: the same media rule for `.project`, and
`max-width: 40rem` on `.summary, .note`.

## Acceptance gates
1. Sizes:
   wc -c "app/pages/learn/[...slug].vue"   # expect 3641
   wc -c "app/pages/projects/[slug]/[[milestone]].vue"   # expect 3349
2. `git diff --stat -- app/pages/learn app/pages/projects` shows only these two files, with 17 insertions and 1 deletion in all.
3. `npx nuxi typecheck` exits 0.
4. `npm run generate` exits 0.
5. Browser gates are run by Orca, in the dark theme, at 1440, 834 and 390 px wide. At 1440 a lesson exercise and a project milestone show the text on the left
   and the dark workbench on the right. Scrolling a long exercise keeps the workbench in
   view. Lesson paragraphs are no wider than before. At 834 and 390 the layout is unchanged.
