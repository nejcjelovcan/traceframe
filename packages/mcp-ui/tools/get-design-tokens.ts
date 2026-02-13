import { z } from 'zod'

import { getDesignTokens, type DesignTokens } from '../utils/design-tokens.js'

/**
 * Valid token types that can be requested.
 */
export const TOKEN_TYPES = ['colors', 'typography', 'sizing', 'spacing', 'all'] as const
export type TokenType = (typeof TOKEN_TYPES)[number]

/**
 * Input schema for get_design_tokens tool.
 */
export const getDesignTokensInputSchema = {
  type: z
    .enum(TOKEN_TYPES)
    .optional()
    .describe(
      'Filter by token type (optional). Options: colors, typography, sizing, spacing, all. Defaults to all.'
    ),
}

/**
 * Description for the get_design_tokens tool.
 */
export const getDesignTokensDescription =
  'Get design tokens from ui-library with metadata. Returns semantic colors (theme-aware tokens for surfaces, text, borders, etc.), typography (font families and sizes), sizing (element height/width tokens), and spacing values. Note: Palette colors are not exposed as UI code should only use semantic tokens.'

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
      case 'all':
      default:
        tokens = allTokens
        summary = `Retrieved all design tokens: ${Object.keys(allTokens.colors.semantic).length} semantic color groups, ${Object.keys(allTokens.typography.fontSize).length} font sizes, ${Object.keys(allTokens.sizing).length} sizing values, ${Object.keys(allTokens.spacing).length} spacing values`
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
