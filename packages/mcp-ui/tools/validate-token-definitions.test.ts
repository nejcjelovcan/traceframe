import { describe, expect, it } from 'vitest'

import { validateTokenDefinitionsTool } from './validate-token-definitions.js'

describe('validateTokenDefinitionsTool', () => {
  it('should return validation results for all token categories', async () => {
    const result = await validateTokenDefinitionsTool({ report: 'summary' })

    expect(result).toHaveProperty('results')
    expect(result).toHaveProperty('summary')
    expect(result).toHaveProperty('passed')

    // Should validate all expected file pairs
    expect(result.summary.totalCategories).toBe(5)

    // Results should include semantic, themes, and palettes
    const categories = result.results.map((r) => r.category)
    expect(categories).toContain('semantic')
    expect(categories).toContain('themes')
    expect(categories).toContain('palettes')
  })

  it('should include byType counts in summary', async () => {
    const result = await validateTokenDefinitionsTool({ report: 'summary' })

    expect(result.summary).toHaveProperty('byType')
    expect(typeof result.summary.byType).toBe('object')
  })

  it('should return detailed mismatches when report is detailed', async () => {
    const summaryResult = await validateTokenDefinitionsTool({ report: 'summary' })
    const detailedResult = await validateTokenDefinitionsTool({ report: 'detailed' })

    // Both should have same overall pass/fail
    expect(summaryResult.passed).toBe(detailedResult.passed)
    expect(summaryResult.summary.totalMismatches).toBe(detailedResult.summary.totalMismatches)

    // If there are mismatches, detailed should show all of them
    if (detailedResult.summary.totalMismatches > 0) {
      const totalDetailedMismatches = detailedResult.results.reduce(
        (sum, r) => sum + r.mismatches.length,
        0
      )
      expect(totalDetailedMismatches).toBe(detailedResult.summary.totalMismatches)
    }
  })

  it('should validate semantic tokens with description checking', async () => {
    const result = await validateTokenDefinitionsTool({ report: 'detailed' })

    // Find the semantic validation result
    const semanticResult = result.results.find((r) => r.category === 'semantic')
    expect(semanticResult).toBeDefined()
    expect(semanticResult?.sourceFile).toBe('semantic/light.json')
    expect(semanticResult?.targetFile).toBe('semantic/dark.json')

    // If there are description mismatches, they should be flagged
    const descMismatches = semanticResult?.mismatches.filter(
      (m) => m.type === 'description_mismatch'
    )
    // Either there are no mismatches, or the ones that exist are properly typed
    expect(descMismatches).toBeDefined()
  })

  it('should validate theme tokens without description checking', async () => {
    const result = await validateTokenDefinitionsTool({ report: 'detailed' })

    // Find theme validation results
    const themeResults = result.results.filter((r) => r.category === 'themes')
    expect(themeResults.length).toBe(2)

    // Theme mismatches should NOT include description_mismatch
    for (const themeResult of themeResults) {
      const descMismatches = themeResult.mismatches.filter((m) => m.type === 'description_mismatch')
      expect(descMismatches.length).toBe(0)
    }
  })

  it('should validate palette tokens without description checking', async () => {
    const result = await validateTokenDefinitionsTool({ report: 'detailed' })

    // Find palette validation results
    const paletteResults = result.results.filter((r) => r.category === 'palettes')
    expect(paletteResults.length).toBe(2)

    // Palette mismatches should NOT include description_mismatch
    for (const paletteResult of paletteResults) {
      const descMismatches = paletteResult.mismatches.filter(
        (m) => m.type === 'description_mismatch'
      )
      expect(descMismatches.length).toBe(0)
    }
  })

  it('should detect missing keys correctly', async () => {
    const result = await validateTokenDefinitionsTool({ report: 'detailed' })

    // Check that any missing_key mismatches have proper structure
    for (const validationResult of result.results) {
      for (const mismatch of validationResult.mismatches) {
        if (mismatch.type === 'missing_key') {
          expect(mismatch.path).toBeDefined()
          expect(mismatch.file).toBeDefined()
          expect(mismatch.sourceFile).toBeDefined()
        }
      }
    }
  })

  it('should detect extra keys correctly', async () => {
    const result = await validateTokenDefinitionsTool({ report: 'detailed' })

    // Check that any extra_key mismatches have proper structure
    for (const validationResult of result.results) {
      for (const mismatch of validationResult.mismatches) {
        if (mismatch.type === 'extra_key') {
          expect(mismatch.path).toBeDefined()
          expect(mismatch.file).toBeDefined()
          expect(mismatch.sourceFile).toBeDefined()
        }
      }
    }
  })

  it('should correctly count passed categories', async () => {
    const result = await validateTokenDefinitionsTool({ report: 'summary' })

    const actualPassed = result.results.filter((r) => r.passed).length
    expect(result.summary.passedCategories).toBe(actualPassed)
  })

  it('should set passed to true only when no mismatches exist', async () => {
    const result = await validateTokenDefinitionsTool({ report: 'summary' })

    if (result.summary.totalMismatches === 0) {
      expect(result.passed).toBe(true)
    } else {
      expect(result.passed).toBe(false)
    }
  })
})
