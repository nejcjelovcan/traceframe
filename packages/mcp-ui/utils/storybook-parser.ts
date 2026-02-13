import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

import { getUiLibraryPackagePath } from './storybook-runner.js'
import { getWorkspaceRoot } from './workspace.js'

/**
 * Summary of a component for list_components tool.
 */
export interface ComponentSummary {
  name: string
  category: string
  tier: 1 | 2
  tierLabel: string
  description: string
}

/**
 * Compound component info.
 */
export interface CompoundComponent {
  name: string
  description: string
}

/**
 * Prop definition from argTypes.
 */
export interface PropDefinition {
  name: string
  description: string
  type: string
  required: boolean
  defaultValue?: string
  options?: string[]
}

/**
 * Detailed component info for get_component tool.
 */
export interface ComponentDetails extends ComponentSummary {
  usage: string
  accessibility: string[]
  radixHandles?: string[]
  weStyle?: string[]
  subcomponents?: string[]
  compoundComponents?: CompoundComponent[]
  props: PropDefinition[]
}

/**
 * Categories for filtering components.
 */
export const COMPONENT_CATEGORIES = [
  'primitives',
  'layout',
  'data',
  'feedback',
  'selection',
  'behavioral',
  'foundation',
] as const

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number]

/**
 * Map component title to category.
 */
function categorizeComponent(title: string): string {
  const categoryMap: Record<string, ComponentCategory> = {
    Button: 'primitives',
    Badge: 'primitives',
    Input: 'primitives',
    Link: 'primitives',
    Spinner: 'primitives',
    Container: 'layout',
    Grid: 'layout',
    Stack: 'layout',
    PageLayout: 'layout',
    Card: 'data',
    DataTable: 'data',
    StatCard: 'data',
    BarChart: 'data',
    EmptyState: 'feedback',
    ErrorState: 'feedback',
    Tooltip: 'feedback',
    Select: 'selection',
    ToggleGroup: 'selection',
    SearchInput: 'selection',
    Collapsible: 'behavioral',
  }

  // Extract component name from title (e.g., "Components/Button" -> "Button")
  const parts = title.split('/')
  const componentName = parts[parts.length - 1] ?? ''

  // Handle Foundation category (Icons)
  if (title.includes('Foundation')) {
    return 'foundation'
  }

  return categoryMap[componentName] ?? 'other'
}

/**
 * Parse tier from description markdown.
 * Returns tier number and label.
 */
function parseTier(description: string): { tier: 1 | 2; tierLabel: string } {
  const tierMatch = description.match(/\*\*Tier:\*\* (\d) \(([^)]+)\)/)
  if (tierMatch && tierMatch[1] && tierMatch[2]) {
    return {
      tier: parseInt(tierMatch[1], 10) as 1 | 2,
      tierLabel: tierMatch[2],
    }
  }
  return { tier: 1, tierLabel: 'Tailwind + CVA' }
}

/**
 * Extract first line of description (before **Tier:**).
 */
function parseFirstLine(description: string): string {
  const lines = description.trim().split('\n')
  const firstLine = (lines[0] ?? '').trim()
  // Stop at **Tier:** if it's on the first line
  const tierIndex = firstLine.indexOf('**Tier:**')
  if (tierIndex > 0) {
    return firstLine.slice(0, tierIndex).trim()
  }
  return firstLine
}

/**
 * Extract a section from the description by header.
 */
function parseSection(description: string, header: string): string | undefined {
  const regex = new RegExp(`\\*\\*${header}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*[A-Z]|$)`)
  const match = description.match(regex)
  if (match?.[1]) {
    return match[1].trim()
  }
  return undefined
}

/**
 * Parse bullet list into array of strings.
 */
function parseBulletList(text: string): string[] {
  const lines = text.split('\n')
  const items: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('-')) {
      items.push(trimmed.slice(1).trim())
    }
  }

  return items
}

/**
 * Parse compound components from description.
 */
function parseCompoundComponents(description: string): CompoundComponent[] {
  const section = parseSection(description, 'Compound Components')
  if (!section) return []

  const components: CompoundComponent[] = []
  const lines = section.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('-')) {
      // Format: - `Component.Name` - Description
      const match = trimmed.match(/-\s*`([^`]+)`\s*-\s*(.+)/)
      if (match && match[1] && match[2]) {
        components.push({
          name: match[1],
          description: match[2].trim(),
        })
      }
    }
  }

  return components
}

/**
 * Parse subcomponents from description (Tier 1 Card-style components).
 */
function parseSubcomponents(description: string): string[] | undefined {
  const section = parseSection(description, 'Subcomponents')
  if (!section) return undefined

  const components: string[] = []
  const lines = section.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('-')) {
      // Format: - `ComponentName` - Description
      const match = trimmed.match(/-\s*`([^`]+)`/)
      if (match && match[1]) {
        components.push(match[1])
      }
    }
  }

  return components.length > 0 ? components : undefined
}

/**
 * Extract argTypes from story file content.
 * Uses regex to parse the argTypes object.
 */
function parseArgTypes(content: string): PropDefinition[] {
  const props: PropDefinition[] = []

  // Find argTypes block
  const argTypesMatch = content.match(
    /argTypes:\s*\{([\s\S]*?)\n\s*\}(?:,|\s*\n\s*(?:decorators|tags|$))/m
  )
  if (!argTypesMatch || !argTypesMatch[1]) return props

  const argTypesContent = argTypesMatch[1]

  // Parse each prop entry
  // Match pattern: propName: { ... }
  const propRegex = /(\w+):\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g
  let match

  while ((match = propRegex.exec(argTypesContent)) !== null) {
    const propName = match[1]
    const propContent = match[2]

    if (!propName || !propContent) {
      continue
    }

    const prop: PropDefinition = {
      name: propName,
      description: '',
      type: 'unknown',
      required: false,
    }

    // Parse description
    const descMatch = propContent.match(/description:\s*['"`]([^'"`]+)['"`]/)
    if (descMatch && descMatch[1]) {
      prop.description = descMatch[1]
    }

    // Parse control type
    const controlMatch = propContent.match(/control:\s*['"`]?(\w+)['"`]?/)
    if (controlMatch && controlMatch[1]) {
      prop.type = controlMatch[1]
    }

    // Parse options
    const optionsMatch = propContent.match(/options:\s*\[([^\]]+)\]/)
    if (optionsMatch && optionsMatch[1]) {
      const optionsStr = optionsMatch[1]
      // Extract string values from options array
      const opts: string[] = []
      const optRegex = /['"`]([^'"`]+)['"`]/g
      let optMatch
      while ((optMatch = optRegex.exec(optionsStr)) !== null) {
        if (optMatch[1]) {
          opts.push(optMatch[1])
        }
      }
      if (opts.length > 0) {
        prop.options = opts
        prop.type = 'select'
      }
    }

    // Parse default value
    const defaultMatch = propContent.match(/defaultValue:\s*\{\s*summary:\s*['"`]([^'"`]+)['"`]/)
    if (defaultMatch && defaultMatch[1]) {
      prop.defaultValue = defaultMatch[1]
    }

    props.push(prop)
  }

  return props
}

/**
 * Extract meta title from story file content.
 */
function parseMetaTitle(content: string): string | undefined {
  const match = content.match(/title:\s*['"`]([^'"`]+)['"`]/)
  return match?.[1]
}

/**
 * Extract component description from story file content.
 */
function parseComponentDescription(content: string): string | undefined {
  // Match the docs.description.component template literal
  const match = content.match(/description:\s*\{\s*component:\s*`([^`]+)`/)
  if (match && match[1]) {
    return match[1].trim()
  }
  return undefined
}

/**
 * Parse a single story file and extract component info.
 */
export async function parseStoryFile(
  filePath: string,
  options?: { detailed?: boolean }
): Promise<ComponentDetails | null> {
  try {
    const content = await readFile(filePath, 'utf-8')

    const title = parseMetaTitle(content)
    if (!title) return null

    const description = parseComponentDescription(content)
    if (!description) return null

    const name = title.split('/').pop() ?? ''
    const category = categorizeComponent(title)
    const { tier, tierLabel } = parseTier(description)
    const shortDescription = parseFirstLine(description)

    const component: ComponentDetails = {
      name,
      category,
      tier,
      tierLabel,
      description: shortDescription,
      usage: '',
      accessibility: [],
      props: [],
    }

    if (options?.detailed) {
      // Parse usage section
      const usageSection = parseSection(description, 'Usage')
      if (usageSection) {
        // Remove code blocks for cleaner output
        component.usage = usageSection.replace(/```[\s\S]*?```/g, '').trim()
      }

      // Parse accessibility section
      const accessSection = parseSection(description, 'Accessibility')
      if (accessSection) {
        component.accessibility = parseBulletList(accessSection)
      }

      // Tier 2 specific sections
      if (tier === 2) {
        const radixSection = parseSection(description, 'Radix Handles')
        if (radixSection) {
          component.radixHandles = parseBulletList(radixSection)
        }

        const weStyleSection = parseSection(description, 'We Style')
        if (weStyleSection) {
          component.weStyle = parseBulletList(weStyleSection)
        }

        const compoundComponents = parseCompoundComponents(description)
        if (compoundComponents.length > 0) {
          component.compoundComponents = compoundComponents
        }
      }

      // Tier 1 subcomponents
      const subcomponents = parseSubcomponents(description)
      if (subcomponents) {
        component.subcomponents = subcomponents
      }

      // Parse props from argTypes
      component.props = parseArgTypes(content)
    }

    return component
  } catch {
    return null
  }
}

/**
 * Find all story files in the ui-library package.
 */
export async function findStoryFiles(): Promise<string[]> {
  const workspaceRoot = getWorkspaceRoot()
  const uiLibraryPath = join(workspaceRoot, getUiLibraryPackagePath())
  const componentsPath = join(uiLibraryPath, 'src', 'components')
  const iconsPath = join(uiLibraryPath, 'src', 'icons')

  const storyFiles: string[] = []

  // Scan components directory
  try {
    const componentFiles = await readdir(componentsPath)
    for (const file of componentFiles) {
      if (file.endsWith('.stories.tsx')) {
        storyFiles.push(join(componentsPath, file))
      }
    }
  } catch {
    // Directory might not exist
  }

  // Scan icons directory
  try {
    const iconFiles = await readdir(iconsPath)
    for (const file of iconFiles) {
      if (file.endsWith('.stories.tsx')) {
        storyFiles.push(join(iconsPath, file))
      }
    }
  } catch {
    // Directory might not exist
  }

  return storyFiles.sort()
}

/**
 * Get all components with their summaries.
 */
export async function getAllComponents(categoryFilter?: string): Promise<ComponentSummary[]> {
  const storyFiles = await findStoryFiles()
  const components: ComponentSummary[] = []

  for (const file of storyFiles) {
    const component = await parseStoryFile(file)
    if (component) {
      const summary: ComponentSummary = {
        name: component.name,
        category: component.category,
        tier: component.tier,
        tierLabel: component.tierLabel,
        description: component.description,
      }

      if (!categoryFilter || component.category === categoryFilter) {
        components.push(summary)
      }
    }
  }

  return components
}

/**
 * Get detailed info for a specific component.
 */
export async function getComponentByName(name: string): Promise<ComponentDetails | null> {
  const storyFiles = await findStoryFiles()

  // Try to find the matching story file
  const normalizedName = name.toLowerCase()
  const matchingFile = storyFiles.find((file) => {
    const fileName = file.split('/').pop() ?? ''
    const baseName = fileName.replace('.stories.tsx', '').toLowerCase()
    return baseName === normalizedName || baseName === normalizedName.replace(/s$/, '')
  })

  if (!matchingFile) {
    return null
  }

  return parseStoryFile(matchingFile, { detailed: true })
}
