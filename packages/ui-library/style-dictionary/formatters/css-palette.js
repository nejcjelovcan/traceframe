/**
 * Custom Style Dictionary formatter for CSS palette files.
 * Generates CSS files with the exact structure of the hand-authored palette files.
 */

import { readFileSync } from 'node:fs'

/**
 * Generates a human-readable label for a category key.
 * e.g., "primary" -> "Primary palette", "accent-1" -> "Accent 1 palette"
 */
function generateLabel(categoryKey) {
  // Handle numbered categories (accent-1, data-2, etc.)
  const match = categoryKey.match(/^(\w+)-(\d+)$/)
  if (match) {
    const [, base, num] = match
    return `${base.charAt(0).toUpperCase() + base.slice(1)} ${num} palette`
  }
  // Simple category (primary, neutral, etc.)
  return `${categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)} palette`
}

/**
 * Determines if a category is a "core" palette (primary, neutral, success, warning, error)
 * vs a "presentational" palette (accent-*, data-*, or any numbered category)
 */
function isCoreCategory(categoryKey) {
  const corePalettes = ['primary', 'neutral', 'success', 'warning', 'error']
  return corePalettes.includes(categoryKey)
}

/**
 * Sorts category keys: core palettes first (alphabetically), then presentational (alphabetically)
 */
function sortCategories(categoryKeys) {
  const core = categoryKeys.filter(isCoreCategory).sort()
  const presentational = categoryKeys.filter((k) => !isCoreCategory(k)).sort()
  return [...core, ...presentational]
}

export default function cssPaletteFormatter({ dictionary, options = {}, file }) {
  const { theme, source } = options

  if (!theme) {
    throw new Error('css-palette formatter requires theme option')
  }

  // Get description from source file's $paletteDescription field
  let paletteDescription = options.paletteDescription

  // If not in options, try to read from the source file
  if (!paletteDescription && source) {
    try {
      const sourceContent = JSON.parse(readFileSync(source, 'utf-8'))
      paletteDescription = sourceContent.$paletteDescription
    } catch {
      // Ignore errors, description is optional
    }
  }

  let output = '@layer base {\n'

  // Add palette header comment if provided
  if (paletteDescription) {
    output += '  /**\n'
    paletteDescription.split('\n').forEach((line) => {
      output += `   * ${line}\n`
    })
    output += '   */\n\n'
  }

  output += `  :root.${theme} {\n`
  output += `    /* ===== PALETTE: ${theme.toUpperCase()} ===== */\n\n`

  // Collect root-level tokens (e.g., palette.surface) and palette categories
  const rootTokens = []
  const categories = {}

  dictionary.allTokens.forEach((token) => {
    // Skip non-color tokens
    if (token.$type !== 'color' && token.type !== 'color') {
      return
    }

    // Extract category from token path: palette.primary.500 -> primary
    const pathParts = token.path || token.name.split('-')
    if (pathParts[0] !== 'palette' || !pathParts[1]) {
      return
    }

    // Check if this is a root-level token (e.g., palette.surface with only 2 parts)
    if (pathParts.length === 2) {
      rootTokens.push(token)
      return
    }

    let category = pathParts[1]

    // Handle nested categories (e.g., accent.1.500 becomes accent-1)
    // Check if pathParts[2] is a number (nested category) vs a shade
    if (pathParts.length >= 4 && !isNaN(parseInt(pathParts[2]))) {
      category = `${pathParts[1]}-${pathParts[2]}`
    }

    // Verify this is a valid palette token with shade values
    // palette.<category>.<shade> (3 parts) or palette.<category>.<num>.<shade> (4 parts)
    const isNestedCategory = category.includes('-')
    const minPathLength = isNestedCategory ? 4 : 3
    if (pathParts.length < minPathLength) {
      return
    }

    // Initialize category if not exists
    if (!categories[category]) {
      categories[category] = {
        tokens: [],
        label: generateLabel(category),
      }
    }

    categories[category].tokens.push(token)
  })

  // Output root-level tokens first (e.g., surface)
  if (rootTokens.length > 0) {
    output += '    /* ===== Root Colors ===== */\n\n'
    rootTokens
      .sort((a, b) => a.path[1].localeCompare(b.path[1]))
      .forEach((token) => {
        const name = token.path[1]
        const cssVarName = `--palette-${name}`
        const value = token.$value || token.value
        const description = token.$description || ''

        const comment = description ? ` /* ${description} */` : ''
        output += `    ${cssVarName}: ${value};${comment}\n`
      })
    output += '\n'
  }

  // Sort categories and determine section headers
  const sortedCategoryKeys = sortCategories(Object.keys(categories))

  // Find first presentational category for section header
  const firstPresentational = sortedCategoryKeys.find((k) => !isCoreCategory(k))
  const firstCore = sortedCategoryKeys.find(isCoreCategory)

  sortedCategoryKeys.forEach((categoryKey) => {
    const category = categories[categoryKey]
    if (!category || category.tokens.length === 0) return

    // Add section header for first core palette
    if (categoryKey === firstCore) {
      output += '    /* ===== Core Palettes ===== */\n\n'
    }

    // Add section header for first presentational palette
    if (categoryKey === firstPresentational) {
      output += '\n    /* ===== Presentational Palettes ===== */\n\n'
    }

    // Add category comment
    output += `    /* ${category.label} */\n`

    // Sort tokens by shade number
    const sortedTokens = category.tokens.sort((a, b) => {
      const aShade = parseInt(a.path[a.path.length - 1]) || 0
      const bShade = parseInt(b.path[b.path.length - 1]) || 0
      return aShade - bShade
    })

    // Output tokens for this category
    sortedTokens.forEach((token) => {
      const shade = token.path[token.path.length - 1]
      const cssVarName = `--palette-${categoryKey}-${shade}`
      const value = token.$value || token.value
      const description = token.$description || ''

      const comment = description ? ` /* ${description} */` : ''
      output += `    ${cssVarName}: ${value};${comment}\n`
    })

    output += '\n'
  })

  output += '  }\n'
  output += '}\n'

  return output
}
