import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Flex } from './Flex'

describe('Flex', () => {
  it('renders children', () => {
    render(
      <Flex>
        <div>Child 1</div>
        <div>Child 2</div>
      </Flex>
    )
    expect(screen.getByText('Child 1')).toBeDefined()
    expect(screen.getByText('Child 2')).toBeDefined()
  })

  it('applies default direction classes (col)', () => {
    render(<Flex data-testid="flex">Content</Flex>)
    const flex = screen.getByTestId('flex')
    expect(flex.className).toContain('flex')
    expect(flex.className).toContain('flex-col')
  })

  it('applies row direction classes', () => {
    render(
      <Flex direction="row" data-testid="flex">
        Content
      </Flex>
    )
    const flex = screen.getByTestId('flex')
    expect(flex.className).toContain('flex-row')
  })

  it('applies default gap classes (gap-sm)', () => {
    render(<Flex data-testid="flex">Content</Flex>)
    const flex = screen.getByTestId('flex')
    expect(flex.className).toContain('gap-sm')
  })

  it('applies various gap sizes correctly', () => {
    const gaps = ['none', '2xs', 'xs', 'sm', 'md', 'base', 'lg', 'xl', '2xl'] as const
    const classMap = {
      none: 'gap-0',
      '2xs': 'gap-2xs',
      xs: 'gap-xs',
      sm: 'gap-sm',
      md: 'gap-md',
      base: 'gap-base',
      lg: 'gap-lg',
      xl: 'gap-xl',
      '2xl': 'gap-2xl',
    }
    gaps.forEach((gap) => {
      const { unmount } = render(
        <Flex gap={gap} data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      expect(flex.className).toContain(classMap[gap])
      unmount()
    })
  })

  it('applies alignment variants correctly', () => {
    const alignments = ['start', 'center', 'end', 'stretch', 'baseline'] as const
    const classMap = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    }
    alignments.forEach((align) => {
      const { unmount } = render(
        <Flex align={align} data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      expect(flex.className).toContain(classMap[align])
      unmount()
    })
  })

  it('applies justify variants correctly', () => {
    const justifyOptions = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const
    const classMap = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    }
    justifyOptions.forEach((justify) => {
      const { unmount } = render(
        <Flex justify={justify} data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      expect(flex.className).toContain(classMap[justify])
      unmount()
    })
  })

  it('applies wrap when enabled', () => {
    render(
      <Flex wrap data-testid="flex">
        Content
      </Flex>
    )
    const flex = screen.getByTestId('flex')
    expect(flex.className).toContain('flex-wrap')
  })

  it('does not apply flex-wrap by default', () => {
    render(<Flex data-testid="flex">Content</Flex>)
    const flex = screen.getByTestId('flex')
    expect(flex.className).not.toContain('flex-wrap')
  })

  it('passes through native div props', () => {
    render(<Flex data-testid="test-flex">Test</Flex>)
    expect(screen.getByTestId('test-flex')).toBeDefined()
  })

  it('merges custom className', () => {
    render(
      <Flex className="custom-class" data-testid="flex">
        Custom
      </Flex>
    )
    const flex = screen.getByTestId('flex')
    expect(flex.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Flex ref={ref}>Ref</Flex>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies default alignment (stretch)', () => {
    render(<Flex data-testid="flex">Content</Flex>)
    const flex = screen.getByTestId('flex')
    expect(flex.className).toContain('items-stretch')
  })

  it('applies default justify (start)', () => {
    render(<Flex data-testid="flex">Content</Flex>)
    const flex = screen.getByTestId('flex')
    expect(flex.className).toContain('justify-start')
  })

  it('combines multiple variants correctly', () => {
    render(
      <Flex direction="row" gap="md" align="center" justify="between" wrap data-testid="flex">
        Content
      </Flex>
    )
    const flex = screen.getByTestId('flex')
    expect(flex.className).toContain('flex')
    expect(flex.className).toContain('flex-row')
    expect(flex.className).toContain('gap-md')
    expect(flex.className).toContain('items-center')
    expect(flex.className).toContain('justify-between')
    expect(flex.className).toContain('flex-wrap')
  })
})
