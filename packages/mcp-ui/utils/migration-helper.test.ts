import { describe, it, expect } from 'vitest'

import {
  analyzeContext,
  getMigrationSuggestion,
  batchMigrate,
  type MigrationContext,
} from './migration-helper'

describe('analyzeContext', () => {
  it('should detect button component type', () => {
    const context = analyzeContext('bg-primary-600', ['btn-primary', 'px-4', 'py-2'], 'button')
    expect(context.componentType).toBe('button')
  })

  it('should detect card component type', () => {
    const context = analyzeContext('bg-neutral-50', ['card', 'rounded-lg', 'shadow-md'], 'div')
    expect(context.componentType).toBe('card')
  })

  it('should detect interactive states', () => {
    const context = analyzeContext(
      'bg-neutral-100',
      ['hover:bg-neutral-200', 'cursor-pointer'],
      'div'
    )
    expect(context.isInteractive).toBe(true)
    expect(context.hasHoverState).toBe(true)
  })

  it('should detect dark mode', () => {
    const context = analyzeContext('dark:bg-neutral-950', ['bg-white', 'text-neutral-900'], 'div')
    expect(context.isDarkMode).toBe(true)
  })

  it('should detect link component from element type', () => {
    const context = analyzeContext('text-primary-600', ['underline', 'hover:text-primary-700'], 'a')
    expect(context.componentType).toBe('link')
  })
})

describe('getMigrationSuggestion', () => {
  it('should suggest interactive-primary for button with primary background', () => {
    const context: MigrationContext = {
      componentType: 'button',
      isInteractive: true,
    }
    const suggestion = getMigrationSuggestion('bg-primary-600', context)

    expect(suggestion?.suggested).toBe('bg-interactive-primary')
    expect(suggestion?.confidence).toBe('high')
    expect(suggestion?.reasoning).toContain('button')
  })

  it('should suggest status-info-muted for non-button primary background', () => {
    const context: MigrationContext = {
      componentType: 'badge',
    }
    const suggestion = getMigrationSuggestion('bg-primary-600', context)

    expect(suggestion?.suggested).toBe('bg-status-info-muted')
    expect(suggestion?.confidence).toBe('medium')
    expect(suggestion?.alternatives).toContain('bg-interactive-primary')
  })

  it('should handle hover states', () => {
    const suggestion = getMigrationSuggestion('hover:bg-neutral-100', {})

    expect(suggestion?.suggested).toBe('hover:bg-interactive-hover')
    expect(suggestion?.confidence).toBe('high')
  })

  it('should suggest surface-muted for card backgrounds', () => {
    const context: MigrationContext = {
      componentType: 'card',
    }
    const suggestion = getMigrationSuggestion('bg-neutral-50', context)

    expect(suggestion?.suggested).toBe('bg-surface-muted')
    expect(suggestion?.confidence).toBe('high')
  })

  it('should handle status colors', () => {
    const errorSuggestion = getMigrationSuggestion('bg-error-50', {})
    expect(errorSuggestion?.suggested).toBe('bg-status-error-muted')

    const successSuggestion = getMigrationSuggestion('bg-success-50', {})
    expect(successSuggestion?.suggested).toBe('bg-status-success-muted')

    const warningSuggestion = getMigrationSuggestion('bg-warning-50', {})
    expect(warningSuggestion?.suggested).toBe('bg-status-warning-muted')
  })

  it('should handle text colors', () => {
    const primaryText = getMigrationSuggestion('text-neutral-900', {})
    expect(primaryText?.suggested).toBe('text-foreground')

    const mutedText = getMigrationSuggestion('text-neutral-500', {})
    expect(mutedText?.suggested).toBe('text-foreground-muted')
  })

  it('should handle link text colors', () => {
    const context: MigrationContext = {
      componentType: 'link',
    }
    const suggestion = getMigrationSuggestion('text-primary-600', context)

    expect(suggestion?.suggested).toBe('text-interactive-accent')
    expect(suggestion?.confidence).toBe('high')
  })

  it('should handle border colors', () => {
    const borderSuggestion = getMigrationSuggestion('border-neutral-200', {})
    expect(borderSuggestion?.suggested).toBe('border-border')

    const mutedBorder = getMigrationSuggestion('border-neutral-100', {})
    expect(mutedBorder?.suggested).toBe('border-border-muted')
  })

  it('should handle focus states', () => {
    const focusBorder = getMigrationSuggestion('focus:border-primary-500', {})
    expect(focusBorder?.suggested).toBe('focus:border-ring')

    const ring = getMigrationSuggestion('ring-primary-500', {})
    expect(ring?.suggested).toBe('ring-ring')
  })

  it('should handle white/black colors', () => {
    const whiteBg = getMigrationSuggestion('bg-white', {})
    expect(whiteBg?.suggested).toBe('bg-surface')

    const whiteText = getMigrationSuggestion('text-white', {})
    expect(whiteText?.suggested).toBe('text-foreground-inverted')
  })

  it('should handle dark mode specific classes', () => {
    const darkBg = getMigrationSuggestion('dark:bg-neutral-950', {})
    expect(darkBg?.suggested).toBe('bg-surface')

    const darkText = getMigrationSuggestion('dark:text-neutral-50', {})
    expect(darkText?.suggested).toBe('text-foreground')
  })

  it('should preserve modifiers when migrating', () => {
    const hoverPrimary = getMigrationSuggestion('hover:bg-primary-600', {
      componentType: 'button',
    })
    expect(hoverPrimary?.suggested).toBe('hover:bg-interactive-primary')

    const focusNeutral = getMigrationSuggestion('focus:border-neutral-200', {})
    expect(focusNeutral?.suggested).toBe('focus:border-border')
  })

  it('should provide generic suggestions for unmapped patterns', () => {
    const lightNeutral = getMigrationSuggestion('bg-neutral-150', {})
    expect(lightNeutral?.suggested).toBe('bg-surface-muted')
    expect(lightNeutral?.confidence).toBe('low')
    expect(lightNeutral?.alternatives).toContain('bg-surface-subtle')

    const darkNeutral = getMigrationSuggestion('bg-neutral-925', {})
    expect(darkNeutral?.suggested).toBe('bg-surface')
    expect(darkNeutral?.confidence).toBe('low')
  })

  it('should return undefined for non-color classes', () => {
    const flexClass = getMigrationSuggestion('flex', {})
    expect(flexClass).toBeUndefined()

    const paddingClass = getMigrationSuggestion('p-4', {})
    expect(paddingClass).toBeUndefined()
  })
})

describe('batchMigrate', () => {
  it('should migrate multiple classes with shared context', () => {
    const classes = [
      'bg-primary-600',
      'text-white',
      'hover:bg-primary-700',
      'px-4',
      'py-2',
      'btn-primary',
    ]

    const results = batchMigrate(classes, 'button')

    expect(results.size).toBe(3) // Only color classes
    expect(results.get('bg-primary-600')?.suggested).toBe('bg-interactive-primary')
    expect(results.get('text-white')?.suggested).toBe('text-foreground-inverted')
    expect(results.get('hover:bg-primary-700')).toBeDefined()
  })

  it('should use element type to determine context', () => {
    const classes = ['text-primary-600', 'underline', 'hover:text-primary-700']
    const results = batchMigrate(classes, 'a')

    expect(results.get('text-primary-600')?.suggested).toBe('text-interactive-accent')
  })

  it('should handle mixed contexts appropriately', () => {
    const classes = ['card', 'bg-neutral-50', 'border-neutral-200', 'text-neutral-900', 'shadow-md']

    const results = batchMigrate(classes, 'div')

    expect(results.get('bg-neutral-50')?.suggested).toBe('bg-surface-muted')
    expect(results.get('border-neutral-200')?.suggested).toBe('border-border')
    expect(results.get('text-neutral-900')?.suggested).toBe('text-foreground')
  })

  it('should handle empty input', () => {
    const results = batchMigrate([], 'div')
    expect(results.size).toBe(0)
  })

  it('should skip non-color classes', () => {
    const classes = ['flex', 'items-center', 'gap-4', 'bg-neutral-100']
    const results = batchMigrate(classes, 'div')

    expect(results.size).toBe(1)
    expect(results.has('bg-neutral-100')).toBe(true)
    expect(results.has('flex')).toBe(false)
  })
})
