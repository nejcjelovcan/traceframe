import { describe, it, expect } from 'vitest'

import {
  isNonSemanticSpacingClass,
  isNonSemanticSizingClass,
  getSpacingSuggestion,
  getSizingSuggestion,
  SPACING_MAP,
  SIZING_MAP,
} from './semantic-token-utils'

describe('isNonSemanticSpacingClass', () => {
  it('detects numeric padding classes', () => {
    expect(isNonSemanticSpacingClass('p-4')).toBe(true)
    expect(isNonSemanticSpacingClass('px-2')).toBe(true)
    expect(isNonSemanticSpacingClass('py-8')).toBe(true)
    expect(isNonSemanticSpacingClass('pt-1')).toBe(true)
    expect(isNonSemanticSpacingClass('pr-3')).toBe(true)
    expect(isNonSemanticSpacingClass('pb-6')).toBe(true)
    expect(isNonSemanticSpacingClass('pl-16')).toBe(true)
    expect(isNonSemanticSpacingClass('ps-2')).toBe(true)
    expect(isNonSemanticSpacingClass('pe-4')).toBe(true)
  })

  it('detects numeric margin classes', () => {
    expect(isNonSemanticSpacingClass('m-4')).toBe(true)
    expect(isNonSemanticSpacingClass('mx-2')).toBe(true)
    expect(isNonSemanticSpacingClass('my-8')).toBe(true)
    expect(isNonSemanticSpacingClass('mt-1')).toBe(true)
    expect(isNonSemanticSpacingClass('mr-3')).toBe(true)
    expect(isNonSemanticSpacingClass('mb-6')).toBe(true)
    expect(isNonSemanticSpacingClass('ml-16')).toBe(true)
    expect(isNonSemanticSpacingClass('ms-2')).toBe(true)
    expect(isNonSemanticSpacingClass('me-4')).toBe(true)
  })

  it('detects negative margin classes', () => {
    expect(isNonSemanticSpacingClass('-m-2')).toBe(true)
    expect(isNonSemanticSpacingClass('-mx-4')).toBe(true)
    expect(isNonSemanticSpacingClass('-mt-1')).toBe(true)
  })

  it('detects numeric gap classes', () => {
    expect(isNonSemanticSpacingClass('gap-2')).toBe(true)
    expect(isNonSemanticSpacingClass('gap-x-4')).toBe(true)
    expect(isNonSemanticSpacingClass('gap-y-8')).toBe(true)
  })

  it('detects numeric space-between classes', () => {
    expect(isNonSemanticSpacingClass('space-x-4')).toBe(true)
    expect(isNonSemanticSpacingClass('space-y-2')).toBe(true)
  })

  it('detects decimal values like 0.5', () => {
    expect(isNonSemanticSpacingClass('p-0.5')).toBe(true)
    expect(isNonSemanticSpacingClass('m-1.5')).toBe(true)
  })

  it('strips modifiers before checking', () => {
    expect(isNonSemanticSpacingClass('hover:p-4')).toBe(true)
    expect(isNonSemanticSpacingClass('dark:gap-2')).toBe(true)
    expect(isNonSemanticSpacingClass('focus:mx-8')).toBe(true)
    expect(isNonSemanticSpacingClass('md:lg:p-4')).toBe(true)
  })

  it('does NOT flag zero values', () => {
    expect(isNonSemanticSpacingClass('p-0')).toBe(false)
    expect(isNonSemanticSpacingClass('gap-0')).toBe(false)
    expect(isNonSemanticSpacingClass('m-0')).toBe(false)
  })

  it('does NOT flag px values', () => {
    expect(isNonSemanticSpacingClass('p-px')).toBe(false)
    expect(isNonSemanticSpacingClass('m-px')).toBe(false)
  })

  it('does NOT flag keyword values', () => {
    expect(isNonSemanticSpacingClass('m-auto')).toBe(false)
  })

  it('does NOT flag semantic spacing classes', () => {
    expect(isNonSemanticSpacingClass('p-md')).toBe(false)
    expect(isNonSemanticSpacingClass('gap-sm')).toBe(false)
    expect(isNonSemanticSpacingClass('m-lg')).toBe(false)
    expect(isNonSemanticSpacingClass('p-base')).toBe(false)
    expect(isNonSemanticSpacingClass('gap-xs')).toBe(false)
  })

  it('does NOT flag arbitrary values', () => {
    expect(isNonSemanticSpacingClass('p-[20px]')).toBe(false)
    expect(isNonSemanticSpacingClass('m-[1.5rem]')).toBe(false)
  })

  it('does NOT flag fractional values', () => {
    expect(isNonSemanticSpacingClass('w-1/2')).toBe(false)
  })

  it('does NOT flag non-spacing classes', () => {
    expect(isNonSemanticSpacingClass('bg-primary-500')).toBe(false)
    expect(isNonSemanticSpacingClass('text-lg')).toBe(false)
    expect(isNonSemanticSpacingClass('flex')).toBe(false)
  })
})

describe('isNonSemanticSizingClass', () => {
  it('detects numeric height classes in element range', () => {
    expect(isNonSemanticSizingClass('h-6')).toBe(true)
    expect(isNonSemanticSizingClass('h-8')).toBe(true)
    expect(isNonSemanticSizingClass('h-10')).toBe(true)
    expect(isNonSemanticSizingClass('h-12')).toBe(true)
    expect(isNonSemanticSizingClass('h-14')).toBe(true)
  })

  it('detects numeric width classes in element range', () => {
    expect(isNonSemanticSizingClass('w-6')).toBe(true)
    expect(isNonSemanticSizingClass('w-8')).toBe(true)
    expect(isNonSemanticSizingClass('w-10')).toBe(true)
    expect(isNonSemanticSizingClass('w-12')).toBe(true)
  })

  it('detects min/max sizing classes in element range', () => {
    expect(isNonSemanticSizingClass('min-h-8')).toBe(true)
    expect(isNonSemanticSizingClass('max-h-12')).toBe(true)
    expect(isNonSemanticSizingClass('min-w-6')).toBe(true)
    expect(isNonSemanticSizingClass('max-w-10')).toBe(true)
  })

  it('strips modifiers before checking', () => {
    expect(isNonSemanticSizingClass('hover:h-8')).toBe(true)
    expect(isNonSemanticSizingClass('dark:w-10')).toBe(true)
    expect(isNonSemanticSizingClass('md:h-12')).toBe(true)
  })

  it('does NOT flag large layout dimensions', () => {
    expect(isNonSemanticSizingClass('w-48')).toBe(false)
    expect(isNonSemanticSizingClass('w-64')).toBe(false)
    expect(isNonSemanticSizingClass('w-96')).toBe(false)
    expect(isNonSemanticSizingClass('h-24')).toBe(false)
    expect(isNonSemanticSizingClass('h-32')).toBe(false)
  })

  it('does NOT flag small values below element sizing range', () => {
    expect(isNonSemanticSizingClass('h-1')).toBe(false)
    expect(isNonSemanticSizingClass('h-2')).toBe(false)
    expect(isNonSemanticSizingClass('h-3')).toBe(false)
    expect(isNonSemanticSizingClass('w-0.5')).toBe(false)
  })

  it('does NOT flag zero values', () => {
    expect(isNonSemanticSizingClass('h-0')).toBe(false)
    expect(isNonSemanticSizingClass('w-0')).toBe(false)
  })

  it('does NOT flag keyword values', () => {
    expect(isNonSemanticSizingClass('h-full')).toBe(false)
    expect(isNonSemanticSizingClass('w-auto')).toBe(false)
    expect(isNonSemanticSizingClass('h-screen')).toBe(false)
    expect(isNonSemanticSizingClass('h-fit')).toBe(false)
    expect(isNonSemanticSizingClass('w-min')).toBe(false)
    expect(isNonSemanticSizingClass('w-max')).toBe(false)
  })

  it('does NOT flag fractional values', () => {
    expect(isNonSemanticSizingClass('w-1/2')).toBe(false)
    expect(isNonSemanticSizingClass('h-1/3')).toBe(false)
  })

  it('does NOT flag arbitrary values', () => {
    expect(isNonSemanticSizingClass('w-[300px]')).toBe(false)
    expect(isNonSemanticSizingClass('h-[50%]')).toBe(false)
  })

  it('does NOT flag semantic sizing classes', () => {
    expect(isNonSemanticSizingClass('h-size-sm')).toBe(false)
    expect(isNonSemanticSizingClass('w-size-md')).toBe(false)
  })

  it('does NOT flag non-sizing classes', () => {
    expect(isNonSemanticSizingClass('p-4')).toBe(false)
    expect(isNonSemanticSizingClass('bg-primary-500')).toBe(false)
    expect(isNonSemanticSizingClass('flex')).toBe(false)
  })
})

describe('getSpacingSuggestion', () => {
  it('provides exact match suggestions', () => {
    expect(getSpacingSuggestion('p-4')).toBe('p-base')
    expect(getSpacingSuggestion('gap-2')).toBe('gap-sm')
    expect(getSpacingSuggestion('mx-8')).toBe('mx-lg')
    expect(getSpacingSuggestion('py-1')).toBe('py-xs')
    expect(getSpacingSuggestion('m-3')).toBe('m-md')
    expect(getSpacingSuggestion('gap-x-16')).toBe('gap-x-xl')
    expect(getSpacingSuggestion('p-0.5')).toBe('p-2xs')
  })

  it('provides exact match suggestions with modifiers', () => {
    expect(getSpacingSuggestion('hover:p-4')).toBe('hover:p-base')
    expect(getSpacingSuggestion('dark:gap-2')).toBe('dark:gap-sm')
  })

  it('provides exact match suggestions for negative margins', () => {
    expect(getSpacingSuggestion('-m-4')).toBe('-m-base')
    expect(getSpacingSuggestion('-mx-2')).toBe('-mx-sm')
  })

  it('provides nearest match suggestions for non-exact values', () => {
    const suggestion = getSpacingSuggestion('p-5')
    expect(suggestion).toBeDefined()
    expect(suggestion).toMatch(/^nearest:/)
    expect(suggestion).toContain('p-base')
  })

  it('provides nearest match suggestions for values between tokens', () => {
    const suggestion = getSpacingSuggestion('p-6')
    expect(suggestion).toBeDefined()
    expect(suggestion).toMatch(/^nearest:/)
    // p-6 = 1.5rem, between base (1rem) and lg (2rem)
    expect(suggestion).toContain('p-base')
    expect(suggestion).toContain('p-lg')
  })

  it('returns undefined for non-spacing classes', () => {
    expect(getSpacingSuggestion('bg-primary-500')).toBeUndefined()
    expect(getSpacingSuggestion('flex')).toBeUndefined()
  })
})

describe('getSizingSuggestion', () => {
  it('provides exact match suggestions', () => {
    expect(getSizingSuggestion('h-8')).toBe('h-size-sm')
    expect(getSizingSuggestion('w-10')).toBe('w-size-md')
    expect(getSizingSuggestion('h-6')).toBe('h-size-xs')
    expect(getSizingSuggestion('w-12')).toBe('w-size-lg')
    expect(getSizingSuggestion('h-14')).toBe('h-size-xl')
  })

  it('provides exact match suggestions for min/max', () => {
    expect(getSizingSuggestion('min-h-8')).toBe('min-h-size-sm')
    expect(getSizingSuggestion('max-w-12')).toBe('max-w-size-lg')
  })

  it('provides exact match suggestions with modifiers', () => {
    expect(getSizingSuggestion('hover:h-8')).toBe('hover:h-size-sm')
  })

  it('provides nearest match suggestions for non-exact values', () => {
    const suggestion = getSizingSuggestion('h-9')
    expect(suggestion).toBeDefined()
    expect(suggestion).toMatch(/^nearest:/)
    // h-9 = 2.25rem, between size-sm (2rem) and size-md (2.5rem)
    expect(suggestion).toContain('h-size-sm')
    expect(suggestion).toContain('h-size-md')
  })

  it('returns undefined for non-sizing classes', () => {
    expect(getSizingSuggestion('p-4')).toBeUndefined()
    expect(getSizingSuggestion('flex')).toBeUndefined()
  })
})

describe('SPACING_MAP', () => {
  it('contains all expected token mappings', () => {
    expect(SPACING_MAP.get('0.5')).toEqual({ semantic: '2xs', rem: '0.125rem' })
    expect(SPACING_MAP.get('1')).toEqual({ semantic: 'xs', rem: '0.25rem' })
    expect(SPACING_MAP.get('2')).toEqual({ semantic: 'sm', rem: '0.5rem' })
    expect(SPACING_MAP.get('3')).toEqual({ semantic: 'md', rem: '0.75rem' })
    expect(SPACING_MAP.get('4')).toEqual({ semantic: 'base', rem: '1rem' })
    expect(SPACING_MAP.get('8')).toEqual({ semantic: 'lg', rem: '2rem' })
    expect(SPACING_MAP.get('16')).toEqual({ semantic: 'xl', rem: '4rem' })
    expect(SPACING_MAP.get('32')).toEqual({ semantic: '2xl', rem: '8rem' })
  })
})

describe('SIZING_MAP', () => {
  it('contains all expected token mappings', () => {
    expect(SIZING_MAP.get('6')).toEqual({ semantic: 'size-xs', rem: '1.5rem' })
    expect(SIZING_MAP.get('8')).toEqual({ semantic: 'size-sm', rem: '2rem' })
    expect(SIZING_MAP.get('10')).toEqual({ semantic: 'size-md', rem: '2.5rem' })
    expect(SIZING_MAP.get('12')).toEqual({ semantic: 'size-lg', rem: '3rem' })
    expect(SIZING_MAP.get('14')).toEqual({ semantic: 'size-xl', rem: '3.5rem' })
  })
})
