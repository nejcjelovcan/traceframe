import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('renders title correctly', () => {
    render(<ErrorState title="Failed to load" />)
    expect(screen.getByText('Failed to load')).toBeDefined()
  })

  it('renders error message when provided', () => {
    render(<ErrorState title="Failed to load" error="Network connection lost" />)
    expect(screen.getByText('Failed to load')).toBeDefined()
    expect(screen.getByText('Network connection lost')).toBeDefined()
  })

  it('renders retry button when onRetry is provided', () => {
    const handleRetry = vi.fn()
    render(<ErrorState title="Failed to load" onRetry={handleRetry} />)
    expect(screen.getByRole('button', { name: 'Try again' })).toBeDefined()
  })

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorState title="Failed to load" />)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('uses custom retryLabel when provided', () => {
    const handleRetry = vi.fn()
    render(<ErrorState title="Failed to load" onRetry={handleRetry} retryLabel="Retry now" />)
    expect(screen.getByRole('button', { name: 'Retry now' })).toBeDefined()
  })

  it('calls onRetry callback when retry button is clicked', () => {
    const handleRetry = vi.fn()
    render(<ErrorState title="Failed to load" onRetry={handleRetry} />)
    const button = screen.getByRole('button', { name: 'Try again' })
    fireEvent.click(button)
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('has role="alert" attribute', () => {
    render(<ErrorState title="Failed to load" />)
    expect(screen.getByRole('alert')).toBeDefined()
  })

  it('merges custom className', () => {
    render(<ErrorState title="Failed to load" className="custom-class" />)
    const element = screen.getByRole('alert')
    expect(element.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<ErrorState ref={ref} title="Failed to load" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('passes through native div props', () => {
    render(<ErrorState title="Failed to load" data-testid="error-state" />)
    expect(screen.getByTestId('error-state')).toBeDefined()
  })

  it('does not render error paragraph when not provided', () => {
    const { container } = render(<ErrorState title="Failed to load" />)
    const paragraph = container.querySelector('p')
    expect(paragraph).toBeNull()
  })

  it('renders all props together', () => {
    const handleRetry = vi.fn()
    render(
      <ErrorState
        title="Failed to load data"
        error="Server returned 500 error"
        onRetry={handleRetry}
        retryLabel="Reload"
      />
    )
    expect(screen.getByText('Failed to load data')).toBeDefined()
    expect(screen.getByText('Server returned 500 error')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeDefined()
  })

  it('has error icon with aria-hidden', () => {
    const { container } = render(<ErrorState title="Failed to load" />)
    const iconContainer = container.querySelector('[aria-hidden="true"]')
    expect(iconContainer).not.toBeNull()
    expect(iconContainer?.querySelector('svg')).not.toBeNull()
  })

  describe('action prop', () => {
    it('renders custom action element', () => {
      render(
        <ErrorState title="Failed to load" action={<a href="/packages">View all packages</a>} />
      )
      expect(screen.getByRole('link', { name: 'View all packages' })).toBeDefined()
    })

    it('action takes precedence over onRetry when both provided', () => {
      const handleRetry = vi.fn()
      render(
        <ErrorState
          title="Failed to load"
          onRetry={handleRetry}
          action={<button type="button">Custom action</button>}
        />
      )
      // Custom action should be rendered
      expect(screen.getByRole('button', { name: 'Custom action' })).toBeDefined()
      // Retry button should not be rendered
      expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull()
    })

    it('renders onRetry button when action is not provided', () => {
      const handleRetry = vi.fn()
      render(<ErrorState title="Failed to load" onRetry={handleRetry} />)
      expect(screen.getByRole('button', { name: 'Try again' })).toBeDefined()
    })

    it('renders no action when neither action nor onRetry provided', () => {
      render(<ErrorState title="Failed to load" />)
      expect(screen.queryByRole('button')).toBeNull()
      expect(screen.queryByRole('link')).toBeNull()
    })

    it('renders custom button as action', () => {
      render(
        <ErrorState
          title="Package not found"
          action={
            <button type="button" className="custom-button">
              Go back
            </button>
          }
        />
      )
      expect(screen.getByRole('button', { name: 'Go back' })).toBeDefined()
    })
  })

  describe('size variants', () => {
    it('applies small size classes', () => {
      const { container } = render(<ErrorState title="Error" size="sm" />)
      const element = screen.getByRole('alert')
      expect(element.className).toContain('py-lg')

      // Check title has text-base
      const title = container.querySelector('h3')
      expect(title?.className).toContain('text-base')
    })

    it('applies medium size classes (default)', () => {
      const { container } = render(<ErrorState title="Error" />)
      const element = screen.getByRole('alert')
      expect(element.className).toContain('py-xl')

      // Check title has text-lg
      const title = container.querySelector('h3')
      expect(title?.className).toContain('text-lg')
    })

    it('applies large size classes', () => {
      const { container } = render(<ErrorState title="Error" size="lg" />)
      const element = screen.getByRole('alert')
      expect(element.className).toContain('py-2xl')

      // Check title has text-xl
      const title = container.querySelector('h3')
      expect(title?.className).toContain('text-xl')
    })

    it('applies small error message size', () => {
      const { container } = render(<ErrorState title="Error" error="Details" size="sm" />)
      const errorMessage = container.querySelector('p')
      expect(errorMessage?.className).toContain('text-xs')
    })

    it('applies medium error message size (default)', () => {
      const { container } = render(<ErrorState title="Error" error="Details" />)
      const errorMessage = container.querySelector('p')
      expect(errorMessage?.className).toContain('text-sm')
    })

    it('applies large error message size', () => {
      const { container } = render(<ErrorState title="Error" error="Details" size="lg" />)
      const errorMessage = container.querySelector('p')
      expect(errorMessage?.className).toContain('text-base')
    })
  })

  describe('icon prop', () => {
    it('renders default alert-circle icon', () => {
      const { container } = render(<ErrorState title="Error" />)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
    })

    it('renders custom icon by name', () => {
      const { container } = render(<ErrorState title="Error" icon="info-circle" />)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
    })

    it('uses lg icon size for sm component size', () => {
      const { container } = render(<ErrorState title="Error" size="sm" />)
      const svg = container.querySelector('svg')
      // lg size is 24px
      expect(svg?.getAttribute('width')).toBe('24')
      expect(svg?.getAttribute('height')).toBe('24')
    })

    it('uses 2xl icon size for md component size', () => {
      const { container } = render(<ErrorState title="Error" size="md" />)
      const svg = container.querySelector('svg')
      // 2xl size is 48px
      expect(svg?.getAttribute('width')).toBe('48')
      expect(svg?.getAttribute('height')).toBe('48')
    })

    it('uses 2xl icon size for lg component size', () => {
      const { container } = render(<ErrorState title="Error" size="lg" />)
      const svg = container.querySelector('svg')
      // 2xl size is 48px
      expect(svg?.getAttribute('width')).toBe('48')
      expect(svg?.getAttribute('height')).toBe('48')
    })
  })

  describe('customIcon prop', () => {
    it('renders custom icon element', () => {
      render(
        <ErrorState title="Error" customIcon={<span data-testid="custom-icon">Custom Icon</span>} />
      )
      expect(screen.getByTestId('custom-icon')).toBeDefined()
      expect(screen.getByText('Custom Icon')).toBeDefined()
    })

    it('customIcon takes precedence over icon prop', () => {
      const { container } = render(
        <ErrorState
          title="Error"
          icon="info-circle"
          customIcon={<span data-testid="custom-icon">Custom</span>}
        />
      )
      expect(screen.getByTestId('custom-icon')).toBeDefined()
      // Default SVG icon should not be rendered
      expect(container.querySelector('svg')).toBeNull()
    })

    it('allows complex custom icon elements', () => {
      render(
        <ErrorState
          title="Error"
          customIcon={
            <div className="custom-icon-wrapper">
              <img src="/error.png" alt="error" />
            </div>
          }
        />
      )
      expect(screen.getByAltText('error')).toBeDefined()
    })
  })

  describe('backward compatibility', () => {
    it('works without size prop (uses default md)', () => {
      render(<ErrorState title="Error" />)
      const element = screen.getByRole('alert')
      expect(element.className).toContain('py-xl')
    })

    it('works with all original props', () => {
      const handleRetry = vi.fn()
      render(
        <ErrorState
          title="Original title"
          error="Original error"
          onRetry={handleRetry}
          retryLabel="Original retry"
          className="original-class"
        />
      )
      expect(screen.getByText('Original title')).toBeDefined()
      expect(screen.getByText('Original error')).toBeDefined()
      expect(screen.getByRole('button', { name: 'Original retry' })).toBeDefined()
      expect(screen.getByRole('alert').className).toContain('original-class')
    })
  })
})
