import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Container } from './Container'

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>)
    expect(screen.getByText('Content')).toBeDefined()
  })

  it('applies default size classes (lg)', () => {
    render(<Container>Default Size</Container>)
    const container = screen.getByText('Default Size')
    expect(container.className).toContain('max-w-screen-lg')
  })

  it('applies default padding classes (md)', () => {
    render(<Container>Default Padding</Container>)
    const container = screen.getByText('Default Padding')
    expect(container.className).toContain('px-base')
  })

  it('applies base classes', () => {
    render(<Container>Base</Container>)
    const container = screen.getByText('Base')
    expect(container.className).toContain('mx-auto')
  })

  describe('size variants', () => {
    it('applies sm size classes', () => {
      render(<Container size="sm">Small</Container>)
      const container = screen.getByText('Small')
      expect(container.className).toContain('max-w-screen-sm')
    })

    it('applies md size classes', () => {
      render(<Container size="md">Medium</Container>)
      const container = screen.getByText('Medium')
      expect(container.className).toContain('max-w-screen-md')
    })

    it('applies lg size classes', () => {
      render(<Container size="lg">Large</Container>)
      const container = screen.getByText('Large')
      expect(container.className).toContain('max-w-screen-lg')
    })

    it('applies xl size classes', () => {
      render(<Container size="xl">Extra Large</Container>)
      const container = screen.getByText('Extra Large')
      expect(container.className).toContain('max-w-screen-xl')
    })

    it('applies 2xl size classes', () => {
      render(<Container size="2xl">2XL</Container>)
      const container = screen.getByText('2XL')
      expect(container.className).toContain('max-w-screen-2xl')
    })

    it('applies full size classes', () => {
      render(<Container size="full">Full Width</Container>)
      const container = screen.getByText('Full Width')
      expect(container.className).toContain('max-w-none')
      expect(container.className).toContain('w-full')
    })
  })

  describe('padding variants', () => {
    it('applies none padding classes', () => {
      render(<Container padding="none">No Padding</Container>)
      const container = screen.getByText('No Padding')
      expect(container.className).toContain('px-0')
    })

    it('applies sm padding classes', () => {
      render(<Container padding="sm">Small Padding</Container>)
      const container = screen.getByText('Small Padding')
      expect(container.className).toContain('px-sm')
    })

    it('applies md padding classes', () => {
      render(<Container padding="md">Medium Padding</Container>)
      const container = screen.getByText('Medium Padding')
      expect(container.className).toContain('px-base')
    })

    it('applies lg padding classes', () => {
      render(<Container padding="lg">Large Padding</Container>)
      const container = screen.getByText('Large Padding')
      expect(container.className).toContain('px-lg')
    })
  })

  it('passes through native div props', () => {
    render(<Container data-testid="test-container">Test</Container>)
    expect(screen.getByTestId('test-container')).toBeDefined()
  })

  it('merges custom className', () => {
    render(<Container className="custom-class">Custom</Container>)
    const container = screen.getByText('Custom')
    expect(container.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Container ref={ref}>Ref</Container>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
