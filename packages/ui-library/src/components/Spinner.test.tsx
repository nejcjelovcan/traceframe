import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders with default size (md)', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toBeDefined()
    expect(spinner.className).toContain('h-size-xs')
    expect(spinner.className).toContain('w-size-xs')
  })

  it('renders sm size variant', () => {
    render(<Spinner size="sm" />)
    const spinner = screen.getByRole('status')
    expect(spinner.className).toContain('h-size-xs')
    expect(spinner.className).toContain('w-size-xs')
  })

  it('renders lg size variant', () => {
    render(<Spinner size="lg" />)
    const spinner = screen.getByRole('status')
    expect(spinner.className).toContain('h-size-sm')
    expect(spinner.className).toContain('w-size-sm')
  })

  it('has role="status" attribute', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeDefined()
  })

  it('has default aria-label="Loading"', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner.getAttribute('aria-label')).toBe('Loading')
  })

  it('accepts custom aria-label via label prop', () => {
    render(<Spinner label="Processing data" />)
    const spinner = screen.getByRole('status')
    expect(spinner.getAttribute('aria-label')).toBe('Processing data')
  })

  it('merges custom className', () => {
    render(<Spinner className="custom-class" />)
    const spinner = screen.getByRole('status')
    expect(spinner.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Spinner ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies animation class with motion-safe prefix', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner.className).toContain('motion-safe:animate-spin')
  })
})
