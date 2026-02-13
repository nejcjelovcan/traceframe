import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import {
  DEFAULT_VIEWPORT,
  DEFAULT_DEVICE_SCALE_FACTOR,
  DEFAULT_STORY_FILTER,
  extractStoriesFromFile,
} from './storybook-capture.js'

// Mock fs/promises
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  mkdir: vi.fn(),
  writeFile: vi.fn(),
}))

describe('storybook-capture', () => {
  describe('constants', () => {
    it('should have default viewport of 800x600', () => {
      expect(DEFAULT_VIEWPORT).toEqual({ width: 800, height: 600 })
    })

    it('should have default device scale factor of 2 for retina quality', () => {
      expect(DEFAULT_DEVICE_SCALE_FACTOR).toBe(2)
    })

    it('should have default story filter of AllVariants', () => {
      expect(DEFAULT_STORY_FILTER).toBe('AllVariants')
    })
  })

  describe('extractStoriesFromFile', () => {
    beforeEach(() => {
      vi.resetAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should extract AllVariants story from a typical story file', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue(`
import type { Meta, StoryObj } from '@storybook/react'
import { Link } from './Link'

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
}

export default meta
type Story = StoryObj<typeof Link>

export const Primary: Story = {
  args: { children: 'Primary Link' },
}

export const AllVariants: Story = {
  render: () => <div>All variants</div>,
}
`)

      const stories = await extractStoriesFromFile('/fake/path.tsx')

      expect(stories).toHaveLength(1)
      expect(stories[0]).toEqual({
        id: 'components-link--all-variants',
        name: 'Link/AllVariants',
        componentName: 'Link',
        exportName: 'AllVariants',
      })
    })

    it('should extract multiple stories when filter is empty', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue(`
const meta = {
  title: 'UI/Button',
}

export default meta

export const Primary = {}
export const Secondary = {}
export const AllVariants = {}
`)

      const stories = await extractStoriesFromFile('/fake/path.tsx', '')

      expect(stories).toHaveLength(3)
      expect(stories.map((s) => s.exportName)).toEqual(['Primary', 'Secondary', 'AllVariants'])
    })

    it('should return empty array when no title is found', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue(`
export const AllVariants = {}
`)

      const stories = await extractStoriesFromFile('/fake/path.tsx')

      expect(stories).toHaveLength(0)
    })

    it('should handle title with double quotes', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue(`
const meta = {
  title: "Components/Badge",
}

export default meta

export const AllVariants = {}
`)

      const stories = await extractStoriesFromFile('/fake/path.tsx')

      expect(stories).toHaveLength(1)
      expect(stories[0]?.id).toBe('components-badge--all-variants')
    })

    it('should generate correct story ID with camelCase export', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue(`
const meta = {
  title: 'Components/Input',
}

export default meta

export const AllVariantsWithIcons = {}
`)

      const stories = await extractStoriesFromFile('/fake/path.tsx', 'AllVariants')

      expect(stories).toHaveLength(1)
      expect(stories[0]?.id).toBe('components-input--all-variants-with-icons')
    })

    it('should skip default export', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue(`
const meta = {
  title: 'Components/Test',
}

export default meta

export const AllVariants = {}
`)

      const stories = await extractStoriesFromFile('/fake/path.tsx')

      expect(stories).toHaveLength(1)
      expect(stories[0]?.exportName).toBe('AllVariants')
    })

    it('should skip private exports starting with underscore', async () => {
      const { readFile } = await import('node:fs/promises')
      vi.mocked(readFile).mockResolvedValue(`
const meta = {
  title: 'Components/Test',
}

export default meta

export const _PrivateAllVariants = {}
export const AllVariants = {}
`)

      const stories = await extractStoriesFromFile('/fake/path.tsx')

      expect(stories).toHaveLength(1)
      expect(stories[0]?.exportName).toBe('AllVariants')
    })
  })
})
