# Patterns: copy these files

Read this with every task. When you write a new file, open the exemplar named below
and copy its shape. DESIGN.md has the values; this file says how to write the code.

## Rules for every file

1. Vue files start with `<script setup lang="ts">`, then `<template>`, then `<style scoped>`.
2. Type props with `defineProps<{ name: string; count?: number }>()`. Type events with
   `defineEmits<{ reset: [] }>()`. Use `defineModel<string>({ required: true })` for v-model.
3. Never use `any`. Import types with `import type { RunResult } from '~/composables/usePython'`.
4. Colours, spacing, radius, type sizes, shadows and durations come only from the CSS
   variables in `app/assets/css/main.css`. Never write a hex colour or `px` spacing in a
   component. Allowed `px`: `1px` hairlines and icon `:size`.
5. One job per file, under 150 lines. If a file grows past that, split out a component.
6. Logic lives in `app/composables/useX.ts` (state and side effects) or `app/utils/x.ts`
   (pure functions). Components only call them and render. Nuxt auto-imports both: do
   not import `ref`, `computed`, `usePython` or `editorTheme` by hand.
7. Names: components `PascalCase.vue`, composables `useThing.ts`, utils `camelCase.ts`,
   CSS classes short lowercase words (`.bar`, `.status`, `.lesson`).
8. Icons: `import { Play } from '@lucide/vue'`, then `<Play :size="16" aria-hidden="true" />`,
   always next to visible text. No emoji.
9. Comments only where the reason is not obvious from the code. One line each.

## Exemplars

| File | Copy this from it |
|---|---|
| `app/assets/css/main.css` | All tokens. Global `.btn-primary`, `.btn-secondary`, `.card`, `.visually-hidden`. Add new tokens here, never in components. |
| `app/layouts/default.vue` | Page frame. Do not add per-page frames; every page renders inside this. |
| `app/components/AppSidebar.vue` | A list of links from a typed array; `aria-current="page"` for the current item; phone layout under `48rem` with one media query. |
| `app/components/EmptyState.vue` | The smallest component: typed props, a card, one action. Use it whenever a page or list has nothing to show. |
| `app/components/RunPanel.vue` | A component that uses a composable (`usePython()`), derives text with `computed`, emits an event (`reset`), and exposes one method (`defineExpose`). Status text sits in a `role="status"` element. |
| `app/components/RunOutput.vue` | A display-only component: one prop, `v-if` states, and an empty state that says what to do. |
| `app/components/content/Exercise.vue` | How a content component wires `CodeEditor` and `RunPanel` together. New workbench features (checker, hints) go here as child components. |
| `app/pages/learn/index.vue` | A page that queries a collection with `useAsyncData` + `queryCollection(...)`, groups the rows in a `computed`, and lists them with `--line` hairlines. |
| `app/pages/learn/[...slug].vue` | A detail page: query one item, `createError` 404 when missing, `useHead` title, previous/next navigation. |
| `app/pages/practice.vue` | A page shell: `useHead`, one `<h1>`, content below. |
| `content.config.ts` | Collections with a `z.object` schema. New frontmatter fields are added here first. |

## Do not edit

- `app/components/CodeEditor.vue` and `app/utils/editorTheme.ts`. They are the only
  CodeMirror code. Use `<CodeEditor v-model="code" label="Your code" @run="..." />`.
  Changes come as a full-code spec from the principal engineer.
- `public/pyodide-worker.js` and `app/composables/usePython.ts`, unless the spec names them.

## Accessibility checklist

- Actions are `<button type="button">`; navigation is `<NuxtLink>`.
- Every page has exactly one `<h1>`. Sections use `<h2>` with `aria-labelledby` when they
  are landmarks (`<section>`).
- Form fields have a visible `<label>` that wraps the field or uses `for`.
- Do not remove focus outlines. Do not convey state by colour alone: add a word or an icon.
- Animations use `var(--dur)` / `var(--ease)` so reduced motion turns them off.

## Words

Sentence case. Buttons say what happens: "Run", "Stop", "Reset code", "Next lesson".
Empty states say why the page is empty and offer one link.
