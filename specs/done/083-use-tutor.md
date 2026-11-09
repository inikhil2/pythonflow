# 083: useTutor composable that asks llama-server (task T7, part 2 of 3)
Files: app/composables/useTutor.ts
Severity: med

## Problem
The tutor box (spec 084) needs one call: `ask(messages)`. It must expose the answer, an
"asking" flag and an "offline" flag. plan.md says that when llama-server is unreachable,
the box shows a friendly offline message and the rest of the app still works.

Facts checked against the running llama-server on port 8080:
- `POST http://127.0.0.1:8080/v1/chat/completions` with `model: "qwen"` returns
  `choices[0].message.content`. A three-sentence hint took about 7 seconds.
- `chat_template_kwargs: { enable_thinking: false }` turns off Qwen's hidden reasoning,
  so the hint arrives in seconds.
- The server sends CORS headers for `http://localhost:3000`, so the browser may call it.

Any failure counts as offline: no server, a non-200 reply, an empty answer or a wait over
60 seconds. Leaving the page aborts the request.

## Required change
1. **Create `app/composables/useTutor.ts`** with exactly this content.
```ts
import type { ChatMessage } from '~/utils/tutorPrompt'

const TUTOR_URL = 'http://127.0.0.1:8080/v1/chat/completions'
const TUTOR_TIMEOUT = 60_000

interface ChatReply {
  choices?: { message?: { content?: string } }[]
}

// Asks the local Qwen tutor through llama-server. Any failure counts as offline, and nothing else depends on it.
export function useTutor() {
  const answer = ref('')
  const asking = ref(false)
  const offline = ref(false)
  const controller = new AbortController()

  async function ask(messages: ChatMessage[]) {
    asking.value = true
    offline.value = false
    answer.value = ''
    try {
      const res = await fetch(TUTOR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Thinking off: a hint should arrive in seconds, not after a long hidden essay.
        body: JSON.stringify({ model: 'qwen', messages, max_tokens: 300, chat_template_kwargs: { enable_thinking: false } }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(TUTOR_TIMEOUT)]),
      })
      const reply = (await res.json()) as ChatReply
      answer.value = (res.ok && reply.choices?.[0]?.message?.content?.trim()) || ''
    } catch {
      // The server is down, blocked or too slow: the finally block shows the offline message.
    } finally {
      offline.value = !answer.value
      asking.value = false
    }
  }

  onBeforeUnmount(() => controller.abort())

  return { answer, asking, offline, ask }
}
```

Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components.

## Acceptance gates
1. `npx nuxi typecheck` exits 0.
2. `wc -c app/composables/useTutor.ts` gives 1483.
3. `grep -c "enable_thinking: false" app/composables/useTutor.ts` gives 1.
4. `git status --short` lists only this new file.
