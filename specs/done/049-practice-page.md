# 049: Practice page queue (task B6)
Files: app/components/PracticeItem.vue, app/pages/practice.vue
Severity: med

## Problem
`/practice` is still a placeholder EmptyState. The proposal says the queue comes first from
concepts that need revision, then from unpassed exercises in opened lessons. Each item says
why it is there and opens the lesson at the exercise (`#<exercise id>`; `Exercise.vue`
already sets `id` on its section). The rules are in `recommendations()` (spec 046).

Do this spec after 046.

## Required change
Keep every import line exactly as shown and add no others. `useCourse`, `useConcepts`,
`useProgress`, `recommendations` and `computed` are auto-imported by Nuxt.

1. Create `app/components/PracticeItem.vue` with exactly this content.
```vue
<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import type { QueueItem } from '~/utils/mastery'

defineProps<{ item: QueueItem }>()
</script>

<template>
  <li class="card item">
    <div>
      <h2>Exercise {{ item.number }} in {{ item.title }}</h2>
      <p class="reason">{{ item.reason }}</p>
    </div>
    <NuxtLink :to="`${item.path}#${item.exercise}`" class="btn-secondary">
      Open <ArrowRight :size="16" aria-hidden="true" />
      <span class="visually-hidden">exercise {{ item.number }} in {{ item.title }}</span>
    </NuxtLink>
  </li>
</template>

<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s4);
}

h2 {
  margin: 0;
  font-size: var(--text-m);
}

.reason {
  margin: var(--s1) 0 0;
  color: var(--text-2);
}
</style>
```

2. **Replace the whole of `app/pages/practice.vue`** with exactly this content.
```vue
<script setup lang="ts">
const weeks = await useCourse()
const concepts = await useConcepts()
const { progress } = useProgress()

const lessons = computed(() => weeks.value.flatMap((w) => w.lessons))
const queue = computed(() => recommendations(progress.value, lessons.value, concepts.value))

useHead({ title: 'Practice · PythonFlow' })
</script>

<template>
  <div class="page">
    <h1>Practice</h1>
    <template v-if="queue.length">
      <p class="sub">Concepts to revise come first, then exercises you have not passed in lessons you opened.</p>
      <ol class="queue">
        <PracticeItem v-for="item in queue" :key="item.exercise" :item="item" />
      </ol>
    </template>
    <EmptyState
      v-else
      title="Nothing to practise yet"
      body="Practice collects exercises you have not passed yet and concepts worth revising. It fills up as you work through lessons."
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
  margin: 0;
  color: var(--text-2);
}

.queue {
  display: grid;
  gap: var(--s3);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
```

## Acceptance gates
- `grep -c "^import" app/components/PracticeItem.vue` prints `2`.
- `grep -n "^import" app/pages/practice.vue` prints nothing.
- `wc -c app/components/PracticeItem.vue app/pages/practice.vue` prints numbers above 500 for both.
- `npm run generate` exits 0, and `.output/public/practice/index.html` contains `Nothing to practise yet`.
- Browser (Orca): open the hello lesson, then go to `/practice` without passing. It lists
  `Exercise 1 in Hello, world` with `Not passed yet in a lesson you opened.`. Its Open link
  goes to `/learn/week0-functions/01-hello#w0-l1-ex1` and scrolls to the exercise. Fail
  the exercise twice, then reload `/practice`. The reason now starts with `Revise Printing output`.
