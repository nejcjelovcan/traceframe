import { describe, expect, it } from 'vitest'

import { testPackage, testPackageDescription, testPackageInputSchema } from './test-package.js'

describe('test_package tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(testPackageDescription).toContain('test')
      expect(testPackageDescription).toContain('turbo')
    })

    it('should have input schema with package property', () => {
      expect(testPackageInputSchema.package).toBeDefined()
    })
  })

  describe('testPackage function', () => {
    it('should return error for invalid package', async () => {
      const result = await testPackage({ package: 'nonexistent-foo-bar' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages.length).toBeGreaterThan(0)
      }
    })

    it('should return error for empty package', async () => {
      const result = await testPackage({ package: '' })

      expect('resolved' in result && result.resolved === false).toBe(true)
    })

    // Integration test (skipped by default)
    it.skip('should test a valid package', async () => {
      const result = await testPackage({ package: '@nejcjelovcan/mcp-shared' })

      expect('package' in result).toBe(true)
      if ('package' in result) {
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
        expect(result.script).toBe('test')
      }
    }, 120000)
  })
})
