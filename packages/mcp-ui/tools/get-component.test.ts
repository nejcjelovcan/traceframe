import { describe, expect, it, vi } from 'vitest'

import { getComponentTool } from './get-component'

// Mock the storybook-parser module
vi.mock('../utils/storybook-parser.js', () => ({
  getComponentByName: vi.fn(),
}))

describe('getComponentTool', () => {
  it('returns error when name is empty', async () => {
    const result = await getComponentTool({ name: '' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('required')
  })

  it('returns error when name is whitespace only', async () => {
    const result = await getComponentTool({ name: '   ' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('required')
  })

  it('returns component details when found', async () => {
    const { getComponentByName } = await import('../utils/storybook-parser.js')
    vi.mocked(getComponentByName).mockResolvedValue({
      name: 'Button',
      category: 'primitives',
      tier: 1,
      tierLabel: 'Tailwind + CVA',
      description: 'A versatile button',
      usage: 'Use for actions',
      accessibility: ['Keyboard accessible'],
      props: [
        {
          name: 'variant',
          description: 'Visual style',
          type: 'select',
          required: false,
          options: ['primary', 'secondary'],
        },
      ],
    })

    const result = await getComponentTool({ name: 'Button' })

    expect(result.success).toBe(true)
    expect(result.component?.name).toBe('Button')
    expect(result.component?.tier).toBe(1)
    expect(result.summary).toContain('Button')
    expect(result.summary).toContain('Tier 1')
  })

  it('returns error when component not found', async () => {
    const { getComponentByName } = await import('../utils/storybook-parser.js')
    vi.mocked(getComponentByName).mockResolvedValue(null)

    const result = await getComponentTool({ name: 'NonExistent' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('NonExistent')
    expect(result.error).toContain('list_components')
  })

  it('returns error on parse failure', async () => {
    const { getComponentByName } = await import('../utils/storybook-parser.js')
    vi.mocked(getComponentByName).mockRejectedValue(new Error('Read error'))

    const result = await getComponentTool({ name: 'Button' })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Read error')
  })

  it('trims whitespace from name', async () => {
    const { getComponentByName } = await import('../utils/storybook-parser.js')
    vi.mocked(getComponentByName).mockResolvedValue(null)

    await getComponentTool({ name: '  Button  ' })

    expect(getComponentByName).toHaveBeenCalledWith('Button')
  })

  it('includes tier 2 info in summary for Radix components', async () => {
    const { getComponentByName } = await import('../utils/storybook-parser.js')
    vi.mocked(getComponentByName).mockResolvedValue({
      name: 'Select',
      category: 'selection',
      tier: 2,
      tierLabel: 'Radix UI Primitive',
      description: 'Accessible select',
      usage: '',
      accessibility: [],
      props: [],
      radixHandles: ['Keyboard navigation'],
    })

    const result = await getComponentTool({ name: 'Select' })

    expect(result.success).toBe(true)
    expect(result.summary).toContain('Tier 2')
    expect(result.summary).toContain('Radix UI Primitive')
  })
})
