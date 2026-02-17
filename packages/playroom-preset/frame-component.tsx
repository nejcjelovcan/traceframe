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

const THEME_MAP: Record<string, { mode: Mode; theme: Theme }> = {
  'Arctic Light': { mode: 'light', theme: 'arctic' },
  'Arctic Dark': { mode: 'dark', theme: 'arctic' },
  'Forge Light': { mode: 'light', theme: 'forge' },
  'Forge Dark': { mode: 'dark', theme: 'forge' },
  'Mist Light': { mode: 'light', theme: 'mist' },
  'Mist Dark': { mode: 'dark', theme: 'mist' },
}

function parseTheme(themeInput: ThemeValue | undefined): {
  mode: Mode
  theme: Theme
} {
  if (!themeInput?.name) {
    return { mode: 'light', theme: 'arctic' }
  }

  return THEME_MAP[themeInput.name] ?? { mode: 'light', theme: 'arctic' }
}

export default function FrameComponent({ theme, children }: Props) {
  const { mode, theme: colorTheme } = parseTheme(theme)

  return (
    <ThemeProvider defaultMode={mode} defaultTheme={colorTheme}>
      <div className="min-h-screen bg-surface text-foreground p-base">{children}</div>
    </ThemeProvider>
  )
}
