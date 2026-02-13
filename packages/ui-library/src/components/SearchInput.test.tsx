import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders with search icon', () => {
    render(<SearchInput data-testid="search-input" />)
    const wrapper = screen.getByTestId('search-input').parentElement
    expect(wrapper?.querySelector('svg')).toBeDefined()
  })

  it('renders with placeholder text', () => {
    render(<SearchInput placeholder="Search components..." />)
    expect(screen.getByPlaceholderText('Search components...')).toBeDefined()
  })

  it('calls onChange on input', () => {
    const handleChange = vi.fn()
    render(<SearchInput value="" onChange={handleChange} data-testid="search-input" />)
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'new' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies sm size classes', () => {
    render(<SearchInput size="sm" data-testid="search-input" />)
    const wrapper = screen.getByTestId('search-input').parentElement
    expect(wrapper?.className).toContain('h-size-sm')
    expect(wrapper?.className).toContain('text-sm')
  })

  it('applies md size classes by default', () => {
    render(<SearchInput data-testid="search-input" />)
    const wrapper = screen.getByTestId('search-input').parentElement
    expect(wrapper?.className).toContain('h-size-md')
    expect(wrapper?.className).toContain('text-base')
  })

  it('applies lg size classes', () => {
    render(<SearchInput size="lg" data-testid="search-input" />)
    const wrapper = screen.getByTestId('search-input').parentElement
    expect(wrapper?.className).toContain('h-size-lg')
    expect(wrapper?.className).toContain('text-lg')
  })

  it('handles disabled state on wrapper', () => {
    render(<SearchInput disabled data-testid="search-input" />)
    const wrapper = screen.getByTestId('search-input').parentElement
    expect(wrapper?.getAttribute('aria-disabled')).toBe('true')
  })

  it('handles disabled state on input', () => {
    render(<SearchInput disabled data-testid="search-input" />)
    expect(screen.getByTestId('search-input')).toBeDisabled()
  })

  it('merges custom className on wrapper', () => {
    render(<SearchInput className="custom-class" data-testid="search-input" />)
    const wrapper = screen.getByTestId('search-input').parentElement
    expect(wrapper?.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<SearchInput ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('uses search type for semantic HTML', () => {
    render(<SearchInput data-testid="search-input" />)
    expect(screen.getByTestId('search-input')).toHaveAttribute('type', 'search')
  })

  it('has focus-within ring classes on wrapper', () => {
    render(<SearchInput data-testid="search-input" />)
    const wrapper = screen.getByTestId('search-input').parentElement
    expect(wrapper?.className).toContain('focus-within:ring-2')
    expect(wrapper?.className).toContain('focus-within:ring-offset-2')
  })

  it('supports aria-label for accessibility', () => {
    render(<SearchInput aria-label="Search components" />)
    expect(screen.getByLabelText('Search components')).toBeDefined()
  })
})
