import { describe, expect, it } from 'vitest'

import {
  typecheckPackage,
  typecheckPackageDescription,
  typecheckPackageInputSchema,
} from './typecheck-package.js'

describe('typecheck_package tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(typecheckPackageDescription).toContain('Typecheck')
      expect(typecheckPackageDescription).toContain('turbo')
    })

    it('should have input schema with package property', () => {
      expect(typecheckPackageInputSchema.package).toBeDefined()
    })
  })

  describe('typecheckPackage function', () => {
    it('should return error for invalid package', async () => {
      const result = await typecheckPackage({ package: 'nonexistent-foo-bar' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages.length).toBeGreaterThan(0)
      }
    })

    it('should return error for empty package', async () => {
      const result = await typecheckPackage({ package: '' })

      expect('resolved' in result && result.resolved === false).toBe(true)
    })

    // Integration test (skipped by default)
    it.skip('should typecheck a valid package', async () => {
      const result = await typecheckPackage({ package: '@nejcjelovcan/mcp-shared' })

      expect('package' in result).toBe(true)
      if ('package' in result) {
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
        expect(result.script).toBe('typecheck')
      }
    }, 120000)
  })
})
