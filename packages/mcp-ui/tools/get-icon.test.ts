import { describe, expect, it, vi } from 'vitest'

import { getIconTool } from './get-icon'

// Mock the ui-library module
vi.mock('@traceframe/ui-library', () => ({
  ICON_METADATA: {
    search: {
      description: 'Magnifying glass',
      category: 'action',
      usage: 'Use for search inputs',
      aliases: ['find', 'lookup'],
    },
    'chevron-down': {
      description: 'Downward chevron',
      category: 'navigation',
      usage: 'Use for dropdowns',
      // no aliases
    },
  },
}))

describe('getIconTool', () => {
  it('returns error when name is empty', async () => {
    const result = await getIconTool({ name: '' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('required')
  })

  it('returns error when name is whitespace only', async () => {
    const result = await getIconTool({ name: '   ' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('required')
  })

  it('returns icon details when found', async () => {
    const result = await getIconTool({ name: 'search' })

    expect(result.success).toBe(true)
    expect(result.icon).toBeDefined()
    expect(result.icon?.name).toBe('search')
    expect(result.icon?.description).toBe('Magnifying glass')
    expect(result.icon?.category).toBe('action')
    expect(result.icon?.usage).toBe('Use for search inputs')
    expect(result.icon?.aliases).toEqual(['find', 'lookup'])
  })

  it('returns empty aliases array when icon has no aliases', async () => {
    const result = await getIconTool({ name: 'chevron-down' })

    expect(result.success).toBe(true)
    expect(result.icon?.aliases).toEqual([])
  })

  it('returns error when icon not found', async () => {
    const result = await getIconTool({ name: 'nonexistent' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('nonexistent')
    expect(result.error).toContain('list_icons')
  })

  it('trims whitespace from name', async () => {
    const result = await getIconTool({ name: '  search  ' })

    expect(result.success).toBe(true)
    expect(result.icon?.name).toBe('search')
  })

  it('includes category in summary', async () => {
    const result = await getIconTool({ name: 'search' })

    expect(result.summary).toContain('action')
    expect(result.summary).toContain('Magnifying glass')
  })
})
