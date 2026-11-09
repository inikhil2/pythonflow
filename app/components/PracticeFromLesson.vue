<script setup lang="ts">
import type { Problem } from '~/composables/useInterview'

defineProps<{ problems: Problem[] }>()

const { progress } = useProgress()
</script>

<template>
  <section class="card practice" aria-labelledby="practice-title">
    <h2 id="practice-title">Practice from this lesson</h2>
    <p class="sub">Interview problems that build on it.</p>
    <ul>
      <li v-for="p in problems" :key="p.path" class="row">
        <NuxtLink :to="p.path" class="title">{{ p.title }}</NuxtLink>
        <span class="tier">{{ p.tier }}</span>
        <StatusChip :status="isSolved(progress, p.exerciseId) ? 'completed' : 'not-started'" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.practice {
  margin-top: var(--s6);
}

.sub {
  margin: var(--s1) 0 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

ul {
  margin: var(--s3) 0 0;
  padding: 0;
  list-style: none;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2) var(--s4);
  padding: var(--s3) 0;
}

.row + .row { border-top: 1px solid var(--line); }

.title {
  color: var(--text);
  font-weight: 500;
  text-decoration: none;
}

.title:hover { color: var(--accent-text); }

.tier {
  margin-right: auto;
  color: var(--text-2);
  font-size: var(--text-s);
  text-transform: capitalize;
}
</style>
