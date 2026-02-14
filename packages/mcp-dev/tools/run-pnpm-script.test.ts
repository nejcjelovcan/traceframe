import { describe, expect, it } from 'vitest'

import {
  runPnpmScript,
  runPnpmScriptDescription,
  runPnpmScriptInputSchema,
} from './run-pnpm-script.js'

describe('run_pnpm_script tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(runPnpmScriptDescription).toContain('pnpm script')
    })

    it('should have input schema with script property', () => {
      expect(runPnpmScriptInputSchema.script).toBeDefined()
    })

    it('should have input schema with optional package property', () => {
      expect(runPnpmScriptInputSchema.package).toBeDefined()
    })

    it('should have input schema with optional args property', () => {
      expect(runPnpmScriptInputSchema.args).toBeDefined()
    })
  })

  describe('runPnpmScript function', () => {
    it('should return error for invalid script name', async () => {
      const result = await runPnpmScript({ script: 'foo && rm -rf /' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Invalid script name')
      }
    })

    it('should return error for invalid args', async () => {
      const result = await runPnpmScript({ script: 'build', args: '&& rm -rf /' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Invalid args')
      }
    })

    it('should return error for invalid package', async () => {
      const result = await runPnpmScript({ script: 'build', package: 'nonexistent-foo-bar' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
        expect(result.validPackages.length).toBeGreaterThan(0)
      }
    })

    it('should return error for script not found in root package.json', async () => {
      const result = await runPnpmScript({ script: 'nonexistent-script-xyz' })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('not found in root package.json')
        expect(result.error).toContain('Available scripts')
      }
    })

    it('should return error for script not found in package', async () => {
      const result = await runPnpmScript({
        script: 'nonexistent-script-xyz',
        package: 'mcp-shared',
      })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('not found in')
        expect(result.error).toContain('Available scripts')
      }
    })

    // Integration test (skipped by default)
    it.skip('should run a valid root script', async () => {
      const result = await runPnpmScript({ script: 'format:check' })

      expect('script' in result).toBe(true)
      if ('script' in result) {
        expect(result.script).toBe('format:check')
        expect(result.package).toBeNull()
        expect(typeof result.exitCode).toBe('number')
        expect(typeof result.passed).toBe('boolean')
        expect(typeof result.output).toBe('string')
        expect(typeof result.summary).toBe('string')
      }
    }, 120000)

    it.skip('should run a valid package script', async () => {
      const result = await runPnpmScript({ script: 'build', package: 'mcp-shared' })

      expect('script' in result).toBe(true)
      if ('script' in result) {
        expect(result.script).toBe('build')
        expect(result.package).toBe('@nejcjelovcan/mcp-shared')
        expect(typeof result.exitCode).toBe('number')
        expect(typeof result.passed).toBe('boolean')
      }
    }, 120000)
  })
})
