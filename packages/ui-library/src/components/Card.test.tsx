import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

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

  it('applies primary variant classes', () => {
    render(<Card variant="primary">Primary</Card>)
    const card = screen.getByText('Primary')
    expect(card.className).toContain('bg-gradient-primary-light')
    expect(card.className).toContain('text-foreground')
    expect(card.className).toContain('border-line-interactive-primary-border')
  })

  it('applies secondary variant classes', () => {
    render(<Card variant="secondary">Secondary</Card>)
    const card = screen.getByText('Secondary')
    expect(card.className).toContain('bg-gradient-secondary-light')
    expect(card.className).toContain('text-foreground')
    expect(card.className).toContain('border-line-interactive-secondary-border')
  })

  it('applies info variant classes', () => {
    render(<Card variant="info">Info</Card>)
    const card = screen.getByText('Info')
    expect(card.className).toContain('bg-gradient-status-info-light')
    expect(card.className).toContain('text-status-info-foreground')
    expect(card.className).toContain('border-line-status-info-border')
  })

  it('applies success variant classes', () => {
    render(<Card variant="success">Success</Card>)
    const card = screen.getByText('Success')
    expect(card.className).toContain('bg-gradient-status-success-light')
    expect(card.className).toContain('text-status-success-foreground')
    expect(card.className).toContain('border-line-status-success-border')
  })

  it('applies warning variant classes', () => {
    render(<Card variant="warning">Warning</Card>)
    const card = screen.getByText('Warning')
    expect(card.className).toContain('bg-gradient-status-warning-light')
    expect(card.className).toContain('text-status-warning-foreground')
    expect(card.className).toContain('border-line-status-warning-border')
  })

  it('applies error variant classes', () => {
    render(<Card variant="error">Error</Card>)
    const card = screen.getByText('Error')
    expect(card.className).toContain('bg-gradient-status-error-light')
    expect(card.className).toContain('text-status-error-foreground')
    expect(card.className).toContain('border-line-status-error-border')
  })

  it('applies accent1 variant classes', () => {
    render(<Card variant="accent1">Accent1</Card>)
    const card = screen.getByText('Accent1')
    expect(card.className).toContain('bg-gradient-accent-1-light')
    expect(card.className).toContain('text-accent-1-foreground')
    expect(card.className).toContain('border-line-accent-1-border')
  })

  it('applies accent2 variant classes', () => {
    render(<Card variant="accent2">Accent2</Card>)
    const card = screen.getByText('Accent2')
    expect(card.className).toContain('bg-gradient-accent-2-light')
    expect(card.className).toContain('text-accent-2-foreground')
    expect(card.className).toContain('border-line-accent-2-border')
  })

  it('applies accent3 variant classes', () => {
    render(<Card variant="accent3">Accent3</Card>)
    const card = screen.getByText('Accent3')
    expect(card.className).toContain('bg-gradient-accent-3-light')
    expect(card.className).toContain('text-accent-3-foreground')
    expect(card.className).toContain('border-line-accent-3-border')
  })

  it('applies accent4 variant classes', () => {
    render(<Card variant="accent4">Accent4</Card>)
    const card = screen.getByText('Accent4')
    expect(card.className).toContain('bg-gradient-accent-4-light')
    expect(card.className).toContain('text-accent-4-foreground')
    expect(card.className).toContain('border-line-accent-4-border')
  })

  it('applies accent5 variant classes', () => {
    render(<Card variant="accent5">Accent5</Card>)
    const card = screen.getByText('Accent5')
    expect(card.className).toContain('bg-gradient-accent-5-light')
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

  it('renders rightContent', () => {
    render(
      <CardHeader data-testid="header" rightContent={<span data-testid="right">v1.2.3</span>}>
        Package Version
      </CardHeader>
    )
    expect(screen.getByTestId('right')).toBeDefined()
    expect(screen.getByText('v1.2.3')).toBeDefined()
  })

  it('renders rightContent as any React node', () => {
    render(
      <CardHeader data-testid="header" rightContent={<a href="#">View all</a>}>
        Recent Activity
      </CardHeader>
    )
    expect(screen.getByText('View all')).toBeDefined()
  })

  it('rightContent does not shrink', () => {
    render(
      <CardHeader data-testid="header" rightContent={<span data-testid="right">Status</span>}>
        Header
      </CardHeader>
    )
    const rightWrapper = screen.getByTestId('right').parentElement
    expect(rightWrapper?.className).toContain('shrink-0')
  })

  it('truncates text by default', () => {
    render(<CardHeader data-testid="header">Very Long Header Text That Should Truncate</CardHeader>)
    const header = screen.getByTestId('header')
    const titleSpan = header.querySelector('span')
    expect(titleSpan?.className).toContain('truncate')
    expect(titleSpan?.className).toContain('min-w-0')
  })

  it('sets title attribute on truncated string children', () => {
    render(<CardHeader data-testid="header">Long Title Text</CardHeader>)
    const header = screen.getByTestId('header')
    const titleSpan = header.querySelector('span')
    expect(titleSpan?.getAttribute('title')).toBe('Long Title Text')
  })

  it('does not set title attribute when children is not a string', () => {
    render(
      <CardHeader data-testid="header">
        <em>Complex children</em>
      </CardHeader>
    )
    const header = screen.getByTestId('header')
    const titleSpan = header.querySelector(':scope > span')
    expect(titleSpan?.hasAttribute('title')).toBe(false)
  })

  it('does not truncate when truncate is false', () => {
    render(
      <CardHeader data-testid="header" truncate={false}>
        Full Header Text
      </CardHeader>
    )
    const header = screen.getByTestId('header')
    const titleSpan = header.querySelector('span')
    expect(titleSpan?.className).not.toContain('truncate')
    expect(titleSpan?.hasAttribute('title')).toBe(false)
  })

  it('renders icon, title, rightContent, and chevron in correct order in accordion mode', () => {
    render(
      <Card accordion>
        <CardHeader icon="settings" rightContent={<span data-testid="right">Extra</span>}>
          Title
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )
    const button = screen.getByRole('button')
    const children = Array.from(button.children)
    // Order: icon (svg), title (span), rightContent wrapper (div), chevron (svg)
    expect(children[0]?.tagName).toBe('svg') // left icon
    expect(children[1]?.tagName).toBe('SPAN') // title
    expect(children[2]?.tagName).toBe('DIV') // rightContent wrapper
    expect(children[3]?.tagName).toBe('svg') // chevron
  })

  it('icon has shrink-0 class', () => {
    render(
      <CardHeader data-testid="header" icon="info-circle">
        With Icon
      </CardHeader>
    )
    const header = screen.getByTestId('header')
    const icon = header.querySelector('svg')
    expect(icon?.getAttribute('class')).toContain('shrink-0')
  })

  it('works with rightContent in sm size', () => {
    render(
      <Card size="sm">
        <CardHeader data-testid="header" rightContent={<span>Status</span>}>
          Small Header
        </CardHeader>
      </Card>
    )
    const header = screen.getByTestId('header')
    expect(header.className).toContain('px-sm')
    expect(header.className).toContain('py-xs')
    expect(screen.getByText('Status')).toBeDefined()
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
  const user = userEvent.setup()

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

  it('defaults to gradient variant when actionable and no variant set', () => {
    render(<Card actionable>Actionable</Card>)
    const card = screen.getByText('Actionable')
    expect(card.className).toContain('bg-gradient-surface-light')
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
    expect(card.className).toContain('bg-gradient-surface-light')
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
    expect(card.className).toContain('bg-gradient-status-info-light')
    expect(card.className).toContain('text-status-info-foreground')
  })

  it('adds keyboard accessibility for actionable cards', () => {
    render(<Card actionable>Accessible</Card>)
    const card = screen.getByText('Accessible')
    expect(card.getAttribute('tabIndex')).toBe('0')
    expect(card.getAttribute('role')).toBe('button')
    expect(card.getAttribute('aria-pressed')).toBe('false')
  })

  it('applies focus ring styles for actionable cards', () => {
    render(<Card actionable>Focusable</Card>)
    const card = screen.getByRole('button')
    expect(card.className).toContain('focus-visible:outline-hidden')
    expect(card.className).toContain('focus-visible:ring-2')
    expect(card.className).toContain('focus-visible:ring-ring')
    expect(card.className).toContain('focus-visible:ring-offset-2')
    expect(card.className).toContain('focus-visible:ring-offset-surface')
  })

  it('triggers onClick when Enter key is pressed', async () => {
    const onClick = vi.fn()
    render(
      <Card actionable onClick={onClick}>
        Clickable
      </Card>
    )
    const card = screen.getByRole('button')

    card.focus()
    await user.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('triggers onClick when Space key is pressed', async () => {
    const onClick = vi.fn()
    render(
      <Card actionable onClick={onClick}>
        Clickable
      </Card>
    )
    const card = screen.getByRole('button')

    card.focus()
    await user.keyboard(' ')

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('preserves custom onKeyDown handler', async () => {
    const onClick = vi.fn()
    const onKeyDown = vi.fn()
    render(
      <Card actionable onClick={onClick} onKeyDown={onKeyDown}>
        Clickable
      </Card>
    )
    const card = screen.getByRole('button')

    card.focus()
    await user.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalled()
    expect(onKeyDown).toHaveBeenCalled()
  })

  it('does not crash when Enter/Space pressed without onClick', async () => {
    render(<Card actionable>No Handler</Card>)
    const card = screen.getByRole('button')

    card.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')

    // Should not throw
    expect(card).toBeDefined()
  })

  it('does not trigger onClick for other keys', async () => {
    const onClick = vi.fn()
    render(
      <Card actionable onClick={onClick}>
        Clickable
      </Card>
    )
    const card = screen.getByRole('button')

    card.focus()
    await user.keyboard('{Escape}')
    await user.keyboard('a')
    await user.keyboard('{Tab}')

    expect(onClick).not.toHaveBeenCalled()
  })

  it('respects custom tabIndex prop', () => {
    render(
      <Card actionable tabIndex={-1}>
        Custom TabIndex
      </Card>
    )
    const card = screen.getByRole('button')
    expect(card.getAttribute('tabIndex')).toBe('-1')
  })

  it('respects custom role prop', () => {
    render(
      <Card actionable role="article">
        Custom Role
      </Card>
    )
    const card = screen.getByRole('article')
    expect(card).toBeDefined()
  })

  it('respects custom aria-pressed prop', () => {
    render(
      <Card actionable aria-pressed="true">
        Custom Pressed
      </Card>
    )
    const card = screen.getByRole('button')
    expect(card.getAttribute('aria-pressed')).toBe('true')
  })

  it('focus ring works with all card variants', () => {
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
    ] as CardProps['variant'][]

    variants.forEach((variant) => {
      const { container } = render(
        <Card variant={variant} actionable>
          Actionable {variant}
        </Card>
      )
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('focus-visible:ring-2')
      expect(card.className).toContain('focus-visible:ring-ring')
    })
  })

  it('keyboard activation works with inverse cards', async () => {
    const onClick = vi.fn()
    render(
      <Card actionable className="inverse" onClick={onClick}>
        Inverse Clickable
      </Card>
    )
    const card = screen.getByRole('button')

    card.focus()
    await user.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('Card accordion functionality', () => {
  const user = userEvent.setup()

  it('renders as accordion when accordion prop is true', () => {
    render(
      <Card accordion>
        <CardHeader>Accordion Header</CardHeader>
        <CardContent>Accordion Content</CardContent>
      </Card>
    )
    expect(screen.getByText('Accordion Header')).toBeDefined()
  })

  it('collapses content by default', () => {
    const { container } = render(
      <Card accordion>
        <CardHeader>Header</CardHeader>
        <CardContent data-testid="content">Content</CardContent>
      </Card>
    )
    // Check that the collapsible wrapper has closed state
    const collapsibleWrapper = container.querySelector('[data-state="closed"]')
    expect(collapsibleWrapper).toBeDefined()
    // Content should not be visible when collapsed
    expect(screen.queryByText('Content')).toBeNull()
  })

  it('expands when defaultOpen is true', () => {
    const { container } = render(
      <Card accordion defaultOpen={true}>
        <CardHeader>Header</CardHeader>
        <CardContent data-testid="content">Content</CardContent>
      </Card>
    )
    // Check that the collapsible wrapper has open state
    const collapsibleWrapper = container.querySelector('[data-state="open"]')
    expect(collapsibleWrapper).toBeDefined()
    // Content should be visible
    expect(collapsibleWrapper?.hasAttribute('hidden')).toBe(false)
    // Content text should be findable
    expect(screen.getByText('Content')).toBeDefined()
  })

  it('toggles content when header is clicked', async () => {
    const { container } = render(
      <Card accordion>
        <CardHeader>Click Me</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    const header = screen.getByRole('button', { name: /Click Me/i })

    // Initially closed - content not visible
    expect(screen.queryByText('Content')).toBeNull()

    // Click to open
    await user.click(header)
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeDefined()
    })

    // Verify state changed to open
    const collapsibleWrapper = container.querySelector('[data-state]')
    expect(collapsibleWrapper?.getAttribute('data-state')).toBe('open')

    // Click to close
    await user.click(header)
    await waitFor(() => {
      expect(screen.queryByText('Content')).toBeNull()
    })
  })

  it('works in controlled mode', async () => {
    const onOpenChange = vi.fn()
    const { rerender, container } = render(
      <Card accordion open={false} onOpenChange={onOpenChange}>
        <CardHeader>Controlled</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    const header = screen.getByRole('button', { name: /Controlled/i })

    // Initially closed
    let collapsibleWrapper = container.querySelector('[data-state]')
    expect(collapsibleWrapper?.getAttribute('data-state')).toBe('closed')

    // Click header - should call onOpenChange
    await user.click(header)
    expect(onOpenChange).toHaveBeenCalledWith(true)

    // Rerender with open state
    rerender(
      <Card accordion open={true} onOpenChange={onOpenChange}>
        <CardHeader>Controlled</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    await waitFor(() => {
      collapsibleWrapper = container.querySelector('[data-state]')
      expect(collapsibleWrapper?.getAttribute('data-state')).toBe('open')
    })
    expect(screen.getByText('Content')).toBeDefined()
  })

  it('shows chevron icon in accordion header', () => {
    render(
      <Card accordion>
        <CardHeader>Header</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    const header = screen.getByRole('button')
    const chevron = header.querySelector('svg.shrink-0')
    expect(chevron).toBeDefined()
    const className = chevron?.getAttribute('class') || ''
    expect(className).toContain('transition-transform')
  })

  it('rotates chevron when expanded', async () => {
    render(
      <Card accordion>
        <CardHeader>Header</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    const header = screen.getByRole('button')
    const chevron = header.querySelector('svg.shrink-0')

    // Chevron should have the rotation class (always present, activated by parent state)
    expect(chevron).toBeDefined()
    const className = chevron?.getAttribute('class') || ''
    expect(className).toContain('[[data-state=open]>&]:rotate-90')

    // Click to expand
    await user.click(header)

    // Parent button should have open state which triggers the rotation
    expect(header.getAttribute('aria-expanded')).toBe('true')
  })

  it('works with header icon on left', () => {
    render(
      <Card accordion>
        <CardHeader icon="settings">Settings</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    const header = screen.getByRole('button')
    const icons = header.querySelectorAll('svg')

    // Should have 2 icons: settings icon and chevron
    expect(icons.length).toBe(2)
  })

  it('works with header icon on right', () => {
    render(
      <Card accordion>
        <CardHeader icon="settings" iconPosition="right">
          Settings
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    const header = screen.getByRole('button')
    const icons = header.querySelectorAll('svg')

    // Should have 2 icons: settings icon and chevron
    expect(icons.length).toBe(2)
  })

  it('collapses footer along with content', async () => {
    const { container } = render(
      <Card accordion>
        <CardHeader>Header</CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    const header = screen.getByRole('button')

    // Initially collapsed - footer should be hidden
    let footerWrapper = container.querySelectorAll('[data-state]')[1] // Second collapsible is footer
    expect(footerWrapper?.getAttribute('data-state')).toBe('closed')

    // Click to expand
    await user.click(header)
    await waitFor(() => {
      footerWrapper = container.querySelectorAll('[data-state]')[1]
      expect(footerWrapper?.getAttribute('data-state')).toBe('open')
    })
    // Footer text should now be visible
    expect(screen.getByText('Footer')).toBeDefined()
  })

  it('header is keyboard accessible', async () => {
    const { container } = render(
      <Card accordion>
        <CardHeader>Keyboard Test</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    const header = screen.getByRole('button')

    // Focus header
    header.focus()
    expect(document.activeElement).toBe(header)

    // Press Enter to expand
    await user.keyboard('{Enter}')
    await waitFor(() => {
      const collapsibleWrapper = container.querySelector('[data-state]')
      expect(collapsibleWrapper?.getAttribute('data-state')).toBe('open')
    })
    expect(screen.getByText('Content')).toBeDefined()

    // Press Space to collapse
    await user.keyboard(' ')
    await waitFor(() => {
      const collapsibleWrapper = container.querySelector('[data-state]')
      expect(collapsibleWrapper?.getAttribute('data-state')).toBe('closed')
    })
  })

  it('sets proper ARIA attributes', () => {
    render(
      <Card accordion>
        <CardHeader>ARIA Test</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    const header = screen.getByRole('button')

    // Should have aria-controls pointing to content
    expect(header.getAttribute('aria-controls')).toBeDefined()

    // Should have aria-expanded (handled by Radix)
    expect(header.getAttribute('aria-expanded')).toBe('false')
  })

  it('logs error when both actionable and accordion are true', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <Card actionable accordion>
        <CardHeader>Invalid</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    expect(consoleSpy).toHaveBeenCalledWith(
      'Card: Cannot be both actionable and accordion. Please use only one of these props.'
    )

    consoleSpy.mockRestore()
  })

  it('works with all card variants', () => {
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
    ] as CardProps['variant'][]

    variants.forEach((variant) => {
      const { container } = render(
        <Card variant={variant} accordion>
          <CardHeader>Header</CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )

      const button = container.querySelector('button')
      expect(button).toBeDefined()
    })
  })

  it('maintains focus after toggling', async () => {
    render(
      <Card accordion>
        <CardHeader>Focus Test</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    const header = screen.getByRole('button')

    // Click to expand
    await user.click(header)

    // Focus should remain on header
    expect(document.activeElement).toBe(header)
  })
})
