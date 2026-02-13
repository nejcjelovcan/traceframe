import { z } from 'zod'

import { ICON_METADATA, type IconMeta, type IconName } from '@nejcjelovcan/traceframe-ui-library'

/**
 * Input schema for get_icon tool.
 */
export const getIconInputSchema = {
  name: z.string().describe('Icon name (e.g., "search", "chevron-down", "alert-circle")'),
}

/**
 * Description for the get_icon tool.
 */
export const getIconDescription =
  'Get full metadata for a specific icon including description, category, usage guidelines, and aliases'

/**
 * Input arguments for getIconTool function.
 */
export interface GetIconInput {
  name: string
}

/**
 * Full icon details for output.
 */
export interface IconDetails {
  name: string
  description: string
  category: string
  usage: string
  aliases: string[]
}

/**
 * Result type for getIconTool.
 */
export interface GetIconResult {
  /** Whether the operation succeeded */
  success: boolean
  /** Icon details */
  icon?: IconDetails
  /** Human-readable summary */
  summary: string
  /** Error message if operation failed */
  error?: string
}

/**
 * Get full metadata for a specific icon.
 *
 * @param args - Input arguments
 * @returns Result with icon details
 */
export async function getIconTool(args: GetIconInput): Promise<GetIconResult> {
  const { name } = args

  if (!name || name.trim() === '') {
    return {
      success: false,
      summary: 'Icon name is required',
      error: 'name parameter is required and must be non-empty',
    }
  }

  try {
    const trimmedName = name.trim() as IconName
    const meta: IconMeta | undefined = ICON_METADATA[trimmedName]

    if (!meta) {
      // Get all valid icon names for the error message
      const validNames = Object.keys(ICON_METADATA).slice(0, 10).join(', ')
      return {
        success: false,
        summary: `Icon "${name}" not found`,
        error: `No icon named "${name}" found. Use list_icons or search_icons to find valid icons. Examples: ${validNames}...`,
      }
    }

    const icon: IconDetails = {
      name: trimmedName,
      description: meta.description,
      category: meta.category,
      usage: meta.usage,
      aliases: meta.aliases ?? [],
    }

    return {
      success: true,
      icon,
      summary: `Found icon "${trimmedName}": ${meta.description} (${meta.category} category)`,
    }
  } catch (error) {
    return {
      success: false,
      summary: 'Failed to get icon details',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
