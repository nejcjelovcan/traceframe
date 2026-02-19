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
  Arctic: { mode: 'light', theme: 'arctic' },
  'Arctic Dark': { mode: 'dark', theme: 'arctic' },
  Forge: { mode: 'light', theme: 'forge' },
  'Forge Dark': { mode: 'dark', theme: 'forge' },
  Mist: { mode: 'light', theme: 'mist' },
  'Mist Dark': { mode: 'dark', theme: 'mist' },
  Aura: { mode: 'light', theme: 'aura' },
  'Aura Dark': { mode: 'dark', theme: 'aura' },
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
      {children}
    </ThemeProvider>
  )
}
