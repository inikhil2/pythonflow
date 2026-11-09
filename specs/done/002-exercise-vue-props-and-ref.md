# 002: Fix undefined `starter` and the clashing template ref in Exercise.vue
Files: app/components/content/Exercise.vue
Severity: high

## Problem
Do this only after spec 001 (the file must exist at the root path).
1. Line `const code = ref(starter || "")`: `starter` is not a variable.
   `defineProps` is called without keeping its result, so this throws
   `ReferenceError: starter is not defined` and the exercise never renders.
2. The `<textarea>` has `ref="code"` and also `v-model="code"`. The template ref
   overwrites the `code` ref with the DOM element.
3. `.code-editor` uses `border: var(--border)`. `--border` is only a color, so
   the declaration is invalid. DESIGN.md says the editor has no visible border
   until focused, padding `1rem`, background `--bg-alt`.
4. `min-height: 120px` uses px. DESIGN.md says spacing in rem only.
5. `.exercise-card` sets the monospace font on the whole card. Only the editor is code.
6. The component repeats the global `prefers-reduced-motion` block. That block
   belongs once in `app/assets/css/main.css` (spec 004), not per component.

## Required change
Replace the whole file `app/components/content/Exercise.vue` with exactly:

```vue
<script setup lang="ts">
const props = defineProps<{
  id: string
  prompt: string
  starter?: string
  tests?: Array<{ stdin: string; stdout: string }>
  solution?: string
}>()

const code = ref(props.starter ?? '')
</script>

<template>
  <section class="exercise-card" :aria-labelledby="`${id}-title`">
    <h3 :id="`${id}-title`">Try it yourself</h3>
    <p class="prompt">{{ prompt }}</p>
    <textarea
      v-model="code"
      rows="8"
      spellcheck="false"
      aria-label="Your code"
      class="code-editor"
    />
  </section>
</template>

<style scoped>
.exercise-card {
  background: var(--bg-alt);
  border-radius: 12px;
  padding: 1rem;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text);
}

.prompt {
  margin: 0 0 1rem 0;
  color: var(--text-2);
}

.code-editor {
  box-sizing: border-box;
  width: 100%;
  min-height: 8rem;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: var(--bg);
  color: var(--text);
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
}

.code-editor:focus {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}
</style>
```

Note: the editor uses `--bg` (not `--bg-alt`) because it sits inside a card
that is already `--bg-alt`; same-color nesting would hide the editor.

## Acceptance gates
- `grep -c 'ref="code"' app/components/content/Exercise.vue` prints `0`
- `grep -c 'props.starter' app/components/content/Exercise.vue` prints `1`
- `grep -E '[0-9]px' app/components/content/Exercise.vue | grep -vE 'border-radius|box-shadow' | wc -l` prints `0`
- `npm run generate` exits 0
