# @nejcjelovcan/traceframe-ui-library

Shared React component library for Traceframe applications.

## Overview

This package provides reusable UI components built with:

- React 19
- TypeScript
- Tailwind CSS
- Class Variance Authority (CVA)
- Tabler Icons
- **Radix UI Primitives** (for complex behavioral components)

Components are developed and documented using Storybook.

## Architecture: Two-Tier Component System

This library uses a **two-tier approach** for components:

### Tier 1: Simple Components (Tailwind + CVA)

For visual components without complex behavior:

- Button, Badge, Card, Container, Grid, Stack, etc.
- Built with just Tailwind CSS + CVA for variants
- Full control over styling, minimal dependencies

### Tier 2: Behavioral Components (Radix UI Primitives)

For components requiring complex interactions:

- **Tooltip**, Dialog, Popover, Dropdown Menu, Select, etc.
- Built on [Radix UI Primitives](https://www.radix-ui.com/primitives)
- Radix handles: positioning, collision detection, focus management, keyboard navigation, accessibility
- We add: styling with Tailwind + CVA

**Why Radix?**

- Battle-tested accessibility (WAI-ARIA compliant)
- Collision detection (auto-repositioning near viewport edges)
- Touch device support
- Keyboard navigation
- Less code to maintain (~50 lines vs ~300 lines for Tooltip)
- Used by thousands of production apps

**When to use Radix:**

- Component needs positioning logic (tooltips, popovers, dropdowns)
- Component needs focus trapping (modals, dialogs)
- Component needs complex keyboard interactions
- Component has ARIA requirements beyond basic attributes

## Install

```bash
npm install @nejcjelovcan/traceframe-ui-library
```

**Peer dependencies:** `react@^19`, `react-dom@^19`

> Packages are published to GitHub Packages. Add `@nejcjelovcan:registry=https://npm.pkg.github.com` to your `.npmrc`.

## Consumer Setup

### 1. Configure Tailwind

The library exports a Tailwind preset with all design tokens (colors, typography, spacing, sizing, shadows, animations, dark mode):

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import traceframePreset from '@nejcjelovcan/traceframe-ui-library/tailwind-preset'

const config: Config = {
  presets: [traceframePreset],
  content: [
    './src/**/*.{ts,tsx}',
    // CRITICAL: Include ui-library dist so Tailwind generates classes used by components
    './node_modules/@nejcjelovcan/traceframe-ui-library/dist/**/*.js',
  ],
}

export default config
```

### 2. Import Fonts and Styles

In your app entry point (e.g., `main.tsx`):

```typescript
import '@nejcjelovcan/traceframe-ui-library/fonts'
import '@nejcjelovcan/traceframe-ui-library/styles.css'
import './index.css' // Your Tailwind CSS entry (@tailwind base/components/utilities)
```

The `fonts` import loads variable web fonts (IBM Plex Sans, Inter, Space Grotesk, IBM Plex Mono, JetBrains Mono, Space Mono). The `styles.css` import loads all design token CSS variables and Tailwind utilities.

### 3. Wrap with ThemeProvider

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

### 4. Use Components

```tsx
import { Button, Icon, Badge } from '@nejcjelovcan/traceframe-ui-library'

;<Button variant="primary" size="md">
  <Icon name="search" size="sm" />
  Search
</Button>
```

### Exports

| Subpath             | Description                                     |
| ------------------- | ----------------------------------------------- |
| `.`                 | All components, utilities, types                |
| `./fonts`           | Side-effect import that loads web fonts         |
| `./styles.css`      | Compiled CSS with tokens and Tailwind utilities |
| `./tailwind-preset` | Tailwind preset with all design tokens          |

## Local Development

```bash
pnpm install
pnpm storybook    # Start Storybook dev server
pnpm build        # Build the library
pnpm test         # Run tests
```

## Components

| Category   | Components                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Primitives | `Badge`, `Button`, `Card` (+ `CardHeader`, `CardContent`, `CardFooter`), `Heading`, `Input`, `Link`, `Spinner` |
| Layout     | `Container`, `Grid`, `Stack`, `PageLayout` (+ `PageHeader`)                                                    |
| Data       | `DataTable`, `BarChart`, `StatCard`                                                                            |
| Feedback   | `EmptyState`, `ErrorState`                                                                                     |
| Selection  | `Select`, `SearchInput`, `ToggleGroup`                                                                         |
| Behavioral | `Collapsible` (+ trigger/content/header), `Tooltip` (+ provider/trigger/content), `Navigation` (+ `NavItem`)   |
| Theme      | `ThemeProvider`, `ModeSwitcher`, `ThemeSwitcher`                                                               |
| Icons      | `Icon` (+ `getAllIconNames`, `getIconsByCategory`, `searchIcons`)                                              |
| Utilities  | `cn` (class merging), `applyMode`, `applyTheme`, `MODES`, `THEMES`                                             |

Browse all components interactively in [Storybook](https://nejcjelovcan.github.io/traceframe/storybook/).

## Storybook

**Live:** [nejcjelovcan.github.io/traceframe/storybook](https://nejcjelovcan.github.io/traceframe/storybook/)

Run locally:

```bash
pnpm storybook           # Dev server at http://localhost:6006
pnpm build-storybook     # Build static version to storybook-static/
```

To add Traceframe theme switching to your own Storybook, see [`@nejcjelovcan/traceframe-storybook-preset`](../storybook-preset).

## Design Tokens

Design tokens are managed via Style Dictionary and generated from source definitions in `tokens/`.

### Token Architecture

```
tokens/
├── palettes/           # Color palettes (dusk, arctic)
│   └── *.json          # 6 semantic + 5 accent palettes, 11 shades each
├── semantic/           # Theme-aware semantic color tokens
│   ├── light.json      # Light theme (surface, foreground, border, etc.)
│   └── dark.json       # Dark theme
└── themes/             # Complete theme definitions
    └── *.json          # Fonts, font sizes, shadows, radii, sizing, spacing + palette reference
```

### Theming System

The token system has three layers:

1. **Palettes** (`palettes/`) - Raw color definitions with 11 shades per color
2. **Semantic tokens** (`semantic/`) - Theme-aware color mappings that reference palette values; enable light/dark mode switching
3. **Themes** (`themes/`) - Non-color tokens (typography, sizing, spacing, shadows, radii) that reference semantic color variables

Themes reference **semantic** color variables (not palettes directly), enabling:

- Swapping theme + palette combinations freely
- Light/dark mode through semantic token changes
- Automatic color adaptation in shadows and other theme values

**Important:** Each theme should customize ALL token categories to create a distinct visual identity - not just colors. A "warm" theme might use larger radii and looser spacing, while a "data-focused" theme might use tighter spacing and sharper corners.

Each theme file (`themes/*.json`) defines non-color tokens and declares its associated palette:

```json
{
  "$palette": "dusk",
  "$description": "Moody, sophisticated theme...",
  "fontFamily": { "sans": {...}, "mono": {...} },
  "fontSize": { "xs": {...}, "sm": {...}, ... },
  "shadow": { "sm": {...}, "md": {...}, "lg": {...} },
  "borderRadius": { "sm": {...}, "md": {...}, "lg": {...} },
  "size": { "xs": {...}, "sm": {...}, "md": {...}, "lg": {...}, "xl": {...} },
  "spacing": { "2xs": {...}, "xs": {...}, "sm": {...}, "md": {...}, "base": {...}, ... }
}
```

### Token Generation

```bash
# Regenerate tokens after editing source files
pnpm generate:tokens

# Validate token consistency across files
pnpm validate:token-definitions
```

### Using Tokens in Components

```tsx
// Semantic tokens (theme-aware, preferred)
<div className="bg-surface text-foreground border-border" />
<button className="bg-interactive-primary hover:bg-interactive-primary-hover" />
<span className="text-status-error-foreground bg-status-error-muted" />

// Palette colors (direct shade reference)
<div className="bg-primary-500 text-neutral-50" />
```

### Token Categories

**Semantic Color Tokens** (theme-aware, light/dark):

| Category    | Examples                                     | Usage                 |
| ----------- | -------------------------------------------- | --------------------- |
| Surface     | `surface`, `surface-muted`, `surface-subtle` | Background colors     |
| Foreground  | `foreground`, `foreground-muted`             | Text colors           |
| Border      | `border`, `border-muted`                     | Border colors         |
| Interactive | `interactive-primary`, `interactive-hover`   | Buttons, links        |
| Status      | `status-error`, `status-success`             | Alerts, feedback      |
| Accent      | `accent-1` to `accent-5`                     | UI highlights, badges |

**Theme Tokens** (from active theme):

| Category      | Tokens                                   | Usage                        |
| ------------- | ---------------------------------------- | ---------------------------- |
| Font Family   | `font-sans`, `font-mono`                 | Typography                   |
| Font Size     | `text-xs` to `text-4xl`                  | Text sizing with line-height |
| Border Radius | `rounded-sm`, `rounded-md`, `rounded-lg` | Corner rounding              |
| Shadow        | `shadow-sm`, `shadow-md`, `shadow-lg`    | Elevation                    |
| Sizing        | `h-size-xs` to `h-size-xl`               | Element heights/widths       |
| Spacing       | `spacing-2xs` to `spacing-2xl`           | Margins, padding, gaps       |

### Full Documentation

See [STYLE_DICTIONARY.md](./STYLE_DICTIONARY.md) for:

- Complete token system architecture
- How to add new tokens or palettes
- Build pipeline details
- Troubleshooting guide

## Icons

This library provides a standardized icon system built on [Tabler Icons](https://tabler.io/icons). Icons are accessed through a type-safe `Icon` component with semantic naming.

### Quick Start

```tsx
import { Icon } from '@nejcjelovcan/traceframe-ui-library'

<Icon name="search" />
<Icon name="package" size="lg" />
<Icon name="alert-circle" className="text-error-500" />
```

### Size Presets

| Size  | Pixels | Use Case        |
| ----- | ------ | --------------- |
| `xs`  | 12     | Inline badges   |
| `sm`  | 16     | Buttons, inline |
| `md`  | 20     | Default         |
| `lg`  | 24     | Headers         |
| `xl`  | 32     | Features        |
| `2xl` | 48     | Empty states    |

### Full Documentation

See [ICONS.md](./ICONS.md) for:

- Complete icon reference by category
- Accessibility guidelines
- How to add new icons
- Programmatic access utilities

### Storybook

View all icons interactively in Storybook at **Icons > Icon**.

## Patterns

### CVA for Variants

Components use Class Variance Authority for type-safe variants:

```tsx
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      primary: 'primary-classes',
      secondary: 'secondary-classes',
    },
    size: {
      sm: 'small-classes',
      md: 'medium-classes',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
```

### cn Utility

The `cn` utility combines clsx and tailwind-merge:

```tsx
import { cn } from '@nejcjelovcan/traceframe-ui-library'

cn('px-2', 'px-4') // 'px-4' (merge handles conflicts)
cn('base', condition && 'conditional') // conditional classes
```

## Development

### Adding a Component

1. Create component file: `src/components/NewComponent.tsx`
2. Add colocated tests: `src/components/NewComponent.test.tsx`
3. Add stories: `src/components/NewComponent.stories.tsx`
4. Export from `src/index.ts`

**Note:** Components use a flat file structure (no nested folders, no barrel files).

### Testing

Tests use Vitest with Testing Library:

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:ci

# Watch mode (during development)
pnpm vitest
```

### Code Quality

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
```

## File Structure

```
packages/ui-library/
├── src/
│   ├── index.ts              # Main entry point
│   ├── components/           # Flat component files (no nested folders)
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.stories.tsx
│   ├── styles/
│   │   └── index.css         # Tailwind entry
│   └── utils/
│       ├── cn.ts
│       └── cn.test.ts
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

## Dependencies

All runtime dependencies are bundled -- consumers only need to install peer dependencies.

**Peer:** `react@^19`, `react-dom@^19`

**Bundled runtime:** Radix UI primitives (collapsible, select, toggle-group, tooltip), Tabler Icons, TanStack Virtual, CVA, clsx, tailwind-merge, Fontsource variable fonts
