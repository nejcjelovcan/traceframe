/**
 * Custom Style Dictionary formatter for CSS semantic tokens.
 * Generates CSS file for a single theme (light or dark).
 *
 * Options:
 *   - theme: 'light' | 'dark' (required)
 */

/**
 * Converts a token reference like {palette.neutral.900} to a CSS var() reference.
 * - {palette.surface} -> var(--palette-surface)
 * - {palette.neutral.900} -> var(--palette-neutral-900)
 * - {palette.accent.1.500} -> var(--palette-accent-1-500)
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
    return `var(--palette-${varName})`
  }

  // For other references, just convert dots to dashes
  return `var(--${refPath.join('-')})`
}

/**
 * Recursively extracts all tokens from a token object, including nested tokens.
 * Style Dictionary v4 only registers parent tokens in allTokens, so we need to
 * walk the structure to find nested tokens that also have $value.
 */
function extractAllTokens(token, basePath = [], originalToken = null) {
  const tokens = []
  const path = basePath.length > 0 ? basePath : token.path
  const original = originalToken || token.original

  // Add this token if it has a value
  if (token.$value !== undefined || token.value !== undefined) {
    // Get the original reference value if available
    let originalValue = null
    if (original) {
      // Navigate to the same path in original to get the unresolved reference
      if (basePath.length > 0 && token.path) {
        // For the root token, original is at token.original
        originalValue = original.$value
      } else {
        originalValue = original?.$value
      }
    }

    tokens.push({
      path,
      $value: token.$value,
      value: token.value,
      originalValue: originalValue || token.$value || token.value,
      $description: token.$description,
      description: token.description,
      $type: token.$type,
      type: token.type,
    })
  }

  // Look for nested tokens (properties that are objects with $value)
  for (const [key, value] of Object.entries(token)) {
    // Skip Style Dictionary metadata and standard token properties
    if (
      key.startsWith('$') ||
      key === 'value' ||
      key === 'path' ||
      key === 'name' ||
      key === 'attributes' ||
      key === 'original' ||
      key === 'filePath' ||
      key === 'isSource' ||
      typeof value !== 'object' ||
      value === null
    ) {
      continue
    }

    // Get the corresponding original nested value
    const nestedOriginal = original?.[key]

    // This is a nested token - recurse
    const nestedTokens = extractAllTokens(value, [...path, key], nestedOriginal)
    tokens.push(...nestedTokens)
  }

  return tokens
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
