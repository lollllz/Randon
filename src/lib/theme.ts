import type { ThemePreference } from '../types'

export type ResolvedTheme = 'light' | 'dark'

const THEME_PREF_KEY = 'randon:theme-pref'

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function normalizeTheme(value: unknown): ThemePreference {
  if (value === 'dark' || value === 'ink' || value === 'night') return 'dark'
  if (value === 'light' || value === 'paper' || value === 'sepia') return 'light'
  if (value === 'system') return 'system'
  return 'system'
}

export function prefersDarkScheme(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function resolveTheme(
  preference: ThemePreference,
  dark = prefersDarkScheme(),
): ResolvedTheme {
  if (preference === 'system') return dark ? 'dark' : 'light'
  return preference
}

export function applyResolvedTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export function rememberThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_PREF_KEY, preference)
  } catch {
    /* private mode */
  }
}

export function subscribeSystemTheme(onChange: (dark: boolean) => void): () => void {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const handle = (event: MediaQueryListEvent) => onChange(event.matches)
  media.addEventListener('change', handle)
  return () => media.removeEventListener('change', handle)
}
