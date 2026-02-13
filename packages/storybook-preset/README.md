# @nejcjelovcan/traceframe-storybook-preset

Storybook preset that adds Traceframe theme switching to your Storybook. Provides a toolbar dropdown to toggle between all 6 theme variants, auto-imports fonts and styles, and wraps stories with ThemeProvider.

## Install

```bash
npm install -D @nejcjelovcan/traceframe-storybook-preset @storybook/addon-themes
```

**Peer dependencies:** `@storybook/addon-themes@^8`, `react@^19`, `react-dom@^19`

## Setup

Add the preset and its peer dependency to your Storybook config:

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
    '@nejcjelovcan/traceframe-storybook-preset',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

That's it. No preview configuration needed.

## What It Does

The preset auto-registers via Storybook's `previewAnnotations` mechanism. It:

1. **Imports fonts** -- loads all Traceframe variable web fonts (IBM Plex Sans, Inter, Space Grotesk, IBM Plex Mono, JetBrains Mono, Space Mono)
2. **Imports styles** -- loads the compiled CSS with all design token variables and Tailwind utilities
3. **Adds theme switcher** -- toolbar dropdown with 6 themes using `withThemeByClassName` from `@storybook/addon-themes`
4. **Wraps with ThemeProvider** -- all stories are wrapped with Traceframe's `ThemeProvider` component

### Available Themes

| Theme        | CSS Classes    |
| ------------ | -------------- |
| Dusk Light   | `dusk light`   |
| Dusk Dark    | `dusk dark`    |
| Arctic Light | `arctic light` |
| Arctic Dark  | `arctic dark`  |
| Ember Light  | `ember light`  |
| Ember Dark   | `ember dark`   |

The default theme is **Dusk Light**. Theme classes are applied to the `<html>` element.

## Customization

If you need to extend the preset's decorators with your own, import them from the `./preview` subpath:

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react'
import { decorators as traceframeDecorators } from '@nejcjelovcan/traceframe-storybook-preset/preview'

const preview: Preview = {
  decorators: [...traceframeDecorators /* your decorators */],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
  },
}

export default preview
```

## How It Works

The preset entry point (`preset.cjs`) tells Storybook where to find the preview annotations:

```javascript
// preset.cjs
const path = require('path')
exports.previewAnnotations = [path.join(__dirname, 'dist', 'preview.js')]
```

The preview module exports a `decorators` array that Storybook merges with any decorators defined in the consumer's `.storybook/preview.ts`.
