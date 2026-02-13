import { z } from 'zod'

import { TOKEN_METADATA } from '@nejcjelovcan/traceframe-ui-library'

/**
 * Valid utility category types that can be requested.
 */
export const UTILITY_CATEGORIES = [
  'colors',
  'spacing',
  'sizing',
  'typography',
  'borders',
  'shadows',
  'all',
] as const
export type UtilityCategory = (typeof UTILITY_CATEGORIES)[number]

/**
 * Input schema for get_tailwind_utilities tool.
 */
export const getTailwindUtilitiesInputSchema = {
  category: z
    .enum(UTILITY_CATEGORIES)
    .optional()
    .describe(
      'Filter by category (optional). Options: colors, spacing, sizing, typography, borders, shadows, all. Defaults to all.'
    ),
}

/**
 * Description for the get_tailwind_utilities tool.
 */
export const getTailwindUtilitiesDescription =
  'Get project-specific Tailwind CSS utility classes derived from design tokens. Returns semantic colors, custom spacing, sizing, typography, border radius, and shadow utilities with descriptions. Does NOT return standard Tailwind classes that any AI already knows.'

/**
 * Input arguments for getTailwindUtilitiesTool function.
 */
export interface GetTailwindUtilitiesInput {
  category?: UtilityCategory
}

/**
 * A single token entry with description and example classes.
 */
export interface TokenEntry {
  name: string
  value: string
  description: string
  classes: string[]
}

/**
 * A semantic color group with its variants.
 */
export interface SemanticColorGroup {
  group: string
  description?: string
  variants: SemanticColorVariant[]
}

/**
 * A single semantic color variant with its utility classes.
 */
export interface SemanticColorVariant {
  name: string
  description?: string
  classes: string[]
}

/**
 * A palette with its shades.
 */
export interface PaletteEntry {
  name: string
  description: string
  usage: string
  shades: readonly number[]
  exampleClasses: string[]
}

/**
 * Color utilities structure.
 */
export interface ColorUtilities {
  semantic: SemanticColorGroup[]
  palettes: PaletteEntry[]
}

/**
 * All utilities structure.
 */
export interface Utilities {
  colors?: ColorUtilities
  spacing?: TokenEntry[]
  sizing?: TokenEntry[]
  typography?: TokenEntry[]
  borders?: TokenEntry[]
  shadows?: TokenEntry[]
}

/**
 * Result type for getTailwindUtilitiesTool.
 */
export interface GetTailwindUtilitiesResult {
  success: boolean
  utilities: Utilities
  summary: string
}

/**
 * Build the Tailwind class name for a semantic color variant.
 */
function semanticClassName(group: string, variant: string): string {
  if (variant === 'DEFAULT') return group
  return `${group}-${variant}`
}

/**
 * Generate color utilities from TOKEN_METADATA.semantic and TOKEN_METADATA.palettes.
 */
function getColorUtilities(): ColorUtilities {
  const semantic: SemanticColorGroup[] = []

  for (const [groupName, groupMeta] of Object.entries(TOKEN_METADATA.semantic)) {
    // Skip shadow from colors - it's in the shadows category
    if (groupName === 'shadow') continue

    const variants: SemanticColorVariant[] = []
    for (const [variantName, variantDescription] of Object.entries(groupMeta.variants)) {
      const tokenName = semanticClassName(groupName, variantName)
      const classes = [`bg-${tokenName}`, `text-${tokenName}`, `border-${tokenName}`]
      variants.push({
        name: variantName,
        description: variantDescription,
        classes,
      })
    }

    semantic.push({
      group: groupName,
      description: groupMeta.description,
      variants,
    })
  }

  const palettes: PaletteEntry[] = []
  for (const [paletteName, meta] of Object.entries(TOKEN_METADATA.palettes)) {
    palettes.push({
      name: paletteName,
      description: meta.description,
      usage: meta.usage,
      shades: meta.shades,
      exampleClasses: [
        `bg-${paletteName}-500`,
        `text-${paletteName}-500`,
        `border-${paletteName}-500`,
      ],
    })
  }

  return { semantic, palettes }
}

/**
 * Generate spacing utilities from TOKEN_METADATA.theme.spacing.
 */
function getSpacingUtilities(): TokenEntry[] {
  const entries: TokenEntry[] = []
  for (const [name, meta] of Object.entries(TOKEN_METADATA.theme.spacing)) {
    entries.push({
      name,
      value: meta.value,
      description: meta.description,
      classes: [
        `p-${name}`,
        `px-${name}`,
        `py-${name}`,
        `m-${name}`,
        `mx-${name}`,
        `my-${name}`,
        `gap-${name}`,
        `space-x-${name}`,
        `space-y-${name}`,
      ],
    })
  }
  return entries
}

/**
 * Generate sizing utilities from TOKEN_METADATA.theme.size.
 */
function getSizingUtilities(): TokenEntry[] {
  const entries: TokenEntry[] = []
  for (const [name, meta] of Object.entries(TOKEN_METADATA.theme.size)) {
    entries.push({
      name,
      value: meta.value,
      description: meta.description,
      classes: [`h-size-${name}`, `w-size-${name}`, `min-h-size-${name}`, `min-w-size-${name}`],
    })
  }
  return entries
}

/**
 * Generate typography utilities from TOKEN_METADATA.theme.fontFamily and fontSize.
 */
function getTypographyUtilities(): TokenEntry[] {
  const entries: TokenEntry[] = []

  for (const [name, meta] of Object.entries(TOKEN_METADATA.theme.fontFamily)) {
    entries.push({
      name: `font-${name}`,
      value: meta.value,
      description: meta.description,
      classes: [`font-${name}`],
    })
  }

  for (const [name, meta] of Object.entries(TOKEN_METADATA.theme.fontSize)) {
    entries.push({
      name: `text-${name}`,
      value: `${meta.value} / ${meta.lineHeight}`,
      description: meta.description,
      classes: [`text-${name}`],
    })
  }

  return entries
}

/**
 * Generate border radius utilities from TOKEN_METADATA.theme.borderRadius.
 */
function getBorderUtilities(): TokenEntry[] {
  const entries: TokenEntry[] = []
  for (const [name, meta] of Object.entries(TOKEN_METADATA.theme.borderRadius)) {
    const isDefault = 'isDefault' in meta && meta.isDefault
    entries.push({
      name: `rounded-${name}`,
      value: meta.value,
      description: `${meta.description}${isDefault ? ' (default)' : ''}`,
      classes: [`rounded-${name}`],
    })
  }
  return entries
}

/**
 * Generate shadow utilities from TOKEN_METADATA.theme.shadow.
 */
function getShadowUtilities(): TokenEntry[] {
  const entries: TokenEntry[] = []
  for (const [name, meta] of Object.entries(TOKEN_METADATA.theme.shadow)) {
    entries.push({
      name: `shadow-${name}`,
      value: meta.value,
      description: meta.description,
      classes: [`shadow-${name}`],
    })
  }
  return entries
}

/**
 * Count total entries for a category.
 */
function countEntries(utilities: Utilities): string[] {
  const counts: string[] = []
  if (utilities.colors) {
    const variantCount = utilities.colors.semantic.reduce((sum, g) => sum + g.variants.length, 0)
    counts.push(
      `${variantCount} semantic color variants, ${utilities.colors.palettes.length} palettes`
    )
  }
  if (utilities.spacing) counts.push(`${utilities.spacing.length} spacing tokens`)
  if (utilities.sizing) counts.push(`${utilities.sizing.length} sizing tokens`)
  if (utilities.typography) counts.push(`${utilities.typography.length} typography tokens`)
  if (utilities.borders) counts.push(`${utilities.borders.length} border radius tokens`)
  if (utilities.shadows) counts.push(`${utilities.shadows.length} shadow tokens`)
  return counts
}

/**
 * Get Tailwind CSS utility classes organized by purpose.
 * All output is derived from TOKEN_METADATA - no hardcoded standard Tailwind classes.
 */
export function getTailwindUtilitiesTool(
  args: GetTailwindUtilitiesInput
): GetTailwindUtilitiesResult {
  const category = args.category ?? 'all'
  const utilities: Utilities = {}

  if (category === 'all' || category === 'colors') {
    utilities.colors = getColorUtilities()
  }

  if (category === 'all' || category === 'spacing') {
    utilities.spacing = getSpacingUtilities()
  }

  if (category === 'all' || category === 'sizing') {
    utilities.sizing = getSizingUtilities()
  }

  if (category === 'all' || category === 'typography') {
    utilities.typography = getTypographyUtilities()
  }

  if (category === 'all' || category === 'borders') {
    utilities.borders = getBorderUtilities()
  }

  if (category === 'all' || category === 'shadows') {
    utilities.shadows = getShadowUtilities()
  }

  const counts = countEntries(utilities)
  const summary = `Retrieved ${counts.join(', ')}`

  return {
    success: true,
    utilities,
    summary,
  }
}
