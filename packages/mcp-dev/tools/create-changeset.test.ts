import { readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { getWorkspaceRoot } from '@nejcjelovcan/mcp-shared'

import {
  createChangeset,
  createChangesetDescription,
  createChangesetInputSchema,
} from './create-changeset.js'

describe('create_changeset tool', () => {
  // Track created files for cleanup
  const createdFiles: string[] = []

  afterEach(async () => {
    // Clean up any changeset files created during tests
    for (const file of createdFiles) {
      try {
        await rm(file)
      } catch {
        // Ignore cleanup errors
      }
    }
    createdFiles.length = 0
  })

  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(createChangesetDescription).toContain('changeset')
    })

    it('should have input schema with required properties', () => {
      expect(createChangesetInputSchema.packages).toBeDefined()
      expect(createChangesetInputSchema.bump).toBeDefined()
      expect(createChangesetInputSchema.summary).toBeDefined()
    })
  })

  describe('createChangeset function', () => {
    it('should return error for empty packages array', async () => {
      const result = await createChangeset({
        packages: [],
        bump: 'patch',
        summary: 'Test change',
      })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('At least one package')
      }
    })

    it('should return error for empty summary', async () => {
      const result = await createChangeset({
        packages: ['ui-library'],
        bump: 'patch',
        summary: '',
      })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('summary is required')
      }
    })

    it('should return error for invalid package name', async () => {
      const result = await createChangeset({
        packages: ['nonexistent-foo-bar'],
        bump: 'patch',
        summary: 'Test change',
      })

      expect('resolved' in result && result.resolved === false).toBe(true)
      if ('resolved' in result && result.resolved === false) {
        expect(result.error).toContain('Unknown package')
      }
    })

    it('should create a changeset file with correct content', async () => {
      const result = await createChangeset({
        packages: ['ui-library'],
        bump: 'minor',
        summary: 'Add new component',
      })

      expect('file' in result).toBe(true)
      if ('file' in result) {
        expect(result.file).toMatch(/^\.changeset\/[a-z]+-[a-z]+-[a-z]+\.md$/)
        expect(result.content).toContain('---')
        expect(result.content).toContain('"@nejcjelovcan/traceframe-ui-library": minor')
        expect(result.content).toContain('Add new component')
        expect(result.bump).toBe('minor')
        expect(result.packages).toContain('@nejcjelovcan/traceframe-ui-library')

        // Verify file was actually created
        const workspaceRoot = getWorkspaceRoot()
        const filePath = join(workspaceRoot, result.file)
        createdFiles.push(filePath)
        const fileContent = await readFile(filePath, 'utf-8')
        expect(fileContent).toBe(result.content)
      }
    })

    it('should create changeset with multiple packages', async () => {
      const result = await createChangeset({
        packages: ['ui-library', 'eslint-plugin'],
        bump: 'patch',
        summary: 'Fix shared issue',
      })

      expect('file' in result).toBe(true)
      if ('file' in result) {
        expect(result.content).toContain('"@nejcjelovcan/traceframe-ui-library": patch')
        expect(result.content).toContain('"@nejcjelovcan/eslint-plugin-traceframe": patch')
        expect(result.packages).toHaveLength(2)

        // Track for cleanup
        const workspaceRoot = getWorkspaceRoot()
        createdFiles.push(join(workspaceRoot, result.file))
      }
    })
  })
})
