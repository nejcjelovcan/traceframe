import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { z } from 'zod'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const validateTokenDefinitionsDescription =
  'Validate token definition CSS files for structural consistency'

export const validateTokenDefinitionsInputSchema = {
  report: z.enum(['summary', 'detailed']).optional().describe('Output format (default: summary)'),
}

interface TokenMismatch {
  type: 'missing_key' | 'extra_key'
  file: string
  sourceFile: string
  path: string
  expected?: string
  actual?: string
}

interface ValidationResult {
  category: 'modes' | 'themes' | 'palettes'
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

/**
 * Extracts all CSS custom property names from a CSS file.
 */
function extractCssCustomProperties(content: string): string[] {
  const properties: string[] = []
  const regex = /^\s*(--[\w-]+)\s*:/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    if (match[1]) {
      properties.push(match[1])
    }
  }
  return properties
}

/**
 * Compare two CSS files and find structural mismatches (missing/extra custom properties).
 */
function compareCssFiles(
  sourceProps: string[],
  targetProps: string[],
  sourceFile: string,
  targetFile: string
): TokenMismatch[] {
  const mismatches: TokenMismatch[] = []

  const sourceSet = new Set(sourceProps)
  const targetSet = new Set(targetProps)

  // Find missing keys (in source but not in target)
  for (const prop of sourceProps) {
    if (!targetSet.has(prop)) {
      mismatches.push({
        type: 'missing_key',
        file: targetFile,
        sourceFile,
        path: prop,
        expected: 'property exists',
        actual: 'property missing',
      })
    }
  }

  // Find extra keys (in target but not in source)
  for (const prop of targetProps) {
    if (!sourceSet.has(prop)) {
      mismatches.push({
        type: 'extra_key',
        file: targetFile,
        sourceFile,
        path: prop,
        expected: 'property not present',
        actual: 'extra property',
      })
    }
  }

  return mismatches
}

export async function validateTokenDefinitionsTool({
  report = 'summary',
}: {
  report?: 'summary' | 'detailed'
} = {}): Promise<ValidateTokenDefinitionsOutput> {
  const stylesDir = resolve(__dirname, '../../ui-library/src/styles/tokens')

  const results: ValidationResult[] = []

  // 1. Validate mode tokens: light.css (source) vs dark.css
  const modesDir = join(stylesDir, 'modes')
  const lightCss = await readFile(join(modesDir, 'light.css'), 'utf-8')
  const darkCss = await readFile(join(modesDir, 'dark.css'), 'utf-8')

  const lightProps = extractCssCustomProperties(lightCss)
  const darkProps = extractCssCustomProperties(darkCss)

  const modeMismatches = compareCssFiles(lightProps, darkProps, 'modes/light.css', 'modes/dark.css')

  results.push({
    category: 'modes',
    sourceFile: 'modes/light.css',
    targetFile: 'modes/dark.css',
    mismatches: modeMismatches,
    passed: modeMismatches.length === 0,
  })

  // 2. Validate theme tokens: arctic.css (source) vs other themes
  const themesDir = join(stylesDir, 'themes')
  const arcticThemeCss = await readFile(join(themesDir, 'arctic.css'), 'utf-8')
  const arcticThemeProps = extractCssCustomProperties(arcticThemeCss)

  const themeFiles = (await readdir(themesDir)).filter(
    (f) => f.endsWith('.css') && f !== 'arctic.css'
  )

  for (const themeFile of themeFiles) {
    const themeCss = await readFile(join(themesDir, themeFile), 'utf-8')
    const themeProps = extractCssCustomProperties(themeCss)

    const themeMismatches = compareCssFiles(
      arcticThemeProps,
      themeProps,
      'themes/arctic.css',
      `themes/${themeFile}`
    )

    results.push({
      category: 'themes',
      sourceFile: 'themes/arctic.css',
      targetFile: `themes/${themeFile}`,
      mismatches: themeMismatches,
      passed: themeMismatches.length === 0,
    })
  }

  // 3. Validate palette tokens: palettes/arctic.css (source) vs other palettes
  const palettesDir = join(stylesDir, 'palettes')
  const arcticPaletteCss = await readFile(join(palettesDir, 'arctic.css'), 'utf-8')
  const arcticPaletteProps = extractCssCustomProperties(arcticPaletteCss)

  const paletteFiles = (await readdir(palettesDir)).filter(
    (f) => f.endsWith('.css') && f !== 'arctic.css'
  )

  for (const paletteFile of paletteFiles) {
    const paletteCss = await readFile(join(palettesDir, paletteFile), 'utf-8')
    const paletteProps = extractCssCustomProperties(paletteCss)

    const paletteMismatches = compareCssFiles(
      arcticPaletteProps,
      paletteProps,
      'palettes/arctic.css',
      `palettes/${paletteFile}`
    )

    results.push({
      category: 'palettes',
      sourceFile: 'palettes/arctic.css',
      targetFile: `palettes/${paletteFile}`,
      mismatches: paletteMismatches,
      passed: paletteMismatches.length === 0,
    })
  }

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
      mismatches: r.mismatches.slice(0, 3),
    }))
    output.results = detailedResults
  }

  return output
}
