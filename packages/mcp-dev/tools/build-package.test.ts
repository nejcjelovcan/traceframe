import { describe, expect, it } from 'vitest'

import { buildPackage, buildPackageDescription, buildPackageInputSchema } from './build-package.js'

describe('build_package tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(buildPackageDescription).toContain('Build')
      expect(buildPackageDescription).toContain('turbo')
    })

    it('should have input schema with package property', () => {
      expect(buildPackageInputSchema.package).toBeDefined()
    })
  })

  describe('buildPackage function', () => {
    it('should return error for invalid package', async () => {
      const result = await buildPackage({ package: 'nonexistent-foo-bar' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages.length).toBeGreaterThan(0)
      }
    })

    it('should return error for empty package', async () => {
      const result = await buildPackage({ package: '' })

      expect('resolved' in result && result.resolved === false).toBe(true)
    })

    // Integration test (skipped by default)
    it.skip('should build a valid package', async () => {
      const result = await buildPackage({ package: '@nejcjelovcan/mcp-shared' })

      expect('package' in result).toBe(true)
      if ('package' in result) {
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
        expect(result.script).toBe('build')
        expect(typeof result.exitCode).toBe('number')
        expect(typeof result.passed).toBe('boolean')
        expect(typeof result.output).toBe('string')
        expect(typeof result.summary).toBe('string')
      }
    }, 120000)

    it.skip('should accept bare app name', async () => {
      const result = await buildPackage({ package: 'mcp-shared' })

      expect('package' in result).toBe(true)
      if ('package' in result) {
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
      }
    }, 120000)
  })
})
