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

The preset entry point (`preset.js`) tells Storybook where to find the preview annotations:

```javascript
// preset.js
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const previewAnnotations = [path.join(__dirname, 'dist', 'preview.js')]
```

The preview module exports a `decorators` array that Storybook merges with any decorators defined in the consumer's `.storybook/preview.ts`.

## Standalone Vite Plugin

For Vite-based React apps that use Traceframe fonts without Storybook, you can use the Vite plugin directly:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { traceframeFontsPlugin } from '@nejcjelovcan/traceframe-storybook-preset/plugin'

export default defineConfig({
  plugins: [react(), traceframeFontsPlugin()],
})
```

The plugin creates a virtual module that imports all Traceframe font CSS files. You can then import this virtual module in your app:

```typescript
// main.tsx or App.tsx
import 'virtual:traceframe-fonts'
```

### TypeScript Support for Virtual Module

To avoid TypeScript errors for the virtual module, add this type declaration:

```typescript
// vite-env.d.ts or global.d.ts
declare module 'virtual:traceframe-fonts' {
  // Virtual module for font imports
}
```

## How Font Loading Works

The preset includes a Vite plugin that solves a development mode issue with @fontsource packages. When importing font CSS directly in JavaScript/TypeScript files, esbuild's pre-bundling process strips the CSS imports, causing fonts not to load in development.

The plugin works by:

1. **Resolving font packages** - Uses Node's module resolution from ui-library's perspective to find installed @fontsource packages
2. **Creating a virtual module** - Generates a `virtual:traceframe-fonts` module that imports all resolved font CSS files
3. **Bypassing esbuild** - The virtual module ensures CSS imports survive the pre-bundling process
4. **Caching resolutions** - Font paths are resolved once per dev server session for performance

### Virtual Module Pattern

The virtual module ID `virtual:traceframe-fonts` is resolved to `\0virtual:traceframe-fonts` internally (the `\0` prefix is a Rollup convention for virtual modules). When loaded, it returns import statements for all available font CSS files:

```javascript
// Generated content of virtual:traceframe-fonts
import '/path/to/@fontsource/ibm-plex-mono/index.css'
import '/path/to/@fontsource-variable/inter/index.css'
// ... more font imports
```

## Troubleshooting

### Fonts Not Loading in Development

If fonts aren't loading:

1. **Check installation** - Ensure font packages are installed in ui-library's dependencies
2. **Clear Vite cache** - Delete `node_modules/.vite` and restart the dev server
3. **Check browser console** - Look for 404 errors on font CSS files
4. **Verify imports** - Ensure `virtual:traceframe-fonts` is imported in your app

### TypeScript Errors for Virtual Module

If you see `Cannot find module 'virtual:traceframe-fonts'`:

1. Add the type declaration shown above to your `vite-env.d.ts`
2. Ensure the Vite plugin is added to your config before using the import
3. Restart your TypeScript server (in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")

### Clearing Vite Cache

Sometimes Vite's dependency cache can cause issues with font loading:

```bash
# Clear Vite's cache
rm -rf node_modules/.vite

# Restart dev server
pnpm dev
```

### Missing Font Warnings

The plugin will warn about missing font packages in the console:

```
[vite-plugin-traceframe-fonts] Missing font packages: @fontsource/space-mono. These fonts will not be loaded. Install them in ui-library to fix.
```

To resolve, install the missing packages in the ui-library package:

```bash
cd packages/ui-library
pnpm add @fontsource/space-mono
```
