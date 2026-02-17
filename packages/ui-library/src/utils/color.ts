/**
 * OKLCH Color Utilities
 *
 * TypeScript utilities for working with OKLCH colors at runtime.
 * These functions provide programmatic color manipulation while
 * maintaining the perceptual uniformity benefits of OKLCH.
 */

/**
 * Represents an OKLCH color with lightness, chroma, hue, and optional alpha
 */
export interface OKLCHColor {
  /** Lightness: 0-1 (0 = black, 1 = white) */
  l: number;
  /** Chroma: 0-0.4+ (0 = gray, higher = more saturated) */
  c: number;
  /** Hue: 0-360 degrees */
  h: number;
  /** Alpha: 0-1 (optional, defaults to 1) */
  a?: number;
}

/**
 * Parse an OKLCH color string into its components
 * @param oklch - OKLCH color string (e.g., "oklch(58% 0.12 220)" or "oklch(0.58 0.12 220 / 0.5)")
 * @returns Parsed OKLCH color object
 */
export function parseOKLCH(oklch: string): OKLCHColor {
  const match = oklch.match(
    /oklch\(([0-9.]+%?)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\)/
  );

  if (!match) {
    throw new Error(`Invalid OKLCH color string: ${oklch}`);
  }

  const [, lStr, cStr, hStr, aStr] = match;

  if (!lStr || !cStr || !hStr) {
    throw new Error(`Invalid OKLCH color string: ${oklch}`);
  }

  // Parse lightness (can be percentage or decimal)
  const l = lStr.endsWith('%')
    ? parseFloat(lStr) / 100
    : parseFloat(lStr);

  return {
    l,
    c: parseFloat(cStr),
    h: parseFloat(hStr),
    a: aStr ? parseFloat(aStr) : 1,
  };
}

/**
 * Format an OKLCH color object as a CSS color string
 * @param color - OKLCH color object
 * @param usePercentage - Whether to output lightness as percentage (default: true)
 * @returns OKLCH CSS color string
 */
export function formatOKLCH(color: OKLCHColor, usePercentage = true): string {
  const l = usePercentage ? `${(color.l * 100).toFixed(1)}%` : color.l.toFixed(3);
  const c = color.c.toFixed(3);
  const h = color.h.toFixed(1);

  if (color.a !== undefined && color.a !== 1) {
    return `oklch(${l} ${c} ${h} / ${color.a.toFixed(2)})`;
  }

  return `oklch(${l} ${c} ${h})`;
}

/**
 * Adjust the lightness of an OKLCH color
 * @param color - Input color (OKLCH string or object)
 * @param amount - Amount to adjust (-1 to 1, negative = darker, positive = lighter)
 * @returns New OKLCH color string
 */
export function adjustLightness(
  color: string | OKLCHColor,
  amount: number
): string {
  const parsed = typeof color === 'string' ? parseOKLCH(color) : color;

  return formatOKLCH({
    ...parsed,
    l: Math.max(0, Math.min(1, parsed.l + amount)),
  });
}

/**
 * Adjust the chroma (saturation) of an OKLCH color
 * @param color - Input color (OKLCH string or object)
 * @param amount - Amount to adjust (negative = desaturate, positive = saturate)
 * @returns New OKLCH color string
 */
export function adjustChroma(
  color: string | OKLCHColor,
  amount: number
): string {
  const parsed = typeof color === 'string' ? parseOKLCH(color) : color;

  return formatOKLCH({
    ...parsed,
    c: Math.max(0, Math.min(0.4, parsed.c + amount)),
  });
}

/**
 * Rotate the hue of an OKLCH color
 * @param color - Input color (OKLCH string or object)
 * @param degrees - Degrees to rotate (can be negative)
 * @returns New OKLCH color string
 */
export function rotateHue(
  color: string | OKLCHColor,
  degrees: number
): string {
  const parsed = typeof color === 'string' ? parseOKLCH(color) : color;

  // Normalize hue to 0-360 range
  let newHue = (parsed.h + degrees) % 360;
  if (newHue < 0) newHue += 360;

  return formatOKLCH({
    ...parsed,
    h: newHue,
  });
}

/**
 * Set the alpha (opacity) of an OKLCH color
 * @param color - Input color (OKLCH string or object)
 * @param alpha - Alpha value (0-1)
 * @returns New OKLCH color string with alpha
 */
export function setAlpha(
  color: string | OKLCHColor,
  alpha: number
): string {
  const parsed = typeof color === 'string' ? parseOKLCH(color) : color;

  return formatOKLCH({
    ...parsed,
    a: Math.max(0, Math.min(1, alpha)),
  });
}

/**
 * Mix two OKLCH colors
 * @param color1 - First color (OKLCH string or object)
 * @param color2 - Second color (OKLCH string or object)
 * @param ratio - Mix ratio (0 = all color1, 1 = all color2)
 * @returns New OKLCH color string
 */
export function mixColors(
  color1: string | OKLCHColor,
  color2: string | OKLCHColor,
  ratio = 0.5
): string {
  const parsed1 = typeof color1 === 'string' ? parseOKLCH(color1) : color1;
  const parsed2 = typeof color2 === 'string' ? parseOKLCH(color2) : color2;

  // Ensure ratio is between 0 and 1
  const r = Math.max(0, Math.min(1, ratio));

  return formatOKLCH({
    l: parsed1.l * (1 - r) + parsed2.l * r,
    c: parsed1.c * (1 - r) + parsed2.c * r,
    h: interpolateHue(parsed1.h, parsed2.h, r),
    a: (parsed1.a ?? 1) * (1 - r) + (parsed2.a ?? 1) * r,
  });
}

/**
 * Interpolate between two hue values taking the shortest path
 * @param h1 - First hue (0-360)
 * @param h2 - Second hue (0-360)
 * @param ratio - Interpolation ratio (0-1)
 * @returns Interpolated hue
 */
function interpolateHue(h1: number, h2: number, ratio: number): number {
  // Calculate the shortest path around the color wheel
  let diff = h2 - h1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  let result = h1 + diff * ratio;

  // Normalize to 0-360 range
  if (result < 0) result += 360;
  if (result >= 360) result -= 360;

  return result;
}

/**
 * Create a color scale from a base OKLCH color
 * @param baseColor - Base color (OKLCH string or object)
 * @param steps - Number of steps in the scale
 * @param lightnessRange - Range of lightness values [min, max]
 * @returns Array of OKLCH color strings
 */
export function createColorScale(
  baseColor: string | OKLCHColor,
  steps = 11,
  lightnessRange: [number, number] = [0.1, 0.98]
): string[] {
  const parsed = typeof baseColor === 'string' ? parseOKLCH(baseColor) : baseColor;
  const [minL, maxL] = lightnessRange;
  const scale: string[] = [];

  for (let i = 0; i < steps; i++) {
    const l = minL + (maxL - minL) * (1 - i / (steps - 1));

    // Slightly reduce chroma for very light and very dark colors
    let c = parsed.c;
    if (l > 0.9) c *= 0.7; // Reduce chroma for very light colors
    if (l < 0.2) c *= 0.8; // Reduce chroma for very dark colors

    scale.push(formatOKLCH({ ...parsed, l, c }));
  }

  return scale;
}

/**
 * Check if a color is light or dark based on its lightness
 * @param color - OKLCH color (string or object)
 * @param threshold - Lightness threshold (default: 0.6)
 * @returns true if the color is light, false if dark
 */
export function isLight(
  color: string | OKLCHColor,
  threshold = 0.6
): boolean {
  const parsed = typeof color === 'string' ? parseOKLCH(color) : color;
  return parsed.l > threshold;
}

/**
 * Get a contrasting color (for text on backgrounds)
 * @param backgroundColor - Background color (OKLCH string or object)
 * @param lightColor - Color to use for light text (default: white)
 * @param darkColor - Color to use for dark text (default: black)
 * @returns Contrasting color string
 */
export function getContrastingColor(
  backgroundColor: string | OKLCHColor,
  lightColor = 'oklch(98% 0 0)',
  darkColor = 'oklch(10% 0 0)'
): string {
  return isLight(backgroundColor) ? darkColor : lightColor;
}

/**
 * Convert RGB to OKLCH (approximate conversion)
 * Note: This is a simplified conversion. For production use,
 * consider using a more accurate color space conversion library.
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @returns OKLCH color object
 */
export function rgbToOKLCH(r: number, g: number, b: number): OKLCHColor {
  // Normalize RGB to 0-1 range
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Simple approximation of lightness
  const l = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;

  // Simple approximation of chroma
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const c = (max - min) * 0.3; // Scaled to approximate OKLCH chroma range

  // Simple approximation of hue
  let h = 0;
  if (c > 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / (max - min)) * 60;
    } else if (max === gNorm) {
      h = (2 + (bNorm - rNorm) / (max - min)) * 60;
    } else {
      h = (4 + (rNorm - gNorm) / (max - min)) * 60;
    }
    if (h < 0) h += 360;
  }

  return { l, c, h };
}

/**
 * Create a CSS custom property that references an OKLCH color
 * Useful for creating dynamic color schemes
 * @param name - CSS custom property name (without --)
 * @param color - OKLCH color (string or object)
 * @returns CSS custom property declaration
 */
export function createColorVariable(
  name: string,
  color: string | OKLCHColor
): string {
  const colorString = typeof color === 'string' ? color : formatOKLCH(color);
  return `--${name}: ${colorString};`;
}