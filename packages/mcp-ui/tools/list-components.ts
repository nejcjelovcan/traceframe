import { z } from 'zod'

import {
  COMPONENT_CATEGORIES,
  getAllComponents,
  type ComponentSummary,
} from '../utils/storybook-parser.js'

/**
 * Input schema for list_components tool.
 */
export const listComponentsInputSchema = {
  category: z
    .enum(COMPONENT_CATEGORIES)
    .optional()
    .describe(
      'Filter by category (optional). Options: primitives, layout, data, feedback, selection, behavioral, foundation'
    ),
}

/**
 * Description for the list_components tool.
 */
export const listComponentsDescription =
  'List all ui-library components with summaries. Optionally filter by category.'

/**
 * Input arguments for listComponentsTool function.
 */
export interface ListComponentsInput {
  category?: string
}

/**
 * Result type for listComponentsTool.
 */
export interface ListComponentsResult {
  /** Whether the operation succeeded */
  success: boolean
  /** List of component summaries */
  components: ComponentSummary[]
  /** Total count of components */
  count: number
  /** Human-readable summary */
  summary: string
  /** Error message if operation failed */
  error?: string
}

/**
 * List all ui-library components with summaries.
 *
 * @param args - Input arguments
 * @returns Result with list of components
 */
export async function listComponentsTool(args: ListComponentsInput): Promise<ListComponentsResult> {
  try {
    const components = await getAllComponents(args.category)

    if (components.length === 0) {
      return {
        success: true,
        components: [],
        count: 0,
        summary: args.category
          ? `No components found in category "${args.category}"`
          : 'No components found',
      }
    }

    // Group by category for summary
    const categories = new Set(components.map((c) => c.category))
    const tier1Count = components.filter((c) => c.tier === 1).length
    const tier2Count = components.filter((c) => c.tier === 2).length

    const summary = args.category
      ? `Found ${components.length} component(s) in "${args.category}" category (Tier 1: ${tier1Count}, Tier 2: ${tier2Count})`
      : `Found ${components.length} component(s) across ${categories.size} categories (Tier 1: ${tier1Count}, Tier 2: ${tier2Count})`

    return {
      success: true,
      components,
      count: components.length,
      summary,
    }
  } catch (error) {
    return {
      success: false,
      components: [],
      count: 0,
      summary: 'Failed to list components',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
