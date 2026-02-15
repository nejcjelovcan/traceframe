import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Status</Badge>)
    expect(screen.getByText('Status')).toBeDefined()
  })

  it('applies default variant classes', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge.className).toContain('bg-surface-muted')
    expect(badge.className).toContain('text-foreground')
    expect(badge.className).toContain('border-border')
  })

  it('applies secondary variant classes', () => {
    render(<Badge variant="secondary">Secondary</Badge>)
    const badge = screen.getByText('Secondary')
    expect(badge.className).toContain('bg-surface-subtle')
    expect(badge.className).toContain('text-foreground-muted')
    expect(badge.className).toContain('border-border-muted')
  })

  it('applies info variant classes', () => {
    render(<Badge variant="info">Info</Badge>)
    const badge = screen.getByText('Info')
    expect(badge.className).toContain('bg-status-info-muted')
    expect(badge.className).toContain('text-status-info-foreground')
    expect(badge.className).toContain('border-status-info-border')
  })

  it('applies success variant classes', () => {
    render(<Badge variant="success">Success</Badge>)
    const badge = screen.getByText('Success')
    expect(badge.className).toContain('bg-status-success-muted')
    expect(badge.className).toContain('text-status-success-foreground')
    expect(badge.className).toContain('border-status-success-border')
  })

  it('applies warning variant classes', () => {
    render(<Badge variant="warning">Warning</Badge>)
    const badge = screen.getByText('Warning')
    expect(badge.className).toContain('bg-status-warning-muted')
    expect(badge.className).toContain('text-status-warning-foreground')
    expect(badge.className).toContain('border-status-warning-border')
  })

  it('applies error variant classes', () => {
    render(<Badge variant="error">Error</Badge>)
    const badge = screen.getByText('Error')
    expect(badge.className).toContain('bg-status-error-muted')
    expect(badge.className).toContain('text-status-error-foreground')
    expect(badge.className).toContain('border-status-error-border')
  })

  it('applies outline variant classes', () => {
    render(<Badge variant="outline-success">Outline</Badge>)
    const badge = screen.getByText('Outline')
    expect(badge.className).toContain('border-thick-status-success')
    expect(badge.className).toContain('text-status-success-foreground')
  })

  it('applies accent variant classes', () => {
    render(<Badge variant="accent1">Accent</Badge>)
    const badge = screen.getByText('Accent')
    expect(badge.className).toContain('bg-accent-1-muted')
    expect(badge.className).toContain('text-accent-1-foreground')
    expect(badge.className).toContain('border-accent-1-border')
  })

  it('applies accent4 variant classes', () => {
    render(<Badge variant="accent4">Accent4</Badge>)
    const badge = screen.getByText('Accent4')
    expect(badge.className).toContain('bg-accent-4-muted')
    expect(badge.className).toContain('text-accent-4-foreground')
    expect(badge.className).toContain('border-accent-4-border')
  })

  it('applies outline-accent1 variant classes', () => {
    render(<Badge variant="outline-accent1">Outline Accent 1</Badge>)
    const badge = screen.getByText('Outline Accent 1')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-accent-1')
    expect(badge.className).toContain('text-accent-1-foreground')
  })

  it('applies outline-accent2 variant classes', () => {
    render(<Badge variant="outline-accent2">Outline Accent 2</Badge>)
    const badge = screen.getByText('Outline Accent 2')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-accent-2')
    expect(badge.className).toContain('text-accent-2-foreground')
  })

  it('applies outline-accent3 variant classes', () => {
    render(<Badge variant="outline-accent3">Outline Accent 3</Badge>)
    const badge = screen.getByText('Outline Accent 3')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-accent-3')
    expect(badge.className).toContain('text-accent-3-foreground')
  })

  it('applies outline-accent4 variant classes', () => {
    render(<Badge variant="outline-accent4">Outline Accent 4</Badge>)
    const badge = screen.getByText('Outline Accent 4')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-accent-4')
    expect(badge.className).toContain('text-accent-4-foreground')
  })

  it('applies outline-accent5 variant classes', () => {
    render(<Badge variant="outline-accent5">Outline Accent 5</Badge>)
    const badge = screen.getByText('Outline Accent 5')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-accent-5')
    expect(badge.className).toContain('text-accent-5-foreground')
  })

  it('applies emphasis-info variant classes', () => {
    render(<Badge variant="emphasis-info">Emphasis Info</Badge>)
    const badge = screen.getByText('Emphasis Info')
    expect(badge.className).toContain('bg-gradient-status-info')
    expect(badge.className).toContain('text-foreground-inverted')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-success variant classes', () => {
    render(<Badge variant="emphasis-success">Emphasis Success</Badge>)
    const badge = screen.getByText('Emphasis Success')
    expect(badge.className).toContain('bg-gradient-status-success')
    expect(badge.className).toContain('text-foreground-inverted')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-warning variant classes', () => {
    render(<Badge variant="emphasis-warning">Emphasis Warning</Badge>)
    const badge = screen.getByText('Emphasis Warning')
    expect(badge.className).toContain('bg-gradient-status-warning')
    expect(badge.className).toContain('text-foreground-inverted')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-error variant classes', () => {
    render(<Badge variant="emphasis-error">Emphasis Error</Badge>)
    const badge = screen.getByText('Emphasis Error')
    expect(badge.className).toContain('bg-gradient-status-error')
    expect(badge.className).toContain('text-foreground-inverted')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies xs size classes', () => {
    render(<Badge size="xs">Extra Small</Badge>)
    const badge = screen.getByText('Extra Small')
    expect(badge.className).toContain('text-xs')
    expect(badge.className).toContain('px-xs')
    expect(badge.className).toContain('py-2xs')
    expect(badge.className).toContain('leading-none')
  })

  it('applies sm size classes', () => {
    render(<Badge size="sm">Small</Badge>)
    const badge = screen.getByText('Small')
    expect(badge.className).toContain('text-xs')
    expect(badge.className).toContain('px-sm')
    expect(badge.className).toContain('py-2xs')
  })

  it('applies md size classes', () => {
    render(<Badge size="md">Medium</Badge>)
    const badge = screen.getByText('Medium')
    expect(badge.className).toContain('text-sm')
    expect(badge.className).toContain('px-sm')
    expect(badge.className).toContain('py-xs')
  })

  it('applies lg size classes', () => {
    render(<Badge size="lg">Large</Badge>)
    const badge = screen.getByText('Large')
    expect(badge.className).toContain('text-sm')
    expect(badge.className).toContain('px-md')
    expect(badge.className).toContain('py-xs')
  })

  it('renders icon on the left by default', () => {
    render(<Badge icon="check">Success</Badge>)
    const icon = screen.getByTestId('icon')
    expect(icon).toBeDefined()
    expect(icon.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders icon on the right when specified', () => {
    render(
      <Badge icon="close" iconPosition="right">
        Error
      </Badge>
    )
    const icon = screen.getByTestId('icon')
    expect(icon).toBeDefined()
  })

  it('uses xs icon size for xs and sm badges', () => {
    const { rerender } = render(
      <Badge size="xs" icon="check">
        XS
      </Badge>
    )
    let icon = screen.getByTestId('icon')
    expect(icon.getAttribute('width')).toBe('12')

    rerender(
      <Badge size="sm" icon="check">
        SM
      </Badge>
    )
    icon = screen.getByTestId('icon')
    expect(icon.getAttribute('width')).toBe('12')
  })

  it('uses sm icon size for md and lg badges', () => {
    const { rerender } = render(
      <Badge size="md" icon="check">
        MD
      </Badge>
    )
    let icon = screen.getByTestId('icon')
    expect(icon.getAttribute('width')).toBe('16')

    rerender(
      <Badge size="lg" icon="check">
        LG
      </Badge>
    )
    icon = screen.getByTestId('icon')
    expect(icon.getAttribute('width')).toBe('16')
  })

  it('passes through native span props', () => {
    render(<Badge data-testid="test-badge">Test</Badge>)
    expect(screen.getByTestId('test-badge')).toBeDefined()
  })

  it('merges custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLSpanElement | null }
    render(<Badge ref={ref}>Ref</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })
})
