<script setup lang="ts">
import type { Tier } from '~/composables/useInterview'

const route = useRoute()
const all = await useInterview()
const { progress } = useProgress()

const labels: Record<Tier, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
// The tier lives in the URL, so a refresh or a shared link keeps it.
const tier = computed(() => parseTier(route.query.tier))
const list = computed(() => tierProblems(all.value, tier.value))
const solved = computed(() => list.value.filter((p) => isSolved(progress.value, p.exerciseId)).length)

useHead({ title: 'Interview · PythonFlow' })
</script>

<template>
  <div class="page">
    <header>
      <h1>Interview</h1>
      <p class="sub">Classic interview problems, retold in plain words. Each one is a short function you solve in the browser.</p>
    </header>
    <nav class="segmented" aria-label="Difficulty">
      <NuxtLink
        v-for="t in TIERS"
        :key="t"
        :to="{ path: '/interview', query: { tier: t } }"
        class="seg"
        :aria-current="t === tier ? 'page' : undefined"
      >
        {{ labels[t] }}
      </NuxtLink>
    </nav>
    <p class="count">{{ list.length }} {{ list.length === 1 ? 'problem' : 'problems' }} · {{ solved }} solved</p>
    <section v-if="list.length" class="card" aria-label="Problems">
      <ol class="problems">
        <li v-for="p in list" :key="p.path" class="row">
          <span class="num">{{ p.order }}</span>
          <div class="main">
            <NuxtLink :to="p.path" class="title">{{ p.title }}</NuxtLink>
            <p class="meta">{{ p.topic }} · {{ p.companies.slice(0, 3).join(', ') }}</p>
          </div>
          <StatusChip class="state" :status="isSolved(progress, p.exerciseId) ? 'completed' : 'not-started'" />
        </li>
      </ol>
    </section>
    <EmptyState
      v-else
      :title="`No ${labels[tier].toLowerCase()} problems yet`"
      body="Problems in this tier are still being written. The easy ones are ready now."
      action="Try the easy problems"
      to="/interview?tier=easy"
    />
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
  max-width: 46rem;
}

.sub,
.count {
  margin: var(--s2) 0 0;
  color: var(--text-2);
}

.count {
  margin: 0;
  font-size: var(--text-s);
}

.segmented {
  display: inline-flex;
  gap: var(--s1);
  padding: var(--s1);
  border-radius: var(--r-m);
  background: var(--surface-2);
  justify-self: start;
}

.seg {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: var(--s2) var(--s4);
  border-radius: var(--r-s);
  color: var(--text-2);
  font-weight: 500;
  text-decoration: none;
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.seg:hover { color: var(--text); }
.seg[aria-current='page'] { background: var(--surface); color: var(--text); }

.problems {
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--s3);
  padding: var(--s3) 0;
}

.row + .row { border-top: 1px solid var(--line); }

.num {
  color: var(--text-2);
  font-size: var(--text-s);
  font-variant-numeric: tabular-nums;
}

.title {
  color: var(--text);
  font-weight: 500;
  text-decoration: none;
}

.title:hover { color: var(--accent-text); }

.meta {
  margin: var(--s1) 0 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

/* Narrow phones: the status moves under the title so the title keeps its width. */
@media (max-width: 30rem) {
  .row { grid-template-columns: 2rem minmax(0, 1fr); }
  .state { grid-column: 2; justify-self: start; }
}
</style>
