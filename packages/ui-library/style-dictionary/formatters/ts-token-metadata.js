/**
 * Custom Style Dictionary formatter for TypeScript token metadata.
 * Generates a TypeScript file with token descriptions for MCP tools and documentation.
 */

/**
 * Recursively extracts token metadata from a token object.
 * Returns an object with variant names mapped to descriptions.
 */
function extractVariants(token, prefix = '') {
  const variants = {}

  // Check if this token has a value (it's a leaf or has a DEFAULT value)
  if (token.$value !== undefined) {
    const variantName = prefix || 'DEFAULT'
    variants[variantName] = token.$description || ''
  }

  // Look for nested tokens
  for (const [key, value] of Object.entries(token)) {
    if (key.startsWith('$') || typeof value !== 'object' || value === null) {
      continue
    }

    // Recurse into nested tokens
    const nestedPrefix = prefix ? `${prefix}-${key}` : key
    const nestedVariants = extractVariants(value, nestedPrefix)
    Object.assign(variants, nestedVariants)
  }

  return variants
}

/**
 * Extract palette metadata from tokens.
 */
function extractPalettes(tokens) {
  const palettes = {}
  const paletteToken = tokens.palette

  if (!paletteToken) return palettes

  // Standard palette names (excluding surface which is a single value)
  const paletteNames = ['primary', 'neutral', 'success', 'warning', 'error']
  const accentPalettes = ['accent', 'data']

  for (const name of paletteNames) {
    const palette = paletteToken[name]
    if (!palette) continue

    // Extract shades (numeric keys)
    const shades = Object.keys(palette)
      .filter((k) => !k.startsWith('$') && !isNaN(parseInt(k)))
      .map((k) => parseInt(k))
      .sort((a, b) => a - b)

    palettes[name] = {
      description: palette.$description || '',
      usage: getDefaultUsage(name),
      shades,
    }
  }

  // Handle accent and data palettes (accent.1, accent.2, data.1, data.2)
  for (const baseName of accentPalettes) {
    const baseToken = paletteToken[baseName]
    if (!baseToken) continue

    for (const [num, palette] of Object.entries(baseToken)) {
      if (num.startsWith('$') || typeof palette !== 'object') continue

      const shades = Object.keys(palette)
        .filter((k) => !k.startsWith('$') && !isNaN(parseInt(k)))
        .map((k) => parseInt(k))
        .sort((a, b) => a - b)

      palettes[`${baseName}-${num}`] = {
        description: palette.$description || '',
        usage: '',
        shades,
      }
    }
  }

  return palettes
}

/**
 * Get default usage text for standard palettes.
 */
function getDefaultUsage(name) {
  const usages = {
    primary: 'Links, buttons, focus states, primary actions',
    neutral: 'Text, backgrounds, borders, disabled states',
    success: 'Success messages, positive indicators, confirmations',
    warning: 'Warnings, cautions, pending states',
    error: 'Errors, destructive actions, critical alerts',
  }
  return usages[name] || ''
}

/**
 * Extract semantic token metadata.
 */
function extractSemantic(tokens) {
  const semantic = {}
  const colorTokens = tokens.color

  if (!colorTokens) return semantic

  for (const [category, token] of Object.entries(colorTokens)) {
    if (category.startsWith('$') || typeof token !== 'object') continue

    const variants = extractVariants(token)

    // Get the category description from the DEFAULT token or first variant
    let description = ''
    if (token.$description) {
      description = token.$description
    }

    semantic[category] = {
      description,
      variants,
    }
  }

  return semantic
}

/**
 * Extract shadow metadata.
 */
function extractShadows(tokens) {
  const shadowToken = tokens.shadow
  if (!shadowToken) return null

  const variants = {}
  for (const [key, value] of Object.entries(shadowToken)) {
    if (key.startsWith('$') || typeof value !== 'object') continue
    // Skip dark variants
    if (key.endsWith('-dark') || key === 'dark') continue

    variants[key] = value.$description || ''
  }

  return {
    description: 'Elevation shadows that adapt to light/dark theme',
    variants,
  }
}

/**
 * Extract semantic spacing metadata.
 */
function extractSpacing(tokens) {
  const spacingToken = tokens.spacing
  if (!spacingToken) return null

  const values = {}
  for (const [key, value] of Object.entries(spacingToken)) {
    if (key.startsWith('$') || typeof value !== 'object') continue

    values[key] = {
      value: value.$value || '',
      description: value.$description || '',
    }
  }

  return values
}

/**
 * Extract element sizing metadata.
 */
function extractSizing(tokens) {
  const sizeToken = tokens.size
  if (!sizeToken) return null

  const values = {}
  for (const [key, value] of Object.entries(sizeToken)) {
    if (key.startsWith('$') || typeof value !== 'object') continue

    values[key] = {
      value: value.$value || '',
      description: value.$description || '',
    }
  }

  return values
}

/**
 * Extract font family metadata.
 */
function extractFontFamily(tokens) {
  const fontFamilyToken = tokens.fontFamily
  if (!fontFamilyToken) return null

  const values = {}
  for (const [key, value] of Object.entries(fontFamilyToken)) {
    if (key.startsWith('$') || typeof value !== 'object') continue

    values[key] = {
      value: Array.isArray(value.$value) ? value.$value.join(', ') : value.$value || '',
      description: value.$description || '',
    }
  }

  return values
}

/**
 * Extract font size metadata.
 */
function extractFontSize(tokens) {
  const fontSizeToken = tokens.fontSize
  if (!fontSizeToken) return null

  const values = {}
  for (const [key, value] of Object.entries(fontSizeToken)) {
    if (key.startsWith('$') || typeof value !== 'object') continue

    values[key] = {
      value: value.$value || '',
      lineHeight: value.$lineHeight || '',
      description: value.$description || '',
    }
  }

  return values
}

/**
 * Extract border radius metadata.
 */
function extractBorderRadius(tokens) {
  const borderRadiusToken = tokens.borderRadius
  if (!borderRadiusToken) return null

  const values = {}
  for (const [key, value] of Object.entries(borderRadiusToken)) {
    if (key.startsWith('$') || typeof value !== 'object') continue

    values[key] = {
      value: value.$value || '',
      description: value.$description || '',
      isDefault: value.$default || false,
    }
  }

  return values
}

/**
 * Extract shadow metadata from theme tokens.
 */
function extractThemeShadows(tokens) {
  const shadowToken = tokens.shadow
  if (!shadowToken) return null

  const values = {}
  for (const [key, value] of Object.entries(shadowToken)) {
    if (key.startsWith('$') || typeof value !== 'object') continue

    values[key] = {
      value: value.$value || '',
      description: value.$description || '',
    }
  }

  return values
}

/**
 * Extract gradient metadata from theme tokens.
 */
function extractGradients(tokens) {
  const gradientToken = tokens.gradient
  if (!gradientToken) return null

  const categories = {}

  // Process nested gradient structure (e.g., gradient.interactive.primary)
  for (const [category, categoryValue] of Object.entries(gradientToken)) {
    if (category.startsWith('$') || typeof categoryValue !== 'object') continue

    const variants = {}
    for (const [variant, value] of Object.entries(categoryValue)) {
      if (variant.startsWith('$') || typeof value !== 'object') continue

      variants[variant] = {
        value: value.$value || '',
        description: value.$description || '',
      }
    }

    categories[category] = {
      description: categoryValue.$description || '',
      variants,
    }
  }

  return categories
}

/**
 * Extract border style metadata from theme tokens.
 */
function extractBorderStyles(tokens) {
  const borderStyleToken = tokens.borderStyle
  if (!borderStyleToken) return null

  const values = {}
  for (const [key, value] of Object.entries(borderStyleToken)) {
    if (key.startsWith('$') || typeof value !== 'object') continue

    values[key] = {
      value: value.$value || '',
      description: value.$description || '',
    }
  }

  return values
}

export default function tsTokenMetadataFormatter({ dictionary, options }) {
  // Build token tree from allTokens
  const tokens = {}

  dictionary.allTokens.forEach((token) => {
    let current = tokens
    for (let i = 0; i < token.path.length - 1; i++) {
      const key = token.path[i]
      if (!current[key]) {
        current[key] = {}
      }
      current = current[key]
    }

    const lastKey = token.path[token.path.length - 1]
    current[lastKey] = {
      $value: token.$value || token.value,
      $description: token.$description || token.description,
      $type: token.$type || token.type,
      ...current[lastKey], // Preserve any nested tokens
    }
  })

  // Also need to walk original tokens to get nested structure
  // Since Style Dictionary flattens, we need the raw structure
  const rawTokens = {}
  dictionary.allTokens.forEach((token) => {
    // Get the full original token with nested structure
    if (token.original) {
      let current = rawTokens
      for (let i = 0; i < token.path.length - 1; i++) {
        const key = token.path[i]
        if (!current[key]) {
          current[key] = {}
        }
        current = current[key]
      }
      const lastKey = token.path[token.path.length - 1]
      // Merge original to preserve nested tokens
      current[lastKey] = { ...token.original, ...current[lastKey] }
    }
  })

  const palettes = extractPalettes(rawTokens)
  const semantic = extractSemantic(rawTokens)
  const shadows = extractShadows(rawTokens)
  const spacing = extractSpacing(rawTokens)
  const sizing = extractSizing(rawTokens)
  const fontFamily = extractFontFamily(rawTokens)
  const fontSize = extractFontSize(rawTokens)
  const borderRadius = extractBorderRadius(rawTokens)
  const themeShadows = extractThemeShadows(rawTokens)
  const gradients = extractGradients(rawTokens)
  const borderStyles = extractBorderStyles(rawTokens)

  if (shadows) {
    semantic.shadow = shadows
  }

  // Generate TypeScript output
  let output = `/**
 * Design token metadata for MCP tools and documentation.
 * Describes the purpose and usage of each color token.
 *
 * AUTO-GENERATED - Do not edit manually.
 * Generated by style-dictionary/formatters/ts-token-metadata.js
 */
export const TOKEN_METADATA = {
  palettes: {\n`

  // Output palettes
  for (const [name, palette] of Object.entries(palettes)) {
    output += `    '${name}': {\n`
    output += `      description: ${JSON.stringify(palette.description)},\n`
    output += `      usage: ${JSON.stringify(palette.usage)},\n`
    output += `      shades: [${palette.shades.join(', ')}],\n`
    output += `    },\n`
  }

  output += `  },
  semantic: {\n`

  // Output semantic tokens
  for (const [category, data] of Object.entries(semantic)) {
    output += `    ${category}: {\n`
    output += `      description: ${JSON.stringify(data.description)},\n`
    output += `      variants: {\n`

    for (const [variant, desc] of Object.entries(data.variants)) {
      const key = variant.includes('-') || !isNaN(variant[0]) ? `'${variant}'` : variant
      output += `        ${key}: ${JSON.stringify(desc)},\n`
    }

    output += `      },\n`
    output += `    },\n`
  }

  output += `  },
  theme: {
    fontFamily: {\n`

  // Output font family tokens
  if (fontFamily) {
    for (const [name, data] of Object.entries(fontFamily)) {
      const key = name.includes('-') || !isNaN(name[0]) ? `'${name}'` : name
      output += `      ${key}: {\n`
      output += `        value: ${JSON.stringify(data.value)},\n`
      output += `        description: ${JSON.stringify(data.description)},\n`
      output += `      },\n`
    }
  }

  output += `    },
    fontSize: {\n`

  // Output font size tokens
  if (fontSize) {
    for (const [name, data] of Object.entries(fontSize)) {
      const key = name.includes('-') || !isNaN(name[0]) ? `'${name}'` : name
      output += `      ${key}: {\n`
      output += `        value: ${JSON.stringify(data.value)},\n`
      output += `        lineHeight: ${JSON.stringify(data.lineHeight)},\n`
      output += `        description: ${JSON.stringify(data.description)},\n`
      output += `      },\n`
    }
  }

  output += `    },
    borderRadius: {\n`

  // Output border radius tokens
  if (borderRadius) {
    for (const [name, data] of Object.entries(borderRadius)) {
      const key = name.includes('-') || !isNaN(name[0]) ? `'${name}'` : name
      output += `      ${key}: {\n`
      output += `        value: ${JSON.stringify(data.value)},\n`
      output += `        description: ${JSON.stringify(data.description)},\n`
      if (data.isDefault) {
        output += `        isDefault: true,\n`
      }
      output += `      },\n`
    }
  }

  output += `    },
    shadow: {\n`

  // Output shadow tokens
  if (themeShadows) {
    for (const [name, data] of Object.entries(themeShadows)) {
      const key = name.includes('-') || !isNaN(name[0]) ? `'${name}'` : name
      output += `      ${key}: {\n`
      output += `        value: ${JSON.stringify(data.value)},\n`
      output += `        description: ${JSON.stringify(data.description)},\n`
      output += `      },\n`
    }
  }

  output += `    },
    spacing: {\n`

  // Output spacing tokens
  if (spacing) {
    for (const [name, data] of Object.entries(spacing)) {
      const key = name.includes('-') || !isNaN(name[0]) ? `'${name}'` : name
      output += `      ${key}: {\n`
      output += `        value: ${JSON.stringify(data.value)},\n`
      output += `        description: ${JSON.stringify(data.description)},\n`
      output += `      },\n`
    }
  }

  output += `    },
    size: {\n`

  // Output sizing tokens
  if (sizing) {
    for (const [name, data] of Object.entries(sizing)) {
      const key = name.includes('-') || !isNaN(name[0]) ? `'${name}'` : name
      output += `      ${key}: {\n`
      output += `        value: ${JSON.stringify(data.value)},\n`
      output += `        description: ${JSON.stringify(data.description)},\n`
      output += `      },\n`
    }
  }

  output += `    },
    gradient: {\n`

  // Output gradient tokens
  if (gradients) {
    for (const [category, categoryData] of Object.entries(gradients)) {
      output += `      ${category}: {\n`
      output += `        description: ${JSON.stringify(categoryData.description)},\n`
      output += `        variants: {\n`

      for (const [variant, variantData] of Object.entries(categoryData.variants)) {
        const key = variant.includes('-') || !isNaN(variant[0]) ? `'${variant}'` : variant
        output += `          ${key}: {\n`
        output += `            value: ${JSON.stringify(variantData.value)},\n`
        output += `            description: ${JSON.stringify(variantData.description)},\n`
        output += `          },\n`
      }

      output += `        },\n`
      output += `      },\n`
    }
  }

  output += `    },
    borderStyle: {\n`

  // Output border style tokens
  if (borderStyles) {
    for (const [name, data] of Object.entries(borderStyles)) {
      const key = name.includes('-') || !isNaN(name[0]) ? `'${name}'` : name
      output += `      ${key}: {\n`
      output += `        value: ${JSON.stringify(data.value)},\n`
      output += `        description: ${JSON.stringify(data.description)},\n`
      output += `      },\n`
    }
  }

  output += `    },
  },
} as const
`

  return output
}
