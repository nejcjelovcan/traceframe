# Creating a New Theme

This guide walks through creating a new visual identity for the ui-library design system.

## Understanding the Architecture

The token system has three layers:

```
┌─────────────────────────────────────────────────────────────┐
│  THEME (themes/*.json)                                      │
│  Typography, shadows, radii, spacing                        │
│  References semantic colors (e.g., --color-shadow)          │
│  Declares which palette to use via $palette                 │
├─────────────────────────────────────────────────────────────┤
│  SEMANTIC TOKENS (semantic/light.json, dark.json)           │
│  surface, foreground, border, interactive, status, accent   │
│  References palette colors                                  │
│  Enables light/dark mode switching                          │
├─────────────────────────────────────────────────────────────┤
│  PALETTE (palettes/*.json)                                  │
│  Raw color values: primary, secondary, neutral, etc.        │
│  11 shades each (50-950)                                    │
│  Defined in OKLCH, stored as space-separated RGB            │
└─────────────────────────────────────────────────────────────┘
```

**Key insight**: Themes reference semantic variables, not palettes directly. This allows:

- Swapping theme + palette combinations
- Light/dark mode through semantic token changes
- Automatic adaptation in shadows and borders

## Step 1: Define Your Theme Concept

Before touching code, establish your theme's identity.

### Questions to Answer

1. **What mood does it evoke?**
   - Serene: calm, contemplative, understated
   - Dusk: moody, sophisticated, dramatic
   - Playful: vibrant, energetic, joyful

2. **What is the target context?**
   - Professional tools vs consumer apps
   - Data-heavy dashboards vs marketing sites
   - Accessibility requirements

3. **What are the key visual characteristics?**
   - Color temperature (warm/cool)
   - Contrast level (subtle/bold)
   - Corner treatment (sharp/rounded)
   - Shadow depth (flat/elevated)

### Example Theme Concepts

| Theme   | Mood                  | Colors              | Corners    | Shadows       |
| ------- | --------------------- | ------------------- | ---------- | ------------- |
| Serene  | Calm, mindful         | Low chroma, cool    | Gentle     | Very subtle   |
| Dusk    | Dramatic, mysterious  | Medium chroma, deep | Medium     | Deeper        |
| Playful | Energetic, delightful | High chroma, warm   | Very round | Light, bouncy |

## Step 2: Create the Color Palette

### Understanding OKLCH

We use [OKLCH](https://oklch.com/) for perceptually uniform colors:

```
oklch(L C H)
      │ │ │
      │ │ └── Hue: 0-360 (color wheel position)
      │ └──── Chroma: 0-0.4 (saturation/vividness)
      └────── Lightness: 0-1 (dark to light)
```

**Why OKLCH?**

- Perceptually uniform: equal steps feel equal
- Predictable lightness: same L = same perceived brightness
- Easy to create harmonious palettes

### Palette Structure

Each palette needs these color groups:

| Group     | Purpose                        | Typical Hue Range |
| --------- | ------------------------------ | ----------------- |
| primary   | Brand, CTAs, focus states      | Your brand color  |
| secondary | Alternative actions, accents   | Complement/analog |
| neutral   | Text, backgrounds, borders     | Desaturated       |
| success   | Positive feedback              | 140-170 (green)   |
| warning   | Caution, attention             | 30-50 (orange)    |
| error     | Errors, destructive actions    | 0-20 (red)        |
| accent-1  | Data visualization, categories | Varies            |
| accent-2  | Data visualization, categories | Varies            |
| accent-3  | Data visualization, categories | Varies            |
| accent-4  | Data visualization, categories | Varies            |
| accent-5  | Data visualization, categories | Varies            |

### Shade Scale

Each color needs 11 shades with consistent lightness steps:

| Shade | Lightness | Typical Use                     |
| ----- | --------- | ------------------------------- |
| 50    | 0.98      | Lightest backgrounds            |
| 100   | 0.95      | Subtle backgrounds              |
| 200   | 0.90      | Hover states, light fills       |
| 300   | 0.82      | Borders on light backgrounds    |
| 400   | 0.70      | Muted text, secondary elements  |
| 500   | 0.58      | **Base color** - buttons, links |
| 600   | 0.48      | Hover states on base            |
| 700   | 0.38      | Active/pressed states           |
| 800   | 0.28      | Dark text alternatives          |
| 900   | 0.20      | Very dark, near-black           |
| 950   | 0.10      | Darkest shade                   |

### Chroma Guidelines by Theme Mood

| Mood         | Chroma Range | Effect                |
| ------------ | ------------ | --------------------- |
| Serene       | 0.04-0.10    | Muted, calming        |
| Professional | 0.08-0.12    | Balanced, trustworthy |
| Dusk         | 0.12-0.15    | Rich, sophisticated   |
| Playful      | 0.14-0.18    | Vibrant, energetic    |

### Creating a Palette File

1. **Choose your primary hue** based on brand or mood
2. **Set chroma** based on energy level
3. **Generate all shades** using consistent lightness steps
4. **Convert to RGB** for Tailwind alpha channel support

Example workflow using [oklch.com](https://oklch.com/):

```
1. Start with base color: oklch(0.58 0.14 260) → deep purple
2. Generate shade 50:     oklch(0.98 0.07 260) → near white with hint
3. Generate shade 950:    oklch(0.10 0.08 260) → near black with hint
4. Fill in between following the lightness table
5. Convert each to RGB: "119 88 200" (space-separated)
```

### Palette File Structure

Create `tokens/palettes/yourtheme.json`:

```json
{
  "palette": {
    "surface": {
      "$value": "255 255 255",
      "$type": "color",
      "$description": "Surface color used for backgrounds and containers"
    },
    "primary": {
      "50": {
        "$value": "246 244 255",
        "$type": "color",
        "$description": "Lightest primary shade - oklch(0.98 0.07 260)"
      },
      "500": {
        "$value": "119 88 200",
        "$type": "color",
        "$description": "Base primary - oklch(0.58 0.14 260)"
      }
      // ... all 11 shades
    },
    "secondary": {
      /* ... */
    },
    "neutral": {
      /* ... */
    },
    "success": {
      /* ... */
    },
    "warning": {
      /* ... */
    },
    "error": {
      /* ... */
    },
    "accent": {
      "1": {
        /* ... */
      },
      "2": {
        /* ... */
      },
      "3": {
        /* ... */
      },
      "4": {
        /* ... */
      },
      "5": {
        /* ... */
      }
    }
  }
}
```

### Tips for Neutral Colors

Neutrals should have a slight hue tint that complements your primary:

| Primary Hue  | Neutral Hue | Effect           |
| ------------ | ----------- | ---------------- |
| Blue (220)   | 220-240     | Cool, tech feel  |
| Purple (260) | 260-280     | Sophisticated    |
| Orange (30)  | 30-40       | Warm, friendly   |
| Green (140)  | 140-160     | Natural, organic |

Keep neutral chroma very low (0.008-0.02) so colors don't compete.

## Step 3: Define Typography

### Font Families

Choose fonts that match your theme's personality:

| Mood         | Sans-Serif Examples       | Characteristics       |
| ------------ | ------------------------- | --------------------- |
| Serene       | Inter, Source Sans        | Clean, neutral        |
| Professional | IBM Plex Sans, Roboto     | Trustworthy, readable |
| Playful      | Nunito, Quicksand         | Rounded, friendly     |
| Technical    | JetBrains Mono, Fira Code | Monospace, precise    |

```json
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
}
```

### Font Size Scale

The type scale should feel cohesive. We use a standard scale that works for most UIs:

| Token | Size     | Line Height | Use Case         |
| ----- | -------- | ----------- | ---------------- |
| xs    | 0.75rem  | 1rem        | Labels, captions |
| sm    | 0.875rem | 1.25rem     | Secondary text   |
| base  | 1rem     | 1.5rem      | Body text        |
| lg    | 1.125rem | 1.75rem     | Lead paragraphs  |
| xl    | 1.25rem  | 1.75rem     | Small headings   |
| 2xl   | 1.5rem   | 2rem        | Section headings |
| 3xl   | 1.875rem | 2.25rem     | Page headings    |
| 4xl   | 2.25rem  | 2.5rem      | Hero headings    |

Most themes can use this standard scale. Adjust if your font has unusual metrics.

## Step 4: Define Shadows

Shadows create depth and hierarchy. They should reference semantic colors:

```json
"shadow": {
  "sm": {
    "$value": "0 1px 3px 0 rgb(var(--color-shadow) / 0.08)",
    "$type": "shadow",
    "$description": "Small shadow for subtle elevation"
  },
  "md": {
    "$value": "0 4px 8px -1px rgb(var(--color-shadow) / 0.12), 0 2px 4px -2px rgb(var(--color-shadow) / 0.08)",
    "$type": "shadow",
    "$description": "Medium shadow for cards, dropdowns"
  },
  "lg": {
    "$value": "0 12px 20px -4px rgb(var(--color-shadow) / 0.15), 0 4px 8px -4px rgb(var(--color-shadow) / 0.1)",
    "$type": "shadow",
    "$description": "Large shadow for modals, popovers"
  }
}
```

**Important**: Use `rgb(var(--color-shadow) / opacity)` so shadows adapt to light/dark mode.

### Shadow Intensity by Theme Mood

| Mood         | sm opacity | md opacity | lg opacity | Feel          |
| ------------ | ---------- | ---------- | ---------- | ------------- |
| Serene       | 0.03       | 0.06       | 0.08       | Almost flat   |
| Professional | 0.05       | 0.10       | 0.12       | Subtle depth  |
| Dusk         | 0.08       | 0.12       | 0.15       | Dramatic      |
| Playful      | 0.04       | 0.08       | 0.10       | Light, bouncy |

## Step 5: Define Border Radius

Corner rounding affects perceived friendliness:

| Mood     | sm       | md       | lg       | Feel               |
| -------- | -------- | -------- | -------- | ------------------ |
| Sharp    | 0.125rem | 0.25rem  | 0.375rem | Technical, precise |
| Balanced | 0.25rem  | 0.375rem | 0.5rem   | Professional       |
| Gentle   | 0.375rem | 0.5rem   | 0.75rem  | Approachable       |
| Playful  | 0.5rem   | 0.75rem  | 1rem     | Friendly, soft     |

```json
"borderRadius": {
  "sm": {
    "$value": "0.25rem",
    "$type": "borderRadius",
    "$description": "Small border radius"
  },
  "md": {
    "$value": "0.375rem",
    "$type": "borderRadius",
    "$description": "Default border radius",
    "$default": true
  },
  "lg": {
    "$value": "0.5rem",
    "$type": "borderRadius",
    "$description": "Large border radius"
  }
}
```

## Step 6: Define Element Sizing

Element sizing controls the height/width of interactive elements like buttons and inputs. Themes can adjust these for different density levels (e.g., compact data-dense UIs vs touch-friendly UIs):

```json
"size": {
  "xs": { "$value": "1.5rem", "$type": "size", "$description": "Extra small (24px) - badges, compact buttons" },
  "sm": { "$value": "2rem", "$type": "size", "$description": "Small (32px) - small buttons, inputs" },
  "md": { "$value": "2.5rem", "$type": "size", "$description": "Medium (40px) - default buttons, inputs" },
  "lg": { "$value": "3rem", "$type": "size", "$description": "Large (48px) - large buttons, inputs" },
  "xl": { "$value": "3.5rem", "$type": "size", "$description": "Extra large (56px) - hero buttons" }
}
```

These generate `--size-*` CSS variables and are available in Tailwind as `h-size-sm`, `w-size-md`, etc.

## Step 7: Define Spacing

Spacing controls margins, padding, and gaps. Themes can adjust these for different density levels:

```json
"spacing": {
  "2xs": { "$value": "0.125rem", "$description": "2px - micro spacing" },
  "xs":  { "$value": "0.25rem",  "$description": "4px - icon gaps" },
  "sm":  { "$value": "0.5rem",   "$description": "8px - button padding" },
  "md":  { "$value": "0.75rem",  "$description": "12px - card padding" },
  "base": { "$value": "1rem",   "$description": "16px - component padding" },
  "lg":  { "$value": "2rem",     "$description": "32px - section gaps" },
  "xl":  { "$value": "4rem",     "$description": "64px - page sections" },
  "2xl": { "$value": "8rem",     "$description": "128px - hero sections" }
}
```

## Step 8: Assemble the Theme File

Create `tokens/themes/yourtheme.json`:

```json
{
  "$palette": "yourtheme",
  "$description": "Brief description of your theme's character and ideal use cases.",

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
    "sm": { "$value": "0 1px 3px 0 rgb(var(--color-shadow) / 0.05)", "$type": "shadow" },
    "md": {
      "$value": "0 4px 8px -1px rgb(var(--color-shadow) / 0.08), 0 2px 4px -2px rgb(var(--color-shadow) / 0.05)",
      "$type": "shadow"
    },
    "lg": {
      "$value": "0 12px 20px -4px rgb(var(--color-shadow) / 0.10), 0 4px 8px -4px rgb(var(--color-shadow) / 0.06)",
      "$type": "shadow"
    }
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

## Step 9: Register the Theme

Update `style-dictionary/config.js` to add your theme to the build:

```javascript
const themes = ['dusk', 'arctic', 'yourtheme']
```

Add a palette platform entry if needed (copy an existing one and modify).

## Step 10: Generate and Validate

```bash
# Validate token structure
pnpm validate:token-definitions

# Generate CSS and metadata
pnpm generate:tokens

# Check for errors
pnpm typecheck
```

## Step 11: Preview in Storybook

1. Run Storybook: `pnpm storybook`
2. Apply your theme's CSS
3. Review components for:
   - Color contrast (WCAG AA minimum)
   - Visual hierarchy
   - Consistency across states

## Checklist

Before finalizing your theme:

- [ ] Theme concept documented (`$description` field)
- [ ] All 6 semantic palettes defined (primary, secondary, neutral, success, warning, error)
- [ ] All 5 accent palettes defined
- [ ] All palettes have 11 shades (50-950)
- [ ] OKLCH values documented in `$description`
- [ ] RGB values are space-separated for alpha support
- [ ] Shadows use `--color-shadow` variable
- [ ] Element sizing tokens defined (xs through xl)
- [ ] Border radius values feel cohesive with mood
- [ ] Font families have appropriate fallbacks
- [ ] Validation passes
- [ ] Storybook preview looks correct

## Resources

- [OKLCH Color Picker](https://oklch.com/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Type Scale Calculator](https://typescale.com/)
- [Design Tokens Community Group Spec](https://tr.designtokens.org/format/)
