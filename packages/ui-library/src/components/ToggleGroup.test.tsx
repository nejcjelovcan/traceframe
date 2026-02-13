import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ToggleGroup, type ToggleGroupOption } from './ToggleGroup'

type FilterValue = 'all' | 'external' | 'local'

const filterOptions: readonly ToggleGroupOption<FilterValue>[] = [
  { value: 'all', label: 'All' },
  { value: 'external', label: 'External' },
  { value: 'local', label: 'Local' },
]

const filterOptionsWithIcons: readonly ToggleGroupOption<FilterValue>[] = [
  { value: 'all', label: 'All', icon: 'components' },
  { value: 'external', label: 'External', icon: 'external' },
  { value: 'local', label: 'Local', icon: 'internal' },
]

const optionsWithDisabled: readonly ToggleGroupOption<FilterValue>[] = [
  { value: 'all', label: 'All' },
  { value: 'external', label: 'External', disabled: true },
  { value: 'local', label: 'Local' },
]

describe('ToggleGroup', () => {
  describe('Single Selection', () => {
    it('renders all options as radio buttons', () => {
      render(
        <ToggleGroup options={filterOptions} value="all" onChange={() => {}} aria-label="Filter" />
      )
      expect(screen.getByRole('radio', { name: 'All' })).toBeDefined()
      expect(screen.getByRole('radio', { name: 'External' })).toBeDefined()
      expect(screen.getByRole('radio', { name: 'Local' })).toBeDefined()
    })

    it('selected option has active styling', () => {
      render(
        <ToggleGroup options={filterOptions} value="all" onChange={() => {}} aria-label="Filter" />
      )
      const selectedItem = screen.getByRole('radio', { name: 'All' })
      expect(selectedItem).toHaveAttribute('data-state', 'on')
    })

    it('unselected options have inactive styling', () => {
      render(
        <ToggleGroup options={filterOptions} value="all" onChange={() => {}} aria-label="Filter" />
      )
      const unselectedItem = screen.getByRole('radio', { name: 'External' })
      expect(unselectedItem).toHaveAttribute('data-state', 'off')
    })

    it('clicking option calls onChange with value', () => {
      const handleChange = vi.fn()
      render(
        <ToggleGroup
          options={filterOptions}
          value="all"
          onChange={handleChange}
          aria-label="Filter"
        />
      )
      fireEvent.click(screen.getByRole('radio', { name: 'External' }))
      expect(handleChange).toHaveBeenCalledWith('external')
    })

    it('allows deselection in single mode', () => {
      const handleChange = vi.fn()
      render(
        <ToggleGroup
          options={filterOptions}
          value="all"
          onChange={handleChange}
          aria-label="Filter"
        />
      )
      fireEvent.click(screen.getByRole('radio', { name: 'All' }))
      expect(handleChange).toHaveBeenCalledWith(undefined)
    })

    it('aria-checked reflects selection state', () => {
      render(
        <ToggleGroup options={filterOptions} value="all" onChange={() => {}} aria-label="Filter" />
      )
      expect(screen.getByRole('radio', { name: 'All' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('radio', { name: 'External' })).toHaveAttribute(
        'aria-checked',
        'false'
      )
      expect(screen.getByRole('radio', { name: 'Local' })).toHaveAttribute('aria-checked', 'false')
    })

    it('has role="group" and aria-label on container', () => {
      render(
        <ToggleGroup
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Filter options"
        />
      )
      const group = screen.getByRole('group', { name: 'Filter options' })
      expect(group).toBeDefined()
    })

    it('custom className is applied', () => {
      render(
        <ToggleGroup
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
          className="custom-class"
        />
      )
      const group = screen.getByRole('group')
      expect(group.className).toContain('custom-class')
    })
  })

  describe('Multiple Selection', () => {
    it('renders options with multiple selection enabled', () => {
      render(
        <ToggleGroup
          type="multiple"
          options={filterOptions}
          value={['all', 'external']}
          onChange={() => {}}
          aria-label="Multi-select"
        />
      )
      // In multiple mode, Radix still uses button role with aria-pressed
      expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'External' })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      expect(screen.getByRole('button', { name: 'Local' })).toHaveAttribute('aria-pressed', 'false')
    })

    it('clicking unselected option adds to selection in multi mode', () => {
      const handleChange = vi.fn()
      render(
        <ToggleGroup
          type="multiple"
          options={filterOptions}
          value={['all']}
          onChange={handleChange}
          aria-label="Multi-select"
        />
      )
      fireEvent.click(screen.getByRole('button', { name: 'External' }))
      expect(handleChange).toHaveBeenCalledWith(['all', 'external'])
    })

    it('clicking selected option removes from selection in multi mode', () => {
      const handleChange = vi.fn()
      render(
        <ToggleGroup
          type="multiple"
          options={filterOptions}
          value={['all', 'external']}
          onChange={handleChange}
          aria-label="Multi-select"
        />
      )
      fireEvent.click(screen.getByRole('button', { name: 'External' }))
      expect(handleChange).toHaveBeenCalledWith(['all'])
    })

    it('allows empty selection in multi mode', () => {
      const handleChange = vi.fn()
      render(
        <ToggleGroup
          type="multiple"
          options={filterOptions}
          value={['all']}
          onChange={handleChange}
          aria-label="Multi-select"
        />
      )
      fireEvent.click(screen.getByRole('button', { name: 'All' }))
      expect(handleChange).toHaveBeenCalledWith([])
    })
  })

  describe('Appearance Variants', () => {
    it('applies default variant styles', () => {
      render(
        <ToggleGroup
          variant="default"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Default variant"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item.className).toContain('border')
    })

    it('applies solid variant styles', () => {
      render(
        <ToggleGroup
          variant="solid"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Solid variant"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item.className).toContain('bg-surface-muted')
    })

    it('applies ghost variant styles', () => {
      render(
        <ToggleGroup
          variant="ghost"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Ghost variant"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item.className).toContain('bg-transparent')
    })

    it('applies tabs variant styles', () => {
      render(
        <ToggleGroup
          variant="tabs"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Tabs variant"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item.className).toContain('border-b-2')
    })
  })

  describe('Size Variants', () => {
    it('applies small size styles', () => {
      render(
        <ToggleGroup
          size="sm"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Small"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item.className).toContain('h-size-sm')
      expect(item.className).toContain('text-xs')
    })

    it('applies medium size styles', () => {
      render(
        <ToggleGroup
          size="md"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Medium"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item.className).toContain('h-size-md')
      expect(item.className).toContain('text-sm')
    })

    it('applies large size styles', () => {
      render(
        <ToggleGroup
          size="lg"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Large"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item.className).toContain('h-size-lg')
      expect(item.className).toContain('text-base')
    })
  })

  describe('Orientation', () => {
    it('applies horizontal orientation styles', () => {
      render(
        <ToggleGroup
          orientation="horizontal"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Horizontal"
        />
      )
      const group = screen.getByRole('group')
      expect(group.className).toContain('flex-row')
    })

    it('applies vertical orientation styles', () => {
      render(
        <ToggleGroup
          orientation="vertical"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Vertical"
        />
      )
      const group = screen.getByRole('group')
      expect(group.className).toContain('flex-col')
    })

    it('items in vertical orientation have full width', () => {
      render(
        <ToggleGroup
          orientation="vertical"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Vertical"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item.className).toContain('w-full')
    })
  })

  describe('Indicators', () => {
    it('applies underline indicator styles', () => {
      render(
        <ToggleGroup
          indicator="underline"
          variant="ghost"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Underline"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item.className).toContain('shadow-')
    })

    it('applies dot indicator styles', () => {
      render(
        <ToggleGroup
          indicator="dot"
          variant="ghost"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Dot"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item.className).toContain('after:')
    })
  })

  describe('Icon Support', () => {
    it('renders icons when option has icon property', () => {
      render(
        <ToggleGroup
          options={filterOptionsWithIcons}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
        />
      )
      const icons = screen.getAllByTestId('icon')
      expect(icons).toHaveLength(3)
    })

    it('renders icon alongside label in text mode', () => {
      render(
        <ToggleGroup
          options={filterOptionsWithIcons}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
          displayMode="text"
        />
      )
      expect(screen.getByText('All')).toBeDefined()
      expect(screen.getByText('External')).toBeDefined()
      expect(screen.getByText('Local')).toBeDefined()
      expect(screen.getAllByTestId('icon')).toHaveLength(3)
    })

    it('renders only icons in icon mode with sr-only labels', () => {
      render(
        <ToggleGroup
          options={filterOptionsWithIcons}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
          displayMode="icon"
        />
      )
      const allLabel = screen.getByText('All')
      expect(allLabel.className).toContain('sr-only')
    })

    it('adds title attribute in icon mode for tooltip', () => {
      render(
        <ToggleGroup
          options={filterOptionsWithIcons}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
          displayMode="icon"
        />
      )
      const item = screen.getByRole('radio', { name: 'All' })
      expect(item).toHaveAttribute('title', 'All')
    })

    it('icon sizes scale with toggle group size', () => {
      const { rerender } = render(
        <ToggleGroup
          options={filterOptionsWithIcons}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
          size="sm"
        />
      )
      expect(screen.getAllByTestId('icon')[0]).toHaveAttribute('width', '12')

      rerender(
        <ToggleGroup
          options={filterOptionsWithIcons}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
          size="lg"
        />
      )
      expect(screen.getAllByTestId('icon')[0]).toHaveAttribute('width', '20')
    })
  })

  describe('Disabled State', () => {
    it('disables entire group when disabled prop is true', () => {
      render(
        <ToggleGroup
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
          disabled
        />
      )
      const items = screen.getAllByRole('radio')
      items.forEach((item) => {
        expect(item).toBeDisabled()
      })
    })

    it('disables individual options when option disabled is true', () => {
      render(
        <ToggleGroup
          options={optionsWithDisabled}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
        />
      )
      expect(screen.getByRole('radio', { name: 'All' })).not.toBeDisabled()
      expect(screen.getByRole('radio', { name: 'External' })).toBeDisabled()
      expect(screen.getByRole('radio', { name: 'Local' })).not.toBeDisabled()
    })

    it('does not call onChange for disabled options', () => {
      const handleChange = vi.fn()
      render(
        <ToggleGroup
          options={optionsWithDisabled}
          value="all"
          onChange={handleChange}
          aria-label="Filter"
        />
      )
      fireEvent.click(screen.getByRole('radio', { name: 'External' }))
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Attached Styles', () => {
    it('default and solid variants have attached styles in horizontal', () => {
      render(
        <ToggleGroup
          variant="default"
          orientation="horizontal"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
        />
      )
      const middleItem = screen.getByRole('radio', { name: 'External' })
      expect(middleItem.className).toContain('-ml-px')
    })

    it('default and solid variants have attached styles in vertical', () => {
      render(
        <ToggleGroup
          variant="default"
          orientation="vertical"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
        />
      )
      const middleItem = screen.getByRole('radio', { name: 'External' })
      expect(middleItem.className).toContain('-mt-px')
    })

    it('ghost variant has spacing between items', () => {
      render(
        <ToggleGroup
          variant="ghost"
          options={filterOptions}
          value="all"
          onChange={() => {}}
          aria-label="Filter"
        />
      )
      const group = screen.getByRole('group')
      expect(group.className).toContain('gap-xs')
    })
  })

  describe('Edge Cases', () => {
    it('works with two options', () => {
      const twoOptions: readonly ToggleGroupOption<'yes' | 'no'>[] = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ]
      render(
        <ToggleGroup options={twoOptions} value="yes" onChange={() => {}} aria-label="Answer" />
      )
      expect(screen.getByRole('radio', { name: 'Yes' })).toBeDefined()
      expect(screen.getByRole('radio', { name: 'No' })).toBeDefined()
    })

    it('works with many options', () => {
      const manyOptions: readonly ToggleGroupOption<string>[] = [
        { value: '1', label: 'One' },
        { value: '2', label: 'Two' },
        { value: '3', label: 'Three' },
        { value: '4', label: 'Four' },
        { value: '5', label: 'Five' },
      ]
      render(
        <ToggleGroup options={manyOptions} value="1" onChange={() => {}} aria-label="Numbers" />
      )
      expect(screen.getAllByRole('radio')).toHaveLength(5)
    })

    it('requires a value in single mode', () => {
      render(
        <ToggleGroup options={filterOptions} value="all" onChange={() => {}} aria-label="Filter" />
      )
      const items = screen.getAllByRole('radio')
      expect(items[0]).toHaveAttribute('aria-checked', 'true')
      expect(items[1]).toHaveAttribute('aria-checked', 'false')
      expect(items[2]).toHaveAttribute('aria-checked', 'false')
    })

    it('handles empty array in multiple mode', () => {
      render(
        <ToggleGroup
          type="multiple"
          options={filterOptions}
          value={[]}
          onChange={() => {}}
          aria-label="Multi-select"
        />
      )
      // In multiple mode, Radix uses button role with aria-pressed
      const items = screen.getAllByRole('button')
      items.forEach((item) => {
        expect(item).toHaveAttribute('aria-pressed', 'false')
      })
    })
  })
})
