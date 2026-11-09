# 055: useTrace composable (task C2)
Files: app/composables/useTrace.ts
Severity: med

## Problem
Components need the explorer state without knowing the trace protocol: the steps, the
step being shown, what was printed by then, and which code the steps came from.

Deviation from the proposal: there is no `step(delta)`. `TraceStepper` (spec 057) sets
`index` through `v-model` and keeps it in range itself, so `step` would be dead code.

Do this after spec 054.

## Required change
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components. The only import is the type import below.

1. **Create `app/composables/useTrace.ts`** with exactly this content.
```ts
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
```

## Acceptance gates
- `git status --short` lists only `?? app/composables/useTrace.ts`.
- `wc -c < app/composables/useTrace.ts` prints `872`.
- `grep -c "^import" app/composables/useTrace.ts` prints `1`.
- `npm run generate` exits 0.
