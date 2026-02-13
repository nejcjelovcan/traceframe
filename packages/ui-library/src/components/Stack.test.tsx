import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Stack } from './Stack'

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack>
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    )
    expect(screen.getByText('Child 1')).toBeDefined()
    expect(screen.getByText('Child 2')).toBeDefined()
  })

  it('applies default direction classes (vertical)', () => {
    render(<Stack data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    expect(stack.className).toContain('flex')
    expect(stack.className).toContain('flex-col')
  })

  it('applies horizontal direction classes', () => {
    render(
      <Stack direction="horizontal" data-testid="stack">
        Content
      </Stack>
    )
    const stack = screen.getByTestId('stack')
    expect(stack.className).toContain('flex-row')
  })

  it('applies default gap classes (gap-sm)', () => {
    render(<Stack data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    expect(stack.className).toContain('gap-sm')
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
        <Stack gap={gap} data-testid="stack">
          Content
        </Stack>
      )
      const stack = screen.getByTestId('stack')
      expect(stack.className).toContain(classMap[gap])
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
        <Stack align={align} data-testid="stack">
          Content
        </Stack>
      )
      const stack = screen.getByTestId('stack')
      expect(stack.className).toContain(classMap[align])
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
        <Stack justify={justify} data-testid="stack">
          Content
        </Stack>
      )
      const stack = screen.getByTestId('stack')
      expect(stack.className).toContain(classMap[justify])
      unmount()
    })
  })

  it('applies wrap when enabled', () => {
    render(
      <Stack wrap data-testid="stack">
        Content
      </Stack>
    )
    const stack = screen.getByTestId('stack')
    expect(stack.className).toContain('flex-wrap')
  })

  it('does not apply flex-wrap by default', () => {
    render(<Stack data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    expect(stack.className).not.toContain('flex-wrap')
  })

  it('passes through native div props', () => {
    render(<Stack data-testid="test-stack">Test</Stack>)
    expect(screen.getByTestId('test-stack')).toBeDefined()
  })

  it('merges custom className', () => {
    render(
      <Stack className="custom-class" data-testid="stack">
        Custom
      </Stack>
    )
    const stack = screen.getByTestId('stack')
    expect(stack.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Stack ref={ref}>Ref</Stack>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies default alignment (stretch)', () => {
    render(<Stack data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    expect(stack.className).toContain('items-stretch')
  })

  it('applies default justify (start)', () => {
    render(<Stack data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    expect(stack.className).toContain('justify-start')
  })

  it('combines multiple variants correctly', () => {
    render(
      <Stack
        direction="horizontal"
        gap="md"
        align="center"
        justify="between"
        wrap
        data-testid="stack"
      >
        Content
      </Stack>
    )
    const stack = screen.getByTestId('stack')
    expect(stack.className).toContain('flex')
    expect(stack.className).toContain('flex-row')
    expect(stack.className).toContain('gap-md')
    expect(stack.className).toContain('items-center')
    expect(stack.className).toContain('justify-between')
    expect(stack.className).toContain('flex-wrap')
  })
})
