<script setup lang="ts">
import { MessageCircleQuestion } from '@lucide/vue'
import type { CaseResult } from '~/composables/useChecker'

const props = defineProps<{ id: string; task: string; code: string; results: CaseResult[] | null }>()

const question = ref('')
const { answer, asking, offline, ask } = useTutor()

function send() {
  ask(tutorMessages({ task: props.task, code: props.code, results: props.results, question: question.value }))
}
</script>

<template>
  <details class="tutor">
    <summary><MessageCircleQuestion :size="16" aria-hidden="true" /> Ask the tutor</summary>
    <p class="sub">The tutor sees this exercise, your code and your last check. It gives hints, not answers.</p>
    <form class="ask" @submit.prevent="send">
      <label :for="`${id}-question`" class="visually-hidden">Your question</label>
      <textarea :id="`${id}-question`" v-model="question" rows="2" placeholder="Why does my code print the wrong thing?" />
      <button type="submit" class="btn-secondary" :disabled="asking">{{ asking ? 'Asking…' : 'Ask' }}</button>
    </form>
    <div aria-live="polite">
      <p v-if="answer" class="answer">{{ answer }}</p>
      <p v-else-if="offline" class="offline">
        The tutor is offline right now, so try a hint instead. It runs on this computer through llama-server
        on port 8080, and everything else works without it.
      </p>
    </div>
  </details>
</template>

<style scoped>
.tutor {
  margin-top: var(--s4);
}

summary {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  cursor: pointer;
  color: var(--accent-text);
  font-weight: 600;
}

.sub {
  margin: var(--s2) 0 var(--s3);
  color: var(--text-2);
  font-size: var(--text-s);
}

.ask {
  display: grid;
  justify-items: start;
  gap: var(--s2);
}

textarea {
  box-sizing: border-box;
  width: 100%;
  padding: var(--s2) var(--s3);
  border: 1px solid var(--line);
  border-radius: var(--r-m);
  background: var(--surface-2);
  color: var(--text);
  font: inherit;
  resize: vertical;
}

.answer,
.offline {
  margin: var(--s3) 0 0;
  padding: var(--s2) var(--s3);
  border-radius: var(--r-m);
  white-space: pre-wrap;
}

.answer {
  background: var(--accent-soft);
}

.offline {
  background: var(--surface-2);
  color: var(--text-2);
}
</style>
