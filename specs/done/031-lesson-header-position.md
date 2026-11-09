# 031: Lesson header shows "Lesson n of m" and the week progress bar (task A10)
Files: app/components/LessonHeader.vue, app/pages/learn/[...slug].vue, app/assets/css/main.css
Severity: med

## Problem
The lesson header says only "Week 0". Task A10 asks for the lesson's position in its
week ("Week 0 - Lesson 1 of 1", proposal ruling 18) and a bar showing how many of the
week's lessons are completed (the honesty table: completed lessons in that week against
the lesson count from content).

`app/pages/learn/[...slug].vue` is already 145 lines, and patterns.md rule 5 sets a
150-line limit. So the header moves into a new `LessonHeader.vue`. The Today page
(spec 032) needs the same bar, so the `<progress>` style goes in `main.css`.

Do this spec after 028 and 029.

## Required change
1. Create `app/components/LessonHeader.vue` with exactly this content.
```vue
<script setup lang="ts">
import { CircleCheck, Clock } from '@lucide/vue'

defineProps<{
  title: string
  week: number
  minutes?: number
  position: number // 1-based place of this lesson in its week
  total: number // lessons in the week
  done: number // completed lessons in the week
  completed: boolean
}>()
</script>

<template>
  <header class="header">
    <div class="top">
      <p class="eyebrow">Week {{ week }} - Lesson {{ position }} of {{ total }}</p>
      <p class="week">
        <progress :value="done" :max="total" :aria-label="`Lessons completed in week ${week}`" />
        {{ done }} / {{ total }} done
      </p>
    </div>
    <h1>{{ title }}</h1>
    <p v-if="minutes" class="meta">
      <Clock :size="14" aria-hidden="true" /> {{ minutes }} min
    </p>
    <p v-if="completed" class="meta done">
      <CircleCheck :size="14" aria-hidden="true" /> Completed
    </p>
  </header>
</template>

<style scoped>
.header {
  margin: var(--s5) 0;
}

.top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2) var(--s4);
}

.eyebrow,
.meta,
.week {
  display: flex;
  align-items: center;
  gap: var(--s1);
  margin: 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

.week {
  gap: var(--s2);
}

.week progress {
  width: 8rem;
}

.done {
  margin-top: var(--s1);
  color: var(--success);
  font-weight: 600;
}

h1 {
  margin: var(--s1) 0 var(--s2);
  font-size: var(--text-2xl);
}
</style>
```

2. In `app/pages/learn/[...slug].vue` make these four replacements.

   a. Replace:
```ts
import { ChevronLeft, ChevronRight, CircleCheck, Clock } from '@lucide/vue'
```
   with:
```ts
import { ChevronLeft, ChevronRight } from '@lucide/vue'
```

   b. Replace:
```ts
const next = computed(() => around.value?.[1] ?? null)
```
   with:
```ts
const next = computed(() => around.value?.[1] ?? null)

// "Lesson n of m" and the week bar count only this lesson's week.
const weeks = await useCourse()
const weekPaths = weeks.value.find((w) => w.week === lesson.value?.week)?.lessons.map((l) => l.path) ?? []
const position = weekPaths.indexOf(lesson.value.path) + 1
```

   c. Replace:
```ts
const completed = computed(() => !!progress.value.lessons[path]?.completedAt)
```
   with:
```ts
const completed = computed(() => !!progress.value.lessons[path]?.completedAt)
const weekDone = computed(() => completedCount(progress.value, weekPaths))
```

   d. Replace the whole `<header>` element in the template:
```html
    <header>
      <p class="eyebrow">Week {{ lesson.week }}</p>
      <h1>{{ lesson.title }}</h1>
      <p v-if="lesson.minutes" class="meta">
        <Clock :size="14" aria-hidden="true" /> {{ lesson.minutes }} min
      </p>
      <p v-if="completed" class="meta done">
        <CircleCheck :size="14" aria-hidden="true" /> Completed
      </p>
    </header>
```
   with:
```html
    <LessonHeader
      :title="lesson.title"
      :week="lesson.week"
      :minutes="lesson.minutes"
      :position="position"
      :total="weekPaths.length"
      :done="weekDone"
      :completed="completed"
    />
```

   e. Delete these style rules from the `<style scoped>` block (they moved into
   LessonHeader.vue). Delete exactly this text, including the blank line after it:
```css
header {
  margin: var(--s5) 0;
}

.eyebrow,
.meta {
  display: flex;
  align-items: center;
  gap: var(--s1);
  margin: 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

.done {
  margin-top: var(--s1);
  color: var(--success);
  font-weight: 600;
}

h1 {
  margin: var(--s1) 0 var(--s2);
  font-size: var(--text-2xl);
}

```

3. In `app/assets/css/main.css`, replace:
```css
:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px; }
```
   with:
```css
/* Progress bars (lesson header, Continue card): a thin accent bar on a pale track. */
progress {
  appearance: none;
  height: var(--s1);
  border: 0;
  border-radius: var(--r-pill);
  background: var(--surface-2);
  overflow: hidden;
}
progress::-webkit-progress-bar { background: var(--surface-2); }
progress::-webkit-progress-value { background: var(--accent); border-radius: var(--r-pill); }
progress::-moz-progress-bar { background: var(--accent); border-radius: var(--r-pill); }

:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px; }
```

## Acceptance gates
- `npm run generate` exits 0, and `.output/public/learn/week0-functions/01-hello/index.html`
  contains `Week 0 - Lesson 1 of 1` and `0 / 1 done`.
- `wc -l "app/pages/learn/[...slug].vue"` is under 150, and
  `grep -n "CircleCheck\|Clock\|class=\"eyebrow\"" "app/pages/learn/[...slug].vue"` prints nothing.
- In the browser, the hello lesson shows "Week 0 - Lesson 1 of 1" and an empty bar with
  "0 / 1 done". After passing its exercise, the bar is full, it says "1 / 1 done", and
  "Completed" shows. This survives a reload.
- In both light and dark themes the bar track and fill are visible.
