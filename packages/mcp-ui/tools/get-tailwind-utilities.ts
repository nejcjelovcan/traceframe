import { z } from 'zod'

import { TOKEN_METADATA } from '@traceframe/ui-library'

/**
 * Valid utility category types that can be requested.
 */
export const UTILITY_CATEGORIES = ['spacing', 'colors', 'typography', 'layout', 'all'] as const
export type UtilityCategory = (typeof UTILITY_CATEGORIES)[number]

/**
 * Input schema for get_tailwind_utilities tool.
 */
export const getTailwindUtilitiesInputSchema = {
  category: z
    .enum(UTILITY_CATEGORIES)
    .optional()
    .describe(
      'Filter by category (optional). Options: spacing, colors, typography, layout, all. Defaults to all.'
    ),
}

/**
 * Description for the get_tailwind_utilities tool.
 */
export const getTailwindUtilitiesDescription =
  'Get Tailwind CSS utility classes organized by purpose. Returns project-specific classes (semantic colors, custom spacing) and commonly used standard Tailwind classes for spacing, colors, typography, and layout.'

/**
 * Input arguments for getTailwindUtilitiesTool function.
 */
export interface GetTailwindUtilitiesInput {
  category?: UtilityCategory
}

/**
 * Spacing utilities structure.
 */
export interface SpacingUtilities {
  padding: string[]
  margin: string[]
  gap: string[]
  semanticSpacing: string[]
  sizing: string[]
  custom: Record<string, string>
}

/**
 * Color utilities structure.
 */
export interface ColorUtilities {
  text: string[]
  background: string[]
  border: string[]
}

/**
 * Typography utilities structure.
 */
export interface TypographyUtilities {
  size: string[]
  weight: string[]
  family: string[]
}

/**
 * Layout utilities structure.
 */
export interface LayoutUtilities {
  display: string[]
  flexDirection: string[]
  justify: string[]
  align: string[]
  grid: string[]
}

/**
 * All utilities structure.
 */
export interface Utilities {
  spacing?: SpacingUtilities
  colors?: ColorUtilities
  typography?: TypographyUtilities
  layout?: LayoutUtilities
}

/**
 * Result type for getTailwindUtilitiesTool.
 */
export interface GetTailwindUtilitiesResult {
  /** Whether the operation succeeded */
  success: boolean
  /** The utilities organized by category */
  utilities: Utilities
  /** Human-readable summary */
  summary: string
}

/**
 * Generate spacing utilities.
 */
function getSpacingUtilities(): SpacingUtilities {
  // Standard Tailwind spacing scale used in this project
  const scales = [
    '0',
    '0.5',
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '14',
    '16',
    '18',
    '20',
    '22',
    '24',
  ]

  const paddingClasses = [
    // All sides
    ...scales.map((s) => `p-${s}`),
    // X/Y axis
    ...scales.map((s) => `px-${s}`),
    ...scales.map((s) => `py-${s}`),
    // Individual sides
    ...scales.map((s) => `pt-${s}`),
    ...scales.map((s) => `pr-${s}`),
    ...scales.map((s) => `pb-${s}`),
    ...scales.map((s) => `pl-${s}`),
  ]

  const marginClasses = [
    // All sides
    ...scales.map((s) => `m-${s}`),
    'm-auto',
    // X/Y axis
    ...scales.map((s) => `mx-${s}`),
    'mx-auto',
    ...scales.map((s) => `my-${s}`),
    'my-auto',
    // Individual sides
    ...scales.map((s) => `mt-${s}`),
    ...scales.map((s) => `mr-${s}`),
    ...scales.map((s) => `mb-${s}`),
    ...scales.map((s) => `ml-${s}`),
    // Negative margins
    ...scales.filter((s) => s !== '0').map((s) => `-m-${s}`),
    ...scales.filter((s) => s !== '0').map((s) => `-mx-${s}`),
    ...scales.filter((s) => s !== '0').map((s) => `-my-${s}`),
    ...scales.filter((s) => s !== '0').map((s) => `-mt-${s}`),
    ...scales.filter((s) => s !== '0').map((s) => `-mr-${s}`),
    ...scales.filter((s) => s !== '0').map((s) => `-mb-${s}`),
    ...scales.filter((s) => s !== '0').map((s) => `-ml-${s}`),
  ]

  const gapClasses = scales.map((s) => `gap-${s}`)

  // Semantic spacing tokens (theme-aware)
  const semanticScales = ['2xs', 'xs', 'sm', 'md', 'base', 'lg', 'xl', '2xl']
  const semanticSpacing = [
    ...semanticScales.map((s) => `p-${s}`),
    ...semanticScales.map((s) => `px-${s}`),
    ...semanticScales.map((s) => `py-${s}`),
    ...semanticScales.map((s) => `m-${s}`),
    ...semanticScales.map((s) => `mx-${s}`),
    ...semanticScales.map((s) => `my-${s}`),
    ...semanticScales.map((s) => `gap-${s}`),
  ]

  // Element sizing tokens (theme-aware heights/widths)
  const sizingScales = ['xs', 'sm', 'md', 'lg', 'xl']
  const sizing = [
    ...sizingScales.map((s) => `h-size-${s}`),
    ...sizingScales.map((s) => `w-size-${s}`),
  ]

  // Custom spacing from the project
  const custom: Record<string, string> = {
    '18': '4.5rem',
    '22': '5.5rem',
  }

  return {
    padding: paddingClasses,
    margin: marginClasses,
    gap: gapClasses,
    semanticSpacing,
    sizing,
    custom,
  }
}

/**
 * Generate color utilities based on project tokens.
 */
function getColorUtilities(): ColorUtilities {
  // Semantic color classes
  const semanticText = ['text-foreground', 'text-foreground-muted']
  const semanticBg = ['bg-surface', 'bg-surface-muted', 'bg-surface-subtle']
  const semanticBorder = ['border-border', 'border-border-muted']

  // Generate palette-based classes from TOKEN_METADATA
  const paletteText: string[] = []
  const paletteBg: string[] = []
  const paletteBorder: string[] = []

  for (const [paletteName, meta] of Object.entries(TOKEN_METADATA.palettes)) {
    for (const shade of meta.shades) {
      paletteText.push(`text-${paletteName}-${shade}`)
      paletteBg.push(`bg-${paletteName}-${shade}`)
      paletteBorder.push(`border-${paletteName}-${shade}`)
    }
  }

  return {
    text: [...semanticText, ...paletteText],
    background: [...semanticBg, ...paletteBg],
    border: [...semanticBorder, ...paletteBorder],
  }
}

/**
 * Generate typography utilities.
 */
function getTypographyUtilities(): TypographyUtilities {
  return {
    size: [
      'text-xs',
      'text-sm',
      'text-base',
      'text-lg',
      'text-xl',
      'text-2xl',
      'text-3xl',
      'text-4xl',
    ],
    weight: [
      'font-thin',
      'font-extralight',
      'font-light',
      'font-normal',
      'font-medium',
      'font-semibold',
      'font-bold',
      'font-extrabold',
      'font-black',
    ],
    family: ['font-sans', 'font-mono'],
  }
}

/**
 * Generate layout utilities.
 */
function getLayoutUtilities(): LayoutUtilities {
  return {
    display: [
      'block',
      'inline-block',
      'inline',
      'flex',
      'inline-flex',
      'grid',
      'inline-grid',
      'hidden',
    ],
    flexDirection: ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse'],
    justify: [
      'justify-start',
      'justify-end',
      'justify-center',
      'justify-between',
      'justify-around',
      'justify-evenly',
    ],
    align: ['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch'],
    grid: [
      'grid-cols-1',
      'grid-cols-2',
      'grid-cols-3',
      'grid-cols-4',
      'grid-cols-5',
      'grid-cols-6',
      'grid-cols-12',
      'grid-rows-1',
      'grid-rows-2',
      'grid-rows-3',
      'grid-rows-4',
      'grid-rows-5',
      'grid-rows-6',
    ],
  }
}

/**
 * Get Tailwind CSS utility classes organized by purpose.
 *
 * @param args - Input arguments
 * @returns Result with utilities organized by category
 */
export function getTailwindUtilitiesTool(
  args: GetTailwindUtilitiesInput
): GetTailwindUtilitiesResult {
  const category = args.category ?? 'all'
  const utilities: Utilities = {}
  const counts: string[] = []

  if (category === 'all' || category === 'spacing') {
    utilities.spacing = getSpacingUtilities()
    counts.push(
      `${utilities.spacing.padding.length + utilities.spacing.margin.length + utilities.spacing.gap.length + utilities.spacing.semanticSpacing.length + utilities.spacing.sizing.length} spacing classes`
    )
  }

  if (category === 'all' || category === 'colors') {
    utilities.colors = getColorUtilities()
    counts.push(
      `${utilities.colors.text.length + utilities.colors.background.length + utilities.colors.border.length} color classes`
    )
  }

  if (category === 'all' || category === 'typography') {
    utilities.typography = getTypographyUtilities()
    counts.push(
      `${utilities.typography.size.length + utilities.typography.weight.length + utilities.typography.family.length} typography classes`
    )
  }

  if (category === 'all' || category === 'layout') {
    utilities.layout = getLayoutUtilities()
    counts.push(
      `${utilities.layout.display.length + utilities.layout.flexDirection.length + utilities.layout.justify.length + utilities.layout.align.length + utilities.layout.grid.length} layout classes`
    )
  }

  const summary = `Retrieved ${counts.join(', ')}`

  return {
    success: true,
    utilities,
    summary,
  }
}
