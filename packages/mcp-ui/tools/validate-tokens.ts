import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { glob } from 'glob'
import { z } from 'zod'

import {
  getSizingSuggestion,
  getSpacingSuggestion,
  getSuggestion,
  isNonSemanticColorClass,
  isNonSemanticSizingClass,
  isNonSemanticSpacingClass,
} from '@traceframe/ui-library'

export const validateTokensDescription =
  'Validate semantic token usage in TypeScript/TSX files and provide migration suggestions'

export const validateTokensInputSchema = {
  path: z.string().optional().describe('Directory/file to validate (default: workspace)'),
  fix: z.boolean().optional().describe('Apply automatic fixes'),
  report: z.enum(['summary', 'detailed']).optional().describe('Output format'),
  includeTests: z.boolean().optional().describe('Include test files'),
}

interface TokenViolation {
  file: string
  line: number
  column: number
  className: string
  suggestion?: string | undefined
  context: string
  type: 'color' | 'spacing' | 'sizing'
  severity: 'error' | 'warning'
}

interface MigrationSuggestion {
  from: string
  to: string
  count: number
  files: string[]
}

interface ValidateTokensOutput {
  violations: TokenViolation[]
  summary: {
    totalFiles: number
    filesWithViolations: number
    totalViolations: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
  }
  suggestions: MigrationSuggestion[]
}

interface RawViolation {
  className: string
  line: number
  column: number
  context: string
  type: 'color' | 'spacing' | 'sizing'
  severity: 'error' | 'warning'
}

function extractTailwindClassViolations(content: string): RawViolation[] {
  const results: RawViolation[] = []
  const lines = content.split('\n')

  lines.forEach((line, lineIndex) => {
    // Find all string literals that could contain Tailwind classes
    const stringLiterals: Array<{ value: string; index: number }> = []

    // Match various patterns for string literals
    const patterns = [
      /["']([^"']*?)["']/g, // Regular strings
      /`([^`]*?)`/g, // Template literals
    ]

    patterns.forEach((pattern) => {
      let match: RegExpExecArray | null
      pattern.lastIndex = 0
      while ((match = pattern.exec(line)) !== null) {
        if (match[1]) {
          stringLiterals.push({ value: match[1], index: match.index })
        }
      }
    })

    // Process each string literal
    stringLiterals.forEach(({ value, index }) => {
      const classes = value.split(/\s+/).filter(Boolean)

      classes.forEach((className) => {
        if (isNonSemanticColorClass(className)) {
          const column = line.indexOf(className, index)
          results.push({
            className,
            line: lineIndex + 1,
            column: column + 1,
            context: line.trim(),
            type: 'color',
            severity: 'error',
          })
        } else if (isNonSemanticSpacingClass(className)) {
          const column = line.indexOf(className, index)
          results.push({
            className,
            line: lineIndex + 1,
            column: column + 1,
            context: line.trim(),
            type: 'spacing',
            severity: 'warning',
          })
        } else if (isNonSemanticSizingClass(className)) {
          const column = line.indexOf(className, index)
          results.push({
            className,
            line: lineIndex + 1,
            column: column + 1,
            context: line.trim(),
            type: 'sizing',
            severity: 'warning',
          })
        }
      })
    })
  })

  return results
}

/**
 * Extract direct --palette-* CSS variable usages from content.
 * These are violations because UI code should only use semantic tokens (--color-*).
 */
function extractPaletteVarUsages(
  content: string
): Array<{ className: string; line: number; column: number; context: string }> {
  const results: Array<{ className: string; line: number; column: number; context: string }> = []
  const lines = content.split('\n')

  // Match --palette-* CSS variable usages (e.g., var(--palette-primary-500) or --palette-neutral-100)
  const paletteVarPattern = /--palette-[\w-]+/g

  lines.forEach((line, lineIndex) => {
    let match: RegExpExecArray | null
    paletteVarPattern.lastIndex = 0

    while ((match = paletteVarPattern.exec(line)) !== null) {
      results.push({
        className: match[0],
        line: lineIndex + 1,
        column: match.index + 1,
        context: line.trim(),
      })
    }
  })

  return results
}

/**
 * Get the appropriate suggestion based on violation type.
 */
function getSuggestionForViolation(violation: RawViolation): string | undefined {
  switch (violation.type) {
    case 'color':
      return getSuggestion(violation.className)
    case 'spacing':
      return getSpacingSuggestion(violation.className)
    case 'sizing':
      return getSizingSuggestion(violation.className)
  }
}

/**
 * Check if a suggestion is an exact match (not a "nearest:" hint).
 */
function isExactSuggestion(suggestion: string): boolean {
  return !suggestion.startsWith('nearest:')
}

export async function validateTokensTool({
  path = '.',
  fix = false,
  report = 'summary',
  includeTests = false,
}: {
  path?: string
  fix?: boolean
  report?: 'summary' | 'detailed'
  includeTests?: boolean
} = {}): Promise<ValidateTokensOutput> {
  const targetPath = resolve(process.cwd(), path)

  // Find all TypeScript/TSX files
  const pattern = '**/*.{ts,tsx}'

  const ignorePatterns = [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.turbo/**',
    '**/coverage/**',
    '**/fixtures/**',
    // Exclude files where direct palette usage is allowed
    '**/ui-library/src/styles/**',
    '**/ui-library/src/tailwind-preset.ts',
    '**/ui-library/tailwind-preset.ts',
    // Migration helper contains non-semantic tokens as map keys/values
    '**/mcp-ui/utils/migration-helper.ts',
    // Validate tokens tool has palette examples in code comments
    '**/mcp-ui/tools/validate-tokens.ts',
    // Semantic token utils define the mapping from palette to semantic tokens
    '**/ui-library/src/utils/semantic-token-utils.ts',
    // Style dictionary config and formatters define palette generation
    '**/ui-library/style-dictionary/**',
    // PaletteShowcase story intentionally displays raw palette colors
    '**/ui-library/src/stories/PaletteShowcase.stories.tsx',
  ]

  // Add test file patterns to ignore list if not including tests
  if (!includeTests) {
    ignorePatterns.push('**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}')
  }

  const files = await glob(pattern, {
    cwd: targetPath,
    ignore: ignorePatterns,
  })

  const violations: TokenViolation[] = []
  const violationsByFile = new Map<string, TokenViolation[]>()
  const suggestionCounts = new Map<string, { count: number; files: Set<string> }>()

  // Process each file
  for (const file of files) {
    const filePath = join(targetPath, file)
    const content = await readFile(filePath, 'utf-8')

    // Extract Tailwind class violations (color, spacing, sizing) and --palette-* CSS variable violations
    const tailwindViolations = extractTailwindClassViolations(content)
    const paletteVarViolations = extractPaletteVarUsages(content)
    const fileViolations: RawViolation[] = [
      ...tailwindViolations,
      ...paletteVarViolations.map((v) => ({
        ...v,
        type: 'color' as const,
        severity: 'error' as const,
      })),
    ]

    for (const violation of fileViolations) {
      const suggestion = getSuggestionForViolation(violation)
      const fullViolation: TokenViolation = {
        file,
        line: violation.line,
        column: violation.column,
        className: violation.className,
        ...(suggestion ? { suggestion } : {}),
        context: violation.context,
        type: violation.type,
        severity: violation.severity,
      }

      violations.push(fullViolation)

      if (!violationsByFile.has(file)) {
        violationsByFile.set(file, [])
      }
      violationsByFile.get(file)!.push(fullViolation)

      // Track suggestions
      if (suggestion) {
        const key = `${violation.className} → ${suggestion}`
        if (!suggestionCounts.has(key)) {
          suggestionCounts.set(key, { count: 0, files: new Set() })
        }
        const entry = suggestionCounts.get(key)!
        entry.count++
        entry.files.add(file)
      }
    }
  }

  // Apply fixes if requested
  if (fix && violations.length > 0) {
    for (const [file, fileViolations] of violationsByFile.entries()) {
      const filePath = join(targetPath, file)
      const content = await readFile(filePath, 'utf-8')
      const lines = content.split('\n')

      // Sort violations by position (reverse order to maintain positions)
      // Only fix exact-match suggestions (not "nearest:" hints)
      const sortedViolations = fileViolations
        .filter((v) => v.suggestion && isExactSuggestion(v.suggestion))
        .sort((a, b) => {
          if (b.line !== a.line) return b.line - a.line
          return b.column - a.column
        })

      // Apply replacements line by line to avoid affecting unintended matches
      for (const violation of sortedViolations) {
        if (violation.suggestion && violation.line > 0 && violation.line <= lines.length) {
          const lineIndex = violation.line - 1
          const line = lines[lineIndex]
          if (line) {
            // Create a more targeted regex that respects word boundaries
            // and only replaces within the specific occurrence context
            const beforeColumn = line.substring(0, Math.max(0, violation.column - 1))
            const afterColumn = line.substring(violation.column - 1)

            // Replace only the first occurrence after the column position
            const regex = new RegExp(`\\b${violation.className}\\b`)
            if (regex.test(afterColumn)) {
              lines[lineIndex] = beforeColumn + afterColumn.replace(regex, violation.suggestion)
            }
          }
        }
      }

      // Write back the fixed content
      const { writeFile } = await import('node:fs/promises')
      await writeFile(filePath, lines.join('\n'), 'utf-8')
    }
  }

  // Prepare suggestions
  const suggestions: MigrationSuggestion[] = Array.from(suggestionCounts.entries())
    .map(([key, value]) => {
      const [from, to] = key.split(' → ')
      if (!from || !to) return null
      return {
        from,
        to,
        count: value.count,
        files: Array.from(value.files),
      }
    })
    .filter((s): s is MigrationSuggestion => s !== null)
    .sort((a, b) => b.count - a.count)

  // Calculate summary by violation type and severity
  const byType: Record<string, number> = {}
  const bySeverity: Record<string, number> = {}
  for (const violation of violations) {
    byType[violation.type] = (byType[violation.type] || 0) + 1
    bySeverity[violation.severity] = (bySeverity[violation.severity] || 0) + 1
  }

  return {
    violations: report === 'detailed' ? violations : violations.slice(0, 10),
    summary: {
      totalFiles: files.length,
      filesWithViolations: violationsByFile.size,
      totalViolations: violations.length,
      byType,
      bySeverity,
    },
    suggestions: suggestions.slice(0, 20), // Top 20 suggestions
  }
}
