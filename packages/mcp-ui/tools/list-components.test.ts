import { describe, expect, it } from 'vitest'

import { listComponentsTool } from './list-components'

describe('listComponentsTool', () => {
  it('returns success with components list', async () => {
    const result = await listComponentsTool({})

    expect(result.success).toBe(true)
    expect(result.count).toBeGreaterThan(0)
    expect(result.components.length).toBe(result.count)
    expect(result.summary).toContain('component(s)')
  })

  it('returns filtered list by category', async () => {
    const result = await listComponentsTool({ category: 'primitives' })

    expect(result.success).toBe(true)
    expect(result.components.every((c) => c.category === 'primitives')).toBe(true)
    expect(result.summary).toContain('primitives')
  })

  it('returns empty list for nonexistent category', async () => {
    const result = await listComponentsTool({ category: 'nonexistent' })

    expect(result.success).toBe(true)
    expect(result.count).toBe(0)
    expect(result.components).toEqual([])
  })

  it('includes tier breakdown in summary', async () => {
    const result = await listComponentsTool({})

    expect(result.summary).toContain('Tier 1:')
    expect(result.summary).toContain('Tier 2:')
  })

  it('includes expected components', async () => {
    const result = await listComponentsTool({})
    const names = result.components.map((c) => c.name)

    expect(names).toContain('Button')
    expect(names).toContain('Badge')
    expect(names).toContain('Select')
    expect(names).toContain('Card')
  })

  it('returns component summaries with all required fields', async () => {
    const result = await listComponentsTool({})

    for (const component of result.components) {
      expect(component.name).toBeTruthy()
      expect(component.category).toBeTruthy()
      expect([1, 2]).toContain(component.tier)
      expect(component.tierLabel).toBeTruthy()
      expect(component.description).toBeTruthy()
    }
  })
})
