# Traceframe

A design system and component library for building consistent, theme-aware React applications.

[Storybook](https://nejcjelovcan.github.io/traceframe/) | [Playroom](https://nejcjelovcan.github.io/traceframe/playroom/)

## Packages

### UI & Design System

- [`@nejcjelovcan/traceframe-ui-library`](./packages/ui-library) -- Core UI components, design tokens, and Tailwind preset
- [`@nejcjelovcan/traceframe-storybook-preset`](./packages/storybook-preset) -- Storybook addon for Traceframe theme switching
- [`@nejcjelovcan/traceframe-playroom-preset`](./packages/playroom-preset) -- Playroom config factory with components and snippets
- [`@nejcjelovcan/eslint-plugin-traceframe`](./packages/eslint-plugin) -- ESLint rule enforcing semantic token usage

### MCP Servers & Utilities

- [`@nejcjelovcan/mcp-shared`](./packages/mcp-shared) -- Shared utilities for building MCP servers in pnpm/turbo monorepos
- [`@nejcjelovcan/mcp-dev`](./packages/mcp-dev) -- MCP server providing development tools (build, test, lint, typecheck, dependency management)

### Internal (not published)

- [`@nejcjelovcan/traceframe-mcp-ui`](./packages/mcp-ui) -- MCP server for UI tooling (Storybook, icons, tokens)
- [`@nejcjelovcan/traceframe-playroom`](./packages/playroom) -- Internal Playroom instance (dog-foods the playroom-preset)

## Getting Started

All packages are published to GitHub Packages. Configure your registry first:

```ini
# .npmrc
@nejcjelovcan:registry=https://npm.pkg.github.com
```

### 1. Install the UI Library

```bash
npm install @nejcjelovcan/traceframe-ui-library
```

**Peer dependencies:** `react@^19`, `react-dom@^19`

### 2. Configure Tailwind

The UI library provides a Tailwind preset with all design tokens (colors, typography, spacing, sizing, shadows, animations, dark mode).

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import traceframePreset from '@nejcjelovcan/traceframe-ui-library/tailwind-preset'

const config: Config = {
  presets: [traceframePreset],
  content: [
    './src/**/*.{ts,tsx}',
    // Include ui-library so Tailwind generates classes used by components
    './node_modules/@nejcjelovcan/traceframe-ui-library/dist/**/*.js',
  ],
}

export default config
```

### 3. Import Fonts and Styles

```typescript
// In your app entry point (e.g., main.tsx)
import '@nejcjelovcan/traceframe-ui-library/fonts'
import '@nejcjelovcan/traceframe-ui-library/styles.css'
import './index.css' // Your Tailwind CSS entry
```

### 4. Add ThemeProvider

```tsx
import { ThemeProvider } from '@nejcjelovcan/traceframe-ui-library'

function App() {
  return (
    <ThemeProvider defaultTheme="dusk" defaultMode="light">
      {/* Your app */}
    </ThemeProvider>
  )
}
```

### 5. Use Components

```tsx
import { Button, Card, Icon, Badge } from '@nejcjelovcan/traceframe-ui-library'
;<Card>
  <Card.Header>
    <Badge variant="primary">New</Badge>
  </Card.Header>
  <Card.Content>
    <Button variant="primary" size="md">
      <Icon name="search" size="sm" />
      Search
    </Button>
  </Card.Content>
</Card>
```

## Theming

Traceframe supports 3 color themes, each with light and dark modes:

| Theme      | Description                                         |
| ---------- | --------------------------------------------------- |
| **Dusk**   | Moody, sophisticated palette with purple-blue tones |
| **Arctic** | Cool, clean palette with icy blue tones             |
| **Ember**  | Warm, energetic palette with orange-red tones       |

Themes control more than just colors -- each theme defines its own typography (font families and sizes), spacing, border radii, and shadows to create a distinct visual identity.

### Design Tokens

The token system has three layers:

1. **Palettes** -- Raw color values in OKLCH color space (primary, secondary, neutral, success, warning, error) with 11 shades each (50--950)
2. **Semantic tokens** -- Theme-aware mappings (surface, foreground, border, interactive, status, accent) that adapt to light/dark mode
3. **Themes** -- Complete visual identity including typography, spacing, sizing, shadows, and border radii

Use semantic tokens in your components for automatic theme support:

```tsx
// Semantic tokens (recommended -- theme-aware)
<div className="bg-surface text-foreground border-border" />
<button className="bg-interactive-primary hover:bg-interactive-primary-hover" />

// Semantic spacing
<div className="gap-sm p-md" />

// Element sizing
<button className="h-size-md" />
```

See the [ui-library README](./packages/ui-library) for the full token reference.

## Storybook Preset

Add theme switching to your Storybook with one line:

```bash
npm install -D @nejcjelovcan/traceframe-storybook-preset @storybook/addon-themes
```

```typescript
// .storybook/main.ts
export default {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
    '@nejcjelovcan/traceframe-storybook-preset',
  ],
}
```

This automatically adds a theme switcher toolbar with all 6 theme variants, imports fonts and styles, and wraps stories with ThemeProvider.

See the [storybook-preset README](./packages/storybook-preset) for details.

## Playroom Preset

Set up a Playroom environment with all Traceframe components and snippets:

```bash
npm install -D @nejcjelovcan/traceframe-playroom-preset playroom
```

```javascript
// playroom.config.cjs
const { createPlayroomConfig } = require('@nejcjelovcan/traceframe-playroom-preset')

module.exports = createPlayroomConfig({
  title: 'My Playroom',
})
```

The preset provides all UI components in scope, 100+ component snippets, theme switching, and a complete webpack configuration -- no additional setup needed.

See the [playroom-preset README](./packages/playroom-preset) for customization options.

## ESLint Plugin

Enforce semantic token usage in your codebase:

```bash
npm install -D @nejcjelovcan/eslint-plugin-traceframe
```

```javascript
// eslint.config.js
import traceframePlugin from '@nejcjelovcan/eslint-plugin-traceframe'

export default [
  {
    plugins: { '@nejcjelovcan/traceframe': traceframePlugin },
    rules: {
      '@nejcjelovcan/traceframe/no-non-semantic-colors': 'error',
    },
  },
]
```

This catches direct palette usage like `bg-primary-500` and suggests semantic alternatives like `bg-interactive-primary`.

See the [eslint-plugin README](./packages/eslint-plugin) for configuration options.

## MCP Development Tools

The `mcp-dev` package provides an MCP server for AI assistants to interact with your pnpm/turbo monorepo:

```bash
npm install @nejcjelovcan/mcp-dev
```

Add to your Claude Code MCP configuration:

```json
{
  "mcpServers": {
    "mcp-dev": {
      "command": "npx",
      "args": ["@nejcjelovcan/mcp-dev"]
    }
  }
}
```

Available tools:

| Tool                    | Description                                   |
| ----------------------- | --------------------------------------------- |
| `autofix`               | Run lint:fix and format across the workspace  |
| `build_package`         | Build a package (with dependency resolution)  |
| `test_package`          | Run tests for a package                       |
| `test_package_coverage` | Run tests with coverage                       |
| `typecheck_package`     | Type-check a package                          |
| `lint_fix_package`      | Run lint:fix for a package                    |
| `format_package`        | Run prettier for a package                    |
| `run_single_test`       | Run a specific test file                      |
| `get_changed_packages`  | List packages affected by uncommitted changes |
| `list_package_scripts`  | List all scripts in a package's package.json  |
| `run_pnpm_script`       | Run any pnpm script for a package             |
| `pnpm_add`              | Add dependencies to a package or root         |
| `pnpm_remove`           | Remove dependencies from a package or root    |
| `pnpm_install`          | Install all workspace dependencies            |
| `pnpm_query`            | Query dependency info (list, why, outdated)   |
| `create_changeset`      | Create a changeset file non-interactively     |

For building custom MCP servers, use the shared utilities:

```bash
npm install @nejcjelovcan/mcp-shared
```

See the [mcp-dev README](./packages/mcp-dev) and [mcp-shared README](./packages/mcp-shared) for details.

## Development

### Prerequisites

- Node.js >= 20
- pnpm 9

### Setup

```bash
git clone https://github.com/nejcjelovcan/traceframe.git
cd traceframe
pnpm install
pnpm build
```

### Commands

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `pnpm build`           | Build all packages                  |
| `pnpm test`            | Run all tests                       |
| `pnpm typecheck`       | Type-check all packages             |
| `pnpm lint`            | Lint all packages                   |
| `pnpm autofix`         | Fix formatting and lint issues      |
| `pnpm storybook`       | Start Storybook dev server          |
| `pnpm playroom`        | Start Playroom dev server           |
| `pnpm validate:tokens` | Validate semantic token consistency |

### Repository Structure

```
traceframe/
├── packages/
│   ├── ui-library/         # Core components, tokens, Tailwind preset
│   ├── storybook-preset/   # Storybook theme integration addon
│   ├── playroom-preset/    # Playroom config factory + snippets
│   ├── eslint-plugin/      # Semantic token enforcement
│   ├── mcp-shared/         # Shared utilities for MCP servers
│   ├── mcp-dev/            # MCP server for dev tools (build, test, lint)
│   ├── mcp-ui/             # MCP server for UI tooling (internal)
│   └── playroom/           # Internal Playroom instance
├── CLAUDE.md               # AI agent instructions
└── package.json            # Workspace root
```

## License

MIT
