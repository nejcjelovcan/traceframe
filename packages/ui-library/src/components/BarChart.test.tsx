import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { BarChart, type BarChartDataItem } from './BarChart'

const sampleData: BarChartDataItem[] = [
  { label: 'Button', value: 45 },
  { label: 'Card', value: 30 },
  { label: 'Badge', value: 20 },
]

describe('BarChart', () => {
  describe('rendering', () => {
    it('renders with default props (horizontal, default color scheme)', () => {
      render(<BarChart data={sampleData} />)

      expect(screen.getByRole('figure')).toBeDefined()
      // Labels appear in both visible chart and sr-only table
      expect(screen.getAllByText('Button')).toHaveLength(2)
      expect(screen.getAllByText('Card')).toHaveLength(2)
      expect(screen.getAllByText('Badge')).toHaveLength(2)
    })

    it('renders horizontal orientation correctly', () => {
      render(<BarChart data={sampleData} orientation="horizontal" />)

      const figure = screen.getByRole('figure')
      expect(figure.className).toContain('flex-col')
    })

    it('renders vertical orientation correctly', () => {
      render(<BarChart data={sampleData} orientation="vertical" />)

      const figure = screen.getByRole('figure')
      expect(figure.className).toContain('items-end')
      expect(figure.className).toContain('h-48')
    })

    it('shows "No data available" for empty data', () => {
      render(<BarChart data={[]} />)

      expect(screen.getByText('No data available')).toBeDefined()
    })

    it('limits bars with maxBars prop', () => {
      render(<BarChart data={sampleData} maxBars={2} />)

      // Button and Card appear in both visible chart and sr-only table
      expect(screen.getAllByText('Button')).toHaveLength(2)
      expect(screen.getAllByText('Card')).toHaveLength(2)
      // Badge should not appear at all (not in chart, not in table)
      expect(screen.queryByText('Badge')).toBeNull()
    })
  })

  describe('color schemes', () => {
    it('applies default colors (cycling through accent/data palette)', () => {
      render(<BarChart data={sampleData} colorScheme="default" />)

      const bars = screen.getAllByRole('button')
      expect(bars[0]!.className).toContain('bg-accent-1')
      expect(bars[1]!.className).toContain('bg-accent-2')
      expect(bars[2]!.className).toContain('bg-accent-3')
    })

    it('cycles default colors for more items', () => {
      const manyItems: BarChartDataItem[] = [
        { label: 'Item1', value: 10 },
        { label: 'Item2', value: 20 },
        { label: 'Item3', value: 30 },
        { label: 'Item4', value: 40 },
        { label: 'Item5', value: 50 },
        { label: 'Item6', value: 60 }, // Should cycle back to bg-accent-1
      ]
      render(<BarChart data={manyItems} colorScheme="default" />)

      const bars = screen.getAllByRole('button')
      // First 5 items: accent-1, accent-2, accent-3, accent-4, accent-5
      expect(bars[0]!.className).toContain('bg-accent-1')
      expect(bars[3]!.className).toContain('bg-accent-4')
      expect(bars[4]!.className).toContain('bg-accent-5')
      // 6th item cycles back to accent-1
      expect(bars[5]!.className).toContain('bg-accent-1')
    })

    it('applies semantic colors based on thresholds (low = bad)', () => {
      const thresholds = { warning: 30, error: 20 }
      render(<BarChart data={sampleData} colorScheme="semantic" thresholds={thresholds} />)

      const bars = screen.getAllByRole('button')
      // Button: 45 > 30 -> success
      expect(bars[0]!.className).toContain('bg-status-success')
      // Card: 30 <= 30 but > 20 -> warning
      expect(bars[1]!.className).toContain('bg-status-warning')
      // Badge: 20 <= 20 -> error
      expect(bars[2]!.className).toContain('bg-status-error')
    })
  })

  describe('tooltips', () => {
    it('shows tooltip on bar hover', async () => {
      const user = userEvent.setup()
      render(<BarChart data={sampleData} />)

      const bars = screen.getAllByRole('button')
      await user.hover(bars[0]!)

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeDefined()
      })
    })

    it('shows tooltip on bar focus (keyboard accessible)', async () => {
      const user = userEvent.setup()
      render(<BarChart data={sampleData} />)

      const bars = screen.getAllByRole('button')
      await user.tab()
      bars[0]!.focus()

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeDefined()
      })
    })

    it('formats tooltip content with formatValue prop', async () => {
      const user = userEvent.setup()
      const formatValue = (value: number) => `${value}%`
      render(<BarChart data={sampleData} formatValue={formatValue} />)

      const bars = screen.getAllByRole('button')
      await user.hover(bars[0]!)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip.textContent).toContain('45%')
      })
    })
  })

  describe('interaction', () => {
    it('calls onBarClick with correct item when bar is clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<BarChart data={sampleData} onBarClick={handleClick} />)

      const bars = screen.getAllByRole('button')
      await user.click(bars[0]!)

      expect(handleClick).toHaveBeenCalledWith(sampleData[0])
    })

    it('calls onBarClick when Enter key is pressed on focused bar', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<BarChart data={sampleData} onBarClick={handleClick} />)

      const bars = screen.getAllByRole('button')
      bars[0]!.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalledWith(sampleData[0])
    })

    it('shows hover style when onBarClick is provided', () => {
      render(<BarChart data={sampleData} onBarClick={() => {}} />)

      const bars = screen.getAllByRole('button')
      expect(bars[0]!.className).toContain('cursor-pointer')
    })

    it('shows default cursor when onBarClick is not provided', () => {
      render(<BarChart data={sampleData} />)

      const bars = screen.getAllByRole('button')
      expect(bars[0]!.className).toContain('cursor-default')
    })
  })

  describe('value display', () => {
    it('shows values when showValues is true', () => {
      render(<BarChart data={sampleData} showValues />)

      // Values appear both inline and in the sr-only table, so we check for multiple
      expect(screen.getAllByText('45')).toHaveLength(2)
      expect(screen.getAllByText('30')).toHaveLength(2)
      expect(screen.getAllByText('20')).toHaveLength(2)
    })

    it('formats displayed values with formatValue prop', () => {
      const formatValue = (value: number) => `${value} items`
      render(<BarChart data={sampleData} showValues formatValue={formatValue} />)

      // Values appear in both inline display and sr-only table
      expect(screen.getAllByText('45 items')).toHaveLength(2)
    })
  })

  describe('accessibility', () => {
    it('has role="figure" with aria-label', () => {
      render(<BarChart data={sampleData} ariaLabel="Component usage statistics" />)

      const figure = screen.getByRole('figure')
      expect(figure.getAttribute('aria-label')).toBe('Component usage statistics')
    })

    it('uses default aria-label when not provided', () => {
      render(<BarChart data={sampleData} />)

      const figure = screen.getByRole('figure')
      expect(figure.getAttribute('aria-label')).toBe('Bar chart')
    })

    it('has hidden data table for screen readers', () => {
      render(<BarChart data={sampleData} ariaLabel="Usage stats" />)

      const table = screen.getByRole('table', { hidden: true })
      expect(table).toBeDefined()
      expect(table.className).toContain('sr-only')

      // Check table structure
      const caption = within(table).getByText('Usage stats')
      expect(caption).toBeDefined()

      const rows = within(table).getAllByRole('row', { hidden: true })
      // Header row + 3 data rows
      expect(rows).toHaveLength(4)
    })

    it('bars have aria-label with label and value', () => {
      render(<BarChart data={sampleData} />)

      const bars = screen.getAllByRole('button')
      expect(bars[0]!.getAttribute('aria-label')).toBe('Button: 45')
    })

    it('bars are keyboard focusable', async () => {
      const user = userEvent.setup()
      render(<BarChart data={sampleData} />)

      await user.tab()

      const bars = screen.getAllByRole('button')
      expect(document.activeElement).toBe(bars[0])
    })
  })

  describe('edge cases', () => {
    it('handles zero values correctly', () => {
      const dataWithZero: BarChartDataItem[] = [
        { label: 'A', value: 100 },
        { label: 'B', value: 0 },
      ]
      render(<BarChart data={dataWithZero} />)

      const bars = screen.getAllByRole('button')
      // Zero value should have 0% width
      expect(bars[1]!.style.width).toBe('0%')
    })

    it('handles all zero values (maxValue = 0)', () => {
      const allZero: BarChartDataItem[] = [
        { label: 'A', value: 0 },
        { label: 'B', value: 0 },
      ]
      render(<BarChart data={allZero} />)

      const bars = screen.getAllByRole('button')
      expect(bars[0]!.style.width).toBe('0%')
      expect(bars[1]!.style.width).toBe('0%')
    })

    it('calculates maxValue correctly', () => {
      render(<BarChart data={sampleData} />)

      const bars = screen.getAllByRole('button')
      // Button has max value (45), should be 100%
      expect(bars[0]!.style.width).toBe('100%')
      // Card has 30/45 = 66.67%
      expect(parseFloat(bars[1]!.style.width)).toBeCloseTo(66.67, 0)
    })

    it('merges custom className', () => {
      render(<BarChart data={sampleData} className="custom-class" />)

      const figure = screen.getByRole('figure')
      expect(figure.className).toContain('custom-class')
    })
  })
})
