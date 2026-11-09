<script setup lang="ts">
import { Calculator, ChevronRight, Cloud, Dices, FileText, FolderKanban, Wallet } from '@lucide/vue'
import type { Component } from 'vue'
import type { ProjectsCollectionItem } from '@nuxt/content'

const props = defineProps<{ project: ProjectsCollectionItem; uses: string[] }>()
const { progress } = useProgress()

// The icon field names one of these; anything else gets the Projects nav icon.
const icons: Record<string, Component> = { calculator: Calculator, cloud: Cloud, dices: Dices, 'file-text': FileText, wallet: Wallet }
const icon = computed(() => icons[props.project.icon] ?? FolderKanban)

const ids = computed(() => props.project.milestones.map((m) => m.id))
const passed = computed(() => milestonesPassed(progress.value, ids.value))
const status = computed(() => projectStatus(progress.value, ids.value))
</script>

<template>
  <NuxtLink :to="`/projects/${project.slug}`" class="card project">
    <span class="top">
      <span class="icon"><component :is="icon" :size="24" aria-hidden="true" /></span>
      <ChevronRight class="chevron" :size="20" aria-hidden="true" />
    </span>
    <h2>{{ project.title }}</h2>
    <p class="summary">{{ project.summary }}</p>
    <p class="small">Recommended after Week {{ project.afterWeek }} · Uses: {{ uses.join(', ') }}</p>
    <p v-if="project.note" class="small">{{ project.note }}</p>
    <span class="foot">
      <StatusChip :status="status" />
      <span class="small">{{ passed }}/{{ ids.length }} milestones</span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
  gap: var(--s2);
  height: 100%;
  color: var(--text);
  text-decoration: none;
}

.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--s2);
}

.icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--r-m);
  background: var(--accent-soft);
  color: var(--accent-text);
}

.chevron {
  color: var(--text-2);
  transition: transform var(--dur) var(--ease);
}

.project:hover h2 {
  color: var(--accent-text);
}

.project:hover .chevron {
  transform: translateX(var(--s1));
}

h2 {
  margin: 0;
  font-size: var(--text-l);
}

.summary {
  margin: 0;
  color: var(--text-2);
}

.small {
  margin: 0;
  color: var(--text-2);
  font-size: var(--text-xs);
}

.foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2);
  margin-top: auto;
  padding-top: var(--s2);
}

@media (prefers-reduced-motion: reduce) {
  .chevron { transition: none; }
}
</style>
