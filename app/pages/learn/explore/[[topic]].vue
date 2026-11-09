<script setup lang="ts">
const route = useRoute()

const { data: topics } = await useAsyncData('explorer', () => queryCollection('explorer').order('stem', 'ASC').all())

// /learn/explore opens the first topic.
const topic = computed(() => {
  const all = topics.value ?? []
  return route.params.topic ? all.find((t) => t.topic === route.params.topic) : all[0]
})

if (!topic.value) {
  throw createError({ statusCode: 404, statusMessage: 'Topic not found', fatal: true })
}

useHead({ title: () => `${topic.value?.title} · Explore · PythonFlow` })
</script>

<template>
  <div class="page">
    <header>
      <h1>Explore</h1>
      <p class="sub">Run real Python one step at a time and watch each variable change.</p>
    </header>
    <nav aria-label="Topics">
      <ul class="topics">
        <li v-for="t in topics" :key="t.topic">
          <NuxtLink
            :to="`/learn/explore/${t.topic}`"
            class="topic"
            :aria-current="t.topic === topic?.topic ? 'page' : undefined"
          >
            {{ t.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <section v-if="topic" aria-labelledby="topic-title">
      <h2 id="topic-title">{{ topic.title }}</h2>
      <p class="sub">Week {{ topic.week }} · {{ topic.summary }}</p>
      <Trace :key="topic.topic" :code="topic.code" />
    </section>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
  max-width: 52rem;
}

.sub {
  margin: var(--s2) 0 0;
  color: var(--text-2);
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.topic {
  display: inline-block;
  padding: var(--s1) var(--s3);
  border-radius: var(--r-pill);
  background: var(--surface-2);
  color: var(--text-2);
  font-size: var(--text-s);
  font-weight: 500;
  text-decoration: none;
}

.topic:hover {
  color: var(--text);
}

.topic[aria-current='page'] {
  background: var(--accent-soft);
  color: var(--accent-text);
}
</style>
