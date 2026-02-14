import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { enumerateWorkspacePackages, execCommand } from '@nejcjelovcan/mcp-shared'

import { getChangedPackages } from './get-changed-packages.js'

// Mock the mcp-shared module
vi.mock('@nejcjelovcan/mcp-shared', () => ({
  execCommand: vi.fn(),
  getWorkspaceRoot: vi.fn(() => '/workspace'),
  enumerateWorkspacePackages: vi.fn(),
}))

describe('getChangedPackages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('uncommitted changes (default mode)', () => {
    it('returns affected packages for staged and unstaged changes', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({ stdout: 'apps/scanner/parser.ts\n', stderr: '', exitCode: 0 }) // staged
        .mockResolvedValueOnce({ stdout: 'apps/scanner/lexer.ts\n', stderr: '', exitCode: 0 }) // unstaged
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // untracked

      vi.mocked(enumerateWorkspacePackages).mockResolvedValue([
        { name: '@example/scanner', type: 'app', path: 'apps/scanner' },
        { name: '@example/mcp-dev', type: 'package', path: 'packages/mcp-dev' },
      ])

      const result = await getChangedPackages({})

      expect(result.success).toBe(true)
      expect(result.packages).toEqual(['@example/scanner'])
      expect(result.files).toEqual({
        '@example/scanner': ['parser.ts', 'lexer.ts'],
      })
      expect(result.rootFiles).toEqual([])
      expect(result.summary).toBe('1 package changed: @example/scanner')
    })

    it('deduplicates files that appear in both staged and unstaged', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({
          stdout: 'apps/scanner/parser.ts\napps/scanner/lexer.ts\n',
          stderr: '',
          exitCode: 0,
        }) // staged
        .mockResolvedValueOnce({
          stdout: 'apps/scanner/parser.ts\n',
          stderr: '',
          exitCode: 0,
        }) // unstaged (same file)
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // untracked

      vi.mocked(enumerateWorkspacePackages).mockResolvedValue([
        { name: '@example/scanner', type: 'app', path: 'apps/scanner' },
      ])

      const result = await getChangedPackages({})

      expect(result.success).toBe(true)
      expect(result.files['@example/scanner']).toHaveLength(2)
      expect(result.files['@example/scanner']).toContain('parser.ts')
      expect(result.files['@example/scanner']).toContain('lexer.ts')
    })
  })

  describe('changes since a git ref', () => {
    it('returns affected packages for changes since a ref', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({
          stdout: 'apps/scanner/parser.ts\npackages/mcp-dev/src/tools/new-tool.ts\n',
          stderr: '',
          exitCode: 0,
        }) // git diff since ref
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // untracked

      vi.mocked(enumerateWorkspacePackages).mockResolvedValue([
        { name: '@example/scanner', type: 'app', path: 'apps/scanner' },
        { name: '@example/mcp-dev', type: 'package', path: 'packages/mcp-dev' },
      ])

      const result = await getChangedPackages({ since: 'HEAD~5' })

      expect(result.success).toBe(true)
      expect(result.packages).toEqual(['@example/mcp-dev', '@example/scanner'])
      expect(result.files).toEqual({
        '@example/scanner': ['parser.ts'],
        '@example/mcp-dev': ['src/tools/new-tool.ts'],
      })
      expect(result.summary).toBe('2 packages changed: @example/mcp-dev, @example/scanner')
    })

    it('passes the since ref to git diff command', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 })
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 })

      vi.mocked(enumerateWorkspacePackages).mockResolvedValue([])

      await getChangedPackages({ since: 'main' })

      expect(execCommand).toHaveBeenCalledWith('git diff --name-only main', '/workspace')
    })
  })

  describe('includeUntracked option', () => {
    it('includes untracked files by default', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // staged
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // unstaged
        .mockResolvedValueOnce({
          stdout: 'apps/scanner/new-file.ts\n',
          stderr: '',
          exitCode: 0,
        }) // untracked

      vi.mocked(enumerateWorkspacePackages).mockResolvedValue([
        { name: '@example/scanner', type: 'app', path: 'apps/scanner' },
      ])

      const result = await getChangedPackages({})

      expect(result.success).toBe(true)
      expect(result.packages).toEqual(['@example/scanner'])
      expect(result.files['@example/scanner']).toContain('new-file.ts')
    })

    it('excludes untracked files when includeUntracked is false', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // staged
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // unstaged
      // untracked should not be called

      vi.mocked(enumerateWorkspacePackages).mockResolvedValue([
        { name: '@example/scanner', type: 'app', path: 'apps/scanner' },
      ])

      const result = await getChangedPackages({ includeUntracked: false })

      expect(result.success).toBe(true)
      expect(result.packages).toEqual([])
      // Should only call git commands for staged and unstaged, not untracked
      expect(execCommand).toHaveBeenCalledTimes(2)
    })
  })

  describe('rootFiles handling', () => {
    it('puts files not in any package in rootFiles', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({
          stdout: 'CLAUDE.md\npackage.json\napps/scanner/parser.ts\n',
          stderr: '',
          exitCode: 0,
        }) // staged
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // unstaged
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // untracked

      vi.mocked(enumerateWorkspacePackages).mockResolvedValue([
        { name: '@example/scanner', type: 'app', path: 'apps/scanner' },
      ])

      const result = await getChangedPackages({})

      expect(result.success).toBe(true)
      expect(result.packages).toEqual(['@example/scanner'])
      expect(result.rootFiles).toEqual(['CLAUDE.md', 'package.json'])
      expect(result.summary).toBe('1 package changed: @example/scanner (+ 2 root file(s))')
    })

    it('reports only root files when no packages are affected', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({
          stdout: 'README.md\n.gitignore\n',
          stderr: '',
          exitCode: 0,
        }) // staged
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // unstaged
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // untracked

      vi.mocked(enumerateWorkspacePackages).mockResolvedValue([
        { name: '@example/scanner', type: 'app', path: 'apps/scanner' },
      ])

      const result = await getChangedPackages({})

      expect(result.success).toBe(true)
      expect(result.packages).toEqual([])
      expect(result.rootFiles).toEqual(['README.md', '.gitignore'])
      expect(result.summary).toBe('No packages affected, 2 root file(s) changed')
    })
  })

  describe('error handling', () => {
    it('returns error when git diff fails', async () => {
      vi.mocked(execCommand).mockResolvedValueOnce({
        stdout: '',
        stderr: 'fatal: bad revision',
        exitCode: 128,
      })

      const result = await getChangedPackages({ since: 'nonexistent-ref' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('git diff failed')
      expect(result.packages).toEqual([])
      expect(result.files).toEqual({})
    })

    it('returns error when git diff --cached fails', async () => {
      vi.mocked(execCommand).mockResolvedValueOnce({
        stdout: '',
        stderr: 'fatal: not a git repository',
        exitCode: 128,
      })

      const result = await getChangedPackages({})

      expect(result.success).toBe(false)
      expect(result.error).toContain('git diff --cached failed')
    })

    it('returns error when git ls-files fails', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // staged
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // unstaged
        .mockResolvedValueOnce({
          stdout: '',
          stderr: 'fatal: not a git repository',
          exitCode: 128,
        }) // untracked

      const result = await getChangedPackages({})

      expect(result.success).toBe(false)
      expect(result.error).toContain('git ls-files failed')
    })
  })

  describe('empty change set', () => {
    it('returns empty result when no changes exist', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // staged
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // unstaged
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 }) // untracked

      vi.mocked(enumerateWorkspacePackages).mockResolvedValue([
        { name: '@example/scanner', type: 'app', path: 'apps/scanner' },
      ])

      const result = await getChangedPackages({})

      expect(result.success).toBe(true)
      expect(result.packages).toEqual([])
      expect(result.files).toEqual({})
      expect(result.rootFiles).toEqual([])
      expect(result.summary).toBe('No changes detected')
    })
  })

  describe('package path matching', () => {
    it('matches files to the most specific package path', async () => {
      vi.mocked(execCommand)
        .mockResolvedValueOnce({
          stdout: 'packages/shared/utils/helper.ts\npackages/shared/index.ts\n',
          stderr: '',
          exitCode: 0,
        })
        .mockResolvedValueOnce({ stdout: '', stderr: '', exitCode: 0 })

      // packages/shared/utils is a subpackage of packages/shared
      vi.mocked(enumerateWorkspacePackages).mockResolvedValue([
        { name: '@example/shared', type: 'package', path: 'packages/shared' },
        { name: '@example/shared-utils', type: 'package', path: 'packages/shared/utils' },
      ])

      const result = await getChangedPackages({ since: 'HEAD~1' })

      expect(result.success).toBe(true)
      // helper.ts should match shared-utils (longer path), index.ts should match shared
      expect(result.files['@example/shared-utils']).toEqual(['helper.ts'])
      expect(result.files['@example/shared']).toEqual(['index.ts'])
    })
  })
})
