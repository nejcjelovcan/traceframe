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

  describe('responsive props', () => {
    it('applies responsive direction', () => {
      render(
        <Flex direction={{ default: 'col', md: 'row' }} data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      expect(flex.className).toContain('flex-col')
      expect(flex.className).toContain('md:flex-row')
    })

    it('applies responsive gap', () => {
      render(
        <Flex gap={{ default: 'sm', sm: 'md', lg: 'lg' }} data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      expect(flex.className).toContain('gap-sm')
      expect(flex.className).toContain('sm:gap-md')
      expect(flex.className).toContain('lg:gap-lg')
    })

    it('applies responsive align', () => {
      render(
        <Flex align={{ default: 'start', md: 'center', xl: 'end' }} data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      expect(flex.className).toContain('items-start')
      expect(flex.className).toContain('md:items-center')
      expect(flex.className).toContain('xl:items-end')
    })

    it('applies responsive justify', () => {
      render(
        <Flex justify={{ sm: 'center', lg: 'between' }} data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      // When no default is specified in responsive object, no base class is added
      expect(flex.className).not.toContain('justify-start')
      expect(flex.className).toContain('sm:justify-center')
      expect(flex.className).toContain('lg:justify-between')
    })

    it('applies responsive justify with default', () => {
      render(
        <Flex justify={{ default: 'start', sm: 'center', lg: 'between' }} data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      expect(flex.className).toContain('justify-start')
      expect(flex.className).toContain('sm:justify-center')
      expect(flex.className).toContain('lg:justify-between')
    })

    it('applies responsive wrap', () => {
      render(
        <Flex wrap={{ default: false, md: true }} data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      expect(flex.className).toContain('flex-nowrap')
      expect(flex.className).toContain('md:flex-wrap')
    })

    it('combines responsive and static props', () => {
      render(
        <Flex direction={{ default: 'col', lg: 'row' }} gap="md" align="center" data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      expect(flex.className).toContain('flex-col')
      expect(flex.className).toContain('lg:flex-row')
      expect(flex.className).toContain('gap-md')
      expect(flex.className).toContain('items-center')
    })

    it('handles all responsive props together', () => {
      render(
        <Flex
          direction={{ default: 'col', md: 'row' }}
          gap={{ default: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}
          align={{ default: 'start', lg: 'center' }}
          justify={{ default: 'start', md: 'between', xl: 'evenly' }}
          wrap={{ default: false, lg: true }}
          data-testid="flex"
        >
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')

      // Direction
      expect(flex.className).toContain('flex-col')
      expect(flex.className).toContain('md:flex-row')

      // Gap
      expect(flex.className).toContain('gap-xs')
      expect(flex.className).toContain('sm:gap-sm')
      expect(flex.className).toContain('md:gap-md')
      expect(flex.className).toContain('lg:gap-lg')
      expect(flex.className).toContain('xl:gap-xl')

      // Align
      expect(flex.className).toContain('items-start')
      expect(flex.className).toContain('lg:items-center')

      // Justify
      expect(flex.className).toContain('justify-start')
      expect(flex.className).toContain('md:justify-between')
      expect(flex.className).toContain('xl:justify-evenly')

      // Wrap
      expect(flex.className).toContain('flex-nowrap')
      expect(flex.className).toContain('lg:flex-wrap')
    })

    it('fallback to static props when not responsive', () => {
      render(
        <Flex direction="row" gap="lg" align="end" justify="around" wrap={true} data-testid="flex">
          Content
        </Flex>
      )
      const flex = screen.getByTestId('flex')
      expect(flex.className).toContain('flex-row')
      expect(flex.className).toContain('gap-lg')
      expect(flex.className).toContain('items-end')
      expect(flex.className).toContain('justify-around')
      expect(flex.className).toContain('flex-wrap')

      // Should not contain responsive classes
      expect(flex.className).not.toMatch(/sm:|md:|lg:|xl:/)
    })
  })
})
