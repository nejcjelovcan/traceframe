/**
 * Semantic token utilities for linting and validation.
 * Derives all information from TOKEN_METADATA (the source of truth for token descriptions).
 */

import { TOKEN_METADATA } from '../styles/token-metadata.js'

/**
 * All palette names from the token metadata.
 */
export const COLOR_PALETTES = Object.keys(TOKEN_METADATA.palettes) as ReadonlyArray<string>

/**
 * All shade values (derived from any palette, they're all the same).
 */
export const SHADES = TOKEN_METADATA.palettes.primary.shades.map(String) as ReadonlyArray<string>

/**
 * All semantic token categories (surface, foreground, border, etc.).
 */
export const SEMANTIC_TOKENS = Object.keys(TOKEN_METADATA.semantic) as ReadonlyArray<string>

/**
 * Get all semantic token names including variants (e.g., 'surface', 'surface-muted').
 */
export function getSemanticTokenNames(): string[] {
  const names: string[] = []

  for (const [category, data] of Object.entries(TOKEN_METADATA.semantic)) {
    const variants = data.variants as Record<string, string>

    // Add DEFAULT variant as just the category name
    if ('DEFAULT' in variants) {
      names.push(category)
    }

    // Add other variants as category-variant
    for (const variant of Object.keys(variants)) {
      if (variant !== 'DEFAULT') {
        names.push(`${category}-${variant}`)
      }
    }
  }

  return names
}

/**
 * Tailwind color utility prefixes that use color values.
 */
const COLOR_PREFIXES = [
  'bg',
  'text',
  'border',
  'outline',
  'ring',
  'fill',
  'stroke',
  'placeholder',
  'decoration',
  'accent',
  'caret',
  'divide',
  'shadow',
  'from',
  'via',
  'to',
] as const

/**
 * Check if a Tailwind class uses a direct palette color (non-semantic).
 * Returns true if the class uses a palette color with a shade number.
 *
 * Examples of non-semantic classes:
 * - bg-primary-500
 * - text-neutral-700
 * - border-error-200
 * - hover:bg-primary-600
 *
 * Examples of semantic classes (returns false):
 * - bg-surface
 * - text-foreground-muted
 * - border-border
 */
export function isNonSemanticColorClass(className: string): boolean {
  // Remove modifiers (dark:, hover:, focus:, etc.)
  const cleanClass = className
    .replace(/^dark:/, '')
    .replace(/^hover:/, '')
    .replace(/^focus:/, '')
    .replace(/^active:/, '')
    .replace(/^disabled:/, '')
    .replace(/^group-hover:/, '')

  // Check for direct palette usage: prefix-palette-shade
  for (const palette of COLOR_PALETTES) {
    for (const shade of SHADES) {
      for (const prefix of COLOR_PREFIXES) {
        if (cleanClass === `${prefix}-${palette}-${shade}`) {
          return true
        }
      }
    }
  }

  // Check for white/black colors
  const nonSemanticPatterns = [
    'bg-white',
    'bg-black',
    'text-white',
    'text-black',
    'border-white',
    'border-black',
    'ring-white',
    'ring-black',
  ]

  if (nonSemanticPatterns.includes(cleanClass)) {
    return true
  }

  // Check for arbitrary color values like [#ff0000]
  if (/\[[#][\da-fA-F]{3,8}\]/.test(cleanClass)) {
    return true
  }

  return false
}

/**
 * Extract Tailwind classes from a string value.
 */
export function extractTailwindClasses(value: string): string[] {
  const classRegex = /[\w-:]+(?:\[[^\]]+\])?/g
  return value.match(classRegex) || []
}

/**
 * Suggest a semantic token replacement for a non-semantic color class.
 * Returns undefined if no suggestion is available.
 *
 * This provides basic suggestions based on common patterns.
 * It's not exhaustive - developers should consult the design system docs.
 */
export function getSuggestion(className: string): string | undefined {
  // Remove modifiers for analysis
  const modifier =
    className.match(/^(dark:|hover:|focus:|active:|disabled:|group-hover:)/)?.[0] || ''
  const cleanClass = className.replace(/^(dark:|hover:|focus:|active:|disabled:|group-hover:)/, '')

  // Extract prefix and the rest
  const match = cleanClass.match(/^(bg|text|border|ring)-(.+)$/)
  if (!match) return undefined

  const prefix = match[1]
  const rest = match[2]
  if (!prefix || !rest) return undefined

  // Background suggestions
  if (prefix === 'bg') {
    if (rest.startsWith('neutral-')) {
      const shade = rest.replace('neutral-', '')
      if (['50', '100'].includes(shade)) return `${modifier}bg-surface-muted`
      if (['200'].includes(shade)) return `${modifier}bg-surface-subtle`
      if (['900', '950'].includes(shade)) return `${modifier}bg-surface`
    }
    if (rest.startsWith('primary-')) {
      const shade = rest.replace('primary-', '')
      if (['500', '600'].includes(shade)) return `${modifier}bg-interactive-primary`
      if (['50', '100'].includes(shade)) return `${modifier}bg-status-info-muted`
    }
    if (rest.startsWith('error-')) {
      if (rest.includes('50')) return `${modifier}bg-status-error-muted`
    }
    if (rest.startsWith('success-')) {
      if (rest.includes('50')) return `${modifier}bg-status-success-muted`
    }
    if (rest.startsWith('warning-')) {
      if (rest.includes('50')) return `${modifier}bg-status-warning-muted`
    }
    if (rest === 'white') return `${modifier}bg-surface`
  }

  // Text suggestions
  if (prefix === 'text') {
    if (rest.startsWith('neutral-')) {
      const shade = rest.replace('neutral-', '')
      if (['900'].includes(shade)) return `${modifier}text-foreground`
      if (['400', '500', '600'].includes(shade)) return `${modifier}text-foreground-muted`
      if (['50', '100'].includes(shade)) return `${modifier}text-foreground-filled`
    }
    if (rest.startsWith('error-')) return `${modifier}text-status-error-foreground`
    if (rest.startsWith('success-')) return `${modifier}text-status-success-foreground`
    if (rest.startsWith('warning-')) return `${modifier}text-status-warning-foreground`
    if (rest.startsWith('primary-')) return `${modifier}text-status-info-foreground`
  }

  // Border suggestions
  if (prefix === 'border') {
    if (rest.startsWith('neutral-')) {
      const shade = rest.replace('neutral-', '')
      if (['100', '800'].includes(shade)) return `${modifier}border-border-muted`
      if (['200', '700'].includes(shade)) return `${modifier}border-border`
    }
    if (rest.startsWith('error-')) return `${modifier}border-status-error-border`
    if (rest.startsWith('success-')) return `${modifier}border-status-success-border`
    if (rest.startsWith('warning-')) return `${modifier}border-status-warning-border`
    if (rest.startsWith('primary-')) return `${modifier}border-status-info-border`
  }

  return undefined
}

/**
 * Spacing utility prefixes that accept numeric values.
 */
export const SPACING_PREFIXES = [
  // Padding
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'ps',
  'pe',
  // Margin (including negatives, handled separately)
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'ms',
  'me',
  // Gap
  'gap',
  'gap-x',
  'gap-y',
  // Space between
  'space-x',
  'space-y',
] as const

/**
 * Sizing utility prefixes for element dimensions.
 */
export const SIZING_PREFIXES = ['h', 'min-h', 'max-h', 'w', 'min-w', 'max-w'] as const

/**
 * Mapping from Tailwind numeric spacing values to semantic token names.
 * Derived from TOKEN_METADATA.theme.spacing.
 */
export const SPACING_MAP: ReadonlyMap<string, { semantic: string; rem: string }> = (() => {
  // Updated to support both standard and arctic theme values
  const remToNumeric: Record<string, string> = {
    // Standard Tailwind values
    '0.125rem': '0.5',
    '0.25rem': '1',
    '0.5rem': '2',
    '0.75rem': '3',
    '1rem': '4',
    '2rem': '8',
    '4rem': '16',
    '8rem': '32',
    // Arctic theme values
    '0.375rem': '1.5', // sm in arctic
    '0.625rem': '2.5', // md in arctic
    '0.875rem': '3.5', // base in arctic
    '1.5rem': '6', // lg in arctic
    '3rem': '12', // xl in arctic
    '5rem': '20', // 2xl in arctic
  }
  const map = new Map<string, { semantic: string; rem: string }>()
  for (const [name, data] of Object.entries(TOKEN_METADATA.theme.spacing)) {
    const value = data.value as string
    const numeric = remToNumeric[value]
    if (numeric) {
      map.set(numeric, { semantic: name, rem: value })
    }
  }
  return map
})()

/**
 * Mapping from Tailwind numeric sizing values to semantic token names.
 * Uses `size-` prefix in Tailwind (configured in tailwind-preset.ts).
 */
export const SIZING_MAP: ReadonlyMap<string, { semantic: string; rem: string }> = (() => {
  // Updated to support both standard and arctic theme values
  const remToNumeric: Record<string, string> = {
    // Standard values
    '1.5rem': '6',
    '2rem': '8',
    '2.5rem': '10',
    '3rem': '12',
    '3.5rem': '14',
    // Arctic theme values
    '1.25rem': '5', // xs in arctic
    '1.75rem': '7', // sm in arctic
    '2.25rem': '9', // md in arctic
    '2.75rem': '11', // lg in arctic
    '3.25rem': '13', // xl in arctic
  }
  const map = new Map<string, { semantic: string; rem: string }>()
  for (const [name, data] of Object.entries(TOKEN_METADATA.theme.size)) {
    const value = data.value as string
    const numeric = remToNumeric[value]
    if (numeric) {
      map.set(numeric, { semantic: `size-${name}`, rem: value })
    }
  }
  return map
})()

/**
 * Values that should NOT be flagged as non-semantic spacing/sizing.
 */
const EXEMPT_VALUES = new Set([
  '0',
  'px',
  'auto',
  'full',
  'screen',
  'svh',
  'lvh',
  'dvh',
  'min',
  'max',
  'fit',
  'none',
])

/**
 * Regex for keyword or arbitrary values that should not be flagged.
 * Matches: fractions (1/2, 2/3), arbitrary values ([300px]), or keyword-like strings.
 */
const NON_NUMERIC_VALUE = /^(\d+\/\d+|\[.+\]|[a-z])/

/**
 * Maximum numeric Tailwind value to flag for sizing.
 * Values above this (w-48, w-64, w-96) are layout dimensions, not element sizes.
 */
const MAX_SIZING_NUMERIC = 16

/**
 * Strip Tailwind modifiers (dark:, hover:, focus:, etc.) from a class.
 */
function stripModifiers(className: string): string {
  return className.replace(/^(?:[\w-]+:)+/, '')
}

/**
 * Check if a Tailwind class uses a numeric spacing value (non-semantic).
 *
 * Examples that return true:  p-4, gap-2, mx-8, -m-2, hover:p-4
 * Examples that return false: p-0, p-px, p-md, gap-sm, p-auto, p-[20px], p-1/2
 */
export function isNonSemanticSpacingClass(className: string): boolean {
  const clean = stripModifiers(className)

  // Handle negative margin: -m-2, -mx-4, etc.
  const isNegative = clean.startsWith('-')
  const unsigned = isNegative ? clean.slice(1) : clean

  for (const prefix of SPACING_PREFIXES) {
    const prefixWithDash = `${prefix}-`
    if (unsigned.startsWith(prefixWithDash)) {
      const value = unsigned.slice(prefixWithDash.length)
      if (EXEMPT_VALUES.has(value)) continue
      if (NON_NUMERIC_VALUE.test(value)) continue
      // Must be a numeric value (integer or decimal like 0.5)
      if (/^\d+(\.\d+)?$/.test(value)) return true
    }
  }

  return false
}

/**
 * Check if a Tailwind class uses a numeric sizing value in the element size range (non-semantic).
 *
 * Examples that return true:  h-8, w-10, min-h-6, max-w-12, hover:h-8
 * Examples that return false: h-full, w-auto, w-1/2, h-[50%], w-48, w-64, w-96
 */
export function isNonSemanticSizingClass(className: string): boolean {
  const clean = stripModifiers(className)

  for (const prefix of SIZING_PREFIXES) {
    const prefixWithDash = `${prefix}-`
    if (clean.startsWith(prefixWithDash)) {
      const value = clean.slice(prefixWithDash.length)
      if (EXEMPT_VALUES.has(value)) continue
      if (NON_NUMERIC_VALUE.test(value)) continue
      // Must be a numeric value in the element sizing range
      if (/^\d+(\.\d+)?$/.test(value)) {
        const numericValue = parseFloat(value)
        if (numericValue >= 4 && numericValue <= MAX_SIZING_NUMERIC) return true
      }
    }
  }

  return false
}

/**
 * Find the nearest semantic spacing tokens for a given rem value.
 */
function findNearestSpacing(
  numericValue: string
): Array<{ semantic: string; rem: string; distance: number }> {
  const targetRem = parseFloat(numericValue) * 0.25 // Tailwind numeric to rem
  const entries = Array.from(SPACING_MAP.entries()).map(([, data]) => ({
    semantic: data.semantic,
    rem: data.rem,
    distance: Math.abs(parseFloat(data.rem) - targetRem),
  }))
  entries.sort((a, b) => a.distance - b.distance)
  return entries.slice(0, 2).filter((e) => e.distance > 0)
}

/**
 * Find the nearest semantic sizing tokens for a given rem value.
 */
function findNearestSizing(
  numericValue: string
): Array<{ semantic: string; rem: string; distance: number }> {
  const targetRem = parseFloat(numericValue) * 0.25
  const entries = Array.from(SIZING_MAP.entries()).map(([, data]) => ({
    semantic: data.semantic,
    rem: data.rem,
    distance: Math.abs(parseFloat(data.rem) - targetRem),
  }))
  entries.sort((a, b) => a.distance - b.distance)
  return entries.slice(0, 2).filter((e) => e.distance > 0)
}

/**
 * Suggest a semantic spacing token replacement for a non-semantic spacing class.
 *
 * Exact matches: "p-4" → "p-base"
 * Near matches:  "p-5" → "nearest: p-base (1rem)"
 */
export function getSpacingSuggestion(className: string): string | undefined {
  const modifier = className.match(/^((?:[\w-]+:)+)/)?.[0] || ''
  const clean = stripModifiers(className)

  const isNegative = clean.startsWith('-')
  const unsigned = isNegative ? clean.slice(1) : clean

  for (const prefix of SPACING_PREFIXES) {
    const prefixWithDash = `${prefix}-`
    if (unsigned.startsWith(prefixWithDash)) {
      const value = unsigned.slice(prefixWithDash.length)
      if (!/^\d+(\.\d+)?$/.test(value)) continue
      const negativePrefix = isNegative ? '-' : ''

      // Exact match
      const exact = SPACING_MAP.get(value)
      if (exact) {
        return `${modifier}${negativePrefix}${prefix}-${exact.semantic}`
      }

      // Nearest match
      const nearest = findNearestSpacing(value)
      if (nearest.length > 0) {
        const hints = nearest
          .map((n) => `${negativePrefix}${prefix}-${n.semantic} (${n.rem})`)
          .join(' or ')
        return `nearest: ${hints}`
      }
    }
  }

  return undefined
}

/**
 * Suggest a semantic sizing token replacement for a non-semantic sizing class.
 *
 * Exact matches: "h-8" → "h-size-sm"
 * Near matches:  "h-9" → "nearest: h-size-sm (2rem) or h-size-md (2.5rem)"
 */
export function getSizingSuggestion(className: string): string | undefined {
  const modifier = className.match(/^((?:[\w-]+:)+)/)?.[0] || ''
  const clean = stripModifiers(className)

  for (const prefix of SIZING_PREFIXES) {
    const prefixWithDash = `${prefix}-`
    if (clean.startsWith(prefixWithDash)) {
      const value = clean.slice(prefixWithDash.length)
      if (!/^\d+(\.\d+)?$/.test(value)) continue

      // Exact match
      const exact = SIZING_MAP.get(value)
      if (exact) {
        return `${modifier}${prefix}-${exact.semantic}`
      }

      // Nearest match
      const nearest = findNearestSizing(value)
      if (nearest.length > 0) {
        const hints = nearest.map((n) => `${prefix}-${n.semantic} (${n.rem})`).join(' or ')
        return `nearest: ${hints}`
      }
    }
  }

  return undefined
}

/**
 * Check if a class uses non-semantic border styles (width/style hardcoded numbers instead of semantic tokens).
 * Non-semantic: border-2, border-4 (using numeric thickness)
 * Semantic: border (default 1px), border-line, border-thick, border-highlight
 */
export function isNonSemanticBorderClass(className: string): boolean {
  const clean = stripModifiers(className)

  // Check for border width classes with numeric values (border-2, border-4, etc.)
  // But allow semantic classes like border-line, border-thick, border-highlight
  const borderPattern = /^border(?:-[trblxy])?(?:-\d+)?$/
  if (borderPattern.test(clean)) {
    // Extract the numeric part if present
    const match = clean.match(/border(?:-[trblxy])?-(\d+)$/)
    if (match && match[1]) {
      const value = parseInt(match[1])
      // Border widths 2, 4, 8 are non-semantic
      // border-0 is allowed (removing border)
      // border or border-[trblxy] without number is default (1px)
      return value > 0
    }
  }

  return false
}

/**
 * Check if a class uses non-semantic shadow values.
 * Non-semantic: shadow, shadow-none (standard tailwind shadows without semantic meaning)
 * Semantic: shadow-sm, shadow-md, shadow-lg, shadow-interactive-*, shadow-inset-*
 */
export function isNonSemanticShadowClass(className: string): boolean {
  const clean = stripModifiers(className)

  // Check for non-semantic shadow classes
  // shadow (without suffix) and shadow-none are non-semantic
  // shadow-inner, shadow-xl, shadow-2xl are also non-semantic (standard Tailwind)
  if (clean === 'shadow' || clean === 'shadow-none' || clean === 'shadow-inner') {
    return true
  }

  // Check for non-semantic Tailwind shadow sizes
  if (clean === 'shadow-xl' || clean === 'shadow-2xl') {
    return true
  }

  return false
}

/**
 * Check if a value matches a palette color with shade (e.g., "primary-500", "neutral-200").
 */
function isColorClass(value: string): boolean {
  for (const palette of COLOR_PALETTES) {
    for (const shade of SHADES) {
      if (value === `${palette}-${shade}`) return true
    }
  }
  if (value === 'white' || value === 'black') return true
  return false
}

/**
 * Check if a class uses non-semantic gradient patterns.
 * Non-semantic: bg-gradient-to-*, from-*, via-*, to-* (arbitrary gradient construction)
 * Semantic: bg-gradient-primary, bg-gradient-primary-light, bg-gradient-status-*, bg-gradient-accent-*
 */
export function isNonSemanticGradientClass(className: string): boolean {
  const clean = stripModifiers(className)

  // Check for gradient direction classes (non-semantic)
  if (clean.startsWith('bg-gradient-to-')) {
    return true
  }

  // Check for gradient color stops (non-semantic)
  if (clean.startsWith('from-') || clean.startsWith('via-') || clean.startsWith('to-')) {
    // Extract the color part
    const colorPart = clean.replace(/^(from|via|to)-/, '')
    // If it's a palette color, it's non-semantic
    if (isColorClass(colorPart)) {
      return true
    }
  }

  return false
}

/**
 * Get suggestion for semantic border style replacement.
 */
export function getBorderSuggestion(className: string): string | undefined {
  const modifier = className.match(/^((?:[\w-]+:)+)/)?.[0] || ''
  const clean = stripModifiers(className)

  // Extract direction if present
  const directionMatch = clean.match(/^border-([trblxy])-(\d+)$/)
  if (directionMatch) {
    const direction = directionMatch[1]
    const value = parseInt(directionMatch[2]!)
    if (value === 1) {
      return `${modifier}border-${direction}-line`
    } else if (value === 2) {
      return `${modifier}border-${direction}-thick or ${modifier}border-${direction}-highlight`
    }
  }

  // No direction
  const match = clean.match(/^border-(\d+)$/)
  if (match) {
    const value = parseInt(match[1]!)
    if (value === 1) {
      return `${modifier}border-line`
    } else if (value === 2) {
      return `${modifier}border-thick or ${modifier}border-highlight`
    }
  }

  return undefined
}

/**
 * Get suggestion for semantic shadow replacement.
 */
export function getShadowSuggestion(className: string): string | undefined {
  const modifier = className.match(/^((?:[\w-]+:)+)/)?.[0] || ''
  const clean = stripModifiers(className)

  if (clean === 'shadow') {
    return `${modifier}shadow-sm or ${modifier}shadow-interactive`
  } else if (clean === 'shadow-none') {
    return `Remove class or use ${modifier}shadow-sm for minimal elevation`
  } else if (clean === 'shadow-inner') {
    return `${modifier}shadow-inset-sm or ${modifier}shadow-inset-md`
  } else if (clean === 'shadow-xl') {
    return `${modifier}shadow-lg`
  } else if (clean === 'shadow-2xl') {
    return `${modifier}shadow-lg`
  }

  return undefined
}

/**
 * Get suggestion for semantic gradient replacement.
 */
export function getGradientSuggestion(className: string): string | undefined {
  const clean = stripModifiers(className)

  if (clean.startsWith('bg-gradient-to-')) {
    return 'Use semantic gradients: bg-gradient-primary, bg-gradient-status-*, bg-gradient-accent-*'
  }

  if (clean.startsWith('from-') || clean.startsWith('via-') || clean.startsWith('to-')) {
    return 'Use pre-defined semantic gradients instead of constructing custom gradients'
  }

  return undefined
}

/**
 * Check if a Tailwind class uses non-semantic typography values.
 * Non-semantic: arbitrary font sizes, families, line heights, letter spacing, or oversized text
 * Semantic: text-xs through text-4xl, font-sans, font-mono, standard line-height and tracking utilities
 */
export function isNonSemanticTypographyClass(className: string): boolean {
  const clean = stripModifiers(className)

  // Check for arbitrary font size values
  if (/^text-\[.+\]$/.test(clean)) return true

  // Check for non-standard text sizes (5xl and above)
  if (/^text-(5|6|7|8|9)xl$/.test(clean)) return true

  // Check for arbitrary font family
  if (/^font-\[.+\]$/.test(clean)) return true

  // Check for arbitrary line height
  if (/^leading-\[.+\]$/.test(clean)) return true

  // Check for arbitrary letter spacing
  if (/^tracking-\[.+\]$/.test(clean)) return true

  return false
}

/**
 * Get suggestion for semantic typography replacement.
 */
export function getTypographySuggestion(className: string): string | undefined {
  const clean = stripModifiers(className)

  if (/^text-\[.+\]$/.test(clean)) {
    return 'Use semantic font sizes: text-xs through text-4xl'
  }

  if (/^text-(5|6|7|8|9)xl$/.test(clean)) {
    return 'Use text-4xl for maximum size, or consider if this is truly needed'
  }

  if (/^font-\[.+\]$/.test(clean)) {
    return 'Use font-sans or font-mono'
  }

  if (/^leading-\[.+\]$/.test(clean)) {
    return 'Use standard line-height utilities: leading-none, leading-tight, leading-snug, leading-normal, leading-relaxed, or leading-loose'
  }

  if (/^tracking-\[.+\]$/.test(clean)) {
    return 'Use standard letter-spacing utilities: tracking-tighter through tracking-widest'
  }

  return undefined
}

/**
 * Check if a Tailwind class uses non-semantic border radius values.
 * Non-semantic: arbitrary values, rounded-2xl, rounded-3xl
 * Semantic: rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-none, rounded-full
 */
export function isNonSemanticBorderRadiusClass(className: string): boolean {
  const clean = stripModifiers(className)

  // Check for rounded classes
  if (!clean.startsWith('rounded')) return false

  // Extract the value part after 'rounded'
  const valuePart = clean.replace(/^rounded/, '')

  // No suffix means default (rounded-md) - allowed
  if (valuePart === '') return false

  // Check for directional prefixes (-t, -r, -b, -l, -tl, -tr, -br, -bl)
  const directionMatch = valuePart.match(/^-(tl|tr|br|bl|t|r|b|l)(-|$)/)
  const actualValue = directionMatch ? valuePart.slice(directionMatch[0].length - 1) : valuePart

  // If just the direction with no value, it's default (allowed)
  if (actualValue === '') return false

  // Remove the dash prefix if present
  const value = actualValue.startsWith('-') ? actualValue.slice(1) : actualValue

  // Allowed semantic values
  const allowedValues = ['none', 'sm', 'md', 'lg', 'xl', 'full']
  if (allowedValues.includes(value)) return false

  // Check for arbitrary values [...]
  if (/^\[.+\]$/.test(value)) return true

  // Check for non-semantic sizes (2xl, 3xl, or numeric)
  if (/^(2|3)xl$/.test(value) || /^\d+$/.test(value)) return true

  return false
}

/**
 * Get suggestion for semantic border radius replacement.
 */
export function getBorderRadiusSuggestion(className: string): string | undefined {
  const clean = stripModifiers(className)

  // Check if it's a rounded class
  if (!clean.startsWith('rounded')) return undefined

  // Extract the value part after 'rounded'
  const afterRounded = clean.slice(7) // 'rounded' is 7 chars

  // Check for directional prefixes (-t, -r, -b, -l, -tl, -tr, -br, -bl)
  let direction = ''
  let value = afterRounded

  const directionMatch = afterRounded.match(/^-(tl|tr|br|bl|t|r|b|l)(.*)$/)
  if (directionMatch) {
    direction = `-${directionMatch[1]}`
    value = directionMatch[2] || ''
  }

  // Remove leading dash from value if present
  if (value.startsWith('-')) {
    value = value.slice(1)
  }

  // Check for arbitrary values [...]
  if (/^\[.+\]$/.test(value)) {
    return `Use semantic border radius: rounded${direction}-sm, rounded${direction}-md, rounded${direction}-lg, or rounded${direction}-xl`
  }

  // Check for oversized values
  if (value === '2xl') {
    return `rounded${direction}-xl (0.75rem) or rounded${direction}-full for pills/circles`
  }

  if (value === '3xl') {
    return `rounded${direction}-xl (0.75rem) or rounded${direction}-full for pills/circles`
  }

  return undefined
}

// Re-export TOKEN_METADATA for convenience
export { TOKEN_METADATA }
