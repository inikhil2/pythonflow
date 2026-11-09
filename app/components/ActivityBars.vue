<script setup lang="ts">
const { progress } = useProgress()

// The clock is read after mount so the prerendered page and the first render match.
const today = ref<Date | null>(null)
onMounted(() => (today.value = new Date()))
const days = computed(() => (today.value ? activity(progress.value.attempts, today.value) : []))
const total = computed(() => days.value.reduce((sum, d) => sum + d.count, 0))
const max = computed(() => Math.max(1, ...days.value.map((d) => d.count)))
</script>

<template>
  <section class="card" aria-labelledby="week-title">
    <h2 id="week-title">This week</h2>
    <p class="sub">{{ total }} answer {{ total === 1 ? 'check' : 'checks' }} in the last 7 days</p>
    <div class="bars" aria-hidden="true">
      <div v-for="d in days" :key="d.date" class="day">
        <span class="count">{{ d.count }}</span>
        <span class="track"><span class="bar" :style="{ height: `${(d.count / max) * 100}%` }" /></span>
        <span class="label">{{ d.label }}</span>
      </div>
    </div>
    <table class="visually-hidden">
      <caption>Answer checks per day, last 7 days</caption>
      <thead>
        <tr><th scope="col">Day</th><th scope="col">Checks</th></tr>
      </thead>
      <tbody>
        <tr v-for="d in days" :key="d.date"><th scope="row">{{ d.label }} {{ d.date }}</th><td>{{ d.count }}</td></tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
h2 {
  margin: 0;
}

.sub {
  margin: var(--s1) 0 var(--s4);
  color: var(--text-2);
  font-size: var(--text-s);
}

.bars {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--s2);
}

.day {
  display: grid;
  justify-items: center;
  gap: var(--s1);
  color: var(--text-2);
  font-size: var(--text-xs);
}

.track {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 5rem;
  border-bottom: 1px solid var(--line);
}

.bar {
  width: 100%;
  border-radius: var(--r-s) var(--r-s) 0 0;
  background: var(--accent);
  transition: height var(--dur) var(--ease);
}
</style>
