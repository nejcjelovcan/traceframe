import { describe, expect, it } from 'vitest'

import {
  testPackageCoverage,
  testPackageCoverageDescription,
  testPackageCoverageInputSchema,
} from './test-package-coverage.js'

describe('test_package_coverage tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(testPackageCoverageDescription).toContain('coverage')
      expect(testPackageCoverageDescription).toContain('turbo')
    })

    it('should have input schema with package property', () => {
      expect(testPackageCoverageInputSchema.package).toBeDefined()
    })
  })

  describe('testPackageCoverage function', () => {
    it('should return error for invalid package', async () => {
      const result = await testPackageCoverage({ package: 'nonexistent-foo-bar' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages.length).toBeGreaterThan(0)
      }
    })

    it('should return error for empty package', async () => {
      const result = await testPackageCoverage({ package: '' })

      expect('resolved' in result && result.resolved === false).toBe(true)
    })

    // Integration test (skipped by default)
    it.skip('should run test:ci for a valid package', async () => {
      const result = await testPackageCoverage({ package: '@nejcjelovcan/mcp-shared' })

      expect('package' in result).toBe(true)
      if ('package' in result) {
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
        expect(result.script).toBe('test:ci')
      }
    }, 120000)
  })
})
