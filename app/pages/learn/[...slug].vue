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
// Interview problems list the lessons they need; this lesson shows the ones that need it.
const interview = await useInterview()
const practice = computed(() => problemsNeeding(interview.value, path))
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
    <PracticeFromLesson v-if="practice.length" :problems="practice" />
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
