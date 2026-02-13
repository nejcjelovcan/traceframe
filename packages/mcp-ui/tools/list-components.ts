import { z } from 'zod'

import { COMPONENT_METADATA, type ComponentMeta } from '@nejcjelovcan/traceframe-ui-library'

const COMPONENT_CATEGORIES = [
  'primitives',
  'layout',
  'data',
  'feedback',
  'selection',
  'behavioral',
  'foundation',
] as const

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
 * Summary of a component for listing.
 */
export interface ComponentSummary {
  name: string
  category: string
  tier: 1 | 2
  tierLabel: string
  description: string
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

function toSummary(meta: ComponentMeta): ComponentSummary {
  return {
    name: meta.name,
    category: meta.category,
    tier: meta.tier,
    tierLabel: meta.tierLabel,
    description: meta.description,
  }
}

/**
 * List all ui-library components with summaries.
 *
 * @param args - Input arguments
 * @returns Result with list of components
 */
export async function listComponentsTool(args: ListComponentsInput): Promise<ListComponentsResult> {
  const allComponents = Object.values(COMPONENT_METADATA)
  const components = args.category
    ? allComponents.filter((c) => c.category === args.category).map(toSummary)
    : allComponents.map(toSummary)

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
}
