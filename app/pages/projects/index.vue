<script setup lang="ts">
const { data: projects } = await useAsyncData('projects', () => queryCollection('projects').order('stem', 'ASC').all())
const concepts = await useConcepts()

// "Uses:" names each concept by its title, in the order the project lists them.
const titles = computed(() => new Map(concepts.value.map((c) => [c.id, c.title])))
const uses = (ids: string[]) => ids.map((id) => titles.value.get(id) ?? id)

useHead({ title: 'Projects · PythonFlow' })
</script>

<template>
  <div class="page">
    <header>
      <h1>Projects</h1>
      <p class="sub">Build real-world projects and apply what you've learned.</p>
    </header>
    <ul v-if="projects?.length" class="grid">
      <li v-for="p in projects" :key="p.slug">
        <ProjectCard :project="p" :uses="uses(p.requires)" />
      </li>
    </ul>
    <EmptyState
      v-else
      title="Nothing here yet"
      body="Projects are bigger programs built in milestones, such as a calculator and a guessing game."
      action="Go to lessons"
      to="/learn"
    />
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
}

.sub {
  margin: var(--s2) 0 0;
  color: var(--text-2);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s5);
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 48rem) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
