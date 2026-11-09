<script setup lang="ts">
import { Monitor, Moon, Sun } from '@lucide/vue'
import type { Theme } from '~/composables/useTheme'

const { theme, setTheme } = useTheme()

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]
</script>

<template>
  <div class="segmented" role="group" aria-label="Theme">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-label="`${option.label} theme`"
      :aria-pressed="theme === option.value"
      :class="{ selected: theme === option.value }"
      @click="setTheme(option.value)"
    >
      <component :is="option.icon" :size="16" :stroke-width="1.75" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.segmented {
  display: inline-flex;
  gap: var(--s1);
  padding: var(--s1);
  border-radius: var(--r-m);
  background: var(--surface-2);
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  border: 0;
  border-radius: var(--r-s);
  background: transparent;
  color: var(--text-2);
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

button:hover { color: var(--text); }

/* The selected segment is a filled tile, as in Apple's segmented controls. */
button.selected {
  background: var(--surface);
  color: var(--text);
}
</style>
