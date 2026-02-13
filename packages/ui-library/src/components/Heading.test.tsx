import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { Heading } from './Heading'

describe('Heading', () => {
  it('renders correct HTML element for each level', () => {
    const levels = [1, 2, 3, 4, 5, 6] as const
    for (const level of levels) {
      const { container } = render(<Heading level={level}>Heading {level}</Heading>)
      const element = container.querySelector(`h${level}`)
      expect(element).not.toBeNull()
      expect(element?.textContent).toBe(`Heading ${level}`)
    }
  })

  it('defaults to correct size per level', () => {
    const expectedClasses: Record<number, string> = {
      1: 'text-2xl',
      2: 'text-xl',
      3: 'text-lg',
      4: 'text-base',
      5: 'text-sm',
      6: 'text-xs',
    }

    for (const [level, expectedClass] of Object.entries(expectedClasses)) {
      render(<Heading level={Number(level) as 1 | 2 | 3 | 4 | 5 | 6}>Level {level}</Heading>)
      const element = screen.getByText(`Level ${level}`)
      expect(element.className).toContain(expectedClass)
    }
  })

  it('allows size override independent of level', () => {
    render(
      <Heading level={3} size="2xl">
        Big H3
      </Heading>
    )
    const element = screen.getByText('Big H3')
    expect(element.tagName).toBe('H3')
    expect(element.className).toContain('text-2xl')
    expect(element.className).toContain('font-bold')
  })

  it('applies default color', () => {
    render(<Heading level={1}>Default Color</Heading>)
    const element = screen.getByText('Default Color')
    expect(element.className).toContain('text-foreground')
  })

  it('applies muted color variant', () => {
    render(
      <Heading level={2} color="muted">
        Muted
      </Heading>
    )
    const element = screen.getByText('Muted')
    expect(element.className).toContain('text-foreground-muted')
  })

  it('applies tracking variant', () => {
    render(
      <Heading level={1} tracking="tight">
        Tight
      </Heading>
    )
    const element = screen.getByText('Tight')
    expect(element.className).toContain('tracking-tight')
  })

  it('merges custom className', () => {
    render(
      <Heading level={1} className="my-custom-class">
        Custom
      </Heading>
    )
    const element = screen.getByText('Custom')
    expect(element.className).toContain('my-custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLHeadingElement>()
    render(
      <Heading level={2} ref={ref}>
        Ref Test
      </Heading>
    )
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    expect(ref.current?.tagName).toBe('H2')
  })

  it('passes through HTML attributes', () => {
    render(
      <Heading level={2} id="section-heading" aria-label="Section">
        Section
      </Heading>
    )
    const element = screen.getByText('Section')
    expect(element.id).toBe('section-heading')
    expect(element.getAttribute('aria-label')).toBe('Section')
  })
})
