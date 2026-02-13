import { describe, expect, it, vi } from 'vitest'

import {
  COMPONENT_CATEGORIES,
  findStoryFiles,
  getAllComponents,
  getComponentByName,
  parseStoryFile,
} from './storybook-parser'

// Mock the fs module
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  readdir: vi.fn(),
}))

// Mock the workspace module
vi.mock('./workspace.js', () => ({
  getWorkspaceRoot: vi.fn(() => '/mock/workspace'),
}))

// Mock the storybook-runner module
vi.mock('./storybook-runner.js', () => ({
  getUiLibraryPackagePath: vi.fn(() => 'packages/ui-library'),
}))

describe('storybook-parser', () => {
  describe('COMPONENT_CATEGORIES', () => {
    it('contains expected categories', () => {
      expect(COMPONENT_CATEGORIES).toContain('primitives')
      expect(COMPONENT_CATEGORIES).toContain('layout')
      expect(COMPONENT_CATEGORIES).toContain('data')
      expect(COMPONENT_CATEGORIES).toContain('feedback')
      expect(COMPONENT_CATEGORIES).toContain('selection')
      expect(COMPONENT_CATEGORIES).toContain('behavioral')
      expect(COMPONENT_CATEGORIES).toContain('foundation')
    })
  })

  describe('parseStoryFile', () => {
    it('returns null for file without title', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue('const meta = {}')

      const result = await parseStoryFile('/mock/path/Button.stories.tsx')
      expect(result).toBeNull()
    })

    it('returns null for file without description', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue(`
        const meta = {
          title: 'Components/Button',
        }
      `)

      const result = await parseStoryFile('/mock/path/Button.stories.tsx')
      expect(result).toBeNull()
    })

    it('parses a valid Tier 1 story file', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue(`
        const meta = {
          title: 'Components/Button',
          parameters: {
            docs: {
              description: {
                component: \`
A versatile button component.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use for actions.

**Accessibility:**
- Semantic button element
- Keyboard accessible
                \`.trim(),
              },
            },
          },
          argTypes: {
            variant: {
              description: 'Visual style variant',
              control: 'select',
              options: ['primary', 'secondary'],
              table: {
                defaultValue: { summary: 'primary' },
              },
            },
          },
        }
      `)

      const result = await parseStoryFile('/mock/path/Button.stories.tsx', {
        detailed: true,
      })

      expect(result).not.toBeNull()
      expect(result?.name).toBe('Button')
      expect(result?.category).toBe('primitives')
      expect(result?.tier).toBe(1)
      expect(result?.tierLabel).toBe('Tailwind + CVA')
      expect(result?.description).toBe('A versatile button component.')
    })

    it('parses a Tier 2 component correctly', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue(`
        const meta = {
          title: 'Components/Select',
          parameters: {
            docs: {
              description: {
                component: \`
Accessible select component.

**Tier:** 2 (Radix UI Primitive)

**Radix Handles:**
- Keyboard navigation
- Focus management
                \`.trim(),
              },
            },
          },
        }
      `)

      const result = await parseStoryFile('/mock/path/Select.stories.tsx', {
        detailed: true,
      })

      expect(result).not.toBeNull()
      expect(result?.tier).toBe(2)
      expect(result?.tierLabel).toBe('Radix UI Primitive')
      expect(result?.radixHandles).toContain('Keyboard navigation')
    })

    it('returns null on read error', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockRejectedValue(new Error('File not found'))

      const result = await parseStoryFile('/mock/path/Missing.stories.tsx')
      expect(result).toBeNull()
    })
  })

  describe('findStoryFiles', () => {
    it('finds story files in components and icons directories', async () => {
      const { readdir } = await import('node:fs/promises')
      vi.mocked(readdir)
        .mockResolvedValueOnce(['Button.stories.tsx', 'Button.tsx'] as unknown as Awaited<
          ReturnType<typeof readdir>
        >)
        .mockResolvedValueOnce(['Icon.stories.tsx'] as unknown as Awaited<
          ReturnType<typeof readdir>
        >)

      const files = await findStoryFiles()

      expect(files).toHaveLength(2)
      expect(files[0]).toContain('Button.stories.tsx')
      expect(files[1]).toContain('Icon.stories.tsx')
    })

    it('handles missing directories gracefully', async () => {
      const { readdir } = await import('node:fs/promises')
      vi.mocked(readdir).mockRejectedValue(new Error('Directory not found'))

      const files = await findStoryFiles()
      expect(files).toEqual([])
    })
  })

  describe('getAllComponents', () => {
    it('returns empty array when no story files found', async () => {
      const { readdir } = await import('node:fs/promises')
      vi.mocked(readdir).mockRejectedValue(new Error('Not found'))

      const components = await getAllComponents()
      expect(components).toEqual([])
    })
  })

  describe('getComponentByName', () => {
    it('returns null when component not found', async () => {
      const { readdir } = await import('node:fs/promises')
      vi.mocked(readdir).mockResolvedValue([] as unknown as Awaited<ReturnType<typeof readdir>>)

      const result = await getComponentByName('NonExistent')
      expect(result).toBeNull()
    })
  })
})
