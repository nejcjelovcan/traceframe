import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title correctly', () => {
    render(<EmptyState title="No results" />)
    expect(screen.getByText('No results')).toBeDefined()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="No results" description="Try adjusting your search" />)
    expect(screen.getByText('No results')).toBeDefined()
    expect(screen.getByText('Try adjusting your search')).toBeDefined()
  })

  it('renders icon when provided with IconName', () => {
    render(<EmptyState title="No results" icon="search" />)
    // Icon component renders an SVG
    const container = screen.getByText('No results').parentElement
    expect(container?.querySelector('svg')).toBeDefined()
  })

  it('renders customIcon when provided', () => {
    render(<EmptyState title="No results" customIcon={<span data-testid="test-icon">🔍</span>} />)
    expect(screen.getByTestId('test-icon')).toBeDefined()
  })

  it('prefers icon over customIcon when both provided', () => {
    render(
      <EmptyState
        title="No results"
        icon="search"
        customIcon={<span data-testid="custom-icon">🔍</span>}
      />
    )
    // Icon should render (SVG), customIcon should not
    const container = screen.getByText('No results').parentElement
    expect(container?.querySelector('svg')).toBeDefined()
    expect(screen.queryByTestId('custom-icon')).toBeNull()
  })

  it('renders action when provided', () => {
    render(<EmptyState title="No results" action={<button>Run Scan</button>} />)
    expect(screen.getByRole('button', { name: 'Run Scan' })).toBeDefined()
  })

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="No results" />)
    const paragraph = container.querySelector('p')
    expect(paragraph).toBeNull()
  })

  it('does not render icon container when neither icon nor customIcon provided', () => {
    const { container } = render(<EmptyState title="No results" />)
    // Icon container has mb-base class
    const iconContainer = container.querySelector('.mb-base')
    expect(iconContainer).toBeNull()
  })

  it('does not render action container when not provided', () => {
    const { container } = render(<EmptyState title="No results" />)
    // Action container has mt-base class (but h3 does not)
    const actionContainers = container.querySelectorAll('.mt-base')
    expect(actionContainers.length).toBe(0)
  })

  it('merges custom className', () => {
    render(<EmptyState title="No results" className="custom-class" />)
    const element = screen.getByText('No results').parentElement
    expect(element?.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<EmptyState ref={ref} title="No results" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('passes through native div props', () => {
    render(<EmptyState title="No results" data-testid="empty-state" />)
    expect(screen.getByTestId('empty-state')).toBeDefined()
  })

  it('renders all props together', () => {
    render(
      <EmptyState
        title="No packages found"
        description="Try adjusting your filters"
        icon="package"
        action={<button>Clear Filters</button>}
      />
    )
    expect(screen.getByText('No packages found')).toBeDefined()
    expect(screen.getByText('Try adjusting your filters')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Clear Filters' })).toBeDefined()
  })

  describe('size variants', () => {
    it('applies sm size classes', () => {
      const { container } = render(<EmptyState title="No results" size="sm" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('py-lg')
      const title = screen.getByText('No results')
      expect(title.className).toContain('text-base')
    })

    it('applies md size classes (default)', () => {
      const { container } = render(<EmptyState title="No results" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('py-xl')
      const title = screen.getByText('No results')
      expect(title.className).toContain('text-lg')
    })

    it('applies lg size classes', () => {
      const { container } = render(<EmptyState title="No results" size="lg" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('py-2xl')
      const title = screen.getByText('No results')
      expect(title.className).toContain('text-xl')
    })

    it('applies sm description classes', () => {
      render(<EmptyState title="No results" description="Help text" size="sm" />)
      const description = screen.getByText('Help text')
      expect(description.className).toContain('text-xs')
    })

    it('applies md description classes', () => {
      render(<EmptyState title="No results" description="Help text" size="md" />)
      const description = screen.getByText('Help text')
      expect(description.className).toContain('text-sm')
    })

    it('applies lg description classes', () => {
      render(<EmptyState title="No results" description="Help text" size="lg" />)
      const description = screen.getByText('Help text')
      expect(description.className).toContain('text-base')
    })
  })

  describe('backward compatibility', () => {
    it('renders without size prop (uses default md)', () => {
      const { container } = render(<EmptyState title="No results" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('py-xl')
    })

    it('supports customIcon for ReactNode icons (replaces old icon prop usage)', () => {
      render(<EmptyState title="No results" customIcon={<span data-testid="emoji">📦</span>} />)
      expect(screen.getByTestId('emoji')).toBeDefined()
    })
  })
})
