#!/usr/bin/env tsx
/**
 * CI script to validate token definition files for consistency.
 *
 * Validates:
 * 1. Semantic tokens: dark.json descriptions must match light.json
 * 2. Theme tokens: arctic.json/ember.json structure must match dusk.json
 * 3. Palette tokens: arctic.json/ember.json structure must match dusk.json
 *
 * Usage:
 *   pnpm validate:token-definitions
 *   pnpm validate:token-definitions --report=detailed
 */

import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface TokenMismatch {
  type: 'missing_key' | 'extra_key' | 'description_mismatch'
  file: string
  sourceFile: string
  path: string
  expected?: string
  actual?: string
}

interface ValidationResult {
  category: 'semantic' | 'themes' | 'palettes'
  sourceFile: string
  targetFile: string
  mismatches: TokenMismatch[]
  passed: boolean
}

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]
interface JsonObject {
  [key: string]: JsonValue
}

/**
 * Recursively get all keys in a nested object, returning them as dot-separated paths.
 */
function getAllKeyPaths(obj: JsonObject, prefix = ''): string[] {
  const paths: string[] = []

  for (const key of Object.keys(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const nonMetaKeys = Object.keys(value as JsonObject).filter((k) => !k.startsWith('$'))
      if (nonMetaKeys.length > 0) {
        paths.push(...getAllKeyPaths(value as JsonObject, currentPath))
      } else {
        paths.push(currentPath)
      }
    }
  }

  return paths
}

/**
 * Get the value at a given path in a nested object.
 */
function getValueAtPath(obj: JsonObject, path: string): JsonValue | undefined {
  const parts = path.split('.')
  let current: JsonValue = obj

  for (const part of parts) {
    if (current === null || typeof current !== 'object' || Array.isArray(current)) {
      return undefined
    }
    current = (current as JsonObject)[part]
  }

  return current
}

/**
 * Get the $description value at a given path.
 */
function getDescriptionAtPath(obj: JsonObject, path: string): string | undefined {
  const value = getValueAtPath(obj, path)
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const desc = (value as JsonObject)['$description']
    if (typeof desc === 'string') {
      return desc
    }
  }
  return undefined
}

/**
 * Compare two token files and find structural/description mismatches.
 */
function compareTokenFiles(
  source: JsonObject,
  target: JsonObject,
  sourceFile: string,
  targetFile: string,
  checkDescriptions: boolean
): TokenMismatch[] {
  const mismatches: TokenMismatch[] = []

  const sourceKeys = new Set(getAllKeyPaths(source))
  const targetKeys = new Set(getAllKeyPaths(target))

  for (const key of sourceKeys) {
    if (!targetKeys.has(key)) {
      mismatches.push({
        type: 'missing_key',
        file: targetFile,
        sourceFile,
        path: key,
        expected: 'key exists',
        actual: 'key missing',
      })
    }
  }

  for (const key of targetKeys) {
    if (!sourceKeys.has(key)) {
      mismatches.push({
        type: 'extra_key',
        file: targetFile,
        sourceFile,
        path: key,
        expected: 'key not present',
        actual: 'extra key',
      })
    }
  }

  if (checkDescriptions) {
    for (const key of sourceKeys) {
      if (targetKeys.has(key)) {
        const sourceDesc = getDescriptionAtPath(source, key)
        const targetDesc = getDescriptionAtPath(target, key)

        if (sourceDesc !== targetDesc) {
          mismatches.push({
            type: 'description_mismatch',
            file: targetFile,
            sourceFile,
            path: key,
            expected: sourceDesc,
            actual: targetDesc,
          })
        }
      }
    }
  }

  return mismatches
}

/**
 * Load and parse a JSON file.
 */
async function loadJsonFile(filePath: string): Promise<JsonObject> {
  const content = await readFile(filePath, 'utf-8')
  return JSON.parse(content) as JsonObject
}

/**
 * Filter out top-level $ keys (metadata).
 */
function filterMetadataKeys(obj: JsonObject): JsonObject {
  const filtered: JsonObject = {}
  for (const key of Object.keys(obj)) {
    if (!key.startsWith('$')) {
      filtered[key] = obj[key]
    }
  }
  return filtered
}

async function main() {
  const args = process.argv.slice(2)
  const reportMode = args.includes('--report=detailed') ? 'detailed' : 'summary'

  const tokensDir = resolve(__dirname, '../packages/ui-library/tokens')
  const results: ValidationResult[] = []

  console.log('Validating token definition files...\n')

  // 1. Validate semantic tokens
  const semanticDir = join(tokensDir, 'semantic')
  const lightJson = await loadJsonFile(join(semanticDir, 'light.json'))
  const darkJson = await loadJsonFile(join(semanticDir, 'dark.json'))

  const semanticMismatches = compareTokenFiles(
    lightJson,
    darkJson,
    'semantic/light.json',
    'semantic/dark.json',
    true
  )

  results.push({
    category: 'semantic',
    sourceFile: 'semantic/light.json',
    targetFile: 'semantic/dark.json',
    mismatches: semanticMismatches,
    passed: semanticMismatches.length === 0,
  })

  // 2. Validate theme tokens
  const themesDir = join(tokensDir, 'themes')
  const duskThemeJson = await loadJsonFile(join(themesDir, 'dusk.json'))
  const arcticThemeJson = await loadJsonFile(join(themesDir, 'arctic.json'))
  const emberThemeJson = await loadJsonFile(join(themesDir, 'ember.json'))

  const duskThemeFiltered = filterMetadataKeys(duskThemeJson)
  const arcticThemeFiltered = filterMetadataKeys(arcticThemeJson)
  const emberThemeFiltered = filterMetadataKeys(emberThemeJson)

  const arcticThemeMismatches = compareTokenFiles(
    duskThemeFiltered,
    arcticThemeFiltered,
    'themes/dusk.json',
    'themes/arctic.json',
    false
  )

  results.push({
    category: 'themes',
    sourceFile: 'themes/dusk.json',
    targetFile: 'themes/arctic.json',
    mismatches: arcticThemeMismatches,
    passed: arcticThemeMismatches.length === 0,
  })

  const emberThemeMismatches = compareTokenFiles(
    duskThemeFiltered,
    emberThemeFiltered,
    'themes/dusk.json',
    'themes/ember.json',
    false
  )

  results.push({
    category: 'themes',
    sourceFile: 'themes/dusk.json',
    targetFile: 'themes/ember.json',
    mismatches: emberThemeMismatches,
    passed: emberThemeMismatches.length === 0,
  })

  // 3. Validate palette tokens
  const palettesDir = join(tokensDir, 'palettes')
  const duskPaletteJson = await loadJsonFile(join(palettesDir, 'dusk.json'))
  const arcticPaletteJson = await loadJsonFile(join(palettesDir, 'arctic.json'))
  const emberPaletteJson = await loadJsonFile(join(palettesDir, 'ember.json'))

  const duskPaletteFiltered = filterMetadataKeys(duskPaletteJson)
  const arcticPaletteFiltered = filterMetadataKeys(arcticPaletteJson)
  const emberPaletteFiltered = filterMetadataKeys(emberPaletteJson)

  const arcticPaletteMismatches = compareTokenFiles(
    duskPaletteFiltered,
    arcticPaletteFiltered,
    'palettes/dusk.json',
    'palettes/arctic.json',
    false
  )

  results.push({
    category: 'palettes',
    sourceFile: 'palettes/dusk.json',
    targetFile: 'palettes/arctic.json',
    mismatches: arcticPaletteMismatches,
    passed: arcticPaletteMismatches.length === 0,
  })

  const emberPaletteMismatches = compareTokenFiles(
    duskPaletteFiltered,
    emberPaletteFiltered,
    'palettes/dusk.json',
    'palettes/ember.json',
    false
  )

  results.push({
    category: 'palettes',
    sourceFile: 'palettes/dusk.json',
    targetFile: 'palettes/ember.json',
    mismatches: emberPaletteMismatches,
    passed: emberPaletteMismatches.length === 0,
  })

  // Print results
  let totalMismatches = 0
  let passedCategories = 0

  for (const result of results) {
    const status = result.passed ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'
    console.log(`${status} ${result.sourceFile} -> ${result.targetFile}`)

    if (result.passed) {
      passedCategories++
    } else {
      totalMismatches += result.mismatches.length

      if (reportMode === 'detailed') {
        for (const mismatch of result.mismatches) {
          console.log(`    \x1b[33m${mismatch.type}\x1b[0m at ${mismatch.path}`)
          if (mismatch.expected !== undefined) {
            console.log(`      Expected: ${mismatch.expected}`)
          }
          if (mismatch.actual !== undefined) {
            console.log(`      Actual:   ${mismatch.actual}`)
          }
        }
      } else {
        // Summary mode: show count and first few examples
        console.log(`    ${result.mismatches.length} mismatch(es) found`)
        const examples = result.mismatches.slice(0, 3)
        for (const mismatch of examples) {
          console.log(`    - ${mismatch.type}: ${mismatch.path}`)
        }
        if (result.mismatches.length > 3) {
          console.log(`    ... and ${result.mismatches.length - 3} more`)
        }
      }
    }
  }

  console.log('')
  console.log(`Validated ${results.length} file pairs: ${passedCategories} passed, ${results.length - passedCategories} failed`)

  if (totalMismatches > 0) {
    console.log(`\n\x1b[31mValidation failed with ${totalMismatches} total mismatch(es)\x1b[0m`)
    process.exit(1)
  } else {
    console.log('\n\x1b[32mAll token definitions are consistent!\x1b[0m')
  }
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
