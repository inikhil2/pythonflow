# 018: Show the error explanation under the traceback (task A2, part 2)
Files: app/components/ErrorHelp.vue, app/components/RunOutput.vue
Severity: med

## Problem
Spec 017 added `explainError(error)` in `app/utils/errorHelp.ts`. Nothing shows it yet.
The explanation must appear below the real traceback in the run console, never instead
of it. Do this spec only after spec 017 is done.

## Required change
1. Create `app/components/ErrorHelp.vue` with exactly this content. `explainError` is
   auto-imported by Nuxt from `app/utils/`; do not import it.
```vue
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
```

2. In `app/components/RunOutput.vue`, replace exactly:
```vue
      <pre v-else-if="result.error" class="err">{{ result.error }}</pre>
```
   with exactly:
```vue
      <pre v-else-if="result.error" class="err">{{ result.error }}</pre>
      <ErrorHelp v-if="result.error" :error="result.error" />
```
   Change nothing else in this file.

## Acceptance gates
- `grep -n "<ErrorHelp" app/components/RunOutput.vue` prints one line.
- `grep -cE "#[0-9a-fA-F]{3,6}" app/components/ErrorHelp.vue` prints 0.
- `npm run generate` exits 0.
- Browser (`npm run dev`, lesson `/learn/week0-functions/01-hello`): Run `print(x)`.
  The console shows the NameError traceback, then a line "Python does not know that
  name" with its sentence. Run `print("hi")`: no explanation is shown. Run
  `print("hi`: the explanation is "A string is missing its closing quote".
