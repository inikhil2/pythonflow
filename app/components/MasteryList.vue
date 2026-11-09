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
