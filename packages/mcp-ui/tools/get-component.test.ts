import { describe, expect, it } from 'vitest'

import { getComponentTool } from './get-component'

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
    const result = await getComponentTool({ name: 'Button' })

    expect(result.success).toBe(true)
    expect(result.component?.name).toBe('Button')
    expect(result.component?.tier).toBe(1)
    expect(result.component?.props.length).toBeGreaterThan(0)
    expect(result.summary).toContain('Button')
    expect(result.summary).toContain('Tier 1')
  })

  it('returns error when component not found', async () => {
    const result = await getComponentTool({ name: 'NonExistent' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('NonExistent')
    expect(result.error).toContain('list_components')
  })

  it('handles case-insensitive lookup', async () => {
    const result = await getComponentTool({ name: 'button' })

    expect(result.success).toBe(true)
    expect(result.component?.name).toBe('Button')
  })

  it('trims whitespace from name', async () => {
    const result = await getComponentTool({ name: '  Button  ' })

    expect(result.success).toBe(true)
    expect(result.component?.name).toBe('Button')
  })

  it('includes tier 2 info in summary for Radix components', async () => {
    const result = await getComponentTool({ name: 'Select' })

    expect(result.success).toBe(true)
    expect(result.summary).toContain('Tier 2')
    expect(result.summary).toContain('Radix UI Primitive')
  })

  it('returns accessibility info', async () => {
    const result = await getComponentTool({ name: 'Button' })

    expect(result.success).toBe(true)
    expect(result.component?.accessibility.length).toBeGreaterThan(0)
  })

  it('returns compound components for tier 2', async () => {
    const result = await getComponentTool({ name: 'Select' })

    expect(result.success).toBe(true)
    expect(result.component?.compoundComponents).toBeDefined()
    expect(result.component?.compoundComponents!.length).toBeGreaterThan(0)
  })
})
