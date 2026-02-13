import { describe, expect, it, vi } from 'vitest'

import { listIconsTool } from './list-icons'

// Mock the ui-library module
vi.mock('@nejcjelovcan/traceframe-ui-library', () => ({
  CATEGORY_LABELS: {
    navigation: 'Navigation',
    action: 'Actions',
    status: 'Status & Feedback',
  },
  SIZE_MAP: {
    xs: 12,
    sm: 16,
    md: 20,
  },
  ICON_METADATA: {
    search: { description: 'Magnifying glass', category: 'action', usage: 'For search' },
    'chevron-down': {
      description: 'Downward chevron',
      category: 'navigation',
      usage: 'For dropdowns',
    },
    'alert-circle': { description: 'Alert icon', category: 'status', usage: 'For errors' },
  },
  getIconsByCategory: vi.fn(),
}))

describe('listIconsTool', () => {
  it('returns all icons when no category specified', async () => {
    const result = await listIconsTool({})

    expect(result.success).toBe(true)
    expect(result.count).toBe(3)
    expect(result.icons).toHaveLength(3)
    expect(result.icons.map((i) => i.name)).toContain('search')
    expect(result.icons.map((i) => i.name)).toContain('chevron-down')
    expect(result.summary).toContain('3 icon(s)')
  })

  it('includes category labels and sizes in result', async () => {
    const result = await listIconsTool({})

    expect(result.categories).toBeDefined()
    expect(result.categories.navigation).toBe('Navigation')
    expect(result.sizes).toBeDefined()
    expect(result.sizes.md).toBe(20)
  })

  it('filters by category when specified', async () => {
    const { getIconsByCategory } = await import('@nejcjelovcan/traceframe-ui-library')
    vi.mocked(getIconsByCategory).mockReturnValue(['search'])

    const result = await listIconsTool({ category: 'action' })

    expect(result.success).toBe(true)
    expect(getIconsByCategory).toHaveBeenCalledWith('action')
    expect(result.summary).toContain('action')
  })

  it('returns error for invalid category', async () => {
    const result = await listIconsTool({ category: 'invalid' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('Invalid category')
  })

  it('returns empty list when no icons in category', async () => {
    const { getIconsByCategory } = await import('@nejcjelovcan/traceframe-ui-library')
    vi.mocked(getIconsByCategory).mockReturnValue([])

    const result = await listIconsTool({ category: 'theme' })

    expect(result.success).toBe(true)
    expect(result.count).toBe(0)
    expect(result.summary).toContain('No icons found')
  })
})
