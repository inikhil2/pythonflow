# 069: Project page with one milestone at a time (task D2)
Files: app/pages/projects/[slug]/[[milestone]].vue, app/components/MilestoneList.vue, app/components/content/Exercise.vue
Severity: med

## Problem
Each project needs its own page. `/projects/<slug>` shows milestone 1, and
`/projects/<slug>/<milestone id>` shows any other milestone. It must be a path, not a
`?m=` query, because `nuxt generate` prerenders each path. A query would make the
client render a different milestone from the prerendered HTML. An unknown slug or milestone id is a 404.

The page has:
- a back link "All projects";
- the title, summary and note, with a status chip and "N/M milestones";
- `MilestoneList`, one pill link per milestone, with a check when passed and
  `aria-current="step"` on the current one;
- the milestone as an `Exercise`;
- previous and next milestone links.
Milestones reuse `Exercise`, so code, hints and passes are saved under the milestone id.

`Exercise` gets an optional `title` prop. Lessons keep "Try it yourself", and milestones
show "Milestone 2: Add them".

Do this after spec 068.

## Required change
1. **Create `app/pages/projects/[slug]/[[milestone]].vue`** with exactly this content.
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
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components.

The folder is `app/pages/projects/[slug]/` and the file name is `[[milestone]].vue`, with double
square brackets, which marks an optional route param.

2. **Create `app/components/MilestoneList.vue`** with exactly this content.
```vue
<script setup lang="ts">
import { CircleCheck, Circle } from '@lucide/vue'

defineProps<{ milestones: { id: string; title: string }[]; current: string; link: (id: string) => string }>()
const { progress } = useProgress()
</script>

<template>
  <nav aria-label="Milestones">
    <ol class="milestones">
      <li v-for="(m, i) in milestones" :key="m.id">
        <NuxtLink :to="link(m.id)" :aria-current="m.id === current ? 'step' : undefined">
          <CircleCheck v-if="progress.exercises[m.id]?.passedAt" class="done" :size="16" aria-hidden="true" />
          <Circle v-else :size="16" aria-hidden="true" />
          {{ i + 1 }}. {{ m.title }}
          <span v-if="progress.exercises[m.id]?.passedAt" class="visually-hidden">(passed)</span>
        </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.milestones {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  display: inline-flex;
  align-items: center;
  gap: var(--s2);
  padding: var(--s2) var(--s3);
  border-radius: var(--r-pill);
  background: var(--surface-2);
  color: var(--text-2);
  font-size: var(--text-s);
  text-decoration: none;
}

a:hover {
  color: var(--text);
}

a[aria-current='step'] {
  background: var(--accent-soft);
  color: var(--accent-text);
  font-weight: 600;
}

.done {
  color: var(--success);
}
</style>
```
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components.

3. **Replace the whole of `app/components/content/Exercise.vue`** with exactly this content. Delete everything in the file first.
```vue
<script setup lang="ts">
import { CircleCheck, ListChecks } from '@lucide/vue'
import type { CaseResult, TestCase } from '~/composables/useChecker'

const props = defineProps<{
  id: string
  title?: string
  prompt: string
  starter?: string
  tests?: TestCase[]
  hints?: string[]
  solution?: string
}>()

const code = ref(props.starter ?? '')
const panel = ref<{ run: () => void }>()

const { running } = usePython()
const { checking, check } = useChecker()
const { progress, recordAttempt, revealHint, saveCode } = useProgress()
const results = ref<CaseResult[] | null>(null)
const passed = computed(() => !!progress.value.exercises[props.id]?.passedAt)
const hintsUsed = computed(() => progress.value.exercises[props.id]?.hintsUsed ?? 0)

onMounted(() => {
  // '' means never saved: hints and attempts create the entry with empty code.
  const saved = progress.value.exercises[props.id]?.code
  if (saved) code.value = saved
})

// Save 500 ms after the last change, and at once when the lesson closes.
let timer: ReturnType<typeof setTimeout> | undefined
function flush() {
  clearTimeout(timer)
  timer = undefined
  saveCode(props.id, code.value)
}
watch(code, () => {
  clearTimeout(timer)
  timer = setTimeout(flush, 500)
})
onBeforeUnmount(() => {
  if (timer) flush()
})

async function checkAnswer() {
  results.value = await check(code.value, props.tests ?? [])
  const category = failureCategory(results.value)
  // Pressing Stop during a check is not an attempt.
  if (category === 'Stopped.') return
  recordAttempt({ id: props.id, at: new Date().toISOString(), passed: category === null, category, concepts: [] })
}
</script>

<template>
  <section :id="id" class="card exercise" :aria-labelledby="`${id}-title`">
    <h2 :id="`${id}-title`">{{ title ?? 'Try it yourself' }}</h2>
    <p class="prompt">{{ prompt }}</p>
    <div class="workbench">
      <CodeEditor v-model="code" label="Your code" @run="panel?.run()" />
      <RunPanel ref="panel" :code="code" @reset="code = starter ?? ''" />
    </div>
    <div class="actions">
      <button v-if="tests?.length" type="button" class="btn-primary" :disabled="running || checking" @click="checkAnswer">
        <ListChecks :size="16" aria-hidden="true" /> {{ checking ? 'Checking…' : 'Check answer' }}
      </button>
      <p v-if="passed" class="passed"><CircleCheck :size="16" aria-hidden="true" /> Passed</p>
      <p class="keys">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (<kbd>⌘</kbd> + <kbd>Enter</kbd> on Mac) to run.</p>
    </div>
    <TestResults v-if="results" :results="results" :total="tests?.length ?? 0" />
    <HintList v-if="hints?.length" :hints="hints" :shown="hintsUsed" @reveal="revealHint(id)" />
  </section>
</template>

<style scoped>
.exercise {
  margin: var(--s6) 0;
}

.prompt {
  margin: var(--s2) 0 var(--s4);
  color: var(--text-2);
}

.workbench {
  overflow: hidden;
  border-radius: var(--r-l);
  background: var(--code-bg);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s3);
  margin-top: var(--s3);
}

.passed {
  display: flex;
  align-items: center;
  gap: var(--s1);
  margin: 0;
  color: var(--success);
  font-weight: 600;
}

.keys {
  margin: 0 0 0 auto;
  color: var(--text-2);
  font-size: var(--text-s);
}

kbd {
  font-family: var(--font);
  font-size: var(--text-xs);
  padding: 0 var(--s1);
  border-radius: var(--r-s);
  background: var(--surface-2);
}
</style>
```

Only two lines differ from the current file: the `title?: string` prop and the h2 text.

## Acceptance gates
1. Sizes:
   wc -c "app/pages/projects/[slug]/[[milestone]].vue"   # expect 3166
   wc -c "app/components/MilestoneList.vue"   # expect 1381
   wc -c "app/components/content/Exercise.vue"   # expect 3428
2. `git diff app/components/content/Exercise.vue` shows 2 insertions and 1 deletion.
3. `npx nuxi typecheck` exits 0.
4. `npm run generate` exits 0. Its log lists `/projects/calculator` and `/projects/calculator/calculator-1` to
   `calculator-4`.
5. Browser: on `/projects/calculator/calculator-2`, the h2 reads "Milestone 2: Add them"
   and the "2." pill is highlighted. Pasting milestone 2's solution from
   `content/projects/01-calculator.yml` and pressing Check answer passes both tests. The
   "2." pill then shows a check, and `/projects` shows "In progress" and "1/4 milestones".
6. Browser: a lesson exercise still shows "Try it yourself". `/projects/nope` and
   `/projects/calculator/nope` show the 404 page.
