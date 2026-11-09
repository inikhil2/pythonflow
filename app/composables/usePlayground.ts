const PLAYGROUND_KEY = 'pythonflow:playground'
const PLAYGROUND_STARTER = '# Write any Python here and press Run.\nfor n in range(1, 4):\n    print(n, n * n)\n'

// The playground's code: read from storage after mount, saved 500 ms after the last change.
export function usePlayground() {
  const code = ref(PLAYGROUND_STARTER)
  let timer: ReturnType<typeof setTimeout> | undefined

  function save() {
    clearTimeout(timer)
    timer = undefined
    try {
      localStorage.setItem(PLAYGROUND_KEY, code.value)
    } catch {
      // Storage is blocked or full: the code stays on screen for this visit.
    }
  }

  onMounted(() => {
    try {
      code.value = localStorage.getItem(PLAYGROUND_KEY) ?? PLAYGROUND_STARTER
    } catch {
      // Storage is blocked (private mode): start from the starter code.
    }
  })
  watch(code, () => {
    clearTimeout(timer)
    timer = setTimeout(save, 500)
  })
  onBeforeUnmount(() => {
    if (timer) save()
  })

  return { code, reset: () => (code.value = PLAYGROUND_STARTER) }
}
