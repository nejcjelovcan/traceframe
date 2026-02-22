import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { applyMode, applyTheme, type Mode, type Theme } from '../utils/theme.js'

export interface ThemeContextValue {
  /** Current color mode (light or dark) */
  mode: Mode
  /** Update the color mode */
  setMode: (mode: Mode) => void
  /** Current color theme (arctic, forge, mist) */
  theme: Theme
  /** Update the color theme */
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export interface ThemeProviderProps {
  /** Child components */
  children: React.ReactNode
  /** Default color mode (default: 'light') */
  defaultMode?: Mode
  /** Default color theme (default: 'arctic') */
  defaultTheme?: Theme
  /** Enable localStorage persistence (default: false) */
  persistToStorage?: boolean
  /** Custom storage key prefix (default: 'traceframe-theme') */
  storageKey?: string
}

/**
 * ThemeProvider manages the application's color mode and theme.
 *
 * - Mode: light/dark - Controls semantic color mappings
 * - Theme: arctic/forge/mist/aura - Controls the color palette
 *
 * Both are applied via CSS classes on the document root element.
 *
 * Optionally persists preferences to localStorage when `persistToStorage` is true.
 * Storage keys: `{storageKey}-mode` and `{storageKey}-theme`
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeProvider defaultMode="light" defaultTheme="arctic">
 *   <App />
 * </ThemeProvider>
 *
 * // With localStorage persistence
 * <ThemeProvider
 *   defaultMode="light"
 *   defaultTheme="arctic"
 *   persistToStorage
 *   storageKey="my-app-theme"
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */
function isValidMode(value: unknown): value is Mode {
  return typeof value === 'string' && (value === 'light' || value === 'dark')
}

function isValidTheme(value: unknown): value is Theme {
  return (
    typeof value === 'string' &&
    (value === 'arctic' || value === 'forge' || value === 'mist' || value === 'aura')
  )
}

function loadFromStorage(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key)
    }
  } catch {
    // localStorage might be unavailable (e.g., incognito mode)
  }
  return null
}

function saveToStorage(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value)
    }
  } catch {
    // localStorage might be unavailable (e.g., incognito mode)
  }
}

export function ThemeProvider({
  children,
  defaultMode = 'light',
  defaultTheme = 'arctic',
  persistToStorage = false,
  storageKey = 'traceframe-theme',
}: ThemeProviderProps) {
  // Initialize state with defaults or stored values
  const [mode, setModeState] = useState<Mode>(() => {
    if (persistToStorage) {
      const stored = loadFromStorage(`${storageKey}-mode`)
      if (stored && isValidMode(stored)) {
        return stored
      }
    }
    return defaultMode
  })

  const [theme, setThemeState] = useState<Theme>(() => {
    if (persistToStorage) {
      const stored = loadFromStorage(`${storageKey}-theme`)
      if (stored && isValidTheme(stored)) {
        return stored
      }
    }
    return defaultTheme
  })

  // Update mode
  const setMode = useCallback(
    (newMode: Mode) => {
      setModeState(newMode)
      applyMode(newMode)
      if (persistToStorage) {
        saveToStorage(`${storageKey}-mode`, newMode)
      }
    },
    [persistToStorage, storageKey]
  )

  // Update theme
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme)
      applyTheme(newTheme)
      if (persistToStorage) {
        saveToStorage(`${storageKey}-theme`, newTheme)
      }
    },
    [persistToStorage, storageKey]
  )

  // Apply mode and theme on mount
  useEffect(() => {
    applyMode(mode)
    applyTheme(theme)
  }, [mode, theme])

  const value = useMemo(
    () => ({ mode, setMode, theme, setTheme }),
    [mode, setMode, theme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to access the theme context.
 *
 * @example
 * ```tsx
 * const { mode, setMode, theme, setTheme } = useTheme()
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

ThemeProvider.displayName = 'ThemeProvider'
