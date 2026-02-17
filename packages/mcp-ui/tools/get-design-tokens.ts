import { z } from 'zod'

import { getDesignTokens, type DesignTokens } from '../utils/design-tokens.js'

/**
 * Valid token types that can be requested.
 */
export const TOKEN_TYPES = [
  'colors',
  'typography',
  'sizing',
  'spacing',
  'shadows',
  'borders',
  'radius',
  'gradients',
  'all',
] as const
export type TokenType = (typeof TOKEN_TYPES)[number]

/**
 * Input schema for get_design_tokens tool.
 */
export const getDesignTokensInputSchema = {
  type: z
    .enum(TOKEN_TYPES)
    .optional()
    .describe(
      'Filter by token type (optional). Options: colors, typography, sizing, spacing, shadows, borders, radius, gradients, all. Defaults to all.'
    ),
}

/**
 * Description for the get_design_tokens tool.
 */
export const getDesignTokensDescription =
  'Get design tokens from ui-library with metadata. Returns semantic colors (theme-aware tokens for surfaces, text, borders, etc.), typography (font families and sizes), sizing (element height/width tokens), spacing values, shadows (elevation and interactive states), border styles (line, thick, highlight), border radius (sm, md, lg, xl), and gradients (semantic with light/dark variants for emphasis surfaces; values shown are from light mode). Note: Palette colors are not exposed as UI code should only use semantic tokens.'

/**
 * Input arguments for getDesignTokensTool function.
 */
export interface GetDesignTokensInput {
  type?: TokenType
}

/**
 * Result type for getDesignTokensTool.
 */
export interface GetDesignTokensResult {
  /** Whether the operation succeeded */
  success: boolean
  /** The design tokens (filtered by type if specified) */
  tokens: Partial<DesignTokens>
  /** Human-readable summary */
  summary: string
  /** Error message if operation failed */
  error?: string
}

/**
 * Get design tokens from ui-library with metadata.
 *
 * @param args - Input arguments
 * @returns Result with design tokens
 */
export async function getDesignTokensTool(
  args: GetDesignTokensInput
): Promise<GetDesignTokensResult> {
  try {
    const allTokens = await getDesignTokens()
    const tokenType = args.type ?? 'all'

    let tokens: Partial<DesignTokens>
    let summary: string

    switch (tokenType) {
      case 'colors':
        tokens = { colors: allTokens.colors }
        summary = `Retrieved color tokens: ${Object.keys(allTokens.colors.semantic).length} semantic token groups`
        break
      case 'typography':
        tokens = { typography: allTokens.typography }
        summary = `Retrieved typography tokens: ${Object.keys(allTokens.typography.fontFamily).length} font families, ${Object.keys(allTokens.typography.fontSize).length} font sizes`
        break
      case 'sizing':
        tokens = { sizing: allTokens.sizing }
        summary = `Retrieved sizing tokens: ${Object.keys(allTokens.sizing).length} element sizing values`
        break
      case 'spacing':
        tokens = { spacing: allTokens.spacing }
        summary = `Retrieved spacing tokens: ${Object.keys(allTokens.spacing).length} custom spacing values`
        break
      case 'shadows':
        tokens = { shadows: allTokens.shadows }
        summary = `Retrieved shadow tokens: ${Object.keys(allTokens.shadows).length} shadow values`
        break
      case 'borders':
        tokens = { borders: allTokens.borders }
        summary = `Retrieved border style tokens: ${Object.keys(allTokens.borders).length} border styles`
        break
      case 'radius':
        tokens = { borderRadius: allTokens.borderRadius }
        summary = `Retrieved border radius tokens: ${Object.keys(allTokens.borderRadius).length} border radius values`
        break
      case 'gradients':
        tokens = { gradients: allTokens.gradients }
        summary = `Retrieved gradient tokens: ${Object.keys(allTokens.gradients).length} gradient tokens (semantic with light/dark variants; values shown are from light mode)`
        break
      case 'all':
      default:
        tokens = allTokens
        summary = `Retrieved all design tokens: ${Object.keys(allTokens.colors.semantic).length} semantic color groups, ${Object.keys(allTokens.typography.fontSize).length} font sizes, ${Object.keys(allTokens.sizing).length} sizing values, ${Object.keys(allTokens.spacing).length} spacing values, ${Object.keys(allTokens.shadows).length} shadow values, ${Object.keys(allTokens.borders).length} border styles, ${Object.keys(allTokens.borderRadius).length} border radius values, ${Object.keys(allTokens.gradients).length} gradient tokens`
        break
    }

    return {
      success: true,
      tokens,
      summary,
    }
  } catch (error) {
    return {
      success: false,
      tokens: {},
      summary: 'Failed to get design tokens',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
