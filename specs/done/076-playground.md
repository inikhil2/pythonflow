# 076: Playground page (task E4)
Files: app/composables/usePlayground.ts, app/pages/playground.vue, app/pages/learn/index.vue
Severity: med

## Problem
Learners need a place to run any Python that is not an exercise. `/playground` shows the
heading "Playground", one line of text and a `Workbench` (spec 074) with no tests.

`usePlayground` owns the code. It starts from a short starter, reads the saved code from
localStorage key `pythonflow:playground` after mount, and saves 500 ms after the last
change. A pending save runs before the page unmounts. Every storage call is in try/catch,
so private windows still work. Reset puts the starter back. It is a separate key from
`pythonflow:v1`, so exporting or resetting progress does not touch it.

The Learn page header gets an "Open the playground" link. Spec 078 adds a sidebar link.

Do this after spec 074.

## Required change
1. **Create `app/composables/usePlayground.ts`** with exactly this content.
```ts
const PLAYGROUND_KEY = 'pythonflow:playground'
const PLAYGROUND_STARTER = '# Write any Python here and press Run.\nfor n in range(1, 4):\n    print(n, n * n)\n'

// The playground's code: read from storage after mount, saved 500 ms after the last change.
export function usePlayground() {
  const code = ref(PLAYGROUND_STARTER)
  let timer: ReturnType<typeof setTimeout> | undefined

  function save() {
    clearTimeout(timer)
    timer = undefined
    try {
      localStorage.setItem(PLAYGROUND_KEY, code.value)
    } catch {
      // Storage is blocked or full: the code stays on screen for this visit.
    }
  }

  onMounted(() => {
    try {
      code.value = localStorage.getItem(PLAYGROUND_KEY) ?? PLAYGROUND_STARTER
    } catch {
      // Storage is blocked (private mode): start from the starter code.
    }
  })
  watch(code, () => {
    clearTimeout(timer)
    timer = setTimeout(save, 500)
  })
  onBeforeUnmount(() => {
    if (timer) save()
  })

  return { code, reset: () => (code.value = PLAYGROUND_STARTER) }
}
```
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components. This file has no imports.

2. **Create `app/pages/playground.vue`** with exactly this content.
```vue
<script setup lang="ts">
const { code, reset } = usePlayground()

useHead({ title: 'Playground · PythonFlow' })
</script>

<template>
  <div class="page">
    <header>
      <h1>Playground</h1>
      <p class="sub">Try any Python here. Nothing is checked, and your code stays in this browser.</p>
    </header>
    <Workbench v-model="code" label="Playground code" @reset="reset" />
    <p class="keys">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (<kbd>⌘</kbd> + <kbd>Enter</kbd> on Mac) to run.</p>
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

.keys {
  margin: 0;
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
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components. This file has no imports.

3. **Replace the whole of `app/pages/learn/index.vue`** with exactly this content. Delete everything in the file first.
```vue
<script setup lang="ts">
import { Clock, SquareTerminal, Telescope } from '@lucide/vue'

const weeks = await useCourse()
const { progress } = useProgress()

// Weeks without lessons yet appear only in the Today learning path.
const taught = computed(() => weeks.value.filter((w) => w.lessons.length > 0))

useHead({ title: 'Learn · PythonFlow' })
</script>

<template>
  <div class="page">
    <header class="head">
      <div>
        <h1>Learn</h1>
        <p class="sub">Lessons follow Harvard's CS50P, one week at a time.</p>
      </div>
      <NuxtLink to="/playground" class="btn-secondary">
        <SquareTerminal :size="16" aria-hidden="true" /> Open the playground
      </NuxtLink>
    </header>
    <NuxtLink to="/learn/explore" class="card explore">
      <Telescope :size="20" aria-hidden="true" />
      <span>
        <strong>Explore</strong>
        <span class="sub">Step through real Python and watch each variable change.</span>
      </span>
    </NuxtLink>
    <section v-for="w in taught" :key="w.week" class="card" :aria-labelledby="`week-${w.week}`">
      <h2 :id="`week-${w.week}`">Week {{ w.week }}: {{ w.title }}</h2>
      <p class="sub">{{ w.summary }}</p>
      <ol class="lessons">
        <li v-for="lesson in w.lessons" :key="lesson.path">
          <NuxtLink :to="lesson.path" class="lesson">
            <span>{{ lesson.title }}</span>
            <span class="meta">
              <span v-if="lesson.minutes" class="time">
                <Clock :size="14" aria-hidden="true" /> {{ lesson.minutes }} min
              </span>
              <StatusChip :status="lessonStatus(progress, lesson.path)" />
            </span>
          </NuxtLink>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
  max-width: 46rem;
}

.sub {
  margin: var(--s2) 0 0;
  color: var(--text-2);
}

.head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--s3);
}

.head .btn-secondary {
  text-decoration: none;
}

.explore {
  display: flex;
  align-items: flex-start;
  gap: var(--s3);
  color: var(--text);
  text-decoration: none;
}

.explore .sub {
  display: block;
  margin-top: var(--s1);
}

.explore:hover strong {
  color: var(--accent-text);
}

.lessons {
  margin: var(--s3) 0 0;
  padding: 0;
  list-style: none;
}

.lessons li + li {
  border-top: 1px solid var(--line);
}

.lesson {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2) var(--s4);
  padding: var(--s3) 0;
  color: var(--text);
  font-weight: 500;
  text-decoration: none;
}

.lesson:hover {
  color: var(--accent-text);
}

.meta,
.time {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
}

.meta {
  gap: var(--s3);
}

.time {
  color: var(--text-2);
  font-size: var(--text-s);
  font-weight: 400;
}
</style>
```

Only the header, the import line and the `.head` CSS differ from the current file.

## Acceptance gates
1. Sizes:
   wc -c "app/composables/usePlayground.ts"   # expect 1031
   wc -c "app/pages/playground.vue"   # expect 877
   wc -c "app/pages/learn/index.vue"   # expect 2910
2. `grep -c "^import" app/composables/usePlayground.ts app/pages/playground.vue` prints 0 for
   both, and `grep -c "^import" app/pages/learn/index.vue` prints 1.
3. `npx nuxi typecheck` exits 0.
4. `npm run generate` exits 0. `grep -c "Open the playground" .output/public/learn/index.html` prints 1, and
   `.output/public/playground/index.html` exists.
5. Browser gates are run by Orca, in the dark theme, at 1440, 834 and 390 px wide. On `/playground`, Run prints `1 1`, `2 4` and `3 9`. Edit the code, wait one
   second and reload: the edit is still there. Reset brings back the starter. Learn shows
   the link, and it wraps under the heading at 390.
