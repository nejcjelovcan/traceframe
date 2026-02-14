import { describe, expect, it } from 'vitest'

import {
  enumerateWorkspacePackages,
  packageResolverDescription,
  resolvePackage,
} from './package-resolver.js'

describe('package-resolver', () => {
  describe('enumerateWorkspacePackages', () => {
    it('should return packages from packages/*/package.json', async () => {
      const packages = await enumerateWorkspacePackages()

      // Should include mcp-shared package
      const mcpPackage = packages.find((p) => p.name === '@nejcjelovcan/mcp-shared')
      expect(mcpPackage).toBeDefined()
      expect(mcpPackage?.type).toBe('package')
      expect(mcpPackage?.path).toBe('packages/mcp-shared')
    })

    it('should return app packages from apps/*/package.json when they exist', async () => {
      const packages = await enumerateWorkspacePackages()

      // Apps are returned with type 'app'
      const appPackages = packages.filter((p) => p.type === 'app')
      // Currently no apps have package.json, so this should be empty
      // This test documents the expected behavior when apps are added
      for (const pkg of appPackages) {
        expect(pkg.path).toContain('apps/')
      }
    })

    it('should include package metadata: name, type, path', async () => {
      const packages = await enumerateWorkspacePackages()

      const mcpPackage = packages.find((p) => p.name === '@nejcjelovcan/mcp-shared')
      expect(mcpPackage).toBeDefined()
      expect(mcpPackage?.name).toBe('@nejcjelovcan/mcp-shared')
      expect(mcpPackage?.type).toBe('package')
      expect(mcpPackage?.path).toBe('packages/mcp-shared')
    })
  })

  describe('resolvePackage', () => {
    describe('resolution algorithm', () => {
      it('should resolve full scoped package name (exact match)', async () => {
        const result = await resolvePackage('@nejcjelovcan/mcp-shared')

        expect(result.resolved).toBe(true)
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
        expect(result.type).toBe('package')
      })

      it('should resolve bare package name: mcp-shared', async () => {
        const result = await resolvePackage('mcp-shared')

        expect(result.resolved).toBe(true)
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
        expect(result.type).toBe('package')
      })

      it('should resolve by directory name: ui-library', async () => {
        const result = await resolvePackage('ui-library')

        expect(result.resolved).toBe(true)
        expect(result.package).toBe('@nejcjelovcan/traceframe-ui-library')
        expect(result.type).toBe('package')
      })

      it('should resolve by directory name: mcp-ui', async () => {
        const result = await resolvePackage('mcp-ui')

        expect(result.resolved).toBe(true)
        expect(result.package).toBe('@nejcjelovcan/traceframe-mcp-ui')
        expect(result.type).toBe('package')
      })

      it('should resolve by directory name: eslint-plugin', async () => {
        const result = await resolvePackage('eslint-plugin')

        expect(result.resolved).toBe(true)
        expect(result.package).toBe('@nejcjelovcan/eslint-plugin-traceframe')
        expect(result.type).toBe('package')
      })

      it('should resolve by directory name: playroom', async () => {
        const result = await resolvePackage('playroom')

        expect(result.resolved).toBe(true)
        expect(result.package).toBe('@nejcjelovcan/traceframe-playroom')
        expect(result.type).toBe('package')
      })
    })

    describe('error handling', () => {
      it('should return error with valid packages list for unknown input', async () => {
        const result = await resolvePackage('nonexistent-foo-bar')

        expect(result.resolved).toBe(false)
        expect(result.error).toBeDefined()
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages).toBeDefined()
        expect(result.validPackages!.length).toBeGreaterThan(0)
      })

      it('should return error for empty string', async () => {
        const result = await resolvePackage('')

        expect(result.resolved).toBe(false)
        expect(result.error).toBeDefined()
      })
    })
  })

  describe('module exports', () => {
    it('should export packageResolverDescription', () => {
      expect(typeof packageResolverDescription).toBe('string')
      expect(packageResolverDescription.length).toBeGreaterThan(0)
    })
  })
})
