import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import React from 'react'

import { ThemeProvider } from '../src/components/ThemeProvider'
import '../src/fonts'
import '../src/styles/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        'Dusk Light': 'dusk light',
        'Dusk Dark': 'dusk dark',
        'Arctic Light': 'arctic light',
        'Arctic Dark': 'arctic dark',
        'Ember Light': 'ember light',
        'Ember Dark': 'ember dark',
        'Forge Light': 'forge light',
        'Forge Dark': 'forge dark',
      },
      defaultTheme: 'Dusk Light',
      parentSelector: 'html',
    }),
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default preview
