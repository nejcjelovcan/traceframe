#!/usr/bin/env node
/**
 * Validates token consistency across JSON files:
 * 1. All tokens in light.json must exist in dark.json (semantic tokens)
 * 2. All tokens in dusk.json must exist in all other palette JSONs
 */

import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tokensDir = join(__dirname, '..', 'tokens')

/**
 * Recursively extracts all token paths from a JSON object.
 * A token is identified by having a $value property.
 * @param {object} obj - The object to traverse
 * @param {string} prefix - Current path prefix
 * @returns {string[]} Array of token paths
 */
function extractTokenPaths(obj, prefix = '') {
  const paths = []

  for (const [key, value] of Object.entries(obj)) {
    // Skip $ prefixed keys (metadata)
    if (key.startsWith('$')) continue

    const currentPath = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null) {
      // If this object has $value, it's a token
      if ('$value' in value) {
        paths.push(currentPath)
      }
      // Recurse into nested objects
      paths.push(...extractTokenPaths(value, currentPath))
    }
  }

  return paths
}

/**
 * Checks if a path exists in an object
 * @param {object} obj - The object to check
 * @param {string} path - Dot-separated path
 * @returns {boolean}
 */
function pathExists(obj, path) {
  const parts = path.split('.')
  let current = obj

  for (const part of parts) {
    if (current === null || typeof current !== 'object' || !(part in current)) {
      return false
    }
    current = current[part]
  }

  return current !== null && typeof current === 'object' && '$value' in current
}

/**
 * Validates that all tokens in source exist in target
 * @param {string} sourceName - Name of source file
 * @param {object} sourceTokens - Source token object
 * @param {string} targetName - Name of target file
 * @param {object} targetTokens - Target token object
 * @returns {{ missing: string[], extra: string[] }}
 */
function validateTokens(sourceName, sourceTokens, targetName, targetTokens) {
  const sourcePaths = extractTokenPaths(sourceTokens)
  const targetPaths = extractTokenPaths(targetTokens)

  const missing = sourcePaths.filter((path) => !pathExists(targetTokens, path))
  const extra = targetPaths.filter((path) => !pathExists(sourceTokens, path))

  return { missing, extra }
}

function main() {
  let hasErrors = false

  // 1. Validate semantic tokens: light.json -> dark.json
  console.log('Validating semantic tokens (light.json as source of truth)...\n')

  const lightJson = JSON.parse(readFileSync(join(tokensDir, 'semantic', 'light.json'), 'utf-8'))
  const darkJson = JSON.parse(readFileSync(join(tokensDir, 'semantic', 'dark.json'), 'utf-8'))

  // Extract the inner object (skip the "light"/"dark" wrapper)
  const lightTokens = lightJson
  const darkTokens = darkJson

  const semanticResult = validateTokens('light.json', lightTokens, 'dark.json', darkTokens)

  if (semanticResult.missing.length > 0) {
    hasErrors = true
    console.log('Missing in dark.json (defined in light.json):')
    semanticResult.missing.forEach((path) => console.log(`  - ${path}`))
    console.log()
  }

  if (semanticResult.extra.length > 0) {
    hasErrors = true
    console.log('Extra in dark.json (not in light.json):')
    semanticResult.extra.forEach((path) => console.log(`  - ${path}`))
    console.log()
  }

  if (semanticResult.missing.length === 0 && semanticResult.extra.length === 0) {
    console.log('Semantic tokens: OK\n')
  }

  // 2. Validate palette tokens: dusk.json as source of truth
  console.log('Validating palette tokens (dusk.json as source of truth)...\n')

  const duskJson = JSON.parse(readFileSync(join(tokensDir, 'palettes', 'dusk.json'), 'utf-8'))
  const duskTokens = duskJson

  // Find all other palette files
  const paletteFiles = readdirSync(join(tokensDir, 'palettes')).filter(
    (f) => f.endsWith('.json') && f !== 'dusk.json'
  )

  for (const paletteFile of paletteFiles) {
    const paletteJson = JSON.parse(readFileSync(join(tokensDir, 'palettes', paletteFile), 'utf-8'))
    const paletteTokens = paletteJson

    const paletteResult = validateTokens('dusk.json', duskTokens, paletteFile, paletteTokens)

    if (paletteResult.missing.length > 0) {
      hasErrors = true
      console.log(`Missing in ${paletteFile} (defined in dusk.json):`)
      paletteResult.missing.forEach((path) => console.log(`  - ${path}`))
      console.log()
    }

    if (paletteResult.extra.length > 0) {
      hasErrors = true
      console.log(`Extra in ${paletteFile} (not in dusk.json):`)
      paletteResult.extra.forEach((path) => console.log(`  - ${path}`))
      console.log()
    }

    if (paletteResult.missing.length === 0 && paletteResult.extra.length === 0) {
      console.log(`${paletteFile}: OK`)
    }
  }

  console.log()

  // 3. Validate theme tokens (shadows, borders, gradients): dusk.json as source of truth
  console.log('Validating theme tokens (dusk.json as source of truth)...\n')

  const themeDuskJson = JSON.parse(readFileSync(join(tokensDir, 'themes', 'dusk.json'), 'utf-8'))
  const themeDuskTokens = themeDuskJson

  // Find all other theme files
  const themeFiles = readdirSync(join(tokensDir, 'themes')).filter(
    (f) => f.endsWith('.json') && f !== 'dusk.json'
  )

  for (const themeFile of themeFiles) {
    const themeJson = JSON.parse(readFileSync(join(tokensDir, 'themes', themeFile), 'utf-8'))
    const themeTokens = themeJson

    const themeResult = validateTokens('dusk.json', themeDuskTokens, themeFile, themeTokens)

    if (themeResult.missing.length > 0) {
      hasErrors = true
      console.log(`Missing in ${themeFile} (defined in dusk.json):`)
      themeResult.missing.forEach((path) => console.log(`  - ${path}`))
      console.log()
    }

    if (themeResult.extra.length > 0) {
      hasErrors = true
      console.log(`Extra in ${themeFile} (not in dusk.json):`)
      themeResult.extra.forEach((path) => console.log(`  - ${path}`))
      console.log()
    }

    if (themeResult.missing.length === 0 && themeResult.extra.length === 0) {
      console.log(`${themeFile}: OK`)
    }
  }

  console.log()

  // 4. Validate shadow token format (inset shadows include 'inset' keyword)
  console.log('Validating shadow token formats...\n')

  const allThemeFiles = readdirSync(join(tokensDir, 'themes')).filter((f) => f.endsWith('.json'))
  let shadowFormatErrors = false

  for (const themeFile of allThemeFiles) {
    const themeJson = JSON.parse(readFileSync(join(tokensDir, 'themes', themeFile), 'utf-8'))
    const shadowTokens = themeJson.shadow || {}

    // Check inset shadows include 'inset' keyword
    const checkShadowFormat = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key

        if (value && typeof value === 'object') {
          if (value.$value && value.$type === 'shadow') {
            // Check if this is an inset shadow but doesn't have 'inset' keyword
            if (currentPath.includes('inset') && !value.$value.includes('inset')) {
              console.log(`${themeFile}: shadow.${currentPath} is an inset shadow but doesn't start with 'inset'`)
              shadowFormatErrors = true
            }
            // Check if non-inset shadows accidentally have 'inset' keyword
            if (!currentPath.includes('inset') && value.$value.includes('inset')) {
              console.log(`${themeFile}: shadow.${currentPath} contains 'inset' but is not in the inset category`)
              shadowFormatErrors = true
            }
          } else if (!value.$value) {
            // Recurse into nested objects
            checkShadowFormat(value, currentPath)
          }
        }
      }
    }

    checkShadowFormat(shadowTokens)
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
