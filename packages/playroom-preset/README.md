# @nejcjelovcan/traceframe-playroom-preset

Playroom preset for Traceframe. Provides a config factory that sets up a complete Playroom environment with all Traceframe components, 100+ snippets, theme switching, and pre-configured webpack rules.

## Install

```bash
npm install -D @nejcjelovcan/traceframe-playroom-preset playroom
```

**Peer dependencies:** `playroom@^1`, `react@^19`, `react-dom@^19`

## Quick Start

```javascript
// playroom.config.cjs
const { createPlayroomConfig } = require('@nejcjelovcan/traceframe-playroom-preset')

module.exports = createPlayroomConfig({
  title: 'My Playroom',
})
```

```bash
npx playroom start
```

This gives you a fully working Playroom with all Traceframe components in scope, a snippet library, and a theme switcher.

## Configuration

`createPlayroomConfig(options)` accepts the following options:

| Option            | Type       | Default                             | Description                                              |
| ----------------- | ---------- | ----------------------------------- | -------------------------------------------------------- |
| `components`      | `string`   | Preset's components                 | Path to a module exporting components for Playroom scope |
| `snippets`        | `string`   | Preset's snippets                   | Path to a module default-exporting snippet array         |
| `outputPath`      | `string`   | `'./dist/playroom'`                 | Build output directory                                   |
| `baseUrl`         | `string`   | `'/'`                               | Base URL for serving Playroom                            |
| `title`           | `string`   | `'Playroom'`                        | Page title                                               |
| `port`            | `number`   | `9000`                              | Dev server port                                          |
| `widths`          | `number[]` | `[320, 768, 1024, 1440]`            | Viewport widths                                          |
| `typeScriptFiles` | `string[]` | `[]`                                | Additional TypeScript file patterns for autocomplete     |
| `iframeSandbox`   | `string`   | `'allow-scripts allow-same-origin'` | Iframe sandbox attribute                                 |

## What's Included

### Components

By default, all components from `@nejcjelovcan/traceframe-ui-library` are available in the Playroom editor: Badge, Button, Card, Container, Collapsible, DataTable, EmptyState, ErrorState, Grid, Heading, Icon, Input, Link, Navigation, PageLayout, SearchInput, Select, Spinner, Stack, StatCard, ToggleGroup, Tooltip, and more.

### Snippets

100+ pre-made snippets organized into 22 component groups. Each snippet is a ready-to-use JSX example demonstrating component variants and composition patterns.

### Themes

Six theme variants available in the Playroom toolbar:

- Dusk Light / Dusk Dark
- Arctic Light / Arctic Dark
- Ember Light / Ember Dark

### Webpack Configuration

The preset bundles and configures all webpack loaders needed for TypeScript and CSS processing. Consumers do **not** need to install babel-loader, style-loader, css-loader, or postcss-loader -- the preset handles resolution via `require.resolve()` for pnpm compatibility.

## Adding Custom Components

To add your own components alongside the Traceframe library:

**1. Create a components file:**

```typescript
// src/playroom/components.ts
export * from '@nejcjelovcan/traceframe-playroom-preset/components'
export { MyComponent } from '../components/MyComponent'
```

**2. Point the config to it:**

```javascript
// playroom.config.cjs
const { createPlayroomConfig } = require('@nejcjelovcan/traceframe-playroom-preset')
const path = require('path')

module.exports = createPlayroomConfig({
  components: path.join(__dirname, 'src/playroom/components.ts'),
})
```

## Adding Custom Snippets

To extend the built-in snippets with your own:

```typescript
// src/playroom/snippets.ts
import presetSnippets from '@nejcjelovcan/traceframe-playroom-preset/snippets'
import type { Snippet } from '@nejcjelovcan/traceframe-playroom-preset/snippets/types'

const customSnippets: Snippet[] = [
  {
    group: 'MyComponent',
    name: 'Default',
    code: '<MyComponent variant="primary">Hello</MyComponent>',
  },
]

export default [...presetSnippets, ...customSnippets]
```

```javascript
// playroom.config.cjs
const { createPlayroomConfig } = require('@nejcjelovcan/traceframe-playroom-preset')
const path = require('path')

module.exports = createPlayroomConfig({
  snippets: path.join(__dirname, 'src/playroom/snippets.ts'),
})
```

## Exports

| Subpath             | Description                                 |
| ------------------- | ------------------------------------------- |
| `.`                 | `createPlayroomConfig()` factory (CJS)      |
| `./components`      | Re-exports all ui-library components        |
| `./themes`          | Theme definitions for Playroom              |
| `./frame-component` | ThemeProvider wrapper for Playroom frames   |
| `./snippets`        | Default export of all snippet arrays        |
| `./snippets/types`  | `Snippet` type for creating custom snippets |
