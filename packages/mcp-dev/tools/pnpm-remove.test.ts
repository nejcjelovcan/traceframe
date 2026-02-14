import { describe, expect, it } from 'vitest'

import { pnpmRemove, pnpmRemoveDescription, pnpmRemoveInputSchema } from './pnpm-remove.js'

describe('pnpm_remove tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(pnpmRemoveDescription).toContain('Remove')
      expect(pnpmRemoveDescription).toContain('dependencies')
    })

    it('should have input schema with required properties', () => {
      expect(pnpmRemoveInputSchema.dependency).toBeDefined()
      expect(pnpmRemoveInputSchema.package).toBeDefined()
    })
  })

  describe('pnpmRemove function', () => {
    it('should return error for empty dependency', async () => {
      const result = await pnpmRemove({ dependency: '' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('required')
      }
    })

    it('should return error for invalid package name', async () => {
      const result = await pnpmRemove({ dependency: '--malicious-flag' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Invalid package name')
      }
    })

    it('should return error for invalid package target', async () => {
      const result = await pnpmRemove({
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
      const result = await pnpmRemove({ dependency: 'react; rm -rf /' })

      expect('resolved' in result && result.resolved === false).toBe(true)
    })
  })
})
