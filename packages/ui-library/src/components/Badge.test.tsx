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
    expect(badge.className).toContain('border-line')
  })

  it('applies primary variant classes', () => {
    render(<Badge variant="primary">Primary</Badge>)
    const badge = screen.getByText('Primary')
    expect(badge.className).toContain('bg-interactive-primary-muted')
    expect(badge.className).toContain('text-foreground')
    expect(badge.className).toContain('border-line-interactive-primary-border')
  })

  it('applies secondary variant classes', () => {
    render(<Badge variant="secondary">Secondary</Badge>)
    const badge = screen.getByText('Secondary')
    expect(badge.className).toContain('bg-interactive-secondary-muted')
    expect(badge.className).toContain('text-foreground')
    expect(badge.className).toContain('border-line-interactive-secondary-border')
  })

  it('applies info variant classes', () => {
    render(<Badge variant="info">Info</Badge>)
    const badge = screen.getByText('Info')
    expect(badge.className).toContain('bg-status-info-muted')
    expect(badge.className).toContain('text-status-info-foreground')
    expect(badge.className).toContain('border-line-status-info-muted-border')
  })

  it('applies success variant classes', () => {
    render(<Badge variant="success">Success</Badge>)
    const badge = screen.getByText('Success')
    expect(badge.className).toContain('bg-status-success-muted')
    expect(badge.className).toContain('text-status-success-foreground')
    expect(badge.className).toContain('border-line-status-success-muted-border')
  })

  it('applies warning variant classes', () => {
    render(<Badge variant="warning">Warning</Badge>)
    const badge = screen.getByText('Warning')
    expect(badge.className).toContain('bg-status-warning-muted')
    expect(badge.className).toContain('text-status-warning-foreground')
    expect(badge.className).toContain('border-line-status-warning-muted-border')
  })

  it('applies error variant classes', () => {
    render(<Badge variant="error">Error</Badge>)
    const badge = screen.getByText('Error')
    expect(badge.className).toContain('bg-status-error-muted')
    expect(badge.className).toContain('text-status-error-foreground')
    expect(badge.className).toContain('border-line-status-error-muted-border')
  })

  it('applies outline-default variant classes', () => {
    render(<Badge variant="outline-default">Outline Default</Badge>)
    const badge = screen.getByText('Outline Default')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-border')
    expect(badge.className).toContain('text-foreground')
  })

  it('applies outline-primary variant classes', () => {
    render(<Badge variant="outline-primary">Outline Primary</Badge>)
    const badge = screen.getByText('Outline Primary')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-interactive-primary-border')
    expect(badge.className).toContain('text-foreground')
  })

  it('applies outline-secondary variant classes', () => {
    render(<Badge variant="outline-secondary">Outline Secondary</Badge>)
    const badge = screen.getByText('Outline Secondary')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-interactive-secondary-border')
    expect(badge.className).toContain('text-foreground')
  })

  it('applies outline variant classes', () => {
    render(<Badge variant="outline-success">Outline</Badge>)
    const badge = screen.getByText('Outline')
    expect(badge.className).toContain('border-thick-status-success')
    expect(badge.className).toContain('text-status-success')
  })

  it('applies accent variant classes', () => {
    render(<Badge variant="accent1">Accent</Badge>)
    const badge = screen.getByText('Accent')
    expect(badge.className).toContain('bg-accent-1-muted')
    expect(badge.className).toContain('text-accent-1-foreground')
    expect(badge.className).toContain('border-line-accent-1-muted-border')
  })

  it('applies accent4 variant classes', () => {
    render(<Badge variant="accent4">Accent4</Badge>)
    const badge = screen.getByText('Accent4')
    expect(badge.className).toContain('bg-accent-4-muted')
    expect(badge.className).toContain('text-accent-4-foreground')
    expect(badge.className).toContain('border-line-accent-4-muted-border')
  })

  it('applies outline-accent1 variant classes', () => {
    render(<Badge variant="outline-accent1">Outline Accent 1</Badge>)
    const badge = screen.getByText('Outline Accent 1')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-accent-1')
    expect(badge.className).toContain('text-accent-1')
  })

  it('applies outline-accent2 variant classes', () => {
    render(<Badge variant="outline-accent2">Outline Accent 2</Badge>)
    const badge = screen.getByText('Outline Accent 2')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-accent-2')
    expect(badge.className).toContain('text-accent-2')
  })

  it('applies outline-accent3 variant classes', () => {
    render(<Badge variant="outline-accent3">Outline Accent 3</Badge>)
    const badge = screen.getByText('Outline Accent 3')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-accent-3')
    expect(badge.className).toContain('text-accent-3')
  })

  it('applies outline-accent4 variant classes', () => {
    render(<Badge variant="outline-accent4">Outline Accent 4</Badge>)
    const badge = screen.getByText('Outline Accent 4')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-accent-4')
    expect(badge.className).toContain('text-accent-4')
  })

  it('applies outline-accent5 variant classes', () => {
    render(<Badge variant="outline-accent5">Outline Accent 5</Badge>)
    const badge = screen.getByText('Outline Accent 5')
    expect(badge.className).toContain('bg-surface')
    expect(badge.className).toContain('border-thick-accent-5')
    expect(badge.className).toContain('text-accent-5')
  })

  it('applies emphasis-default variant classes', () => {
    render(<Badge variant="emphasis-default">Emphasis Default</Badge>)
    const badge = screen.getByText('Emphasis Default')
    expect(badge.className).toContain('bg-gradient-surface')
    expect(badge.className).toContain('text-foreground')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-primary variant classes', () => {
    render(<Badge variant="emphasis-primary">Emphasis Primary</Badge>)
    const badge = screen.getByText('Emphasis Primary')
    expect(badge.className).toContain('bg-gradient-primary')
    expect(badge.className).toContain('text-foreground-filled')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-secondary variant classes', () => {
    render(<Badge variant="emphasis-secondary">Emphasis Secondary</Badge>)
    const badge = screen.getByText('Emphasis Secondary')
    expect(badge.className).toContain('bg-gradient-secondary')
    expect(badge.className).toContain('text-foreground-filled')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-info variant classes', () => {
    render(<Badge variant="emphasis-info">Emphasis Info</Badge>)
    const badge = screen.getByText('Emphasis Info')
    expect(badge.className).toContain('bg-gradient-status-info')
    expect(badge.className).toContain('text-foreground-filled')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-success variant classes', () => {
    render(<Badge variant="emphasis-success">Emphasis Success</Badge>)
    const badge = screen.getByText('Emphasis Success')
    expect(badge.className).toContain('bg-gradient-status-success')
    expect(badge.className).toContain('text-foreground-filled')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-warning variant classes', () => {
    render(<Badge variant="emphasis-warning">Emphasis Warning</Badge>)
    const badge = screen.getByText('Emphasis Warning')
    expect(badge.className).toContain('bg-gradient-status-warning')
    expect(badge.className).toContain('text-foreground-filled')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-error variant classes', () => {
    render(<Badge variant="emphasis-error">Emphasis Error</Badge>)
    const badge = screen.getByText('Emphasis Error')
    expect(badge.className).toContain('bg-gradient-status-error')
    expect(badge.className).toContain('text-foreground-filled')
    // Verify no border classes are applied
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-accent1 variant classes', () => {
    render(<Badge variant="emphasis-accent1">Emphasis Accent 1</Badge>)
    const badge = screen.getByText('Emphasis Accent 1')
    expect(badge.className).toContain('bg-gradient-accent-1')
    expect(badge.className).toContain('text-foreground-filled')
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-accent2 variant classes', () => {
    render(<Badge variant="emphasis-accent2">Emphasis Accent 2</Badge>)
    const badge = screen.getByText('Emphasis Accent 2')
    expect(badge.className).toContain('bg-gradient-accent-2')
    expect(badge.className).toContain('text-foreground-filled')
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-accent3 variant classes', () => {
    render(<Badge variant="emphasis-accent3">Emphasis Accent 3</Badge>)
    const badge = screen.getByText('Emphasis Accent 3')
    expect(badge.className).toContain('bg-gradient-accent-3')
    expect(badge.className).toContain('text-foreground-filled')
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-accent4 variant classes', () => {
    render(<Badge variant="emphasis-accent4">Emphasis Accent 4</Badge>)
    const badge = screen.getByText('Emphasis Accent 4')
    expect(badge.className).toContain('bg-gradient-accent-4')
    expect(badge.className).toContain('text-foreground-filled')
    expect(badge.className).not.toMatch(/border-/)
  })

  it('applies emphasis-accent5 variant classes', () => {
    render(<Badge variant="emphasis-accent5">Emphasis Accent 5</Badge>)
    const badge = screen.getByText('Emphasis Accent 5')
    expect(badge.className).toContain('bg-gradient-accent-5')
    expect(badge.className).toContain('text-foreground-filled')
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

  describe('compact mode', () => {
    it('renders icon-only badge in compact mode with icon', () => {
      render(
        <Badge compact icon="check" variant="success">
          This text should not appear
        </Badge>
      )
      const icon = screen.getByTestId('icon')
      expect(icon).toBeDefined()
      // Children should not be rendered
      expect(screen.queryByText('This text should not appear')).toBeNull()
    })

    it('renders dot-only badge in compact mode without icon', () => {
      render(<Badge compact variant="error" data-testid="compact-dot" />)
      const dot = screen.getByTestId('compact-dot')
      expect(dot).toBeDefined()
      // Should have rounded-full and size classes
      expect(dot.className).toContain('rounded-full')
      expect(dot.className).toContain('w-2.5') // md size default
      expect(dot.className).toContain('h-2.5')
    })

    it('applies correct padding for compact mode with icon', () => {
      const { rerender } = render(
        <Badge compact icon="check" size="xs" data-testid="compact-badge">
          Text
        </Badge>
      )
      let badge = screen.getByTestId('compact-badge')
      expect(badge.className).toContain('p-2xs')

      rerender(
        <Badge compact icon="check" size="sm" data-testid="compact-badge">
          Text
        </Badge>
      )
      badge = screen.getByTestId('compact-badge')
      expect(badge.className).toContain('p-2xs')

      rerender(
        <Badge compact icon="check" size="md" data-testid="compact-badge">
          Text
        </Badge>
      )
      badge = screen.getByTestId('compact-badge')
      expect(badge.className).toContain('p-xs')

      rerender(
        <Badge compact icon="check" size="lg" data-testid="compact-badge">
          Text
        </Badge>
      )
      badge = screen.getByTestId('compact-badge')
      expect(badge.className).toContain('p-xs')
    })

    it('applies correct dot sizes for each size variant', () => {
      const { rerender } = render(<Badge compact size="xs" data-testid="compact-dot" />)
      let dot = screen.getByTestId('compact-dot')
      expect(dot.className).toContain('w-1.5')
      expect(dot.className).toContain('h-1.5')

      rerender(<Badge compact size="sm" data-testid="compact-dot" />)
      dot = screen.getByTestId('compact-dot')
      expect(dot.className).toContain('w-2')
      expect(dot.className).toContain('h-2')

      rerender(<Badge compact size="md" data-testid="compact-dot" />)
      dot = screen.getByTestId('compact-dot')
      expect(dot.className).toContain('w-2.5')
      expect(dot.className).toContain('h-2.5')

      rerender(<Badge compact size="lg" data-testid="compact-dot" />)
      dot = screen.getByTestId('compact-dot')
      expect(dot.className).toContain('w-3')
      expect(dot.className).toContain('h-3')
    })

    it('ignores children when compact is true', () => {
      render(
        <Badge compact icon="check">
          This should not render
        </Badge>
      )
      expect(screen.queryByText('This should not render')).toBeNull()
      expect(screen.getByTestId('icon')).toBeDefined()
    })

    it('works with all variants in compact mode', () => {
      const variants = [
        'success',
        'error',
        'warning',
        'info',
        'accent1',
        'emphasis-success',
      ] as const

      variants.forEach((variant) => {
        const { unmount } = render(
          <Badge compact variant={variant} icon="check" data-testid={`compact-${variant}`} />
        )
        const badge = screen.getByTestId(`compact-${variant}`)
        expect(badge).toBeDefined()
        unmount()
      })
    })

    it('applies aria-label to dot-only badges', () => {
      render(<Badge compact variant="error" aria-label="Error status" />)
      const dot = screen.getByLabelText('Error status')
      expect(dot).toBeDefined()
    })

    it('applies default aria-label when not provided for dot-only badges', () => {
      render(<Badge compact variant="error" data-testid="dot" />)
      const dot = screen.getByTestId('dot')
      expect(dot.getAttribute('aria-label')).toBe('Status indicator')
    })
  })
})
