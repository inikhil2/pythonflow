<script setup lang="ts">
import { ChevronLeft, ChevronRight, ExternalLink } from '@lucide/vue'

const route = useRoute()

const { data: problem } = await useAsyncData('interview-' + route.path, () =>
  queryCollection('interview').path(route.path).first(),
)

if (!problem.value) {
  throw createError({ statusCode: 404, statusMessage: 'Problem not found', fatal: true })
}

const { path, title, tier, topic, companies, leetcode, url, needs } = problem.value

// Previous and Next stay inside the tier, in the same order as the list.
const all = await useInterview()
const sameTier = tierProblems(all.value, tier)
const index = sameTier.findIndex((p) => p.path === path)
const previous = sameTier[index - 1] ?? null
const next = sameTier[index + 1] ?? null

// Each prerequisite links to its lesson by title.
const weeks = await useCourse()
const lessonTitles = new Map(weeks.value.flatMap((w) => w.lessons).map((l) => [l.path, l.title]))
const lessons = needs.map((p) => ({ path: p, title: lessonTitles.get(p) ?? p }))

const { progress } = useProgress()
const exerciseId = sameTier[index]?.exerciseId ?? ''
const solved = computed(() => isSolved(progress.value, exerciseId))

useHead({ title: `${title} · PythonFlow` })
</script>

<template>
  <article class="problem">
    <NuxtLink to="/interview" class="back">
      <ChevronLeft :size="16" aria-hidden="true" /> All interview problems
    </NuxtLink>
    <header class="head">
      <div class="tags">
        <span class="tier">{{ tier.charAt(0).toUpperCase() + tier.slice(1) }}</span>
        <span class="topic">{{ topic }}</span>
        <StatusChip :status="solved ? 'completed' : 'not-started'" />
      </div>
      <h1>{{ title }}</h1>
      <p class="companies">Often asked at {{ companies.join(', ') }}</p>
      <a :href="url" class="leetcode" target="_blank" rel="noopener">
        LeetCode #{{ leetcode }} <ExternalLink :size="14" aria-hidden="true" />
        <span class="visually-hidden">(opens in a new tab)</span>
      </a>
      <div v-if="lessons.length" class="review">
        <p>Review these lessons first</p>
        <ul>
          <li v-for="lesson in lessons" :key="lesson.path">
            <NuxtLink :to="lesson.path">{{ lesson.title }}</NuxtLink>
          </li>
        </ul>
      </div>
    </header>
    <ContentRenderer v-if="problem" :value="problem" class="prose" />
    <nav class="pager" aria-label="Problems in this tier">
      <NuxtLink v-if="previous" :to="previous.path" class="btn-secondary">
        <ChevronLeft :size="16" aria-hidden="true" /> {{ previous.title }}
      </NuxtLink>
      <NuxtLink v-if="next" :to="next.path" class="btn-primary next">
        Next problem: {{ next.title }} <ChevronRight :size="16" aria-hidden="true" />
      </NuxtLink>
    </nav>
  </article>
</template>

<style scoped>
.problem {
  max-width: 46rem;
}

/* From 75rem the page widens so the workbench splits beside the text, as in lessons. */
@media (min-width: 75rem) {
  .problem {
    max-width: none;
  }
}

.back {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  min-height: 2.75rem;
  color: var(--text-2);
  font-size: var(--text-s);
  text-decoration: none;
}

.head {
  margin: var(--s4) 0 var(--s5);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s2);
}

.tier,
.topic {
  padding: var(--s1) var(--s2);
  border-radius: var(--r-pill);
  font-size: var(--text-xs);
  font-weight: 500;
}

.tier {
  background: var(--accent-soft);
  color: var(--accent-text);
}

.topic {
  background: var(--surface-2);
  color: var(--text-2);
}

h1 {
  margin: var(--s2) 0 var(--s2);
  font-size: var(--text-2xl);
}

.companies {
  margin: 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

.leetcode {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  min-height: 2.75rem;
  margin-top: var(--s1);
  color: var(--accent-text);
  font-weight: 500;
  text-decoration: none;
}

.review {
  margin-top: var(--s4);
  padding-top: var(--s4);
  border-top: 1px solid var(--line);
}

.review p {
  margin: 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

.review ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2) var(--s4);
  margin: var(--s2) 0 0;
  padding: 0;
  list-style: none;
}

.review a {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
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
