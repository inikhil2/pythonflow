<script setup lang="ts">
import type { TraceValue } from '~/composables/usePython'

defineProps<{ locals: Record<string, TraceValue>; title: string }>()
</script>

<template>
  <div>
    <h3 class="title">{{ title }}</h3>
    <p v-if="Object.keys(locals).length === 0" class="empty">No variables yet.</p>
    <ul v-else class="boxes">
      <li v-for="(value, name) in locals" :key="name" class="box">
        <p class="head">
          <code class="name">{{ name }}</code>
          <span class="type">{{ value.type }}</span>
        </p>
        <!-- A new key replays the fade each time the value changes. -->
        <div :key="value.repr" class="value">
          <ol v-if="value.items?.length" class="items">
            <li v-for="(item, i) in value.items" :key="i">
              <span v-if="!value.keyed" class="index">{{ i }}</span>
              <code>{{ item }}</code>
            </li>
          </ol>
          <code v-else>{{ value.repr }}</code>
          <p v-if="value.length && value.items && value.length > value.items.length" class="more">
            First {{ value.items.length }} of {{ value.length }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.title {
  margin: 0 0 var(--s2);
  color: var(--code-muted);
  font-size: var(--text-s);
  font-weight: 600;
}

.empty {
  margin: 0;
  color: var(--code-muted);
  font-size: var(--text-s);
}

.boxes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.box {
  min-width: 6rem;
  max-width: 100%;
  padding: var(--s2) var(--s3);
  border-radius: var(--r-m);
  background: var(--code-bg);
}

.head {
  display: flex;
  justify-content: space-between;
  gap: var(--s3);
  margin: 0 0 var(--s1);
  font-size: var(--text-xs);
}

.name {
  color: var(--code-text);
  font-weight: 600;
}

.type {
  color: var(--code-muted);
}

.value {
  color: var(--code-text);
  font-size: var(--text-s);
  overflow-wrap: anywhere;
  animation: fade var(--dur) var(--ease);
}

@keyframes fade {
  from { opacity: 0; }
}

.items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.items li {
  display: grid;
  padding: var(--s1) var(--s2);
  border-radius: var(--r-s);
  background: var(--code-line);
}

.index,
.more {
  color: var(--code-muted);
  font-size: var(--text-xs);
}

.more {
  margin: var(--s1) 0 0;
}
</style>
