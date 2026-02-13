import { describe, expect, it } from 'vitest'

import { getTailwindUtilitiesTool, UTILITY_CATEGORIES } from './get-tailwind-utilities.js'

describe('getTailwindUtilitiesTool', () => {
  describe('category filtering', () => {
    it('returns all categories when no filter specified', () => {
      const result = getTailwindUtilitiesTool({})

      expect(result.success).toBe(true)
      expect(result.utilities.spacing).toBeDefined()
      expect(result.utilities.colors).toBeDefined()
      expect(result.utilities.typography).toBeDefined()
      expect(result.utilities.layout).toBeDefined()
    })

    it('returns all categories when filter is "all"', () => {
      const result = getTailwindUtilitiesTool({ category: 'all' })

      expect(result.success).toBe(true)
      expect(result.utilities.spacing).toBeDefined()
      expect(result.utilities.colors).toBeDefined()
      expect(result.utilities.typography).toBeDefined()
      expect(result.utilities.layout).toBeDefined()
    })

    it('returns only spacing when filter is "spacing"', () => {
      const result = getTailwindUtilitiesTool({ category: 'spacing' })

      expect(result.success).toBe(true)
      expect(result.utilities.spacing).toBeDefined()
      expect(result.utilities.colors).toBeUndefined()
      expect(result.utilities.typography).toBeUndefined()
      expect(result.utilities.layout).toBeUndefined()
    })

    it('returns only colors when filter is "colors"', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })

      expect(result.success).toBe(true)
      expect(result.utilities.spacing).toBeUndefined()
      expect(result.utilities.colors).toBeDefined()
      expect(result.utilities.typography).toBeUndefined()
      expect(result.utilities.layout).toBeUndefined()
    })

    it('returns only typography when filter is "typography"', () => {
      const result = getTailwindUtilitiesTool({ category: 'typography' })

      expect(result.success).toBe(true)
      expect(result.utilities.spacing).toBeUndefined()
      expect(result.utilities.colors).toBeUndefined()
      expect(result.utilities.typography).toBeDefined()
      expect(result.utilities.layout).toBeUndefined()
    })

    it('returns only layout when filter is "layout"', () => {
      const result = getTailwindUtilitiesTool({ category: 'layout' })

      expect(result.success).toBe(true)
      expect(result.utilities.spacing).toBeUndefined()
      expect(result.utilities.colors).toBeUndefined()
      expect(result.utilities.typography).toBeUndefined()
      expect(result.utilities.layout).toBeDefined()
    })
  })

  describe('spacing utilities', () => {
    it('includes padding classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'spacing' })

      expect(result.utilities.spacing?.padding).toContain('p-0')
      expect(result.utilities.spacing?.padding).toContain('p-4')
      expect(result.utilities.spacing?.padding).toContain('px-4')
      expect(result.utilities.spacing?.padding).toContain('py-2')
      expect(result.utilities.spacing?.padding).toContain('pt-4')
    })

    it('includes margin classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'spacing' })

      expect(result.utilities.spacing?.margin).toContain('m-0')
      expect(result.utilities.spacing?.margin).toContain('m-4')
      expect(result.utilities.spacing?.margin).toContain('m-auto')
      expect(result.utilities.spacing?.margin).toContain('mx-auto')
      expect(result.utilities.spacing?.margin).toContain('-m-4')
    })

    it('includes gap classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'spacing' })

      expect(result.utilities.spacing?.gap).toContain('gap-0')
      expect(result.utilities.spacing?.gap).toContain('gap-4')
      expect(result.utilities.spacing?.gap).toContain('gap-8')
    })

    it('includes custom spacing values', () => {
      const result = getTailwindUtilitiesTool({ category: 'spacing' })

      expect(result.utilities.spacing?.custom).toEqual({
        '18': '4.5rem',
        '22': '5.5rem',
      })
    })

    it('includes project-specific spacing values (18, 22)', () => {
      const result = getTailwindUtilitiesTool({ category: 'spacing' })

      expect(result.utilities.spacing?.padding).toContain('p-18')
      expect(result.utilities.spacing?.padding).toContain('p-22')
      expect(result.utilities.spacing?.margin).toContain('m-18')
      expect(result.utilities.spacing?.margin).toContain('m-22')
    })
  })

  describe('color utilities', () => {
    it('includes semantic text colors', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })

      expect(result.utilities.colors?.text).toContain('text-foreground')
      expect(result.utilities.colors?.text).toContain('text-foreground-muted')
    })

    it('includes semantic background colors', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })

      expect(result.utilities.colors?.background).toContain('bg-surface')
      expect(result.utilities.colors?.background).toContain('bg-surface-muted')
      expect(result.utilities.colors?.background).toContain('bg-surface-subtle')
    })

    it('includes semantic border colors', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })

      expect(result.utilities.colors?.border).toContain('border-border')
      expect(result.utilities.colors?.border).toContain('border-border-muted')
    })

    it('includes palette-based colors', () => {
      const result = getTailwindUtilitiesTool({ category: 'colors' })

      // Primary palette
      expect(result.utilities.colors?.text).toContain('text-primary-500')
      expect(result.utilities.colors?.background).toContain('bg-primary-500')
      expect(result.utilities.colors?.border).toContain('border-primary-500')

      // Error palette
      expect(result.utilities.colors?.text).toContain('text-error-500')
      expect(result.utilities.colors?.background).toContain('bg-error-500')
    })
  })

  describe('typography utilities', () => {
    it('includes font sizes', () => {
      const result = getTailwindUtilitiesTool({ category: 'typography' })

      expect(result.utilities.typography?.size).toContain('text-xs')
      expect(result.utilities.typography?.size).toContain('text-sm')
      expect(result.utilities.typography?.size).toContain('text-base')
      expect(result.utilities.typography?.size).toContain('text-lg')
      expect(result.utilities.typography?.size).toContain('text-xl')
    })

    it('includes font weights', () => {
      const result = getTailwindUtilitiesTool({ category: 'typography' })

      expect(result.utilities.typography?.weight).toContain('font-normal')
      expect(result.utilities.typography?.weight).toContain('font-medium')
      expect(result.utilities.typography?.weight).toContain('font-semibold')
      expect(result.utilities.typography?.weight).toContain('font-bold')
    })

    it('includes font families', () => {
      const result = getTailwindUtilitiesTool({ category: 'typography' })

      expect(result.utilities.typography?.family).toContain('font-sans')
      expect(result.utilities.typography?.family).toContain('font-mono')
    })
  })

  describe('layout utilities', () => {
    it('includes display classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'layout' })

      expect(result.utilities.layout?.display).toContain('flex')
      expect(result.utilities.layout?.display).toContain('grid')
      expect(result.utilities.layout?.display).toContain('block')
      expect(result.utilities.layout?.display).toContain('inline-flex')
      expect(result.utilities.layout?.display).toContain('hidden')
    })

    it('includes flex direction classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'layout' })

      expect(result.utilities.layout?.flexDirection).toContain('flex-row')
      expect(result.utilities.layout?.flexDirection).toContain('flex-col')
    })

    it('includes justify classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'layout' })

      expect(result.utilities.layout?.justify).toContain('justify-start')
      expect(result.utilities.layout?.justify).toContain('justify-center')
      expect(result.utilities.layout?.justify).toContain('justify-between')
    })

    it('includes align classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'layout' })

      expect(result.utilities.layout?.align).toContain('items-start')
      expect(result.utilities.layout?.align).toContain('items-center')
      expect(result.utilities.layout?.align).toContain('items-stretch')
    })

    it('includes grid classes', () => {
      const result = getTailwindUtilitiesTool({ category: 'layout' })

      expect(result.utilities.layout?.grid).toContain('grid-cols-1')
      expect(result.utilities.layout?.grid).toContain('grid-cols-2')
      expect(result.utilities.layout?.grid).toContain('grid-cols-12')
    })
  })

  describe('summary', () => {
    it('provides meaningful summary for all categories', () => {
      const result = getTailwindUtilitiesTool({})

      expect(result.summary).toContain('spacing classes')
      expect(result.summary).toContain('color classes')
      expect(result.summary).toContain('typography classes')
      expect(result.summary).toContain('layout classes')
    })

    it('provides summary for single category', () => {
      const result = getTailwindUtilitiesTool({ category: 'typography' })

      expect(result.summary).toContain('typography classes')
      expect(result.summary).not.toContain('spacing')
    })
  })

  describe('UTILITY_CATEGORIES constant', () => {
    it('exports all valid categories', () => {
      expect(UTILITY_CATEGORIES).toEqual(['spacing', 'colors', 'typography', 'layout', 'all'])
    })
  })
})
