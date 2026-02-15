import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDefined()
  })

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-interactive-destructive')
  })

  it('applies size classes', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('h-size-lg')
  })

  it('passes through native button props', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })

  describe('loading state', () => {
    it('shows spinner when loading is true', () => {
      render(<Button loading>Submit</Button>)
      const spinner = screen.getByRole('status')
      expect(spinner).toBeDefined()
      expect(screen.getByText('Loading...')).toBeDefined()
    })

    it('shows custom loading text', () => {
      render(
        <Button loading loadingText="Processing...">
          Submit
        </Button>
      )
      expect(screen.getByText('Processing...')).toBeDefined()
    })

    it('disables button when loading', () => {
      render(<Button loading>Submit</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('sets aria-busy when loading', () => {
      render(<Button loading>Submit</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
    })

    it('hides icons when loading', () => {
      render(
        <Button loading leftIcon="search" rightIcon="arrow-right">
          Submit
        </Button>
      )
      const icons = screen.queryAllByTestId('icon')
      expect(icons).toHaveLength(0)
    })

    it('applies loading state with different variants', () => {
      const variants = [
        'primary',
        'secondary',
        'outline',
        'ghost',
        'destructive',
        'gradient-primary',
        'gradient-secondary',
        'gradient-destructive',
      ] as const
      variants.forEach((variant) => {
        const { unmount } = render(
          <Button variant={variant} loading>
            {variant}
          </Button>
        )
        const spinner = screen.getByRole('status')
        expect(spinner).toBeDefined()
        unmount()
      })
    })

    it('applies correct spinner size for button sizes', () => {
      const { rerender } = render(
        <Button size="sm" loading>
          Small
        </Button>
      )
      let spinner = screen.getByRole('status')
      expect(spinner.className).toContain('h-size-xs w-size-xs')

      rerender(
        <Button size="md" loading>
          Medium
        </Button>
      )
      spinner = screen.getByRole('status')
      expect(spinner.className).toContain('h-size-xs w-size-xs')

      rerender(
        <Button size="lg" loading>
          Large
        </Button>
      )
      spinner = screen.getByRole('status')
      expect(spinner.className).toContain('h-size-sm w-size-sm')
    })
  })

  describe('full width support', () => {
    it('applies full width class when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('w-full')
    })

    it('works with all variants', () => {
      const variants = [
        'primary',
        'secondary',
        'outline',
        'ghost',
        'destructive',
        'gradient-primary',
        'gradient-secondary',
        'gradient-destructive',
      ] as const
      variants.forEach((variant) => {
        const { unmount } = render(
          <Button variant={variant} fullWidth>
            {variant}
          </Button>
        )
        const button = screen.getByRole('button')
        expect(button.className).toContain('w-full')
        unmount()
      })
    })

    it('works with icon-only mode', () => {
      render(
        <Button fullWidth iconOnly leftIcon="search" aria-label="Search">
          Search
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button.className).toContain('w-full')
    })
  })

  describe('asChild', () => {
    it('renders child element instead of button', () => {
      render(
        <Button asChild variant="outline">
          <a href="/test">Link</a>
        </Button>
      )
      const link = screen.getByRole('link')
      expect(link.tagName).toBe('A')
      expect(link.getAttribute('href')).toBe('/test')
    })

    it('merges className onto child element', () => {
      render(
        <Button asChild variant="outline" className="extra">
          <a href="/test" className="child-class">
            Link
          </a>
        </Button>
      )
      const link = screen.getByRole('link')
      expect(link.className).toContain('child-class')
      expect(link.className).toContain('extra')
    })

    it('renders icons alongside child content', () => {
      render(
        <Button asChild variant="outline" rightIcon="external">
          <a href="https://example.com">External</a>
        </Button>
      )
      const link = screen.getByRole('link')
      expect(link.textContent).toContain('External')
      expect(link.querySelector('svg')).toBeDefined()
    })

    it('forwards ref to child element', () => {
      const ref = createRef<HTMLButtonElement>()
      render(
        <Button asChild ref={ref}>
          <a href="/test">Link</a>
        </Button>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    it('passes additional props to child element', () => {
      render(
        <Button asChild variant="outline">
          <a href="https://example.com" target="_blank" rel="noopener noreferrer">
            External
          </a>
        </Button>
      )
      const link = screen.getByRole('link')
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    })
  })

  describe('icon support', () => {
    it('renders left icon when leftIcon prop is provided', () => {
      render(<Button leftIcon="search">Search</Button>)
      const button = screen.getByRole('button')
      const icons = button.querySelectorAll('[data-testid="icon"]')
      expect(icons).toHaveLength(1)
      expect(screen.getByText('Search')).toBeDefined()
    })

    it('renders right icon when rightIcon prop is provided', () => {
      render(<Button rightIcon="arrow-right">Next</Button>)
      const button = screen.getByRole('button')
      const icons = button.querySelectorAll('[data-testid="icon"]')
      expect(icons).toHaveLength(1)
      expect(screen.getByText('Next')).toBeDefined()
    })

    it('renders both icons when leftIcon and rightIcon are provided', () => {
      render(
        <Button leftIcon="search" rightIcon="arrow-right">
          Search
        </Button>
      )
      const button = screen.getByRole('button')
      const icons = button.querySelectorAll('[data-testid="icon"]')
      expect(icons).toHaveLength(2)
    })

    it('applies icon-only styles when iconOnly is true', () => {
      render(
        <Button leftIcon="close" iconOnly aria-label="Close">
          Close
        </Button>
      )
      const button = screen.getByRole('button')
      // Icon-only buttons have square aspect ratio
      expect(button.className).toContain('w-size-md')
      expect(button.className).toContain('px-0')
    })

    it('visually hides children but keeps them accessible when iconOnly is true', () => {
      render(
        <Button leftIcon="close" iconOnly aria-label="Close">
          Close dialog
        </Button>
      )
      const srOnlyText = screen.getByText('Close dialog')
      expect(srOnlyText.className).toContain('sr-only')
    })

    it('applies correct icon size for small buttons', () => {
      render(
        <Button size="sm" leftIcon="search">
          Search
        </Button>
      )
      const icon = screen.getByTestId('icon')
      // xs size = 12px
      expect(icon).toHaveAttribute('width', '12')
    })

    it('applies correct icon size for medium buttons', () => {
      render(
        <Button size="md" leftIcon="search">
          Search
        </Button>
      )
      const icon = screen.getByTestId('icon')
      // sm size = 16px
      expect(icon).toHaveAttribute('width', '16')
    })

    it('applies correct icon size for large buttons', () => {
      render(
        <Button size="lg" leftIcon="search">
          Search
        </Button>
      )
      const icon = screen.getByTestId('icon')
      // md size = 20px
      expect(icon).toHaveAttribute('width', '20')
    })

    it('applies icon-only sm size correctly', () => {
      render(
        <Button size="sm" leftIcon="close" iconOnly aria-label="Close">
          Close
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button.className).toContain('w-size-sm')
    })

    it('applies icon-only lg size correctly', () => {
      render(
        <Button size="lg" leftIcon="close" iconOnly aria-label="Close">
          Close
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button.className).toContain('w-size-lg')
    })

    it('works with all button variants', () => {
      const variants = [
        'primary',
        'secondary',
        'outline',
        'ghost',
        'destructive',
        'gradient-primary',
        'gradient-secondary',
        'gradient-destructive',
      ] as const
      variants.forEach((variant) => {
        const { unmount } = render(
          <Button variant={variant} leftIcon="check">
            {variant}
          </Button>
        )
        const icon = screen.getByTestId('icon')
        expect(icon).toBeDefined()
        unmount()
      })
    })
  })

  describe('gradient variants', () => {
    it('applies gradient-primary classes', () => {
      render(<Button variant="gradient-primary">Upgrade Now</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-gradient-interactive-primary')
      expect(button.className).toContain('text-foreground-inverted')
      expect(button.className).toContain('hover:opacity-90')
      expect(button.className).toContain('shadow-interactive')
    })

    it('applies gradient-secondary classes', () => {
      render(<Button variant="gradient-secondary">Learn More</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-gradient-interactive-secondary')
      expect(button.className).toContain('text-foreground-inverted')
      expect(button.className).toContain('hover:opacity-90')
      expect(button.className).toContain('shadow-interactive')
    })

    it('applies gradient-destructive classes', () => {
      render(<Button variant="gradient-destructive">Delete Account</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-gradient-interactive-destructive')
      expect(button.className).toContain('text-foreground-inverted')
      expect(button.className).toContain('hover:opacity-90')
      expect(button.className).toContain('shadow-interactive')
    })

    it('includes interactive shadow classes', () => {
      const gradientVariants = [
        'gradient-primary',
        'gradient-secondary',
        'gradient-destructive',
      ] as const
      gradientVariants.forEach((variant) => {
        const { unmount } = render(<Button variant={variant}>Test</Button>)
        const button = screen.getByRole('button')
        expect(button.className).toContain('shadow-interactive')
        expect(button.className).toContain('hover:shadow-interactive-hover')
        expect(button.className).toContain('active:shadow-interactive-pressed')
        unmount()
      })
    })

    it('works with all button sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      sizes.forEach((size) => {
        const { unmount } = render(
          <Button variant="gradient-primary" size={size}>
            Size {size}
          </Button>
        )
        const button = screen.getByRole('button')
        expect(button.className).toContain('bg-gradient-interactive-primary')
        if (size === 'sm') expect(button.className).toContain('h-size-sm')
        if (size === 'md') expect(button.className).toContain('h-size-md')
        if (size === 'lg') expect(button.className).toContain('h-size-lg')
        unmount()
      })
    })

    it('supports icons with gradient variants', () => {
      render(
        <Button variant="gradient-primary" leftIcon="sparkles" rightIcon="arrow-right">
          Premium
        </Button>
      )
      const button = screen.getByRole('button')
      const icons = button.querySelectorAll('[data-testid="icon"]')
      expect(icons).toHaveLength(2)
      expect(button.className).toContain('bg-gradient-interactive-primary')
    })

    it('handles loading state with gradient variants', () => {
      render(
        <Button variant="gradient-primary" loading>
          Processing
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(screen.getByRole('status')).toBeDefined()
      expect(button.className).toContain('bg-gradient-interactive-primary')
    })

    it('handles disabled state with gradient variants', () => {
      render(
        <Button variant="gradient-primary" disabled>
          Disabled
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      // Disabled state overrides gradient with disabled classes
      expect(button.className).toContain('disabled:bg-disabled')
      expect(button.className).toContain('disabled:text-disabled-foreground')
    })
  })

  describe('interactive shadows', () => {
    it('adds shadow classes to primary variant', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('shadow-interactive')
      expect(button.className).toContain('hover:shadow-interactive-hover')
      expect(button.className).toContain('active:shadow-interactive-pressed')
    })

    it('adds shadow classes to secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('shadow-interactive')
      expect(button.className).toContain('hover:shadow-interactive-hover')
      expect(button.className).toContain('active:shadow-interactive-pressed')
    })

    it('adds shadow classes to destructive variant', () => {
      render(<Button variant="destructive">Destructive</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('shadow-interactive')
      expect(button.className).toContain('hover:shadow-interactive-hover')
      expect(button.className).toContain('active:shadow-interactive-pressed')
    })

    it('does not add shadows to outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button.className).not.toContain('shadow-interactive')
      expect(button.className).not.toContain('hover:shadow-interactive-hover')
      expect(button.className).not.toContain('active:shadow-interactive-pressed')
    })

    it('does not add shadows to ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button.className).not.toContain('shadow-interactive')
      expect(button.className).not.toContain('hover:shadow-interactive-hover')
      expect(button.className).not.toContain('active:shadow-interactive-pressed')
    })

    it('uses transition-all for smooth shadow transitions', () => {
      render(<Button>Test</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('transition-all')
      expect(button.className).not.toContain('transition-colors')
    })
  })
})
