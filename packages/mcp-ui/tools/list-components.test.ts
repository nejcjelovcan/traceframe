import { describe, expect, it, vi } from 'vitest'

import { listComponentsTool } from './list-components'

// Mock the storybook-parser module
vi.mock('../utils/storybook-parser.js', () => ({
  COMPONENT_CATEGORIES: ['primitives', 'layout', 'data'],
  getAllComponents: vi.fn(),
}))

describe('listComponentsTool', () => {
  it('returns success with components list', async () => {
    const { getAllComponents } = await import('../utils/storybook-parser.js')
    vi.mocked(getAllComponents).mockResolvedValue([
      {
        name: 'Button',
        category: 'primitives',
        tier: 1 as const,
        tierLabel: 'Tailwind + CVA',
        description: 'A button component',
      },
      {
        name: 'Card',
        category: 'data',
        tier: 1 as const,
        tierLabel: 'Tailwind + CVA',
        description: 'A card component',
      },
    ])

    const result = await listComponentsTool({})

    expect(result.success).toBe(true)
    expect(result.count).toBe(2)
    expect(result.components).toHaveLength(2)
    expect(result.summary).toContain('2 component(s)')
  })

  it('returns empty list when no components found', async () => {
    const { getAllComponents } = await import('../utils/storybook-parser.js')
    vi.mocked(getAllComponents).mockResolvedValue([])

    const result = await listComponentsTool({})

    expect(result.success).toBe(true)
    expect(result.count).toBe(0)
    expect(result.components).toEqual([])
    expect(result.summary).toContain('No components found')
  })

  it('passes category filter to getAllComponents', async () => {
    const { getAllComponents } = await import('../utils/storybook-parser.js')
    vi.mocked(getAllComponents).mockResolvedValue([])

    await listComponentsTool({ category: 'primitives' })

    expect(getAllComponents).toHaveBeenCalledWith('primitives')
  })

  it('returns error on failure', async () => {
    const { getAllComponents } = await import('../utils/storybook-parser.js')
    vi.mocked(getAllComponents).mockRejectedValue(new Error('Parse error'))

    const result = await listComponentsTool({})

    expect(result.success).toBe(false)
    expect(result.error).toBe('Parse error')
  })

  it('includes tier breakdown in summary', async () => {
    const { getAllComponents } = await import('../utils/storybook-parser.js')
    vi.mocked(getAllComponents).mockResolvedValue([
      {
        name: 'Button',
        category: 'primitives',
        tier: 1 as const,
        tierLabel: 'Tailwind + CVA',
        description: 'A button',
      },
      {
        name: 'Select',
        category: 'selection',
        tier: 2 as const,
        tierLabel: 'Radix UI',
        description: 'A select',
      },
    ])

    const result = await listComponentsTool({})

    expect(result.summary).toContain('Tier 1: 1')
    expect(result.summary).toContain('Tier 2: 1')
  })
})
