<script setup lang="ts">
import { Lightbulb } from '@lucide/vue'

const props = defineProps<{ hints: string[]; shown: number }>()
const emit = defineEmits<{ reveal: [] }>()

const visible = computed(() => props.hints.slice(0, props.shown))
const list = ref<HTMLOListElement>()

async function reveal() {
  emit('reveal')
  await nextTick()
  const last = list.value?.lastElementChild
  if (last instanceof HTMLElement) last.focus()
}
</script>

<template>
  <div class="hints">
    <ol v-if="visible.length" ref="list">
      <li v-for="(hint, i) in visible" :key="i" tabindex="-1">
        <strong>Hint {{ i + 1 }}.</strong> {{ hint }}
      </li>
    </ol>
    <button v-if="shown < hints.length" type="button" class="btn-secondary" @click="reveal">
      <Lightbulb :size="16" aria-hidden="true" /> Show hint {{ shown + 1 }} of {{ hints.length }}
    </button>
  </div>
</template>

<style scoped>
.hints {
  display: grid;
  justify-items: start;
  gap: var(--s3);
  margin-top: var(--s4);
}

ol {
  display: grid;
  gap: var(--s2);
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  padding: var(--s2) var(--s3);
  border-radius: var(--r-m);
  background: var(--accent-soft);
}
</style>
