<script setup lang="ts">
const { progress } = useProgress()

// The clock is read after mount so the prerendered page and the first render match.
const today = ref<Date | null>(null)
onMounted(() => (today.value = new Date()))
const rows = computed(() => (today.value ? mistakes(progress.value.attempts, today.value) : []))
const day = (at: string) => new Date(at).toLocaleDateString('en', { month: 'short', day: 'numeric' })
</script>

<template>
  <section class="card" aria-labelledby="mistakes-title">
    <h2 id="mistakes-title">Mistakes</h2>
    <table v-if="rows.length">
      <thead>
        <tr>
          <th scope="col">Kind</th>
          <th scope="col">Last 7 days</th>
          <th scope="col">7 days before</th>
          <th scope="col">Last seen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.category">
          <th scope="row">{{ r.category }}</th>
          <td>{{ r.recent }}</td>
          <td>{{ r.before }}</td>
          <td>{{ day(r.lastAt) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">No failed answer checks yet.</p>
  </section>
</template>

<style scoped>
h2 {
  margin: 0 0 var(--s4);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-s);
  font-variant-numeric: tabular-nums;
}

th,
td {
  padding: var(--s2) 0;
  text-align: left;
  border-bottom: 1px solid var(--line);
}

thead th {
  color: var(--text-2);
  font-weight: 600;
}

tbody th {
  font-weight: 600;
}

.empty {
  margin: 0;
  color: var(--text-2);
}
</style>
