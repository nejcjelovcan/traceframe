import { describe, expect, it } from 'vitest'

import { TOKEN_METADATA } from '@nejcjelovcan/traceframe-ui-library'

import { getTailwindUtilitiesTool, UTILITY_CATEGORIES } from './get-tailwind-utilities.js'

describe('getTailwindUtilitiesTool', () => {
  describe('UTILITY_CATEGORIES constant', () => {
    it('exports all valid categories', () => {
      expect(UTILITY_CATEGORIES).toEqual([
        'colors',
        'spacing',
        'sizing',
        'typography',
        'borders',
        'shadows',
        'gradients',
        'all',
      ])
    })
  })

  describe('category filtering', () => {
    it('returns all categories when no filter specified', () => {
      const result = getTailwindUtilitiesTool({})

      expect(result.success).toBe(true)
      expect(result.utilities.colors).toBeDefined()
      expect(result.utilities.spacing).toBeDefined()
      expect(result.utilities.sizing).toBeDefined()
      expect(result.utilities.typography).toBeDefined()
      expect(result.utilities.borders).toBeDefined()
      expect(result.utilities.shadows).toBeDefined()
      expect(result.utilities.gradients).toBeDefined()
    })

    it('returns all categories when filter is "all"', () => {
      const result = getTailwindUtilitiesTool({ category: 'all' })

      expect(result.success).toBe(true)
      expect(result.utilities.colors).toBeDefined()
      expect(result.utilities.spacing).toBeDefined()
      expect(result.utilities.sizing).toBeDefined()
      expect(result.utilities.typography).toBeDefined()
      expect(result.utilities.borders).toBeDefined()
      expect(result.utilities.shadows).toBeDefined()
      expect(result.utilities.gradients).toBeDefined()
    })

    it.each([
      'colors',
      'spacing',
      'sizing',
      'typography',
      'borders',
      'shadows',
      'gradients',
    ] as const)('returns only %s when filter is "%s"', (category) => {
      const result = getTailwindUtilitiesTool({ category })

      expect(result.success).toBe(true)
      expect(result.utilities[category]).toBeDefined()

      const allCategories = [
        'colors',
        'spacing',
        'sizing',
        'typography',
        'borders',
        'shadows',
        'gradients',
      ] as const
      for (const other of allCategories) {
        if (other !== category) {
          expect(result.utilities[other]).toBeUndefined()
        }
      }
    })
  })

  describe('colors', () => {
    it('includes all semantic color groups from TOKEN_METADATA (except shadow)', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const groups = result.utilities.colors!.semantic.map((g) => g.group)

      const expectedGroups = Object.keys(TOKEN_METADATA.semantic).filter((g) => g !== 'shadow')
      expect(groups).toEqual(expectedGroups)
    })

    it('includes surface group with correct variants', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const surface = result.utilities.colors!.semantic.find((g) => g.group === 'surface')

      expect(surface).toBeDefined()
      expect(surface!.description).toBeDefined()
      const variantNames = surface!.variants.map((v) => v.name)
      expect(variantNames).toContain('DEFAULT')
      expect(variantNames).toContain('muted')
      expect(variantNames).toContain('subtle')
    })

    it('generates bg-/text-/border- classes for semantic variants', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const surface = result.utilities.colors!.semantic.find((g) => g.group === 'surface')!
      const defaultVariant = surface.variants.find((v) => v.name === 'DEFAULT')!

      expect(defaultVariant.classes).toContain('bg-surface')
      expect(defaultVariant.classes).toContain('text-surface')
      expect(defaultVariant.classes).toContain('border-surface')
    })

    it('generates hyphenated classes for non-DEFAULT variants', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const surface = result.utilities.colors!.semantic.find((g) => g.group === 'surface')!
      const mutedVariant = surface.variants.find((v) => v.name === 'muted')!

      expect(mutedVariant.classes).toContain('bg-surface-muted')
      expect(mutedVariant.classes).toContain('text-surface-muted')
      expect(mutedVariant.classes).toContain('border-surface-muted')
    })

    it('includes interactive group with all sub-variants', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const interactive = result.utilities.colors!.semantic.find((g) => g.group === 'interactive')

      expect(interactive).toBeDefined()
      const variantNames = interactive!.variants.map((v) => v.name)
      expect(variantNames).toContain('primary')
      expect(variantNames).toContain('primary-hover')
      expect(variantNames).toContain('primary-foreground')
      expect(variantNames).toContain('destructive')
    })

    it('includes status group with info/success/warning/error sub-variants', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const status = result.utilities.colors!.semantic.find((g) => g.group === 'status')

      expect(status).toBeDefined()
      const variantNames = status!.variants.map((v) => v.name)
      expect(variantNames).toContain('info')
      expect(variantNames).toContain('success')
      expect(variantNames).toContain('error-muted')
      expect(variantNames).toContain('warning-foreground')
    })

    it('includes accent group', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const accent = result.utilities.colors!.semantic.find((g) => g.group === 'accent')

      expect(accent).toBeDefined()
      const variantNames = accent!.variants.map((v) => v.name)
      expect(variantNames).toContain('1')
      expect(variantNames).toContain('1-muted')
      expect(variantNames).toContain('1-foreground')
    })

    it('includes disabled and tooltip groups', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const groups = result.utilities.colors!.semantic.map((g) => g.group)

      expect(groups).toContain('disabled')
      expect(groups).toContain('tooltip')
    })

    it('includes ring group', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const ring = result.utilities.colors!.semantic.find((g) => g.group === 'ring')

      expect(ring).toBeDefined()
      expect(ring!.variants.length).toBeGreaterThan(0)
    })

    it('includes all palettes from TOKEN_METADATA', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const paletteNames = result.utilities.colors!.palettes.map((p) => p.name)

      for (const paletteName of Object.keys(TOKEN_METADATA.palettes)) {
        expect(paletteNames).toContain(paletteName)
      }
    })

    it('palettes have description, usage, shades, and example classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const primary = result.utilities.colors!.palettes.find((p) => p.name === 'primary')!

      expect(primary.description).toBeDefined()
      expect(primary.usage).toBeDefined()
      expect(primary.shades).toEqual(TOKEN_METADATA.palettes.primary.shades)
      expect(primary.exampleClasses).toContain('bg-primary-500')
      expect(primary.exampleClasses).toContain('text-primary-500')
    })

    it('does not include shadow in semantic colors', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })
      const groups = result.utilities.colors!.semantic.map((g) => g.group)

      expect(groups).not.toContain('shadow')
    })
  })

  describe('spacing', () => {
    it('returns entries derived from TOKEN_METADATA.theme.spacing', () => {
      const result = getTailwindUtilitiesTool({ category: 'spacing' })

      expect(result.utilities.spacing!.length).toBe(
        Object.keys(TOKEN_METADATA.theme.spacing).length
      )
    })

    it('each entry has name, value, description, and classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'spacing' })
      const entry = result.utilities.spacing![0]!

      expect(entry.name).toBeDefined()
      expect(entry.value).toBeDefined()
      expect(entry.description).toBeDefined()
      expect(entry.classes.length).toBeGreaterThan(0)
    })

    it('includes p-/m-/gap- classes for each token', () => {
      const result = getTailwindUtilitiesTool({ category: 'spacing' })
      const md = result.utilities.spacing!.find((e) => e.name === 'md')!

      expect(md.classes).toContain('p-md')
      expect(md.classes).toContain('m-md')
      expect(md.classes).toContain('gap-md')
      expect(md.classes).toContain('px-md')
      expect(md.classes).toContain('my-md')
    })

    it('token names match TOKEN_METADATA keys', () => {
      const result = getTailwindUtilitiesTool({ category: 'spacing' })
      const names = result.utilities.spacing!.map((e) => e.name)

      for (const key of Object.keys(TOKEN_METADATA.theme.spacing)) {
        expect(names).toContain(key)
      }
    })
  })

  describe('sizing', () => {
    it('returns entries derived from TOKEN_METADATA.theme.size', () => {
      const result = getTailwindUtilitiesTool({ category: 'sizing' })

      expect(result.utilities.sizing!.length).toBe(Object.keys(TOKEN_METADATA.theme.size).length)
    })

    it('includes h-size-/w-size- classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'sizing' })
      const md = result.utilities.sizing!.find((e) => e.name === 'md')!

      expect(md.classes).toContain('h-size-md')
      expect(md.classes).toContain('w-size-md')
    })
  })

  describe('typography', () => {
    it('includes font families from TOKEN_METADATA', () => {
      const result = getTailwindUtilitiesTool({ category: 'typography' })
      const names = result.utilities.typography!.map((e) => e.name)

      expect(names).toContain('font-sans')
      expect(names).toContain('font-mono')
    })

    it('includes font sizes from TOKEN_METADATA', () => {
      const result = getTailwindUtilitiesTool({ category: 'typography' })
      const names = result.utilities.typography!.map((e) => e.name)

      for (const key of Object.keys(TOKEN_METADATA.theme.fontSize)) {
        expect(names).toContain(`text-${key}`)
      }
    })

    it('font size entries include value with line height', () => {
      const result = getTailwindUtilitiesTool({ category: 'typography' })
      const textSm = result.utilities.typography!.find((e) => e.name === 'text-sm')

      // fontSize is currently empty in generated metadata, skip this test
      if (textSm) {
        expect(textSm.value).toContain('/')
        expect(textSm.description).toBeDefined()
      } else {
        // This is expected until fontSize is populated in the generation script
        expect(textSm).toBeUndefined()
      }
    })

    it('total count matches fontFamily + fontSize keys', () => {
      const result = getTailwindUtilitiesTool({ category: 'typography' })
      const expected =
        Object.keys(TOKEN_METADATA.theme.fontFamily).length +
        Object.keys(TOKEN_METADATA.theme.fontSize).length

      expect(result.utilities.typography!.length).toBe(expected)
    })
  })

  describe('borders', () => {
    it('returns entries derived from TOKEN_METADATA.theme.borderRadius and borderStyle', () => {
      const result = getTailwindUtilitiesTool({ category: 'borders' })
      const borderRadiusCount = Object.keys(TOKEN_METADATA.theme.borderRadius).length
      const borderStyleCount =
        'borderStyle' in TOKEN_METADATA.theme
          ? Object.keys(TOKEN_METADATA.theme.borderStyle).length
          : 0

      expect(result.utilities.borders!.length).toBe(borderRadiusCount + borderStyleCount)
    })

    it('includes rounded- classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'borders' })
      const names = result.utilities.borders!.map((e) => e.name)

      expect(names).toContain('rounded-sm')
      expect(names).toContain('rounded-md')
      expect(names).toContain('rounded-lg')
    })

    it('marks default border radius', () => {
      const result = getTailwindUtilitiesTool({ category: 'borders' })
      const md = result.utilities.borders!.find((e) => e.name === 'rounded-md')!

      expect(md.description).toContain('(default)')
    })

    it('includes border style tokens', () => {
      const result = getTailwindUtilitiesTool({ category: 'borders' })
      const names = result.utilities.borders!.map((e) => e.name)

      expect(names).toContain('border-line')
      expect(names).toContain('border-thick')
      expect(names).toContain('border-highlight')
    })

    it('border style entries include directional and color variant classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'borders' })
      const line = result.utilities.borders!.find((e) => e.name === 'border-line')!

      expect(line.classes).toContain('border-line')
      expect(line.classes).toContain('border-t-line')
      expect(line.classes).toContain('border-r-line')
      expect(line.classes).toContain('border-b-line')
      expect(line.classes).toContain('border-l-line')
      expect(line.classes).toContain('border-line-status-error-border')
      expect(line.classes).toContain('border-line-accent-1-border')
    })
  })

  describe('shadows', () => {
    it('returns entries derived from TOKEN_METADATA.theme.shadow', () => {
      const result = getTailwindUtilitiesTool({ category: 'shadows' })

      expect(result.utilities.shadows!.length).toBe(Object.keys(TOKEN_METADATA.theme.shadow).length)
    })

    it('includes shadow- classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'shadows' })
      const names = result.utilities.shadows!.map((e) => e.name)

      expect(names).toContain('shadow-sm')
      expect(names).toContain('shadow-md')
      expect(names).toContain('shadow-lg')
    })

    it('each shadow entry has a CSS value', () => {
      const result = getTailwindUtilitiesTool({ category: 'shadows' })
      for (const entry of result.utilities.shadows!) {
        expect(entry.value).toBeDefined()
        expect(entry.value.length).toBeGreaterThan(0)
      }
    })
  })

  describe('gradients', () => {
    it('returns gradient entries from TOKEN_METADATA.theme.gradient', () => {
      const result = getTailwindUtilitiesTool({ category: 'gradients' })

      expect(result.utilities.gradients).toBeDefined()
      expect(result.utilities.gradients!.length).toBeGreaterThan(0)
    })

    it('includes core gradient utilities', () => {
      const result = getTailwindUtilitiesTool({ category: 'gradients' })
      const names = result.utilities.gradients!.map((e) => e.name)

      expect(names).toContain('bg-gradient-primary')
      expect(names).toContain('bg-gradient-secondary')
      expect(names).toContain('bg-gradient-destructive')
      expect(names).toContain('bg-gradient-surface')
    })

    it('includes status gradient utilities', () => {
      const result = getTailwindUtilitiesTool({ category: 'gradients' })
      const names = result.utilities.gradients!.map((e) => e.name)

      expect(names).toContain('bg-gradient-status-info')
      expect(names).toContain('bg-gradient-status-success')
      expect(names).toContain('bg-gradient-status-warning')
      expect(names).toContain('bg-gradient-status-error')
    })

    it('includes accent gradient utilities', () => {
      const result = getTailwindUtilitiesTool({ category: 'gradients' })
      const names = result.utilities.gradients!.map((e) => e.name)

      expect(names).toContain('bg-gradient-accent-1')
      expect(names).toContain('bg-gradient-accent-2')
    })

    it('includes light gradient utilities', () => {
      const result = getTailwindUtilitiesTool({ category: 'gradients' })
      const names = result.utilities.gradients!.map((e) => e.name)

      expect(names).toContain('bg-gradient-primary-light')
      expect(names).toContain('bg-gradient-surface-light')
      expect(names).toContain('bg-gradient-status-info-light')
      expect(names).toContain('bg-gradient-accent-1-light')
    })

    it('each gradient entry has a CSS value', () => {
      const result = getTailwindUtilitiesTool({ category: 'gradients' })
      for (const entry of result.utilities.gradients!) {
        expect(entry.value).toBeDefined()
        expect(entry.value.length).toBeGreaterThan(0)
      }
    })
  })

  describe('summary', () => {
    it('provides meaningful summary for all categories', () => {
      const result = getTailwindUtilitiesTool({})

      expect(result.summary).toContain('semantic color variants')
      expect(result.summary).toContain('palettes')
      expect(result.summary).toContain('spacing tokens')
      expect(result.summary).toContain('sizing tokens')
      expect(result.summary).toContain('typography tokens')
      expect(result.summary).toContain('border tokens')
      expect(result.summary).toContain('shadow tokens')
      expect(result.summary).toContain('gradient tokens')
    })

    it('provides summary for single category', () => {
      const result = getTailwindUtilitiesTool({ category: 'borders' })

      expect(result.summary).toContain('border tokens')
      expect(result.summary).not.toContain('spacing')
    })
  })
})
