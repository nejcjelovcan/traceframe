import { describe, expect, it } from 'vitest'

import { getDesignTokens } from './design-tokens'

describe('getDesignTokens', () => {
  it('returns semantic tokens without palettes', async () => {
    const tokens = await getDesignTokens()

    expect(tokens.colors).toBeDefined()
    expect(tokens.colors.semantic).toBeDefined()
    // Palettes should not be exposed
    expect('palettes' in tokens.colors).toBe(false)
  })

  it('returns semantic token groups', async () => {
    const tokens = await getDesignTokens()

    // Should have common semantic token groups
    expect(tokens.colors.semantic.surface).toBeDefined()
    expect(tokens.colors.semantic.foreground).toBeDefined()
    expect(tokens.colors.semantic.border).toBeDefined()
  })

  it('returns semantic tokens with descriptions and variants', async () => {
    const tokens = await getDesignTokens()

    const surface = tokens.colors.semantic.surface
    expect(surface.description).toBeDefined()
    expect(surface.variants).toBeDefined()
    expect(surface.variants.DEFAULT).toBeDefined()
  })

  it('returns typography tokens', async () => {
    const tokens = await getDesignTokens()

    expect(tokens.typography).toBeDefined()
    expect(tokens.typography.fontFamily.sans).toContain('Inter')
    expect(tokens.typography.fontFamily.mono).toContain('JetBrains Mono')
    expect(tokens.typography.fontSize.base).toBeDefined()
  })

  it('returns spacing tokens', async () => {
    const tokens = await getDesignTokens()

    expect(tokens.spacing).toBeDefined()
  })

  it('returns border radius tokens', async () => {
    const tokens = await getDesignTokens()

    expect(tokens.borderRadius).toBeDefined()
    expect(tokens.borderRadius.sm).toBeDefined()
    expect(tokens.borderRadius.sm.value).toBe('0.125rem')
    // Description is currently empty in generated metadata
    expect(tokens.borderRadius.md.description).toBe('')
  })
})
