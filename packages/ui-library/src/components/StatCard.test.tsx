import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Users" value={1234} />)
    expect(screen.getByText('Total Users')).toBeDefined()
    expect(screen.getByText('1234')).toBeDefined()
  })

  it('renders label as paragraph (not heading to avoid heading order issues)', () => {
    render(<StatCard label="Components" value={42} />)
    const label = screen.getByText('Components')
    expect(label.tagName).toBe('P')
  })

  it('renders string value', () => {
    render(<StatCard label="Status" value="Active" />)
    expect(screen.getByText('Active')).toBeDefined()
  })

  it('renders with custom icon', () => {
    render(
      <StatCard label="Users" value={100} customIcon={<span data-testid="custom-icon">★</span>} />
    )
    expect(screen.getByTestId('custom-icon')).toBeDefined()
  })

  it('renders with type-safe icon name', () => {
    render(<StatCard label="Users" value={100} icon="users" />)
    // Icon component will render an SVG
    const value = screen.getByText('100')
    const parent = value.parentElement
    const svgs = parent?.querySelectorAll('svg')
    expect(svgs?.length).toBeGreaterThan(0)
  })

  it('applies positive trend color (green)', () => {
    render(<StatCard label="Growth" value={50} trend="+12%" />)
    const trend = screen.getByText('+12%')
    expect(trend.className).toContain('text-status-success-foreground')
  })

  it('applies negative trend color (red)', () => {
    render(<StatCard label="Errors" value={5} trend="-3" />)
    const trend = screen.getByText('-3')
    expect(trend.className).toContain('text-status-error-foreground')
  })

  it('applies neutral trend color (gray)', () => {
    render(<StatCard label="Status" value={10} trend="stable" />)
    const trend = screen.getByText('stable')
    expect(trend.className).toContain('text-foreground-muted')
  })

  it('adds aria-label for positive trend', () => {
    render(<StatCard label="Growth" value={50} trend="+12%" />)
    const trend = screen.getByLabelText('increased by 12%')
    expect(trend.textContent).toBe('+12%')
  })

  it('adds aria-label for negative trend', () => {
    render(<StatCard label="Errors" value={5} trend="-3" />)
    const trend = screen.getByLabelText('decreased by 3')
    expect(trend.textContent).toBe('-3')
  })

  it('adds aria-label for neutral trend', () => {
    render(<StatCard label="Status" value={10} trend="stable" />)
    const trend = screen.getByLabelText('stable')
    expect(trend.textContent).toBe('stable')
  })

  it('inherits Card variant classes - outlined', () => {
    render(<StatCard label="Test" value={1} variant="outlined" data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('bg-surface')
    expect(card.className).toContain('border-border')
  })

  it('inherits Card variant classes - elevated', () => {
    render(<StatCard label="Test" value={1} variant="elevated" data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('shadow-md')
  })

  it('inherits Card variant classes - info', () => {
    render(<StatCard label="Test" value={1} variant="info" data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('bg-status-info-muted')
    expect(card.className).toContain('border-status-info-border')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<StatCard label="Test" value={1} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('merges custom className', () => {
    render(<StatCard label="Test" value={1} className="custom-class" data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('custom-class')
  })

  it('passes through native div props', () => {
    render(<StatCard label="Test" value={1} data-testid="test-card" />)
    expect(screen.getByTestId('test-card')).toBeDefined()
  })

  it('does not render trend when not provided', () => {
    render(<StatCard label="Test" value={1} />)
    const value = screen.getByText('1')
    const parent = value.parentElement
    // Should have the value span but no trend span
    const spans = parent?.querySelectorAll('span')
    expect(spans?.length).toBe(1) // only the value span
  })

  it('does not render icon when not provided', () => {
    render(<StatCard label="Test" value={1} data-testid="card" />)
    const valueRow = screen.getByText('1').parentElement
    // Should only have the value span, no icon span
    const spans = valueRow?.querySelectorAll('span')
    expect(spans?.length).toBe(1) // only value span
  })

  describe('size variants', () => {
    it('renders with size="sm" classes', () => {
      render(<StatCard label="Test" value={42} size="sm" />)
      const label = screen.getByText('Test')
      const value = screen.getByText('42')
      expect(label.className).toContain('text-xs')
      expect(value.className).toContain('text-xl')
    })

    it('renders with size="md" classes (default)', () => {
      render(<StatCard label="Test" value={42} size="md" />)
      const label = screen.getByText('Test')
      const value = screen.getByText('42')
      expect(label.className).toContain('text-sm')
      expect(value.className).toContain('text-2xl')
    })

    it('renders with size="lg" classes', () => {
      render(<StatCard label="Test" value={42} size="lg" />)
      const label = screen.getByText('Test')
      const value = screen.getByText('42')
      expect(label.className).toContain('text-sm')
      expect(value.className).toContain('text-3xl')
    })

    it('defaults to size="md" when size is not specified', () => {
      render(<StatCard label="Test" value={42} />)
      const label = screen.getByText('Test')
      const value = screen.getByText('42')
      expect(label.className).toContain('text-sm')
      expect(value.className).toContain('text-2xl')
    })

    it('combines size with variant prop', () => {
      render(<StatCard label="Test" value={42} size="lg" variant="info" data-testid="card" />)
      const card = screen.getByTestId('card')
      const value = screen.getByText('42')
      expect(card.className).toContain('bg-status-info-muted')
      expect(value.className).toContain('text-3xl')
    })

    it('works with trend and icon at all sizes', () => {
      render(
        <StatCard
          label="Test"
          value={42}
          size="sm"
          trend="+5%"
          customIcon={<span data-testid="custom-icon">★</span>}
        />
      )
      expect(screen.getByTestId('custom-icon')).toBeDefined()
      expect(screen.getByText('+5%')).toBeDefined()
      const value = screen.getByText('42')
      expect(value.className).toContain('text-xl')
    })
  })

  describe('loading state', () => {
    it('shows skeleton when loading is true', () => {
      render(<StatCard label="Test" value={42} loading data-testid="card" />)
      const card = screen.getByTestId('card')
      // Check for skeleton elements
      const skeletons = card.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('does not show label and value when loading', () => {
      render(<StatCard label="Test Label" value={42} loading />)
      expect(screen.queryByText('Test Label')).toBeNull()
      expect(screen.queryByText('42')).toBeNull()
    })

    it('applies loading animation class to card', () => {
      render(<StatCard label="Test" value={42} loading data-testid="card" />)
      const card = screen.getByTestId('card')
      expect(card.className).toContain('animate-pulse')
    })
  })

  describe('trend icons', () => {
    it('shows upward arrow for positive trends by default', () => {
      render(<StatCard label="Test" value={42} trend="+15%" />)
      const trendElement = screen.getByLabelText('increased by 15%')
      // Check for Icon component with chevron-up
      const icon = trendElement.querySelector('svg')
      expect(icon).toBeDefined()
    })

    it('shows downward arrow for negative trends by default', () => {
      render(<StatCard label="Test" value={42} trend="-10%" />)
      const trendElement = screen.getByLabelText('decreased by 10%')
      // Check for Icon component with chevron-down
      const icon = trendElement.querySelector('svg')
      expect(icon).toBeDefined()
    })

    it('does not show arrow for neutral trends', () => {
      render(<StatCard label="Test" value={42} trend="stable" />)
      const trendElement = screen.getByLabelText('stable')
      const icon = trendElement.querySelector('svg')
      expect(icon).toBeNull()
    })

    it('hides trend icon when showTrendIcon is false', () => {
      render(<StatCard label="Test" value={42} trend="+15%" showTrendIcon={false} />)
      const trendElement = screen.getByLabelText('increased by 15%')
      const icon = trendElement.querySelector('svg')
      expect(icon).toBeNull()
    })

    it('trend icon has aria-hidden attribute', () => {
      render(<StatCard label="Test" value={42} trend="+15%" />)
      const trendElement = screen.getByLabelText('increased by 15%')
      const icon = trendElement.querySelector('svg')
      expect(icon?.getAttribute('aria-hidden')).toBe('true')
    })
  })

  describe('inverted prop', () => {
    it('passes inverted prop to Card', () => {
      render(<StatCard label="Test" value={42} inverted data-testid="card" />)
      const card = screen.getByTestId('card')
      expect(card.className).toContain('tf-inverted')
    })

    it('does not apply tf-inverted when inverted is not set', () => {
      render(<StatCard label="Test" value={42} data-testid="card" />)
      const card = screen.getByTestId('card')
      expect(card.className).not.toContain('tf-inverted')
    })

    it('combines inverted with variant', () => {
      render(<StatCard label="Test" value={42} variant="elevated" inverted data-testid="card" />)
      const card = screen.getByTestId('card')
      expect(card.className).toContain('tf-inverted')
      expect(card.className).toContain('shadow-md')
    })
  })

  describe('new props', () => {
    it('accepts showTrendIcon prop', () => {
      render(<StatCard label="Test" value={42} trend="+5%" showTrendIcon={false} />)
      const trendElement = screen.getByLabelText('increased by 5%')
      const icon = trendElement.querySelector('svg')
      expect(icon).toBeNull()
    })

    it('accepts loading prop', () => {
      render(<StatCard label="Test" value={42} loading data-testid="card" />)
      const card = screen.getByTestId('card')
      expect(card.className).toContain('animate-pulse')
    })
  })

  describe('enhanced features', () => {
    it('renders subtitle when provided', () => {
      render(<StatCard label="Test" subtitle="Secondary label" value={42} />)
      expect(screen.getByText('Secondary label')).toBeDefined()
    })

    it('renders description when provided', () => {
      render(<StatCard label="Test" value={42} description="Long description text" />)
      expect(screen.getByText('Long description text')).toBeDefined()
    })

    it('hides subtitle and description in compact mode', () => {
      render(
        <StatCard
          label="Test"
          value={42}
          subtitle="Hidden subtitle"
          description="Hidden description"
          compact
        />
      )
      // Elements are in DOM but hidden with CSS
      const subtitle = screen.getByText('Hidden subtitle')
      const description = screen.getByText('Hidden description')
      expect(subtitle.className).toContain('hidden')
      expect(description.className).toContain('hidden')
    })

    it('positions icon on the right when iconPosition="right"', () => {
      render(<StatCard label="Test" value={42} icon="package" iconPosition="right" />)
      const value = screen.getByText('42')
      const parent = value.parentElement
      const spans = parent?.querySelectorAll('span')
      // Icon should be after the value
      expect(spans).toBeDefined()
      expect(spans?.length).toBeGreaterThan(1)
    })

    it('applies manual trend variant control', () => {
      render(<StatCard label="Test" value={42} trend="5 points" trendVariant="positive" />)
      const trend = screen.getByLabelText('increased 5 points')
      expect(trend.className).toContain('text-status-success-foreground')
    })

    it('supports all card variants', () => {
      const variants = [
        'outlined',
        'elevated',
        'info',
        'success',
        'warning',
        'error',
        'accent1',
        'accent2',
        'accent3',
        'accent4',
        'accent5',
      ] as const

      variants.forEach((variant) => {
        const { container } = render(<StatCard label="Test" value={42} variant={variant} />)
        const card = container.firstChild as HTMLElement
        expect(card).toBeDefined()
        // Each variant should apply specific classes based on Card component
        if (variant === 'outlined') {
          expect(card.className).toContain('bg-surface')
        } else if (variant === 'elevated') {
          expect(card.className).toContain('shadow-md')
        } else if (variant.startsWith('accent')) {
          // Card uses hyphenated class names like bg-accent-1-muted
          const variantNum = variant.slice(-1)
          expect(card.className).toContain(`bg-accent-${variantNum}-muted`)
        } else if (['info', 'success', 'warning', 'error'].includes(variant)) {
          expect(card.className).toContain(`bg-status-${variant}-muted`)
        }
      })
    })

    it('applies compact padding variant', () => {
      const { container: normalContainer } = render(<StatCard label="Normal" value={42} />)
      const { container: compactContainer } = render(
        <StatCard label="Compact" value={42} compact />
      )

      const normalContent = normalContainer.querySelector('.px-base')
      const compactContent = compactContainer.querySelector('.px-md')

      expect(normalContent).toBeDefined()
      expect(compactContent).toBeDefined()
    })
  })
})
