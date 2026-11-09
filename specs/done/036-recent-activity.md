# 036: Recent activity card, and the Today side column (task A13, part 2)
Files: app/components/RecentActivity.vue, app/pages/index.vue
Severity: med

## Problem
The Today page needs its right-hand column: the "This week" bars (spec 035) and a
"Recent activity" list of the 5 newest lesson events from `recentEvents()`. Each row
has an icon, a link with the words "Opened" or "Completed" and the lesson title, and the
time. Times are shown as a short date and time ("Oct 23, 9:41 PM") rather than "2 hours
ago", which would need its own clock logic and go stale on screen.

Do this spec after 034 and 035.

## Required change
1. Create `app/components/RecentActivity.vue` with exactly this content.
```vue
<script setup lang="ts">
import { BookOpen, CircleCheck } from '@lucide/vue'
import type { CourseWeek } from '~/composables/useCourse'

const props = defineProps<{ weeks: CourseWeek[] }>()
const { progress } = useProgress()

const titles = computed(() => new Map(props.weeks.flatMap((w) => w.lessons.map((l) => [l.path, l.title] as const))))
// Lessons that were renamed or removed from the course are left out.
const events = computed(() => recentEvents(progress.value.lessons).filter((e) => titles.value.has(e.path)))
const when = (at: string) =>
  new Date(at).toLocaleString('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
</script>

<template>
  <section class="card" aria-labelledby="recent-title">
    <h2 id="recent-title">Recent activity</h2>
    <ol v-if="events.length" class="events">
      <li v-for="e in events" :key="e.kind + e.path">
        <CircleCheck v-if="e.kind === 'completed'" class="done" :size="16" aria-hidden="true" />
        <BookOpen v-else :size="16" aria-hidden="true" />
        <span class="text">
          <NuxtLink :to="e.path">{{ e.kind === 'completed' ? 'Completed' : 'Opened' }}: {{ titles.get(e.path) }}</NuxtLink>
          <time :datetime="e.at">{{ when(e.at) }}</time>
        </span>
      </li>
    </ol>
    <p v-else class="empty">
      Lessons you open and finish show up here. <NuxtLink to="/learn">Browse lessons</NuxtLink>
    </p>
  </section>
</template>

<style scoped>
h2 {
  margin: 0;
}

.events {
  margin: var(--s3) 0 0;
  padding: 0;
  list-style: none;
}

.events li {
  display: flex;
  align-items: flex-start;
  gap: var(--s3);
  padding: var(--s3) 0;
  color: var(--text-2);
}

.events li + li {
  border-top: 1px solid var(--line);
}

.done {
  color: var(--success);
}

.text {
  display: grid;
  gap: var(--s1);
}

.text a {
  color: var(--text);
  font-weight: 500;
  text-decoration: none;
}

.text a:hover {
  color: var(--accent-text);
}

time,
.empty {
  color: var(--text-2);
  font-size: var(--text-s);
}

.empty {
  margin: var(--s2) 0 0;
}

.empty a {
  color: var(--accent-text);
}
</style>
```

2. In `app/pages/index.vue` make two replacements.

   a. Replace:
```html
        <LearningPath :weeks="weeks" />
      </div>
```
   with:
```html
        <LearningPath :weeks="weeks" />
      </div>
      <div class="side">
        <ActivityBars />
        <RecentActivity :weeks="weeks" />
      </div>
```

   b. Replace:
```css
.main {
  display: grid;
  gap: var(--s5);
}
```
   with:
```css
.main,
.side {
  display: grid;
  gap: var(--s5);
}
```

## Acceptance gates
- `npm run generate` exits 0, and `.output/public/index.html` contains `This week`,
  `Recent activity` and `Lessons you open and finish show up here.`
- In the browser with empty storage, `/` shows the two columns side by side at 1280 px
  wide and stacked at 375 px. "This week" shows seven bars labelled with weekdays ending
  today, all with the count 0, and "0 answer checks in the last 7 days".
- Open the hello lesson, press Check answer once with wrong code and once with right
  code, then return to `/`: today's bar shows 2, the subline says "2 answer checks", and
  Recent activity lists "Completed: Hello, world" above "Opened: Hello, world".
- The counts in the bars match `JSON.parse(localStorage.getItem('pythonflow:v1')).attempts.length`
  for attempts made today.
- With a screen reader (or the accessibility tree), the hidden table "Answer checks per
  day, last 7 days" lists the same seven counts.
- `wc -l app/pages/index.vue` is under 150.
