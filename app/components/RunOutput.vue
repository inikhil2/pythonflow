<script setup lang="ts">
import type { RunResult } from '~/composables/usePython'

defineProps<{ result: RunResult | null }>()
</script>

<template>
  <div class="console" aria-live="polite">
    <p v-if="!result" class="empty">Press Run to see what your program prints.</p>
    <template v-else>
      <pre v-if="result.stdout" class="out">{{ result.stdout }}</pre>
      <pre v-if="result.stderr" class="err">{{ result.stderr }}</pre>
      <!-- The traceback in stderr already ends with the error line. -->
      <pre v-else-if="result.error" class="err">{{ result.error }}</pre>
      <ErrorHelp v-if="result.error" :error="result.error" />
      <p v-if="!result.stdout && !result.stderr && !result.error" class="empty">
        Your program finished without printing anything.
      </p>
    </template>
  </div>
</template>

<style scoped>
.console {
  min-height: 5rem;
  padding: var(--s3) var(--s4);
  background: var(--code-bg);
  color: var(--code-text);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.err {
  color: var(--code-err);
}

.empty {
  margin: 0;
  color: var(--code-muted);
  font-family: var(--font);
}
</style>
