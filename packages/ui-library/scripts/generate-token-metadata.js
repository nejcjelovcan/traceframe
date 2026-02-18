#!/usr/bin/env node
/**
 * Generates token metadata from CSS source files.
 * Extracts token names, values, and descriptions from CSS custom properties and comments.
 * Creates a TypeScript metadata file for use by MCP tools and documentation.
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'

const __dirname = dirname(fileURLToPath(import.meta.url))
const stylesDir = join(__dirname, '..', 'src', 'styles', 'tokens')
const outputFile = join(__dirname, '..', 'src', 'styles', 'token-metadata.generated.ts')

/**
 * Usage information that needs to be preserved (not extracted from CSS)
 */
const PALETTE_USAGE = {
  primary: 'Links, buttons, focus states, primary actions',
  secondary: 'Secondary buttons, accents, alternative actions',
  neutral: 'Text, backgrounds, borders, disabled states',
  success: 'Success messages, positive indicators, confirmations',
  warning: 'Warnings, cautions, pending states',
  error: 'Errors, destructive actions, critical alerts',
  info: 'Informational messages, tips, neutral alerts',
  'accent-1': 'Categorical data visualization, visual distinction',
  'accent-2': 'Categorical data visualization, visual distinction',
  'accent-3': 'Categorical data visualization, visual distinction',
  'accent-4': 'Categorical data visualization, visual distinction',
  'accent-5': 'Categorical data visualization, visual distinction',
}

/**
 * Extracts preceding comment from CSS for a given line number
 * @param {string} css - CSS content
 * @param {number} lineNumber - Line number where the property is declared
 * @returns {string} - Extracted comment description or empty string
 */
function extractComment(css, lineNumber) {
  const lines = css.split('\n')

  // Check for inline comment on the same line (after the semicolon)
  const currentLine = lines[lineNumber - 1]
  const inlineCommentMatch = currentLine?.match(/;\s*\/\*\s*(.+?)\s*\*\//)
  if (inlineCommentMatch) {
    return inlineCommentMatch[1].trim()
  }

  // Check for comment on the line before
  if (lineNumber > 1) {
    const prevLine = lines[lineNumber - 2]
    if (prevLine) {
      // Check for single-line comment
      const singleLineMatch = prevLine.match(/^\s*\/\*\s*(.+?)\s*\*\/\s*$/)
      if (singleLineMatch) {
        return singleLineMatch[1].trim()
      }

      // Check for multi-line comment ending on previous line
      const multiLineEndMatch = prevLine.match(/\*\/\s*$/)
      if (multiLineEndMatch) {
        // Find the start of the multi-line comment
        for (let i = lineNumber - 2; i >= 0; i--) {
          if (lines[i].includes('/*')) {
            // Extract all lines between /* and */
            const commentLines = []
            for (let j = i; j < lineNumber - 1; j++) {
              const line = lines[j]
                .replace(/^\s*\/\*\*?/, '') // Remove opening /*
                .replace(/\*\/\s*$/, '') // Remove closing */
                .replace(/^\s*\*/, '') // Remove leading * in multiline comments
                .trim()
              if (line) {
                commentLines.push(line)
              }
            }
            // Skip the first line if it's just the palette/theme description
            if (commentLines.length > 1 &&
                (commentLines[0].startsWith('Palette:') ||
                 commentLines[0].startsWith('Theme:') ||
                 commentLines[0].startsWith('==='))) {
              return ''
            }
            return commentLines.join(' ').trim()
          }
        }
      }
    }
  }

  return ''
}

/**
 * Parses CSS file and extracts tokens with their values and descriptions
 * @param {string} filePath - Path to CSS file
 * @returns {Map<string, {value: string, description: string}>}
 */
function parseCSSFile(filePath) {
  const css = readFileSync(filePath, 'utf-8')
  const tokens = new Map()

  // Use PostCSS to parse the CSS
  const root = postcss.parse(css, { from: filePath })

  root.walkDecls((decl) => {
    if (decl.prop.startsWith('--')) {
      // Convert CSS property name to token name
      const tokenName = decl.prop.substring(2) // Remove --

      // Get line number for comment extraction
      const lineNumber = decl.source?.start?.line || 0

      // Extract description from comment
      const description = extractComment(css, lineNumber)

      tokens.set(tokenName, {
        value: decl.value.trim(),
        description,
      })
    }
  })

  return tokens
}

/**
 * Converts CSS token name to JavaScript property name
 * @param {string} tokenName - CSS token name (e.g., "token-surface-muted")
 * @returns {string} - JavaScript property name (e.g., "surface-muted")
 */
function tokenToPropertyName(tokenName) {
  // Remove common prefixes
  return tokenName.replace(/^(token|palette)-/, '')
}

/**
 * Groups tokens by category based on token name patterns
 * @param {Map<string, {value: string, description: string}>} tokens
 * @returns {Object} - Grouped tokens
 */
function groupTokens(tokens) {
  const grouped = {
    palettes: {},
    semantic: {},
    theme: {
      fontFamily: {},
      fontSize: {},
      borderRadius: {},
      shadow: {},
      spacing: {},
      size: {},
      gradient: {},
      borderStyle: {},
    },
  }

  // Define shades for palettes
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  for (const [tokenName, tokenData] of tokens) {
    const propName = tokenToPropertyName(tokenName)

    // Palette tokens (e.g., palette-primary-500)
    if (tokenName.startsWith('palette-')) {
      const parts = propName.split('-')
      const shadePart = parts[parts.length - 1]
      const shade = parseInt(shadePart, 10)

      if (!isNaN(shade) && shades.includes(shade)) {
        // This is a palette with shade
        const paletteName = parts.slice(0, -1).join('-')
        if (!grouped.palettes[paletteName]) {
          grouped.palettes[paletteName] = {
            description: '',
            usage: PALETTE_USAGE[paletteName] || '',
            shades,
          }
        }
      } else if (parts.length === 1) {
        // Root palette token (e.g., palette-surface)
        // Skip these as they're not part of the standard palette structure
      }
    }
    // Theme tokens
    else if (tokenName.startsWith('token-font-')) {
      const fontType = propName.replace('font-', '')
      grouped.theme.fontFamily[fontType] = {
        value: tokenData.value,
        description: tokenData.description || `${fontType} font family`,
      }
    }
    else if (tokenName.startsWith('token-shadow-')) {
      const shadowType = propName.replace('shadow-', '')
      grouped.theme.shadow[shadowType] = {
        value: tokenData.value,
        description: tokenData.description || '',
      }
    }
    else if (tokenName.startsWith('token-radius-')) {
      const radiusType = propName.replace('radius-', '')
      grouped.theme.borderRadius[radiusType] = {
        value: tokenData.value,
        description: tokenData.description || '',
        isDefault: radiusType === 'md',
      }
    }
    else if (tokenName.startsWith('token-size-')) {
      const sizeType = propName.replace('size-', '')
      grouped.theme.size[sizeType] = {
        value: tokenData.value,
        description: tokenData.description || '',
      }
    }
    else if (tokenName.startsWith('token-spacing-')) {
      const spacingType = propName.replace('spacing-', '')
      grouped.theme.spacing[spacingType] = {
        value: tokenData.value,
        description: tokenData.description || '',
      }
    }
    else if (tokenName.startsWith('token-border-style-')) {
      const borderType = propName.replace('border-style-', '')
      grouped.theme.borderStyle[borderType] = {
        value: tokenData.value,
        description: tokenData.description || '',
      }
    }
    else if (tokenName.startsWith('token-gradient-')) {
      const gradientType = propName.replace('gradient-', '')
      grouped.theme.gradient[gradientType] = {
        value: tokenData.value,
        description: tokenData.description || '',
      }
    }
    // Semantic tokens
    else if (tokenName.startsWith('token-')) {
      // Group semantic tokens by their base name
      const baseName = propName.split('-')[0]

      if (!grouped.semantic[baseName]) {
        grouped.semantic[baseName] = {
          description: '',
          variants: {},
        }
      }

      // Determine variant name
      const variantParts = propName.split('-').slice(1)
      const variantName = variantParts.length > 0 ? variantParts.join('-') : 'DEFAULT'

      grouped.semantic[baseName].variants[variantName] = tokenData.description

      // Set base description from DEFAULT variant
      if (variantName === 'DEFAULT' && tokenData.description) {
        grouped.semantic[baseName].description = tokenData.description
      }
    }
  }

  return grouped
}

/**
 * Processes font size tokens to extract line height
 * @param {Object} fontSizes - Font size tokens object
 * @returns {Object} - Processed font sizes with lineHeight
 */
function processFontSizes(fontSizes) {
  const processed = {}

  // First pass: collect base font sizes and line heights
  const fontSizeMap = new Map()
  const lineHeightMap = new Map()

  for (const [key, data] of Object.entries(fontSizes)) {
    if (key.endsWith('-lh')) {
      // This is a line height
      const baseName = key.replace('-lh', '')
      lineHeightMap.set(baseName, data.value)
    } else {
      // This is a font size
      fontSizeMap.set(key, data)
    }
  }

  // Second pass: combine font sizes with their line heights
  for (const [key, data] of fontSizeMap) {
    processed[key] = {
      value: data.value,
      lineHeight: lineHeightMap.get(key) || '1.5',
      description: data.description || '',
    }
  }

  return processed
}

/**
 * Generates TypeScript metadata file
 * @param {Object} metadata - Token metadata object
 */
function generateTypeScriptFile(metadata) {
  // Process font sizes to include line heights
  if (metadata.theme.fontSize) {
    metadata.theme.fontSize = processFontSizes(metadata.theme.fontSize)
  }

  // Convert to JSON with proper formatting
  let jsonStr = JSON.stringify(metadata, null, 2)

  // Replace quoted keys with unquoted keys ONLY for valid JavaScript identifiers
  // Valid identifiers: start with letter/underscore, contain only letters/numbers/underscores
  jsonStr = jsonStr.replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:')

  // Keep quotes for:
  // - Keys starting with numbers: "2xs", "2xl", "1", "2", "3", "4", "5"
  // - Keys containing hyphens: "accent-1", "primary-hover", etc.
  // These remain quoted from JSON.stringify output

  const content = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 * Generated from CSS token source files by generate-token-metadata.js
 *
 * To update this file, run: pnpm generate:token-metadata
 * To modify token descriptions, edit the CSS comments in the source files.
 */

export const TOKEN_METADATA = ${jsonStr} as const
`

  writeFileSync(outputFile, content, 'utf-8')
  console.log(`Generated token metadata: ${outputFile}`)
}

/**
 * Main function
 */
function main() {
  console.log('Generating token metadata from CSS source files...\n')

  let allTokens = new Map()

  // Process palette files (using arctic as source of truth)
  const arcticPalettePath = join(stylesDir, 'palettes', 'arctic.css')
  const paletteTokens = parseCSSFile(arcticPalettePath)
  allTokens = new Map([...allTokens, ...paletteTokens])

  // Process theme files (using arctic as source of truth)
  const arcticThemePath = join(stylesDir, 'themes', 'arctic.css')
  const themeTokens = parseCSSFile(arcticThemePath)
  allTokens = new Map([...allTokens, ...themeTokens])

  // Process mode files (using light as source of truth)
  const lightModePath = join(stylesDir, 'modes', 'light.css')
  const modeTokens = parseCSSFile(lightModePath)
  allTokens = new Map([...allTokens, ...modeTokens])

  // Group tokens by category
  const metadata = groupTokens(allTokens)

  // Generate TypeScript file
  generateTypeScriptFile(metadata)

  console.log('Token metadata generation complete!')
}

main()