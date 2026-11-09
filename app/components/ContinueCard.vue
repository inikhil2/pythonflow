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
