#!/usr/bin/env node
/**
 * Generate COMPONENT_METADATA from .stories.tsx files.
 *
 * Parses story meta objects to extract component information
 * (description, tier, usage, accessibility, props, etc.)
 * and outputs a TypeScript file that can be imported at runtime.
 *
 * Pattern follows TOKEN_METADATA generation via Style Dictionary.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const COMPONENTS_DIR = join(ROOT, 'src', 'components')
const ICONS_DIR = join(ROOT, 'src', 'icons')
const OUTPUT_DIR = join(ROOT, 'src', 'generated')
const OUTPUT_FILE = join(OUTPUT_DIR, 'component-metadata.ts')

// --- Parsing helpers (ported from mcp-ui/utils/storybook-parser.ts) ---

const COMPONENT_CATEGORIES = [
  'primitives',
  'layout',
  'data',
  'feedback',
  'selection',
  'behavioral',
  'foundation',
]

const CATEGORY_MAP = {
  Button: 'primitives',
  Badge: 'primitives',
  Input: 'primitives',
  Link: 'primitives',
  Spinner: 'primitives',
  Heading: 'primitives',
  Container: 'layout',
  Grid: 'layout',
  Stack: 'layout',
  PageLayout: 'layout',
  Navigation: 'layout',
  Card: 'data',
  DataTable: 'data',
  StatCard: 'data',
  BarChart: 'data',
  LogView: 'data',
  EmptyState: 'feedback',
  ErrorState: 'feedback',
  Tooltip: 'feedback',
  Select: 'selection',
  ToggleGroup: 'selection',
  SearchInput: 'selection',
  Collapsible: 'behavioral',
}

function categorizeComponent(title) {
  const parts = title.split('/')
  const componentName = parts[parts.length - 1] ?? ''
  if (title.includes('Foundation')) return 'foundation'
  return CATEGORY_MAP[componentName] ?? 'other'
}

function parseTier(description) {
  const match = description.match(/\*\*Tier:\*\* (\d) \(([^)]+)\)/)
  if (match?.[1] && match[2]) {
    return { tier: parseInt(match[1], 10), tierLabel: match[2] }
  }
  return { tier: 1, tierLabel: 'Tailwind + CVA' }
}

function parseFirstLine(description) {
  const lines = description.trim().split('\n')
  const firstLine = (lines[0] ?? '').trim()
  const tierIndex = firstLine.indexOf('**Tier:**')
  if (tierIndex > 0) return firstLine.slice(0, tierIndex).trim()
  return firstLine
}

function parseSection(description, header) {
  const regex = new RegExp(`\\*\\*${header}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*[A-Z]|$)`)
  const match = description.match(regex)
  return match?.[1]?.trim() ?? undefined
}

function parseBulletList(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-'))
    .map((l) => l.slice(1).trim())
}

function parseCompoundComponents(description) {
  const section = parseSection(description, 'Compound Components')
  if (!section) return undefined
  const components = []
  for (const line of section.split('\n')) {
    const match = line.trim().match(/-\s*`([^`\\]*(?:\\.[^`\\]*)*)`\s*-\s*(.+)/)
    if (match?.[1] && match[2]) {
      components.push({ name: match[1].replace(/\\`/g, '`'), description: match[2].trim() })
    }
  }
  return components.length > 0 ? components : undefined
}

function parseSubcomponents(description) {
  const section = parseSection(description, 'Subcomponents')
  if (!section) return undefined
  const components = []
  for (const line of section.split('\n')) {
    const match = line.trim().match(/-\s*`([^`]+)`/)
    if (match?.[1]) components.push(match[1])
  }
  return components.length > 0 ? components : undefined
}

function parseMetaTitle(content) {
  const match = content.match(/title:\s*['"`]([^'"`]+)['"`]/)
  return match?.[1]
}

function parseComponentDescription(content) {
  // Find `component:` followed by a template literal
  const marker = 'component:'
  const idx = content.indexOf(marker)
  if (idx === -1) return undefined

  // Find the opening backtick
  const afterMarker = content.slice(idx + marker.length)
  const backtickIdx = afterMarker.indexOf('`')
  if (backtickIdx === -1) return undefined

  // Extract content until unescaped closing backtick
  const templateStart = backtickIdx + 1
  let result = ''
  let i = templateStart
  while (i < afterMarker.length) {
    if (afterMarker[i] === '\\' && i + 1 < afterMarker.length && afterMarker[i + 1] === '`') {
      result += '`'
      i += 2
    } else if (afterMarker[i] === '`') {
      break
    } else {
      result += afterMarker[i]
      i++
    }
  }

  return result.trim() || undefined
}

/**
 * Extract balanced brace content starting at the opening brace.
 * Returns the content between { and the matching }, or null if not found.
 */
function extractBalancedBraces(text, startIndex) {
  if (text[startIndex] !== '{') return null
  let depth = 0
  for (let i = startIndex; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') {
      depth--
      if (depth === 0) {
        return text.slice(startIndex + 1, i)
      }
    }
  }
  return null
}

/**
 * Parse top-level entries from the inside of a braces block.
 * Returns array of { name, content } for each top-level key: { ... } entry.
 */
function parseTopLevelEntries(text) {
  const entries = []
  let i = 0

  while (i < text.length) {
    // Skip whitespace and commas
    while (i < text.length && /[\s,]/.test(text[i])) i++
    if (i >= text.length) break

    // Try to match a property name followed by colon
    const nameMatch = text.slice(i).match(/^['"]?([\w-]+)['"]?\s*:\s*/)
    if (!nameMatch) {
      // Skip past any non-matching content
      i++
      continue
    }

    const name = nameMatch[1]
    i += nameMatch[0].length

    // Skip whitespace
    while (i < text.length && /\s/.test(text[i])) i++

    if (i < text.length && text[i] === '{') {
      const content = extractBalancedBraces(text, i)
      if (content !== null) {
        entries.push({ name, content })
        // Skip past the closing brace
        i += content.length + 2 // +2 for { and }
      } else {
        i++
      }
    } else {
      // Skip non-object values (strings, arrays, booleans, etc.)
      if (text[i] === '[') {
        let depth = 1
        i++
        while (i < text.length && depth > 0) {
          if (text[i] === '[') depth++
          else if (text[i] === ']') depth--
          i++
        }
      } else if (text[i] === "'" || text[i] === '"') {
        const quote = text[i]
        i++
        while (i < text.length && text[i] !== quote) {
          if (text[i] === '\\') i++
          i++
        }
        i++ // closing quote
      } else {
        // Skip until comma or newline
        while (i < text.length && text[i] !== ',' && text[i] !== '\n') i++
      }
    }
  }

  return entries
}

function parseArgTypes(content) {
  const props = []

  // Find the argTypes object
  const argTypesStart = content.match(/argTypes:\s*\{/)
  if (!argTypesStart) return props

  const startIdx = content.indexOf(argTypesStart[0]) + argTypesStart[0].length - 1
  const argTypesContent = extractBalancedBraces(content, startIdx)
  if (!argTypesContent) return props

  // Parse only top-level entries (not nested table/defaultValue)
  const entries = parseTopLevelEntries(argTypesContent)

  for (const { name: propName, content: propContent } of entries) {
    const prop = {
      name: propName,
      description: '',
      type: 'unknown',
      required: false,
    }

    const descMatch = propContent.match(/description:\s*['"`]([^'"`]+)['"`]/)
    if (descMatch?.[1]) prop.description = descMatch[1]

    const controlMatch = propContent.match(/control:\s*['"`]?(\w+)['"`]?/)
    if (controlMatch?.[1]) prop.type = controlMatch[1]

    const optionsMatch = propContent.match(/options:\s*\[([^\]]+)\]/)
    if (optionsMatch?.[1]) {
      const opts = []
      const optRegex = /['"`]([^'"`]+)['"`]/g
      let optMatch
      while ((optMatch = optRegex.exec(optionsMatch[1])) !== null) {
        if (optMatch[1]) opts.push(optMatch[1])
      }
      if (opts.length > 0) {
        prop.options = opts
        prop.type = 'select'
      }
    }

    const defaultMatch = propContent.match(/defaultValue:\s*\{\s*summary:\s*['"`]([^'"`]+)['"`]/)
    if (defaultMatch?.[1]) prop.defaultValue = defaultMatch[1]

    props.push(prop)
  }

  return props
}

// --- Main ---

function parseStoryFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const title = parseMetaTitle(content)
  if (!title) return null

  const description = parseComponentDescription(content)
  if (!description) return null

  const name = title.split('/').pop() ?? ''
  const category = categorizeComponent(title)
  const { tier, tierLabel } = parseTier(description)
  const shortDescription = parseFirstLine(description)

  // Parse detailed sections
  const usageSection = parseSection(description, 'Usage')
  const usage = usageSection ? usageSection.replace(/```[\s\S]*?```/g, '').trim() : ''

  const accessSection = parseSection(description, 'Accessibility')
  const accessibility = accessSection ? parseBulletList(accessSection) : []

  const result = {
    name,
    category,
    tier,
    tierLabel,
    description: shortDescription,
    usage,
    accessibility,
    props: parseArgTypes(content),
  }

  // Tier 2 specific sections
  if (tier === 2) {
    const radixSection = parseSection(description, 'Radix Handles')
    if (radixSection) result.radixHandles = parseBulletList(radixSection)

    const weStyleSection = parseSection(description, 'We Style')
    if (weStyleSection) result.weStyle = parseBulletList(weStyleSection)

    const compoundComponents = parseCompoundComponents(description)
    if (compoundComponents) result.compoundComponents = compoundComponents
  }

  const subcomponents = parseSubcomponents(description)
  if (subcomponents) result.subcomponents = subcomponents

  return result
}

function findStoryFiles() {
  const files = []

  try {
    for (const file of readdirSync(COMPONENTS_DIR)) {
      if (file.endsWith('.stories.tsx')) {
        files.push(join(COMPONENTS_DIR, file))
      }
    }
  } catch {
    // directory might not exist
  }

  try {
    for (const file of readdirSync(ICONS_DIR)) {
      if (file.endsWith('.stories.tsx')) {
        files.push(join(ICONS_DIR, file))
      }
    }
  } catch {
    // directory might not exist
  }

  return files.sort()
}

function generateTypeScript(components) {
  const lines = []
  lines.push('// Auto-generated by scripts/generate-component-metadata.js')
  lines.push('// Do not edit manually.')
  lines.push('')
  lines.push('export interface ComponentPropMeta {')
  lines.push('  readonly name: string')
  lines.push('  readonly description: string')
  lines.push('  readonly type: string')
  lines.push('  readonly required: boolean')
  lines.push('  readonly defaultValue?: string')
  lines.push('  readonly options?: readonly string[]')
  lines.push('}')
  lines.push('')
  lines.push('export interface CompoundComponentMeta {')
  lines.push('  readonly name: string')
  lines.push('  readonly description: string')
  lines.push('}')
  lines.push('')
  lines.push('export interface ComponentMeta {')
  lines.push('  readonly name: string')
  lines.push('  readonly category: string')
  lines.push('  readonly tier: 1 | 2')
  lines.push('  readonly tierLabel: string')
  lines.push('  readonly description: string')
  lines.push('  readonly usage: string')
  lines.push('  readonly accessibility: readonly string[]')
  lines.push('  readonly props: readonly ComponentPropMeta[]')
  lines.push('  readonly radixHandles?: readonly string[]')
  lines.push('  readonly weStyle?: readonly string[]')
  lines.push('  readonly subcomponents?: readonly string[]')
  lines.push('  readonly compoundComponents?: readonly CompoundComponentMeta[]')
  lines.push('}')
  lines.push('')
  lines.push(
    `export const COMPONENT_METADATA: Record<string, ComponentMeta> = ${JSON.stringify(components, null, 2)} as const`
  )
  lines.push('')

  return lines.join('\n')
}

function main() {
  console.log('Generating component metadata...')

  const storyFiles = findStoryFiles()
  console.log(`Found ${storyFiles.length} story files`)

  const metadata = {}
  for (const file of storyFiles) {
    const component = parseStoryFile(file)
    if (component) {
      metadata[component.name] = component
      console.log(`  ✓ ${component.name} (${component.category}, Tier ${component.tier})`)
    }
  }

  const output = generateTypeScript(metadata)

  mkdirSync(OUTPUT_DIR, { recursive: true })
  writeFileSync(OUTPUT_FILE, output, 'utf-8')

  // Format the generated file so it passes format:check in CI
  execSync(`npx prettier --write "${OUTPUT_FILE}"`, { stdio: 'ignore' })

  console.log(`\n✅ Generated ${OUTPUT_FILE}`)
  console.log(`   ${Object.keys(metadata).length} components`)
}

main()
