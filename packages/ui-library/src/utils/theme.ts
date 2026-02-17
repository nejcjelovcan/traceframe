/**
 * Theme utilities for managing color modes and themes.
 *
 * Mode: light/dark - Controls semantic color mappings (light vs dark backgrounds)
 * Theme: dusk/arctic - Controls the color palette
 *
 * Both are applied via CSS classes on the document root:
 * - Mode: 'light' or 'dark' class
 * - Theme: 'dusk' or 'arctic' class
 *
 * Example: <html class="light dusk"> or <html class="dark arctic">
 */

export type Mode = 'light' | 'dark'
export type Theme = 'dusk' | 'arctic' | 'ember' | 'forge'

export const MODES: readonly Mode[] = ['light', 'dark'] as const
export const THEMES: readonly Theme[] = ['dusk', 'arctic', 'ember', 'forge'] as const

export const MODE_LABELS: Record<Mode, string> = {
  light: 'Light',
  dark: 'Dark',
}

export const THEME_LABELS: Record<Theme, string> = {
  dusk: 'Dusk',
  arctic: 'Arctic',
  ember: 'Ember',
  forge: 'Forge',
}

export const THEME_DESCRIPTIONS: Record<Theme, string> = {
  dusk: 'Modern, slightly whimsical with warm accents',
  arctic: 'Clean, precise palette for analytical interfaces',
  ember: 'Warm, compact design-studio aesthetic for data-rich interfaces',
  forge: 'Precision warmth with graphite and oxidized bronze editorial restraint',
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
