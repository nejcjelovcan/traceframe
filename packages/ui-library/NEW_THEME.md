# Creating a New Theme

A step-by-step guide to adding a new theme to the Traceframe UI library.

## Architecture Overview

The token system has three layers that compose together:

```
Palette (colors)  +  Theme (non-color tokens)  +  Mode (light/dark semantics)
  palettes/*.css       themes/*.css                 modes/light.css, dark.css
  :root.mytheme        :root.mytheme                :root.light / :root.dark
```

Applied via CSS classes on the document root:

```html
<html class="mytheme light">
  <!-- or -->
  <html class="mytheme dark"></html>
</html>
```

**Key concepts:**

- **Palette** defines raw color variables (`--palette-*`) in OKLCH color space. Each theme has its own palette with unique hues and chroma levels.
- **Theme** defines structural tokens (`--token-*`) like typography, shadows, border radius, spacing, and sizing. These shape the theme's visual personality independent of color.
- **Mode** maps palette variables to semantic tokens (`--token-surface`, `--token-foreground`, etc.). Mode files are **shared across all themes** -- you do not create per-theme mode files.
- **Validation** uses `arctic.css` as the source of truth. Every palette and theme file must define exactly the same set of CSS custom properties as the corresponding arctic file.

## Step 1: Define Your Theme Concept

Start with a personality. The concept drives every subsequent decision:

| Decision        | Restrained (Arctic-style) | Editorial (Forge-style) | Minimal (Mist-style)   |
| --------------- | ------------------------- | ----------------------- | ---------------------- |
| Color chroma    | Low (0.02-0.10)           | Medium-low (0.04-0.10)  | Ultra-low (0.015-0.07) |
| Shadow opacity  | Subtle (3-8%)             | Moderate (5-12%)        | Minimal (3-8%)         |
| Border radius   | Sharp (0.125-0.5rem)      | In between              | Rounded (0.25-0.75rem) |
| Spacing density | Standard                  | Tight                   | Standard               |
| Font character  | Technical/neutral         | Geometric/distinctive   | Content-first/receding |

Write a short tagline and description that captures the mood. These will appear in the theme metadata.

## Step 2: Design the Palette

**File:** `src/styles/tokens/palettes/<name>.css`

A palette defines 13 color groups, each with **5 key shades** (100, 300, 500, 700, 900) as explicit OKLCH values, plus **6 derived shades** (50, 200, 400, 600, 800, 950) generated via `color-mix()`. All colors use [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) format: `oklch(lightness chroma hue)`.

### File Structure

```css
@layer base {
  /**
   * Palette: "<Name>"
   *
   * <Tagline>
   *
   * <Multi-line description of the palette character,
   * intended use cases, and design philosophy.>
   *
   * OKLCH color space ensures perceptual uniformity.
   *
   * Each color group defines 5 key shades (100, 300, 500, 700, 900)
   * and derives 6 intermediate shades (50, 200, 400, 600, 800, 950)
   * via color-mix() in OKLCH space.
   */

  :root.<name > {
    /* ===== PALETTE: <NAME> ===== */

    /* ===== Root Colors ===== */

    --palette-surface: oklch(/* ... */);

    /* ===== Core Palettes ===== */

    /* Error palette - key shades */
    --palette-error-100: oklch(95% /* chroma */ /* hue */);
    --palette-error-300: oklch(82% /* ... */);
    --palette-error-500: oklch(58% /* ... */);
    --palette-error-700: oklch(38% /* ... */);
    --palette-error-900: oklch(20% /* ... */);

    /* Error palette - derived shades */
    --palette-error-50: color-mix(in oklch, var(--palette-error-100), white 50%);
    --palette-error-200: color-mix(
      in oklch,
      var(--palette-error-100),
      var(--palette-error-300) 50%
    );
    --palette-error-400: color-mix(
      in oklch,
      var(--palette-error-300),
      var(--palette-error-500) 50%
    );
    --palette-error-600: color-mix(
      in oklch,
      var(--palette-error-500),
      var(--palette-error-700) 50%
    );
    --palette-error-800: color-mix(
      in oklch,
      var(--palette-error-700),
      var(--palette-error-900) 50%
    );
    --palette-error-950: color-mix(in oklch, var(--palette-error-900), black 50%);

    /* Info, Neutral, Primary, Success, Warning palettes... */
    /* (same key + derived pattern for each) */

    /* ===== Presentational Palettes ===== */

    /* Accent 1-5 palettes, Secondary palette... */
    /* (same key + derived pattern for each) */
  }
}
```

### Required Color Groups

Every palette must define these 13 groups. Each group has 5 explicit key shades + 6 derived shades = 11 shade variables (65 explicit OKLCH values + 78 derived + 1 surface = 144 properties total):

| Group                             | Variable Prefix            | Purpose                                                                                                              |
| --------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **primary**                       | `--palette-primary-*`      | Main brand color. Links, buttons, focus states, CTAs.                                                                |
| **secondary**                     | `--palette-secondary-*`    | Supporting brand color. Secondary buttons, accent areas.                                                             |
| **neutral**                       | `--palette-neutral-*`      | Text, backgrounds, borders, disabled states.                                                                         |
| **error**                         | `--palette-error-*`        | Error states, destructive actions, critical alerts.                                                                  |
| **info**                          | `--palette-info-*`         | Informational messages, tips, non-critical alerts.                                                                   |
| **success**                       | `--palette-success-*`      | Positive outcomes, completed actions, confirmations.                                                                 |
| **warning**                       | `--palette-warning-*`      | Cautions, pending states, attention required.                                                                        |
| **accent-1** through **accent-5** | `--palette-accent-{1-5}-*` | Data visualization, categorical distinction. Must be visually distinct from each other and from brand/status colors. |
| **surface**                       | `--palette-surface`        | Single value (no shades). The base background white/off-white.                                                       |

### Choosing Hue Angles

Each OKLCH color has a **hue** (0-360 degrees on the color wheel):

| Range   | Color                     | Common Use                  |
| ------- | ------------------------- | --------------------------- |
| 0-20    | Reds                      | Error                       |
| 20-45   | Orange / Terracotta       | Warm primary, warm neutral  |
| 45-70   | Amber / Gold              | Warning                     |
| 70-100  | Yellow                    | Warning (lighter)           |
| 100-140 | Yellow-green / Chartreuse | Accent                      |
| 140-170 | Green / Jade              | Success, accent             |
| 170-200 | Teal / Aqua               | Secondary, accent           |
| 200-240 | Blue / Steel              | Primary, info, cool neutral |
| 240-270 | Indigo                    | Primary, accent             |
| 270-300 | Purple / Violet           | Primary, accent             |
| 300-340 | Pink / Magenta / Rose     | Accent                      |
| 340-360 | Red-pink                  | Accent, error               |

**How existing themes use hue:**

| Group     | Arctic               | Forge                | Mist                 |
| --------- | -------------------- | -------------------- | -------------------- |
| Primary   | 220 (steel blue)     | 50 (oxidized bronze) | 180 (sage teal)      |
| Secondary | 180 (teal)           | 200 (patina)         | 275 (dusty lavender) |
| Neutral   | 240 (cool blue-gray) | 55 (graphite)        | 230 (cool blue-gray) |
| Error     | 10                   | 12                   | 12                   |
| Info      | 210                  | 220                  | 215                  |
| Success   | 160                  | 155                  | 155                  |
| Warning   | 70                   | 62                   | 65                   |

**Guidelines for hue selection:**

- **Brand colors** (primary, secondary): Choose hues that represent the theme's identity. They should complement each other (60-180 degrees apart works well).
- **Neutral**: Pick a hue that subtly echoes the brand. Warm themes use hues 20-40, cool themes 200-250, truly neutral themes use hue 0 with near-zero chroma.
- **Status colors**: Keep these recognizable (red=error, blue=info, green=success, amber=warning). You can shift hues slightly per theme, but don't deviate too far.
- **Accents**: Spread across the hue wheel for maximum visual distinction. Ensure each accent is at least 40-60 degrees from its neighbors and from brand/status colors.

### Shade Scale Pattern

You only need to define the **5 key shades** (100, 300, 500, 700, 900). The 6 intermediate shades are derived automatically via `color-mix()`.

**Key shade lightness scale:**

```
Shade:      100   300   500   700   900
Lightness: ~95%  ~82%  ~58%  ~38%  ~20%
```

**Chroma** (color intensity) for key shades should peak at 500 and taper toward extremes:

```
Low chroma theme (Arctic-style):      0.03  0.06  0.10  0.09  0.06
Medium chroma theme (Forge-style):    0.06  0.09  0.10  0.09  0.06
Ultra-low chroma theme (Mist-style):  0.02  0.04  0.07  0.06  0.04
```

Chroma is the single strongest lever for theme personality:

- **Low chroma** = restrained, professional, clinical
- **Medium chroma** = balanced, refined, warm
- **High chroma** = vivid, dramatic, expressive

### Surface Color

The surface color is the base background. Subtle tinting with the theme's hue gives visual cohesion:

```css
/* Cool-tinted white (Arctic - blue undertone) */
--palette-surface: oklch(98.5% 0.006 240);

/* Warm-tinted white (Forge - bone white) */
--palette-surface: oklch(98% 0.008 75);

/* Near-white (Mist - faintest cool tint) */
--palette-surface: oklch(99% 0.003 230);
```

Use very low chroma (0.003-0.008) for the tint. The hue should match or complement your neutral hue.

## Step 3: Design Theme Tokens

**File:** `src/styles/tokens/themes/<name>.css`

Theme tokens control the structural, non-color aspects of your theme. These are the tokens that give a theme its physical feel.

### File Structure

```css
@layer base {
  /**
   * Theme: "<name>"
   *
   * <Description of theme personality and intended use.>
   */

  :root.<name > {
    /* ===== THEME: <NAME> ===== */

    /* Typography */
    --token-font-sans: /* font stack */;
    --token-font-mono: /* font stack */;

    /* Shadows */
    --token-shadow-sm: /* ... */;
    --token-shadow-md: /* ... */;
    --token-shadow-lg: /* ... */;
    --token-shadow-interactive: /* ... */;
    --token-shadow-interactive-hover: /* ... */;
    --token-shadow-interactive-pressed: /* ... */;
    --token-shadow-inset-sm: /* ... */;
    --token-shadow-inset-md: /* ... */;
    --token-shadow-inset-underline: /* ... */;

    /* Border Radius */
    --token-radius-sm: /* ... */;
    --token-radius-md: /* ... */;
    --token-radius-lg: /* ... */;
    --token-radius-xl: /* ... */;

    /* Element Sizing */
    --token-size-xs: /* ... */;
    --token-size-sm: /* ... */;
    --token-size-md: /* ... */;
    --token-size-lg: /* ... */;
    --token-size-xl: /* ... */;

    /* Custom Spacing */
    --token-spacing-2xs: /* ... */;
    --token-spacing-xs: /* ... */;
    --token-spacing-sm: /* ... */;
    --token-spacing-md: /* ... */;
    --token-spacing-base: /* ... */;
    --token-spacing-lg: /* ... */;
    --token-spacing-xl: /* ... */;
    --token-spacing-2xl: /* ... */;

    /* Border Styles */
    --token-border-style-line: /* ... */;
    --token-border-style-thick: /* ... */;
    --token-border-style-highlight: /* ... */;
  }
}
```

### Typography

Choose a sans-serif and monospace font pair. Use [@fontsource](https://fontsource.org/) packages for self-hosted fonts. Prefer variable font versions when available.

The font stack should include the variable font name first, then the static font name, then generic fallbacks:

```css
/* Variable font available */
--token-font-sans: 'Space Grotesk Variable', 'Space Grotesk', Inter, system-ui, sans-serif;
--token-font-mono: 'Space Mono', 'JetBrains Mono', Menlo, monospace;
```

**Existing font choices:**

| Theme  | Sans          | Mono           | Character                           |
| ------ | ------------- | -------------- | ----------------------------------- |
| Arctic | IBM Plex Sans | IBM Plex Mono  | Technical, humanist, great for data |
| Forge  | Space Grotesk | Space Mono     | Geometric, distinctive, compact     |
| Mist   | Inter         | JetBrains Mono | Modern, versatile, highly legible   |

If you introduce new fonts, you'll need to add them as dependencies and register imports (see Step 4).

### Shadows

Shadows use `color-mix()` with the `--token-shadow-color` variable (which resolves to `neutral-950` via modes). Adjust opacity percentages to control intensity:

```css
/* Single-layer shadow */
--token-shadow-sm: 0 1px 2px 0 color-mix(in srgb, var(--token-shadow-color) 3%, transparent);

/* Multi-layer shadow (more realistic depth) */
--token-shadow-md:
  0 2px 4px -1px color-mix(in srgb, var(--token-shadow-color) 5%, transparent),
  0 1px 2px -1px color-mix(in srgb, var(--token-shadow-color) 3%, transparent);

/* Inset shadow (must include 'inset' keyword - validated!) */
--token-shadow-inset-sm: inset 0 2px 4px 0
  color-mix(in srgb, var(--token-shadow-color) 3%, transparent);

/* Underline shadow (special: no color-mix, used for decorative underlines) */
--token-shadow-inset-underline: inset 0 -2px 0 0;
```

**Shadow opacity ranges across themes:**

| Token                 | Arctic (subtle) | Forge (moderate) | Mist (minimal) |
| --------------------- | --------------- | ---------------- | -------------- |
| `shadow-sm`           | 3%              | 4-6%             | 3%             |
| `shadow-md`           | 3-5%            | 6-9%             | 3-5%           |
| `shadow-lg`           | 4-7%            | 8-12%            | 4-7%           |
| `interactive`         | 4%              | 7%               | 4%             |
| `interactive-hover`   | 4-6%            | 7-10%            | 4-6%           |
| `interactive-pressed` | 3%              | 5%               | 3%             |
| `highlight`           | 3-5%            | 6-9%             | 3-5%           |
| `highlight-hover`     | 5-8%            | 8-12%            | 5-8%           |
| `highlight-pressed`   | 4%              | 7%               | 4%             |
| `inset-sm`            | 3%              | 5%               | 3%             |
| `inset-md`            | 4%              | 7%               | 4%             |

There are 12 shadow tokens in total. The three categories serve different purposes:

- **Elevation** (`sm`/`md`/`lg`): Static depth for cards, modals, dropdowns
- **Interactive** (`interactive`/`hover`/`pressed`): Clickable elements like table rows and cards
- **Highlight** (`highlight`/`hover`/`pressed`): Prominent CTAs and featured elements
- **Inset** (`inset-sm`/`inset-md`/`inset-underline`): Pressed states and decorative underlines

### Border Radius

Controls how rounded corners feel:

| Token       | Arctic (sharp) | Forge (between) | Mist (rounded) |
| ----------- | -------------- | --------------- | -------------- |
| `radius-sm` | 0.125rem (2px) | 0.1875rem (3px) | 0.25rem (4px)  |
| `radius-md` | 0.25rem (4px)  | 0.3125rem (5px) | 0.375rem (6px) |
| `radius-lg` | 0.375rem (6px) | 0.4375rem (7px) | 0.5rem (8px)   |
| `radius-xl` | 0.5rem (8px)   | 0.625rem (10px) | 0.75rem (12px) |

### Element Sizing

Controls button/input heights and similar interactive element dimensions:

| Token     | Arctic         | Forge (most compact) | Mist (most spacious) |
| --------- | -------------- | -------------------- | -------------------- |
| `size-xs` | 1.25rem (20px) | 1.25rem (20px)       | 1.5rem (24px)        |
| `size-sm` | 1.75rem (28px) | 1.625rem (26px)      | 2rem (32px)          |
| `size-md` | 2.25rem (36px) | 2rem (32px)          | 2.5rem (40px)        |
| `size-lg` | 2.75rem (44px) | 2.5rem (40px)        | 3rem (48px)          |
| `size-xl` | 3.25rem (52px) | 3rem (48px)          | 3.5rem (56px)        |

### Spacing

Controls padding, gaps, and margins throughout the interface:

| Token          | Arctic          | Forge (tightest) | Mist (most spacious) |
| -------------- | --------------- | ---------------- | -------------------- |
| `spacing-2xs`  | 0.125rem (2px)  | 0.0625rem (1px)  | 0.125rem (2px)       |
| `spacing-xs`   | 0.25rem (4px)   | 0.1875rem (3px)  | 0.25rem (4px)        |
| `spacing-sm`   | 0.375rem (6px)  | 0.375rem (6px)   | 0.5rem (8px)         |
| `spacing-md`   | 0.625rem (10px) | 0.5rem (8px)     | 0.75rem (12px)       |
| `spacing-base` | 0.875rem (14px) | 0.75rem (12px)   | 1rem (16px)          |
| `spacing-lg`   | 1.5rem (24px)   | 1.25rem (20px)   | 2rem (32px)          |
| `spacing-xl`   | 3rem (48px)     | 2.5rem (40px)    | 4rem (64px)          |
| `spacing-2xl`  | 5rem (80px)     | 4.5rem (72px)    | 8rem (128px)         |

Tighter spacing = more data density (analytical tools). Looser spacing = more breathing room (editorial, creative).

### Border Styles

Currently identical across all themes, but could be customized:

```css
--token-border-style-line: 1px solid; /* Standard borders */
--token-border-style-thick: 2px solid; /* Emphasis borders */
--token-border-style-highlight: 2px dashed; /* Selection, CTAs */
```

## Step 4: Register the Theme

After creating the palette and theme CSS files, register the theme in these files:

### 1. Import CSS files

**File:** `src/styles/index.css`

Add imports for your palette and theme (order: palettes together, themes together):

```css
@import './tokens/palettes/arctic.css';
@import './tokens/palettes/forge.css';
@import './tokens/palettes/mist.css';
@import './tokens/palettes/<name>.css'; /* ADD */
@import './tokens/themes/arctic.css';
@import './tokens/themes/forge.css';
@import './tokens/themes/mist.css';
@import './tokens/themes/<name>.css'; /* ADD */
```

### 2. Register in theme utilities

**File:** `src/utils/theme.ts`

Add your theme to the type, array, labels, and descriptions:

```typescript
export type Theme = 'arctic' | 'forge' | 'mist' | '<name>'

export const THEMES: readonly Theme[] = ['arctic', 'forge', 'mist', '<name>'] as const

export const THEME_LABELS: Record<Theme, string> = {
  arctic: 'Arctic',
  forge: 'Forge',
  mist: 'Mist',
  <name>: '<Label>',
}

export const THEME_DESCRIPTIONS: Record<Theme, string> = {
  arctic: 'Clean, precise palette for analytical interfaces',
  forge: 'Precision warmth with graphite and oxidized bronze editorial restraint',
  mist: 'Near-monochrome precision for dense, content-first interfaces',
  <name>: '<Short description of the theme>',
}
```

### 3. Add to ThemeSwitcher

**File:** `src/components/ThemeSwitcher.tsx`

Add an entry to the `themeOptions` array. Choose an icon from the ui-library icon set (use `search_icons` MCP tool to find one):

```typescript
const themeOptions: readonly ToggleGroupOption<Theme>[] = [
  { value: 'arctic', label: THEME_LABELS.arctic, icon: 'database' },
  { value: 'forge', label: THEME_LABELS.forge, icon: 'chart' },
  { value: 'mist', label: THEME_LABELS.mist, icon: 'cloud' },
  { value: '<name>', label: THEME_LABELS.<name>, icon: '<icon-name>' },
]
```

### 4. Add to Storybook preview

**File:** `.storybook/preview.tsx`

Add Light and Dark entries to the themes object:

```typescript
withThemeByClassName({
  themes: {
    'Arctic Light': 'arctic light',
    'Arctic Dark': 'arctic dark',
    'Forge Light': 'forge light',
    'Forge Dark': 'forge dark',
    'Mist Light': 'mist light',
    'Mist Dark': 'mist dark',
    '<Label> Light': '<name> light',    // ADD
    '<Label> Dark': '<name> dark',      // ADD
  },
  defaultTheme: 'Arctic Light',
  parentSelector: 'html',
}),
```

### 5. Update tests

**File:** `src/utils/theme.test.ts`

Update the cleanup calls and assertions to include the new theme:

```typescript
// In beforeEach and afterEach:
document.documentElement.classList.remove('dark', 'light', 'arctic', 'forge', 'mist', '<name>')

// In THEMES constant test:
expect(THEMES).toContain('<name>')
expect(THEMES.length).toBe(4) // was 3
```

### 6. Add fonts (if using new fonts)

If your theme uses fonts not already imported, add dependencies and register imports:

**Add @fontsource packages:**

```bash
pnpm --filter ui-library add @fontsource-variable/<font-name>  # for variable fonts
pnpm --filter ui-library add @fontsource/<font-name>            # for static fonts
```

Or use the `pnpm_add` MCP tool.

**File:** `src/fonts.ts`

Add imports for the new font packages:

```typescript
import '@fontsource/ibm-plex-mono'
import '@fontsource/jetbrains-mono'
import '@fontsource/space-mono'
import '@fontsource-variable/ibm-plex-sans'
import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/<your-new-font>' // ADD if needed
import '@fontsource/<your-new-mono-font>' // ADD if needed
```

## Step 5: Validate and Verify

Run these in order:

### Token validation

Checks that your palette and theme files have the same CSS custom properties as `arctic.css`:

```bash
pnpm --filter ui-library validate:token-definitions
```

This validates:

- All palette properties in `arctic.css` exist in your new palette file (and vice versa)
- All theme properties in `arctic.css` exist in your new theme file (and vice versa)
- Inset shadow tokens contain the `inset` keyword
- Non-inset shadow tokens don't accidentally contain `inset`

### Build

```bash
pnpm --filter ui-library build
```

### Tests

```bash
pnpm --filter ui-library test
```

### Visual verification

```bash
pnpm --filter ui-library storybook
```

Switch to your new theme using the Storybook toolbar dropdown. Check both light and dark modes. Verify:

- Text is readable in all contexts
- Status colors are recognizable
- Interactive states (hover, pressed) have sufficient contrast change
- Accent colors are visually distinct from each other
- Shadows feel appropriate for the theme's personality

## Checklist

- [ ] Palette file: `src/styles/tokens/palettes/<name>.css` with 65 key shades + 78 derived + surface
- [ ] Theme file: `src/styles/tokens/themes/<name>.css` with all 30 structural tokens
- [ ] `src/styles/index.css` -- imports added
- [ ] `src/utils/theme.ts` -- type, array, labels, descriptions updated
- [ ] `src/components/ThemeSwitcher.tsx` -- option added
- [ ] `.storybook/preview.tsx` -- Light/Dark entries added
- [ ] `src/utils/theme.test.ts` -- cleanup and assertions updated
- [ ] (If new fonts) `package.json` dependencies and `src/fonts.ts` imports added
- [ ] `pnpm --filter ui-library validate:token-definitions` passes
- [ ] `pnpm --filter ui-library build` succeeds
- [ ] `pnpm --filter ui-library test` passes
- [ ] Visual check in Storybook (both light and dark modes)
