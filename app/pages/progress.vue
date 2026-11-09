<script setup lang="ts">
const weeks = await useCourse()
const concepts = await useConcepts()
const { progress } = useProgress()

const lessons = computed(() => weeks.value.flatMap((w) => w.lessons))
const exercises = computed(() => lessons.value.flatMap((l) => l.exercises))
const lessonsDone = computed(() => completedCount(progress.value, lessons.value.map((l) => l.path)))
const mastered = computed(
  () => concepts.value.filter((c) => conceptStatus(progress.value, c.id, lessons.value) === 'mastered').length,
)
const passed = computed(() => exercises.value.filter((id) => progress.value.exercises[id]?.passedAt).length)

useHead({ title: 'Progress · PythonFlow' })
</script>

<template>
  <div class="page">
    <h1>Your progress</h1>
    <div class="tiles">
      <StatTile label="Lessons completed" :value="`${lessonsDone} / ${lessons.length}`" />
      <StatTile label="Concepts mastered" :value="`${mastered} / ${concepts.length}`" />
      <StatTile label="Exercises passed" :value="`${passed} / ${exercises.length}`" />
    </div>
    <div class="grid">
      <div class="main">
        <MasteryList :concepts="concepts" :lessons="lessons" />
        <MistakeList />
      </div>
      <div class="side">
        <NextStep :concepts="concepts" :lessons="lessons" />
        <ActivityBars />
      </div>
    </div>
    <p class="note">
      Your progress is saved in this browser only.
      <NuxtLink to="/settings">Export a copy or reset it in Settings</NuxtLink>.
    </p>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
}

.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--s4);
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

.note {
  margin: 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

@media (max-width: 64rem) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
