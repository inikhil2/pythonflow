import type { Attempt, Progress } from '~/utils/progress'

// One state for the whole app.
const state = ref<Progress>(emptyProgress())
let loaded = false

function load() {
  if (loaded) return
  loaded = true
  try {
    state.value = parseProgress(localStorage.getItem(STORAGE_KEY)) ?? emptyProgress()
  } catch {
    // Storage is blocked (private mode): progress lives in memory for this visit.
  }
}

function update(change: (p: Progress) => Progress) {
  if (!import.meta.client) return
  load()
  state.value = change(state.value)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  } catch {
    // Storage is blocked or full: keep the in-memory copy.
  }
}

export function useProgress() {
  // Read storage after mount so the prerendered HTML and the first render match.
  if (import.meta.client && getCurrentInstance()) onMounted(load)
  const now = () => new Date().toISOString()

  return {
    progress: readonly(state),
    openLesson: (path: string) => update((p) => withLessonOpened(p, path, now())),
    completeLesson: (path: string) => update((p) => withLessonCompleted(p, path, now())),
    saveCode: (id: string, code: string) => update((p) => withCode(p, id, code)),
    revealHint: (id: string) => update((p) => withHint(p, id)),
    recordAttempt: (attempt: Attempt) => update((p) => withAttempt(p, attempt)),
    setName: (name: string) => update((p) => withName(p, name)),
    exportJson: () => JSON.stringify(state.value, null, 2),
    // Returns false and changes nothing when the text is not PythonFlow progress.
    importJson(text: string): boolean {
      const imported = parseProgress(text)
      if (!imported) return false
      update(() => imported)
      return true
    },
    reset: () => update(() => emptyProgress()),
  }
}
