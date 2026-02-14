import { describe, expect, it } from 'vitest'

import { pnpmInstall, pnpmInstallDescription, pnpmInstallInputSchema } from './pnpm-install.js'

describe('pnpm_install tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(pnpmInstallDescription).toContain('Install')
      expect(pnpmInstallDescription).toContain('dependencies')
    })

    it('should have input schema with frozen property', () => {
      expect(pnpmInstallInputSchema.frozen).toBeDefined()
    })
  })

  describe('pnpmInstall function', () => {
    // Integration tests (skipped by default)
    it.skip('should run pnpm install', async () => {
      const result = await pnpmInstall({})

      expect(typeof result.exitCode).toBe('number')
      expect(typeof result.passed).toBe('boolean')
      expect(typeof result.output).toBe('string')
      expect(typeof result.summary).toBe('string')
    }, 120000)

    it.skip('should run pnpm install with frozen lockfile', async () => {
      const result = await pnpmInstall({ frozen: true })

      expect(typeof result.exitCode).toBe('number')
      expect(result.summary).toContain('frozen lockfile')
    }, 120000)
  })
})
