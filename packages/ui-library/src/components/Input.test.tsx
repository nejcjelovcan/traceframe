import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Input } from './Input'

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input data-testid="input" />)
    expect(screen.getByTestId('input')).toBeDefined()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text..." />)
    expect(screen.getByPlaceholderText('Enter text...')).toBeDefined()
  })

  it('applies sm size classes', () => {
    render(<Input size="sm" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('h-size-sm')
    expect(input.className).toContain('text-sm')
  })

  it('applies md size classes by default', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('h-size-md')
    expect(input.className).toContain('text-base')
  })

  it('applies lg size classes', () => {
    render(<Input size="lg" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('h-size-lg')
    expect(input.className).toContain('text-lg')
  })

  it('applies error variant classes', () => {
    render(<Input variant="error" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('border-status-error-border')
  })

  it('applies success variant classes', () => {
    render(<Input variant="success" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('border-status-success-border')
  })

  it('applies default variant classes', () => {
    render(<Input variant="default" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('border-border')
  })

  it('handles disabled state', () => {
    render(<Input disabled data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
    expect(input.className).toContain('disabled:opacity-50')
    expect(input.className).toContain('disabled:cursor-not-allowed')
  })

  it('merges custom className', () => {
    render(<Input className="custom-class" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('custom-class')
  })

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'number')
  })

  it('defaults to text type', () => {
    render(<Input data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'text')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('supports aria-label for accessibility', () => {
    render(<Input aria-label="Search" data-testid="input" />)
    expect(screen.getByLabelText('Search')).toBeDefined()
  })

  it('supports aria-invalid for error states', () => {
    render(<Input aria-invalid="true" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true')
  })

  it('supports aria-describedby for error messages', () => {
    render(<Input aria-describedby="error-message" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('aria-describedby', 'error-message')
  })

  describe('icon support', () => {
    it('renders left icon when leftIcon prop is provided', () => {
      render(<Input leftIcon="search" data-testid="input" />)
      const wrapper = screen.getByTestId('input').parentElement
      const icons = wrapper?.querySelectorAll('[data-testid="icon"]')
      expect(icons).toHaveLength(1)
    })

    it('renders right icon when rightIcon prop is provided', () => {
      render(<Input rightIcon="check" data-testid="input" />)
      const wrapper = screen.getByTestId('input').parentElement
      const icons = wrapper?.querySelectorAll('[data-testid="icon"]')
      expect(icons).toHaveLength(1)
    })

    it('renders both icons when leftIcon and rightIcon are provided', () => {
      render(<Input leftIcon="search" rightIcon="check" data-testid="input" />)
      const wrapper = screen.getByTestId('input').parentElement
      const icons = wrapper?.querySelectorAll('[data-testid="icon"]')
      expect(icons).toHaveLength(2)
    })

    it('renders without wrapper when no icons provided', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      // Without icons, input should be the root element (no parent wrapper with flex)
      expect(input.tagName).toBe('INPUT')
      expect(input.className).toContain('px-md')
      expect(input.className).not.toContain('flex')
    })

    it('renders with wrapper when icons provided', () => {
      render(<Input leftIcon="search" data-testid="input" />)
      const input = screen.getByTestId('input')
      const wrapper = input.parentElement
      // With icons, wrapper should have flex layout
      expect(wrapper?.className).toContain('flex')
      expect(wrapper?.className).toContain('items-center')
    })

    it('applies correct icon size for small inputs', () => {
      render(<Input size="sm" leftIcon="search" data-testid="input" />)
      const icon = screen.getByTestId('icon')
      // xs size = 12px
      expect(icon).toHaveAttribute('width', '12')
    })

    it('applies correct icon size for medium inputs', () => {
      render(<Input size="md" leftIcon="search" data-testid="input" />)
      const icon = screen.getByTestId('icon')
      // sm size = 16px
      expect(icon).toHaveAttribute('width', '16')
    })

    it('applies correct icon size for large inputs', () => {
      render(<Input size="lg" leftIcon="search" data-testid="input" />)
      const icon = screen.getByTestId('icon')
      // md size = 20px
      expect(icon).toHaveAttribute('width', '20')
    })

    it('applies error variant to wrapper when icons present', () => {
      render(<Input variant="error" leftIcon="alert-circle" data-testid="input" />)
      const wrapper = screen.getByTestId('input').parentElement
      expect(wrapper?.className).toContain('border-status-error-border')
    })

    it('handles disabled state with icons', () => {
      render(<Input disabled leftIcon="search" data-testid="input" />)
      const input = screen.getByTestId('input')
      const wrapper = input.parentElement
      expect(input).toBeDisabled()
      expect(wrapper).toHaveAttribute('aria-disabled', 'true')
    })

    it('merges custom className on wrapper when icons present', () => {
      render(<Input leftIcon="search" className="custom-class" data-testid="input" />)
      const wrapper = screen.getByTestId('input').parentElement
      expect(wrapper?.className).toContain('custom-class')
    })

    it('forwards ref correctly with icons', () => {
      const ref = { current: null as HTMLInputElement | null }
      render(<Input leftIcon="search" ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('applies focus-within styles to wrapper', () => {
      render(<Input leftIcon="search" data-testid="input" />)
      const wrapper = screen.getByTestId('input').parentElement
      expect(wrapper?.className).toContain('focus-within:ring-2')
    })
  })

  describe('fullWidth support', () => {
    it('applies full width by default', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input.className).toContain('w-full')
    })

    it('applies auto width when fullWidth is false', () => {
      render(<Input fullWidth={false} data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input.className).toContain('w-auto')
      expect(input.className).not.toContain('w-full')
    })

    it('applies fullWidth to wrapper when icons present', () => {
      render(<Input leftIcon="search" fullWidth={false} data-testid="input" />)
      const wrapper = screen.getByTestId('input').parentElement
      expect(wrapper?.className).toContain('w-auto')
      expect(wrapper?.className).not.toContain('w-full')
    })
  })

  describe('helperText support', () => {
    it('renders helper text when provided', () => {
      render(<Input helperText="This is a hint" data-testid="input" />)
      expect(screen.getByText('This is a hint')).toBeDefined()
    })

    it('applies default color to helper text', () => {
      render(<Input helperText="This is a hint" data-testid="input" />)
      const helperText = screen.getByText('This is a hint')
      expect(helperText.className).toContain('text-foreground-muted')
    })

    it('applies error color to helper text with error variant', () => {
      render(<Input variant="error" helperText="This is an error" data-testid="input" />)
      const helperText = screen.getByText('This is an error')
      expect(helperText.className).toContain('text-status-error-foreground')
    })

    it('applies success color to helper text with success variant', () => {
      render(<Input variant="success" helperText="This is success" data-testid="input" />)
      const helperText = screen.getByText('This is success')
      expect(helperText.className).toContain('text-status-success-foreground')
    })

    it('renders helper text with icons', () => {
      render(<Input leftIcon="search" helperText="Search for items" data-testid="input" />)
      expect(screen.getByText('Search for items')).toBeDefined()
    })
  })

  describe('showStatusIcon support', () => {
    it('does not show status icon by default', () => {
      render(<Input variant="error" data-testid="input" />)
      const input = screen.getByTestId('input')
      // Without wrapper, no icons should be present
      expect(input.tagName).toBe('INPUT')
      expect(screen.queryByTestId('icon')).toBeNull()
    })

    it('shows error icon when showStatusIcon true with error variant', () => {
      render(<Input variant="error" showStatusIcon data-testid="input" />)
      const icons = screen.getAllByTestId('icon')
      expect(icons).toHaveLength(1)
      // alert-circle icon should have error color
      const icon = icons[0]!
      expect(icon.getAttribute('class')).toContain('text-status-error-foreground')
    })

    it('shows success icon when showStatusIcon true with success variant', () => {
      render(<Input variant="success" showStatusIcon data-testid="input" />)
      const icons = screen.getAllByTestId('icon')
      expect(icons).toHaveLength(1)
      // check icon should have success color
      const icon = icons[0]!
      expect(icon.getAttribute('class')).toContain('text-status-success-foreground')
    })

    it('does not show status icon for default variant', () => {
      render(<Input variant="default" showStatusIcon data-testid="input" />)
      expect(screen.queryByTestId('icon')).toBeNull()
    })

    it('status icon overrides rightIcon', () => {
      render(<Input variant="error" showStatusIcon rightIcon="check" data-testid="input" />)
      const icons = screen.getAllByTestId('icon')
      // Should show only the status icon, not the rightIcon
      expect(icons).toHaveLength(1)
    })

    it('shows both leftIcon and status icon', () => {
      render(<Input variant="error" showStatusIcon leftIcon="search" data-testid="input" />)
      const icons = screen.getAllByTestId('icon')
      // Should show both search icon and alert-circle icon
      expect(icons).toHaveLength(2)
    })
  })
})
