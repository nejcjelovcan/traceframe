# OKLCH Color System

This document describes the OKLCH color system implementation in the Traceframe UI Library.

## Overview

The Traceframe UI Library has migrated to OKLCH (Oklab Lightness Chroma Hue), a perceptually uniform color space that provides better color manipulation and more predictable results compared to RGB or HSL.

### Benefits of OKLCH

- **Perceptual Uniformity**: Equal numeric changes produce equal perceptual changes
- **Better Lightness Control**: Consistent brightness across different hues
- **Predictable Color Mixing**: More natural color blending and transitions
- **Wide Gamut Support**: Can represent colors outside sRGB when displays support it

## File Structure

```
packages/ui-library/src/
├── styles/tokens/palettes/
│   ├── arctic.css      # Arctic palette (OKLCH values)
│   ├── forge.css       # Forge palette (OKLCH values)
│   └── mist.css        # Mist palette (OKLCH values)
├── styles/tokens/modes/
│   ├── light.css       # Light mode semantic tokens (reference palette vars directly)
│   └── dark.css        # Dark mode semantic tokens (reference palette vars directly)
├── styles/tokens/utilities/
│   └── color-mixing.css # CSS utilities for color manipulation
└── utils/
    └── color.ts         # TypeScript utilities for OKLCH colors
```

## OKLCH Format

OKLCH colors use three components plus optional alpha:

```css
oklch(lightness chroma hue)
oklch(lightness chroma hue / alpha)
```

- **Lightness**: 0-100% (0% = black, 100% = white)
- **Chroma**: 0-0.4+ (0 = gray, higher = more saturated)
- **Hue**: 0-360 degrees
- **Alpha**: 0-1 (optional, for transparency)

### Examples

```css
/* Solid colors */
--color-primary-500: oklch(58% 0.1 220); /* Steel blue */
--color-success-500: oklch(58% 0.08 160); /* Green */
--color-error-500: oklch(58% 0.1 10); /* Red */

/* With transparency */
--color-primary-500-50: oklch(58% 0.1 220 / 0.5);
```

## How Tokens Reference Palettes

Semantic tokens in `modes/light.css` and `modes/dark.css` reference palette variables directly using `var()`:

```css
/* Palette defines the OKLCH value */
--palette-neutral-900: oklch(20% 0.008 240);

/* Semantic token references it directly (no rgb() wrapper) */
--token-foreground: var(--palette-neutral-900);

/* Gradients also reference palette vars directly */
--token-gradient-primary: linear-gradient(
  180deg,
  var(--palette-primary-600),
  var(--palette-primary-700)
);
```

> **Important:** Semantic tokens must NOT wrap palette references in `rgb()`. Since palette values are OKLCH, `rgb(oklch(...))` is invalid CSS.

## Derived Shades via color-mix()

Each palette color group defines **5 key shades** (100, 300, 500, 700, 900) with explicit OKLCH values, and **6 derived shades** (50, 200, 400, 600, 800, 950) via `color-mix()` in OKLCH space. This reduces maintenance from 143 hand-tuned values to 65 explicit values per palette, while preserving all 11 shade CSS custom property names.

### Derivation formulas

| Shade | Formula                                                               |
| ----- | --------------------------------------------------------------------- |
| 50    | `color-mix(in oklch, var(--palette-X-100), white 50%)`                |
| 200   | `color-mix(in oklch, var(--palette-X-100), var(--palette-X-300) 50%)` |
| 400   | `color-mix(in oklch, var(--palette-X-300), var(--palette-X-500) 50%)` |
| 600   | `color-mix(in oklch, var(--palette-X-500), var(--palette-X-700) 50%)` |
| 800   | `color-mix(in oklch, var(--palette-X-700), var(--palette-X-900) 50%)` |
| 950   | `color-mix(in oklch, var(--palette-X-900), black 50%)`                |

OKLCH's perceptual uniformity means `color-mix()` produces near-identical results to hand-tuned intermediate values (chroma differs by ~0.005-0.01 at most).

## Browser Support

Palette values are defined as native OKLCH colors without fallbacks. Auto-generated RGB fallbacks for older browsers are planned (see TRA-80).

### Browser Compatibility

- **Full Support**: Chrome 111+, Firefox 113+, Safari 15.4+
- **No Fallback**: Older browsers will not render colors correctly until auto-generated RGB fallbacks are implemented

## CSS Utilities

### Color Mixing (`color-mixing.css`)

The library provides CSS utilities for dynamic color manipulation:

#### Shade Generation

```css
/* Lighten (mix with white) */
--mix-lighten-10: color-mix(in oklch, var(--base-color), white 10%);
--mix-lighten-20: color-mix(in oklch, var(--base-color), white 20%);

/* Darken (mix with black) */
--mix-darken-10: color-mix(in oklch, var(--base-color), black 10%);
--mix-darken-20: color-mix(in oklch, var(--base-color), black 20%);
```

#### Theme-Aware Mixing

```css
/* Mix with surface for better integration */
--mix-with-surface-30: color-mix(in oklch, var(--base-color), var(--color-surface) 30%);

/* Mix with foreground for text variations */
--mix-with-foreground-20: color-mix(in oklch, var(--base-color), var(--color-foreground) 20%);
```

#### Opacity Utilities

```css
/* Create semi-transparent versions */
--opacity-10: oklch(from var(--base-color) l c h / 0.1);
--opacity-50: oklch(from var(--base-color) l c h / 0.5);
--opacity-90: oklch(from var(--base-color) l c h / 0.9);
```

#### Saturation Adjustment

```css
/* Desaturate */
--desaturate-20: oklch(from var(--base-color) l calc(c * 0.8) h);
--desaturate-50: oklch(from var(--base-color) l calc(c * 0.5) h);

/* Saturate */
--saturate-20: oklch(from var(--base-color) l calc(c * 1.2) h);
```

#### Hue Rotation

```css
/* Rotate hue for variations */
--rotate-hue-30: oklch(from var(--base-color) l c calc(h + 30));
--rotate-hue-180: oklch(from var(--base-color) l c calc(h + 180));
```

## TypeScript Utilities

### Basic Usage

```typescript
import {
  parseOKLCH,
  formatOKLCH,
  adjustLightness,
  adjustChroma,
  rotateHue,
  mixColors,
  createColorScale,
} from '@nejcjelovcan/traceframe-ui-library/utils/color'

// Parse OKLCH string
const color = parseOKLCH('oklch(58% 0.10 220)')
// { l: 0.58, c: 0.10, h: 220 }

// Format back to string
const colorString = formatOKLCH(color)
// "oklch(58.0% 0.100 220.0)"

// Adjust lightness (make lighter)
const lighter = adjustLightness(color, 0.2)
// "oklch(78.0% 0.100 220.0)"

// Adjust saturation
const muted = adjustChroma(color, -0.05)
// "oklch(58.0% 0.050 220.0)"

// Rotate hue
const shifted = rotateHue(color, 30)
// "oklch(58.0% 0.100 250.0)"

// Mix two colors
const mixed = mixColors('oklch(58% 0.10 220)', 'oklch(58% 0.08 160)', 0.5)

// Create a color scale
const scale = createColorScale('oklch(58% 0.10 220)', 11)
// Returns array of 11 colors from light to dark
```

### Advanced Examples

```typescript
// Check if color is light or dark
import { isLight, getContrastingColor } from '@nejcjelovcan/traceframe-ui-library/utils/color'

const backgroundColor = 'oklch(90% 0.05 220)'
const textColor = getContrastingColor(backgroundColor)
// Returns dark text for light backgrounds

// Set opacity
import { setAlpha } from '@nejcjelovcan/traceframe-ui-library/utils/color'

const transparent = setAlpha('oklch(58% 0.10 220)', 0.5)
// "oklch(58.0% 0.100 220.0 / 0.50)"

// RGB to OKLCH conversion (approximate)
import { rgbToOKLCH } from '@nejcjelovcan/traceframe-ui-library/utils/color'

const oklch = rgbToOKLCH(98, 140, 186)
// { l: 0.58, c: 0.10, h: 220 }
```

## Migration Guide

### Converting RGB to OKLCH

When converting existing RGB colors to OKLCH:

1. Use Chrome DevTools color picker in OKLCH mode
2. Or use online converters like [oklch.com](https://oklch.com/)

### Example Migration

Before:

```css
--palette-primary-500: rgb(98, 140, 186);
```

After:

```css
--palette-primary-500: oklch(58% 0.1 220);
```

No `@supports` wrappers or RGB fallbacks are needed. Palette files define OKLCH values directly.

## Performance Considerations

- OKLCH calculations are performed natively by the browser
- `color-mix()` is also native, requiring no JavaScript
- No runtime overhead for color conversions

## Best Practices

1. **Use OKLCH for all new colors**: Define new colors directly in OKLCH
2. **Reference palette vars with `var()` only**: Never wrap in `rgb()` or other color functions
3. **Leverage color-mix()**: Use native color mixing instead of pre-calculating shades
4. **Use utilities for variations**: Create color variations dynamically rather than defining each shade
5. **Test in modern browsers**: OKLCH requires Chrome 111+, Firefox 113+, Safari 15.4+

## Resources

- [OKLCH Color Space](https://oklch.com/) - Interactive OKLCH color picker
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) - W3C specification
- [OKLCH in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) - MDN documentation
- [Oklab Color Space](https://bottosson.github.io/posts/oklab/) - Technical details about Oklab/OKLCH
