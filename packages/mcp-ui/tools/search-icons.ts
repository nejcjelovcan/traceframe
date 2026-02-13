import { z } from 'zod'

import { searchIcons } from '@traceframe/ui-library'

/**
 * Input schema for search_icons tool.
 */
export const searchIconsInputSchema = {
  query: z.string().describe('Search query to match against icon names, descriptions, or aliases'),
}

/**
 * Description for the search_icons tool.
 */
export const searchIconsDescription =
  'Search icons by name, description, or aliases. Returns matching icon names.'

/**
 * Input arguments for searchIconsTool function.
 */
export interface SearchIconsInput {
  query: string
}

/**
 * Result type for searchIconsTool.
 */
export interface SearchIconsResult {
  /** Whether the operation succeeded */
  success: boolean
  /** List of matching icon names */
  icons: string[]
  /** Number of matching icons */
  count: number
  /** Human-readable summary */
  summary: string
  /** Error message if operation failed */
  error?: string
}

/**
 * Search icons by name, description, or aliases.
 *
 * @param args - Input arguments
 * @returns Result with list of matching icons
 */
export async function searchIconsTool(args: SearchIconsInput): Promise<SearchIconsResult> {
  const { query } = args

  if (!query || query.trim() === '') {
    return {
      success: false,
      icons: [],
      count: 0,
      summary: 'Search query is required',
      error: 'query parameter is required and must be non-empty',
    }
  }

  try {
    const icons = searchIcons(query.trim())

    if (icons.length === 0) {
      return {
        success: true,
        icons: [],
        count: 0,
        summary: `No icons found matching "${query}"`,
      }
    }

    return {
      success: true,
      icons,
      count: icons.length,
      summary: `Found ${icons.length} icon(s) matching "${query}"`,
    }
  } catch (error) {
    return {
      success: false,
      icons: [],
      count: 0,
      summary: 'Failed to search icons',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
