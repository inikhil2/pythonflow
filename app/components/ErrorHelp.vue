<script setup lang="ts">
import { Lightbulb } from '@lucide/vue'

const props = defineProps<{ error: string }>()

const help = computed(() => explainError(props.error))
</script>

<template>
  <div v-if="help" class="help">
    <p class="title">
      <Lightbulb :size="16" aria-hidden="true" /> {{ help.title }}
    </p>
    <p class="body">{{ help.body }}</p>
  </div>
</template>

<style scoped>
.help {
  margin-top: var(--s3);
  padding-top: var(--s3);
  border-top: 1px solid var(--code-line);
  font-family: var(--font);
}

.title {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin: 0 0 var(--s1);
  color: var(--code-text);
  font-weight: 600;
}

.body {
  margin: 0;
  color: var(--code-muted);
}
</style>
