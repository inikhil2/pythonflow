export type Theme = 'system' | 'light' | 'dark'

export const THEME_KEY = 'pythonflow:theme'

// One state for the whole app; the early script in nuxt.config.ts applies the saved theme before paint.
const theme = ref<Theme>('system')
let loaded = false

function readStored(): Theme {
  try {
    const value = localStorage.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    // Storage is blocked (private mode): the theme follows the system for this visit.
    return 'system'
  }
}

function apply(next: Theme) {
  // No attribute means "follow the system", which the media queries handle.
  if (next === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = next
}

export function useTheme() {
  // Read storage after mount so the prerendered HTML and the first render match.
  if (import.meta.client && getCurrentInstance() && !loaded) {
    onMounted(() => {
      loaded = true
      theme.value = readStored()
    })
  }

  return {
    theme: readonly(theme),
    setTheme(next: Theme) {
      theme.value = next
      apply(next)
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        // Storage is blocked or full: the choice lasts for this visit.
      }
    },
  }
}
