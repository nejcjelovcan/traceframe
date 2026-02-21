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

### 1. Import Fonts and Styles

In your app entry point (e.g., `main.tsx`):

```typescript
import '@nejcjelovcan/traceframe-ui-library/fonts'
import '@nejcjelovcan/traceframe-ui-library/styles.css'
import './index.css' // Your Tailwind CSS entry
```

The `fonts` import loads variable web fonts (IBM Plex Sans, Inter, Space Grotesk, IBM Plex Mono, JetBrains Mono, Space Mono). The `styles.css` import loads all design token CSS variables and Tailwind utilities.

For Tailwind v4 consumers, you can also import the theme registration CSS to get all design tokens registered:

```css
@import '@nejcjelovcan/traceframe-ui-library/theme.css';
```

### 2. Configure Vite (Optional)

The library provides a Vite plugin for automatic font source configuration:

```typescript
// vite.config.ts
import { traceframeVitePlugin } from '@nejcjelovcan/traceframe-ui-library/vite-plugin'

export default defineConfig({
  plugins: [traceframeVitePlugin()],
})
```

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

| Subpath         | Description                                              |
| --------------- | -------------------------------------------------------- |
| `.`             | All components, utilities, types                         |
| `./fonts`       | Side-effect import that loads web fonts                  |
| `./styles.css`  | Compiled CSS with tokens and Tailwind utilities          |
| `./theme.css`   | Tailwind v4 theme registration CSS (design token @theme) |
| `./vite-plugin` | Vite plugin for font source configuration                |
| `./utils/color` | OKLCH color utilities (parse, mix, scale, convert)       |

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
| Data       | `DataTable`, `BarChart`, `StatCard`, `LogView` (+ `LogEntry`, `LogPrompt`)                                     |
| Feedback   | `EmptyState`, `ErrorState`                                                                                     |
| Selection  | `Select`, `SearchInput`, `ToggleGroup`                                                                         |
| Behavioral | `Collapsible` (+ trigger/content/header), `Tooltip` (+ provider/trigger/content), `Navigation` (+ `NavItem`)   |
| Theme      | `ThemeProvider`, `ModeSwitcher`, `ThemeSwitcher`                                                               |
| Icons      | `Icon` (+ `getAllIconNames`, `getIconsByCategory`, `searchIcons`)                                              |
| Utilities  | `cn` (class merging), `applyMode`, `applyTheme`, `MODES`, `THEMES`                                             |

Browse all components interactively in [Storybook](https://nejcjelovcan.github.io/traceframe/).

## Storybook

**Live:** [nejcjelovcan.github.io/traceframe/storybook](https://nejcjelovcan.github.io/traceframe/)

Run locally:

```bash
pnpm storybook           # Dev server at http://localhost:6006
pnpm build-storybook     # Build static version to storybook-static/
```

To add Traceframe theme switching to your own Storybook, see [`@nejcjelovcan/traceframe-storybook-preset`](../storybook-preset).

## Design Tokens

Design tokens are defined directly in CSS files using CSS variables, with Tailwind v4 generating utility classes via the `@theme inline` directive.

### Token Architecture

```
src/styles/tokens/
├── palettes/           # Color palettes in OKLCH (dusk, arctic, ember)
│   └── *.css           # Palette color CSS variables (OKLCH values)
├── modes/              # Light/dark mode semantic tokens
│   ├── light.css       # Light mode mappings
│   └── dark.css        # Dark mode mappings
├── themes/             # Complete theme definitions
│   └── *.css           # Typography, spacing, shadows, borders
└── theme-registration.css  # Tailwind v4 @theme inline registration
```

### Theming System

The token system has three layers:

1. **Palettes** (`palettes/`) - Raw color definitions in OKLCH color space with 11 shades per color, defined as CSS variables (see [OKLCH.md](./OKLCH.md))
2. **Semantic tokens** (`modes/`) - Theme-aware color mappings that reference palette values via `var()`; enable light/dark mode switching through `:root.light` and `:root.dark` selectors
3. **Themes** (`themes/`) - Non-color tokens (typography, sizing, spacing, shadows, border styles, radii) that apply via theme class selectors (e.g., `:root.dusk`)

CSS files are now the source of truth, with tokens cascading through:

- `:root` - Base token definitions
- `:root.light` / `:root.dark` - Mode-specific semantic color mappings
- `:root.dusk` / `:root.arctic` / `:root.ember` - Theme-specific values

The `theme-registration.css` file registers all tokens with Tailwind v4's `@theme inline` directive, which generates utility classes for each token.

**Important:** Each theme should customize ALL token categories to create a distinct visual identity - not just colors. A "warm" theme might use larger radii and looser spacing, while a "data-focused" theme might use tighter spacing and sharper corners.

Each theme file (`themes/*.css`) defines non-color tokens using CSS variables:

```css
@layer base {
  :root.dusk {
    /* Typography */
    --token-font-sans: 'Inter Variable', Inter, system-ui, sans-serif;
    --token-font-mono: 'JetBrains Mono', Menlo, monospace;

    /* Shadows (using color-mix for theme-aware shadows) */
    --token-shadow-sm: 0 1px 3px 0 color-mix(in srgb, var(--token-shadow-color) 8%, transparent);
    --token-shadow-md: 0 4px 8px -1px color-mix(in srgb, var(--token-shadow-color) 12%, transparent);

    /* Border styles */
    --token-border-style-line: 1px solid;
    --token-border-style-thick: 2px solid;
    --token-border-style-highlight: 2px dashed;

    /* Border radius */
    --token-radius-sm: 0.25rem;
    --token-radius-md: 0.5rem;
    --token-radius-lg: 0.75rem;

    /* Spacing (semantic scale) */
    --token-spacing-xs: 0.25rem;
    --token-spacing-sm: 0.5rem;
    --token-spacing-md: 0.75rem;
    /* ... */
  }
}
```

### Working with Tokens

```bash
# Validate token consistency across CSS files
pnpm validate:token-definitions

# Tokens are consumed directly from CSS - no build step required
# Tailwind v4 reads theme-registration.css to generate utility classes
```

#### Adding New Tokens

1. Add the CSS variable to the appropriate file:
   - Palette colors: `src/styles/tokens/palettes/*.css`
   - Semantic mappings: `src/styles/tokens/modes/{light,dark}.css`
   - Theme values: `src/styles/tokens/themes/*.css`
2. Register the token in `theme-registration.css` if creating a new semantic token
3. Update TypeScript metadata in `src/styles/token-metadata.ts` for MCP tool support

### Using Tokens in Components

```tsx
// Semantic tokens (theme-aware, preferred)
<div className="bg-surface text-foreground border-border" />
<button className="bg-interactive-primary hover:bg-interactive-primary-hover" />
<span className="text-status-error-foreground bg-status-error-muted" />

// Palette colors (direct shade reference)
<div className="bg-primary-500 text-neutral-50" />

// Shadow tokens (interactive states)
<div className="shadow-interactive hover:shadow-interactive-hover active:shadow-interactive-pressed transition-shadow" />

// Border style tokens
<div className="border-line" />
<div className="border-thick" />
<div className="border-line-status-error-border" />

// Gradient tokens (strong for buttons, light for cards)
<button className="bg-gradient-primary text-foreground-filled" />
<div className="bg-gradient-status-info-light" />
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

| Category      | Tokens                                                                                             | Usage                                     |
| ------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Font Family   | `font-sans`, `font-mono`                                                                           | Typography                                |
| Font Size     | `text-xs` to `text-4xl`                                                                            | Text sizing with line-height              |
| Border Radius | `rounded-sm` (4px), `rounded-md` (6px, default), `rounded-lg` (8px), `rounded-xl` (12px)           | Corner rounding                           |
| Shadow        | `shadow-sm`, `shadow-md`, `shadow-lg`                                                              | Static elevation                          |
| Shadow        | `shadow-interactive`, `shadow-interactive-hover`, `shadow-interactive-pressed`                     | Interactive element shadow states         |
| Shadow        | `shadow-inset-sm`, `shadow-inset-md`, `shadow-inset-underline`                                     | Inset shadows for pressed/active states   |
| Text Shadow   | `text-shadow-light`, `text-shadow-dark`, `text-shadow-none`                                        | Text readability on mid-tone backgrounds  |
| Border Style  | `border-line`, `border-thick`, `border-highlight`                                                  | Composite border styles (width + pattern) |
| Gradient      | `bg-gradient-primary`, `bg-gradient-status-*`, `bg-gradient-accent-*`, plus `-light` variants      | Background gradients for emphasis         |
| Sizing        | `h-size-xs` (24px), `h-size-sm` (32px), `h-size-md` (40px), `h-size-lg` (48px), `h-size-xl` (56px) | Element heights/widths (buttons, inputs)  |
| Spacing       | `spacing-2xs` to `spacing-2xl`                                                                     | Margins, padding, gaps                    |

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
├── postcss.config.js
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

## Dependencies

All runtime dependencies are bundled -- consumers only need to install peer dependencies.

**Peer:** `react@^19`, `react-dom@^19`

**Bundled runtime:** Radix UI primitives (collapsible, select, slot, toggle-group, tooltip), Tabler Icons, TanStack Virtual, CVA, clsx, tailwind-merge, Fontsource variable fonts
