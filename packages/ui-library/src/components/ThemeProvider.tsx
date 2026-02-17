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
}

/**
 * ThemeProvider manages the application's color mode and theme.
 *
 * - Mode: light/dark - Controls semantic color mappings
 * - Theme: arctic/forge/mist - Controls the color palette
 *
 * Both are applied via CSS classes on the document root element.
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultMode="light" defaultTheme="arctic">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultMode = 'light',
  defaultTheme = 'arctic',
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<Mode>(defaultMode)
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  // Update mode
  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode)
    applyMode(newMode)
  }, [])

  // Update theme
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
  }, [])

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
