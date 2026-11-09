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
