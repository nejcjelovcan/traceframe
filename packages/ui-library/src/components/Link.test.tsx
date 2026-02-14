import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { Link } from './Link'

describe('Link', () => {
  it('renders children', () => {
    render(<Link href="/test">Click me</Link>)
    expect(screen.getByText('Click me')).toBeDefined()
  })

  it('renders href attribute', () => {
    render(<Link href="/packages">View packages</Link>)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/packages')
  })

  it('internal links have no target or rel attributes', () => {
    render(<Link href="/internal">Internal</Link>)
    const link = screen.getByRole('link')
    expect(link.getAttribute('target')).toBeNull()
    expect(link.getAttribute('rel')).toBeNull()
  })

  it('external links have target="_blank" and rel="noopener noreferrer"', () => {
    render(
      <Link href="https://github.com" external>
        GitHub
      </Link>
    )
    const link = screen.getByRole('link')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('passes through native anchor props', () => {
    render(
      <Link href="/test" data-testid="test-link" title="Test title">
        Test
      </Link>
    )
    const link = screen.getByTestId('test-link')
    expect(link.getAttribute('title')).toBe('Test title')
  })

  it('merges custom className', () => {
    render(
      <Link href="/test" className="custom-class">
        Custom
      </Link>
    )
    const link = screen.getByRole('link')
    expect(link.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLAnchorElement | null }
    render(
      <Link href="/test" ref={ref}>
        Ref
      </Link>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  describe('asChild', () => {
    it('renders child element instead of anchor', () => {
      render(
        <Link asChild>
          <button type="button">Click me</button>
        </Link>
      )
      const button = screen.getByRole('button')
      expect(button).toBeDefined()
      expect(button.tagName).toBe('BUTTON')
    })

    it('merges className onto child element', () => {
      render(
        <Link asChild className="extra">
          <button type="button" className="child-class">
            Click
          </button>
        </Link>
      )
      const button = screen.getByRole('button')
      expect(button.className).toContain('child-class')
      expect(button.className).toContain('extra')
    })

    it('passes external props to child element', () => {
      render(
        <Link asChild external>
          <a href="https://github.com">GitHub</a>
        </Link>
      )
      const link = screen.getByRole('link')
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('renders icon alongside child content', () => {
      render(
        <Link asChild icon="arrow-right">
          <button type="button">Next</button>
        </Link>
      )
      const button = screen.getByRole('button')
      expect(button.textContent).toContain('Next')
      expect(button.querySelector('svg')).toBeDefined()
    })

    it('forwards ref to child element', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <Link asChild ref={ref}>
          <a href="/test">Test</a>
        </Link>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })
})
