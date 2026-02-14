import { describe, expect, it } from 'vitest'

import {
  formatPackage,
  formatPackageDescription,
  formatPackageInputSchema,
} from './format-package.js'

describe('format_package tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(formatPackageDescription).toContain('Format')
      expect(formatPackageDescription).toContain('turbo')
    })

    it('should have input schema with package property', () => {
      expect(formatPackageInputSchema.package).toBeDefined()
    })
  })

  describe('formatPackage function', () => {
    it('should return error for invalid package', async () => {
      const result = await formatPackage({ package: 'nonexistent-foo-bar' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages.length).toBeGreaterThan(0)
      }
    })

    it('should return error for empty package', async () => {
      const result = await formatPackage({ package: '' })

      expect('resolved' in result && result.resolved === false).toBe(true)
    })

    // Integration test (skipped by default)
    it.skip('should run format for a valid package', async () => {
      const result = await formatPackage({ package: '@nejcjelovcan/mcp-shared' })

      expect('package' in result).toBe(true)
      if ('package' in result) {
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
        expect(result.script).toBe('format')
      }
    }, 120000)
  })
})
