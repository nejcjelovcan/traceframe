# @traceframe/ui-library

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

## Quick Start

```bash
# Install dependencies
pnpm install

# Run Storybook for development
pnpm storybook

# Build the library
pnpm build

# Run tests
pnpm test
```

## Usage

```tsx
import { Button } from '@traceframe/ui-library'
import '@traceframe/ui-library/styles.css'

function App() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  )
}
```

## Component Catalog

### Tooltip (Radix-based)

Accessible tooltip component with automatic positioning.

```tsx
import { Tooltip } from '@traceframe/ui-library'

// Wrap your app (or part of it) with TooltipProvider
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <button>Hover me</button>
    </Tooltip.Trigger>
    <Tooltip.Content>Tooltip text</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>

// Variants
<Tooltip.Content variant="default">Dark background</Tooltip.Content>
<Tooltip.Content variant="light">Light background</Tooltip.Content>

// Placement (auto-repositions on collision)
<Tooltip.Content side="top">Top</Tooltip.Content>
<Tooltip.Content side="bottom">Bottom</Tooltip.Content>
<Tooltip.Content side="left">Left</Tooltip.Content>
<Tooltip.Content side="right">Right</Tooltip.Content>

// Without arrow
<Tooltip.Content showArrow={false}>No arrow</Tooltip.Content>

// Provider delay configuration
<Tooltip.Provider delayDuration={300}>...</Tooltip.Provider>
```

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@traceframe/ui-library'

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## Storybook

Run Storybook to view and interact with components:

```bash
pnpm storybook
```

This starts a local development server at http://localhost:6006.

### Building Storybook

To build a static version of Storybook:

```bash
pnpm build-storybook
```

The output is placed in `storybook-static/`.

### Capturing Screenshots

Use the `capture_storybook_screenshots` MCP tool to capture PNG screenshots of component stories:

```
# Capture screenshots for a specific component
capture_storybook_screenshots(stories: ["src/components/Button.stories.tsx"])

# Capture all stories (not just AllVariants)
capture_storybook_screenshots(stories: ["src/components/Card.stories.tsx"], storyFilter: "")
```

Screenshots are saved to `screenshots/` in the repository root. This is useful for:

- Visual documentation in PRs
- Before/after comparisons during refactoring
- Sharing component previews without running Storybook

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
import { Icon } from '@traceframe/ui-library'

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
import { cn } from '@traceframe/ui-library'

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

### Runtime

- `@radix-ui/react-tooltip` - Tooltip primitive (behavioral foundation)
- `@tabler/icons-react` - Icon library (5,600+ icons)
- `class-variance-authority` - Type-safe component variants
- `clsx` - Conditional class names
- `tailwind-merge` - Merge Tailwind classes intelligently

> **Note:** Additional Radix packages (`@radix-ui/react-dialog`, `@radix-ui/react-popover`, etc.) will be added as we implement more behavioral components.

### Peer

- `react` - UI framework
- `react-dom` - DOM rendering

### Development

- `tailwindcss` - Utility-first CSS
- `storybook` - Component development environment
- `vitest` - Test runner
- `@testing-library/react` - Testing utilities
