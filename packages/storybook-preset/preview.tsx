import { withThemeByClassName } from '@storybook/addon-themes'
import React from 'react'
import 'virtual:traceframe-fonts'

import { ThemeProvider } from '@nejcjelovcan/traceframe-ui-library'
import '@nejcjelovcan/traceframe-ui-library/styles.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decorators: readonly any[] = [
  withThemeByClassName({
    themes: {
      'Arctic Light': 'arctic light',
      'Arctic Dark': 'arctic dark',
      'Forge Light': 'forge light',
      'Forge Dark': 'forge dark',
      'Mist Light': 'mist light',
      'Mist Dark': 'mist dark',
    },
    defaultTheme: 'Arctic Light',
    parentSelector: 'html',
  }),
  (Story: React.ComponentType) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
]
