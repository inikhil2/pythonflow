# 057: TraceStepper and VariableBoxes (task C4)
Files: app/components/TraceStepper.vue, app/components/VariableBoxes.vue
Severity: med

## Problem
The explorer needs its controls and its variable view (proposal section 4.6).
- `TraceStepper`: First, Back, Step and Last buttons, a range slider (arrow keys work
  natively) and `Step 4 of 23 · line 3`. The buttons use `aria-disabled` rather than
  `disabled`, so keyboard focus does not drop at the first or last step.
- `VariableBoxes`: one box per variable, with its name, type and value. Lists, tuples and
  dicts show their items. A changed value fades in over `--dur` (200 ms), which is 1 ms
  under reduced motion.

Both sit on the dark code surface, so they use the `--code-*` tokens.

## Required change
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components.

1. **Create `app/components/TraceStepper.vue`** with exactly this content.
```vue
<script setup lang="ts">
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from '@lucide/vue'

const props = defineProps<{ total: number, line: number }>()
const index = defineModel<number>({ required: true })

const last = computed(() => props.total - 1)

// The buttons stay enabled so focus never drops; go() keeps the index inside the steps.
function go(i: number) {
  index.value = Math.min(Math.max(i, 0), last.value)
}
</script>

<template>
  <div class="stepper">
    <div class="buttons">
      <button type="button" class="btn-secondary" :aria-disabled="index === 0" @click="go(0)">
        <ChevronFirst :size="16" aria-hidden="true" /> First
      </button>
      <button type="button" class="btn-secondary" :aria-disabled="index === 0" @click="go(index - 1)">
        <ChevronLeft :size="16" aria-hidden="true" /> Back
      </button>
      <button type="button" class="btn-primary" :aria-disabled="index === last" @click="go(index + 1)">
        Step <ChevronRight :size="16" aria-hidden="true" />
      </button>
      <button type="button" class="btn-secondary" :aria-disabled="index === last" @click="go(last)">
        Last <ChevronLast :size="16" aria-hidden="true" />
      </button>
    </div>
    <input
      v-model.number="index"
      type="range"
      min="0"
      :max="last"
      aria-label="Step"
      :aria-valuetext="`Step ${index + 1} of ${total}, line ${line}`"
    >
    <p class="count" aria-live="polite">Step {{ index + 1 }} of {{ total }} · line {{ line }}</p>
  </div>
</template>

<style scoped>
.stepper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s2) var(--s4);
  padding: var(--s3);
  border-top: 1px solid var(--code-line);
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
}

.btn-secondary {
  background: var(--code-line);
  color: var(--code-text);
}

button[aria-disabled='true'] {
  cursor: default;
  opacity: 0.5;
}

input[type='range'] {
  flex: 1;
  min-width: 8rem;
  accent-color: var(--accent);
}

.count {
  margin: 0;
  color: var(--code-muted);
  font-size: var(--text-s);
  font-variant-numeric: tabular-nums;
}
</style>
```

2. **Create `app/components/VariableBoxes.vue`** with exactly this content.
```vue
<script setup lang="ts">
import type { TraceValue } from '~/composables/usePython'

defineProps<{ locals: Record<string, TraceValue> }>()
</script>

<template>
  <div>
    <h3 class="title">Variables</h3>
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
              <span v-if="value.type !== 'dict'" class="index">{{ i }}</span>
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
```

## Acceptance gates
- `git status --short` lists only these two new files.
- `wc -c < app/components/TraceStepper.vue` prints `2150` and
  `wc -c < app/components/VariableBoxes.vue` prints `2422`.
- `grep -c "^import" app/components/TraceStepper.vue` prints `1`, and the same for
  `app/components/VariableBoxes.vue`.
- `npm run generate` exits 0.
