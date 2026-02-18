import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Grid } from './Grid'

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )
    expect(screen.getByText('Item 1')).toBeDefined()
    expect(screen.getByText('Item 2')).toBeDefined()
  })

  it('applies default classes (grid, gap-base)', () => {
    render(<Grid data-testid="grid">Content</Grid>)
    const grid = screen.getByTestId('grid')
    expect(grid.className).toContain('grid')
    expect(grid.className).toContain('gap-base')
  })

  it('applies default column count (grid-cols-1)', () => {
    render(<Grid data-testid="grid">Content</Grid>)
    const grid = screen.getByTestId('grid')
    expect(grid.className).toContain('grid-cols-1')
  })

  describe('fixed column counts', () => {
    it('applies 1 column', () => {
      render(
        <Grid cols={1} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('grid-cols-1')
    })

    it('applies 2 columns', () => {
      render(
        <Grid cols={2} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('grid-cols-2')
    })

    it('applies 3 columns', () => {
      render(
        <Grid cols={3} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('grid-cols-3')
    })

    it('applies 4 columns', () => {
      render(
        <Grid cols={4} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('grid-cols-4')
    })

    it('applies 5 columns', () => {
      render(
        <Grid cols={5} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('grid-cols-5')
    })

    it('applies 6 columns', () => {
      render(
        <Grid cols={6} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('grid-cols-6')
    })
  })

  describe('responsive column counts', () => {
    it('applies responsive column object with default breakpoint', () => {
      render(
        <Grid cols={{ default: 1, sm: 2, md: 3, lg: 4, xl: 5 }} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('grid-cols-1')
      expect(grid.className).toContain('sm:grid-cols-2')
      expect(grid.className).toContain('md:grid-cols-3')
      expect(grid.className).toContain('lg:grid-cols-4')
      expect(grid.className).toContain('xl:grid-cols-5')
    })

    it('applies responsive column object without default breakpoint', () => {
      render(
        <Grid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('grid-cols-1') // Falls back to default
      expect(grid.className).toContain('sm:grid-cols-1')
      expect(grid.className).toContain('md:grid-cols-2')
      expect(grid.className).toContain('lg:grid-cols-3')
      expect(grid.className).toContain('xl:grid-cols-4')
    })

    it('handles partial responsive object (only md and lg)', () => {
      render(
        <Grid cols={{ md: 2, lg: 4 }} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('grid-cols-1')
      expect(grid.className).toContain('md:grid-cols-2')
      expect(grid.className).toContain('lg:grid-cols-4')
      expect(grid.className).not.toContain('sm:grid-cols')
      expect(grid.className).not.toContain('xl:grid-cols')
    })

    it('handles responsive object with only sm', () => {
      render(
        <Grid cols={{ sm: 2 }} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('grid-cols-1')
      expect(grid.className).toContain('sm:grid-cols-2')
    })
  })

  describe('gap variants', () => {
    it('applies gap-0 (none)', () => {
      render(
        <Grid gap="none" data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('gap-0')
    })

    it('applies gap-2xs', () => {
      render(
        <Grid gap="2xs" data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('gap-2xs')
    })

    it('applies gap-xs', () => {
      render(
        <Grid gap="xs" data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('gap-xs')
    })

    it('applies gap-sm', () => {
      render(
        <Grid gap="sm" data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('gap-sm')
    })

    it('applies gap-md', () => {
      render(
        <Grid gap="md" data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('gap-md')
    })

    it('applies gap-lg', () => {
      render(
        <Grid gap="lg" data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('gap-lg')
    })

    it('applies gap-xl', () => {
      render(
        <Grid gap="xl" data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('gap-xl')
    })

    it('applies gap-2xl', () => {
      render(
        <Grid gap="2xl" data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.className).toContain('gap-2xl')
    })
  })

  describe('rows prop', () => {
    it('applies rows when specified', () => {
      render(
        <Grid rows={3} data-testid="grid">
          Content
        </Grid>
      )
      const grid = screen.getByTestId('grid')
      expect(grid.style.gridTemplateRows).toBe('repeat(3, minmax(0, 1fr))')
    })

    it('does not apply rows style when not specified', () => {
      render(<Grid data-testid="grid">Content</Grid>)
      const grid = screen.getByTestId('grid')
      expect(grid.style.gridTemplateRows).toBe('')
    })
  })

  it('passes through native div props', () => {
    render(
      <Grid data-testid="test-grid" aria-label="Grid layout">
        Content
      </Grid>
    )
    expect(screen.getByTestId('test-grid')).toBeDefined()
    expect(screen.getByLabelText('Grid layout')).toBeDefined()
  })

  it('merges custom className', () => {
    render(
      <Grid className="custom-class" data-testid="grid">
        Content
      </Grid>
    )
    const grid = screen.getByTestId('grid')
    expect(grid.className).toContain('custom-class')
    expect(grid.className).toContain('grid')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Grid ref={ref}>Content</Grid>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('merges custom style with rows style', () => {
    render(
      <Grid rows={2} style={{ backgroundColor: 'red' }} data-testid="grid">
        Content
      </Grid>
    )
    const grid = screen.getByTestId('grid')
    expect(grid.style.gridTemplateRows).toBe('repeat(2, minmax(0, 1fr))')
    expect(grid.style.backgroundColor).toBe('red')
  })
})
