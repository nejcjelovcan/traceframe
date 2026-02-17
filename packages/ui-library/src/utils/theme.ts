/**
 * Theme utilities for managing color modes and themes.
 *
 * Mode: light/dark - Controls semantic color mappings (light vs dark backgrounds)
 * Theme: arctic/forge/mist - Controls the color palette
 *
 * Both are applied via CSS classes on the document root:
 * - Mode: 'light' or 'dark' class
 * - Theme: 'arctic', 'forge', or 'mist' class
 *
 * Example: <html class="light arctic"> or <html class="dark forge">
 */

export type Mode = 'light' | 'dark'
export type Theme = 'arctic' | 'forge' | 'mist'

export const MODES: readonly Mode[] = ['light', 'dark'] as const
export const THEMES: readonly Theme[] = ['arctic', 'forge', 'mist'] as const

export const MODE_LABELS: Record<Mode, string> = {
  light: 'Light',
  dark: 'Dark',
}

export const THEME_LABELS: Record<Theme, string> = {
  arctic: 'Arctic',
  forge: 'Forge',
  mist: 'Mist',
}

export const THEME_DESCRIPTIONS: Record<Theme, string> = {
  arctic: 'Clean, precise palette for analytical interfaces',
  forge: 'Precision warmth with graphite and oxidized bronze editorial restraint',
  mist: 'Near-monochrome precision for dense, content-first interfaces',
}

/**
 * Apply a mode to the document root element.
 * Adds the mode class and removes the opposite mode class.
 */
export function applyMode(mode: Mode): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
  }
}

/**
 * Apply a theme to the document root element.
 * Removes all other theme classes and applies the new one.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Remove all theme classes
  for (const t of THEMES) {
    root.classList.remove(t)
  }

  // Apply new theme class
  root.classList.add(theme)
}
