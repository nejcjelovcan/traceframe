import { describe, expect, it } from 'vitest'

import {
  parseVitestOutput,
  runSingleTest,
  runSingleTestDescription,
  runSingleTestInputSchema,
} from './run-single-test.js'

describe('run_single_test tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(runSingleTestDescription).toContain('test')
    })

    it('should have input schema with required properties', () => {
      expect(runSingleTestInputSchema).toHaveProperty('package')
      expect(runSingleTestInputSchema).toHaveProperty('file')
      expect(runSingleTestInputSchema).toHaveProperty('grep')
      expect(runSingleTestInputSchema).toHaveProperty('reporter')
    })
  })

  describe('parseVitestOutput', () => {
    it('should parse output with all counts', () => {
      const output = `
 ✓ tools/run-single-test.test.ts (3 tests) 45ms
   ✓ run_single_test tool
     ✓ tool metadata (2 tests)
     ✓ runSingleTest function (1 test)

 Test Files  1 passed (1)
 Tests  5 passed | 2 failed | 1 skipped (8)
 Duration  1.23s
`
      const result = parseVitestOutput(output)
      expect(result.passed).toBe(5)
      expect(result.failed).toBe(2)
      expect(result.skipped).toBe(1)
    })

    it('should parse output with only passed', () => {
      const output = `
 Test Files  1 passed (1)
 Tests  10 passed (10)
 Duration  0.5s
`
      const result = parseVitestOutput(output)
      expect(result.passed).toBe(10)
      expect(result.failed).toBe(0)
      expect(result.skipped).toBe(0)
    })

    it('should parse output with passed and failed', () => {
      const output = `
 Test Files  1 failed (1)
 Tests  3 passed | 2 failed (5)
 Duration  0.8s
`
      const result = parseVitestOutput(output)
      expect(result.passed).toBe(3)
      expect(result.failed).toBe(2)
      expect(result.skipped).toBe(0)
    })

    it('should parse output with passed and skipped', () => {
      const output = `
 Test Files  1 passed (1)
 Tests  5 passed | 3 skipped (8)
 Duration  0.6s
`
      const result = parseVitestOutput(output)
      expect(result.passed).toBe(5)
      expect(result.failed).toBe(0)
      expect(result.skipped).toBe(3)
    })

    it('should return zeros when no test counts found', () => {
      const output = 'Some random output without test counts'
      const result = parseVitestOutput(output)
      expect(result.passed).toBe(0)
      expect(result.failed).toBe(0)
      expect(result.skipped).toBe(0)
    })

    it('should handle empty output', () => {
      const result = parseVitestOutput('')
      expect(result.passed).toBe(0)
      expect(result.failed).toBe(0)
      expect(result.skipped).toBe(0)
    })
  })

  describe('runSingleTest function', () => {
    it('should return error for invalid package', async () => {
      const result = await runSingleTest({
        package: 'nonexistent-foo-bar',
        file: 'some.test.ts',
      })

      expect(result.success).toBe(false)
      expect(result.summary).toContain('Unknown package')
      expect(result.validPackages).toBeDefined()
      expect(result.validPackages!.length).toBeGreaterThan(0)
    })

    it('should return error for empty package', async () => {
      const result = await runSingleTest({
        package: '',
        file: 'some.test.ts',
      })

      expect(result.success).toBe(false)
      expect(result.summary).toContain('required')
    })

    it('should return error for file not found', async () => {
      const result = await runSingleTest({
        package: 'mcp-dev',
        file: 'nonexistent-test-file.test.ts',
      })

      expect(result.success).toBe(false)
      expect(result.summary).toContain('not found')
      expect(result.exitCode).toBe(1)
    })

    it('should include grep pattern in result', async () => {
      const result = await runSingleTest({
        package: 'nonexistent-foo-bar',
        file: 'some.test.ts',
        grep: 'should parse',
      })

      expect(result.grep).toBe('should parse')
    })

    it('should include reporter in result', async () => {
      const result = await runSingleTest({
        package: 'nonexistent-foo-bar',
        file: 'some.test.ts',
        reporter: 'verbose',
      })

      expect(result.reporter).toBe('verbose')
    })

    // Integration test - runs actual tests
    it.skip('should run a valid test file', async () => {
      const result = await runSingleTest({
        package: 'mcp-dev',
        file: 'tools/run-single-test.test.ts',
      })

      expect(result.success).toBe(true)
      expect(result.package).toBe('@nejcjelovcan/mcp-dev')
      expect(result.file).toBe('tools/run-single-test.test.ts')
      expect(result.passed).toBeGreaterThan(0)
      expect(result.exitCode).toBe(0)
    }, 60000)

    // Integration test with grep
    it.skip('should run with grep filter', async () => {
      const result = await runSingleTest({
        package: 'mcp-dev',
        file: 'tools/run-single-test.test.ts',
        grep: 'parseVitestOutput',
      })

      expect(result.success).toBe(true)
      expect(result.grep).toBe('parseVitestOutput')
      expect(result.passed).toBeGreaterThan(0)
    }, 60000)

    // Integration test with reporter
    it.skip('should run with verbose reporter', async () => {
      const result = await runSingleTest({
        package: 'mcp-dev',
        file: 'tools/run-single-test.test.ts',
        grep: 'should have a description',
        reporter: 'verbose',
      })

      expect(result.success).toBe(true)
      expect(result.reporter).toBe('verbose')
      expect(result.passed).toBeGreaterThan(0)
    }, 60000)
  })
})
