export type ThemeMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'theme'

/** Read the persisted theme mode, defaulting to 'auto'. SSR-safe. */
export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'auto'
  const value = window.localStorage.getItem(STORAGE_KEY)
  return value === 'light' || value === 'dark' || value === 'auto'
    ? value
    : 'auto'
}

/**
 * Apply a theme mode to <html> and persist it. Mirrors the inline
 * THEME_INIT_SCRIPT in __root.tsx so first paint and runtime stay in sync.
 */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode
  const root = document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  if (mode === 'auto') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', mode)
  }
  root.style.colorScheme = resolved

  window.localStorage.setItem(STORAGE_KEY, mode)
}
