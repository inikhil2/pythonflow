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
