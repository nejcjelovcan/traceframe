import { describe, expect, it } from 'vitest'

import { pnpmAdd, pnpmAddDescription, pnpmAddInputSchema } from './pnpm-add.js'

describe('pnpm_add tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(pnpmAddDescription).toContain('Add')
      expect(pnpmAddDescription).toContain('dependencies')
    })

    it('should have input schema with required properties', () => {
      expect(pnpmAddInputSchema.dependency).toBeDefined()
      expect(pnpmAddInputSchema.package).toBeDefined()
      expect(pnpmAddInputSchema.dev).toBeDefined()
      expect(pnpmAddInputSchema.exact).toBeDefined()
    })
  })

  describe('pnpmAdd function', () => {
    it('should return error for empty dependency', async () => {
      const result = await pnpmAdd({ dependency: '' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('required')
      }
    })

    it('should return error for invalid dependency name', async () => {
      const result = await pnpmAdd({ dependency: '--malicious-flag' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Invalid dependency specifier')
      }
    })

    it('should return error for invalid package target', async () => {
      const result = await pnpmAdd({
        dependency: 'react',
        package: 'nonexistent-foo-bar',
      })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages.length).toBeGreaterThan(0)
      }
    })

    it('should reject command injection attempts', async () => {
      const result = await pnpmAdd({ dependency: 'react; rm -rf /' })

      expect('resolved' in result && result.resolved === false).toBe(true)
    })

    // Integration tests (skipped by default)
    it.skip('should add dependency to workspace root', async () => {
      const result = await pnpmAdd({ dependency: 'is-odd', dev: true })

      expect('exitCode' in result).toBe(true)
      if ('exitCode' in result) {
        expect(typeof result.exitCode).toBe('number')
        expect(typeof result.passed).toBe('boolean')
        expect(result.package).toBeNull()
        expect(result.dev).toBe(true)
      }
    }, 120000)
  })
})
