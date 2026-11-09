<script setup lang="ts">
const weeks = await useCourse()
const concepts = await useConcepts()
const { progress } = useProgress()

const lessons = computed(() => weeks.value.flatMap((w) => w.lessons))

// The clock is read after mount so the prerendered page and the first render match.
const hour = ref<number | null>(null)
const today = ref<Date | null>(null)
onMounted(() => {
  today.value = new Date()
  hour.value = today.value.getHours()
})
const title = computed(() => greeting(hour.value, progress.value.name))
const passed = computed(() => (today.value ? passedToday(progress.value.exercises, today.value) : 0))

useHead({ title: 'Today · PythonFlow' })
</script>

<template>
  <div class="page">
    <header>
      <h1>{{ title }}</h1>
      <p class="sub">Short lessons, real Python, at your own pace.</p>
    </header>
    <div class="grid">
      <div class="main">
        <ContinueCard :weeks="weeks" />
        <LearningPath :weeks="weeks" />
      </div>
      <div class="side">
        <NextStep :concepts="concepts" :lessons="lessons" />
        <StatTile label="Exercises passed today" :value="String(passed)" />
        <ActivityBars />
        <RecentActivity :weeks="weeks" />
      </div>
    </div>
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
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  align-items: start;
  gap: var(--s5);
}

.main,
.side {
  display: grid;
  gap: var(--s5);
}

@media (max-width: 64rem) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
