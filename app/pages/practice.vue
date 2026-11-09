<script setup lang="ts">
const weeks = await useCourse()
const concepts = await useConcepts()
const { progress } = useProgress()

const lessons = computed(() => weeks.value.flatMap((w) => w.lessons))
const queue = computed(() => recommendations(progress.value, lessons.value, concepts.value))

useHead({ title: 'Practice · PythonFlow' })
</script>

<template>
  <div class="page">
    <h1>Practice</h1>
    <template v-if="queue.length">
      <p class="sub">Concepts to revise come first, then exercises you have not passed in lessons you opened.</p>
      <ol class="queue">
        <PracticeItem v-for="item in queue" :key="item.exercise" :item="item" />
      </ol>
    </template>
    <EmptyState
      v-else
      title="Nothing to practise yet"
      body="Practice collects exercises you have not passed yet and concepts worth revising. It fills up as you work through lessons."
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
  margin: 0;
  color: var(--text-2);
}

.queue {
  display: grid;
  gap: var(--s3);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
