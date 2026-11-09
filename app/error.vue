<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const missing = computed(() => props.error.statusCode === 404)

useHead({ title: `${missing.value ? 'Page not found' : 'Something went wrong'} · PythonFlow` })
</script>

<template>
  <NuxtLayout>
    <div class="page">
      <p class="code">{{ error.statusCode }}</p>
      <h1>{{ missing ? 'Page not found' : 'Something went wrong' }}</h1>
      <p class="sub">
        {{ missing
          ? 'This address has no page. The lesson may have moved, or the link has a typo.'
          : 'PythonFlow hit an error loading this page. Your progress is safe in this browser.' }}
      </p>
      <div class="actions">
        <button type="button" class="btn-primary" @click="clearError({ redirect: '/' })">Go to Today</button>
        <button type="button" class="btn-secondary" @click="clearError({ redirect: '/learn' })">Browse lessons</button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s3);
  max-width: 40rem;
}

.code {
  margin: 0;
  color: var(--accent-text);
  font-family: var(--font-mono);
  font-size: var(--text-s);
}

h1,
.sub {
  margin: 0;
}

.sub {
  color: var(--text-2);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3);
  margin-top: var(--s3);
}
</style>
