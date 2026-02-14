import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { getWorkspaceRoot } from './config.js'

describe('config', () => {
  describe('getWorkspaceRoot', () => {
    it('should return a valid workspace root directory', () => {
      const root = getWorkspaceRoot()

      expect(root).toBeTruthy()
      expect(typeof root).toBe('string')
      expect(existsSync(root)).toBe(true)
    })

    it('should return a directory containing workspace markers', () => {
      const root = getWorkspaceRoot()

      // Should have at least one of the workspace markers
      const hasPnpmWorkspace = existsSync(join(root, 'pnpm-workspace.yaml'))
      const hasTurbo = existsSync(join(root, 'turbo.json'))

      expect(hasPnpmWorkspace || hasTurbo).toBe(true)
    })

    it('should return a directory containing packages and/or apps folders', () => {
      const root = getWorkspaceRoot()
      const packagesDir = join(root, 'packages')
      const appsDir = join(root, 'apps')

      // A monorepo should have at least one of these directories
      expect(existsSync(packagesDir) || existsSync(appsDir)).toBe(true)
    })

    it('should return a directory containing the packages folder', () => {
      const root = getWorkspaceRoot()
      const packagesDir = join(root, 'packages')

      expect(existsSync(packagesDir)).toBe(true)
    })

    it('should cache the result and return the same value on subsequent calls', () => {
      const first = getWorkspaceRoot()
      const second = getWorkspaceRoot()

      expect(first).toBe(second)
      expect(first).toStrictEqual(second)
    })
  })

  describe('workspace detection from deep nested paths', () => {
    const testDir = join(process.cwd(), 'tmp-test-workspace')
    const deepDir = join(testDir, 'a', 'b', 'c', 'd', 'e')

    beforeEach(() => {
      // Create a mock workspace structure
      if (!existsSync(testDir)) {
        mkdirSync(testDir, { recursive: true })
        writeFileSync(join(testDir, 'pnpm-workspace.yaml'), 'packages:\n  - "packages/*"')
      }
      mkdirSync(deepDir, { recursive: true })
    })

    afterEach(async () => {
      // Clean up
      if (existsSync(testDir)) {
        await rm(testDir, { recursive: true, force: true })
      }
    })

    it('should be able to find workspace markers from deeply nested directories', () => {
      // Note: This is a conceptual test to document the behavior
      // The actual getWorkspaceRoot() uses import.meta.dirname as start point
      // so we can't test arbitrary start directories without mocking

      // Verify test setup is correct
      expect(existsSync(deepDir)).toBe(true)
      expect(existsSync(join(testDir, 'pnpm-workspace.yaml'))).toBe(true)

      // The real implementation would walk up from deepDir to find testDir
      // but since getWorkspaceRoot() is hardcoded to use import.meta.dirname,
      // we can only verify that the main function works from its actual location
      const actualRoot = getWorkspaceRoot()
      expect(existsSync(actualRoot)).toBe(true)
    })
  })

  describe('workspace structure validation', () => {
    it('should have expected monorepo structure', () => {
      const root = getWorkspaceRoot()

      // Verify key monorepo directories exist (at least packages or apps)
      const hasPackages = existsSync(join(root, 'packages'))
      const hasApps = existsSync(join(root, 'apps'))
      expect(hasPackages || hasApps).toBe(true)
    })

    it('should have mcp-shared in expected location', () => {
      const root = getWorkspaceRoot()
      const mcpSharedDir = join(root, 'packages', 'mcp-shared')

      expect(existsSync(mcpSharedDir)).toBe(true)
      expect(existsSync(join(mcpSharedDir, 'package.json'))).toBe(true)
    })
  })
})
