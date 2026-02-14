import { describe, expect, it } from 'vitest'

import {
  type ContextScriptResult,
  type PackageScriptResult,
  ALLOWED_SCRIPTS,
  DEFAULT_TIMEOUT_MS,
  MAX_OUTPUT_LINES,
  parseContextOutput,
  runTurboTaskForContext,
  runTurboTaskForPackage,
  truncateOutput,
} from './turbo-runner.js'

describe('turbo-runner', () => {
  describe('truncateOutput', () => {
    it('should not truncate output shorter than maxLines', () => {
      const shortOutput = 'line1\nline2\nline3'
      const result = truncateOutput(shortOutput, 5)
      expect(result).toBe(shortOutput)
    })

    it('should truncate output longer than maxLines', () => {
      const lines = Array.from({ length: 100 }, (_, i) => `line${i + 1}`).join('\n')
      const result = truncateOutput(lines, 10)

      expect(result).toContain('[... 90 lines truncated ...]')
      expect(result).toContain('line100')
      expect(result).not.toContain('line1\n')
    })

    it('should keep last N lines after truncation', () => {
      const lines = Array.from({ length: 20 }, (_, i) => `line${i + 1}`).join('\n')
      const result = truncateOutput(lines, 5)

      expect(result).toContain('line16')
      expect(result).toContain('line17')
      expect(result).toContain('line18')
      expect(result).toContain('line19')
      expect(result).toContain('line20')
    })
  })

  describe('parseContextOutput', () => {
    it('should parse turbo output with package prefixes', () => {
      const output = `
@example/component-catalog-domain:test: Running tests...
@example/component-catalog-domain:test: All tests passed
@example/component-catalog-application:test: Running tests...
@example/component-catalog-application:test: FAIL src/test.ts
`
      const results = parseContextOutput(output, 'test', [
        '@example/component-catalog-domain',
        '@example/component-catalog-application',
      ])

      expect(results).toHaveLength(2)
      expect(results[0].name).toBe('@example/component-catalog-domain')
      expect(results[0].passed).toBe(true)
      expect(results[0].summary).toContain('passed')
      expect(results[1].name).toBe('@example/component-catalog-application')
      // Verify the second package is marked as failed due to "FAIL" keyword
      expect(results[1].passed).toBe(false)
      expect(results[1].summary).toContain('failed')
    })

    it('should handle empty output', () => {
      const results = parseContextOutput('', 'test', ['@example/pkg'])
      expect(results).toHaveLength(1)
      expect(results[0].passed).toBe(true) // No output means no errors
    })

    it('should detect error keywords in output', () => {
      const output = '@example/pkg:test: ERROR: something failed'
      const results = parseContextOutput(output, 'test', ['@example/pkg'])

      expect(results[0].passed).toBe(false)
      expect(results[0].exitCode).toBe(1)
    })

    it('should detect FAIL keyword in output', () => {
      const output = '@example/pkg:test: FAIL src/test.ts'
      const results = parseContextOutput(output, 'test', ['@example/pkg'])

      expect(results[0].passed).toBe(false)
    })
  })

  describe('constants', () => {
    it('should export DEFAULT_TIMEOUT_MS as 120000 (2 minutes)', () => {
      expect(DEFAULT_TIMEOUT_MS).toBe(120000)
    })

    it('should export MAX_OUTPUT_LINES as approximately 50', () => {
      expect(MAX_OUTPUT_LINES).toBeGreaterThanOrEqual(50)
    })

    it('should export ALLOWED_SCRIPTS with expected scripts', () => {
      expect(ALLOWED_SCRIPTS).toContain('build')
      expect(ALLOWED_SCRIPTS).toContain('test')
      expect(ALLOWED_SCRIPTS).toContain('test:ci')
      expect(ALLOWED_SCRIPTS).toContain('typecheck')
      expect(ALLOWED_SCRIPTS).toContain('lint:fix')
      expect(ALLOWED_SCRIPTS).toContain('format')
    })
  })

  describe('PackageScriptResult interface', () => {
    it('should have expected structure', () => {
      const result: PackageScriptResult = {
        package: '@example/cli',
        script: 'test',
        exitCode: 0,
        passed: true,
        output: 'Test output',
        summary: 'All tests passed',
      }

      expect(result.package).toBe('@example/cli')
      expect(result.script).toBe('test')
      expect(typeof result.exitCode).toBe('number')
      expect(typeof result.passed).toBe('boolean')
      expect(typeof result.output).toBe('string')
      expect(typeof result.summary).toBe('string')
    })
  })

  describe('ContextScriptResult interface', () => {
    it('should have expected structure', () => {
      const result: ContextScriptResult = {
        context: 'component-catalog',
        script: 'test',
        packages: [
          { name: '@example/component-catalog-domain', exitCode: 0, passed: true, summary: 'OK' },
        ],
        allPassed: true,
        summary: 'All packages passed',
      }

      expect(result.context).toBe('component-catalog')
      expect(result.script).toBe('test')
      expect(Array.isArray(result.packages)).toBe(true)
      expect(typeof result.allPassed).toBe('boolean')
      expect(typeof result.summary).toBe('string')
    })
  })

  // Integration tests (skipped by default - they actually run turbo)
  describe.skip('runTurboTaskForPackage (integration)', () => {
    it('should run turbo test for a package', async () => {
      const result = await runTurboTaskForPackage('@example/mcp-shared', 'test')

      expect(result.package).toBe('@example/mcp-shared')
      expect(result.script).toBe('test')
      expect(typeof result.exitCode).toBe('number')
      expect(typeof result.passed).toBe('boolean')
      expect(typeof result.output).toBe('string')
      expect(typeof result.summary).toBe('string')
    }, 120000)
  })

  describe.skip('runTurboTaskForContext (integration)', () => {
    it('should run turbo test for a context', async () => {
      const result = await runTurboTaskForContext('component-catalog', 'test')

      expect(result.context).toBe('component-catalog')
      expect(result.script).toBe('test')
      expect(Array.isArray(result.packages)).toBe(true)
      expect(typeof result.allPassed).toBe('boolean')
    }, 120000)
  })
})
