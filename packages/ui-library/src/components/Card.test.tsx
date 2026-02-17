import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card, CardContent, CardFooter, CardHeader, CardProps } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeDefined()
  })

  it('applies outlined variant classes by default', () => {
    render(<Card>Outlined</Card>)
    const card = screen.getByText('Outlined')
    expect(card.className).toContain('bg-surface')
    expect(card.className).toContain('border-line-border')
  })

  it('applies elevated variant classes', () => {
    render(<Card variant="elevated">Elevated</Card>)
    const card = screen.getByText('Elevated')
    expect(card.className).toContain('bg-surface')
    expect(card.className).toContain('border-line-border')
    expect(card.className).toContain('shadow-md')
  })

  it('applies info variant classes', () => {
    render(<Card variant="info">Info</Card>)
    const card = screen.getByText('Info')
    expect(card.className).toContain('bg-status-info-muted')
    expect(card.className).toContain('text-status-info-foreground')
    expect(card.className).toContain('border-line-status-info-border')
  })

  it('applies success variant classes', () => {
    render(<Card variant="success">Success</Card>)
    const card = screen.getByText('Success')
    expect(card.className).toContain('bg-status-success-muted')
    expect(card.className).toContain('text-status-success-foreground')
    expect(card.className).toContain('border-line-status-success-border')
  })

  it('applies warning variant classes', () => {
    render(<Card variant="warning">Warning</Card>)
    const card = screen.getByText('Warning')
    expect(card.className).toContain('bg-status-warning-muted')
    expect(card.className).toContain('text-status-warning-foreground')
    expect(card.className).toContain('border-line-status-warning-border')
  })

  it('applies error variant classes', () => {
    render(<Card variant="error">Error</Card>)
    const card = screen.getByText('Error')
    expect(card.className).toContain('bg-status-error-muted')
    expect(card.className).toContain('text-status-error-foreground')
    expect(card.className).toContain('border-line-status-error-border')
  })

  it('applies accent1 variant classes', () => {
    render(<Card variant="accent1">Accent1</Card>)
    const card = screen.getByText('Accent1')
    expect(card.className).toContain('bg-accent-1-muted')
    expect(card.className).toContain('text-accent-1-foreground')
    expect(card.className).toContain('border-line-accent-1-border')
  })

  it('applies accent2 variant classes', () => {
    render(<Card variant="accent2">Accent2</Card>)
    const card = screen.getByText('Accent2')
    expect(card.className).toContain('bg-accent-2-muted')
    expect(card.className).toContain('text-accent-2-foreground')
    expect(card.className).toContain('border-line-accent-2-border')
  })

  it('applies accent3 variant classes', () => {
    render(<Card variant="accent3">Accent3</Card>)
    const card = screen.getByText('Accent3')
    expect(card.className).toContain('bg-accent-3-muted')
    expect(card.className).toContain('text-accent-3-foreground')
    expect(card.className).toContain('border-line-accent-3-border')
  })

  it('applies accent4 variant classes', () => {
    render(<Card variant="accent4">Accent4</Card>)
    const card = screen.getByText('Accent4')
    expect(card.className).toContain('bg-accent-4-muted')
    expect(card.className).toContain('text-accent-4-foreground')
    expect(card.className).toContain('border-line-accent-4-border')
  })

  it('applies accent5 variant classes', () => {
    render(<Card variant="accent5">Accent5</Card>)
    const card = screen.getByText('Accent5')
    expect(card.className).toContain('bg-accent-5-muted')
    expect(card.className).toContain('text-accent-5-foreground')
    expect(card.className).toContain('border-line-accent-5-border')
  })

  it('works with inverse utility class', () => {
    const { container } = render(
      <div className="inverse">
        <Card>Inverse Context</Card>
      </div>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('inverse')
    // Card itself should have standard classes, inverse mode handled via CSS variables
    const card = screen.getByText('Inverse Context')
    expect(card.className).toContain('bg-surface')
  })

  it('works with nested inverse contexts', () => {
    const { container } = render(
      <div className="inverse">
        <Card>
          Outer inverse
          <div className="inverse">
            <Card>Inner double inverse</Card>
          </div>
        </Card>
      </div>
    )
    const outerWrapper = container.firstChild as HTMLElement
    expect(outerWrapper.className).toContain('inverse')
    const innerCard = screen.getByText('Inner double inverse')
    // Card maintains standard classes, inverse handled via CSS
    expect(innerCard.className).toContain('bg-surface')
  })

  it('applies base classes', () => {
    render(<Card>Base</Card>)
    const card = screen.getByText('Base')
    expect(card.className).toContain('rounded-sm')
    expect(card.className).toContain('border')
  })

  it('passes through native div props', () => {
    render(<Card data-testid="test-card">Test</Card>)
    expect(screen.getByTestId('test-card')).toBeDefined()
  })

  it('merges custom className', () => {
    render(<Card className="custom-class">Custom</Card>)
    const card = screen.getByText('Custom')
    expect(card.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Card ref={ref}>Ref</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toBeDefined()
  })

  it('applies header classes', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    const header = screen.getByTestId('header')
    expect(header.className).toContain('border-b')
    expect(header.className).toContain('border-inherit')
    expect(header.className).toContain('px-base')
    expect(header.className).toContain('py-md')
    expect(header.className).toContain('font-medium')
    expect(header.className).toContain('flex')
    expect(header.className).toContain('items-center')
    expect(header.className).toContain('gap-sm')
  })

  it('passes through native div props', () => {
    render(<CardHeader data-testid="test-header">Test</CardHeader>)
    expect(screen.getByTestId('test-header')).toBeDefined()
  })

  it('merges custom className', () => {
    render(
      <CardHeader data-testid="header" className="custom-class">
        Custom
      </CardHeader>
    )
    const header = screen.getByTestId('header')
    expect(header.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<CardHeader ref={ref}>Ref</CardHeader>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders icon on the left by default', () => {
    render(
      <CardHeader data-testid="header" icon="info-circle">
        With Icon
      </CardHeader>
    )
    const header = screen.getByTestId('header')
    const icon = header.querySelector('svg')
    expect(icon).toBeDefined()
    // Icon should be first child (before text)
    expect(header.firstElementChild?.tagName).toBe('svg')
  })

  it('renders icon on the right when iconPosition is right', () => {
    render(
      <CardHeader data-testid="header" icon="info-circle" iconPosition="right">
        With Icon
      </CardHeader>
    )
    const header = screen.getByTestId('header')
    const icon = header.querySelector('svg')
    expect(icon).toBeDefined()
    // Icon should be last child (after text)
    expect(header.lastElementChild?.tagName).toBe('svg')
  })

  it('sets aria-hidden on icon', () => {
    render(
      <CardHeader data-testid="header" icon="alert-circle">
        With Icon
      </CardHeader>
    )
    const header = screen.getByTestId('header')
    const icon = header.querySelector('svg')
    expect(icon?.getAttribute('aria-hidden')).toBe('true')
  })
})

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toBeDefined()
  })

  it('applies content classes', () => {
    render(<CardContent>Content</CardContent>)
    const content = screen.getByText('Content')
    expect(content.className).toContain('px-base')
    expect(content.className).toContain('py-base')
  })

  it('passes through native div props', () => {
    render(<CardContent data-testid="test-content">Test</CardContent>)
    expect(screen.getByTestId('test-content')).toBeDefined()
  })

  it('merges custom className', () => {
    render(<CardContent className="custom-class">Custom</CardContent>)
    const content = screen.getByText('Custom')
    expect(content.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<CardContent ref={ref}>Ref</CardContent>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeDefined()
  })

  it('applies footer classes', () => {
    render(<CardFooter>Footer</CardFooter>)
    const footer = screen.getByText('Footer')
    expect(footer.className).toContain('flex')
    expect(footer.className).toContain('justify-end')
    expect(footer.className).toContain('border-t')
    expect(footer.className).toContain('border-inherit')
    expect(footer.className).toContain('px-base')
    expect(footer.className).toContain('py-md')
  })

  it('passes through native div props', () => {
    render(<CardFooter data-testid="test-footer">Test</CardFooter>)
    expect(screen.getByTestId('test-footer')).toBeDefined()
  })

  it('merges custom className', () => {
    render(<CardFooter className="custom-class">Custom</CardFooter>)
    const footer = screen.getByText('Custom')
    expect(footer.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<CardFooter ref={ref}>Ref</CardFooter>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('Card composition', () => {
  it('renders all subcomponents together', () => {
    render(
      <Card>
        <CardHeader>Title</CardHeader>
        <CardContent>Body content</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>
    )
    expect(screen.getByText('Title')).toBeDefined()
    expect(screen.getByText('Body content')).toBeDefined()
    expect(screen.getByText('Actions')).toBeDefined()
  })

  it('renders with only content', () => {
    render(
      <Card>
        <CardContent>Just content</CardContent>
      </Card>
    )
    expect(screen.getByText('Just content')).toBeDefined()
  })

  it('renders header and content only', () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(screen.getByText('Header')).toBeDefined()
    expect(screen.getByText('Content')).toBeDefined()
  })
})

describe('Card actionable variant', () => {
  it('applies cursor-pointer when actionable=true', () => {
    render(<Card actionable>Actionable</Card>)
    const card = screen.getByText('Actionable')
    expect(card.className).toContain('cursor-pointer')
  })

  it('applies transition-shadow when actionable=true', () => {
    render(<Card actionable>Actionable</Card>)
    const card = screen.getByText('Actionable')
    expect(card.className).toContain('transition-shadow')
  })

  it('applies shadow-interactive classes when actionable=true', () => {
    render(<Card actionable>Actionable</Card>)
    const card = screen.getByText('Actionable')
    expect(card.className).toContain('shadow-interactive')
    expect(card.className).toContain('hover:shadow-interactive-hover')
    expect(card.className).toContain('active:shadow-interactive-pressed')
  })

  it('does not apply actionable classes when actionable=false', () => {
    render(<Card actionable={false}>Not Actionable</Card>)
    const card = screen.getByText('Not Actionable')
    expect(card.className).not.toContain('cursor-pointer')
    expect(card.className).not.toContain('transition-shadow')
    expect(card.className).not.toContain('shadow-interactive')
  })

  it('works with outlined variant', () => {
    render(
      <Card variant="outlined" actionable>
        Actionable Outlined
      </Card>
    )
    const card = screen.getByText('Actionable Outlined')
    expect(card.className).toContain('bg-surface')
    expect(card.className).toContain('cursor-pointer')
    expect(card.className).toContain('shadow-interactive')
  })

  it('works with elevated variant', () => {
    render(
      <Card variant="elevated" actionable>
        Actionable Elevated
      </Card>
    )
    const card = screen.getByText('Actionable Elevated')
    expect(card.className).toContain('shadow-md')
    expect(card.className).toContain('cursor-pointer')
    expect(card.className).toContain('shadow-interactive')
  })

  it('works with status variants', () => {
    const variants = ['info', 'success', 'warning', 'error'] as CardProps['variant'][]
    variants.forEach((variant) => {
      const { container } = render(
        <Card variant={variant} actionable>
          Actionable {variant}
        </Card>
      )
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('cursor-pointer')
      expect(card.className).toContain('shadow-interactive')
    })
  })

  it('works with accent variants', () => {
    const variants = [
      'accent1',
      'accent2',
      'accent3',
      'accent4',
      'accent5',
    ] as CardProps['variant'][]
    variants.forEach((variant) => {
      const { container } = render(
        <Card variant={variant} actionable>
          Actionable {variant}
        </Card>
      )
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('cursor-pointer')
      expect(card.className).toContain('shadow-interactive')
    })
  })

  it('works with inverse utility class', () => {
    const { container } = render(
      <div className="inverse">
        <Card actionable>Actionable Inverse</Card>
      </div>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('inverse')
    const card = screen.getByText('Actionable Inverse')
    expect(card.className).toContain('cursor-pointer')
    expect(card.className).toContain('shadow-interactive')
    expect(card.className).toContain('bg-surface')
  })

  it('combines actionable with status variant in inverse context', () => {
    const { container } = render(
      <div className="inverse">
        <Card variant="info" actionable>
          Actionable Inverse Info
        </Card>
      </div>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('inverse')
    const card = screen.getByText('Actionable Inverse Info')
    expect(card.className).toContain('cursor-pointer')
    expect(card.className).toContain('shadow-interactive')
    expect(card.className).toContain('bg-status-info-muted')
    expect(card.className).toContain('text-status-info-foreground')
  })
})
