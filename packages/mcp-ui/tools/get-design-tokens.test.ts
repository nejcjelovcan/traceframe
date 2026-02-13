import { describe, expect, it, vi } from 'vitest'

import { getDesignTokensTool } from './get-design-tokens'

// Mock the design-tokens utility
vi.mock('../utils/design-tokens.js', () => ({
  getDesignTokens: vi.fn().mockResolvedValue({
    colors: {
      semantic: {
        surface: {
          description: 'Background colors',
          variants: {
            DEFAULT: {
              description: 'Primary background',
            },
            muted: {
              description: 'Secondary background',
            },
          },
        },
        foreground: {
          description: 'Text colors',
          variants: {
            DEFAULT: {
              description: 'Primary text',
            },
            muted: {
              description: 'Secondary text',
            },
          },
        },
      },
    },
    typography: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        xs: { size: '0.75rem', lineHeight: '1rem' },
        sm: { size: '0.875rem', lineHeight: '1.25rem' },
      },
    },
    sizing: {
      xs: 'var(--size-xs)',
      sm: 'var(--size-sm)',
      md: 'var(--size-md)',
    },
    spacing: {
      '18': '4.5rem',
      '22': '5.5rem',
    },
  }),
}))

describe('getDesignTokensTool', () => {
  it('returns all tokens by default', async () => {
    const result = await getDesignTokensTool({})

    expect(result.success).toBe(true)
    expect(result.tokens.colors).toBeDefined()
    expect(result.tokens.typography).toBeDefined()
    expect(result.tokens.spacing).toBeDefined()
    expect(result.summary).toContain('all design tokens')
  })

  it('filters to colors only', async () => {
    const result = await getDesignTokensTool({ type: 'colors' })

    expect(result.success).toBe(true)
    expect(result.tokens.colors).toBeDefined()
    expect(result.tokens.typography).toBeUndefined()
    expect(result.tokens.spacing).toBeUndefined()
    expect(result.summary).toContain('color tokens')
  })

  it('filters to typography only', async () => {
    const result = await getDesignTokensTool({ type: 'typography' })

    expect(result.success).toBe(true)
    expect(result.tokens.colors).toBeUndefined()
    expect(result.tokens.typography).toBeDefined()
    expect(result.tokens.spacing).toBeUndefined()
    expect(result.summary).toContain('typography tokens')
  })

  it('filters to spacing only', async () => {
    const result = await getDesignTokensTool({ type: 'spacing' })

    expect(result.success).toBe(true)
    expect(result.tokens.colors).toBeUndefined()
    expect(result.tokens.typography).toBeUndefined()
    expect(result.tokens.spacing).toBeDefined()
    expect(result.summary).toContain('spacing tokens')
  })

  it('returns semantic tokens with descriptions (not palettes)', async () => {
    const result = await getDesignTokensTool({ type: 'colors' })

    expect(result.success).toBe(true)
    // Should not expose palettes
    expect(result.tokens.colors?.semantic).toBeDefined()
    expect('palettes' in (result.tokens.colors ?? {})).toBe(false)

    const surface = result.tokens.colors?.semantic.surface
    expect(surface?.description).toBe('Background colors')
    expect(surface?.variants.DEFAULT.description).toBe('Primary background')
  })

  it('returns typography with font families and sizes', async () => {
    const result = await getDesignTokensTool({ type: 'typography' })

    expect(result.success).toBe(true)
    expect(result.tokens.typography?.fontFamily.sans).toContain('Inter')
    expect(result.tokens.typography?.fontFamily.mono).toContain('JetBrains Mono')
    expect(result.tokens.typography?.fontSize.xs.size).toBe('0.75rem')
  })

  it('returns custom spacing values', async () => {
    const result = await getDesignTokensTool({ type: 'spacing' })

    expect(result.success).toBe(true)
    expect(result.tokens.spacing?.['18']).toBe('4.5rem')
    expect(result.tokens.spacing?.['22']).toBe('5.5rem')
  })
})
