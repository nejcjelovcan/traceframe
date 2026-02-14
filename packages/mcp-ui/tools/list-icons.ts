import { z } from 'zod'

import {
  CATEGORY_LABELS,
  getIconsByCategory,
  ICON_METADATA,
  SIZE_MAP,
  type IconCategory,
  type IconMeta,
  type IconName,
} from '@nejcjelovcan/traceframe-ui-library'

/** All valid icon categories */
const ICON_CATEGORIES = [
  'navigation',
  'action',
  'status',
  'sorting',
  'theme',
  'entity',
  'code',
  'data',
  'agentic',
  'brand',
  'developer',
] as const

/**
 * Input schema for list_icons tool.
 */
export const listIconsInputSchema = {
  category: z
    .enum(ICON_CATEGORIES)
    .optional()
    .describe(
      'Filter by category (optional). Options: navigation, action, status, sorting, theme, entity, code, data, agentic, brand, developer'
    ),
}

/**
 * Description for the list_icons tool.
 */
export const listIconsDescription =
  'List all icons with descriptions. Optionally filter by category. Includes category labels and size reference.'

/**
 * Input arguments for listIconsTool function.
 */
export interface ListIconsInput {
  category?: string
}

/**
 * Icon summary for list output.
 */
export interface IconSummary {
  name: string
  description: string
  category: string
}

/**
 * Result type for listIconsTool.
 */
export interface ListIconsResult {
  /** Whether the operation succeeded */
  success: boolean
  /** List of icon summaries */
  icons: IconSummary[]
  /** Category labels for reference */
  categories: Record<string, string>
  /** Size presets for reference */
  sizes: Record<string, number>
  /** Number of icons */
  count: number
  /** Human-readable summary */
  summary: string
  /** Error message if operation failed */
  error?: string
}

/**
 * List all icons with descriptions.
 *
 * @param args - Input arguments
 * @returns Result with list of icons
 */
export async function listIconsTool(args: ListIconsInput): Promise<ListIconsResult> {
  try {
    let iconNames: IconName[]

    if (args.category) {
      // Validate category
      if (!ICON_CATEGORIES.includes(args.category as IconCategory)) {
        return {
          success: false,
          icons: [],
          categories: CATEGORY_LABELS,
          sizes: SIZE_MAP,
          count: 0,
          summary: `Invalid category "${args.category}"`,
          error: `Invalid category. Valid options: ${ICON_CATEGORIES.join(', ')}`,
        }
      }
      iconNames = getIconsByCategory(args.category as IconCategory)
    } else {
      iconNames = Object.keys(ICON_METADATA) as IconName[]
    }

    const icons: IconSummary[] = iconNames.map((name) => {
      const meta: IconMeta = ICON_METADATA[name]
      return {
        name,
        description: meta.description,
        category: meta.category,
      }
    })

    if (icons.length === 0) {
      return {
        success: true,
        icons: [],
        categories: CATEGORY_LABELS,
        sizes: SIZE_MAP,
        count: 0,
        summary: args.category ? `No icons found in category "${args.category}"` : 'No icons found',
      }
    }

    // Group by category for summary
    const categoryCounts = new Map<string, number>()
    for (const icon of icons) {
      categoryCounts.set(icon.category, (categoryCounts.get(icon.category) || 0) + 1)
    }

    const summary = args.category
      ? `Found ${icons.length} icon(s) in "${args.category}" category`
      : `Found ${icons.length} icon(s) across ${categoryCounts.size} categories`

    return {
      success: true,
      icons,
      categories: CATEGORY_LABELS,
      sizes: SIZE_MAP,
      count: icons.length,
      summary,
    }
  } catch (error) {
    return {
      success: false,
      icons: [],
      categories: CATEGORY_LABELS,
      sizes: SIZE_MAP,
      count: 0,
      summary: 'Failed to list icons',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
