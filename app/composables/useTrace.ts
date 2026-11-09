import type { TraceResult, TraceStep } from '~/composables/usePython'

// One traced run for the visual explorer, and the step being shown.
export function useTrace() {
  const { running, trace } = usePython()
  const result = ref<TraceResult | null>(null)
  const traced = ref('') // the code that result came from
  const index = ref(0)

  const steps = computed(() => result.value?.steps ?? [])
  const current = computed<TraceStep | null>(() => steps.value[index.value] ?? null)
  // What the program had printed when the current step was recorded.
  const output = computed(() => (current.value ? (result.value?.stdout ?? '').slice(0, current.value.stdoutLength) : ''))

  async function go(code: string) {
    result.value = await trace(code)
    traced.value = code
    index.value = 0
  }

  return { running, result, traced, steps, index, current, output, go }
}
