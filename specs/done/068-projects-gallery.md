# 068: Projects collection, ProjectCard and the gallery page (task D1)
Files: content.config.ts, app/components/ProjectCard.vue, app/pages/projects/index.vue
Severity: med

## Problem
`/projects` needs the gallery from proposal screen 5. The heading is "Projects" with the line
"Build real-world projects and apply what you've learned.". Below it is a two-column grid of cards (one column
under 48rem). Each card is one link to `/projects/<slug>`. It shows a 48px icon tile, a chevron, the title, the
summary, "Recommended after Week N · Uses: ..." (concept titles), the note when there is
one, a status chip and "N/M milestones". Nothing is locked.

Every card uses the accent tint. The icon field picks a lucide icon. An unknown name falls back to
`FolderKanban`, the sidebar's Projects icon.

Do this after shell steps 064 and 066 and spec 067.

## Required change
1. **Replace the whole of `content.config.ts`** with exactly this content. Delete everything in the file first.
```ts
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // content/week0-functions/01-hello.md is served at /learn/week0-functions/01-hello
    lessons: defineCollection({
      type: 'page',
      // Every lesson lives in a week folder; root files belong to pages.
      source: { include: '**/*.md', exclude: ['*.md'], prefix: '/learn' },
      schema: z.object({
        week: z.number(),
        order: z.number(),
        minutes: z.number().optional(),
        concepts: z.array(z.string()).optional(), // ids from content/concepts.yml
      }),
    }),
    pages: defineCollection({
      type: 'page',
      source: '*.md',
    }),
    weeks: defineCollection({
      type: 'data',
      source: 'weeks.yml',
      schema: z.object({
        weeks: z.array(z.object({ week: z.number(), title: z.string(), summary: z.string() })),
      }),
    }),
    concepts: defineCollection({
      type: 'data',
      source: 'concepts.yml',
      schema: z.object({
        concepts: z.array(
          z.object({ id: z.string(), title: z.string(), week: z.number(), group: z.string(), requires: z.array(z.string()) }),
        ),
      }),
    }),
    // One visual explorer topic per file, e.g. content/explorer/01-variables.yml.
    explorer: defineCollection({
      type: 'data',
      source: 'explorer/*.yml',
      schema: z.object({ topic: z.string(), title: z.string(), summary: z.string(), week: z.number(), code: z.string() }),
    }),
    // One project per file, e.g. content/projects/01-calculator.yml; scripts/check-projects.ts runs every solution.
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        summary: z.string(),
        icon: z.string(),
        requires: z.array(z.string()), // ids from content/concepts.yml
        afterWeek: z.number(),
        note: z.string().optional(),
        milestones: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            prompt: z.string(),
            starter: z.string(),
            // Same shape as TestCase in app/composables/useChecker.ts.
            tests: z.array(
              z.union([
                z.object({ stdin: z.string().optional(), stdout: z.string() }),
                z.object({ stdin: z.string().optional(), check: z.string() }),
              ]),
            ),
            hints: z.array(z.string()),
            solution: z.string(),
          }),
        ),
      }),
    }),
  },
})
```

2. **Create `app/components/ProjectCard.vue`** with exactly this content.
```vue
<script setup lang="ts">
import { Calculator, ChevronRight, Cloud, Dices, FileText, FolderKanban, Wallet } from '@lucide/vue'
import type { Component } from 'vue'
import type { ProjectsCollectionItem } from '@nuxt/content'

const props = defineProps<{ project: ProjectsCollectionItem; uses: string[] }>()
const { progress } = useProgress()

// The icon field names one of these; anything else gets the Projects nav icon.
const icons: Record<string, Component> = { calculator: Calculator, cloud: Cloud, dices: Dices, 'file-text': FileText, wallet: Wallet }
const icon = computed(() => icons[props.project.icon] ?? FolderKanban)

const ids = computed(() => props.project.milestones.map((m) => m.id))
const passed = computed(() => milestonesPassed(progress.value, ids.value))
const status = computed(() => projectStatus(progress.value, ids.value))
</script>

<template>
  <NuxtLink :to="`/projects/${project.slug}`" class="card project">
    <span class="top">
      <span class="icon"><component :is="icon" :size="24" aria-hidden="true" /></span>
      <ChevronRight class="chevron" :size="20" aria-hidden="true" />
    </span>
    <h2>{{ project.title }}</h2>
    <p class="summary">{{ project.summary }}</p>
    <p class="small">Recommended after Week {{ project.afterWeek }} · Uses: {{ uses.join(', ') }}</p>
    <p v-if="project.note" class="small">{{ project.note }}</p>
    <span class="foot">
      <StatusChip :status="status" />
      <span class="small">{{ passed }}/{{ ids.length }} milestones</span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
  gap: var(--s2);
  height: 100%;
  color: var(--text);
  text-decoration: none;
}

.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--s2);
}

.icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--r-m);
  background: var(--accent-soft);
  color: var(--accent-text);
}

.chevron {
  color: var(--text-2);
  transition: transform var(--dur) var(--ease);
}

.project:hover h2 {
  color: var(--accent-text);
}

.project:hover .chevron {
  transform: translateX(var(--s1));
}

h2 {
  margin: 0;
  font-size: var(--text-l);
}

.summary {
  margin: 0;
  color: var(--text-2);
}

.small {
  margin: 0;
  color: var(--text-2);
  font-size: var(--text-xs);
}

.foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2);
  margin-top: auto;
  padding-top: var(--s2);
}

@media (prefers-reduced-motion: reduce) {
  .chevron { transition: none; }
}
</style>
```
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components.

3. **Create `app/pages/projects/index.vue`** with exactly this content.
```vue
<script setup lang="ts">
const { data: projects } = await useAsyncData('projects', () => queryCollection('projects').order('stem', 'ASC').all())
const concepts = await useConcepts()

// "Uses:" names each concept by its title, in the order the project lists them.
const titles = computed(() => new Map(concepts.value.map((c) => [c.id, c.title])))
const uses = (ids: string[]) => ids.map((id) => titles.value.get(id) ?? id)

useHead({ title: 'Projects · PythonFlow' })
</script>

<template>
  <div class="page">
    <header>
      <h1>Projects</h1>
      <p class="sub">Build real-world projects and apply what you've learned.</p>
    </header>
    <ul v-if="projects?.length" class="grid">
      <li v-for="p in projects" :key="p.slug">
        <ProjectCard :project="p" :uses="uses(p.requires)" />
      </li>
    </ul>
    <EmptyState
      v-else
      title="Nothing here yet"
      body="Projects are bigger programs built in milestones, such as a calculator and a guessing game."
      action="Go to lessons"
      to="/learn"
    />
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
  grid-template-columns: 1fr 1fr;
  gap: var(--s5);
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 48rem) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

## Acceptance gates
1. Sizes:
   wc -c "content.config.ts"   # expect 2612
   wc -c "app/components/ProjectCard.vue"   # expect 2628
   wc -c "app/pages/projects/index.vue"   # expect 1395
2. `grep -c "^import" app/components/ProjectCard.vue` prints 3, and
   `grep -c "^import" app/pages/projects/index.vue` prints 0.
3. `npx nuxi typecheck` exits 0.
4. `npm run generate` exits 0. `grep -o "Recommended after Week 1 · Uses: [^<]*" .output/public/projects/index.html`
   prints `Recommended after Week 1 · Uses: Reading input, Integers and floats, if, elif and else`.
5. Browser: `/projects` shows the Calculator card with "Not started" and "0/4 milestones".
   Keyboard Tab reaches the card, and the whole card is one link.
