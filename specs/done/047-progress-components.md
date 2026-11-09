# 047: Progress page components: StatTile, MasteryList, MistakeList (tasks B3 and B4)
Files: app/components/StatTile.vue, app/components/MasteryList.vue, app/components/MistakeList.vue
Severity: med

## Problem
The Progress page (spec 048) needs three components that do not exist yet:
- a tile with one real figure, for example "Lessons completed 1 / 1";
- mastery per concept group, with the rule shown in a footnote (proposal honesty table);
- mistakes by category, last 7 days against the 7 days before, with the last date.

A `ProgressBar.vue` component (named in proposal task B3) is not needed: `main.css` already
styles the native `<progress>` element, and the lesson header and Continue card use it.

Do this spec after 046. It only creates new files; nothing uses them until 048.

## Required change
Create these three files with exactly this content. Keep the import lines exactly as
shown and add no others: `computed`, `ref`, `onMounted`, `useProgress`, `conceptStatus`,
`mistakes` and `GROUPS` are auto-imported by Nuxt.

1. `app/components/StatTile.vue`
```vue
<script setup lang="ts">
defineProps<{ label: string; value: string; note?: string }>()
</script>

<template>
  <div class="card tile">
    <p class="label">{{ label }}</p>
    <p class="value">{{ value }}</p>
    <p v-if="note" class="note">{{ note }}</p>
  </div>
</template>

<style scoped>
.tile {
  display: grid;
  gap: var(--s1);
}

.label,
.note {
  margin: 0;
  font-size: var(--text-s);
  color: var(--text-2);
}

.value {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>
```

2. `app/components/MasteryList.vue`
```vue
<script setup lang="ts">
import type { Concept, LessonRef } from '~/utils/mastery'

const props = defineProps<{ concepts: Concept[]; lessons: LessonRef[] }>()
const { progress } = useProgress()

// One row per group that has concepts, in the GROUPS order.
const groups = computed(() =>
  GROUPS.map((name) => {
    const concepts = props.concepts
      .filter((c) => c.group === name)
      .map((c) => ({ ...c, status: conceptStatus(progress.value, c.id, props.lessons) }))
    return { name, concepts, mastered: concepts.filter((c) => c.status === 'mastered').length }
  }).filter((g) => g.concepts.length > 0),
)
</script>

<template>
  <section class="card" aria-labelledby="mastery-title">
    <h2 id="mastery-title">Mastery by topic</h2>
    <ul class="groups">
      <li v-for="g in groups" :key="g.name">
        <details>
          <summary>
            <span class="name">{{ g.name }}</span>
            <span class="count">{{ g.mastered }} of {{ g.concepts.length }} mastered</span>
            <progress :value="g.mastered" :max="g.concepts.length" :aria-label="`${g.name}: ${g.mastered} of ${g.concepts.length} concepts mastered`" />
          </summary>
          <ul class="concepts">
            <li v-for="c in g.concepts" :key="c.id">
              <span>{{ c.title }} <span class="week">Week {{ c.week }}</span></span>
              <StatusChip :status="c.status" />
            </li>
          </ul>
        </details>
      </li>
    </ul>
    <p class="rule">
      A concept is mastered when every exercise that teaches it has passed, at least one of them
      without hints. It needs revision when 2 or more of its last 3 answer checks failed.
    </p>
  </section>
</template>

<style scoped>
h2 {
  margin: 0 0 var(--s4);
}

.groups,
.concepts {
  display: grid;
  gap: var(--s3);
  margin: 0;
  padding: 0;
  list-style: none;
}

summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--s2) var(--s3);
  cursor: pointer;
}

summary progress {
  grid-column: 1 / -1;
  width: 100%;
}

.name {
  font-weight: 600;
}

.count,
.week,
.rule {
  font-size: var(--text-s);
  color: var(--text-2);
}

.concepts {
  margin-top: var(--s3);
  padding-left: var(--s4);
}

.concepts li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s3);
}

.rule {
  margin: var(--s4) 0 0;
}
</style>
```

3. `app/components/MistakeList.vue`
```vue
<script setup lang="ts">
const { progress } = useProgress()

// The clock is read after mount so the prerendered page and the first render match.
const today = ref<Date | null>(null)
onMounted(() => (today.value = new Date()))
const rows = computed(() => (today.value ? mistakes(progress.value.attempts, today.value) : []))
const day = (at: string) => new Date(at).toLocaleDateString('en', { month: 'short', day: 'numeric' })
</script>

<template>
  <section class="card" aria-labelledby="mistakes-title">
    <h2 id="mistakes-title">Mistakes</h2>
    <table v-if="rows.length">
      <thead>
        <tr>
          <th scope="col">Kind</th>
          <th scope="col">Last 7 days</th>
          <th scope="col">7 days before</th>
          <th scope="col">Last seen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.category">
          <th scope="row">{{ r.category }}</th>
          <td>{{ r.recent }}</td>
          <td>{{ r.before }}</td>
          <td>{{ day(r.lastAt) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">No failed answer checks yet.</p>
  </section>
</template>

<style scoped>
h2 {
  margin: 0 0 var(--s4);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-s);
  font-variant-numeric: tabular-nums;
}

th,
td {
  padding: var(--s2) 0;
  text-align: left;
  border-bottom: 1px solid var(--line);
}

thead th {
  color: var(--text-2);
  font-weight: 600;
}

tbody th {
  font-weight: 600;
}

.empty {
  margin: 0;
  color: var(--text-2);
}
</style>
```

## Acceptance gates
- `git diff --stat HEAD` after the change lists only these three new files (check with
  `git status --short app/components`). Each file is more than 0 bytes: `wc -c` on each prints
  a number above 500.
- `grep -n "^import" app/components/StatTile.vue app/components/MistakeList.vue` prints nothing.
- `grep -c "^import" app/components/MasteryList.vue` prints `1`.
- `grep -nE '#[0-9a-fA-F]{3,6}\b|: any\b|as any|px' app/components/StatTile.vue app/components/MasteryList.vue app/components/MistakeList.vue`
  prints only the `1px solid var(--line)` line in MistakeList.vue.
- `npm run generate` exits 0.
