import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { NavItem, Navigation } from './Navigation'

describe('Navigation', () => {
  it('renders children', () => {
    render(
      <Navigation>
        <NavItem href="#">Home</NavItem>
      </Navigation>
    )
    expect(screen.getByText('Home')).toBeDefined()
  })

  it('renders as nav element', () => {
    render(
      <Navigation>
        <NavItem href="#">Home</NavItem>
      </Navigation>
    )
    expect(screen.getByRole('navigation')).toBeDefined()
  })
})

describe('NavItem', () => {
  it('renders children', () => {
    render(<NavItem href="#">Home</NavItem>)
    expect(screen.getByText('Home')).toBeDefined()
  })

  it('renders as anchor by default', () => {
    render(<NavItem href="/home">Home</NavItem>)
    const link = screen.getByRole('link')
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/home')
  })

  it('sets aria-current="page" when active', () => {
    render(
      <NavItem href="#" active>
        Home
      </NavItem>
    )
    expect(screen.getByRole('link').getAttribute('aria-current')).toBe('page')
  })

  it('does not set aria-current when inactive', () => {
    render(<NavItem href="#">Home</NavItem>)
    expect(screen.getByRole('link').getAttribute('aria-current')).toBeNull()
  })

  it('merges custom className', () => {
    render(
      <NavItem href="#" className="custom">
        Home
      </NavItem>
    )
    expect(screen.getByRole('link').className).toContain('custom')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLAnchorElement>()
    render(
      <NavItem href="#" ref={ref}>
        Home
      </NavItem>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it('applies border-b-thick classes when active in horizontal orientation', () => {
    const { container } = render(
      <Navigation orientation="horizontal">
        <NavItem href="#" active>
          Active
        </NavItem>
      </Navigation>
    )
    const activeItem = container.querySelector('a')
    expect(activeItem?.className).toContain('border-b-thick-interactive-primary-border')
  })

  it('applies border-l-thick classes when active in vertical orientation', () => {
    const { container } = render(
      <Navigation orientation="vertical">
        <NavItem href="#" active>
          Active
        </NavItem>
      </Navigation>
    )
    const activeItem = container.querySelector('a')
    expect(activeItem?.className).toContain('border-l-thick-interactive-primary-border')
  })

  it('does not apply border classes when inactive', () => {
    const { container } = render(
      <Navigation orientation="horizontal">
        <NavItem href="#">Inactive</NavItem>
      </Navigation>
    )
    const inactiveItem = container.querySelector('a')
    expect(inactiveItem?.className).not.toContain('border-b-thick')
    expect(inactiveItem?.className).not.toContain('border-l-thick')
  })

  describe('asChild', () => {
    it('renders child element instead of anchor', () => {
      render(
        <NavItem asChild>
          <button type="button">Home</button>
        </NavItem>
      )
      const button = screen.getByRole('button')
      expect(button).toBeDefined()
      expect(button.tagName).toBe('BUTTON')
    })

    it('merges className onto child element', () => {
      render(
        <NavItem asChild className="extra">
          <button type="button" className="child-class">
            Home
          </button>
        </NavItem>
      )
      const button = screen.getByRole('button')
      expect(button.className).toContain('child-class')
      expect(button.className).toContain('extra')
    })

    it('passes aria-current to child when active', () => {
      render(
        <NavItem asChild active>
          <button type="button">Home</button>
        </NavItem>
      )
      expect(screen.getByRole('button').getAttribute('aria-current')).toBe('page')
    })

    it('renders icon alongside child content', () => {
      render(
        <NavItem asChild icon="dashboard">
          <button type="button">Home</button>
        </NavItem>
      )
      const button = screen.getByRole('button')
      expect(button.textContent).toContain('Home')
      // Icon is rendered as an SVG inside the button
      expect(button.querySelector('svg')).toBeDefined()
    })
  })
})
