import { z } from 'zod'

import { getComponentByName, type ComponentDetails } from '../utils/storybook-parser.js'

/**
 * Input schema for get_component tool.
 */
export const getComponentInputSchema = {
  name: z.string().describe('Component name (e.g., "Button", "Card", "Select", "Icon")'),
}

/**
 * Description for the get_component tool.
 */
export const getComponentDescription =
  'Get detailed component info including props, usage, and accessibility guidelines'

/**
 * Input arguments for getComponentTool function.
 */
export interface GetComponentInput {
  name: string
}

/**
 * Result type for getComponentTool.
 */
export interface GetComponentResult {
  /** Whether the operation succeeded */
  success: boolean
  /** Component details */
  component?: ComponentDetails
  /** Human-readable summary */
  summary: string
  /** Error message if operation failed */
  error?: string
}

/**
 * Get detailed info for a specific component.
 *
 * @param args - Input arguments
 * @returns Result with component details
 */
export async function getComponentTool(args: GetComponentInput): Promise<GetComponentResult> {
  const { name } = args

  if (!name || name.trim() === '') {
    return {
      success: false,
      summary: 'Component name is required',
      error: 'name parameter is required and must be non-empty',
    }
  }

  try {
    const component = await getComponentByName(name.trim())

    if (!component) {
      return {
        success: false,
        summary: `Component "${name}" not found`,
        error: `No component named "${name}" found in ui-library. Use list_components to see available components.`,
      }
    }

    const tierInfo = component.tier === 2 ? ' (Radix UI Primitive)' : ' (Tailwind + CVA)'
    const propsInfo = component.props.length > 0 ? `, ${component.props.length} props` : ''

    return {
      success: true,
      component,
      summary: `Found ${component.name}: Tier ${component.tier}${tierInfo}, ${component.category} category${propsInfo}`,
    }
  } catch (error) {
    return {
      success: false,
      summary: 'Failed to get component details',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
