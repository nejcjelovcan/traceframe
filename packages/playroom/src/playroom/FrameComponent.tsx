import React from 'react'

import { ThemeProvider, type Mode, type Theme } from '@nejcjelovcan/traceframe-ui-library'
import '@nejcjelovcan/traceframe-ui-library/fonts'
import '@nejcjelovcan/traceframe-ui-library/styles.css'

interface ThemeValue {
  name: string
}

interface Props {
  theme: ThemeValue
  children: React.ReactNode
}

/**
 * Theme mapping from playroom theme names to mode and color theme.
 */
const THEME_MAP: Record<string, { mode: Mode; theme: Theme }> = {
  'Dusk Light': { mode: 'light', theme: 'dusk' },
  'Dusk Dark': { mode: 'dark', theme: 'dusk' },
  'Arctic Light': { mode: 'light', theme: 'arctic' },
  'Arctic Dark': { mode: 'dark', theme: 'arctic' },
  'Ember Light': { mode: 'light', theme: 'ember' },
  'Ember Dark': { mode: 'dark', theme: 'ember' },
}

/**
 * Parse a playroom theme object into mode and color theme.
 * Playroom passes the exported theme value (e.g., { name: 'Dusk Light' }).
 */
function parseTheme(themeInput: ThemeValue | undefined): {
  mode: Mode
  theme: Theme
} {
  if (!themeInput?.name) {
    return { mode: 'light', theme: 'dusk' }
  }

  return THEME_MAP[themeInput.name] ?? { mode: 'light', theme: 'dusk' }
}

export default function FrameComponent({ theme, children }: Props) {
  const { mode, theme: colorTheme } = parseTheme(theme)

  return (
    <ThemeProvider defaultMode={mode} defaultTheme={colorTheme}>
      <div className="min-h-screen bg-surface text-foreground p-base">{children}</div>
    </ThemeProvider>
  )
}
