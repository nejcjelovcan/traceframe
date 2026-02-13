# Style Dictionary Setup

## Overview

Style Dictionary manages design tokens as a single source of truth in DTCG-compatible JSON format. Tokens are stored in the `tokens/` directory and transformed into CSS, TypeScript, and Tailwind configuration files.

## Directory Structure

```
packages/ui-library/
├── tokens/                           # Source token definitions (DTCG JSON)
│   ├── palettes/                     # Color palettes (11 shades each)
│   │   ├── dusk.json                 # Moody, sophisticated (source of truth)
│   │   └── arctic.json               # Clean, precise, data-focused
│   ├── semantic/                     # Theme-aware semantic tokens
│   │   ├── light.json                # Light theme (source of truth)
│   │   └── dark.json                 # Dark theme
│   └── themes/                       # Theme customizations (fonts, shadows, etc.)
│       ├── dusk.json                 # Dusk theme settings
│       └── arctic.json               # Arctic theme settings
│
├── style-dictionary/                 # Build configuration
│   ├── config.js                     # Platform definitions
│   └── formatters/                   # Custom output formatters
│       ├── css-semantic.js           # Generates semantic.*.css
│       ├── css-theme.js              # Generates theme.*.css
│       ├── css-palette.js            # Generates palette.*.css (disabled)
│       ├── ts-token-metadata.js      # Generates token-metadata.ts
│       └── json-tailwind.js          # Generates tailwind-*.json files
│
├── scripts/
│   ├── build-tokens.js               # Main token generation script
│   └── validate-token-definitions.js # Token consistency validation
│
└── src/styles/
    ├── index.css                     # Entry point - imports generated CSS
    └── generated/                    # Generated output (do not edit)
        ├── semantic.light.css        # Light theme semantic tokens
        ├── semantic.dark.css         # Dark theme semantic tokens
        ├── theme.dusk.css            # Dusk theme customizations
        ├── theme.arctic.css          # Arctic theme customizations
        ├── tailwind-colors.json      # Tailwind color configuration
        ├── tailwind-sizing.json      # Tailwind sizing configuration
        ├── tailwind-spacing.json     # Tailwind spacing configuration
        └── token-metadata.ts         # TypeScript metadata export
```

## Token Categories

### 1. Palettes (`tokens/palettes/*.json`)

Color palettes define the raw color values. Each palette contains:

- **Semantic palettes**: `primary`, `secondary`, `neutral`, `success`, `warning`, `error`
- **Presentational palettes**: `accent-1` to `accent-5`
- **11 shades each**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

All colors use space-separated RGB format for Tailwind alpha channel support:

```json
{
  "palette": {
    "primary": {
      "500": {
        "$value": "126 145 165",
        "$type": "color",
        "$description": "Base primary - oklch(0.58 0.08 215deg)"
      }
    }
  }
}
```

### 2. Semantic Tokens (`tokens/semantic/*.json`)

Theme-aware tokens that reference palette values:

- `color.surface` - Background colors (DEFAULT, muted, subtle)
- `color.foreground` - Text colors (DEFAULT, muted, inverted)
- `color.border` - Border colors (DEFAULT, muted)
- `color.ring` - Focus ring color
- `color.interactive` - Interactive states (primary, secondary, hover, active)
- `color.status` - Status indicators (error, success, warning, info with variants)
- `color.accent-*` - Accent colors for UI highlights
- `color.data-*` - Data visualization colors

Semantic tokens use references to palette values:

```json
{
  "color": {
    "surface": {
      "$value": "{palette.surface}",
      "$type": "color"
    }
  }
}
```

### 3. Themes (`tokens/themes/*.json`)

A **theme** is a complete visual identity. Each theme file defines:

- **`$palette`** - Reference to the associated color palette (e.g., "dusk", "arctic")
- **`$description`** - Human-readable description of the theme's character
- **`fontFamily`** - Sans and monospace font stacks
- **`fontSize`** - Type scale with sizes and line heights (xs through 4xl)
- **`shadow`** - Elevation system (sm, md, lg)
- **`borderRadius`** - Corner radius scale (sm, md, lg)
- **`size`** - Element sizing scale for heights/widths (xs through xl)
- **`spacing`** - Semantic spacing scale (2xs through 2xl)

Theme file structure:

```json
{
  "$palette": "dusk",
  "$description": "Moody, sophisticated theme inspired by twilight...",
  "fontFamily": {
    "sans": {
      "$value": ["Inter", "system-ui", "sans-serif"],
      "$type": "fontFamily",
      "$description": "Primary font family for body text and UI"
    },
    "mono": {
      "$value": ["JetBrains Mono", "Menlo", "monospace"],
      "$type": "fontFamily",
      "$description": "Monospace font family for code"
    }
  },
  "fontSize": {
    "xs": { "$value": "0.75rem", "$lineHeight": "1rem", "$type": "fontSize" },
    "sm": { "$value": "0.875rem", "$lineHeight": "1.25rem", "$type": "fontSize" },
    "base": { "$value": "1rem", "$lineHeight": "1.5rem", "$type": "fontSize" },
    "lg": { "$value": "1.125rem", "$lineHeight": "1.75rem", "$type": "fontSize" },
    "xl": { "$value": "1.25rem", "$lineHeight": "1.75rem", "$type": "fontSize" },
    "2xl": { "$value": "1.5rem", "$lineHeight": "2rem", "$type": "fontSize" },
    "3xl": { "$value": "1.875rem", "$lineHeight": "2.25rem", "$type": "fontSize" },
    "4xl": { "$value": "2.25rem", "$lineHeight": "2.5rem", "$type": "fontSize" }
  },
  "shadow": {
    "sm": { "$value": "...", "$type": "shadow" },
    "md": { "$value": "...", "$type": "shadow" },
    "lg": { "$value": "...", "$type": "shadow" }
  },
  "borderRadius": {
    "sm": { "$value": "0.25rem", "$type": "borderRadius" },
    "md": { "$value": "0.375rem", "$type": "borderRadius", "$default": true },
    "lg": { "$value": "0.5rem", "$type": "borderRadius" }
  },
  "size": {
    "xs": {
      "$value": "1.5rem",
      "$type": "size",
      "$description": "Extra small element size (24px)"
    },
    "sm": { "$value": "2rem", "$type": "size", "$description": "Small element size (32px)" },
    "md": { "$value": "2.5rem", "$type": "size", "$description": "Medium element size (40px)" },
    "lg": { "$value": "3rem", "$type": "size", "$description": "Large element size (48px)" },
    "xl": { "$value": "3.5rem", "$type": "size", "$description": "Extra large element size (56px)" }
  },
  "spacing": {
    "2xs": { "$value": "0.125rem", "$type": "spacing" },
    "xs": { "$value": "0.25rem", "$type": "spacing" },
    "sm": { "$value": "0.5rem", "$type": "spacing" },
    "md": { "$value": "0.75rem", "$type": "spacing" },
    "base": { "$value": "1rem", "$type": "spacing" },
    "lg": { "$value": "2rem", "$type": "spacing" },
    "xl": { "$value": "4rem", "$type": "spacing" },
    "2xl": { "$value": "8rem", "$type": "spacing" }
  }
}
```

**Architecture layers:**

1. **Palettes** - Raw color definitions (shades 50-950 for each color)
2. **Semantic tokens** - Theme-aware color mappings that reference palette values; enable light/dark mode switching
3. **Themes** - Non-color tokens (typography, spacing, shadows, radii) that reference semantic color variables (not palettes directly)

Themes reference semantic variables (e.g., `--color-shadow`) so that:

- You can swap theme + palette combinations freely
- Light/dark mode switching works through semantic token changes
- Shadow, border, and other theme values automatically adapt to the current color mode

## Build Scripts

### Generate Tokens

Runs Style Dictionary to transform source tokens into output files:

```bash
pnpm generate:tokens
```

This generates all files in `src/styles/generated/`:

- `semantic.light.css` - Light theme CSS variables
- `semantic.dark.css` - Dark theme CSS variables
- `theme.dusk.css`, `theme.arctic.css` - Theme CSS (typography, shadows, radii, sizing, spacing)
- `tailwind-colors.json` - Tailwind color configuration
- `tailwind-spacing.json` - Tailwind spacing configuration
- `tailwind-sizing.json` - Tailwind sizing configuration
- `token-metadata.ts` - TypeScript metadata for tooling

### Validate Token Definitions

Ensures consistency across token files:

```bash
pnpm validate:token-definitions
```

Validation rules:

1. **Semantic tokens**: All tokens in `light.json` must exist in `dark.json`
2. **Palette tokens**: All tokens in `dusk.json` (source of truth) must exist in all other palette files

## Token Format (DTCG)

Tokens follow the [Design Tokens Community Group specification](https://tr.designtokens.org/format/):

```json
{
  "tokenName": {
    "$value": "value",
    "$type": "color | fontFamily | shadow | borderRadius | size | spacing",
    "$description": "Optional description"
  }
}
```

Key conventions:

- `$value` - The token value (required)
- `$type` - Token type for validation and transformation
- `$description` - Documents the token purpose and OKLCH source values
- Nested objects create token hierarchies

## Custom Transforms

### `color/rgb-space-separated`

Preserves space-separated RGB values for Tailwind's alpha channel support:

```css
--color-primary-500: 126 145 165; /* Allows: bg-primary-500/50 */
```

## Custom Formatters

| Formatter                | Output                     | Description                                           |
| ------------------------ | -------------------------- | ----------------------------------------------------- |
| `css/semantic`           | `semantic.*.css`           | Semantic tokens with @layer rules                     |
| `css/theme`              | `theme.*.css`              | Theme-specific tokens (incl. sizing)                  |
| `css/palette`            | `palette.*.css`            | Palette tokens (currently unused)                     |
| `ts/token-metadata`      | `token-metadata.ts`        | TypeScript metadata export                            |
| `json/tailwind`          | `tailwind-*.json`          | Generic Tailwind JSON (colors, spacing, sizing, etc.) |
| `json/tailwind-fontsize` | `tailwind-font-sizes.json` | Tailwind font size configuration                      |

## Workflow

### After Modifying Token Definitions

1. **Edit source tokens** in `tokens/` directory
2. **Validate tokens**: `pnpm validate:token-definitions`
3. **Regenerate outputs**: `pnpm generate:tokens`
4. **Verify changes** in Storybook or application

### Creating a New Theme

A complete theme requires **both** a palette file and a theme file. Each theme should have a distinct visual identity - not just different colors.

**Required files:**

1. `tokens/palettes/<name>.json` - Color palette (11 shades for each semantic color)
2. `tokens/themes/<name>.json` - Theme tokens (fonts, spacing, shadows, radii)

**Theme customization checklist:**

| Token          | Should customize? | Guidance                                                                   |
| -------------- | ----------------- | -------------------------------------------------------------------------- |
| `$palette`     | ✅ Required       | Reference to the associated palette file                                   |
| `$description` | ✅ Required       | Describe the theme's character and ideal use cases                         |
| `fontFamily`   | ✅ Recommended    | Different fonts convey different moods (warm, professional, technical)     |
| `fontSize`     | ⚠️ Consider       | Adjust line heights for readability; larger/smaller base for accessibility |
| `shadow`       | ✅ Recommended    | Dramatic vs subtle; affects perceived depth and drama                      |
| `borderRadius` | ✅ Recommended    | Sharp vs rounded; affects perceived formality                              |
| `size`         | ⚠️ Consider       | Smaller for compact/data-dense UIs, larger for touch-friendly UIs          |
| `spacing`      | ⚠️ Consider       | Tighter for data-dense UIs, looser for content-focused UIs                 |

**Don't just copy values from another theme.** If your theme is "clean and precise", consider tighter spacing and sharper radii. If it's "warm and approachable", consider larger radii and more generous spacing.

**Steps:**

1. Create `tokens/palettes/<name>.json` using `dusk.json` as template
2. Ensure all tokens from `dusk.json` (palette source of truth) are present
3. Create `tokens/themes/<name>.json` using `dusk.json` as template
4. **Customize values** to match your theme's character (don't just copy)
5. Update `style-dictionary/config.js` to add the new theme platform
6. Run `pnpm validate:token-definitions && pnpm generate:tokens`

### Adding a New Semantic Token

1. Add the token to `tokens/semantic/light.json`
2. Add the corresponding token to `tokens/semantic/dark.json`
3. Run `pnpm validate:token-definitions` to verify
4. Run `pnpm generate:tokens` to regenerate outputs
5. Update `tailwind-preset.ts` if the token needs Tailwind classes

### Adding a New Theme Token

Theme tokens (fontFamily, fontSize, shadow, borderRadius, size, spacing) are defined in theme files:

1. Add the token to `tokens/themes/dusk.json` (source of truth for themes)
2. Add the same token to all other theme files (`arctic.json`)
3. Run `pnpm generate:tokens` to regenerate outputs
4. Update `tailwind-preset.ts` if the token needs Tailwind classes

Example - adding a new spacing token:

```json
{
  "spacing": {
    "3xl": {
      "$value": "12rem",
      "$type": "spacing",
      "$description": "Triple extra large spacing (192px) - full-page sections"
    }
  }
}
```

## Generated Output

### CSS Variables

Generated CSS uses `@layer` for proper cascade ordering:

```css
@layer base {
  :root {
    --color-surface: 248 250 252;
    --color-foreground: 15 23 42;
  }
}
```

### TypeScript Metadata

The `token-metadata.ts` export provides programmatic access to token information:

```typescript
import { TOKEN_METADATA } from './styles/generated/token-metadata'

// Access palette information
TOKEN_METADATA.palettes.primary.description
TOKEN_METADATA.palettes.primary.shades // [50, 100, 200, ...]

// Access semantic color tokens
TOKEN_METADATA.semantic.surface.variants // { DEFAULT, muted, subtle }
TOKEN_METADATA.semantic.interactive.variants // { hover, active, primary, ... }

// Access theme tokens
TOKEN_METADATA.theme.fontFamily.sans // { value, description }
TOKEN_METADATA.theme.fontSize.base // { value, lineHeight, description }
TOKEN_METADATA.theme.borderRadius.md // { value, description, isDefault }
TOKEN_METADATA.theme.shadow.lg // { value, description }
TOKEN_METADATA.theme.spacing.md // { value, description }
TOKEN_METADATA.theme.size.md // { value, description }
```

### Tailwind Colors

The `tailwind-colors.json` is imported by `tailwind.config.ts` to configure color utilities:

```typescript
import colors from './src/styles/generated/tailwind-colors.json'

export default {
  theme: {
    extend: {
      colors,
    },
  },
}
```

## Troubleshooting

### Token Reference Not Resolved

Ensure the referenced token exists in the source files included for that platform. Check `style-dictionary/config.js` for the `source` array.

### Validation Fails

The validation script will report missing or extra tokens. Common issues:

- **Missing in dark.json**: Add the token with appropriate dark theme value
- **Missing in palette**: Copy the token structure from `dusk.json`

### CSS Not Updating

1. Run `pnpm generate:tokens` to regenerate
2. Check that `src/styles/index.css` imports the generated files
3. Restart the dev server if needed
