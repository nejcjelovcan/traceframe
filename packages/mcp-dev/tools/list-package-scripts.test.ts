import { describe, expect, it } from 'vitest'

import {
  listPackageScripts,
  listPackageScriptsDescription,
  listPackageScriptsInputSchema,
} from './list-package-scripts.js'

describe('list_package_scripts tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(listPackageScriptsDescription).toContain('scripts')
    })

    it('should have input schema with optional package property', () => {
      expect(listPackageScriptsInputSchema.package).toBeDefined()
    })
  })

  describe('listPackageScripts function', () => {
    it('should return error for invalid package', async () => {
      const result = await listPackageScripts({ package: 'nonexistent-foo-bar' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages.length).toBeGreaterThan(0)
      }
    })

    it('should list scripts from root package.json', async () => {
      const result = await listPackageScripts({})

      expect('scripts' in result).toBe(true)
      if ('scripts' in result) {
        expect(result.package).toBeNull()
        expect(result.scripts.length).toBeGreaterThan(0)
        expect(result.summary).toContain('workspace root')

        // Root should have scripts like build, test, etc.
        const scriptNames = result.scripts.map((s) => s.name)
        expect(scriptNames).toContain('build')
      }
    })

    it('should list scripts for a specific package', async () => {
      const result = await listPackageScripts({ package: 'mcp-shared' })

      expect('scripts' in result).toBe(true)
      if ('scripts' in result) {
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
        expect(result.scripts.length).toBeGreaterThan(0)

        // Should have build script
        const buildScript = result.scripts.find((s) => s.name === 'build')
        expect(buildScript).toBeDefined()
      }
    })

    it('should annotate scripts with dedicated tools', async () => {
      const result = await listPackageScripts({ package: 'mcp-dev' })

      expect('scripts' in result).toBe(true)
      if ('scripts' in result) {
        // build and test should have dedicated tools
        const buildScript = result.scripts.find((s) => s.name === 'build')
        expect(buildScript?.dedicatedTool).toBe('build_package')

        const testScript = result.scripts.find((s) => s.name === 'test')
        expect(testScript?.dedicatedTool).toBe('test_package')
      }
    })

    it('should sort scripts alphabetically', async () => {
      const result = await listPackageScripts({})

      expect('scripts' in result).toBe(true)
      if ('scripts' in result) {
        const names = result.scripts.map((s) => s.name)
        const sorted = [...names].sort((a, b) => a.localeCompare(b))
        expect(names).toEqual(sorted)
      }
    })

    it('should include dedicated tool count in summary', async () => {
      const result = await listPackageScripts({ package: 'mcp-dev' })

      expect('scripts' in result).toBe(true)
      if ('scripts' in result) {
        expect(result.summary).toContain('dedicated mcp-dev tools')
      }
    })
  })
})
