import { describe, expect, it } from 'vitest'

import { pnpmQuery, pnpmQueryDescription, pnpmQueryInputSchema } from './pnpm-query.js'

describe('pnpm_query tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(pnpmQueryDescription).toContain('Query')
      expect(pnpmQueryDescription).toContain('dependency')
    })

    it('should have input schema with required properties', () => {
      expect(pnpmQueryInputSchema.command).toBeDefined()
      expect(pnpmQueryInputSchema.dependency).toBeDefined()
      expect(pnpmQueryInputSchema.package).toBeDefined()
      expect(pnpmQueryInputSchema.depth).toBeDefined()
    })
  })

  describe('pnpmQuery function', () => {
    it('should return error when "why" command has no dependency', async () => {
      const result = await pnpmQuery({ command: 'why' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('dependency is required')
      }
    })

    it('should return error for invalid dependency name in "why"', async () => {
      const result = await pnpmQuery({ command: 'why', dependency: '--malicious' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Invalid package name')
      }
    })

    it('should return error for invalid package target', async () => {
      const result = await pnpmQuery({
        command: 'list',
        package: 'nonexistent-foo-bar',
      })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages.length).toBeGreaterThan(0)
      }
    })

    // Integration tests (skipped by default)
    it.skip('should list dependencies for a package', async () => {
      const result = await pnpmQuery({
        command: 'list',
        package: 'mcp-dev',
        depth: 0,
      })

      expect('command' in result).toBe(true)
      if ('command' in result) {
        expect(result.command).toBe('list')
        expect(typeof result.exitCode).toBe('number')
        expect(typeof result.output).toBe('string')
      }
    }, 120000)

    it.skip('should show why a dependency is installed', async () => {
      const result = await pnpmQuery({
        command: 'why',
        dependency: 'zod',
        package: 'mcp-dev',
      })

      expect('command' in result).toBe(true)
      if ('command' in result) {
        expect(result.command).toBe('why')
        expect(typeof result.output).toBe('string')
      }
    }, 120000)
  })
})
