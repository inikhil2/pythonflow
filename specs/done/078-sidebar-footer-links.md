# 078: Sidebar footer links and a local-storage note on Progress (tasks E2, E4, E5)
Files: app/components/AppSidebar.vue, app/pages/progress.vue
Severity: low

## Problem
The playground and settings pages need a way in. The sidebar footer becomes a short list:
Playground, Settings and About PythonFlow. The current one is marked with
`aria-current="page"`.

The footer is hidden on phones, where the sidebar is a tab bar with five items. So the
Progress page gets one line at the bottom: progress is saved in this browser only, with a
link to Settings. The playground is reached from the Learn header (spec 076).

Do this after specs 076 and 077.

## Required change
1. **Replace the whole of `app/components/AppSidebar.vue`** with exactly this content. Delete everything in the file first.
```vue
<script setup lang="ts">
import { BookOpen, ChartLine, FolderKanban, House, Target } from '@lucide/vue'

const items = [
  { to: '/', label: 'Today', icon: House },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Target },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/progress', label: 'Progress', icon: ChartLine },
]

const footer = [
  { to: '/playground', label: 'Playground' },
  { to: '/settings', label: 'Settings' },
  { to: '/about', label: 'About PythonFlow' },
]

const route = useRoute()
// A section stays selected on its sub-pages, e.g. Learn on a lesson.
const isCurrent = (to: string) => route.path === to || (to !== '/' && route.path.startsWith(to + '/'))
</script>

<template>
  <nav class="sidebar" aria-label="Main">
    <NuxtLink to="/" class="wordmark">PythonFlow</NuxtLink>
    <ul>
      <li v-for="item in items" :key="item.to">
        <NuxtLink :to="item.to" class="item" :aria-current="isCurrent(item.to) ? 'page' : undefined">
          <component :is="item.icon" :size="18" :stroke-width="1.75" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
    <ul class="footer">
      <li v-for="link in footer" :key="link.to">
        <NuxtLink :to="link.to" :aria-current="isCurrent(link.to) ? 'page' : undefined">{{ link.label }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s5);
  height: 100vh;
  padding: var(--s5) var(--s3);
}

.wordmark {
  padding: 0 var(--s3);
  color: var(--text);
  font-size: var(--text-l);
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
}

ul {
  display: grid;
  gap: var(--s1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  gap: var(--s3);
  padding: var(--s2) var(--s3);
  border-radius: var(--r-m);
  color: var(--text-2);
  font-weight: 500;
  text-decoration: none;
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.item:hover { background: var(--surface-2); color: var(--text); }
.item[aria-current='page'] { background: var(--accent-soft); color: var(--accent-text); }

.footer {
  margin-top: auto;
  padding: 0 var(--s3);
  font-size: var(--text-s);
}

.footer a { color: var(--text-2); }
.footer a:hover,
.footer a[aria-current='page'] { color: var(--text); }

/* Phones: a floating tab bar at the bottom. */
@media (max-width: 48rem) {
  .sidebar {
    position: fixed;
    inset: auto var(--s2) var(--s2);
    z-index: 10;
    height: auto;
    padding: var(--s1);
    border-radius: var(--r-l);
    background: var(--glass);
    backdrop-filter: blur(20px) saturate(180%);
    box-shadow: var(--shadow-float);
  }

  .wordmark, .footer { display: none; }
  ul { grid-template-columns: repeat(5, 1fr); }

  .item {
    flex-direction: column;
    gap: var(--s1);
    min-height: 2.75rem;
    padding: var(--s1);
    font-size: var(--text-xs);
  }
}
</style>
```

Only the `footer` array, the footer `<ul>` and its CSS differ from the current file. The
phone rule now hides `.footer` instead of `.about`.

2. **Replace the whole of `app/pages/progress.vue`** with exactly this content. Delete everything in the file first.
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
    <p class="note">
      Your progress is saved in this browser only.
      <NuxtLink to="/settings">Export a copy or reset it in Settings</NuxtLink>.
    </p>
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

.note {
  margin: 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

@media (max-width: 64rem) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
```

Only the `.note` paragraph and its CSS are new.

## Acceptance gates
1. Sizes:
   wc -c "app/components/AppSidebar.vue"   # expect 3093
   wc -c "app/pages/progress.vue"   # expect 2033
2. `grep -c "about" app/components/AppSidebar.vue` prints 1 (the `/about` link).
3. `npx nuxi typecheck` exits 0.
4. `npm run generate` exits 0. `grep -c 'href="/settings"' .output/public/progress/index.html` prints 2 (the
   sidebar and the note).
5. Browser gates are run by Orca, in the dark theme, at 1440, 834 and 390 px wide. At 1440 and 834 the footer shows three links, and the current one is brighter.
   At 390 the tab bar still has five items and no footer. The Progress note links to Settings.
