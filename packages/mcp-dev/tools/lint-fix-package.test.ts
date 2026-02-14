import { describe, expect, it } from 'vitest'

import {
  lintFixPackage,
  lintFixPackageDescription,
  lintFixPackageInputSchema,
} from './lint-fix-package.js'

describe('lint_fix_package tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(lintFixPackageDescription).toContain('lint')
      expect(lintFixPackageDescription).toContain('turbo')
    })

    it('should have input schema with package property', () => {
      expect(lintFixPackageInputSchema.package).toBeDefined()
    })
  })

  describe('lintFixPackage function', () => {
    it('should return error for invalid package', async () => {
      const result = await lintFixPackage({ package: 'nonexistent-foo-bar' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages.length).toBeGreaterThan(0)
      }
    })

    it('should return error for empty package', async () => {
      const result = await lintFixPackage({ package: '' })

      expect('resolved' in result && result.resolved === false).toBe(true)
    })

    // Integration test (skipped by default)
    it.skip('should run lint:fix for a valid package', async () => {
      const result = await lintFixPackage({ package: '@nejcjelovcan/mcp-shared' })

      expect('package' in result).toBe(true)
      if ('package' in result) {
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
        expect(result.script).toBe('lint:fix')
      }
    }, 120000)
  })
})
