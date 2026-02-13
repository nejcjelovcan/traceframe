/**
 * Custom Style Dictionary formatter for CSS theme files.
 * Generates CSS files with theme-specific typography, shadows, border radius, and spacing.
 * Each theme references a palette and provides additional customizations.
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

/**
 * Formats a font family array into CSS-compatible string.
 * @param {string[]} fonts - Array of font family names
 * @returns {string} CSS font-family value
 */
function formatFontFamily(fonts) {
  return fonts
    .map((font) => {
      // Wrap fonts with spaces in quotes
      if (font.includes(' ') && !font.startsWith('"') && !font.startsWith("'")) {
        return `"${font}"`
      }
      return font
    })
    .join(', ')
}

export default function cssThemeFormatter({ options = {} }) {
  const { theme, source } = options

  if (!theme) {
    throw new Error('css-theme formatter requires theme option')
  }

  if (!source) {
    throw new Error('css-theme formatter requires source option pointing to theme JSON file')
  }

  // Read theme JSON directly
  const themeData = JSON.parse(readFileSync(source, 'utf-8'))

  let output = '@layer base {\n'

  // Add theme header comment
  const description = themeData.$description || `Theme: ${theme}`
  output += '  /**\n'
  output += `   * Theme: "${theme}"\n`
  output += '   *\n'
  description.split('\n').forEach((line) => {
    output += `   * ${line.trim()}\n`
  })
  output += '   */\n\n'

  output += `  :root.${theme} {\n`
  output += `    /* ===== THEME: ${theme.toUpperCase()} ===== */\n\n`

  // Output font families
  if (themeData.fontFamily) {
    output += '    /* Typography */\n'

    if (themeData.fontFamily.sans) {
      const fontValue = formatFontFamily(themeData.fontFamily.sans.$value)
      output += `    --font-sans: ${fontValue};\n`
    }

    if (themeData.fontFamily.mono) {
      const fontValue = formatFontFamily(themeData.fontFamily.mono.$value)
      output += `    --font-mono: ${fontValue};\n`
    }

    output += '\n'
  }

  // Output shadows
  if (themeData.shadow) {
    output += '    /* Shadows */\n'

    for (const size of Object.keys(themeData.shadow)) {
      const shadowValue = themeData.shadow[size].$value
      output += `    --shadow-${size}: ${shadowValue};\n`
    }

    output += '\n'
  }

  // Output border radius
  if (themeData.borderRadius) {
    output += '    /* Border Radius */\n'

    for (const size of Object.keys(themeData.borderRadius)) {
      const radiusValue = themeData.borderRadius[size].$value
      const varName = size === 'DEFAULT' ? '--radius' : `--radius-${size}`
      output += `    ${varName}: ${radiusValue};\n`
    }

    output += '\n'
  }

  // Output element sizing
  if (themeData.size) {
    output += '    /* Element Sizing */\n'

    for (const key of Object.keys(themeData.size)) {
      const sizeValue = themeData.size[key].$value
      output += `    --size-${key}: ${sizeValue};\n`
    }

    output += '\n'
  }

  // Output custom spacing
  if (themeData.spacing) {
    output += '    /* Custom Spacing */\n'

    const spacingKeys = Object.keys(themeData.spacing).sort((a, b) => parseInt(a) - parseInt(b))
    for (const key of spacingKeys) {
      const spacingValue = themeData.spacing[key].$value
      output += `    --spacing-${key}: ${spacingValue};\n`
    }

    output += '\n'
  }

  output += '  }\n'
  output += '}\n'

  return output
}
