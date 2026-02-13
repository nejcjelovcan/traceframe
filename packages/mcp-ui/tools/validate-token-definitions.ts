import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { z } from 'zod'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const validateTokenDefinitionsDescription =
  'Validate token definition files for structural consistency and description matching'

export const validateTokenDefinitionsInputSchema = {
  report: z.enum(['summary', 'detailed']).optional().describe('Output format (default: summary)'),
}

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

interface ValidateTokenDefinitionsOutput {
  results: ValidationResult[]
  summary: {
    totalCategories: number
    passedCategories: number
    totalMismatches: number
    byType: Record<string, number>
  }
  passed: boolean
}

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[] | undefined
interface JsonObject {
  [key: string]: JsonValue
}

/**
 * Recursively get all keys in a nested object, returning them as dot-separated paths.
 * Only returns leaf keys (keys that don't have nested objects with non-$ keys).
 */
function getAllKeyPaths(obj: JsonObject, prefix = ''): string[] {
  const paths: string[] = []

  for (const key of Object.keys(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Check if this object has any non-$ keys (i.e., nested structure)
      const nonMetaKeys = Object.keys(value as JsonObject).filter((k) => !k.startsWith('$'))
      if (nonMetaKeys.length > 0) {
        // Has nested structure, recurse
        paths.push(...getAllKeyPaths(value as JsonObject, currentPath))
      } else {
        // Leaf node (only has $value, $type, etc.)
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

  // Find missing keys (in source but not in target)
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

  // Find extra keys (in target but not in source)
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

  // Check descriptions if required
  if (checkDescriptions) {
    for (const key of sourceKeys) {
      if (targetKeys.has(key)) {
        const sourceDesc = getDescriptionAtPath(source, key)
        const targetDesc = getDescriptionAtPath(target, key)

        if (sourceDesc !== targetDesc) {
          const mismatch: TokenMismatch = {
            type: 'description_mismatch',
            file: targetFile,
            sourceFile,
            path: key,
          }
          if (sourceDesc !== undefined) {
            mismatch.expected = sourceDesc
          }
          if (targetDesc !== undefined) {
            mismatch.actual = targetDesc
          }
          mismatches.push(mismatch)
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

export async function validateTokenDefinitionsTool({
  report = 'summary',
}: {
  report?: 'summary' | 'detailed'
} = {}): Promise<ValidateTokenDefinitionsOutput> {
  const tokensDir = resolve(__dirname, '../../ui-library/tokens')

  const results: ValidationResult[] = []

  // 1. Validate semantic tokens: light.json (source) vs dark.json (descriptions must match)
  const semanticDir = join(tokensDir, 'semantic')
  const lightJson = await loadJsonFile(join(semanticDir, 'light.json'))
  const darkJson = await loadJsonFile(join(semanticDir, 'dark.json'))

  const semanticMismatches = compareTokenFiles(
    lightJson,
    darkJson,
    'semantic/light.json',
    'semantic/dark.json',
    true // Check descriptions
  )

  results.push({
    category: 'semantic',
    sourceFile: 'semantic/light.json',
    targetFile: 'semantic/dark.json',
    mismatches: semanticMismatches,
    passed: semanticMismatches.length === 0,
  })

  // 2. Validate theme tokens: dusk.json (source) vs arctic.json, ember.json (structure only)
  const themesDir = join(tokensDir, 'themes')
  const duskThemeJson = await loadJsonFile(join(themesDir, 'dusk.json'))
  const arcticThemeJson = await loadJsonFile(join(themesDir, 'arctic.json'))
  const emberThemeJson = await loadJsonFile(join(themesDir, 'ember.json'))

  // Remove top-level $ keys for comparison (they're metadata, not structure)
  const filterMetadataKeys = (obj: JsonObject): JsonObject => {
    const filtered: JsonObject = {}
    for (const key of Object.keys(obj)) {
      if (!key.startsWith('$')) {
        filtered[key] = obj[key]
      }
    }
    return filtered
  }

  const duskThemeFiltered = filterMetadataKeys(duskThemeJson)
  const arcticThemeFiltered = filterMetadataKeys(arcticThemeJson)
  const emberThemeFiltered = filterMetadataKeys(emberThemeJson)

  const arcticThemeMismatches = compareTokenFiles(
    duskThemeFiltered,
    arcticThemeFiltered,
    'themes/dusk.json',
    'themes/arctic.json',
    false // Don't check descriptions
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
    false // Don't check descriptions
  )

  results.push({
    category: 'themes',
    sourceFile: 'themes/dusk.json',
    targetFile: 'themes/ember.json',
    mismatches: emberThemeMismatches,
    passed: emberThemeMismatches.length === 0,
  })

  // 3. Validate palette tokens: palettes/dusk.json (source) vs arctic.json, ember.json (structure only)
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
    false // Don't check descriptions
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
    false // Don't check descriptions
  )

  results.push({
    category: 'palettes',
    sourceFile: 'palettes/dusk.json',
    targetFile: 'palettes/ember.json',
    mismatches: emberPaletteMismatches,
    passed: emberPaletteMismatches.length === 0,
  })

  // Calculate summary
  const allMismatches = results.flatMap((r) => r.mismatches)
  const byType: Record<string, number> = {}
  for (const mismatch of allMismatches) {
    byType[mismatch.type] = (byType[mismatch.type] || 0) + 1
  }

  const output: ValidateTokenDefinitionsOutput = {
    results: report === 'detailed' ? results : results.map((r) => ({ ...r, mismatches: [] })),
    summary: {
      totalCategories: results.length,
      passedCategories: results.filter((r) => r.passed).length,
      totalMismatches: allMismatches.length,
      byType,
    },
    passed: allMismatches.length === 0,
  }

  // For summary mode, include first few mismatches as examples
  if (report === 'summary' && allMismatches.length > 0) {
    const detailedResults = results.map((r) => ({
      ...r,
      mismatches: r.mismatches.slice(0, 3), // Show first 3 mismatches per result
    }))
    output.results = detailedResults
  }

  return output
}
