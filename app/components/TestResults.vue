<script setup lang="ts">
import { CircleCheck, CircleX } from '@lucide/vue'
import type { CaseResult } from '~/composables/useChecker'

const props = defineProps<{ results: CaseResult[]; total: number; labels?: string[]; showCheck?: boolean }>()

const passedCount = computed(() => props.results.filter((r) => r.passed).length)
</script>

<template>
  <div class="results">
    <p class="summary" role="status">{{ passedCount }} of {{ total }} tests passed</p>
    <ol>
      <li v-for="(r, i) in results" :key="i" :class="r.passed ? 'pass' : 'fail'">
        <p class="name">
          <CircleCheck v-if="r.passed" :size="16" aria-hidden="true" />
          <CircleX v-else :size="16" aria-hidden="true" />
          {{ labels?.[i] ?? 'Test ' + (i + 1) }}: {{ r.passed ? 'Passed' : 'Failed' }}
        </p>
        <template v-if="!r.passed">
          <template v-if="r.timedOut">
            <p class="note">Too slow: your program ran for more than 10 seconds and was stopped.</p>
            <pre v-if="r.input">{{ r.input }}</pre>
          </template>
          <template v-else-if="r.error">
            <template v-if="showCheck && r.input">
              <p class="note">Checked</p>
              <pre>{{ r.input }}</pre>
            </template>
            <pre class="error">{{ r.error }}</pre>
          </template>
          <div v-else-if="r.expected !== null" class="diff">
            <div>
              <p class="label">Expected</p>
              <pre>{{ r.expected }}</pre>
            </div>
            <div>
              <p class="label">Your output</p>
              <pre>{{ r.actual || '(nothing)' }}</pre>
            </div>
          </div>
        </template>
      </li>
    </ol>
    <p v-if="results.length < total" class="note">The remaining tests were not run.</p>
  </div>
</template>

<style scoped>
.results {
  margin-top: var(--s4);
}

.summary {
  margin: 0 0 var(--s2);
  font-weight: 600;
}

ol {
  display: grid;
  gap: var(--s3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.name {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin: 0;
  font-weight: 600;
}

.pass .name { color: var(--success); }
.fail .name { color: var(--error); }

.diff {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--s2);
  margin-top: var(--s2);
}

.label,
.note {
  margin: var(--s2) 0 var(--s1);
  color: var(--text-2);
  font-size: var(--text-s);
}

.diff .label {
  margin-top: 0;
}

pre {
  margin: 0;
  padding: var(--s2) var(--s3);
  border-radius: var(--r-m);
  background: var(--surface-2);
  font-family: var(--font-mono);
  font-size: var(--text-s);
  white-space: pre-wrap;
  word-break: break-word;
}

.error {
  margin-top: var(--s2);
  color: var(--error);
}
</style>
