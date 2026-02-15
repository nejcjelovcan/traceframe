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
      xs: { value: '1.5rem', description: 'Extra small size' },
      sm: { value: '2rem', description: 'Small size' },
      md: { value: '2.5rem', description: 'Medium size' },
    },
    spacing: {
      xs: { value: '0.25rem', description: 'Extra small spacing' },
      sm: { value: '0.5rem', description: 'Small spacing' },
    },
    shadows: {
      sm: { value: 'shadow-value-sm', description: 'Small shadow' },
      interactive: { value: 'shadow-value-interactive', description: 'Interactive shadow' },
      'highlight-hover': {
        value: 'shadow-value-highlight-hover',
        description: 'Highlight hover shadow',
      },
    },
    borders: {
      line: { value: '1px solid', description: 'Standard border' },
      thick: { value: '2px solid', description: 'Thick border' },
      highlight: { value: '2px dashed', description: 'Highlight border' },
    },
    gradients: {
      interactive: {
        description: 'Interactive gradients',
        variants: {
          primary: { value: 'gradient-primary', description: 'Primary gradient' },
          secondary: { value: 'gradient-secondary', description: 'Secondary gradient' },
        },
      },
      status: {
        description: 'Status gradients',
        variants: {
          success: { value: 'gradient-success', description: 'Success gradient' },
          error: { value: 'gradient-error', description: 'Error gradient' },
        },
      },
    },
    borderRadius: {
      sm: { value: '0.25rem', description: 'Small border radius' },
      md: { value: '0.375rem', description: 'Medium border radius - default' },
      lg: { value: '0.5rem', description: 'Large border radius' },
      xl: { value: '0.75rem', description: 'Extra large border radius' },
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
    expect(result.tokens.borderRadius).toBeDefined()
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
    expect(result.tokens.spacing?.xs.value).toBe('0.25rem')
    expect(result.tokens.spacing?.sm.value).toBe('0.5rem')
  })

  it('filters to shadows only', async () => {
    const result = await getDesignTokensTool({ type: 'shadows' })

    expect(result.success).toBe(true)
    expect(result.tokens.shadows).toBeDefined()
    expect(result.tokens.colors).toBeUndefined()
    expect(result.tokens.borders).toBeUndefined()
    expect(result.summary).toContain('shadow tokens')
    expect(result.tokens.shadows?.sm.value).toBe('shadow-value-sm')
    expect(result.tokens.shadows?.interactive.description).toBe('Interactive shadow')
  })

  it('filters to borders only', async () => {
    const result = await getDesignTokensTool({ type: 'borders' })

    expect(result.success).toBe(true)
    expect(result.tokens.borders).toBeDefined()
    expect(result.tokens.colors).toBeUndefined()
    expect(result.tokens.shadows).toBeUndefined()
    expect(result.summary).toContain('border style tokens')
    expect(result.tokens.borders?.line.value).toBe('1px solid')
    expect(result.tokens.borders?.thick.description).toBe('Thick border')
  })

  it('filters to radius only', async () => {
    const result = await getDesignTokensTool({ type: 'radius' })

    expect(result.success).toBe(true)
    expect(result.tokens.borderRadius).toBeDefined()
    expect(result.tokens.colors).toBeUndefined()
    expect(result.tokens.borders).toBeUndefined()
    expect(result.summary).toContain('border radius tokens')
    expect(result.tokens.borderRadius?.sm.value).toBe('0.25rem')
    expect(result.tokens.borderRadius?.md.description).toBe('Medium border radius - default')
  })

  it('filters to gradients only', async () => {
    const result = await getDesignTokensTool({ type: 'gradients' })

    expect(result.success).toBe(true)
    expect(result.tokens.gradients).toBeDefined()
    expect(result.tokens.colors).toBeUndefined()
    expect(result.tokens.borders).toBeUndefined()
    expect(result.summary).toContain('gradient categories')
    expect(result.tokens.gradients?.interactive.description).toBe('Interactive gradients')
    expect(result.tokens.gradients?.status.variants.success.value).toBe('gradient-success')
  })

  it('includes all new token types when type is all', async () => {
    const result = await getDesignTokensTool({ type: 'all' })

    expect(result.success).toBe(true)
    expect(result.tokens.colors).toBeDefined()
    expect(result.tokens.typography).toBeDefined()
    expect(result.tokens.spacing).toBeDefined()
    expect(result.tokens.sizing).toBeDefined()
    expect(result.tokens.shadows).toBeDefined()
    expect(result.tokens.borders).toBeDefined()
    expect(result.tokens.borderRadius).toBeDefined()
    expect(result.tokens.gradients).toBeDefined()
    expect(result.summary).toContain('shadow values')
    expect(result.summary).toContain('border styles')
    expect(result.summary).toContain('border radius values')
    expect(result.summary).toContain('gradient categories')
  })
})
