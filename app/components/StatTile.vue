<script setup lang="ts">
defineProps<{ label: string; value: string; note?: string }>()
</script>

<template>
  <div class="card tile">
    <p class="label">{{ label }}</p>
    <p class="value">{{ value }}</p>
    <p v-if="note" class="note">{{ note }}</p>
  </div>
</template>

<style scoped>
.tile {
  display: grid;
  gap: var(--s1);
}

.label,
.note {
  margin: 0;
  font-size: var(--text-s);
  color: var(--text-2);
}

.value {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>
