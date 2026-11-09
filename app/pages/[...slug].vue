<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('pages').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useHead({ title: `${page.value.title} · PythonFlow` })
</script>

<template>
  <article v-if="page" class="prose">
    <ContentRenderer :value="page" />
  </article>
</template>

<style scoped>
.prose {
  max-width: 40rem;
  font-size: var(--text-body);
  line-height: 1.65;
}
</style>
