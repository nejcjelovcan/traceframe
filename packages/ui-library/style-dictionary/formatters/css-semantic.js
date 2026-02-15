/**
 * Custom Style Dictionary formatter for CSS semantic tokens.
 * Generates CSS file for a single theme (light or dark).
 *
 * Options:
 *   - theme: 'light' | 'dark' (required)
 */

import { extractAllTokens } from '../utils/extract-tokens.js'

/**
 * Converts a token reference like {palette.neutral.900} to a CSS var() reference.
 * - {palette.surface} -> rgb(var(--palette-surface))
 * - {palette.neutral.900} -> rgb(var(--palette-neutral-900))
 * - {palette.accent.1.500} -> rgb(var(--palette-accent-1-500))
 */
function referenceToVar(ref) {
  if (!ref || typeof ref !== 'string') return null
  if (!ref.startsWith('{') || !ref.endsWith('}')) return null

  // Extract the path: {palette.neutral.900} -> palette.neutral.900
  const refPath = ref.slice(1, -1).split('.')

  // Convert palette references to --palette-* vars
  if (refPath[0] === 'palette') {
    // palette.neutral.900 -> --palette-neutral-900
    const varName = refPath.slice(1).join('-')
    // Wrap palette colors in rgb() for Tailwind v4 compatibility
    return `rgb(var(--palette-${varName}))`
  }

  // For other references, just convert dots to dashes
  return `var(--${refPath.join('-')})`
}

export default function cssSemanticFormatter({ dictionary, options }) {
  const theme = options?.theme
  if (!theme || (theme !== 'light' && theme !== 'dark')) {
    throw new Error(
      `css/semantic formatter requires options.theme to be 'light' or 'dark', got: ${theme}`
    )
  }

  const selector = theme === 'light' ? ':root.light' : ':root.dark'

  let output = '@layer base {\n'
  output += `  ${selector} {\n`

  // Extract all tokens including nested ones
  const allTokens = []
  dictionary.allTokens.forEach((token) => {
    const extracted = extractAllTokens(token)
    allTokens.push(...extracted)
  })

  // Group tokens by category (derived dynamically from tokens)
  const categories = {}
  allTokens.forEach((token) => {
    let category
    if (token.path[0] === 'shadow') {
      category = 'shadow'
    } else if (token.path[0] === 'gradient') {
      category = 'gradient'
    } else if (token.path[0] === 'color') {
      // Tokens from semantic JSON files: ['color', category, ...rest]
      category = token.path[1]
    } else {
      return // Skip tokens we don't understand (e.g., palette tokens)
    }

    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(token)
  })

  // Get all discovered categories, sorted alphabetically (shadow always last for readability)
  const discoveredCategories = Object.keys(categories).sort((a, b) => {
    if (a === 'shadow') return 1
    if (b === 'shadow') return -1
    return a.localeCompare(b)
  })

  discoveredCategories.forEach((categoryKey, categoryIndex) => {
    const categoryTokens = categories[categoryKey]
    if (!categoryTokens || categoryTokens.length === 0) return

    // Add blank line between categories (except before first)
    if (categoryIndex > 0) {
      output += '\n'
    }

    // Sort tokens within category for consistent output
    const sortedTokens = categoryTokens.sort((a, b) => {
      const aPath = a.path.join('-')
      const bPath = b.path.join('-')
      return aPath.localeCompare(bPath)
    })

    sortedTokens.forEach((token) => {
      // Generate CSS variable name
      const cssVarName = `--${token.path.join('-')}`

      // Try to use the original reference value, converting to CSS var()
      // Fall back to resolved value for non-reference tokens (like shadows)
      const originalRef = token.originalValue
      let value = referenceToVar(originalRef)

      // If no reference (e.g., shadow values), use the resolved value
      if (!value) {
        value = token.$value || token.value
      }

      // Output token description as comment if available
      const description = token.$description || token.description
      if (description) {
        output += `    /* ${description} */\n`
      }

      output += `    ${cssVarName}: ${value};\n`
    })
  })

  output += '  }\n'
  output += '}\n'

  return output
}
