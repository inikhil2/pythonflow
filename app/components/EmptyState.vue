<script setup lang="ts">
// A page or section with nothing to show yet: say why, offer one action.
defineProps<{ title: string; body: string; action: string; to: string }>()
</script>

<template>
  <section class="card empty">
    <h2>{{ title }}</h2>
    <p>{{ body }}</p>
    <NuxtLink :to="to" class="btn-primary">{{ action }}</NuxtLink>
  </section>
</template>

<style scoped>
.empty {
  max-width: 40rem;
}

p {
  margin: var(--s2) 0 var(--s4);
  color: var(--text-2);
}

.btn-primary {
  text-decoration: none;
}
</style>
