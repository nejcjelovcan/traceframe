#!/usr/bin/env node
/**
 * Validates token consistency across CSS source files:
 * 1. All CSS custom properties in light.css must exist in dark.css (modes)
 * 2. All CSS custom properties in dusk.css must exist in all other palette CSS files
 * 3. All CSS custom properties in dusk.css must exist in all other theme CSS files
 * 4. Shadow token format validation (inset shadows must include 'inset' keyword)
 */

import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const stylesDir = join(__dirname, '..', 'src', 'styles', 'tokens')

/**
 * Extracts all CSS custom property declarations from a CSS file.
 * Matches lines like: --token-surface: rgb(var(--palette-neutral-50));
 * @param {string} content - CSS file content
 * @returns {string[]} Array of custom property names
 */
function extractCssCustomProperties(content) {
  const properties = []
  const regex = /^\s*(--[\w-]+)\s*:/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    properties.push(match[1])
  }
  return properties
}

/**
 * Extracts CSS custom property declarations with their values.
 * @param {string} content - CSS file content
 * @returns {Map<string, string>} Map of property name to value
 */
function extractCssCustomPropertyValues(content) {
  const properties = new Map()
  // Match property declarations, handling multi-line values (e.g., gradients)
  const regex = /^\s*(--[\w-]+)\s*:\s*([^;]+);/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    properties.set(match[1], match[2].trim())
  }
  return properties
}

/**
 * Validates that all properties in source exist in target and vice versa.
 * @param {string} sourceName - Name of source file
 * @param {string[]} sourceProps - Source CSS custom properties
 * @param {string} targetName - Name of target file
 * @param {string[]} targetProps - Target CSS custom properties
 * @returns {{ missing: string[], extra: string[] }}
 */
function validateProperties(sourceName, sourceProps, targetName, targetProps) {
  const sourceSet = new Set(sourceProps)
  const targetSet = new Set(targetProps)

  const missing = sourceProps.filter((prop) => !targetSet.has(prop))
  const extra = targetProps.filter((prop) => !sourceSet.has(prop))

  return { missing, extra }
}

function main() {
  let hasErrors = false

  // 1. Validate mode tokens: light.css -> dark.css
  console.log('Validating mode tokens (light.css as source of truth)...\n')

  const lightCss = readFileSync(join(stylesDir, 'modes', 'light.css'), 'utf-8')
  const darkCss = readFileSync(join(stylesDir, 'modes', 'dark.css'), 'utf-8')

  const lightProps = extractCssCustomProperties(lightCss)
  const darkProps = extractCssCustomProperties(darkCss)

  const modeResult = validateProperties('light.css', lightProps, 'dark.css', darkProps)

  if (modeResult.missing.length > 0) {
    hasErrors = true
    console.log('Missing in dark.css (defined in light.css):')
    modeResult.missing.forEach((prop) => console.log(`  - ${prop}`))
    console.log()
  }

  if (modeResult.extra.length > 0) {
    hasErrors = true
    console.log('Extra in dark.css (not in light.css):')
    modeResult.extra.forEach((prop) => console.log(`  - ${prop}`))
    console.log()
  }

  if (modeResult.missing.length === 0 && modeResult.extra.length === 0) {
    console.log('Mode tokens: OK\n')
  }

  // 2. Validate palette tokens: dusk.css as source of truth
  console.log('Validating palette tokens (dusk.css as source of truth)...\n')

  const duskPaletteCss = readFileSync(join(stylesDir, 'palettes', 'dusk.css'), 'utf-8')
  const duskPaletteProps = extractCssCustomProperties(duskPaletteCss)

  const paletteFiles = readdirSync(join(stylesDir, 'palettes')).filter(
    (f) => f.endsWith('.css') && f !== 'dusk.css'
  )

  for (const paletteFile of paletteFiles) {
    const paletteCss = readFileSync(join(stylesDir, 'palettes', paletteFile), 'utf-8')
    const paletteProps = extractCssCustomProperties(paletteCss)

    const paletteResult = validateProperties('dusk.css', duskPaletteProps, paletteFile, paletteProps)

    if (paletteResult.missing.length > 0) {
      hasErrors = true
      console.log(`Missing in ${paletteFile} (defined in dusk.css):`)
      paletteResult.missing.forEach((prop) => console.log(`  - ${prop}`))
      console.log()
    }

    if (paletteResult.extra.length > 0) {
      hasErrors = true
      console.log(`Extra in ${paletteFile} (not in dusk.css):`)
      paletteResult.extra.forEach((prop) => console.log(`  - ${prop}`))
      console.log()
    }

    if (paletteResult.missing.length === 0 && paletteResult.extra.length === 0) {
      console.log(`${paletteFile}: OK`)
    }
  }

  console.log()

  // 3. Validate theme tokens: dusk.css as source of truth
  console.log('Validating theme tokens (dusk.css as source of truth)...\n')

  const duskThemeCss = readFileSync(join(stylesDir, 'themes', 'dusk.css'), 'utf-8')
  const duskThemeProps = extractCssCustomProperties(duskThemeCss)

  const themeFiles = readdirSync(join(stylesDir, 'themes')).filter(
    (f) => f.endsWith('.css') && f !== 'dusk.css'
  )

  for (const themeFile of themeFiles) {
    const themeCss = readFileSync(join(stylesDir, 'themes', themeFile), 'utf-8')
    const themeProps = extractCssCustomProperties(themeCss)

    const themeResult = validateProperties('dusk.css', duskThemeProps, themeFile, themeProps)

    if (themeResult.missing.length > 0) {
      hasErrors = true
      console.log(`Missing in ${themeFile} (defined in dusk.css):`)
      themeResult.missing.forEach((prop) => console.log(`  - ${prop}`))
      console.log()
    }

    if (themeResult.extra.length > 0) {
      hasErrors = true
      console.log(`Extra in ${themeFile} (not in dusk.css):`)
      themeResult.extra.forEach((prop) => console.log(`  - ${prop}`))
      console.log()
    }

    if (themeResult.missing.length === 0 && themeResult.extra.length === 0) {
      console.log(`${themeFile}: OK`)
    }
  }

  console.log()

  // 4. Validate shadow token format (inset shadows include 'inset' keyword)
  console.log('Validating shadow token formats...\n')

  const allThemeFiles = readdirSync(join(stylesDir, 'themes')).filter((f) => f.endsWith('.css'))
  let shadowFormatErrors = false

  for (const themeFile of allThemeFiles) {
    const themeCss = readFileSync(join(stylesDir, 'themes', themeFile), 'utf-8')
    const themeValues = extractCssCustomPropertyValues(themeCss)

    for (const [prop, value] of themeValues) {
      if (!prop.includes('shadow')) continue

      // Check if this is an inset shadow but doesn't have 'inset' keyword
      if (prop.includes('inset') && !value.includes('inset')) {
        console.log(
          `${themeFile}: ${prop} is an inset shadow but value doesn't include 'inset'`
        )
        shadowFormatErrors = true
      }
      // Check if non-inset shadows accidentally have 'inset' keyword
      if (!prop.includes('inset') && value.includes('inset')) {
        console.log(
          `${themeFile}: ${prop} contains 'inset' but is not in the inset category`
        )
        shadowFormatErrors = true
      }
    }
  }

  if (!shadowFormatErrors) {
    console.log('Shadow token formats: OK\n')
  } else {
    hasErrors = true
    console.log()
  }

  if (hasErrors) {
    console.log('Token validation failed!')
    process.exit(1)
  } else {
    console.log('All tokens validated successfully!')
    process.exit(0)
  }
}

main()
