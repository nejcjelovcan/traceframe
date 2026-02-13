import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Icon } from './Icon'
import { ICON_REGISTRY } from './icons'
import { getAllIconNames, getIconsByCategory, ICON_METADATA, searchIcons } from './metadata'
import { CATEGORY_LABELS, SIZE_MAP, type IconCategory, type IconName } from './types'

describe('Icon', () => {
  it('renders the correct icon', () => {
    render(<Icon name="search" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toBeInTheDocument()
    expect(icon.tagName.toLowerCase()).toBe('svg')
  })

  it('applies size preset correctly', () => {
    render(<Icon name="search" size="lg" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('width', String(SIZE_MAP.lg))
  })

  it('applies custom pixel size correctly', () => {
    render(<Icon name="search" size={42} />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('width', '42')
  })

  it('is aria-hidden by default', () => {
    render(<Icon name="search" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('is accessible when aria-label is provided', () => {
    render(<Icon name="alert-circle" aria-label="Error" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('aria-label', 'Error')
    expect(icon).toHaveAttribute('role', 'img')
  })

  it('applies default stroke of 2', () => {
    render(<Icon name="search" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('stroke-width', '2')
  })

  it('applies lighter stroke for xl size', () => {
    render(<Icon name="search" size="xl" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('stroke-width', '1.5')
  })

  it('applies lighter stroke for 2xl size', () => {
    render(<Icon name="search" size="2xl" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('stroke-width', '1.5')
  })

  it('allows custom stroke override', () => {
    render(<Icon name="search" size="xl" stroke={3} />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('stroke-width', '3')
  })

  it('merges custom className', () => {
    render(<Icon name="search" className="custom-class" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = { current: null }
    render(<Icon name="search" ref={ref} />)
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
  })
})

describe('ICON_METADATA', () => {
  it('has metadata for all registered icons', () => {
    const registryKeys = Object.keys(ICON_REGISTRY) as IconName[]
    const metadataKeys = Object.keys(ICON_METADATA) as IconName[]

    expect(metadataKeys).toEqual(expect.arrayContaining(registryKeys))
    expect(registryKeys).toEqual(expect.arrayContaining(metadataKeys))
  })

  it('each icon has required metadata fields', () => {
    for (const [, meta] of Object.entries(ICON_METADATA)) {
      expect(meta.description).toBeTruthy()
      expect(meta.category).toBeTruthy()
      expect(meta.usage).toBeTruthy()
      expect(CATEGORY_LABELS[meta.category]).toBeTruthy()
    }
  })
})

describe('getIconsByCategory', () => {
  it('returns icons for each category', () => {
    const categories = Object.keys(CATEGORY_LABELS) as IconCategory[]
    for (const category of categories) {
      const icons = getIconsByCategory(category)
      expect(icons.length).toBeGreaterThan(0)
    }
  })

  it('returns correct navigation icons', () => {
    const icons = getIconsByCategory('navigation')
    expect(icons).toContain('chevron-down')
    expect(icons).toContain('arrow-left')
    expect(icons).toHaveLength(6)
  })

  it('returns correct action icons', () => {
    const icons = getIconsByCategory('action')
    expect(icons).toContain('search')
    expect(icons).toContain('close')
    expect(icons).toContain('external-link')
    expect(icons).toHaveLength(6)
  })
})

describe('searchIcons', () => {
  it('finds icons by name', () => {
    expect(searchIcons('search')).toContain('search')
  })

  it('finds icons by alias', () => {
    expect(searchIcons('x')).toContain('close')
  })

  it('finds icons by description', () => {
    expect(searchIcons('magnifying')).toContain('search')
  })

  it('finds icons by usage', () => {
    expect(searchIcons('dropdown')).toContain('chevron-down')
  })

  it('is case insensitive', () => {
    expect(searchIcons('SEARCH')).toContain('search')
  })

  it('returns empty array for no matches', () => {
    expect(searchIcons('xyz123notfound')).toHaveLength(0)
  })

  it('finds dashboard by name and aliases', () => {
    expect(searchIcons('dashboard')).toContain('dashboard')
    expect(searchIcons('home')).toContain('dashboard')
    expect(searchIcons('overview')).toContain('dashboard')
  })
})

describe('getAllIconNames', () => {
  it('returns all 68 icons', () => {
    expect(getAllIconNames()).toHaveLength(68)
  })

  it('includes expected icons', () => {
    const names = getAllIconNames()
    expect(names).toContain('search')
    expect(names).toContain('chevron-down')
    expect(names).toContain('alert-circle')
    expect(names).toContain('package')
    expect(names).toContain('dashboard')
  })
})
