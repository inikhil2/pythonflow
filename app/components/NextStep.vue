<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import type { Concept, LessonRef } from '~/utils/mastery'

const props = defineProps<{ concepts: Concept[]; lessons: LessonRef[] }>()
const { progress } = useProgress()

const step = computed(() => nextStep(progress.value, props.lessons, props.concepts))
</script>

<template>
  <section class="card" aria-labelledby="next-title">
    <p class="eyebrow">Recommended next</p>
    <template v-if="step">
      <h2 id="next-title">
        <NuxtLink :to="step.to" class="link">{{ step.title }} <ArrowRight :size="16" aria-hidden="true" /></NuxtLink>
      </h2>
      <p class="reason">{{ step.reason }}</p>
    </template>
    <template v-else>
      <h2 id="next-title">You have finished every lesson</h2>
      <p class="reason">Practice keeps the exercises you have not passed.</p>
    </template>
  </section>
</template>

<style scoped>
.eyebrow {
  margin: 0 0 var(--s2);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-2);
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-size: var(--text-l);
}

.link {
  display: inline-flex;
  align-items: center;
  gap: var(--s2);
  color: var(--accent-text);
}

.reason {
  margin: var(--s2) 0 0;
  color: var(--text-2);
}
</style>
