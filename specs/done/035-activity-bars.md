# 035: Activity counts and the This week bars (task A13, part 1)
Files: app/utils/mastery.ts, scripts/check-mastery.ts, app/components/ActivityBars.vue
Severity: med

## Problem
Task A13 adds two Today cards: "This week" (attempts per day for the last 7 days, from
`attempts[].at`) and "Recent activity" (the last 5 events). The proposal puts the
counting in `app/utils/mastery.ts`, with only `activity()` and `recentEvents()` for now.
Phase B (task B2) adds the mastery rules to the same file and extends the check script.

Days are local days: an attempt at 00:30 local time counts on that day, not the day
before in UTC. The bars are accessible: each bar shows its count as text, and a visually
hidden table gives the same numbers.

The events come from lesson progress only: "Opened" (`openedAt`) and "Completed"
(`completedAt`). An exercise pass cannot be named yet, because stored attempts hold an
exercise id but not its lesson or title; lesson completion already covers passing every
exercise in a lesson.

Do this spec after 032.

## Required change
1. Create `app/utils/mastery.ts` with exactly this content.
```ts
import type { Attempt, LessonProgress } from '~/utils/progress'

export interface DayCount {
  date: string // local YYYY-MM-DD
  label: string // short weekday, e.g. "Fri"
  count: number
}

export interface LessonEvent {
  kind: 'opened' | 'completed'
  path: string
  at: string
}

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Attempts per local day for the 7 days ending on today, oldest first.
export function activity(attempts: readonly Pick<Attempt, 'at'>[], today: Date): DayCount[] {
  const days = Array.from({ length: 7 }, (_, i) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + i))
  const counts = new Map(days.map((d) => [dayKey(d), 0]))
  for (const attempt of attempts) {
    const key = dayKey(new Date(attempt.at))
    const count = counts.get(key)
    if (count !== undefined) counts.set(key, count + 1)
  }
  return days.map((d) => ({
    date: dayKey(d),
    label: d.toLocaleDateString('en', { weekday: 'short' }),
    count: counts.get(dayKey(d)) ?? 0,
  }))
}

// The 5 newest lesson events, newest first.
export function recentEvents(lessons: Readonly<Record<string, Readonly<LessonProgress>>>): LessonEvent[] {
  return Object.entries(lessons)
    .flatMap(([path, lesson]): LessonEvent[] => [
      ...(lesson.completedAt ? [{ kind: 'completed' as const, path, at: lesson.completedAt }] : []),
      { kind: 'opened', path, at: lesson.openedAt },
    ])
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5)
}
```

2. Create `scripts/check-mastery.ts` with exactly this content.
```ts
import assert from 'node:assert/strict'
import { activity, recentEvents } from '../app/utils/mastery.ts'

// Built from local times, so the check passes in any time zone.
const at = (day: number, hour = 12) => new Date(2026, 9, day, hour).toISOString()
const today = new Date(2026, 9, 23, 9) // Friday 23 October 2026

const days = activity([{ at: at(23) }, { at: at(23, 0) }, { at: at(17) }, { at: at(16) }, { at: at(24) }], today)
assert.equal(days.length, 7)
assert.equal(days[0]?.date, '2026-10-17')
assert.equal(days[6]?.date, '2026-10-23')
assert.equal(days[6]?.label, 'Fri')
assert.deepEqual(days.map((d) => d.count), [1, 0, 0, 0, 0, 0, 2])
assert.deepEqual(activity([], today).map((d) => d.count), [0, 0, 0, 0, 0, 0, 0])
// The 7 days cross a month boundary.
assert.equal(activity([], new Date(2026, 10, 3))[0]?.date, '2026-10-28')

const T1 = '2026-10-01T10:00:00.000Z'
const T2 = '2026-10-01T10:30:00.000Z'
const T3 = '2026-10-02T10:00:00.000Z'
assert.deepEqual(recentEvents({ '/a': { openedAt: T1, completedAt: T2 }, '/b': { openedAt: T3 } }), [
  { kind: 'opened', path: '/b', at: T3 },
  { kind: 'completed', path: '/a', at: T2 },
  { kind: 'opened', path: '/a', at: T1 },
])
const seven = Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((d) => [`/l${d}`, { openedAt: `2026-10-0${d}T10:00:00.000Z` }]))
assert.deepEqual(recentEvents(seven).map((e) => e.path), ['/l7', '/l6', '/l5', '/l4', '/l3'])
assert.deepEqual(recentEvents({}), [])

console.log('mastery ok')
```

3. Create `app/components/ActivityBars.vue` with exactly this content.
```vue
<script setup lang="ts">
const { progress } = useProgress()

// The clock is read after mount so the prerendered page and the first render match.
const today = ref<Date | null>(null)
onMounted(() => (today.value = new Date()))
const days = computed(() => (today.value ? activity(progress.value.attempts, today.value) : []))
const total = computed(() => days.value.reduce((sum, d) => sum + d.count, 0))
const max = computed(() => Math.max(1, ...days.value.map((d) => d.count)))
</script>

<template>
  <section class="card" aria-labelledby="week-title">
    <h2 id="week-title">This week</h2>
    <p class="sub">{{ total }} answer {{ total === 1 ? 'check' : 'checks' }} in the last 7 days</p>
    <div class="bars" aria-hidden="true">
      <div v-for="d in days" :key="d.date" class="day">
        <span class="count">{{ d.count }}</span>
        <span class="track"><span class="bar" :style="{ height: `${(d.count / max) * 100}%` }" /></span>
        <span class="label">{{ d.label }}</span>
      </div>
    </div>
    <table class="visually-hidden">
      <caption>Answer checks per day, last 7 days</caption>
      <thead>
        <tr><th scope="col">Day</th><th scope="col">Checks</th></tr>
      </thead>
      <tbody>
        <tr v-for="d in days" :key="d.date"><th scope="row">{{ d.label }} {{ d.date }}</th><td>{{ d.count }}</td></tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
h2 {
  margin: 0;
}

.sub {
  margin: var(--s1) 0 var(--s4);
  color: var(--text-2);
  font-size: var(--text-s);
}

.bars {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--s2);
}

.day {
  display: grid;
  justify-items: center;
  gap: var(--s1);
  color: var(--text-2);
  font-size: var(--text-xs);
}

.track {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 5rem;
  border-bottom: 1px solid var(--line);
}

.bar {
  width: 100%;
  border-radius: var(--r-s) var(--r-s) 0 0;
  background: var(--accent);
  transition: height var(--dur) var(--ease);
}
</style>
```
   The component is placed on the Today page by spec 036.

## Acceptance gates
- `node scripts/check-mastery.ts` prints `mastery ok` and exits 0.
- Changing `- 6 + i` to `- 7 + i` in `activity` makes the check fail (try it, then undo it).
- `grep -nE '#[0-9a-fA-F]{3,6}\b|: any\b|<any>|as any' app/utils/mastery.ts app/components/ActivityBars.vue`
  prints nothing.
- `npm run generate` exits 0.
